export const MOVE_TYPES = Object.freeze([
  "high-risk", "scoop", "in-close", "head-down", "back-to-foe", "arm-extended",
  "standing-above", "mad-rush", "leg-extended", "behind-opponent", "hit-or-miss",
  "victim-below", "defensive"
]);

export const MOVE_TYPE_LABELS = Object.freeze({
  "high-risk": "High Risk",
  scoop: "Scoop",
  "in-close": "In Close",
  "head-down": "Head Down",
  "back-to-foe": "Back to Foe",
  "arm-extended": "Arm Extended",
  "standing-above": "Standing Above",
  "mad-rush": "Mad Rush",
  "leg-extended": "Leg Extended",
  "behind-opponent": "Behind Opponent",
  "hit-or-miss": "Hit or Miss",
  "victim-below": "Victim Below",
  defensive: "Defensive"
});

// Counter relationships are inspired by the original With Authority move-type layer.
// Known reference relationships preserved here include:
// - Mad Rush counters Hit or Miss / Leg Extended
// - Arm Extended counters Mad Rush
// - Hit or Miss counters High Risk / Mad Rush
// - Victim Below counters Head Down
// - Back to Foe counters Behind Opponent / In Close
// - Defensive (Duck-style) counters Arm Extended / Leg Extended
// The remaining links create a complete, narrow tactical matrix for the new game.
export const DEFAULT_COUNTERS_BY_TYPE = Object.freeze({
  "high-risk": [],
  scoop: ["in-close"],
  "in-close": ["scoop"],
  "head-down": [],
  "back-to-foe": ["behind-opponent", "in-close"],
  "arm-extended": ["mad-rush"],
  "standing-above": [],
  "mad-rush": ["hit-or-miss", "leg-extended"],
  "leg-extended": ["arm-extended"],
  "behind-opponent": [],
  "hit-or-miss": ["high-risk", "mad-rush"],
  "victim-below": ["head-down"],
  defensive: ["arm-extended", "leg-extended"]
});

const LEGACY_METHODS = new Set(["agility", "strike", "technical", "power", "submission"]);
const DEFENSIVE_NAMES = /\b(dodge|duck|reversal|scramble free|counter)\b/i;

export function inferMethod(options = {}) {
  if (options.method) return options.method;
  const req = options.requirements ?? {};
  const ranked = Object.entries(req).filter(([k]) => ["agility", "knowledge", "strength", "strike", "technical"].includes(k)).sort((a,b) => b[1]-a[1]);
  if (ranked.length) return ranked[0][0];
  if (options.moveType === "power") return "strength";
  if (["agility", "strike", "technical"].includes(options.moveType)) return options.moveType;
  if (options.moveType === "submission" || options.submission) return "technical";
  return "technical";
}

function hasAny(name, words) { return words.some(word => name.includes(word)); }

export function inferMoveType(id = "", name = "", options = {}) {
  if (MOVE_TYPES.includes(options.tacticalType)) return options.tacticalType;
  if (MOVE_TYPES.includes(options.moveType)) return options.moveType;
  const text = `${id} ${name}`.toLowerCase();
  if (options.defensiveOnly || DEFENSIVE_NAMES.test(name) || (options.counters?.length && (options.damage ?? 0) <= 0)) return "defensive";

  if (hasAny(text, ["dropkick", "crossbody", "flying shoulder", "missile", "suicide dive", "tope", "springboard clothesline"])) return "hit-or-miss";
  if (hasAny(text, ["moonsault", "splash", "diving", "top rope", "top-rope", "phoenix", "frog splash", "shooting star", "elbow drop", "knee drop"]) && (options.requiresPosture === "on-mat" || /diving|top rope|phoenix|moonsault|splash|frog/.test(text))) return "high-risk";
  if (hasAny(text, ["running clothesline", "clothesline", "lariat", "spear", "shoulder tackle", "running forearm", "flying clothesline", "lou thesz", "running knee", "drive-by"])) return "mad-rush";
  if (hasAny(text, ["arm drag", "jab", "drop-down punch", "punch", "right hand", "right hands", "uppercut", "chop", "forearm", "elbow smash", "bionic elbow"])) return "arm-extended";
  if (hasAny(text, ["superkick", "roundhouse", "high kick", "big boot", "enzuigiri", "kick to the gut", "kick", "stomp", "knee strike", "leg lariat"])) return "leg-extended";
  if (hasAny(text, ["german suplex", "back suplex", "reverse ddt", "rear", "from behind"])) return "behind-opponent";
  if (hasAny(text, ["headlock", "sleeper", "million dollar dream", "rear naked", "chinlock"])) return "back-to-foe";
  if (hasAny(text, ["ddt", "powerbomb", "piledriver", "pedigree", "stunner", "cross rhodes", "tombstone", "double arm ddt", "falcon arrow"])) return "victim-below";
  if (hasAny(text, ["bulldog", "neckbreaker", "snapmare", "guillotine", "mandible claw", "mr. socko", "anaconda", "hell's gate"])) return "head-down";
  if (options.requiresPosture === "on-mat" || hasAny(text, ["leg drop", "mudhole", "ground", "mounted", "elbow drop", "knee drop"])) return "standing-above";
  if (hasAny(text, ["bodyslam", "body slam", "powerslam", "samoan drop", "slam", "suplex", "backbreaker", "uranage", "chokeslam", "f-5", "f5", "gorilla press", "press drop", "fallaway", "spinebuster", "sidewalk", "bearhug"])) return "scoop";
  if (options.submission) return "in-close";
  return "in-close";
}

function reviewedDamageScale(options = {}) {
  const d = Number(options.damage ?? 0);
  if (d <= 0 || options.finisher || options.trademark || options.submission) return d;
  const cost = Number(options.cost ?? 0);
  if (cost <= 1) return 3;
  if (cost === 2) return Math.max(4, Math.min(5, d));
  if (cost === 3) return 5;
  if (cost === 4) return Math.max(7, Math.min(8, d));
  if (cost === 5) return Math.max(8, Math.min(9, d));
  if (cost === 6) return Math.max(10, Math.min(11, d));
  return Math.max(10, Math.min(12, d));
}

export function normalizeMoveOptions(id, name, options = {}) {
  options = { ...options, damage: reviewedDamageScale(options) };
  const method = inferMethod(options);
  const moveType = inferMoveType(id, name, options);
  const defensiveOnly = options.defensiveOnly ?? (moveType === "defensive" && (options.damage ?? 0) <= 0);

  let counters;
  if (Array.isArray(options.counterTypes)) counters = [...options.counterTypes];
  else if (Array.isArray(options.counters) && options.counters.some(v => MOVE_TYPES.includes(v))) counters = [...options.counters];
  else counters = [...(DEFAULT_COUNTERS_BY_TYPE[moveType] ?? [])];

  // Dedicated defensive pages get broader but still typed coverage.
  const lower = `${id} ${name}`.toLowerCase();
  if (moveType === "defensive") {
    if (lower.includes("duck")) counters = ["arm-extended", "leg-extended"];
    else if (lower.includes("dodge")) counters = ["mad-rush", "hit-or-miss", "high-risk"];
    else if (lower.includes("scramble")) counters = ["in-close", "head-down", "back-to-foe", "victim-below"];
    else counters = ["scoop", "in-close", "head-down", "back-to-foe", "behind-opponent", "victim-below"];
  }
  // Method-family counters such as Chain Wrestling and Duck are deliberately
  // broader by wrestling method, so they do not inherit an additional
  // positional counter list from the generic defensive-name inference.
  if ((options.counterMethods?.length ?? 0) > 0) counters = [];

  const cleaned = { ...options, method, moveType, counters, defensiveOnly };
  delete cleaned.tacticalType;
  delete cleaned.counterTypes;
  return cleaned;
}

export function isOffensiveMove(card) {
  return card?.kind === "move" && !card.defensiveOnly && ((card.damage ?? 0) > 0 || !!card.submission || !!card.finisher || (card.onConnect?.length ?? 0) > 0);
}

export function isCounterMove(card) {
  return card?.kind === "move" && (card.counters?.length ?? 0) > 0;
}
