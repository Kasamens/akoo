// Akoo smoke test: opens every lesson and page in a headless browser and reports what is broken.
//
//   npm --prefix tools/test test                      everything
//   npm --prefix tools/test test -- de/praesens fr/   only matching lessons and pages
//   node tools/test/smoke.mjs --root <dir>            test another copy of the site (used by pre-push)
//
// Exit code: 0 all passed, 1 something failed, 2 the test itself could not run.
import { chromium } from 'playwright-core';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { serve, lookup, PREFIX } from './server.mjs';

const QUESTIONS = 5;                                           // every lesson quiz has this many
const JOBS = Math.max(1, Number(process.env.SMOKE_JOBS) || 3); // lessons open at once
const SETTLE = Number(process.env.SMOKE_SETTLE) || 1500;       // ms of animation to watch per lesson
const TIMEOUT = 120000;                                        // ms before one check counts as hung
const REQUIRED_PAGES = ['', 'privacy/', 'thanks/'];

// Requests a test run must never make: visit counts, and the live feedback sheet.
const ANALYTICS = /(^|\.)(goatcounter\.com|zgo\.at|cloudflareinsights\.com)$/;
const FORBIDDEN = /(^|\.)(goatcounter\.com|zgo\.at|cloudflareinsights\.com|script\.google\.com|script\.googleusercontent\.com)$/;

const color = process.stdout.isTTY && !process.env.NO_COLOR;
const paint = (n, s) => (color ? `\x1b[${n}m${s}\x1b[0m` : s);
const green = s => paint(32, s), red = s => paint(31, s), yellow = s => paint(33, s), bold = s => paint(1, s), dim = s => paint(2, s);

// ---------- arguments ----------
const here = path.dirname(fileURLToPath(import.meta.url));
let root = path.resolve(here, '../..');
const filters = [];
for (let args = process.argv.slice(2), i = 0; i < args.length; i++) {
  if (args[i] === '--root') {
    if (!args[i + 1]) fatal('--root needs a folder');
    root = path.resolve(args[++i]);
  } else if (args[i].startsWith('-')) fatal(`unknown option ${args[i]}`);
  else filters.push(args[i]);
}
const wanted = name => !filters.length || filters.some(f => name.includes(f));

function fatal(msg) { console.error(red(`Smoke test could not run: ${msg}`)); process.exit(2); }

// ---------- site layout ----------
const isFile = p => stat(p).then(s => s.isFile(), () => false);

// A course is a top-level folder with index.html and scenes/; any other folder with index.html is a plain page.
async function layout() {
  if (!(await isFile(path.join(root, 'index.html')))) fatal(`no index.html in ${root}`);
  const courses = [], pages = new Set(REQUIRED_PAGES);
  for (const d of await readdir(root, { withFileTypes: true })) {
    if (!d.isDirectory() || d.name.startsWith('.') || ['node_modules', 'shared', 'tools'].includes(d.name)) continue;
    const scenes = await readdir(path.join(root, d.name, 'scenes')).catch(() => null);
    const index = await isFile(path.join(root, d.name, 'index.html'));
    if (scenes) courses.push({ lang: d.name, files: scenes.filter(f => f.endsWith('.js')).sort() });
    else if (index) pages.add(d.name + '/');
  }
  if (!courses.length) fatal('found no course folders (a folder with scenes/)');
  courses.sort((a, b) => a.lang.localeCompare(b.lang));
  return { courses, pages: [...pages].sort() };
}

// ---------- browser ----------
async function launch() {
  // Playwright's own Chromium if it has been installed, otherwise the Chrome or Edge already on this machine.
  const channels = process.env.SMOKE_BROWSER ? [process.env.SMOKE_BROWSER] : ['chromium', 'chrome', 'msedge'];
  const errors = [];
  for (const channel of channels) {
    try {
      const browser = await chromium.launch({
        channel: channel === 'chromium' ? undefined : channel,
        args: ['--enable-unsafe-swiftshader'], // WebGL still works on machines without a usable GPU
      });
      return { browser, name: `${channel} ${browser.version()}` };
    } catch (e) { errors.push(`  ${channel}: ${e.message.split('\n')[0]}`); }
  }
  fatal(`no browser found. Install Google Chrome, or run: npm --prefix tools/test run browser\n${errors.join('\n')}`);
}

// Runs inside every page before the site's own scripts.
function pageHooks() {
  // keep the WebGL picture readable so the test can check something was drawn
  const getContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, attrs) {
    if (/webgl/.test(type)) attrs = { ...attrs, preserveDrawingBuffer: true };
    return getContext.call(this, type, attrs);
  };
  // record every lesson as the scene files register it with the app
  window.__lessons = [];
  let mm;
  Object.defineProperty(window, 'MM', {
    configurable: true,
    get: () => mm,
    set(value) {
      const register = value.register;
      value.register = s => {
        const tpl = document.createElement('template');
        tpl.innerHTML = (s && s.body) || '';
        tpl.content.querySelectorAll('[data-quiz], script, style').forEach(n => n.remove());
        window.__lessons.push({
          id: s && s.id, title: (s && s.title) || '',
          bodyText: tpl.content.textContent.trim().length,
          file: ((document.currentScript && document.currentScript.src) || '').split('/').pop(),
        });
        return register(s);
      };
      mm = value;
    },
  });
}

// Third-party files (Three.js, web fonts) are fetched once and reused, so a run is quick and repeatable.
const external = new Map();
const warnings = new Set();

// Node's own fetch: Playwright's takes several seconds on its first request on some networks.
async function download(url, userAgent) {
  const r = await fetch(url, { headers: { 'user-agent': userAgent }, signal: AbortSignal.timeout(15000) });
  const headers = Object.fromEntries(r.headers);
  delete headers['content-encoding']; delete headers['content-length']; // the body arrives already unpacked
  return { status: r.status, headers, body: Buffer.from(await r.arrayBuffer()) };
}

/** A fresh browser profile that records errors and refuses to let anything be counted or sent. */
async function open(browser, origin) {
  // no service workers: their requests would slip past the blocking below, and could serve cached files
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: 'block' });
  const errors = [];
  const tidy = s => String(s).replaceAll(origin + PREFIX, '').replaceAll(origin, '');

  await context.addInitScript(pageHooks);
  await context.route('**/*', async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.origin === origin || !/^https?:$/.test(url.protocol)) return route.continue().catch(() => {});
    if (FORBIDDEN.test(url.hostname)) {
      errors.push(`test run tried to contact ${url.hostname} (blocked, nothing was sent)`);
      return route.abort().catch(() => {});
    }
    if (request.method() !== 'GET') return route.abort().catch(() => {});
    try {
      if (!external.has(url.href)) {
        external.set(url.href, download(url.href, request.headers()['user-agent']));
      }
      await route.fulfill(await external.get(url.href));
    } catch (e) {
      external.delete(url.href);
      warnings.add(`could not load ${url.href}`);
      await route.abort().catch(() => {});
    }
  });

  const page = await context.newPage();
  page.setDefaultTimeout(30000);
  page.setDefaultNavigationTimeout(60000);
  page.on('pageerror', e => {
    const at = (e.stack || '').split('\n').find(l => l.includes(origin));
    errors.push(tidy(`page error: ${e.message}${at ? ` (${at.trim().replace(/^at /, '')})` : ''}`));
  });
  page.on('console', m => {
    if (m.type() !== 'error') return;
    const { url = '', lineNumber } = m.location();
    // someone else's server failing is worth a note, but it is not a broken lesson
    // (a missing Three.js still fails every lesson, because the lessons then throw)
    if (url && !url.startsWith(origin) && m.text().startsWith('Failed to load resource')) {
      warnings.add(`${m.text()} ${url}`);
      return;
    }
    // a logged Error carries its whole stack: keep the message and where it was thrown
    const [message, ...stack] = m.text().split('\n');
    const at = stack.find(l => l.includes(origin))?.trim().replace(/^at /, '') || (url && `${url}${lineNumber ? `:${lineNumber + 1}` : ''}`);
    errors.push(tidy(`console error: ${message}${at ? ` (${at})` : ''}`));
  });
  return { context, page, errors };
}

/** Run one check in its own profile; whatever goes wrong becomes a line in `failures`.
 *  `failures.timedOut` marks a check that ran out of time, which a busy machine can cause. */
async function check(browser, origin, fn, limit = TIMEOUT) {
  const failures = [];
  let tab, timer;
  try {
    tab = await open(browser, origin);
    await Promise.race([
      fn(tab.page, failures, tab.errors),
      new Promise((_, reject) => { timer = setTimeout(() => reject(Object.assign(new Error(`still not finished after ${limit / 1000}s (hung?)`), { name: 'TimeoutError' })), limit); }),
    ]);
  } catch (e) {
    failures.push(e.message.split('\n')[0]);
    if (e.name === 'TimeoutError') failures.timedOut = true;
  } finally {
    clearTimeout(timer);
    if (tab) { failures.push(...tab.errors); await tab.context.close().catch(() => {}); }
  }
  return Object.assign([...new Set(failures)], { timedOut: failures.timedOut, errors: tab?.errors.length || 0 });
}

// A check that only ran out of time (no errors from the site) gets one more go with the machine to itself.
async function patiently(name, run, first) {
  first ??= await run();
  if (!first.timedOut || first.errors) return first;
  const second = await run();
  if (!second.length) warnings.add(`${name} was too slow the first time and passed on a second try`);
  return second;
}

// Let the page draw at least 20 frames over `ms`, so errors in animation code have a chance to show up.
const watch = (page, ms) => page.evaluate(ms => new Promise(done => {
  const start = performance.now();
  let frames = 0;
  const tick = () => (++frames >= 20 && performance.now() - start >= ms ? done() : requestAnimationFrame(tick));
  requestAnimationFrame(tick);
}), ms);

const showing = (page, id) => page.waitForFunction(
  id => [...document.querySelectorAll('#nav a[aria-current="page"]')].some(a => a.dataset.id === id), id);

// ---------- checks ----------
/** Load a course once and ask the app which lessons exist. */
async function discover(browser, origin, course) {
  let lessons = [];
  const failures = await check(browser, origin, async (page, failures) => {
    await page.goto(`${origin}${PREFIX}${course.lang}/`, { waitUntil: 'load' });
    await watch(page, 300);
    const { registered, nav } = await page.evaluate(() => ({
      registered: window.__lessons,
      nav: [...document.querySelectorAll('#nav a[data-id]')].map(a => ({ id: a.dataset.id, title: a.querySelector('.t')?.textContent || '' })),
    }));
    const byId = new Map();
    for (const l of registered) {
      if (!l.id) { failures.push(`a lesson in scenes/${l.file} has no id`); continue; }
      if (byId.has(l.id)) failures.push(`two lessons use the id "${l.id}" (${byId.get(l.id).file} and ${l.file}); only one can be opened`);
      else byId.set(l.id, l);
    }
    const inNav = new Set(nav.map(n => n.id));
    for (const [id, l] of byId) {
      l.inMenu = inNav.has(id);
      if (!l.inMenu) failures.push(`lesson "${id}" is registered but not in the lesson menu (is its week listed in window.AKOO.levels?)`);
    }
    for (const n of nav) if (!byId.has(n.id)) byId.set(n.id, { id: n.id, title: n.title, inMenu: true });
    for (const file of course.files) {
      if (registered.some(l => l.file === file)) continue;
      const source = await readFile(path.join(root, course.lang, 'scenes', file), 'utf8');
      if (/\bregister\s*\(/.test(source)) failures.push(`scenes/${file} registered no lessons (syntax error, or not included in ${course.lang}/index.html)`);
    }
    if (!byId.size) failures.push('no lessons found');
    const order = new Map(nav.map((n, i) => [n.id, i]));
    lessons = [...byId.values()].sort((a, b) => (order.get(a.id) ?? 1e9) - (order.get(b.id) ?? 1e9)); // menu order
  });
  return { lessons, failures };
}

function lessonCheck(browser, origin, lang, lesson) {
  return check(browser, origin, async (page, failures) => {
    await page.goto(`${origin}${PREFIX}${lang}/#${encodeURIComponent(lesson.id)}`, { waitUntil: 'load' });
    if (lesson.inMenu) await showing(page, lesson.id).catch(() => { failures.push('the app did not open this lesson'); failures.timedOut = true; });
    await page.evaluate(() => Promise.race([document.fonts.ready.then(() => {}), new Promise(r => setTimeout(r, 5000))]));
    await watch(page, SETTLE);

    const seen = await page.evaluate(() => {
      const text = id => (document.getElementById(id)?.textContent || '').trim();
      const canvas = document.querySelector('#stage canvas');
      let stage = null;
      if (canvas) {
        const box = canvas.getBoundingClientRect();
        stage = { width: Math.round(box.width), height: Math.round(box.height), colours: 0 };
        if (canvas.width && canvas.height) {
          // shrink the picture and count distinct colours: a blank stage has one
          const small = document.createElement('canvas');
          small.width = small.height = 64;
          const g = small.getContext('2d', { willReadFrequently: true });
          g.drawImage(canvas, 0, 0, 64, 64);
          const px = g.getImageData(0, 0, 64, 64).data, found = new Set();
          for (let i = 0; i < px.length; i += 4) found.add(`${px[i] >> 4},${px[i + 1] >> 4},${px[i + 2] >> 4},${px[i + 3] >> 4}`);
          stage.colours = found.size;
        }
      }
      return {
        stage, title: text('title'), body: text('body'), controls: text('controls'),
        quiz: document.querySelector('#body [data-quiz]') ? document.querySelectorAll('#body [data-quiz] li.q').length : null,
        emptyQuestions: [...document.querySelectorAll('#body [data-quiz] li.q')].flatMap((li, i) => (li.querySelector('.qt')?.textContent.trim() && li.querySelector('.opts button') ? [] : [i + 1])),
      };
    });

    if (!seen.stage) failures.push('stage canvas is missing');
    else if (seen.stage.width < 50 || seen.stage.height < 50) failures.push(`stage canvas is only ${seen.stage.width}×${seen.stage.height}px`);
    else if (seen.stage.colours < 4) failures.push('stage canvas is blank (nothing was drawn)');
    if (seen.controls.includes('This scene failed to load')) failures.push('the app reports "This scene failed to load."');
    if (!lesson.title.trim() || !seen.title) failures.push('title is missing');
    else if (seen.title !== lesson.title.trim()) failures.push(`title shows "${seen.title}" instead of "${lesson.title}"`);
    if (lesson.bodyText === 0 || !seen.body) failures.push('body text is missing');
    if (seen.quiz === null) failures.push('quiz is missing (the body has no <div data-quiz></div>)');
    else if (seen.quiz !== QUESTIONS) failures.push(`quiz has ${seen.quiz} questions, expected ${QUESTIONS}`);
    if (seen.emptyQuestions.length) failures.push(`quiz question ${seen.emptyQuestions.join(', ')} has no text or no answers`);
  });
}

// Move between lessons inside one page, as a learner does: this is where clean-up code runs.
function switchingCheck(browser, origin, lang, lessons) {
  return check(browser, origin, async (page, failures, errors) => {
    await page.goto(`${origin}${PREFIX}${lang}/#${encodeURIComponent(lessons[0].id)}`, { waitUntil: 'load' });
    await showing(page, lessons[0].id);
    await watch(page, 300);
    errors.length = 0; // load errors belong to the lesson's own check
    for (let i = 1; i <= lessons.length; i++) {
      const from = lessons[i - 1].id, to = lessons[i % lessons.length].id; // ends back on the first
      await page.evaluate(id => { location.hash = id; }, to);
      await showing(page, to);
      await watch(page, 250);
      failures.push(...errors.splice(0).map(e => `${from} → ${to}: ${e}`));
    }
  }, TIMEOUT + lessons.length * 5000);
}

function pageCheck(browser, origin, route) {
  return check(browser, origin, async (page, failures) => {
    const response = await page.goto(`${origin}${PREFIX}${route}`, { waitUntil: 'load' });
    if (!response?.ok()) { failures.push(`page returned ${response?.status()}`); return; }
    await page.waitForLoadState('networkidle').catch(() => {});
    await watch(page, 300);
    if (!(await page.title()).trim()) failures.push('title is missing');
    if (!(await page.locator('h1').first().textContent({ timeout: 2000 }).catch(() => ''))?.trim()) failures.push('main heading is missing');
    if (route === 'thanks/') {
      // the page swallows a bad thanks.json and shows an apology instead, so look for that
      await page.waitForFunction(() => document.querySelector('#flock li, .empty')).catch(() => failures.push('the thanks list never appeared'));
      if (await page.getByText("couldn't load").count()) failures.push('the thanks list could not load (check shared/thanks.json)');
    }
  });
}

// Prove the site's own rules stop test runs being counted. Pages are served from disk under a made-up
// public address (.invalid can never resolve), and every analytics request is answered here: nothing leaves.
async function countingRequests(browser, { address, automated }) {
  const context = await browser.newContext({ serviceWorkers: 'block' });
  const asked = [];
  try {
    if (!automated) await context.addInitScript(() => Object.defineProperty(Navigator.prototype, 'webdriver', { configurable: true, get: () => false }));
    await context.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.origin === new URL(address).origin) return route.fulfill(await lookup(root, url.pathname));
      if (ANALYTICS.test(url.hostname)) { asked.push(url.hostname); return route.fulfill({ status: 200, contentType: 'text/javascript', body: '' }); }
      return route.abort();
    });
    const page = await context.newPage();
    await page.goto(`${address}${PREFIX}privacy/`, { waitUntil: 'load', timeout: 60000 });
    await page.waitForFunction(() => !!window.AkooStats, null, { timeout: 30000 });
    // the loader adds its <script> as it starts, so this does not depend on how fast the request goes out
    const added = await page.evaluate(() => [...document.scripts].filter(s => s.src).map(s => new URL(s.src).hostname));
    await page.waitForTimeout(500);
    return [...new Set([...asked, ...added.filter(h => ANALYTICS.test(h))])];
  } finally {
    await context.close();
  }
}

async function analyticsChecks(browser, origin) {
  const publicAddress = 'https://akoo-smoke.invalid';
  const cases = [
    { name: 'automated browser on a public address is not counted', address: publicAddress, automated: true, counted: false },
    { name: 'localhost is not counted, even in a normal browser', address: origin, automated: false, counted: false },
    { name: 'control: a normal visitor on a public address would be counted', address: publicAddress, automated: false, counted: true },
  ];
  const results = [];
  for (const c of cases) {
    let failures = [];
    try {
      const asked = await countingRequests(browser, c);
      if (!c.counted && asked.length) failures = [`analytics was requested from ${asked.join(', ')}: test runs or local previews would be counted`];
      if (c.counted && !asked.some(h => h.endsWith('zgo.at'))) failures = ['GoatCounter was not requested, so the two checks above prove nothing (did shared/analytics.js change?)'];
    } catch (e) {
      failures = [e.message.split('\n')[0]];
    }
    results.push({ name: c.name, failures });
  }
  return results;
}

// ---------- run ----------
// Check several things at once, then retry any that timed out, one at a time.
async function pool(items, name, run) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(JOBS, items.length) }, async () => {
    while (next < items.length) { const i = next++; results[i] = await run(items[i]); }
  }));
  for (let i = 0; i < items.length; i++) results[i] = await patiently(name(items[i]), () => run(items[i]), results[i]);
  return results;
}

let passed = 0;
const failed = [];
function report(group, name, note, failures) {
  if (failures.length) failed.push({ name: `${group}${name}`, count: failures.length }); else passed++;
  console.log(`  ${failures.length ? red('✗') : green('✓')} ${name}${note ? dim('  ' + note) : ''}`);
  for (const f of failures.slice(0, 8)) console.log(red(`      - ${f.length > 300 ? f.slice(0, 300) + '…' : f}`));
  if (failures.length > 8) console.log(red(`      - …and ${failures.length - 8} more`));
}

async function main() {
  const started = Date.now();
  const { courses, pages } = await layout();
  const server = await serve(root);
  const { browser, name } = await launch();
  console.log(`${bold('Akoo smoke test')} ${dim(`· ${name} · ${root}`)}`);
  let lessonCount = 0;
  try {
    for (const course of courses) {
      let found;
      const failures = await patiently(`${course.lang}/ course setup`, async () => (found = await discover(browser, server.origin, course)).failures);
      const { lessons } = found;
      const chosen = lessons.filter(l => wanted(`${course.lang}/${l.id}`));
      if (!chosen.length && !wanted(`${course.lang}/`)) continue;
      lessonCount += chosen.length;
      console.log(`\n${bold(`Course ${course.lang}/`)} ${dim(`${lessons.length} lesson${lessons.length === 1 ? "" : "s"} found`)}`);
      report(`${course.lang}/ `, 'course setup', '', failures);
      const results = await pool(chosen, l => `${course.lang}/#${l.id}`, l => lessonCheck(browser, server.origin, course.lang, l));
      chosen.forEach((l, i) => report(`${course.lang}/#`, l.id, l.title, results[i]));
      const healthy = chosen.filter((l, i) => l.inMenu && !results[i].length);
      if (healthy.length > 1) report(`${course.lang}/ `, 'switching between lessons', `${healthy.length} passing lessons`,
        await patiently(`${course.lang}/ switching between lessons`, () => switchingCheck(browser, server.origin, course.lang, healthy)));
    }

    const chosenPages = pages.filter(p => wanted(p || 'landing'));
    if (chosenPages.length) {
      console.log(`\n${bold('Pages')}`);
      const results = await pool(chosenPages, p => `page ${p || 'landing'}`, p => pageCheck(browser, server.origin, p));
      chosenPages.forEach((p, i) => report('page ', p || 'landing', '', results[i]));
    }

    if (!filters.length || wanted('analytics')) {
      console.log(`\n${bold('Visit counting')}`);
      for (const r of await analyticsChecks(browser, server.origin)) report('counting: ', r.name, '', r.failures);
    }
  } finally {
    await browser.close();
    await server.close();
  }

  if (!passed && !failed.length) fatal(`nothing matched ${filters.join(' ')}`);
  if (warnings.size) {
    console.log(`\n${yellow('Warnings (outside this repo, not counted as failures):')}`);
    for (const w of warnings) console.log(yellow(`  - ${w}`));
  }
  const seconds = Math.round((Date.now() - started) / 1000);
  console.log(`\n${bold('Result:')} ${green(`${passed} passed`)}, ${failed.length ? red(`${failed.length} failed`) : '0 failed'} · ${lessonCount} lesson${lessonCount === 1 ? "" : "s"} opened · ${seconds}s`);
  if (failed.length) {
    console.log(red('Failed:'));
    for (const f of failed) console.log(red(`  - ${f.name} (${f.count} problem${f.count === 1 ? '' : 's'})`));
  }
  process.exitCode = failed.length ? 1 : 0;
}

main().catch(e => fatal(e.stack || e.message));
