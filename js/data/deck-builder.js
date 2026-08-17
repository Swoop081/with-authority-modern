import { decks } from "./decks.js?v=0.12.87";
import { collectionCards } from "./collection.js?v=0.12.87";
import { superstars } from "./superstars.js?v=0.12.87";
import { evaluateDeckHealth, deckBucket } from "./deck-health.js?v=0.12.87";
import { isPlayerReleasedSetId } from "./release.js?v=0.12.87";

const byId = new Map(collectionCards.map(c => [c.id, c]));
const starById = new Map(Object.values(superstars).map(s => [s.id, s]));
const DEFAULT_PLAYER_ENTRANCE_ID = "entrance-amazing";

export const DECK_LAB_CATEGORIES = Object.freeze([
  { id: "signature", label: "Finishers & Trademarks" },
  { id: "high", label: "High-Level Moves" },
  { id: "mid", label: "Mid-Level Moves" },
  { id: "low", label: "Low-Level Moves" },
  { id: "utility", label: "Actions / Specials" },
  { id: "momentum", label: "Momentum" }
]);

export function leadOffIds(sid) { return (decks[sid] ?? []).slice(0, 5).map(c => c.id); }
export function recommendedDeckDraft(sid) { return (decks[sid] ?? []).map(c => ({ id: c.id, foil: false })); }
export function materializeDraft(d = []) { return d.map(e => { const entry = typeof e === "string" ? { id: e, foil: false } : e; const card = byId.get(entry?.id); return card ? (entry?.foil ? { ...card, foil: true } : card) : null; }).filter(Boolean); }
export function usedCount(d, id) { return d.filter(e => (e.id ?? e) === id).length; }
export function usedCopyFamilyCount(d, card) {
  if (!card?.copyFamily) return usedCount(d, card?.id);
  return d.reduce((n, e) => { const c = byId.get(e.id ?? e); return n + (c?.copyFamily === card.copyFamily ? 1 : 0); }, 0);
}
export function ownedTotal(p, id) { const o = p?.ownedCards?.[id] ?? {}; return (o.normal ?? 0) + (o.foil ?? 0); }

export function cardEligibilityForSuperstar(star, card) {
  if (!star || !card) return { legal: false, reason: "Card unavailable" };
  if (["superstar", "entrance"].includes(card.kind)) return { legal: false, reason: "Not a 60-page deck card" };
  if (card.superstarId && card.superstarId !== star.id) {
    const owner = starById.get(card.superstarId)?.name ?? "another Superstar";
    return { legal: false, reason: `${owner}-exclusive` };
  }
  if (Array.isArray(card.allowedSuperstarIds) && card.allowedSuperstarIds.length && !card.allowedSuperstarIds.includes(star.id)) {
    return { legal: false, reason: "Family / Superstar restriction" };
  }
  for (const [method, requirement] of Object.entries(card.finisher ? {} : (card.requirements ?? {}))) {
    const limit = star.methodLimits?.[method];
    if (limit === 0) return { legal: false, reason: `${star.name} cannot use ${method[0].toUpperCase() + method.slice(1)} cards` };
    if (Number.isFinite(limit) && requirement > limit) {
      return { legal: false, reason: `Requires ${requirement} ${method[0].toUpperCase() + method.slice(1)} · ${star.name} limit ${limit}` };
    }
  }
  return { legal: true, reason: "Valid" };
}

export function legalForSuperstar(star, card) { return cardEligibilityForSuperstar(star, card).legal; }

export function entranceEligibilityForSuperstar(star, card) {
  if (!star || !card || card.kind !== "entrance") return { legal: false, reason: "Not an Entrance" };
  if (card.superstarId && card.superstarId !== star.id) {
    const owner = starById.get(card.superstarId)?.name ?? "another Superstar";
    return { legal: false, reason: `${owner}-exclusive Entrance` };
  }
  if (Array.isArray(card.allowedSuperstarIds) && card.allowedSuperstarIds.length && !card.allowedSuperstarIds.includes(star.id)) {
    return { legal: false, reason: "Entrance is not compatible with this Superstar" };
  }
  return { legal: true, reason: card.superstarId ? "Superstar-specific Entrance" : "Shared Entrance" };
}

export function categoryForCard(card) {
  if (!card) return "other";
  return deckBucket(card);
}
export function cardsInCategory(cards = [], category) { return cards.filter(c => categoryForCard(c) === category); }

export function recommendedCategoryCounts(sid) {
  const out = Object.fromEntries(DECK_LAB_CATEGORIES.map(c => [c.id, 0]));
  for (const card of decks[sid] ?? []) {
    const key = categoryForCard(card);
    if (key in out) out[key] += 1;
  }
  return out;
}

export function currentCategoryCounts(draft = []) {
  const out = Object.fromEntries(DECK_LAB_CATEGORIES.map(c => [c.id, 0]));
  for (const card of materializeDraft(draft)) {
    const key = categoryForCard(card);
    if (key in out) out[key] += 1;
  }
  return out;
}

export function allOwnedDeckCards(profile) {
  return collectionCards.filter(card => isPlayerReleasedSetId(card.setId) && !["superstar", "entrance"].includes(card.kind) && ownedTotal(profile, card.id) > 0);
}
export function allOwnedEntrances(profile) { return collectionCards.filter(card => isPlayerReleasedSetId(card.setId) && card.kind === "entrance" && ownedTotal(profile, card.id) > 0); }
export function ownedCardsForCategory(profile, category) { return cardsInCategory(allOwnedDeckCards(profile), category); }
export function eligibleOwnedCards(profile, sid) {
  const star = starById.get(sid);
  return allOwnedDeckCards(profile).filter(card => legalForSuperstar(star, card));
}

export function createDeckDraft(profile, sid) {
  const saved = profile?.savedDecks?.[sid];
  return Array.isArray(saved) ? saved.map(x => typeof x === "string" ? { id: x, foil: false } : { ...x }) : buildOwnedRecommendedDraft(profile, sid);
}

export function aggregateDeck(d, { tailOnly = false } = {}) {
  const arr = tailOnly ? d.slice(5) : d, map = new Map();
  for (const e of arr) {
    const id = e.id ?? e, row = map.get(id) ?? { id, count: 0, foil: 0, indices: [] };
    row.count += 1;
    row.indices.push(d.indexOf(e));
    if (e.foil) row.foil += 1;
    map.set(id, row);
  }
  return [...map.values()].map(row => ({ ...row, normal: row.count - row.foil, card: byId.get(row.id) }));
}

export function canAddCard(profile, sid, draft, id) {
  const card = byId.get(id), star = starById.get(sid);
  if (!card || !legalForSuperstar(star, card) || draft.length >= 60) return false;
  const defaultCap = card.kind === "momentum" ? 12 : 5;
  const cap = Math.min(defaultCap, Number.isFinite(card.maxCopies) ? card.maxCopies : defaultCap);
  const ownRoom = usedCount(draft, id) < Math.min(cap, ownedTotal(profile, id));
  const familyRoom = !card.copyFamily || usedCopyFamilyCount(draft, card) < 5;
  return ownRoom && familyRoom;
}
export function addCardToDraft(profile, sid, draft, id) {
  if (!canAddCard(profile, sid, draft, id)) return draft;
  return [...draft, { id, foil: false }];
}
export function removeCardFromDraft(_profile, _sid, draft, index) { return draft.filter((_, i) => i !== index); }

export function replaceLeadOffSlot(profile, sid, draft, slot, id) {
  const index = Number(slot);
  if (!Number.isInteger(index) || index < 0 || index > 4 || index >= draft.length) return draft;
  const card = byId.get(id), star = starById.get(sid);
  if (!card || !["move", "momentum"].includes(card.kind) || !legalForSuperstar(star, card)) return draft;
  const oldId = draft[index]?.id ?? draft[index];
  if (oldId === id) return draft;
  const cap = card.kind === "momentum" ? 12 : 5;
  const current = usedCount(draft, id);
  const familyCurrent = usedCopyFamilyCount(draft, card);
  const owned = ownedTotal(profile, id);
  const out = draft.map(e => ({ ...(typeof e === "string" ? { id: e, foil: false } : e) }));
  if (current < Math.min(cap, owned) && (!card.copyFamily || familyCurrent < 5)) {
    out[index] = { id, foil: false };
    return out;
  }
  const swapIndex = out.findIndex((entry, i) => i >= 5 && entry.id === id);
  if (swapIndex >= 5) {
    const tmp = out[index]; out[index] = out[swapIndex]; out[swapIndex] = tmp;
    return out;
  }
  return draft;
}

export function selectedEntranceId(profile, sid) {
  const star = starById.get(sid);
  const saved = profile?.selectedEntrances?.[sid];
  const card = saved ? byId.get(saved) : null;
  if (card && ownedTotal(profile, saved) > 0 && entranceEligibilityForSuperstar(star, card).legal) return saved;
  const baseline = byId.get(DEFAULT_PLAYER_ENTRANCE_ID);
  if (baseline && ownedTotal(profile, DEFAULT_PLAYER_ENTRANCE_ID) > 0 && entranceEligibilityForSuperstar(star, baseline).legal) return DEFAULT_PLAYER_ENTRANCE_ID;
  return null;
}
export function setSelectedEntrance(profile, sid, entranceId) {
  const star = starById.get(sid), card = byId.get(entranceId);
  if (!card || ownedTotal(profile, entranceId) < 1) return false;
  if (!entranceEligibilityForSuperstar(star, card).legal) return false;
  profile.selectedEntrances ??= {};
  profile.selectedEntrances[sid] = entranceId;
  return true;
}

export function validateDeckDraft(profile, sid, draft, entranceId = selectedEntranceId(profile, sid)) {
  const star = starById.get(sid);
  const cards = materializeDraft(draft);
  const base = evaluateDeckHealth(cards);
  const violations = [...base.violations];
  if (cards.length !== draft.length) violations.push("Deck contains a card that is no longer active.");

  const counts = new Map();
  for (const card of cards) {
    counts.set(card.id, (counts.get(card.id) ?? 0) + 1);
    const eligibility = cardEligibilityForSuperstar(star, card);
    if (!eligibility.legal) violations.push(`${card.name}: ${eligibility.reason}.`);
  }
  for (const [id, count] of counts) {
    const owned = ownedTotal(profile, id);
    if (count > owned) violations.push(`${byId.get(id)?.name ?? id}: deck uses ${count}, Collection owns ${owned}.`);
  }

  const lead = cards.slice(0, 5);
  if (lead.length !== 5) violations.push(`Lead Off must contain 5 pages (${lead.length}/5).`);
  if (lead.some(card => !["move", "momentum"].includes(card.kind))) violations.push("Lead Off 5 may contain only Moves and Momentum.");
  if (lead.length === 5 && !lead.some(card => card.kind === "momentum")) violations.push("Lead Off 5 needs at least one Momentum page.");
  if (lead.length === 5 && !lead.some(card => card.kind === "move")) violations.push("Lead Off 5 needs at least one Move.");

  const entrance = entranceId ? byId.get(entranceId) : null;
  if (!entrance) violations.push("Choose an Entrance.");
  else {
    const e = entranceEligibilityForSuperstar(star, entrance);
    if (!e.legal) violations.push(`${entrance.name}: ${e.reason}.`);
    if (ownedTotal(profile, entrance.id) < 1) violations.push(`${entrance.name}: Entrance is not owned.`);
  }

  const unique = [...new Set(violations)];
  return { ...base, healthy: unique.length === 0, score: Math.max(0, 100 - unique.length * 12), violations: unique };
}

export function normalizeDeckFinishes(_p, _s, entries = []) { return entries; }
export function optimizeDeck(profile, sid) { return autoFillOwnedDraft(profile, sid, buildOwnedRecommendedDraft(profile, sid)); }

// Recommended decks are blueprints, not free cards. Build only copies the
// player actually owns, preserving authored order and Lead Off order.
export function buildOwnedRecommendedDraft(profile, sid) {
  const wanted = recommendedDeckDraft(sid), used = new Map(), out = [];
  for (const entry of wanted) {
    const id = entry.id ?? entry, count = used.get(id) ?? 0, owned = ownedTotal(profile, id);
    if (count < owned) { out.push({ id, foil: false }); used.set(id, count + 1); }
  }
  return out;
}

export function autoFillOwnedDraft(profile, sid, draft = []) {
  const star = starById.get(sid); if (!star) return [...draft];
  const out = [...draft.map(e => typeof e === "string" ? { id: e, foil: false } : { ...e })];
  const target = (decks[sid] ?? []).length || 60;
  const candidates = eligibleOwnedCards(profile, sid).sort((a, b) => {
    const ar = a.rarity ?? 0, br = b.rarity ?? 0; if (br !== ar) return br - ar;
    return (a.cost ?? 0) - (b.cost ?? 0) || a.name.localeCompare(b.name);
  });
  let guard = 0;
  while (out.length < target && guard++ < target * 20) {
    let added = false;
    for (const card of candidates) {
      const defaultCap = card.kind === "momentum" ? 12 : 5;
      const cap = Math.min(defaultCap, Number.isFinite(card.maxCopies) ? card.maxCopies : defaultCap);
      if (usedCount(out, card.id) >= Math.min(cap, ownedTotal(profile, card.id))) continue;
      if (card.copyFamily && usedCopyFamilyCount(out, card) >= 5) continue;
      out.push({ id: card.id, foil: false }); added = true;
      if (out.length >= target) break;
    }
    if (!added) break;
  }
  return out;
}
