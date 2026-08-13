import { superstars } from "./superstars.js?v=0.99.0";

export const CHAMPIONSHIP_ROAD_LENGTH = 4;
export const CHAMPIONSHIP_SET_ID = "summerslam-series-1";
export const WORLD_CHAMPIONS = ["cm-punk", "roman-reigns"];
export const CHAMPIONSHIP_STAGES = ["Opening Bout", "Momentum Match", "No. 1 Contender", "Championship Match"];
export const CHAMPIONSHIP_BRANCHES = {
  modern: { id: "modern", label: "Current Era", setId: "summerslam-series-1", finals: ["cm-punk","roman-reigns"] },
  "golden-era": { id: "golden-era", label: "Golden Era", setId: "hall-of-fame-series-1", era: "golden-era", finals: ["hulk-hogan","andre-the-giant"] },
  "attitude-era": { id: "attitude-era", label: "Attitude Era", setId: "hall-of-fame-series-1", era: "attitude-era", finals: ["stone-cold-steve-austin","the-undertaker"] },
  evolution: { id: "evolution", label: "Evolution", setId: "evolution-series-1", finals: ["rhea-ripley","liv-morgan"] }
};
function ensure(profile) {
  profile.championshipRoad ??= { activeRun: null, clears: 0, bestStage: 0, championshipPackCredits: 0, completedBy: [] };
  profile.championshipRoad.clearsByBranch ??= {};
  profile.championshipRoad.bestStageByBranch ??= {};
  profile.championshipRoad.completedByBranch ??= {};
  profile.championshipRoad.championshipPackCreditsBySet ??= {};
  profile.championshipRoad.championshipPackQueue ??= [];
  return profile.championshipRoad;
}
function shuffle(values, rng = Math.random) { const out=[...values]; for(let i=out.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[out[i],out[j]]=[out[j],out[i]];} return out; }
function chooseFinalOpponent(superstarId, branch, rng = Math.random) {
  const finals = branch.finals;
  if (finals.includes(superstarId) && finals.length > 1) return finals.find(id => id !== superstarId);
  return finals[Math.floor(rng() * finals.length)] ?? finals[0];
}
export function championshipRoadState(profile) { return ensure(profile); }
export function startChampionshipRoad(profile, superstarId, opponentIds, rng = Math.random, branchId = "modern") {
  const state=ensure(profile), branch=CHAMPIONSHIP_BRANCHES[branchId] ?? CHAMPIONSHIP_BRANCHES.modern;
  const starById=Object.fromEntries(Object.values(superstars).map(s=>[s.id,s]));
  opponentIds=opponentIds.filter(id=>starById[id]?.setId===branch.setId&&(!branch.era||starById[id]?.era===branch.era));
  const finalOpponent=chooseFinalOpponent(superstarId,branch,rng);
  let prelimPool=opponentIds.filter(id=>id!==superstarId&&id!==finalOpponent);
  if (prelimPool.length < CHAMPIONSHIP_ROAD_LENGTH - 1) prelimPool = opponentIds.filter(id=>id!==finalOpponent); // era branches allow a mirror match when needed
  const prelims=shuffle(prelimPool,rng).slice(0,CHAMPIONSHIP_ROAD_LENGTH-1);
  if(prelims.length!==CHAMPIONSHIP_ROAD_LENGTH-1) throw new Error("Not enough Championship Road opponents");
  state.activeRun={superstarId,branchId:branch.id,setId:branch.setId,opponents:[...prelims,finalOpponent],stage:0,status:"active",startedAt:new Date().toISOString()};
  return state.activeRun;
}
export function currentChampionshipOpponent(profile){const run=ensure(profile).activeRun;return !run||run.status!=="active"?null:run.opponents[run.stage]??null;}
export function recordChampionshipMatch(profile,result){
  const state=ensure(profile),run=state.activeRun;if(!run||run.status!=="active")throw new Error("No active Championship Road run");
  if(result==="draw"||result==="loss")return{status:"retry",run};if(result!=="win")throw new Error("Invalid Championship Road result");
  run.stage+=1;state.bestStage=Math.max(state.bestStage??0,run.stage);state.bestStageByBranch[run.branchId]=Math.max(state.bestStageByBranch[run.branchId]??0,run.stage);
  if(run.stage>=run.opponents.length){run.status="cleared";state.clears=(state.clears??0)+1;state.clearsByBranch[run.branchId]=(state.clearsByBranch[run.branchId]??0)+1;state.championshipPackCredits=(state.championshipPackCredits??0)+1;state.championshipPackCreditsBySet[run.setId]=(state.championshipPackCreditsBySet[run.setId]??0)+1;state.championshipPackQueue.push(run.setId);state.completedByBranch[run.branchId]??=[];const firstWithSuperstar=!state.completedByBranch[run.branchId].includes(run.superstarId);if(firstWithSuperstar)state.completedByBranch[run.branchId].push(run.superstarId);if(!state.completedBy.includes(run.superstarId))state.completedBy.push(run.superstarId);return{status:"cleared",run,championshipPackAwarded:true,firstWithSuperstar};}
  return{status:"advance",run};
}
export function resetChampionshipRoad(profile){ensure(profile).activeRun=null;return ensure(profile);}
