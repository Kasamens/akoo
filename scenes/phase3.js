/* German in 3D, Phase 3 (weeks 15-16): B1 and exam polish.
 * Uses the engine in app.js and the shared kits from phase1.js / phase2.js (window.GK).
 * Phase goal from the study plan: hold a 10-minute conversation and pass a B1 mock test.
 */
(function () {
  'use strict';
  const { kit, cap, say, ex, table, R, gear, makeFigure, stageRow, bench, arc } = window.GK;
  const PH3_TRY = 'Phase 3 goal: a 10-minute conversation on everyday topics, and a B1 mock test.';

  // =====================================================================
  // Week 15: Zweiteilige Konnektoren
  // =====================================================================
  // lamps: [left, right] brightness 0..1; 'alt' alternates (either/or), 'grow' rises together (je … desto)
  const ZW = {
    entweder: { label: 'entweder … oder', k: ['k1', 'k2'], lamps: 'alt', items: ['Zug', 'Bus'], mean: 'either … or: one of the two, not both',
      t: [['S', 'wir', 'subj'], ['V', 'fahren', 'verb'], ['k1', 'entweder', 'conn'], ['A', 'mit dem Zug', 'obj'], ['k2', 'oder', 'conn'], ['B', 'mit dem Bus', 'obj'], ['d', '.', 'punct']], en: 'We’re going either by train or by bus.' },
    weder: { label: 'weder … noch', k: ['k1', 'k2'], lamps: [0, 0], items: ['Balkon', 'Garten'], mean: 'neither … nor: none of the two',
      t: [['S', 'die Wohnung', 'subj'], ['V', 'hat', 'verb'], ['k1', 'weder', 'conn'], ['A', 'einen Balkon', 'obj'], ['k2', 'noch', 'conn'], ['B', 'einen Garten', 'obj'], ['d', '.', 'punct']], en: 'The flat has neither a balcony nor a garden.' },
    sowohl: { label: 'sowohl … als auch', k: ['k1', 'k2'], lamps: [1, 1], items: ['interessant', 'gut bezahlt'], mean: 'both … and: the two together',
      t: [['S', 'die Stelle', 'subj'], ['V', 'ist', 'verb'], ['k1', 'sowohl', 'conn'], ['A', 'interessant', 'obj'], ['k2', 'als auch', 'conn'], ['B', 'gut bezahlt', 'obj'], ['d', '.', 'punct']], en: 'The job is both interesting and well paid.' },
    nichtnur: { label: 'nicht nur … sondern auch', k: ['k1', 'k2'], lamps: [0.75, 1.25], items: ['billig', 'sauber'], mean: 'not only … but also: the second point adds weight',
      t: [['S', 'das Hotel', 'subj'], ['V', 'war', 'verb'], ['k1', 'nicht nur', 'conn'], ['A', 'billig', 'obj'], ['c', ',', 'punct'], ['k2', 'sondern auch', 'conn'], ['B', 'sehr sauber', 'obj'], ['d', '.', 'punct']], en: 'The hotel was not only cheap but also very clean.' },
    zwar: { label: 'zwar … aber', k: ['k1', 'k2'], lamps: [0.35, 1], items: ['klein', 'hell'], mean: 'admittedly … but: a weak point, then the stronger one',
      t: [['S', 'die Wohnung', 'subj'], ['V', 'ist', 'verb'], ['k1', 'zwar', 'conn'], ['A', 'klein', 'obj'], ['c', ',', 'punct'], ['k2', 'aber', 'conn'], ['S2', 'sie', 'subj'], ['V2', 'ist', 'verb'], ['B', 'sehr hell', 'obj'], ['d', '.', 'punct']], en: 'The flat is small, admittedly, but it is very bright.' },
    je: { label: 'je … desto', k: ['k1', 'k2'], lamps: 'grow', items: ['früher', 'billiger'], mean: 'the … the: one thing grows with the other',
      t: [['k1', 'je', 'conn'], ['A', 'früher', 'obj'], ['S', 'wir', 'subj'], ['V', 'buchen', 'verb'], ['c', ',', 'punct'], ['k2', 'desto', 'conn'], ['B', 'billiger', 'obj'], ['V2', 'ist', 'verb'], ['S2', 'der Flug', 'subj'], ['d', '.', 'punct']], en: 'The earlier we book, the cheaper the flight.', note: 'je-clause: verb at the end; desto + comparative, then the verb.' },
  };

  MM.register({
    id: 'zweiteilige-konnektoren', day: 15, week: 3,
    title: 'Zweiteilige Konnektoren',
    tagline: 'Two-part connectors link two items or ideas: entweder … oder, weder … noch, sowohl … als auch, nicht nur … sondern auch, zwar … aber, je … desto.',
    prompt: 'Pick a pair. The arc links its two halves, and the two lamps show what the pair means: one, neither, both, or growing together.',
    body: `
<section>
  <p class="rule">Each pair is one idea in two halves: learn them as pairs.</p>
  <p>Two-part connectors make your speaking and writing sound like B1 quickly, and they come up in the exam. Most of them link two words or phrases and change nothing about word order. <b>je … desto</b> is the exception: the je-clause sends its verb to the end, and desto + comparative is followed by the verb.</p>
</section>
<section>
  <h2>Pattern</h2>
  ${table(['Pair', 'Meaning', 'Example'], [
    ['entweder … oder', 'one of two', 'Entweder du kommst mit, oder du bleibst hier.'],
    ['weder … noch', 'neither … nor', 'Ich habe weder Zeit noch Geld.'],
    ['sowohl … als auch', 'both … and', 'Sie spricht sowohl Englisch als auch Spanisch.'],
    ['nicht nur … sondern auch', 'not only … but also', 'Er ist nicht nur nett, sondern auch hilfsbereit.'],
    ['zwar … aber', 'admittedly … but', 'Das Auto ist zwar alt, aber es fährt gut.'],
    ['je … desto', 'the …, the …', `${R('conn', 'Je')} mehr ich ${R('verb', 'übe')}, ${R('conn', 'desto')} besser ${R('verb', 'spreche')} ich.`],
  ])}
</section>
<section>
  <h2>Examples</h2>
  ${ex([
    ['Wir können entweder heute Abend oder morgen früh losfahren.', 'We can set off either this evening or tomorrow morning.'],
    ['Im Hotel gab es weder WLAN noch eine Klimaanlage.', 'The hotel had neither Wi-Fi nor air conditioning.'],
    ['Die neue Kollegin ist sowohl freundlich als auch sehr kompetent.', 'The new colleague is both friendly and very competent.'],
    ['Die Wohnung ist zwar teuer, aber sie liegt sehr zentral.', 'The flat is expensive, admittedly, but it’s very central.'],
    ['Je länger ich in Berlin wohne, desto besser gefällt mir die Stadt.', 'The longer I live in Berlin, the more I like the city.'],
  ])}
</section>
<section>
  <h2>Common mistakes</h2>
  <ul class="mistakes">
    <li><s>weder Kaffee oder Tee</s> → weder Kaffee <b>noch</b> Tee.</li>
    <li><s>sowohl Englisch und Deutsch</s> → sowohl Englisch <b>als auch</b> Deutsch.</li>
    <li><s>Je mehr ich übe, desto ich spreche besser.</s> → …, desto <b>besser spreche ich</b>.</li>
    <li><s>Je ich übe mehr, …</s> → Je mehr ich <b>übe</b>, … The je-clause is a Nebensatz: verb at the end.</li>
  </ul>
</section>
<section><h2>Quiz</h2><div data-quiz></div></section>
<section>
  <div class="try">
    <h3>Sprechen: plan a weekend together (B1 exam style)</h3>
    <p>${PH3_TRY} With a partner or out loud alone, plan a weekend trip for 3 minutes. Use at least four pairs:</p>
    <ul>
      <li>Wir könnten entweder … oder … · Ich möchte weder … noch … · Das Hotel ist zwar …, aber … · Je früher wir …, desto …</li>
    </ul>
  </div>
</section>`,
    quiz: [
      { type: 'pick', q: 'Wir fahren ___ mit dem Zug oder mit dem Auto.', opts: ['entweder', 'weder', 'sowohl'], a: 0, why: 'One of two options: <em>entweder … oder</em>.' },
      { type: 'pick', q: 'Ich habe weder Zeit ___ Geld.', opts: ['noch', 'oder', 'und'], a: 0, why: 'The partner of weder is <em>noch</em>.' },
      { type: 'pick', q: 'Sie spricht sowohl Spanisch ___ Italienisch.', opts: ['als auch', 'sondern auch', 'noch'], a: 0, why: 'The partner of sowohl is <em>als auch</em>.' },
      { type: 'pick', q: 'Je länger ich in Berlin wohne, ___ gefällt mir die Stadt.', opts: ['desto besser', 'desto gut', 'besser'], a: 0, why: 'desto + comparative, then the verb: <em>desto besser gefällt</em>.' },
      { type: 'pick', q: 'Die Wohnung ist zwar teuer, ___ sie liegt sehr zentral.', opts: ['aber', 'sondern', 'doch auch'], a: 0, why: 'The partner of zwar is <em>aber</em>.' },
    ],
    mount(ctx) {
      const K = kit(ctx), T = ctx.THREE;
      ctx.backdrop({ center: K.V(0, 0, -2) });
      const S = stageRow(ctx, K, { pos: K.V(0, 0, 0) });
      const fitBench = bench(ctx, K);
      const link = arc(ctx, K, 'conn');
      // two lanterns on posts
      const lamps = [-2.2, 2.2].map(x => {
        const g = new T.Group();
        K.at(K.cyl(0.07, 0.09, 2.2, 'ink', 8), 0, 1.1, 0, g);
        K.at(K.box(0.7, 0.1, 0.7, 'brass'), 0, 2.25, 0, g);
        const glow = new T.Mesh(new T.SphereGeometry(0.42, 18, 14), new T.MeshBasicMaterial({ color: ctx.colors.warm.clone(), transparent: true, opacity: 0.9 }));
        glow.position.y = 2.75; g.add(glow);
        const capM = K.at(ctx.solid(new T.ConeGeometry(0.5, 0.4, 4), 'copper'), 0, 3.3, 0, g); capM.rotation.y = Math.PI / 4;
        K.at(K.box(0.9, 0.12, 0.9, 'wood'), 0, 0.06, 0, g);
        g.position.set(x, -4.4, 0); ctx.scene.add(g);
        const tag = K.tag('', K.V(0, 3.75, 0)); tag.obj = g;
        return { g, glow, tag, v: 0, tv: 0, h: 1, th: 1 };
      });
      let p = 'entweder', first = true;
      const out = K.readout();
      function render() {
        const D = ZW[p];
        const size = S.show(D.t, null, { snap: first });
        fitBench(size, S.lines);
        ctx.fit(Math.max(10.5, size.w + 2), 8.4 + size.h * 0.6, K.V(0, -1.6, 0), K.V(0, 0.22, 1));
        link.hide();
        K.after(first ? 0 : 0.45, () => link.set(S.at('k1').add(K.V(0, 0.45, 0.3)), S.at('k2').add(K.V(0, 0.45, 0.3)), 1.1));
        lamps.forEach((l, i) => { l.tag.set(`<b>${D.items[i]}</b>`); l.th = 1; });
        if (Array.isArray(D.lamps)) lamps.forEach((l, i) => { l.tv = D.lamps[i]; });
        if (!first) S.pop(D.k);
        first = false;
        const s = S.sentence();
        out.innerHTML = `<span class="de">${s}</span> ${say(s)} <span>· ${D.en}</span><br><b class="r-conn">${D.label}</b>: ${D.mean}.` + (D.note ? ` ${D.note}` : '');
      }
      ctx.onFrame((dt, t) => {
        const D = ZW[p];
        if (D.lamps === 'alt') { const on = ctx.reduce ? 0 : Math.floor(t / 1.2) % 2; lamps[0].tv = on ? 0.15 : 1; lamps[1].tv = on ? 1 : 0.15; }
        if (D.lamps === 'grow') { const k = ctx.reduce ? 1 : 0.5 + 0.5 * Math.sin(t * 0.9); lamps.forEach(l => { l.tv = 0.4 + k * 0.7; l.th = 0.6 + k * 0.8; }); }
        const tick = ctx.reduce || Math.floor(t * 12) !== Math.floor((t - dt) * 12);
        lamps.forEach(l => {
          l.v += (l.tv - l.v) * K.f(dt, 6); l.h += (l.th - l.h) * K.f(dt, 6);
          if (!tick) return;
          l.glow.material.opacity = 0.15 + Math.min(1, l.v) * 0.8;
          l.glow.scale.setScalar(0.65 + Math.min(1.3, l.v) * 0.45);
          l.g.scale.y = l.h;
        });
      });
      K.chips('Paar', Object.keys(ZW).map(v => ({ v, label: ZW[v].label })), p, v => { p = v; render(); });
      render();
      K.onPortrait(render);
    },
  });

  // =====================================================================
  // Week 16a: Plusquamperfekt
  // =====================================================================
  const PQ = {
    bahnhof: { label: 'Zug schon weg', early: 'Zug fährt ab', late: 'ich komme an', pq: ['W', 'P'],
      t: [['cj', 'als', 'conn'], ['S', 'ich', 'subj'], ['R', 'am Bahnhof', 'obj'], ['V', 'ankam', 'verb'], ['c', ',', 'punct'], ['W', 'war', 'verb'], ['S2', 'der Zug', 'subj'], ['A', 'schon', 'plain'], ['P', 'abgefahren', 'verb2'], ['d', '.', 'punct']],
      en: 'When I arrived at the station, the train had already left.' },
    essen: { label: 'nachdem … gegessen hatten', early: 'wir essen', late: 'wir gehen spazieren', pq: ['P', 'W'],
      t: [['cj', 'nachdem', 'conn'], ['S', 'wir', 'subj'], ['P', 'gegessen', 'verb2'], ['W', 'hatten', 'verb'], ['c', ',', 'punct'], ['V', 'gingen', 'verb'], ['S2', 'wir', 'subj'], ['R', 'spazieren', 'verb2'], ['d', '.', 'punct']],
      en: 'After we had eaten, we went for a walk.' },
    muede: { label: 'weil … geschlafen hatte', early: 'schlecht geschlafen', late: 'müde', pq: ['P', 'W'],
      t: [['S', 'er', 'subj'], ['V', 'war', 'verb'], ['R', 'müde', 'obj'], ['c', ',', 'punct'], ['cj', 'weil', 'conn'], ['S2', 'er', 'subj'], ['A', 'schlecht', 'plain'], ['P', 'geschlafen', 'verb2'], ['W', 'hatte', 'verb'], ['d', '.', 'punct']],
      en: 'He was tired because he had slept badly.' },
    umzug: { label: 'bevor … hatte gelernt', early: 'Deutsch gelernt', late: 'nach Berlin gezogen', pq: ['W', 'P'],
      t: [['cj', 'bevor', 'conn'], ['S', 'ich', 'subj'], ['R', 'nach Berlin', 'obj'], ['V', 'zog', 'verb'], ['c', ',', 'punct'], ['W', 'hatte', 'verb'], ['S2', 'ich', 'subj'], ['A', 'schon zwei Jahre', 'plain'], ['O', 'Deutsch', 'obj'], ['P', 'gelernt', 'verb2'], ['d', '.', 'punct']],
      en: 'Before I moved to Berlin, I had already learned German for two years.' },
    hotel: { label: 'hatte schon gebucht', early: 'Hotel gebucht', late: 'Flug wird teurer', pq: ['W', 'P'],
      t: [['S', 'ich', 'subj'], ['W', 'hatte', 'verb'], ['O', 'das Hotel', 'obj'], ['A', 'schon', 'plain'], ['P', 'gebucht', 'verb2'], ['c', ',', 'punct'], ['cj', 'als', 'conn'], ['S2', 'der Flug', 'subj'], ['R', 'teurer', 'obj'], ['V', 'wurde', 'verb'], ['d', '.', 'punct']],
      en: 'I had already booked the hotel when the flight got more expensive.' },
  };

  MM.register({
    id: 'plusquamperfekt', day: 16, week: 3,
    title: 'Plusquamperfekt',
    tagline: 'The past before the past: hatte or war + Partizip II, for something that had already happened before another past event.',
    prompt: 'Pick a sentence. The timeline shows the earlier event (Plusquamperfekt) and the later one (Präteritum).',
    body: `
<section>
  <p class="rule">Plusquamperfekt = hatte / war (Präteritum) + Partizip II at the end.</p>
  <p>When you tell a story in the past and need to go one step further back, use the Plusquamperfekt. It is built like the Perfekt, but with the Präteritum of haben or sein: <i>ich <b>hatte</b> gegessen</i>, <i>der Zug <b>war</b> abgefahren</i>. The haben/sein choice is the same as in the Perfekt. It often appears with <b>nachdem</b>, <b>als</b>, <b>schon</b> and <b>vorher</b>.</p>
</section>
<section>
  <h2>Pattern</h2>
  ${table(['Tense', 'Form', 'Example'], [
    ['Perfekt', 'habe / bin + Partizip', 'Ich habe gegessen. Ich bin gefahren.'],
    ['Plusquamperfekt', '<b>hatte / war</b> + Partizip', 'Ich hatte gegessen. Ich war gefahren.'],
  ])}
  ${table(['', 'haben', 'sein'], [['ich', 'hatte … gebucht', 'war … gefahren'], ['du', 'hattest', 'warst'], ['er / sie / es', 'hatte', 'war'], ['wir / sie / Sie', 'hatten', 'waren'], ['ihr', 'hattet', 'wart']])}
</section>
<section>
  <h2>Examples</h2>
  ${ex([
    ['Als wir ankamen, hatte das Restaurant schon geschlossen.', 'When we arrived, the restaurant had already closed.'],
    ['Nachdem ich den Vertrag unterschrieben hatte, bekam ich die Schlüssel.', 'After I had signed the contract, I got the keys.'],
    ['Sie war vorher noch nie in Asien gewesen.', 'She had never been to Asia before.'],
    ['Ich hatte meinen Pass zu Hause vergessen, deshalb musste ich zurückfahren.', 'I had forgotten my passport at home, so I had to go back.'],
    ['Er kannte die Stadt gut, weil er dort studiert hatte.', 'He knew the city well because he had studied there.'],
  ])}
</section>
<section>
  <h2>Common mistakes</h2>
  <ul class="mistakes">
    <li><s>Nachdem ich gegessen habe, ging ich.</s> → Nachdem ich gegessen <b>hatte</b>, ging ich. Past main clause → Plusquamperfekt.</li>
    <li><s>Der Zug hatte schon abgefahren.</s> → Der Zug <b>war</b> schon abgefahren. Same haben/sein choice as the Perfekt.</li>
    <li>Don’t use it for a single past event: <s>Gestern hatte ich Pizza gegessen.</s> → Gestern <b>habe</b> ich Pizza gegessen.</li>
    <li>Word order as in the Perfekt: <b>hatte</b> in position 2, the participle at the end.</li>
  </ul>
</section>
<section><h2>Quiz</h2><div data-quiz></div></section>
<section>
  <div class="try">
    <h3>Sprechen: the trip that went wrong</h3>
    <p>${PH3_TRY} Tell a 2-minute story about a trip where something went wrong. Use the Präteritum or Perfekt for the story, and the Plusquamperfekt three times for what had happened before: <i>Ich hatte das Ticket schon gekauft, als … · Als wir ankamen, war … schon … · Nachdem wir … hatten, …</i></p>
  </div>
</section>`,
    quiz: [
      { type: 'pick', q: 'Als wir am Bahnhof ankamen, ___ der Zug schon abgefahren.', opts: ['war', 'hatte', 'ist'], a: 0, why: '<em>abfahren</em> takes sein; past of the past: <em>war</em> abgefahren.' },
      { type: 'pick', q: 'Nachdem ich die Wohnung ___ hatte, zog ich ein.', opts: ['renoviert', 'renovieren', 'renovierte'], a: 0, why: 'hatte + Partizip II: <em>renoviert</em>.' },
      { type: 'pick', q: 'Ich war müde, weil ich schlecht geschlafen ___.', opts: ['hatte', 'war', 'wurde'], a: 0, why: '<em>schlafen</em> takes haben: <em>hatte</em>, at the end of the weil-clause.' },
      { type: 'pick', q: 'Bevor ich nach Berlin zog, ___ ich schon zwei Jahre Deutsch gelernt.', opts: ['hatte', 'war', 'wurde'], a: 0, why: '<em>lernen</em> takes haben; the learning came before the move: <em>hatte</em>.' },
      { type: 'order', q: 'Build the sentence:', tiles: ['Er', 'hatte', 'das Ticket', 'schon', 'gekauft'], a: ['Er hatte das Ticket schon gekauft', 'Er hatte schon das Ticket gekauft'], why: '<em>hatte</em> in position 2, the participle <em>gekauft</em> at the end.' },
    ],
    mount(ctx) {
      const K = kit(ctx);
      ctx.backdrop({ center: K.V(0, 0, -2) });
      const rail = K.cyl(0.08, 0.08, 12, 'brass', 12); rail.rotation.z = Math.PI / 2; K.at(rail, 0, -2.6, 0);
      for (let i = 0; i <= 11; i++) K.at(K.box(0.06, i % 4 ? 0.26 : 0.5, 0.06, 'brass', { ink: 0.5 }), -5.5 + i, -2.6, 0);
      const g1 = K.at(gear(K, 0.8, 11, 'brass'), -6.7, -2.6, -0.1);
      const now = K.cyl(0, 0.22, 0.45, 'verb2', 12); now.rotation.z = Math.PI; K.at(now, 5, -2.05, 0);
      K.tag('<b>jetzt</b>', K.V(5, -1.5, 0));
      const early = K.at(K.sph(0.26, 'conn'), -3, -2.6, 0.15), late = K.at(K.sph(0.26, 'verb'), 0, -2.6, 0.15);
      const tE = K.tag('', K.V(0, 0.6, 0)), tL = K.tag('', K.V(0, 0.6, 0)); tE.obj = early; tL.obj = late;
      const S = stageRow(ctx, K, { pos: K.V(0, 1, 0) });
      const fitBench = bench(ctx, K);
      let ex1 = 'bahnhof', first = true, spin = 0, shown = 0;
      const out = K.readout();
      function render() {
        const D = PQ[ex1];
        const size = S.show(D.t, null, { snap: first });
        fitBench(size, S.lines, K.V(0, 1, 0));
        ctx.fit(Math.max(13, size.w + 2), 6.6 + size.h, K.V(0, -0.6 - (S.lines - 1) * 0.4, 0), K.V(0, 0.22, 1));
        tE.set(`<b>früher</b>${D.early}<br>Plusquamperfekt`); tL.set(`<b>später</b>${D.late}<br>Präteritum`);
        if (!first) { spin -= Math.PI / 2; S.pop(D.pq); ctx.pop(early); }
        first = false;
        const s = S.sentence();
        const aux = D.t.find(t => t[0] === 'W')[1], part = D.t.find(t => t[0] === 'P')[1];
        out.innerHTML = `<span class="de">${s}</span> ${say(s)} <span>· ${D.en}</span><br>Earlier event: <b class="r-verb">${aux}</b> … <b class="r-verb2">${part}</b> (Plusquamperfekt). Later event in the Präteritum.`;
      }
      ctx.onFrame((dt, t) => {
        shown += (spin - shown) * K.f(dt, 4);
        g1.rotation.z = ctx.reduce ? spin : Math.round(shown / (Math.PI / 22)) * (Math.PI / 22);
        if (!ctx.reduce) early.position.y = -2.6 + Math.abs(Math.sin(ctx.twos(t) * 2)) * 0.18;
      });
      K.chips('Satz', Object.keys(PQ).map(v => ({ v, label: PQ[v].label })), ex1, v => { ex1 = v; render(); });
      render();
      K.onPortrait(render);
    },
  });

  // =====================================================================
  // Week 16b: n-Deklination
  // =====================================================================
  const ND = [
    { v: 'Kollege', e: 'n' }, { v: 'Kunde', e: 'n' }, { v: 'Nachbar', e: 'n' },
    { v: 'Student', e: 'en' }, { v: 'Tourist', e: 'en' }, { v: 'Herr', e: 'n' },
  ];
  const NCASE = {
    Nom: { x: ['das', 'ist'], art: 'der', en: 'That is the {n}.' },
    Akk: { x: ['ich', 'frage'], art: 'den', en: 'I ask the {n}.' },
    Dat: { x: ['ich', 'helfe'], art: 'dem', en: 'I help the {n}.' },
    Gen: { x: ['das', 'ist'], x3: 'die Wohnung', art: 'des', en: 'That is the {n}’s flat.' },
  };
  const N_EN = { Kollege: 'colleague', Kunde: 'customer', Nachbar: 'neighbour', Student: 'student', Tourist: 'tourist', Herr: 'gentleman' };

  MM.register({
    id: 'n-deklination', day: 16, week: 3,
    title: 'n-Deklination',
    tagline: 'A group of masculine nouns, mostly people and animals, add -n or -en in every case except the nominative singular.',
    prompt: 'Pick a noun and a case. In every case except Nominativ, the ending block docks onto the noun.',
    body: `
<section>
  <p class="rule">Weak masculine nouns: -(e)n everywhere except Nominativ singular.</p>
  <p>Most of them are masculine nouns for people or animals ending in <b>-e</b> (der Kollege, der Kunde, der Junge, der Löwe), or foreign words ending in <b>-ent, -ant, -ist, -at, -oge</b> (der Student, der Praktikant, der Tourist, der Kandidat, der Biologe), plus a few others: der Herr, der Nachbar, der Mensch, der Bauer. The genitive has -(e)n too, not -s.</p>
</section>
<section>
  <h2>Pattern</h2>
  ${table(['', 'der Kollege', 'der Student', 'der Herr'], [
    ['Nom', 'der Kollege', 'der Student', 'der Herr'],
    ['Akk', 'den Kollege<b class="hl">n</b>', 'den Student<b class="hl">en</b>', 'den Herr<b class="hl">n</b>'],
    ['Dat', 'dem Kollege<b class="hl">n</b>', 'dem Student<b class="hl">en</b>', 'dem Herr<b class="hl">n</b>'],
    ['Gen', 'des Kollege<b class="hl">n</b>', 'des Student<b class="hl">en</b>', 'des Herr<b class="hl">n</b>'],
    ['Plural', 'die Kollegen', 'die Studenten', 'die Herren'],
  ])}
  <p>Special: <b>der Name</b> → den/dem Namen, but des Name<b>ns</b>; also der Gedanke, der Glaube. In letters: <i>Sehr geehrter Herr Müller</i> (Nom), but <i>Ich schreibe Herr<b>n</b> Müller</i>.</p>
</section>
<section>
  <h2>Examples</h2>
  ${ex([
    ['Kannst du bitte den Kollegen aus der IT fragen?', 'Can you ask the colleague from IT, please?'],
    ['Wir haben dem Kunden ein neues Angebot geschickt.', 'We sent the customer a new offer.'],
    ['Ich habe den Nachbarn um Hilfe gebeten.', 'I asked the neighbour for help.'],
    ['Der Vermieter hat mit Herrn Schmidt telefoniert.', 'The landlord spoke to Mr Schmidt on the phone.'],
    ['Das Zimmer des Studenten ist sehr klein.', 'The student’s room is very small.'],
  ])}
</section>
<section>
  <h2>Common mistakes</h2>
  <ul class="mistakes">
    <li><s>Ich frage den Kollege.</s> → Ich frage den Kollege<b>n</b>.</li>
    <li><s>das Buch des Studentes</s> → des Student<b>en</b>. No genitive -s.</li>
    <li><s>Ich spreche mit Herr Müller.</s> → mit Herr<b>n</b> Müller.</li>
    <li><s>Der Kollegen kommt.</s> → <b>Der Kollege</b> kommt. No ending in the Nominativ singular.</li>
  </ul>
</section>
<section><h2>Quiz</h2><div data-quiz></div></section>
<section>
  <div class="try">
    <h3>Sprechen: the mock exam</h3>
    <p>${PH3_TRY} Present a short topic for 3 minutes (B1 Sprechen, Teil 2): “Mit Kollegen befreundet sein: ja oder nein?” Describe your experience, the pros and cons, and your opinion. Use der Kollege, der Kunde or der Nachbar in at least three cases, and record yourself to check the -n endings.</p>
  </div>
</section>`,
    quiz: [
      { type: 'pick', q: 'Ich frage den ___.', hint: '(Kollege)', opts: ['Kollegen', 'Kollege', 'Kollegens'], a: 0, why: 'Akkusativ of a weak masculine noun: -n, <em>den Kollegen</em>.' },
      { type: 'pick', q: 'Kannst du dem ___ helfen?', hint: '(Kunde)', opts: ['Kunden', 'Kunde', 'Kundes'], a: 0, why: 'Dativ: <em>dem Kunden</em>.' },
      { type: 'pick', q: 'Das ist das Fahrrad des ___.', hint: '(Student)', opts: ['Studenten', 'Students', 'Student'], a: 0, why: 'Genitiv of an n-noun: -en, no -s.' },
      { type: 'pick', q: 'Sehr geehrter ___ Müller, …', opts: ['Herr', 'Herrn', 'Herren'], a: 0, why: 'The greeting is Nominativ: <em>Herr</em> Müller.' },
      { type: 'pick', q: 'Ich schreibe ___ Müller eine E-Mail.', opts: ['Herrn', 'Herr', 'Herren'], a: 0, why: 'Dativ (to Mr Müller): <em>Herrn</em>.' },
    ],
    mount(ctx) {
      const K = kit(ctx);
      ctx.backdrop({ center: K.V(0, 0, -2) });
      const S = stageRow(ctx, K, { pos: K.V(0, 0, 0) });
      const fitBench = bench(ctx, K);
      const fig = makeFigure(K, 'subj'); fig.scale.setScalar(0.8); K.at(fig, 0, -3.6, -0.4);
      const caseTag = K.tag('', K.V(0, 1.4, 0), 'q');
      let n = 0, c = 'Nom', first = true;
      const out = K.readout();
      function render() {
        const N = ND[n], C = NCASE[c];
        const tokens = [['x1', C.x[0], 'subj'], ['x2', C.x[1], 'verb'], ['x3', 'die Wohnung', 'obj'], ['A', C.art, 'obj'], ['N', N.v, 'obj'], ['E', N.e, 'en'], ['d', '.', 'punct']];
        const keys = ['x1', 'x2', ...(c === 'Gen' ? ['x3'] : []), 'A', 'N', ...(c === 'Nom' ? [] : ['E']), 'd'];
        const size = S.show(tokens, keys, { snap: first, tight: ['E'], roles: c === 'Nom' ? { A: 'obj', N: 'obj' } : {} });
        fitBench(size, S.lines);
        ctx.fit(Math.max(9, size.w + 2), 7.4 + size.h * 0.5, K.V(0, -0.6, 0), K.V(0, 0.25, 1));
        caseTag.set(c === 'Nom' ? 'Nominativ · keine Endung' : `${{ Akk: 'Akkusativ', Dat: 'Dativ', Gen: 'Genitiv' }[c]} · -${N.e}`);
        if (!first && c !== 'Nom') S.pop(['E']);
        first = false;
        const s = S.sentence();
        out.innerHTML = `<span class="de">${s}</span> ${say(s)} <span>· ${C.en.replace('{n}', N_EN[N.v])}</span><br>` + (c === 'Nom'
          ? `Nominativ singular: <b>der ${N.v}</b>, the only form without an ending.`
          : `<b>${C.art} ${N.v}<span class="hl">${N.e}</span></b>: n-Deklination adds -${N.e} in ${c === 'Gen' ? 'the genitive too (no -s)' : 'this case'}.`);
      }
      K.chips('Nomen', ND.map((x, i) => ({ v: i, label: 'der ' + x.v })), n, v => { n = v; render(); });
      K.chips('Fall', Object.keys(NCASE).map(v => ({ v, label: v })), c, v => { c = v; render(); });
      render();
      K.onPortrait(render);
    },
  });
})();
