import fs from 'node:fs';
import { MatchEngine } from '../js/engine/MatchEngine.js';
import { superstars } from '../js/data/superstars.js';
import { decks } from '../js/data/decks.js';
import { collectionCards } from '../js/data/collection.js';
import { executeCpuDecision, decisionOwner } from '../js/ai/WrestlingAI.js';

const byId=Object.fromEntries(Object.values(superstars).map(s=>[s.id,s]));
const cardById=new Map(collectionCards.map(c=>[c.id,c]));
for(const d of Object.values(decks)) for(const c of d) if(!cardById.has(c.id)) cardById.set(c.id,c);
const A='cody-rhodes', B='andre-the-giant', seed=4, startingControl='p2';
let x=seed>>>0; const rng=()=>((x=(1664525*x+1013904223)>>>0)/4294967296);
const g=new MatchEngine({superstarA:byId[A],superstarB:byId[B],deckA:decks[A],deckB:decks[B],startingControl,rng});
let steps=0; while(g.state().phase!=='MATCH_OVER'&&steps++<1200){const o=decisionOwner(g.state()); if(!o) break; executeCpuDecision(g,o);}
const s=g.state();
const nm=id=>id==='p1'?byId[A].name:id==='p2'?byId[B].name:String(id);
const cn=id=>cardById.get(id)?.name??id??'';
let hp={p1:byId[A].hp,p2:byId[B].hp}; const out=[];
out.push('WWE LEGACY v0.8.4 — REPRESENTATIVE AI MATCH LOG','');
out.push(`${nm('p1')} (${byId[A].hp} HP) vs ${nm('p2')} (${byId[B].hp} HP)`);
out.push(`Simulation seed: ${seed} | Starting Control: ${nm(startingControl)}`);
out.push(`Result: ${nm(s.winner)} defeated ${nm(s.winner==='p1'?'p2':'p1')} by ${s.finish.type} on Turn ${s.turnNumber}.`);
out.push(`Final HP: ${nm('p1')} ${s.players.p1.hp}/${s.players.p1.maxHp} | ${nm('p2')} ${s.players.p2.hp}/${s.players.p2.maxHp}`,'');
let turn=-1;
for(const e of s.log){
 if(e.turn!==turn){turn=e.turn;out.push(`================ TURN ${turn} ================`)}
 switch(e.type){
 case 'ENTRANCE_PREMATCH': out.push(`${nm(e.playerId)} — Entrance: ${cn(e.cardId)}`);break;
 case 'BELL_RANG': out.push(`BELL — ${nm(e.control)} begins in Control.`);break;
 case 'CARDS_DRAWN': out.push(`${nm(e.playerId)} draws: ${(e.cardIds??[]).map(cn).join(', ')}`);break;
 case 'MOMENTUM_PLAYED': out.push(`${nm(e.playerId)} plays Momentum: ${cn(e.cardId)}.`);break;
 case 'ACTION_PLAYED': out.push(`${nm(e.playerId)} plays Action: ${cn(e.cardId)}.`);break;
 case 'SUPPORT_PLAYED': out.push(`${nm(e.playerId)} plays Support: ${cn(e.cardId)}.`);break;
 case 'MANAGER_PLAYED': out.push(`${nm(e.playerId)} plays Manager: ${cn(e.cardId)}.`);break;
 case 'SUPERSTAR_ABILITY': out.push(`${nm(e.playerId)} triggers ${e.abilityName}.`);break;
 case 'MOVE_DECLARED': out.push(`${nm(e.playerId)} attempts ${cn(e.cardId)}.`);break;
 case 'MOVE_COUNTERED': out.push(`COUNTER — ${nm(e.defenderId)} counters ${cn(e.incomingCardId)} with ${cn(e.counterCardId)}.`);break;
 case 'AUTO_COUNTER': out.push(`AUTO-COUNTER — ${nm(e.defenderId)} counters ${cn(e.incomingCardId)}.`);break;
 case 'COUNTER_ATTACK_DECLARED': out.push(`  ↳ ${nm(e.attackerId)}'s ${cn(e.cardId)} becomes a counter-attack; ${nm(e.defenderId)} gets a counter-to-counter window.`);break;
 case 'COUNTER_PASSED': out.push(`${nm(e.defenderId)} passes the counter window.`);break;
 case 'MOVE_CONNECTED': hp[e.defenderId]=Math.max(0,hp[e.defenderId]-e.damage); out.push(`HIT — ${nm(e.attackerId)} connects with ${cn(e.cardId)} for ${e.damage} damage. ${nm(e.defenderId)}: ${hp[e.defenderId]} HP.`);break;
 case 'HP_RECOVERED': hp[e.playerId]=Math.min((e.playerId==='p1'?byId[A].hp:byId[B].hp),hp[e.playerId]+e.amount); out.push(`${nm(e.playerId)} recovers ${e.amount} HP → ${hp[e.playerId]} HP.`);break;
 case 'SUBMISSION_DAMAGE': out.push(`SUBMISSION — ${nm(e.defenderId)} takes ${e.damage} ${e.bodyPart} pressure (${e.total}/${e.threshold}).`);break;
 case 'SUBMISSION_MAINTAINED': out.push(`${nm(e.attackerId)} MAINTAINS the submission by ditching ${cn(e.ditchedCardId)}.`);break;
 case 'SUBMISSION_RELEASED': out.push(`${nm(e.attackerId)} releases the submission.`);break;
 case 'PIN_ATTEMPTED': out.push(`PIN — ${nm(e.attackerId)} covers ${nm(e.defenderId)}. Attempt #${e.attemptNumber}; chance ${e.chance}%.`);break;
 case 'PIN_RESPONSE_PASSED': out.push(`${nm(e.defenderId)} passes the pin-response window.`);break;
 case 'PIN_CHECK': out.push(`Pin roll: ${e.roll} vs ${e.chance}% chance.`);break;
 case 'KICK_OUT': out.push(`KICK OUT — ${nm(e.defenderId)} survives.`);break;
 case 'PIN_ESCAPED_SPECIAL': out.push(`${nm(e.defenderId)} escapes the pin with ${cn(e.cardId)}.`);break;
 case 'CONTROL_PASSED': out.push(`PASS — ${nm(e.from)} gives up Control to ${nm(e.to)}. Reason: ${e.reason ?? 'not recorded'}.`);break;
 case 'CONTROL_RETAINED': out.push(`${nm(e.playerId)} retains Control.`);break;
 case 'CRITICAL_EXHAUSTION': out.push(`CRITICAL EXHAUSTION — ${nm(e.playerId)} is at 0 HP and cannot retain Control; Control passes to ${nm(e.controlTo)}.`);break;
 case 'MATCH_ENDED': out.push(`MATCH OVER — ${nm(e.winnerId)} wins by ${e.finishType}.`);break;
 case 'RETURNED_TO_RING': out.push(`${nm(e.playerId)} returns to the ring.`);break;
 case 'FOLLOWED_OUTSIDE': out.push(`${nm(e.attackerId)} follows ${nm(e.defenderId)} to ringside.`);break;
 }
}
const passReasons={}; for(const e of s.log.filter(e=>e.type==='CONTROL_PASSED')){const r=e.reason??'not-recorded';passReasons[r]=(passReasons[r]??0)+1;}
out.push('', '================ MATCH REVIEW DATA ================');
out.push(`Turns: ${s.turnNumber}`);
out.push(`Moves connected: ${s.log.filter(e=>e.type==='MOVE_CONNECTED').length}`);
out.push(`Offensive counter-attacks: ${s.log.filter(e=>e.type==='COUNTER_ATTACK_DECLARED').length}`);
out.push(`Kick-outs: ${s.log.filter(e=>e.type==='KICK_OUT').length}`);
out.push(`Submission maintains: ${s.log.filter(e=>e.type==='SUBMISSION_MAINTAINED').length}`);
out.push(`Critical Exhaustion events: ${s.log.filter(e=>e.type==='CRITICAL_EXHAUSTION').length}`);
out.push(`Pass reasons: ${Object.entries(passReasons).map(([k,v])=>`${k}=${v}`).join(', ') || 'none'}`);
out.push(`Final HP: ${nm('p1')} ${s.players.p1.hp}/${s.players.p1.maxHp}; ${nm('p2')} ${s.players.p2.hp}/${s.players.p2.maxHp}`);
out.push('', 'Review focus: this log intentionally exposes pass reasons, submission ditch costs, counter-to-counter windows, and Critical Exhaustion so match-flow decisions can be audited instead of inferred.');
const dest='/mnt/data/WWE-Legacy-v0.8.4-Cody-vs-Andre-match-log.txt'; fs.writeFileSync(dest,out.join('\n')); console.log(out.slice(-20).join('\n')); console.log(`\nWrote ${dest}`);
