export const GREEN_HEALTH_MIN = 0.65;
export const AMBER_HEALTH_MIN = 0.25;
export const RED_HEALTH_DISPLAY_MAX = 0.24;

export function healthRatio(player) {
  if (!player?.maxHp) return 0;
  return Math.max(0, Math.min(1, player.hp / player.maxHp));
}

export function healthZone(player) {
  const ratio = healthRatio(player);
  if (ratio >= GREEN_HEALTH_MIN) return "green";
  if (ratio >= AMBER_HEALTH_MIN) return "amber";
  return "red";
}

export function healthOnlyPinChance(player) {
  const ratio = healthRatio(player);
  if (ratio >= GREEN_HEALTH_MIN) return 0;
  if (ratio >= AMBER_HEALTH_MIN) {
    const amberDepth = Math.max(0, Math.min(1, (GREEN_HEALTH_MIN - ratio) / (GREEN_HEALTH_MIN - AMBER_HEALTH_MIN)));
    return 1 + Math.round(amberDepth * 2);
  }
  const redDepth = Math.max(0, Math.min(1, (RED_HEALTH_DISPLAY_MAX - ratio) / RED_HEALTH_DISPLAY_MAX));
  return Math.max(15, Math.min(90, 15 + Math.round(redDepth * 75)));
}
