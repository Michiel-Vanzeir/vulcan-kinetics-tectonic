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
| 3b | Click **Ask Sarah**, edit the prefilled question, **Send to Sarah**. | "✓ Sent to Sarah". |
| 4 | Open <http://127.0.0.1:8000/demo/chat.html>, click the message box, press **Ctrl+Shift+K**. | Panel with Anouk van Dijk for *Notice period (Netherlands)*. |
| 4b | In the panel's question box type *"How are cross-border workers in Luxembourg taxed?"* + Enter. | **Knowledge gap** card + Marc Lemmens (stale since 2022). |
| opt | In any text field type *"I think the offsite should probably be in March"* and stop. | "Not sure? Ask who can help" nudge bottom-right. |

Backup if Gmail misbehaves: the same scene 2 works on <http://127.0.0.1:8000/demo/mail.html>.

## Tips

- If the panel doesn't open: close it with **Esc**, reload the tab, and type again. Or press **Ctrl+Shift+K** (always works).
- Closing the panel means "not now" for those topics in that field; the nudge shows instead. Reloading resets it.
- Opt-out check for the jury: Lotte Maes is a year-end bonus expert but opted out, so she never appears.
