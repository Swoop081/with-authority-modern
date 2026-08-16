import { moveEligibility, counterEligibility, autoCounterEligibility, canPlaySpecial, canPlayMomentum, canPlayAction, canPlaySupport, canPlayManager, canAttemptPin, submissionThreshold } from "../engine/rules.js?v=0.12.60";
import { healthRatio, healthZone, healthOnlyPinChance } from "../engine/health.js?v=0.12.60";
export function decisionOwner(state){if(state.phase==="MATCH_OVER")return null;if(state.phase==="COUNTER")return state.proposedMove?.defenderId??null;if(state.phase==="PIN_RESPONSE")return state.proposedPin?.defenderId??null;if(state.phase==="SUBMISSION_MAINTAIN")return state.submission?.attackerId??null;return state.playerInControl;}
function groundState(p){return p?.posture==='on-mat'||p?.posture==='grounded';}
function submissionApplicationsToTap(state,pid,card){
 if(!card?.submission)return Infinity;
 const p=state.players?.[pid],part=card.submission.bodyPart;
 if(!p||!part)return Infinity;
 const hp=submissionThreshold(p),existing=Math.max(0,p.submissionDamage?.[part]??0),pressure=Math.max(1,card.submission.pressure??1);
 if(existing>=hp)return 1;
 return Math.max(1,Math.ceil((hp-existing)/pressure));
}
function incomingSubmissionWouldTap(state,pid,card){ return submissionApplicationsToTap(state,pid,card)<=1; }
function incomingSubmissionIsCritical(state,pid,card){
 const p=state.players?.[pid]; if(!p||!card?.submission)return false;
 const applications=submissionApplicationsToTap(state,pid,card);
 return applications<=2||((p.hp??0)<=15&&applications<=3);
}
function cpuShouldAutoCounter(state,pid,card){
 if(!card||card.finisher)return false;
 const p=state.players?.[pid];
 if(!p)return false;
 const midOrHigh=(card.cost??0)>=4;
 const lethal=(card.damage??0)>=p.hp;
 return !!card.trademark||midOrHigh||lethal||incomingSubmissionWouldTap(state,pid,card)||incomingSubmissionIsCritical(state,pid,card);
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

function cpuStateAfterMomentum(state,pid,card){
 const base=state.players[pid];
 const p={...base,momentum:{...base.momentum,[card.method]:(base.momentum?.[card.method]??0)+(card.amount??1)},turn:{...base.turn,momentumPlayed:(base.turn?.momentumPlayed??0)+1},momentumPlayedThisTurn:true};
 return {...state,players:{...state.players,[pid]:p}};
}
function cpuLegalOffense(state,pid){
 return state.players[pid].hand.filter(x=>x.kind==='move'&&!x.defensiveOnly&&moveEligibility(state,pid,x).legal);
}
function cpuMomentumScore(state,pid,card){
 const sim=cpuStateAfterMomentum(state,pid,card),p=sim.players[pid];
 const legal=cpuLegalOffense(sim,pid);
 if(legal.length)return 10000+Math.max(...legal.map(x=>moveScore(sim,pid,x)));
 // If no Move becomes legal immediately, build toward the closest offensive card in hand.
 let best=-9999;
 for(const move of p.hand){
   if(move.kind!=='move'||move.defensiveOnly)continue;
   const req=move.requirements??{};
   let methodDeficit=0;
   for(const [m,n] of Object.entries(req))methodDeficit+=Math.max(0,n-(p.momentum?.[m]??0));
   const totalDeficit=Math.max(0,(move.cost??0)-((p.momentum?.strength??0)+(p.momentum?.strike??0)+(p.momentum?.technical??0)+(p.momentum?.agility??0)+(p.adrenaline??0)));
   const score=-(methodDeficit*20+totalDeficit*4)+(move.damage??0);
   if(score>best)best=score;
 }
 return best;
}
function cpuBestMomentum(state,pid){
 const playable=state.players[pid].hand.filter(x=>canPlayMomentum(state,pid,x));
 if(!playable.length)return null;
 return playable.map((card,index)=>({card,index,score:cpuMomentumScore(state,pid,card)})).sort((a,b)=>b.score-a.score||a.index-b.index)[0].card;
}
function cpuStateAfterEnablingAction(state,pid,card){
 const base=state.players[pid],ef=card.effect??{};
 const p={...base,momentum:{...base.momentum},turn:{...base.turn,actionPlayed:(base.turn?.actionPlayed??0)+1},namedDiscount:{...base.namedDiscount}};
 const sim={...state,players:{...state.players,[pid]:p}};
 if(ef.type==='discountNext')p.nextMoveDiscount=(p.nextMoveDiscount??0)+(ef.amount??0);
 if(ef.type==='gainAdrenaline'){p.adrenaline=(p.adrenaline??0)+(ef.amount??1);p.momentum.attitude=p.adrenaline;}
 if(ef.type==='romanOohAhh'){
   const name=ef.name??"Roman's Spear";
   if(p.hand.some(c=>c.name===name)){p.adrenaline=(p.adrenaline??0)+(ef.adrenalineIfInHand??0);p.momentum.attitude=p.adrenaline;}
   p.namedDiscount[name]=(p.namedDiscount[name]??0)+(ef.discount??0);
 }
 return sim;
}
function cpuPreMoveAction(state,pid){
 const p=state.players[pid], legal=cpuLegalOffense(state,pid);
 if(!legal.length)return null;
 const candidates=p.hand.filter(x=>canPlayAction(state,pid,x));
 const bestNow=Math.max(...legal.map(x=>moveScore(state,pid,x)));
 for(const card of candidates){
   const ef=card.effect??{};
   if(ef.type==='buffNext'&&(ef.damage??0)>0)return card;
   if(ef.type==='buffNextMethod'&&legal.some(m=>m.method===ef.method))return card;
   if(ef.type==='discountNext'){
     const sim=cpuStateAfterEnablingAction(state,pid,card), after=cpuLegalOffense(sim,pid);
     if(after.length&&Math.max(...after.map(x=>moveScore(sim,pid,x)))>bestNow+4)return card;
   }
   if(ef.type==='romanOohAhh'){
     const name=ef.name??"Roman's Spear",target=p.hand.find(x=>x.name===name)||p.deck.find(x=>x.name===name);
     if(target){const sim=cpuStateAfterEnablingAction(state,pid,card);if(!sim.players[pid].hand.some(x=>x===target||x.id===target.id))sim.players[pid].hand=[...sim.players[pid].hand,target];if(moveEligibility(sim,pid,target).legal)return card;}
   }
   if(ef.type==='gainAdrenaline')return card;
 }
 return null;
}
function cpuEnablingAction(state,pid){
 const candidates=state.players[pid].hand.filter(x=>canPlayAction(state,pid,x));
 for(const card of candidates){
   const ef=card.effect?.type;
   if(!['discountNext','gainAdrenaline','romanOohAhh'].includes(ef))continue;
   if(cpuLegalOffense(cpuStateAfterEnablingAction(state,pid,card),pid).length)return card;
 }
 return null;
}

function moveScore(state,pid,card){
 const p=state.players[pid],def=state.players[pid==='p1'?'p2':'p1'];
 let score=(card.damage??0)*2;
 let submissionApplications=Infinity;
 if(card.submission){
   const part=card.submission.bodyPart,pressure=Math.max(1,card.submission.pressure??1),threshold=submissionThreshold(def),existing=Math.max(0,def.submissionDamage?.[part]??0);
   submissionApplications=existing>=threshold?1:Math.max(1,Math.ceil((threshold-existing)/pressure));
   // v0.12.42: a hold is body-part work, not free HP damage. Value it as setup when fresh,
   // then sharply increase priority only as the accumulated injury approaches a real tap-out.
   score+=pressure*3+Math.min(20,existing);
   if(submissionApplications<=1)score+=140;
   else if(submissionApplications===2)score+=90;
   else if(submissionApplications===3)score+=55;
   else if(submissionApplications===4)score+=30;
   else if(submissionApplications===5)score+=12;
   else if(card.finisher||card.trademark)score+=4;
 }
 if(card.finisher)score+=card.submission?(submissionApplications<=3?25:0):35;
 if(card.trademark)score+=card.submission?(submissionApplications<=4?8:0):8;
 if((card.damage??0)>=def.hp)score+=50;
 if(card.groundOpponent&&!groundState(def))score+=4;
 if(card.searchOnConnectName)score+=12;
 const searchEffects=(card.effects??[]).filter(e=>e.type==='search'&&(!e.ifSuperstarIds?.length||e.ifSuperstarIds.includes(p.superstar.id)));
 for(const e of searchEffects){
   const target=p.hand.find(x=>x.name===e.name)||p.deck.find(x=>x.name===e.name);
   score+=target?.finisher?20:10;
 }
 if((p.namedDiscount?.[card.name]??0)>0)score+=18;
 if(card.groundedOnly&&groundState(def))score+=8;
 const setupSpecial=p.superstar?.special;
 if(setupSpecial?.searchName&&setupSpecial?.afterName===card.name&&!(p.usedSpecialIds??[]).includes(p.hand.find(x=>x.special===setupSpecial)?.id))score+=28;
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
 // v0.12.24 targeted sequencing for the bottom balance outliers. These bonuses do not
 // change card legality or printed values; they teach the CPU to use the existing kits coherently.
 if(p.superstar.id==='seth-rollins'){
   const hasCurb=p.hand.some(x=>x.id==='seth-rollins-curb-stomp');
   if(card.id==='seth-rollins-buckle-bomb'&&(!groundState(def)||!hasCurb))score+=24;
   if(card.id==='seth-rollins-curb-stomp'&&groundState(def))score+=12;
 }
 if(p.superstar.id==='gunther'){
   if((p.abilityUses??0)<2&&card.method==='strike'&&(card.damage??0)>=5)score+=14;
   if(card.id==='gunther-folding-powerbomb'&&!p.hand.some(x=>x.id==='gunther-gojira-clutch'))score+=18;
   if(card.id==='gunther-gojira-clutch')score+=16;
 }
 if(p.superstar.id==='cody-rhodes'){
   if(card.moveType&&!p.connectedTypes?.includes(card.moveType))score+=18;
   if(card.id==='cody-rhodes-cody-cutter'&&!groundState(def))score+=6;
 }
 if(p.superstar.id==='paige'){
   if((p.abilityUses??0)<2&&card.method==='strike'&&(card.damage??0)>=5)score+=12;
   if(card.method==='technical'&&(p.methodDiscount?.technical??0)>0)score+=16;
   if((p.namedDiscount?.[card.name]??0)>0)score+=18;
 }
 if(p.superstar.id==='sami-zayn'){
   const hasHelluva=p.hand.some(x=>x.id==='sami-zayn-helluva-kick');
   if(card.id==='sami-zayn-exploder-turnbuckle'&&(hasHelluva||!p.events?.samiExploderSetup))score+=24;
   if(card.id==='sami-zayn-helluva-kick'&&(p.namedDiscount?.['Helluva Kick']??0)>0)score+=20;
   if(card.id==='sami-zayn-blue-thunder-bomb'&&p.hp<def.hp)score+=12;
 }
 if(p.superstar.id==='randy-savage'){
   const hasAgility=p.hand.some(x=>x.kind==='move'&&x.method==='agility'&&!x.defensiveOnly);
   const hasElbow=p.hand.some(x=>x.id==='randy-savage-flying-elbow-drop');
   if(hasElbow&&!groundState(def)&&card.groundOpponent&&!card.groundedOnly)score+=36;
   if(card.method==='strike'&&hasAgility&&p.lastConnectedMethod!=='strike')score+=18;
   if(card.method==='agility'&&p.lastConnectedMethod==='strike')score+=26;
   if(card.id==='randy-savage-flying-elbow-drop'&&groundState(def))score+=36;
 }
 if(p.superstar.id==='andre-the-giant'){
   const hasStrength=p.hand.some(x=>x.kind==='move'&&x.method==='strength'&&!x.defensiveOnly);
   const hasSplash=p.hand.some(x=>x.id==='andre-the-giant-sitdown-splash');
   if(card.method==='strike'&&hasStrength)score+=16;
   if(card.method==='strength'&&(p.methodDiscount?.strength??0)>0)score+=20;
   if(card.id==='andre-the-giant-double-underhook-suplex'&&hasSplash)score+=36;
   else if(card.id==='andre-the-giant-double-underhook-suplex')score+=10;
   if(card.id==='andre-the-giant-sitdown-splash'&&(p.namedDiscount?.['Sitdown Splash']??0)>0)score+=30;
 }
 if(p.superstar.id==='kane'){
   const hasTombstone=p.hand.some(x=>x.id==='tombstone-piledriver');
   if(card.id==='kane-chokeslam-from-hell'&&hasTombstone)score+=24;
   if(card.id==='tombstone-piledriver'&&(p.namedDiscount?.['Tombstone Piledriver']??0)>0)score+=24;
 }
 if(p.superstar.id==='liv-morgan'){
   if(card.id==='liv-morgan-jersey-codebreaker'&&!p.hand.some(x=>x.id==='liv-morgan-oblivion'))score+=24;
   if(card.id==='liv-morgan-oblivion'&&(p.namedDiscount?.['Oblivion']??0)>0)score+=22;
 }
 if(p.superstar.id==='rhea-ripley'){
   if(card.name==='Headbutt'&&!p.specialUsed)score+=12;
   if(card.id==='rhea-ripley-prism-trap'&&!p.hand.some(x=>x.id==='rhea-ripley-riptide'))score+=22;
   if(card.id==='rhea-ripley-riptide'&&(p.namedDiscount?.['Riptide']??0)>0)score+=22;
 }
 if(p.superstar.id==='stephanie-vaquer'){
   if(card.id==='stephanie-vaquer-devils-kiss'&&!p.hand.some(x=>x.id==='stephanie-vaquer-vaquer-inferno'))score+=24;
   if(card.id==='stephanie-vaquer-vaquer-inferno'&&(p.namedDiscount?.['Vaquer Inferno']??0)>0)score+=22;
 }
 if(p.superstar.id==='iyo-sky'){
   if(card.id==='iyo-sky-bullet-train-attack'&&!p.hand.some(x=>x.id==='iyo-sky-over-the-moonsault'))score+=22;
   if(card.id==='iyo-sky-over-the-moonsault'&&(p.namedDiscount?.['Over the Moonsault']??0)>0)score+=22;
 }
 if(p.superstar.id==='alexa-bliss'){
   if(card.id==='alexa-bliss-sister-abigail'&&!p.hand.some(x=>x.id==='alexa-bliss-twisted-bliss'))score+=24;
   if(card.id==='alexa-bliss-twisted-bliss'&&(p.namedDiscount?.['Twisted Bliss']??0)>0)score+=22;
 }
 if(p.superstar.id==='la-knight'){
   const hasElbow=p.hand.some(x=>x.name==='Diving Elbow Drop');
   if(hasElbow&&!groundState(def)&&card.groundOpponent&&!card.groundedOnly)score+=30;
   if(card.name==='Diving Elbow Drop'&&groundState(def)&&!p.specialUsed)score+=34;
   if(card.id==='la-knight-bft'&&(p.namedDiscount?.['BFT']??0)>0)score+=24;
 }
 if(p.superstar.id==='finn-balor'){
   if(card.id==='sling-blade'&&!p.specialUsed)score+=16;
   if(card.id==='shotgun-dropkick'&&!p.hand.some(x=>x.id==='finn-balor-coup-de-grace'))score+=22;
   if(card.id==='finn-balor-coup-de-grace'&&(p.namedDiscount?.['Coup de Grâce']??0)>0)score+=22;
 }
 if(p.superstar.id==='kevin-owens'){
   if(card.id==='pop-up-powerbomb'&&!p.hand.some(x=>x.id==='kevin-owens-stunner'))score+=24;
   if(card.id==='kevin-owens-stunner'&&(p.namedDiscount?.['Stunner']??0)>0)score+=22;
 }
 if(p.superstar.id==='penta'){
   if(card.id==='penta-driver'&&!p.hand.some(x=>x.id==='penta-mexican-destroyer'))score+=22;
   if(card.id==='penta-mexican-destroyer'&&(p.namedDiscount?.['Mexican Destroyer']??0)>0)score+=22;
 }
 if(p.superstar.id==='drew-mcintyre'){
   if(card.id==='drew-mcintyre-future-shock-ddt'&&!p.hand.some(x=>x.id==='drew-mcintyre-claymore'))score+=24;
   if(card.id==='drew-mcintyre-claymore'&&(p.namedDiscount?.['Claymore']??0)>0)score+=22;
 }
 if(p.superstar.id==='raquel-rodriguez'){
   if(card.id==='raquel-rodriguez-corkscrew-splash'&&!p.hand.some(x=>x.id==='raquel-rodriguez-tejana-bomb'))score+=22;
   if(card.id==='raquel-rodriguez-tejana-bomb'&&(p.namedDiscount?.['Tejana Bomb']??0)>0)score+=22;
 }
 if(p.superstar.id==='randy-orton'){
   const hasFollow=p.hand.some(x=>x.id==='randy-orton-rko'||x.id==='randy-orton-punt-kick'||x.id==='randy-orton-draping-ddt');
   if(card.method==='technical'&&hasFollow&&!p.events?.randyApexPredatorUsedThisControl)score+=18;
   if(card.id==='randy-orton-rko'&&(p.namedDiscount?.['RKO']??0)>0)score+=20;
   if(card.id==='randy-orton-punt-kick'&&groundState(def))score+=18;
 }
 return score;
}
function cpuCounterCoverage(card){return (card?.counterStates?.length??0)+(card?.counterSubmissionTargets?.length??0)+(card?.counters?.length??0)+(card?.countersCardIds?.length??0);}
function cpuChooseOffense(state,pid,moves){
 const ranked=[...moves].sort((a,b)=>moveScore(state,pid,b)-moveScore(state,pid,a));
 const top=ranked[0]; if(!top||top.finisher||top.trademark||cpuCounterCoverage(top)===0)return top;
 const p=state.players[pid],def=state.players[pid==='p1'?'p2':'p1'];
 const counterPages=p.hand.filter(c=>c.kind==='move'&&cpuCounterCoverage(c)>0);
 if(counterPages.length!==1||(top.damage??0)>=def.hp)return top;
 const alternative=ranked.find(c=>c!==top&&cpuCounterCoverage(c)===0);
 if(!alternative)return top;
 return moveScore(state,pid,top)-moveScore(state,pid,alternative)<=10?alternative:top;
}
function cpuDiscardPreservationScore(card){
 let score=0;if(!card)return score;if(card.kind==='special')score+=140;if(card.pinEscape||card.special?.type==='pinEscape')score+=120;if(card.finisher)score+=110;if(card.trademark)score+=60;if(card.kind==='move'){score+=(card.damage??0)*3+(card.cost??0);if(card.submission)score+=Math.max(0,card.submission.pressure??0)*8;const coverage=(card.counterStates?.length??0)+(card.counterSubmissionTargets?.length??0)+(card.counters?.length??0)+(card.countersCardIds?.length??0);score+=coverage*4;if(card.defensiveOnly)score-=20;}else if(card.kind==='manager')score+=35;else if(card.kind==='action')score+=28;else if(card.kind==='support')score+=24;else if(card.kind==='momentum')score+=8;return score;
}
function cpuSubmissionDecision(state,pid){
 const sub=state.submission,p=state.players[pid],def=state.players[sub.defenderId],threshold=submissionThreshold(def),pressure=Math.max(1,sub.damage??1);
 const damageNeeded=Math.max(0,threshold-(def.submissionDamage?.[sub.bodyPart]??0));
 const holdsToTap=Math.max(0,Math.ceil(damageNeeded/pressure));
 // If the CPU can finish the match with the pages it has, commit to the hold.
 // Otherwise use early holds as persistent body-part setup without emptying the hand.
 const canFinish=holdsToTap<=p.hand.length;
 const setupTurnCap=(sub.finisher||sub.trademark)?3:2;
 const canBankPressure=(sub.holdTurn??1)<setupTurnCap&&p.hand.length>2;
 if(!canFinish&&!canBankPressure)return{type:'release'};
 let index=0,best=Infinity;for(let i=0;i<p.hand.length;i++){const v=cpuDiscardPreservationScore(p.hand[i]);if(v<best){best=v;index=i;}}
 return{type:'maintain',index};
}
export function cpuDecision(game,pid="p2"){
 const s=game.state(),p=s.players[pid];if(decisionOwner(s)!==pid)return null;
 if(s.phase==="COUNTER"){const incoming=s.proposedMove.card,c=p.hand.find(x=>counterEligibility(s,pid,incoming,x).legal);if(c)return{type:"counter",card:c};const auto=autoCounterEligibility(s,pid,incoming);if(auto.legal&&cpuShouldAutoCounter(s,pid,incoming)){const indices=cpuAutoCounterSelection(s,pid,auto.cost);if(indices)return{type:"autoCounter",indices};}return{type:"passCounter"};}
 if(s.phase==="PIN_RESPONSE"){const c=p.hand.find(x=>x.pinEscape||x.special?.type==='pinEscape');const chance=healthOnlyPinChance(p);return c&&chance>=20?{type:"pinEscape",card:c}:{type:"passPin"};}
 if(s.phase==="SUBMISSION_MAINTAIN")return p.hand.length?cpuSubmissionDecision(s,pid):{type:"release"};
 if(s.phase==="ACTION"){
   const defId=pid==="p1"?"p2":"p1",def=s.players[defId],hpRatio=healthRatio(def);
   const movesNow=cpuLegalOffense(s,pid);
   const readyFinisher=movesNow.find(x=>x.finisher);
   const submissionThreat=movesNow.filter(x=>x.submission).map(card=>({card,applications:submissionApplicationsToTap(s,defId,card)})).sort((a,b)=>a.applications-b.applications)[0];
   const pinChance=healthOnlyPinChance(def);
   const submissionPreferred=!!submissionThreat&&(submissionThreat.applications<=1||(submissionThreat.applications===2&&p.hand.length>=2&&pinChance<50));
   if(canAttemptPin(s,pid).legal&&!readyFinisher&&!submissionPreferred&&pinChance>=20)return{type:"pin"};
   const sp=p.hand.find(x=>canPlaySpecial(s,pid,x));if(sp)return{type:"special",card:sp};
   const setupAction=cpuPreMoveAction(s,pid);if(setupAction)return{type:"action",card:setupAction};
   const setupSupport=p.hand.find(x=>canPlaySupport(s,pid,x)&&(!p.support||p.support.id!==x.id));
   if(setupSupport&&movesNow.length)return{type:"support",card:setupSupport};
   if(!movesNow.length){
     const enabling=cpuEnablingAction(s,pid);if(enabling)return{type:"action",card:enabling};
     const plannedMomentum=cpuBestMomentum(s,pid);if(plannedMomentum)return{type:"momentum",card:plannedMomentum};
   } else {
     const normalMomentum=p.hand.find(x=>canPlayMomentum(s,pid,x));if(normalMomentum)return{type:"momentum",card:normalMomentum};
   }
   const moves=p.hand.filter(x=>x.kind==="move"&&!x.defensiveOnly&&moveEligibility(s,pid,x).legal);
   const chosenMove=cpuChooseOffense(s,pid,moves);
   if(chosenMove)return{type:"move",card:chosenMove};
   const utility=p.hand.find(x=>(x.kind==="action"&&canPlayAction(s,pid,x)&&x.effect?.type==='gainAdrenaline')||(x.kind==="support"&&canPlaySupport(s,pid,x))||(x.kind==="manager"&&canPlayManager(s,pid,x)));if(utility)return{type:utility.kind,card:utility};
   return{type:"pass"};
 }
 return null;
}
export function executeCpuDecision(game,d,pid="p2"){if(!d)return false;if(d.type==="counter")return game.counter(pid,d.card);if(d.type==="autoCounter")return game.autoCounter(pid,d.indices);if(d.type==="passCounter")return game.passCounter(pid);if(d.type==="pinEscape")return game.playPinEscape(pid,d.card);if(d.type==="passPin")return game.passPinResponse(pid);if(d.type==="maintain")return game.maintainSubmission(pid,d.index);if(d.type==="release")return game.releaseSubmission(pid);if(d.type==="pin")return game.attemptPin(pid);if(d.type==="endPost")return game.endPostMove(pid);if(d.type==="momentum")return game.playMomentum(pid,d.card);if(d.type==="move")return game.declareMove(pid,d.card);if(d.type==="action")return game.playAction(pid,d.card);if(d.type==="support")return game.playSupport(pid,d.card);if(d.type==="manager")return game.playManager(pid,d.card);if(d.type==="special")return game.playSpecial(pid,d.card);if(d.type==="pass")return game.passTurn(pid);return false;}
