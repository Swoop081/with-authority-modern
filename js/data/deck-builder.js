import { collectionCards } from "./collection.js?v=0.11.44";
import { decks } from "./decks.js?v=0.11.44";
import { superstars } from "./superstars.js?v=0.11.44";
import { ownedCount } from "./profile.js?v=0.11.44";
import { ownershipCapFor } from "./card-limits.js?v=0.11.44";
import { cardForDeckEntry } from "./deck-assistant.js?v=0.11.44";
import { evaluateDeck, isDeckSwapSafe, DECK_SIZE, OPENING_SIZE } from "./deck-health.js?v=0.11.44";

const cardById = new Map(collectionCards.filter(c => c.kind !== "superstar").map(c => [c.id, c]));
for (const deck of Object.values(decks)) for (const card of deck) if (!cardById.has(card.id)) cardById.set(card.id, card);
const starById = Object.fromEntries(Object.values(superstars).map(s => [s.id, s]));

export function leadOffIds(superstarId) {
  return [...(starById[superstarId]?.leadOffIds ?? decks[superstarId]?.slice(0, OPENING_SIZE).map(c => c.id) ?? [])];
}

export function legalForSuperstar(card, superstarId) {
  if (!card || card.kind === "superstar") return false;
  if (card.kind === "entrance") return false; // Entrance is linked to the Superstar, outside the playable deck.
  if (card.kind === "manager") { const allowed = card.allowedSuperstarIds ?? []; return !allowed.length || allowed.includes(superstarId); }
  return !card.superstarId || card.superstarId === superstarId;
}

function countEntries(entries, predicate) { return entries.filter(predicate).length; }

function finishForNextCopy(profile, entries, cardId) {
  const usedFoils = countEntries(entries, e => e.id === cardId && e.foil);
  const usedNormals = countEntries(entries, e => e.id === cardId && !e.foil);
  const foilOwned = ownedCount(profile, cardId, "foil");
  const normalOwned = ownedCount(profile, cardId, "normal");
  if (usedFoils < foilOwned) return true;
  if (usedNormals < normalOwned) return false;
  return null;
}

export function normalizeDeckFinishes(profile, superstarId, entries) {
  const ids = entries.map(e => e.id);
  const out = [];
  const lead = leadOffIds(superstarId);
  for (let i = 0; i < ids.length; i += 1) {
    const id = ids[i];
    // Prefer Foils in the fixed opening five, then throughout the rest of the deck.
    const foilOwned = ownedCount(profile, id, "foil");
    const alreadyFoil = out.filter(e => e.id === id && e.foil).length;
    const foil = alreadyFoil < foilOwned;
    out.push({ id, foil });
  }
  // Opening identities are always the linked Lead Off cards, never user-editable.
  for (let i = 0; i < lead.length; i += 1) {
    const id = lead[i];
    const foilOwned = ownedCount(profile, id, "foil");
    out[i] = { id, foil: foilOwned > 0 };
  }
  return out;
}

export function createDeckDraft(profile, superstarId) {
  const source = profile?.savedDecks?.[superstarId]?.length
    ? profile.savedDecks[superstarId]
    : [];
  return normalizeDeckFinishes(profile, superstarId, source.map(e => ({ id: e.id, foil: !!e.foil })));
}

export function recommendedDeckDraft(profile, superstarId) {
  return normalizeDeckFinishes(profile, superstarId, (decks[superstarId] ?? []).map(card => ({ id: card.id, foil: false })));
}

export function usedCount(entries, cardId) { return countEntries(entries, e => e.id === cardId); }

export function ownedTotal(profile, cardId) { return ownedCount(profile, cardId, "normal") + ownedCount(profile, cardId, "foil"); }

export function canAddCard(profile, superstarId, entries, cardId) {
  const card = cardById.get(cardId);
  if (!legalForSuperstar(card, superstarId)) return { ok: false, reason: "Card is not legal for this Superstar." };
  if (entries.length >= DECK_SIZE) return { ok: false, reason: "Remove a card from the editable 50 first." };
  const cap = ownershipCapFor(card);
  const used = usedCount(entries, cardId);
  if (used >= cap) return { ok: false, reason: `Maximum ${cap} cop${cap === 1 ? "y" : "ies"}.` };
  if (used >= ownedTotal(profile, cardId)) return { ok: false, reason: "No unused owned copy available." };
  return { ok: true };
}

export function addCardToDraft(profile, superstarId, entries, cardId) {
  const check = canAddCard(profile, superstarId, entries, cardId);
  if (!check.ok) throw new Error(check.reason);
  const next = entries.map(e => ({ ...e }));
  const foil = finishForNextCopy(profile, next, cardId);
  if (foil === null) throw new Error("No unused owned copy available.");
  next.push({ id: cardId, foil });
  return normalizeDeckFinishes(profile, superstarId, next);
}

export function removeCardFromDraft(superstarId, entries, index) {
  if (index < OPENING_SIZE) throw new Error("Lead Off cards are linked to the Superstar and cannot be removed.");
  if (!entries[index]) throw new Error("Card not found in deck.");
  return entries.filter((_, i) => i !== index);
}

export function materializeDraft(entries) { return entries.map(cardForDeckEntry).filter(Boolean); }

export function validateDeckDraft(profile, superstarId, entries) {
  const violations = [];
  const lead = leadOffIds(superstarId);
  const openingIds = entries.slice(0, OPENING_SIZE).map(e => e.id);
  if (openingIds.join("|") !== lead.join("|")) violations.push("The fixed Lead Off five no longer match this Superstar package.");

  const counts = new Map();
  for (const entry of entries) {
    counts.set(entry.id, (counts.get(entry.id) ?? 0) + 1);
    const card = cardById.get(entry.id);
    if (!legalForSuperstar(card, superstarId)) violations.push(`${card?.name ?? entry.id} is not legal for this Superstar.`);
  }
  for (const [id, count] of counts) {
    const card = cardById.get(id);
    const cap = ownershipCapFor(card ?? id);
    if (count > cap) violations.push(`${card?.name ?? id} exceeds its ${cap}-copy limit.`);
    if (count > ownedTotal(profile, id)) violations.push(`${card?.name ?? id} uses ${count} copies but only ${ownedTotal(profile, id)} are owned.`);
  }

  const health = evaluateDeck(materializeDraft(entries), { superstarId });
  for (const problem of health.violations) if (!violations.includes(problem)) violations.push(problem);
  return { ...health, healthy: violations.length === 0, violations };
}

function cardPower(card) {
  if (!card) return -999;
  if (card.kind !== "move") return 0;
  const damage = Number(card.damage) || 0;
  const finisher = card.finisher ? 4.5 : 0;
  const submission = card.submission ? 2.2 : 0;
  const stun = card.stunTurns ? 1.2 : 0;
  const effects = (card.onConnect ?? []).reduce((sum, e) => {
    const amount = e.amount ?? 1;
    if (e.type === "draw") return sum + amount * 1.2;
    if (e.type === "discard" && e.target === "opponent") return sum + amount * 1.3;
    if (e.type === "searchDeck") return sum + 2.2;
    if (e.type === "gainMomentum") return sum + amount * (e.method === "attitude" ? 0.9 : 1.2);
    if (e.type === "loseMomentum" && e.target === "opponent") return sum + amount;
    return sum;
  }, 0);
  const costPenalty = Math.max(0, (card.cost ?? 0) - 5) * 0.25;
  return damage + finisher + submission + stun + effects - costPenalty;
}

export function optimizeDeck(profile, superstarId, sourceEntries = null) {
  let entries = normalizeDeckFinishes(profile, superstarId, (sourceEntries ?? createDeckDraft(profile, superstarId)).map(e => ({ ...e })));
  if (entries.length !== DECK_SIZE) entries = recommendedDeckDraft(profile, superstarId);

  // Greedy, conservative optimization: only replace editable Move slots and never worsen deck health.
  const candidates = collectionCards.filter(c => c.kind === "move" && !c.defensiveOnly && legalForSuperstar(c, superstarId) && ownedTotal(profile, c.id) > 0);
  for (let pass = 0; pass < 24; pass += 1) {
    let best = null;
    const beforeCards = materializeDraft(entries);
    for (const incoming of candidates) {
      if (usedCount(entries, incoming.id) >= Math.min(ownershipCapFor(incoming), ownedTotal(profile, incoming.id))) continue;
      for (let i = OPENING_SIZE; i < entries.length; i += 1) {
        const existing = cardById.get(entries[i].id);
        if (!existing || existing.kind !== "move" || existing.defensiveOnly || existing.method !== incoming.method) continue;
        const improvement = cardPower(incoming) - cardPower(existing);
        if (improvement < 1.5) continue;
        const candidate = entries.map((e, idx) => idx === i ? { id: incoming.id, foil: false } : { ...e });
        const normalized = normalizeDeckFinishes(profile, superstarId, candidate);
        const afterCards = materializeDraft(normalized);
        if (!isDeckSwapSafe(beforeCards, afterCards, { superstarId })) continue;
        if (!best || improvement > best.improvement) best = { entries: normalized, improvement };
      }
    }
    if (!best) break;
    entries = best.entries;
  }
  return normalizeDeckFinishes(profile, superstarId, entries);
}

export function aggregateDeck(entries, { tailOnly = false } = {}) {
  const start = tailOnly ? OPENING_SIZE : 0;
  const rows = new Map();
  for (let i = start; i < entries.length; i += 1) {
    const e = entries[i];
    const row = rows.get(e.id) ?? { id: e.id, indices: [], normal: 0, foil: 0, card: cardById.get(e.id) };
    row.indices.push(i);
    if (e.foil) row.foil += 1; else row.normal += 1;
    rows.set(e.id, row);
  }
  return [...rows.values()].sort((a,b) => (a.card?.kind ?? "").localeCompare(b.card?.kind ?? "") || (a.card?.name ?? a.id).localeCompare(b.card?.name ?? b.id));
}

export function eligibleOwnedCards(profile, superstarId, entries) {
  return collectionCards
    .filter(card => legalForSuperstar(card, superstarId) && ownedTotal(profile, card.id) > 0)
    .map(card => ({ card, owned: ownedTotal(profile, card.id), foilOwned: ownedCount(profile, card.id, "foil"), used: usedCount(entries, card.id), cap: ownershipCapFor(card) }))
    .sort((a,b) => (a.card.kind ?? "").localeCompare(b.card.kind ?? "") || a.card.name.localeCompare(b.card.name));
}
