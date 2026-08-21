import { sets } from "./sets.js?v=0.13.93";

// v0.13.87 — releases are build-controlled, not calendar-controlled.
// This deliberately removes the public roadmap/automatic date unlock model so
// banked sets can be released whenever WWE Legacy chooses (for example around a
// PLE) without promising a date in advance.
export const LAUNCH_LIVE_SET_IDS = Object.freeze([
  "summerslam-series-1",
  "evolution-series-1",
  "new-generation-series-1",
  "golden-era-series-1",
  "attitude-era-series-1"
]);

export const LIVE_SEASON_REWARD_SET_IDS = Object.freeze(["season-1-last-time-is-now"]);

export const BANKED_PLAYER_SET_IDS = Object.freeze([
  "raw-series-1",
  "worlds-collide-series-1",
  "money-in-the-bank-series-1",
  "smackdown-series-1",
  "survivor-series-series-1"
]);

export const PLAYER_COLLECTIBLE_SET_IDS = Object.freeze([
  ...LAUNCH_LIVE_SET_IDS,
  ...BANKED_PLAYER_SET_IDS
]);

export function setReleaseAt(_setId) { return null; }
export function isLaunchLiveSetId(setId) { return LAUNCH_LIVE_SET_IDS.includes(setId); }
export function isScheduledSetReleased(_setId, _now = new Date()) { return false; }
export function isPlayerReleasedSetId(setId, _now = new Date()) {
  return LAUNCH_LIVE_SET_IDS.includes(setId) || LIVE_SEASON_REWARD_SET_IDS.includes(setId);
}
export function playerReleasedCollectibleSetIds(_now = new Date()) { return [...LAUNCH_LIVE_SET_IDS]; }
export function playerReleaseCalendar() {
  return PLAYER_COLLECTIBLE_SET_IDS.map(setId => ({ setId, releaseDate: null, launch: LAUNCH_LIVE_SET_IDS.includes(setId) }));
}

// Internal certification can continue exercising fully-authored banked sets.
export const PRE_RELEASE_TEST_SET_IDS = Object.freeze([
  "raw-series-1",
  "worlds-collide-series-1"
]);
export function isInternalTestSetId(setId, now = new Date()) {
  return isPlayerReleasedSetId(setId, now) || PRE_RELEASE_TEST_SET_IDS.includes(setId);
}
export function isUnreleasedSetId(setId, now = new Date()) {
  const set = sets[setId];
  return !!set && !isPlayerReleasedSetId(setId, now);
}
export function isLaunchRosterSuperstar(star) {
  return !!star && !star.developmentOnly && isLaunchLiveSetId(star.setId);
}
export function isPlayerVisibleSuperstar(star, profile = null, now = new Date()) {
  if (!star || star.developmentOnly || isUnreleasedSetId(star.setId, now)) return false;
  if (PLAYER_COLLECTIBLE_SET_IDS.includes(star.setId)) return true;
  return !!profile?.unlockedSuperstars?.includes(star.id);
}
