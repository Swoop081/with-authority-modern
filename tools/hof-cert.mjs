
import assert from "node:assert/strict";
import {MatchEngine} from "../js/engine/MatchEngine.js";
import {superstars} from "../js/data/superstars.js";
import {decks} from "../js/data/decks.js";
import {hallCards} from "../js/data/hall-of-fame-cards.js";
import {moveEligibility} from "../js/engine/rules.js";

const ids=["hulk-hogan","andre-the-giant","randy-savage","ultimate-warrior","stone-cold-steve-austin","the-undertaker","mankind","kane"];
const star=id=>Object.values(superstars).find(s=>s.id===id);

// 55 pages, five fixed Lead Off, no >5 duplicate card IDs, no unsupported methods.
for(const id of ids){
 const d=decks[id]; assert.equal(d.length,55,id);
 assert.deepEqual(d.slice(0,5).map(c=>c.id),star(id).leadOffIds,id+" Lead Off");
 const counts={}; for(const c of d)counts[c.id]=(counts[c.id]??0)+1;
 assert.ok(Object.values(counts).every(v=>v<=5),id+" copy cap");
 const methods=new Set(d.filter(c=>c.kind==="momentum").map(c=>c.method));
 for(const c of d.filter(c=>c.kind==="move"&&!c.defensiveOnly))
   for(const [m,n] of Object.entries(c.requirements??{}))
     assert.ok(n<=0||methods.has(m),`${id}: ${c.name} unsupported ${m}`);
}

// Every Hall starter can play a Momentum then at least one immediate opening Move.
for(const id of ids){
 const opponent=id==="hulk-hogan"?"kane":"hulk-hogan";
 const g=new MatchEngine({superstarA:star(id),superstarB:star(opponent),deckA:decks[id],deckB:decks[opponent],rng:()=>0.99});
 const st=g.state(),p=st.players.p1;
 const mom=p.hand.find(c=>c.kind==="momentum");
 assert.ok(mom,id+" opening momentum");
 g.playMomentum("p1",mom);
 const legal=p.hand.filter(c=>c.kind==="move"&&!c.defensiveOnly&&moveEligibility(st,"p1",c).legal);
 assert.ok(legal.length>0,id+" immediate opening offense");
}

// Manager opening replacement / Manager Zone.
{
 const deck=[hallCards.bobbyHeenan,hallCards.momentum.strength,hallCards.momentum.strike,hallCards.jab,hallCards.bodyslam,...decks["andre-the-giant"].slice(5)];
 const g=new MatchEngine({superstarA:star("andre-the-giant"),superstarB:star("kane"),deckA:deck,deckB:decks.kane,rng:()=>0.99});
 assert.equal(g.state().players.p1.activeManager?.id,"hof1-manager-bobby-heenan");
 assert.equal(g.state().players.p1.hand.length,5);
}

assert.deepEqual(hallCards.paulBearer.allowedSuperstarIds,["the-undertaker"]);
console.log("Hall of Fame certification: PASS");
