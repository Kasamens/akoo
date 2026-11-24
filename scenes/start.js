/* Akoo, Start here: why the app is named after a parrot, what research says about how parrots learn to talk,
 * and the "learn in chunks" habit the rest of the path builds on.
 * Uses the engine in app.js and the shared kits from phase1.js / phase2.js (window.GK, read at mount time).
 */
(function () {
  'use strict';
  const { cap, say, ex, table, R } = window.GK;

  // starter chunks: whole phrases a beginner can use on day one, before knowing the grammar inside them
  const CH = {
    heisse: { w: ['Ich', 'heiße', 'Ama', '.'], r: ['subj', 'verb', 'obj', 'punct'], en: 'My name is Ama.', inside: `<b>heiße</b> is the ich-form of heißen. You meet verb endings in <a href="#praesens">Wk 1</a>.` },
    herkunft: { w: ['Ich', 'komme', 'aus', 'Ghana', '.'], r: ['subj', 'verb', 'conn', 'obj', 'punct'], en: 'I come from Ghana.', inside: `<b>aus</b> always takes the dative case. You do not need to know that yet: just say the chunk.` },
    kaffee: { w: ['Ich', 'hätte', 'gern', 'einen', 'Kaffee', '.'], r: ['subj', 'verb', 'plain', 'obj', 'obj', 'punct'], en: 'I’d like a coffee.', inside: `Two big rules hide here: <b>hätte</b> is Konjunktiv II (<a href="#konjunktiv-2">Wk 18</a>) and <b>einen</b> is the accusative (<a href="#akkusativ">Wk 4</a>). Beginners say it perfectly from week one.` },
    verstehe: { w: ['Ich', 'verstehe', 'das', 'nicht', '.'], r: ['subj', 'verb', 'obj', 'conn', 'punct'], en: 'I don’t understand that.', inside: `<b>nicht</b> near the end is the negation rule from <a href="#nicht-kein">Wk 5</a>.` },
    wiederholen: { w: ['Können', 'Sie', 'das', 'bitte', 'wiederholen', '?'], r: ['verb', 'subj', 'obj', 'plain', 'verb2', 'punct'], en: 'Could you repeat that, please?', inside: `A modal verb up front and the infinitive at the very end: the sentence bracket from <a href="#modalverben">Wk 6</a>.` },
  };
  const LABEL = { heisse: 'Ich heiße …', herkunft: 'Ich komme aus …', kaffee: 'Ich hätte gern …', verstehe: 'Ich verstehe …', wiederholen: 'Können Sie …?' };

  // an African grey parrot (the akoo of Ghana's forests) from simple painted shapes
  function parrot(ctx, K) {
    const T = K.T, g = new T.Group(), head = new T.Group(), wingL = new T.Group(), wingR = new T.Group();
    const body = K.sph(0.55, 'neutral'); body.scale.set(0.85, 1.15, 0.8); g.add(body);
    const belly = K.sph(0.42, 'paper', { ink: 0.5 }); belly.scale.set(0.75, 1, 0.5); belly.position.set(0, -0.08, 0.3); g.add(belly);
    head.position.set(0, 0.78, 0.05); g.add(head);
    head.add(K.sph(0.38, 'neutral'));
    const face = K.sph(0.13, 'paper', { ink: 0.3 }); face.scale.set(1, 0.85, 0.5); face.position.set(0.17, 0.05, 0.29); head.add(face);
    const face2 = face.clone(); face2.position.x = -0.17; head.add(face2);
    const eyeL = K.sph(0.06, 'ink', { ink: false }); eyeL.position.set(0.19, 0.06, 0.35); head.add(eyeL);
    const eyeR = eyeL.clone(); eyeR.position.x = -0.19; head.add(eyeR);
    const beak = ctx.solid(new T.ConeGeometry(0.15, 0.42, 14), 'ink', { ink: 0.5 });
    beak.rotation.x = Math.PI / 2 + 0.75; beak.position.set(0, -0.12, 0.42); head.add(beak);
    [[wingL, 1], [wingR, -1]].forEach(([w, s]) => {
      const m = K.sph(0.4, 'shade'); m.scale.set(0.35, 1, 0.75); m.position.set(0, -0.35, 0);
      w.add(m); w.position.set(0.42 * s, 0.25, -0.02); w.rotation.z = 0.12 * s; g.add(w);
    });
    const tail = K.box(0.34, 0.8, 0.12, 'bad'); tail.position.set(0, -0.95, -0.3); tail.rotation.x = -0.3; g.add(tail);
    [0.16, -0.16].forEach(x => { const f = K.cyl(0.05, 0.05, 0.22, 'ink', 8, { ink: false }); f.position.set(x, -0.68, 0.12); g.add(f); });
    g.rotation.y = 0.6;
    ctx.scene.add(g);
    let bob = 0, flap = 0;
    ctx.onFrame((dt, t) => {
      const q = ctx.twos(t);
      bob = Math.max(0, bob - dt); flap = Math.max(0, flap - dt);
      if (ctx.reduce) return;
      head.rotation.x = bob > 0 ? Math.sin(ctx.twos(bob) * 22) * 0.28 : Math.sin(q * 0.9) * 0.05;
      head.rotation.y = bob > 0 ? 0 : Math.sin(q * 0.55) * 0.35;
      const f = flap > 0 ? Math.sin(ctx.twos(flap) * 26) * 0.6 : 0;
      wingL.rotation.z = 0.12 + Math.max(0, f); wingR.rotation.z = -0.12 - Math.max(0, f);
      g.position.y = g.userData.y + (flap > 0 ? Math.abs(Math.sin(ctx.twos(flap) * 13)) * 0.12 : 0);
    });
    g.userData.y = 0;
    return { group: g, talk() { bob = 0.9; }, flap() { flap = 0.55; } };
  }

  MM.register({
    id: 'akoo', day: 0, week: 0,
    title: 'Learn like a parrot',
    tagline: 'Akoo means parrot. Parrots learn to talk from a social flock, in whole phrases, with lots of solo practice. You can borrow all three habits.',
    prompt: 'Pick a phrase, then switch between “Chunk” and “Wort für Wort”. Press Nachsprechen and say it back, like Akoo does.',
    body: `
<section>
  <p class="rule">If a parrot can learn to talk, so can you, given the right material and direction.</p>
  <p><b>Akoo</b> means parrot in Twi. Ghana’s forests are home to the African grey parrot, the species best known for learning human words. The idea behind the app is simple: if a bird can pick up a language, a person with a clear path and good material can too. This path starts from zero (A1), goes through A2 and ends at B1, one grammar rule a week, each as a small 3D world you can play with.</p>
</section>
<section>
  <h2>How parrots learn to speak</h2>
  <ul>
    <li><b>They are vocal learners.</b> Very few animals can copy new sounds: humans, songbirds, parrots, hummingbirds, and a few mammals such as bats, whales and elephants. In 2015 Duke researchers found that parrot brains have a “core” vocal learning system wrapped in an extra “shell”. Other songbirds lack the shell, and the team suggests it may help explain why parrots are such good imitators.</li>
    <li><b>They learn from a flock, not from a speaker.</b> In the wild, a young parrot copies the calls of its group. A pet parrot treats its human family as its flock. Early lab attempts to teach mimic birds with recorded voices in isolation taught them little or nothing.</li>
    <li><b>Social, meaningful practice works best.</b> Irene Pepperberg trained Alex, an African grey, with the <i>model/rival</i> method. Two people take turns: one asks “What’s this?”, the other answers and gets the object as a reward. The trainers swap roles, so the bird sees that words are a two-way exchange. Labels were for things Alex actually wanted. In her 1994 study, live tutoring beat video and audio recordings.</li>
    <li><b>They practise alone.</b> Pepperberg recorded the parrots talking to themselves when no one was around, trying out sounds and new combinations. It is like a toddler talking in the cot before sleep.</li>
    <li><b>They recombine what they know.</b> The lab’s birds built new labels from old ones. Their word for apple, “banerry”, seems to mix <i>banana</i> and <i>cherry</i>.</li>
    <li><b>They keep learning as adults.</b> Zebra finches learn their song in a short window when young and then stop. Parrots are <i>open-ended</i> learners: they can learn new sounds throughout their lives. Adult humans are also open-ended. It is never too late.</li>
  </ul>
</section>
<section>
  <h2>Do parrots learn in chunks?</h2>
  <p>Partly. Owners report that pet parrots often pick up whole phrases as one unit, such as “Wie geht’s?” or “Hallo, mein Schatz”, and repeat them with the speaker’s exact tone. The best lab evidence for chunks comes from their songbird cousins: Bengalese finches learn their song as fixed runs of syllables, called chunks, which they then string together in flexible orders. Budgerigar song has been shown to have consonant- and vowel-like building blocks, but nobody has yet proved that parrots learn speech chunk by chunk. So treat chunking as a well-supported idea from bird song, not a proven fact about parrots.</p>
  <p>The human side is clearer. Linguists call ready-made phrases <i>formulaic sequences</i>. Studies of second-language speakers link using them with more fluent speech, because pulling a whole phrase from memory takes less effort than building it word by word in real time. Nick Ellis describes how these chunks “seed” later grammar. You use <i>Ich hätte gern</i> long before you know it is Konjunktiv II, and later the rule explains something you already say.</p>
</section>
<section>
  <h2>What this means for how you learn</h2>
  ${table(['Parrot habit', 'Your version', 'Where Akoo does it'], [
    ['Copies whole phrases', 'Learn 5 new chunks a week and say them as one unit', 'This page, and the Sprechen box in every lesson'],
    ['Learns from a flock', 'Find people: a tandem partner, a tutor, a class', 'The weekly speaking slot in your plan'],
    ['Model/rival', 'Watch two speakers talk (podcasts, Easy German street interviews), then take a role', 'Example sentences with ▶ hören'],
    ['Words tied to wants', 'Learn the words for your life first: your food, your job, your city', 'Lessons use travel, home and work themes'],
    ['Solo sound play', 'Talk to yourself: describe what you are doing, in German, out loud', '“Nachsprechen”, then say it again without the audio'],
    ['Recombines', 'Swap one word in a chunk: Ich hätte gern einen Tee, … ein Wasser', 'The chips under each 3D scene'],
    ['Open-ended learner', 'Age is no excuse. Steady weekly hours beat talent', 'One rule a week, 25 weeks of grammar'],
  ])}
  <p>One honest limit: a parrot can repeat a phrase without knowing what it means. Alex mattered because his words were tied to real objects and wants. So never learn a chunk without its meaning. Every phrase on this site comes with an English line.</p>
</section>
<section>
  <h2>Starter chunks</h2>
  ${ex(Object.values(CH).map(c => [c.w.reduce((s, w, i) => s + (c.r[i] === 'punct' ? '' : (s ? ' ' : '')) + w, ''), c.en]).concat([
    ['Wie geht es dir?', 'How are you? (to a friend)'],
    ['Entschuldigung, wo ist der Bahnhof?', 'Excuse me, where is the station?'],
    ['Wie sagt man … auf Deutsch?', 'How do you say … in German?'],
  ]))}
</section>
<section>
  <h2>Quiz</h2>
  <div data-quiz></div>
</section>
<section>
  <div class="try">
    <h3>Sprechen: be the parrot</h3>
    <p>Pick three starter chunks. Say each one 10 times today: first with the audio, then without it, then while doing something else, like cooking or walking. Tomorrow, swap one word in each (Ich komme aus <i>Kumasi</i>, Ich hätte gern einen <i>Tee</i>).</p>
  </div>
</section>
<section>
  <h2>Sources</h2>
  <ul class="sources">
    <li>Chakraborty et al. (2015), <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4479475" target="_blank" rel="noopener">Core and shell song systems unique to the parrot brain</a>, PLoS ONE. Summary: <a href="https://today.duke.edu/2015/06/parrotshells" target="_blank" rel="noopener">Duke Today</a>.</li>
    <li>Pepperberg (1994), <a href="https://sora.unm.edu/sites/default/files/journals/auk/v111n02/p0300-p0313.pdf" target="_blank" rel="noopener">Vocal learning in grey parrots: effects of social interaction, reference and context</a>, The Auk.</li>
    <li>Pepperberg, <a href="https://www.cambridge.org/core/journals/applied-psycholinguistics/article/abs/solitary-sound-play-during-acquisition-of-english-vocalizations-by-an-african-grey-parrot-psittacus-erithacus-possible-parallels-with-childrens-monologue-speech/2CF96371581ED1FE0263F88D7643F62D" target="_blank" rel="noopener">Solitary sound play during acquisition of English vocalizations by an African Grey parrot</a>, Applied Psycholinguistics.</li>
    <li><a href="https://lafeber.com/pet-birds/?p=16618" target="_blank" rel="noopener">Lafeber: how Griffin and the lab’s parrots used “banerry”</a>.</li>
    <li><a href="https://bmcneurosci.biomedcentral.com/counter/pdf/10.1186/s12868-024-00879-8.pdf" target="_blank" rel="noopener">BMC Neuroscience (2024) on budgerigars as open-ended vocal learners</a>.</li>
    <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7804275" target="_blank" rel="noopener">Segment structure in budgerigar warble song</a>, and work on <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC3087398" target="_blank" rel="noopener">chunks in Bengalese finch song</a>.</li>
    <li>Ellis (2012), <a href="https://public.websites.umich.edu/~ncellis/NickEllis/Publications_files/ARAL2012offprint.pdf" target="_blank" rel="noopener">Formulaic language and second language acquisition: Zipf and the phrasal teddy bear</a>.</li>
    <li>Wang &amp; Christiansen (2024), <a href="https://files.eric.ed.gov/fulltext/EJ1457275.pdf" target="_blank" rel="noopener">chunking and second-language processing</a>; François &amp; Albakry (2021), <a href="https://scholarspace.manoa.hawaii.edu/server/api/core/bitstreams/4cfac547-6780-4c56-bdaa-7776823c329b/content" target="_blank" rel="noopener">formulaic sequences and speaking fluency</a>.</li>
  </ul>
</section>`,
    quiz: [
      { type: 'pick', q: 'In Pepperberg’s 1994 study, which kind of tutoring worked best for the grey parrots?', opts: ['Live tutoring with two people (model/rival)', 'Audio recordings played on repeat', 'Video recordings'], a: 0, why: 'Live, social tutoring with words tied to real objects beat both kinds of recording.' },
      { type: 'pick', q: 'What do the parrot-brain findings from 2015 describe?', opts: ['A “shell” around the core vocal learning areas', 'A brain area that stores grammar rules', 'Proof that parrots understand sentences'], a: 0, why: 'Parrots have an extra shell around their core song system. The team suggests it may help with imitation.' },
      { type: 'pick', q: 'Parrots are “open-ended” vocal learners. What does that mean?', opts: ['They can learn new sounds throughout life', 'They only learn while very young', 'They learn only from other parrots'], a: 0, why: 'Unlike zebra finches, parrots keep learning as adults, and so do humans.' },
      { type: 'order', q: 'Build the chunk “I’d like a coffee”:', tiles: ['Ich', 'hätte', 'gern', 'einen', 'Kaffee'], a: 'Ich hätte gern einen Kaffee', why: 'Learn it as one unit now. Konjunktiv II and the accusative will explain it later.' },
      { type: 'pick', q: 'What is the biggest risk of learning like a parrot?', opts: ['Repeating phrases without knowing what they mean', 'Learning too many phrases', 'Speaking too fluently'], a: 0, why: 'Always pair a chunk with its meaning and a situation where you would use it.' },
    ],
    mount(ctx) {
      const { kit, stageRow, bench } = window.GK;
      const K = kit(ctx);
      ctx.backdrop({ center: K.V(0, 0, -2) });
      const S = stageRow(ctx, K, { pos: K.V(0, 0, 0) });
      const fitBench = bench(ctx, K);
      const P = parrot(ctx, K);
      const branch = K.at(K.cyl(0.12, 0.14, 3.2, 'wood', 12), 0, 0, -0.3); branch.rotation.z = Math.PI / 2;
      const bubble = K.tag('', K.V(0, 0, 0), 'q');
      let k = 'kaffee', mode = 'chunk', first = true, spoken = '';
      const out = K.readout();
      function render() {
        const C = CH[k];
        const tokens = C.w.map((w, i) => ['w' + i, w, C.r[i]]);
        const keys = tokens.map(t => t[0]);
        const roles = {};
        if (mode === 'chunk') keys.forEach(x => { if (C.r[+x.slice(1)] !== 'punct') roles[x] = 'conn'; });
        const size = S.show(tokens, keys, { snap: first, roles, tight: mode === 'chunk' ? keys.slice(1) : [], cap: false });
        fitBench(size, S.lines);
        const top = 2.4;
        P.group.userData.y = top; P.group.position.set(0, top, -0.3);
        branch.position.set(0, top - 0.78, -0.3);
        bubble.pos.set(ctx.portrait ? 0 : 1.3, top + 1.5, 0);
        spoken = C.w.reduce((s, w, i) => s + (C.r[i] === 'punct' ? '' : (s ? ' ' : '')) + w, '');
        bubble.set(mode === 'chunk' ? `„${spoken}“` : 'Wort … für … Wort');
        ctx.fit(Math.max(8, size.w + 2), size.h + 5.6, K.V(0, 1.35 - (S.lines - 1) * 0.62, 0), K.V(0, 0.25, 1));
        if (!first) { P.flap(); if (mode === 'chunk') S.pop(keys.filter(x => C.r[+x.slice(1)] !== 'punct')); }
        first = false;
        out.innerHTML = `<span class="de">${spoken}</span> ${say(spoken)} <span>· ${C.en}</span><br>${mode === 'chunk'
          ? 'One chunk, one colour: store it and say it as a single unit, the way a parrot copies a whole phrase.'
          : 'Word for word: the same phrase taken apart, so you can see the grammar inside. ' + C.inside}`;
      }
      K.chips('Phrase', Object.keys(CH).map(v => ({ v, label: LABEL[v] })), k, v => { k = v; render(); });
      K.chips('Ansicht', [{ v: 'chunk', label: 'Chunk' }, { v: 'words', label: 'Wort für Wort' }], mode, v => { mode = v; render(); });
      K.btn('▶ Nachsprechen', () => { ctx.say(spoken); P.talk(); });
      render();
      K.onPortrait(render);
    },
  });
})();
