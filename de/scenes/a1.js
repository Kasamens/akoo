/* Akoo, level A1 (weeks 1-8): German from zero, one rule a week, as painted 3D worlds.
 * Uses the engine in app.js and the shared kit in shared/kit.js (window.GK).
 * A1 goal: introduce yourself and talk about your day, family and shopping in short, simple sentences.
 * All example sentences are original.
 */
(function () {
  'use strict';
  const { say, ex, table, R, chipScene } = window.GK;
  const A1_TRY = 'A1 goal: introduce yourself and talk about your day in short, simple sentences.';

  const opts = (list, lab) => list.map(v => ({ v, label: lab ? lab[v] : v }));

  // =====================================================================
  // Week 1 (A1): Verben im Präsens
  // =====================================================================
  const PERS = ['ich', 'du', 'er', 'wir', 'ihr', 'sie'];
  const PERS_EN = { ich: 'I', du: 'you (one friend)', er: 'he', wir: 'we', ihr: 'you (several friends)', sie: 'they' };
  const VB = {
    wohnen: { f: ['wohne', 'wohnst', 'wohnt', 'wohnen', 'wohnt', 'wohnen'], rest: 'in Berlin', en: 'live in Berlin', stem: 'wohn' },
    lernen: { f: ['lerne', 'lernst', 'lernt', 'lernen', 'lernt', 'lernen'], rest: 'Deutsch', en: 'learn German', stem: 'lern' },
    sein: { f: ['bin', 'bist', 'ist', 'sind', 'seid', 'sind'], rest: 'müde', en: 'be tired', irr: true },
    haben: { f: ['habe', 'hast', 'hat', 'haben', 'habt', 'haben'], rest: 'Hunger', en: 'be hungry (have hunger)', irr: true },
  };

  MM.register({
    id: 'praesens', day: 1, week: 1,
    vocab: [
      ['wohnen', 'to live (somewhere)'], ['arbeiten', 'to work'], ['lernen', 'to learn'], ['sein', 'to be'],
      ['haben', 'to have'], ['Hunger', 'hunger', 'm'], ['Lehrerin', 'teacher (woman)', 'f'], ['Zeit', 'time', 'f'],
      ['müde', 'tired'],
    ],
    title: 'Verben im Präsens',
    tagline: 'A German verb changes its ending for each person: ich wohne, du wohnst, er wohnt.',
    prompt: 'Pick a person and a verb. Watch the magenta verb block change its ending.',
    body: `
<section>
  <p class="rule">Stem + ending. The ending tells you who is doing it.</p>
  <p>Every verb has an infinitive (the dictionary form), such as <b>wohnen</b> (to live). Take off <b>-en</b> and you have the stem, <b>wohn-</b>. Then add the ending that fits the person. English only adds -s for he/she; German has an ending for almost every person. The two most important verbs, <b>sein</b> (to be) and <b>haben</b> (to have), are irregular: learn them by heart first.</p>
</section>
<section>
  <h2>Pattern</h2>
  ${table(['Person', 'Ending', 'wohnen', 'sein', 'haben'], [
    ['ich (I)', '-e', `wohn${R('verb', 'e')}`, 'bin', 'habe'],
    ['du (you, informal)', '-st', `wohn${R('verb', 'st')}`, 'bist', 'hast'],
    ['er / sie / es (he / she / it)', '-t', `wohn${R('verb', 't')}`, 'ist', 'hat'],
    ['wir (we)', '-en', `wohn${R('verb', 'en')}`, 'sind', 'haben'],
    ['ihr (you, several)', '-t', `wohn${R('verb', 't')}`, 'seid', 'habt'],
    ['sie / Sie (they / you, formal)', '-en', `wohn${R('verb', 'en')}`, 'sind', 'haben'],
  ])}
  <p><b>Sie</b> with a capital S is the polite “you” for strangers, shops and offices. It uses the same form as <b>sie</b> (they): <i>Wohnen Sie in Berlin?</i></p>
</section>
<section>
  <h2>Examples</h2>
  ${ex([
    ['Ich heiße Kofi und ich komme aus Ghana.', 'My name is Kofi and I come from Ghana.'],
    ['Wo wohnst du?', 'Where do you live?'],
    ['Sie ist Lehrerin und arbeitet in Hamburg.', 'She is a teacher and works in Hamburg.'],
    ['Wir haben heute keine Zeit.', 'We don’t have time today.'],
    ['Sind Sie Frau Mensah?', 'Are you Ms Mensah?'],
  ])}
</section>
<section>
  <h2>Common mistakes</h2>
  <ul class="mistakes">
    <li><s>Ich wohnen in Berlin.</s> → Ich <b>wohne</b> in Berlin. The infinitive is only for the dictionary.</li>
    <li><s>Du bin müde.</s> → Du <b>bist</b> müde. sein is irregular: learn its six forms as a chunk.</li>
    <li>Stems ending in -t or -d add an extra e: du arbeit<b>e</b>st, er arbeit<b>e</b>t.</li>
    <li>German has one present tense: <i>ich lerne</i> means both “I learn” and “I am learning”.</li>
  </ul>
</section>
<section>
  <h2>Quiz</h2>
  <div data-quiz></div>
</section>
<section>
  <div class="try">
    <h3>Sprechen: introduce yourself</h3>
    <p>${A1_TRY} Say four sentences about yourself, out loud:</p>
    <ul>
      <li>Ich heiße … / Ich bin …</li>
      <li>Ich komme aus … und ich wohne in …</li>
      <li>Ich lerne Deutsch, und ich arbeite als … / ich studiere …</li>
      <li>Ich habe … (zwei Brüder / eine Katze / heute Zeit).</li>
    </ul>
  </div>
</section>`,
    quiz: [
      { type: 'pick', q: 'Du ___ in Accra.', opts: ['wohnst', 'wohnt', 'wohne'], a: 0, why: 'du takes the ending <em>-st</em>.' },
      { type: 'pick', q: 'Wir ___ müde.', opts: ['sind', 'seid', 'ist'], a: 0, why: 'sein: wir <em>sind</em>.' },
      { type: 'pick', q: 'Er ___ Hunger.', opts: ['hat', 'habt', 'hast'], a: 0, why: 'haben: er <em>hat</em>.' },
      { type: 'pick', q: 'Ihr ___ Deutsch.', opts: ['lernt', 'lernen', 'lernst'], a: 0, why: 'ihr takes <em>-t</em>, the same as er.' },
      { type: 'order', q: 'Build: “Where do you (formal) live?”', tiles: ['Wo', 'wohnen', 'Sie'], a: 'Wo wohnen Sie', why: 'Formal Sie takes the -en form.' },
    ],
    mount(ctx) {
      chipScene(ctx, {
        state: { p: 'ich', v: 'wohnen' },
        chips: [{ label: 'Person', key: 'p', opts: opts(PERS, { ich: 'ich', du: 'du', er: 'er/sie/es', wir: 'wir', ihr: 'ihr', sie: 'sie/Sie' }) }, { label: 'Verb', key: 'v', opts: opts(Object.keys(VB)) }],
        build({ p, v }) {
          const D = VB[v], i = PERS.indexOf(p), form = D.f[i];
          const end = D.irr ? null : form.slice(D.stem.length);
          return {
            tokens: [['S', p, 'subj'], ['V', form, 'verb'], ['O', D.rest, 'obj'], ['d', '.', 'punct']],
            keys: ['S', 'V', 'O', 'd'], pop: ['V'],
            tag: D.irr ? `${v}: irregular` : `${D.stem} + ${end}`,
            en: `${PERS_EN[p]} + ${D.en}`,
            note: D.irr ? `<b>${v}</b> is irregular: <b class="r-verb">${form}</b> has to be learned as a whole word.`
              : `Stem <b>${D.stem}-</b> plus the <b>${p}</b> ending <b class="r-verb">-${end}</b>.`,
          };
        },
      });
    },
  });

  // =====================================================================
  // Week 2 (A1): Artikel und Plural
  // =====================================================================
  const NOUN = {
    Tisch: { g: 'der', ind: 'ein', pl: 'Tische', en: 'table', gen: 'masculine' },
    Lampe: { g: 'die', ind: 'eine', pl: 'Lampen', en: 'lamp', gen: 'feminine' },
    Buch: { g: 'das', ind: 'ein', pl: 'Bücher', en: 'book', gen: 'neuter' },
    Stuhl: { g: 'der', ind: 'ein', pl: 'Stühle', en: 'chair', gen: 'masculine' },
  };
  const GROLE = { der: 'obj', die: 'verb', das: 'subj' };

  MM.register({
    id: 'artikel', day: 2, week: 1,
    vocab: [
      ['Bahnhof', 'station', 'm'], ['Apotheke', 'pharmacy', 'f'], ['Zimmer', 'room', 'n'],
      ['Buch', 'book (plural: Bücher)', 'n'], ['Lampe', 'lamp', 'f'], ['Wohnung', 'flat', 'f'],
      ['Mädchen', 'girl', 'n'], ['Tisch', 'table', 'm'], ['Stuhl', 'chair (plural: Stühle)', 'm'],
    ],
    title: 'Der, die, das',
    tagline: 'Every noun has a gender: der (masculine), die (feminine), das (neuter). Learn each noun with its article.',
    prompt: 'Pick a noun, then switch between the, a and plural. Watch the article block.',
    body: `
<section>
  <p class="rule">Never learn Tisch. Learn der Tisch.</p>
  <p>German nouns are always written with a capital letter, and each one has a grammatical gender. The gender often has nothing to do with meaning (<i>das Mädchen</i>, the girl, is neuter), so learn the article and the plural as part of the word, like a chunk: <b>der Tisch, die Tische</b>. In the plural every gender uses <b>die</b>. There is no plural of ein: you just drop it.</p>
</section>
<section>
  <h2>Pattern</h2>
  ${table(['Gender', 'the', 'a', 'plural (the)', 'plural (no article)'], [
    ['masculine', `${R('obj', 'der')} Tisch`, `${R('obj', 'ein')} Tisch`, `${R('verb2', 'die')} Tische`, 'Tische'],
    ['feminine', `${R('verb', 'die')} Lampe`, `${R('verb', 'eine')} Lampe`, `${R('verb2', 'die')} Lampen`, 'Lampen'],
    ['neuter', `${R('subj', 'das')} Buch`, `${R('subj', 'ein')} Buch`, `${R('verb2', 'die')} Bücher`, 'Bücher'],
  ])}
  ${table(['Hint (not a law)', 'Usually', 'Examples'], [
    ['-ung, -heit, -keit, -ion, -e', 'die', 'die Wohnung, die Freiheit, die Station, die Lampe'],
    ['-chen, -lein, most -um', 'das', 'das Mädchen, das Brötchen, das Museum'],
    ['days, months, seasons, -er for people', 'der', 'der Montag, der Mai, der Lehrer'],
  ])}
</section>
<section>
  <h2>Examples</h2>
  ${ex([
    ['Das ist der Bahnhof.', 'That is the station.'],
    ['Hier ist eine Apotheke.', 'Here is a pharmacy.'],
    ['Das Zimmer ist klein, aber hell.', 'The room is small but bright.'],
    ['Die Bücher sind neu.', 'The books are new.'],
    ['Haben Sie Brötchen?', 'Do you have bread rolls?'],
  ])}
</section>
<section>
  <h2>Common mistakes</h2>
  <ul class="mistakes">
    <li><s>Das ist ein Lampe.</s> → Das ist <b>eine</b> Lampe. Feminine nouns take eine.</li>
    <li><s>Das sind eine Bücher.</s> → Das sind Bücher. No ein in the plural.</li>
    <li><s>das buch</s> → das <b>B</b>uch. Every noun takes a capital letter.</li>
    <li>Plural forms vary (-e, -en, -er, -s, umlaut). Learn them with the noun.</li>
  </ul>
</section>
<section>
  <h2>Quiz</h2>
  <div data-quiz></div>
</section>
<section>
  <div class="try">
    <h3>Sprechen: my room</h3>
    <p>${A1_TRY} Look around your room and name eight things with their article, out loud: <i>der Stuhl, die Tür, das Fenster …</i> Then say: <i>Das ist mein Zimmer. Hier ist ein Tisch und eine Lampe.</i></p>
  </div>
</section>`,
    quiz: [
      { type: 'pick', q: '___ Wohnung ist schön.', opts: ['Die', 'Der', 'Das'], a: 0, why: 'Nouns in <em>-ung</em> are feminine: die Wohnung.' },
      { type: 'pick', q: 'Das ist ___ Buch.', opts: ['ein', 'eine', 'einen'], a: 0, why: 'Buch is neuter: ein Buch.' },
      { type: 'pick', q: 'The plural of “der Tisch” takes which article?', opts: ['die', 'der', 'den'], a: 0, why: 'All plurals take <em>die</em>.' },
      { type: 'pick', q: '___ Mädchen heißt Abena.', opts: ['Das', 'Die', 'Der'], a: 0, why: 'Nouns in <em>-chen</em> are always neuter.' },
      { type: 'order', q: 'Build: “Those are chairs.”', tiles: ['Das', 'sind', 'Stühle'], a: 'Das sind Stühle', why: 'No article for “some/any” in the plural.' },
    ],
    mount(ctx) {
      chipScene(ctx, {
        state: { n: 'Tisch', m: 'def' },
        chips: [{ label: 'Nomen', key: 'n', opts: opts(Object.keys(NOUN)) }, { label: 'Artikel', key: 'm', opts: [{ v: 'def', label: 'the' }, { v: 'ind', label: 'a' }, { v: 'pl', label: 'plural' }] }],
        build({ n, m }) {
          const D = NOUN[n];
          const art = m === 'def' ? D.g : m === 'ind' ? D.ind : 'die';
          return {
            tokens: [['A', 'das', 'subj'], ['V', m === 'pl' ? 'sind' : 'ist', 'verb'], ['R', art, m === 'pl' ? 'verb2' : GROLE[D.g]], ['N', m === 'pl' ? D.pl : n, 'plain'], ['d', '.', 'punct']],
            keys: ['A', 'V', 'R', 'N', 'd'], pop: ['R'],
            tag: m === 'pl' ? 'Plural: die' : `${D.gen}: ${D.g}`,
            en: `${m === 'pl' ? 'Those are the' : 'That is ' + (m === 'def' ? 'the' : 'a')} ${D.en}${m === 'pl' ? 's' : ''}.`,
            note: m === 'pl' ? `Every plural takes <b class="r-verb2">die</b>, and the verb becomes <b class="r-verb">sind</b>. Learn the plural form with the noun: <b>${D.g} ${n}, die ${D.pl}</b>.`
              : `<b>${n}</b> is ${D.gen}, so “the” is <b>${D.g}</b> and “a” is <b>${D.ind}</b>.`,
          };
        },
      });
    },
  });

  // =====================================================================
  // Week 3 (A1): Satzbau: Verb an Position 2, Fragen
  // =====================================================================
  const SB = {
    aussage: { keys: ['S', 'V', 'T', 'O', 'p'], p: '.', tag: 'Position 2 = Verb', en: 'He’s drinking coffee tomorrow.', note: 'A normal statement: the conjugated verb is the second element.' },
    zeit: { keys: ['T', 'V', 'S', 'O', 'p'], p: '.', tag: 'Position 2 = Verb', en: 'Tomorrow he’s drinking coffee.', note: 'Put the time first and the verb <b>stays in position 2</b>. The subject moves behind it.' },
    was: { keys: ['W', 'V', 'S', 'T', 'p'], w: 'was', p: '?', tag: 'W-Frage: Verb an Position 2', en: 'What is he drinking tomorrow?', note: 'A W-question word takes position 1; the verb still comes second.' },
    wann: { keys: ['W', 'V', 'S', 'O', 'p'], w: 'wann', p: '?', tag: 'W-Frage: Verb an Position 2', en: 'When is he drinking coffee?', note: 'Same rule with wann (when): W-word, verb, subject.' },
    janein: { keys: ['V', 'S', 'T', 'O', 'p'], p: '?', tag: 'Ja/Nein-Frage: Verb an Position 1', en: 'Is he drinking coffee tomorrow?', note: 'For a yes/no question the verb jumps to <b>position 1</b>.' },
  };

  MM.register({
    id: 'satzbau', day: 3, week: 1,
    vocab: [
      ['heute', 'today'], ['morgen', 'tomorrow'], ['woher', 'where from'], ['wo', 'where'], ['sprechen', 'to speak'],
      ['trinken', 'to drink'], ['Kaffee', 'coffee', 'm'], ['Montag', 'Monday', 'm'], ['Tante', 'aunt', 'f'],
    ],
    title: 'Verb an Position 2',
    tagline: 'In a German statement the conjugated verb is always the second element, whatever comes first.',
    prompt: 'Switch the sentence type and watch the magenta verb: it holds position 2, except in yes/no questions.',
    body: `
<section>
  <p class="rule">One thing first, then the verb. Always.</p>
  <p>English keeps subject-verb order: “Tomorrow <i>he drinks</i>”. German counts positions instead. Position 1 can be the subject, a time, a place or a question word, but the conjugated verb must come <b>second</b>. If something other than the subject goes first, the subject moves to just after the verb. In yes/no questions the verb comes first.</p>
</section>
<section>
  <h2>Pattern</h2>
  ${table(['Type', 'Position 1', 'Position 2', 'Rest'], [
    ['Statement', 'Er', R('verb', 'trinkt'), 'morgen Kaffee.'],
    ['Time first', 'Morgen', R('verb', 'trinkt'), 'er Kaffee.'],
    ['W-question', R('conn', 'Was'), R('verb', 'trinkt'), 'er morgen?'],
    ['Yes/no question', R('verb', 'Trinkt'), 'er', 'morgen Kaffee?'],
  ])}
  ${table(['W-word', 'Meaning'], [['wer', 'who'], ['was', 'what'], ['wo / woher / wohin', 'where / where from / where to'], ['wann', 'when'], ['wie', 'how'], ['warum', 'why'], ['wie viel', 'how much']])}
</section>
<section>
  <h2>Examples</h2>
  ${ex([
    ['Heute arbeite ich bis sechs Uhr.', 'Today I work until six.'],
    ['Woher kommst du?', 'Where are you from?'],
    ['In Kumasi wohnt meine Tante.', 'My aunt lives in Kumasi.'],
    ['Sprechen Sie Englisch?', 'Do you speak English?'],
    ['Wie viel kostet das Ticket?', 'How much does the ticket cost?'],
  ])}
</section>
<section>
  <h2>Common mistakes</h2>
  <ul class="mistakes">
    <li><s>Heute ich arbeite.</s> → Heute <b>arbeite ich</b>. Time first, then the verb.</li>
    <li><s>Was du trinkst?</s> → Was <b>trinkst du</b>? The verb is second.</li>
    <li><s>Du sprichst Deutsch?</s> works in speech with a rising voice, but the standard question is <b>Sprichst du</b> Deutsch?</li>
    <li>und, aber, oder do not count as a position: <i>…, aber ich <b>habe</b> keine Zeit.</i></li>
  </ul>
</section>
<section>
  <h2>Quiz</h2>
  <div data-quiz></div>
</section>
<section>
  <div class="try">
    <h3>Sprechen: my day</h3>
    <p>${A1_TRY} Describe your day, starting each sentence with a time: <i>Um sieben Uhr frühstücke ich. Dann fahre ich zur Arbeit. Am Abend koche ich.</i> Then ask a partner five W-questions.</p>
  </div>
</section>`,
    quiz: [
      { type: 'pick', q: 'Am Montag ___ Deutsch.', opts: ['lerne ich', 'ich lerne', 'ich lernen'], a: 0, why: 'Time is position 1, so the verb comes next, then the subject.' },
      { type: 'pick', q: '___ wohnst du? – In Accra.', opts: ['Wo', 'Wer', 'Wann'], a: 0, why: '<em>wo</em> asks for a place.' },
      { type: 'order', q: 'Build: “Do you speak German?” (informal)', tiles: ['Sprichst', 'du', 'Deutsch'], a: 'Sprichst du Deutsch', why: 'Yes/no question: the verb goes first.' },
      { type: 'order', q: 'Build: “What are you drinking?”', tiles: ['Was', 'trinkst', 'du'], a: 'Was trinkst du', why: 'W-word, verb, subject.' },
      { type: 'pick', q: 'Ich bin müde, aber ich ___ noch.', opts: ['arbeite', 'arbeiten', 'arbeitest'], a: 0, why: '<em>aber</em> takes no position: subject, then verb.' },
    ],
    mount(ctx) {
      chipScene(ctx, {
        state: { m: 'aussage' },
        chips: [{ label: 'Satztyp', key: 'm', opts: [{ v: 'aussage', label: 'Aussage' }, { v: 'zeit', label: 'Zeit zuerst' }, { v: 'was', label: 'Was …?' }, { v: 'wann', label: 'Wann …?' }, { v: 'janein', label: 'Ja/Nein-Frage' }] }],
        build({ m }) {
          const D = SB[m];
          return {
            tokens: [['W', D.w || 'was', 'conn'], ['V', 'trinkt', 'verb'], ['S', 'er', 'subj'], ['T', 'morgen', 'plain'], ['O', 'Kaffee', 'obj'], ['p', D.p, 'punct']],
            keys: D.keys, text: { W: D.w || 'was', p: D.p }, pop: ['V'], tag: D.tag, en: D.en, note: D.note,
          };
        },
      });
    },
  });

  // =====================================================================
  // Week 4 (A1): Akkusativ
  // =====================================================================
  const AK = {
    Kaffee: { g: 'm', en: 'coffee' }, Suppe: { g: 'f', en: 'soup' }, Brot: { g: 'n', en: 'bread' }, Äpfel: { g: 'pl', en: 'apples' },
  };
  const ART = {
    nom: { def: { m: 'der', f: 'die', n: 'das', pl: 'die' }, ind: { m: 'ein', f: 'eine', n: 'ein', pl: '' } },
    akk: { def: { m: 'den', f: 'die', n: 'das', pl: 'die' }, ind: { m: 'einen', f: 'eine', n: 'ein', pl: '' } },
  };

  MM.register({
    id: 'akkusativ', day: 4, week: 1,
    vocab: [
      ['nehmen', 'to take, to have (food, drink)'], ['brauchen', 'to need'], ['Tee', 'tea', 'm'],
      ['Apfel', 'apple (plural: Äpfel)', 'm'], ['Suppe', 'soup', 'f'], ['Brot', 'bread', 'n'],
      ['Rucksack', 'backpack', 'm'], ['Auto', 'car', 'n'],
    ],
    title: 'Akkusativ',
    tagline: 'The direct object takes the accusative. Only masculine nouns change: der becomes den, ein becomes einen.',
    prompt: 'Choose a food and switch between Nominativ (“That is …”) and Akkusativ (“I’ll take …”). Only der Kaffee changes.',
    body: `
<section>
  <p class="rule">Only the masculine changes: der → den, ein → einen.</p>
  <p>The subject (who does it) is in the <b>nominative</b>. The thing the action happens to, the direct object, is in the <b>accusative</b>. Verbs like <i>haben, nehmen, kaufen, brauchen, möchten, sehen, essen, trinken</i> and <i>es gibt</i> take an accusative object. Good news: feminine, neuter and plural look exactly the same as the nominative. Also learn <b>kein</b> (no/none): it follows the ein pattern, so masculine is <b>keinen</b>.</p>
</section>
<section>
  <h2>Pattern</h2>
  ${table(['', 'masculine', 'feminine', 'neuter', 'plural'], [
    ['Nominativ', 'der / ein Kaffee', 'die / eine Suppe', 'das / ein Brot', 'die / – Äpfel'],
    ['Akkusativ', `${R('obj', 'den')} / ${R('obj', 'einen')} Kaffee`, 'die / eine Suppe', 'das / ein Brot', 'die / – Äpfel'],
  ])}
  ${table(['Pronoun', 'ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'sie / Sie'], [['Akkusativ', 'mich', 'dich', R('obj', 'ihn'), 'sie', 'es', 'uns', 'euch', 'sie / Sie']])}
</section>
<section>
  <h2>Examples</h2>
  ${ex([
    ['Ich nehme einen Tee, bitte.', 'I’ll have a tea, please.'],
    ['Wir brauchen einen Tisch für vier Personen.', 'We need a table for four people.'],
    ['Hast du den Schlüssel?', 'Do you have the key?'],
    ['Gibt es hier einen Supermarkt?', 'Is there a supermarket here?'],
    ['Der Rock ist schön. Ich kaufe ihn.', 'The skirt is nice. I’ll buy it.'],
  ])}
</section>
<section>
  <h2>Common mistakes</h2>
  <ul class="mistakes">
    <li><s>Ich habe ein Bruder.</s> → Ich habe <b>einen</b> Bruder. Bruder is masculine.</li>
    <li><s>Ich nehme den Suppe.</s> → Ich nehme <b>die</b> Suppe. Feminine does not change.</li>
    <li><s>Den Kaffee ist heiß.</s> → <b>Der</b> Kaffee ist heiß. After sein there is no accusative.</li>
    <li><s>Ich kaufe es</s> for der Rock → Ich kaufe <b>ihn</b>. The pronoun follows the noun’s gender, not English “it”.</li>
  </ul>
</section>
<section>
  <h2>Quiz</h2>
  <div data-quiz></div>
</section>
<section>
  <div class="try">
    <h3>Sprechen: at the café</h3>
    <p>${A1_TRY} Order for three friends, with one masculine, one feminine and one neuter item: <i>Ich hätte gern einen Kaffee, eine Cola und ein Stück Kuchen.</i> Then ask: <i>Haben Sie auch einen Tee?</i></p>
  </div>
</section>`,
    quiz: [
      { type: 'pick', q: 'Ich kaufe ___ Rucksack. (der Rucksack)', opts: ['einen', 'ein', 'eine'], a: 0, why: 'Masculine accusative: ein → <em>einen</em>.' },
      { type: 'pick', q: 'Wir nehmen ___ Pizza. (die Pizza)', opts: ['die', 'den', 'der'], a: 0, why: 'Feminine does not change in the accusative.' },
      { type: 'pick', q: '___ Zug ist pünktlich.', opts: ['Der', 'Den', 'Einen'], a: 0, why: 'Der Zug is the subject: nominative.' },
      { type: 'pick', q: 'Kennst du Herrn Owusu? – Ja, ich kenne ___.', opts: ['ihn', 'er', 'es'], a: 0, why: 'Masculine accusative pronoun: <em>ihn</em>.' },
      { type: 'order', q: 'Build: “We need a car.”', tiles: ['Wir', 'brauchen', 'ein', 'Auto'], a: 'Wir brauchen ein Auto', why: 'das Auto is neuter: ein stays ein.' },
    ],
    mount(ctx) {
      chipScene(ctx, {
        state: { n: 'Kaffee', c: 'akk', a: 'ind' },
        chips: [
          { label: 'Nomen', key: 'n', opts: opts(Object.keys(AK), { Kaffee: 'der Kaffee', Suppe: 'die Suppe', Brot: 'das Brot', Äpfel: 'die Äpfel' }) },
          { label: 'Fall', key: 'c', opts: [{ v: 'nom', label: 'Nominativ' }, { v: 'akk', label: 'Akkusativ' }] },
          { label: 'Artikel', key: 'a', opts: [{ v: 'def', label: 'der/den' }, { v: 'ind', label: 'ein/einen' }] },
        ],
        build({ n, c, a }) {
          const g = AK[n].g, art = ART[c][a][g], pl = g === 'pl';
          const nom = c === 'nom';
          const keys = ['A', 'V'].concat(art ? ['R'] : [], ['N', 'd']);
          const changed = !nom && g === 'm';
          return {
            tokens: [['A', nom ? 'das' : 'ich', 'subj'], ['V', nom ? (pl ? 'sind' : 'ist') : 'nehme', 'verb'], ['R', art || '-', nom ? 'plain' : 'obj'], ['N', n, nom ? 'plain' : 'obj'], ['d', '.', 'punct']],
            keys, pop: changed ? ['R'] : [],
            tag: nom ? 'Nominativ' : changed ? 'Akkusativ: maskulin ändert sich!' : 'Akkusativ: keine Änderung',
            en: nom ? (pl ? (a === 'def' ? 'Those are the ' : 'Those are ') : (a === 'def' ? 'That is the ' : 'That is a ')) + AK[n].en + '.' : `I’ll take ${a === 'def' ? 'the' : pl ? 'some' : 'a'} ${AK[n].en}.`,
            note: nom ? 'After <b>sein</b> (ist/sind) the noun stays in the nominative.'
              : changed ? `<b>nehmen</b> takes an accusative object, and <b>der Kaffee</b> is masculine, so the article becomes <b class="r-obj">${art}</b>.`
              : `<b>nehmen</b> takes an accusative object, but ${g === 'f' ? 'feminine' : g === 'n' ? 'neuter' : 'plural'} articles look the same as the nominative.`,
          };
        },
      });
    },
  });

  // =====================================================================
  // Week 5 (A1): nicht und kein
  // =====================================================================
  const NEG = {
    auto: { t: [['S', 'ich', 'subj'], ['V', 'habe', 'verb'], ['A', 'ein', 'obj'], ['O', 'Auto', 'obj'], ['p', '.', 'punct']], pos: ['S', 'V', 'A', 'O', 'p'], neg: ['S', 'V', 'A', 'O', 'p'], nt: { A: 'kein' }, pop: ['A'], en: ['I have a car.', 'I don’t have a car.'], why: '<b>ein</b> + noun becomes <b>kein</b> + noun.' },
    zeit: { t: [['S', 'wir', 'subj'], ['V', 'haben', 'verb'], ['N', 'keine', 'conn'], ['O', 'Zeit', 'obj'], ['p', '.', 'punct']], pos: ['S', 'V', 'O', 'p'], neg: ['S', 'V', 'N', 'O', 'p'], pop: ['N'], en: ['We have time.', 'We have no time.'], why: 'A noun with no article is negated with <b>kein</b>, with the ending it would have: die Zeit → <b>keine</b> Zeit.' },
    kaffee: { t: [['S', 'er', 'subj'], ['V', 'trinkt', 'verb'], ['N', 'keinen', 'conn'], ['O', 'Kaffee', 'obj'], ['p', '.', 'punct']], pos: ['S', 'V', 'O', 'p'], neg: ['S', 'V', 'N', 'O', 'p'], pop: ['N'], en: ['He drinks coffee.', 'He doesn’t drink coffee.'], why: 'der Kaffee is masculine and the object, so: <b>keinen</b> Kaffee (accusative, like einen).' },
    muede: { t: [['S', 'ich', 'subj'], ['V', 'bin', 'verb'], ['N', 'nicht', 'conn'], ['X', 'müde', 'obj'], ['p', '.', 'punct']], pos: ['S', 'V', 'X', 'p'], neg: ['S', 'V', 'N', 'X', 'p'], pop: ['N'], en: ['I’m tired.', 'I’m not tired.'], why: '<b>nicht</b> goes before an adjective.' },
    heute: { t: [['S', 'sie', 'subj'], ['V', 'kommt', 'verb'], ['T', 'heute', 'plain'], ['N', 'nicht', 'conn'], ['p', '.', 'punct']], pos: ['S', 'V', 'T', 'p'], neg: ['S', 'V', 'T', 'N', 'p'], pop: ['N'], en: ['She’s coming today.', 'She isn’t coming today.'], why: 'To negate the whole sentence, <b>nicht</b> goes near the end, after time words.' },
    hund: { t: [['S', 'das', 'subj'], ['V', 'ist', 'verb'], ['N', 'nicht', 'conn'], ['O', 'mein Hund', 'obj'], ['p', '.', 'punct']], pos: ['S', 'V', 'O', 'p'], neg: ['S', 'V', 'N', 'O', 'p'], pop: ['N'], en: ['That’s my dog.', 'That’s not my dog.'], why: 'With der/die/das or mein/dein the noun is negated with <b>nicht</b>, not kein.' },
  };
  const NEG_L = { auto: 'ein Auto', zeit: 'Zeit', kaffee: 'Kaffee', muede: 'müde', heute: 'heute', hund: 'mein Hund' };

  MM.register({
    id: 'nicht-kein', day: 5, week: 1,
    vocab: [
      ['nicht', 'not'], ['kein', 'no, not a'], ['doch', 'yes (after a negative question)'], ['Hunger', 'hunger', 'm'],
      ['Zeit', 'time', 'f'], ['Auto', 'car', 'n'], ['Geschwister', 'brothers and sisters', 'pl'],
      ['teuer', 'expensive'],
    ],
    title: 'nicht und kein',
    tagline: 'Use kein for nouns with ein or no article. Use nicht for everything else.',
    prompt: 'Pick a sentence and switch it between positive and negative. Does it take nicht or kein?',
    body: `
<section>
  <p class="rule">ein or no article → kein. Everything else → nicht.</p>
  <p>English uses “not” and “no”. German splits it the same way. <b>kein</b> means “no / not a / not any” and replaces <i>ein</i> or stands where there was no article. It takes the same endings as <i>ein</i> (and keine in the plural). <b>nicht</b> negates verbs, adjectives, adverbs and nouns with der/die/das or mein/dein. To negate a whole sentence, nicht usually goes near the end, but before adjectives, places and the second verb part.</p>
</section>
<section>
  <h2>Pattern</h2>
  ${table(['Positive', 'Negative', 'Why'], [
    ['Ich habe ein Auto.', `Ich habe ${R('conn', 'kein')} Auto.`, 'ein → kein'],
    ['Wir haben Zeit.', `Wir haben ${R('conn', 'keine')} Zeit.`, 'no article → kein + ending'],
    ['Ich bin müde.', `Ich bin ${R('conn', 'nicht')} müde.`, 'adjective'],
    ['Sie kommt heute.', `Sie kommt heute ${R('conn', 'nicht')}.`, 'whole sentence: near the end'],
    ['Das ist der Bus.', `Das ist ${R('conn', 'nicht')} der Bus.`, 'der/die/das'],
    ['Ich wohne in Köln.', `Ich wohne ${R('conn', 'nicht')} in Köln.`, 'before a place'],
  ])}
</section>
<section>
  <h2>Examples</h2>
  ${ex([
    ['Ich habe keine Geschwister.', 'I don’t have any brothers or sisters.'],
    ['Das ist kein Problem.', 'That’s no problem.'],
    ['Ich verstehe das nicht.', 'I don’t understand that.'],
    ['Das Hotel ist nicht teuer.', 'The hotel isn’t expensive.'],
    ['Er spricht kein Deutsch, aber Englisch.', 'He doesn’t speak German, but English.'],
  ])}
</section>
<section>
  <h2>Common mistakes</h2>
  <ul class="mistakes">
    <li><s>Ich habe nicht ein Auto.</s> → Ich habe <b>kein</b> Auto.</li>
    <li><s>Ich nicht verstehe.</s> → Ich verstehe <b>nicht</b>. The verb keeps position 2.</li>
    <li><s>Ich habe kein Zeit.</s> → Ich habe <b>keine</b> Zeit. kein takes the ending: die Zeit → keine.</li>
    <li>Answering a negative question with “yes”: <b>doch</b>. <i>Kommst du nicht? – Doch!</i> (Yes, I am!)</li>
  </ul>
</section>
<section>
  <h2>Quiz</h2>
  <div data-quiz></div>
</section>
<section>
  <div class="try">
    <h3>Sprechen: what I don’t have</h3>
    <p>${A1_TRY} Say three things you have and three you don’t: <i>Ich habe einen Bruder, aber keine Schwester. Ich habe kein Auto. Ich bin nicht müde.</i></p>
  </div>
</section>`,
    quiz: [
      { type: 'pick', q: 'Ich habe ___ Hunger.', opts: ['keinen', 'nicht', 'kein'], a: 0, why: 'der Hunger, no article, accusative: <em>keinen</em>.' },
      { type: 'pick', q: 'Das Zimmer ist ___ groß.', opts: ['nicht', 'kein', 'keine'], a: 0, why: 'Adjective: <em>nicht</em>.' },
      { type: 'pick', q: 'Das ist ___ Bahnhof, das ist das Museum.', opts: ['nicht der', 'kein der', 'keinen'], a: 0, why: 'With der/die/das use <em>nicht</em>.' },
      { type: 'order', q: 'Build: “I’m not coming tomorrow.”', tiles: ['Ich', 'komme', 'morgen', 'nicht'], a: 'Ich komme morgen nicht', why: 'Whole-sentence nicht goes near the end, after the time.' },
      { type: 'pick', q: 'Hast du keine Zeit? – ___, ich habe Zeit!', opts: ['Doch', 'Ja', 'Nein'], a: 0, why: '<em>Doch</em> says yes to a negative question.' },
    ],
    mount(ctx) {
      chipScene(ctx, {
        state: { s: 'auto', m: 'neg' },
        chips: [{ label: 'Satz', key: 's', opts: opts(Object.keys(NEG), NEG_L) }, { label: 'Form', key: 'm', opts: [{ v: 'pos', label: 'positiv' }, { v: 'neg', label: 'negativ' }] }],
        build({ s, m }) {
          const D = NEG[s], neg = m === 'neg';
          const roles = neg && D.nt ? { A: 'conn' } : {};
          const word = D.nt ? 'kein' : D.t.find(t => t[0] === 'N')[1];
          return {
            tokens: D.t, keys: neg ? D.neg : D.pos, text: neg ? D.nt : (D.nt ? { A: 'ein' } : {}), roles,
            pop: neg ? D.pop : [], tag: neg ? (word === 'nicht' ? 'nicht' : 'kein') : 'positiv',
            en: D.en[neg ? 1 : 0], note: neg ? D.why : 'Switch to negativ: will it be nicht or kein?',
          };
        },
      });
    },
  });

  // =====================================================================
  // Week 6 (A1): Modalverben
  // =====================================================================
  const MOD = {
    none: { f: ['spiele', 'spielst', 'spielen'], en: 'play' },
    können: { f: ['kann', 'kannst', 'können'], en: 'can play' },
    müssen: { f: ['muss', 'musst', 'müssen'], en: 'have to play' },
    wollen: { f: ['will', 'willst', 'wollen'], en: 'want to play' },
    möchten: { f: ['möchte', 'möchtest', 'möchten'], en: 'would like to play' },
  };
  const MP = ['ich', 'du', 'wir'], MP_EN = { ich: 'I', du: 'you', wir: 'we' };

  MM.register({
    id: 'modalverben', day: 6, week: 1,
    vocab: [
      ['können', 'can, to be able to'], ['müssen', 'must, to have to'], ['dürfen', 'may, to be allowed to'],
      ['wollen', 'to want'], ['möchten', 'would like'], ['aufstehen', 'to get up'], ['Fußball', 'football', 'm'],
      ['Büro', 'office', 'n'],
    ],
    title: 'Modalverben',
    tagline: 'A modal verb takes position 2, and the main verb goes to the very end as an infinitive.',
    prompt: 'Add a modal verb and watch the main verb fly to the end: the sentence bracket (Satzklammer).',
    body: `
<section>
  <p class="rule">Modal in position 2, infinitive at the end.</p>
  <p>Modal verbs add a mood to an action: ability, need, wish. They are conjugated and stand in position 2, and the main verb goes to the <b>end of the sentence</b> in its infinitive form. The two verbs form a bracket around the rest of the sentence: the <i>Satzklammer</i>. You will see the same bracket again with separable verbs, the Perfekt and the future.</p>
</section>
<section>
  <h2>Pattern</h2>
  ${table(['', 'können (can)', 'müssen (must)', 'wollen (want)', 'möchten (would like)', 'dürfen (may)', 'sollen (should)'], [
    ['ich', 'kann', 'muss', 'will', 'möchte', 'darf', 'soll'],
    ['du', 'kannst', 'musst', 'willst', 'möchtest', 'darfst', 'sollst'],
    ['er/sie/es', 'kann', 'muss', 'will', 'möchte', 'darf', 'soll'],
    ['wir / sie / Sie', 'können', 'müssen', 'wollen', 'möchten', 'dürfen', 'sollen'],
    ['ihr', 'könnt', 'müsst', 'wollt', 'möchtet', 'dürft', 'sollt'],
  ])}
  ${table(['Position 2', 'Middle', 'End'], [[`Ich ${R('verb', 'kann')}`, 'heute nicht', R('verb2', 'kommen.')], [`${R('verb', 'Musst')} du`, 'morgen', R('verb2', 'arbeiten?')]])}
</section>
<section>
  <h2>Examples</h2>
  ${ex([
    ['Ich kann gut kochen.', 'I can cook well.'],
    ['Wir müssen um acht Uhr im Büro sein.', 'We have to be in the office at eight.'],
    ['Möchtest du einen Kaffee trinken?', 'Would you like to drink a coffee?'],
    ['Hier darf man nicht rauchen.', 'You may not smoke here.'],
    ['Er will nächstes Jahr in Deutschland studieren.', 'He wants to study in Germany next year.'],
  ])}
</section>
<section>
  <h2>Common mistakes</h2>
  <ul class="mistakes">
    <li><s>Ich kann spielen Fußball.</s> → Ich kann Fußball <b>spielen</b>. The infinitive goes to the end.</li>
    <li><s>Er kannt …</s> → Er <b>kann</b>. ich and er/sie/es have no ending with modals.</li>
    <li><s>Ich muss zu gehen.</s> → Ich muss <b>gehen</b>. No zu after modal verbs.</li>
    <li>“I must not” is <b>ich darf nicht</b>. <i>Ich muss nicht</i> means “I don’t have to”.</li>
  </ul>
</section>
<section>
  <h2>Quiz</h2>
  <div data-quiz></div>
</section>
<section>
  <div class="try">
    <h3>Sprechen: my week</h3>
    <p>${A1_TRY} Say one sentence with each modal: what you can do, must do this week, want to do at the weekend, and would like to eat today. <i>Am Samstag will ich ins Kino gehen.</i></p>
  </div>
</section>`,
    quiz: [
      { type: 'order', q: 'Build: “I can speak German.”', tiles: ['Ich', 'kann', 'Deutsch', 'sprechen'], a: 'Ich kann Deutsch sprechen', why: 'Modal in position 2, infinitive last.' },
      { type: 'pick', q: 'Du ___ heute arbeiten.', opts: ['musst', 'muss', 'müssen'], a: 0, why: 'du: <em>musst</em>.' },
      { type: 'pick', q: 'Er ___ einen Tee.', opts: ['möchte', 'möchtet', 'möchtest'], a: 0, why: 'er: <em>möchte</em>. Here the infinitive (trinken) is understood.' },
      { type: 'pick', q: 'Wir müssen morgen früh ___.', opts: ['aufstehen', 'stehen auf', 'zu aufstehen'], a: 0, why: 'The infinitive goes to the end, whole and without zu.' },
      { type: 'pick', q: 'Which means “You don’t have to come”?', opts: ['Du musst nicht kommen.', 'Du darfst nicht kommen.', 'Du kannst nicht kommen.'], a: 0, why: '<em>nicht müssen</em> = not have to; <em>nicht dürfen</em> = must not.' },
    ],
    mount(ctx) {
      chipScene(ctx, {
        state: { p: 'ich', m: 'können' },
        chips: [{ label: 'Person', key: 'p', opts: opts(MP) }, { label: 'Modalverb', key: 'm', opts: opts(Object.keys(MOD), { none: 'ohne', können: 'können', müssen: 'müssen', wollen: 'wollen', möchten: 'möchten' }) }],
        build({ p, m }) {
          const D = MOD[m], i = MP.indexOf(p), none = m === 'none';
          return {
            tokens: [['S', p, 'subj'], ['V', D.f[i], 'verb'], ['T', 'heute', 'plain'], ['O', 'Fußball', 'obj'], ['I', 'spielen', 'verb2'], ['d', '.', 'punct']],
            keys: none ? ['S', 'V', 'T', 'O', 'd'] : ['S', 'V', 'T', 'O', 'I', 'd'], pop: none ? ['V'] : ['V', 'I'],
            tag: none ? 'ein Verb' : 'Satzklammer: Modal … Infinitiv',
            en: `${MP_EN[p].charAt(0).toUpperCase() + MP_EN[p].slice(1)} ${D.en} football today.`,
            note: none ? 'One verb, conjugated, in position 2. Now add a modal verb.'
              : `<b class="r-verb">${D.f[i]}</b> takes position 2; <b class="r-verb2">spielen</b> goes to the end unchanged. Everything else sits inside the bracket.`,
          };
        },
      });
    },
  });

  // =====================================================================
  // Week 7 (A1): Trennbare Verben
  // =====================================================================
  const TV = {
    aufstehen: { v: 'stehe', pre: 'auf', rest: 'um sieben Uhr', en: ['I get up at seven.', 'I have to get up at seven.'] },
    einkaufen: { v: 'kaufe', pre: 'ein', rest: 'im Supermarkt', en: ['I shop at the supermarket.', 'I have to shop at the supermarket.'] },
    anrufen: { v: 'rufe', pre: 'an', rest: 'meine Mutter', en: ['I call my mother.', 'I have to call my mother.'] },
    fernsehen: { v: 'sehe', pre: 'fern', rest: 'am Abend', en: ['I watch TV in the evening.', 'I have to watch TV in the evening.'] },
  };

  MM.register({
    id: 'trennbare-verben', day: 7, week: 1,
    vocab: [
      ['aufstehen', 'to get up'], ['anfangen', 'to begin'], ['einkaufen', 'to go shopping'], ['anrufen', 'to phone'],
      ['einladen', 'to invite'], ['fernsehen', 'to watch TV'], ['Supermarkt', 'supermarket', 'm'],
      ['Abend', 'evening', 'm'],
    ],
    title: 'Trennbare Verben',
    tagline: 'Verbs like aufstehen split in two: the verb takes position 2 and the prefix jumps to the end.',
    prompt: 'Pick a verb. In the present tense the prefix flies to the end; add müssen and it joins the verb again.',
    body: `
<section>
  <p class="rule">Prefix to the end, unless the whole verb is already there.</p>
  <p>Many everyday verbs have a prefix such as <b>auf-, an-, ein-, aus-, mit-, zu-, fern-</b>. In a normal sentence the verb part is conjugated in position 2 and the prefix goes to the end, making the same bracket as modal verbs. When the verb is an infinitive at the end (after a modal), prefix and verb stay together. In speech the prefix is stressed: <b>AUF</b>stehen.</p>
</section>
<section>
  <h2>Pattern</h2>
  ${table(['Infinitive', 'Present tense', 'With a modal'], [
    ['aufstehen (get up)', `Ich ${R('verb', 'stehe')} um 7 Uhr ${R('verb2', 'auf')}.`, `Ich muss um 7 Uhr ${R('verb2', 'aufstehen')}.`],
    ['einkaufen (shop)', `Wir ${R('verb', 'kaufen')} heute ${R('verb2', 'ein')}.`, `Wir wollen heute ${R('verb2', 'einkaufen')}.`],
    ['anrufen (phone)', `${R('verb', 'Rufst')} du mich ${R('verb2', 'an')}?`, `Kannst du mich ${R('verb2', 'anrufen')}?`],
    ['mitkommen (come along)', `Er ${R('verb', 'kommt')} nicht ${R('verb2', 'mit')}.`, `Er möchte nicht ${R('verb2', 'mitkommen')}.`],
  ])}
  <p>Not every prefix separates. <b>be-, ver-, er-, ent-, emp-, ge-, zer-</b> stay attached: <i>Ich verstehe, ich bezahle, ich besuche.</i></p>
</section>
<section>
  <h2>Examples</h2>
  ${ex([
    ['Der Zug fährt um 9 Uhr ab.', 'The train leaves at 9.'],
    ['Wann fängt der Kurs an?', 'When does the course start?'],
    ['Ich lade dich zum Essen ein.', 'I’m inviting you to dinner.'],
    ['Mach bitte das Fenster zu!', 'Please close the window!'],
    ['Ich möchte heute Abend nicht fernsehen.', 'I don’t want to watch TV tonight.'],
  ])}
</section>
<section>
  <h2>Common mistakes</h2>
  <ul class="mistakes">
    <li><s>Ich aufstehe um sieben.</s> → Ich <b>stehe</b> um sieben <b>auf</b>.</li>
    <li><s>Ich muss um sieben stehen auf.</s> → … <b>aufstehen</b>. After a modal it stays in one piece.</li>
    <li><s>Ich besuche dich be.</s> → Ich besuche dich. be- never separates.</li>
    <li>Look up the infinitive with the prefix: <i>kommt … mit</i> is <b>mitkommen</b>, not kommen.</li>
  </ul>
</section>
<section>
  <h2>Quiz</h2>
  <div data-quiz></div>
</section>
<section>
  <div class="try">
    <h3>Sprechen: my daily routine</h3>
    <p>${A1_TRY} Describe a normal day with five separable verbs: <i>Ich stehe um … auf. Ich ziehe mich an. Ich kaufe nach der Arbeit ein. Am Abend rufe ich … an. Dann sehe ich fern.</i></p>
  </div>
</section>`,
    quiz: [
      { type: 'order', q: 'Build: “I get up at six.”', tiles: ['Ich', 'stehe', 'um', 'sechs', 'auf'], a: 'Ich stehe um sechs auf', why: 'Verb in position 2, prefix at the end.' },
      { type: 'pick', q: 'Wann ___ der Film ___?', opts: ['fängt … an', 'anfängt … –', 'fängt … –'], a: 0, why: 'anfangen splits: fängt … an.' },
      { type: 'pick', q: 'Ich muss heute ___.', opts: ['einkaufen', 'kaufen ein', 'ein kaufen'], a: 0, why: 'After a modal, one word at the end.' },
      { type: 'pick', q: 'Which verb does NOT split?', opts: ['verstehen', 'aufmachen', 'mitkommen'], a: 0, why: '<em>ver-</em> is an inseparable prefix.' },
      { type: 'pick', q: 'Ruf mich morgen ___!', opts: ['an', 'auf', 'ein'], a: 0, why: 'anrufen = to phone. The imperative also sends the prefix to the end.' },
    ],
    mount(ctx) {
      chipScene(ctx, {
        state: { v: 'aufstehen', m: 'praes' },
        chips: [{ label: 'Verb', key: 'v', opts: opts(Object.keys(TV)) }, { label: 'Form', key: 'm', opts: [{ v: 'inf', label: 'Infinitiv' }, { v: 'praes', label: 'Präsens' }, { v: 'modal', label: 'mit müssen' }] }],
        build({ v, m }) {
          const D = TV[v];
          if (m === 'inf') return {
            tokens: [['P', D.pre, 'verb2'], ['W', v.slice(D.pre.length), 'verb']], keys: ['P', 'W'], cap: false, tight: ['W'],
            tag: `${D.pre} | ${v.slice(D.pre.length)}`, note: `The dictionary form, <b>${v}</b>, is one word: the prefix <b class="r-verb2">${D.pre}-</b> plus <b class="r-verb">${v.slice(D.pre.length)}</b>. Now try Präsens.`,
          };
          const modal = m === 'modal';
          return {
            tokens: [['S', 'ich', 'subj'], ['V', modal ? 'muss' : D.v, 'verb'], ['R', D.rest, 'obj'], ['P', modal ? v : D.pre, 'verb2'], ['d', '.', 'punct']],
            keys: ['S', 'V', 'R', 'P', 'd'], pop: ['V', 'P'],
            tag: modal ? 'Modal … Infinitiv (zusammen)' : 'Verb … Präfix',
            en: D.en[modal ? 1 : 0],
            note: modal ? `<b class="r-verb">muss</b> takes position 2, so <b class="r-verb2">${v}</b> stays whole at the end.`
              : `<b class="r-verb">${D.v}</b> takes position 2 and the prefix <b class="r-verb2">${D.pre}</b> goes to the end.`,
          };
        },
      });
    },
  });

  // =====================================================================
  // Week 8 (A1): Possessivartikel
  // =====================================================================
  const OWN = { ich: 'mein', du: 'dein', er: 'sein', sie: 'ihr', wir: 'unser' };
  const OWN_EN = { ich: 'my', du: 'your', er: 'his', sie: 'her', wir: 'our' };
  const FAM = { Bruder: { g: 'm', en: 'brother' }, Schwester: { g: 'f', en: 'sister' }, Kind: { g: 'n', en: 'child' }, Eltern: { g: 'pl', en: 'parents' } };
  const END = { nom: { m: '', f: 'e', n: '', pl: 'e' }, akk: { m: 'en', f: 'e', n: '', pl: 'e' } };

  MM.register({
    id: 'possessivartikel', day: 8, week: 1,
    vocab: [
      ['Mutter', 'mother', 'f'], ['Vater', 'father', 'm'], ['Bruder', 'brother', 'm'], ['Schwester', 'sister', 'f'],
      ['Tochter', 'daughter', 'f'], ['Kind', 'child', 'n'], ['Hund', 'dog', 'm'], ['Eltern', 'parents', 'pl'],
    ],
    title: 'mein, dein, sein, ihr',
    tagline: 'Possessives take the same endings as ein: mein Bruder, meine Schwester, meinen Bruder.',
    prompt: 'Pick whose family it is, then a family member. Switch to Akkusativ and watch the ending.',
    body: `
<section>
  <p class="rule">Choose the word by the owner, the ending by the noun.</p>
  <p>Possessive articles (my, your, his …) work like <b>ein</b>. First pick the word that matches the owner: <i>ich → mein, du → dein, er → sein, sie → ihr</i>. Then give it the ending that matches the noun’s gender and case, exactly as ein/eine/einen. Unlike ein, possessives have a plural: <b>meine</b> Eltern.</p>
</section>
<section>
  <h2>Pattern</h2>
  ${table(['Owner', 'ich', 'du', 'er / es', 'sie', 'wir', 'ihr', 'sie / Sie'], [['Possessive', 'mein', 'dein', 'sein', 'ihr', 'unser', 'euer', 'ihr / Ihr']])}
  ${table(['', 'masculine', 'feminine', 'neuter', 'plural'], [
    ['Nominativ', 'mein Bruder', `mein${R('verb', 'e')} Schwester`, 'mein Kind', `mein${R('verb', 'e')} Eltern`],
    ['Akkusativ', `mein${R('obj', 'en')} Bruder`, `mein${R('verb', 'e')} Schwester`, 'mein Kind', `mein${R('verb', 'e')} Eltern`],
  ])}
</section>
<section>
  <h2>Examples</h2>
  ${ex([
    ['Das ist meine Mutter, und das ist mein Vater.', 'This is my mother, and this is my father.'],
    ['Wie heißt dein Bruder?', 'What’s your brother’s name?'],
    ['Ama besucht ihren Onkel in Kumasi.', 'Ama is visiting her uncle in Kumasi.'],
    ['Unsere Wohnung hat zwei Zimmer.', 'Our flat has two rooms.'],
    ['Ist das Ihr Koffer, Herr Boateng?', 'Is this your suitcase, Mr Boateng?'],
  ])}
</section>
<section>
  <h2>Common mistakes</h2>
  <ul class="mistakes">
    <li><s>Das ist mein Schwester.</s> → Das ist <b>meine</b> Schwester.</li>
    <li><s>Ich besuche mein Bruder.</s> → Ich besuche <b>meinen</b> Bruder. Masculine accusative.</li>
    <li><s>Ama besucht seinen Onkel.</s> → … <b>ihren</b> Onkel. Ama is female, so ihr-; Onkel is masculine accusative, so -en.</li>
    <li>euer loses an e with an ending: <b>eure</b> Kinder, not euere.</li>
  </ul>
</section>
<section>
  <h2>Quiz</h2>
  <div data-quiz></div>
</section>
<section>
  <div class="try">
    <h3>Sprechen: my family</h3>
    <p>${A1_TRY} Show a family photo, or imagine one, and describe five people: <i>Das ist meine Schwester. Sie heißt … Ihr Mann kommt aus … Ich besuche meinen Opa jeden Sonntag.</i> This is a full A1 speaking task.</p>
  </div>
</section>`,
    quiz: [
      { type: 'pick', q: 'Das ist ___ Tochter. (ich)', opts: ['meine', 'mein', 'meinen'], a: 0, why: 'die Tochter is feminine: <em>meine</em>.' },
      { type: 'pick', q: 'Kofi ruft ___ Vater an. (his)', opts: ['seinen', 'sein', 'ihren'], a: 0, why: 'Kofi is male (sein-), Vater is masculine accusative (-en).' },
      { type: 'pick', q: 'Wo wohnen ___ Eltern? (du)', opts: ['deine', 'dein', 'deinen'], a: 0, why: 'Plural: <em>deine</em>.' },
      { type: 'pick', q: 'Abena liebt ___ Hund. (her)', opts: ['ihren', 'seinen', 'ihr'], a: 0, why: 'Female owner: ihr-; der Hund, accusative: -en.' },
      { type: 'order', q: 'Build: “Our child is three.”', tiles: ['Unser', 'Kind', 'ist', 'drei'], a: 'Unser Kind ist drei', why: 'das Kind, nominative: no ending.' },
    ],
    mount(ctx) {
      chipScene(ctx, {
        state: { o: 'ich', n: 'Bruder', c: 'nom' },
        chips: [
          { label: 'Wessen?', key: 'o', opts: opts(Object.keys(OWN), { ich: 'ich', du: 'du', er: 'er', sie: 'sie (she)', wir: 'wir' }) },
          { label: 'Familie', key: 'n', opts: opts(Object.keys(FAM), { Bruder: 'der Bruder', Schwester: 'die Schwester', Kind: 'das Kind', Eltern: 'die Eltern' }) },
          { label: 'Fall', key: 'c', opts: [{ v: 'nom', label: 'Nominativ' }, { v: 'akk', label: 'Akkusativ' }] },
        ],
        build({ o, n, c }) {
          const g = FAM[n].g, e = END[c][g], pl = g === 'pl', nom = c === 'nom';
          const base = OWN[o], form = base + e;
          return {
            tokens: [['A', nom ? 'das' : 'ich', 'subj'], ['V', nom ? (pl ? 'sind' : 'ist') : 'besuche', 'verb'], ['P', form, e ? (e === 'en' ? 'obj' : 'verb') : 'plain'], ['N', n, nom ? 'plain' : 'obj'], ['d', '.', 'punct']],
            keys: ['A', 'V', 'P', 'N', 'd'], pop: ['P'],
            tag: `${base} + ${e ? '-' + e : 'no ending'}`,
            en: nom ? `${pl ? 'Those are' : 'That is'} ${OWN_EN[o]} ${FAM[n].en}.` : `I’m visiting ${OWN_EN[o]} ${FAM[n].en}.`,
            note: `Owner <b>${o}</b> → <b>${base}</b>. ${n} is ${{ m: 'masculine', f: 'feminine', n: 'neuter', pl: 'plural' }[g]} ${nom ? 'nominative' : 'accusative'}, so the ending is ${e ? `<b>-${e}</b>` : 'nothing'}, just like ${{ nom: { m: 'ein', f: 'eine', n: 'ein', pl: 'keine' }, akk: { m: 'einen', f: 'eine', n: 'ein', pl: 'keine' } }[c][g]}.`,
          };
        },
      });
    },
  });
})();
