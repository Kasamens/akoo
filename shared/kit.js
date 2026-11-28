/* Akoo shared 3D kit: helpers every course's scenes use (exported on window.GK).
 * Loaded after shared/app.js and before a course's scenes/*.js. Language-neutral; the listen-button
 * wording comes from window.AKOO.ui (set by each course page).
 */
(function () {
  'use strict';

  // ---------- shared kit ----------
  function kit(ctx) {
    const T = ctx.THREE, K = { T }, tags = [], timers = [];
    K.V = (x, y, z) => new T.Vector3(x, y, z);
    K.f = (dt, rate) => ctx.reduce ? 1 : 1 - Math.exp(-(rate || 6) * dt);
    K.box = (w, h, d, col, o) => ctx.solid(new T.BoxGeometry(w, h, d), col, o);
    K.cyl = (rt, rb, h, col, seg, o) => ctx.solid(new T.CylinderGeometry(rt, rb, h, seg || 20), col, o);
    K.sph = (r, col, o) => ctx.solid(new T.SphereGeometry(r, 22, 16), col, o);
    K.at = (obj, x, y, z, parent) => { obj.position.set(x, y, z); (parent || ctx.scene).add(obj); return obj; };
    K.resize = (mesh, w, h, d) => {
      const g = new T.BoxGeometry(w, h, d);
      mesh.geometry.dispose(); mesh.geometry = g;
      mesh.children.forEach(c => { if (c.userData.hull) c.geometry = g; });
    };
    K.emit = (mesh, v) => { if (mesh && mesh.material && mesh.material.uniforms) mesh.material.uniforms.uEmit.value = v; };
    // frame-based delay so nothing fires into the next scene after unmount
    K.after = (sec, fn) => timers.push({ t: sec, fn });
    ctx.onFrame(dt => { for (let i = timers.length - 1; i >= 0; i--) { timers[i].t -= dt; if (timers[i].t <= 0) { const f = timers[i].fn; timers.splice(i, 1); f(); } } });

    K.tag = (html, pos, cls) => {
      const el = ctx.tag(html); if (cls) el.classList.add(cls);
      const t = { el, pos: pos.clone(), on: true, h: html, obj: null };
      t.show = b => { if (t.on !== b) { t.on = b; el.style.display = b ? '' : 'none'; } return t; };
      t.set = h => { if (t.h !== h) { t.h = h; el.innerHTML = h; } return t; };
      tags.push(t); return t;
    };
    const wp = new T.Vector3(), lp = new T.Vector3();
    ctx.onFrame(() => tags.forEach(t => {
      if (!t.on) return;
      if (t.obj) { t.obj.getWorldPosition(wp); wp.add(t.pos); ctx.place(t.el, wp); } else ctx.place(t.el, t.pos);
      // a tag with .to gets an ink leader line down to that point
      if (t.to) {
        lp.copy(t.to).project(ctx.camera);
        const y = (1 - lp.y) / 2 * ctx.host.clientHeight;
        const len = y - parseFloat(t.el.style.top) - t.el.offsetHeight / 2 - 3;
        t.el.style.setProperty('--lead', Math.max(0, len) + 'px');
      }
    }));

    K.el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
    // ---- controls: every toy control is a real button, so Tab, Enter and Space work everywhere ----
    // A polite live region says what each change did ("Kasus: Dativ. “dem” moved to position 3. …"),
    // so the toys can be followed without seeing the stage. The visible readout itself is not live.
    let live = null, action = '';
    K.announce = msg => {
      if (!msg) return;
      if (!live || !live.isConnected) { live = K.el('p', 'sr-only'); live.setAttribute('aria-live', 'polite'); live.setAttribute('role', 'status'); ctx.controls.appendChild(live); }
      live.textContent = '';
      setTimeout(() => { if (live) live.textContent = msg; }, 60); // re-set so the same message is read again
    };
    const plain = h => { const d = document.createElement('div'); d.innerHTML = h; return (d.textContent || '').replace(/\s+/g, ' ').trim(); };
    K.btn = (label, fn, ghost) => {
      const b = K.el('button', 'btn' + (ghost ? ' ghost' : ''), label);
      b.type = 'button';
      b.addEventListener('click', e => { action = b.getAttribute('aria-label') || plain(label); fn(e); flush(); });
      ctx.controls.appendChild(b); return b;
    };
    // an on/off chip (aria-pressed); fn(on) runs on every change
    K.toggle = (label, init, fn) => {
      const b = K.el('button', 'chip', label); b.type = 'button';
      let on = !!init; b.setAttribute('aria-pressed', String(on));
      b.addEventListener('click', () => { on = !on; b.setAttribute('aria-pressed', String(on)); action = `${plain(label)}: ${on ? 'on' : 'off'}`; fn(on); flush(); });
      ctx.controls.appendChild(b); return b;
    };
    // one-of-many chips: a radio group. Tab reaches the chosen chip; arrow keys (and Home/End) move and choose.
    K.chips = (label, opts, init, fn) => {
      const wrap = K.el('div', 'group');
      const lid = 'g' + Math.random().toString(36).slice(2, 8);
      wrap.innerHTML = `<span class="lbl" id="${lid}">${label}</span>`;
      const row = K.el('div', 'row'); row.setAttribute('role', 'radiogroup'); row.setAttribute('aria-labelledby', lid);
      const name = plain(label);
      const bs = opts.map(o => {
        const b = K.el('button', 'chip', o.label); b.type = 'button'; b.setAttribute('role', 'radio');
        if (o.aria) b.setAttribute('aria-label', o.aria);
        b.addEventListener('click', () => { set(o.v); action = `${name}: ${o.aria || plain(o.label)}`; fn(o.v); flush(); });
        row.appendChild(b); return [o.v, b];
      });
      row.addEventListener('keydown', e => {
        const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1, Home: 'first', End: 'last' };
        if (!(e.key in keys)) return;
        e.preventDefault();
        const i = bs.findIndex(([, b]) => b === document.activeElement), d = keys[e.key], n = bs.length;
        const j = d === 'first' ? 0 : d === 'last' ? n - 1 : ((i < 0 ? 0 : i) + d + n) % n;
        bs[j][1].focus(); bs[j][1].click();
      });
      function set(v) {
        const any = bs.some(([k]) => k === v);
        bs.forEach(([k, b], i) => { const on = k === v; b.setAttribute('aria-checked', String(on)); b.tabIndex = on || (!any && i === 0) ? 0 : -1; });
      }
      wrap.appendChild(row); set(init); ctx.controls.appendChild(wrap);
      return { set };
    };
    // the readout under the stage. When its sentence changes, the live region says how (word moves, swaps).
    let out = null, lastSentence = null, lastLine = '', pending = false;
    const lineOf = r => { const c = r.cloneNode(true); c.querySelectorAll('button, .novoice').forEach(x => x.remove()); return plain(c.innerHTML.split(/<br\s*\/?>/i)[0]); };
    const sentOf = r => { const d = r.querySelector('.de'); return d ? plain(d.innerHTML) : null; };
    function flush() {
      if (!out) { if (action) K.announce(action + '.'); action = ''; return; }
      pending = false;
      const sent = sentOf(out), line = lineOf(out);
      const parts = [];
      if (action) parts.push(action + '.');
      if (sent != null && lastSentence != null && sent !== lastSentence) { const m = describe(lastSentence, sent); if (m) parts.push(m); }
      if (line && line !== lastLine) parts.push(line);
      lastSentence = sent; lastLine = line; action = '';
      K.announce(parts.join(' '));
    }
    K.readout = () => {
      const r = K.el('div', 'readout'); ctx.controls.appendChild(r);
      queueMicrotask(() => { if (r.parentNode === ctx.controls) ctx.controls.appendChild(r); });
      out = r;
      // changes made without a kit control (stage clicks, timers) are announced too, once per change
      new MutationObserver(() => {
        if (lastSentence == null && !lastLine) { lastSentence = sentOf(r); lastLine = lineOf(r); return; } // first paint: silent
        if (!pending) { pending = true; queueMicrotask(() => { if (pending) flush(); }); }
      }).observe(r, { childList: true, subtree: true, characterData: true });
      return r;
    };
    // sentence text from a word row
    K.sentence = (row, keys) => keys.map(k => row.blocks[k]).reduce((s, b) => s + (b.role === 'punct' ? '' : (s ? ' ' : '')) + b.word, '');
    // re-run a layout when the stage flips between portrait and landscape
    K.onPortrait = fn => { let p = ctx.portrait; ctx.onFrame(() => { if (ctx.portrait !== p) { p = ctx.portrait; fn(); } }); };
    return K;
  }

  // "“ich” moved to position 3" / "“wohne” became “wohnst”": what changed between two sentences
  function describe(a, b) {
    const words = s => s.split(/\s+/).map(w => w.replace(/^[„“”"«»(]+|[.,!?;:…»“”")]+$/g, '')).filter(Boolean);
    const A = words(a), B = words(b), lo = w => w.toLowerCase();
    if (!A.length || !B.length) return '';
    const same = A.length === B.length && A.map(lo).sort().join(' ') === B.map(lo).sort().join(' ');
    if (same) {
      const used = new Set(), moves = [];
      B.forEach((w, j) => {
        const i = A.findIndex((x, k) => !used.has(k) && lo(x) === lo(w));
        used.add(i);
        if (i !== j && moves.length < 3) moves.push(`“${w}” moved to position ${j + 1}`);
      });
      return moves.length ? moves.join(', ') + '.' : '';
    }
    if (A.length === B.length) {
      const ch = [];
      B.forEach((w, j) => { if (lo(w) !== lo(A[j]) && ch.length < 3) ch.push(`“${A[j]}” became “${w}”`); });
      return ch.length ? ch.join(', ') + '.' : '';
    }
    return '';
  }

  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const attr = s => String(s).replace(/<[^>]+>/g, '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  const SPK = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6h3l4-3v10l-4-3H2z" fill="currentColor"/><path d="M11 5.5c1 .8 1 4.2 0 5M12.8 3.8c2 1.8 2 6.6 0 8.4" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>';
  // listen buttons and the "no voice" note come from the course config (window.AKOO.ui), defaulting to German
  const UI = Object.assign({ listen: 'hören', listenLabel: 'Anhören', novoice: 'No German voice was found on this device, so the ▶ hören buttons are hidden.' }, (window.AKOO && window.AKOO.ui) || {});
  const say = de => `<button type="button" class="say" data-say="${attr(de)}" aria-label="${UI.listenLabel}: ${attr(de)}">${SPK}▶ ${UI.listen}</button>`;
  const ex = items => `<p class="novoice">${UI.novoice}</p><ul class="ex">${items.map(([de, en]) => `<li><span class="de">${de} ${say(de)}</span><span class="en">${en}</span></li>`).join('')}</ul>`;
  const table = (head, rows) => `<div class="tw"><table><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const R = (role, s) => `<span class="r-${role}">${s}</span>`;

  // a simple brass gear: hub + teeth, facing the camera (axis = z)
  function gear(K, r, teeth, col) {
    const T = K.T, g = new T.Group();
    const hub = K.cyl(r, r, 0.3, col, 28); hub.rotation.x = Math.PI / 2; g.add(hub);
    const axle = K.cyl(r * 0.25, r * 0.25, 0.4, 'copper', 14); axle.rotation.x = Math.PI / 2; g.add(axle);
    for (let i = 0; i < teeth; i++) {
      const a = i / teeth * Math.PI * 2;
      const tth = K.box(0.22, 0.26, 0.28, col, { ink: 0.6 });
      tth.position.set(Math.cos(a) * (r + 0.1), Math.sin(a) * (r + 0.1), 0); tth.rotation.z = a;
      g.add(tth);
    }
    return g;
  }


  function makeFigure(K, col) {
    const T = K.T, g = new T.Group(), parts = {};
    [-0.17, 0.17].forEach(x => K.at(K.cyl(0.11, 0.09, 0.95, col, 12), x, 0.48, 0, g));
    parts.torso = K.at(K.cyl(0.36, 0.3, 0.95, col, 16), 0, 1.42, 0, g);
    parts.head = K.at(K.sph(0.27, 'paper'), 0, 2.15, 0, g);
    K.at(K.sph(0.28, 'wood'), 0, 2.24, -0.04, g).scale.set(1, 0.6, 1);
    parts.hands = [];
    [-0.46, 0.46].forEach(x => {
      const arm = K.cyl(0.08, 0.07, 0.85, col, 10); arm.position.set(x, 1.35, 0.12); arm.rotation.x = -0.5; g.add(arm);
      const hand = K.sph(0.1, 'paper'); hand.position.set(x, 0.98, 0.36); g.add(hand); parts.hands.push(hand);
    });
    g.userData.parts = parts;
    return g;
  }

  // ---------- shared phase 2/3 helpers ----------
  // A sentence row that animates when only the order/text changes, and rebuilds when the set of blocks changes.
  function stageRow(ctx, K, o) {
    o = o || {};
    let row = null, sig = '';
    const api = { size: { w: 1, h: 1 }, keys: [] };
    api.show = (tokens, keys, opt) => {
      opt = opt || {};
      const s = tokens.map(t => t[0]).join('|');
      let snap = !!opt.snap;
      if (s !== sig) {
        if (row) {
          ctx.scene.remove(row.root);
          row.root.traverse(x => { if (x.geometry) x.geometry.dispose(); if (x.material && !Array.isArray(x.material)) { if (x.material.map) x.material.map.dispose(); x.material.dispose(); } });
        }
        row = ctx.words(tokens); sig = s; snap = true;
        if (o.pos) row.root.position.copy(o.pos);
      }
      api.row = row;
      const text = {}, roles = {};
      tokens.forEach(([k, t, r]) => { text[k] = t; roles[k] = r; });
      Object.assign(text, opt.text || {}); Object.assign(roles, opt.roles || {});
      api.keys = keys || tokens.map(t => t[0]); api.tight = opt.tight || [];
      api.size = row.arrange(api.keys, { text, roles, maxW: ctx.portrait ? (o.maxP || 6.6) : (o.maxW || 30), snap, tight: opt.tight, cap: opt.cap });
      api.lines = Math.max(1, Math.round(api.size.h / 1.25));
      return api.size;
    };
    api.b = k => row.blocks[k];
    api.sentence = () => api.keys.reduce((s, k) => { const b = row.blocks[k]; return s + ((b.role === 'punct' || api.tight.includes(k)) ? '' : (s ? ' ' : '')) + b.word; }, '');
    // world-space target position of a block (no need to wait for the spring)
    api.at = k => row.root.position.clone().add(row.blocks[k].st.tp);
    api.pop = (keys, delay) => K.after(delay == null ? 0.32 : delay, () => keys.forEach(k => { if (row.blocks[k] && api.keys.includes(k)) ctx.pop(row.blocks[k]); }));
    return api;
  }

  // a wooden bench under a row (resized to the row)
  function bench(ctx, K) {
    const top = K.at(K.box(8, 0.3, 1.6, 'wood'), 0, -0.65, 0);
    const rail = K.at(K.box(8, 0.08, 0.1, 'brass', { ink: 0.6 }), 0, -0.48, 0.82);
    return (size, lines, base) => {
      base = base || K.V();
      K.resize(top, size.w + 1.2, 0.3, 1.6); top.position.set(base.x, base.y - (lines - 1) * 1.25 - 0.65, base.z);
      K.resize(rail, size.w + 1.2, 0.08, 0.1); rail.position.set(base.x, top.position.y + 0.17, base.z + 0.82);
    };
  }

  // a glowing painted arc (tube) between two points; returns { set(a, b, h), hide() }
  function arc(ctx, K, key) {
    const T = K.T;
    const mat = new T.MeshBasicMaterial({ color: ctx.colors[key || 'accent'].clone(), transparent: true, opacity: 0.85 });
    mat.userData.key = key || 'accent';
    let mesh = null;
    const api = {
      set(a, b, h) {
        api.hide();
        const mid = a.clone().add(b).multiplyScalar(0.5); mid.y += h == null ? 1.1 : h;
        const curve = new T.QuadraticBezierCurve3(a, mid, b);
        mesh = new T.Mesh(new T.TubeGeometry(curve, 32, 0.045, 6, false), mat);
        ctx.scene.add(mesh);
        if (!ctx.reduce) { mesh.scale.setScalar(0.001); let k = 0; ctx.onFrame(dt => { if (!mesh || k >= 1) return; k = Math.min(1, k + dt / 0.35); const q = Math.round(k * 6) / 6; mesh.scale.setScalar(Math.max(0.001, q)); mesh.position.copy(mid).multiplyScalar(1 - q); }); }
      },
      hide() { if (mesh) { ctx.scene.remove(mesh); mesh.geometry.dispose(); mesh = null; } },
    };
    return api;
  }

  // a brass piston that stamps down onto a point ("the rule presses something in")
  function piston(ctx, K) {
    const T = K.T, g = new T.Group();
    K.at(K.cyl(0.08, 0.08, 3, 'brass', 10), 0, 1.9, 0, g);
    K.at(K.cyl(0.32, 0.32, 0.4, 'copper', 18), 0, 0.2, 0, g);
    K.at(K.box(0.7, 0.12, 0.5, 'brass'), 0, 0, 0, g);
    ctx.scene.add(g);
    const st = { x: 0, y: 3, tx: 0, ty: 3, hit: 0 };
    g.position.set(0, 3, 0);
    ctx.onFrame((dt, t) => {
      st.x += (st.tx - st.x) * K.f(dt, 7);
      if (st.hit > 0) { st.hit -= dt; }
      const dy = st.hit > 0 ? Math.sin((1 - st.hit / 0.45) * Math.PI) * -0.9 : 0;
      if (ctx.reduce || Math.floor(t * 12) !== Math.floor((t - dt) * 12)) g.position.set(st.x, st.ty + dy, st.z || 0);
    });
    return {
      group: g,
      park(x, y, z) { st.tx = x; st.ty = y; st.z = z || 0; },
      strike(x, y, z) { st.tx = x; st.ty = y + 1.15; st.z = z || 0; if (!ctx.reduce) st.hit = 0.45; },
    };
  }

  // One sentence row on a bench, driven by chips. cfg.build(state) -> { tokens, keys, text?, roles?, tag, pop?, en?, note }
  function chipScene(ctx, cfg) {
    const K = kit(ctx);
    ctx.backdrop({ center: K.V(0, 0, -2) });
    const S = stageRow(ctx, K, { pos: K.V(0, 0, 0) });
    const fitBench = bench(ctx, K);
    const tag = K.tag('', K.V(0, 1.4, 0), 'q');
    const st = Object.assign({}, cfg.state);
    let first = true;
    const out = K.readout();
    function render() {
      const b = cfg.build(st);
      const size = S.show(b.tokens, b.keys, { snap: first, text: b.text, roles: b.roles, cap: b.cap, tight: b.tight });
      fitBench(size, S.lines);
      ctx.fit(Math.max(7.5, size.w + 2), 4.1 + size.h, K.V(0, 0.45 - (S.lines - 1) * 0.62, 0), K.V(0, 0.48, 1));
      // the tag points at the block the rule changes, and its added ending is picked out
      const pk = b.pop && b.pop.find(k => S.keys.includes(k));
      if (pk) { const p = S.at(pk); tag.pos.set(p.x, p.y + 1.3, p.z); tag.to = K.V(p.x, p.y + 0.44, p.z); }
      else { tag.pos.set(0, 1.4, 0); tag.to = null; }
      tag.el.classList.toggle('lead', !!pk && !!b.tag);
      const th = b.tag || '';
      tag.set(/</.test(th) ? th : th.replace(/(\+\s*)(\S+)\s*$/, '$1<em>$2</em>'));
      if (!first && b.pop) S.pop(b.pop);
      first = false;
      const s = S.sentence();
      out.innerHTML = `<span class="de">${s}</span> ${say(s)}${b.en ? ` <span>· ${b.en}</span>` : ''}<br>${b.note || ''}`;
    }
    cfg.chips.forEach(c => K.chips(c.label, c.opts, st[c.key], v => { st[c.key] = v; render(); }));
    render();
    K.onPortrait(render);
  }

  window.GK = { kit, cap, attr, say, ex, table, R, gear, makeFigure, stageRow, bench, arc, piston, chipScene };
})();
