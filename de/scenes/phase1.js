/* Akoo, level A2 (weeks 9-14): six grammar rules as painted 3D worlds.
 * Uses the shared engine (shared/app.js) and kit (shared/kit.js, window.GK) (ctx.solid, ctx.words, ctx.pop, ctx.backdrop, ctx.say, quiz).
 * All example sentences are original, on the study plan's themes: Reisen, Wohnen, Arbeit.
 */
(function () {
  'use strict';

  const { kit, cap, attr, say, ex, table, R, gear, makeFigure } = window.GK;

  // =====================================================================
  // Week 9 (A2): Nebensätze
  // =====================================================================
  const NS = {
    weil: { mS: 'ich', mV: 'bleibe', mR: ['zu Hause', 'obj'], sS: 'ich', sV: 'bin', sR: ['müde', 'obj'], en: 'I’m staying at home because I’m tired.', mean: 'because' },
    dass: { mS: 'ich', mV: 'weiß', mR: null, sS: 'der Zug', sV: 'hat', sR: ['Verspätung', 'obj'], en: 'I know that the train is late.', mean: 'that' },
    wenn: { mS: 'wir', mV: 'gehen', mR: ['wandern', 'verb2'], sS: 'das Wetter', sV: 'ist', sR: ['gut', 'obj'], en: 'We go hiking if the weather is good.', mean: 'if / when' },
    ob: { mS: 'ich', mV: 'weiß', mR: ['nicht', 'plain'], sS: 'das Hotel', sV: 'hat', sR: ['WLAN', 'obj'], en: 'I don’t know whether the hotel has Wi-Fi.', mean: 'whether' },
  };

  MM.register({
    id: 'nebensaetze', day: 9, week: 2,
    title: 'Nebensätze',
    tagline: 'After weil, dass, wenn and ob, the conjugated verb goes to the very end of its clause.',
    prompt: 'Pick a connector, then change the sentence shape. Watch the magenta block: the conjugated verb.',
    body: `
<section>
  <p class="rule">Connector in, conjugated verb out: to the end of the clause.</p>
  <p>A main clause keeps the conjugated verb in position 2. A subordinate clause starts with a connector such as <b>weil</b>, <b>dass</b>, <b>wenn</b> or <b>ob</b>, and that connector pushes the conjugated verb to the end. If the subordinate clause comes first, it fills position 1 of the whole sentence, so the main verb follows straight after the comma: <b>verb, comma, verb</b>.</p>
</section>
<section>
  <h2>Pattern</h2>
  ${table(['Shape', 'Conjugated verb', 'Example'], [
    ['Hauptsatz', 'position 2', `Ich ${R('verb', 'bin')} müde.`],
    ['Hauptsatz + Nebensatz', 'end of the Nebensatz', `Ich bleibe zu Hause, ${R('conn', 'weil')} ich müde ${R('verb', 'bin')}.`],
    ['Nebensatz first', 'verb , verb', `${R('conn', 'Weil')} ich müde ${R('verb', 'bin')}, ${R('verb', 'bleibe')} ich zu Hause.`],
    ['with a modal verb', 'modal last', `…, weil ich morgen ${R('verb2', 'arbeiten')} ${R('verb', 'muss')}.`],
    ['with Perfekt', 'haben/sein last', `…, weil der Zug zu spät ${R('verb2', 'gekommen')} ${R('verb', 'ist')}.`],
  ])}
  ${table(['Connector', 'Meaning', 'Use it for'], [
    ['weil', 'because', 'a reason'],
    ['dass', 'that', 'what someone says, thinks, knows or hopes'],
    ['wenn', 'if / when', 'a condition, or something that happens repeatedly or in the future'],
    ['ob', 'whether / if', 'a yes/no question inside a sentence'],
  ])}
</section>
<section>
  <h2>Examples</h2>
  ${ex([
    ['Ich nehme den Zug, weil er billiger ist als das Flugzeug.', 'I’m taking the train because it’s cheaper than the plane.'],
    ['Ich hoffe, dass die Wohnung einen Balkon hat.', 'I hope (that) the flat has a balcony.'],
    ['Wenn der Chef zustimmt, arbeite ich freitags im Homeoffice.', 'If the boss agrees, I’ll work from home on Fridays.'],
    ['Kannst du mir sagen, ob das Museum am Montag geöffnet ist?', 'Can you tell me whether the museum is open on Monday?'],
    ['Weil das Hotel ausgebucht war, haben wir eine Ferienwohnung gemietet.', 'Because the hotel was fully booked, we rented a holiday flat.'],
  ])}
</section>
<section>
  <h2>Common mistakes</h2>
  <ul class="mistakes">
    <li><s>…, weil ich bin müde.</s> → …, weil ich müde <b>bin</b>. You will hear verb-second after weil in casual speech, but write it at the end.</li>
    <li><s>Wenn ich Zeit habe, ich besuche dich.</s> → Wenn ich Zeit habe, <b>besuche ich</b> dich. The Nebensatz is position 1.</li>
    <li><s>Ich weiß nicht, wenn er kommt.</s> → Ich weiß nicht, <b>ob</b> er kommt. English “if” meaning “whether” is <b>ob</b>.</li>
    <li>No comma: German always puts a comma between the main clause and a weil/dass/wenn/ob clause.</li>
  </ul>
</section>
<section>
  <h2>Quiz</h2>
  <div data-quiz></div>
</section>
<section>
  <div class="try">
    <h3>Sprechen: why did you go?</h3>
    <p>Tell a 30-second story about a past trip. Use each connector once:</p>
    <ul>
      <li><b>weil</b>: why you went (… , weil ich das Meer sehen wollte.)</li>
      <li><b>dass</b>: what you thought or hoped (Ich dachte, dass es dort warm ist.)</li>
      <li><b>ob</b>: something you didn’t know (Ich wusste nicht, ob es im Hotel Frühstück gibt.)</li>
      <li><b>wenn</b>: a tip for others (Wenn du nach Lissabon fährst, musst du die Straßenbahn nehmen.)</li>
    </ul>
    <p>Record yourself, then listen: is every conjugated verb at the end of its clause?</p>
  </div>
</section>`,
    quiz: [
      { type: 'pick', q: 'Ich lerne Deutsch, weil ich in Wien ___ möchte.', opts: ['arbeiten', 'arbeite', 'zu arbeiten'], a: 0, why: 'The modal <em>möchte</em> is the conjugated verb, so it goes last; the infinitive <em>arbeiten</em> sits just before it.' },
      { type: 'pick', q: 'Weißt du, ___ der Zug pünktlich ist?', opts: ['ob', 'dass', 'wenn'], a: 0, why: 'It hides a yes/no question (Ist der Zug pünktlich?), so it takes <em>ob</em>.' },
      { type: 'order', q: 'Ich finde, …', tiles: ['dass', 'die', 'Wohnung', 'zu', 'teuer', 'ist'], a: 'dass die Wohnung zu teuer ist', why: '<em>dass</em> first, conjugated verb <em>ist</em> last.' },
      { type: 'pick', q: '___ ich Zeit habe, besuche ich dich.', opts: ['Wenn', 'Ob', 'Dass'], a: 0, why: 'A condition (“if I have time”) takes <em>wenn</em>.' },
      { type: 'pick', q: 'Weil es regnet, …', opts: ['bleiben wir zu Hause.', 'wir bleiben zu Hause.', 'wir zu Hause bleiben.'], a: 0, why: 'The weil-clause is position 1, so the main verb comes straight after the comma: verb, comma, verb.' },
    ],
    mount(ctx) {
      const K = kit(ctx), T = ctx.THREE;
      ctx.backdrop({ center: K.V(0, 0, -2) });
      const bench = K.at(K.box(10, 0.3, 1.6, 'wood'), 0, -0.65, 0);
      const rail = K.at(K.box(10, 0.08, 0.1, 'brass', { ink: 0.6 }), 0, -0.48, 0.82);
      const row = ctx.words([
        ['mS', 'ich', 'subj'], ['mV', 'bleibe', 'verb'], ['mR', 'zu Hause', 'obj'], ['d1', '.', 'punct'],
        ['c1', ',', 'punct'], ['cj', 'weil', 'conn'], ['sS', 'ich', 'subj'], ['sV', 'bin', 'verb'], ['sR', 'müde', 'obj'], ['d2', '.', 'punct'],
      ]);
      const label = K.tag('', K.V(0, 1.2, 0), 'q');
      let conn = 'weil', mode = 'main', first = true;
      const out = K.readout();

      function render() {
        const D = NS[conn];
        const text = { mS: D.mS, mV: D.mV, mR: D.mR ? D.mR[0] : '', d1: '.', c1: ',', cj: conn, sS: D.sS, sV: D.sV, sR: D.sR[0], d2: '.' };
        const roles = { mR: D.mR ? D.mR[1] : 'obj', sR: D.sR[1] };
        const mR = D.mR ? ['mR'] : [];
        let keys;
        if (mode === 'two') {
          const second = conn === 'ob' ? ['sV', 'sS', 'sR'] : ['sS', 'sV', 'sR'];
          text[second[0]] = cap(text[second[0]]);
          if (conn === 'ob') text.d2 = '?';
          keys = ['mS', 'mV', ...mR, 'd1', ...second, 'd2'];
        } else if (mode === 'main') keys = ['mS', 'mV', ...mR, 'c1', 'cj', 'sS', 'sR', 'sV', 'd2'];
        else keys = ['cj', 'sS', 'sR', 'sV', 'c1', 'mV', 'mS', ...mR, 'd2'];
        const size = row.arrange(keys, { text, roles, maxW: ctx.portrait ? 6.6 : 30, snap: first });
        const lines = Math.round(size.h / 1.25);
        K.resize(bench, size.w + 1.2, 0.3, 1.6); bench.position.y = -(lines - 1) * 1.25 - 0.65;
        K.resize(rail, size.w + 1.2, 0.08, 0.1); rail.position.y = bench.position.y + 0.17;
        label.pos.set(0, 1.25, 0);
        label.set(mode === 'two' ? 'zwei Hauptsätze' : mode === 'main' ? 'Hauptsatz , Nebensatz' : 'Nebensatz , Hauptsatz');
        ctx.fit(size.w + 2, size.h + 2.6, K.V(0, -(lines - 1) * 0.62 + 0.1, 0), K.V(0, 0.3, 1));
        if (!first) {
          K.after(0.3, () => { if (mode !== 'two') { ctx.pop(row.blocks.sV); ctx.pop(row.blocks.cj); } else ctx.pop(row.blocks.sV); if (mode === 'sub') ctx.pop(row.blocks.mV); });
        }
        first = false;
        const s = K.sentence(row, keys);
        let note;
        if (mode === 'two') note = conn === 'ob'
          ? `Two main clauses; the second is a yes/no question, so its verb <b class="r-verb">${row.blocks.sV.word}</b> comes first. <b>ob</b> turns that question into a clause.`
          : `Two main clauses: each conjugated verb sits in position 2.`;
        else if (mode === 'main') note = `<b class="r-conn">${conn}</b> (${D.mean}) sends the conjugated verb <b class="r-verb">${D.sV}</b> to the end of its clause.`;
        else note = `The Nebensatz fills position 1, so the main verb <b class="r-verb">${D.mV}</b> comes right after the comma: verb, comma, verb.`;
        out.innerHTML = `<span class="de">${s}</span> ${say(s)}<br>${note}`;
      }
      K.chips('Konnektor', ['weil', 'dass', 'wenn', 'ob'].map(v => ({ v, label: v })), conn, v => { conn = v; render(); });
      K.chips('Satzbau', [{ v: 'two', label: 'Zwei Sätze' }, { v: 'main', label: 'Hauptsatz zuerst' }, { v: 'sub', label: 'Nebensatz zuerst' }], mode, v => { mode = v; render(); });
      render();
      K.onPortrait(render);
    },
  });

  // =====================================================================
  // Week 10 (A2): Perfekt vs. Präteritum
  // =====================================================================
  const PV = {
    fahren: { S: 'ich', aux: 'bin', part: 'gefahren', prat: 'fuhr', R: 'nach Hamburg', sein: true, en: 'I went (travelled) to Hamburg.' },
    fliegen: { S: 'er', aux: 'ist', part: 'geflogen', prat: 'flog', R: 'nach Rom', sein: true, en: 'He flew to Rome.' },
    buchen: { S: 'wir', aux: 'haben', part: 'gebucht', prat: 'buchten', R: 'ein Hotel', en: 'We booked a hotel.' },
    arbeiten: { S: 'sie', aux: 'hat', part: 'gearbeitet', prat: 'arbeitete', R: 'im Büro', en: 'She worked in the office.' },
    sein: { S: 'ich', aux: 'bin', part: 'gewesen', prat: 'war', R: 'sehr müde', sein: true, en: 'I was very tired.', special: true },
  };

  MM.register({
    id: 'perfekt-praeteritum', day: 10, week: 2,
    title: 'Perfekt vs. Präteritum',
    tagline: 'Speak in Perfekt (haben/sein + participle at the end); write stories in Präteritum, one verb in position 2.',
    prompt: 'Pick a verb, then switch tense. The Präteritum block splits into haben/sein (position 2) and the participle (the end).',
    body: `
<section>
  <p class="rule">Perfekt = haben/sein in position 2 + Partizip II at the end. Präteritum = one verb in position 2.</p>
  <p>Both describe the past. In conversation, emails and messages, Germans mostly use the <b>Perfekt</b>. In written stories, reports and news you meet the <b>Präteritum</b>. The big exception: <b>sein</b>, <b>haben</b> and the modal verbs are nearly always Präteritum, even in speech: <i>ich war, ich hatte, ich konnte, ich musste, ich wollte</i>.</p>
</section>
<section>
  <h2>Pattern</h2>
  ${table(['', 'Position 2', 'Middle', 'End'], [
    ['Perfekt', R('verb', 'bin / habe'), 'nach Wien / ein Ticket', R('verb2', 'gefahren / gebucht')],
    ['Präteritum', R('verb', 'fuhr / buchte'), 'nach Wien / ein Ticket', '–'],
  ])}
  ${table(['Use sein with…', 'Examples'], [
    ['movement from A to B', 'fahren, fliegen, gehen, kommen, reisen, laufen'],
    ['a change of state', 'aufstehen, einschlafen, aufwachen, sterben'],
    ['sein, bleiben, passieren', 'Ich bin zu Hause geblieben. Was ist passiert?'],
  ])}
  ${table(['Partizip II', 'Rule', 'Examples'], [
    ['regular', 'ge- … -t', 'gebucht, gearbeitet, gewohnt'],
    ['irregular', 'ge- … -en (often a vowel change)', 'gefahren, geflogen, geschrieben'],
    ['be-, ver-, er-, -ieren', 'no ge-', 'besucht, verpasst, erklärt, telefoniert'],
    ['separable', '-ge- in the middle', 'angekommen, eingekauft, umgezogen'],
  ])}
</section>
<section>
  <h2>Examples</h2>
  ${ex([
    ['Wir sind mit dem Nachtzug nach Wien gefahren.', 'We took the night train to Vienna.'],
    ['Ich habe im Hotel gut geschlafen.', 'I slept well at the hotel.'],
    ['Am ersten Tag war ich sehr müde.', 'On the first day I was very tired.'],
    ['Sie hat drei Jahre bei einer Bank gearbeitet.', 'She worked at a bank for three years.'],
    ['Im Jahr 2019 reiste er durch Südamerika.', 'In 2019 he travelled through South America. (written style)'],
    ['Wir hatten keine Zeit, also sind wir mit dem Taxi gefahren.', 'We had no time, so we took a taxi.'],
  ])}
</section>
<section>
  <h2>Common mistakes</h2>
  <ul class="mistakes">
    <li><s>Ich habe nach Wien gefahren.</s> → Ich <b>bin</b> nach Wien gefahren. Movement from A to B takes sein.</li>
    <li><s>Wir haben das Museum gebesucht.</s> → Wir haben das Museum <b>besucht</b>. No ge- after be-.</li>
    <li><s>Ich habe gekauft ein Ticket.</s> → Ich habe ein Ticket <b>gekauft</b>. The participle closes the sentence.</li>
    <li><i>Ich bin müde gewesen</i> is correct but sounds heavy. Say <b>Ich war müde.</b></li>
  </ul>
</section>
<section>
  <h2>Quiz</h2>
  <div data-quiz></div>
</section>
<section>
  <div class="try">
    <h3>Sprechen: tell your last trip</h3>
    <p>Six sentences, out loud, in Perfekt, with war and hatte where they fit:</p>
    <ul>
      <li>Wann und wohin? (Im Mai bin ich nach … gefahren.)</li>
      <li>Wie? (Ich bin mit dem Zug / mit dem Flugzeug gereist.)</li>
      <li>Was hast du gemacht? Two things, with haben.</li>
      <li>Wie war das Wetter? (Es war …)</li>
      <li>Ein Problem? (Ich hatte …)</li>
    </ul>
    <p>Then write the same story in three sentences of Präteritum, as if for a travel blog.</p>
  </div>
</section>`,
    quiz: [
      { type: 'pick', q: 'Letztes Jahr ___ wir nach Portugal geflogen.', opts: ['sind', 'haben', 'wurden'], a: 0, why: '<em>fliegen</em> is movement from A to B, so it takes <em>sein</em>.' },
      { type: 'pick', q: 'Wir ___ im Hotel gefrühstückt.', opts: ['haben', 'sind', 'waren'], a: 0, why: '<em>frühstücken</em> is not movement or a change of state, so it takes <em>haben</em>.' },
      { type: 'pick', q: 'Im Urlaub ___ das Wetter leider schlecht.', opts: ['war', 'wart', 'waren'], a: 0, why: 'For <em>sein</em>, use the Präteritum even in speech. <em>das Wetter</em> is singular, so <em>war</em>.' },
      { type: 'pick', q: 'Ich habe zwei Stunden im Büro ___.', opts: ['gearbeitet', 'arbeitete', 'arbeiten'], a: 0, why: 'After <em>habe</em> you need the Partizip II at the end: <em>gearbeitet</em>.' },
      { type: 'order', q: 'Build the Perfekt sentence:', tiles: ['Sie', 'ist', 'gestern', 'nach Hause', 'gegangen'], a: 'Sie ist gestern nach Hause gegangen', why: '<em>ist</em> in position 2, the participle <em>gegangen</em> at the end; time (gestern) before place (nach Hause).' },
    ],
    mount(ctx) {
      const K = kit(ctx), T = ctx.THREE;
      ctx.backdrop({ center: K.V(0, 0, -2) });
      // clockwork timeline
      const rail = K.cyl(0.09, 0.09, 12, 'brass', 12); rail.rotation.z = Math.PI / 2; K.at(rail, 0, -0.9, 0);
      for (let i = 0; i <= 10; i++) K.at(K.box(0.07, i % 5 ? 0.3 : 0.55, 0.07, 'brass', { ink: 0.5 }), -5.5 + i * 1.1, -0.9, 0);
      const g1 = K.at(gear(K, 0.9, 12, 'brass'), -6.6, -0.9, -0.1);
      const g2 = K.at(gear(K, 0.5, 8, 'copper'), -5.6, -2.0, -0.2);
      const now = K.cyl(0, 0.25, 0.5, 'verb2', 14); now.rotation.z = Math.PI; K.at(now, 5.6, -0.25, 0);
      const ev = K.at(K.sph(0.24, 'verb'), -2.2, -0.9, 0);
      K.tag('<b>jetzt</b>', K.V(5.6, 0.25, 0));
      K.tag('<b>Vergangenheit</b>', K.V(-2.2, -1.6, 0));
      const style = K.tag('', K.V(0, 2.5, 0), 'q');
      const row = ctx.words([['S', 'ich', 'subj'], ['aux', 'bin', 'verb'], ['prat', 'fuhr', 'verb'], ['R', 'nach Hamburg', 'obj'], ['part', 'gefahren', 'verb2'], ['d', '.', 'punct']]);
      row.root.position.y = 1.1;
      let verb = 'fahren', tense = 'perfekt', first = true, angle = 0, shown = 0;
      const out = K.readout();
      function render() {
        const D = PV[verb];
        const keys = tense === 'perfekt' ? ['S', 'aux', 'R', 'part', 'd'] : ['S', 'prat', 'R', 'd'];
        const size = row.arrange(keys, { text: { S: D.S, aux: D.aux, prat: D.prat, R: D.R, part: D.part, d: '.' }, maxW: ctx.portrait ? 6.5 : 30, snap: first });
        ctx.fit(Math.max(14, size.w + 2), 6 + size.h, K.V(0, 0.4 - (size.h - 1.25) / 2, 0), K.V(0, 0.25, 1));
        style.set(tense === 'perfekt' ? 'gesprochen · Perfekt' : 'geschrieben · Präteritum');
        if (!first) { angle += Math.PI / 3; K.after(0.3, () => { tense === 'perfekt' ? (ctx.pop(row.blocks.aux), ctx.pop(row.blocks.part)) : ctx.pop(row.blocks.prat); }); }
        first = false;
        const s = K.sentence(row, keys);
        const note = tense === 'perfekt'
          ? `<b class="r-verb">${D.aux}</b> (${D.sein ? 'sein' : 'haben'}) in position 2, participle <b class="r-verb2">${D.part}</b> at the end.` + (D.special ? ' Correct, but for <b>sein</b> people usually say <b>Ich war sehr müde</b>.' : D.sein ? ' Movement from A to B, so sein.' : '')
          : `One verb, <b class="r-verb">${D.prat}</b>, in position 2.` + (D.special ? ' For <b>sein</b>, this is the form to use in speech too.' : ' Typical in writing: stories, reports, news.');
        out.innerHTML = `<span class="de">${s}</span> ${say(s)} <span>· ${D.en}</span><br>${note}`;
      }
      ctx.onFrame((dt, t) => {
        // gears turn on twos: the displayed angle steps toward the target
        shown += (angle - shown) * K.f(dt, 5);
        const q = ctx.reduce ? angle : Math.round(shown / (Math.PI / 24)) * (Math.PI / 24);
        g1.rotation.z = -q; g2.rotation.z = q * 1.5;
        if (!ctx.reduce) ev.position.y = -0.9 + Math.abs(Math.sin(ctx.twos(t) * 2)) * 0.25;
      });
      K.chips('Verb', Object.keys(PV).map(v => ({ v, label: v })), verb, v => { verb = v; render(); });
      K.chips('Zeitform', [{ v: 'perfekt', label: 'Perfekt (gesprochen)' }, { v: 'prat', label: 'Präteritum (geschrieben)' }], tense, v => { tense = v; render(); });
      render();
      K.onPortrait(render);
    },
  });

  // =====================================================================
  // Week 11 (A2): Wechselpräpositionen
  // =====================================================================
  // positions are the cat's feet; ctrl is the arc's control point for the Wohin? path
  const WP = {
    auf: { wo: { S: 'die Katze', V: 'sitzt', A: 'dem', N: 'Tisch' }, wohin: { S: 'die Katze', V: 'springt', A: 'den', N: 'Tisch' }, pos: [0, 1.6, 0.1], ctrl: [-2.2, 4.2, 1.4], ry: 0 },
    unter: { wo: { S: 'die Katze', V: 'sitzt', A: 'dem', N: 'Tisch' }, wohin: { S: 'die Katze', V: 'läuft', A: 'den', N: 'Tisch' }, pos: [0, 0, 0], ctrl: [-2.4, 0.3, 1.6], ry: 0 },
    neben: { wo: { S: 'die Katze', V: 'sitzt', A: 'dem', N: 'Tisch' }, wohin: { S: 'die Katze', V: 'läuft', A: 'den', N: 'Tisch' }, pos: [-3.0, 0, 0.4], ctrl: [-4.4, 0.6, 1.2], ry: 0 },
    vor: { wo: { S: 'die Katze', V: 'sitzt', A: 'dem', N: 'Tisch' }, wohin: { S: 'die Katze', V: 'läuft', A: 'den', N: 'Tisch' }, pos: [0, 0, 1.9], ctrl: [-2.4, 0.6, 2.6], ry: 0 },
    hinter: { wo: { S: 'die Katze', V: 'sitzt', A: 'dem', N: 'Tisch' }, wohin: { S: 'die Katze', V: 'läuft', A: 'den', N: 'Tisch' }, pos: [0, 0, -1.6], ctrl: [-3.6, 0.5, -1.4], ry: 0 },
    an: { wo: { S: 'die Katze', V: 'sitzt', P: 'am', A: null, N: 'Tisch' }, wohin: { S: 'die Katze', V: 'geht', A: 'den', N: 'Tisch' }, pos: [-1.2, 0, 1.25], ctrl: [-3.2, 0.5, 2.0], ry: 0, note: '<b>am</b> = an + dem, the everyday form.' },
    in: { wo: { S: 'die Katze', V: 'liegt', A: 'der', N: 'Schublade' }, wohin: { S: 'die Katze', V: 'springt', A: 'die', N: 'Schublade' }, pos: [1.1, 1.08, 1.35], ctrl: [-1.6, 3.0, 2.6], ry: 0, drawer: true, note: '<b>die Schublade</b> is feminine: der (Dativ) / die (Akkusativ).' },
    zwischen: { wo: { S: 'die Katze', V: 'sitzt', A: 'dem', N: 'Tisch', A2: 'dem', N2: 'Stuhl' }, wohin: { S: 'die Katze', V: 'läuft', A: 'den', N: 'Tisch', A2: 'den', N2: 'Stuhl' }, pos: [2.55, 0, 0.3], ctrl: [0.6, 0.6, 2.8], ry: Math.PI / 2 },
    'über': { wo: { S: 'die Lampe', V: 'hängt', A: 'dem', N: 'Tisch' }, wohin: { S: 'ich', V: 'hänge', O: 'die Lampe', A: 'den', N: 'Tisch' }, lamp: true, note: 'The cat can’t float, so the lamp shows this one.' },
  };
  const CAT_START = [-4.8, 0, 2.4];

  function makeCat(K) {
    const T = K.T, g = new T.Group();
    const body = K.sph(0.36, 'copper'); body.scale.set(1.35, 0.85, 0.85); body.position.set(0, 0.42, 0); g.add(body);
    const head = K.sph(0.24, 'copper'); head.position.set(0.5, 0.72, 0); g.add(head);
    [-0.11, 0.11].forEach(z => {
      const ear = K.cyl(0, 0.08, 0.17, 'copper', 4); ear.position.set(0.5, 0.97, z); g.add(ear);
      const eye = new T.Mesh(new T.SphereGeometry(0.035, 8, 6), new T.MeshBasicMaterial({ color: 0x14100c })); eye.position.set(0.71, 0.76, z * 0.8); g.add(eye);
    });
    [[0.3, 0.13], [0.3, -0.13], [-0.3, 0.13], [-0.3, -0.13]].forEach(([x, z]) => { const l = K.cyl(0.06, 0.05, 0.3, 'copper', 8); l.position.set(x, 0.15, z); g.add(l); });
    const tail = K.cyl(0.05, 0.035, 0.62, 'copper', 8); tail.position.set(-0.6, 0.62, 0); tail.rotation.z = 0.7; g.add(tail);
    g.userData.tail = tail;
    return g;
  }

  MM.register({
    id: 'wechselpraepositionen', day: 11, week: 2,
    title: 'Wechselpräpositionen',
    tagline: 'Nine prepositions take the Dativ for a location (Wo?) and the Akkusativ for a direction (Wohin?).',
    prompt: 'Pick a preposition, then switch between Wo? (staying put) and Wohin? (moving somewhere). Watch the article flip.',
    body: `
<section>
  <p class="rule">Wo? → Dativ (dem Tisch). Wohin? → Akkusativ (den Tisch).</p>
  <p>The nine two-way prepositions are <b>an, auf, hinter, in, neben, über, unter, vor, zwischen</b>. Ask the question the sentence answers. If something is already in a place, it is <b>Wo?</b> and takes the Dativ. If something moves to a new place, it is <b>Wohin?</b> and takes the Akkusativ.</p>
</section>
<section>
  <h2>Pattern</h2>
  ${table(['', 'der', 'die', 'das', 'die (Pl.)'], [
    ['Wo? Dativ', 'dem', 'der', 'dem', 'den …n'],
    ['Wohin? Akkusativ', 'den', 'die', 'das', 'die'],
  ])}
  ${table(['Wohin? (put, Akk.)', 'Wo? (be there, Dat.)'], [
    ['stellen: Ich stelle die Flasche auf den Tisch.', 'stehen: Die Flasche steht auf dem Tisch.'],
    ['legen: Ich lege das Handy auf das Sofa.', 'liegen: Das Handy liegt auf dem Sofa.'],
    ['setzen: Ich setze mich auf den Stuhl.', 'sitzen: Ich sitze auf dem Stuhl.'],
    ['hängen: Ich hänge die Jacke an den Haken.', 'hängen: Die Jacke hängt am Haken.'],
  ])}
  <p>Contractions you hear all the time: in dem → <b>im</b>, an dem → <b>am</b>, in das → <b>ins</b>, an das → <b>ans</b>.</p>
</section>
<section>
  <h2>Examples</h2>
  ${ex([
    ['Ich stelle die Kaffeemaschine in die Küche.', 'I’m putting the coffee machine in the kitchen. (Wohin?)'],
    ['Die Kaffeemaschine steht in der Küche.', 'The coffee machine is in the kitchen. (Wo?)'],
    ['Der Laptop liegt auf dem Schreibtisch.', 'The laptop is on the desk.'],
    ['Häng die Jacke bitte an den Haken.', 'Please hang the jacket on the hook.'],
    ['Wir fahren am Wochenende ans Meer.', 'We’re going to the seaside at the weekend.'],
    ['Im Sommer waren wir am Meer.', 'In the summer we were at the seaside.'],
  ])}
</section>
<section>
  <h2>Common mistakes</h2>
  <ul class="mistakes">
    <li><s>Ich lege das Buch auf dem Tisch.</s> → auf <b>den</b> Tisch. Putting = movement = Akkusativ.</li>
    <li><s>Ich wohne in die Stadt.</s> → in <b>der</b> Stadt. Living somewhere is a location.</li>
    <li>Mixing up the verb pairs: <s>Ich stehe die Flasche auf den Tisch.</s> → Ich <b>stelle</b> die Flasche auf den Tisch.</li>
    <li>Movement inside one place stays Dativ: Wir laufen <b>im</b> Park. (Wo? in the park.)</li>
  </ul>
</section>
<section>
  <h2>Quiz</h2>
  <div data-quiz></div>
</section>
<section>
  <div class="try">
    <h3>Sprechen: the holiday flat</h3>
    <p>Describe the room you stayed in on a past trip. Say three sentences with <b>Wo?</b> and three with <b>Wohin?</b>:</p>
    <ul>
      <li>Das Bett stand neben dem Fenster. Der Schrank stand an der Wand.</li>
      <li>Ich habe meinen Koffer unter das Bett gelegt. Ich habe meine Jacke an den Haken gehängt.</li>
    </ul>
    <p>Before each sentence, ask yourself: Wo or Wohin?</p>
  </div>
</section>`,
    quiz: [
      { type: 'pick', q: 'Ich stelle die Tasche auf ___ Stuhl.', opts: ['den', 'dem', 'der'], a: 0, why: '<em>stellen</em> = putting something somewhere (Wohin?), so Akkusativ: der Stuhl → <em>den</em> Stuhl.' },
      { type: 'pick', q: 'Die Tasche steht auf ___ Stuhl.', opts: ['dem', 'den', 'das'], a: 0, why: '<em>stehen</em> = location (Wo?), so Dativ: <em>dem</em> Stuhl.' },
      { type: 'pick', q: 'Wir hängen das Bild an ___ Wand.', opts: ['die', 'der', 'den'], a: 0, why: 'Movement to the wall (Wohin?), Akkusativ of <em>die Wand</em> stays <em>die</em>.' },
      { type: 'pick', q: 'Das Bild hängt an ___ Wand.', opts: ['der', 'die', 'dem'], a: 0, why: 'Location (Wo?), Dativ feminine: <em>der</em> Wand.' },
      { type: 'pick', q: 'Ich lege den Schlüssel ___ Schublade.', opts: ['in die', 'in der', 'im'], a: 0, why: '<em>legen</em> is putting (Wohin?), so Akkusativ: <em>in die</em> Schublade.' },
    ],
    mount(ctx) {
      const K = kit(ctx), T = ctx.THREE;
      ctx.backdrop({ center: K.V(0, 1, -2), radius: 10 });
      K.at(K.box(12, 0.2, 7, 'wood'), 0, -0.1, 0);
      K.at(K.box(12, 6.6, 0.2, 'neutral'), 0, 3.2, -2.6);
      K.at(K.box(12, 0.18, 0.24, 'brass', { ink: 0.6 }), 0, 0.09, -2.45);
      // desk
      K.at(K.box(4, 0.2, 1.8, 'wood'), 0, 1.5, 0);
      [[-1.85, -0.8], [1.85, -0.8], [-1.85, 0.8], [1.85, 0.8]].forEach(([x, z]) => K.at(K.box(0.18, 1.4, 0.18, 'wood'), x, 0.7, z));
      K.tag('<b>der Tisch</b>', K.V(-1.3, 1.9, 0.9));
      // drawer (open box)
      const drawer = new T.Group();
      K.at(K.box(1.3, 0.05, 1.4, 'copper'), 0, -0.15, 0, drawer);
      K.at(K.box(1.3, 0.34, 0.06, 'copper'), 0, 0, 0.7, drawer);
      K.at(K.box(1.3, 0.34, 0.06, 'copper'), 0, 0, -0.7, drawer);
      K.at(K.box(0.06, 0.34, 1.4, 'copper'), -0.62, 0, 0, drawer);
      K.at(K.box(0.06, 0.34, 1.4, 'copper'), 0.62, 0, 0, drawer);
      K.at(K.box(0.3, 0.07, 0.07, 'brass', { ink: 0.5 }), 0, 0, 0.76, drawer);
      K.at(drawer, 1.1, 1.22, 0);
      // chair
      const chair = new T.Group();
      K.at(K.box(1, 0.12, 1, 'conn'), 0, 0.9, 0, chair);
      K.at(K.box(0.12, 1.1, 1, 'conn'), 0.45, 1.5, 0, chair);
      [[-0.42, -0.42], [0.42, -0.42], [-0.42, 0.42], [0.42, 0.42]].forEach(([x, z]) => K.at(K.box(0.1, 0.9, 0.1, 'conn'), x, 0.45, z, chair));
      K.at(chair, 3.5, 0, 0.2);
      // pendant lamp
      const lamp = new T.Group();
      K.at(K.cyl(0.02, 0.02, 3, 'ink', 6, { ink: false }), 0, 1.55, 0, lamp);
      K.at(ctx.solid(new T.ConeGeometry(0.55, 0.5, 22, 1, true), 'brass'), 0, 0, 0, lamp);
      const bulb = new T.Mesh(new T.SphereGeometry(0.16, 14, 10), new T.MeshBasicMaterial({ color: ctx.colors.warm.clone() })); bulb.material.userData.key = 'warm'; bulb.position.y = -0.2; lamp.add(bulb);
      K.at(lamp, 0, 3.6, 0);
      const cat = makeCat(K); ctx.scene.add(cat);
      const qTag = K.tag('', K.V(-4.6, 4.3, 0), 'q');
      // path arrow
      let arrow = null;
      const arrowMat = new T.MeshBasicMaterial({ color: ctx.colors.accent.clone(), transparent: true, opacity: 0.85 });
      arrowMat.userData.key = 'accent';
      function clearArrow() { if (arrow) { ctx.scene.remove(arrow); arrow.traverse(o => { if (o.geometry) o.geometry.dispose(); }); arrow = null; } }
      function drawArrow(curve) {
        clearArrow(); arrow = new T.Group();
        arrow.add(new T.Mesh(new T.TubeGeometry(curve, 40, 0.045, 6, false), arrowMat));
        const head = new T.Mesh(new T.ConeGeometry(0.14, 0.34, 10), arrowMat);
        const end = curve.getPoint(1), tan = curve.getTangent(1);
        head.position.copy(end); head.quaternion.setFromUnitVectors(K.V(0, 1, 0), tan.normalize());
        arrow.add(head); ctx.scene.add(arrow);
      }
      const row = ctx.words([['S', 'die Katze', 'subj'], ['V', 'sitzt', 'verb'], ['O', 'die Lampe', 'obj'], ['P', 'auf', 'conn'], ['A', 'dem', 'obj'], ['N', 'Tisch', 'obj'], ['U', 'und', 'plain'], ['A2', 'dem', 'obj'], ['N2', 'Stuhl', 'obj'], ['D', '.', 'punct']]);
      row.root.position.set(0, 6.0, 0.6);
      let prep = 'auf', mode = 'wo', first = true;
      let move = null; // { curve, t, obj, ry }
      const drawerZ = { cur: 0, to: 0 };
      const out = K.readout();
      function place(obj, p) { obj.position.set(p[0], p[1], p[2]); }
      function render() {
        const D = WP[prep], s = D[mode];
        const keys = ['S', 'V'];
        if (s.O) keys.push('O');
        keys.push('P'); if (s.A) keys.push('A'); keys.push('N');
        if (s.A2) keys.push('U', 'A2', 'N2');
        keys.push('D');
        const text = { S: s.S, V: s.V, O: s.O || '', P: s.P || prep, A: s.A || '', N: s.N, U: 'und', A2: s.A2 || '', N2: s.N2 || '', D: '.' };
        const size = row.arrange(keys, { text, maxW: ctx.portrait ? 7 : 30, snap: first });
        ctx.fit(12.5, 7.8 + size.h, K.V(0, 2.6 + (size.h - 1.25) * 0.15, 0), K.V(0, 0.32, 1));
        qTag.set(mode === 'wo' ? 'Wo? → Dativ' : 'Wohin? → Akkusativ');
        drawerZ.to = D.drawer ? 1.0 : 0;
        // the mover: cat, or the lamp for über
        const target = D.lamp ? [0, 3.6, 0] : D.pos;
        const mover = D.lamp ? lamp : cat;
        if (!D.lamp) { place(lamp, [0, 3.6, 0]); }
        else { place(cat, WP.vor.pos); cat.rotation.y = 0; }
        if (mode === 'wohin') {
          const start = D.lamp ? [-4.2, 4.6, 0.6] : CAT_START;
          const ctrl = D.lamp ? [-2.2, 5.2, 0.6] : D.ctrl;
          const curve = new T.QuadraticBezierCurve3(K.V(...start), K.V(...ctrl), K.V(...target));
          drawArrow(curve);
          if (ctx.reduce || first) { place(mover, target); mover.rotation.y = D.ry || 0; }
          else { move = { curve, t: 0, obj: mover, ry: D.lamp ? 0 : (D.ry || 0), lamp: !!D.lamp }; place(mover, start); }
        } else { clearArrow(); move = null; place(mover, target); mover.rotation.y = D.ry || 0; }
        if (!first) K.after(0.3, () => { ctx.pop(keys.includes('A') ? row.blocks.A : row.blocks.P); if (s.A2) ctx.pop(row.blocks.A2); });
        first = false;
        const sent = K.sentence(row, keys);
        const art = s.A ? `<b class="hl">${s.A}</b> ${s.N}` : `<b class="hl">${text.P}</b> ${s.N}`;
        out.innerHTML = `<span class="de">${sent}</span> ${say(sent)}<br>` + (mode === 'wo'
          ? `<b>Wo?</b> Already in place, no change of place: Dativ → ${art}.`
          : `<b>Wohin?</b> Moving to a new place: Akkusativ → ${art}.`) + (D.note ? ` ${D.note}` : '');
      }
      ctx.onFrame((dt, t) => {
        drawerZ.cur += (drawerZ.to - drawerZ.cur) * K.f(dt, 6);
        drawer.position.z = drawerZ.cur;
        if (move) {
          move.t = Math.min(1, move.t + dt / 1.3);
          const q = Math.round(move.t * 16) / 16; // on twos
          const p = move.curve.getPoint(q); move.obj.position.copy(p);
          if (!move.lamp) { const tan = move.curve.getTangent(q); move.obj.rotation.y = Math.atan2(-tan.z, tan.x); }
          if (move.t >= 1) { move.obj.rotation.y = move.ry; if (!move.lamp) ctx.pop(cat.children[0], { spread: 0.6 }); move = null; }
        }
        if (!ctx.reduce) cat.userData.tail.rotation.x = Math.sin(ctx.twos(t) * 3) * 0.35;
      });
      K.chips('Präposition', Object.keys(WP).map(v => ({ v, label: v })), prep, v => { prep = v; render(); });
      K.chips('Frage', [{ v: 'wo', label: 'Wo? (Dativ)' }, { v: 'wohin', label: 'Wohin? (Akkusativ)' }], mode, v => { mode = v; render(); });
      K.btn('Bewegung nochmal', () => { if (mode === 'wohin') render(); }, true);
      render();
      K.onPortrait(render);
      return { dispose() { arrowMat.dispose(); } };
    },
  });

  // =====================================================================
  // Week 12 (A2): Reflexive Verben
  // =====================================================================
  const PERS = [
    { v: 'ich', akk: 'mich', dat: 'mir', label: 'ich' },
    { v: 'du', akk: 'dich', dat: 'dir', label: 'du' },
    { v: 'er', akk: 'sich', dat: 'sich', label: 'er / sie' },
    { v: 'wir', akk: 'uns', dat: 'uns', label: 'wir' },
    { v: 'ihr', akk: 'euch', dat: 'euch', label: 'ihr' },
    { v: 'sie', akk: 'sich', dat: 'sich', label: 'sie (Pl.)' },
  ];
  const RV = {
    waschen: { f: { ich: 'wasche', du: 'wäschst', er: 'wäscht', wir: 'waschen', ihr: 'wascht', sie: 'waschen' }, obj: 'die Hände', part: 'hands', en: ['wash (oneself)', 'wash (one’s) hands'] },
    kämmen: { f: { ich: 'kämme', du: 'kämmst', er: 'kämmt', wir: 'kämmen', ihr: 'kämmt', sie: 'kämmen' }, obj: 'die Haare', part: 'head', en: ['comb (oneself)', 'comb (one’s) hair'] },
    anziehen: { f: { ich: 'ziehe', du: 'ziehst', er: 'zieht', wir: 'ziehen', ihr: 'zieht', sie: 'ziehen' }, obj: 'die Jacke', x: 'an', part: 'torso', en: ['get dressed', 'put on (one’s) jacket'] },
  };


  MM.register({
    id: 'reflexive-verben', day: 12, week: 2,
    title: 'Reflexive Verben',
    tagline: 'The action points back at the subject: ich wasche mich, but ich wasche mir die Hände.',
    prompt: 'Pick a person and a verb. Switch to Dativ to add an object and watch the pronoun change for ich and du.',
    body: `
<section>
  <p class="rule">Reflexive pronoun = the subject again. Another accusative object in the sentence? Then the pronoun is dative.</p>
  <p>Many German verbs come with <b>sich</b>: the subject does something to itself. Usually the reflexive pronoun is accusative (<i>Ich wasche <b>mich</b>.</i>). When the sentence also has a direct object, such as a body part or a piece of clothing, the reflexive moves to the dative (<i>Ich wasche <b>mir</b> die Hände.</i>). Only <b>ich</b> and <b>du</b> show a difference.</p>
</section>
<section>
  <h2>Pattern</h2>
  ${table(['Person', 'Akkusativ', 'Dativ'], [
    ['ich', '<b>mich</b>', '<b>mir</b>'], ['du', '<b>dich</b>', '<b>dir</b>'], ['er / sie / es', 'sich', 'sich'],
    ['wir', 'uns', 'uns'], ['ihr', 'euch', 'euch'], ['sie / Sie', 'sich', 'sich'],
  ])}
  ${table(['Always accusative', 'Dative + object'], [
    ['sich freuen auf/über, sich treffen, sich beeilen, sich ausruhen, sich interessieren für, sich bewerben', 'sich etwas wünschen, sich etwas merken, sich etwas vorstellen, sich etwas ansehen, sich die Zähne putzen'],
  ])}
  <p>Word order: the pronoun comes straight after the conjugated verb, or after a subject pronoun when the verb comes first: <i>Morgen treffen <b>wir uns</b>.</i> In the Perfekt, reflexive verbs take <b>haben</b>: <i>Ich habe mich gefreut.</i></p>
</section>
<section>
  <h2>Examples</h2>
  ${ex([
    ['Ich freue mich auf den Urlaub.', 'I’m looking forward to the holiday.'],
    ['Wir treffen uns vor dem Bahnhof.', 'We’re meeting in front of the station.'],
    ['Ich habe mich in der neuen Wohnung gut eingelebt.', 'I’ve settled in well in the new flat.'],
    ['Ich wünsche mir eine größere Küche.', 'I’d love a bigger kitchen.'],
    ['Er hat sich bei einer Firma in München beworben.', 'He applied to a company in Munich.'],
  ])}
</section>
<section>
  <h2>Common mistakes</h2>
  <ul class="mistakes">
    <li><s>Ich wasche mich die Hände.</s> → Ich wasche <b>mir</b> die Hände. die Hände is already the accusative object.</li>
    <li><s>Ich freue auf den Urlaub.</s> → Ich freue <b>mich</b> auf den Urlaub. The pronoun is not optional.</li>
    <li><s>Wir treffen sich um acht.</s> → Wir treffen <b>uns</b> um acht. Match the subject.</li>
    <li><s>Ich bin mich beeilt.</s> → Ich <b>habe</b> mich beeilt.</li>
  </ul>
</section>
<section>
  <h2>Quiz</h2>
  <div data-quiz></div>
</section>
<section>
  <div class="try">
    <h3>Sprechen: a day on the trip</h3>
    <p>Describe one day of a past trip, from morning to evening, with five reflexive verbs:</p>
    <ul>
      <li>Am Morgen habe ich mich beeilt, weil der Bus um acht abgefahren ist.</li>
      <li>Ich habe mich auf den Strand gefreut.</li>
      <li>Am Nachmittag habe ich mir die Altstadt angesehen.</li>
      <li>Am Abend haben wir uns im Hotel ausgeruht.</li>
    </ul>
  </div>
</section>`,
    quiz: [
      { type: 'pick', q: 'Ich freue ___ auf das Wochenende.', opts: ['mich', 'mir', 'sich'], a: 0, why: 'No other accusative object, so the accusative <em>mich</em>.' },
      { type: 'pick', q: 'Du putzt ___ die Zähne.', opts: ['dir', 'dich', 'sich'], a: 0, why: '<em>die Zähne</em> is the accusative object, so the reflexive is dative: <em>dir</em>.' },
      { type: 'pick', q: 'Wir treffen ___ um acht am Bahnhof.', opts: ['uns', 'euch', 'sich'], a: 0, why: 'Subject <em>wir</em> → reflexive <em>uns</em>.' },
      { type: 'pick', q: 'Er hat ___ eine neue Wohnung gekauft.', hint: '(for himself)', opts: ['sich', 'ihm', 'ihn'], a: 0, why: 'For the subject himself, the reflexive is <em>sich</em>. <em>ihm</em> would mean someone else.' },
      { type: 'order', q: 'Build the sentence:', tiles: ['Ich', 'ziehe', 'mir', 'die Jacke', 'an'], a: 'Ich ziehe mir die Jacke an', why: 'Pronoun after the verb, object next, separable prefix <em>an</em> at the end. <em>die Jacke</em> makes the pronoun dative.' },
    ],
    mount(ctx) {
      const K = kit(ctx), T = ctx.THREE;
      ctx.backdrop({ center: K.V(0, 1, -2) });
      K.at(K.cyl(4.2, 4.4, 0.2, 'wood', 48), 0, -0.1, -0.8);
      // cheval mirror
      const frame = ctx.solid(new T.TorusGeometry(1, 0.08, 10, 56), 'brass'); frame.scale.set(1.05, 1.45, 1); K.at(frame, 0, 1.75, -1);
      const glass = new T.Mesh(new T.CircleGeometry(1, 56), new T.MeshBasicMaterial({ color: ctx.colors.c2.clone(), transparent: true, opacity: 0.16, depthWrite: false }));
      glass.material.userData.key = 'c2'; glass.scale.set(1.05, 1.45, 1); glass.renderOrder = 2; K.at(glass, 0, 1.75, -1);
      [-1.2, 1.2].forEach(x => { K.at(K.cyl(0.06, 0.07, 2.0, 'wood', 10), x, 1.0, -1); K.at(K.box(0.2, 0.1, 0.8, 'wood'), x, 0.05, -1); });
      const fig = makeFigure(K, 'subj'); fig.rotation.y = Math.PI; K.at(fig, -0.7, 0, 0.9);
      const refl = makeFigure(K, 'subj'); K.at(refl, -0.7, 0, -2.9);
      const orb = new T.Mesh(new T.SphereGeometry(0.12, 12, 10), new T.MeshBasicMaterial({ color: ctx.colors.accent.clone() }));
      orb.material.userData.key = 'accent'; orb.visible = false; ctx.scene.add(orb);
      K.tag('<b>Spiegel</b>', K.V(1.1, 3.4, -1));
      const caseTag = K.tag('', K.V(0, 5.45, 0.3), 'q');
      const row = ctx.words([['S', 'ich', 'subj'], ['V', 'wasche', 'verb'], ['P', 'mich', 'obj'], ['O', 'die Hände', 'obj'], ['X', 'an', 'verb2'], ['D', '.', 'punct']]);
      row.root.position.set(0, 4.5, 0.3);
      let pers = 'ich', verb = 'waschen', kase = 'akk', first = true, flight = null;
      const out = K.readout();
      function highlight(on) {
        [fig, refl].forEach(f => {
          const p = f.userData.parts;
          K.emit(p.torso, 0); K.emit(p.head, 0); p.hands.forEach(h => K.emit(h, 0));
          if (!on) return;
          const V = RV[verb];
          if (V.part === 'hands') p.hands.forEach(h => K.emit(h, 0.55));
          else if (V.part === 'head') K.emit(p.head, 0.45);
          else K.emit(p.torso, 0.4);
        });
      }
      function render() {
        const P = PERS.find(p => p.v === pers), V = RV[verb];
        const pron = kase === 'akk' ? P.akk : P.dat;
        const keys = ['S', 'V', 'P'];
        if (kase === 'dat') keys.push('O');
        if (V.x) keys.push('X');
        keys.push('D');
        const size = row.arrange(keys, { text: { S: pers, V: V.f[pers], P: pron, O: V.obj, X: V.x || '', D: '.' }, maxW: ctx.portrait ? 6.5 : 30, snap: first });
        ctx.fit(Math.max(9, size.w + 2), 7 + size.h, K.V(0, 2.2 + (size.h - 1.25) * 0.3, -0.6), K.V(0.55, 0.3, 1));
        caseTag.set(kase === 'akk' ? 'Akkusativ' : 'Dativ');
        highlight(kase === 'dat');
        if (!first) {
          if (ctx.reduce) ctx.pop(row.blocks.P);
          else {
            const a = K.V(-0.7, 2.1, 0.7), m = K.V(-0.4, 2.0, -1), b = K.V();
            K.after(0.35, () => { row.blocks.P.group.getWorldPosition(b); flight = { t: 0, a, m, b }; orb.visible = true; });
          }
        }
        first = false;
        const s = K.sentence(row, keys);
        const diff = (pers === 'ich' || pers === 'du') ? ` For <b>${pers}</b> the form changes: ${P.akk} → ${P.dat}.` : ` For <b>${pers}</b>, Akkusativ and Dativ look the same (${P.akk}).`;
        out.innerHTML = `<span class="de">${s}</span> ${say(s)} <span>· ${V.en[kase === 'akk' ? 0 : 1]}</span><br>` + (kase === 'akk'
          ? `No other object, so the reflexive pronoun is accusative: <b class="hl">${pron}</b>.`
          : `<b class="r-obj">${V.obj}</b> is the accusative object, so the reflexive pronoun moves to the dative: <b class="hl">${pron}</b>.`) + diff;
      }
      ctx.onFrame(dt => {
        if (!flight) return;
        flight.t = Math.min(1, flight.t + dt / 0.8);
        const q = Math.round(flight.t * 10) / 10;
        if (q < 0.5) orb.position.lerpVectors(flight.a, flight.m, q * 2); else orb.position.lerpVectors(flight.m, flight.b, (q - 0.5) * 2);
        if (flight.t >= 1) { orb.visible = false; flight = null; ctx.pop(row.blocks.P); }
      });
      K.chips('Person', PERS.map(p => ({ v: p.v, label: p.label })), pers, v => { pers = v; render(); });
      K.chips('Verb', Object.keys(RV).map(v => ({ v, label: 'sich ' + v })), verb, v => { verb = v; render(); });
      K.chips('Fall', [{ v: 'akk', label: 'Akkusativ (mich)' }, { v: 'dat', label: 'Dativ + Objekt (mir)' }], kase, v => { kase = v; render(); });
      render();
      K.onPortrait(render);
    },
  });

  // =====================================================================
  // Week 13 (A2): Adjektivendungen
  // =====================================================================
  const CASES = ['Nom', 'Akk', 'Dat', 'Gen'], CASE_DE = ['Nominativ', 'Akkusativ', 'Dativ', 'Genitiv'];
  const GENS = ['m', 'f', 'n', 'Pl'], GEN_DE = ['maskulin', 'feminin', 'neutral', 'Plural'];
  const END = {
    best: [['e', 'e', 'e', 'en'], ['en', 'e', 'e', 'en'], ['en', 'en', 'en', 'en'], ['en', 'en', 'en', 'en']],
    unbest: [['er', 'e', 'es', 'en'], ['en', 'e', 'es', 'en'], ['en', 'en', 'en', 'en'], ['en', 'en', 'en', 'en']],
    ohne: [['er', 'e', 'es', 'e'], ['en', 'e', 'es', 'e'], ['em', 'er', 'em', 'en'], ['en', 'er', 'en', 'er']],
  };
  const ART = {
    best: [['der', 'die', 'das', 'die'], ['den', 'die', 'das', 'die'], ['dem', 'der', 'dem', 'den'], ['des', 'der', 'des', 'der']],
    unbest: [['ein', 'eine', 'ein', 'keine'], ['einen', 'eine', 'ein', 'keine'], ['einem', 'einer', 'einem', 'keinen'], ['eines', 'einer', 'eines', 'keiner']],
  };
  const NOUN = {
    art: [['Tisch', 'Küche', 'Zimmer', 'Stühle'], ['Tisch', 'Küche', 'Zimmer', 'Stühle'], ['Tisch', 'Küche', 'Zimmer', 'Stühlen'], ['Tisches', 'Küche', 'Zimmers', 'Stühle']],
    ohne: [['Kaffee', 'Milch', 'Brot', 'Brötchen'], ['Kaffee', 'Milch', 'Brot', 'Brötchen'], ['Kaffee', 'Milch', 'Brot', 'Brötchen'], ['Kaffees', 'Milch', 'Brotes', 'Brötchen']],
  };
  const TYPES = [{ v: 'best', label: 'bestimmt (der)' }, { v: 'unbest', label: 'unbestimmt (ein)' }, { v: 'ohne', label: 'ohne Artikel' }];
  const phrase = (type, c, g) => {
    if (type === 'ohne') return { art: '', adj: 'frisch', end: END.ohne[c][g], noun: NOUN.ohne[c][g] };
    return { art: ART[type][c][g], adj: 'neu', end: END[type][c][g], noun: NOUN.art[c][g] };
  };
  const endTable = type => table(['', 'm', 'f', 'n', 'Pl'], CASES.map((c, i) => [c, ...END[type][i].map((e, g) => { const p = phrase(type, i, g); return `${p.art ? p.art + ' ' : ''}${p.adj}<b class="${e === 'en' ? 'r-verb2' : 'hl'}">${e}</b>`; })]));

  MM.register({
    id: 'adjektivendungen', day: 13, week: 2,
    title: 'Adjektivendungen',
    tagline: 'The adjective ending depends on case, gender and the article in front; if the article already shows the gender, the adjective mostly takes -e or -en.',
    prompt: 'Pick an article type, then tap a pigeonhole (or use the case and gender chips). The lit block is the ending.',
    body: `
<section>
  <p class="rule">Someone has to show the gender and case: the article or the adjective. If the article already does, the adjective relaxes to -e or -en.</p>
  <p>After <b>der/die/das</b>, the adjective only needs <b>-e</b> (five spots) or <b>-en</b> (everything else). After <b>ein</b>, three spots have no article ending (ein Tisch, ein Zimmer), so the adjective has to show the gender: <b>-er</b> or <b>-es</b>. With no article at all, the adjective carries the full article ending itself.</p>
</section>
<section>
  <h2>Pattern</h2>
  <h3>bestimmt: der / die / das</h3>
  ${endTable('best')}
  <h3>unbestimmt: ein / eine / kein</h3>
  ${endTable('unbest')}
  <h3>ohne Artikel</h3>
  ${endTable('ohne')}
  <p>Shortcut: <b>Dativ and Genitiv are always -en</b> after any article. Plural after an article is always <b>-en</b>.</p>
</section>
<section>
  <h2>Examples</h2>
  ${ex([
    ['Wir haben eine kleine Wohnung mit einem großen Balkon.', 'We have a small flat with a big balcony.'],
    ['Der neue Kollege kommt aus Graz.', 'The new colleague is from Graz.'],
    ['Ich suche ein ruhiges Zimmer in der Nähe vom Bahnhof.', 'I’m looking for a quiet room near the station.'],
    ['Das Hotel hatte einen schönen Garten.', 'The hotel had a beautiful garden.'],
    ['Mit dem schnellen Zug sind wir in zwei Stunden in Berlin.', 'With the fast train we’re in Berlin in two hours.'],
  ])}
</section>
<section>
  <h2>Common mistakes</h2>
  <ul class="mistakes">
    <li><s>ein neue Tisch</s> → ein neu<b>er</b> Tisch. ein doesn’t show the gender, so the adjective must.</li>
    <li><s>mit dem neuem Auto</s> → mit dem neu<b>en</b> Auto. After an article, Dativ is always -en.</li>
    <li><s>Ich trinke kalt Wasser.</s> → Ich trinke kalt<b>es</b> Wasser. No article: the adjective takes the ending.</li>
    <li><s>Die Wohnung ist schöne.</s> → Die Wohnung ist <b>schön</b>. After sein/werden there is no ending.</li>
  </ul>
</section>
<section>
  <h2>Quiz</h2>
  <div data-quiz></div>
</section>
<section>
  <div class="try">
    <h3>Sprechen: where you stayed</h3>
    <p>Describe your accommodation on a past trip with at least six adjectives, mixing article types:</p>
    <ul>
      <li>Wir hatten ein kleines Zimmer mit einem großen Fenster.</li>
      <li>Das Hotel hatte einen schönen Garten und eine moderne Küche.</li>
      <li>Zum Frühstück gab es frisches Brot und starken Kaffee.</li>
    </ul>
  </div>
</section>`,
    quiz: [
      { type: 'pick', q: 'Wir haben eine ___ Wohnung.', hint: '(hell)', opts: ['helle', 'heller', 'hellen'], a: 0, why: 'Akkusativ feminine after <em>eine</em>: <em>-e</em>.' },
      { type: 'pick', q: 'Der ___ Kollege heißt Jan.', hint: '(neu)', opts: ['neue', 'neuer', 'neuen'], a: 0, why: 'Nominativ masculine after <em>der</em>: the article shows the gender, so just <em>-e</em>.' },
      { type: 'pick', q: 'Ich wohne in einem ___ Haus.', hint: '(alt)', opts: ['alten', 'altem', 'altes'], a: 0, why: 'Dativ after an article is always <em>-en</em>.' },
      { type: 'pick', q: 'Ich trinke gern ___ Kaffee.', hint: '(schwarz)', opts: ['schwarzen', 'schwarzer', 'schwarzes'], a: 0, why: 'No article, Akkusativ masculine: the adjective takes the article ending <em>-en</em> (like den).' },
      { type: 'pick', q: 'Das ist ein ___ Hotel.', hint: '(gut)', opts: ['gutes', 'guter', 'gute'], a: 0, why: '<em>ein</em> doesn’t show neuter, so the adjective does: <em>-es</em> (like das).' },
    ],
    mount(ctx) {
      const K = kit(ctx), T = ctx.THREE;
      ctx.backdrop({ center: K.V(0, 1, -3) });
      const CW = 1.75, CH = 1.05;
      const layers = TYPES.map((ty, li) => {
        const g = new T.Group(); g.userData.blocks = [];
        K.at(K.box(4 * CW + 0.3, 4 * CH + 0.3, 0.12, 'wood'), 0, 0, -0.45, g);
        for (let i = 0; i <= 4; i++) {
          K.at(K.box(4 * CW + 0.3, 0.08, 0.9, 'brass', { ink: 0.6 }), 0, -2 * CH + i * CH, 0, g);
          K.at(K.box(0.08, 4 * CH + 0.3, 0.9, 'brass', { ink: 0.6 }), -2 * CW + i * CW, 0, 0, g);
        }
        for (let c = 0; c < 4; c++) for (let gi = 0; gi < 4; gi++) {
          const e = END[ty.v][c][gi];
          const b = ctx.wordBlock('-' + e, e);
          b.group.scale.setScalar(0.78);
          b.group.position.set(-1.5 * CW + gi * CW, 1.5 * CH - c * CH, 0.05);
          b.mesh.userData.cell = [c, gi];
          b.c = c; b.g = gi; b.e = e;
          g.add(b.group); g.userData.blocks.push(b);
        }
        ctx.scene.add(g);
        g.userData.cur = { z: -1.6 * li, y: 0.9 * li };
        g.position.set(0, g.userData.cur.y, g.userData.cur.z);
        return g;
      });
      const zone = new T.Mesh(new T.BoxGeometry(4 * CW + 0.2, 2 * CH + 0.1, 1.1), new T.MeshBasicMaterial({ color: ctx.colors.verb2.clone(), transparent: true, opacity: 0.18, depthWrite: false }));
      zone.material.userData.key = 'verb2'; zone.position.set(0, -CH, 0.1); zone.visible = false; zone.renderOrder = 3;
      const sel = new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(CW - 0.06, CH - 0.06, 0.95)), new T.LineBasicMaterial({ color: ctx.colors.accent.clone() }));
      sel.material.userData.key = 'accent';
      const rowTags = CASES.map((c, i) => K.tag(`<b>${c}</b>`, K.V(-2 * CW - 0.55, 1.5 * CH - i * CH, 0.4)));
      const colTags = GENS.map((g, i) => K.tag(`<b>${g}</b>`, K.V(-1.5 * CW + i * CW, 2 * CH + 0.4, 0.4)));
      let type = 'best', cc = 0, gg = 0, showEn = false, first = true;
      const out = K.readout();
      function layout() {
        const ai = TYPES.findIndex(t => t.v === type);
        layers.forEach((g, li) => { const d = (li - ai + 3) % 3; g.userData.to = { z: -1.7 * d, y: 0.95 * d }; });
        const act = layers[ai];
        act.add(zone); act.add(sel);
        zone.visible = showEn && type !== 'ohne';
        [...rowTags, ...colTags].forEach(t => { t.obj = act; });
        rowTags.forEach((t, i) => t.pos.set(-2 * CW - 0.55, 1.5 * CH - i * CH, 0.4));
        colTags.forEach((t, i) => t.pos.set(-1.5 * CW + i * CW, 2 * CH + 0.4, 0.4));
        layers.forEach((g, li) => g.userData.blocks.forEach(b => K.emit(b.mesh, li === ai && showEn && b.e === 'en' ? 0.35 : 0)));
      }
      function select(pop) {
        const ai = TYPES.findIndex(t => t.v === type);
        sel.position.set(-1.5 * CW + gg * CW, 1.5 * CH - cc * CH, 0.05);
        const b = layers[ai].userData.blocks.find(x => x.c === cc && x.g === gg);
        if (pop) ctx.pop(b);
        const p = phrase(type, cc, gg);
        const ph = `${p.art ? p.art + ' ' : ''}${p.adj}${p.end} ${p.noun}`;
        const why = type === 'best' ? (p.end === 'e' ? 'The article already shows case and gender, so the adjective only adds -e.' : 'After an article, everywhere outside the five -e spots is -en.')
          : type === 'unbest' ? ((p.end === 'er' || p.end === 'es') ? `<b>${p.art}</b> has no ending here, so the adjective shows the gender: -${p.end}.` : p.end === 'e' ? 'eine already shows feminine, so -e.' : 'After an article, Dativ, Genitiv, Plural and Akkusativ masculine are -en.')
          : 'No article, so the adjective carries the ending the article would have had' + (cc === 3 && (gg === 0 || gg === 2) ? ' (except Genitiv m/n, where the noun’s -s already shows it, so -en).' : '.');
        out.innerHTML = `<span class="de">${p.art ? p.art + ' ' : ''}${p.adj}<b class="hl">${p.end}</b> ${p.noun}</span> ${say(ph)} <span>· ${CASE_DE[cc]}, ${GEN_DE[gg]}</span><br>${why}`;
      }
      const caseChips = K.chips('Fall', CASES.map((c, i) => ({ v: i, label: c, aria: CASE_DE[i] })), cc, v => { cc = v; select(true); });
      const genChips = K.chips('Genus', GENS.map((g, i) => ({ v: i, label: g, aria: GEN_DE[i] })), gg, v => { gg = v; select(true); });
      K.chips('Artikel', TYPES, type, v => { type = v; layout(); select(true); });
      K.toggle('schwache Zone: -en zeigen', false, on => { showEn = on; layout(); });
      // tap a pigeonhole
      const ray = new T.Raycaster(), ndc = new T.Vector2();
      function onDown(e) {
        const r = ctx.renderer.domElement.getBoundingClientRect();
        ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
        ray.setFromCamera(ndc, ctx.camera);
        const ai = TYPES.findIndex(t => t.v === type);
        const bl = layers[ai].userData.blocks;
        const hit = ray.intersectObjects(bl.map(b => b.mesh), false)[0];
        const b = hit && bl.find(x => x.mesh === hit.object);
        if (b) { cc = b.c; gg = b.g; caseChips.set(cc); genChips.set(gg); select(true); }
      }
      ctx.renderer.domElement.addEventListener('pointerdown', onDown);
      ctx.onFrame((dt, t) => {
        layers.forEach(g => {
          const c = g.userData.cur, to = g.userData.to; if (!to) return;
          c.z += (to.z - c.z) * K.f(dt, 5); c.y += (to.y - c.y) * K.f(dt, 5);
          // stepped display on twos
          if (ctx.reduce || Math.floor(t * 12) !== Math.floor((t - dt) * 12)) g.position.set(0, c.y, c.z);
        });
      });
      layout(); select(false);
      const doFit = () => ctx.fit(4 * CW + 2.2, 4 * CH + 4.4, K.V(0, 0.35, -1), K.V(0.35, 0.3, 1));
      doFit(); first = false;
      return { dispose() { ctx.renderer.domElement.removeEventListener('pointerdown', onDown); } };
    },
  });

  // =====================================================================
  // Week 14 (A2): Komparativ / Superlativ
  // =====================================================================
  const KS = {
    schnell: { f: ['schnell', 'schneller', 'am schnellsten'], s: ['Der Bus ist schnell.', 'Der Zug ist schneller als der Bus.', 'Das Flugzeug ist am schnellsten.'], kind: 'regular' },
    'groß': { f: ['groß', 'größer', 'am größten'], s: ['Mein Zimmer ist groß.', 'Deine Wohnung ist größer als mein Zimmer.', 'Das Haus ist am größten.'], kind: 'umlaut' },
    alt: { f: ['alt', 'älter', 'am ältesten'], s: ['Mein Laptop ist alt.', 'Dein Laptop ist älter.', 'Der Drucker im Büro ist am ältesten.'], kind: 'umlaut-e' },
    warm: { f: ['warm', 'wärmer', 'am wärmsten'], s: ['In Berlin ist es warm.', 'In Rom ist es wärmer als in Berlin.', 'In Sevilla ist es am wärmsten.'], kind: 'umlaut' },
    teuer: { f: ['teuer', 'teurer', 'am teuersten'], s: ['Das Hostel ist teuer.', 'Die Pension ist teurer als das Hostel.', 'Das Hotel ist am teuersten.'], kind: 'drop' },
    hoch: { f: ['hoch', 'höher', 'am höchsten'], s: ['Der Turm ist hoch.', 'Der Berg ist höher als der Turm.', 'Die Zugspitze ist am höchsten.'], kind: 'irregular' },
    gut: { f: ['gut', 'besser', 'am besten'], s: ['Der Kaffee hier ist gut.', 'Der Kaffee im Büro ist besser.', 'Der Kaffee zu Hause ist am besten.'], kind: 'irregular' },
    viel: { f: ['viel', 'mehr', 'am meisten'], s: ['Ich arbeite viel.', 'Meine Chefin arbeitet mehr.', 'Unser Praktikant arbeitet am meisten.'], kind: 'irregular' },
    gern: { f: ['gern', 'lieber', 'am liebsten'], s: ['Ich fahre gern Bus.', 'Ich fahre lieber Zug.', 'Am liebsten fahre ich Fahrrad.'], kind: 'irregular' },
  };
  const KIND = {
    regular: 'Regular: +er, then am …sten.',
    umlaut: 'Short adjective with a, o or u: it takes an umlaut (ä, ö, ü).',
    'umlaut-e': 'Umlaut, and after -t the superlative adds an extra e: am ält<b>e</b>sten.',
    drop: 'Adjectives ending in -er or -el drop the e in the Komparativ: teuer → teurer.',
    irregular: 'Irregular: learn these by heart.',
  };
  const STEPS = ['Positiv', 'Komparativ', 'Superlativ'];

  MM.register({
    id: 'komparativ-superlativ', day: 14, week: 2,
    title: 'Komparativ & Superlativ',
    tagline: 'schnell → schneller (als) → am schnellsten: add -er to compare two things, am …sten for the top.',
    prompt: 'Pick an adjective and watch the three chimneys rise. Tap a step to hear it in a sentence.',
    body: `
<section>
  <p class="rule">Komparativ = adjective + er (+ als). Superlativ = am + adjective + sten.</p>
  <p>To say two things are different, use the Komparativ with <b>als</b>: <i>schneller als der Bus</i>. To say they are equal, use <b>so … wie</b>: <i>so schnell wie der Bus</i>. For the top of the group, use <b>am …sten</b> after a verb, or <b>der/die/das …ste</b> before a noun, with the normal adjective ending: <i>der schnellste Zug</i>.</p>
</section>
<section>
  <h2>Pattern</h2>
  ${table(['Type', 'Positiv', 'Komparativ', 'Superlativ'], [
    ['regular', 'schnell, billig', 'schnell<b>er</b>, billig<b>er</b>', 'am schnell<b>sten</b>, am billig<b>sten</b>'],
    ['umlaut (a, o, u)', 'alt, groß, jung, warm', '<b>ä</b>lter, gr<b>ö</b>ßer, j<b>ü</b>nger, w<b>ä</b>rmer', 'am ältesten, am größten, am jüngsten, am wärmsten'],
    ['-d, -t, -s, -ß, -z', 'alt, kurz, heiß', 'älter, kürzer, heißer', 'am ält<b>e</b>sten, am kürz<b>e</b>sten, am heiß<b>e</b>sten'],
    ['-er / -el', 'teuer, dunkel', 'teurer, dunkler', 'am teuersten, am dunkelsten'],
    ['irregular', 'gut, viel, gern, hoch, nah', 'besser, mehr, lieber, höher, näher', 'am besten, am meisten, am liebsten, am höchsten, am nächsten'],
  ])}
  <p>Note: <b>groß</b> ends in ß but takes just -sten: <i>am größten</i>.</p>
</section>
<section>
  <h2>Examples</h2>
  ${ex([
    ['Der Zug ist schneller als das Auto.', 'The train is faster than the car.'],
    ['Unsere neue Wohnung ist größer als die alte.', 'Our new flat is bigger than the old one.'],
    ['Im August ist das Hotel am teuersten.', 'The hotel is most expensive in August.'],
    ['Ich arbeite lieber im Büro als zu Hause.', 'I prefer working in the office to working at home.'],
    ['Berlin ist nicht so teuer wie München.', 'Berlin is not as expensive as Munich.'],
    ['Das war die schönste Reise meines Lebens.', 'That was the most beautiful trip of my life.'],
  ])}
</section>
<section>
  <h2>Common mistakes</h2>
  <ul class="mistakes">
    <li><s>mehr schnell</s> → <b>schneller</b>. German doesn’t build the Komparativ with mehr.</li>
    <li><s>schneller wie der Bus</s> → schneller <b>als</b> der Bus. wie is for equal: so schnell wie.</li>
    <li><s>am schnellste</s> → am schnell<b>sten</b>.</li>
    <li><s>gerner</s> → <b>lieber</b>; <s>guter</s> (as a comparison) → <b>besser</b>.</li>
  </ul>
</section>
<section>
  <h2>Quiz</h2>
  <div data-quiz></div>
</section>
<section>
  <div class="try">
    <h3>Sprechen: then and now</h3>
    <p>Compare your last trip with an earlier one, in at least five sentences:</p>
    <ul>
      <li>Der Zug war schneller als der Bus, aber das Flugzeug war am schnellsten.</li>
      <li>Das Hotel war teurer als die Ferienwohnung.</li>
      <li>Das Essen in Italien hat mir am besten geschmeckt.</li>
      <li>Ich reise lieber im Herbst als im Sommer, weil es nicht so heiß ist.</li>
    </ul>
  </div>
</section>`,
    quiz: [
      { type: 'pick', q: 'Der Zug ist ___ als der Bus.', opts: ['schneller', 'schnellste', 'mehr schnell'], a: 0, why: 'Comparing two things: adjective + <em>-er</em>, then <em>als</em>.' },
      { type: 'pick', q: 'Berlin ist ___ als Bonn.', opts: ['größer', 'großer', 'größter'], a: 0, why: '<em>groß</em> takes an umlaut: <em>größer</em>.' },
      { type: 'pick', q: 'Im Juli ist es hier ___.', opts: ['am wärmsten', 'am wärmste', 'das wärmsten'], a: 0, why: 'After a verb, the superlative is <em>am …sten</em>.' },
      { type: 'pick', q: 'Ich trinke ___ Tee als Kaffee.', opts: ['lieber', 'gerner', 'mehr gern'], a: 0, why: '<em>gern</em> is irregular: gern, <em>lieber</em>, am liebsten.' },
      { type: 'pick', q: 'Mein Bruder ist so alt ___ ich.', opts: ['wie', 'als', 'wenn'], a: 0, why: 'Equal things: <em>so … wie</em>.' },
    ],
    mount(ctx) {
      const K = kit(ctx), T = ctx.THREE;
      ctx.backdrop({ center: K.V(0, 2, -3) });
      K.at(K.box(14, 0.4, 4.5, 'neutral'), 0, -0.2, 0);
      K.at(K.box(14.2, 0.16, 0.2, 'copper', { ink: 0.6 }), 0, 0.02, 2.25);
      const HS = [1.4, 2.6, 3.8], XS = [-4, 0, 4];
      const chimneys = HS.map((h, i) => {
        const g = new T.Group();
        const geo = new T.BoxGeometry(1.2, h, 1.2); geo.translate(0, h / 2, 0);
        const m = ctx.solid(geo, 'copper'); g.add(m);
        const capGeo = new T.BoxGeometry(1.45, 0.22, 1.45);
        const capM = ctx.solid(capGeo, 'brass'); capM.position.y = h; g.add(capM);
        // brick courses: thin ink bands painted on
        for (let y = 0.45; y < h - 0.2; y += 0.45) K.at(K.box(1.22, 0.025, 1.22, 'ink', { ink: false }), 0, y, 0, g);
        K.at(g, XS[i], 0, 0);
        g.userData = { body: m, h, s: 1, sv: 0, ts: 1 };
        return g;
      });
      const blocks = [0, 1, 2].map(i => { const b = ctx.wordBlock('…', ['plain', 'verb2', 'verb'][i]); ctx.scene.add(b.group); return b; });
      const stepTags = STEPS.map((s, i) => K.tag(`<b>${s}</b>`, K.V(XS[i], -0.9, 2.3)));
      // smoke puffs, drawn on twos
      const puffs = [];
      const puffMat = () => { const m = new T.MeshBasicMaterial({ color: ctx.colors.paper.clone(), transparent: true, opacity: 0.5, depthWrite: false }); m.userData.key = 'paper'; return m; };
      let adj = 'schnell', step = 2, first = true, spawn = 0;
      const out = K.readout();
      function render(rise) {
        const D = KS[adj];
        blocks.forEach((b, i) => { b.set(D.f[i]); });
        if (rise && !ctx.reduce) chimneys.forEach((c, i) => { c.userData.s = 0.15; c.userData.sv = 0; c.userData.delay = i * 0.12; });
        blocks.forEach((b, i) => K.emit(b.mesh, i === step ? 0.3 : 0));
        chimneys.forEach((c, i) => K.emit(c.userData.body, i === step ? 0.18 : 0));
        if (!first) K.after(rise ? 0.55 : 0.05, () => ctx.pop(blocks[step]));
        const maxW = Math.max(...blocks.map(b => b.width));
        const span = Math.max(12.5, XS[2] - XS[0] + maxW + 1);
        ctx.fit(span, 7.2, K.V(0, 2.3, 0), K.V(0, 0.28, 1));
        first = false;
        const s = D.s[step];
        out.innerHTML = D.s.map((x, i) => i === step ? `<span class="de">${x}</span>` : `<span>${x}</span>`).join(' · ') + ` ${say(s)}<br>${KIND[D.kind]}`;
      }
      ctx.onFrame((dt, t) => {
        const tick = ctx.reduce || Math.floor(t * 12) !== Math.floor((t - dt) * 12);
        chimneys.forEach((c, i) => {
          const u = c.userData;
          if (u.delay > 0) { u.delay -= dt; } else { u.sv += ((u.ts - u.s) * 120 - u.sv * 11) * dt; u.s += u.sv * dt; }
          if (ctx.reduce) u.s = 1;
          if (tick) c.scale.y = Math.max(0.05, u.s);
          if (tick) blocks[i].group.position.set(XS[i], u.h * c.scale.y + 0.75, 0.3);
        });
        if (ctx.reduce) return;
        spawn -= dt;
        if (spawn <= 0 && puffs.length < (ctx.phone ? 9 : 18)) {
          spawn = 0.35;
          const i = Math.floor(Math.random() * 3);
          const m = new T.Mesh(new T.SphereGeometry(0.22, 10, 8), puffMat());
          m.position.set(XS[i] + (Math.random() - 0.5) * 0.3, HS[i] + 0.3, -0.3);
          m.userData = { life: 0, x: XS[i] };
          ctx.scene.add(m); puffs.push(m);
        }
        for (let k = puffs.length - 1; k >= 0; k--) {
          const p = puffs[k]; p.userData.life += dt;
          const L = p.userData.life;
          if (tick) { p.position.y += 0.06; p.position.x = p.userData.x + Math.sin(L * 2) * 0.2 + L * 0.25; p.scale.setScalar(1 + L * 0.9); p.material.opacity = Math.max(0, 0.5 - L * 0.17); }
          if (L > 3) { ctx.scene.remove(p); p.geometry.dispose(); p.material.dispose(); puffs.splice(k, 1); }
        }
      });
      K.chips('Adjektiv', Object.keys(KS).map(v => ({ v, label: v })), adj, v => { adj = v; render(true); });
      K.chips('Stufe', STEPS.map((s, i) => ({ v: i, label: s })), step, v => { step = v; render(false); });
      render(false);
    },
  });
})();
