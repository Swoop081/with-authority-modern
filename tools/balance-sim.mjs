import { MatchEngine } from "../js/engine/MatchEngine.js";
import { superstars } from "../js/data/superstars.js";
import { decks } from "../js/data/decks.js";
import { collectionCards } from "../js/data/collection.js";
import { executeCpuDecision, decisionOwner } from "../js/ai/WrestlingAI.js";
import { MOVE_TYPE_LABELS, isOffensiveMove } from "../js/data/move-types.js";

const roster = Object.values(superstars);
const cardById = new Map(collectionCards.map(c => [c.id, c]));
for (const deck of Object.values(decks)) for (const c of deck) if (!cardById.has(c.id)) cardById.set(c.id,c);
const seededRng = (seed) => { let x = seed >>> 0; return () => ((x = (1664525 * x + 1013904223) >>> 0) / 4294967296); };

const totals = { matches:0,p1:0,p2:0,draw:0,turns:0,controlChanges:0,moveDeclared:0,counters:0,autoCounters:0,pin:0,submission:0,countOut:0,other:0,winnerHp:0,loserHp:0,steps:0,stalls:0 };
const byType = new Map();
const byStar = new Map(roster.map(s => [s.id,{matches:0,wins:0}]));
const methods = new Map();

function row(map,key){ if(!map.has(key)) map.set(key,{declared:0,countered:0}); return map.get(key); }

for (let rep=0; rep<12; rep++) {
  for (let i=0;i<roster.length;i++) for (let j=0;j<roster.length;j++) {
    const a=roster[i], b=roster[j];
    const g=new MatchEngine({ superstarA:a, superstarB:b, deckA:decks[a.id], deckB:decks[b.id], startingControl:(rep % 2 === 0 ? "p1" : "p2"), rng:seededRng(100000 + rep*10000 + i*100 + j) });
    let steps=0, prevControl=g.state().playerInControl, logIndex=0;
    while(g.state().phase!=="MATCH_OVER" && steps<700){
      const owner=decisionOwner(g.state()); if(!owner) break;
      executeCpuDecision(g,owner); steps++;
      const st=g.state();
      if(st.playerInControl!==prevControl){ totals.controlChanges++; prevControl=st.playerInControl; }
      const fresh=st.log.slice(logIndex); logIndex=st.log.length;
      for(const e of fresh){
        if(e.type==="MOVE_DECLARED"){
          totals.moveDeclared++;
          const c=cardById.get(e.cardId); if(c){ row(byType,c.moveType).declared++; row(methods,c.method).declared++; }
        } else if(e.type==="MOVE_COUNTERED"){
          totals.counters++;
          const c=cardById.get(e.incomingCardId); if(c){ row(byType,c.moveType).countered++; row(methods,c.method).countered++; }
        } else if(e.type==="AUTO_COUNTER"){
          totals.counters++; totals.autoCounters++;
          const c=cardById.get(e.incomingCardId); if(c){ row(byType,c.moveType).countered++; row(methods,c.method).countered++; }
        }
      }
    }
    totals.matches++; totals.steps += steps;
    byStar.get(a.id).matches++; byStar.get(b.id).matches++;
    const st=g.state();
    if(st.phase!=="MATCH_OVER"){ totals.stalls++; totals.draw++; continue; }
    totals.turns += st.turnNumber;
    const winner=st.winner;
    if(winner==="p1"){ totals.p1++; byStar.get(a.id).wins++; }
    else if(winner==="p2"){ totals.p2++; byStar.get(b.id).wins++; }
    else totals.draw++;
    const finish=st.finish?.type ?? "other";
    if(finish==="pin") totals.pin++; else if(finish==="submission") totals.submission++; else if(finish==="count-out") totals.countOut++; else totals.other++;
    if(winner){
      const loser=winner==="p1"?"p2":"p1";
      totals.winnerHp += st.players[winner].hp;
      totals.loserHp += st.players[loser].hp;
    }
  }
}

const pct=(n,d=totals.matches)=>(100*n/d).toFixed(1)+"%";
console.log(`Matches: ${totals.matches} | stalls ${totals.stalls}`);
console.log(`P1 ${totals.p1} (${pct(totals.p1)}) | P2 ${totals.p2} (${pct(totals.p2)}) | draws ${totals.draw}`);
console.log(`Avg turns ${(totals.turns/(totals.matches-totals.stalls)).toFixed(2)} | Avg control changes ${(totals.controlChanges/totals.matches).toFixed(2)}`);
console.log(`Moves declared ${totals.moveDeclared} | countered ${totals.counters} (${pct(totals.counters,totals.moveDeclared)}) | auto ${totals.autoCounters}`);
console.log(`Finish: pin ${totals.pin} (${pct(totals.pin)}) | submission ${totals.submission} (${pct(totals.submission)}) | count-out ${totals.countOut} (${pct(totals.countOut)})`);
console.log(`Avg winner HP ${(totals.winnerHp/(totals.matches-totals.stalls)).toFixed(2)} | loser HP ${(totals.loserHp/(totals.matches-totals.stalls)).toFixed(2)}`);
console.log("\nCounter rate by Move Type:");
for(const [type,r] of [...byType].sort((a,b)=>b[1].declared-a[1].declared)) console.log(`${MOVE_TYPE_LABELS[type]??type}: ${r.countered}/${r.declared} ${pct(r.countered,r.declared)}`);
console.log("\nCounter rate by Method:");
for(const [m,r] of [...methods].sort((a,b)=>b[1].declared-a[1].declared)) console.log(`${m}: ${r.countered}/${r.declared} ${pct(r.countered,r.declared)}`);
console.log("\nWin rate by Superstar:");
for(const s of roster.map(s=>({name:s.name,...byStar.get(s.id)})).sort((a,b)=>b.wins/b.matches-a.wins/a.matches)) console.log(`${s.name}: ${s.wins}/${s.matches} ${pct(s.wins,s.matches)}`);

const moveCards=collectionCards.filter(c=>c.kind==="move");
const offensive=moveCards.filter(isOffensiveMove);
const defensive=moveCards.filter(c=>c.defensiveOnly);
console.log(`\nMove pool: ${moveCards.length} total | ${offensive.length} offensive | ${defensive.length} defensive-only | ${offensive.filter(c=>c.counters?.length).length}/${offensive.length} offensive Moves can counter at least one Move Type.`);
