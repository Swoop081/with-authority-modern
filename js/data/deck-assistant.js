import { decks } from "./decks.js?v=0.12.89";
import { collectionCards } from "./collection.js?v=0.12.89";
import { superstars } from "./superstars.js?v=0.12.89";
import { validateDeckDraft, selectedEntranceId } from "./deck-builder.js?v=0.12.89";

const byId = new Map(collectionCards.map(c => [c.id, c]));
const starById = new Map(Object.values(superstars).map(s => [s.id, s]));
const normalizedEntry = entry => typeof entry === "string" ? { id: entry, foil: false } : { id: entry?.id, foil: !!entry?.foil };
const countId = (draft, id) => draft.reduce((n,e)=>n + (normalizedEntry(e).id === id ? 1 : 0), 0);
const countFoil = (draft, id) => draft.reduce((n,e)=>{const x=normalizedEntry(e);return n+(x.id===id&&x.foil?1:0);},0);
const ownedFoil = (profile,id) => Math.max(0, Number(profile?.ownedCards?.[id]?.foil) || 0);

function playableCard(card, foil = false) {
  if (!card) return null;
  if (!foil) return card;
  // Foil is a real deck finish: connected damage is +1. Keep the original
  // collector card immutable and mark the runtime copy for presentation.
  return card.kind === "move" ? { ...card, foil: true, damage: Math.max(0, Number(card.damage) || 0) + 1, baseDamage: Number(card.damage) || 0 } : { ...card, foil: true };
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

function findSafeBlueprintReplacement(profile, sid, draft, addId, addFoil = false) {
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
    next[candidate.index] = { id: addId, foil: !!addFoil };
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

      // 1. Guaranteed-safe finish improvement: a newly available Foil replaces
      // one normal copy already in this saved deck. It changes no deck counts.
      if (pull.foil && card.kind === "move" && countId(draft, card.id) > countFoil(draft, card.id) && countFoil(draft, card.id) < ownedFoil(profile, card.id)) {
        const index = draft.findIndex(e => e.id === card.id && !e.foil);
        if (index >= 0) {
          const next = draft.map(normalizedEntry);
          next[index] = { id: card.id, foil: true };
          if (validateDeckDraft(profile, sid, next, selectedEntranceId(profile,sid)).healthy) {
            upgrades.push({ type:"foil", superstarId:sid, pull, cardId:card.id, reason:`Replace a normal ${card.name} with your new Foil copy (+1 Damage).`, addName:`Foil ${card.name}`, removeName:`Normal ${card.name}` });
            draft = next; working.set(sid, next);
          }
        }
      }

      // 2. Ownership-gated blueprint restoration. Only fire when this exact pack
      // increased access to a copy the authored recommended deck wants, and swap
      // out a card currently used above its authored recommended count.
      const recCount = recommendedCounts(sid).get(card.id) ?? 0;
      const beforeOwned = Math.max(0, Number(pull.ownershipBefore) || 0);
      if (recCount > beforeOwned && countId(draft, card.id) < Math.min(recCount, beforeOwned + 1)) {
        const swap = findSafeBlueprintReplacement(profile, sid, draft, card.id, !!pull.foil && countFoil(draft, card.id) < ownedFoil(profile, card.id));
        if (swap) {
          const removed = byId.get(swap.removeId);
          upgrades.push({ type:"blueprint", superstarId:sid, pull, cardId:card.id, removeId:swap.removeId, reason:`Restores a newly-owned copy from ${starById.get(sid)?.name ?? "this Superstar"}'s recommended build while keeping the deck valid.`, addName:`${pull.foil ? "Foil " : ""}${card.name}`, removeName:removed?.name ?? swap.removeId });
          draft = swap.next; working.set(sid, swap.next);
        }
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
  if (upgrade.type === "foil") {
    if (countFoil(draft, upgrade.cardId) >= ownedFoil(profile, upgrade.cardId)) return false;
    const index = draft.findIndex(e => e.id === upgrade.cardId && !e.foil);
    if (index < 0) return false;
    draft[index] = { id: upgrade.cardId, foil: true };
  } else if (upgrade.type === "blueprint") {
    const recommended = recommendedCounts(sid);
    const desired = recommended.get(upgrade.cardId) ?? 0;
    if (!desired || countId(draft, upgrade.cardId) >= desired) return false;
    const removeRecommended = recommended.get(upgrade.removeId) ?? 0;
    if (countId(draft, upgrade.removeId) <= removeRecommended) return false;
    const indices = draft.map((entry,index)=>entry.id === upgrade.removeId ? index : -1).filter(index=>index >= 0).sort((a,b)=>Number(a < 5)-Number(b < 5) || b-a);
    let next = null;
    for (const index of indices) {
      const candidate = draft.map(normalizedEntry);
      const useFoil = !!upgrade.pull?.foil && countFoil(candidate, upgrade.cardId) < ownedFoil(profile, upgrade.cardId);
      candidate[index] = { id: upgrade.cardId, foil: useFoil };
      if (validateDeckDraft(profile, sid, candidate, selectedEntranceId(profile,sid)).healthy) { next = candidate; break; }
    }
    if (!next) return false;
    draft.splice(0, draft.length, ...next);
  } else return false;
  if (!validateDeckDraft(profile, sid, draft, selectedEntranceId(profile,sid)).healthy) return false;
  profile.savedDecks[sid] = draft;
  profile.deckNeedsCards ??= {};
  profile.deckNeedsCards[sid] = 0;
  return true;
}
