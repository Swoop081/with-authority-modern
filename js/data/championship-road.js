import { superstars } from "./superstars.js?v=0.13.36";

export const CHAMPIONSHIP_ROAD_LENGTH = 24;
export const CHAMPIONSHIP_SET_ID = "summerslam-series-1";
export const WORLD_CHAMPIONS = ["cm-punk", "roman-reigns"];
export const CHAMPIONSHIP_DIFFICULTY_ORDER = ["easy", "normal", "hard", "hardcore"];
export const CHAMPIONSHIP_DIFFICULTIES = Object.freeze({
  easy: { id: "easy", label: "Easy", hpModifier: -5, description: "Opponents start with 5 less HP." },
  normal: { id: "normal", label: "Normal", hpModifier: 0, description: "Opponents use their normal HP." },
  hard: { id: "hard", label: "Hard", hpModifier: 5, description: "Opponents start with 5 extra HP." },
  hardcore: { id: "hardcore", label: "Hardcore", hpModifier: 10, description: "Opponents start with 10 extra HP." }
});

export const CHAMPIONSHIP_ROAD_SECTIONS = Object.freeze([
  { id: "golden-era", label: "Golden Era", start: 1, end: 4, accent: "gold", setId: "hall-of-fame-series-1" },
  { id: "summerslam-a", label: "SummerSlam · Part I", start: 5, end: 8, accent: "blue", setId: "summerslam-series-1" },
  { id: "evolution-a", label: "Evolution · Part I", start: 9, end: 12, accent: "violet", setId: "evolution-series-1" },
  { id: "attitude-era", label: "Attitude Era", start: 13, end: 16, accent: "red", setId: "hall-of-fame-series-1" },
  { id: "summerslam-b", label: "SummerSlam · Part II", start: 17, end: 20, accent: "blue", setId: "summerslam-series-1" },
  { id: "evolution-b", label: "Evolution · Part II", start: 21, end: 24, accent: "violet", setId: "evolution-series-1" }
]);

export const CHAMPIONSHIP_ROAD_OPPONENTS = Object.freeze([
  "hulk-hogan", "andre-the-giant", "randy-savage", "ultimate-warrior",
  "cm-punk", "seth-rollins", "roman-reigns", "kevin-owens",
  "iyo-sky", "bayley", "paige", "stephanie-vaquer",
  "mankind", "kane", "the-undertaker", "stone-cold-steve-austin",
  "cody-rhodes", "oba-femi", "brock-lesnar", "gunther",
  "charlotte-flair", "rhea-ripley", "liv-morgan", "becky-lynch"
]);

// Retained as a compatibility export for older source/tests. Championship Road
// is now one continuous 24-match map rather than four selectable branches.
export const CHAMPIONSHIP_BRANCHES = Object.freeze({
  season1: { id: "season1", label: "Season 1 Road", setId: CHAMPIONSHIP_SET_ID, finals: ["rhea-ripley", "liv-morgan"] }
});
export const CHAMPIONSHIP_STAGES = Object.freeze(CHAMPIONSHIP_ROAD_OPPONENTS.map((_, i) => `Match ${i + 1}`));

function ensure(profile) {
  profile.championshipRoad ??= { activeRun: null, clears: 0, bestStage: 0, championshipPackCredits: 0, completedBy: [] };
  const state = profile.championshipRoad;
  state.clearsByDifficulty ??= {};
  state.bestStageByDifficulty ??= {};
  state.completedByDifficulty ??= {};
  state.unlockedDifficulties ??= ["easy"];
  state.selectedDifficulty ??= "easy";
  state.championshipPackCreditsBySet ??= {};
  state.championshipPackQueue ??= [];
  state.completedBy ??= [];
  // v0.13.23 and earlier used 4-match branch runs. Retire only the obsolete
  // in-progress run; historical clears/rewards remain untouched.
  if (state.activeRun && (!Array.isArray(state.activeRun.opponents) || state.activeRun.opponents.length !== CHAMPIONSHIP_ROAD_LENGTH)) state.activeRun = null;
  state.unlockedDifficulties = CHAMPIONSHIP_DIFFICULTY_ORDER.filter(id => id === "easy" || (state.unlockedDifficulties ?? []).includes(id));
  if (!state.unlockedDifficulties.includes("easy")) state.unlockedDifficulties.unshift("easy");
  return state;
}

function difficultyIndex(id) { return CHAMPIONSHIP_DIFFICULTY_ORDER.indexOf(id); }
export function championshipDifficultyUnlocked(profile, difficultyId) {
  const state = ensure(profile), idx = difficultyIndex(difficultyId);
  if (idx <= 0) return difficultyId === "easy";
  const previous = CHAMPIONSHIP_DIFFICULTY_ORDER[idx - 1];
  return (state.clearsByDifficulty?.[previous] ?? 0) > 0;
}
export function championshipRoadState(profile) {
  const state = ensure(profile);
  for (const id of CHAMPIONSHIP_DIFFICULTY_ORDER) if (championshipDifficultyUnlocked(profile, id) && !state.unlockedDifficulties.includes(id)) state.unlockedDifficulties.push(id);
  return state;
}
export function championshipRoadDifficultyModifier(difficultyId = "easy") {
  const difficulty = CHAMPIONSHIP_DIFFICULTIES[difficultyId] ?? CHAMPIONSHIP_DIFFICULTIES.easy;
  const modifier = { name: `Championship Road · ${difficulty.label}`, ruleText: difficulty.description };
  if (difficulty.hpModifier < 0) modifier.startingHpLoss = { p2: Math.abs(difficulty.hpModifier) };
  if (difficulty.hpModifier > 0) modifier.startingHpBonus = { p2: difficulty.hpModifier };
  return modifier;
}
export function championshipRoadSectionForStage(stage = 0) {
  const match = Math.max(1, Math.min(CHAMPIONSHIP_ROAD_LENGTH, Number(stage) + 1));
  return CHAMPIONSHIP_ROAD_SECTIONS.find(section => match >= section.start && match <= section.end) ?? CHAMPIONSHIP_ROAD_SECTIONS[0];
}
export function startChampionshipRoad(profile, superstarId, _opponentIds = [], _rng = Math.random, difficultyId = "easy") {
  const state = ensure(profile);
  if (!Object.values(superstars).some(star => star.id === superstarId)) throw new Error("Choose a valid Superstar for Championship Road");
  if (!CHAMPIONSHIP_DIFFICULTIES[difficultyId]) throw new Error("Unknown Championship Road difficulty");
  if (!championshipDifficultyUnlocked(profile, difficultyId)) throw new Error(`Complete ${CHAMPIONSHIP_DIFFICULTIES[CHAMPIONSHIP_DIFFICULTY_ORDER[difficultyIndex(difficultyId)-1]]?.label ?? "the previous difficulty"} first`);
  state.selectedDifficulty = difficultyId;
  state.activeRun = {
    superstarId,
    difficultyId,
    branchId: "season1",
    setId: CHAMPIONSHIP_SET_ID,
    opponents: [...CHAMPIONSHIP_ROAD_OPPONENTS],
    stage: 0,
    status: "active",
    startedAt: new Date().toISOString()
  };
  return state.activeRun;
}
export function currentChampionshipOpponent(profile) {
  const run = ensure(profile).activeRun;
  return !run || run.status !== "active" ? null : run.opponents[run.stage] ?? null;
}
export function recordChampionshipMatch(profile, result) {
  const state = ensure(profile), run = state.activeRun;
  if (!run || run.status !== "active") throw new Error("No active Championship Road run");
  if (result === "loss") return { status: "retry", run };
  if (result !== "win") throw new Error("Invalid Championship Road result");
  run.stage += 1;
  state.bestStage = Math.max(state.bestStage ?? 0, run.stage);
  state.bestStageByDifficulty[run.difficultyId] = Math.max(state.bestStageByDifficulty[run.difficultyId] ?? 0, run.stage);
  const completedSection = run.stage % 4 === 0 ? CHAMPIONSHIP_ROAD_SECTIONS.find(section => section.end === run.stage) ?? null : null;
  if (run.stage >= run.opponents.length) {
    run.status = "cleared";
    state.clears = (state.clears ?? 0) + 1;
    state.clearsByDifficulty[run.difficultyId] = (state.clearsByDifficulty[run.difficultyId] ?? 0) + 1;
    state.completedByDifficulty[run.difficultyId] ??= [];
    if (!state.completedByDifficulty[run.difficultyId].includes(run.superstarId)) state.completedByDifficulty[run.difficultyId].push(run.superstarId);
    const firstWithSuperstar = !state.completedBy.includes(run.superstarId);
    if (firstWithSuperstar) state.completedBy.push(run.superstarId);
    const idx = difficultyIndex(run.difficultyId), next = CHAMPIONSHIP_DIFFICULTY_ORDER[idx + 1];
    if (next && !state.unlockedDifficulties.includes(next)) state.unlockedDifficulties.push(next);
    const superPackSetId = completedSection?.setId ?? CHAMPIONSHIP_SET_ID;
    profile.superPackCreditsBySet ??= {};
    profile.superPackCreditsBySet[superPackSetId] = (profile.superPackCreditsBySet[superPackSetId] ?? 0) + 1;
    return { status: "cleared", run, championshipPackAwarded: false, superPackAwarded: true, superPackSetId, firstWithSuperstar, unlockedDifficulty: next ?? null, sectionCleared: completedSection };
  }
  return { status: "advance", run, sectionCleared: completedSection };
}
export function resetChampionshipRoad(profile) { ensure(profile).activeRun = null; return ensure(profile); }
