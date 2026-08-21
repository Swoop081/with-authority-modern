import { cardsForSet } from './collection.js?v=0.13.93';
import { ownedCount } from './profile.js?v=0.13.93';
import { grantRandomBoosters } from './boosters.js?v=0.13.93';
import { CARD_TIERS } from './variants.js?v=0.13.93';

export const SET_LIFECYCLES = ['featured','vaulted','returning'];
export const COLLECTION_MILESTONES = [
  { percent: 25, reward: 1 }, { percent: 50, reward: 1 }, { percent: 75, reward: 1 }, { percent: 100, reward: 1 }
];
// Preserve the old two-track milestone economy: overall Collection + premium
// chase Collection. Ruby replaces the former Foil completion track.
export const RUBY_MILESTONES = [
  { percent: 25, reward: 1 }, { percent: 50, reward: 1 }, { percent: 75, reward: 1 }, { percent: 100, reward: 1 }
];
export const FOIL_MILESTONES = RUBY_MILESTONES; // legacy internal alias

function ensure(profile, setId = 'summerslam-series-1') {
  profile.setProgress ??= {};
  profile.setProgress[setId] ??= { lifecycle: 'featured', claimedCollection: [], claimedRuby: [] };
  const state = profile.setProgress[setId];
  state.claimedCollection ??= [];
  state.claimedRuby ??= state.claimedFoil ?? [];
  delete state.claimedFoil;
  return state;
}
export function setProgressState(profile, setId = 'summerslam-series-1') { return ensure(profile, setId); }
export function setLifecycle(profile, lifecycle, setId = 'summerslam-series-1') {
  if (!SET_LIFECYCLES.includes(lifecycle)) throw new Error('Invalid set lifecycle');
  ensure(profile,setId).lifecycle = lifecycle; return lifecycle;
}
export function collectionProgress(profile, setId = 'summerslam-series-1') {
  const collectionCards = cardsForSet(setId), total = collectionCards.length;
  const ownsAny = c => CARD_TIERS.some(tier => ownedCount(profile,c.id,tier)>0);
  const ownedUnique = collectionCards.filter(ownsAny).length;
  const emeraldUnique = collectionCards.filter(c=>ownedCount(profile,c.id,'emerald')>0).length;
  const sapphireUnique = collectionCards.filter(c=>ownedCount(profile,c.id,'sapphire')>0).length;
  const rubyUnique = collectionCards.filter(c=>ownedCount(profile,c.id,'ruby')>0).length;
  return {
    setId,total,ownedUnique,emeraldUnique,sapphireUnique,rubyUnique,
    percent: total ? Math.floor((ownedUnique/total)*100) : 0,
    emeraldPercent: total ? Math.floor((emeraldUnique/total)*100) : 0,
    sapphirePercent: total ? Math.floor((sapphireUnique/total)*100) : 0,
    rubyPercent: total ? Math.floor((rubyUnique/total)*100) : 0,
    foilUnique: rubyUnique, foilPercent: total ? Math.floor((rubyUnique/total)*100) : 0
  };
}
export function availableMilestoneRewards(profile, setId = 'summerslam-series-1') {
  const state = ensure(profile,setId), progress = collectionProgress(profile,setId);
  return {
    collection: COLLECTION_MILESTONES.filter(m => progress.percent >= m.percent && !state.claimedCollection.includes(m.percent)),
    ruby: RUBY_MILESTONES.filter(m => progress.rubyPercent >= m.percent && !state.claimedRuby.includes(m.percent)),
    foil: []
  };
}
export function claimMilestone(profile, type, percent, setId = 'summerslam-series-1', now = new Date(), rng = Math.random) {
  const state = ensure(profile,setId), ruby = type === 'ruby' || type === 'foil';
  const list = ruby ? RUBY_MILESTONES : COLLECTION_MILESTONES;
  const claimed = ruby ? state.claimedRuby : state.claimedCollection;
  const progress = collectionProgress(profile,setId), actual = ruby ? progress.rubyPercent : progress.percent;
  const milestone = list.find(m => m.percent === Number(percent));
  if (!milestone) throw new Error('Milestone not found');
  if (actual < milestone.percent) throw new Error('Milestone not reached');
  if (claimed.includes(milestone.percent)) throw new Error('Milestone already claimed');
  claimed.push(milestone.percent);
  const packSetIds = grantRandomBoosters(profile, milestone.reward, rng, now);
  return { reward: milestone.reward, packs: packSetIds.length, packSetIds, milestone };
}
export function boosterSetAvailable(profile, setId = 'summerslam-series-1') { return ensure(profile,setId).lifecycle !== 'vaulted'; }
