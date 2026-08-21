import { applyCardTier, CARD_TIERS, normalizeCardTier, tierRank } from './variants.js?v=0.13.93';

const sortedTiers = cards => cards.map(c => normalizeCardTier(c?.tier, 'normal')).sort((a,b)=>tierRank(b)-tierRank(a));

export function cpuTierRole(card) {
  if (!card) return 'other';
  if (card.kind === 'momentum') return 'momentum';
  if (card.kind === 'manager') return 'manager';
  if (card.kind === 'entrance') return 'entrance';
  if (card.kind === 'action' || card.kind === 'support') return card.special ? 'special' : 'utility';
  if (card.kind !== 'move') return card.kind ?? 'other';
  const isSubmission = !!card.submission || card.moveType === 'submission';
  if (card.finisher) return isSubmission ? 'finisher-submission' : 'finisher';
  if (card.trademark) return isSubmission ? 'trademark-submission' : 'trademark';
  if (isSubmission) return 'submission';
  if (card.defensiveOnly || card.moveType === 'counter') return 'counter';
  const cost = Number(card.cost ?? 0);
  const band = cost <= 3 ? 'low' : cost <= 6 ? 'mid' : 'high';
  return `${band}-${card.moveType ?? 'move'}`;
}

function broadRole(role) {
  if (role.startsWith('finisher')) return 'finisher';
  if (role.startsWith('trademark')) return 'trademark';
  if (role.includes('submission')) return 'submission';
  if (role.startsWith('low-')) return 'low';
  if (role.startsWith('mid-')) return 'mid';
  if (role.startsWith('high-')) return 'high';
  return role;
}

function sourceTiersFor(playerDeck, role) {
  const exact = sortedTiers(playerDeck.filter(c => cpuTierRole(c) === role));
  if (exact.length) return exact;
  const broad = broadRole(role);
  const broader = sortedTiers(playerDeck.filter(c => broadRole(cpuTierRole(c)) === broad));
  if (broader.length) return broader;
  return sortedTiers(playerDeck);
}

function tierAtQuantile(tiers, index, total) {
  if (!tiers.length) return 'normal';
  if (total <= 1) return tiers[0]; // If the player owns a Ruby Finisher, the CPU's lone Finisher is Ruby.
  const sourceIndex = Math.round((index / Math.max(1,total-1)) * Math.max(0,tiers.length-1));
  return tiers[Math.min(tiers.length-1, Math.max(0, sourceIndex))] ?? 'normal';
}

// CPU keeps its own authored deck identity, but mirrors the player's printing
// strength role-for-role. A full Ruby player deck therefore produces a full
// Ruby CPU deck, while mixed decks produce a comparable tier distribution.
export function scaleCpuDeckToPlayer(playerDeck = [], cpuDeck = []) {
  if (!Array.isArray(cpuDeck)) return [];
  const byRole = new Map();
  for (const card of cpuDeck) {
    const role = cpuTierRole(card);
    if (!byRole.has(role)) byRole.set(role, []);
    byRole.get(role).push(card);
  }
  const tierAssignments = new Map();
  for (const [role, cards] of byRole) {
    const source = sourceTiersFor(playerDeck, role);
    tierAssignments.set(role, cards.map((_,i)=>tierAtQuantile(source,i,cards.length)));
  }
  const roleCursor = new Map();
  return cpuDeck.map(card => {
    const role = cpuTierRole(card);
    const i = roleCursor.get(role) ?? 0;
    roleCursor.set(role, i + 1);
    const tier = tierAssignments.get(role)?.[i] ?? 'normal';
    return applyCardTier(card, CARD_TIERS.includes(tier) ? tier : 'normal');
  });
}
