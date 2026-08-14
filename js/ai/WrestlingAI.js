import { moveEligibility, counterEligibility, autoCounterEligibility, canPlaySpecial, canPlayMomentum, canPlayAction, canPlaySupport, canPlayManager, canAttemptPin, submissionThreshold } from "../engine/rules.js";
import { healthRatio, healthZone } from "../engine/health.js";
export function decisionOwner(state){if(state.phase==="MATCH_OVER")return null;if(state.phase==="COUNTER")return state.proposedMove?.defenderId??null;if(state.phase==="PIN_RESPONSE")return state.proposedPin?.defenderId??null;if(state.phase==="SUBMISSION_MAINTAIN")return state.submission?.attackerId??null;return state.playerInControl;}
function groundState(p){return p?.posture==='on-mat'||p?.posture==='grounded';}
function incomingSubmissionWouldTap(state,pid,card){
 if(!card?.submission)return false;
 const p=state.players?.[pid],part=card.submission.bodyPart;
 if(!p||!part)return false;
 const prior=(p.submissionHistory?.[part]??0)>0;
 const projected=(p.submissionDamage?.[part]??0)+(card.submission.pressure??0);
 return prior&&projected>=submissionThreshold(p);
}
function cpuShouldAutoCounter(state,pid,card){
 if(!card||card.finisher)return false;
 const p=state.players?.[pid];
 if(!p)return false;
 const midOrHigh=(card.cost??0)>=4;
 const lethal=(card.damage??0)>=p.hp;
 return !!card.trademark||midOrHigh||lethal||incomingSubmissionWouldTap(state,pid,card);
}
function cpuPostAutoCounterActionState(state,pid){
 const p=state.players[pid];
 return {...state,phase:'ACTION',playerInControl:pid,proposedMove:null,postMove:null,players:{...state.players,[pid]:{...p,turn:{momentumPlayed:0,momentumPlayLimit:1,actionPlayed:0,supportPlayed:0,specialPlayed:0},momentumPlayedThisTurn:false}}};
}
function cpuPlayableAfterAutoCounter(state,pid,card){
 const sim=cpuPostAutoCounterActionState(state,pid);
 if(card?.kind==='move')return !card.defensiveOnly&&moveEligibility(sim,pid,card).legal;
 if(card?.kind==='momentum')return canPlayMomentum(sim,pid,card);
 if(card?.kind==='action')return canPlayAction(sim,pid,card);
 if(card?.kind==='support')return canPlaySupport(sim,pid,card);
 if(card?.kind==='manager')return canPlayManager(sim,pid,card);
 if(card?.kind==='special')return canPlaySpecial(sim,pid,card);
 return false;
}
function cpuAutoCounterSelection(state,pid,cost){
 const p=state.players[pid];
 const ranked=p.hand.map((card,index)=>{
   const playable=cpuPlayableAfterAutoCounter(state,pid,card);
   let score=playable?10000:0;
   if(card.kind==='special')score+=100;if(card.finisher)score+=90;if(card.trademark)score+=60;
   if(card.kind==='move'){score+=(card.damage??0)*2+(card.cost??0);if((card.counterStates?.length??0)||(card.counterSubmissionTargets?.length??0)||(card.counters?.length??0)||(card.countersCardIds?.length??0))score+=25;}
   else if(card.kind==='momentum')score+=20;else score+=18;
   return {card,index,score,playable};
 });
 if(ranked.filter(x=>x.playable).length<2)return null;
 const discard=ranked.sort((a,b)=>a.score-b.score||a.index-b.index).slice(0,cost);
 const discardSet=new Set(discard.map(x=>x.index));
 const playableRemaining=ranked.filter(x=>!discardSet.has(x.index)&&x.playable).length;
 return playableRemaining>=2?discard.map(x=>x.index):null;
}
function moveScore(state,pid,card){
 const p=state.players[pid],def=state.players[pid==='p1'?'p2':'p1'];
 let score=(card.damage??0)*2;
 if(card.finisher)score+=35;if(card.trademark)score+=8;
 if((card.damage??0)>=def.hp)score+=50;
 if(card.groundOpponent&&!groundState(def))score+=4;
 if(card.searchOnConnectName)score+=8;
 // Sequence-aware heuristics: preserve locked card data; teach the CPU how to use it.
 if(p.superstar.id==='tiffany-stratton'){
   const hasPme=p.hand.some(x=>x.id==='tiffany-stratton-prettiest-moonsault-ever');
   const hasGroundedAgility=p.hand.some(x=>x.kind==='move'&&x.method==='agility'&&x.groundedOnly);
   if(!groundState(def)&&card.method==='strength'&&card.groundOpponent&&(hasPme||hasGroundedAgility))score+=24;
   if(!groundState(def)&&card.id==='tiffany-stratton-handspring-back-elbow')score+=28;
   if(groundState(def)&&card.method==='agility')score+=10;
 }
 if(p.superstar.id==='damian-priest'){
   if(p.events?.priestPunishmentBonus&&['strength','strike'].includes(card.method))score+=12;
   if(card.id==='damian-priest-south-of-heaven'&&!p.hand.some(x=>x.finisher))score+=8;
 }
 if(p.superstar.id==='chelsea-green'&&card.trademark)score+=4;
 if(p.superstar.id==='bayley'&&p.lastConnectedMethod&&card.method&&card.method!==p.lastConnectedMethod)score+=16;
 if(p.superstar.id==='becky-lynch'){
   if(card.method==='strike'&&p.hand.some(x=>x.kind==='move'&&x.method==='technical'))score+=8;
   if(card.method==='technical'&&(p.methodDiscount?.technical??0)>0)score+=14;
 }
 if(p.superstar.id==='damian-priest'&&card.id==='damian-priest-south-of-heaven'&&!groundState(def))score+=18;
 return score;
}
export function cpuDecision(game,pid="p2"){
 const s=game.state(),p=s.players[pid];if(decisionOwner(s)!==pid)return null;
 if(s.phase==="COUNTER"){const incoming=s.proposedMove.card,c=p.hand.find(x=>counterEligibility(s,pid,incoming,x).legal);if(c)return{type:"counter",card:c};const auto=autoCounterEligibility(s,pid,incoming);if(auto.legal&&cpuShouldAutoCounter(s,pid,incoming)){const indices=cpuAutoCounterSelection(s,pid,auto.cost);if(indices)return{type:"autoCounter",indices};}return{type:"passCounter"};}
 if(s.phase==="PIN_RESPONSE"){const c=p.hand.find(x=>x.pinEscape||x.special?.type==='pinEscape');return c?{type:"pinEscape",card:c}:{type:"passPin"};}
 if(s.phase==="SUBMISSION_MAINTAIN"){const def=s.players[s.submission.defenderId],threshold=submissionThreshold(def);return p.hand.length&&def.submissionDamage[s.submission.bodyPart]<threshold?{type:"maintain",index:0}:{type:"release"};}
 if(s.phase==="ACTION"){
   const def=s.players[pid==="p1"?"p2":"p1"],hpRatio=healthRatio(def);
   const readyFinisher=p.hand.find(x=>x.kind==="move"&&x.finisher&&!x.defensiveOnly&&moveEligibility(s,pid,x).legal);
   if(canAttemptPin(s,pid).legal&&!readyFinisher&&healthZone(def)==="red")return{type:"pin"};
   const sp=p.hand.find(x=>canPlaySpecial(s,pid,x));if(sp)return{type:"special",card:sp};
   const mom=p.hand.find(x=>canPlayMomentum(s,pid,x));if(mom)return{type:"momentum",card:mom};
   let moves=p.hand.filter(x=>x.kind==="move"&&!x.defensiveOnly&&moveEligibility(s,pid,x).legal);
   if(['tiffany-stratton','damian-priest','chelsea-green','bayley','becky-lynch'].includes(p.superstar.id))moves=moves.sort((a,b)=>moveScore(s,pid,b)-moveScore(s,pid,a));
   else moves=moves.sort((a,b)=>(Number(!!b.finisher)-Number(!!a.finisher))||((b.damage??0)-(a.damage??0)));
   if(moves[0])return{type:"move",card:moves[0]};
   const utility=p.hand.find(x=>(x.kind==="action"&&canPlayAction(s,pid,x))||(x.kind==="support"&&(p.turn?.supportPlayed??0)<1)||(x.kind==="manager"&&!p.activeManager));if(utility)return{type:utility.kind,card:utility};
   return{type:"pass"};
 }
 return null;
}
export function executeCpuDecision(game,d,pid="p2"){if(!d)return false;if(d.type==="counter")return game.counter(pid,d.card);if(d.type==="autoCounter")return game.autoCounter(pid,d.indices);if(d.type==="passCounter")return game.passCounter(pid);if(d.type==="pinEscape")return game.playPinEscape(pid,d.card);if(d.type==="passPin")return game.passPinResponse(pid);if(d.type==="maintain")return game.maintainSubmission(pid,d.index);if(d.type==="release")return game.releaseSubmission(pid);if(d.type==="pin")return game.attemptPin(pid);if(d.type==="endPost")return game.endPostMove(pid);if(d.type==="momentum")return game.playMomentum(pid,d.card);if(d.type==="move")return game.declareMove(pid,d.card);if(d.type==="action")return game.playAction(pid,d.card);if(d.type==="support")return game.playSupport(pid,d.card);if(d.type==="manager")return game.playManager(pid,d.card);if(d.type==="special")return game.playSpecial(pid,d.card);if(d.type==="pass")return game.passTurn(pid);return false;}
