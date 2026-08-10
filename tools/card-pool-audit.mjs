
import { cards } from "../js/data/cards.js";
import { hallCards } from "../js/data/hall-of-fame-cards.js";
import { evolutionCards } from "../js/data/evolution-cards.js";
import { rockCards } from "../js/data/season1-rock-cards.js";
import { decks } from "../js/data/decks.js";
import { superstars } from "../js/data/superstars.js";
import { collectionCardsBySet } from "../js/data/collection.js";

function flatten(obj){
  const out=[];
  for(const v of Object.values(obj)){
    if(v?.id) out.push(v);
    else if(v && typeof v==="object") for(const n of Object.values(v)) if(n?.id) out.push(n);
  }
  return out;
}
const sources={
 "summerslam-series-1":flatten(cards),
 "hall-of-fame-series-1":flatten(hallCards),
 "evolution-series-1":flatten(evolutionCards),
 "season-1-final-boss":flatten(rockCards)
};
const roster={
 "summerslam-series-1":["cody-rhodes","cm-punk","roman-reigns","seth-rollins","oba-femi","brock-lesnar","kevin-owens","gunther"],
 "hall-of-fame-series-1":["hulk-hogan","andre-the-giant","randy-savage","ultimate-warrior","stone-cold-steve-austin","the-undertaker","mankind","kane"],
 "evolution-series-1":["rhea-ripley","liv-morgan","becky-lynch","bayley","charlotte-flair","iyo-sky","paige","stephanie-vaquer"],
 "season-1-final-boss":["the-rock"]
};
const starById=Object.fromEntries(Object.values(superstars).map(s=>[s.id,s]));
const norm=n=>(n??"").toLowerCase().replace(/[’']/g,"'").replace(/[^a-z0-9]+/g," ").trim();
const gameplaySig=c=>JSON.stringify({
 name:norm(c.name),kind:c.kind,method:c.method??null,cost:c.cost??null,
 req:c.requirements??{},damage:c.damage??null,post:c.setOpponentPosture??null,
 requiresPosture:c.requiresPosture??null,loc:c.requiresLocation??null,
 submission:c.submission??null,trademark:!!c.trademark,finisher:!!c.finisher,
 defensiveOnly:!!c.defensiveOnly,counterMethods:c.counterMethods??[],
 effects:c.effects??c.onConnect??null
});
for(const [setId,ids] of Object.entries(roster)){
 const usedIds=new Set();
 const usedCards=[];
 for(const sid of ids){
   for(const c of decks[sid]??[]){usedIds.add(c.id);usedCards.push(c);}
   const s=starById[sid];
   if(s?.entranceId) usedIds.add(s.entranceId);
   for(const x of s?.managerIds??[]) usedIds.add(x);
   if(s?.managerId) usedIds.add(s.managerId);
 }
 const defined=sources[setId];
 const definedIds=new Set(defined.map(c=>c.id));
 const usedDefined=defined.filter(c=>usedIds.has(c.id));
 const usedExternal=[...new Map(usedCards.filter(c=>!definedIds.has(c.id)).map(c=>[c.id,c])).values()];
 const unused=defined.filter(c=>!usedIds.has(c.id));
 const coll=collectionCardsBySet[setId]??[];
 console.log(JSON.stringify({
  setId,
  currentCollection:coll.length,
  currentNonSuperstar:coll.filter(c=>c.kind!=="superstar").length,
  defined:defined.length,
  usedDefined:usedDefined.length,
  unusedDefined:unused.length,
  usedExternal:usedExternal.length,
  unused:unused.map(c=>({id:c.id,name:c.name,kind:c.kind,superstarId:c.superstarId??null})),
  usedExternal:usedExternal.map(c=>({id:c.id,name:c.name,setId:c.setId??null}))
 }));
}
