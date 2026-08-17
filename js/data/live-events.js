export const LIVE_EVENT_LENGTH = 5;
export const LIVE_EVENT_WIN_UP = 50;
export const LIVE_EVENT_CLEAR_BOOSTERS = 1;

// v0.12.81 — Daily Live Events. The active event changes at local-device
// midnight every day so RAW / NXT / SmackDown can own their broadcast days
// while the remaining days use original WWE Legacy event identities.
export const DAILY_LIVE_EVENTS = Object.freeze({
  1: {
    id: "raw-live",
    dayLabel: "MONDAY",
    name: "RAW",
    kicker: "MONDAY NIGHT · RED BRAND LIVE",
    description: "Five escalating fights under the bright lights of Monday Night RAW.",
    method: "strike",
    heroId: "cm-punk",
    rewardSetId: "raw-series-1",
    logoMode: "raw",
    opponentPool: ["seth-rollins", "gunther", "kevin-owens", "cody-rhodes", "roman-reigns", "cm-punk", "brock-lesnar", "bayley"]
  },
  2: {
    id: "powerhouse-collision",
    dayLabel: "TUESDAY",
    name: "Powerhouse Collision",
    kicker: "STRENGTH TAKES CENTRE STAGE",
    description: "Five escalating fights against WWE's heavy hitters.",
    method: "strength",
    heroId: "brock-lesnar",
    rewardSetId: "summerslam-series-1",
    logoMode: "legacy",
    opponentPool: ["andre-the-giant", "hulk-hogan", "roman-reigns", "kevin-owens", "kane", "the-undertaker", "ultimate-warrior", "rhea-ripley", "oba-femi", "brock-lesnar", "gunther"]
  },
  3: {
    id: "nxt-rising",
    dayLabel: "WEDNESDAY",
    name: "NXT",
    kicker: "WEDNESDAY NIGHT · NEXT UP",
    description: "A five-match showcase built around tomorrow's standouts and breakout threats.",
    method: "agility",
    heroId: "oba-femi",
    rewardSetId: "summerslam-series-1",
    logoMode: "nxt",
    opponentPool: ["oba-femi", "stephanie-vaquer", "chelsea-green", "damian-priest", "tiffany-stratton", "finn-balor", "bron-breakker", "paige", "liv-morgan", "seth-rollins"]
  },
  4: {
    id: "technical-showcase",
    dayLabel: "THURSDAY",
    name: "Technical Showcase",
    kicker: "OUTWRESTLE THE BEST",
    description: "Five matches where ring IQ matters as much as damage.",
    method: "technical",
    heroId: "cm-punk",
    rewardSetId: "hall-of-fame-series-1",
    logoMode: "legacy",
    opponentPool: ["cm-punk", "bayley", "paige", "stephanie-vaquer", "charlotte-flair", "cody-rhodes", "liv-morgan", "gunther", "becky-lynch", "randy-savage"]
  },
  5: {
    id: "strike-zone",
    dayLabel: "FRIDAY",
    name: "Strike Zone",
    kicker: "HANDS UP · CHIN DOWN",
    description: "A daily tower built around WWE's hardest strikers.",
    method: "strike",
    heroId: "mankind",
    rewardSetId: "hall-of-fame-series-1",
    logoMode: "legacy",
    opponentPool: ["mankind", "bayley", "cm-punk", "paige", "seth-rollins", "randy-savage", "stephanie-vaquer", "stone-cold-steve-austin", "gunther", "becky-lynch"]
  },
  6: {
    id: "smackdown-showcase",
    dayLabel: "SATURDAY",
    name: "SmackDown",
    kicker: "SATURDAY NIGHT · BLUE BRAND",
    description: "Five escalating fights from the world of SmackDown.",
    method: "strength",
    heroId: "roman-reigns",
    rewardSetId: "smackdown-series-1",
    logoMode: "smackdown",
    opponentPool: ["roman-reigns", "cody-rhodes", "la-knight", "randy-orton", "charlotte-flair", "solo-sikoa", "kevin-owens", "the-rock"]
  },
  0: {
    id: "evolution-night",
    dayLabel: "SUNDAY",
    name: "Evolution Night",
    kicker: "THE WOMEN'S DIVISION TAKES OVER",
    description: "Five fights through Evolution Series 1 competition.",
    method: "technical",
    heroId: "rhea-ripley",
    rewardSetId: "evolution-series-1",
    logoMode: "legacy",
    opponentPool: ["iyo-sky", "bayley", "paige", "stephanie-vaquer", "charlotte-flair", "rhea-ripley", "liv-morgan", "becky-lynch"]
  }
});

export const WEEKLY_LIVE_EVENTS = Object.freeze(Object.values(DAILY_LIVE_EVENTS));

const METHOD_LABELS = Object.freeze({ strength: "Strength", strike: "Strike", technical: "Technical", agility: "Agility" });

function localDayStart(now = new Date()) {
  const d = now instanceof Date ? new Date(now.getTime()) : new Date(now);
  d.setHours(0, 0, 0, 0);
  return d;
}

function dateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function liveEventRotation(now = new Date()) {
  const start = localDayStart(now);
  const event = DAILY_LIVE_EVENTS[start.getDay()] ?? DAILY_LIVE_EVENTS[1];
  const nextAt = new Date(start.getTime());
  nextAt.setDate(nextAt.getDate() + 1);
  const dayKey = dateKey(start);
  return {
    weekKey: dayKey,
    dayKey,
    dayIndex: start.getDay(),
    event,
    startsAt: start,
    nextAt,
    msRemaining: Math.max(0, nextAt.getTime() - (now instanceof Date ? now.getTime() : new Date(now).getTime()))
  };
}

function ensure(profile, now = new Date()) {
  profile.weeklyLiveEvents ??= {
    weekKey: null,
    eventId: null,
    activeRun: null,
    clearedThisWeek: false,
    totalClears: 0,
    bestStage: 0,
    completedWeeks: []
  };
  const state = profile.weeklyLiveEvents;
  state.totalClears ??= 0;
  state.bestStage ??= 0;
  state.completedWeeks ??= [];
  const rotation = liveEventRotation(now);
  if (state.weekKey !== rotation.weekKey || state.eventId !== rotation.event.id) {
    state.weekKey = rotation.weekKey;
    state.eventId = rotation.event.id;
    state.activeRun = null;
    state.clearedThisWeek = false;
  }
  return { state, rotation };
}

function shuffle(values, rng = Math.random) {
  const out = [...values];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function weeklyLiveEventState(profile, now = new Date()) {
  return ensure(profile, now).state;
}

export function currentWeeklyLiveEvent(now = new Date()) {
  return liveEventRotation(now).event;
}

export function liveEventStage(event, stageIndex) {
  const index = Math.max(0, Math.min(LIVE_EVENT_LENGTH - 1, Number(stageIndex) || 0));
  const method = event?.method ?? "strength";
  const methodLabel = METHOD_LABELS[method] ?? method;
  const stages = [
    { label: "Opening Bout", ruleName: "Standard Rules", ruleText: "No event modifier.", modifier: null },
    { label: "Hot Start", ruleName: `${methodLabel} Advantage`, ruleText: `Opponent begins with +1 ${methodLabel} Momentum.`, modifier: { startingMomentum: { p2: { [method]: 1 } } } },
    { label: "Main Event Pressure", ruleName: "Crowd Momentum", ruleText: "Opponent begins with +1 Adrenaline.", modifier: { startingAdrenaline: { p2: 1 } } },
    { label: "Against the Odds", ruleName: "Pre-Match Damage", ruleText: "You begin the match 4 HP down.", modifier: { startingHpLoss: { p1: 4 } } },
    { label: "Tower Final", ruleName: "Final Boss Pressure", ruleText: `Opponent begins with +1 ${methodLabel} Momentum and +1 Adrenaline.`, modifier: { startingMomentum: { p2: { [method]: 1 } }, startingAdrenaline: { p2: 1 } } }
  ];
  return { index, ...stages[index] };
}

export function startWeeklyLiveEvent(profile, superstarId, eligibleOpponentIds, rng = Math.random, now = new Date()) {
  const { state, rotation } = ensure(profile, now);
  if (state.clearedThisWeek) throw new Error("Today's Live Event is already complete.");
  if (state.activeRun?.status === "active") return state.activeRun;
  const eligible = new Set(eligibleOpponentIds ?? []);
  const themed = rotation.event.opponentPool.filter(id => eligible.has(id) && id !== superstarId);
  const fallback = (eligibleOpponentIds ?? []).filter(id => id !== superstarId && !themed.includes(id));
  const opponents = [...shuffle(themed, rng), ...shuffle(fallback, rng)].slice(0, LIVE_EVENT_LENGTH);
  if (opponents.length !== LIVE_EVENT_LENGTH) throw new Error("Not enough eligible opponents for this Live Event.");
  state.activeRun = {
    weekKey: rotation.weekKey,
    eventId: rotation.event.id,
    superstarId,
    rewardSetId: rotation.event.rewardSetId,
    opponents,
    stage: 0,
    status: "active",
    startedAt: new Date().toISOString()
  };
  return state.activeRun;
}

export function currentWeeklyLiveEventOpponent(profile, now = new Date()) {
  const { state } = ensure(profile, now);
  const run = state.activeRun;
  return !run || run.status !== "active" ? null : run.opponents[run.stage] ?? null;
}

export function currentWeeklyLiveEventStage(profile, now = new Date()) {
  const { state, rotation } = ensure(profile, now);
  const run = state.activeRun;
  return liveEventStage(rotation.event, run?.stage ?? 0);
}

export function recordWeeklyLiveEventMatch(profile, result, now = new Date()) {
  const { state, rotation } = ensure(profile, now);
  const run = state.activeRun;
  if (!run || run.status !== "active") throw new Error("No active Live Event run");
  if (result === "loss") return { status: "retry", run, stage: liveEventStage(rotation.event, run.stage) };
  if (result !== "win") throw new Error("Invalid Live Event result");
  run.stage += 1;
  state.bestStage = Math.max(state.bestStage ?? 0, run.stage);
  if (run.stage >= LIVE_EVENT_LENGTH) {
    run.status = "cleared";
    state.clearedThisWeek = true;
    state.totalClears = (state.totalClears ?? 0) + 1;
    if (!state.completedWeeks.includes(rotation.weekKey)) state.completedWeeks.push(rotation.weekKey);
    return { status: "cleared", run, event: rotation.event };
  }
  return { status: "advance", run, stage: liveEventStage(rotation.event, run.stage) };
}
