// Akoo podcast: a "Hören" player on lesson pages that have an episode.
// Episodes live next to each course page in podcast/ (e.g. de/podcast/akoo-a1-01-praesens.{m4a,json}),
// built by make_episode.py --out ../akoo/de/podcast in the german-podcast project.
// podcast/index.json lists episodes; an episode's "lesson" field is the Akoo lesson id it belongs to.
// The audio only downloads when the learner presses play (preload="none").
(function () {
  const SPEEDS = [0.75, 0.9, 1, 1.15];
  const fmt = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const isSpoken = l => l.kind === 'line' || l.kind === 'host' || !l.kind;
  const isPrompt = l => l.kind === 'pause' && l.dur >= 2; // shorter pauses are just breathing room
  const PREFS = 'akoo:pod:prefs';
  const prefs = (() => { try { return JSON.parse(localStorage.getItem(PREFS)) || {}; } catch (e) { return {}; } })();
  const savePrefs = () => { try { localStorage.setItem(PREFS, JSON.stringify(prefs)); } catch (e) { /* ignore */ } };
  const posKey = id => `akoo:pod:pos:${id}`;

  let index = null, live = null, token = 0;

  function loadIndex() {
    if (!index) index = fetch('podcast/index.json').then(r => (r.ok ? r.json() : [])).catch(() => []);
    return index;
  }

  function stop() {
    token++;
    if (live) { live.audio.pause(); live.audio.removeAttribute('src'); live.audio.load(); live = null; }
  }

  async function mount(body, lessonId) {
    stop();
    const my = token;
    const eps = await loadIndex();
    const meta = eps.find(e => e.lesson === lessonId);
    if (!meta || my !== token) return;
    let ep;
    try { ep = await (await fetch(`podcast/${encodeURIComponent(meta.id)}.json`)).json(); } catch (e) { return; }
    if (my !== token || !body.isConnected) return;
    render(body, lessonId, ep);
  }

  function render(body, lessonId, ep) {
    const sec = document.createElement('section');
    sec.className = 'pod';
    sec.id = 'hoeren';
    const mins = Math.round(ep.duration / 60);
    sec.innerHTML = `
      <h3>🎧 Hören · Podcast</h3>
      <p class="pod-meta">${esc([ep.series, ep.num && `Folge ${ep.num}`, `${mins} Min.`].filter(Boolean).join(' · '))}: ${esc(ep.en)}</p>
      <p class="pod-how">Listen first without reading, then again with the text. When you see <b>Jetzt du</b>, say it out loud.</p>
      <div class="pod-bar">
        <button type="button" class="btn pod-play" aria-label="Play episode">▶</button>
        <button type="button" class="btn ghost pod-skip" data-d="-10" aria-label="Back 10 seconds">−10</button>
        <button type="button" class="btn ghost pod-skip" data-d="10" aria-label="Forward 10 seconds">+10</button>
        <button type="button" class="btn ghost pod-speed" aria-label="Playback speed">1×</button>
        <span class="pod-time"><span class="pod-cur">0:00</span> / ${fmt(ep.duration)}</span>
      </div>
      <div class="pod-scrub" role="slider" tabindex="0" aria-label="Position in episode" aria-valuemin="0" aria-valuemax="${Math.round(ep.duration)}" aria-valuenow="0">
        <div class="pod-fill"></div><div class="pod-ticks"></div>
      </div>
      <div class="pod-now" aria-live="off"><span class="pod-spk"></span><span class="pod-line"></span></div>
      <div class="pod-opts">
        <label><input type="checkbox" class="pod-opt-en"> English</label>
        <label><input type="checkbox" class="pod-opt-hide"> Hide German text</label>
      </div>
      <ol class="pod-tx" aria-label="Transcript"></ol>`;
    const quizSec = body.querySelector('[data-quiz]');
    const anchor = quizSec && (quizSec.closest('#body > *') || quizSec);
    anchor ? body.insertBefore(sec, anchor) : body.appendChild(sec);

    const $ = s => sec.querySelector(s);
    const audio = new Audio();
    audio.preload = 'none';
    audio.src = `podcast/${ep.audio}`;
    live = { audio, id: ep.id };
    const lineEls = [], words = [];
    let activeLine = -1, activeWord = null, marked = false;

    ep.lines.forEach((line, li) => {
      const el = document.createElement('li');
      lineEls.push(el);
      $('.pod-tx').appendChild(el);
      if (line.kind === 'section') { el.className = 'pod-sec'; el.textContent = line.text; return; }
      if (line.kind === 'pause') {
        if (!isPrompt(line)) { el.hidden = true; return; }
        el.className = 'pod-pause';
        el.innerHTML = `<button type="button" class="pod-pill"><span class="pod-pfill"></span><span>Jetzt du · ${line.dur} s</span></button>`;
        el.querySelector('button').addEventListener('click', () => playFrom(line.start));
        return;
      }
      const host = line.kind === 'host';
      el.className = `pod-ln spk-${esc(line.spk)}${host ? ' host' : ''}`;
      el.innerHTML = `<button type="button" class="pod-who" aria-label="Play from ${esc(line.name)}'s line">${host ? 'EN' : esc(line.name)}</button>
        <div><p class="pod-de" lang="${host ? 'en' : 'de'}"></p>${host || !line.en ? '' : `<p class="pod-en">${esc(line.en)}</p>`}</div>`;
      const de = el.querySelector('.pod-de');
      (line.words || []).forEach((w, i) => {
        if (w.s == null) w.s = i ? line.words[i - 1].e ?? line.start : line.start;
        if (w.e == null) w.e = line.words.slice(i + 1).find(x => x.s != null)?.s ?? line.end;
        const span = document.createElement('span');
        span.className = 'pod-w';
        span.textContent = w.t;
        de.append(span, ' ');
        words.push({ span, s: w.s, e: w.e, li });
      });
      if (!line.words || !line.words.length) de.textContent = line.text;
      el.querySelector('.pod-who').addEventListener('click', () => playFrom(line.start));
      de.addEventListener('click', () => {
        if (sec.classList.contains('hide-de') && !el.classList.contains('shown')) { el.classList.add('shown'); return; }
        playFrom(line.start);
      });
    });

    const secs = ep.lines.filter(l => l.kind === 'section').slice(1);
    $('.pod-ticks').innerHTML = secs.map(l => `<i style="left:${(l.start / ep.duration) * 100}%" title="${esc(l.text)}"></i>`).join('');

    const bind = (cls, key, box) => {
      box.checked = !!prefs[key];
      const apply = () => { sec.classList.toggle(cls, box.checked); prefs[key] = box.checked; savePrefs(); };
      box.addEventListener('change', apply); apply();
    };
    bind('show-en', 'en', $('.pod-opt-en'));
    bind('hide-de', 'hide', $('.pod-opt-hide'));

    let speed = prefs.speed || 1;
    const setSpeed = s => { speed = s; audio.playbackRate = s; $('.pod-speed').textContent = `${s}×`; prefs.speed = s; savePrefs(); };
    setSpeed(speed);
    $('.pod-speed').addEventListener('click', () => setSpeed(SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length]));

    const dur = () => audio.duration || ep.duration;
    const seek = t => { audio.currentTime = Math.min(Math.max(0, t), dur() - 0.05); update(); };
    // the first seek before any audio has loaded: remember it and apply once metadata arrives
    let pending = null;
    const seekSafe = t => { if (audio.readyState >= 1) seek(t); else { pending = t; update(t); } };
    function playFrom(t) { seekSafe(t); audio.play(); }
    $('.pod-play').addEventListener('click', () => {
      if (audio.paused) {
        if (pending == null && audio.readyState < 1) { const saved = +localStorage.getItem(posKey(ep.id)); if (saved > 0 && saved < ep.duration - 5) pending = saved; }
        audio.playbackRate = speed;
        audio.play();
      } else audio.pause();
    });
    sec.querySelectorAll('.pod-skip').forEach(b => b.addEventListener('click', () => seekSafe((audio.currentTime || pending || 0) + +b.dataset.d)));
    audio.addEventListener('loadedmetadata', () => { audio.playbackRate = speed; if (pending != null) { seek(pending); pending = null; } });
    audio.addEventListener('play', () => { sec.classList.add('playing'); $('.pod-play').textContent = '❚❚'; $('.pod-play').setAttribute('aria-label', 'Pause episode'); tick(); });
    audio.addEventListener('pause', () => { sec.classList.remove('playing'); $('.pod-play').textContent = '▶'; $('.pod-play').setAttribute('aria-label', 'Play episode'); });
    audio.addEventListener('timeupdate', () => {
      try { localStorage.setItem(posKey(ep.id), audio.currentTime); } catch (e) { /* ignore */ }
      if (!marked && audio.currentTime >= dur() * 0.9) {
        marked = true;
        if (window.AkooProgress && AkooProgress.listen) AkooProgress.listen(lessonId);
      }
      if (audio.paused) update();
    });
    audio.addEventListener('ended', () => { try { localStorage.removeItem(posKey(ep.id)); } catch (e) { /* ignore */ } });

    const scrub = $('.pod-scrub');
    const at = e => { const r = scrub.getBoundingClientRect(); return Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * dur(); };
    let dragging = false;
    scrub.addEventListener('pointerdown', e => { dragging = true; scrub.setPointerCapture(e.pointerId); seekSafe(at(e)); });
    scrub.addEventListener('pointermove', e => { if (dragging) seekSafe(at(e)); });
    scrub.addEventListener('pointerup', () => { dragging = false; });
    scrub.addEventListener('pointercancel', () => { dragging = false; });
    scrub.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); seekSafe((audio.currentTime || 0) - 5); }
      if (e.key === 'ArrowRight') { e.preventDefault(); seekSafe((audio.currentTime || 0) + 5); }
    });

    function tick() { update(); if (!audio.paused && live && live.audio === audio) requestAnimationFrame(tick); }

    function lineAt(t) {
      let i = -1;
      for (let k = 0; k < ep.lines.length; k++) {
        if (ep.lines[k].start > t + 0.01) break;
        if (isSpoken(ep.lines[k]) || isPrompt(ep.lines[k])) i = k;
      }
      return i;
    }

    // scroll the transcript box (not the page) so the active line stays in view
    function keepInView(el) {
      const box = $('.pod-tx');
      const top = el.offsetTop - box.offsetTop, bottom = top + el.offsetHeight;
      if (top < box.scrollTop + 20 || bottom > box.scrollTop + box.clientHeight - 20) {
        box.scrollTo({ top: Math.max(0, top - box.clientHeight / 3), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      }
    }

    function update(tOverride) {
      const t = tOverride ?? audio.currentTime;
      const pct = `${Math.min(100, (t / dur()) * 100)}%`;
      $('.pod-fill').style.width = pct;
      scrub.setAttribute('aria-valuenow', Math.round(t));
      $('.pod-cur').textContent = fmt(t);
      const li = lineAt(t);
      if (li !== activeLine) {
        lineEls[activeLine]?.classList.remove('on');
        activeLine = li;
        const el = lineEls[li];
        if (el) { el.classList.add('on'); if (!audio.paused) keepInView(el); }
        const line = ep.lines[li];
        const spk = $('.pod-spk'), now = $('.pod-line');
        if (!line) { spk.textContent = ''; now.textContent = ''; }
        else if (line.kind === 'pause') { spk.textContent = 'Du'; spk.className = 'pod-spk you'; now.textContent = 'Sag es laut!'; }
        else { spk.textContent = line.kind === 'host' ? 'EN' : line.name; spk.className = `pod-spk spk-${line.spk}`; now.textContent = sec.classList.contains('hide-de') && line.kind !== 'host' ? '…' : line.text; }
      }
      const cur = ep.lines[li];
      if (cur && cur.kind === 'pause') {
        const p = Math.min(1, Math.max(0, (t - cur.start) / (cur.end - cur.start)));
        lineEls[li].querySelector('.pod-pfill').style.transform = `scaleX(${p})`;
      }
      const w = words.findLast(x => x.li === li && t >= x.s && t < x.e + 0.05) || null;
      if (w !== activeWord) { activeWord?.span.classList.remove('on'); activeWord = w; w?.span.classList.add('on'); }
    }
    update(0);
  }

  window.AkooPodcast = { mount, stop };
})();
