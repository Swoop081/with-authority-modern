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
    return Math.round(amberDepth * 1);
  }
  // Preserve the established Red-zone curve at every positive HP value.
  // Exactly 0 HP is the critical endpoint: natural covers succeed 75% of the time.
  if ((player?.hp??0) <= 0) return 75;
  const redDepth = Math.max(0, Math.min(1, (RED_HEALTH_DISPLAY_MAX - ratio) / RED_HEALTH_DISPLAY_MAX));
  return Math.max(5, Math.min(45, 5 + Math.round(redDepth * 40)));
}
