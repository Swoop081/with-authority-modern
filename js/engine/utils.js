import { METHODS } from "./constants.js?v=0.11.43";

export function totalMomentum(player) {
  return METHODS.reduce((sum, key) => sum + (player.momentum[key] || 0), 0) + (player.momentum.attitude || 0);
}

export function clone(value) {
  return structuredClone(value);
}
