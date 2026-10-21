/**
 * Marketing Engine + Content System (Week 4)
 *
 * Pure, directly-testable functions for:
 *  - A/B variant assignment (deterministic given a random number, so it can
 *    be unit-tested without mocking Math.random)
 *  - The static content library that powers /marketing's content system
 *
 * Exposed as window.MarketingEngine so the same code the pages render from
 * is exactly what the software tests call.
 */
(function () {
  // ---- Content system -----------------------------------------------
  // Lightweight static content library. A full CMS/admin UI is out of
  // scope this week (see Scope Cut) — this is real, finished copy, just
  // not editable through a UI yet.
  const CONTENT_LIBRARY = [
    {
      id: "breakup-text",
      tag: "Relationships",
      title: "How to end things over text without ghosting",
      blurb:
        "Ghosting feels easier in the moment, but it leaves the other person guessing. A short, direct message respects both of you more than silence does.",
    },
    {
      id: "late-rent",
      tag: "Roommates",
      title: "Telling a roommate their share is late — again",
      blurb:
        "The goal is a fixed date and a clear ask, not a lecture. Naming the pattern without piling on blame keeps the conversation solvable.",
    },
    {
      id: "friend-boundary",
      tag: "Friends",
      title: "Setting a boundary with a friend who overshares",
      blurb:
        "You can care about someone and still need a limit. Naming the specific behavior, not their character, is what makes a boundary stick.",
    },
    {
      id: "freelance-scope",
      tag: "Work",
      title: "Pushing back on scope creep from a client",
      blurb:
        "Saying no to extra work without a price tag trains clients to keep asking. A clear line between what was agreed and what's new protects the relationship.",
    },
  ];

  function getContentLibrary() {
    return CONTENT_LIBRARY.slice();
  }

  function getContentByTag(tag) {
    if (!tag || tag === "All") return getContentLibrary();
    return CONTENT_LIBRARY.filter((c) => c.tag === tag);
  }

  function getTags() {
    const tags = CONTENT_LIBRARY.map((c) => c.tag);
    return ["All", ...Array.from(new Set(tags))];
  }

  // ---- A/B testing -----------------------------------------------------
  // Pure function: given a random number in [0, 1), returns which variant
  // it maps to. Split at 0.5, variant 'b' owns the boundary itself so the
  // two halves are disjoint and exhaustive (tested below).
  function pickVariant(rand) {
    if (typeof rand !== "number" || rand < 0 || rand >= 1) {
      throw new Error("pickVariant expects a number in [0, 1)");
    }
    return rand < 0.5 ? "a" : "b";
  }

  // Assigns (and remembers for the session) a variant for a named test, so
  // the same visitor sees one consistent variant and so an impression and
  // a later conversion can be attributed to the same bucket.
  function getOrAssignVariant(testName) {
    const key = "sir_variant_" + testName;
    try {
      const existing = sessionStorage.getItem(key);
      if (existing === "a" || existing === "b") return existing;
      const assigned = pickVariant(Math.random());
      sessionStorage.setItem(key, assigned);
      return assigned;
    } catch (e) {
      // sessionStorage unavailable (private mode, etc.) — still works,
      // just without stickiness across reloads in that one session.
      return pickVariant(Math.random());
    }
  }

  window.MarketingEngine = {
    CONTENT_LIBRARY,
    getContentLibrary,
    getContentByTag,
    getTags,
    pickVariant,
    getOrAssignVariant,
  };
})();
