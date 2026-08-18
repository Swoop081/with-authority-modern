import { decks } from "./decks.js?v=0.13.2";
import { collectionCards } from "./collection.js?v=0.13.2";
import { superstars } from "./superstars.js?v=0.13.2";
import { validateDeckDraft, selectedEntranceId } from "./deck-builder.js?v=0.13.2";

const byId = new Map(collectionCards.map(c => [c.id, c]));
const starById = new Map(Object.values(superstars).map(s => [s.id, s]));
const normalizedEntry = entry => typeof entry === "string" ? { id: entry, foil: false } : { id: entry?.id, foil: !!entry?.foil };
const countId = (draft, id) => draft.reduce((n,e)=>n + (normalizedEntry(e).id === id ? 1 : 0), 0);
const countFoil = (draft, id) => draft.reduce((n,e)=>{const x=normalizedEntry(e);return n+(x.id===id&&x.foil?1:0);},0);
const ownedFoil = (profile,id) => Math.max(0, Number(profile?.ownedCards?.[id]?.foil) || 0);

function hasUnusedOwnedFoil(profile, draft, id) {
  return countFoil(draft, id) < ownedFoil(profile, id);
}

function canPreferFoil(profile, draft, id) {
  return countId(draft, id) > countFoil(draft, id) && hasUnusedOwnedFoil(profile, draft, id);
}

function preferOwnedFoils(profile, draft) {
  const out = draft.map(normalizedEntry);
  const used = new Map();
  for (let i = 0; i < out.length; i += 1) {
    const entry = out[i];
    const owned = ownedFoil(profile, entry.id);
    const currentUsed = used.get(entry.id) ?? 0;
    if (currentUsed < owned) {
      entry.foil = true;
      used.set(entry.id, currentUsed + 1);
    } else entry.foil = false;
  }
  return out;
}

function playableCard(card, foil = false) {
  if (!card) return null;
  // Foil is a presentation / collector finish only. Runtime gameplay values
  // stay identical to the authored Normal card so printed card numbers remain
  // authoritative everywhere in WWE Legacy.
  return foil ? { ...card, foil: true } : card;
}

export function buildPlayableDeck(profile, sid) {
  const saved = profile?.savedDecks?.[sid];
  if (Array.isArray(saved) && saved.length === 60) {
    const usedFoils = new Map();
    const materialized = saved.map(raw => {
      const entry = normalizedEntry(raw), card = byId.get(entry.id);
      if (!card) return null;
      const used = usedFoils.get(entry.id) ?? 0;
      const mayUseFoil = entry.foil && used < ownedFoil(profile, entry.id);
      if (mayUseFoil) usedFoils.set(entry.id, used + 1);
      return playableCard(card, mayUseFoil);
    }).filter(Boolean);
    if (materialized.length === 60) return materialized;
  }
  return decks[sid] ?? [];
}

function recommendedCounts(sid) {
  const counts = new Map();
  for (const card of decks[sid] ?? []) counts.set(card.id, (counts.get(card.id) ?? 0) + 1);
  return counts;
}

function findSafeBlueprintReplacement(profile, sid, draft, addId) {
  const recommended = recommendedCounts(sid);
  const desired = recommended.get(addId) ?? 0;
  if (!desired || countId(draft, addId) >= desired) return null;
  const candidates = [];
  for (let i = 0; i < draft.length; i += 1) {
    const remove = normalizedEntry(draft[i]);
    if (!remove.id || remove.id === addId) continue;
    const recommendedRemove = recommended.get(remove.id) ?? 0;
    if (countId(draft, remove.id) <= recommendedRemove) continue;
    // Avoid disturbing Lead Off unless no tail replacement exists.
    candidates.push({ index: i, removeId: remove.id, lead: i < 5 });
  }
  candidates.sort((a,b)=>Number(a.lead)-Number(b.lead) || b.index-a.index);
  for (const candidate of candidates) {
    const next = draft.map(normalizedEntry);
    next[candidate.index] = { id: addId, foil: hasUnusedOwnedFoil(profile, next, addId) };
    if (validateDeckDraft(profile, sid, next, selectedEntranceId(profile,sid)).healthy) return { ...candidate, next };
  }
  return null;
}

export function findPackUpgrades(profile, pack = []) {
  if (!profile || !Array.isArray(pack) || !pack.length) return [];
  const unlocked = (profile.unlockedSuperstars ?? []).filter(id => starById.has(id));
  const working = new Map();
  for (const sid of unlocked) {
    const saved = profile?.savedDecks?.[sid];
    if (Array.isArray(saved) && saved.length === 60) working.set(sid, saved.map(normalizedEntry));
  }
  const upgrades = [];

  for (const pull of pack) {
    const card = pull?.card;
    if (!card || ["superstar","entrance"].includes(card.kind) || pull.universePointsValue) continue;
    for (const sid of unlocked) {
      let draft = working.get(sid);
      if (!draft) continue;

      // Foils remain cosmetic only, but Deck Assistance prefers an owned Foil
      // copy whenever it is choosing which finish to place into a saved deck.
      let blueprintAdded = false;

      // Ownership-gated blueprint restoration. Only fire when this exact pack
      // increased access to a copy the authored recommended deck wants, and swap
      // out a card currently used above its authored recommended count.
      const recCount = recommendedCounts(sid).get(card.id) ?? 0;
      const beforeOwned = Math.max(0, Number(pull.ownershipBefore) || 0);
      if (recCount > beforeOwned && countId(draft, card.id) < Math.min(recCount, beforeOwned + 1)) {
        const swap = findSafeBlueprintReplacement(profile, sid, draft, card.id);
        if (swap) {
          const removed = byId.get(swap.removeId);
          const addedAsFoil = !!swap.next[swap.index]?.foil;
          upgrades.push({ type:"blueprint", superstarId:sid, pull, cardId:card.id, removeId:swap.removeId, reason:`Restores a newly-owned copy from ${starById.get(sid)?.name ?? "this Superstar"}'s recommended build while keeping the deck valid.${addedAsFoil ? " Uses your owned Foil copy for presentation." : ""}`, addName:`${addedAsFoil ? "Foil " : ""}${card.name}`, removeName:removed?.name ?? swap.removeId });
          draft = swap.next; working.set(sid, swap.next); blueprintAdded = true;
        }
      }

      // A Foil finish is not stronger, but if this pack card is already used as
      // Normal and the player owns an unused Foil copy, offer the cosmetic swap.
      if (!blueprintAdded && canPreferFoil(profile, draft, card.id)) {
        upgrades.push({ type:"foil-preference", superstarId:sid, pull, cardId:card.id, reason:"Uses your owned Foil copy for presentation. Normal and Foil gameplay values are identical.", addName:`Foil ${card.name}`, removeName:`Normal ${card.name}` });
        const cosmetic = draft.map(normalizedEntry);
        const index = cosmetic.findIndex(entry => entry.id === card.id && !entry.foil);
        if (index >= 0) cosmetic[index] = { id: card.id, foil: true };
        draft = cosmetic; working.set(sid, cosmetic);
      }
    }
  }
  return upgrades;
}

export function applyUpgrade(profile, upgrade) {
  if (!profile || !upgrade?.superstarId) return false;
  const sid = upgrade.superstarId;
  const saved = profile?.savedDecks?.[sid];
  if (!Array.isArray(saved) || saved.length !== 60) return false;
  const draft = saved.map(normalizedEntry);
  if (upgrade.type === "blueprint") {
    const recommended = recommendedCounts(sid);
    const desired = recommended.get(upgrade.cardId) ?? 0;
    if (!desired || countId(draft, upgrade.cardId) >= desired) return false;
    const removeRecommended = recommended.get(upgrade.removeId) ?? 0;
    if (countId(draft, upgrade.removeId) <= removeRecommended) return false;
    const indices = draft.map((entry,index)=>entry.id === upgrade.removeId ? index : -1).filter(index=>index >= 0).sort((a,b)=>Number(a < 5)-Number(b < 5) || b-a);
    let next = null;
    for (const index of indices) {
      const candidate = draft.map(normalizedEntry);
      const useFoil = hasUnusedOwnedFoil(profile, candidate, upgrade.cardId);
      candidate[index] = { id: upgrade.cardId, foil: useFoil };
      const preferred = preferOwnedFoils(profile, candidate);
      if (validateDeckDraft(profile, sid, preferred, selectedEntranceId(profile,sid)).healthy) { next = preferred; break; }
    }
    if (!next) return false;
    draft.splice(0, draft.length, ...next);
  } else if (upgrade.type === "foil-preference") {
    const index = draft.findIndex(entry => entry.id === upgrade.cardId && !entry.foil);
    if (index < 0 || !canPreferFoil(profile, draft, upgrade.cardId)) return false;
    draft[index] = { id: upgrade.cardId, foil: true };
  } else return false;
  if (!validateDeckDraft(profile, sid, draft, selectedEntranceId(profile,sid)).healthy) return false;
  profile.savedDecks[sid] = draft;
  profile.deckNeedsCards ??= {};
  profile.deckNeedsCards[sid] = 0;
  return true;
}
