import { MatchEngine } from '../js/engine/MatchEngine.js';
import { superstars } from '../js/data/superstars.js';
import { decks } from '../js/data/decks.js';
import { cpuDecision, executeCpuDecision, decisionOwner } from '../js/ai/WrestlingAI.js';
import { effectiveTotalMomentum, moveEligibility } from '../js/engine/rules.js';
function seededRng(seed){let x=seed>>>0;return()=>((x=(1664525*x+1013904223)>>>0)/4294967296)}
const rs=Object.values(superstars); const stMap=new Map(rs.map(s=>[s.id,{t:0,d:0,reasons:{}}]));
for(let rep=0;rep<3;rep++) for(let i=0;i<rs.length;i++)for(let j=0;j<rs.length;j++)if(i!==j){const a=rs[i],b=rs[j],g=new MatchEngine({superstarA:a,superstarB:b,deckA:decks[a.id],deckB:decks[b.id],rng:seededRng(7000+rep*100+i*10+j)});let steps=0;while(g.state().phase!=='MATCH_OVER'&&steps<500){const st=g.state(),o=decisionOwner(st);if(!o)break;const d=cpuDecision(st,o);if(st.phase==='ACTION'&&effectiveTotalMomentum(st.players[o])>=3&&['move','pass','returnToRing'].includes(d.type)){const x=stMap.get(st.players[o].superstar.id);x.t++;if(d.type==='pass'){const moves=st.players[o].hand.filter(c=>c.kind==='move'&&!c.defensiveOnly);if(moves.length){x.d++;for(const c of moves){const e=moveEligibility(st,o,c);if(!e.legal)x.reasons[e.reason]=(x.reasons[e.reason]||0)+1;}}}}executeCpuDecision(g,o);steps++;}}
for(const s of rs){const x=stMap.get(s.id);const top=Object.entries(x.reasons).sort((a,b)=>b[1]-a[1]).slice(0,4).map(([k,v])=>`${k}:${v}`).join(' | ');console.log(`${s.name.padEnd(24)} ${(100*x.d/x.t).toFixed(1)}%  ${top}`)}
