import { superstars } from '../js/data/superstars.js';
import { decks } from '../js/data/decks.js';
import { MatchEngine } from '../js/engine/MatchEngine.js';
import { decisionOwner, cpuDecision, executeCpuDecision } from '../js/ai/WrestlingAI.js';

const SET_IDS = [
  'summerslam-series-1',
  'evolution-series-1',
  'raw-series-1',
  'worlds-collide-series-1',
  'new-generation-series-1',
  'golden-era-series-1',
  'attitude-era-series-1'
];
const SET_LABEL = {
  'summerslam-series-1':'SummerSlam',
  'evolution-series-1':'Evolution',
  'raw-series-1':'RAW',
  'worlds-collide-series-1':'Worlds Collide',
  'new-generation-series-1':'New Generation',
  'golden-era-series-1':'Golden Era',
  'attitude-era-series-1':'Attitude Era'
};
const stars = Object.values(superstars).filter(s=>SET_IDS.includes(s.setId));
const bySet = Object.fromEntries(SET_IDS.map(id=>[id,stars.filter(s=>s.setId===id)]));
for(const id of SET_IDS) if(bySet[id].length!==8) throw new Error(`${id} expected 8 Superstars, found ${bySet[id].length}`);

function rng(seed){let x=seed>>>0;return()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296;};}
const starStats=Object.fromEntries(stars.map(s=>[s.id,{id:s.id,name:s.name,setId:s.setId,wins:0,losses:0,crossWins:0,crossLosses:0,turns:0,abilityUses:0}]));
const setStats=Object.fromEntries(SET_IDS.map(id=>[id,{setId:id,name:SET_LABEL[id],wins:0,losses:0}]));
const matrix=Object.fromEntries(SET_IDS.map(a=>[a,Object.fromEntries(SET_IDS.map(b=>[b,{wins:0,losses:0}]))]));
const finishes={}; let matches=0,stalls=0,totalTurns=0,p1Wins=0,p2Wins=0;

for(let i=0;i<stars.length;i++) for(let j=i+1;j<stars.length;j++) for(let k=0;k<16;k++){
  const flip=k%2===1,p1=flip?stars[j]:stars[i],p2=flip?stars[i]:stars[j];
  const g=new MatchEngine({p1,p2,decks,rng:rng(138300000+i*100003+j*1009+k*37)});
  let steps=0;
  while(g.state().phase!=='MATCH_OVER'&&steps++<2000){const pid=decisionOwner(g.state());if(!pid)break;const d=cpuDecision(g,pid);if(!d||!executeCpuDecision(g,d,pid))break;}
  const s=g.state(); matches++; totalTurns+=s.turnNumber;
  starStats[p1.id].turns+=s.turnNumber;starStats[p2.id].turns+=s.turnNumber;
  starStats[p1.id].abilityUses+=s.players.p1.abilityUses??0;starStats[p2.id].abilityUses+=s.players.p2.abilityUses??0;
  if(s.phase!=='MATCH_OVER'||!s.winner){stalls++;continue;}
  const winPid=s.winner,losePid=winPid==='p1'?'p2':'p1'; if(winPid==='p1')p1Wins++; else p2Wins++;
  const ws=s.players[winPid].superstar,ls=s.players[losePid].superstar;
  starStats[ws.id].wins++;starStats[ls.id].losses++;
  finishes[s.finish?.type??'unknown']=(finishes[s.finish?.type??'unknown']??0)+1;
  if(ws.setId!==ls.setId){
    starStats[ws.id].crossWins++;starStats[ls.id].crossLosses++;
    setStats[ws.setId].wins++;setStats[ls.setId].losses++;
    matrix[ws.setId][ls.setId].wins++;matrix[ls.setId][ws.setId].losses++;
  }
}
const pct=(w,l)=>Number((100*w/Math.max(1,w+l)).toFixed(1));
const setRows=SET_IDS.map(id=>({...setStats[id],winRate:pct(setStats[id].wins,setStats[id].losses)})).sort((a,b)=>b.winRate-a.winRate);
const starRows=Object.values(starStats).map(r=>({...r,winRate:pct(r.wins,r.losses),crossWinRate:pct(r.crossWins,r.crossLosses),avgTurns:Number((r.turns/Math.max(1,r.wins+r.losses)).toFixed(2)),avgAbilityUses:Number((r.abilityUses/Math.max(1,r.wins+r.losses)).toFixed(2))})).sort((a,b)=>b.crossWinRate-a.crossWinRate);
const matrixRows=SET_IDS.map(a=>({set:SET_LABEL[a],...Object.fromEntries(SET_IDS.map(b=>[SET_LABEL[b],a===b?null:pct(matrix[a][b].wins,matrix[a][b].losses)]))}));
console.log(JSON.stringify({superstars:stars.length,matches,stalls,averageTurns:Number((totalTurns/matches).toFixed(2)),p1WinRate:Number((100*p1Wins/Math.max(1,p1Wins+p2Wins)).toFixed(2)),finishes,setRows,starRows,matrixRows},null,2));
if(stalls)process.exitCode=1;
