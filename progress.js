/* Perfis de criança + histórico de leituras, guardados no navegador (localStorage).
   Sem servidor: cada aparelho guarda os seus leitores. */
window.Profiles = (function () {
  "use strict";
  var KEY = "lm_profiles";
  var AKEY = "lm_active";

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch (e) {
      return [];
    }
  }
  function save(list) {
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch (e) {
      /* armazenamento cheio/indisponível — ignora */
    }
  }

  function all() {
    return load();
  }
  function get(id) {
    var f = load().filter(function (p) {
      return p.id === id;
    });
    return f[0] || null;
  }
  function activeId() {
    return localStorage.getItem(AKEY) || "";
  }
  function active() {
    return get(activeId());
  }
  function setActive(id) {
    localStorage.setItem(AKEY, id || "");
  }

  function create(name, emoji) {
    var list = load();
    var p = {
      id: "p" + Date.now().toString(36),
      name: (name || "Leitor").trim().slice(0, 20),
      emoji: emoji || "🙂",
      readings: []
    };
    list.push(p);
    save(list);
    setActive(p.id);
    return p;
  }

  function remove(id) {
    var list = load().filter(function (p) {
      return p.id !== id;
    });
    save(list);
    if (activeId() === id) setActive(list[0] ? list[0].id : "");
  }

  // reading = { ts, storyId, storyTitle, accuracy, wpm, wordsCorrect, total }
  function record(id, reading) {
    var list = load();
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        list[i].readings = list[i].readings || [];
        list[i].readings.unshift(reading); // mais recente primeiro
        if (list[i].readings.length > 100) list[i].readings.length = 100;
        break;
      }
    }
    save(list);
  }

  function stats(id) {
    var p = get(id);
    if (!p || !p.readings || !p.readings.length) return null;
    var r = p.readings;
    var n = r.length;
    function sum(f) {
      return r.reduce(function (a, x) {
        return a + (f(x) || 0);
      }, 0);
    }
    function max(f) {
      return r.reduce(function (a, x) {
        return Math.max(a, f(x) || 0);
      }, 0);
    }
    return {
      count: n,
      avgAcc: Math.round(sum(function (x) { return x.accuracy; }) / n),
      bestAcc: max(function (x) { return x.accuracy; }),
      bestWpm: max(function (x) { return x.wpm; }),
      totalWords: sum(function (x) { return x.wordsCorrect; })
    };
  }

  return {
    all: all,
    get: get,
    active: active,
    activeId: activeId,
    setActive: setActive,
    create: create,
    remove: remove,
    record: record,
    stats: stats
  };
})();
