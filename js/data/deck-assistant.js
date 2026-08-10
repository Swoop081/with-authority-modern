import { collectionCards } from "./collection.js";
import { decks } from "./decks.js";
import { ensureSavedDeck, ownedCount } from "./profile.js";
import { evaluateDeck, isDeckSwapSafe } from "./deck-health.js";

const byId = new Map(collectionCards.filter(c => c.kind !== "superstar").map(c => [c.id, c]));
for (const deck of Object.values(decks)) for (const card of deck) if (!byId.has(card.id)) byId.set(card.id, card);

export function cardForDeckEntry(entry) {
  const base = byId.get(entry.id);
  if (!base) return null;
  if (!entry.foil) return structuredClone(base);
  const card = structuredClone(base);
  card.foil = true;
  card.name = `${card.name} ✦`;
  if (card.kind === "move" && Number.isFinite(card.damage)) card.damage += 1;
  return card;
}

export function buildPlayableDeck(profile, superstarId) {
  const saved = profile?.savedDecks?.[superstarId];
  if (!saved?.length) return null;
  const materialized = saved.map(cardForDeckEntry).filter(Boolean);
  return materialized.length === 55 ? materialized : null;
}

function effectScore(effect = {}) {
  const amount = effect.amount ?? 1;
  if (effect.type === "draw") return 1.4 * amount;
  if (effect.type === "discard" && effect.target === "opponent") return 1.5 * amount;
  if (effect.type === "searchDeck") return 2.5;
  if (effect.type === "gainMomentum") return (effect.method === "attitude" ? 1 : 1.4) * amount;
  if (effect.type === "loseMomentum" && effect.target === "opponent") return 1.1 * amount;
  return 0;
}
function moveScore(card) {
  if (!card || card.kind !== "move") return -Infinity;
  const damage = card.damage ?? 0;
  const finisher = card.finisher ? 4 : 0;
  const submission = card.submission ? 2 : 0;
  const stun = card.stunTurns ? 1 : 0;
  const effects = (card.onConnect ?? []).reduce((sum, effect) => sum + effectScore(effect), 0);
  const costPenalty = Math.max(0, (card.cost ?? 0) - 4) * 0.35;
  return damage + finisher + submission + stun + effects - costPenalty;
}

function inDeckCount(deck, cardId, foil = null) {
  return deck.filter(e => e.id === cardId && (foil === null || !!e.foil === foil)).length;
}

export function findSafeUpgrade(profile, superstarId, pull) {
  if (!profile?.unlockedSuperstars?.includes(superstarId)) return null;
  const deck = ensureSavedDeck(profile, superstarId);
  const { card, foil } = pull;
  if (card.kind === "superstar") return null;

  // Safest possible upgrade: same card, Foil replaces Normal. Never touches opening five unless all tail copies are already foil.
  if (foil && card.kind !== "superstar" && inDeckCount(deck, card.id, false) > 0 && inDeckCount(deck, card.id, true) < ownedCount(profile, card.id, "foil")) {
    let index = deck.findIndex((e, i) => i >= 5 && e.id === card.id && !e.foil);
    if (index < 0) index = deck.findIndex(e => e.id === card.id && !e.foil);
    if (index >= 0) return { type: "foil-swap", superstarId, add: { id: card.id, foil: true }, removeIndex: index, remove: deck[index], reason: card.kind === "move" ? `Foil ${card.name} deals +1 damage with identical requirements.` : `Foil ${card.name} replaces the Normal copy with identical gameplay.` };
  }

  // Different-card suggestions are intentionally conservative: Moves only, same move type, tail only,
  // and the pulled copy must be available beyond copies already used in the deck.
  if (!foil && card.kind === "move" && (!card.superstarId || card.superstarId === superstarId)) {
    if (inDeckCount(deck, card.id, false) >= ownedCount(profile, card.id, "normal")) return null;
    const incomingScore = moveScore(card);
    let best = null;
    for (let i = 5; i < deck.length; i += 1) {
      const entry = deck[i];
      if (entry.foil) continue;
      const existing = byId.get(entry.id);
      if (!existing || existing.kind !== "move" || existing.finisher || existing.moveType !== card.moveType) continue;
      const improvement = incomingScore - moveScore(existing);
      if (improvement >= 2 && (!best || improvement > best.improvement)) best = { index: i, existing, improvement };
    }
    if (best) {
      const candidate = deck.map((entry, i) => i === best.index ? { id: card.id, foil: false } : entry);
      const beforeCards = deck.map(cardForDeckEntry).filter(Boolean);
      const afterCards = candidate.map(cardForDeckEntry).filter(Boolean);
      if (!isDeckSwapSafe(beforeCards, afterCards, { superstarId })) return null;
      const health = evaluateDeck(afterCards, { superstarId });
      return { type: "move-upgrade", superstarId, add: { id: card.id, foil: false }, removeIndex: best.index, remove: deck[best.index], reason: `${card.name} is a stronger ${card.moveType} option than ${best.existing.name} while preserving healthy deck shape (${health.score}/100).`, deckHealth: health };
    }
  }
  return null;
}

export function applyUpgrade(profile, upgrade) {
  const deck = ensureSavedDeck(profile, upgrade.superstarId);
  if (!deck[upgrade.removeIndex]) throw new Error("Upgrade target no longer exists");
  deck[upgrade.removeIndex] = { ...upgrade.add };
  return deck;
}

export function findPackUpgrades(profile, pulls) {
  const upgrades = [];
  for (const pull of pulls) {
    for (const superstarId of profile.unlockedSuperstars ?? []) {
      const upgrade = findSafeUpgrade(profile, superstarId, pull);
      if (upgrade) upgrades.push({ ...upgrade, pull });
    }
  }
  return upgrades;
}
