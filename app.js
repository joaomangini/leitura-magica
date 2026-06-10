/* Lógica do app: biblioteca, leitor, microfone e relatório. */
(function () {
  "use strict";

  // ---------- Estado ----------
  var state = {
    story: null,
    pageIndex: 0,
    expectedWords: [],     // palavras da página atual (forma original)
    reader: null,          // Speech.Reader
    listening: false,
    startTime: 0,
    threshold: 0.75,
    lastResult: null       // resultado do Alignment.align
  };

  // ---------- Atalhos de DOM ----------
  var $ = function (id) { return document.getElementById(id); };
  var views = { library: $("view-library"), reader: $("view-reader") };

  // Linha de diagnóstico visível na tela (ajuda a descobrir problemas de microfone).
  function dbg(msg) {
    var el = $("debug");
    if (!el) return;
    var t = new Date().toLocaleTimeString();
    el.textContent = (el.textContent + "\n" + t + "  " + msg).trim().split("\n").slice(-8).join("\n");
    console.log("[Leitura]", msg);
  }

  // ---------- Navegação entre telas ----------
  function show(name) {
    Object.keys(views).forEach(function (k) {
      views[k].classList.toggle("active", k === name);
    });
    $("btn-home").hidden = name === "library";
  }

  // ---------- Biblioteca ----------
  function renderLibrary() {
    var container = $("story-list");
    container.innerHTML = "";
    var levels = window.LEVELS || [{ n: 2, emoji: "📖", name: "Histórias", hint: "" }];

    levels.forEach(function (lv) {
      var stories = window.STORIES.filter(function (s) { return (s.level || 2) === lv.n; });
      if (!stories.length) return;

      var header = document.createElement("div");
      header.className = "level-header level-" + lv.n;
      header.innerHTML =
        '<span class="level-emoji">' + lv.emoji + "</span>" +
        '<span class="level-name">Nível ' + lv.n + " — " + lv.name + "</span>" +
        '<span class="level-hint">' + lv.hint + "</span>";
      container.appendChild(header);

      var grid = document.createElement("div");
      grid.className = "story-grid";
      stories.forEach(function (story) {
        var card = document.createElement("button");
        card.className = "story-card level-" + (story.level || 2);
        card.innerHTML =
          '<span class="story-emoji">' + story.emoji + "</span>" +
          '<div class="story-name">' + story.title + "</div>" +
          '<div class="story-meta">' + story.pages.length + " páginas</div>";
        card.addEventListener("click", function () { openStory(story); });
        grid.appendChild(card);
      });
      container.appendChild(grid);
    });
  }

  function openStory(story) {
    state.story = story;
    state.pageIndex = 0;
    show("reader");
    loadPage();
  }

  // ---------- Leitor / Página ----------
  function loadPage() {
    stopListening();
    var story = state.story;
    $("story-title").textContent = story.title;
    state.expectedWords = window.Alignment.tokenize(story.pages[state.pageIndex]);
    state.lastResult = null;
    $("page-indicator").textContent = (state.pageIndex + 1) + " / " + story.pages.length;
    $("btn-prev").disabled = state.pageIndex === 0;
    $("btn-next").disabled = state.pageIndex === story.pages.length - 1;
    $("report").hidden = true;
    $("live-transcript").textContent = "";
    $("mic-status").textContent = "";
    renderWords();
  }

  // Desenha as palavras da página com suas cores de status.
  // currentIndex (opcional): palavra que a criança deve ler agora (efeito karaokê).
  function renderWords(statuses, currentIndex) {
    var container = $("page-text");
    container.innerHTML = "";
    state.expectedWords.forEach(function (word, i) {
      var span = document.createElement("span");
      var st = statuses && statuses[i] ? statuses[i].status : "pending";
      span.className = "w " + st + (i === currentIndex ? " current" : "");
      span.textContent = word;
      container.appendChild(span);
      container.appendChild(document.createTextNode(" "));
    });
  }

  // ---------- Microfone / Leitura ----------
  function toggleMic() {
    if (state.listening) stopListening();
    else startListening();
  }

  function startListening() {
    if (!window.Speech.supported()) {
      $("unsupported").hidden = false;
      return;
    }
    state.threshold = parseFloat($("rigor-select").value);
    dbg("clicou em começar; iniciando reconhecimento...");
    state.reader = new window.Speech.Reader({ lang: "pt-BR" });
    state.reader.onresult = function (full, interim) { dbg("OUVIU: \"" + (interim || full) + "\""); onSpeech(full, interim); };
    state.reader.onerror = function (code) { dbg("ERRO: " + code); onSpeechError(code); };
    state.reader.onend = onSpeechEnd;
    state.reader.onstart = function () { dbg("microfone LIGADO"); $("mic-status").textContent = "✅ Microfone ligado. Pode ler! 👂"; };
    state.reader.onvoice = function () { dbg("detectou VOZ"); $("mic-status").textContent = "🗣️ Ouvindo sua voz..."; };
    state.reader.start();

    state.listening = true;
    state.startTime = Date.now();
    $("report").hidden = true;
    var mic = $("btn-mic");
    mic.classList.add("listening");
    mic.querySelector(".mic-label").textContent = "Parar";
    $("mic-status").textContent = "Pode ler! Estou ouvindo... 👂";
    renderWords(null, 0); // já indica a primeira palavra a ler
  }

  function stopListening() {
    if (state.reader) state.reader.stop();
    if (!state.listening) return;
    state.listening = false;
    var mic = $("btn-mic");
    mic.classList.remove("listening");
    mic.querySelector(".mic-label").textContent = "Começar a ler";
    $("mic-status").textContent = "";
    if (state.lastResult) renderWords(state.lastResult.statuses); // remove o destaque atual
  }

  // A cada trecho reconhecido: realinha e recolore ao vivo.
  function onSpeech(full, interim) {
    $("live-transcript").textContent = interim || full;
    var spoken = window.Alignment.tokenize(full);
    state.lastResult = window.Alignment.align(state.expectedWords, spoken, state.threshold);
    // próxima palavra a ler = logo após a última alcançada (se ainda houver).
    var nextIndex = state.lastResult.reachedIndex + 1;
    if (nextIndex >= state.expectedWords.length) nextIndex = -1;
    renderWords(state.lastResult.statuses, nextIndex);
  }

  function onSpeechError(code) {
    console.log("[Leitura] erro de voz:", code);
    var msg = "", stop = true;
    if (code === "not-allowed" || code === "service-not-allowed") {
      msg = "🚫 Microfone bloqueado. Clique no cadeado da barra de endereço e permita o microfone.";
    } else if (code === "no-speech") {
      msg = "Não ouvi nada ainda... fale mais perto e mais alto! 🗣️";
      stop = false; // segue ouvindo (o reconhecimento reinicia sozinho)
    } else if (code === "audio-capture") {
      msg = "🎤 Nenhum microfone encontrado. Verifique se há microfone conectado.";
    } else if (code === "network") {
      msg = "🌐 Sem internet. O reconhecimento do Chrome precisa de conexão.";
    } else if (code === "unsupported") {
      $("unsupported").hidden = false;
    } else if (code !== "aborted") {
      msg = "Ops, algo deu errado (" + code + "). Tente de novo.";
    }
    // Para PRIMEIRO (stopListening limpa o status) e só depois fixa a mensagem,
    // senão a explicação do erro seria apagada.
    if (stop) stopListening();
    if (msg) $("mic-status").textContent = msg;
  }

  // Ao encerrar de vez: monta o relatório.
  function onSpeechEnd() {
    showReport();
  }

  // ---------- Relatório ----------
  function showReport() {
    var res = state.lastResult;
    if (!res || res.stats.evaluated === 0) return;

    var s = res.stats;
    var pct = Math.round(s.accuracy * 100);
    var seconds = Math.max(1, (Date.now() - state.startTime) / 1000);
    var wpm = Math.round((s.correct / seconds) * 60);

    $("score-accuracy").textContent = pct + "%";
    $("score-words").textContent = s.correct;
    $("score-wpm").textContent = wpm;

    // Estrelas conforme a precisão.
    var starCount = pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 40 ? 1 : 0;
    $("stars").textContent = "⭐".repeat(starCount) + "☆".repeat(3 - starCount);

    // Palavras para treinar (erradas ou puladas).
    var practice = $("practice");
    practice.innerHTML = "";
    var toPractice = res.statuses.filter(function (st) {
      return st && (st.status === "wrong" || st.status === "missed");
    });
    if (toPractice.length) {
      var h = document.createElement("h4");
      h.textContent = "Palavras para treinar (toque para ouvir):";
      practice.appendChild(h);
      toPractice.forEach(function (st) {
        var b = document.createElement("button");
        b.className = "practice-word";
        b.innerHTML = "🔊 " + st.word;
        b.addEventListener("click", function () {
          window.Speech.speak(st.word, { rate: 0.7 });
        });
        practice.appendChild(b);
      });
    } else {
      var p = document.createElement("p");
      p.textContent = "Você leu todas as palavras certinho! 🎉";
      practice.appendChild(p);
    }

    var msgs = pct >= 90
      ? "Incrível! Você é um leitor campeão! 🏆"
      : pct >= 70
      ? "Muito bem! Continue praticando! 💪"
      : "Boa tentativa! Vamos ler de novo, devagar. 🐢";
    $("encouragement").textContent = msgs;

    $("report").hidden = false;
  }

  // ---------- Texto personalizado ----------
  function openCustomText() {
    var text = $("custom-text").value.trim();
    if (!text) return;
    // Quebra em "páginas" por frase, para não ficar uma parede de texto.
    var sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
    var pages = [];
    var buf = "";
    sentences.forEach(function (sen) {
      buf = buf ? buf + " " + sen : sen;
      if (buf.split(/\s+/).length >= 12) { pages.push(buf); buf = ""; }
    });
    if (buf) pages.push(buf);
    if (!pages.length) pages = [text];

    openStory({ id: "custom", emoji: "📝", title: "Meu texto", pages: pages });
  }

  // ---------- Eventos ----------
  function bind() {
    $("btn-home").addEventListener("click", function () { stopListening(); show("library"); });
    $("btn-prev").addEventListener("click", function () {
      if (state.pageIndex > 0) { state.pageIndex--; loadPage(); }
    });
    $("btn-next").addEventListener("click", function () {
      if (state.pageIndex < state.story.pages.length - 1) { state.pageIndex++; loadPage(); }
    });
    $("btn-mic").addEventListener("click", toggleMic);
    $("btn-custom").addEventListener("click", openCustomText);
    $("rigor-select").addEventListener("change", function () {
      state.threshold = parseFloat(this.value);
    });
  }

  // ---------- Início ----------
  function init() {
    if (!window.Speech.supported()) $("unsupported").hidden = false;
    if (location.search.indexOf("debug") >= 0) $("debug").style.display = "block"; // ?debug=1
    renderLibrary();
    bind();

    // Registra o service worker (só funciona quando servido por http/https).
    if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
