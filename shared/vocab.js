/* Akoo vocabulary list: a lesson's optional `vocab` field, rendered as a compact word list with a listen
 * button per word, just above the quiz. Entries are [word, translation, gender?]; gender is 'm', 'f', 'n'
 * or 'pl' for nouns, and the article is added from it (der/die/das in German, le/la/l’/les in French).
 * Listen buttons are the same .say buttons the examples use, so they speak through the engine's say().
 */
(function () {
  'use strict';
  const CFG = window.AKOO || {}, LANG = (CFG.lang || 'de').toLowerCase();
  const G = { m: 'masculine', f: 'feminine', n: 'neuter', pl: 'plural' };
  const ART = {
    de: (w, g) => ({ m: 'der', f: 'die', n: 'das', pl: 'die' })[g],
    fr: (w, g) => g === 'pl' ? 'les' : /^[aeiouyéèêâîôûœh]/i.test(w) ? 'l’' : g === 'f' ? 'la' : 'le',
  };
  const HEAD = { de: 'Wörter', fr: 'Mots' };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function item([w, en, g]) {
    const art = g && ART[LANG] ? ART[LANG](w, g) : '';
    const spoken = art ? (art.endsWith('’') ? art + w : `${art} ${w}`) : w;
    const say = window.GK ? window.GK.say(spoken) : '';
    const a = art ? `<span class="va g-${g}">${esc(art)}</span>${art.endsWith('’') ? '' : ' '}` : '';
    const gl = g ? ` <abbr class="vg" title="${G[g]}" aria-label="${G[g]}">${g}</abbr>` : '';
    return `<li><span class="vw" lang="${LANG}">${a}${esc(w)}</span>${gl}<span class="ven">${esc(en)}</span>${say}</li>`;
  }

  function mount(body, s) {
    if (!s || !Array.isArray(s.vocab) || !s.vocab.length) return;
    const sec = document.createElement('section');
    sec.className = 'vocab'; sec.id = 'words';
    sec.setAttribute('aria-labelledby', 'words-h');
    sec.innerHTML = `<h2 id="words-h"><span lang="${LANG}">${HEAD[LANG] || 'Words'}</span></h2><p class="vsub">The words this lesson uses${LANG === 'de' ? '. Nouns carry their article: der (m), die (f), das (n)' : '. Nouns carry their article and gender: m or f'}.</p><ul class="vlist">${s.vocab.map(item).join('')}</ul>`;
    // just above the quiz section (or at the end if the lesson has none)
    const q = body.querySelector('[data-quiz]'), qs = q && q.closest('section');
    if (qs && qs.parentNode) qs.parentNode.insertBefore(sec, qs); else body.appendChild(sec);
  }

  window.AkooVocab = { mount };
})();
