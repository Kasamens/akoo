/* Akoo feedback: the "Squawk at us" dialog.
 * Sends one small JSON message to the Apps Script web app in tools/feedback/Code.gs, which emails it to akoobird@gmail.com.
 * No email address is ever asked for. The only personal data is an optional name, sent only when the learner ticks
 * "Add my name to the Thanks page". Add ?feedback=dry to any page URL to log the message to the console instead of sending it.
 */
(function () {
  // Paste the Apps Script web app URL here after deploying tools/feedback/Code.gs (see tools/feedback/README.md).
  const ENDPOINT = 'https://script.google.com/macros/s/AKfycbzJLRUQzjJElW3g9qKPZEEODKZihNDf6olrlleIBhTBy0B3oIoDIBBzQ4dk8jN5dqUV/exec';

  const ROOT = new URL('../', document.currentScript.src).href; // site root, from /shared/feedback.js
  const CFG = window.AKOO || {};
  const COURSE = CFG.lang || 'site';
  const DRY = /[?&]feedback=dry\b/.test(location.search);
  const LIVE = !!ENDPOINT || DRY;
  const QUEUE = 'akoo:feedback-queue', SENT = 'akoo:feedback-sent';
  const LIMIT = 3, WINDOW_MS = 10 * 60 * 1000, MIN_MS = 3000;
  const THANKS = { de: 'Danke!', fr: 'Merci !' }[COURSE] || 'Thank you!';
  const TYPES = [
    ['idea', '💡 Idea'], ['confusing', '🤔 Confusing'], ['mistake', '🐞 Mistake or typo'], ['praise', '💚 Praise'], ['other', 'Other'],
  ];

  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage blocked: nothing to keep */ } },
  };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ---------- context (what the "What we send" list promises, nothing more) ----------
  function lessonInfo() {
    const id = decodeURIComponent(location.hash.slice(1)).split('/')[0];
    const title = document.getElementById('title'), day = document.getElementById('day');
    if (!id || !title || !title.textContent) return null;
    return { id, title: title.textContent.trim(), week: day ? day.textContent.trim() : '' };
  }
  function device() {
    const w = Math.min(screen.width || innerWidth, innerWidth);
    const coarse = matchMedia('(pointer: coarse)').matches;
    return w < 600 ? 'phone' : (w < 1024 && coarse) ? 'tablet' : 'laptop/desktop';
  }
  function browser() {
    const u = navigator.userAgent;
    const b = /Edg\//.test(u) ? 'Edge' : /OPR\//.test(u) ? 'Opera' : /Firefox\//.test(u) ? 'Firefox' : /Chrome\//.test(u) ? 'Chrome' : /Safari\//.test(u) ? 'Safari' : 'Other';
    const os = /Android/.test(u) ? 'Android' : /iPhone|iPad|iPod/.test(u) ? 'iOS' : /Mac OS X/.test(u) ? 'macOS' : /Windows/.test(u) ? 'Windows' : /Linux/.test(u) ? 'Linux' : 'Other';
    return { browser: b, os };
  }
  function progressSummary() {
    const P = window.AkooProgress; if (!P) return null;
    const total = document.querySelectorAll('#nav a[data-id]:not([data-id="akoo"])').length;
    return { finished: P.count(), total: total || null };
  }

  // ---------- sending ----------
  async function post(payload) {
    if (DRY) { console.info('[Akoo feedback · dry run] would send:', payload); return { ok: true, id: 'AK-DRY' }; }
    const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload), redirect: 'follow' });
    let data = null;
    try { data = await res.json(); } catch (e) { /* unreadable reply: the email may still have gone */ }
    if (data && data.ok === false) throw Object.assign(new Error(data.error || 'rejected'), { rejected: true });
    if (!res.ok && !data) throw new Error('HTTP ' + res.status);
    return { ok: true, id: data && data.id };
  }

  // messages that could not be sent (offline, server down) are kept and retried on the next visit
  async function flushQueue() {
    if (DRY || !ENDPOINT || !navigator.onLine) return;
    const q = store.get(QUEUE, []); if (!q.length) return;
    const left = [];
    for (const p of q) {
      try { await post(p); } catch (e) { if (!e.rejected) left.push(p); }
    }
    store.set(QUEUE, left);
  }

  const recentSends = () => store.get(SENT, []).filter(t => Date.now() - t < WINDOW_MS);

  // ---------- dialog ----------
  let dlg, form, openedAt = 0, returnFocus = null;

  function build() {
    dlg = document.createElement('dialog');
    dlg.className = 'fb';
    dlg.setAttribute('aria-labelledby', 'fb-h');
    dlg.innerHTML = `
      <form class="fb-form" novalidate>
        <div class="fb-head"><h2 id="fb-h">Squawk at us <span aria-hidden="true">🦜</span></h2><button type="button" class="fb-x" aria-label="Close feedback form">✕</button></div>
        <p class="fb-intro">Found a mistake, got confused, or have an idea? Tell us. We read everything.</p>
        <fieldset class="fb-types"><legend>What kind of feedback?</legend>
          ${TYPES.map(([v, l]) => `<label class="fb-chip"><input type="radio" name="type" value="${v}"><span>${l}</span></label>`).join('')}
        </fieldset>
        <label class="fb-field"><span>About</span><select name="about"></select></label>
        <label class="fb-field"><span>Your message</span><textarea name="message" rows="5" maxlength="2000" required></textarea></label>
        <p class="fb-meta"><span>Please don't include personal details like phone numbers or addresses.</span><span class="fb-count" aria-live="polite">0 / 2000</span></p>
        <label class="fb-check"><input type="checkbox" name="credit"> <span>Add my name to the <a href="${ROOT}thanks/" target="_blank" rel="noopener">Thanks page</a></span></label>
        <div class="fb-name" hidden>
          <label class="fb-field"><span>Full name, as you'd like it shown</span><input name="name" maxlength="80" autocomplete="name"></label>
          <p class="fb-hint">If your feedback leads to a change, this name appears publicly on the Thanks page. Leave the box unticked to stay anonymous.</p>
        </div>
        <label class="fb-check fb-prog"><input type="checkbox" name="progress"> <span>Include my progress (lessons finished, nothing else)</span></label>
        <details class="fb-what"><summary>What we send</summary>
          <ul>
            <li>Your feedback type and message</li>
            <li>The course and lesson you were on</li>
            <li>Device type (phone, tablet or laptop), browser and system name, light or dark theme, and the time</li>
            <li>Your name, only if you tick the Thanks box</li>
            <li>Lessons finished, only if you tick the progress box</li>
          </ul>
          <p>No email address, IP address or other identifiers. <a href="${ROOT}privacy/" target="_blank" rel="noopener">Privacy details</a></p>
        </details>
        <div class="fb-hp" aria-hidden="true"><label>Leave this empty <input name="website" tabindex="-1" autocomplete="off"></label></div>
        <p class="fb-err" role="alert"></p>
        <div class="fb-actions"><button type="submit" class="btn">Send to Akoo</button><button type="button" class="btn ghost fb-cancel">Cancel</button></div>
      </form>
      <div class="fb-done" hidden>
        <svg class="fb-bird" viewBox="0 0 120 120" aria-hidden="true">
          <g class="fb-bob"><ellipse cx="60" cy="66" rx="26" ry="32" fill="#9aa0a6"/><circle cx="60" cy="36" r="18" fill="#b5bac0"/>
          <circle cx="66" cy="33" r="7" fill="#eef0f2"/><circle cx="67" cy="33" r="3" fill="#15181c"/>
          <path d="M74 38 q12 4 4 14 q-4-6-8-8z" fill="#1d2126"/><path d="M50 92 l10 22 l10-22z" fill="#d4363b"/>
          <ellipse class="fb-wing" cx="46" cy="68" rx="10" ry="20" fill="#80868d"/></g>
          <path d="M20 104 h80" stroke="#6e4a33" stroke-width="6" stroke-linecap="round"/>
        </svg>
        <h2 class="fb-done-h"></h2>
        <p class="fb-done-p"></p>
        <div class="fb-actions"><button type="button" class="btn fb-close">Close</button></div>
      </div>`;
    document.body.appendChild(dlg);
    form = dlg.querySelector('form');

    const msg = form.elements.message, count = dlg.querySelector('.fb-count'), nameBox = dlg.querySelector('.fb-name');
    msg.addEventListener('input', () => { count.textContent = `${msg.value.length} / 2000`; });
    form.elements.credit.addEventListener('change', e => {
      nameBox.hidden = !e.target.checked;
      if (e.target.checked) form.elements.name.focus(); else form.elements.name.value = '';
    });
    const close = () => dlg.close();
    dlg.querySelector('.fb-x').addEventListener('click', close);
    dlg.querySelector('.fb-cancel').addEventListener('click', close);
    dlg.querySelector('.fb-close').addEventListener('click', close);
    dlg.addEventListener('click', e => { if (e.target === dlg) close(); }); // click on the backdrop
    dlg.addEventListener('close', () => { if (returnFocus) returnFocus.focus({ preventScroll: true }); });
    form.addEventListener('submit', e => { e.preventDefault(); submit(); });
  }

  function open(about, from) {
    if (!dlg) build();
    returnFocus = from || null;
    // on phones, close the lessons drawer first so the dialog isn't stacked over it
    if (document.body.classList.contains('navopen')) { const c = document.getElementById('closebtn'); if (c) c.click(); }
    form.reset();
    form.hidden = false; dlg.querySelector('.fb-done').hidden = true;
    dlg.querySelector('.fb-name').hidden = true;
    dlg.querySelector('.fb-count').textContent = '0 / 2000';
    err('');
    const l = lessonInfo(), sel = form.elements.about;
    sel.innerHTML = (l ? `<option value="lesson">This lesson: ${esc(l.week ? l.week.replace(/^Week /, 'Wk ').split(' · ')[0] + ' · ' : '')}${esc(l.title)}</option>` : '') +
      `<option value="site">The whole site</option>`;
    sel.value = l && about !== 'site' ? 'lesson' : 'site';
    dlg.querySelector('.fb-prog').hidden = !(window.AkooProgress && document.getElementById('nav'));
    openedAt = Date.now();
    dlg.showModal();
    const first = form.querySelector('input[name="type"]');
    if (first) first.focus();
  }

  function err(t) { const p = dlg.querySelector('.fb-err'); p.textContent = t; p.hidden = !t; }

  async function submit() {
    const f = form.elements;
    const type = (form.querySelector('input[name="type"]:checked') || {}).value;
    const message = f.message.value.trim();
    const credit = f.credit.checked, name = f.name.value.trim().replace(/\s+/g, ' ');
    if (!type) { err('Pick what kind of feedback this is.'); form.querySelector('input[name="type"]').focus(); return; }
    if (message.length < 10) { err('Please write a little more (at least 10 characters).'); f.message.focus(); return; }
    if (credit && !name) { err('Add the name you would like shown, or untick the Thanks box.'); f.name.focus(); return; }
    if (Date.now() - openedAt < MIN_MS) { err('That was quick! Please check your message, then press Send again.'); return; }
    const recent = recentSends();
    if (recent.length >= LIMIT) { err(`You've sent ${LIMIT} messages in the last 10 minutes. Please wait a little before sending more.`); return; }
    if (f.website.value) { done({ id: null }); return; } // honeypot filled: a bot. Pretend it worked and send nothing.

    const about = f.about.value, l = lessonInfo(), b = browser();
    const payload = {
      v: 1,
      type,
      course: COURSE,
      about,
      lesson: about === 'lesson' && l ? l : null,
      message,
      credit,
      name: credit ? name : '',
      progress: f.progress.checked ? progressSummary() : null,
      device: device(), browser: b.browser, os: b.os,
      theme: document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'),
      page: location.pathname.replace(/^.*\/akoo/, '') + location.hash,
      sentAt: new Date().toISOString(),
      openMs: Date.now() - openedAt,
      website: '',
    };

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = 'Sending…'; err('');
    try {
      const r = await post(payload);
      store.set(SENT, recent.concat(Date.now()));
      done(r);
    } catch (e) {
      if (e.rejected) { err(`Akoo couldn't accept that: ${e.message}`); }
      else { store.set(QUEUE, store.get(QUEUE, []).concat(payload)); store.set(SENT, recent.concat(Date.now())); done({ queued: true }); }
    } finally { btn.disabled = false; btn.textContent = 'Send to Akoo'; }
  }

  function done(r) {
    form.hidden = true;
    const box = dlg.querySelector('.fb-done'); box.hidden = false;
    dlg.querySelector('.fb-done-h').textContent = r.queued ? 'Saved for later' : `${THANKS} Akoo heard you.`;
    dlg.querySelector('.fb-done-p').innerHTML = r.queued
      ? "We couldn't reach Akoo's mailbox just now, so your message is saved on this device. It will be sent next time you open Akoo."
      : r.id
        ? `Your feedback number is <strong>${esc(r.id)}</strong>. If it leads to a change, look for it on the <a href="${ROOT}thanks/">Thanks page</a>.`
        : `Your message is on its way. If it leads to a change, look for it on the <a href="${ROOT}thanks/">Thanks page</a>.`;
    dlg.querySelector('.fb-close').focus();
  }

  // ---------- entry points ----------
  function button(label, cls, about) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = cls; b.innerHTML = label;
    b.addEventListener('click', () => open(about, b));
    return b;
  }

  function mount() {
    if (!LIVE) return; // stays hidden until the Apps Script URL is set (or ?feedback=dry)
    // course pages: a block under "Your progress" in the sidebar / phone drawer
    const prog = document.querySelector('aside .prog');
    if (prog) {
      const sec = document.createElement('section');
      sec.className = 'fbk';
      sec.setAttribute('aria-label', 'Feedback');
      sec.append(button('<span aria-hidden="true">🦜</span> Squawk at us', 'btn ghost fbk-btn', 'lesson'));
      sec.insertAdjacentHTML('beforeend', `<p>Spotted a mistake or have an idea? <a href="${ROOT}thanks/">See what learners helped fix →</a> · <a href="${ROOT}privacy/">Privacy</a></p>`);
      prog.after(sec);
    }
    // under each lesson's previous/next links (the pager is rebuilt per lesson, so this sits after it)
    const pager = document.getElementById('pager');
    if (pager) {
      const p = document.createElement('p');
      p.className = 'fb-lesson';
      p.append(button('Something off in this lesson? Tell us →', 'fb-link', 'lesson'));
      pager.after(p);
    }
    // any page can ask for a button with <span data-fb-slot></span> (landing page, Thanks page)
    document.querySelectorAll('[data-fb-slot]').forEach(s => s.replaceWith(button('<span aria-hidden="true">🦜</span> Squawk at us', 'fb-link', 'site')));
  }

  window.AkooFeedback = { open: about => open(about) };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
  window.addEventListener('load', flushQueue);
  window.addEventListener('online', flushQueue);
})();
