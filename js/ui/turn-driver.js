import { executeCpuDecision, decisionOwner } from "../ai/WrestlingAI.js?v=0.11.37";

/**
 * Drive CPU decisions until control reaches the human, a human response window
 * opens, the match ends, or the safety limit is reached.
 *
 * This is deliberately UI-agnostic so opening-Control handoff can be regression
 * tested without a browser DOM.
 */
export function advanceCpuUntilHuman(engine, cpuId = "p2", { maxSteps = 40 } = {}) {
  let steps = 0;
  while (engine && engine.state().phase !== "MATCH_OVER" && decisionOwner(engine.state()) === cpuId && steps < maxSteps) {
    const beforeLogLength = engine.state().log.length;
    const decision = executeCpuDecision(engine, cpuId);
    steps += 1;
    if (decision.type === "none" || engine.state().log.length === beforeLogLength) break;
  }
  return {
    steps,
    owner: engine ? decisionOwner(engine.state()) : null,
    phase: engine?.state().phase ?? null,
    ended: engine?.state().phase === "MATCH_OVER"
  };
}
