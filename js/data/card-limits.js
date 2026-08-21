export const DEFAULT_CARD_OWNERSHIP_CAP = 5;
export const UNIQUE_CARD_OWNERSHIP_CAP = 5;
export const MOMENTUM_CARD_OWNERSHIP_CAP = 5;

// v0.13.87: every collectible printing has the same independent ownership cap.
// Normal, Emerald, Sapphire and Ruby each keep copies 1–5; copy 6+ overflows to UP.
export function ownershipCapFor(_cardOrId) {
  return DEFAULT_CARD_OWNERSHIP_CAP;
}
