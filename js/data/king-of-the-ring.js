import { grantRandomBoosters } from "./boosters.js?v=0.13.93";

export const KING_OF_THE_RING_FIELD_SIZE = 8;
export const KING_OF_THE_RING_ROUNDS = Object.freeze(["Quarterfinal", "Semifinal", "Final"]);

function ensure(profile) {
  profile.kingOfTheRing ??= { activeRun: null, clears: 0, bestRound: 0, reigningKingId: null, reigningKingAt: null };
  profile.kingOfTheRing.clears = Math.max(0, Number(profile.kingOfTheRing.clears) || 0);
  profile.kingOfTheRing.bestRound = Math.max(0, Number(profile.kingOfTheRing.bestRound) || 0);
  profile.kingOfTheRing.reigningKingId ??= null;
  profile.kingOfTheRing.reigningKingAt ??= null;
  const run = profile.kingOfTheRing.activeRun;
  if (run?.status === "cleared") {
    run.coronationSeen ??= true;
    run.rewardSetId ??= run.rewardClaimedSetId && run.rewardClaimedSetId !== "legacy-auto-reward" ? run.rewardClaimedSetId : null;
  }
  return profile.kingOfTheRing;
}
function shuffle(values, rng = Math.random) {
  const out = [...values];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
function choose(values, rng = Math.random) { return values[Math.floor(rng() * values.length)] ?? values[0] ?? null; }

export function kingOfTheRingState(profile) { return ensure(profile); }

export function startKingOfTheRing(profile, superstarId, opponentIds, rng = Math.random) {
  const state = ensure(profile);
  const pool = [...new Set(opponentIds)].filter(id => id && id !== superstarId);
  if (pool.length < KING_OF_THE_RING_FIELD_SIZE - 1) throw new Error("Not enough eligible Superstars for King of the Ring");
  const field = [superstarId, ...shuffle(pool, rng).slice(0, KING_OF_THE_RING_FIELD_SIZE - 1)];
  const qf2Winner = choose([field[2], field[3]], rng);
  const qf3Winner = choose([field[4], field[5]], rng);
  const qf4Winner = choose([field[6], field[7]], rng);
  const otherSemiWinner = choose([qf3Winner, qf4Winner], rng);
  state.activeRun = {
    superstarId,
    field,
    opponents: [field[1], qf2Winner, otherSemiWinner],
    cpuQuarterWinners: [qf2Winner, qf3Winner, qf4Winner],
    cpuFinalist: otherSemiWinner,
    stage: 0,
    status: "active",
    startedAt: new Date().toISOString(),
    coronationSeen: false,
    rewardSetId: null,
  };
  return state.activeRun;
}

export function currentKingOfTheRingOpponent(profile) {
  const run = ensure(profile).activeRun;
  return !run || run.status !== "active" ? null : run.opponents[run.stage] ?? null;
}

export function recordKingOfTheRingMatch(profile, result, rng = Math.random, now = new Date()) {
  const state = ensure(profile), run = state.activeRun;
  if (!run || run.status !== "active") throw new Error("No active King of the Ring tournament");
  if (result === "loss") { run.status = "eliminated"; return { status: "eliminated", run }; }
  if (result !== "win") throw new Error("Invalid King of the Ring result");
  run.stage += 1;
  state.bestRound = Math.max(state.bestRound, run.stage);
  if (run.stage >= KING_OF_THE_RING_ROUNDS.length) {
    run.status = "cleared";
    state.clears += 1;
    state.reigningKingId = run.superstarId;
    state.reigningKingAt = new Date().toISOString();
    const rewardSetIds = grantRandomBoosters(profile, 1, rng, now);
    run.rewardSetId = rewardSetIds[0] ?? null;
    return { status: "cleared", run, packAwarded: !!run.rewardSetId, packSetId: run.rewardSetId };
  }
  return { status: "advance", run };
}

export function markKingOfTheRingCoronationSeen(profile) {
  const run = ensure(profile).activeRun;
  if (!run || run.status !== "cleared") throw new Error("No King of the Ring coronation is available");
  run.coronationSeen = true;
  return run;
}

export function resetKingOfTheRing(profile) { ensure(profile).activeRun = null; return ensure(profile); }
