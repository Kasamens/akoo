// Akoo progress: saved in this browser only (localStorage), no accounts, nothing sent anywhere.
// Loaded in <head> so a saved Daylight/Dusk choice is applied before the page paints.
(function () {
  // one save per course language (akoo:de:v1, akoo:fr:v1); the theme lives in akoo:prefs, shared by all courses
  const LANG = ((window.AKOO && window.AKOO.lang) || 'de').toLowerCase();
  const KEY = `akoo:${LANG}:v1`, PREFS = 'akoo:prefs', OLD = 'akoo:v1';
  const LANG_NAME = { de: 'German', fr: 'French' };
  const PASS = 4; // a lesson counts as finished at 4/5 or better
  const today = () => new Date().toISOString().slice(0, 10);
  const blank = () => ({ v: 1, created: today(), last: null, lessons: {}, review: [], prefs: {} });
  // Spaced review (shared/review.js) lives in data.review, a field the v1 format has always had (empty until now),
  // so the format stays v1 and every existing save and AKOO1- backup code still loads.
  // Each item: { lesson: 'satzbau', q: 'q1a2b3c4d' (hash of the question), step: 0-3, due: 'YYYY-MM-DD', n: times missed }
  const DAY = /^\d{4}-\d{2}-\d{2}$/;
  const cleanReview = list => (Array.isArray(list) ? list : []).filter(r => r && typeof r === 'object'
    && /^[a-z0-9-]+$/.test(r.lesson) && /^q[0-9a-f]{1,12}$/.test(r.q) && DAY.test(r.due)).map(r => ({
    lesson: r.lesson, q: r.q, due: r.due,
    step: Math.max(0, Math.min(3, Math.floor(+r.step) || 0)), n: Math.max(1, Math.min(999, Math.floor(+r.n) || 1)),
  }));

  let ok = true;
  try { const t = '__akoo_test'; localStorage.setItem(t, '1'); localStorage.removeItem(t); } catch (e) { ok = false; }

  // one-time move of the pre-French save (akoo:v1, German only) into akoo:de:v1 and akoo:prefs
  if (ok) {
    try {
      const old = localStorage.getItem(OLD);
      if (old) {
        const d = JSON.parse(old);
        if (d && d.prefs && d.prefs.theme && !localStorage.getItem(PREFS)) localStorage.setItem(PREFS, JSON.stringify({ theme: d.prefs.theme }));
        if (d && !localStorage.getItem('akoo:de:v1')) { d.prefs = {}; localStorage.setItem('akoo:de:v1', JSON.stringify(d)); }
        localStorage.removeItem(OLD);
      }
    } catch (e) { /* leave the old save alone if anything goes wrong */ }
  }
  let prefs = {};
  try { prefs = (ok && JSON.parse(localStorage.getItem(PREFS))) || {}; } catch (e) { prefs = {}; }

  function load() {
    if (!ok) return blank();
    try {
      const d = JSON.parse(localStorage.getItem(KEY));
      if (d && d.v === 1 && typeof d.lessons === 'object') { const out = Object.assign(blank(), d); out.review = cleanReview(d.review); return out; }
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
    listen(id) {
      const l = lesson(id);
      if (!l.listened) { l.listened = today(); save(); }
    },
    quiz(id, score) {
      const l = lesson(id);
      l.tries = (l.tries || 0) + 1;
      l.best = Math.max(l.best || 0, score);
      if (score >= PASS && !l.done) l.done = today();
      save();
      return l;
    },
    lang: LANG,
    theme: () => prefs.theme || null,
    setTheme(t) { prefs.theme = t; if (ok) try { localStorage.setItem(PREFS, JSON.stringify(prefs)); } catch (e) { /* ignore */ } },
    exportCode,
    importCode,
    reset() { data = blank(); save(); },
    count: () => Object.values(data.lessons).filter(l => l.done).length,
    // spaced review: fn gets the live item list to change in place; the result is cleaned and saved
    review: () => data.review,
    updateReview(fn) { fn(data.review); data.review = cleanReview(data.review); save(); },
  };

  // ---------- export / import ----------
  // Code format: AKOO1-<base64url(JSON)>-<4 hex checksum>. The checksum catches typos and cut-off pastes.
  function sum(str) { // FNV-1a, folded to 16 bits
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return ((h >>> 16) ^ (h & 0xffff)).toString(16).padStart(4, '0').toUpperCase();
  }
  const toB64 = str => btoa(String.fromCharCode(...new TextEncoder().encode(str))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const fromB64 = b => new TextDecoder().decode(Uint8Array.from(atob(b.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)));

  function exportCode() {
    const { v, created, last, lessons, review } = data; // the theme choice stays with each device
    const body = toB64(JSON.stringify({ v, lang: LANG, created, last, lessons, review }));
    return `AKOO1-${body}-${sum(body)}`;
  }

  const earliest = (a, b) => (!a ? b : !b ? a : a < b ? a : b);

  // Keeps the better of what's here and what's in the code, so an old backup never erases newer progress.
  function importCode(text) {
    const m = String(text || '').replace(/\s+/g, '').match(/AKOO1-([A-Za-z0-9_-]+)-([0-9A-Fa-f]{4})/);
    if (!m) return { ok: false, error: "That doesn't look like an Akoo progress code. It should start with AKOO1-." };
    if (sum(m[1]) !== m[2].toUpperCase()) return { ok: false, error: 'This code is incomplete or has a typo. Copy it again and paste the whole thing.' };
    let inc;
    try { inc = JSON.parse(fromB64(m[1])); } catch (e) { return { ok: false, error: "This code couldn't be read. Copy it again and paste the whole thing." }; }
    if (!inc || inc.v !== 1 || typeof inc.lessons !== 'object') return { ok: false, error: 'This code is from a newer or unknown version of Akoo.' };
    const from = (inc.lang || 'de').toLowerCase(); // codes made before French existed have no lang: they are German
    if (from !== LANG) return { ok: false, error: `This is a ${LANG_NAME[from] || from} progress code. Restore it in the ${LANG_NAME[from] || from} course; this is the ${LANG_NAME[LANG] || LANG} course.` };
    let added = 0;
    for (const [id, l] of Object.entries(inc.lessons || {})) {
      if (!/^[a-z0-9-]+$/.test(id) || !l || typeof l !== 'object') continue;
      const cur = lesson(id), wasDone = !!cur.done;
      if (l.seen) cur.seen = earliest(cur.seen, String(l.seen).slice(0, 10));
      if (l.done) cur.done = earliest(cur.done, String(l.done).slice(0, 10));
      if (+l.best) cur.best = Math.max(cur.best || 0, Math.min(+l.best, 99));
      if (+l.tries) cur.tries = Math.max(cur.tries || 0, Math.min(+l.tries, 9999));
      if (l.listened) cur.listened = earliest(cur.listened, String(l.listened).slice(0, 10));
      if (cur.done && !wasDone) added++;
    }
    if (inc.last && inc.last.id && (!data.last || inc.last.at > data.last.at)) data.last = { id: String(inc.last.id), at: String(inc.last.at) };
    if (inc.created) data.created = earliest(data.created, String(inc.created).slice(0, 10));
    // review items: merge by question; where both have one, keep the more cautious schedule (lower step, earlier due)
    let reviewAdded = 0;
    const key = r => `${r.lesson}#${r.q}`, have = new Map(data.review.map(r => [key(r), r]));
    cleanReview(inc.review).forEach(r => {
      const cur = have.get(key(r));
      if (!cur) { data.review.push(r); have.set(key(r), r); reviewAdded++; return; }
      cur.step = Math.min(cur.step, r.step); cur.due = earliest(cur.due, r.due); cur.n = Math.max(cur.n, r.n);
    });
    save();
    return { ok: true, added, reviewAdded, total: Object.values(data.lessons).filter(l => l.done).length };
  }


  // ---------- "Your progress" panel in the sidebar ----------
  document.addEventListener('DOMContentLoaded', () => {
    const sumEl = document.getElementById('progsum'), panel = document.getElementById('progpanel'), msg = document.getElementById('progmsg');
    if (!sumEl) return;
    const btns = [...document.querySelectorAll('[data-prog]')];
    const P = window.AkooProgress;
    const say = (text, kind) => { msg.textContent = text; msg.className = 'progmsg' + (kind ? ' ' + kind : ''); };
    const lessonsWord = n => `${n} lesson${n === 1 ? '' : 's'}`;
    const summary = () => {
      if (!ok) { sumEl.textContent = "Progress can't be saved in this window (private browsing or storage turned off)."; return; }
      const n = P.count();
      sumEl.textContent = n ? `${lessonsWord(n)} finished, saved in this browser only.` : 'Saved in this browser only. Finish a quiz with 4/5 or better to tick off a lesson.';
    };
    P.onChange(summary); summary();
    if (!ok) btns.forEach(b => { if (b.dataset.prog !== 'import') b.disabled = true; });

    let open = null;
    const close = () => { panel.innerHTML = ''; open = null; btns.forEach(b => b.setAttribute('aria-expanded', 'false')); };
    btns.forEach(b => b.setAttribute('aria-expanded', 'false'));

    function copy(text, ta) {
      const done = () => say('Code copied. Paste it somewhere safe, like a note or an email to yourself.', 'ok');
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, () => { ta.select(); say('Select the code above and copy it.', ''); });
      else { ta.select(); try { document.execCommand('copy'); done(); } catch (e) { say('Select the code above and copy it.', ''); } }
    }

    const views = {
      export() {
        const code = P.exportCode();
        if (window.AkooStats) AkooStats.event('backup');
        panel.innerHTML = `<p>Your progress code. Keep it somewhere safe, or paste it into Akoo on another phone or browser.</p>
          <textarea readonly aria-label="Your progress code"></textarea>
          <div class="row"><button type="button" class="btn" data-a="copy">Copy code</button><button type="button" class="btn ghost" data-a="file">Download file</button></div>`;
        const ta = panel.querySelector('textarea'); ta.value = code;
        ta.addEventListener('focus', () => ta.select());
        panel.querySelector('[data-a="copy"]').addEventListener('click', () => copy(code, ta));
        panel.querySelector('[data-a="file"]').addEventListener('click', () => {
          const date = new Date().toISOString().slice(0, 10);
          const text = `Akoo progress backup (${date})\nTo restore: open Akoo, choose Your progress > Restore, then choose this file or paste the code below.\n\n${code}\n`;
          const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
          const a = Object.assign(document.createElement('a'), { href: url, download: `akoo-progress-${date}.txt` });
          document.body.appendChild(a); a.click(); a.remove();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
          say('Backup file downloaded.', 'ok');
        });
        return ta;
      },
      import() {
        panel.innerHTML = `<p>Paste a progress code, or choose a backup file. Nothing is lost: for each lesson Akoo keeps the better result.</p>
          <textarea aria-label="Paste a progress code" placeholder="AKOO1-…"></textarea>
          <div class="row"><button type="button" class="btn" data-a="go">Restore</button><button type="button" class="btn ghost" data-a="pick">Choose file…</button></div>
          <input type="file" accept=".txt,text/plain" hidden>`;
        const ta = panel.querySelector('textarea'), file = panel.querySelector('input[type=file]');
        const run = text => {
          if (!ok) { say("Progress can't be saved in this window, so it can't be restored here.", 'err'); return; }
          const r = P.importCode(text);
          if (!r.ok) { say(r.error, 'err'); return; }
          if (window.AkooStats) AkooStats.event('restore');
          close();
          const rv = r.reviewAdded ? ` ${r.reviewAdded} review question${r.reviewAdded === 1 ? '' : 's'} added.` : '';
          say((r.added ? `Restored. ${lessonsWord(r.added)} added; ${r.total} finished in total.` : `Restored. Nothing new to add; ${r.total} finished in total.`) + rv, 'ok');
        };
        panel.querySelector('[data-a="go"]').addEventListener('click', () => run(ta.value));
        panel.querySelector('[data-a="pick"]').addEventListener('click', () => file.click());
        file.addEventListener('change', () => { const f = file.files[0]; if (f) f.text().then(run); });
        return ta;
      },
      reset() {
        const n = P.count(), r = data.review.length;
        const what = [n ? lessonsWord(n) + ' finished' : '', r ? `${r} question${r === 1 ? '' : 's'} waiting for review` : ''].filter(Boolean).join(', ');
        panel.innerHTML = `<p>Delete all saved progress in this browser${what ? ` (${what})` : ''}, review questions included? This can't be undone. Back up first if you might want it later.</p>
          <div class="row"><button type="button" class="btn danger" data-a="yes">Yes, reset</button><button type="button" class="btn ghost" data-a="no">Cancel</button></div>`;
        panel.querySelector('[data-a="yes"]').addEventListener('click', () => { P.reset(); close(); say('Progress reset.', 'ok'); if (window.AkooStats) AkooStats.event('reset'); });
        panel.querySelector('[data-a="no"]').addEventListener('click', () => { const b = btns.find(x => x.dataset.prog === 'reset'); close(); say('', ''); b.focus(); });
        return panel.querySelector('[data-a="no"]');
      },
    };

    btns.forEach(b => b.addEventListener('click', () => {
      const which = b.dataset.prog;
      say('', '');
      if (open === which) { close(); return; }
      close(); open = which; b.setAttribute('aria-expanded', 'true');
      const focusEl = views[which]();
      if (focusEl) focusEl.focus({ preventScroll: true });
    }));
  });

  const t = prefs.theme;
  if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
})();
