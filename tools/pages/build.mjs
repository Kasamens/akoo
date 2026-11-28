#!/usr/bin/env node
/* Akoo static pages: one crawlable HTML page per lesson, plus sitemap.xml, robots.txt
 * and the service worker's precache list. No dependencies (Node 18+).
 *
 *   node tools/pages/build.mjs          (run from anywhere; paths are relative to the repo)
 *
 * What it does, per course (de, fr):
 *  1. Reads the course page (de/index.html). The page's <head> part (everything before the
 *     app shell) is COPIED, not hardcoded, so head changes (fonts, Open Graph, lang...) flow
 *     into the lesson pages the next time this runs. Only the title, description, canonical
 *     and og:/twitter: title/description/url are replaced, and a <base href="../../"> is added
 *     so every relative path in the copied markup still points where it did on the course page.
 *  2. Runs the course config (window.AKOO), shared/kit.js and the course's scenes/*.js (the
 *     same <script src="scenes/..."> list the course page loads) in a sandbox and collects
 *     each MM.register({...}) call. Only the plain data fields are read; mount() never runs.
 *  3. Writes <course>/l/<id>/index.html: the course page's own shell with the lesson's
 *     title, tagline, prompt and explainer already filled in (readable without JS), and a
 *     static lessons menu that links the lesson pages to each other.
 *     With JS on, one inline line rewrites the address to <course>/#<id> (history.replaceState,
 *     not a redirect) before the app boots, so the normal app takes over in place.
 *
 * Then it writes sitemap.xml and robots.txt at the repo root and refreshes the precache list
 * and cache version in sw.js (between the "precache:begin/end" markers).
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SITE = 'https://kasamens.github.io/akoo/';
const COURSES = ['de', 'fr'];
const LANG_EN = { de: 'German', fr: 'French' };

const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const exists = p => fs.existsSync(path.join(ROOT, p));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const text = html => String(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const clip = (s, n) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(' ', n - 1)).replace(/[,;:.\s]+$/, '') + '…');

// ---------------------------------------------------------------- lessons from the scene files
function loadLessons(course, page) {
  const lessons = [];
  const sandbox = { console, MM: { register: s => lessons.push(s) } };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  // the inline course config (window.AKOO = {...}) from the course page
  for (const [, js] of page.matchAll(/<script>([\s\S]*?)<\/script>/g)) if (/window\.AKOO\s*=/.test(js)) vm.runInContext(js, sandbox);
  vm.runInContext(read('shared/kit.js'), sandbox, { filename: 'shared/kit.js' });
  const files = [...page.matchAll(/<script[^>]+src="(scenes\/[^"]+\.js)"/g)].map(m => m[1]);
  for (const f of files) vm.runInContext(read(`${course}/${f}`), sandbox, { filename: `${course}/${f}` });
  lessons.sort((a, b) => a.day - b.day); // same order as the app's menu (stable sort)
  return { lessons, cfg: sandbox.AKOO || {}, files };
}

// ---------------------------------------------------------------- page assembly
function splitPage(page) {
  const i = page.indexOf('<div class="shell"');
  if (i < 0) throw new Error('course page has no <div class="shell">');
  return [page.slice(0, i), page.slice(i)];
}

function setHead(head, { title, desc, url }) {
  const meta = (attr, key, val) => {
    const re = new RegExp(`<meta\\s+${attr}="${key}"[^>]*>`, 'i');
    const tag = `<meta ${attr}="${key}" content="${esc(val)}">`;
    return re.test(head) ? (head = head.replace(re, tag), true) : false;
  };
  head = head.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`);
  if (!meta('name', 'description', desc)) head = head.replace(/<\/title>/i, `</title>\n<meta name="description" content="${esc(desc)}">`);
  meta('property', 'og:title', title); meta('property', 'og:description', desc); meta('property', 'og:url', url);
  meta('name', 'twitter:title', title); meta('name', 'twitter:description', desc);
  const canon = `<link rel="canonical" href="${url}">`;
  head = /<link\s+rel="canonical"[^>]*>/i.test(head) ? head.replace(/<link\s+rel="canonical"[^>]*>/i, canon)
    : head.replace(/(<meta name="description"[^>]*>)/i, `$1\n${canon}`);
  // <base> must come before the first relative URL, so put it straight after <meta charset>
  const base = '<base href="../../">';
  head = /<meta charset[^>]*>/i.test(head) ? head.replace(/(<meta charset[^>]*>)/i, `$1\n${base}`) : head.replace(/(<html[^>]*>)/i, `$1\n${base}`);
  return head;
}

const fill = (html, id, inner) => {
  const re = new RegExp(`(<([a-z0-9]+)[^>]*\\sid="${id}"[^>]*>)(</\\2>)`, 'i');
  if (!re.test(html)) throw new Error(`course page has no empty #${id}`);
  return html.replace(re, (_, open, _t, close) => open + inner + close);
};

function staticNav(lessons, cfg) {
  const levels = cfg.levels || {};
  return Object.keys(levels).map(Number).map(w => {
    const items = lessons.filter(s => s.week === w).map(s =>
      `<li><a href="${s.id === 'akoo' ? './' : `l/${s.id}/`}" data-id="${s.id}"><span class="d">${s.day ? `Wk ${s.day}` : 'Intro'}</span><span class="t">${esc(s.title)}</span></a></li>`).join('');
    return items ? `<div class="wk" data-week="${w}"><span class="eyebrow">${esc(levels[w])}</span><ol>${items}</ol></div>` : '';
  }).join('');
}

function lessonPage(course, head, shell, lessons, cfg, s) {
  const url = `${SITE}${course}/l/${s.id}/`;
  const levels = cfg.levels || {};
  const level = String(levels[s.week] || '').split('·')[0].trim();
  const lang = LANG_EN[course];
  const title = `${s.title} · ${level ? level + ' ' : ''}${lang} grammar · Akoo`;
  const tag = text(s.tagline || '');
  const desc = clip(`${tag}${tag && !/[.!?]$/.test(tag) ? '.' : ''} A free interactive ${lang} lesson with a 3D toy, spoken examples and a quiz.`, 160);
  let h = setHead(head, { title, desc, url });
  // With JS on, hand over to the app in place: same document, address becomes <course>/#<id>.
  h = h.replace(/(<base[^>]*>)/, `$1\n<script>history.replaceState(null, '', '#${s.id}');</script>`);
  const i = lessons.indexOf(s), prev = lessons[i - 1], next = lessons[i + 1];
  const link = x => (x.id === 'akoo' ? './' : `l/${x.id}/`);
  const wk = x => (x.day ? `Wk ${x.day}` : 'Intro');
  let b = shell;
  b = fill(b, 'day', esc(s.day ? `Week ${s.day} · ${levels[s.week] || ''}` : levels[s.week] || ''));
  b = fill(b, 'title', esc(s.title));
  b = fill(b, 'tagline', esc(s.tagline || ''));
  b = fill(b, 'prompt', esc(s.prompt || ''));
  b = fill(b, 'body', s.body || '');
  b = fill(b, 'nav', staticNav(lessons, cfg));
  b = fill(b, 'pager', (prev ? `<a href="${link(prev)}">← ${wk(prev)}: ${esc(prev.title)}</a>` : '<span></span>') +
    (next ? `<a href="${link(next)}">${wk(next)}: ${esc(next.title)} →</a>` : '<span></span>'));
  return `${h}${b}`.replace(/^<!doctype html>/i, '<!doctype html>\n<!-- Generated by tools/pages/build.mjs from ' + course + '/index.html and ' + course + '/scenes/. Do not edit; re-run the script. -->');
}

// ---------------------------------------------------------------- service worker precache
function walk(dir, ok) {
  if (!exists(dir)) return [];
  return fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }).flatMap(e => {
    const p = `${dir}/${e.name}`;
    return e.isDirectory() ? walk(p, ok) : ok(p) ? [p] : [];
  });
}

function writeSW(lessonUrls) {
  const files = [
    'index.html', 'manifest.webmanifest',
    ...walk('shared', p => !/\.(md|map)$/.test(p) && !p.includes('/.')),
    ...walk('icons', () => true),
    ...COURSES.flatMap(c => [`${c}/index.html`, ...walk(`${c}/scenes`, p => p.endsWith('.js')), ...walk(`${c}/podcast`, p => p.endsWith('.json'))]),
    'privacy/index.html', 'thanks/index.html',
    ...lessonUrls.map(u => `${u}index.html`),
  ].filter(exists);
  const hash = crypto.createHash('sha256');
  for (const f of files) hash.update(f).update(fs.readFileSync(path.join(ROOT, f)));
  const version = hash.digest('hex').slice(0, 10);
  // directory pages are requested as "de/" not "de/index.html"
  const urls = [...new Set(files.map(f => (f === 'index.html' ? './' : f.replace(/(^|\/)index\.html$/, '$1'))))];
  let sw = read('sw.js');
  const block = `// precache:begin (written by tools/pages/build.mjs)\nconst VERSION = '${version}';\nconst PRECACHE = ${JSON.stringify(urls, null, 1).replace(/\n\s*/g, '\n  ').replace(/\n  \]$/, '\n]')};\n// precache:end`;
  sw = sw.replace(/\/\/ precache:begin[\s\S]*?\/\/ precache:end/, block);
  fs.writeFileSync(path.join(ROOT, 'sw.js'), sw);
  return { version, count: urls.length };
}

// ---------------------------------------------------------------- main
const sitemap = ['', ...COURSES.map(c => `${c}/`), 'privacy/', 'thanks/'].filter(u => exists(`${u}index.html`));
const lessonUrls = [];
for (const course of COURSES) {
  const page = read(`${course}/index.html`);
  const { lessons, cfg, files } = loadLessons(course, page);
  const [head, shell] = splitPage(page);
  const outDir = path.join(ROOT, course, 'l');
  fs.rmSync(outDir, { recursive: true, force: true }); // drop pages of lessons that no longer exist
  let n = 0;
  for (const s of lessons) {
    if (!s.id || s.id === 'akoo') continue; // the intro is the course page itself
    if (!/^[a-z0-9-]+$/.test(s.id)) throw new Error(`${course}: lesson id "${s.id}" is not url-safe`);
    fs.mkdirSync(path.join(outDir, s.id), { recursive: true });
    fs.writeFileSync(path.join(outDir, s.id, 'index.html'), lessonPage(course, head, shell, lessons, cfg, s));
    lessonUrls.push(`${course}/l/${s.id}/`); n++;
  }
  console.log(`${course}: ${n} lesson pages from ${files.join(', ')}`);
}
sitemap.push(...lessonUrls);
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap.map(u => `  <url><loc>${SITE}${u}</loc></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}sitemap.xml\n`);
console.log(`sitemap.xml: ${sitemap.length} urls; robots.txt written`);
const { version, count } = writeSW(lessonUrls);
console.log(`sw.js: cache version ${version}, ${count} files precached`);
