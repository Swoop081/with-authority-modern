import { sets } from "./sets.js?v=0.12.78";

// Public launch state for v0.12.12. Future sets remain authored in the build so
// development work is preserved, but player-facing systems must not surface
// them until a later release pass deliberately promotes the set.
export const LAUNCH_LIVE_SET_IDS = Object.freeze([
  "summerslam-series-1",
  "hall-of-fame-series-1",
  "evolution-series-1"
]);

export const LIVE_SEASON_REWARD_SET_IDS = Object.freeze([
  "season-1-final-boss"
]);

export function isLaunchLiveSetId(setId) {
  return LAUNCH_LIVE_SET_IDS.includes(setId);
}

export function isPlayerReleasedSetId(setId) {
  return isLaunchLiveSetId(setId) || LIVE_SEASON_REWARD_SET_IDS.includes(setId);
}

export function isUnreleasedSetId(setId) {
  const set = sets[setId];
  return !!set && !isPlayerReleasedSetId(setId);
}

export function isLaunchRosterSuperstar(star) {
  return !!star && !star.developmentOnly && isLaunchLiveSetId(star.setId);
}

export function isPlayerVisibleSuperstar(star, profile = null) {
  if (!star || star.developmentOnly || isUnreleasedSetId(star.setId)) return false;
  if (isLaunchLiveSetId(star.setId)) return true;
  // Season reward Superstars remain hidden from ordinary roster surfaces until
  // actually earned, while their chase presentation can still appear in Season.
  return !!profile?.unlockedSuperstars?.includes(star.id);
}
