import { MatchEngine } from "../js/engine/MatchEngine.js";
import { superstars } from "../js/data/superstars.js";
import { decks } from "../js/data/decks.js";
import { executeCpuDecision, decisionOwner } from "../js/ai/WrestlingAI.js";
const roster=Object.values(superstars);
const rng=(seed)=>{let x=seed>>>0;return()=>((x=(1664525*x+1013904223)>>>0)/4294967296)};
const stats=new Map(roster.map(s=>[s.id,{m:0,w:0,ability:0,entranceEffect:0,draws:0,connected:0,countered:0,damage:0,turns:0}]));
for(let rep=0;rep<8;rep++) for(let i=0;i<roster.length;i++) for(let j=0;j<roster.length;j++){
 const a=roster[i],b=roster[j], g=new MatchEngine({superstarA:a,superstarB:b,deckA:decks[a.id],deckB:decks[b.id],startingControl:rep%2?'p2':'p1',rng:rng(888000+rep*10000+i*100+j)});
 let li=0,steps=0;
 while(g.state().phase!=="MATCH_OVER"&&steps<700){const o=decisionOwner(g.state());if(!o)break;executeCpuDecision(g,o);steps++;const fresh=g.state().log.slice(li);li=g.state().log.length;for(const e of fresh){const sid=(pid)=>pid==='p1'?a.id:b.id;if(e.type==='SUPERSTAR_ABILITY')stats.get(sid(e.playerId)).ability++;if(e.type==='ENTRANCE_EFFECT')stats.get(sid(e.playerId)).entranceEffect++;if(e.type==='CARDS_DRAWN')stats.get(sid(e.playerId)).draws+=e.cardIds.length;if(e.type==='MOVE_CONNECTED'){stats.get(sid(e.attackerId)).connected++;stats.get(sid(e.attackerId)).damage+=e.damage;}if(e.type==='MOVE_COUNTERED'||e.type==='AUTO_COUNTER')stats.get(sid(e.defenderId)).countered++;}}
 for(const [id] of [[a.id],[b.id]]){stats.get(id).m++;stats.get(id).turns+=g.state().turnNumber;} if(g.state().winner==='p1')stats.get(a.id).w++; if(g.state().winner==='p2')stats.get(b.id).w++;
}
for(const s of roster){const x=stats.get(s.id);console.log(`${s.name.padEnd(24)} win ${(100*x.w/x.m).toFixed(1)}% | ability ${(x.ability/x.m).toFixed(2)} | entrance ${(x.entranceEffect/x.m).toFixed(2)} | draws ${(x.draws/x.m).toFixed(2)} | connects ${(x.connected/x.m).toFixed(2)} | counters ${(x.countered/x.m).toFixed(2)} | dmg ${(x.damage/x.m).toFixed(1)}`)}
