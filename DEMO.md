# Demo checklist

## Before recording (10 min)

1. **Backend:** `npm run backend` (first time: `npm run backend:setup`). Check <http://127.0.0.1:8000/health> says `ok`.
2. **Extension in your normal Chrome** (you're already logged in to Gmail there):
   `npm run build` → `chrome://extensions` → Developer mode → **Load unpacked** → pick `.output/chrome-mv3`.
   After code changes: `npm run build` again and click the ↻ reload icon on the extension card.
   (`npm run dev` also works and opens the demo page + Gmail, but Google sometimes blocks sign-in in that automated browser.)
3. Click the whoknows icon: it should say **Connected to backend** and **Detect hesitation** should be on.
4. **Gmail prep:** send yourself a mail from another account:
   - Subject: `Year-end bonus part-time employee`
   - Body: `Hi, does our part-time employee still get the year-end bonus under PC 200? Kind regards, Veerle`
5. Browser at 125% zoom, bookmarks bar hidden (`Ctrl+Shift+B`), no other tabs.
6. Do one test run of scene 2 before recording, then reload the Gmail tab (resets "dismissed" topics).

## Scenes

| # | What you do | What appears |
|---|---|---|
| 2 | Open the mail in Gmail → Reply. Type slowly: *"Thanks for your question about the year-end bonus for part-time employees under PC 200. I believe that"*. Stop. | After ~2.5 s the panel slides in: *"Looks like you're unsure · hedging: 'I believe' · paused mid-sentence"*. Sarah De Vos first. |
| 3 | Scroll the panel a bit. | Sarah: 2 weeks ago, 12× handled, 4 colleagues vouch. Tom Janssens: author of the original procedure, *not active since 2024*. |
| 3b | Click **Ask Sarah**, edit the prefilled question, **Send to Sarah**. | "Sent · waiting", "Sarah is typing…" after ~6 s, her answer after **10 s**. |
| 3c | Under her answer: **👍 Yes, vouch**. | "You vouched for Sarah" and her chip goes from 4 to **5 colleagues vouch**. |
| 3d | (Optional) Ask **Tom** instead. | Tom replies he hasn't worked on it since 2024 and points to Sarah. |
| 4 | Open <http://127.0.0.1:8000/demo/chat.html>, click the message box, press **Ctrl+Shift+K**. | Panel with Anouk van Dijk for *Notice period (Netherlands)*. |
| 4b | In the panel's question box type *"How are cross-border workers in Luxembourg taxed?"* + Enter. | **Knowledge gap** card + Marc Lemmens (stale since 2022). |
| opt | In any text field type *"I think the offsite should probably be in March"* and stop. | "Not sure? Ask who can help" nudge bottom-right. |

## Extra questions

Type these in the panel's question box, or as a reply in Gmail. Every expert can be asked, replies after 10 s, and can be vouched for.

| Question | Who comes up | Why it's a good demo |
|---|---|---|
| Can our employee swap his company car for the mobility budget? | Joris Vandenberghe (8 days ago, 4 vouches) | Clear specialist; also shows a second topic (company car) |
| Can I work remotely from Spain for three weeks? | Laura Gómez, then Kristof Hendrickx (stale) | Same fresh-vs-stale story as Sarah/Tom: Kristof wrote the old policy, replies he's out of date and points to Laura |
| Does the 30% ruling still apply to our new hire from Madrid? | Femke de Jong (NL) | Dutch expert; international angle |
| Do you know how the notice period works for our Dutch employees? | Anouk van Dijk | Chat scene |
| How do we reimburse charging an electric car at home? | Joris Vandenberghe | Recent (4 days ago) |
| We need to put staff on temporary unemployment next month, what do we do? | Bram Desmet | Belgian HR classic |
| Our UK starter has no P45, which tax code do we use? | Oliver Hughes (UK) | Shows payroll in more than one country |
| Is a candidate for the social elections protected against dismissal? | Lien Vermeersch, Kristof Hendrickx | |
| How are stock options taxed in Belgium? | Bram Desmet | |
| Do unused vakantiedagen expire in the Netherlands? | Thijs Visser, Femke de Jong | Dutch keywords work too |
| How are cross-border workers in Luxembourg taxed? | **Knowledge gap**, Marc Lemmens (stale since 2022) | Nobody fresh: whoknows says so instead of guessing |

Topics are recognised with EN + NL keywords (`backend/data/topics.json`), so phrase questions with the topic words (mobility budget, 30% ruling, P45, …).

Votes are kept in memory: **restart the backend right before recording** to reset them.

Backup if Gmail misbehaves: the same scene 2 works on <http://127.0.0.1:8000/demo/mail.html>.

## Tips

- If the panel doesn't open: close it with **Esc**, reload the tab, and type again. Or press **Ctrl+Shift+K** (always works).
- Closing the panel means "not now" for those topics in that field; the nudge shows instead. Reloading resets it.
- Opt-out check for the jury: Lotte Maes is a year-end bonus expert but opted out, so she never appears.
