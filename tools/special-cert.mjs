
import assert from "node:assert/strict";
import { MatchEngine } from "../js/engine/MatchEngine.js";
import { superstars } from "../js/data/superstars.js";
import { decks } from "../js/data/decks.js";
import { cards } from "../js/data/cards.js";

const star=id=>Object.values(superstars).find(s=>s.id===id);
const make=(a,b)=>new MatchEngine({superstarA:star(a),superstarB:star(b),deckA:decks[a],deckB:decks[b],rng:()=>0.99});

// Static deck presence / exclusivity.
const expected={
 "cm-punk":"punk-best-in-the-world","roman-reigns":"roman-tribal-chief","cody-rhodes":"cody-finish-the-story",
 "seth-rollins":"seth-the-visionary","oba-femi":"oba-destroyer","brock-lesnar":"brock-beast-incarnate",
 "kevin-owens":"ko-show","gunther":"mat-is-sacred"
};
for(const [id,cid] of Object.entries(expected)){
 assert.equal(decks[id].filter(c=>c.id===cid).length,1,`${id} must carry one ${cid}`);
 const c=decks[id].find(c=>c.id===cid); assert.equal(c.superstarId,id);
}

// No hard unsupported method requirements.
for(const id of Object.keys(expected)){
 const methods=new Set(decks[id].filter(c=>c.kind==="momentum").map(c=>c.method));
 for(const c of decks[id].filter(c=>c.kind==="move"&&!c.defensiveOnly))
   for(const [m,n] of Object.entries(c.requirements??{}))
     assert.ok(n<=0||methods.has(m),`${id} cannot support ${c.name}: ${m}`);
}

// Brock Special: direct resolution test using a synthetic legal high-damage move.
{
 const g=make("cody-rhodes","brock-lesnar"), st=g.state();
 const b=st.players.p2; b.hand.push(cards.brockBeastIncarnate);
 // Ensure enough momentum for Cody synthetic Move.
 st.players.p1.momentum.attitude=20;
 const move={...cards.crossRhodes,id:"test-heavy",superstarId:null,cost:1,requirements:{},damage:12,finisher:false};
 st.players.p1.hand.push(move); st.playerInControl="p1"; st.phase="ACTION";
 const before=b.hp; g.declareMove("p1",move); g.passCounter("p2");
 assert.equal(before-b.hp,7,"Beast Incarnate should reduce 12 damage by 5");
 assert.ok(b.momentum.strength>=1);
 assert.ok(b.discard.some(c=>c.id==="brock-beast-incarnate"));
}

// KO Show cancels Action and takes Control.
{
 const g=make("cody-rhodes","kevin-owens"), st=g.state();
 st.players.p2.hand.push(cards.koShow);
 st.players.p1.hand.push(cards.fireUp); st.playerInControl="p1"; st.phase="ACTION";
 const before=st.players.p1.momentum.attitude;
 g.playAction("p1",cards.fireUp);
 assert.equal(st.players.p1.momentum.attitude,before);
 assert.equal(st.playerInControl,"p2");
 assert.ok(st.players.p2.discard.some(c=>c.id==="ko-show"));
}

// Oba's Destroyer marks the next non-Finisher Strength Move uncounterable.
{
 const g=make("oba-femi","cody-rhodes"),st=g.state();
 st.players.p1.hand.push(cards.obaDestroyer);
 st.players.p1.momentum.strength=20;st.players.p1.momentum.attitude=20;
 const m1={...cards.sidewalkSlam,id:"oba-test-1",cost:1,requirements:{},damage:7};
 st.players.p1.hand.push(m1);st.playerInControl="p1";st.phase="ACTION";
 g.declareMove("p1",m1);g.passCounter("p2");g.endPostMove("p1");
 const m2={...cards.militaryPress,id:"oba-test-2",cost:1,requirements:{},damage:7};
 st.players.p1.hand.push(m2);st.playerInControl="p1";st.phase="ACTION";
 g.declareMove("p1",m2);
 assert.equal(st.proposedMove.uncounterable,true);
}

// Gunther Action lock is honored by rules after Special trigger state.
{
 const g=make("gunther","cody-rhodes"),st=g.state();
 st.players.p2.specialFlags.blockActionUntilMove=true;
 st.players.p2.hand.push(cards.fireUp);st.playerInControl="p2";st.phase="ACTION";
 let threw=false;try{g.playAction("p2",cards.fireUp)}catch{threw=true}
 assert.equal(threw,true);
}

console.log("8-Superstar Special certification: PASS");
