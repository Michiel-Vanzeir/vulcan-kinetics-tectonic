(() => {
  // src/background.js
  var BACKEND_URL = "";
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.type !== "llm") return;
    (async () => {
      if (!BACKEND_URL) {
        sendResponse(JSON.stringify({
          keywords: [
            { term: "test keyword", weight: 1 },
            { term: "another topic", weight: 0.6 }
          ]
        }));
        return;
      }
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: msg.system, user: msg.user })
      });
      const data = await res.json();
      sendResponse(data.text);
    })();
    return true;
  });
})();
