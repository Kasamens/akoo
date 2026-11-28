/* Akoo spaced review: every quiz question you miss comes back later, on a simple schedule.
 *   miss  -> due tomorrow (step 0)
 *   right -> next step: due in 3, then 7, then 14 days; a right answer at the 14-day step retires it
 *   miss again at any step -> back to tomorrow
 * Items live in the course's progress save (data.review, see shared/progress.js), so backup, restore and
 * reset cover them. Loaded after shared/app.js and shared/kit.js; adds the sidebar "Review" link and the #review page.
 */
(function () {
  'use strict';
  const P = window.AkooProgress, MM = window.MM;
  if (!P || !MM || !MM.page) return;

  const GAPS = [1, 3, 7, 14]; // days until the next review, by step
  const MAX = 10;             // questions per round
  const day = (n = 0) => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10); // same UTC day as progress.js
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // a question's id: hash of its text and answer, so reordering a lesson's quiz doesn't lose items
  const answer = q => (typeof q.a === 'number' && q.opts ? q.opts[q.a] : [].concat(q.a)[0]);
  function key(q) {
    const s = `${q.q}|${answer(q)}`;
    let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return 'q' + h.toString(16).padStart(8, '0');
  }

  function record(lesson, q, ok) {
    if (!lesson || !q || !q.q || !/^[a-z0-9-]+$/.test(lesson)) return;
    const k = key(q), today = day();
    let after = null;
    P.updateReview(list => {
      const i = list.findIndex(r => r.lesson === lesson && r.q === k), it = list[i];
      if (!ok) {
        if (it) { it.step = 0; it.due = day(GAPS[0]); it.n = (it.n || 1) + 1; after = it; }
        else { after = { lesson, q: k, step: 0, due: day(GAPS[0]), n: 1 }; list.push(after); }
      } else if (it && it.due <= today) { // a right answer only counts once the item is due (no farming with "again")
        if (it.step >= GAPS.length - 1) { list.splice(i, 1); after = { done: true }; }
        else { it.step++; it.due = day(GAPS[it.step]); after = it; }
      }
    });
    window.dispatchEvent(new CustomEvent('akoo:review', { detail: { lesson, ok, item: after } }));
  }

  // resolve saved items to their questions; drops items whose question no longer exists
  function resolve() {
    const scenes = MM.lessons(), out = [], stale = [];
    P.review().forEach(r => {
      const s = scenes.find(x => x.id === r.lesson), q = s && (s.quiz || []).find(x => key(x) === r.q);
      if (q) out.push({ r, s, q }); else stale.push(r);
    });
    if (stale.length && scenes.length) P.updateReview(list => stale.forEach(r => { const i = list.indexOf(r); if (i >= 0) list.splice(i, 1); }));
    return out;
  }
  const dueNow = () => { const t = day(); return resolve().filter(x => x.r.due <= t).sort((a, b) => a.r.due < b.r.due ? -1 : a.r.due > b.r.due ? 1 : a.r.step - b.r.step); };

  const nice = d => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
  const wk = s => s.day ? `Wk ${s.day}` : 'Intro';

  // ---------- sidebar link ----------
  let link = null;
  function paintLink() {
    if (!link) return;
    const n = dueNow().length, total = P.review().length;
    link.querySelector('.rv-n').textContent = n ? `${n} due` : total ? 'none due' : '';
    link.classList.toggle('has-due', n > 0);
    link.setAttribute('aria-label', `Review: ${n ? plural(n, 'question') + ' due today' : total ? 'nothing due today' : 'missed quiz questions come back here'}`);
    link.setAttribute('aria-current', location.hash.slice(1).split('/')[0] === 'review' ? 'page' : 'false');
  }
  document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('nav');
    if (!nav) return;
    link = document.createElement('a');
    link.className = 'revlink'; link.href = '#review';
    link.innerHTML = '<span class="rv-t">Review</span><span class="rv-n"></span>';
    nav.parentNode.insertBefore(link, nav);
    paintLink();
  });
  P.onChange(paintLink);
  window.addEventListener('hashchange', paintLink);

  // ---------- #review page ----------
  const HOW = `<section><h2>How it works</h2>
  <p>Every quiz question you get wrong is saved here, in this browser only, and comes back on a widening schedule: after <b>1 day</b>, then <b>3</b>, <b>7</b> and <b>14 days</b>. A right answer moves it up a step; a wrong one starts it again at 1 day. Answer it right at the 14-day step and it leaves the pile.</p>
  <p>Back up, restore and reset in “Your progress” include these questions.</p>
  <div class="rv-up"></div></section>`;

  function upcoming(el) {
    if (!el) return;
    const t = day(), later = resolve().filter(x => x.r.due > t);
    if (!later.length) { el.innerHTML = ''; return; }
    const by = {};
    later.forEach(x => { by[x.r.due] = (by[x.r.due] || 0) + 1; });
    el.innerHTML = '<h3>Coming up</h3><ul class="rv-list">' + Object.keys(by).sort().slice(0, 6).map(d => `<li><span>${nice(d)}</span> ${plural(by[d], 'question')}</li>`).join('') + '</ul>';
  }

  let upEl = null; // the open review page's "Coming up" list, kept current as answers change the schedule
  P.onChange(() => { if (upEl && upEl.isConnected) upcoming(upEl); });

  MM.page({
    id: 'review', label: 'Akoo', title: 'Review',
    tagline: 'The questions you missed, back on a schedule: 1, 3, 7, then 14 days.',
    prompt: 'Each card is a question you missed. Answer below: a right answer lifts its card off the pile.',
    body: `<section id="round"><h2>Today’s round</h2><div data-review></div></section>${HOW}`,
    mount(ctx) {
      const G = window.GK, K = G.kit(ctx), T = ctx.THREE;
      document.getElementById('day').textContent = 'Spaced review';
      ctx.backdrop({ center: K.V(0, 0, -2) });

      // the pile: one painted card per question in this round
      const cards = [];
      const pile = new T.Group(); ctx.scene.add(pile);
      K.at(K.box(3.4, 0.25, 2.4, 'wood'), 0, -0.2, 0);
      const tag = K.tag('', K.V(0, 1.6, 0), 'q');
      function build(n) {
        cards.splice(0).forEach(c => { pile.remove(c.m); c.m.geometry.dispose(); });
        for (let i = 0; i < n; i++) {
          const m = K.box(1.9, 0.07, 1.25, i % 2 ? 'paper' : 'neutral', { ink: 0.7 });
          const c = { m, y: 0.0 + i * 0.1, r: (Math.sin(i * 7.3) * 0.12), x: Math.sin(i * 3.1) * 0.06, gone: false, t: 0 };
          m.position.set(c.x, c.y, 0); m.rotation.y = c.r; pile.add(m); cards.push(c);
        }
        label();
      }
      const left = () => cards.filter(c => !c.gone).length;
      function label() { const n = left(); tag.set(n ? plural(n, 'card') + ' left' : (cards.length ? 'Pile cleared!' : 'Nothing due')); tag.pos.set(0, 0.9 + n * 0.1, 0); }
      ctx.fit(5.5, 3.6, K.V(0, 0.4, 0), K.V(0, 0.6, 1));

      function onAnswer(e) {
        const top = cards.filter(c => !c.gone).pop(); if (!top) return;
        if (e.detail.ok) { top.gone = true; top.t = 0; if (!ctx.reduce) ctx.pop(top.m); }
        else { // wrong: the card slides back under the pile
          cards.splice(cards.indexOf(top), 1); cards.unshift(top);
          cards.forEach((c, i) => { c.y = i * 0.1; });
        }
        label();
        const it = e.detail.item;
        K.announce(e.detail.ok ? (it && it.done ? 'Right. That question is learned and leaves the pile.' : `Right. Next review ${it ? nice(it.due) : 'later'}.`) : 'Not quite. It comes back tomorrow.');
      }
      window.addEventListener('akoo:review', onAnswer);
      ctx.onFrame((dt, t) => {
        const step = ctx.reduce || Math.floor(t * 12) !== Math.floor((t - dt) * 12); // on twos
        cards.forEach(c => {
          if (c.gone) { c.t += dt; if (!step) return; const k = Math.min(1, c.t / 0.6); c.m.position.set(c.x + k * 3.2, c.y + Math.sin(k * Math.PI) * 1.4 + k * 0.6, -k * 0.6); c.m.rotation.z = -k * 1.2; c.m.visible = k < 1; }
          else if (step) { c.m.position.y += (c.y - c.m.position.y) * K.f(dt * 2, 8); }
        });
      });

      // the round itself: a normal quiz over today's due questions, each tagged with its lesson
      const host = document.querySelector('[data-review]'), up = document.querySelector('#body .rv-up');
      function round() {
        const due = dueNow(), qs = due.slice(0, MAX).map(x => Object.assign({}, x.q, {
          lesson: x.s.id, hint: `From ${wk(x.s)} · ${x.s.title}${x.q.hint ? ' · ' + x.q.hint : ''}`,
        }));
        if (!qs.length) {
          const total = P.review().length;
          host.innerHTML = total
            ? '<p class="rv-empty">Nothing is due today. Well done. The next questions are listed under “Coming up”.</p>'
            : '<p class="rv-empty">No missed questions yet. When you get a lesson quiz question wrong, it lands here and comes back tomorrow.</p>';
        } else {
          host.innerHTML = `<p class="rv-sum">${plural(due.length, 'question')} due${due.length > MAX ? `; this round has ${MAX}` : ''}.</p><div class="rv-quiz"></div>`;
          ctx.quiz(host.querySelector('.rv-quiz'), qs, null);
        }
        build(qs.length); upcoming(up);
      }
      // the explainer stays put when the stage is rebuilt (font load, resize): only rebuild the pile then
      if (!host.children.length) round(); else build(host.querySelectorAll('.quiz > li:not(.right)').length);
      K.btn('New round', () => { round(); host.scrollIntoView({ behavior: ctx.reduce ? 'auto' : 'smooth', block: 'start' }); }, true);
      upEl = up;
      return { dispose() { window.removeEventListener('akoo:review', onAnswer); upEl = null; } };
    },
  });

  window.AkooReview = { record, key, due: () => dueNow().length, GAPS };
})();
