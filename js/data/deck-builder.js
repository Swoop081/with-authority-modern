import { decks } from "./decks.js";import { collectionCards } from "./collection.js";import { superstars } from "./superstars.js";import { evaluateDeckHealth } from "./deck-health.js";const byId=new Map(collectionCards.map(c=>[c.id,c]));const starById=new Map(Object.values(superstars).map(s=>[s.id,s]));export function leadOffIds(sid){return(decks[sid]??[]).slice(0,5).map(c=>c.id);}export function legalForSuperstar(star,card){if(!star||!card||['superstar','entrance'].includes(card.kind))return false;if(card.superstarId&&card.superstarId!==star.id)return false;if(Array.isArray(card.allowedSuperstarIds)&&card.allowedSuperstarIds.length&&!card.allowedSuperstarIds.includes(star.id))return false;for(const[m,n]of Object.entries(card.requirements??{})){const lim=star.methodLimits?.[m];if(lim===0||(Number.isFinite(lim)&&n>lim))return false;}return true;}export function normalizeDeckFinishes(_p,_s,e=[]){return e;}export function recommendedDeckDraft(sid){return(decks[sid]??[]).map(c=>({id:c.id,foil:false}));}export function createDeckDraft(profile,sid){const s=profile?.savedDecks?.[sid];return Array.isArray(s)?s.map(x=>typeof x==='string'?{id:x,foil:false}:x):buildOwnedRecommendedDraft(profile,sid);}export function materializeDraft(d=[]){return d.map(e=>byId.get(e.id??e)).filter(Boolean);}export function validateDeckDraft(_p,sid,d){return evaluateDeckHealth(materializeDraft(d),starById.get(sid));}export function aggregateDeck(d,{tailOnly=false}={}){const arr=tailOnly?d.slice(5):d,m=new Map();for(const e of arr){const id=e.id??e,x=m.get(id)??{id,count:0,foil:0};x.count++;if(e.foil)x.foil++;m.set(id,x);}return[...m.values()].map(x=>({...x,card:byId.get(x.id)}));}export function eligibleOwnedCards(profile,sid){const star=starById.get(sid);return collectionCards.filter(c=>legalForSuperstar(star,c)&&((profile?.ownedCards?.[c.id]?.normal??0)+(profile?.ownedCards?.[c.id]?.foil??0)>0));}export function usedCount(d,id){return d.filter(e=>(e.id??e)===id).length;}export function ownedTotal(p,id){const o=p?.ownedCards?.[id]??{};return(o.normal??0)+(o.foil??0);}export function canAddCard(p,sid,d,id){const c=byId.get(id),star=starById.get(sid),cap=c?.kind==='momentum'?12:5;return!!c&&legalForSuperstar(star,c)&&d.length<55&&usedCount(d,id)<cap&&usedCount(d,id)<Math.max(ownedTotal(p,id),5);}export function addCardToDraft(p,sid,d,id){if(!canAddCard(p,sid,d,id))return d;return[...d,{id,foil:false}];}export function removeCardFromDraft(_p,_sid,d,index){return d.filter((_,i)=>i!==index);}export function optimizeDeck(p,sid){return autoFillOwnedDraft(p,sid,buildOwnedRecommendedDraft(p,sid));}


// v0.11.73 — recommended decks are blueprints, not free cards.
// Build only the copies the player truly owns, preserving authored order.
export function buildOwnedRecommendedDraft(profile,sid){
  const wanted=recommendedDeckDraft(sid),used=new Map(),out=[];
  for(const entry of wanted){
    const id=entry.id??entry,count=used.get(id)??0,owned=ownedTotal(profile,id);
    if(count<owned){out.push({id,foil:false});used.set(id,count+1);}
  }
  return out;
}
export function autoFillOwnedDraft(profile,sid,draft=[]){
  const star=starById.get(sid); if(!star)return [...draft];
  const out=[...draft.map(e=>typeof e==='string'?{id:e,foil:false}:{...e})];
  const target=(decks[sid]??[]).length||55;
  const candidates=eligibleOwnedCards(profile,sid)
    .sort((a,b)=>{
      const ar=(a.rarity??0),br=(b.rarity??0); if(br!==ar)return br-ar;
      const ac=(a.cost??0),bc=(b.cost??0); return ac-bc||a.name.localeCompare(b.name);
    });
  let guard=0;
  while(out.length<target&&guard++<target*20){
    let added=false;
    for(const card of candidates){
      const cap=card.kind==='momentum'?12:5;
      if(usedCount(out,card.id)>=Math.min(cap,ownedTotal(profile,card.id)))continue;
      if(!legalForSuperstar(star,card))continue;
      out.push({id:card.id,foil:false});added=true;if(out.length>=target)break;
    }
    if(!added)break;
  }
  return out;
}
