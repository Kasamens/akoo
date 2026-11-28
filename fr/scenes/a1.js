/* Akoo Français, level A1 (weeks 1-8): French from zero, one rule a week, as painted 3D worlds.
 * Uses the engine in shared/app.js and the shared kit in shared/kit.js (window.GK).
 * A1 goal: introduce yourself and talk about your day, family and shopping in short, simple sentences.
 * All example sentences are original. Typography: a thin space ( ) goes before ? ! : ; as in French print.
 */
(function () {
  'use strict';
  const { say, ex, table, R, chipScene } = window.GK;
  const A1_TRY = 'A1 goal: introduce yourself and talk about your day in short, simple sentences.';
  const opts = (list, lab) => list.map(v => ({ v, label: lab ? lab[v] : v }));
  const QM = ' ?';                                  // French question mark with its thin space
  const vowel = w => /^[aeiouyhàâéèêëîïôûù]/i.test(w);   // the words used here all start with a silent h

  // je + vowel -> j’ (glued to the next block)
  function subjTokens(p, verb) {
    if (p === 'je' && vowel(verb)) return { S: ['S', 'j’', 'subj'], tight: ['V'] };
    return { S: ['S', p, 'subj'], tight: [] };
  }

  // =====================================================================
  // Week 1 (A1): Le présent: être, avoir and -er verbs
  // =====================================================================
  const PERS = ['je', 'tu', 'il', 'nous', 'vous', 'ils'];
  const PERS_LAB = { je: 'je', tu: 'tu', il: 'il/elle/on', nous: 'nous', vous: 'vous', ils: 'ils/elles' };
  const PERS_EN = { je: 'I', tu: 'you (one friend)', il: 'he', nous: 'we', vous: 'you (several, or formal)', ils: 'they' };
  const VB = {
    parler: { f: ['parle', 'parles', 'parle', 'parlons', 'parlez', 'parlent'], rest: 'français', en: 'speak French', stem: 'parl' },
    habiter: { f: ['habite', 'habites', 'habite', 'habitons', 'habitez', 'habitent'], rest: 'à Accra', en: 'live in Accra', stem: 'habit' },
    être: { f: ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'], rest: 'à la maison', en: 'be at home', irr: true },
    avoir: { f: ['ai', 'as', 'a', 'avons', 'avez', 'ont'], rest: 'faim', en: 'be hungry (have hunger)', irr: true },
  };

  MM.register({
    id: 'present-er', day: 1, week: 1,
    vocab: [
      ['habiter', 'to live (somewhere)'], ['travailler', 'to work'], ['parler', 'to speak'], ['être', 'to be'],
      ['avoir', 'to have'], ['avoir faim', 'to be hungry'], ['fatigué', 'tired'],
      ['professeure', 'teacher (woman)', 'f'],
    ],
    title: 'Le présent',
    tagline: 'A French verb changes its ending for each person: je parle, nous parlons, vous parlez.',
    prompt: 'Pick a person and a verb. Watch the magenta verb block change its ending.',
    body: `
<section>
  <p class="rule">Stem + ending. The ending matches the person.</p>
  <p>Most French verbs end in <b>-er</b> in the dictionary, such as <b>parler</b> (to speak). Take off <b>-er</b> and you have the stem, <b>parl-</b>. Then add the ending for the person. The good news: <b>-e, -es, -e</b> and <b>-ent</b> all sound the same, so in speech only <i>nous</i> (-ons) and <i>vous</i> (-ez) sound different. The two most important verbs, <b>être</b> (to be) and <b>avoir</b> (to have), are irregular: learn them by heart first.</p>
</section>
<section>
  <h2>Pattern</h2>
  ${table(['Person', 'Ending', 'parler', 'être', 'avoir'], [
    ['je (I)', '-e', `parl${R('verb', 'e')}`, 'suis', 'ai (j’ai)'],
    ['tu (you, informal)', '-es', `parl${R('verb', 'es')}`, 'es', 'as'],
    ['il / elle / on (he / she / we, informal)', '-e', `parl${R('verb', 'e')}`, 'est', 'a'],
    ['nous (we)', '-ons', `parl${R('verb', 'ons')}`, 'sommes', 'avons'],
    ['vous (you, several or formal)', '-ez', `parl${R('verb', 'ez')}`, 'êtes', 'avez'],
    ['ils / elles (they)', '-ent (silent)', `parl${R('verb', 'ent')}`, 'sont', 'ont'],
  ])}
  <p><b>je</b> shrinks to <b>j’</b> before a vowel or a silent h: <i>j’habite</i>, <i>j’ai</i>. <b>vous</b> is also the polite “you” for one stranger, in shops and offices: <i>Vous parlez anglais${QM}</i> <b>on</b> means “we” in everyday speech and uses the il form: <i>On parle français.</i></p>
</section>
<section>
  <h2>Examples</h2>
  ${ex([
    ['Je m’appelle Kofi et je viens du Ghana.', 'My name is Kofi and I come from Ghana.'],
    [`Tu habites où${QM}`, 'Where do you live?'],
    ['Elle est professeure et elle travaille à Lyon.', 'She is a teacher and works in Lyon.'],
    ['Nous avons faim.', 'We’re hungry.'],
    [`Vous parlez anglais${QM}`, 'Do you speak English?'],
  ])}
</section>
<section>
  <h2>Common mistakes</h2>
  <ul class="mistakes">
    <li><s>Je parler français.</s> → Je <b>parle</b> français. The -er form is only for the dictionary.</li>
    <li><s>Je ai faim.</s> → <b>J’ai</b> faim. je becomes j’ before a vowel.</li>
    <li><s>Je suis 25 ans.</s> → <b>J’ai</b> 25 ans. Age uses avoir: you “have” years.</li>
    <li>French has one present tense: <i>je parle</i> means both “I speak” and “I am speaking”.</li>
  </ul>
</section>
<section>
  <h2>Quiz</h2>
  <div data-quiz></div>
</section>
<section>
  <div class="try">
    <h3>Parler: introduce yourself</h3>
    <p>${A1_TRY} Say four sentences about yourself, out loud:</p>
    <ul>
      <li>Je m’appelle … / Je suis …</li>
      <li>Je viens de … et j’habite à …</li>
      <li>Je parle … et j’apprends le français.</li>
      <li>J’ai … (deux frères / un chat / 30 ans).</li>
    </ul>
  </div>
</section>`,
    quiz: [
      { type: 'pick', q: 'Tu ___ à Accra.', opts: ['habites', 'habite', 'habitez'], a: 0, why: 'tu takes <em>-es</em>. You can’t hear it, but you write it.' },
      { type: 'pick', q: 'Nous ___ fatigués.', opts: ['sommes', 'êtes', 'sont'], a: 0, why: 'être: nous <em>sommes</em>.' },
      { type: 'pick', q: 'Il ___ faim.', opts: ['a', 'as', 'ont'], a: 0, why: 'avoir: il <em>a</em>.' },
      { type: 'pick', q: `Vous ___ français${QM}`, opts: ['parlez', 'parlons', 'parles'], a: 0, why: 'vous takes <em>-ez</em>.' },
      { type: 'order', q: 'Build: “I live in Accra”', tiles: ['J’habite', 'à', 'Accra'], a: 'J’habite à Accra', why: 'je + habite becomes <em>j’habite</em>.' },
    ],
    mount(ctx) {
      chipScene(ctx, {
        state: { p: 'je', v: 'parler' },
        chips: [{ label: 'Person', key: 'p', opts: opts(PERS, PERS_LAB) }, { label: 'Verbe', key: 'v', opts: opts(Object.keys(VB)) }],
        build({ p, v }) {
          const D = VB[v], i = PERS.indexOf(p), form = D.f[i];
          const end = D.irr ? null : form.slice(D.stem.length);
          const s = subjTokens(p, form);
          return {
            tokens: [s.S, ['V', form, 'verb'], ['O', D.rest, 'obj'], ['d', '.', 'punct']],
            keys: ['S', 'V', 'O', 'd'], pop: ['V'], tight: s.tight,
            tag: (D.irr ? `${v}: irregular` : `${D.stem} + ${end}`) + (s.tight.length ? ' · je → j’' : ''),
            en: `${PERS_EN[p]} + ${D.en}`,
            note: (D.irr ? `<b>${v}</b> is irregular: <b class="r-verb">${form}</b> has to be learned as a whole word.`
              : `Stem <b>${D.stem}-</b> plus the <b>${p}</b> ending <b class="r-verb">-${end}</b>${['e', 'es', 'ent'].includes(end) ? ', which is silent' : ''}.`)
              + (s.tight.length ? ' <b>je</b> becomes <b>j’</b> because the verb starts with a vowel sound.' : ''),
          };
        },
      });
    },
  });

  // =====================================================================
  // Week 2 (A1): Gender and articles
  // =====================================================================
  const NOUN = {
    livre: { g: 'm', pl: 'livres', en: 'book', enPl: 'books' },
    maison: { g: 'f', pl: 'maisons', en: 'house', enPl: 'houses' },
    ami: { g: 'm', pl: 'amis', en: 'friend', enPl: 'friends' },
    école: { g: 'f', pl: 'écoles', en: 'school', enPl: 'schools' },
    homme: { g: 'm', pl: 'hommes', en: 'man', enPl: 'men' },
  };
  const ARTS = { def: { m: 'le', f: 'la', v: 'l’', pl: 'les' }, indef: { m: 'un', f: 'une', pl: 'des' } };

  MM.register({
    id: 'articles', day: 2, week: 1,
    vocab: [
      ['café', 'coffee', 'm'], ['gare', 'station', 'f'], ['frère', 'brother', 'm'], ['sœur', 'sister', 'f'],
      ['école', 'school', 'f'], ['ami', 'friend', 'm'], ['homme', 'man', 'm'], ['maison', 'house', 'f'], ['voiture', 'car', 'f'],
      ['livre', 'book', 'm'],
    ],
    title: 'Le, la, un, une',
    tagline: 'Every French noun is masculine or feminine, and the little word in front of it tells you which.',
    prompt: 'Pick a noun, then switch between “the” and “a”, and between one and several.',
    body: `
<section>
  <p class="rule">Learn every noun with its article: not “maison” but “la maison”.</p>
  <p>French has two genders, <b>masculine</b> and <b>feminine</b>. Things have a gender too, and it is mostly arbitrary: <i>le livre</i> (the book) is masculine, <i>la maison</i> (the house) is feminine. The article in front of the noun carries the gender, so learn the two together from day one.</p>
</section>
<section>
  <h2>Pattern</h2>
  ${table(['', 'masculine', 'feminine', 'before a vowel or silent h', 'plural'], [
    ['the (definite)', R('conn', 'le') + ' livre', R('conn', 'la') + ' maison', R('conn', 'l’') + 'ami, ' + R('conn', 'l’') + 'école', R('conn', 'les') + ' livres'],
    ['a / some (indefinite)', R('conn', 'un') + ' livre', R('conn', 'une') + ' maison', R('conn', 'un') + ' ami, ' + R('conn', 'une') + ' école', R('conn', 'des') + ' livres'],
  ])}
  <p>Plural nouns usually add an <b>-s</b> that you can’t hear. You hear the plural in the article instead: <i>le livre</i> sounds like “luh”, <i>les livres</i> like “lay”. Before a vowel, the s of <i>les</i> and <i>des</i> links to the next word: <i>les‿amis</i> sounds like “lay-zami”. This is called <b>liaison</b>.</p>
  <p>Some clues to gender: nouns ending in <b>-tion, -té, -ure</b> are usually feminine (<i>la nation, la liberté</i>); nouns ending in <b>-ment, -age</b> are usually masculine (<i>le moment, le fromage</i>).</p>
</section>
<section>
  <h2>Examples</h2>
  ${ex([
    ['Le café est chaud.', 'The coffee is hot.'],
    ['La gare est loin.', 'The station is far.'],
    ['J’ai un frère et une sœur.', 'I have a brother and a sister.'],
    ['L’école est fermée aujourd’hui.', 'The school is closed today.'],
    ['Les enfants jouent dans le parc.', 'The children are playing in the park.'],
  ])}
</section>
<section>
  <h2>Common mistakes</h2>
  <ul class="mistakes">
    <li><s>le école</s> → <b>l’</b>école. le and la both shrink to l’ before a vowel, so you can’t see the gender. Learn it with <i>une</i>: <i>une école</i>.</li>
    <li><s>J’ai un sœur.</s> → J’ai <b>une</b> sœur. Gender follows the word, not just the person.</li>
    <li><s>Voici livres.</s> → Voici <b>des</b> livres. French almost always needs an article where English has none.</li>
    <li>Talking about a job, French drops the article: <i>Je suis professeur</i> (I am a teacher).</li>
  </ul>
</section>
<section>
  <h2>Quiz</h2>
  <div data-quiz></div>
</section>
<section>
  <div class="try">
    <h3>Parler: your room</h3>
    <p>${A1_TRY} Look around and name five things with their article: <i>une table, la fenêtre, un livre, les chaises, l’ordinateur</i>. Check each gender in a dictionary (look for <i>n.m.</i> or <i>n.f.</i>).</p>
  </div>
</section>`,
    quiz: [
      { type: 'pick', q: '___ maison est grande.', opts: ['La', 'Le', 'L’'], a: 0, why: 'maison is feminine: <em>la</em> maison.' },
      { type: 'pick', q: '___ ami de Kofi est sympa.', opts: ['L’', 'Le', 'La'], a: 0, why: 'ami starts with a vowel, so le becomes <em>l’</em>.' },
      { type: 'pick', q: 'J’ai ___ voiture.', opts: ['une', 'un', 'des'], a: 0, why: 'voiture is feminine: <em>une</em> voiture.' },
      { type: 'pick', q: 'Voici ___ livres.', opts: ['des', 'un', 'une'], a: 0, why: 'Several books, no particular ones: <em>des</em>.' },
      { type: 'order', q: 'Build: “The school is big”', tiles: ['L’école', 'est', 'grande'], a: 'L’école est grande', why: 'école starts with a vowel: <em>l’école</em>.' },
    ],
    mount(ctx) {
      chipScene(ctx, {
        state: { n: 'livre', t: 'def', num: 'sg' },
        chips: [
          { label: 'Nom', key: 'n', opts: opts(Object.keys(NOUN)) },
          { label: 'Article', key: 't', opts: opts(['def', 'indef'], { def: 'the (le/la)', indef: 'a (un/une)' }) },
          { label: 'Number', key: 'num', opts: opts(['sg', 'pl'], { sg: 'one', pl: 'several' }) },
        ],
        build({ n, t, num }) {
          const D = NOUN[n], pl = num === 'pl';
          const elide = t === 'def' && !pl && vowel(n);
          const art = pl ? ARTS[t].pl : elide ? 'l’' : ARTS[t][D.g];
          const noun = pl ? D.pl : n;
          const g = D.g === 'm' ? 'masculine' : 'feminine';
          const enArt = t === 'def' ? 'the' : pl ? 'some' : (/^[aeiou]/.test(D.en) ? 'an' : 'a');
          const enText = pl ? `Here are ${enArt} ${D.enPl}` : `Here is ${enArt} ${D.en}`;
          return {
            tokens: [['X', 'Voici', 'plain'], ['A', art, 'conn'], ['N', noun, 'obj'], ['d', '.', 'punct']],
            keys: ['X', 'A', 'N', 'd'], pop: ['A'], tight: elide ? ['N'] : [],
            tag: pl ? `plural · ${art}` : elide ? `${g} · ${D.g === 'm' ? 'le' : 'la'} → l’` : `${g} · ${art}`,
            en: enText,
            note: pl ? `In the plural the article is <b class="r-conn">${art}</b> for both genders${vowel(n) ? `, and its s links to the vowel: <i>${art}‿${noun}</i>` : ''}. The -s on <i>${noun}</i> is silent.`
              : elide ? `<i>${n}</i> is ${g}, but it starts with a vowel sound, so le/la shrinks to <b class="r-conn">l’</b>. To see the gender, use <i>${D.g === 'm' ? 'un' : 'une'} ${n}</i>.`
                : `<i>${n}</i> is ${g}: <b class="r-conn">${art}</b> ${n}. Learn them together.`,
          };
        },
      });
    },
  });

  // =====================================================================
  // Week 3 (A1): Adjectives: agreement and position
  // =====================================================================
  const ADJ = {
    noir: { m: 'noir', f: 'noire', pre: false, en: 'black' },
    intéressant: { m: 'intéressant', f: 'intéressante', pre: false, en: 'interesting' },
    petit: { m: 'petit', f: 'petite', pre: true, en: 'small' },
    grand: { m: 'grand', f: 'grande', pre: true, en: 'big' },
    beau: { m: 'beau', f: 'belle', pre: true, en: 'beautiful', irr: true },
  };
  const ANOUN = { livre: { g: 'm', en: 'book' }, maison: { g: 'f', en: 'house' }, sac: { g: 'm', en: 'bag' }, voiture: { g: 'f', en: 'car' } };

  MM.register({
    id: 'adjectifs', day: 3, week: 1,
    vocab: [
      ['maison', 'house', 'f'], ['appartement', 'flat', 'm'], ['livre', 'book', 'm'], ['sac', 'bag', 'm'],
      ['voiture', 'car', 'f'], ['petit, petite', 'small'], ['grand, grande', 'big, tall'], ['noir, noire', 'black'],
      ['beau, belle', 'beautiful'], ['intéressant, intéressante', 'interesting'],
    ],
    title: 'Les adjectifs',
    tagline: 'Adjectives match the noun (add -e for feminine) and most go after it: une voiture noire.',
    prompt: 'Pick a noun and an adjective. Watch where the orange adjective lands, and when it grows an -e.',
    body: `
<section>
  <p class="rule">The adjective agrees with its noun, and usually comes after it.</p>
  <p>English puts adjectives first (“a black car”). French usually puts them after: <i>une voiture <b>noire</b></i>. The adjective also takes the noun’s gender and number: add <b>-e</b> for feminine and <b>-s</b> for plural. Often you can hear the feminine: <i>petit</i> ends silently, <i>petite</i> ends with a clear t.</p>
</section>
<section>
  <h2>Pattern</h2>
  ${table(['', 'masculine', 'feminine', 'masc. plural', 'fem. plural'], [
    ['regular', 'noir', `noir${R('verb2', 'e')}`, `noir${R('verb2', 's')}`, `noir${R('verb2', 'es')}`],
    ['already ends in -e', 'rouge', 'rouge', `rouge${R('verb2', 's')}`, `rouge${R('verb2', 's')}`],
    ['irregular', 'beau', R('verb2', 'belle'), R('verb2', 'beaux'), R('verb2', 'belles')],
  ])}
  <p><b>BAGS</b> adjectives go <i>before</i> the noun: <b>B</b>eauty (beau, joli), <b>A</b>ge (jeune, vieux, nouveau), <b>G</b>oodness (bon, mauvais) and <b>S</b>ize (petit, grand). So: <i>un <b>petit</b> sac</i>, but <i>un sac <b>noir</b></i>.</p>
</section>
<section>
  <h2>Examples</h2>
  ${ex([
    ['C’est une maison moderne.', 'It’s a modern house.'],
    ['J’ai un petit appartement.', 'I have a small flat.'],
    ['Ma sœur est grande.', 'My sister is tall.'],
    ['Ce sont des chaussures noires.', 'These are black shoes.'],
    [`Quelle belle journée !`, 'What a beautiful day!'],
  ])}
</section>
<section>
  <h2>Common mistakes</h2>
  <ul class="mistakes">
    <li><s>une voiture noir</s> → une voiture noir<b>e</b>. voiture is feminine, so the adjective is too.</li>
    <li><s>un livre petit</s> → un <b>petit</b> livre. petit is a BAGS adjective: it goes first.</li>
    <li><s>une beau maison</s> → une <b>belle</b> maison. beau, nouveau and vieux have special feminine forms: belle, nouvelle, vieille.</li>
    <li>After <i>être</i> the adjective still agrees: <i>Elle est content<b>e</b>. Ils sont fatigué<b>s</b>.</i></li>
  </ul>
</section>
<section>
  <h2>Quiz</h2>
  <div data-quiz></div>
</section>
<section>
  <div class="try">
    <h3>Parler: describe your things</h3>
    <p>${A1_TRY} Describe three things you own, with one adjective each: <i>J’ai un sac noir. J’ai une petite voiture. Mon téléphone est nouveau.</i></p>
  </div>
</section>`,
    quiz: [
      { type: 'pick', q: 'Une voiture ___.', opts: ['noire', 'noir', 'noirs'], a: 0, why: 'voiture is feminine singular: noir + <em>e</em>.' },
      { type: 'pick', q: 'J’ai un ___ appartement.', opts: ['petit', 'petite', 'petits'], a: 0, why: 'appartement is masculine, and petit (size) goes before the noun.' },
      { type: 'pick', q: 'C’est une ___ maison.', opts: ['belle', 'beau', 'beaux'], a: 0, why: 'The feminine of beau is <em>belle</em>.' },
      { type: 'pick', q: 'Ce sont des livres ___.', opts: ['intéressants', 'intéressant', 'intéressantes'], a: 0, why: 'livres is masculine plural: add <em>-s</em>.' },
      { type: 'order', q: 'Build: “a big house”', tiles: ['une', 'grande', 'maison'], a: 'une grande maison', why: 'grand is a size adjective (BAGS), so it goes first, and takes -e for maison.' },
    ],
    mount(ctx) {
      chipScene(ctx, {
        state: { n: 'voiture', a: 'noir' },
        chips: [{ label: 'Nom', key: 'n', opts: opts(Object.keys(ANOUN)) }, { label: 'Adjectif', key: 'a', opts: opts(Object.keys(ADJ)) }],
        build({ n, a }) {
          const N = ANOUN[n], A = ADJ[a], form = A[N.g], art = N.g === 'm' ? 'un' : 'une';
          const keys = A.pre ? ['C', 'A', 'J', 'N', 'd'] : ['C', 'A', 'N', 'J', 'd'];
          const fem = N.g === 'f';
          return {
            tokens: [['C', 'C’est', 'plain'], ['A', art, 'conn'], ['N', n, 'obj'], ['J', form, 'verb2'], ['d', '.', 'punct']],
            keys, pop: ['J'],
            tag: `${A.pre ? 'BAGS: before' : 'after the noun'} · ${fem ? (A.irr ? 'irregular feminine' : '+ e') : 'masculine'}`,
            en: `It’s ${/^[aeiou]/.test(A.en) ? 'an' : 'a'} ${A.en} ${N.en}`,
            note: `<i>${n}</i> is ${fem ? 'feminine' : 'masculine'}, so the adjective is <b class="r-verb2">${form}</b>${fem && !A.irr ? ` (${A.m} + e)` : ''}${A.irr && fem ? ` (beau has a special feminine)` : ''}. `
              + (A.pre ? `<i>${a}</i> is a BAGS adjective, so it goes <b>before</b> the noun.` : `Most adjectives, like <i>${a}</i>, go <b>after</b> the noun.`),
          };
        },
      });
    },
  });

  // =====================================================================
  // Week 4 (A1): Negation: ne … pas, ne … jamais, ne … plus
  // =====================================================================
  const NPERS = ['je', 'tu', 'nous', 'ils'];
  const NV = {
    parler: { f: { je: 'parle', tu: 'parles', nous: 'parlons', ils: 'parlent' }, rest: 'anglais', en: 'speak English' },
    écouter: { f: { je: 'écoute', tu: 'écoutes', nous: 'écoutons', ils: 'écoutent' }, rest: 'la radio', en: 'listen to the radio' },
    fumer: { f: { je: 'fume', tu: 'fumes', nous: 'fumons', ils: 'fument' }, rest: '', en: 'smoke' },
    travailler: { f: { je: 'travaille', tu: 'travailles', nous: 'travaillons', ils: 'travaillent' }, rest: 'le dimanche', en: 'work on Sundays' },
  };
  const NEG = { aff: null, pas: { w: 'pas', en: 'not' }, jamais: { w: 'jamais', en: 'never' }, plus: { w: 'plus', en: 'no longer' } };

  MM.register({
    id: 'negation', day: 4, week: 1,
    vocab: [
      ['ne … pas', 'not'], ['ne … plus', 'no longer'], ['ne … jamais', 'never'], ['parler', 'to speak'],
      ['écouter', 'to listen (to)'], ['aimer', 'to like, to love'], ['fumer', 'to smoke'], ['radio', 'radio', 'f'],
      ['thé', 'tea', 'm'], ['dimanche', 'Sunday', 'm'],
    ],
    title: 'Ne … pas',
    tagline: 'French negation is two words that clamp around the verb: je ne parle pas.',
    prompt: 'Pick a person, a verb and a kind of “not”. Watch the two green blocks clamp around the verb.',
    body: `
<section>
  <p class="rule">ne before the verb, pas (or jamais, plus) after it.</p>
  <p>English puts one word in (“I do <i>not</i> speak”). French wraps the verb in two: <b class="r-neg">ne</b> + verb + <b class="r-neg">pas</b>. Swap <i>pas</i> for another word to change the meaning: <b>jamais</b> (never), <b>plus</b> (no longer, not any more). Before a vowel, <i>ne</i> shrinks to <b>n’</b>: <i>je n’aime pas</i>.</p>
</section>
<section>
  <h2>Pattern</h2>
  ${table(['', 'French', 'English'], [
    ['ne … pas', `Je ${R('neg', 'ne')} parle ${R('neg', 'pas')} anglais.`, 'I don’t speak English.'],
    ['ne … jamais', `Il ${R('neg', 'ne')} travaille ${R('neg', 'jamais')} le dimanche.`, 'He never works on Sundays.'],
    ['ne … plus', `Nous ${R('neg', 'n’')}habitons ${R('neg', 'plus')} ici.`, 'We don’t live here any more.'],
  ])}
  <p>In everyday speech the <i>ne</i> often disappears: <i>Je parle pas anglais.</i> Expect to hear it dropped, but write it.</p>
</section>
<section>
  <h2>Examples</h2>
  ${ex([
    ['Je ne parle pas allemand.', 'I don’t speak German.'],
    ['Il n’habite plus à Paris.', 'He doesn’t live in Paris any more.'],
    ['Nous ne regardons jamais la télé.', 'We never watch TV.'],
    [`Tu n’aimes pas le thé${QM}`, 'You don’t like tea?'],
    ['Ce n’est pas grave.', 'It’s not a big deal.'],
  ])}
</section>
<section>
  <h2>Common mistakes</h2>
  <ul class="mistakes">
    <li><s>Je pas parle.</s> → Je <b>ne</b> parle <b>pas</b>. Both words, around the verb.</li>
    <li><s>Je ne aime pas.</s> → Je <b>n’</b>aime pas. ne shrinks before a vowel.</li>
    <li><s>Je ne parle pas jamais.</s> → Je ne parle <b>jamais</b>. jamais replaces pas.</li>
    <li>After a negation, <i>un, une, du, de la</i> usually become <b>de</b>: <i>Je n’ai pas <b>de</b> voiture.</i> You meet this in <a href="#partitif">Wk 7</a>.</li>
  </ul>
</section>
<section>
  <h2>Quiz</h2>
  <div data-quiz></div>
</section>
<section>
  <div class="try">
    <h3>Parler: what you don’t do</h3>
    <p>${A1_TRY} Say three true sentences: one with <i>ne … pas</i>, one with <i>ne … jamais</i>, one with <i>ne … plus</i>. For example: <i>Je ne parle pas chinois. Je ne mange jamais de viande. Je n’habite plus chez mes parents.</i></p>
  </div>
</section>`,
    quiz: [
      { type: 'pick', q: 'Je ___ parle pas espagnol.', opts: ['ne', 'pas', 'n’'], a: 0, why: 'ne goes before the verb; parle starts with a consonant, so no shrinking.' },
      { type: 'pick', q: 'Elle ___ aime pas le café.', opts: ['n’', 'ne', 'pas'], a: 0, why: 'aime starts with a vowel, so ne becomes <em>n’</em>.' },
      { type: 'pick', q: 'Il ne travaille ___ le dimanche. (never)', opts: ['jamais', 'pas jamais', 'plus'], a: 0, why: '<em>jamais</em> replaces pas.' },
      { type: 'pick', q: 'Nous n’habitons ___ ici. (no longer)', opts: ['plus', 'jamais', 'pas plus'], a: 0, why: 'ne … <em>plus</em> = no longer.' },
      { type: 'order', q: 'Build: “I don’t understand”', tiles: ['Je', 'ne', 'comprends', 'pas'], a: 'Je ne comprends pas', why: 'ne and pas clamp around the verb.' },
    ],
    mount(ctx) {
      chipScene(ctx, {
        state: { p: 'je', v: 'écouter', n: 'pas' },
        chips: [
          { label: 'Person', key: 'p', opts: opts(NPERS) },
          { label: 'Verbe', key: 'v', opts: opts(Object.keys(NV)) },
          { label: 'Not', key: 'n', opts: opts(Object.keys(NEG), { aff: 'yes (no negation)', pas: 'ne … pas', jamais: 'ne … jamais', plus: 'ne … plus' }) },
        ],
        build({ p, v, n }) {
          const D = NV[v], form = D.f[p], G = NEG[n];
          const pe = PERS_EN[p];
          if (!G) {
            const s = subjTokens(p, form);
            return {
              tokens: [s.S, ['V', form, 'verb']].concat(D.rest ? [['O', D.rest, 'obj']] : [], [['d', '.', 'punct']]),
              keys: ['S', 'V'].concat(D.rest ? ['O'] : [], ['d']), pop: ['V'], tight: s.tight,
              tag: 'affirmative', en: `${pe} + ${D.en}`,
              note: 'No negation yet. Pick a “not” and watch two blocks clamp around the verb.',
            };
          }
          const el = vowel(form);
          return {
            tokens: [['S', p, 'subj'], ['N', el ? 'n’' : 'ne', 'neg'], ['V', form, 'verb'], ['P', G.w, 'neg']].concat(D.rest ? [['O', D.rest, 'obj']] : [], [['d', '.', 'punct']]),
            keys: ['S', 'N', 'V', 'P'].concat(D.rest ? ['O'] : [], ['d']), pop: ['N', 'P'], tight: el ? ['V'] : [],
            tag: `ne … ${G.w}` + (el ? ' · ne → n’' : ''),
            en: `${pe} + ${G.en} + ${D.en}`,
            note: `<b class="r-neg">${el ? 'n’' : 'ne'}</b> before the verb, <b class="r-neg">${G.w}</b> after it.` + (el ? ' <i>ne</i> shrinks to <i>n’</i> because the verb starts with a vowel.' : '') + (p === 'je' && el ? ' Notice that <i>je</i> stays whole now: it sits before <i>n’</i>, not before the vowel.' : ''),
          };
        },
      });
    },
  });

  // =====================================================================
  // Week 5 (A1): Questions: intonation, est-ce que, inversion
  // =====================================================================
  const QS = {
    tu: { S: 'tu', V: 'parles', O: 'français', en: 'Do you speak French?' },
    vous: { S: 'vous', V: 'habitez', O: 'ici', en: 'Do you live here?' },
    il: { S: 'il', V: 'aime', O: 'le café', en: 'Does he like coffee?' },
    elle: { S: 'elle', V: 'a', O: 'un chat', en: 'Does she have a cat?' },
  };
  const QS_LAB = { tu: 'tu parles français', vous: 'vous habitez ici', il: 'il aime le café', elle: 'elle a un chat' };
  const QF_LAB = { into: 'rising voice', esq: 'est-ce que', inv: 'inversion' };

  MM.register({
    id: 'questions', day: 5, week: 1,
    vocab: [
      ['est-ce que', 'question opener'], ['où', 'where'], ['comment', 'how'], ['qu’est-ce que', 'what'],
      ['ici', 'here'], ['ce soir', 'tonight'], ['chambre', 'room', 'f'], ['gare', 'station', 'f'],
      ['chat', 'cat', 'm'],
    ],
    title: 'Poser une question',
    tagline: 'Three ways to ask a yes/no question: raise your voice, add est-ce que, or swap verb and subject.',
    prompt: 'Pick a sentence and a question style. Watch the blocks move, from relaxed to formal.',
    body: `
<section>
  <p class="rule">Same question, three registers: spoken, neutral, formal.</p>
  <p>French gives you three ways to turn a sentence into a yes/no question:</p>
  <ul>
    <li><b>Rising voice</b> (everyday speech): keep the sentence, raise your voice at the end. <i>Tu parles français${QM}</i></li>
    <li><b>Est-ce que</b> (neutral, always safe): put it in front. <i>Est-ce que tu parles français${QM}</i> Before a vowel it becomes <i>est-ce qu’</i>.</li>
    <li><b>Inversion</b> (formal and written): swap verb and subject and join them with a hyphen. <i>Parles-tu français${QM}</i> If the verb ends in a vowel and the subject is il/elle, add <b>-t-</b> to separate the vowels: <i>Aime-t-il le café${QM}</i></li>
  </ul>
</section>
<section>
  <h2>Question words</h2>
  ${table(['French', 'English', 'Example'], [
    ['où', 'where', `Où est la gare${QM}`],
    ['quand', 'when', `Quand est-ce que tu arrives${QM}`],
    ['comment', 'how', `Comment tu t’appelles${QM}`],
    ['pourquoi', 'why', `Pourquoi tu ris${QM}`],
    ['qu’est-ce que', 'what', `Qu’est-ce que tu fais${QM}`],
    ['combien', 'how much / many', `C’est combien${QM}`],
  ])}
</section>
<section>
  <h2>Examples</h2>
  ${ex([
    [`Tu viens ce soir${QM}`, 'Are you coming tonight?'],
    [`Est-ce que vous avez une chambre libre${QM}`, 'Do you have a free room?'],
    [`Où est la gare${QM}`, 'Where is the station?'],
    [`Qu’est-ce que tu fais${QM}`, 'What are you doing?'],
    [`Comment allez-vous${QM}`, 'How are you? (formal)'],
  ])}
</section>
<section>
  <h2>Common mistakes</h2>
  <ul class="mistakes">
    <li><s>Est-ce que il vient${QM}</s> → Est-ce <b>qu’</b>il vient${QM} que shrinks before a vowel.</li>
    <li><s>Aime il le café${QM}</s> → Aime<b>-t-</b>il le café${QM} A hyphen, and -t- between the two vowels.</li>
    <li><s>Parles tu français${QM}</s> → Parles<b>-</b>tu français${QM} Inversion always needs the hyphen.</li>
    <li>Don’t invert with <i>je</i> in normal speech: say <i>Est-ce que je peux${QM}</i></li>
  </ul>
</section>
<section>
  <h2>Quiz</h2>
  <div data-quiz></div>
</section>
<section>
  <div class="try">
    <h3>Parler: interview a friend</h3>
    <p>${A1_TRY} Ask a partner five questions, each in two styles: <i>Tu habites où${QM} / Où est-ce que tu habites${QM}</i> Then answer theirs.</p>
  </div>
</section>`,
    quiz: [
      { type: 'pick', q: `___ tu parles anglais${QM}`, opts: ['Est-ce que', 'Est-ce qu’', 'Est que'], a: 0, why: 'tu starts with a consonant, so <em>est-ce que</em> stays whole.' },
      { type: 'pick', q: `Est-ce ___ il vient${QM}`, opts: ['qu’', 'que', 'qui'], a: 0, why: 'il starts with a vowel: <em>est-ce qu’il</em>.' },
      { type: 'pick', q: `Aime-___ le chocolat${QM}`, opts: ['t-il', 'il', 't il'], a: 0, why: 'aime ends in a vowel and il starts with one: add <em>-t-</em>.' },
      { type: 'pick', q: 'Which question is the most formal?', opts: [`Habitez-vous ici${QM}`, `Vous habitez ici${QM}`, `Est-ce que vous habitez ici${QM}`], a: 0, why: 'Inversion is the formal, written style.' },
      { type: 'order', q: 'Build: “Do you speak French?” (with est-ce que)', tiles: ['Est-ce', 'que', 'tu', 'parles', 'français'], a: 'Est-ce que tu parles français', why: 'Put est-ce que in front of the normal sentence.' },
    ],
    mount(ctx) {
      chipScene(ctx, {
        state: { s: 'il', f: 'esq' },
        chips: [{ label: 'Phrase', key: 's', opts: opts(Object.keys(QS), QS_LAB) }, { label: 'Style', key: 'f', opts: opts(Object.keys(QF_LAB), QF_LAB) }],
        build({ s, f }) {
          const D = QS[s];
          const q = ['q', QM, 'punct'];
          if (f === 'into') return {
            tokens: [['S', D.S, 'subj'], ['V', D.V, 'verb'], ['O', D.O, 'obj'], q], keys: ['S', 'V', 'O', 'q'], pop: ['q'],
            tag: 'spoken: rising voice', en: D.en,
            note: 'The words stay in statement order. Only your voice rises at the end. This is how most people ask in conversation.',
          };
          if (f === 'esq') {
            const el = vowel(D.S);
            return {
              tokens: [['E', el ? 'Est-ce qu’' : 'Est-ce que', 'conn'], ['S', D.S, 'subj'], ['V', D.V, 'verb'], ['O', D.O, 'obj'], q],
              keys: ['E', 'S', 'V', 'O', 'q'], pop: ['E'], tight: el ? ['S'] : [],
              tag: 'neutral: est-ce que' + (el ? ' · que → qu’' : ''), en: D.en,
              note: '<b class="r-conn">Est-ce que</b> turns any statement into a question, and the rest stays the same.' + (el ? ` Before the vowel of <i>${D.S}</i> it shrinks to <b>qu’</b>.` : ''),
            };
          }
          const t = /[ae]$/.test(D.V) && /^(il|elle)$/.test(D.S);
          return {
            tokens: [['V', D.V, 'verb'], ['S', (t ? '-t-' : '-') + D.S, 'subj'], ['O', D.O, 'obj'], q],
            keys: ['V', 'S', 'O', 'q'], pop: ['V', 'S'], tight: ['S'],
            tag: 'formal: inversion' + (t ? ' + -t-' : ''), en: D.en,
            note: 'Verb and subject swap places and join with a hyphen.' + (t ? ` <b>-t-</b> keeps the two vowels apart: <i>${D.V}-t-${D.S}</i>.` : ''),
          };
        },
      });
    },
  });

  // =====================================================================
  // Week 6 (A1): aller, faire, venir + le futur proche
  // =====================================================================
  const ALLER = ['vais', 'vas', 'va', 'allons', 'allez', 'vont'];
  const FV = {
    manger: { f: ['mange', 'manges', 'mange', 'mangeons', 'mangez', 'mangent'], rest: 'au restaurant', en: 'eat at a restaurant' },
    voyager: { f: ['voyage', 'voyages', 'voyage', 'voyageons', 'voyagez', 'voyagent'], rest: 'en France', en: 'travel to France' },
    faire: { f: ['fais', 'fais', 'fait', 'faisons', 'faites', 'font'], rest: 'les courses', en: 'do the shopping', irr: true },
    venir: { f: ['viens', 'viens', 'vient', 'venons', 'venez', 'viennent'], rest: 'à la fête', en: 'come to the party', irr: true },
  };

  MM.register({
    id: 'aller-futur', day: 6, week: 1,
    vocab: [
      ['aller', 'to go'], ['faire', 'to do, to make'], ['faire les courses', 'to do the shopping'],
      ['venir de', 'to come from'], ['manger', 'to eat'], ['voyager', 'to travel'], ['marché', 'market', 'm'],
      ['restaurant', 'restaurant', 'm'], ['fête', 'party', 'f'],
    ],
    title: 'Aller + infinitif',
    tagline: 'To talk about the future, use aller plus an infinitive: je vais manger (I’m going to eat).',
    prompt: 'Pick a person and a plan, then switch from “now” to “soon”. Watch aller arrive and the verb change into its infinitive.',
    body: `
<section>
  <p class="rule">aller (conjugated) + infinitive = the near future.</p>
  <p>The <b>futur proche</b> works just like English “going to”: conjugate <b>aller</b> (to go) and add the verb in its dictionary form. <i>Je mange</i> (I eat) becomes <i>je <b>vais</b> <b class="r-verb2">manger</b></i> (I’m going to eat). It is the easiest way to talk about plans, and French speakers use it all the time. You also need three irregular verbs: <b>aller</b>, <b>faire</b> (to do, make) and <b>venir</b> (to come).</p>
</section>
<section>
  <h2>Pattern</h2>
  ${table(['Person', 'aller', 'faire', 'venir'], [
    ['je', 'vais', 'fais', 'viens'],
    ['tu', 'vas', 'fais', 'viens'],
    ['il / elle / on', 'va', 'fait', 'vient'],
    ['nous', 'allons', 'faisons', 'venons'],
    ['vous', 'allez', 'faites', 'venez'],
    ['ils / elles', 'vont', 'font', 'viennent'],
  ])}
  <p>To say “not going to”, wrap <i>aller</i>: <i>Je <b class="r-neg">ne</b> vais <b class="r-neg">pas</b> manger.</i></p>
</section>
<section>
  <h2>Examples</h2>
  ${ex([
    ['Je vais au marché.', 'I’m going to the market.'],
    [`On va manger ensemble ce soir${QM}`, 'Shall we eat together tonight?'],
    ['Ils vont voyager en juillet.', 'They’re going to travel in July.'],
    [`Qu’est-ce que tu fais ce week-end${QM}`, 'What are you doing this weekend?'],
    ['Elle vient de Dakar.', 'She comes from Dakar.'],
  ])}
</section>
<section>
  <h2>Common mistakes</h2>
  <ul class="mistakes">
    <li><s>Je vais mange.</s> → Je vais <b>manger</b>. The second verb stays in the infinitive.</li>
    <li><s>Je vais à manger.</s> → Je vais manger. No <i>à</i> between aller and the infinitive.</li>
    <li><s>Vous faisez</s> → vous <b>faites</b>. One of only three vous-forms without -ez (with êtes and dites).</li>
    <li><s>Je ne vais manger pas.</s> → Je <b>ne</b> vais <b>pas</b> manger. ne … pas wraps aller.</li>
  </ul>
</section>
<section>
  <h2>Quiz</h2>
  <div data-quiz></div>
</section>
<section>
  <div class="try">
    <h3>Parler: your weekend</h3>
    <p>${A1_TRY} Say four plans for this weekend with <i>aller</i> + infinitive: <i>Samedi, je vais faire les courses. Dimanche, je vais appeler ma mère …</i></p>
  </div>
</section>`,
    quiz: [
      { type: 'pick', q: 'Nous ___ voyager en août.', opts: ['allons', 'allez', 'vont'], a: 0, why: 'aller: nous <em>allons</em>.' },
      { type: 'pick', q: `Tu vas ___ au cinéma${QM}`, opts: ['aller', 'vas', 'allé'], a: 0, why: 'After aller, the second verb is an infinitive: <em>aller</em>.' },
      { type: 'pick', q: `Vous ___ la cuisine${QM}`, opts: ['faites', 'faisez', 'fait'], a: 0, why: 'faire: vous <em>faites</em>.' },
      { type: 'pick', q: 'Ils ___ de Lomé.', opts: ['viennent', 'venont', 'vient'], a: 0, why: 'venir: ils <em>viennent</em>.' },
      { type: 'order', q: 'Build: “I’m going to eat”', tiles: ['Je', 'vais', 'manger'], a: 'Je vais manger', why: 'aller (vais) + infinitive (manger).' },
    ],
    mount(ctx) {
      chipScene(ctx, {
        state: { p: 'je', v: 'manger', t: 'fut' },
        chips: [
          { label: 'Person', key: 'p', opts: opts(PERS, PERS_LAB) },
          { label: 'Plan', key: 'v', opts: opts(Object.keys(FV)) },
          { label: 'When', key: 't', opts: opts(['now', 'fut'], { now: 'now (present)', fut: 'soon (futur proche)' }) },
        ],
        build({ p, v, t }) {
          const D = FV[v], i = PERS.indexOf(p), pe = PERS_EN[p];
          if (t === 'now') return {
            tokens: [['S', p, 'subj'], ['V', D.f[i], 'verb'], ['O', D.rest, 'obj'], ['d', '.', 'punct']],
            keys: ['S', 'V', 'O', 'd'], pop: ['V'],
            tag: `present${D.irr ? ` · ${v} is irregular` : ''}`, en: `${pe} + ${D.en}`,
            note: `<b class="r-verb">${D.f[i]}</b> is the present tense. Switch to “soon” to make it a plan.`,
          };
          return {
            tokens: [['S', p, 'subj'], ['A', ALLER[i], 'verb'], ['V', v, 'verb2'], ['O', D.rest, 'obj'], ['d', '.', 'punct']],
            keys: ['S', 'A', 'V', 'O', 'd'], pop: ['A', 'V'],
            tag: `aller (${ALLER[i]}) + infinitive`, en: `${pe} + going to ${D.en}`,
            note: `<b class="r-verb">${ALLER[i]}</b> is aller for <i>${p}</i>; <b class="r-verb2">${v}</b> stays in the infinitive.`,
          };
        },
      });
    },
  });

  // =====================================================================
  // Week 7 (A1): au/du and the partitive (du, de la, des, pas de)
  // =====================================================================
  const PLACE = { marché: { a: 'le', en: 'the market' }, plage: { a: 'la', en: 'the beach' }, hôtel: { a: 'l’', en: 'the hotel' }, magasins: { a: 'les', en: 'the shops' } };
  const FOOD = { pain: { a: 'le', en: 'bread' }, soupe: { a: 'la', en: 'soup' }, eau: { a: 'l’', en: 'water' }, fruits: { a: 'les', en: 'fruit' } };
  const A_ = { le: 'au', la: 'à la', 'l’': 'à l’', les: 'aux' };
  const DE = { le: 'du', la: 'de la', 'l’': 'de l’', les: 'des' };
  const FRAME = {
    aller: { v: 'vais', en: 'I’m going to', mode: 'à' },
    venir: { v: 'viens', en: 'I’m coming from', mode: 'de' },
    prendre: { v: 'prends', en: 'I’m having some', mode: 'part' },
    neprendre: { v: 'prends', en: 'I’m not having any', mode: 'neg' },
  };
  const FRAME_LAB = { aller: 'je vais (à)', venir: 'je viens (de)', prendre: 'je prends (some)', neprendre: 'je ne prends pas' };

  MM.register({
    id: 'partitif', day: 7, week: 1,
    vocab: [
      ['prendre', 'to take, to have (food, drink)'], ['marché', 'market', 'm'], ['travail', 'work', 'm'],
      ['thé', 'tea', 'm'], ['eau', 'water', 'f'], ['pain', 'bread', 'm'], ['soupe', 'soup', 'f'],
      ['viande', 'meat', 'f'], ['plage', 'beach', 'f'],
    ],
    title: 'Au, du, de la',
    tagline: 'à and de melt into le and les (au, aux, du, des), and “some” is du, de la or des.',
    prompt: 'Pick a phrase. Places go with aller and venir, food with prendre. Watch the copper block merge.',
    body: `
<section>
  <p class="rule">à + le = au, à + les = aux; de + le = du, de + les = des.</p>
  <p>Two small prepositions do a lot of work: <b>à</b> (to, at) and <b>de</b> (from, of). When they meet <i>le</i> or <i>les</i>, they melt together into one word. With <i>la</i> and <i>l’</i>, nothing changes.</p>
</section>
<section>
  <h2>Pattern</h2>
  ${table(['', '+ le', '+ la', '+ l’', '+ les'], [
    ['à (to, at)', R('conn', 'au') + ' marché', R('conn', 'à la') + ' plage', R('conn', 'à l’') + 'hôtel', R('conn', 'aux') + ' magasins'],
    ['de (from, of)', R('conn', 'du') + ' marché', R('conn', 'de la') + ' plage', R('conn', 'de l’') + 'hôtel', R('conn', 'des') + ' magasins'],
    ['some (partitive)', R('conn', 'du') + ' pain', R('conn', 'de la') + ' soupe', R('conn', 'de l’') + 'eau', R('conn', 'des') + ' fruits'],
    ['not any', R('conn', 'pas de') + ' pain', R('conn', 'pas de') + ' soupe', R('conn', 'pas d’') + 'eau', R('conn', 'pas de') + ' fruits'],
  ])}
  <p>The <b>partitive</b> (du, de la, de l’, des) means “some” for things you don’t count, like bread or water. English often leaves it out (“I’m having bread”); French never does. After a negation, it becomes plain <b>de</b> (or <b>d’</b>): <i>Je ne prends pas <b>de</b> pain.</i></p>
</section>
<section>
  <h2>Examples</h2>
  ${ex([
    ['On va au cinéma ce soir.', 'We’re going to the cinema tonight.'],
    ['Je rentre du travail à six heures.', 'I get home from work at six.'],
    [`Tu veux du café ou du thé${QM}`, 'Do you want coffee or tea?'],
    ['Il y a des fruits sur la table.', 'There is some fruit on the table.'],
    ['Désolé, il n’y a plus de pain.', 'Sorry, there’s no more bread.'],
  ])}
</section>
<section>
  <h2>Common mistakes</h2>
  <ul class="mistakes">
    <li><s>Je vais à le marché.</s> → Je vais <b>au</b> marché. à + le always merges.</li>
    <li><s>Je rentre de le travail.</s> → Je rentre <b>du</b> travail.</li>
    <li><s>Je ne mange pas du pain.</s> → Je ne mange pas <b>de</b> pain. After a negation, “some” becomes de.</li>
    <li>For likes and dislikes, use le/la/les: <i>J’aime <b>le</b> pain</i> (bread in general), but <i>Je mange <b>du</b> pain</i> (some bread).</li>
  </ul>
</section>
<section>
  <h2>Quiz</h2>
  <div data-quiz></div>
</section>
<section>
  <div class="try">
    <h3>Parler: your breakfast</h3>
    <p>${A1_TRY} Say what you have for breakfast and what you don’t: <i>Le matin, je prends du pain et du café. Je ne prends pas de lait.</i> Then say where you go after: <i>Après, je vais au travail.</i></p>
  </div>
</section>`,
    quiz: [
      { type: 'pick', q: 'Je vais ___ marché.', opts: ['au', 'à le', 'à la'], a: 0, why: 'marché is masculine: à + le = <em>au</em>.' },
      { type: 'pick', q: 'Elle vient ___ États-Unis.', opts: ['des', 'de les', 'du'], a: 0, why: 'les États-Unis is plural: de + les = <em>des</em>.' },
      { type: 'pick', q: `Tu veux ___ eau${QM}`, opts: ['de l’', 'du', 'de la'], a: 0, why: 'eau starts with a vowel: <em>de l’</em>eau.' },
      { type: 'pick', q: 'Je ne mange pas ___ viande.', opts: ['de', 'de la', 'du'], a: 0, why: 'After a negation, “some” becomes <em>de</em>.' },
      { type: 'order', q: 'Build: “I’m going to the beach”', tiles: ['Je', 'vais', 'à', 'la', 'plage'], a: 'Je vais à la plage', why: 'à + la doesn’t merge: <em>à la</em> plage.' },
    ],
    mount(ctx) {
      chipScene(ctx, {
        state: { f: 'aller', pl: 'marché', fd: 'pain' },
        chips: [
          { label: 'Phrase', key: 'f', opts: opts(Object.keys(FRAME), FRAME_LAB) },
          { label: 'Place (aller, venir)', key: 'pl', opts: opts(Object.keys(PLACE)) },
          { label: 'Food (prendre)', key: 'fd', opts: opts(Object.keys(FOOD)) },
        ],
        build({ f, pl, fd }) {
          const F = FRAME[f], placeMode = F.mode === 'à' || F.mode === 'de';
          const noun = placeMode ? pl : fd, D = placeMode ? PLACE[pl] : FOOD[fd];
          let form, tag, note;
          if (F.mode === 'neg') {
            form = vowel(noun) ? 'd’' : 'de';
            tag = `pas + ${D.a} ${noun} → pas ${form}`;
            note = `After <i>ne … pas</i>, “some” becomes <b class="r-conn">${form}</b>, whatever the gender.`;
          } else {
            const T = F.mode === 'à' ? A_ : DE, prep = F.mode === 'à' ? 'à' : 'de';
            form = T[D.a];
            const merged = D.a === 'le' || D.a === 'les';
            tag = `${prep} + ${D.a} → ${form}`;
            note = (F.mode === 'part' ? 'The partitive means “some”. ' : '') + (merged ? `<b>${prep}</b> and <b>${D.a}</b> melt into one word: <b class="r-conn">${form}</b>.` : `With <i>${D.a}</i> nothing merges: <b class="r-conn">${form}</b>.`);
          }
          const glue = /’$/.test(form);
          const neg = F.mode === 'neg';
          const tokens = [['S', 'je', 'subj']].concat(neg ? [['N', 'ne', 'neg']] : [], [['V', F.v, 'verb']], neg ? [['P', 'pas', 'neg']] : [], [['A', form, 'conn'], ['O', noun, 'obj'], ['d', '.', 'punct']]);
          return {
            tokens, keys: tokens.map(t => t[0]), pop: ['A'], tight: glue ? ['O'] : [],
            tag, en: `${F.en} ${D.en}`,
            note: note + (placeMode ? ' <span class="muted">(The food chip is used with prendre.)</span>' : ' <span class="muted">(The place chip is used with aller and venir.)</span>'),
          };
        },
      });
    },
  });

  // =====================================================================
  // Week 8 (A1): Possessives: mon, ma, mes …
  // =====================================================================
  const OWN = {
    je: { m: 'mon', f: 'ma', pl: 'mes', en: 'my' },
    tu: { m: 'ton', f: 'ta', pl: 'tes', en: 'your' },
    il: { m: 'son', f: 'sa', pl: 'ses', en: 'his / her' },
    nous: { m: 'notre', f: 'notre', pl: 'nos', en: 'our' },
    vous: { m: 'votre', f: 'votre', pl: 'vos', en: 'your' },
    ils: { m: 'leur', f: 'leur', pl: 'leurs', en: 'their' },
  };
  const OWN_LAB = { je: 'je (my)', tu: 'tu (your)', il: 'il/elle (his/her)', nous: 'nous (our)', vous: 'vous (your)', ils: 'ils/elles (their)' };
  const PN = { frère: { g: 'm', en: 'brother' }, sœur: { g: 'f', en: 'sister' }, amie: { g: 'f', en: 'friend (female)' }, parents: { g: 'pl', en: 'parents' } };

  MM.register({
    id: 'possessifs', day: 8, week: 1,
    vocab: [
      ['mère', 'mother', 'f'], ['frère', 'brother', 'm'], ['sœur', 'sister', 'f'], ['amie', 'friend (woman)', 'f'],
      ['chien', 'dog', 'm'], ['clé', 'key', 'f'], ['passeport', 'passport', 'm'], ['parents', 'parents', 'pl'],
    ],
    title: 'Mon, ma, mes',
    tagline: 'The possessive matches the thing owned, not the owner: sa sœur can mean his sister or her sister.',
    prompt: 'Pick an owner and a family member. Watch the copper possessive follow the noun’s gender.',
    body: `
<section>
  <p class="rule">Choose by owner, then match the noun’s gender and number.</p>
  <p>First pick the owner (my, your, his …). Then choose the form that matches the <b>noun</b>: masculine, feminine or plural. That is why <i>sa mère</i> means both “his mother” and “her mother”: <i>sa</i> is feminine because <i>mère</i> is, not because of who owns her. One exception to remember: before a feminine noun that starts with a vowel, use <b>mon, ton, son</b>: <i>mon amie</i>, never <s>ma amie</s>.</p>
</section>
<section>
  <h2>Pattern</h2>
  ${table(['Owner', 'masculine', 'feminine', 'plural'], [
    ['je (my)', R('conn', 'mon') + ' frère', R('conn', 'ma') + ' sœur', R('conn', 'mes') + ' parents'],
    ['tu (your)', R('conn', 'ton') + ' frère', R('conn', 'ta') + ' sœur', R('conn', 'tes') + ' parents'],
    ['il / elle (his, her)', R('conn', 'son') + ' frère', R('conn', 'sa') + ' sœur', R('conn', 'ses') + ' parents'],
    ['nous (our)', R('conn', 'notre') + ' frère', R('conn', 'notre') + ' sœur', R('conn', 'nos') + ' parents'],
    ['vous (your)', R('conn', 'votre') + ' frère', R('conn', 'votre') + ' sœur', R('conn', 'vos') + ' parents'],
    ['ils / elles (their)', R('conn', 'leur') + ' frère', R('conn', 'leur') + ' sœur', R('conn', 'leurs') + ' parents'],
  ])}
</section>
<section>
  <h2>Examples</h2>
  ${ex([
    ['Mon frère habite à Kumasi.', 'My brother lives in Kumasi.'],
    ['Ta mère est très gentille.', 'Your mother is very kind.'],
    ['Paul cherche ses clés.', 'Paul is looking for his keys.'],
    ['Nos enfants vont à l’école ici.', 'Our children go to school here.'],
    [`Où est votre passeport, monsieur${QM}`, 'Where is your passport, sir?'],
  ])}
</section>
<section>
  <h2>Common mistakes</h2>
  <ul class="mistakes">
    <li><s>ma amie</s> → <b>mon</b> amie. Before a vowel, ma/ta/sa become mon/ton/son.</li>
    <li><s>Marie aime son mère.</s> → Marie aime <b>sa</b> mère. mère is feminine; it doesn’t matter that Marie is a woman.</li>
    <li><s>leur enfants</s> → <b>leurs</b> enfants. Several children: add the -s.</li>
    <li>With polite <i>vous</i>, use <b>votre / vos</b>, even for one person.</li>
  </ul>
</section>
<section>
  <h2>Quiz</h2>
  <div data-quiz></div>
</section>
<section>
  <div class="try">
    <h3>Parler: your family</h3>
    <p>${A1_TRY} Describe four people in your family: <i>Ma mère s’appelle … Mon frère habite à … Mes parents sont … Mon amie …</i></p>
  </div>
</section>`,
    quiz: [
      { type: 'pick', q: 'C’est ___ sœur. (my)', opts: ['ma', 'mon', 'mes'], a: 0, why: 'sœur is feminine: <em>ma</em> sœur.' },
      { type: 'pick', q: 'Voici ___ amie Léa. (my)', opts: ['mon', 'ma', 'm’'], a: 0, why: 'amie starts with a vowel, so ma becomes <em>mon</em>.' },
      { type: 'pick', q: 'Paul aime ___ mère.', opts: ['sa', 'son', 'ses'], a: 0, why: 'mère is feminine: <em>sa</em> mère, even though Paul is a man.' },
      { type: 'pick', q: 'Les enfants cherchent ___ chien. (their, one dog)', opts: ['leur', 'leurs', 'son'], a: 0, why: 'One dog, several owners: <em>leur</em>.' },
      { type: 'order', q: 'Build: “our parents”', tiles: ['nos', 'parents'], a: 'nos parents', why: 'parents is plural: <em>nos</em>.' },
    ],
    mount(ctx) {
      chipScene(ctx, {
        state: { o: 'il', n: 'sœur' },
        chips: [{ label: 'Owner', key: 'o', opts: opts(Object.keys(OWN), OWN_LAB) }, { label: 'Famille', key: 'n', opts: opts(Object.keys(PN)) }],
        build({ o, n }) {
          const O = OWN[o], N = PN[n];
          const vowelFem = N.g === 'f' && vowel(n);
          const form = vowelFem ? O.m : O[N.g];
          const gname = { m: 'masculine', f: 'feminine', pl: 'plural' }[N.g];
          return {
            tokens: [['X', 'Voici', 'plain'], ['P', form, 'conn'], ['N', n, 'obj'], ['d', '.', 'punct']],
            keys: ['X', 'P', 'N', 'd'], pop: ['P'],
            tag: vowelFem ? `${O.f} → ${O.m} before a vowel` : `${gname} · ${form}`,
            en: `Here ${N.g === 'pl' ? 'are' : 'is'} ${O.en} ${N.en}`,
            note: vowelFem ? `<i>${n}</i> is feminine, but it starts with a vowel, so <i>${O.f}</i> becomes <b class="r-conn">${form}</b> to keep the sounds apart.`
              : `<i>${n}</i> is ${gname}, so the possessive is <b class="r-conn">${form}</b>.` + (o === 'il' && N.g !== 'pl' ? ` This works for “his” and “her” alike: it follows <i>${n}</i>, not the owner.` : ''),
          };
        },
      });
    },
  });
})();
