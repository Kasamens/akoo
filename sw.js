/* Akoo service worker: lessons work offline, and a new deploy is never stuck behind an old cache.
 *
 * Lives at the site root (/akoo/sw.js on GitHub Pages), so its scope is /akoo/ and every path
 * below is relative to it. Registered by shared/offline.js.
 *
 * - Site files (pages, engine, scenes, styles, podcast transcripts): NETWORK FIRST. Online you
 *   always get the deployed version (and the offline copy is refreshed); offline, or when the
 *   network takes more than 4 s for a page, the cached copy is used. So even a deploy that forgot
 *   to re-run the build script can't be hidden by this cache.
 * - The list below is precached on install. Its VERSION is a hash of those files, written by
 *   tools/pages/build.mjs; a new version installs at once (skipWaiting), takes over open tabs
 *   (clients.claim) and deletes the old shell cache.
 * - Podcast audio (.m4a, ~1.7 MB each) is never precached. It's saved to its own cache the first
 *   time the learner presses play (the player uses preload="none", so no audio is requested
 *   before that) or when they press "Save for offline". Seeking in a saved episode is served
 *   from the cache with proper 206 range responses.
 * - Fonts and Three.js from CDNs (until they are self-hosted): stale-while-revalidate.
 * - Anything else (GoatCounter, the feedback form) is not touched.
 */
// precache:begin (written by tools/pages/build.mjs)
const VERSION = 'd754f1caf3';
const PRECACHE = [
  "./",
  "manifest.webmanifest",
  "shared/analytics.js",
  "shared/app.js",
  "shared/feedback.js",
  "shared/kit.js",
  "shared/offline.js",
  "shared/podcast.js",
  "shared/progress.js",
  "shared/style.css",
  "shared/thanks.json",
  "shared/ui.js",
  "icons/apple-touch-icon.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon.svg",
  "de/",
  "de/scenes/a1.js",
  "de/scenes/phase1.js",
  "de/scenes/phase2.js",
  "de/scenes/phase3.js",
  "de/scenes/start.js",
  "de/podcast/akoo-a1-01-praesens.json",
  "de/podcast/akoo-a1-02-artikel.json",
  "de/podcast/akoo-a1-03-satzbau.json",
  "de/podcast/akoo-a1-04-akkusativ.json",
  "de/podcast/akoo-a1-05-nicht-kein.json",
  "de/podcast/akoo-a1-06-modalverben.json",
  "de/podcast/akoo-a1-07-trennbare-verben.json",
  "de/podcast/akoo-a1-08-possessivartikel.json",
  "de/podcast/index.json",
  "fr/",
  "fr/scenes/a1.js",
  "fr/scenes/start.js",
  "privacy/",
  "thanks/",
  "de/l/praesens/",
  "de/l/artikel/",
  "de/l/satzbau/",
  "de/l/akkusativ/",
  "de/l/nicht-kein/",
  "de/l/modalverben/",
  "de/l/trennbare-verben/",
  "de/l/possessivartikel/",
  "de/l/nebensaetze/",
  "de/l/perfekt-praeteritum/",
  "de/l/wechselpraepositionen/",
  "de/l/reflexive-verben/",
  "de/l/adjektivendungen/",
  "de/l/komparativ-superlativ/",
  "de/l/als-wenn-bevor-nachdem/",
  "de/l/relativsaetze/",
  "de/l/infinitiv-mit-zu/",
  "de/l/konjunktiv-2/",
  "de/l/passiv/",
  "de/l/genitiv/",
  "de/l/verben-mit-praepositionen/",
  "de/l/konnektoren/",
  "de/l/zweiteilige-konnektoren/",
  "de/l/plusquamperfekt/",
  "de/l/n-deklination/",
  "fr/l/present-er/",
  "fr/l/articles/",
  "fr/l/adjectifs/",
  "fr/l/negation/",
  "fr/l/questions/",
  "fr/l/aller-futur/",
  "fr/l/partitif/",
  "fr/l/possessifs/"
];
// precache:end

const SHELL = `akoo-shell-${VERSION}`;
const MEDIA = 'akoo-media-v1'; // also named in shared/offline.js
const CDN = 'akoo-cdn-v1';
const CDN_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdnjs.cloudflare.com'];
const SCOPE = new URL('./', self.location).href;

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL);
    // one missing file shouldn't stop the rest from working offline
    const res = await Promise.allSettled(PRECACHE.map(u => cache.add(new Request(u, { cache: 'reload' }))));
    res.forEach((r, i) => { if (r.status === 'rejected') console.warn('akoo sw: could not precache', PRECACHE[i]); });
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('akoo-shell-') && k !== SHELL) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (req.url.startsWith(SCOPE)) {
    if (url.pathname.endsWith('.m4a')) event.respondWith(media(event));
    else event.respondWith(site(event));
  } else if (CDN_HOSTS.includes(url.hostname)) event.respondWith(cdn(event));
});

// ------------------------------------------------------------------ site files: network first
const timeout = (ms, p) => new Promise((resolve, reject) => { const t = setTimeout(() => reject(new Error('timeout')), ms); p.then(v => { clearTimeout(t); resolve(v); }, e => { clearTimeout(t); reject(e); }); });

async function site(event) {
  const req = event.request;
  // a server error (or a proxy/captive portal answering for an unreachable server) counts as offline
  const net = fetch(req).then(res => { if (res.status >= 500) throw new Error(`HTTP ${res.status}`); return res; });
  // keep the offline copy fresh (this handler runs first, so it clones before the page reads the body)
  event.waitUntil(net.then(res => { if (res.ok && res.type === 'basic') { const copy = res.clone(); return caches.open(SHELL).then(c => c.put(req, copy)); } }).catch(() => {}));
  try {
    return await (req.mode === 'navigate' ? timeout(4000, net) : net);
  } catch (e) {
    const hit = await caches.match(req, { ignoreSearch: true });
    if (hit) return hit;
    if (req.mode === 'navigate') {
      // an uncached page: <course>/l/<id>/ goes to the app's own route for it, anything else to the home page
      const parts = new URL(req.url).pathname.slice(new URL(SCOPE).pathname.length).split('/');
      if (parts[1] === 'l' && parts[2] && await caches.match(new URL(`${parts[0]}/`, SCOPE).href)) return Response.redirect(new URL(`${parts[0]}/#${parts[2]}`, SCOPE).href, 302);
      const home = await caches.match(SCOPE);
      if (home) return home;
    }
    return new Response('Akoo is offline and this file was not saved.', { status: 503, headers: { 'Content-Type': 'text/plain' } });
  }
}

// ------------------------------------------------------------------ podcast audio
const saving = new Map();
function saveOnce(url) {
  if (!saving.has(url)) saving.set(url, (async () => {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (res.status === 200) await (await caches.open(MEDIA)).put(url, res);
    } catch (e) { /* offline: try again next play */ } finally { saving.delete(url); }
  })());
  return saving.get(url);
}

const checked = new Set();
async function revalidate(url, hit) {
  // once per worker run: if the episode was re-made under the same name, fetch the new one
  if (checked.has(url)) return; checked.add(url);
  try {
    const head = await fetch(url, { method: 'HEAD', cache: 'no-store' });
    const a = hit.headers.get('etag') || hit.headers.get('last-modified'), b = head.headers.get('etag') || head.headers.get('last-modified');
    if (head.ok && a && b && a !== b) { await (await caches.open(MEDIA)).delete(url); await saveOnce(url); }
  } catch (e) { /* offline */ }
}

async function rangeOf(res, range) {
  const blob = await res.blob(), size = blob.size;
  const m = /bytes=(\d*)-(\d*)/.exec(range || '');
  let start = m && m[1] ? +m[1] : 0, end = m && m[2] ? +m[2] : size - 1;
  if (m && !m[1] && m[2]) { start = Math.max(0, size - +m[2]); end = size - 1; } // bytes=-N (last N bytes)
  end = Math.min(end, size - 1);
  if (start >= size || start > end) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
  return new Response(blob.slice(start, end + 1), { status: 206, headers: {
    'Content-Type': res.headers.get('content-type') || 'audio/mp4', 'Content-Length': String(end - start + 1),
    'Content-Range': `bytes ${start}-${end}/${size}`, 'Accept-Ranges': 'bytes' } });
}

async function media(event) {
  const req = event.request, url = req.url.split('#')[0], range = req.headers.get('range');
  const hit = await (await caches.open(MEDIA)).match(url);
  if (hit) { event.waitUntil(revalidate(url, hit.clone())); return range ? rangeOf(hit, range) : hit; }
  // Not saved yet, and this request means the learner pressed play: save the whole episode.
  if (!range || /^bytes=0-$/.test(range)) {
    // A request for the whole file (Chrome, Firefox): download it once, play it and keep a copy.
    try {
      const res = await fetch(url);
      if (res.status === 200) { const copy = res.clone(); event.waitUntil(caches.open(MEDIA).then(c => c.put(url, copy)).catch(() => {})); }
      return res;
    } catch (e) { return fetch(req); }
  }
  // A partial request (Safari probes bytes=0-1 first): pass it through and save the file alongside.
  event.waitUntil(saveOnce(url));
  return fetch(req);
}

// ------------------------------------------------------------------ CDN fonts / Three.js
async function cdn(event) {
  const cache = await caches.open(CDN);
  const hit = await cache.match(event.request);
  const net = fetch(event.request);
  event.waitUntil(net.then(res => { if (res.ok || res.type === 'opaque') return cache.put(event.request, res.clone()); }).catch(() => {}));
  if (hit) return hit;
  return net;
}
