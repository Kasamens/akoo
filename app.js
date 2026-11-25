/* Akoo: scene registry + shared Three.js engine for the A1 to B1 German path.
 *
 * SCENE CONTRACT (scenes/*.js call this):
 *   MM.register({
 *     id: 'nebensaetze',               // url hash, ascii-hyphen
 *     day: 1, week: 1,                 // day = study week number (sort + "Wk n"; 0 = intro), week = level group (0 start, 1 A1, 2 A2, 3 B1)
 *     title: 'Nebensätze',
 *     tagline: 'One sentence: what the rule says.',
 *     prompt: 'Short instruction for the interactive, shown above the stage.',
 *     body: '<section>...</section>',  // HTML explainer below the stage; a <div data-quiz></div> gets the quiz
 *     quiz: [ ...questions ],          // see quiz() below
 *     mount(ctx) { ... return { dispose() {} } }  // dispose optional
 *   });
 *
 * ctx = {
 *   THREE, scene, camera, renderer, host, controls, colors, css, reduce, phone,
 *   onFrame(fn(dt, t)), onTheme(fn()), fit(w, h, target?, dir?), tag(html), place(el, vec3),
 *   twos(t)                         -> t quantised to 12 fps ("animating on twos")
 *   toon(color)                     -> painterly cel-shaded ShaderMaterial (color = token key or hex)
 *   solid(geometry, color, opts?)   -> toon mesh with an inverted-hull ink outline child
 *   wordBlock(word, role)           -> { group, set(word, role), word, role, width }
 *   words(spec)                     -> row of word blocks; row.arrange(keys, opts) moves them with springs
 *   pop(target)                     -> smear-stretch + painted sparks + speed line on a block or mesh
 *   backdrop()                      -> painted gradient sky sphere + drifting light motes
 *   say(text)                       -> speak German with a de-DE voice (buttons hidden if none)
 *   quiz(el, questions)             -> render a checked-in-page quiz
 * }
 * Everything added to ctx.scene is disposed automatically on unmount, as are overlay tags and controls.
 */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const phone = Math.min(window.innerWidth, window.innerHeight) < 600;
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const scenes = [];
  window.MM = { register: s => scenes.push(s) };

  const host = document.getElementById('stage');
  const controls = document.getElementById('controls');
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, phone ? 1.5 : 2));
  renderer.setClearColor(0x000000, 0);
  host.prepend(renderer.domElement);

  // painted grain + vignette over the stage (no post-processing pass needed)
  (function grainOverlay() {
    const c = document.createElement('canvas'); c.width = c.height = 160;
    const g = c.getContext('2d'), img = g.createImageData(160, 160);
    for (let i = 0; i < img.data.length; i += 4) { const v = Math.random() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 34; }
    g.putImageData(img, 0, 0);
    const o = document.createElement('div'); o.className = 'grain'; o.setAttribute('aria-hidden', 'true');
    o.style.backgroundImage = `radial-gradient(ellipse at 50% 45%, transparent 55%, var(--vignette) 100%), url(${c.toDataURL()})`;
    host.appendChild(o);
  })();

  const camera = new THREE.PerspectiveCamera(38, 2, 0.1, 500);
  let scene = new THREE.Scene();
  const colors = {};
  const TOKENS = {
    bg: '--bg', fg: '--fg', muted: '--muted', line: '--line', accent: '--accent', warm: '--warm', bad: '--bad', good: '--good',
    c1: '--c1', c2: '--c2', c3: '--c3', c4: '--c4', neutral: '--neutral',
    ink: '--ink', shade: '--shade', brass: '--brass', copper: '--copper', wood: '--wood', paper: '--paper',
    subj: '--subj', verb: '--verb', verb2: '--verb2', obj: '--obj', conn: '--conn', skyTop: '--sky-top', skyLow: '--sky-low',
  };
  function readColors() { for (const k in TOKENS) colors[k] = new THREE.Color(css(TOKENS[k]) || '#888'); }
  readColors();

  let frameFns = [], themeFns = [], tags = [], anims = [], current = null, fitBox = null;
  let W = 1, H = 1;
  const camBase = new THREE.Vector3();

  function addLights(s) {
    s.add(new THREE.HemisphereLight(0xffffff, 0x445566, 0.85));
    const d = new THREE.DirectionalLight(0xffffff, 0.75); d.position.set(4, 10, 6); s.add(d);
  }

  function fitCamera() {
    if (!fitBox) return;
    const { w, h, target } = fitBox;
    const vfov = THREE.MathUtils.degToRad(camera.fov);
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * camera.aspect);
    const dist = Math.max((h / 2) / Math.tan(vfov / 2), (w / 2) / Math.tan(hfov / 2)) * 1.12;
    const dir = (fitBox.dir || new THREE.Vector3(0, 0.45, 1)).clone().normalize();
    camera.position.copy(target).addScaledVector(dir, dist);
    camera.lookAt(target);
    camBase.copy(camera.position); fitBox.dist = dist;
  }

  function resize() {
    W = host.clientWidth; H = host.clientHeight;
    renderer.setSize(W, H, false);
    camera.aspect = W / H; camera.updateProjectionMatrix();
    fitCamera();
  }
  new ResizeObserver(resize).observe(host);

  // ---------- painterly toon shading ----------
  const NOISE = `
    float hash(vec3 p) { p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3)); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
    float vnoise(vec3 x) {
      vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
      return mix(mix(mix(hash(i), hash(i + vec3(1.0, 0.0, 0.0)), f.x), mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
                 mix(mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x), mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y), f.z);
    }`;
  const TOON_V = `
    varying vec3 vN; varying vec3 vW;
    void main() {
      vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz;
      vN = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
      gl_Position = projectionMatrix * viewMatrix * w;
    }`;
  const TOON_F = `
    uniform vec3 uColor; uniform vec3 uShade; uniform vec3 uWarm; uniform float uGrain; uniform float uRim; uniform float uEmit;
    varying vec3 vN; varying vec3 vW;
    ${NOISE}
    void main() {
      vec3 n = normalize(vN);
      if (!gl_FrontFacing) n = -n;
      vec3 L = normalize(vec3(0.45, 0.85, 0.4));
      float brush = vnoise(vW * vec3(5.0, 1.3, 5.0) + n * 2.0) - 0.5;      // stretched brush strokes wobble the band edges
      float d = dot(n, L) + brush * 0.24;
      vec3 sh = mix(uColor * 0.4, uShade, 0.42);                         // cool teal-violet shadow
      vec3 mid = mix(uColor * 0.84, uShade, 0.07);
      vec3 lit = mix(uColor, uWarm, 0.2) * 1.06;                         // warm amber light
      vec3 c = d < 0.05 ? sh : (d < 0.55 ? mid : lit);
      vec3 V = normalize(cameraPosition - vW);
      float r = 1.0 - max(dot(n, V), 0.0);
      c = mix(c, uWarm * 1.1, smoothstep(0.64, 0.7, r) * uRim * 0.55);    // warm rim light
      float paper = vnoise(vW * 23.0) * 0.5 + vnoise(vW * 6.0) * 0.5;
      c *= 0.93 + paper * 0.13;
      c *= 1.0 + (hash(vec3(floor(gl_FragCoord.xy), 3.0)) - 0.5) * uGrain;
      c = mix(c, uColor * 1.25, uEmit);
      gl_FragColor = vec4(c, 1.0);
    }`;
  const INK_V = `
    uniform float uT; uniform float uMode;
    void main() {
      vec3 dir = uMode < 0.5 ? normal : (uMode < 1.5 ? sign(position) : normalize(position + vec3(0.0001)));
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position + dir * uT, 1.0);
    }`;
  const INK_F = `uniform vec3 uInk; void main() { gl_FragColor = vec4(uInk, 1.0); }`;

  let tracked = []; // materials that follow theme tokens
  const resolve = c => (typeof c === 'string' && colors[c]) ? colors[c].clone() : new THREE.Color(c);
  function toon(color) {
    const m = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: resolve(color) }, uShade: { value: colors.shade.clone() }, uWarm: { value: colors.warm.clone() },
        uGrain: { value: 0.09 }, uRim: { value: 1 }, uEmit: { value: 0 },
      },
      vertexShader: TOON_V, fragmentShader: TOON_F,
    });
    m.userData.key = typeof color === 'string' && colors[color] ? color : null;
    m.userData.toon = true;
    m.setColor = c => { m.userData.key = typeof c === 'string' && colors[c] ? c : null; m.uniforms.uColor.value.copy(resolve(c)); };
    tracked.push(m);
    return m;
  }
  function inkMat(geometry, scale) {
    const t = geometry.type;
    const mode = /Box/.test(t) ? 1 : /Cylinder|Cone/.test(t) ? 2 : 0;
    const m = new THREE.ShaderMaterial({
      uniforms: { uT: { value: (phone ? 0.022 : 0.032) * (scale || 1) * (0.85 + Math.random() * 0.3) }, uMode: { value: mode }, uInk: { value: colors.ink.clone() } },
      vertexShader: INK_V, fragmentShader: INK_F, side: THREE.BackSide,
    });
    m.userData.ink = true; tracked.push(m);
    return m;
  }
  function solid(geometry, color, opts) {
    opts = opts || {};
    const mesh = new THREE.Mesh(geometry, toon(color));
    if (opts.ink !== false) {
      const hull = new THREE.Mesh(geometry, inkMat(geometry, opts.ink));
      hull.userData.hull = true; hull.raycast = () => {};
      mesh.add(hull);
    }
    return mesh;
  }
  function retheme() {
    tracked.forEach(m => {
      if (m.userData.toon) {
        if (m.userData.key) m.uniforms.uColor.value.copy(colors[m.userData.key]);
        m.uniforms.uShade.value.copy(colors.shade); m.uniforms.uWarm.value.copy(colors.warm);
      } else if (m.userData.ink) m.uniforms.uInk.value.copy(colors.ink);
      else if (m.userData.sky) { m.uniforms.uTop.value.copy(colors.skyTop); m.uniforms.uLow.value.copy(colors.skyLow); m.uniforms.uGlow.value.copy(colors.warm); }
      else if (m.userData.key && m.color) m.color.copy(colors[m.userData.key]);
    });
  }

  // ---------- word blocks ----------
  const ROLE = { subj: 'subj', verb: 'verb', verb2: 'verb2', obj: 'obj', conn: 'conn', punct: 'brass', plain: 'wood', bad: 'bad', e: 'subj', en: 'verb2', er: 'obj', es: 'conn', em: 'verb' };
  const BH = 0.8, BD = 0.5, PX = 128, WPP = (BH * 0.72) / PX; // world units per canvas pixel
  const live = []; // blocks to repaint when web fonts finish loading
  const FONT = '700 78px Inter, "Helvetica Neue", Arial, sans-serif';
  function wordBlock(word, role) {
    const group = new THREE.Group(), pivot = new THREE.Group(); group.add(pivot);
    const canvas = document.createElement('canvas'); canvas.height = PX;
    const g2 = canvas.getContext('2d');
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4; tex.minFilter = THREE.LinearFilter;
    const faceMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false });
    let box = null, face = null, trim = null;
    const api = { group, pivot, word: null, role: null, width: 1, mesh: null };
    function paint() {
      g2.font = FONT;
      const tw = Math.ceil(g2.measureText(api.word).width);
      canvas.width = Math.max(64, tw + 40); canvas.height = PX;
      g2.font = FONT; g2.textAlign = 'center'; g2.textBaseline = 'middle';
      g2.clearRect(0, 0, canvas.width, PX);
      // painted lettering: a dark ink offset, then cream paint with a dry-brush edge
      g2.fillStyle = 'rgba(12,14,20,0.55)'; g2.fillText(api.word, canvas.width / 2 + 3, PX / 2 + 5);
      g2.fillStyle = api.role === 'punct' ? '#17120d' : '#f7ecd4'; g2.fillText(api.word, canvas.width / 2, PX / 2 + 2);
      g2.globalCompositeOperation = 'destination-out';
      for (let i = 0; i < 26; i++) { g2.fillStyle = `rgba(0,0,0,${0.12 + Math.random() * 0.2})`; g2.fillRect(Math.random() * canvas.width, Math.random() * PX, 2 + Math.random() * 18, 1.5); }
      g2.globalCompositeOperation = 'source-over';
      tex.needsUpdate = true;
      return canvas.width * WPP;
    }
    api.set = (w, r) => {
      if (w === api.word && (r || api.role) === api.role && box) return api;
      const roleChanged = r && r !== api.role;
      api.word = w; if (r) api.role = r;
      const fw = paint();
      const bw = Math.max(0.8, fw + 0.34);
      if (!box || Math.abs(bw - api.width) > 1e-3) {
        api.width = bw;
        if (box) { pivot.remove(box); box.geometry.dispose(); }
        if (face) { pivot.remove(face); face.geometry.dispose(); }
        if (trim) { pivot.remove(trim); trim.geometry.dispose(); }
        box = solid(new THREE.BoxGeometry(bw, BH, BD), ROLE[api.role] || 'wood');
        trim = solid(new THREE.BoxGeometry(bw + 0.06, 0.12, BD + 0.06), 'brass', { ink: 0.6 });
        trim.position.y = -BH / 2 - 0.02;
        face = new THREE.Mesh(new THREE.PlaneGeometry(fw, BH * 0.72), faceMat);
        face.position.z = BD / 2 + 0.006;
        pivot.add(box, trim, face);
        api.mesh = box;
      } else if (roleChanged) box.material.setColor(ROLE[api.role] || 'wood');
      face.material = faceMat;
      return api;
    };
    api.set(word, role);
    live.push(api);
    return api;
  }
  // word-block lettering is measured on a canvas, so remount once the web font is in (keeps block widths right)
  let fontReady = !document.fonts;
  if (document.fonts) document.fonts.load(FONT, 'Aä').then(() => { if (!fontReady) { fontReady = true; if (current) show(current.s.id, true); } }).catch(() => { fontReady = true; });

  // springs with overshoot, displayed "on twos" (12 fps) for a hand-animated feel
  function words(spec) {
    const blocks = {}, order = [];
    const root = new THREE.Group();
    spec.forEach(([key, word, role]) => {
      const b = wordBlock(word, role);
      b.base = word; b.key = key;
      b.st = { p: new THREE.Vector3(0, 3, 0), v: new THREE.Vector3(), tp: new THREE.Vector3(0, 3, 0), s: 0, sv: 0, ts: 0 };
      b.group.scale.setScalar(0.001);
      root.add(b.group); blocks[key] = b; order.push(key);
    });
    scene.add(root);
    let acc = 0;
    const row = { root, blocks, size: { w: 1, h: 1 } };
    row.arrange = (keys, o) => {
      o = o || {};
      const gap = o.gap != null ? o.gap : 0.16, maxW = o.maxW || 1e9, lh = BH + 0.45;
      const isTight = k => blocks[k].role === 'punct' || !!(o.tight && o.tight.includes(k));
      // capitalise the first word of the sentence, keep the rest as written
      keys.forEach((k, i) => {
        const b = blocks[k], base = (o.text && o.text[k]) || b.base;
        b.base = base;
        const w = (i === 0 && o.cap !== false) ? base.charAt(0).toUpperCase() + base.slice(1) : base;
        b.set(w, o.roles && o.roles[k]);
      });
      const lines = [[]]; let lw = 0;
      keys.forEach(k => {
        const b = blocks[k], w = b.width;
        const tight = isTight(k);
        const need = (lines[lines.length - 1].length ? (tight ? 0.04 : gap) : 0) + w;
        if (lw + need > maxW && lines[lines.length - 1].length && !tight) { lines.push([]); lw = 0; }
        const cur = lines[lines.length - 1];
        lw += (cur.length ? (tight ? 0.04 : gap) : 0) + w;
        cur.push(k);
      });
      let wmax = 0;
      lines.forEach((ln, li) => {
        let tot = 0; ln.forEach((k, i) => tot += blocks[k].width + (i ? (isTight(k) ? 0.04 : gap) : 0));
        wmax = Math.max(wmax, tot);
        let x = -tot / 2;
        ln.forEach((k, i) => {
          const b = blocks[k];
          if (i) x += isTight(k) ? 0.04 : gap;
          b.st.tp.set(x + b.width / 2, -li * lh - (b.role === 'punct' ? BH * 0.3 : 0), 0);
          b.st.ts = b.role === 'punct' ? 0.55 : 1;
          if (o.lift && o.lift[k]) b.st.tp.y += o.lift[k];
          x += b.width;
        });
      });
      order.forEach(k => { if (!keys.includes(k)) { const b = blocks[k]; b.st.tp.y = b.st.p.y + 1.6; b.st.ts = 0; } });
      if (reduce || o.snap) order.forEach(k => { const st = blocks[k].st; st.p.copy(st.tp); st.s = st.ts; st.v.set(0, 0, 0); st.sv = 0; apply(blocks[k]); });
      row.size = { w: wmax, h: lines.length * lh };
      return row.size;
    };
    function apply(b) { b.group.position.copy(b.st.p); b.group.scale.setScalar(Math.max(0.001, b.st.s)); b.group.visible = b.st.s > 0.01; }
    onFrameInternal(dt => {
      const K = 140, D = 13;
      order.forEach(k => {
        const st = blocks[k].st;
        const a = st.tp.clone().sub(st.p).multiplyScalar(K).addScaledVector(st.v, -D);
        st.v.addScaledVector(a, dt); st.p.addScaledVector(st.v, dt);
        st.sv += ((st.ts - st.s) * K - st.sv * D) * dt; st.s += st.sv * dt;
      });
      acc += dt;
      if (reduce || acc >= 1 / 12) { acc = 0; order.forEach(k => apply(blocks[k])); }
    });
    return row;
  }

  // a rule "fires": smear stretch, painted spark strokes, short ink speed line
  function pop(target, o) {
    o = o || {};
    const obj = target.pivot || target.group || target;
    if (reduce) {
      // no motion: a brief paint-colour flash instead
      const m = target.mesh && target.mesh.material;
      if (m && m.uniforms) { m.uniforms.uEmit.value = 0.6; anims.push({ t: 0, d: 0.5, f: (k) => { m.uniforms.uEmit.value = 0.6 * (1 - k); } }); }
      return;
    }
    const s0 = obj.scale.clone();
    anims.push({ t: 0, d: 0.42, f: k => {
      const q = Math.floor(k * 10) / 10; // stepped
      const sx = q < 0.25 ? 1 + 0.4 * (q / 0.25) : 1 + 0.4 * Math.exp(-(q - 0.25) * 9) * Math.cos((q - 0.25) * 18);
      const sy = 2 - sx;
      obj.scale.set(s0.x * sx, s0.y * Math.max(0.6, sy), s0.z);
      if (k >= 1) obj.scale.copy(s0);
    } });
    const wp = new THREE.Vector3(); obj.getWorldPosition(wp);
    const col = colors.accent.clone();
    const n = phone ? 4 : 6;
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * Math.PI * 2 + Math.random() * 0.5;
      const m = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.06), new THREE.MeshBasicMaterial({ color: col, transparent: true, side: THREE.DoubleSide, depthTest: false }));
      m.rotation.z = ang; m.position.copy(wp); m.renderOrder = 5;
      const dir = new THREE.Vector3(Math.cos(ang), Math.sin(ang), 0.2);
      scene.add(m);
      anims.push({ t: 0, d: 0.45, f: k => {
        const q = Math.floor(k * 6) / 6;
        m.position.copy(wp).addScaledVector(dir, 0.55 + q * (o.spread || 0.9));
        m.material.opacity = 1 - q;
        if (k >= 1) { scene.remove(m); m.geometry.dispose(); m.material.dispose(); }
      } });
    }
    const line = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.05), new THREE.MeshBasicMaterial({ color: colors.ink.clone(), transparent: true, opacity: 0.8, depthTest: false }));
    line.position.copy(wp).add(new THREE.Vector3(-(target.width || 1) / 2 - 0.8, 0.12, 0.3)); line.renderOrder = 4;
    scene.add(line);
    anims.push({ t: 0, d: 0.3, f: k => { line.material.opacity = 0.8 * (1 - k); line.scale.x = 1 - k * 0.6; if (k >= 1) { scene.remove(line); line.geometry.dispose(); line.material.dispose(); } } });
  }

  // painted sky sphere + drifting motes
  function backdrop(o) {
    o = o || {};
    const m = new THREE.ShaderMaterial({
      uniforms: { uTop: { value: colors.skyTop.clone() }, uLow: { value: colors.skyLow.clone() }, uGlow: { value: colors.warm.clone() } },
      vertexShader: `varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `uniform vec3 uTop; uniform vec3 uLow; uniform vec3 uGlow; varying vec3 vD; ${NOISE}
        void main(){
          float y = vD.y;
          float strokes = vnoise(vec3(vD.x * 3.0, y * 14.0, vD.z * 3.0)) * 0.5 + vnoise(vD * 9.0) * 0.5;
          vec3 c = mix(uLow, uTop, smoothstep(-0.25, 0.55, y + (strokes - 0.5) * 0.18));
          c = mix(c, uGlow, smoothstep(0.25, 0.0, abs(y - 0.02 + (strokes - 0.5) * 0.06)) * 0.28);
          c *= 0.92 + strokes * 0.14;
          gl_FragColor = vec4(c, 1.0);
        }`,
      side: THREE.BackSide, depthWrite: false,
    });
    m.userData.sky = true; tracked.push(m);
    const sky = new THREE.Mesh(new THREE.SphereGeometry(120, 32, 16), m);
    sky.renderOrder = -10; scene.add(sky);
    const N = phone ? 36 : 90, R = o.radius || 9;
    const pos = new Float32Array(N * 3), seed = [];
    for (let i = 0; i < N; i++) { seed.push(Math.random() * 100); pos[i * 3] = (Math.random() - 0.5) * R * 2; pos[i * 3 + 1] = Math.random() * R * 0.8 - 1; pos[i * 3 + 2] = (Math.random() - 0.5) * R * 1.2 - 1; }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pm = new THREE.PointsMaterial({ color: colors.warm.clone(), size: phone ? 0.07 : 0.06, transparent: true, opacity: 0.75, depthWrite: false });
    pm.userData.key = 'warm'; tracked.push(pm);
    const motes = new THREE.Points(g, pm); motes.position.copy(o.center || new THREE.Vector3()); scene.add(motes);
    if (!reduce) onFrameInternal((dt, t) => {
      const q = Math.floor(t * 12) / 12;
      for (let i = 0; i < N; i++) { pos[i * 3 + 1] += 0.08 * dt; pos[i * 3] += Math.sin(q * 0.7 + seed[i]) * 0.004; if (pos[i * 3 + 1] > R * 0.8) pos[i * 3 + 1] = -1; }
      g.attributes.position.needsUpdate = true;
    });
    return { sky, motes };
  }

  // ---------- speech ----------
  let deVoice = null;
  function pickVoice() {
    if (!('speechSynthesis' in window)) return;
    const vs = window.speechSynthesis.getVoices();
    deVoice = vs.find(v => /^de[-_]DE$/i.test(v.lang)) || vs.find(v => /^de([-_]|$)/i.test(v.lang)) || null;
    document.documentElement.classList.toggle('has-de', !!deVoice);
  }
  if ('speechSynthesis' in window) {
    pickVoice();
    if (window.speechSynthesis.addEventListener) window.speechSynthesis.addEventListener('voiceschanged', pickVoice);
    else window.speechSynthesis.onvoiceschanged = pickVoice;
  }
  function say(text) {
    if (!deVoice) return false;
    const s = window.speechSynthesis; s.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.voice = deVoice; u.lang = deVoice.lang || 'de-DE'; u.rate = 0.9;
    s.speak(u); return true;
  }
  document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('.say[data-say]'); if (b) say(b.dataset.say); });

  // ---------- quiz ----------
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const gap = s => esc(s).replace(/___/g, '<span class="gap" aria-label="Lücke">&nbsp;&nbsp;&nbsp;&nbsp;</span>');
  function shuffle(a, seed) { a = a.slice(); let x = seed || 7; for (let i = a.length - 1; i > 0; i--) { x = (x * 9301 + 49297) % 233280; const j = Math.floor(x / 233280 * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function quiz(el, qs, lessonId) {
    let score = 0, done = 0;
    el.innerHTML = `<ol class="quiz"></ol><div class="qfoot"><p class="score" aria-live="polite">0 / ${qs.length} richtig</p><p class="best"></p><button type="button" class="btn ghost qreset">Nochmal</button></div>`;
    const ol = el.querySelector('.quiz'), scoreEl = el.querySelector('.score'), bestEl = el.querySelector('.best');
    el.querySelector('.qreset').addEventListener('click', () => quiz(el, qs, lessonId));
    const P = lessonId && window.AkooProgress;
    const showBest = l => { bestEl.textContent = l && l.tries ? `Best: ${l.best}/${qs.length} · ${l.tries} ${l.tries === 1 ? 'try' : 'tries'}${l.done ? ' · ✓ finished' : ''}` : ''; };
    if (P) showBest(P.lesson(lessonId));
    const finish = (li, ok, q) => {
      done++; if (ok) score++;
      li.classList.add(ok ? 'right' : 'wrong');
      if (ok && !reduce) { li.classList.remove('splash'); void li.offsetWidth; li.classList.add('splash'); }
      const why = li.querySelector('.why');
      why.innerHTML = `<strong>${ok ? 'Richtig.' : 'Nicht ganz.'}</strong> ${q.why}`;
      why.hidden = false;
      scoreEl.textContent = `${score} / ${qs.length} richtig` + (done === qs.length ? (score === qs.length ? ' · perfekt!' : ' · try again with “Nochmal”') : '');
      if (P && done === qs.length) showBest(P.quiz(lessonId, score));
    };
    qs.forEach((q, qi) => {
      const li = document.createElement('li'); li.className = 'q';
      li.innerHTML = `<p class="qt">${gap(q.q)}</p>${q.hint ? `<p class="qh">${esc(q.hint)}</p>` : ''}<div class="opts"></div><p class="why" hidden></p>`;
      const opts = li.querySelector('.opts');
      if (q.type === 'order') {
        const built = document.createElement('div'); built.className = 'built'; built.setAttribute('aria-label', 'Your sentence');
        const pool = document.createElement('div'); pool.className = 'pool';
        const row = document.createElement('div'); row.className = 'qrow';
        const check = Object.assign(document.createElement('button'), { type: 'button', className: 'btn', textContent: 'Prüfen' });
        const clear = Object.assign(document.createElement('button'), { type: 'button', className: 'btn ghost', textContent: 'Zurück' });
        let locked = false;
        let tiles = shuffle(q.tiles, qi * 31 + q.tiles.length);
        if (tiles.join(' ') === [].concat(q.a)[0]) tiles = tiles.slice(1).concat(tiles[0]);
        tiles.forEach(t => {
          const b = Object.assign(document.createElement('button'), { type: 'button', className: 'opt tile', textContent: t });
          b.addEventListener('click', () => { if (locked) return; (b.parentNode === pool ? built : pool).appendChild(b); });
          pool.appendChild(b);
        });
        clear.addEventListener('click', () => { if (locked) return; [...built.children].forEach(b => pool.appendChild(b)); });
        check.addEventListener('click', () => {
          if (locked || !built.children.length) return;
          locked = true;
          const got = [...built.children].map(b => b.textContent).join(' ');
          const answers = Array.isArray(q.a) ? q.a : [q.a];
          const ok = answers.includes(got);
          check.disabled = clear.disabled = true;
          finish(li, ok, ok ? q : Object.assign({}, q, { why: `Correct order: <em>${esc(answers[0])}</em>. ${q.why}` }));
        });
        row.append(check, clear);
        opts.append(built, pool, row);
      } else {
        // options are shown in a shuffled (but stable) order so the answer isn't always in the same place
        const order = shuffle(q.opts.map((_, i) => i).filter(i => i !== q.a), qi * 17 + q.q.length);
        order.splice((qi * 2 + q.q.length) % q.opts.length, 0, q.a);
        const btns = {};
        order.forEach(i => {
          const o = q.opts[i];
          const b = Object.assign(document.createElement('button'), { type: 'button', className: 'opt', textContent: o });
          btns[i] = b;
          b.addEventListener('click', () => {
            if (li.dataset.done) return; li.dataset.done = '1';
            b.classList.add(i === q.a ? 'is-right' : 'is-wrong');
            btns[q.a].classList.add('is-right');
            [...opts.children].forEach(x => x.setAttribute('aria-disabled', 'true'));
            finish(li, i === q.a, q);
          });
          opts.appendChild(b);
        });
      }
      ol.appendChild(li);
    });
  }

  const v = new THREE.Vector3();
  function onFrameInternal(f) { frameFns.push(f); }
  const ctx = {
    THREE, renderer, camera, host, controls, colors, css, reduce, phone,
    get scene() { return scene; },
    onFrame: f => frameFns.push(f),
    onTheme: f => themeFns.push(f),
    fit(w, h, target, dir) { fitBox = { w, h, target: target || new THREE.Vector3(), dir }; fitCamera(); },
    tag(html) { const el = document.createElement('div'); el.className = 'tag'; el.innerHTML = html; host.appendChild(el); tags.push(el); return el; },
    place(el, vec) {
      v.copy(vec).project(camera);
      const hidden = v.z > 1;
      el.style.left = ((v.x + 1) / 2 * W) + 'px';
      el.style.top = ((1 - v.y) / 2 * H) + 'px';
      el.style.visibility = hidden ? 'hidden' : '';
    },
    twos: t => Math.floor(t * 12) / 12,
    toon, solid, wordBlock, words, pop, backdrop, say, quiz,
    get portrait() { return W / H < 1.05; },
  };

  function disposeScene(s) {
    s.traverse(o => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { if (m.map) m.map.dispose(); m.dispose(); });
    });
  }

  function unmount() {
    if (current && current.handle && current.handle.dispose) { try { current.handle.dispose(); } catch (e) { console.error(e); } }
    frameFns = []; themeFns = []; anims = []; tracked = []; live.length = 0;
    tags.forEach(t => t.remove()); tags = [];
    controls.innerHTML = '';
    disposeScene(scene);
    scene = new THREE.Scene(); addLights(scene);
    fitBox = null;
    camera.position.set(0, 4, 12); camera.lookAt(0, 0, 0);
  }

  // ---------- nav + routing ----------
  const nav = document.getElementById('nav');
  const WEEKS = { 0: "Start here", 1: "A1 · Beginner", 2: "A2 · Elementary", 3: "B1 · Intermediate" };
  const wk = s => s.day ? `Wk ${s.day}` : "Intro";

  function buildNav() {
    scenes.sort((a, b) => a.day - b.day);
    let html = '';
    Object.keys(WEEKS).map(Number).forEach(w => {
      html += `<div class="wk" data-week="${w}"><span class="eyebrow">${WEEKS[w]}<span class="cnt"></span></span><ol>`;
      scenes.filter(s => s.week === w).forEach(s => { html += `<li><a href="#${s.id}" data-id="${s.id}"><span class="d">${wk(s)}</span><span class="t">${s.title}</span><span class="mk" aria-hidden="true"></span></a></li>`; });
      html += '</ol></div>';
    });
    nav.innerHTML = html;
    paintProgress();
  }

  // ✓ = finished (quiz 4/5+), • = opened but not finished; level headings show "finished / total"
  function paintProgress() {
    const P = window.AkooProgress; if (!P) return;
    nav.querySelectorAll('a[data-id]').forEach(a => {
      const l = P.lesson(a.dataset.id), done = !!(l && l.done), seen = !!(l && l.seen);
      a.classList.toggle('is-done', done);
      a.classList.toggle('is-started', seen && !done);
      a.querySelector('.mk').textContent = done ? '✓' : seen ? '•' : '';
      const t = a.querySelector('.t').textContent;
      a.setAttribute('aria-label', `${a.querySelector('.d').textContent} ${t}${done ? ', finished' : seen ? ', started' : ''}`);
    });
    nav.querySelectorAll('.wk[data-week]').forEach(w => {
      const cnt = w.querySelector('.cnt'), links = w.querySelectorAll('a[data-id]');
      if (w.dataset.week === '0') { cnt.textContent = ''; return; }
      const n = [...links].filter(a => a.classList.contains('is-done')).length;
      cnt.textContent = n ? ` · ${n}/${links.length}` : '';
    });
  }
  if (window.AkooProgress) window.AkooProgress.onChange(() => { paintProgress(); if (current) paintContinue(current.s); });

  // "Continue" link on the intro page, pointing at the last lesson opened
  function paintContinue(s) {
    const head = document.querySelector('main .head'), old = document.querySelector('.continue');
    if (old) old.remove();
    const P = window.AkooProgress, last = P && P.get().last;
    if (s.id !== 'akoo' || !last) return;
    const t = scenes.find(x => x.id === last.id);
    if (!t || t.id === 'akoo') return;
    head.insertAdjacentHTML('beforeend', `<p class="continue"><a href="#${t.id}">Continue where you left off: ${wk(t)} · ${t.title} →</a></p>`);
  }

  function show(id, remount) {
    const s = scenes.find(x => x.id === id) || scenes[0];
    if (!s) return;
    if (remount && current && current.s === s) {
      // only the 3D stage and controls are rebuilt; the explainer and quiz progress stay as they are
      unmount(); current = { s };
      resize();
      try { current.handle = s.mount(ctx) || {}; } catch (e) { console.error(e); }
      resize();
      return;
    }
    unmount();
    current = { s };
    document.title = `${s.title} · Akoo`;
    document.getElementById('day').textContent = s.day ? `Week ${s.day} · ${WEEKS[s.week] || ""}` : WEEKS[s.week];
    document.getElementById('title').textContent = s.title;
    document.getElementById('tagline').textContent = s.tagline;
    document.getElementById('prompt').textContent = s.prompt || '';
    const body = document.getElementById('body');
    body.innerHTML = s.body || '';
    const qel = body.querySelector('[data-quiz]');
    if (qel && s.quiz) quiz(qel, s.quiz, s.id);
    if (window.AkooProgress) window.AkooProgress.open(s.id, s.id !== 'akoo');
    paintContinue(s);
    nav.querySelectorAll('a[data-id]').forEach(a => a.setAttribute('aria-current', a.dataset.id === s.id ? 'page' : 'false'));
    const mcur = document.getElementById('mcur'); if (mcur) mcur.textContent = `${wk(s)} · ${s.title}`;
    const i = scenes.indexOf(s);
    const prev = scenes[i - 1], next = scenes[i + 1];
    document.getElementById('pager').innerHTML =
      (prev ? `<a href="#${prev.id}">← ${wk(prev)}: ${prev.title}</a>` : '<span></span>') +
      (next ? `<a href="#${next.id}">${wk(next)}: ${next.title} →</a>` : '<span></span>');
    resize();
    try { current.handle = s.mount(ctx) || {}; }
    catch (e) { console.error(e); controls.innerHTML = '<p class="readout">This scene failed to load.</p>'; }
    resize();
  }

  // #lesson or #lesson/section-id (deep link to a section inside a lesson's page)
  function route(smooth) {
    const [id, anchor] = decodeURIComponent(location.hash.slice(1)).split('/');
    if (!(anchor && current && current.s.id === id)) show(id);
    const target = (anchor && document.getElementById(anchor)) || document.getElementById('top');
    requestAnimationFrame(() => target.scrollIntoView({ behavior: smooth && !reduce ? 'smooth' : 'auto', block: 'start' }));
  }
  window.addEventListener('hashchange', () => route(true));
  // same-hash clicks fire no hashchange: re-run the route so the link still scrolls
  document.addEventListener('click', e => { const l = e.target.closest('a[href^="#"]'); if (l && l.getAttribute('href') === location.hash) { e.preventDefault(); route(true); } });

  // theme
  function themeChanged() { readColors(); retheme(); themeFns.forEach(f => f()); }
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', themeChanged);
  new MutationObserver(themeChanged).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // loop
  let last = performance.now(), t = 0;
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
    for (const f of frameFns) { try { f(dt, t); } catch (e) { console.error(e); frameFns = frameFns.filter(x => x !== f); } }
    for (let i = anims.length - 1; i >= 0; i--) {
      const a = anims[i]; a.t += dt; const k = Math.min(1, a.t / a.d);
      try { a.f(k); } catch (e) { console.error(e); }
      if (k >= 1) anims.splice(i, 1);
    }
    // slow, smooth camera drift (the camera is not on twos)
    if (fitBox && !reduce) {
      const d = (fitBox.dist || 10) * 0.018;
      camera.position.set(camBase.x + Math.sin(t * 0.23) * d, camBase.y + Math.sin(t * 0.17) * d * 0.5, camBase.z);
      camera.lookAt(fitBox.target);
    }
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }

  window.addEventListener('DOMContentLoaded', () => {
    addLights(scene);
    buildNav();
    route(false);
    requestAnimationFrame(frame);
  });
})();
