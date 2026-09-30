import { useEffect, useState } from 'react';
import type { Message, Status } from '@/utils/messages';

export default function App() {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    const message: Message = { type: 'GET_STATUS' };
    browser.runtime.sendMessage(message).then(setStatus);
  }, []);

  return (
    <div style={{ padding: '20px', width: '300px' }}>
      <h1>Doubt Helper</h1>
      {status ? (
        <p>
          Deletion bursts detected: {status.deletionBursts}
          {status.lastUrl && <><br />Last on: {status.lastUrl}</>}
        </p>
      ) : (
        <p>Loading…</p>
      )}
    </div>
  );
}
