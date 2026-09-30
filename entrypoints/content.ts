import type { Message } from '@/utils/messages';

const BURST_THRESHOLD = 20; // deleted characters within the window
const WINDOW_MS = 5000;

export default defineContentScript({
  matches: ['<all_urls>'],
  allFrames: true,
  runAt: 'document_idle',
  main() {
    let deleted = 0;
    let windowStart = 0;

    document.addEventListener('beforeinput', (event) => {
      if (!(event instanceof InputEvent) || !event.inputType.startsWith('delete')) return;

      const now = Date.now();
      if (now - windowStart > WINDOW_MS) {
        windowStart = now;
        deleted = 0;
      }
      deleted++;

      if (deleted >= BURST_THRESHOLD) {
        const message: Message = { type: 'DELETION_BURST', url: location.href, deletedChars: deleted };
        browser.runtime.sendMessage(message);
        deleted = 0;
        windowStart = now;
      }
    }, true);
  },
});
