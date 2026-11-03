/**
 * SayItRight — Guided Assistant Engine (Week 5)
 *
 * Pure, directly-testable functions for the /chat guided assistant:
 *  - checkGuardrail(text): blocks unsafe or off-topic free text before it
 *    reaches the generator, and explains why.
 *  - checkLength(text, max): a simple input-length guardrail.
 *  - checkRateLimit(lastSentAt, now, minGapMs): blocks rapid-fire submits.
 *  - advanceStep(current): the guided conversation's step order.
 *
 * Exposed as window.ChatEngine so the exact logic the chat UI runs is what
 * the software tests call directly.
 */
(function () {
  // ---- Guardrails ---------------------------------------------------------
  // Keyword-based, not AI-based — deliberately simple and auditable, same
  // "no external AI API, no API key, no cost" constraint as core-engine.js.
  const SAFETY_KEYWORDS = [
    "kill myself", "end my life", "suicide", "self harm", "self-harm",
    "hurt myself", "want to die", "kill him", "kill her", "kill them",
    "bomb", "weapon", "hurt someone", "shoot up",
  ];

  const OFF_TOPIC_KEYWORDS = [
    "write my essay", "write my homework", "do my homework", "solve this math",
    "write code for", "build me a website", "write a poem for class",
    "translate this to", "what's the weather", "stock price",
  ];

  /**
   * Checks free text against the guardrails before it's allowed to reach
   * the generator. Returns the first category that matches, or null.
   * @param {string} text
   * @returns {{blocked: boolean, category: ("safety"|"offtopic"|null), reason: (string|null)}}
   */
  function checkGuardrail(text) {
    const t = (text || "").toLowerCase();

    for (const kw of SAFETY_KEYWORDS) {
      if (t.includes(kw)) {
        return {
          blocked: true,
          category: "safety",
          reason:
            "I'm not able to help write that. If you're going through something heavy right now, it might help to talk to someone — a text or call to a crisis line is free and confidential.",
        };
      }
    }

    for (const kw of OFF_TOPIC_KEYWORDS) {
      if (t.includes(kw)) {
        return {
          blocked: true,
          category: "offtopic",
          reason:
            "That's outside what I'm built for — I only help write messages for hard conversations. Try describing a situation you need to say something about instead.",
        };
      }
    }

    return { blocked: false, category: null, reason: null };
  }

  /**
   * @param {string} text
   * @param {number} max
   * @returns {boolean} true if text is within the allowed length (and non-empty)
   */
  function checkLength(text, max) {
    const len = (text || "").trim().length;
    return len > 0 && len <= max;
  }

  /**
   * Rate limit: a new submission is only allowed if at least minGapMs have
   * passed since the last one. lastSentAt === null means no prior submit.
   * @param {number|null} lastSentAt
   * @param {number} now
   * @param {number} minGapMs
   * @returns {boolean} true if the submit is allowed
   */
  function checkRateLimit(lastSentAt, now, minGapMs) {
    if (lastSentAt === null || lastSentAt === undefined) return true;
    return now - lastSentAt >= minGapMs;
  }

  // ---- Guided conversation steps -------------------------------------------
  const STEPS = ["scenario", "tone", "context", "result"];

  /**
   * @param {string} current - one of STEPS
   * @returns {string} the next step; stays on "result" once reached
   */
  function advanceStep(current) {
    const idx = STEPS.indexOf(current);
    if (idx === -1) return STEPS[0];
    if (idx === STEPS.length - 1) return current;
    return STEPS[idx + 1];
  }

  window.ChatEngine = {
    SAFETY_KEYWORDS,
    OFF_TOPIC_KEYWORDS,
    STEPS,
    checkGuardrail,
    checkLength,
    checkRateLimit,
    advanceStep,
  };
})();
