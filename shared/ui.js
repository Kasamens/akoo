/* Akoo page UI shared by every course page: Daylight/Dusk toggle and the phone lessons drawer. */
// theme toggle: flips between dusk and daylight; the choice is remembered in this browser (progress.js)
(function () {
  const b = document.getElementById('themebtn'), r = document.documentElement;
  const isLight = () => r.dataset.theme ? r.dataset.theme === 'light' : matchMedia('(prefers-color-scheme: light)').matches;
  const label = () => { b.textContent = isLight() ? 'Dusk' : 'Daylight'; b.setAttribute('aria-label', isLight() ? 'Switch to dark theme' : 'Switch to light theme'); };
  b.addEventListener('click', () => { r.dataset.theme = isLight() ? 'dark' : 'light'; label(); if (window.AkooProgress) AkooProgress.setTheme(r.dataset.theme); });
  label();
})();

// phone lessons drawer: slides in from the right, closes on link, backdrop, Escape or widening the window
(() => {
  const mq = matchMedia('(max-width: 900px)');
  const btn = document.getElementById('menubtn'), side = document.getElementById('side');
  const isOpen = () => document.body.classList.contains('navopen');
  const set = open => {
    document.body.classList.toggle('navopen', open);
    btn.setAttribute('aria-expanded', open);
    if (open) setTimeout(() => (side.querySelector('[aria-current="page"]') || side.querySelector('a')).focus({ preventScroll: true }), 60);
  };
  btn.addEventListener('click', () => set(!isOpen()));
  document.getElementById('closebtn').addEventListener('click', () => { set(false); btn.focus(); });
  document.getElementById('scrim').addEventListener('click', () => set(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen()) { set(false); btn.focus(); } });
  side.addEventListener('click', e => { if (e.target.closest('a') && mq.matches) set(false); });
  mq.addEventListener('change', () => set(false));
})();

// language picker: every course Akoo offers. To add a language, add one entry here (and its /<code>/ course).
(function () {
  const FLAGS = {
    de: '<svg viewBox="0 0 5 3" aria-hidden="true"><rect width="5" height="1" fill="#000"/><rect y="1" width="5" height="1" fill="#DD0000"/><rect y="2" width="5" height="1" fill="#FFCE00"/></svg>',
    fr: '<svg viewBox="0 0 3 2" aria-hidden="true"><rect width="1" height="2" fill="#002395"/><rect x="1" width="1" height="2" fill="#fff"/><rect x="2" width="1" height="2" fill="#ED2939"/></svg>',
  };
  const LANGS = [
    { code: 'de', name: 'Deutsch', en: 'German' },
    { code: 'fr', name: 'Français', en: 'French' },
  ];
  const cur = (window.AKOO && window.AKOO.lang) || 'de';
  const me = LANGS.find(l => l.code === cur) || LANGS[0];
  const flag = l => `<span class="lp-flag">${FLAGS[l.code] || ''}</span>`;
  let n = 0;
  document.querySelectorAll('.langpick').forEach(box => {
    const id = 'lp-menu-' + (++n);
    box.innerHTML = `<button type="button" class="lp-btn" aria-haspopup="true" aria-expanded="false" aria-controls="${id}" aria-label="Course language: ${me.en}. Change language">${flag(me)}<span class="lp-name">${me.name}</span></button>
      <ul class="lp-menu" id="${id}" hidden>${LANGS.map(l => `<li><a href="../${l.code}/" lang="${l.code}" ${l.code === cur ? 'aria-current="true" ' : ''}aria-label="${l.name} (${l.en})">${flag(l)}<span>${l.name}</span></a></li>`).join('')}</ul>`;
    const btn = box.querySelector('.lp-btn'), menu = box.querySelector('.lp-menu');
    const open = yes => { menu.hidden = !yes; btn.setAttribute('aria-expanded', yes); if (yes) (menu.querySelector('[aria-current="true"]') || menu.querySelector('a')).focus(); };
    btn.addEventListener('click', e => { e.stopPropagation(); open(menu.hidden); });
    document.addEventListener('click', e => { if (!box.contains(e.target)) open(false); });
    box.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !menu.hidden) { e.stopPropagation(); open(false); btn.focus(); }
      const links = [...menu.querySelectorAll('a')], i = links.indexOf(document.activeElement);
      if (i >= 0 && /^Arrow(Right|Down|Left|Up)$/.test(e.key)) { e.preventDefault(); links[(i + (/Right|Down/.test(e.key) ? 1 : links.length - 1)) % links.length].focus(); }
    });
  });
})();

// page language: the UI is English (<html lang="en">), but example sentences, readouts, quiz options and
// inline <i>/<em> words are in the course language. Tag them with lang=AKOO.lang so screen readers switch
// voice and browsers hyphenate and spell-check them correctly. Runs on every re-render (lesson change, quiz reset).
(function () {
  const L = window.AKOO && window.AKOO.lang;
  if (!L) return;
  // target-language text the lessons mark up the same way everywhere
  const ALWAYS = ['.de', '.mistakes s', '.quiz .tile', '.readout i'].join(',');
  // inline <i>/<em> in lesson prose are course-language words, except in the English intro lesson ("akoo")
  const INLINE = ['#body i', '#body em'].join(',');
  const set = el => { if (!el.hasAttribute('lang')) el.lang = L; };
  const tag = root => {
    root.querySelectorAll(ALWAYS).forEach(set);
    const cur = document.querySelector('#side a[aria-current="page"]');
    if (!cur || cur.dataset.id !== 'akoo') root.querySelectorAll(INLINE).forEach(set);
    // a gap-fill question ("Tu ___ à Accra.") and its options are course language; other questions are English
    root.querySelectorAll('.quiz .qt').forEach(el => {
      if (!el.querySelector('.gap')) return;
      set(el);
      el.closest('li').querySelectorAll('.opt, .why em').forEach(set);
    });
  };
  let queued = false;
  new MutationObserver(() => { if (!queued) { queued = true; queueMicrotask(() => { queued = false; tag(document.body); }); } })
    .observe(document.body, { childList: true, subtree: true });
  tag(document.body);
})();
