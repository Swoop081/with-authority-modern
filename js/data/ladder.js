import { unlockSuperstar } from "./profile.js?v=0.11.40";
import { superstars } from "./superstars.js?v=0.11.40";

export const LADDER_LIVES = 3;
export const LADDER_SET_ID = "summerslam-series-1";
export const LADDER_BRANCHES = {
  modern: { id: "modern", label: "Current Era", setId: "summerslam-series-1", era: null, length: 8 },
  "golden-era": { id: "golden-era", label: "Golden Era", setId: "hall-of-fame-series-1", era: "golden-era", length: 4 },
  "attitude-era": { id: "attitude-era", label: "Attitude Era", setId: "hall-of-fame-series-1", era: "attitude-era", length: 4 },
  "hall-of-fame": { id: "hall-of-fame", label: "Hall of Fame — Series 1", setId: "hall-of-fame-series-1", era: null, length: 8 },
  evolution: { id: "evolution", label: "Evolution — Series 1", setId: "evolution-series-1", era: null, length: 8 }
};

function ensure(profile) {
  profile.ladder ??= { activeRun: null, clears: 0, bestRung: 0, completionPackCredits: 0, firstClearSuperstarPending: false };
  profile.ladder.clearsByBranch ??= {};
  profile.ladder.bestRungByBranch ??= {};
  profile.ladder.completionPackCreditsBySet ??= {};
  profile.ladder.completionPackQueue ??= [];
  profile.ladder.firstClearSuperstarPendingBySet ??= {};
  return profile.ladder;
}
function shuffle(values, rng = Math.random) {
  const out = [...values];
  for (let i = out.length - 1; i > 0; i -= 1) { const j = Math.floor(rng() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
  return out;
}
export function ladderState(profile) { return ensure(profile); }
export function startLadderRun(profile, superstarId, opponentIds, rng = Math.random, branchId = "modern") {
  const ladder = ensure(profile), branch = LADDER_BRANCHES[branchId] ?? LADDER_BRANCHES.modern;
  const starById = Object.fromEntries(Object.values(superstars).map(s => [s.id, s]));
  const eligible = opponentIds.filter(id => starById[id]?.setId === branch.setId && (!branch.era || starById[id]?.era === branch.era));
  ladder.activeRun = { superstarId, branchId: branch.id, setId: branch.setId, opponents: shuffle(eligible, rng), rung: 0, lives: LADDER_LIVES, status: "active", startedAt: new Date().toISOString() };
  return ladder.activeRun;
}
export function currentLadderOpponent(profile) { const run = ensure(profile).activeRun; return !run || run.status !== "active" ? null : run.opponents[run.rung] ?? null; }
export function recordLadderMatch(profile, result) {
  const ladder = ensure(profile), run = ladder.activeRun;
  if (!run || run.status !== "active") throw new Error("No active Climb the Ladder run");
  if (result === "draw") return { status: "retry", run };
  if (result === "loss") { run.lives -= 1; if (run.lives <= 0) { run.status = "failed"; return { status: "failed", run }; } return { status: "retry", run }; }
  if (result !== "win") throw new Error("Invalid ladder result");
  run.rung += 1; ladder.bestRung = Math.max(ladder.bestRung ?? 0, run.rung); ladder.bestRungByBranch[run.branchId] = Math.max(ladder.bestRungByBranch[run.branchId] ?? 0, run.rung);
  if (run.rung >= run.opponents.length) {
    run.status = "cleared"; ladder.clears = (ladder.clears ?? 0) + 1; ladder.clearsByBranch[run.branchId] = (ladder.clearsByBranch[run.branchId] ?? 0) + 1;
    ladder.completionPackCredits = (ladder.completionPackCredits ?? 0) + 1;
    ladder.completionPackCreditsBySet[run.setId] = (ladder.completionPackCreditsBySet[run.setId] ?? 0) + 1;
    ladder.completionPackQueue.push(run.setId);
    if (ladder.clearsByBranch[run.branchId] === 1) ladder.firstClearSuperstarPendingBySet[run.setId] = true;
    if (run.setId === "summerslam-series-1" && ladder.clears === 1) ladder.firstClearSuperstarPending = true;
    return { status: "cleared", run, completionPackAwarded: true };
  }
  return { status: "advance", run };
}
export function abandonLadderRun(profile) { ensure(profile).activeRun = null; return ensure(profile); }
export function consumeFirstClearSuperstarGuarantee(profile, setId = "summerslam-series-1") { const ladder = ensure(profile); ladder.firstClearSuperstarPendingBySet[setId] = false; if (setId === "summerslam-series-1") ladder.firstClearSuperstarPending = false; }
export function grantGuaranteedSuperstar(profile, superstarId, setId = "summerslam-series-1") { unlockSuperstar(profile, superstarId); consumeFirstClearSuperstarGuarantee(profile,setId); return superstarId; }
