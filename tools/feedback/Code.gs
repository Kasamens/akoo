/**
 * Akoo feedback receiver (Google Apps Script web app).
 * Deployed from the akoobird@gmail.com account. It receives one JSON message from shared/feedback.js, checks it,
 * gives it a number (AK-0001, AK-0002, ...) and emails it to the inbox below. It never emails visitors.
 * Setup: tools/feedback/README.md
 */

const INBOX = 'akoobird@gmail.com';
const MAX_PER_HOUR = 30;                 // across all visitors, to stop floods
const TYPES = ['idea', 'confusing', 'mistake', 'praise', 'other'];
const COURSES = ['de', 'fr', 'site'];

function doPost(e) {
  try {
    const p = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const bad = check(p);
    if (bad) return reply({ ok: false, error: bad });
    if (p.website) return reply({ ok: true, id: null });           // honeypot filled: a bot. Say OK, send nothing.
    if (!(Number(p.openMs) >= 3000)) return reply({ ok: false, error: 'please take a moment before sending' });
    if (!allowed()) return reply({ ok: false, error: 'too many messages right now, please try again in an hour' });

    const id = nextId();
    const f = clean(p, id);
    MailApp.sendEmail({
      to: INBOX,
      subject: `[Akoo feedback] ${id} · ${cap(f.type)} · ${f.course}/${f.lesson ? f.lesson.id : 'site'}`,
      body: text(f),
      name: 'Akoo feedback',
    });
    return reply({ ok: true, id });
  } catch (err) {
    console.error(err);
    return reply({ ok: false, error: 'something went wrong on our side' });
  }
}

// A visit in a browser shows this, which is handy to check the deployment works.
function doGet() {
  return ContentService.createTextOutput('Akoo feedback receiver is running. Send feedback from the Akoo site.');
}

function check(p) {
  if (!p || p.v !== 1) return 'unknown message format';
  if (TYPES.indexOf(p.type) < 0) return 'unknown feedback type';
  if (COURSES.indexOf(p.course) < 0) return 'unknown course';
  const m = String(p.message || '').trim();
  if (m.length < 10) return 'message is too short';
  if (m.length > 2000) return 'message is too long';
  if (p.credit && !String(p.name || '').trim()) return 'name missing for the Thanks page';
  if (String(p.name || '').length > 80) return 'name is too long';
  return null;
}

// keep only the fields the site promises to send, trimmed to sensible lengths
function clean(p, id) {
  const s = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, n);
  const l = p.lesson && typeof p.lesson === 'object' ? { id: s(p.lesson.id, 40), title: s(p.lesson.title, 80), week: s(p.lesson.week, 60) } : null;
  const pr = p.progress && typeof p.progress === 'object' ? { finished: Number(p.progress.finished) || 0, total: Number(p.progress.total) || null } : null;
  return {
    id,
    received: new Date().toISOString(),
    type: p.type,
    course: p.course,
    about: p.about === 'lesson' ? 'lesson' : 'site',
    lesson: l,
    message: s(p.message, 2000),
    credit: !!p.credit,
    name: p.credit ? s(p.name, 80).replace(/\s+/g, ' ') : '',
    progress: pr,
    device: s(p.device, 20), browser: s(p.browser, 20), os: s(p.os, 20), theme: s(p.theme, 10),
    page: s(p.page, 120),
    sentAt: s(p.sentAt, 30),
  };
}

function text(f) {
  const lesson = f.lesson ? `${f.lesson.week ? f.lesson.week + ' · ' : ''}${f.lesson.title} (${f.lesson.id})` : 'The whole site';
  return [
    `Feedback ${f.id}`,
    ``,
    `Type:     ${cap(f.type)}`,
    `Course:   ${f.course}`,
    `About:    ${lesson}`,
    `Credit:   ${f.credit ? 'Yes, as "' + f.name + '"' : 'No (anonymous)'}`,
    `Progress: ${f.progress ? f.progress.finished + (f.progress.total ? ' of ' + f.progress.total : '') + ' lessons finished' : 'not shared'}`,
    `Device:   ${f.device} · ${f.browser} on ${f.os} · ${f.theme} theme`,
    `Page:     ${f.page}`,
    ``,
    `Message:`,
    f.message,
    ``,
    `---- machine-readable copy for the feedback log (do not edit) ----`,
    '```json',
    JSON.stringify(f, null, 2),
    '```',
  ].join('\n');
}

function nextId() {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const props = PropertiesService.getScriptProperties();
    const n = Number(props.getProperty('lastId') || 0) + 1;
    props.setProperty('lastId', String(n));
    return 'AK-' + String(n).padStart(4, '0');
  } finally { lock.releaseLock(); }
}

function allowed() {
  const cache = CacheService.getScriptCache();
  const key = 'count-' + Utilities.formatDate(new Date(), 'UTC', 'yyyyMMddHH');
  const n = Number(cache.get(key) || 0);
  if (n >= MAX_PER_HOUR) return false;
  cache.put(key, String(n + 1), 3700);
  return true;
}

function reply(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
