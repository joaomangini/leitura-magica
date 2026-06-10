/* Motor de correção de leitura.
   Compara a sequência de palavras ESPERADAS (texto) com as palavras FALADAS (reconhecidas),
   usando alinhamento de sequências (Needleman-Wunsch) com custo baseado em similaridade.
   Classifica cada palavra esperada como: correct | wrong | missed | pending. */
window.Alignment = (function () {
  // Remove acentos, pontuação e caixa, para comparar de forma tolerante.
  var ACCENTS = new RegExp("[\\u0300-\\u036f]", "g"); // diacríticos combinantes
  function normalize(w) {
    return (w || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(ACCENTS, "")
      .replace(/[^a-z0-9]/g, "");
  }

  // Distância de edição entre dois textos (caracteres).
  function levenshtein(a, b) {
    const m = a.length, n = b.length;
    if (!m) return n;
    if (!n) return m;
    const dp = new Array(n + 1);
    for (let j = 0; j <= n; j++) dp[j] = j;
    for (let i = 1; i <= m; i++) {
      let prev = dp[0];
      dp[0] = i;
      for (let j = 1; j <= n; j++) {
        const tmp = dp[j];
        dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
        prev = tmp;
      }
    }
    return dp[n];
  }

  // Similaridade entre duas palavras: 1 = idêntico, 0 = totalmente diferente.
  function similarity(a, b) {
    const na = normalize(a), nb = normalize(b);
    if (!na && !nb) return 1;
    if (!na || !nb) return 0;
    const d = levenshtein(na, nb);
    return 1 - d / Math.max(na.length, nb.length);
  }

  // Quebra um texto em palavras (mantém a forma original para exibição).
  function tokenize(text) {
    return (text || "").trim().split(/\s+/).filter(Boolean);
  }

  /* Alinha palavras esperadas x faladas.
     threshold = similaridade mínima para considerar "acerto" (0..1). */
  function align(expectedWords, spokenWords, threshold) {
    threshold = threshold == null ? 0.75 : threshold;
    const E = expectedWords.length, S = spokenWords.length;

    const cost = [], back = [];
    for (let i = 0; i <= E; i++) {
      cost.push(new Array(S + 1));
      back.push(new Array(S + 1));
    }
    cost[0][0] = 0;
    for (let i = 1; i <= E; i++) { cost[i][0] = i; back[i][0] = "del"; }
    for (let j = 1; j <= S; j++) { cost[0][j] = j; back[0][j] = "ins"; }

    for (let i = 1; i <= E; i++) {
      for (let j = 1; j <= S; j++) {
        const sim = similarity(expectedWords[i - 1], spokenWords[j - 1]);
        const subCost = sim >= threshold ? 0 : 1;
        const diag = cost[i - 1][j - 1] + subCost; // alinhar (acerto ou troca)
        const del = cost[i - 1][j] + 1;            // palavra esperada pulada
        const ins = cost[i][j - 1] + 1;            // palavra falada a mais
        let best = diag, op = subCost === 0 ? "match" : "sub";
        if (del < best) { best = del; op = "del"; }
        if (ins < best) { best = ins; op = "ins"; }
        cost[i][j] = best;
        back[i][j] = op;
      }
    }

    // Backtrace
    let i = E, j = S;
    const statuses = new Array(E);
    const extras = [];
    while (i > 0 || j > 0) {
      const op = i > 0 && j > 0 ? back[i][j] : i > 0 ? "del" : "ins";
      if (op === "match" || op === "sub") {
        statuses[i - 1] = {
          word: expectedWords[i - 1],
          status: op === "match" ? "correct" : "wrong",
          heard: spokenWords[j - 1]
        };
        i--; j--;
      } else if (op === "del") {
        statuses[i - 1] = { word: expectedWords[i - 1], status: "missed", heard: null };
        i--;
      } else {
        extras.unshift(spokenWords[j - 1]);
        j--;
      }
    }

    // Até onde a criança chegou (última palavra alcançada pela fala).
    let reachedIndex = -1;
    for (let k = 0; k < E; k++) {
      if (statuses[k] && (statuses[k].status === "correct" || statuses[k].status === "wrong")) {
        reachedIndex = k;
      }
    }
    // Palavras depois do ponto alcançado ainda não foram lidas → pending.
    for (let k = reachedIndex + 1; k < E; k++) {
      if (statuses[k] && statuses[k].status === "missed") statuses[k].status = "pending";
    }

    let correct = 0, wrong = 0, missed = 0;
    for (let k = 0; k <= reachedIndex; k++) {
      if (!statuses[k]) continue;
      if (statuses[k].status === "correct") correct++;
      else if (statuses[k].status === "wrong") wrong++;
      else if (statuses[k].status === "missed") missed++;
    }
    const evaluated = correct + wrong + missed;
    const accuracy = evaluated ? correct / evaluated : 0;

    return {
      statuses,
      extras,
      reachedIndex,
      stats: { correct, wrong, missed, evaluated, accuracy, total: E }
    };
  }

  return { align, similarity, normalize, tokenize };
})();
