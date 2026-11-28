# Akoo

**Learn German or French from A1 to B1, one grammar rule a week.**
Live: **[kasamens.github.io/akoo](https://kasamens.github.io/akoo/)**

*Akoo* means parrot in Twi. If a parrot can learn to talk, so can you. Each lesson takes one grammar rule and turns it into a small painted 3D world you can interact with, plus spoken examples, a short explainer and a five-question quiz.

## What's in it

- **German course** (`/de`): 25 weekly lessons across A1, A2 and B1, plus a "Learn like a parrot" introduction.
- **French course** (`/fr`): A1 lessons, with A2 and B1 to follow.
- **Interactive scenes:** each rule is an interactive scene, e.g. word blocks that swap places to show verb-second word order.
- **Audio:** example sentences are read aloud with the browser's speech synthesis.
- **Hören podcast:** short A1 episodes (two speakers, with a translation toggle) that follow one character's story.
- **Quizzes and progress:** progress is saved only in your browser (`localStorage`), separately for each language.

## How it's built

- **Plain HTML, CSS and JavaScript:** no framework and no build step. It's served as a static site on GitHub Pages.
- **Three.js:** cel-shaded "painterly" materials with ink outlines, and animation stepped at 12 fps ("on twos") for a hand-drawn feel.
- **Scene registry:** each lesson is one `register({ id, title, prompt, body, quiz, mount(ctx) })` call. The shared engine in `shared/app.js` handles routing, the renderer, theming, quizzes and cleanup.
- **Accessibility:** respects `prefers-reduced-motion`, and has light and dark themes.
- **Privacy-friendly stats:** cookie-free page counts via GoatCounter. Nothing is counted on localhost, in automated browsers, or when Global Privacy Control is set. See `/privacy`.
- **Feedback form:** stored in a Google Sheet through a small Apps Script (`tools/feedback/`).

```
index.html          language picker
de/ fr/             course pages, scenes/ (one file per lesson), de/podcast/ (episodes + transcripts)
shared/             engine (app.js), UI kit, quiz, progress, podcast player, analytics, styles
privacy/ thanks/    privacy notice and thanks page
de/l/ fr/l/         generated: one static page per lesson (for search engines), see below
sw.js               service worker (offline); manifest.webmanifest + icons/ (installable app)
tools/feedback/     Apps Script backend for the feedback form
tools/pages/        generator for the lesson pages, sitemap.xml, robots.txt and the offline file list
```

## Run it locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Lesson pages, sitemap and offline list (re-run after changing lessons or page heads)

Lessons live at hash addresses (`de/#praesens`), which search engines treat as one page. So each lesson also gets its own static page, e.g. `de/l/praesens/`, with its own title, description, canonical URL and the full explainer text readable without JavaScript. With JavaScript on, the page switches its address to `de/#praesens` and the normal app runs in place (no redirect, no second load).

Run this from the repo root whenever a lesson is added or changed, or a course page's `<head>` changes (fonts, Open Graph, etc.), then commit the result:

```bash
node tools/pages/build.mjs
```

It rewrites `de/l/`, `fr/l/`, `sitemap.xml`, `robots.txt` and the precache list and cache version inside `sw.js`. Each lesson page's `<head>` is copied from its course's `index.html` at build time, so never edit the generated pages by hand. It needs Node 18 or later and nothing else.

Note: search engines only read `robots.txt` at the domain root (`kasamens.github.io/robots.txt`), so the copy here is informational. Submit `https://kasamens.github.io/akoo/sitemap.xml` in Google Search Console instead.

## Offline and install

Akoo is installable (`manifest.webmanifest`) and works offline through `sw.js`:
- Pages, the engine, scenes and styles are fetched **network first**: online you always get the latest deploy, offline the saved copy. The cache name includes a hash of the files, so a new deploy replaces the old cache.
- Podcast episodes (about 1.7 MB each) are saved only when played, or with the **Save for offline** button under the player.

## Test before you push

Pushing to `main` publishes the live site, so run the smoke test first. Set it up once (needs Node 18.17 or newer), then run it:

```bash
npm --prefix tools/test install
```

```bash
npm --prefix tools/test test
```

It uses the Google Chrome or Edge already on your machine. If you have neither, run `npm --prefix tools/test run browser` to download Chromium.

It serves the repo the way GitHub Pages does (under `/akoo/`, case-sensitive file names), finds every course and lesson by itself, and prints a pass or fail line for each. A run takes a minute or two. It fails if:

- a lesson or page has a console error or page error, including a missing local file
- a lesson's 3D stage is missing or blank, or its title or body is missing
- a quiz doesn't have exactly 5 questions
- a lesson is registered but not in the menu, two lessons share an id, or a scene file registers nothing
- moving from one lesson to the next throws an error
- the landing, privacy or thanks page doesn't load cleanly
- a test run or localhost preview would be counted by GoatCounter

Test runs are never counted: the site skips localhost and automated browsers, and the test also blocks analytics and the feedback form.

To check only some of it, add part of a name, such as `de/praesens`, `fr/` or `privacy`:

```bash
npm --prefix tools/test test -- fr/
```

### Optional: run it automatically on push

This installs a git hook that tests the commit you are pushing to `main` and stops the push if it fails. Pushes to other branches are not tested. Nothing installs it for you.

```bash
cp tools/test/pre-push "$(git rev-parse --git-common-dir)/hooks/pre-push"
```

Skip it once with `git push --no-verify`, or delete the copied file to remove it. If you already have a `pre-push` hook, merge the two by hand instead of copying over it.

## Built with

Designed and built with [Claude Code](https://claude.com/claude-code), using AI-assisted development for the engine, scenes and content, with every lesson reviewed by hand.
