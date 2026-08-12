
import assert from "node:assert/strict";
import {decks} from "../js/data/decks.js";
import {superstars} from "../js/data/superstars.js";
import {MatchEngine} from "../js/engine/MatchEngine.js";
import {moveEligibility} from "../js/engine/rules.js";

const ids=[
"cody-rhodes","cm-punk","roman-reigns","seth-rollins","oba-femi","brock-lesnar","kevin-owens","gunther",
"hulk-hogan","andre-the-giant","randy-savage","ultimate-warrior","stone-cold-steve-austin","the-undertaker","mankind","kane",
"rhea-ripley","liv-morgan","becky-lynch","bayley","charlotte-flair","iyo-sky","paige","stephanie-vaquer","the-rock"];
const S=id=>Object.values(superstars).find(s=>s.id===id);
const issues=[];
for(const id of ids){
 const d=decks[id],s=S(id);
 if(!d||d.length!==55)issues.push(`${id}: deck ${d?.length}`);
 if(JSON.stringify(d.slice(0,5).map(c=>c.id))!==JSON.stringify(s.leadOffIds))issues.push(`${id}: lead-off mismatch`);
 const methods=new Set(d.filter(c=>c.kind==="momentum").map(c=>c.method));
 const counts={}, families={};
 for(const c of d){
  counts[c.id]=(counts[c.id]??0)+1;
  if(c.moveFamily)families[c.moveFamily]=(families[c.moveFamily]??0)+1;
  if(c.superstarId && c.superstarId!==id)issues.push(`${id}: illegal exclusive ${c.name} (${c.superstarId})`);
  if(c.kind==="move"&&!c.defensiveOnly)for(const [m,n] of Object.entries(c.requirements??{}))if(n>0&&!methods.has(m))issues.push(`${id}: ${c.name} unsupported ${m}`);
 }
 for(const [cid,n] of Object.entries(counts))if(n>5 && !cid.includes("momentum"))issues.push(`${id}: ${cid} x${n}`);
 for(const [fam,n] of Object.entries(families))if(n>5)issues.push(`${id}: family ${fam} x${n}`);

 // opening-five usability: after each opening Momentum option, at least one offensive Move must be legal.
 for(const mom of d.slice(0,5).filter(c=>c.kind==="momentum")){
  const opp=id==="cody-rhodes"?"kane":"cody-rhodes";
  const g=new MatchEngine({superstarA:s,superstarB:S(opp),deckA:d,deckB:decks[opp],rng:()=>0.99});
  const p=g.state().players.p1;
  const m=p.hand.find(c=>c.id===mom.id);if(!m)continue;
  g.playMomentum("p1",m);
  if(!p.hand.some(c=>c.kind==="move"&&!c.defensiveOnly&&moveEligibility(g.state(),"p1",c).legal))
    issues.push(`${id}: no immediate offense after ${mom.method}`);
 }
}
console.log(JSON.stringify({count:issues.length,issues}));
