(() => {
  // src/doubt-detector.ts
  var HEDGE = /\b(i think|i guess|i believe|i suppose|maybe|perhaps|probably|not sure|i'm not sure|kind of|sort of|somehow|ik denk|denk ik|misschien|volgens mij|ik weet niet|waarschijnlijk)[\s,.]$/i;
  var STRONG = /(\?\?|\?!|!\?)$/;
  var TAIL_CHARS = 600;
  var BURST_GAP_MS = 1500;
  var DoubtDetector = class {
    o;
    events = [];
    drafts = [];
    lastTrigger = 0;
    pauseTimer;
    burstTimer;
    inBurst = false;
    target;
    constructor(opts) {
      this.o = { windowMs: 75e3, threshold: 0.55, cooldownMs: 3e5, pauseMs: 6e3, ...opts };
    }
    start() {
      document.addEventListener("beforeinput", this.onBeforeInput, true);
    }
    stop() {
      document.removeEventListener("beforeinput", this.onBeforeInput, true);
      clearTimeout(this.pauseTimer);
      clearTimeout(this.burstTimer);
    }
    // ---------- event capture ----------
    onBeforeInput = (e) => {
      const el = e.composedPath()[0];
      if (!isEditable(el)) return;
      this.target = el;
      const now = performance.now();
      if (e.inputType.startsWith("delete") || e.inputType === "historyUndo") {
        if (!this.inBurst) {
          this.inBurst = true;
          const tail = lastSentence(textBeforeCaret(el));
          if (tail.length > 10) this.drafts = [...this.drafts, tail].slice(-5);
        }
        clearTimeout(this.burstTimer);
        this.burstTimer = window.setTimeout(() => this.inBurst = false, BURST_GAP_MS);
        this.events.push({ t: now, type: "delete", len: deletedLength(e, el) });
      } else if (e.inputType.startsWith("insert")) {
        this.events.push({ t: now, type: "insert", len: e.data?.length ?? 1 });
        const justTyped = textBeforeCaret(el).slice(-60) + (e.data ?? "");
        if (STRONG.test(justTyped)) this.events.push({ t: now, type: "strong", len: 0 });
        else if (HEDGE.test(justTyped)) this.events.push({ t: now, type: "hedge", len: 0 });
      } else return;
      this.armPauseTimer();
      this.evaluate(now);
    };
    armPauseTimer() {
      clearTimeout(this.pauseTimer);
      this.pauseTimer = window.setTimeout(() => {
        if (!this.target) return;
        const text = textBeforeCaret(this.target).trimEnd();
        if (text && !/[.!?…]["')\]]?$/.test(text)) {
          const now = performance.now();
          this.events.push({ t: now, type: "pause", len: 0 });
          this.evaluate(now);
        }
      }, this.o.pauseMs);
    }
    // ---------- scoring ----------
    evaluate(now) {
      this.events = this.events.filter((e) => now - e.t <= this.o.windowMs);
      if (now - this.lastTrigger < this.o.cooldownMs || !this.target) return;
      const score = this.score();
      if (score >= this.o.threshold) {
        this.lastTrigger = now;
        const ctx = {
          recentText: textBeforeCaret(this.target).slice(-TAIL_CHARS),
          abandonedDrafts: this.drafts,
          score
        };
        this.drafts = [];
        this.events = [];
        this.o.onDoubt(ctx);
      }
    }
    score() {
      let typed = 0, deleted = 0, pauses = 0, bursts = 0, hedges = 0, strong = 0, lastDel = -Infinity;
      for (const e of this.events) {
        if (e.type === "insert") typed += e.len;
        else if (e.type === "pause") pauses++;
        else if (e.type === "hedge") hedges++;
        else if (e.type === "strong") strong++;
        else {
          deleted += e.len;
          if (e.t - lastDel > BURST_GAP_MS) bursts++;
          lastDel = e.t;
        }
      }
      if (strong > 0) return 1;
      let behaviour = 0;
      if (typed + deleted >= 40) {
        const ratio = deleted / (typed + deleted);
        behaviour = 0.4 * Math.min(ratio / 0.5, 1) + // heavy deleting
        0.3 * Math.min(bursts / 4, 1) + // repeated rewrite attempts
        0.3 * Math.min(pauses / 3, 1);
      }
      return Math.min(1, behaviour + 0.25 * hedges);
    }
  };
  function isEditable(el) {
    if (!el) return false;
    if (el instanceof HTMLInputElement) {
      return ["text", "search", ""].includes(el.type) && el.autocomplete !== "off-sensitive";
    }
    return el instanceof HTMLTextAreaElement || el.isContentEditable;
  }
  function textBeforeCaret(el) {
    if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
      return el.value.slice(0, el.selectionStart ?? el.value.length);
    }
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return "";
    const r = document.createRange();
    r.selectNodeContents(el);
    r.setEnd(sel.getRangeAt(0).startContainer, sel.getRangeAt(0).startOffset);
    return r.toString();
  }
  function deletedLength(e, el) {
    if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
      const s = el.selectionStart ?? 0, n = el.selectionEnd ?? 0;
      if (n > s) return n - s;
      if (e.inputType === "deleteWordBackward") return Math.max(1, /\S+\s*$/.exec(el.value.slice(0, s))?.[0].length ?? 1);
      return 1;
    }
    const r = e.getTargetRanges?.()[0];
    if (r) {
      const range = document.createRange();
      range.setStart(r.startContainer, r.startOffset);
      range.setEnd(r.endContainer, r.endOffset);
      return Math.max(1, range.toString().length);
    }
    return 1;
  }
  function lastSentence(text) {
    const seg = [...new Intl.Segmenter(void 0, { granularity: "sentence" }).segment(text)];
    return (seg.at(-1)?.segment ?? "").trim();
  }

  // src/keywords.ts
  var MAX_KEYWORDS = 8;
  var MIN_WEIGHT = 0.2;
  function lastSentences(text, n = 3) {
    const seg = [...new Intl.Segmenter(void 0, { granularity: "sentence" }).segment(text)];
    return seg.slice(-n).map((s) => s.segment.trim()).join(" ");
  }
  var SYSTEM = `You extract topic keywords from a person's unfinished writing so that an expert on the topic can be found.
The writer seems unsure about what they are writing. Return ONLY JSON, no prose, no code fences:
{"keywords":[{"term":"...","weight":0.0}]}
Rules:
- At most ${MAX_KEYWORDS} keywords. Prefer specific nouns / noun phrases / technical terms over generic words.
- weight is 0..1: how central the term is to what the writer is struggling with.
- If a vocabulary list is given, use those exact terms whenever one fits; only invent a term if nothing fits.
- Hedging phrases ("I think", "maybe", "not sure", "??") mark the uncertain part: weight the topic of that sentence higher.
- Ignore names of the writer, greetings, and filler.`;
  function buildPrompt(ctx, vocabulary) {
    return [
      `Current text (last sentences):
${lastSentences(ctx.recentText)}`,
      ctx.abandonedDrafts.length ? `Versions the writer deleted (they reveal what they are unsure about):
- ${ctx.abandonedDrafts.join("\n- ")}` : "",
      vocabulary?.length ? `Vocabulary:
${vocabulary.join(", ")}` : ""
    ].filter(Boolean).join("\n\n");
  }
  function parseKeywords(raw) {
    try {
      const json = JSON.parse(raw.replace(/```json|```/g, "").trim());
      return (json.keywords ?? []).filter((k) => typeof k?.term === "string").map((k) => ({
        term: k.term.toLowerCase().trim(),
        weight: Math.min(1, Math.max(0, Number(k.weight) || 0))
      }));
    } catch {
      return [];
    }
  }
  function reweight(kws, ctx) {
    const deleted = ctx.abandonedDrafts.join(" ").toLowerCase();
    const recent = lastSentences(ctx.recentText, 1).toLowerCase();
    const merged = /* @__PURE__ */ new Map();
    for (const k of kws) {
      let w = k.weight;
      if (deleted.includes(k.term)) w *= 1.25;
      if (recent.includes(k.term)) w *= 1.1;
      merged.set(k.term, Math.max(merged.get(k.term) ?? 0, w));
    }
    const max = Math.max(...merged.values(), 1e-4);
    return [...merged].map(([term, w]) => ({ term, weight: +(w / max).toFixed(2) })).filter((k) => k.weight >= MIN_WEIGHT).sort((a, b) => b.weight - a.weight).slice(0, MAX_KEYWORDS);
  }
  async function extractKeywords(ctx, callLLM2, vocabulary) {
    const raw = await callLLM2(SYSTEM, buildPrompt(ctx, vocabulary));
    return reweight(parseKeywords(raw), ctx);
  }
  function init(callLLM2, handOff2, vocabulary) {
    const detector = new DoubtDetector({
      onDoubt: async (ctx) => {
        const keywords = await extractKeywords(ctx, callLLM2, vocabulary);
        if (keywords.length) await handOff2(keywords);
      }
    });
    detector.start();
    return detector;
  }

  // src/content.ts
  var callLLM = (system, user) => chrome.runtime.sendMessage({ type: "llm", system, user });
  async function handOff(keywords) {
    console.log("[Doubt Helper] Keywords for the next person:", keywords);
  }
  init(callLLM, handOff);
  console.log("[Doubt Helper] is watching this page");
})();
