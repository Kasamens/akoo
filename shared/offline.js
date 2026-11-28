/* Akoo offline: registers the service worker (/sw.js at the site root) and adds a
 * "Save for offline" button to each podcast player.
 *
 * Podcast audio is never downloaded up front. An episode is saved the first time it is played
 * (the service worker does that) or when the learner presses "Save for offline" here.
 * The media cache name must match MEDIA in sw.js.
 */
(function () {
  if (!('serviceWorker' in navigator) || !window.caches) return;
  const MEDIA = 'akoo-media-v1';
  const root = new URL('../', document.currentScript.src); // shared/ -> site root

  window.addEventListener('load', () => {
    // updateViaCache: 'none' so a new sw.js is picked up on the next visit, not after the HTTP cache expires
    navigator.serviceWorker.register(new URL('sw.js', root), { scope: root.pathname, updateViaCache: 'none' })
      .catch(e => console.warn('Akoo: offline mode is unavailable here.', e.message));
  });

  // ---------------------------------------------------------------- "Save for offline" on podcast players
  const body = document.getElementById('body');
  if (!body) return;
  let index = null;
  const episodes = () => index || (index = fetch('podcast/index.json').then(r => (r.ok ? r.json() : [])).catch(() => []));
  const lessonId = () => decodeURIComponent(location.hash.slice(1)).split('/')[0];

  async function addSave(pod) {
    if (pod.querySelector('.pod-save')) return;
    const ep = (await episodes()).find(e => e.lesson === lessonId());
    if (!ep || !pod.isConnected) return;
    const url = new URL(`podcast/${encodeURIComponent(ep.id)}.m4a`, document.baseURI).href;
    const opts = pod.querySelector('.pod-opts') || pod;
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'btn ghost pod-save';
    opts.appendChild(btn);
    const cache = await caches.open(MEDIA);
    const paint = saved => {
      btn.dataset.saved = saved ? '1' : '';
      btn.textContent = saved ? 'Saved offline ✓' : 'Save for offline';
      btn.setAttribute('aria-label', saved ? 'Saved for offline listening. Press to remove the download.' : `Save this episode for offline listening (about ${Math.max(1, Math.round((ep.duration || 300) / 150))} MB)`);
    };
    paint(!!(await cache.match(url)));
    btn.addEventListener('click', async () => {
      if (btn.dataset.saved) { await cache.delete(url); paint(false); return; }
      btn.disabled = true; btn.textContent = 'Saving…';
      try { await cache.add(url); paint(true); } catch (e) { btn.textContent = 'Could not save (offline?)'; }
      btn.disabled = false;
    });
    // playing also saves the episode (in the service worker): show it once that has happened
    const audioDone = () => setTimeout(async () => { if (!btn.dataset.saved && await cache.match(url)) paint(true); }, 4000);
    pod.querySelector('.pod-play')?.addEventListener('click', audioDone);
  }

  new MutationObserver(() => body.querySelectorAll('section.pod').forEach(addSave)).observe(body, { childList: true });
})();
