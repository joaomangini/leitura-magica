/* Efeitos divertidos: sons curtos (Web Audio, sem arquivos) + confete de emojis.
   O AudioContext só "acorda" depois de um toque do usuário (regra dos navegadores). */
window.FX = (function () {
  "use strict";
  var ctx = null;

  function ac() {
    if (!ctx) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        ctx = null;
      }
    }
    if (ctx && ctx.state === "suspended") {
      try { ctx.resume(); } catch (e) { /* ignora */ }
    }
    return ctx;
  }

  function tone(freq, start, dur, type, gain) {
    var c = ac();
    if (!c) return;
    var o = c.createOscillator();
    var g = c.createGain();
    o.type = type || "sine";
    o.frequency.value = freq;
    o.connect(g);
    g.connect(c.destination);
    var t0 = c.currentTime + (start || 0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(gain || 0.18, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.start(t0);
    o.stop(t0 + dur + 0.03);
  }

  // som curtinho e agudo: acertou uma palavra
  function ding() { tone(880, 0, 0.16, "sine", 0.16); }
  // arpejo alegre: terminou bem
  function fanfare() {
    [523, 659, 784, 1047].forEach(function (f, i) {
      tone(f, i * 0.12, 0.22, "triangle", 0.18);
    });
  }
  // tom suave e grave: vamos tentar de novo (sem ser "errado/punitivo")
  function soft() { tone(392, 0, 0.28, "sine", 0.14); }

  // chuva de emojis caindo da parte de cima da tela
  function celebrate(emojis) {
    var set = emojis && emojis.length ? emojis : ["⭐", "🌟", "🎉", "✨", "🏆"];
    var layer = document.createElement("div");
    layer.className = "confetti";
    for (var i = 0; i < 26; i++) {
      var s = document.createElement("span");
      s.textContent = set[i % set.length];
      s.style.left = Math.random() * 100 + "vw";
      s.style.animationDelay = Math.random() * 0.7 + "s";
      s.style.animationDuration = 2 + Math.random() * 1.4 + "s";
      s.style.fontSize = 1.2 + Math.random() * 1.8 + "rem";
      layer.appendChild(s);
    }
    document.body.appendChild(layer);
    setTimeout(function () { layer.remove(); }, 3200);
  }

  return { ding: ding, fanfare: fanfare, soft: soft, celebrate: celebrate };
})();
