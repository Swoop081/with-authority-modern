import { cardsForSet, setCollectionFor } from "./collection.js?v=0.11.44";
import { addOwnedCard, unlockSuperstar, ownedCount, buildBestOwnedDeck } from "./profile.js?v=0.11.44";
import { ladderState, consumeFirstClearSuperstarGuarantee } from "./ladder.js?v=0.11.44";
import { championshipRoadState } from "./championship-road.js?v=0.11.44";
import { recordChallengeMetric } from "./challenges.js?v=0.11.44";
import { boosterSetAvailable } from "./set-progression.js?v=0.11.44";
import { ownershipCapFor } from "./card-limits.js?v=0.11.44";

export const BOOSTER_SIZE = 5;
export const GUARANTEED_FOILS = 1;
export const RARITY_WEIGHTS = { 1: 0.50, 2: 0.30, 3: 0.15, 4: 0.05 };
export const SUPERSTAR_PITY_PACKS = 20;
export const DEFAULT_BOOSTER_SET_ID = "summerslam-series-1";

function weightedRarity(rng) {
  const roll = rng(); let cumulative = 0;
  for (const rarity of [1,2,3,4]) { cumulative += RARITY_WEIGHTS[rarity]; if (roll < cumulative) return rarity; }
  return 4;
}
export function boosterCreditsFor(profile, setId = DEFAULT_BOOSTER_SET_ID) {
  if (setId === DEFAULT_BOOSTER_SET_ID && !profile.boosterCreditsBySet) return profile.boosterCredits ?? 0;
  return profile.boosterCreditsBySet?.[setId] ?? 0;
}
function syncLegacySummer(profile) { profile.boosterCredits = profile.boosterCreditsBySet?.[DEFAULT_BOOSTER_SET_ID] ?? profile.boosterCredits ?? 0; }
export function finishEligible(profile, cardId, foil) {
  const normal=ownedCount(profile,cardId,"normal"),foils=ownedCount(profile,cardId,"foil"),total=normal+foils,cap=ownershipCapFor(cardId);
  if(foil)return foils<cap&&(total<cap||normal>0);return total<cap;
}
export function boosterEligible(profile, card, foil, setId = card?.setId ?? DEFAULT_BOOSTER_SET_ID) {
  if(!card||card.setId!==setId||!finishEligible(profile,card.id,foil))return false;
  if(card.kind==="entrance") return false;
  // Superstar cards are always Foil and have no Normal version.
  if(card.kind==="superstar" && !foil) return false;
  return true;
}
function candidates(profile,setId,rarity,foil){return cardsForSet(setId).filter(card=>card.rarity===rarity&&boosterEligible(profile,card,foil,setId));}
function anyCandidates(profile,setId,foil){return cardsForSet(setId).filter(card=>boosterEligible(profile,card,foil,setId));}
function chooseCard(profile,setId,foil,rng,forcedRarity=null){const rarity=forcedRarity??weightedRarity(rng);let pool=candidates(profile,setId,rarity,foil);if(!pool.length)pool=anyCandidates(profile,setId,foil);if(!pool.length)throw new Error(foil?"All Foil cards in this set are complete.":"No eligible Normal cards remain in this set.");return pool[Math.floor(rng()*pool.length)]??pool[0];}
function choosePull(profile,setId,preferredFoil,rng,forcedRarity=null){try{return{card:chooseCard(profile,setId,preferredFoil,rng,forcedRarity),foil:preferredFoil};}catch(error){if(!preferredFoil&&anyCandidates(profile,setId,true).length)return{card:chooseCard(profile,setId,true,rng,forcedRarity),foil:true};throw error;}}
function recordPull(profile,card,foil){const before={normal:ownedCount(profile,card.id,"normal"),foil:ownedCount(profile,card.id,"foil")};const result=addOwnedCard(profile,card.id,{foil});let superstarUnlocked=false;if(card.kind==="superstar"&&!profile.unlockedSuperstars.includes(card.superstarId)){unlockSuperstar(profile,card.superstarId);superstarUnlocked=true;profile.packsSinceSuperstarUnlockBySet??={};profile.packsSinceSuperstarUnlockBySet[card.setId]=0;if(card.setId===DEFAULT_BOOSTER_SET_ID)profile.packsSinceSuperstarUnlock=0;}
  // Newly owned cards automatically fill any incomplete collection-built deck.
  // Once a deck reaches 55, we stop rebuilding it so player customization is preserved.
  for(const superstarId of profile.unlockedSuperstars??[]){const saved=profile.savedDecks?.[superstarId]??[];if(saved.length>=55)continue;const rebuilt=buildBestOwnedDeck(profile,superstarId);profile.savedDecks??={};profile.savedDecks[superstarId]=rebuilt;profile.deckNeedsCards??={};profile.deckNeedsCards[superstarId]=Math.max(0,55-rebuilt.length);}
  return{card,foil,isNewCard:(before.normal+before.foil)===0,isNewFinish:before[foil?"foil":"normal"]===0,superstarUnlocked,replacedNormal:!!result.replacedNormal};}
function setSuperstarIds(setId){return cardsForSet(setId).filter(c=>c.kind==="superstar").map(c=>c.superstarId);}
export function openBooster(profile,rng=Math.random,setId=DEFAULT_BOOSTER_SET_ID){
  if(!profile)throw new Error("Profile required");if(boosterCreditsFor(profile,setId)<1)throw new Error(`No ${setCollectionFor(setId)?.displayName??setId} booster packs available`);if(!boosterSetAvailable(profile,setId))throw new Error(`${setCollectionFor(setId)?.displayName??setId} is currently vaulted from standard boosters.`);
  profile.boosterCreditsBySet??={};profile.boosterCreditsBySet[setId]=(profile.boosterCreditsBySet[setId]??0)-1;syncLegacySummer(profile);
  profile.packsOpened=(profile.packsOpened??0)+1;profile.packsOpenedBySet??={};profile.packsOpenedBySet[setId]=(profile.packsOpenedBySet[setId]??0)+1;recordChallengeMetric(profile,"packs",1);
  const foilSlot=Math.min(BOOSTER_SIZE-1,Math.floor(rng()*BOOSTER_SIZE));const setStars=setSuperstarIds(setId);const locked=cardsForSet(setId).filter(c=>c.kind==="superstar"&&!profile.unlockedSuperstars.includes(c.superstarId));profile.packsSinceSuperstarUnlockBySet??={};const pityCount=Math.max(profile.packsSinceSuperstarUnlockBySet[setId]??0,setId===DEFAULT_BOOSTER_SET_ID?(profile.packsSinceSuperstarUnlock??0):0);const pityActive=locked.length&&pityCount>=SUPERSTAR_PITY_PACKS-1;const pitySlot=pityActive?Math.min(BOOSTER_SIZE-1,Math.floor(rng()*BOOSTER_SIZE)):-1;const pityCard=pityActive?locked[Math.floor(rng()*locked.length)]:null;
  const pulls=[];let unlockedInPack=false;for(let i=0;i<BOOSTER_SIZE;i++){let pull;if(i===pitySlot&&pityCard&&boosterEligible(profile,pityCard,true,setId))pull={card:pityCard,foil:true};else pull=choosePull(profile,setId,i===foilSlot,rng);const recorded=recordPull(profile,pull.card,pull.foil);if(recorded.superstarUnlocked)unlockedInPack=true;pulls.push(recorded);}if(!unlockedInPack&&profile.unlockedSuperstars.filter(id=>setStars.includes(id)).length<setStars.length)profile.packsSinceSuperstarUnlockBySet[setId]=pityCount+1;if(setId===DEFAULT_BOOSTER_SET_ID)profile.packsSinceSuperstarUnlock=profile.packsSinceSuperstarUnlockBySet[setId]??0;return pulls;
}
export function grantBooster(profile,amount=1,setId=DEFAULT_BOOSTER_SET_ID){profile.boosterCreditsBySet??={};profile.boosterCreditsBySet[setId]=(profile.boosterCreditsBySet[setId]??0)+amount;syncLegacySummer(profile);return profile.boosterCreditsBySet[setId];}
function consumePackQueue(state,key,setId=null){state[key]??=[];if(setId){const i=state[key].indexOf(setId);if(i>=0){state[key].splice(i,1);return setId;}}return state[key].shift()??setId??DEFAULT_BOOSTER_SET_ID;}
export function openLadderCompletionPack(profile,rng=Math.random,setId=null){
  if(!profile)throw new Error("Profile required");const ladder=ladderState(profile);if((ladder.completionPackCredits??0)<1)throw new Error("No Climb the Ladder Completion Packs available");const actualSet=consumePackQueue(ladder,"completionPackQueue",setId);ladder.completionPackCredits-=1;ladder.completionPackCreditsBySet??={};ladder.completionPackCreditsBySet[actualSet]=Math.max(0,(ladder.completionPackCreditsBySet[actualSet]??1)-1);recordChallengeMetric(profile,"packs",1);
  const foilSlot=Math.min(BOOSTER_SIZE-1,Math.floor(rng()*BOOSTER_SIZE)),vrSlot=Math.min(BOOSTER_SIZE-1,Math.floor(rng()*BOOSTER_SIZE));const lockedSuperstars=cardsForSet(actualSet).filter(c=>c.kind==="superstar"&&!profile.unlockedSuperstars.includes(c.superstarId)&&boosterEligible(profile,c,true,actualSet));const pending=ladder.firstClearSuperstarPendingBySet?.[actualSet]??(actualSet===DEFAULT_BOOSTER_SET_ID&&ladder.firstClearSuperstarPending);const guaranteedSuperstar=pending&&lockedSuperstars.length?lockedSuperstars[Math.floor(rng()*lockedSuperstars.length)]:null;const guaranteedSlot=guaranteedSuperstar?vrSlot:-1;const pulls=[];
  for(let i=0;i<BOOSTER_SIZE;i++){const preferredFoil=i===foilSlot;let pull;if(i===guaranteedSlot){pull=boosterEligible(profile,guaranteedSuperstar,true,actualSet)?{card:guaranteedSuperstar,foil:true}:choosePull(profile,actualSet,preferredFoil,rng,4);}else pull=choosePull(profile,actualSet,preferredFoil,rng,i===vrSlot?4:null);pulls.push(recordPull(profile,pull.card,pull.foil));}if(guaranteedSuperstar)consumeFirstClearSuperstarGuarantee(profile,actualSet);return pulls;
}
export function openChampionshipPack(profile,rng=Math.random,setId=null){
  if(!profile)throw new Error("Profile required");const road=championshipRoadState(profile);if((road.championshipPackCredits??0)<1)throw new Error("No Championship Packs available");const actualSet=consumePackQueue(road,"championshipPackQueue",setId);road.championshipPackCredits-=1;road.championshipPackCreditsBySet??={};road.championshipPackCreditsBySet[actualSet]=Math.max(0,(road.championshipPackCreditsBySet[actualSet]??1)-1);recordChallengeMetric(profile,"packs",1);const foilSlot=Math.min(BOOSTER_SIZE-1,Math.floor(rng()*BOOSTER_SIZE)),premiumSlot=Math.min(BOOSTER_SIZE-1,Math.floor(rng()*BOOSTER_SIZE));const pulls=[];for(let i=0;i<BOOSTER_SIZE;i++){const forcedRarity=i===premiumSlot?(rng()<0.25?4:3):null;const pull=choosePull(profile,actualSet,i===foilSlot,rng,forcedRarity);pulls.push(recordPull(profile,pull.card,pull.foil));}return pulls;
}
