/* Akoo, week 15 (end of A2) and weeks 16-22 (B1).
 * Uses the engine in app.js and the shared kit in shared/kit.js (window.GK).
 * B1 writing goal: write a 100-word email giving an opinion and reasons.
 */
(function () {
  'use strict';
  const { kit, cap, say, ex, table, R, gear, makeFigure, stageRow, bench, arc, piston } = window.GK;

  // tag on top of the stage naming the rule that fired
  const PH2_TRY = 'B1 writing goal: a 100-word email giving an opinion and reasons.';

  // =====================================================================
  // Week 15 (A2): als, wenn, bevor, nachdem
  // =====================================================================
  const TS = {
    als: { label: 'als · einmal', sub: ['als', 'ich', [['in Wien', 'obj']], [['war', 'verb']]], main: ['ich', 'habe', [['viel Kaffee', 'obj']], [['getrunken', 'verb2']]],
      en: 'When I was in Vienna, I drank a lot of coffee.', note: '<b>als</b>: one situation or event in the past.', tl: { kind: 'once' } },
    wennV: { label: 'wenn · immer (Vergangenheit)', sub: ['wenn', 'ich', [['in Wien', 'obj']], [['war', 'verb']]], main: ['ich', 'habe', [['immer', 'plain'], ['Kaffee', 'obj']], [['getrunken', 'verb2']]],
      en: 'Whenever I was in Vienna, I always drank coffee.', note: '<b>wenn</b> in the past: something that happened again and again (often with immer).', tl: { kind: 'repeat', at: [-5, -3.6, -2.2] } },
    wennJ: { label: 'wenn · jetzt / Zukunft', sub: ['wenn', 'ich', [['nach Wien', 'obj']], [['fahre', 'verb']]], main: ['ich', 'trinke', [['viel Kaffee', 'obj']], []],
      en: 'When I go to Vienna, I drink a lot of coffee.', note: '<b>wenn</b> in the present or future: every time, or a condition.', tl: { kind: 'repeat', at: [1.2, 2.8, 4.4] } },
    bevor: { label: 'bevor', sub: ['bevor', 'ich', [['ins Büro', 'obj']], [['gehe', 'verb']]], main: ['ich', 'trinke', [['einen Kaffee', 'obj']], []],
      en: 'Before I go to the office, I drink a coffee.', note: '<b>bevor</b>: the Hauptsatz happens first, the Nebensatz second.', tl: { kind: 'order', main: 1.4, sub: 3.6 } },
    nachdemP: { label: 'nachdem · Präsens', sub: ['nachdem', 'ich', [], [['gefrühstückt', 'verb2'], ['habe', 'verb']]], main: ['ich', 'gehe', [['ins Büro', 'obj']], []],
      en: 'After I have had breakfast, I go to the office.', note: '<b>nachdem</b>: the Nebensatz happens first, so it is one tense further back. Present → Perfekt.', tl: { kind: 'order', main: 3.6, sub: 1.4 } },
    nachdemV: { label: 'nachdem · Vergangenheit', sub: ['nachdem', 'ich', [], [['gefrühstückt', 'verb2'], ['hatte', 'verb']]], main: ['ich', 'ging', [['ins Büro', 'obj']], []],
      en: 'After I had had breakfast, I went to the office.', note: '<b>nachdem</b> in the past: Hauptsatz in Präteritum, Nebensatz in Plusquamperfekt (hatte + Partizip).', tl: { kind: 'order', main: -2.4, sub: -4.4 } },
  };

  MM.register({
    id: 'als-wenn-bevor-nachdem', day: 15, week: 2,
    title: 'als, wenn, bevor, nachdem',
    tagline: 'Time clauses: als for one time in the past, wenn for every time or the future, bevor and nachdem for the order of events.',
    prompt: 'Pick a connector. The timeline shows when each clause happens; the row shows the verb going to the end.',
    body: `
<section>
  <p class="rule">als = once, in the past. wenn = every time, or now/future. bevor / nachdem = which comes first.</p>
  <p>All four start a Nebensatz, so the conjugated verb goes to the end, just like weil and dass. The hard part is choosing: English “when” can be <b>als</b> or <b>wenn</b>. And with <b>nachdem</b>, the Nebensatz happened first, so it goes one tense further back.</p>
</section>
<section>
  <h2>Pattern</h2>
  ${table(['Connector', 'Use', 'Example'], [
    ['als', 'one event or period in the past', `${R('conn', 'Als')} ich Kind ${R('verb', 'war')}, habe ich in Graz gewohnt.`],
    ['wenn', 'repeated (past or present), or future', `${R('conn', 'Wenn')} ich Zeit ${R('verb', 'habe')}, koche ich.`],
    ['bevor', 'Hauptsatz first, then Nebensatz', `${R('conn', 'Bevor')} ich ${R('verb', 'gehe')}, rufe ich dich an.`],
    ['nachdem', 'Nebensatz first, then Hauptsatz', `${R('conn', 'Nachdem')} ich ${R('verb2', 'gegessen')} ${R('verb', 'habe')}, gehe ich.`],
  ])}
  ${table(['Hauptsatz', 'Nebensatz with nachdem'], [
    ['Präsens: ich gehe', 'Perfekt: nachdem ich gegessen habe'],
    ['Präteritum / Perfekt: ich ging', 'Plusquamperfekt: nachdem ich gegessen hatte'],
  ])}
</section>
<section>
  <h2>Examples</h2>
  ${ex([
    ['Als wir in Lissabon ankamen, hat es geregnet.', 'When we arrived in Lisbon, it was raining.'],
    ['Wenn ich im Homeoffice arbeite, mache ich mittags einen Spaziergang.', 'When I work from home, I go for a walk at lunchtime.'],
    ['Bevor wir umziehen, müssen wir die Küche streichen.', 'Before we move, we have to paint the kitchen.'],
    ['Nachdem ich die E-Mail geschrieben habe, mache ich Feierabend.', 'After I’ve written the email, I’ll finish work.'],
    ['Nachdem wir das Hotel gefunden hatten, gingen wir essen.', 'After we had found the hotel, we went out to eat.'],
  ])}
</section>
<section>
  <h2>Common mistakes</h2>
  <ul class="mistakes">
    <li><s>Wenn ich 2019 in Rom war, …</s> → <b>Als</b> ich 2019 in Rom war, … One time in the past is als.</li>
    <li><s>Als ich Zeit habe, …</s> → <b>Wenn</b> ich Zeit habe, … als is only for the past.</li>
    <li><s>Nachdem ich esse, gehe ich.</s> → Nachdem ich <b>gegessen habe</b>, gehe ich.</li>
    <li><s>Bevor ich gehe, ich rufe dich an.</s> → Bevor ich gehe, <b>rufe ich</b> dich an. Verb, comma, verb.</li>
  </ul>
</section>
<section><h2>Quiz</h2><div data-quiz></div></section>
<section>
  <div class="try">
    <h3>Schreiben: your first week in a new job or city</h3>
    <p>A2 goal: tell a short story in the past without stopping. This week, write 6 sentences about a time you started something new, using each connector at least once:</p>
    <ul>
      <li>Als ich in … angefangen habe, …</li>
      <li>Wenn ich morgens ins Büro kam, …</li>
      <li>Bevor ich umgezogen bin, … / Nachdem ich die Wohnung gefunden hatte, …</li>
    </ul>
    <p>Read it aloud and check: every conjugated verb after als, wenn, bevor, nachdem is at the end.</p>
  </div>
</section>`,
    quiz: [
      { type: 'pick', q: '___ ich 2019 in Wien war, habe ich Anna kennengelernt.', opts: ['Als', 'Wenn', 'Ob'], a: 0, why: 'One time in the past: <em>als</em>.' },
      { type: 'pick', q: 'Immer ___ ich nach Hause komme, koche ich.', opts: ['wenn', 'als', 'bevor'], a: 0, why: 'Every time (immer), in the present: <em>wenn</em>.' },
      { type: 'pick', q: 'Nachdem wir gegessen ___, gingen wir ins Kino.', opts: ['hatten', 'haben', 'sind'], a: 0, why: 'Hauptsatz in Präteritum (gingen), so the earlier nachdem-clause is Plusquamperfekt: <em>hatten</em>.' },
      { type: 'pick', q: 'Ich trinke einen Kaffee, ___ ich ins Büro gehe.', opts: ['bevor', 'nachdem', 'als'], a: 0, why: 'The coffee comes first, the office second: <em>bevor</em>. nachdem would need Perfekt (gegangen bin).' },
      { type: 'order', q: 'Build the sentence:', tiles: ['Als', 'ich', 'ankam,', 'war', 'es', 'schon', 'dunkel'], a: 'Als ich ankam, war es schon dunkel', why: '<em>ankam</em> ends the Nebensatz; then verb, comma, verb: <em>war es</em>.' },
    ],
    mount(ctx) {
      const K = kit(ctx), T = ctx.THREE;
      ctx.backdrop({ center: K.V(0, 0, -2) });
      const rail = K.cyl(0.08, 0.08, 13, 'brass', 12); rail.rotation.z = Math.PI / 2; K.at(rail, 0, -2.4, 0);
      for (let i = 0; i <= 12; i++) K.at(K.box(0.06, i % 4 ? 0.26 : 0.5, 0.06, 'brass', { ink: 0.5 }), -6 + i, -2.4, 0);
      K.at(gear(K, 0.7, 10, 'brass'), -7.1, -2.4, -0.1);
      const now = K.cyl(0, 0.22, 0.45, 'verb2', 12); now.rotation.z = Math.PI; K.at(now, 0, -1.85, 0);
      K.tag('<b>jetzt</b>', K.V(0, -1.3, 0));
      K.tag('Vergangenheit', K.V(-4, -3.1, 0)); K.tag('Zukunft', K.V(4, -3.1, 0));
      // markers: copper = Nebensatz event, magenta = Hauptsatz event
      const subM = [0, 1, 2].map(() => K.at(K.sph(0.2, 'conn'), 0, -2.4, 0.15));
      const mainM = [0, 1, 2].map(() => K.at(K.sph(0.2, 'verb'), 0, -2.4, 0.15));
      const span = K.at(K.box(2.4, 0.16, 0.3, 'conn'), -3.5, -2.4, 0.1);
      const tSub = K.tag('Nebensatz', K.V(0, 0.45, 0)), tMain = K.tag('Hauptsatz', K.V(0, 0.45, 0));
      tSub.obj = subM[0]; tMain.obj = mainM[0];
      const goal = new Map();
      [...subM, ...mainM, span].forEach(m => goal.set(m, { x: m.position.x, s: 1 }));
      const S = stageRow(ctx, K, { pos: K.V(0, 1.2, 0) });
      const fitBench = bench(ctx, K);
      let c = 'als', order = 'sub', first = true;
      const out = K.readout();
      function render() {
        const D = TS[c];
        const [cj, sS, sR, sV] = D.sub, [mS, mV, mR, mE] = D.main;
        const tokens = [['cj', cj, 'conn'], ['sS', sS, 'subj'], ...sR.map((r, i) => ['sR' + i, r[0], r[1]]), ...sV.map((r, i) => ['sV' + i, r[0], r[1]]),
          ['c', ',', 'punct'], ['mS', mS, 'subj'], ['mV', mV, 'verb'], ...mR.map((r, i) => ['mR' + i, r[0], r[1]]), ...mE.map((r, i) => ['mE' + i, r[0], r[1]]), ['d', '.', 'punct']];
        const sub = ['cj', 'sS', ...sR.map((_, i) => 'sR' + i), ...sV.map((_, i) => 'sV' + i)];
        const rest = [...mR.map((_, i) => 'mR' + i), ...mE.map((_, i) => 'mE' + i)];
        const keys = order === 'sub' ? [...sub, 'c', 'mV', 'mS', ...rest, 'd'] : ['mS', 'mV', ...rest, 'c', ...sub, 'd'];
        const size = S.show(tokens, keys, { snap: first });
        fitBench(size, S.lines, K.V(0, 1.2, 0));
        ctx.fit(Math.max(14.5, size.w + 2), 6.4 + size.h, K.V(0, -0.4 - (S.lines - 1) * 0.4, 0), K.V(0, 0.22, 1));
        // timeline
        const tl = D.tl;
        [...subM, ...mainM].forEach(m => { goal.get(m).s = 0; });
        goal.get(span).s = 0;
        if (tl.kind === 'once') { goal.get(span).s = 1; goal.get(span).x = -3.5; goal.get(mainM[0]).x = -3.2; goal.get(mainM[0]).s = 1; goal.get(subM[0]).x = -3.8; goal.get(subM[0]).s = 1; }
        else if (tl.kind === 'repeat') tl.at.forEach((x, i) => { goal.get(subM[i]).x = x - 0.3; goal.get(subM[i]).s = 1; goal.get(mainM[i]).x = x + 0.3; goal.get(mainM[i]).s = 1; });
        else { goal.get(subM[0]).x = tl.sub; goal.get(subM[0]).s = 1; goal.get(mainM[0]).x = tl.main; goal.get(mainM[0]).s = 1; }
        if (!first) S.pop(['cj', 'sV' + (sV.length - 1)]);
        first = false;
        const s = S.sentence();
        out.innerHTML = `<span class="de">${s}</span> ${say(s)} <span>· ${D.en}</span><br>${D.note}`;
      }
      ctx.onFrame((dt, t) => {
        const tick = ctx.reduce || Math.floor(t * 12) !== Math.floor((t - dt) * 12);
        goal.forEach((g, m) => {
          m.userData.s = m.userData.s == null ? 0 : m.userData.s;
          m.userData.x = m.userData.x == null ? g.x : m.userData.x;
          m.userData.s += (g.s - m.userData.s) * K.f(dt, 8); m.userData.x += (g.x - m.userData.x) * K.f(dt, 6);
          if (tick) { m.position.x = m.userData.x; m.scale.setScalar(Math.max(0.001, m.userData.s)); m.visible = m.userData.s > 0.02; }
        });
      });
      K.chips('Konnektor', Object.keys(TS).map(v => ({ v, label: TS[v].label })), c, v => { c = v; render(); });
      K.chips('Satzbau', [{ v: 'sub', label: 'Nebensatz zuerst' }, { v: 'main', label: 'Hauptsatz zuerst' }], order, v => { order = v; render(); });
      render();
      K.onPortrait(render);
    },
  });

  // =====================================================================
  // Week 16 (B1): Relativsätze
  // =====================================================================
  // token: [key, text in sentence 2, role, text as relative pronoun]
  const REL = {
    m: { head: 'der Kollege', ist: 'ist', en: 'colleague',
      Nom: { t: [['P', 'der Kollege', 'subj', 'der'], ['V', 'wohnt', 'verb'], ['R', 'in Köln', 'obj']], two: ['P', 'V', 'R'], rel: ['P', 'R', 'V'] },
      Akk: { t: [['S', 'ich', 'subj'], ['H', 'habe', 'verb'], ['P', 'den Kollegen', 'obj', 'den'], ['G', 'gestern', 'plain'], ['T', 'getroffen', 'verb2']], two: ['S', 'H', 'P', 'G', 'T'], rel: ['P', 'S', 'G', 'T', 'H'] },
      Dat: { t: [['S', 'ich', 'subj'], ['H', 'habe', 'verb'], ['P', 'dem Kollegen', 'obj', 'dem'], ['T', 'geholfen', 'verb2']], two: ['S', 'H', 'P', 'T'], rel: ['P', 'S', 'T', 'H'] } },
    f: { head: 'die Wohnung', ist: 'ist', en: 'flat',
      Nom: { t: [['P', 'die Wohnung', 'subj', 'die'], ['V', 'hat', 'verb'], ['R', 'einen Balkon', 'obj']], two: ['P', 'V', 'R'], rel: ['P', 'R', 'V'] },
      Akk: { t: [['S', 'wir', 'subj'], ['H', 'haben', 'verb'], ['P', 'die Wohnung', 'obj', 'die'], ['T', 'gemietet', 'verb2']], two: ['S', 'H', 'P', 'T'], rel: ['P', 'S', 'T', 'H'] },
      Dat: { t: [['S', 'wir', 'subj'], ['V', 'wohnen', 'verb'], ['Q', 'in', 'conn'], ['P', 'der Wohnung', 'obj', 'der']], two: ['S', 'V', 'Q', 'P'], rel: ['Q', 'P', 'S', 'V'] } },
    n: { head: 'das Hotel', ist: 'ist', en: 'hotel',
      Nom: { t: [['P', 'das Hotel', 'subj', 'das'], ['V', 'liegt', 'verb'], ['R', 'am See', 'obj']], two: ['P', 'V', 'R'], rel: ['P', 'R', 'V'] },
      Akk: { t: [['S', 'ich', 'subj'], ['H', 'habe', 'verb'], ['P', 'das Hotel', 'obj', 'das'], ['T', 'gebucht', 'verb2']], two: ['S', 'H', 'P', 'T'], rel: ['P', 'S', 'T', 'H'] },
      Dat: { t: [['S', 'wir', 'subj'], ['H', 'haben', 'verb'], ['Q', 'in', 'conn'], ['P', 'dem Hotel', 'obj', 'dem'], ['T', 'übernachtet', 'verb2']], two: ['S', 'H', 'Q', 'P', 'T'], rel: ['Q', 'P', 'S', 'T', 'H'] } },
    Pl: { head: 'die Kollegen', ist: 'sind', en: 'colleagues',
      Nom: { t: [['P', 'die Kollegen', 'subj', 'die'], ['V', 'arbeiten', 'verb'], ['R', 'mit mir', 'obj']], two: ['P', 'V', 'R'], rel: ['P', 'R', 'V'] },
      Akk: { t: [['S', 'ich', 'subj'], ['V', 'sehe', 'verb'], ['P', 'die Kollegen', 'obj', 'die'], ['R', 'jeden Tag', 'plain']], two: ['S', 'V', 'P', 'R'], rel: ['P', 'S', 'R', 'V'] },
      Dat: { t: [['S', 'ich', 'subj'], ['V', 'vertraue', 'verb'], ['P', 'den Kollegen', 'obj', 'denen']], two: ['S', 'V', 'P'], rel: ['P', 'S', 'V'] } },
  };
  const RELP = { Nom: ['der', 'die', 'das', 'die'], Akk: ['den', 'die', 'das', 'die'], Dat: ['dem', 'der', 'dem', 'denen'], Gen: ['dessen', 'deren', 'dessen', 'deren'] };

  MM.register({
    id: 'relativsaetze', day: 16, week: 3,
    title: 'Relativsätze',
    tagline: 'A relative clause describes a noun: the pronoun takes the noun’s gender and number, but its case comes from its own clause.',
    prompt: 'Pick a gender and a case, then join the two sentences. The repeated noun turns into the relative pronoun.',
    body: `
<section>
  <p class="rule">Gender and number from the noun before the comma; case from the job inside the relative clause; verb at the end.</p>
  <p>Instead of saying the noun twice (<i>Das ist der Kollege. Der Kollege wohnt in Köln.</i>), German swaps the second one for a relative pronoun and attaches it: <i>Das ist der Kollege, <b>der</b> in Köln wohnt.</i> The pronoun looks like the article, except in the dative plural (<b>denen</b>) and the genitive.</p>
</section>
<section>
  <h2>Pattern</h2>
  ${table(['', 'm', 'f', 'n', 'Pl'], ['Nom', 'Akk', 'Dat', 'Gen'].map(c => [c, ...RELP[c].map(p => (p === 'denen' || p === 'dessen' || p === 'deren') ? `<b class="hl">${p}</b>` : p)]))}
  <p>With a preposition, it comes first and decides the case: <i>die Wohnung, <b>in der</b> wir wohnen</i> · <i>der Kollege, <b>mit dem</b> ich arbeite</i>.</p>
</section>
<section>
  <h2>Examples</h2>
  ${ex([
    ['Ich suche eine Wohnung, die in der Nähe vom Park liegt.', 'I’m looking for a flat that’s near the park.'],
    ['Das ist der Laptop, den ich für die Arbeit brauche.', 'That’s the laptop I need for work.'],
    ['Die Kollegin, mit der ich das Büro teile, kommt aus Polen.', 'The colleague I share the office with is from Poland.'],
    ['Wir haben in einem Hotel übernachtet, das direkt am Strand war.', 'We stayed in a hotel that was right on the beach.'],
    ['Die Nachbarn, denen ich manchmal helfe, sind sehr nett.', 'The neighbours I sometimes help are very nice.'],
  ])}
</section>
<section>
  <h2>Common mistakes</h2>
  <ul class="mistakes">
    <li><s>der Kollege, der ich gestern getroffen habe</s> → <b>den</b> ich gestern getroffen habe. ich is the subject, so the pronoun is accusative.</li>
    <li><s>die Leute, den ich helfe</s> → <b>denen</b> ich helfe. Dative plural is denen.</li>
    <li><s>das Hotel, das ist am See</s> → das am See <b>ist</b>. Verb to the end.</li>
    <li><s>die Stadt, wo ich wohne</s> is common in speech, but write <b>in der</b> ich wohne.</li>
  </ul>
</section>
<section><h2>Quiz</h2><div data-quiz></div></section>
<section>
  <div class="try">
    <h3>Schreiben: the ideal flat</h3>
    <p>${PH2_TRY} Write a short email to a friend describing the flat you are looking for, with four relative clauses:</p>
    <ul>
      <li>Ich suche eine Wohnung, die … · ein Zimmer, in dem … · Nachbarn, mit denen … · einen Vermieter, der …</li>
    </ul>
    <p>Then say it aloud without reading.</p>
  </div>
</section>`,
    quiz: [
      { type: 'pick', q: 'Das ist der Kollege, ___ mir immer hilft.', opts: ['der', 'den', 'dem'], a: 0, why: 'Inside the clause, the colleague is the subject (er hilft): Nominativ <em>der</em>.' },
      { type: 'pick', q: 'Wie heißt die Stadt, in ___ du wohnst?', opts: ['der', 'die', 'dem'], a: 0, why: '<em>in</em> + location = Dativ; feminine: <em>der</em>.' },
      { type: 'pick', q: 'Das ist das Hotel, ___ wir gebucht haben.', opts: ['das', 'dem', 'der'], a: 0, why: 'wir is the subject; the hotel is the accusative object: <em>das</em>.' },
      { type: 'pick', q: 'Das sind die Nachbarn, ___ ich oft helfe.', opts: ['denen', 'die', 'den'], a: 0, why: '<em>helfen</em> takes the Dativ; dative plural relative pronoun is <em>denen</em>.' },
      { type: 'order', q: 'Build the sentence:', tiles: ['Der Laptop,', 'den', 'ich', 'gekauft', 'habe,', 'ist', 'sehr schnell'], a: 'Der Laptop, den ich gekauft habe, ist sehr schnell', why: 'The relative clause sits right after its noun, between commas, with the verb at its end.' },
    ],
    mount(ctx) {
      const K = kit(ctx);
      ctx.backdrop({ center: K.V(0, 0, -2) });
      const S = stageRow(ctx, K, { pos: K.V(0, 0, 0) });
      const fitBench = bench(ctx, K);
      const link = arc(ctx, K, 'accent');
      const caseTag = K.tag('', K.V(0, 1.5, 0), 'q');
      let g = 'm', c = 'Nom', mode = 'rel', first = true;
      const out = K.readout();
      function render() {
        const G = REL[g], C = G[c];
        const tokens = [['a', 'das', 'subj'], ['b', G.ist, 'verb'], ['N', G.head, 'obj'], ['d1', '.', 'punct'], ['c1', ',', 'punct'], ...C.t.map(t => [t[0], t[1], t[2]]), ['D', '.', 'punct']];
        const text = {}, roles = {};
        let keys;
        if (mode === 'two') { keys = ['a', 'b', 'N', 'd1', ...C.two, 'D']; const f = C.two[0]; const tk = C.t.find(t => t[0] === f); text[f] = cap(tk[1]); }
        else {
          keys = ['a', 'b', 'N', 'c1', ...C.rel, 'D'];
          C.t.forEach(t => { if (t[3]) { text[t[0]] = t[3]; roles[t[0]] = 'conn'; } });
        }
        const size = S.show(tokens, keys, { snap: first, text, roles });
        fitBench(size, S.lines);
        ctx.fit(Math.max(11, size.w + 2), 4.2 + size.h, K.V(0, 0.6 - (S.lines - 1) * 0.62, 0), K.V(0, 0.3, 1));
        caseTag.set(mode === 'rel' ? `${c} · ${g}` : 'zwei Sätze');
        link.hide();
        if (mode === 'rel') K.after(first ? 0 : 0.45, () => { if (mode === 'rel') link.set(S.at('N').add(K.V(0, 0.45, 0.3)), S.at('P').add(K.V(0, 0.45, 0.3)), 1.0); });
        if (!first) S.pop(['P']);
        first = false;
        const s = S.sentence();
        const p = REL[g][c].t.find(t => t[0] === 'P')[3];
        out.innerHTML = `<span class="de">${s}</span> ${say(s)}<br>` + (mode === 'rel'
          ? `<b class="hl">${p}</b>: ${{ m: 'masculine', f: 'feminine', n: 'neuter', Pl: 'plural' }[g]} like <i>${G.head}</i>, and ${c === 'Nom' ? 'Nominativ because it is the subject of its clause' : c === 'Akk' ? 'Akkusativ because it is the object of its clause' : 'Dativ because of ' + (C.t.some(t => t[0] === 'Q') ? 'the preposition in' : 'the verb ' + (g === 'Pl' ? 'vertrauen' : 'helfen'))}. The verb goes to the end.`
          : 'Two main clauses: the noun is said twice.');
      }
      K.chips('Genus', [{ v: 'm', label: 'der Kollege' }, { v: 'f', label: 'die Wohnung' }, { v: 'n', label: 'das Hotel' }, { v: 'Pl', label: 'die Kollegen' }], g, v => { g = v; render(); });
      K.chips('Fall im Relativsatz', [{ v: 'Nom', label: 'Nominativ' }, { v: 'Akk', label: 'Akkusativ' }, { v: 'Dat', label: 'Dativ' }], c, v => { c = v; render(); });
      K.chips('Satzbau', [{ v: 'two', label: 'Zwei Sätze' }, { v: 'rel', label: 'Relativsatz' }], mode, v => { mode = v; render(); });
      render();
      K.onPortrait(render);
    },
  });

  // =====================================================================
  // Week 17 (B1): Infinitiv mit zu, um … zu
  // =====================================================================
  const ZU = {
    zeit: { label: 'keine Zeit, … zu', en: 'I have no time to do sport.',
      t: [['a', 'ich', 'subj'], ['b', 'habe', 'verb'], ['c', 'keine Zeit', 'obj'], ['k', ',', 'punct'], ['o', 'Sport', 'obj'], ['z', 'zu', 'conn'], ['i', 'machen', 'verb2'], ['d', '.', 'punct']],
      steps: [{ k: ['a', 'b', 'c', 'k', 'o', 'i', 'd'], n: 'The second verb goes to the end as an infinitive …' }, { k: ['a', 'b', 'c', 'k', 'o', 'z', 'i', 'd'], n: '… and <b>zu</b> goes right before it.', strike: 'z' }] },
    lust: { label: 'Lust, … zu', en: 'Do you fancy going to Prague at the weekend?',
      t: [['a', 'hast', 'verb'], ['b', 'du', 'subj'], ['c', 'Lust', 'obj'], ['k', ',', 'punct'], ['w', 'am Wochenende', 'plain'], ['o', 'nach Prag', 'obj'], ['z', 'zu', 'conn'], ['i', 'fahren', 'verb2'], ['d', '?', 'punct']],
      steps: [{ k: ['a', 'b', 'c', 'k', 'w', 'o', 'i', 'd'], n: 'Lust haben, Zeit haben, versuchen, vergessen, anfangen … are followed by zu + infinitive.' }, { k: ['a', 'b', 'c', 'k', 'w', 'o', 'z', 'i', 'd'], n: '<b>zu</b> sits right before the infinitive at the end.', strike: 'z' }] },
    trenn: { label: 'trennbar: anzurufen', en: 'I forgot to call the colleague.',
      t: [['a', 'ich', 'subj'], ['b', 'habe', 'verb'], ['c', 'vergessen', 'verb2'], ['k', ',', 'punct'], ['o', 'die Kollegin', 'obj'], ['p', 'an', 'verb2'], ['z', 'zu', 'conn'], ['i', 'rufen', 'verb2'], ['m', 'anzurufen', 'verb2'], ['d', '.', 'punct']],
      steps: [{ k: ['a', 'b', 'c', 'k', 'o', 'p', 'i', 'd'], n: 'With a separable verb (an|rufen) …', tight: ['i'] }, { k: ['a', 'b', 'c', 'k', 'o', 'p', 'z', 'i', 'd'], n: '… zu goes between the prefix and the verb …', tight: ['z', 'i'], strike: 'z' }, { k: ['a', 'b', 'c', 'k', 'o', 'm', 'd'], n: '… and it is written as one word: <b>anzurufen</b>.', pop: 'm' }] },
    um: { label: 'um … zu (Ziel)', en: 'I’m saving money (in order) to travel to Japan.',
      t: [['a', 'ich', 'subj'], ['b', 'spare', 'verb'], ['c', 'Geld', 'obj'], ['d1', '.', 'punct'], ['s2', 'Ich', 'subj'], ['w', 'will', 'verb'], ['k', ',', 'punct'], ['u', 'um', 'conn'], ['o', 'nach Japan', 'obj'], ['z', 'zu', 'conn'], ['i', 'reisen', 'verb2'], ['d', '.', 'punct']],
      steps: [{ k: ['a', 'b', 'c', 'd1', 's2', 'w', 'o', 'i', 'd'], n: 'Two sentences: what I do, and what I want (the goal) …' }, { k: ['a', 'b', 'c', 'k', 'u', 'o', 'z', 'i', 'd'], n: '<b>um … zu</b> joins them: the goal clause loses its subject and modal verb.', strike: 'z', pop: 'u' }] },
    modal: { label: 'Modalverb: kein zu', en: 'I have to work longer today.',
      t: [['a', 'ich', 'subj'], ['b', 'muss', 'verb'], ['h', 'heute', 'plain'], ['l', 'länger', 'plain'], ['z', 'zu', 'bad'], ['i', 'arbeiten', 'verb2'], ['d', '.', 'punct']],
      steps: [{ k: ['a', 'b', 'h', 'l', 'i', 'd'], n: 'After a modal verb (muss, kann, will, darf, soll, möchte) …' }, { k: ['a', 'b', 'h', 'l', 'z', 'i', 'd'], n: '… zu tries to get in …', strike: 'z' }, { k: ['a', 'b', 'h', 'l', 'i', 'd'], n: '… but is thrown out: modal verbs take the bare infinitive. No zu.' }] },
  };

  MM.register({
    id: 'infinitiv-mit-zu', day: 17, week: 3,
    title: 'Infinitiv mit zu',
    tagline: 'After many verbs and phrases, the second verb goes to the end with zu in front of it; um … zu says why you do something.',
    prompt: 'Pick a pattern and watch the press put zu in place. Press “Nochmal” to replay.',
    body: `
<section>
  <p class="rule">… , (object) zu + infinitive at the end. Separable verbs: an<b>zu</b>rufen. Modal verbs: no zu.</p>
  <p>Many verbs and expressions are followed by a second action: <i>Ich versuche, früher aufzustehen.</i> That action goes to the end as an infinitive with <b>zu</b>. <b>um … zu</b> gives a purpose (“in order to”) and works only when both parts have the same subject; otherwise use <b>damit</b>.</p>
</section>
<section>
  <h2>Pattern</h2>
  ${table(['Trigger', 'Example'], [
    ['Zeit / Lust / keine Angst haben', `Ich habe keine Lust, heute ${R('conn', 'zu')} ${R('verb2', 'kochen')}.`],
    ['versuchen, vergessen, anfangen, aufhören, vorhaben', `Ich habe vor, im Mai ${R('verb2', 'umzuziehen')}.`],
    ['Es ist schwer / wichtig / schön', `Es ist schwer, eine Wohnung ${R('conn', 'zu')} ${R('verb2', 'finden')}.`],
    ['um … zu (purpose)', `Ich lerne Deutsch, ${R('conn', 'um')} in Wien ${R('conn', 'zu')} ${R('verb2', 'arbeiten')}.`],
    ['Modal verbs: no zu', `Ich ${R('verb', 'muss')} heute ${R('verb2', 'arbeiten')}.`],
  ])}
</section>
<section>
  <h2>Examples</h2>
  ${ex([
    ['Ich habe angefangen, jeden Morgen zu joggen.', 'I’ve started jogging every morning.'],
    ['Es ist nicht leicht, in München eine Wohnung zu finden.', 'It isn’t easy to find a flat in Munich.'],
    ['Wir haben vor, im Sommer nach Norwegen zu fahren.', 'We’re planning to go to Norway in the summer.'],
    ['Vergiss nicht, den Schlüssel abzugeben!', 'Don’t forget to hand in the key!'],
    ['Ich stehe früh auf, um vor der Arbeit Sport zu machen.', 'I get up early to do sport before work.'],
  ])}
</section>
<section>
  <h2>Common mistakes</h2>
  <ul class="mistakes">
    <li><s>Ich muss zu arbeiten.</s> → Ich muss <b>arbeiten</b>. No zu after modal verbs.</li>
    <li><s>Ich habe vergessen, zu anrufen.</s> → … <b>anzurufen</b>. zu goes inside separable verbs.</li>
    <li><s>Ich lerne Deutsch für in Wien arbeiten.</s> → …, <b>um</b> in Wien <b>zu</b> arbeiten.</li>
    <li><s>Ich spare, um mein Sohn zu studieren.</s> Different subjects → Ich spare, <b>damit</b> mein Sohn studieren kann.</li>
  </ul>
</section>
<section><h2>Quiz</h2><div data-quiz></div></section>
<section>
  <div class="try">
    <h3>Schreiben: plans and reasons</h3>
    <p>${PH2_TRY} Write to a colleague about your plans for next year, with five zu-infinitives:</p>
    <ul>
      <li>Ich habe vor, … · Ich versuche, … · Es ist wichtig für mich, … · Ich spare Geld, um … zu …</li>
    </ul>
  </div>
</section>`,
    quiz: [
      { type: 'pick', q: 'Ich habe keine Lust, heute ___.', opts: ['zu kochen', 'kochen', 'kochen zu'], a: 0, why: 'Lust haben + <em>zu</em> + infinitive at the end.' },
      { type: 'pick', q: 'Ich muss heute länger ___.', opts: ['arbeiten', 'zu arbeiten', 'arbeite'], a: 0, why: 'After a modal verb, the bare infinitive: no zu.' },
      { type: 'pick', q: 'Vergiss nicht, den Müll ___!', opts: ['rauszubringen', 'zu rausbringen', 'rausbringen zu'], a: 0, why: 'Separable verb raus|bringen: zu goes inside, written as one word.' },
      { type: 'pick', q: 'Ich lerne Deutsch, ___ in Wien zu arbeiten.', opts: ['um', 'damit', 'weil'], a: 0, why: 'A purpose with the same subject and zu: <em>um … zu</em>.' },
      { type: 'order', q: 'Build the sentence:', tiles: ['Es', 'ist', 'schwer,', 'eine Wohnung', 'zu', 'finden'], a: 'Es ist schwer, eine Wohnung zu finden', why: 'Es ist schwer, … then zu + infinitive at the end.' },
    ],
    mount(ctx) {
      const K = kit(ctx);
      ctx.backdrop({ center: K.V(0, 0, -2) });
      const S = stageRow(ctx, K, { pos: K.V(0, 0, 0) });
      const fitBench = bench(ctx, K);
      const press = piston(ctx, K);
      let p = 'zeit', step = 0, run = 0;
      const out = K.readout();
      function draw(i, snap) {
        const D = ZU[p], st = D.steps[i];
        const size = S.show(D.t, st.k, { snap, tight: st.tight });
        fitBench(size, S.lines);
        ctx.fit(Math.max(11, size.w + 2), 6 + size.h, K.V(0, 1.1 - (S.lines - 1) * 0.62, 0), K.V(0, 0.25, 1));
        if (st.strike && !snap) { const at = S.at(st.strike); press.strike(at.x, at.y + 0.45, at.z); S.pop([st.strike], 0.25); }
        else if (!st.strike) { const at = S.at(st.k[Math.floor(st.k.length / 2)]); press.park(at.x, 3.4, 0); }
        if (st.pop && !snap) S.pop([st.pop]);
        const done = i === D.steps.length - 1;
        const s = S.sentence();
        out.innerHTML = (done ? `<span class="de">${s}</span> ${say(s)} <span>· ${D.en}</span><br>` : `<span class="de">${s}</span><br>`) + st.n;
      }
      function play() {
        const my = ++run; step = 0; draw(0, true);
        const D = ZU[p];
        if (ctx.reduce) { step = D.steps.length - 1; draw(step, true); return; }
        D.steps.slice(1).forEach((_, i) => K.after(1.3 * (i + 1), () => { if (my !== run) return; step = i + 1; draw(step, false); }));
      }
      K.chips('Muster', Object.keys(ZU).map(v => ({ v, label: ZU[v].label })), p, v => { p = v; play(); });
      K.btn('Nochmal', play, true);
      play();
      K.onPortrait(() => draw(step, true));
    },
  });

  // =====================================================================
  // Week 18 (B1): Konjunktiv II
  // =====================================================================
  const KII = {
    zeit: { label: 'Wunsch: Zeit', dream: true,
      real: { t: [['a', 'ich', 'subj'], ['b', 'habe', 'verb'], ['c', 'keine Zeit', 'obj'], ['d', '.', 'punct']], en: 'I have no time.' },
      konj: { t: [['w', 'wenn', 'conn'], ['a', 'ich', 'subj'], ['m', 'mehr Zeit', 'obj'], ['h', 'hätte', 'verb'], ['k', ',', 'punct'], ['x', 'würde', 'verb'], ['a2', 'ich', 'subj'], ['r', 'mehr', 'plain'], ['i', 'reisen', 'verb2'], ['d', '.', 'punct']], en: 'If I had more time, I would travel more.', pop: ['h', 'x'] } },
    wohnung: { label: 'Wunsch: Wohnung', dream: true,
      real: { t: [['a', 'die Wohnung', 'subj'], ['b', 'ist', 'verb'], ['c', 'klein', 'obj'], ['d', '.', 'punct']], en: 'The flat is small.' },
      konj: { t: [['w', 'wenn', 'conn'], ['a', 'die Wohnung', 'subj'], ['g', 'größer', 'obj'], ['h', 'wäre', 'verb'], ['k', ',', 'punct'], ['x', 'könnte', 'verb'], ['a2', 'ich', 'subj'], ['o', 'ein Büro', 'obj'], ['i', 'einrichten', 'verb2'], ['d', '.', 'punct']], en: 'If the flat were bigger, I could set up an office.', pop: ['h', 'x'] } },
    kaffee: { label: 'höflich: hätte gern',
      real: { t: [['a', 'ich', 'subj'], ['b', 'will', 'verb'], ['g', 'gern', 'plain'], ['c', 'einen Kaffee', 'obj'], ['d', '.', 'punct']], keys: ['a', 'b', 'c', 'd'], en: 'I want a coffee. (blunt)' },
      konj: { t: [['a', 'ich', 'subj'], ['b', 'hätte', 'verb'], ['g', 'gern', 'plain'], ['c', 'einen Kaffee', 'obj'], ['d', '.', 'punct']], en: 'I’d like a coffee.', pop: ['b'] } },
    hilfe: { label: 'höflich: Könnten Sie …?',
      real: { t: [['b', 'kannst', 'verb'], ['a', 'du', 'subj'], ['m', 'mir', 'obj'], ['x', 'bitte', 'plain'], ['i', 'helfen', 'verb2'], ['d', '?', 'punct']], keys: ['b', 'a', 'm', 'i', 'd'], en: 'Can you help me?' },
      konj: { t: [['b', 'könnten', 'verb'], ['a', 'Sie', 'subj'], ['m', 'mir', 'obj'], ['x', 'bitte', 'plain'], ['i', 'helfen', 'verb2'], ['d', '?', 'punct']], en: 'Could you please help me?', pop: ['b'] } },
    rat: { label: 'Rat: An deiner Stelle …',
      real: { t: [['n', 'nimm', 'verb'], ['o', 'die Stelle', 'obj'], ['p', 'an', 'verb2'], ['d', '!', 'punct']], en: 'Take the job! (an order)' },
      konj: { t: [['s', 'an deiner Stelle', 'plain'], ['x', 'würde', 'verb'], ['a', 'ich', 'subj'], ['o', 'die Stelle', 'obj'], ['i', 'annehmen', 'verb2'], ['d', '.', 'punct']], en: 'If I were you, I would take the job.', pop: ['x'] } },
  };

  MM.register({
    id: 'konjunktiv-2', day: 18, week: 3,
    title: 'Konjunktiv II',
    tagline: 'For wishes, unreal conditions, advice and polite requests: hätte, wäre, könnte, and würde + infinitive for most other verbs.',
    prompt: 'Pick a situation and switch from Wirklichkeit to Konjunktiv II. Wishes make the house dream bigger.',
    body: `
<section>
  <p class="rule">Unreal or polite? Use hätte, wäre, könnte (and other modals), or würde + infinitive at the end.</p>
  <p>The Konjunktiv II talks about things that are not real (<i>Wenn ich reich wäre …</i>), gives advice (<i>An deiner Stelle würde ich …</i>) and makes requests softer (<i>Könnten Sie …?</i>). For haben, sein and the modal verbs, use their own forms. For almost every other verb, use <b>würde</b> + infinitive.</p>
</section>
<section>
  <h2>Pattern</h2>
  ${table(['', 'haben', 'sein', 'können', 'werden → würde'], [
    ['ich', 'hätte', 'wäre', 'könnte', 'würde … reisen'], ['du', 'hättest', 'wärst', 'könntest', 'würdest'], ['er / sie / es', 'hätte', 'wäre', 'könnte', 'würde'],
    ['wir', 'hätten', 'wären', 'könnten', 'würden'], ['ihr', 'hättet', 'wärt', 'könntet', 'würdet'], ['sie / Sie', 'hätten', 'wären', 'könnten', 'würden'],
  ])}
  <p>Also useful: <b>müsste</b>, <b>dürfte</b>, <b>sollte</b> (<i>Du solltest mehr schlafen.</i>). In a wenn-clause, the verb goes to the end: <i>Wenn ich Zeit <b>hätte</b>, <b>würde</b> ich …</i></p>
</section>
<section>
  <h2>Examples</h2>
  ${ex([
    ['Wenn ich mehr Urlaub hätte, würde ich nach Kanada fliegen.', 'If I had more holiday, I would fly to Canada.'],
    ['Wenn die Miete billiger wäre, würden wir in der Stadt wohnen.', 'If the rent were cheaper, we would live in the city.'],
    ['Könnten Sie mir das Formular bitte noch einmal schicken?', 'Could you send me the form again, please?'],
    ['Ich hätte gern ein Doppelzimmer mit Frühstück.', 'I’d like a double room with breakfast.'],
    ['An deiner Stelle würde ich mit dem Chef sprechen.', 'If I were you, I would talk to the boss.'],
  ])}
</section>
<section>
  <h2>Common mistakes</h2>
  <ul class="mistakes">
    <li><s>Wenn ich Zeit habe, würde ich reisen.</s> → Wenn ich Zeit <b>hätte</b>, würde ich reisen. Both halves unreal.</li>
    <li><s>Ich würde mehr Zeit haben.</s> is understood, but say <b>Ich hätte mehr Zeit.</b></li>
    <li><s>Wenn ich reich wäre, ich würde …</s> → …, <b>würde ich</b> … Verb, comma, verb.</li>
    <li>Watch the umlaut: <b>hätte</b> (would have) vs hatte (had), <b>wäre</b> vs war.</li>
  </ul>
</section>
<section><h2>Quiz</h2><div data-quiz></div></section>
<section>
  <div class="try">
    <h3>Schreiben: if I could change one thing</h3>
    <p>${PH2_TRY} Write an email to a friend: what would you change about your job or your flat, and why? Use wenn + hätte/wäre, würde + infinitive, and one piece of advice (An deiner Stelle würde ich …).</p>
  </div>
</section>`,
    quiz: [
      { type: 'pick', q: 'Wenn ich mehr Geld ___, würde ich ein Haus kaufen.', opts: ['hätte', 'habe', 'hatte'], a: 0, why: 'Unreal condition: Konjunktiv II of haben, <em>hätte</em>.' },
      { type: 'pick', q: '___ Sie mir bitte helfen?', opts: ['Könnten', 'Konnten', 'Kannten'], a: 0, why: 'A polite request: <em>Könnten</em> (with umlaut).' },
      { type: 'pick', q: 'Wenn das Wetter besser ___, könnten wir grillen.', opts: ['wäre', 'war', 'ist'], a: 0, why: 'Unreal present: <em>wäre</em>, matching könnten.' },
      { type: 'pick', q: 'Ich ___ gern ein Zimmer mit Balkon.', opts: ['hätte', 'hatte', 'würde'], a: 0, why: 'Polite wish: <em>Ich hätte gern …</em>' },
      { type: 'pick', q: 'An deiner Stelle ___ ich früher losfahren.', opts: ['würde', 'wäre', 'hätte'], a: 0, why: 'Advice with another verb (losfahren): <em>würde</em> + infinitive.' },
    ],
    mount(ctx) {
      const K = kit(ctx), T = ctx.THREE;
      ctx.backdrop({ center: K.V(0, 0, -2) });
      // the house (right side), with a dream storey that rises in Konjunktiv II
      const house = new T.Group();
      K.at(K.box(2.4, 1.8, 2, 'paper'), 0, 0.9, 0, house);
      K.at(K.box(0.5, 0.9, 0.06, 'wood'), 0, 0.45, 1.02, house);
      const win = [[-0.7, 1.2], [0.7, 1.2]].map(([x, y]) => { const m = new T.Mesh(new T.PlaneGeometry(0.45, 0.45), new T.MeshBasicMaterial({ color: ctx.colors.warm.clone() })); m.material.userData.key = 'warm'; m.position.set(x, y, 1.02); house.add(m); return m; });
      const dream = new T.Group(); house.add(dream);
      K.at(K.box(2.4, 1.3, 2, 'paper'), 0, 0.65, 0, dream);
      K.at(K.box(2.8, 0.1, 0.7, 'brass'), 0, 0.05, 1.25, dream);
      [[-0.6, 0.75], [0.6, 0.75]].forEach(([x, y]) => { const m = new T.Mesh(new T.PlaneGeometry(0.4, 0.4), win[0].material); m.position.set(x, y, 1.02); dream.add(m); });
      const roof = ctx.solid(new T.ConeGeometry(1.95, 1.1, 4), 'copper'); roof.rotation.y = Math.PI / 4; house.add(roof);
      const tree = new T.Group(); K.at(K.cyl(0.08, 0.1, 0.8, 'wood', 8), 0, 0.4, 0, tree); K.at(K.sph(0.45, 'good'), 0, 1.05, 0, tree); tree.position.set(1.8, 0, 0.6); house.add(tree);
      K.at(K.cyl(2.4, 2.5, 0.16, 'wood', 40), 0, -0.08, 0, house);
      house.position.set(0, -3.4, -0.5); ctx.scene.add(house);
      const hs = { d: 0, td: 0 };
      const S = stageRow(ctx, K, { pos: K.V(0, 1.3, 0.5) });
      const modeTag = K.tag('', K.V(0, 2.8, 0), 'q');
      let sit = 'zeit', mode = 'real', first = true;
      const out = K.readout();
      function render() {
        const D = KII[sit], st = D[mode];
        const size = S.show(st.t, st.keys, { snap: first });
        ctx.fit(Math.max(11, size.w + 2), 9 + size.h * 0.6, K.V(0, -0.6, 0), K.V(0, 0.22, 1));
        modeTag.pos.set(0, 2.5, 0.5);
        modeTag.set(mode === 'real' ? 'Wirklichkeit' : 'Konjunktiv II');
        hs.td = (mode === 'konj' && D.dream) ? 1 : 0;
        if (!first && mode === 'konj') S.pop(st.pop || []);
        first = false;
        const s = S.sentence();
        out.innerHTML = `<span class="de">${s}</span> ${say(s)} <span>· ${st.en}</span>` + (mode === 'konj'
          ? `<br>${D.dream ? 'Unreal wish: both halves in Konjunktiv II, and the wenn-clause verb at the end.' : sit === 'rat' ? 'Advice: <b>würde</b> + infinitive at the end.' : 'Same request, softer: Konjunktiv II is the polite form.'}` : '');
      }
      ctx.onFrame((dt, t) => {
        hs.d += (hs.td - hs.d) * K.f(dt, 4);
        if (ctx.reduce || Math.floor(t * 12) !== Math.floor((t - dt) * 12)) {
          dream.scale.y = Math.max(0.001, hs.d); dream.position.y = 1.8; dream.visible = hs.d > 0.02;
          roof.position.y = 1.8 + 0.55 + hs.d * 1.3;
          tree.scale.setScalar(Math.max(0.001, hs.d)); tree.visible = hs.d > 0.02;
          if (!ctx.reduce) house.rotation.y = Math.sin(ctx.twos(t) * 0.5) * 0.25 - 0.3;
        }
      });
      K.chips('Situation', Object.keys(KII).map(v => ({ v, label: KII[v].label })), sit, v => { sit = v; render(); });
      K.chips('Modus', [{ v: 'real', label: 'Wirklichkeit' }, { v: 'konj', label: 'Konjunktiv II' }], mode, v => { mode = v; render(); });
      render();
      K.onPortrait(render);
    },
  });

  // =====================================================================
  // Week 19 (B1): Passiv Präsens und Präteritum
  // =====================================================================
  const PAS = {
    drucker: { A: ['der Techniker', 'vom Techniker'], V: ['repariert', 'reparierte'], O: ['den Drucker', 'der Drucker'], P: 'repariert', en: ['The technician repairs the printer.', 'The printer is repaired (by the technician).'] },
    haus: { A: ['die Firma', 'von der Firma'], V: ['baut', 'baute'], O: ['das Haus', 'das Haus'], P: 'gebaut', en: ['The company builds the house.', 'The house is built (by the company).'] },
    koffer: { A: ['der Fahrer', 'vom Fahrer'], V: ['lädt', 'lud'], X: 'ein', O: ['den Koffer', 'der Koffer'], P: 'eingeladen', en: ['The driver loads the suitcase.', 'The suitcase is loaded (by the driver).'] },
    flug: { A: ['die Airline', 'von der Airline'], V: ['storniert', 'stornierte'], O: ['den Flug', 'der Flug'], P: 'storniert', en: ['The airline cancels the flight.', 'The flight is cancelled (by the airline).'] },
  };

  MM.register({
    id: 'passiv', day: 19, week: 3,
    title: 'Passiv',
    tagline: 'The passive puts the thing that something happens to in the spotlight: werden + Partizip II, the doer is optional (von + Dativ).',
    prompt: 'Pick a sentence and switch Aktiv/Passiv. The spotlight follows the subject; the object steps forward and becomes Nominativ.',
    body: `
<section>
  <p class="rule">Passiv = werden (position 2) + Partizip II (end). The old object becomes the subject.</p>
  <p>Use the passive when the action matters more than who does it: forms, news, instructions, history. The accusative object of the active sentence becomes the subject (<i>den Drucker</i> → <i>der Drucker</i>). Mention the doer only if needed, with <b>von + Dativ</b>.</p>
</section>
<section>
  <h2>Pattern</h2>
  ${table(['', 'Aktiv', 'Passiv'], [
    ['Präsens', `Der Techniker ${R('verb', 'repariert')} den Drucker.`, `Der Drucker ${R('verb', 'wird')} (vom Techniker) ${R('verb2', 'repariert')}.`],
    ['Präteritum', `Der Techniker ${R('verb', 'reparierte')} den Drucker.`, `Der Drucker ${R('verb', 'wurde')} (vom Techniker) ${R('verb2', 'repariert')}.`],
  ])}
  ${table(['werden', 'Präsens', 'Präteritum'], [['ich', 'werde', 'wurde'], ['du', 'wirst', 'wurdest'], ['er / sie / es', 'wird', 'wurde'], ['wir / sie / Sie', 'werden', 'wurden'], ['ihr', 'werdet', 'wurdet']])}
  <p>With a modal verb: <i>Das Formular <b>muss</b> bis Freitag <b>ausgefüllt werden</b>.</i></p>
</section>
<section>
  <h2>Examples</h2>
  ${ex([
    ['Das Haus wurde 1990 gebaut.', 'The house was built in 1990.'],
    ['Im Hotel wird das Frühstück ab sieben Uhr serviert.', 'At the hotel, breakfast is served from seven.'],
    ['Die Wohnung wird nächste Woche renoviert.', 'The flat is being renovated next week.'],
    ['Unser Flug wurde wegen des Wetters storniert.', 'Our flight was cancelled because of the weather.'],
    ['Die Rechnung muss bis Ende des Monats bezahlt werden.', 'The bill must be paid by the end of the month.'],
  ])}
</section>
<section>
  <h2>Common mistakes</h2>
  <ul class="mistakes">
    <li><s>Der Drucker ist repariert von dem Techniker.</s> → Der Drucker <b>wird</b> vom Techniker <b>repariert</b>.</li>
    <li><s>Den Drucker wird repariert.</s> → <b>Der</b> Drucker. It is now the subject: Nominativ.</li>
    <li><s>Das Haus wurde durch meinem Vater gebaut.</s> → <b>von</b> meinem Vater. The doer takes von + Dativ.</li>
    <li>Don’t mix up <b>werden</b> (passive, become) and <b>würde</b> (Konjunktiv II).</li>
  </ul>
</section>
<section><h2>Quiz</h2><div data-quiz></div></section>
<section>
  <div class="try">
    <h3>Schreiben: a complaint to the landlord</h3>
    <p>${PH2_TRY} Write to your landlord about things that have not been done, using the passive: <i>Die Heizung wurde noch nicht repariert. Der Müll wird nur einmal pro Woche abgeholt.</i> End with what you would like (Konjunktiv II).</p>
  </div>
</section>`,
    quiz: [
      { type: 'pick', q: 'Das Paket ___ morgen geliefert.', opts: ['wird', 'wurde', 'werden'], a: 0, why: 'Future meaning (morgen), singular subject: <em>wird</em> + Partizip.' },
      { type: 'pick', q: 'Die Brücke ___ 1890 gebaut.', opts: ['wurde', 'wird', 'war'], a: 0, why: 'Past passive: <em>wurde</em> + Partizip II.' },
      { type: 'pick', q: 'Die Fenster werden jede Woche ___.', opts: ['geputzt', 'putzen', 'putzt'], a: 0, why: 'The passive needs the Partizip II at the end: <em>geputzt</em>.' },
      { type: 'pick', q: 'Der Brief wurde ___ meiner Chefin geschrieben.', opts: ['von', 'durch', 'mit'], a: 0, why: 'The doer: <em>von</em> + Dativ.' },
      { type: 'order', q: 'Build the sentence:', tiles: ['In Österreich', 'wird', 'viel Kaffee', 'getrunken'], a: 'In Österreich wird viel Kaffee getrunken', why: 'werden in position 2, Partizip at the end; nobody in particular does it, so no von.' },
    ],
    mount(ctx) {
      const K = kit(ctx), T = ctx.THREE;
      ctx.backdrop({ center: K.V(0, 0, -2) });
      const S = stageRow(ctx, K, { pos: K.V(0, 0, 0) });
      const fitBench = bench(ctx, K);
      // spotlight on the subject
      const cone = new T.Mesh(new T.ConeGeometry(1.1, 3.4, 24, 1, true), new T.MeshBasicMaterial({ color: ctx.colors.warm.clone(), transparent: true, opacity: 0.16, depthWrite: false, side: T.DoubleSide }));
      cone.material.userData.key = 'warm'; cone.renderOrder = 3; ctx.scene.add(cone);
      const lamp = K.cyl(0.25, 0.4, 0.4, 'brass', 16); ctx.scene.add(lamp);
      const spot = { x: 0, tx: 0 };
      const modeTag = K.tag('', K.V(0, 3.3, 0), 'q');
      let ex1 = 'drucker', voice = 'akt', tense = 0, agent = true, first = true;
      const out = K.readout();
      function render() {
        const D = PAS[ex1];
        const tokens = [['A', D.A[0], 'subj'], ['V', D.V[tense], 'verb'], ['O', D.O[0], 'obj'], ['X', D.X || '', 'verb2'], ['W', tense ? 'wurde' : 'wird', 'verb'], ['P', D.P, 'verb2'], ['d', '.', 'punct']];
        let keys, text = {}, roles = {};
        if (voice === 'akt') keys = ['A', 'V', 'O', ...(D.X ? ['X'] : []), 'd'];
        else { keys = ['O', 'W', ...(agent ? ['A'] : []), 'P', 'd']; text = { O: D.O[1], A: D.A[1] }; roles = { O: 'subj', A: 'plain' }; }
        const size = S.show(tokens, keys, { snap: first, text, roles });
        fitBench(size, S.lines);
        ctx.fit(Math.max(10, size.w + 2), 5.2 + size.h, K.V(0, 1.0 - (S.lines - 1) * 0.62, 0), K.V(0, 0.25, 1));
        spot.tx = S.at(voice === 'akt' ? 'A' : 'O').x;
        modeTag.set(voice === 'akt' ? 'Aktiv · wer macht es?' : 'Passiv · was passiert?');
        if (!first) S.pop(voice === 'akt' ? ['A', 'V'] : ['O', 'W', 'P']);
        first = false;
        const s = S.sentence();
        out.innerHTML = `<span class="de">${s}</span> ${say(s)} <span>· ${D.en[voice === 'akt' ? 0 : 1]}</span><br>` + (voice === 'akt'
          ? `<b class="r-subj">${D.A[0]}</b> does the action; <b class="r-obj">${D.O[0]}</b> is the accusative object.`
          : `<b class="r-subj">${D.O[1]}</b> is now the subject (Nominativ). <b class="r-verb">${tense ? 'wurde' : 'wird'}</b> in position 2, <b class="r-verb2">${D.P}</b> at the end.` + (agent ? ` The doer is optional: <i>${D.A[1]}</i>.` : ''));
      }
      ctx.onFrame((dt, t) => {
        spot.x += (spot.tx - spot.x) * K.f(dt, 6);
        if (ctx.reduce || Math.floor(t * 12) !== Math.floor((t - dt) * 12)) { cone.position.set(spot.x, 1.45, 0.1); lamp.position.set(spot.x, 3.3, 0.1); }
      });
      K.chips('Satz', Object.keys(PAS).map(v => ({ v, label: PAS[v].O[1] })), ex1, v => { ex1 = v; render(); });
      K.chips('Form', [{ v: 'akt', label: 'Aktiv' }, { v: 'pas', label: 'Passiv' }], voice, v => { voice = v; render(); });
      K.chips('Zeit', [{ v: 0, label: 'Präsens' }, { v: 1, label: 'Präteritum' }], tense, v => { tense = v; render(); });
      K.chips('Täter', [{ v: true, label: 'mit von + Dativ' }, { v: false, label: 'ohne' }], agent, v => { agent = v; render(); });
      render();
      K.onPortrait(render);
    },
  });

  // =====================================================================
  // Week 20 (B1): Genitiv und wegen, trotz, während
  // =====================================================================
  const GEN = {
    streik: { P: 'wegen', nom: 'der', gen: 'des', N: 'Streik', E: 's', rest: [['fährt', 'verb'], ['heute', 'plain'], ['kein Zug', 'subj']], en: 'Because of the strike, no trains are running today.' },
    regen: { P: 'trotz', nom: 'der', gen: 'des', N: 'Regen', E: 's', rest: [['machen', 'verb'], ['wir', 'subj'], ['eine Radtour', 'obj']], en: 'Despite the rain, we’re going on a bike ride.' },
    reise: { P: 'während', nom: 'die', gen: 'der', N: 'Reise', E: '', rest: [['habe', 'verb'], ['ich', 'subj'], ['viel', 'plain'], ['gelesen', 'verb2']], en: 'During the trip, I read a lot.' },
    wetter: { P: 'wegen', nom: 'das', gen: 'des', N: 'Wetter', E: 's', rest: [['bleiben', 'verb'], ['wir', 'subj'], ['im Hotel', 'obj']], en: 'Because of the weather, we’re staying in the hotel.' },
    urlaub: { P: 'während', nom: 'der', gen: 'des', N: 'Urlaub', E: 's', rest: [['lese', 'verb'], ['ich', 'subj'], ['keine E-Mails', 'obj']], en: 'During the holiday, I don’t read any emails.' },
    arbeit: { P: 'trotz', nom: 'die', gen: 'der', N: 'Arbeit', E: '', rest: [['gehe', 'verb'], ['ich', 'subj'], ['heute', 'plain'], ['ins Kino', 'obj']], en: 'Despite the work, I’m going to the cinema today.' },
  };
  const GEN_MEAN = { wegen: 'because of (a reason)', trotz: 'despite (an obstacle that doesn’t stop it)', 'während': 'during (at the same time as)' };

  MM.register({
    id: 'genitiv', day: 20, week: 3,
    title: 'Genitiv: wegen, trotz, während',
    tagline: 'The genitive shows belonging and follows wegen, trotz and während: des/der, and masculine and neuter nouns add -s or -es.',
    prompt: 'Pick a noun and switch to Genitiv. The press stamps the -s onto masculine and neuter nouns.',
    body: `
<section>
  <p class="rule">Genitiv: des …(e)s for der/das nouns, der … for die and plural nouns.</p>
  <p>In everyday speech the genitive is mostly replaced by von + Dativ (<i>das Auto von meinem Chef</i>), but at B1 you need it for writing and for <b>wegen</b>, <b>trotz</b> and <b>während</b>. Masculine and neuter nouns take <b>-s</b>, or <b>-es</b> after one syllable or s/ß/z (<i>des Tages, des Hauses</i>).</p>
</section>
<section>
  <h2>Pattern</h2>
  ${table(['', 'm', 'f', 'n', 'Pl'], [
    ['bestimmt', 'des Streik<b class="hl">s</b>', 'der Reise', 'des Wetter<b class="hl">s</b>', 'der Kollegen'],
    ['unbestimmt / mein', 'meines Bruder<b class="hl">s</b>', 'meiner Schwester', 'eines Hotel<b class="hl">s</b>', 'meiner Eltern'],
  ])}
  ${table(['Preposition', 'Meaning', 'Example'], [
    ['wegen', 'because of', 'Wegen des Staus kam ich zu spät.'],
    ['trotz', 'despite', 'Trotz der Kälte schwimmen wir im See.'],
    ['während', 'during', 'Während des Meetings ist das Handy aus.'],
  ])}
  <p>In speech you will often hear <i>wegen dem Wetter</i> (Dativ). It’s fine to say, but write the genitive.</p>
</section>
<section>
  <h2>Examples</h2>
  ${ex([
    ['Wegen des Wetters bleiben wir heute zu Hause.', 'Because of the weather, we’re staying home today.'],
    ['Trotz der hohen Miete wohnen wir gern hier.', 'Despite the high rent, we like living here.'],
    ['Während der Probezeit habe ich viel gelernt.', 'During the probation period, I learned a lot.'],
    ['Das ist das Büro meines Chefs.', 'That is my boss’s office.'],
    ['Die Wohnung meiner Schwester liegt im dritten Stock.', 'My sister’s flat is on the third floor.'],
  ])}
</section>
<section>
  <h2>Common mistakes</h2>
  <ul class="mistakes">
    <li><s>wegen des Streik</s> → wegen des Streik<b>s</b>. Masculine and neuter nouns need -s.</li>
    <li><s>während des Reise</s> → während <b>der</b> Reise. Feminine: der, and no -s.</li>
    <li><s>das Auto meinem Chef</s> → das Auto <b>meines Chefs</b> (or von meinem Chef).</li>
    <li><s>trotz es regnet</s> → <b>obwohl</b> es regnet. trotz needs a noun, not a clause.</li>
  </ul>
</section>
<section><h2>Quiz</h2><div data-quiz></div></section>
<section>
  <div class="try">
    <h3>Schreiben: a delayed trip</h3>
    <p>${PH2_TRY} Write to your hotel that you will arrive late. Give reasons and circumstances with wegen, trotz and während: <i>Wegen des Bahnstreiks …, trotz der Verspätung …, während der Fahrt …</i></p>
  </div>
</section>`,
    quiz: [
      { type: 'pick', q: 'Wegen ___ Streiks fährt kein Zug.', opts: ['des', 'dem', 'den'], a: 0, why: 'wegen + Genitiv; der Streik → <em>des</em> Streiks.' },
      { type: 'pick', q: 'Während ___ Reise habe ich viel fotografiert.', opts: ['der', 'die', 'des'], a: 0, why: 'die Reise → Genitiv <em>der</em> Reise.' },
      { type: 'pick', q: 'Trotz des ___ gehen wir spazieren.', opts: ['Regens', 'Regen', 'Regenes'], a: 0, why: 'Masculine noun in the genitive takes -s: <em>des Regens</em>.' },
      { type: 'pick', q: 'Das ist das Auto ___ Chefin.', opts: ['meiner', 'meines', 'meine'], a: 0, why: 'Feminine genitive: <em>meiner</em> Chefin.' },
      { type: 'pick', q: 'Die Wohnung ___ Bruders ist sehr groß.', opts: ['meines', 'meiner', 'mein'], a: 0, why: 'Masculine genitive: <em>meines</em> Bruders.' },
    ],
    mount(ctx) {
      const K = kit(ctx);
      ctx.backdrop({ center: K.V(0, 0, -2) });
      const S = stageRow(ctx, K, { pos: K.V(0, 0, 0) });
      const fitBench = bench(ctx, K);
      const press = piston(ctx, K);
      const modeTag = K.tag('', K.V(0, 1.4, 0), 'q');
      let n = 'streik', mode = 'gen', first = true;
      const out = K.readout();
      function render() {
        const D = GEN[n];
        const tokens = [['P', D.P, 'conn'], ['A', D.nom, 'obj'], ['N', D.N, 'obj'], ['E', D.E || 's', 'es'], ...D.rest.map((r, i) => ['r' + i, r[0], r[1]]), ['d', '.', 'punct']];
        let keys, text = {};
        if (mode === 'nom') keys = ['A', 'N'];
        else { keys = ['P', 'A', 'N', ...(D.E ? ['E'] : []), ...D.rest.map((_, i) => 'r' + i), 'd']; text = { A: D.gen }; }
        const size = S.show(tokens, keys, { snap: first, text, tight: ['E'], cap: mode !== 'nom' });
        fitBench(size, S.lines);
        ctx.fit(Math.max(10, size.w + 2), 6 + size.h, K.V(0, 1.1 - (S.lines - 1) * 0.62, 0), K.V(0, 0.25, 1));
        modeTag.set(mode === 'nom' ? 'Nominativ' : `Genitiv · ${D.P}`);
        if (mode === 'gen' && !first) {
          const at = S.at(D.E ? 'E' : 'A');
          press.strike(at.x, at.y + 0.45, at.z);
          S.pop(D.E ? ['A', 'E'] : ['A']);
        } else { const at = S.at('N'); press.park(at.x, 3.4, 0); }
        first = false;
        const s = S.sentence();
        out.innerHTML = mode === 'nom'
          ? `<span class="de">${D.nom} ${D.N}</span> ${say(D.nom + ' ' + D.N)}<br>Dictionary form. Now switch to Genitiv.`
          : `<span class="de">${s}</span> ${say(s)} <span>· ${D.en}</span><br><b>${D.P}</b> = ${GEN_MEAN[D.P]}, + Genitiv: ${D.nom} → <b class="hl">${D.gen}</b>` + (D.E ? `, and the noun adds <b class="hl">-${D.E}</b>.` : ' (feminine: no ending on the noun).');
      }
      K.chips('Nomen', Object.keys(GEN).map(v => ({ v, label: `${GEN[v].nom} ${GEN[v].N}` })), n, v => { n = v; render(); });
      K.chips('Fall', [{ v: 'nom', label: 'Nominativ' }, { v: 'gen', label: 'Genitiv' }], mode, v => { mode = v; render(); });
      render();
      K.onPortrait(render);
    },
  });

  // =====================================================================
  // Week 21 (B1): Verben mit Präpositionen, da- und wo-Wörter
  // =====================================================================
  const VP = {
    warten: { S: 'ich', V: 'warte', Vq: 'wartest', Sq: 'du', P: 'auf', kase: 'Akk', thing: 'den Bus', person: 'meine Kollegin', pron: 'sie', wo: 'worauf', da: 'darauf', wen: 'auf wen' },
    freuen: { S: 'ich', V: 'freue', Vq: 'freust', Sq: 'du', R: 'mich', Rq: 'dich', P: 'auf', kase: 'Akk', thing: 'den Urlaub', person: 'meine Eltern', pron: 'sie', wo: 'worauf', da: 'darauf', wen: 'auf wen' },
    denken: { S: 'ich', V: 'denke', Vq: 'denkst', Sq: 'du', P: 'an', kase: 'Akk', thing: 'die Prüfung', person: 'meinen Bruder', pron: 'ihn', wo: 'woran', da: 'daran', wen: 'an wen' },
    interessieren: { S: 'ich', V: 'interessiere', Vq: 'interessierst', Sq: 'du', R: 'mich', Rq: 'dich', P: 'für', kase: 'Akk', thing: 'Architektur', person: 'die neue Kollegin', pron: 'sie', wo: 'wofür', da: 'dafür', wen: 'für wen' },
    'träumen': { S: 'ich', V: 'träume', Vq: 'träumst', Sq: 'du', P: 'von', kase: 'Dat', thing: 'einem Haus am Meer', person: 'meiner Oma', pron: 'ihr', wo: 'wovon', da: 'davon', wen: 'von wem' },
    sprechen: { S: 'wir', V: 'sprechen', Vq: 'sprecht', Sq: 'ihr', P: 'über', kase: 'Akk', thing: 'das Projekt', person: 'den Chef', pron: 'ihn', wo: 'worüber', da: 'darüber', wen: 'über wen' },
  };

  MM.register({
    id: 'verben-mit-praepositionen', day: 21, week: 3,
    title: 'Verben mit Präpositionen',
    tagline: 'Many verbs come chained to a fixed preposition; ask with wo(r)- and answer with da(r)- for things, but use the preposition + wen/wem and a pronoun for people.',
    prompt: 'Pick a verb, choose a thing or a person, then step through Satz → Frage → kurze Antwort.',
    body: `
<section>
  <p class="rule">Learn the verb and its preposition as one unit. Things: wo(r)+Präp / da(r)+Präp. People: Präp + wen/wem / Präp + Pronomen.</p>
  <p>The preposition is part of the verb and decides the case (<i>warten <b>auf</b> + Akk</i>, <i>träumen <b>von</b> + Dat</i>). To ask about a thing, glue <b>wo-</b> to the preposition; to refer back to a thing, glue <b>da-</b>. Add an <b>r</b> when the preposition starts with a vowel: wo<b>r</b>auf, da<b>r</b>an.</p>
</section>
<section>
  <h2>Pattern</h2>
  ${table(['Verb', 'Frage (Sache)', 'Antwort (Sache)', 'Frage (Person)'], [
    ['warten auf + A', 'Worauf?', 'darauf', 'Auf wen?'], ['denken an + A', 'Woran?', 'daran', 'An wen?'], ['sich freuen auf + A', 'Worauf?', 'darauf', 'Auf wen?'],
    ['sich interessieren für + A', 'Wofür?', 'dafür', 'Für wen?'], ['träumen von + D', 'Wovon?', 'davon', 'Von wem?'], ['sprechen über + A', 'Worüber?', 'darüber', 'Über wen?'],
    ['sich ärgern über + A', 'Worüber?', 'darüber', 'Über wen?'], ['Angst haben vor + D', 'Wovor?', 'davor', 'Vor wem?'],
  ])}
</section>
<section>
  <h2>Examples</h2>
  ${ex([
    ['Ich warte seit zwanzig Minuten auf den Bus.', 'I’ve been waiting for the bus for twenty minutes.'],
    ['Wir freuen uns schon auf die Reise nach Island.', 'We’re already looking forward to the trip to Iceland.'],
    ['Worüber habt ihr im Meeting gesprochen?', 'What did you talk about in the meeting?'],
    ['Ich habe mich über die hohe Rechnung geärgert.', 'I was annoyed about the high bill.'],
    ['Denkst du an den Termin? – Ja, ich denke daran.', 'Are you remembering the appointment? – Yes, I am.'],
  ])}
</section>
<section>
  <h2>Common mistakes</h2>
  <ul class="mistakes">
    <li><s>Ich warte für den Bus.</s> → Ich warte <b>auf</b> den Bus. Don’t translate the English preposition.</li>
    <li><s>Auf was wartest du?</s> is common in speech; write <b>Worauf</b> wartest du?</li>
    <li><s>Ich denke daran.</s> about your brother → Ich denke <b>an ihn</b>. da-words are only for things.</li>
    <li><s>Woauf</s> → Wo<b>r</b>auf. Add r before a vowel.</li>
  </ul>
</section>
<section><h2>Quiz</h2><div data-quiz></div></section>
<section>
  <div class="try">
    <h3>Schreiben: what matters to you at work</h3>
    <p>${PH2_TRY} Write to a mentor: what you are interested in (sich interessieren für), what you are looking forward to (sich freuen auf), what annoys you (sich ärgern über), and what you dream of (träumen von). Use one da-word to refer back.</p>
  </div>
</section>`,
    quiz: [
      { type: 'pick', q: 'Ich warte ___ den Bus.', opts: ['auf', 'für', 'an'], a: 0, why: '<em>warten auf</em> + Akkusativ.' },
      { type: 'pick', q: '___ denkst du? – An den Urlaub.', opts: ['Woran', 'Wofür', 'Worüber'], a: 0, why: '<em>denken an</em> → wo + r + an = <em>Woran</em>.' },
      { type: 'pick', q: 'Interessierst du dich für Fußball? – Ja, ich interessiere mich sehr ___.', opts: ['dafür', 'für ihn', 'für es'], a: 0, why: 'Fußball is a thing: da + für = <em>dafür</em>.' },
      { type: 'pick', q: '___ wartest du? – Auf meine Schwester.', opts: ['Auf wen', 'Worauf', 'Wen'], a: 0, why: 'Asking about a person: preposition + <em>wen</em>.' },
      { type: 'pick', q: 'Ich träume ___ einem Haus am Meer.', opts: ['von', 'über', 'auf'], a: 0, why: '<em>träumen von</em> + Dativ.' },
    ],
    mount(ctx) {
      const K = kit(ctx), T = ctx.THREE;
      ctx.backdrop({ center: K.V(0, 0, -2) });
      const S = stageRow(ctx, K, { pos: K.V(0, 0, 0) });
      const fitBench = bench(ctx, K);
      // a brass chain between verb and preposition
      const links = [];
      const linkGeo = new T.TorusGeometry(0.13, 0.035, 6, 14);
      for (let i = 0; i < 7; i++) { const m = ctx.solid(linkGeo, 'brass', { ink: 0.5 }); m.visible = false; ctx.scene.add(m); links.push(m); }
      const chain = { a: K.V(), b: K.V(), k: 0, on: false };
      const modeTag = K.tag('', K.V(0, 1.6, 0), 'q');
      let v = 'warten', who = 'thing', mode = 'satz', first = true;
      const out = K.readout();
      function render() {
        const D = VP[v];
        let tokens, pop = [];
        const refl = D.R ? [['R', D.R, 'obj']] : [];
        if (mode === 'satz') tokens = [['S', D.S, 'subj'], ['V', D.V, 'verb'], ...refl, ['P', D.P, 'conn'], ['O', who === 'thing' ? D.thing : D.person, 'obj'], ['d', '.', 'punct']];
        else if (mode === 'frage') { tokens = [['Q', who === 'thing' ? D.wo : D.wen, 'conn'], ['V', D.Vq, 'verb'], ['S', D.Sq, 'subj'], ...(D.R ? [['R', D.Rq, 'obj']] : []), ['d', '?', 'punct']]; pop = ['Q']; }
        else { tokens = [['S', D.S, 'subj'], ['V', D.V, 'verb'], ...refl, ...(who === 'thing' ? [['Q', D.da, 'conn']] : [['P', D.P, 'conn'], ['O', D.pron, 'obj']]), ['d', '.', 'punct']]; pop = who === 'thing' ? ['Q'] : ['O']; }
        const size = S.show(tokens, null, { snap: first });
        fitBench(size, S.lines);
        ctx.fit(Math.max(10, size.w + 2), 4.6 + size.h, K.V(0, 0.6 - (S.lines - 1) * 0.62, 0), K.V(0, 0.3, 1));
        modeTag.set(mode === 'satz' ? `${v} ${D.P} + ${D.kase}` : mode === 'frage' ? (who === 'thing' ? 'wo(r) + Präposition' : 'Präposition + wen/wem') : (who === 'thing' ? 'da(r) + Präposition' : 'Präposition + Pronomen'));
        chain.on = mode === 'satz';
        if (chain.on) { chain.a = S.at('V').add(K.V(0, -0.05, 0.35)); chain.b = S.at('P').add(K.V(0, -0.05, 0.35)); chain.k = ctx.reduce ? 1 : 0; }
        if (!first) S.pop(pop.length ? pop : ['P']);
        first = false;
        const s = S.sentence();
        const notes = {
          satz: `<b>${v} ${D.P}</b> + ${D.kase === 'Akk' ? 'Akkusativ' : 'Dativ'}: the preposition is chained to the verb.`,
          frage: who === 'thing' ? `About a thing: <b>${D.wo}</b> (wo${/^[aeiouü]/.test(D.P) ? '+r' : ''}+${D.P}).` : `About a person: <b>${D.wen}</b>, never a wo-word.`,
          kurz: who === 'thing' ? `Refer back to the thing with <b>${D.da}</b>.` : `For people, keep the preposition and use a pronoun: <b>${D.P} ${D.pron}</b>.`,
        };
        out.innerHTML = `<span class="de">${s}</span> ${say(s)}<br>${notes[mode]}`;
      }
      ctx.onFrame((dt, t) => {
        chain.k = Math.min(1, chain.k + dt / 0.5);
        if (!(ctx.reduce || Math.floor(t * 12) !== Math.floor((t - dt) * 12))) return;
        links.forEach((m, i) => {
          const f = (i + 0.5) / links.length;
          m.visible = chain.on && f <= chain.k + 0.01;
          if (!m.visible) return;
          m.position.lerpVectors(chain.a, chain.b, f); m.position.y -= Math.sin(f * Math.PI) * 0.35 + 0.35;
          m.rotation.set(i % 2 ? Math.PI / 2 : 0, Math.PI / 2, 0);
        });
      });
      K.chips('Verb', Object.keys(VP).map(x => ({ v: x, label: `${VP[x].R ? 'sich ' : ''}${x} ${VP[x].P}` })), v, x => { v = x; render(); });
      K.chips('Sache oder Person', [{ v: 'thing', label: 'Sache' }, { v: 'person', label: 'Person' }], who, x => { who = x; render(); });
      K.chips('Schritt', [{ v: 'satz', label: 'Satz' }, { v: 'frage', label: 'Frage' }, { v: 'kurz', label: 'kurze Antwort' }], mode, x => { mode = x; render(); });
      render();
      K.onPortrait(render);
    },
  });

  // =====================================================================
  // Week 22 (B1): Konnektoren: deshalb, trotzdem, obwohl, sondern (+ denn)
  // =====================================================================
  const KON = {
    deshalb: { pos: 'Position 1 → Verb, Subjekt', mean: 'that’s why (a consequence)',
      t: [['aS', 'der Zug', 'subj'], ['aV', 'hat', 'verb'], ['aR', 'Verspätung', 'obj'], ['bS', 'ich', 'subj'], ['bV', 'nehme', 'verb'], ['bR', 'ein Taxi', 'obj']],
      two: ['aS', 'aV', 'aR', 'd1', 'bS', 'bV', 'bR', 'd'], join: ['aS', 'aV', 'aR', 'c', 'k', 'bV', 'bS', 'bR', 'd'], cap: 'bS', en: 'The train is late, so I’m taking a taxi.' },
    trotzdem: { pos: 'Position 1 → Verb, Subjekt', mean: 'nevertheless (it happens anyway)',
      t: [['aS', 'es', 'subj'], ['aV', 'regnet', 'verb'], ['aR', 'stark', 'plain'], ['bS', 'wir', 'subj'], ['bV', 'gehen', 'verb'], ['bR', 'wandern', 'verb2']],
      two: ['aS', 'aV', 'aR', 'd1', 'bS', 'bV', 'bR', 'd'], join: ['aS', 'aV', 'aR', 'c', 'k', 'bV', 'bS', 'bR', 'd'], cap: 'bS', en: 'It’s raining hard, but we’re going hiking anyway.' },
    obwohl: { pos: 'Nebensatz → Verb am Ende', mean: 'although (same idea as trotzdem, from the other side)',
      t: [['aS', 'es', 'subj'], ['aV', 'regnet', 'verb'], ['aR', 'stark', 'plain'], ['bS', 'wir', 'subj'], ['bV', 'gehen', 'verb'], ['bR', 'wandern', 'verb2']],
      two: ['bS', 'bV', 'bR', 'd1', 'aS', 'aV', 'aR', 'd'], join: ['bS', 'bV', 'bR', 'c', 'k', 'aS', 'aR', 'aV', 'd'], cap: 'aS', en: 'We’re going hiking although it’s raining hard.' },
    denn: { pos: 'Position 0 → keine Änderung', mean: 'because (like weil, but no word-order change)',
      t: [['aS', 'der Zug', 'subj'], ['aV', 'hat', 'verb'], ['aR', 'Verspätung', 'obj'], ['bS', 'ich', 'subj'], ['bV', 'nehme', 'verb'], ['bR', 'ein Taxi', 'obj']],
      two: ['bS', 'bV', 'bR', 'd1', 'aS', 'aV', 'aR', 'd'], join: ['bS', 'bV', 'bR', 'c', 'k', 'aS', 'aV', 'aR', 'd'], cap: 'aS', en: 'I’m taking a taxi, because the train is late.' },
    sondern: { pos: 'Position 0 → nach einer Verneinung', mean: 'but rather (corrects a negation)',
      t: [['aS', 'ich', 'subj'], ['aV', 'arbeite', 'verb'], ['aN', 'nicht', 'plain'], ['aR', 'im Büro', 'obj'], ['bS', 'ich', 'subj'], ['bV', 'arbeite', 'verb'], ['bR', 'zu Hause', 'obj']],
      two: ['aS', 'aV', 'aN', 'aR', 'd1', 'bS', 'bV', 'bR', 'd'], join: ['aS', 'aV', 'aN', 'aR', 'c', 'k', 'bR', 'd'], cap: 'bS', en: 'I don’t work in the office but at home.' },
  };

  MM.register({
    id: 'konnektoren', day: 22, week: 3,
    title: 'Konnektoren',
    tagline: 'deshalb and trotzdem take position 1 (verb next), obwohl sends the verb to the end, and denn and sondern change nothing.',
    prompt: 'Pick a connector, then join the two sentences. Watch what happens to the verb in the second clause.',
    body: `
<section>
  <p class="rule">Position 0: und, aber, oder, denn, sondern. Position 1: deshalb, trotzdem, dann. Nebensatz: weil, obwohl.</p>
  <p>Connectors look alike but behave in three different ways. <b>Position 0</b> connectors stand outside the clause, so nothing moves. <b>Position 1</b> adverbs like deshalb and trotzdem take the first slot, so the verb comes next and the subject moves behind it. <b>Subordinating</b> connectors like obwohl send the verb to the end.</p>
</section>
<section>
  <h2>Pattern</h2>
  ${table(['Type', 'Connector', 'Example'], [
    ['Position 0', 'denn, sondern, aber, und', `…, ${R('conn', 'denn')} der Zug ${R('verb', 'hat')} Verspätung.`],
    ['Position 1', 'deshalb, trotzdem, darum, dann', `…, ${R('conn', 'deshalb')} ${R('verb', 'nehme')} ich ein Taxi.`],
    ['Nebensatz', 'obwohl, weil', `…, ${R('conn', 'obwohl')} es stark ${R('verb', 'regnet')}.`],
  ])}
  ${table(['Meaning', 'Clause connector', 'Nebensatz'], [['reason', 'denn', 'weil'], ['consequence', 'deshalb', '(so dass)'], ['contrast', 'trotzdem', 'obwohl']])}
</section>
<section>
  <h2>Examples</h2>
  ${ex([
    ['Die Wohnung ist sehr teuer, trotzdem haben wir sie genommen.', 'The flat is very expensive, but we took it anyway.'],
    ['Ich habe morgen frei, deshalb fahre ich heute Abend zu meinen Eltern.', 'I’m off tomorrow, so I’m going to my parents’ this evening.'],
    ['Obwohl ich wenig geschlafen habe, bin ich ganz fit.', 'Although I slept little, I feel quite fit.'],
    ['Wir fliegen nicht nach Spanien, sondern nach Portugal.', 'We’re not flying to Spain but to Portugal.'],
    ['Ich bleibe heute zu Hause, denn ich bin erkältet.', 'I’m staying home today, because I have a cold.'],
  ])}
</section>
<section>
  <h2>Common mistakes</h2>
  <ul class="mistakes">
    <li><s>…, deshalb ich nehme ein Taxi.</s> → …, deshalb <b>nehme ich</b> ein Taxi.</li>
    <li><s>…, obwohl es regnet stark.</s> → …, obwohl es stark <b>regnet</b>.</li>
    <li><s>…, denn der Zug Verspätung hat.</s> → …, denn der Zug <b>hat</b> Verspätung. denn is not weil.</li>
    <li><s>nicht im Büro, aber zu Hause</s> → <b>sondern</b> zu Hause. After a negation that you correct, use sondern.</li>
  </ul>
</section>
<section><h2>Quiz</h2><div data-quiz></div></section>
<section>
  <div class="try">
    <h3>Schreiben: the 100-word opinion email</h3>
    <p>${PH2_TRY} This is the full task: write a 100-word email to a friend about whether it is better to live in the city or in the country. Give your opinion and two reasons, one counter-argument, and a conclusion, using deshalb, trotzdem, obwohl, denn and sondern.</p>
  </div>
</section>`,
    quiz: [
      { type: 'pick', q: 'Ich bin krank, deshalb …', opts: ['bleibe ich zu Hause.', 'ich bleibe zu Hause.', 'ich zu Hause bleibe.'], a: 0, why: 'deshalb takes position 1, so the verb comes next: <em>bleibe ich</em>.' },
      { type: 'pick', q: 'Obwohl es kalt ist, …', opts: ['gehen wir schwimmen.', 'wir gehen schwimmen.', 'wir schwimmen gehen.'], a: 0, why: 'The obwohl-clause is position 1: verb, comma, verb.' },
      { type: 'pick', q: 'Das ist kein Hotel, ___ ein Hostel.', opts: ['sondern', 'aber', 'oder'], a: 0, why: 'Correcting a negation (kein): <em>sondern</em>.' },
      { type: 'pick', q: 'Ich habe wenig geschlafen. ___ bin ich fit.', opts: ['Trotzdem', 'Obwohl', 'Deshalb'], a: 0, why: 'Contrast, and the verb follows directly: <em>Trotzdem</em> (position 1).' },
      { type: 'order', q: 'Build the sentence:', tiles: ['Ich nehme ein Taxi,', 'denn', 'der Zug', 'hat', 'Verspätung'], a: 'Ich nehme ein Taxi, denn der Zug hat Verspätung', why: 'denn is position 0: normal word order after it.' },
    ],
    mount(ctx) {
      const K = kit(ctx);
      ctx.backdrop({ center: K.V(0, 0, -2) });
      const S = stageRow(ctx, K, { pos: K.V(0, 0, 0) });
      const fitBench = bench(ctx, K);
      const posTag = K.tag('', K.V(0, 1.4, 0), 'q');
      let k = 'deshalb', mode = 'join', first = true;
      const out = K.readout();
      function render() {
        const D = KON[k];
        const tokens = [...D.t, ['d1', '.', 'punct'], ['c', ',', 'punct'], ['k', k, 'conn'], ['d', '.', 'punct']];
        const text = {};
        if (mode === 'two') text[D.cap] = cap(D.t.find(t => t[0] === D.cap)[1]);
        const size = S.show(tokens, mode === 'two' ? D.two : D.join, { snap: first, text });
        fitBench(size, S.lines);
        ctx.fit(Math.max(10, size.w + 2), 4.4 + size.h, K.V(0, 0.6 - (S.lines - 1) * 0.62, 0), K.V(0, 0.3, 1));
        posTag.set(mode === 'two' ? 'zwei Sätze' : D.pos);
        if (!first && mode === 'join') S.pop(['k', k === 'obwohl' ? 'aV' : (k === 'deshalb' || k === 'trotzdem') ? 'bV' : 'k']);
        first = false;
        const s = S.sentence();
        out.innerHTML = `<span class="de">${s}</span> ${say(s)} <span>· ${D.en}</span><br><b class="r-conn">${k}</b> = ${D.mean}. ${mode === 'join' ? D.pos.replace('→', ':') + '.' : ''}`;
      }
      K.chips('Konnektor', Object.keys(KON).map(v => ({ v, label: v })), k, v => { k = v; render(); });
      K.chips('Satzbau', [{ v: 'two', label: 'Zwei Sätze' }, { v: 'join', label: 'Verbunden' }], mode, v => { mode = v; render(); });
      render();
      K.onPortrait(render);
    },
  });

})();
