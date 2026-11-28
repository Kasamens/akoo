/* Akoo Français, Start here: why the app is named after a parrot, what research says about how parrots learn to talk,
 * and the "learn in chunks" habit the rest of the path builds on.
 * Uses the engine in app.js and the shared kit in shared/kit.js (window.GK, read at mount time).
 */
(function () {
  'use strict';
  const { cap, say, ex, table, R } = window.GK;

  // starter chunks: whole phrases a beginner can use on day one, before knowing the grammar inside them
  const CH = {
    appelle: { w: ['Je', 'm’appelle', 'Ama', '.'], r: ['subj', 'verb', 'obj', 'punct'], en: 'My name is Ama.', inside: `<b>m’appelle</b> is the verb s’appeler (to be called). <i>me</i> shrinks to <i>m’</i> before a vowel. You meet verb endings in <a href="#present-er">Wk 1</a>.` },
    origine: { w: ['Je', 'viens', 'du', 'Ghana', '.'], r: ['subj', 'verb', 'conn', 'obj', 'punct'], en: 'I come from Ghana.', inside: `<b>du</b> is <i>de + le</i> squeezed together, because <i>le Ghana</i> is masculine. That merge is <a href="#partitif">Wk 7</a>. For now, just say the chunk.` },
    cafe: { w: ['Je', 'voudrais', 'un', 'café', '.'], r: ['subj', 'verb', 'obj', 'obj', 'punct'], en: 'I’d like a coffee.', inside: `<b>voudrais</b> is the conditional of <i>vouloir</i>, a B1 tense, and <b>un</b> tells you <i>café</i> is masculine (<a href="#articles">Wk 2</a>). Beginners say it perfectly from week one.` },
    comprends: { w: ['Je', 'ne', 'comprends', 'pas', '.'], r: ['subj', 'neg', 'verb', 'neg', 'punct'], en: 'I don’t understand.', inside: `<b>ne … pas</b> wraps around the verb: the negation rule from <a href="#negation">Wk 4</a>.` },
    repeter: { w: ['Vous', 'pouvez', 'répéter', ',', 's’il vous plaît', '?'], r: ['subj', 'verb', 'verb2', 'punct', 'plain', 'punct'], en: 'Could you repeat that, please?', inside: `<b>pouvez</b> plus an infinitive: the second verb stays in the infinitive, the same pattern as <i>aller</i> + infinitive in <a href="#aller-futur">Wk 6</a>.` },
  };
  const LABEL = { appelle: 'Je m’appelle …', origine: 'Je viens du …', cafe: 'Je voudrais …', comprends: 'Je ne comprends pas', repeter: 'Vous pouvez …?' };
  // French puts a thin space before ? ! : ; (and none before . or ,)
  const glue = (w, r) => w.reduce((s, x, i) => s + (r[i] === 'punct' ? (/^[?!:;]$/.test(x) ? ' ' : '') : (s ? ' ' : '')) + x, '');

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
    vocab: [
      ['s’appeler', 'to be called'], ['venir', 'to come'], ['je voudrais', 'I would like'], ['café', 'coffee', 'm'],
      ['comprendre', 'to understand'], ['répéter', 'to repeat'], ['s’il vous plaît', 'please'],
    ],
    title: 'Learn like a parrot',
    tagline: 'Akoo means parrot. Parrots learn to talk from a social flock, in whole phrases, with lots of solo practice. You can borrow all three habits.',
    prompt: 'Pick a phrase, then switch between “Chunk” and “Mot à mot”. Press Répéter and say it back, like Akoo does.',
    body: `
<section>
  <p class="rule">If a parrot can learn to talk, so can you, given the right material and direction.</p>
  <p><b>Akoo</b> means parrot in Twi. Ghana’s forests are home to the African grey parrot, the species best known for learning human words. The idea behind the app is simple: if a bird can pick up a language, a person with a clear path and good material can too. This French path starts from zero (A1), one grammar rule a week, each as a small 3D world you can play with. A2 and B1 are on the way.</p>
</section>
<section id="protect">
  <div class="try">
    <h3>Protect the real Akoo</h3>
    <p>The bird this app is named after is in trouble. The grey parrot has been listed as <b>Endangered</b> on the IUCN Red List since 2016, mainly because of trapping for the pet trade and loss of forest. In Ghana, a study published in 2016 found its numbers had fallen by 90 to 99% since 1992: the parrot was “virtually eliminated” from the country whose language gave Akoo its name.</p>
    <p>French learners have a special link to this bird. Much of the grey parrot’s range is French-speaking: it lives in the forests of south-eastern Côte d’Ivoire, Cameroon, Gabon, the Republic of the Congo and the Democratic Republic of the Congo. The World Parrot Trust reports that it has declined or disappeared in parts of Cameroon and the DRC, two countries that supplied much of the international trade.</p>
    <p>The <a href="https://parrots.org/about-wpt/programs-projects/grey-parrot-protection/" target="_blank" rel="noopener">World Parrot Trust’s Grey Parrot Program</a> has worked to save the species since 2001. Its work includes:</p>
    <ul>
      <li><b>Stopping the trade:</b> it helped enforce wildlife laws across West and Central Africa, and campaigned successfully to move the species to CITES Appendix I, which bans international commercial trade.</li>
      <li><b>Rescue and release:</b> it has rescued, treated and returned hundreds of trafficked parrots to the wild, with a mobile veterinary team and care centres.</li>
      <li><b>Research and habitat:</b> it studies wild populations and works with local communities to protect forests and nesting trees.</li>
      <li><b>Local partners:</b> it trains in-country teams in veterinary care, rescue, nest monitoring and law enforcement.</li>
    </ul>
    <p>How you can help:</p>
    <ul>
      <li>Never buy a wild-caught parrot. If you want a bird, ask where it came from.</li>
      <li>Share this page or the Trust’s program with friends, especially in Ghana and French-speaking West and Central Africa.</li>
      <li><a href="https://parrots.org/donate/" target="_blank" rel="noopener">Donate to the World Parrot Trust</a>.</li>
    </ul>
    <p class="fine">Akoo is an independent learning project and is not affiliated with the World Parrot Trust. Sources: <a href="https://parrots.org/about-wpt/programs-projects/grey-parrot-protection/" target="_blank" rel="noopener">World Parrot Trust</a>, <a href="https://datazone.birdlife.org/species/factsheet/grey-parrot-psittacus-erithacus/details" target="_blank" rel="noopener">BirdLife International / IUCN Red List</a>, <a href="https://parrots.org/projects/grey-parrot" target="_blank" rel="noopener">World Parrot Trust project regions</a>, Annorbah, Collar &amp; Marsden (2016), <i>Ibis</i>.</p>
  </div>
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
  <p>Partly. Owners report that pet parrots often pick up whole phrases as one unit, such as “Ça va ?” or “Bonjour, mon chéri”, and repeat them with the speaker’s exact tone. The best lab evidence for chunks comes from their songbird cousins: Bengalese finches learn their song as fixed runs of syllables, called chunks, which they then string together in flexible orders. Budgerigar song has been shown to have consonant- and vowel-like building blocks, but nobody has yet proved that parrots learn speech chunk by chunk. So treat chunking as a well-supported idea from bird song, not a proven fact about parrots.</p>
  <p>The human side is clearer. Linguists call ready-made phrases <i>formulaic sequences</i>. Studies of second-language speakers link using them with more fluent speech, because pulling a whole phrase from memory takes less effort than building it word by word in real time. Nick Ellis describes how these chunks “seed” later grammar. You use <i>Je voudrais</i> long before you know it is the conditional, and later the rule explains something you already say.</p>
</section>
<section>
  <h2>What this means for how you learn</h2>
  ${table(['Parrot habit', 'Your version', 'Where Akoo does it'], [
    ['Copies whole phrases', 'Learn 5 new chunks a week and say them as one unit', 'This page, and the Parler box in every lesson'],
    ['Learns from a flock', 'Find people: a tandem partner, a tutor, a class', 'The weekly speaking slot in your plan'],
    ['Model/rival', 'Watch two speakers talk (podcasts, Easy French street interviews), then take a role', 'Example sentences with ▶ écouter'],
    ['Words tied to wants', 'Learn the words for your life first: your food, your job, your city', 'Lessons use travel, home and work themes'],
    ['Solo sound play', 'Talk to yourself: describe what you are doing, in French, out loud', '“Répéter”, then say it again without the audio'],
    ['Recombines', 'Swap one word in a chunk: Je voudrais un thé, … un croissant', 'The chips under each 3D scene'],
    ['Open-ended learner', 'Age is no excuse. Steady weekly hours beat talent', 'One rule a week: 8 weeks of A1 grammar so far'],
  ])}
  <p>One honest limit: a parrot can repeat a phrase without knowing what it means. Alex mattered because his words were tied to real objects and wants. So never learn a chunk without its meaning. Every phrase on this site comes with an English line.</p>
</section>
<section>
  <h2>Starter chunks</h2>
  ${ex(Object.values(CH).map(c => [glue(c.w, c.r), c.en]).concat([
    ['Comment ça va\u202f?', 'How are you? (to a friend)'],
    ['Excusez-moi, où est la gare\u202f?', 'Excuse me, where is the station?'],
    ['Comment dit-on … en français\u202f?', 'How do you say … in French?'],
  ]))}
</section>
<section>
  <h2>Quiz</h2>
  <div data-quiz></div>
</section>
<section>
  <div class="try">
    <h3>Parler: be the parrot</h3>
    <p>Pick three starter chunks. Say each one 10 times today: first with the audio, then without it, then while doing something else, like cooking or walking. Tomorrow, swap one word in each (Je viens du <i>Togo</i>, Je voudrais un <i>thé</i>).</p>
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
      { type: 'order', q: 'Build the chunk “I’d like a coffee”:', tiles: ['Je', 'voudrais', 'un', 'café'], a: 'Je voudrais un café', why: 'Learn it as one unit now. The conditional tense will explain <i>voudrais</i> later.' },
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
      let k = 'cafe', mode = 'chunk', first = true, spoken = '';
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
        spoken = glue(C.w, C.r);
        bubble.set(mode === 'chunk' ? `«\u202f${spoken}\u202f»` : 'Mot … à … mot');
        ctx.fit(Math.max(8, size.w + 2), size.h + 5.6, K.V(0, 1.35 - (S.lines - 1) * 0.62, 0), K.V(0, 0.25, 1));
        if (!first) { P.flap(); if (mode === 'chunk') S.pop(keys.filter(x => C.r[+x.slice(1)] !== 'punct')); }
        first = false;
        out.innerHTML = `<span class="de">${spoken}</span> ${say(spoken)} <span>· ${C.en}</span><br>${mode === 'chunk'
          ? 'One chunk, one colour: store it and say it as a single unit, the way a parrot copies a whole phrase.'
          : 'Word for word: the same phrase taken apart, so you can see the grammar inside. ' + C.inside}`;
      }
      K.chips('Phrase', Object.keys(CH).map(v => ({ v, label: LABEL[v] })), k, v => { k = v; render(); });
      K.chips('Vue', [{ v: 'chunk', label: 'Chunk' }, { v: 'words', label: 'Mot à mot' }], mode, v => { mode = v; render(); });
      K.btn('▶ Répéter', () => { ctx.say(spoken); P.talk(); });
      render();
      K.onPortrait(render);
    },
  });
})();
