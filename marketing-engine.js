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

  // ---- Persona ---------------------------------------------------------
  const PERSONA = {
    name: "Jordan Reyes",
    age: 26,
    role: "Remote customer-support lead, splits a 2-bedroom apartment with a roommate",
    summary:
      "Jordan avoids conflict until it's unavoidable. They've rehearsed hard conversations in the shower and then said something completely different out loud.",
    goals: [
      "Say the actual thing, not a softened version that gets ignored",
      "Not come across as cold, dramatic, or like they're picking a fight",
      "Get it over with in one message instead of three anxious drafts",
    ],
    frustrations: [
      "Generic \"difficult conversation\" templates online read like HR memos, not like a person",
      "Chatbots either over-apologize on their behalf or sound like a legal letter",
      "They've deleted more drafts than they've sent",
    ],
    quote: "“I know what I want to say. I just can't find the version of it that won't blow things up.”",
  };

  // ---- Brand system ------------------------------------------------------
  const BRAND_SYSTEM = {
    voice: [
      "Direct, not blunt — say the real thing in the fewest words that still sound human.",
      "Warm, not soft — acknowledge the other person without apologizing for having a boundary.",
      "Concrete, not generic — name the specific behavior or date, never \"communication issues.\"",
    ],
    voiceDont: "Never corporate (\"per my last message\"), never therapy-speak (\"I feel a disconnect\"), never passive-aggressive.",
    colors: [
      { name: "Primary", hex: "#2563eb", use: "CTAs, links, active states" },
      { name: "Accent", hex: "#0ea5e9", use: "Highlights, tags, secondary emphasis" },
      { name: "Ink", hex: "#0f172a", use: "Body text, headings" },
      { name: "Muted", hex: "#475569", use: "Secondary text, captions" },
    ],
    typography: "System sans-serif stack (-apple-system, Segoe UI, Roboto). Headings bold and tight (-0.02em letter-spacing); body at 1.5 line-height for readability under stress.",
    logo: "💬 emoji mark + “SayItRight” wordmark, always lowercase body copy around it.",
  };

  // ---- Landing copy (canonical, not an A/B variant) ---------------------
  const LANDING_COPY = {
    headline: "The exact message for the conversation you don't want to write yourself.",
    subhead: "Pick the awkward situation and the tone, and get the exact text ready to copy and send.",
    valueProps: [
      "Real, testable generation — not a canned template library",
      "Built from actual validation: real people confirmed this problem on our research page",
      "Free to start, upgrade only if you're sending this many messages a month",
    ],
    cta: "Join the waitlist",
  };

  // ---- Social posts (10) -------------------------------------------------
  const SOCIAL_POSTS = [
    { id: "sp-1", platform: "Twitter/X", goal: "Awareness", text: "You've rewritten that text four times and it still sounds wrong. That's not a you problem — hard conversations don't have a natural first draft. SayItRight writes the first one for you. → sayitrightsite.vercel.app" },
    { id: "sp-2", platform: "Instagram", goal: "Awareness", text: "POV: it's 11pm, you're staring at a blank text to your roommate about rent, and you've typed “hey so” four times. We built this for exactly that moment. Link in bio." },
    { id: "sp-3", platform: "LinkedIn", goal: "Consideration", text: "Scope creep from a client is a conversation most freelancers avoid until it's too late. We validated this with real freelancers before building anything — turns out the hard part isn't knowing you should push back, it's finding the words. That's what SayItRight generates." },
    { id: "sp-4", platform: "TikTok caption", goal: "Awareness", text: "telling my roommate their rent is late... again (SayItRight wrote this one, not me) #roommateproblems #adulting" },
    { id: "sp-5", platform: "Twitter/X", goal: "Conversion", text: "Free tier, no account needed, no card: pick a situation, pick a tone, get a message. Try it before you overthink your next hard text. sayitrightsite.vercel.app/core" },
    { id: "sp-6", platform: "Instagram", goal: "Consideration", text: "We asked people if they struggle to find the right words for hard conversations before writing a single line of code. The answer was an overwhelming yes — here's what we built because of it." },
    { id: "sp-7", platform: "LinkedIn", goal: "Awareness", text: "Ending a freelance relationship, pushing back on scope, setting a boundary with a friend — none of these have a natural script. SayItRight is a message generator built specifically for the conversations templates don't cover." },
    { id: "sp-8", platform: "Twitter/X", goal: "Consideration", text: "Ghosting isn't kinder, it's just quieter. A short, direct message respects both people more than silence. Here's one we generated in 4 seconds: [example]." },
    { id: "sp-9", platform: "TikTok caption", goal: "Conversion", text: "the message I actually sent my friend about her oversharing (SayItRight helped me not sound like a jerk) — try it free, link in bio" },
    { id: "sp-10", platform: "Instagram", goal: "Conversion", text: "Three tiers, one free forever. See exactly which plan fits how often you'd use this — live calculator, no sales call. sayitrightsite.vercel.app/pricing" },
  ];

  // ---- Video scripts (3) --------------------------------------------------
  const VIDEO_SCRIPTS = [
    {
      id: "vs-1",
      title: "The roommate rent text (18s)",
      script:
        "HOOK (0-3s): “The text you've been avoiding sending your roommate for a week.”\n" +
        "BODY (3-13s): Show a phone screen, cursor blinking on an empty message. Cut to typing “hey so” and deleting it three times. Overlay text: “We built a generator for exactly this.” Show SayItRight's /core page: pick “Late rent” + “Direct but kind” tone, message appears instantly.\n" +
        "CTA (13-18s): “Free, no account. Link in bio.” Logo + URL on screen.",
    },
    {
      id: "vs-2",
      title: "Three drafts, one send (22s)",
      script:
        "HOOK (0-3s): “I wrote this breakup text three different ways.”\n" +
        "BODY (3-17s): Split-screen: draft 1 (too harsh), draft 2 (too vague), draft 3 (generated by SayItRight — direct, kind, actually says the thing). Voiceover: “The problem was never knowing what I wanted to say. It was finding the version that wouldn't blow things up.”\n" +
        "CTA (17-22s): “Pick a situation, pick a tone, see the message. sayitrightsite.vercel.app”",
    },
    {
      id: "vs-3",
      title: "Freelancer scope creep (20s)",
      script:
        "HOOK (0-3s): “Your client just asked for ‘one more small thing’ for the fourth time this month.”\n" +
        "BODY (3-15s): Freelancer at a laptop, visibly deciding whether to say something. Cut to SayItRight generating a message that names the pattern without sounding confrontational. Text overlay: “Validated with real freelancers before we built this.”\n" +
        "CTA (15-20s): “Try the generator free. Link in bio.”",
    },
  ];

  // ---- 14-day campaign calendar -------------------------------------------
  const CAMPAIGN_CALENDAR = [
    { day: 1, platform: "Twitter/X", goal: "Awareness", content: "sp-1" },
    { day: 2, platform: "Instagram", goal: "Awareness", content: "sp-2" },
    { day: 3, platform: "—", goal: "Awareness", content: "vs-1" },
    { day: 4, platform: "LinkedIn", goal: "Consideration", content: "sp-3" },
    { day: 5, platform: "TikTok", goal: "Awareness", content: "sp-4" },
    { day: 6, platform: "—", goal: "Rest day / monitor engagement", content: null },
    { day: 7, platform: "Twitter/X", goal: "Conversion", content: "sp-5" },
    { day: 8, platform: "Instagram", goal: "Consideration", content: "sp-6" },
    { day: 9, platform: "—", goal: "Consideration", content: "vs-2" },
    { day: 10, platform: "LinkedIn", goal: "Awareness", content: "sp-7" },
    { day: 11, platform: "Twitter/X", goal: "Consideration", content: "sp-8" },
    { day: 12, platform: "—", goal: "Conversion", content: "vs-3" },
    { day: 13, platform: "TikTok", goal: "Conversion", content: "sp-9" },
    { day: 14, platform: "Instagram", goal: "Conversion", content: "sp-10" },
  ];

  function getContentById(id) {
    return (
      SOCIAL_POSTS.find((p) => p.id === id) ||
      VIDEO_SCRIPTS.find((v) => v.id === id) ||
      null
    );
  }

  window.MarketingEngine = {
    CONTENT_LIBRARY,
    getContentLibrary,
    getContentByTag,
    getTags,
    pickVariant,
    getOrAssignVariant,
    PERSONA,
    BRAND_SYSTEM,
    LANDING_COPY,
    SOCIAL_POSTS,
    VIDEO_SCRIPTS,
    CAMPAIGN_CALENDAR,
    getContentById,
  };
})();
