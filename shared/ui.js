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
