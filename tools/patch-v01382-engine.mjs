import fs from 'node:fs';

function replaceOnce(text, oldText, newText, label) {
  const count = text.split(oldText).length - 1;
  if (count !== 1) throw new Error(`${label}: expected 1 match, got ${count}`);
  return text.replace(oldText, newText);
}
function replaceAllChecked(text, oldText, newText, min, label) {
  const count = text.split(oldText).length - 1;
  if (count < min) throw new Error(`${label}: expected >=${min} matches, got ${count}`);
  return text.split(oldText).join(newText);
}

// ---- rules.js ----
let rules = fs.readFileSync('js/engine/rules.js','utf8');
rules = replaceOnce(
  rules,
  `if(card?.special?.type==="paulHeyman"){const after=card.special?.afterName??"Brock’s German";return !!p.events?.connectedCardNamesThisControl?.[after]||!!p.events?.brocksGermanConnectedThisControl;} if(["tiffanyEpiphany","fileComplaint","lastRites","fullSpeed","claymoreCountdown","joeBelieve","roxanneProdigy","dragonLuchaLegacy","austinTheoryAllDay","angeloDawkinsRunIn","lolaFistsDontLie","iguanaLaYesca","hbkShowstopper","exclusiveTrademarkTutor","doinkClowningAround","yokozunaBanzai","owenSlammyAwards","bulldogMadeInBritain"].includes(card?.special?.type))return true;`,
  `if(card?.special?.type==="paulHeyman"){const after=card.special?.afterName??"Brock’s German";return !!p.events?.connectedCardNamesThisControl?.[after]||!!p.events?.brocksGermanConnectedThisControl;} if(card?.special?.type==="rawIsJericho")return !!p.events?.connectedMethodsThisControl?.technical&&!!p.events?.connectedMethodsThisControl?.agility; if(["tiffanyEpiphany","fileComplaint","lastRites","fullSpeed","claymoreCountdown","joeBelieve","roxanneProdigy","dragonLuchaLegacy","austinTheoryAllDay","angeloDawkinsRunIn","lolaFistsDontLie","iguanaLaYesca","hbkShowstopper","exclusiveTrademarkTutor","doinkClowningAround","yokozunaBanzai","owenSlammyAwards","bulldogMadeInBritain","pipersPit","millionDollarChampionship","damien","perfectRecord","sledgehammer","rawIsJericho","breakTheBarrier"].includes(card?.special?.type))return true;`,
  'new specials eligibility'
);
rules = replaceOnce(
  rules,
  `const joeExclusiveDiscount=p.superstar?.id==='joe-hendry'&&card.superstarId==='joe-hendry'?Math.max(0,p.events?.joeExclusiveMoveDiscount??0):0; const vikingoDivingDiscount=p.superstar?.id==='hijo-del-vikingo'&&card.counterState==='diving-aerial'?Math.max(0,p.events?.vikingoDivingAerialDiscount??0):0; const discount=finisherDiscount+namedChainDiscount+(p.nextMoveDiscount??0)+(p.methodDiscount?.[card.method]??0)+(p.moveTypeDiscount?.[card.moveType]??0)+(p.namedDiscount?.[card.name]??0)+sequenceDiscount+methodChain+bodyDiscount+samiDiscount+streakDiscount+joeExclusiveDiscount+vikingoDivingDiscount;`,
  `const joeExclusiveDiscount=p.superstar?.id==='joe-hendry'&&card.superstarId==='joe-hendry'?Math.max(0,p.events?.joeExclusiveMoveDiscount??0):0; const vikingoDivingDiscount=p.superstar?.id==='hijo-del-vikingo'&&card.counterState==='diving-aerial'?Math.max(0,p.events?.vikingoDivingAerialDiscount??0):0; const angleIntensityDiscount=card.method==='technical'&&(p.events?.angleIntensityRemaining??0)>0?Math.max(0,p.events?.angleIntensityDiscount??1):0; const discount=finisherDiscount+namedChainDiscount+(p.nextMoveDiscount??0)+(p.methodDiscount?.[card.method]??0)+(p.moveTypeDiscount?.[card.moveType]??0)+(p.namedDiscount?.[card.name]??0)+sequenceDiscount+methodChain+bodyDiscount+samiDiscount+streakDiscount+joeExclusiveDiscount+vikingoDivingDiscount+angleIntensityDiscount;`,
  'angle intensity eligibility'
);
rules = replaceOnce(
  rules,
  `if(counter?.kind==="action"&&counter?.effect?.type==="onceTooOften")return onceTooOftenEligibility(state,playerId,incoming,counter);`,
  `if(counter?.kind==="action"&&counter?.effect?.type==="onceTooOften")return onceTooOftenEligibility(state,playerId,incoming,counter); if(p?.events?.pipersPitLockedCounterId&&counter?.id===p.events.pipersPitLockedCounterId)return fail("Piper’s Pit has shut down this Counter for the Control sequence");`,
  'pipers pit counter lock'
);
fs.writeFileSync('js/engine/rules.js', rules);

// ---- MatchEngine.js ----
let m = fs.readFileSync('js/engine/MatchEngine.js','utf8');

m = replaceOnce(
  m,
  `events:{connectedMethodsThisControl:{},connectedCardNamesThisControl:{},connectedCardIdsMatch:{}}`,
  `events:{connectedMethodsThisControl:{},connectedMoveTypesThisControl:{},connectedCardNamesThisControl:{},connectedCardIdsMatch:{}}`,
  'setup move type history'
);

m = replaceOnce(
  m,
  `delete p.events.bulldogPowerTechniqueUsedThisControl;p.events.connectedMethodsThisControl={};p.events.connectedCardNamesThisControl={};`,
  `delete p.events.bulldogPowerTechniqueUsedThisControl;delete p.events.jakePsychologyUsedThisControl;delete p.events.perfectExecutionUsedThisControl;delete p.events.tripleHCerebralUsedThisControl;delete p.events.jerichoY2JUsedThisControl;delete p.events.jerichoY2JAgilityArmed;delete p.events.chynaNinthWonderUsedThisControl;delete p.events.angleOlympicGoldUsedThisControl;delete p.events.pipersPitLockedCounterId;delete p.events.damienTrademarkUncounterable;delete p.events.sledgehammerArmed;delete p.events.sledgehammerDamage;delete p.events.angleIntensityRemaining;delete p.events.angleIntensityDiscount;p.events.connectedMethodsThisControl={};p.events.connectedMoveTypesThisControl={};p.events.connectedCardNamesThisControl={};`,
  'reset new era state'
);

m = replaceOnce(
  m,
  `if(tp?.events?.lolaCounterStrikerPending){const buff=tp.events.lolaCounterStrikerPending;delete tp.events.lolaCounterStrikerPending;tp.events.lolaCounterStrikerUsedThisControl=true;tp.methodDiscount.strike=(tp.methodDiscount.strike??0)+(buff.discount??1);tp.events.lolaCounterStrikeDamage=(tp.events.lolaCounterStrikeDamage??0)+(buff.damage??1);}`,
  `if(tp?.events?.lolaCounterStrikerPending){const buff=tp.events.lolaCounterStrikerPending;delete tp.events.lolaCounterStrikerPending;tp.events.lolaCounterStrikerUsedThisControl=true;tp.methodDiscount.strike=(tp.methodDiscount.strike??0)+(buff.discount??1);tp.events.lolaCounterStrikeDamage=(tp.events.lolaCounterStrikeDamage??0)+(buff.damage??1);}if(tp?.events?.perfectExecutionPending){const discount=tp.events.perfectExecutionPending;delete tp.events.perfectExecutionPending;tp.events.perfectExecutionUsedThisControl=true;tp.methodDiscount.technical=(tp.methodDiscount.technical??0)+discount;}if(tp?.events?.stephanieCounterPending){const discount=tp.events.stephanieCounterPending;delete tp.events.stephanieCounterPending;tp.nextMoveDiscount=(tp.nextMoveDiscount??0)+discount;}`,
  'pending counter rewards'
);

// Action implementation for Angle's three I's.
m = replaceOnce(
  m,
  `if(ef.type==='paulHeymanPromo'){if(!p.deck.length)this._recyclePlaybook(pid);const look=Math.max(1,ef.look??5),seen=p.deck.splice(0,look),isExclusive=x=>x?.superstarId===p.superstar.id||(Array.isArray(x?.allowedSuperstarIds)&&x.allowedSuperstarIds.includes(p.superstar.id));const eligible=seen.filter(x=>x.kind==='move'||x.kind==='action');let found=eligible.find(isExclusive)??eligible[0]??null;if(found){const i=seen.indexOf(found);if(i>=0)seen.splice(i,1);p.hand.push(found);this._log('CARDS_DRAWN',{playerId:pid,cardIds:[found.id]});if(isExclusive(found)&&ef.exclusiveAdrenaline)this._ad(pid,ef.exclusiveAdrenaline);}p.deck.push(...seen);this._log('ACTION_EFFECT',{playerId:pid,cardId:card.id,effect:'paul-heyman-promo',look,searchedCardId:found?.id??null,exclusive:!!(found&&isExclusive(found)),adrenaline:found&&isExclusive(found)?(ef.exclusiveAdrenaline??0):0});}`,
  `if(ef.type==='paulHeymanPromo'){if(!p.deck.length)this._recyclePlaybook(pid);const look=Math.max(1,ef.look??5),seen=p.deck.splice(0,look),isExclusive=x=>x?.superstarId===p.superstar.id||(Array.isArray(x?.allowedSuperstarIds)&&x.allowedSuperstarIds.includes(p.superstar.id));const eligible=seen.filter(x=>x.kind==='move'||x.kind==='action');let found=eligible.find(isExclusive)??eligible[0]??null;if(found){const i=seen.indexOf(found);if(i>=0)seen.splice(i,1);p.hand.push(found);this._log('CARDS_DRAWN',{playerId:pid,cardIds:[found.id]});if(isExclusive(found)&&ef.exclusiveAdrenaline)this._ad(pid,ef.exclusiveAdrenaline);}p.deck.push(...seen);this._log('ACTION_EFFECT',{playerId:pid,cardId:card.id,effect:'paul-heyman-promo',look,searchedCardId:found?.id??null,exclusive:!!(found&&isExclusive(found)),adrenaline:found&&isExclusive(found)?(ef.exclusiveAdrenaline??0):0});}if(ef.type==='angleIntensity'){p.events.angleIntensityRemaining=Math.max(1,ef.uses??2);p.events.angleIntensityDiscount=Math.max(1,ef.discount??1);this._log('ACTION_EFFECT',{playerId:pid,cardId:card.id,effect:'intensity',uses:p.events.angleIntensityRemaining,discount:p.events.angleIntensityDiscount});}if(ef.type==='angleIntegrity'){const max=Math.max(0,ef.max??2),picked=[];for(let i=p.discard.length-1;i>=0&&picked.length<max;i--){const x=p.discard[i];if(x.kind==='move'&&x.method===(ef.method??'technical')){p.discard.splice(i,1);picked.unshift(x);}}p.deck.push(...picked);if(ef.draw)this._draw(pid,ef.draw);this._log('ACTION_EFFECT',{playerId:pid,cardId:card.id,effect:'integrity',recycledCardIds:picked.map(x=>x.id),draw:ef.draw??1});}if(ef.type==='angleIntelligence'){if(!p.deck.length)this._recyclePlaybook(pid);const look=Math.max(1,ef.look??5),seen=p.deck.splice(0,look),isCounter=x=>x?.kind==='move'&&((x.counterStates?.length??0)>0||(x.counterSubmissionTargets?.length??0)>0||(x.counters?.length??0)>0||x.defensiveOnly),idx=seen.findIndex(x=>x.kind==='move'&&(x.method==='technical'||isCounter(x)));let found=null;if(idx>=0){found=seen.splice(idx,1)[0];p.hand.push(found);this._log('CARDS_DRAWN',{playerId:pid,cardIds:[found.id]});}p.deck.push(...seen);this._log('ACTION_EFFECT',{playerId:pid,cardId:card.id,effect:'intelligence',look,searchedCardId:found?.id??null});}`,
  'angle actions'
);

// New specials before catch-all return true.
m = replaceOnce(
  m,
  `if(s.type==='angeloDawkinsRunIn'){const linked=linkedGameplayCards.find(x=>x.id===(s.linkedCardId??'linked-street-profits-revelation'))??null;if(linked){const generated=cloneCard(linked);p.hand.push(generated);this._log('CARDS_DRAWN',{playerId:pid,cardIds:[generated.id]});}this._log('SPECIAL_EFFECT',{playerId:pid,cardId:card.id,effect:'angelo-dawkins-run-in',linkedCardId:linked?.id??null,cost:linked?.cost??null});return true;}return true;}`,
  `if(s.type==='angeloDawkinsRunIn'){const linked=linkedGameplayCards.find(x=>x.id===(s.linkedCardId??'linked-street-profits-revelation'))??null;if(linked){const generated=cloneCard(linked);p.hand.push(generated);this._log('CARDS_DRAWN',{playerId:pid,cardIds:[generated.id]});}this._log('SPECIAL_EFFECT',{playerId:pid,cardId:card.id,effect:'angelo-dawkins-run-in',linkedCardId:linked?.id??null,cost:linked?.cost??null});return true;}if(s.type==='pipersPit'){const isCounter=x=>x?.kind==='move'&&((x.counterStates?.length??0)>0||(x.counterSubmissionTargets?.length??0)>0||(x.counters?.length??0)>0||x.defensiveOnly);const locked=d.hand.find(isCounter)??null;if(locked)d.events.pipersPitLockedCounterId=locked.id;else this._draw(pid,1);this._log('SPECIAL_EFFECT',{playerId:pid,cardId:card.id,effect:'pipers-pit',lockedCounterId:locked?.id??null,drew:locked?0:1});return true;}if(s.type==='millionDollarChampionship'){const found=this._searchWhere(pid,x=>x.kind==='move'&&x.superstarId==='ted-dibiase'&&x.trademark);if(found)p.namedDiscount[found.name]=(p.namedDiscount[found.name]??0)+2;this._log('SPECIAL_EFFECT',{playerId:pid,cardId:card.id,effect:'million-dollar-championship',searchedCardId:found?.id??null,discount:found?2:0});return true;}if(s.type==='damien'){p.events.damienTrademarkUncounterable=true;this._log('SPECIAL_EFFECT',{playerId:pid,cardId:card.id,effect:'damien',nextTrademarkNoAutoCounter:true});return true;}if(s.type==='perfectRecord'){if(!p.deck.length)this._recyclePlaybook(pid);const look=Math.max(1,s.look??5),seen=p.deck.splice(0,look),idx=seen.findIndex(x=>x.kind==='move'&&x.method==='technical');let found=null;if(idx>=0){found=seen.splice(idx,1)[0];p.hand.push(found);this._log('CARDS_DRAWN',{playerId:pid,cardIds:[found.id]});}p.deck.push(...seen);this._log('SPECIAL_EFFECT',{playerId:pid,cardId:card.id,effect:'perfect-record',look,searchedCardId:found?.id??null});return true;}if(s.type==='sledgehammer'){p.events.sledgehammerArmed=true;this._log('SPECIAL_EFFECT',{playerId:pid,cardId:card.id,effect:'sledgehammer',nextMoveNoAutoCounter:true});return true;}if(s.type==='rawIsJericho'){this._draw(pid,2);if(p.hand.length)this._state.pendingActionDiscard={playerId:pid,cardId:card.id,count:1};p.nextMoveDiscount=(p.nextMoveDiscount??0)+1;this._log('SPECIAL_EFFECT',{playerId:pid,cardId:card.id,effect:'raw-is-jericho',draw:2,discard:1,discount:1});return true;}if(s.type==='breakTheBarrier'){const found=this._searchWhere(pid,x=>x.kind==='move'&&x.method==='strength');const exclusive=found?.superstarId==='chyna'&&found?.trademark;if(found&&exclusive)p.namedDiscount[found.name]=(p.namedDiscount[found.name]??0)+1;else if(found)this._draw(pid,1);this._log('SPECIAL_EFFECT',{playerId:pid,cardId:card.id,effect:'break-the-barrier',searchedCardId:found?.id??null,exclusive,discount:exclusive?1:0,draw:found&&!exclusive?1:0});return true;}return true;}`,
  'new specials implementation'
);

// Declare move: preserve normal counters while setting no-auto-counter flags.
m = replaceOnce(
  m,
  `const lolaFistsArmed=card.method==='strike'&&!!p.events.lolaFistsDontLieArmed,lolaFistsOpponentAdrenaline=lolaFistsArmed?(p.events.lolaFistsDontLieOpponentAdrenaline??-2):0,lolaFistsDrawIfZero=lolaFistsArmed?(p.events.lolaFistsDontLieDrawIfZero??1):0;this._state.proposedMove={attackerId:pid,defenderId:other(pid),card,danhausenCurseOwner:curseOwner,streakAtDeclare:p.superstar.id==='goldberg'?(p.streakCounters??0):0,noAutoCounter:allDayProtected,allDayDraw,lolaFistsOpponentAdrenaline,lolaFistsDrawIfZero};`,
  `const lolaFistsArmed=card.method==='strike'&&!!p.events.lolaFistsDontLieArmed,lolaFistsOpponentAdrenaline=lolaFistsArmed?(p.events.lolaFistsDontLieOpponentAdrenaline??-2):0,lolaFistsDrawIfZero=lolaFistsArmed?(p.events.lolaFistsDontLieDrawIfZero??1):0,damienProtected=!!p.events.damienTrademarkUncounterable&&!!card.trademark,sledgehammerProtected=!!p.events.sledgehammerArmed,sledgehammerDamage=sledgehammerProtected&&(card.trademark||card.finisher)?1:0;if(card.method==='technical'&&(p.events.angleIntensityRemaining??0)>0){p.events.angleIntensityRemaining=Math.max(0,p.events.angleIntensityRemaining-1);if(!p.events.angleIntensityRemaining){delete p.events.angleIntensityRemaining;delete p.events.angleIntensityDiscount;}}this._state.proposedMove={attackerId:pid,defenderId:other(pid),card,danhausenCurseOwner:curseOwner,streakAtDeclare:p.superstar.id==='goldberg'?(p.streakCounters??0):0,noAutoCounter:allDayProtected||damienProtected||sledgehammerProtected,sledgehammerDamage,allDayDraw,lolaFistsOpponentAdrenaline,lolaFistsDrawIfZero};if(damienProtected)delete p.events.damienTrademarkUncounterable;if(sledgehammerProtected)delete p.events.sledgehammerArmed;`,
  'declare no-auto + intensity'
);

// Managers.
m = replaceOnce(
  m,
  `if(m.effect?.type==='visionManager'){if(p.events.maxxineCounteredMoveUsed)return false;p.events.maxxineCounteredMoveUsed=true;const delta=Number(m.effect.counteredMoveOpponentAdrenaline??-1);if(delta)this._ad(other(attackerId),delta);this._log('MANAGER_ABILITY',{playerId:attackerId,managerId:m.id,managerName:m.name,effect:'countered-move-opponent-adrenaline',cardId:card?.id,opponentAdrenaline:delta});return true;}return false;}`,
  `if(m.effect?.type==='visionManager'){if(p.events.maxxineCounteredMoveUsed)return false;p.events.maxxineCounteredMoveUsed=true;const delta=Number(m.effect.counteredMoveOpponentAdrenaline??-1);if(delta)this._ad(other(attackerId),delta);this._log('MANAGER_ABILITY',{playerId:attackerId,managerId:m.id,managerName:m.name,effect:'countered-move-opponent-adrenaline',cardId:card?.id,opponentAdrenaline:delta});return true;}if(m.effect?.type==='virgilManager'){if(p.events.virgilCounteredMoveUsed)return false;p.events.virgilCounteredMoveUsed=true;this._draw(attackerId,1);this._ad(other(attackerId),-1);this._log('MANAGER_ABILITY',{playerId:attackerId,managerId:m.id,managerName:m.name,effect:'virgil-countered-move',cardId:card?.id,draw:1,opponentAdrenaline:-1});return true;}if(m.effect?.type==='stephanieMcMahonManager'){if(p.events.stephanieCounteredMoveUsed)return false;p.events.stephanieCounteredMoveUsed=true;this._ad(other(attackerId),-1);p.events.stephanieCounterPending=1;this._log('MANAGER_ABILITY',{playerId:attackerId,managerId:m.id,managerName:m.name,effect:'stephanie-countered-move',cardId:card?.id,opponentAdrenaline:-1,nextMoveDiscount:1});return true;}return false;}`,
  'new manager hooks'
);

// Effects: conditional adrenaline and move-type history.
m = replaceOnce(
  m,
  `if(e.type==='gainAdrenaline')this._ad(pid,e.amount);`,
  `if(e.type==='gainAdrenaline'&&(!e.ifAfterMethod||ctx.priorConnectedMethod===e.ifAfterMethod)&&(!e.ifAfterMoveType||p.events?.connectedMoveTypesThisControl?.[e.ifAfterMoveType]))this._ad(pid,e.amount);`,
  'conditional gain adrenaline'
);
m = replaceOnce(
  m,
  `if(e.type==='drawSelf'&&(!e.ifAfterMethod||ctx.priorConnectedMethod===e.ifAfterMethod)&&(!e.ifCounteredThisControl||p.events.counteredThisControl))this._draw(pid,e.amount??1);`,
  `if(e.type==='drawSelf'&&(!e.ifAfterMethod||ctx.priorConnectedMethod===e.ifAfterMethod)&&(!e.ifAfterMoveType||p.events?.connectedMoveTypesThisControl?.[e.ifAfterMoveType])&&(!e.ifCounteredThisControl||p.events.counteredThisControl))this._draw(pid,e.amount??1);`,
  'conditional draw move type'
);

// Custom abilities before generic fallback.
m = replaceOnce(
  m,
  `if(t.type==='bulldogPowerAndTechnique'&&event==='connect'){if(ctx.card?.method!=='technical'||p.events.bulldogPowerTechniqueUsedThisControl){p.lastConnectedMethod=ctx.card?.method??p.lastConnectedMethod;return false;}p.events.bulldogPowerTechniqueUsedThisControl=true;p.methodDiscount.strength=(p.methodDiscount.strength??0)+(t.discount??1);p.abilityUses++;p.abilityUsed=true;this._log('SUPERSTAR_ABILITY',{playerId:pid,abilityName:p.superstar.ability.name,use:p.abilityUses,effect:'technical-to-strength-discount',discount:t.discount??1});p.lastConnectedMethod=ctx.card.method;return true;}if(p.abilityUses>=(t.maxUses??999))return false;`,
  `if(t.type==='bulldogPowerAndTechnique'&&event==='connect'){if(ctx.card?.method!=='technical'||p.events.bulldogPowerTechniqueUsedThisControl){p.lastConnectedMethod=ctx.card?.method??p.lastConnectedMethod;return false;}p.events.bulldogPowerTechniqueUsedThisControl=true;p.methodDiscount.strength=(p.methodDiscount.strength??0)+(t.discount??1);p.abilityUses++;p.abilityUsed=true;this._log('SUPERSTAR_ABILITY',{playerId:pid,abilityName:p.superstar.ability.name,use:p.abilityUses,effect:'technical-to-strength-discount',discount:t.discount??1});p.lastConnectedMethod=ctx.card.method;return true;}if(t.type==='jakePsychology'&&event==='connect'){if(ctx.card?.method!=='strike'||p.events.jakePsychologyUsedThisControl){p.lastConnectedMethod=ctx.card?.method??p.lastConnectedMethod;return false;}p.events.jakePsychologyUsedThisControl=true;if(p.hand.length){const lost=p.hand.pop();p.deck.push(lost);this._draw(pid,1);this._log('SUPERSTAR_ABILITY',{playerId:pid,abilityName:p.superstar.ability.name,effect:'bottom-and-draw',bottomedCardId:lost.id});}p.abilityUses++;p.abilityUsed=true;p.lastConnectedMethod=ctx.card.method;return true;}if(t.type==='perfectExecution'&&event==='counter'){if(p.events.perfectExecutionPending||p.events.perfectExecutionUsedThisControl)return false;p.events.perfectExecutionPending=t.discount??1;p.abilityUses++;p.abilityUsed=true;this._log('SUPERSTAR_ABILITY',{playerId:pid,abilityName:p.superstar.ability.name,effect:'next-technical-discount',discount:t.discount??1});return true;}if(t.type==='jerichoY2J'&&event==='connect'){let fired=false;if(ctx.card?.method==='technical'&&ctx.card?.moveType==='grapple'&&ctx.card?.groundOpponent&&!p.events.jerichoY2JUsedThisControl){p.events.jerichoY2JUsedThisControl=true;p.events.jerichoY2JAgilityArmed=true;p.methodDiscount.agility=(p.methodDiscount.agility??0)+(t.discount??1);p.abilityUses++;p.abilityUsed=true;fired=true;this._log('SUPERSTAR_ABILITY',{playerId:pid,abilityName:p.superstar.ability.name,effect:'technical-to-agility-discount',discount:t.discount??1});}else if(ctx.card?.method==='agility'&&p.events.jerichoY2JAgilityArmed){delete p.events.jerichoY2JAgilityArmed;this._ad(pid,t.adrenaline??1);p.abilityUses++;p.abilityUsed=true;fired=true;this._log('SUPERSTAR_ABILITY',{playerId:pid,abilityName:p.superstar.ability.name,effect:'agility-connect-adrenaline',adrenaline:t.adrenaline??1});}p.lastConnectedMethod=ctx.card?.method??p.lastConnectedMethod;return fired;}if(t.type==='angleOlympicGold'&&event==='connect'){const previous=p.lastConnectedMethod;if(ctx.card?.method==='technical'&&previous==='technical'&&!p.events.angleOlympicGoldUsedThisControl){p.events.angleOlympicGoldUsedThisControl=true;this._draw(pid,t.draw??1);p.abilityUses++;p.abilityUsed=true;this._log('SUPERSTAR_ABILITY',{playerId:pid,abilityName:p.superstar.ability.name,effect:'technical-chain-draw',draw:t.draw??1});p.lastConnectedMethod=ctx.card.method;return true;}p.lastConnectedMethod=ctx.card?.method??p.lastConnectedMethod;return false;}if(p.abilityUses>=(t.maxUses??999))return false;`,
  'new era custom abilities'
);

// Piper generic ability discard support.
m = replaceOnce(
  m,
  `if(t.opponentAdrenaline)this._ad(other(pid),t.opponentAdrenaline);if(t.method)this._gainMomentum(pid,t.method,1);`,
  `if(t.opponentAdrenaline)this._ad(other(pid),t.opponentAdrenaline);if(t.discardOpponent){const q=this._state.players[other(pid)];for(let i=0;i<t.discardOpponent&&q.hand.length;i++){const idx=Math.floor(this.rng()*q.hand.length),[lost]=q.hand.splice(idx,1);this._ditch(other(pid),lost,'superstar-ability-ditch');}}if(t.method)this._gainMomentum(pid,t.method,1);`,
  'generic ability discard'
);

// Damage bonuses for Triple H, Chyna, and Sledgehammer.
m = replaceOnce(
  m,
  `const rt=a.superstar.ability.trigger??{};if(rt.type==='pentaZeroFearZeroMercy'`,
  `const rt=a.superstar.ability.trigger??{};if(rt.type==='tripleHCerebral'&&c.moveType==='grapple'&&hadStrikeThisControl&&!a.events.tripleHCerebralUsedThisControl){a.events.tripleHCerebralUsedThisControl=true;damage+=1;this._ad(pm.attackerId,1);a.abilityUses++;a.abilityUsed=true;this._log('SUPERSTAR_ABILITY',{playerId:pm.attackerId,abilityName:a.superstar.ability.name,effect:'strike-to-grapple',damage:1,adrenaline:1});}if(rt.type==='chynaNinthWonder'&&c.method==='strength'&&(c.cost??0)>=(rt.minCost??5)&&!a.events.chynaNinthWonderUsedThisControl){a.events.chynaNinthWonderUsedThisControl=true;damage+=rt.damage??1;this._ad(pm.attackerId,rt.adrenaline??1);a.abilityUses++;a.abilityUsed=true;this._log('SUPERSTAR_ABILITY',{playerId:pm.attackerId,abilityName:a.superstar.ability.name,effect:'ninth-wonder-power',damage:rt.damage??1,adrenaline:rt.adrenaline??1});}if(pm.sledgehammerDamage)damage+=pm.sledgehammerDamage;if(rt.type==='pentaZeroFearZeroMercy'`,
  'new damage abilities'
);

// Move-type history is marked immediately before effects, so "earlier this Control" conditions work.
m = replaceOnce(
  m,
  `a.events.connectedMethodsThisControl??={};if(c.method)a.events.connectedMethodsThisControl[c.method]=true;a.events.connectedCardNamesThisControl??={};`,
  `a.events.connectedMethodsThisControl??={};if(c.method)a.events.connectedMethodsThisControl[c.method]=true;a.events.connectedMoveTypesThisControl??={};if(c.moveType)a.events.connectedMoveTypesThisControl[c.moveType]=true;a.events.connectedCardNamesThisControl??={};`,
  'move type connection tracking'
);

// Perfect-Plex pin modifier (two duplicated definitions in existing engine).
m = replaceAllChecked(
  m,
  `_pinChance(pid){return healthOnlyPinChance(this._state.players[other(pid)]);}`,
  `_pinChance(pid){const base=healthOnlyPinChance(this._state.players[other(pid)]),card=this._lastPinMove?.(pid)??null,penalty=Math.max(0,Number(card?.pinKickoutPenalty)||0);return Math.max(0,base-penalty);}`,
  2,
  'perfect plex pin modifier'
);

fs.writeFileSync('js/engine/MatchEngine.js', m);
console.log('v0.13.82 engine rules patched');
