/**
 * SayItRight — Generative Core Engine
 * ------------------------------------
 * This is a rule-based / combinatorial text generator (no external AI API,
 * no API key, no cost). It is "generative" in the literal sense: it does
 * NOT return one fixed string per (situation, tone) pair. Instead it
 * assembles a message at request time from independent building blocks
 * (opener, core ask, tone modifier, closer), each with several phrasing
 * variants chosen at random. Same inputs can produce different, still
 * coherent, output on each generation — which is also what the Test Plan
 * checks for (see TEST_PLAN.md).
 *
 * Architecture: pure client-side JS, no backend server required.
 * Data flow: user input -> generate() -> rendered message -> (optional)
 * logged to Supabase via a direct REST insert (no SDK, no build step).
 */

const SCENARIOS = {
  raise: {
    label: "Ask for a raise",
    core: [
      "I wanted to talk about my compensation — based on what I've taken on this year, I think a raise is fair.",
      "I'd like to revisit my salary. Given my contributions over the past months, I believe an increase is warranted.",
      "Can we set time aside to discuss adjusting my pay? I think my current responsibilities justify it."
    ]
  },
  cancel: {
    label: "Cancel plans with a friend",
    core: [
      "I'm not going to be able to make it to {context} anymore.",
      "I need to back out of {context} — I know it's short notice.",
      "I have to cancel on {context}, sorry for the change of plans."
    ]
  },
  neighbor: {
    label: "Complain to a noisy neighbor",
    core: [
      "The noise from your place has been making it hard to {context} — could we find a solution?",
      "I wanted to mention that the sound coming from your unit has been disruptive, especially around {context}.",
      "I need to bring up the noise level — it's been affecting {context} on my end."
    ]
  },
  boundary: {
    label: "Set a boundary with a client",
    core: [
      "I want to be upfront: {context} isn't something I can keep doing without it affecting the quality of the work.",
      "Going forward, I won't be able to accommodate {context} — I want to set that expectation clearly.",
      "I need to draw a line around {context} so we can keep this working well for both of us."
    ]
  },
  breakup: {
    label: "End a relationship",
    core: [
      "I've been thinking about us, and I don't think this is working for me anymore.",
      "I need to be honest — I don't see this relationship continuing the way it has been.",
      "This isn't easy to say, but I think we should end things."
    ]
  },
  roommate: {
    label: "Ask a roommate to pay on time",
    core: [
      "I wanted to bring up rent — it's been arriving late a few times now, and I need it on time going forward.",
      "Can we talk about payments? I need the rent/bills to come in on the agreed date from now on.",
      "I need to flag that payments have been late — let's figure out a way to keep it on schedule."
    ]
  }
};

const TONES = {
  direct: {
    label: "Direct",
    openers: ["Straight to the point:", "I'll keep this simple.", "Let's get right into it."],
    closers: ["Let me know your thoughts.", "Open to talking whenever works.", "Let's find a time to sort this out."]
  },
  friendly: {
    label: "Friendly",
    openers: ["Hey, hope you're doing well!", "Hi! Quick thing I wanted to bring up —", "So this might be a bit awkward, but here goes:"],
    closers: ["No rush, just wanted to put it out there 🙂", "Thanks for hearing me out!", "Appreciate you reading this all the way through."]
  },
  firm: {
    label: "Firm",
    openers: ["I need to be clear about something.", "This isn't up for much debate, but I want to explain:", "I want to state this plainly."],
    closers: ["I'd appreciate it being respected going forward.", "This is important to me, so please take it seriously.", "I expect this to be the last time I have to bring it up."]
  },
  funny: {
    label: "Funny (light)",
    openers: ["Okay, deep breath, here we go 😅", "Plot twist incoming:", "So, funny story (not really, but let's pretend) —"],
    closers: ["Anyway, that's the tea ☕", "No hard feelings, promise!", "Let's laugh about this later, okay?"]
  }
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate a message.
 * @param {Object} opts
 * @param {string} opts.scenarioKey - key into SCENARIOS, or "custom"
 * @param {string} opts.customText - free text used when scenarioKey === "custom"
 * @param {string} opts.context - optional extra detail (e.g. "the dinner on Friday")
 * @param {string} opts.toneKey - key into TONES
 * @returns {{message: string, scenarioLabel: string, toneLabel: string}}
 */
function generateMessage({ scenarioKey, customText, context, toneKey }) {
  const tone = TONES[toneKey] || TONES.direct;
  const opener = pick(tone.openers);
  const closer = pick(tone.closers);

  let coreLine;
  let scenarioLabel;

  if (scenarioKey === "custom" && customText && customText.trim()) {
    coreLine = customText.trim();
    scenarioLabel = "Custom situation";
  } else {
    const scenario = SCENARIOS[scenarioKey] || SCENARIOS.raise;
    scenarioLabel = scenario.label;
    let template = pick(scenario.core);
    coreLine = template.replace("{context}", context && context.trim() ? context.trim() : "that");
  }

  const message = `${opener} ${coreLine} ${closer}`;
  return { message, scenarioLabel, toneLabel: tone.label };
}

// Expose for core.html
window.SayItRightCore = { SCENARIOS, TONES, generateMessage };
