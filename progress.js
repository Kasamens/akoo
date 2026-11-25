// Akoo progress: saved in this browser only (localStorage), no accounts, nothing sent anywhere.
// Loaded in <head> so a saved Daylight/Dusk choice is applied before the page paints.
(function () {
  const KEY = 'akoo:v1';
  const PASS = 4; // a lesson counts as finished at 4/5 or better
  const today = () => new Date().toISOString().slice(0, 10);
  const blank = () => ({ v: 1, created: today(), last: null, lessons: {}, review: [], prefs: {} });

  let ok = true;
  try { const t = '__akoo_test'; localStorage.setItem(t, '1'); localStorage.removeItem(t); } catch (e) { ok = false; }

  function load() {
    if (!ok) return blank();
    try {
      const d = JSON.parse(localStorage.getItem(KEY));
      if (d && d.v === 1 && typeof d.lessons === 'object') return Object.assign(blank(), d);
    } catch (e) { /* unreadable save: start fresh rather than break the site */ }
    return blank();
  }

  let data = load();
  const fns = [];
  let asked = false;

  function save() {
    if (!ok) return;
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { return; }
    // ask the browser not to clear this site's data under storage pressure (Chrome/Firefox usually agree)
    if (!asked && navigator.storage && navigator.storage.persist) { asked = true; navigator.storage.persist().catch(() => {}); }
    fns.forEach(f => f(data));
  }

  // another tab changed progress: pick it up so the two tabs don't overwrite each other
  window.addEventListener('storage', e => { if (e.key === KEY) { data = load(); fns.forEach(f => f(data)); } });

  const lesson = id => (data.lessons[id] = data.lessons[id] || {});

  window.AkooProgress = {
    PASS,
    available: ok,
    get: () => data,
    lesson: id => data.lessons[id] || null,
    onChange: f => fns.push(f),
    open(id, track) {
      const l = lesson(id);
      if (!l.seen) l.seen = today();
      if (track) data.last = { id, at: new Date().toISOString() };
      save();
    },
    quiz(id, score) {
      const l = lesson(id);
      l.tries = (l.tries || 0) + 1;
      l.best = Math.max(l.best || 0, score);
      if (score >= PASS && !l.done) l.done = today();
      save();
      return l;
    },
    theme: () => data.prefs.theme || null,
    setTheme(t) { data.prefs.theme = t; save(); },
  };

  const t = data.prefs.theme;
  if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
})();
