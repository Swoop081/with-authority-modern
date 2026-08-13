import { totalMomentum } from "./utils.js";
const methodAmount=(p,m)=>p?.momentum?.[m]??0;
const playerFrom=(subject,playerId)=>playerId==null&&subject?.momentum?subject:subject?.players?.[playerId];
export function effectiveTotalMomentum(subject,playerId){ const p=playerFrom(subject,playerId); return totalMomentum(p)+(p?.temporaryDiscount??0); }
export function canPlayMomentum(state,playerId,card){ const p=state.players[playerId]; return state.phase==="ACTION"&&state.playerInControl===playerId&&card?.kind==="momentum"&&(p?.turn?.momentumPlayed??0)<(p?.turn?.momentumPlayLimit??1); }
export function canPlayEntrance(){ return false; }
export function canPlayAction(state,playerId,card){ const p=state.players[playerId]; return state.phase==="ACTION"&&state.playerInControl===playerId&&card?.kind==="action"&&(p?.turn?.actionPlayed??0)<1&&!p?.actionLocked; }
export function canPlaySupport(state,playerId,card){ const p=state.players[playerId]; return state.phase==="ACTION"&&state.playerInControl===playerId&&card?.kind==="support"&&(p?.turn?.supportPlayed??0)<1; }
export function canPlayManager(state,playerId,card){ const p=state.players[playerId]; return state.phase==="ACTION"&&state.playerInControl===playerId&&card?.kind==="manager"&&!p?.activeManager; }
export function canPlaySpecial(state,playerId,card){ const p=state.players[playerId]; if(!p||p.specialUsed||card?.kind!=="special")return false; if(state.phase!=="ACTION"||state.playerInControl!==playerId)return false; if(card?.special?.type==="brassKnuckles")return !!p.events?.brassKnucklesWindow; if(card?.special?.type==="jarOfTeeth")return !!p.events?.jarOfTeethWindow; return false; }
export function moveEligibility(state,playerId,card){
 const p=state.players[playerId]; const fail=reason=>({ok:false,legal:false,reason});
 if(state.phase!=="ACTION")return fail("Not an Action window"); if(state.playerInControl!==playerId)return fail("Not in Control"); if(card?.kind!=="move"||card.defensiveOnly)return fail("Not an offensive Move"); if(card.superstarId&&card.superstarId!==p?.superstar?.id)return fail("Move is exclusive to another Superstar"); if(Array.isArray(card.allowedSuperstarIds)&&card.allowedSuperstarIds.length&&!card.allowedSuperstarIds.includes(p?.superstar?.id))return fail("Move is restricted to another Superstar family");
 const curseCost=Math.max(0,p.events?.danhausenCurseAdrenalineCost??0); if(curseCost&&p.adrenaline<curseCost)return fail(`Need ${curseCost} Adrenaline — You Are Cursed!`);
 const sequenceDiscount=(card.discountAfterCounter&&p.events?.counteredThisControl)?card.discountAfterCounter:0; const discount=(p.nextMoveDiscount??0)+(p.methodDiscount?.[card.method]??0)+(p.namedDiscount?.[card.name]??0)+sequenceDiscount; const needed=Math.max(0,(card.cost??0)-discount); if(totalMomentum(p)<needed)return fail(`Need ${needed} total Momentum`);
 for(const [m,n] of Object.entries(card.requirements??{})){if(methodAmount(p,m)<n)return fail(`Need ${n} ${m} Momentum`);}
 const opp=state.players[playerId==="p1"?"p2":"p1"]; if(card.groundedOnly&&!['on-mat','grounded'].includes(opp?.posture))return fail("Opponent must be grounded");
 return {ok:true,legal:true,reason:null,effectiveCost:needed};
}
const incomingTypes=incoming=>[incoming?.tacticalType,incoming?.moveType].filter(Boolean);
export function canCounter(incoming,counter){
 if(!incoming||counter?.kind!=="move")return false;
 const direct=(counter.countersCardIds??[]).includes(incoming.id);
 const typed=(counter.counters??[]).some(t=>incomingTypes(incoming).includes(t));
 if(!direct&&!typed)return false;
 if(counter.id==='no-sell'&&(incoming.damage??0)<7)return false;
 return true;
}
export function counterEligibility(state,playerId,incoming,counter){
 const fail=reason=>({ok:false,legal:false,reason}); const p=state?.players?.[playerId];
 if(state?.phase!=="COUNTER")return fail("Not a Counter window");
 if(state?.proposedMove?.defenderId!==playerId)return fail("Not the defending Superstar");
 if(!canCounter(incoming,counter))return fail("Move does not Counter this Move Type"); if(counter.superstarId&&counter.superstarId!==p?.superstar?.id)return fail("Counter is exclusive to another Superstar"); if(Array.isArray(counter.allowedSuperstarIds)&&counter.allowedSuperstarIds.length&&!counter.allowedSuperstarIds.includes(p?.superstar?.id))return fail("Counter is restricted to another Superstar family");
 const needed=Math.max(0,counter.cost??0); if(totalMomentum(p)<needed)return fail(`Need ${needed} total Momentum`);
 for(const [m,n] of Object.entries(counter.requirements??{})){if(methodAmount(p,m)<n)return fail(`Need ${n} ${m} Momentum`);}
 const attacker=state.players[state.proposedMove.attackerId]; if(counter.groundedOnly&&!['on-mat','grounded'].includes(attacker?.posture))return fail("Opponent must be grounded");
 return {ok:true,legal:true,reason:null,effectiveCost:needed,offensive:!counter.defensiveOnly};
}
export function canAttemptPin(state,playerId){
 const p=state.players?.[playerId],opp=state.players?.[playerId==="p1"?"p2":"p1"];
 const freshTurn=!!p&&(p.turn?.momentumPlayed??0)===0&&(p.turn?.specialPlayed??0)===0;
 const hasCoverWindow=!!state.postMove&&state.postMove.attackerId===playerId;
 const vulnerable=!!opp?.maxHp&&opp.hp/opp.maxHp<=.60;
 return state.phase==="ACTION"&&state.playerInControl===playerId&&freshTurn&&hasCoverWindow&&vulnerable?{legal:true,cost:0}:{legal:false,cost:0};
}
export function canPlayPinEscape(state,playerId,card){ return state.phase==="PIN_RESPONSE"&&state.proposedPin?.defenderId===playerId&&!!(card?.pinEscape||card?.special?.type==='pinEscape'); }
export function submissionThreshold(player){ return Math.max(12,Math.round((player?.maxHp??50)*.28)); }
export function canReturnToRing(){return false;} export function canFollowOutside(){return false;}
