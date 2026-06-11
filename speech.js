/* Camada de reconhecimento de voz (Web Speech API) e síntese de voz.
   Reconhecimento: navegador converte a fala da criança em texto (gratuito, embutido).
   Síntese: o app fala a pronúncia correta de uma palavra. */
window.Speech = (function () {
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;

  function supported() {
    return !!SR;
  }

  function Reader(opts) {
    opts = opts || {};
    this.lang = opts.lang || "pt-BR";
    this.onresult = null; // (textoCompleto, parcial, textoFinal)
    this.onend = null;    // (textoFinal)
    this.onerror = null;  // (codigoErro)
    this.onstart = null;  // microfone ligou
    this.onvoice = null;  // detectou voz
    this.recog = null;
    this.running = false;
    this.finalText = "";
  }

  Reader.prototype.start = function () {
    if (!SR) {
      if (this.onerror) this.onerror("unsupported");
      return;
    }
    var self = this;
    var r = new SR();
    this.recog = r;
    this.finalText = "";
    r.lang = this.lang;
    r.continuous = true;
    r.interimResults = true;
    r.maxAlternatives = 1;

    r.onresult = function (e) {
      var interim = "";
      var finalChunk = "";
      for (var k = e.resultIndex; k < e.results.length; k++) {
        var res = e.results[k];
        if (res.isFinal) finalChunk += res[0].transcript + " ";
        else interim += res[0].transcript + " ";
      }
      if (finalChunk) self.finalText += finalChunk;
      var full = (self.finalText + " " + interim).trim();
      if (self.onresult) self.onresult(full, interim.trim(), self.finalText.trim());
    };

    r.onstart = function () { if (self.onstart) self.onstart(); };
    r.onspeechstart = function () { if (self.onvoice) self.onvoice(); };

    r.onerror = function (e) {
      if (self.onerror) self.onerror((e && e.error) || "error");
    };

    // O Chrome encerra após silêncio; se ainda estamos lendo, reiniciamos para leitura contínua.
    r.onend = function () {
      if (self.running) {
        try { r.start(); } catch (_) { /* já iniciado */ }
      } else if (self.onend) {
        self.onend(self.finalText.trim());
      }
    };

    this.running = true;
    try { r.start(); } catch (_) { /* ignora start duplicado */ }
  };

  Reader.prototype.stop = function () {
    this.running = false;
    if (this.recog) {
      try { this.recog.stop(); } catch (_) {}
    }
  };

  // Escolhe uma voz em português (pt-BR de preferência), quando o navegador oferece.
  var ptVoice = null;
  function pickVoice() {
    if (!("speechSynthesis" in window)) return;
    var voices = window.speechSynthesis.getVoices() || [];
    var pt = voices.filter(function (v) { return /^pt/i.test(v.lang); });
    ptVoice = pt.filter(function (v) { return /br/i.test(v.lang); })[0] || pt[0] || null;
  }
  if ("speechSynthesis" in window) {
    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice; // as vozes chegam depois em alguns navegadores
  }

  function speak(text, opts) {
    opts = opts || {};
    if (!("speechSynthesis" in window)) return;
    var u = new SpeechSynthesisUtterance(text);
    u.lang = opts.lang || "pt-BR";
    u.rate = opts.rate || 0.85; // um pouco devagar, para a criança acompanhar
    if (ptVoice) u.voice = ptVoice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }

  /* Lê um texto inteiro (uma página) avisando a posição da palavra falada.
     onword(charIndex) chega quando o navegador emite eventos de fronteira de palavra
     (nem todo aparelho emite — nesse caso o texto é lido sem destaque).
     onend() chega quando termina ou é cancelado. */
  function speakPage(text, opts) {
    opts = opts || {};
    if (!("speechSynthesis" in window)) {
      if (opts.onend) opts.onend();
      return;
    }
    var u = new SpeechSynthesisUtterance(text);
    u.lang = opts.lang || "pt-BR";
    u.rate = opts.rate || 0.8;
    if (ptVoice) u.voice = ptVoice;
    u.onboundary = function (e) {
      if (opts.onword && typeof e.charIndex === "number") opts.onword(e.charIndex);
    };
    u.onend = function () { if (opts.onend) opts.onend(); };
    u.onerror = function () { if (opts.onend) opts.onend(); };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }

  function stopSpeaking() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }

  return { supported: supported, Reader: Reader, speak: speak, speakPage: speakPage, stopSpeaking: stopSpeaking };
})();
