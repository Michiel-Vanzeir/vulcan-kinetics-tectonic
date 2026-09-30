import type { Message, Status } from '@/utils/messages';

export default defineBackground(() => {
  const status: Status = { deletionBursts: 0, lastUrl: null };

  browser.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
    switch (message.type) {
      case 'DELETION_BURST':
        status.deletionBursts++;
        status.lastUrl = message.url;
        break;
      case 'GET_STATUS':
        sendResponse(status);
        break;
    }
  });
});
