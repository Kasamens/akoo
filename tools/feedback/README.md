# Akoo feedback: setup

Learners send feedback from the "🦜 Squawk at us" form on the site (`shared/feedback.js`). It goes to a small Google Apps Script (`Code.gs`), which emails it to **akoobird@gmail.com**. Once a day, Claude copies new feedback emails into the **Akoo feedback log** sheet.

The form stays hidden on the live site until step 3 is done. To try it before then, add `?feedback=dry` to any page URL. Messages are then printed to the browser console instead of being sent.

## 1. Create the script (about 5 minutes)
1. Sign in to Google as **akoobird@gmail.com** and open <https://script.google.com>.
2. Click **New project** and name it **Akoo feedback**.
3. Delete the sample code, then paste in the whole of `tools/feedback/Code.gs`. Save.

## 2. Deploy it as a web app
1. Click **Deploy → New deployment**. Under **Select type** (the gear icon), choose **Web app**.
2. Set **Execute as:** Me (akoobird@gmail.com), and **Who has access:** Anyone.
3. Click **Deploy**. Google asks you to authorise the script: it needs permission to send email as akoobird. Review the permissions and allow them.
4. Copy the **Web app URL**. It ends in `/exec`.
5. Optional check: open that URL in a browser. You should see "Akoo feedback receiver is running."

## 3. Switch the form on
Paste the URL into `shared/feedback.js`:
```js
const ENDPOINT = 'https://script.google.com/macros/s/…/exec';
```
Commit and push, or ask Claude to do it.

## 4. Label the emails in Gmail
In akoobird@gmail.com, go to **Settings → Filters → Create a new filter**:
- **Subject:** `[Akoo feedback]`
- **Action:** Apply the label `akoo-feedback`. Create the label if it doesn't exist.

Also create an empty label called `akoo-logged`. The daily task moves each email there after copying it into the sheet.

## 5. Let Claude read the emails (pick one)
- **A. Connect akoobird to Claude's Gmail connector.** This is the cleanest option: the daily task reads akoobird directly.
- **B. Forward to the Gmail account Claude is already connected to.** Add a forwarding filter in akoobird (subject `[Akoo feedback]` → forward). Then add the same `akoo-feedback` label filter in that account.

## Changing the script later
After editing `Code.gs`, go to **Deploy → Manage deployments → Edit (pencil icon) → Version: New version → Deploy**. Doing it this way keeps the same URL.

## Limits and privacy
- **Sending limit:** Google lets a free account send about 100 emails a day from Apps Script, which is plenty for feedback.
- **Flood protection:** the script also stops after 30 messages an hour across all visitors.
- **What's collected:** no email address, no IP address and no identifiers. A name is included only when the learner ticks "Add my name to the Thanks page". See `privacy/index.html`.
