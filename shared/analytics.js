/* Akoo visit counts: GoatCounter (pages per lesson + a few anonymous events) and
 * Cloudflare Web Analytics (overall traffic + page speed). Both are cookie-free.
 *
 * - Fill in GC_CODE / CF_TOKEN below; an empty value skips that service.
 * - Nothing is sent on localhost, file:, automated browsers, with Global Privacy Control,
 *   or on a device opted out with ?nocount=1 (undo with ?nocount=0). The owner uses this
 *   to keep their own visits out of the numbers.
 * - ?stats=debug logs every would-be count to the console instead of sending it (works on localhost too).
 *
 * API for the rest of the site (safe to call when counting is off):
 *   AkooStats.page(lessonId?)      count the current page; course pages pass the lesson shown
 *   AkooStats.event(name, lesson?) count an event, e.g. event('quiz-pass', 'praesens') -> quiz-pass/de/praesens
 */
(function () {
  const GC_CODE = 'akoobird'; // GoatCounter site: https://akoobird.goatcounter.com
  const CF_TOKEN = ''; // Cloudflare Web Analytics beacon token (not set up yet; empty = skipped)

  const q = new URLSearchParams(location.search);
  const store = (k, v) => { try { v === undefined ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} };
  if (q.get('nocount') === '1') store('akoo:nocount', '1');
  if (q.get('nocount') === '0') store('akoo:nocount');
  let optedOut = false;
  try { optedOut = localStorage.getItem('akoo:nocount') === '1'; } catch (e) {}

  const debug = q.get('stats') === 'debug';
  const local = location.protocol === 'file:' || /^(localhost|127\.0\.0\.1|\[::1\]|.*\.localhost)$/.test(location.hostname);
  const blocked = optedOut || navigator.webdriver || navigator.globalPrivacyControl === true;
  const live = !debug && !local && !blocked;

  // course language from the course config, else from the path (/de/, /fr/)
  const lang = () => (window.AKOO && window.AKOO.lang) || ((location.pathname.match(/\/(de|fr)\//) || [])[1]) || '';
  // site path without the GitHub Pages project prefix: /akoo/de/ -> /de/
  const base = () => location.pathname.replace(/^\/akoo(?=\/)/, '') || '/';
  const lessonPath = id => base().replace(/\/?$/, '/') + id;

  // ---------- GoatCounter ----------
  const queue = [];
  let gcReady = false;
  function send(o) {
    if (debug) { console.info('[AkooStats]', blocked ? '(opted out, not counted)' : '', o); return; }
    if (!live || !GC_CODE) return;
    if (gcReady && window.goatcounter && window.goatcounter.count) window.goatcounter.count(o);
    else queue.push(o);
  }
  if (live && GC_CODE) {
    window.goatcounter = { no_onload: true };
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://gc.zgo.at/count.js';
    s.dataset.goatcounter = `https://${GC_CODE}.goatcounter.com/count`;
    s.onload = () => { gcReady = true; queue.splice(0).forEach(o => window.goatcounter.count(o)); };
    document.head.appendChild(s);
  }

  // ---------- Cloudflare Web Analytics ----------
  if (live && CF_TOKEN) {
    const s = document.createElement('script');
    s.defer = true;
    s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    s.setAttribute('data-cf-beacon', JSON.stringify({ token: CF_TOKEN }));
    document.head.appendChild(s);
  }

  // ---------- API ----------
  let lastPath = null;
  window.AkooStats = {
    page(lessonId) {
      // course pages count the lesson shown (section links inside it don't count again); elsewhere the plain path
      const id = lessonId || (window.AKOO ? decodeURIComponent(location.hash.slice(1)).split('/')[0] : '');
      const path = id ? lessonPath(id) : base();
      if (path === lastPath) return; // same lesson, e.g. a section link inside it
      lastPath = path;
      send({ path, title: document.title });
    },
    event(name, lesson) {
      const path = lesson ? `${name}/${lang()}/${lesson}` : name;
      send({ path, title: name, event: true });
    },
  };

  // pages without the lesson app count themselves; course pages are counted by app.js route()
  const selfCount = () => { if (!window.AKOO) window.AkooStats.page(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', selfCount); else selfCount();

  // clicks worth counting that need no hooks elsewhere
  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    if (/#akoo\/protect$/.test(href)) window.AkooStats.event('protect-click');
    else if (a.closest('.langpick') && a.getAttribute('lang')) window.AkooStats.event('lang-' + a.getAttribute('lang'));
    else if (a.classList.contains('course')) { const m = href.match(/^(de|fr)\//); if (m) window.AkooStats.event('lang-' + m[1]); }
  }, true);
})();
