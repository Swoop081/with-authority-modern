import { moveEligibility, counterEligibility, canPlaySpecial, canPlayMomentum } from "../engine/rules.js";
export function decisionOwner(state){if(state.phase==="MATCH_OVER")return null;if(state.phase==="COUNTER")return state.proposedMove?.defenderId??null;if(state.phase==="PIN_RESPONSE")return state.proposedPin?.defenderId??null;if(state.phase==="SUBMISSION_MAINTAIN")return state.submission?.attackerId??null;return state.playerInControl;}
export function cpuDecision(game,pid="p2"){
 const s=game.state(),p=s.players[pid];if(decisionOwner(s)!==pid)return null;
 if(s.phase==="COUNTER"){const c=p.hand.find(x=>counterEligibility(s,pid,s.proposedMove.card,x).legal);return c?{type:"counter",card:c}:{type:"passCounter"};}
 if(s.phase==="PIN_RESPONSE"){const c=p.hand.find(x=>x.pinEscape||x.special?.type==='pinEscape');return c?{type:"pinEscape",card:c}:{type:"passPin"};}
 if(s.phase==="SUBMISSION_MAINTAIN")return p.hand.length&&s.players[s.submission.defenderId].submissionDamage[s.submission.bodyPart]<12?{type:"maintain",index:0}:{type:"release"};
 if(s.phase==="POST_MOVE"){const def=s.players[pid==="p1"?"p2":"p1"],sp=p.hand.find(x=>canPlaySpecial(s,pid,x));if(sp&&(def.hp<=def.maxHp*.7||(s.postMove?.cardId&&p.discard.find(x=>x.id===s.postMove.cardId)?.damage>=8)))return{type:"special",card:sp};if(def.hp<=def.maxHp*.5)return{type:"pin"};return{type:"endPost"};}
 if(s.phase==="ACTION"){
   const mom=p.hand.find(x=>canPlayMomentum(s,pid,x));if(mom)return{type:"momentum",card:mom};
   const moves=p.hand.filter(x=>x.kind==="move"&&!x.defensiveOnly&&moveEligibility(s,pid,x).legal).sort((a,b)=>(Number(!!b.finisher)-Number(!!a.finisher))||((b.damage??0)-(a.damage??0)));if(moves[0])return{type:"move",card:moves[0]};
   const utility=p.hand.find(x=>(x.kind==="action"&&!p.actionLocked&&(p.turn?.actionPlayed??0)<1)||(x.kind==="support"&&(p.turn?.supportPlayed??0)<1)||(x.kind==="manager"&&!p.activeManager));if(utility)return{type:utility.kind,card:utility};
   return{type:"pass"};
 }
 return null;
}
export function executeCpuDecision(game,d,pid="p2"){if(!d)return false;if(d.type==="counter")return game.counter(pid,d.card);if(d.type==="passCounter")return game.passCounter(pid);if(d.type==="pinEscape")return game.playPinEscape(pid,d.card);if(d.type==="passPin")return game.passPinResponse(pid);if(d.type==="maintain")return game.maintainSubmission(pid,d.index);if(d.type==="release")return game.releaseSubmission(pid);if(d.type==="pin")return game.attemptPin(pid);if(d.type==="endPost")return game.endPostMove(pid);if(d.type==="momentum")return game.playMomentum(pid,d.card);if(d.type==="move")return game.declareMove(pid,d.card);if(d.type==="action")return game.playAction(pid,d.card);if(d.type==="support")return game.playSupport(pid,d.card);if(d.type==="manager")return game.playManager(pid,d.card);if(d.type==="special")return game.playSpecial(pid,d.card);if(d.type==="pass")return game.passTurn(pid);return false;}
