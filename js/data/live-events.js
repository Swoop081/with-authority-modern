export const LIVE_EVENT_LENGTH = 5;
export const LIVE_EVENT_WIN_UP = 50;
export const LIVE_EVENT_CLEAR_BOOSTERS = 1;

// Weekly rotation begins Monday 17 August 2026. The active event changes at
// local-device midnight each Monday so the countdown and rollover feel natural
// to the player regardless of timezone.
const ROTATION_EPOCH = { year: 2026, month: 7, day: 17 }; // JS month is zero-based.
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export const WEEKLY_LIVE_EVENTS = Object.freeze([
  {
    id: "powerhouse-collision",
    name: "Powerhouse Collision",
    kicker: "STRENGTH TAKES CENTRE STAGE",
    description: "Five escalating fights against WWE's heavy hitters.",
    method: "strength",
    heroId: "brock-lesnar",
    rewardSetId: "summerslam-series-1",
    opponentPool: ["andre-the-giant", "hulk-hogan", "roman-reigns", "kevin-owens", "kane", "the-undertaker", "ultimate-warrior", "rhea-ripley", "oba-femi", "brock-lesnar", "gunther"]
  },
  {
    id: "strike-zone",
    name: "Strike Zone",
    kicker: "HANDS UP · CHIN DOWN",
    description: "A weekly tower built around WWE's hardest strikers.",
    method: "strike",
    heroId: "mankind",
    rewardSetId: "hall-of-fame-series-1",
    opponentPool: ["mankind", "bayley", "cm-punk", "paige", "seth-rollins", "randy-savage", "stephanie-vaquer", "stone-cold-steve-austin", "gunther", "becky-lynch"]
  },
  {
    id: "technical-showcase",
    name: "Technical Showcase",
    kicker: "OUTWRESTLE THE BEST",
    description: "Five matches where ring IQ matters as much as damage.",
    method: "technical",
    heroId: "cm-punk",
    rewardSetId: "summerslam-series-1",
    opponentPool: ["cm-punk", "bayley", "paige", "stephanie-vaquer", "charlotte-flair", "cody-rhodes", "liv-morgan", "gunther", "becky-lynch", "randy-savage"]
  },
  {
    id: "high-flyers",
    name: "High Flyers",
    kicker: "TAKE THE FIGHT ABOVE THE ROPES",
    description: "Speed and Agility headline this week's five-match card.",
    method: "agility",
    heroId: "iyo-sky",
    rewardSetId: "evolution-series-1",
    opponentPool: ["iyo-sky", "seth-rollins", "randy-savage", "stephanie-vaquer", "charlotte-flair", "cody-rhodes", "liv-morgan", "kevin-owens", "rhea-ripley", "bayley"]
  },
  {
    id: "hall-of-fame-legends",
    name: "Hall of Fame Legends",
    kicker: "SURVIVE FIVE GENERATIONS OF GREATNESS",
    description: "A legends-only tower drawn from Hall of Fame Series 1.",
    method: "strength",
    heroId: "the-undertaker",
    rewardSetId: "hall-of-fame-series-1",
    opponentPool: ["mankind", "hulk-hogan", "andre-the-giant", "randy-savage", "kane", "the-undertaker", "ultimate-warrior", "stone-cold-steve-austin"]
  },
  {
    id: "evolution-night",
    name: "Evolution Night",
    kicker: "THE WOMEN'S DIVISION TAKES OVER",
    description: "Five fights through Evolution Series 1 competition.",
    method: "technical",
    heroId: "rhea-ripley",
    rewardSetId: "evolution-series-1",
    opponentPool: ["iyo-sky", "bayley", "paige", "stephanie-vaquer", "charlotte-flair", "rhea-ripley", "liv-morgan", "becky-lynch"]
  }
]);

const METHOD_LABELS = Object.freeze({ strength: "Strength", strike: "Strike", technical: "Technical", agility: "Agility" });

function localMonday(now = new Date()) {
  const d = now instanceof Date ? new Date(now.getTime()) : new Date(now);
  d.setHours(0, 0, 0, 0);
  const daysSinceMonday = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - daysSinceMonday);
  return d;
}

function localDateSerial(d) {
  return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
}

function dateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function liveEventRotation(now = new Date()) {
  const monday = localMonday(now);
  const epochSerial = Date.UTC(ROTATION_EPOCH.year, ROTATION_EPOCH.month, ROTATION_EPOCH.day);
  const weekIndex = Math.floor((localDateSerial(monday) - epochSerial) / WEEK_MS);
  const eventIndex = ((weekIndex % WEEKLY_LIVE_EVENTS.length) + WEEKLY_LIVE_EVENTS.length) % WEEKLY_LIVE_EVENTS.length;
  const nextAt = new Date(monday.getTime());
  nextAt.setDate(nextAt.getDate() + 7);
  const event = WEEKLY_LIVE_EVENTS[eventIndex];
  return {
    weekKey: dateKey(monday),
    weekIndex,
    eventIndex,
    event,
    startsAt: monday,
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
  if (state.clearedThisWeek) throw new Error("This week's Live Event is already complete.");
  if (state.activeRun?.status === "active") return state.activeRun;
  const eligible = new Set(eligibleOpponentIds ?? []);
  const themed = rotation.event.opponentPool.filter(id => eligible.has(id) && id !== superstarId);
  const fallback = (eligibleOpponentIds ?? []).filter(id => id !== superstarId && !themed.includes(id));
  const opponents = [...shuffle(themed, rng), ...shuffle(fallback, rng)].slice(0, LIVE_EVENT_LENGTH);
  if (opponents.length !== LIVE_EVENT_LENGTH) throw new Error("Not enough eligible opponents for this Weekly Live Event.");
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
  if (!run || run.status !== "active") throw new Error("No active Weekly Live Event run");
  if (result === "loss") return { status: "retry", run, stage: liveEventStage(rotation.event, run.stage) };
  if (result !== "win") throw new Error("Invalid Weekly Live Event result");
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
