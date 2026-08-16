import { superstars } from "./superstars.js?v=0.12.55";
import { decks } from "./decks.js?v=0.12.55";
import { isLaunchRosterSuperstar } from "./release.js?v=0.12.55";

export function exhibitionOpponentIds(playerSuperstarId) {
  return Object.values(superstars)
    .filter(star => isLaunchRosterSuperstar(star) && star.id !== playerSuperstarId && (decks[star.id]?.length ?? 0) === 60)
    .map(star => star.id);
}

export function randomExhibitionOpponent(playerSuperstarId, rng = Math.random) {
  const pool = exhibitionOpponentIds(playerSuperstarId);
  if (!pool.length) return null;
  const roll = Math.max(0, Math.min(0.999999999, Number(rng()) || 0));
  return pool[Math.floor(roll * pool.length)];
}
