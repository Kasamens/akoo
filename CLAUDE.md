# Akoo: project memory

This file loads automatically in every Claude Code session opened in this folder. It holds what we've decided and where things stand, so a new tab can pick up where the last one stopped. **Keep it current:** when a session changes something worth remembering (a decision, a preference, a finished or new to-do), update the matching section and add a line to the log at the bottom before finishing.

## What it is

A language-learning site for German and French from A1 to B1, one grammar rule a week. Each lesson is a small painted 3D world you can play with, plus spoken examples, a short explainer and a five-question quiz. *Akoo* means parrot in Twi, and the site supports grey parrot conservation.
- Live: https://kasamens.github.io/akoo/ (GitHub Pages, served from `main` of `Kasamens/akoo`)
- **Pushing to `main` publishes the live site.** Commit when a change is done; ask before pushing.
- Preview: run `python3 -m http.server` in this folder.

## Kojo's preferences (settled; don't relitigate without asking)

- **The stage look of 28 Nov is approved** (see Status). Build new lessons on it.
- **Look: painterly cel shading.**
  - Toon materials with ink outlines.
  - Shadows get a cool hue shift.
  - The page has a paper grain overlay and a vignette.
  - Animation is stepped at 12 fps ("on twos") so it feels hand-drawn.
  - It's deliberately different from Mental Models' matte paper look and CyberNet's neon.
- **Look experiments go in `../akoo-lookdev`** (a full copy of the site) first, then get copied here once approved.
- **Lessons are toys:** each rule is something to manipulate. For example, word blocks swap places to show verb-second word order.
- **Privacy first:**
  - Progress stays in the browser (`localStorage`, one key per language: `akoo:de:v1`, `akoo:fr:v1`), with backup, restore and reset.
  - Visit counts are cookie-free through GoatCounter (site `akoobird`). Nothing is counted on localhost, in automated browsers or under Global Privacy Control. `/privacy` explains this, so update it if data handling changes.
- **Feedback:** the "Squawk at us" form goes to a Google Sheet through the Apps Script in `tools/feedback/`. People who send useful feedback get credited on `/thanks` (`shared/thanks.json`).
- **The podcast player label is "Translate",** not "English". It sits after the quiz.
- **Mobile:** the lessons drawer slides in from the right, and the language picker is a flag dropdown.
- **Speaker colours** in the podcast are kept per character (for example Tom and Abena).

## How it's built

```
index.html          landing page + language picker
de/  fr/            course pages; scenes/ one file per phase/level; de/podcast/ episodes (.m4a + .json timing)
shared/app.js       engine: routing, renderer, toon shader, lights, theming, quiz, cleanup
shared/kit.js       scene helpers (materials, outlines, controls)
shared/ui.js progress.js podcast.js analytics.js feedback.js style.css
privacy/ thanks/    privacy notice, thanks page        tools/feedback/  Apps Script backend
```
- A lesson is one `register({ id, title, prompt, body, quiz, mount(ctx) })` call.
- **German:** `start.js` (the "Learn like a parrot" intro), `phase1.js` (6), `phase2.js` (8), `phase3.js` (3) and `a1.js` (8), so 25 lessons in total.
- **French:** `start.js` and `a1.js` (8 A1 lessons). A2 and B1 are still to come.
- **Podcast episodes are generated in `../german-podcast`:**
  1. Write a script in `episodes/*.txt`.
  2. Run `.venv/bin/python make_episode.py <script> --out ../akoo/de/podcast`.
  3. The format is documented at the top of `make_episode.py`. A1 episodes 1–8 follow Kofi's story.

## Status

- **Stage look (committed 28 Nov):** a painted tabletop with cel shadows, a watercolour-paper backdrop, a paint-on reveal when a lesson opens (≤3 s, skipped with reduced motion), an inked frame with a lesson tab and a ✎ tally of rule changes, ink leader lines from labels to the changed block, and a tighter camera. Labels are kept 8px inside the stage (`place()` in `shared/app.js`). Committed locally, **not pushed yet**.
- **German:** A1–B1 is done (25 lessons). The A1 podcast has 8 episodes.
- **French:** A1 is done (8 lessons). A2 and B1 are next.

## Open to-dos

- Push the stage look to the live site when Kojo says so.
- French A2 and B1.
- Podcast episodes beyond A1, and a French podcast.

## Log (newest first; one line per session)

- 2026-11-28: Reviewed the look upgrade side by side with the old one. Fixed labels clipping at the stage edge on phones. Committed the upgrade. Added README and this CLAUDE.md.
- 2026-11-27: Look upgrade copied in from akoo-lookdev (uncommitted). Podcast episodes 2–8 with speaker colours. Player placed after the quiz with a "Translate" label. Hören player with A1 episode 1.
- 2026-11-26: GoatCounter visit counts switched on. Privacy page trimmed.
- 2026-11-25: Feedback form, Thanks page (credited Raymond Okyere) and privacy page. Flag language picker. French A1 course. Restructured into `/shared`, `/de`, `/fr`. Progress saving with backup/restore. Mobile lessons drawer. Parrot conservation section.
- 2026-11-24: German in 3D, phases 1–3. Renamed to Akoo and the path extended to A1–B1.
