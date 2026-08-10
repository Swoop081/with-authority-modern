
import { MatchEngine } from "../js/engine/MatchEngine.js";
import { superstars } from "../js/data/superstars.js";
import { decks } from "../js/data/decks.js";
import { executeCpuDecision, decisionOwner } from "../js/ai/WrestlingAI.js";
import { moveEligibility } from "../js/engine/rules.js";
import { isOffensiveMove } from "../js/data/move-types.js";

const ids=["cody-rhodes","cm-punk","roman-reigns","seth-rollins","oba-femi","brock-lesnar","kevin-owens","gunther"];
const roster=ids.map(id=>Object.values(superstars).find(s=>s.id===id));
const seededRng=(seed)=>{let x=seed>>>0;return()=>((x=(1664525*x+1013904223)>>>0)/4294967296);};
const stats=Object.fromEntries(ids.map(id=>[id,{
  actionSamples:0, handOffensive:0, legalOffensive:0, reasons:{}, cardReasons:{}, searches:{}, searchHits:{}, searchedFinisherDeclared:{}, searchedFinisherConnected:{},
  finisherDeclared:{},finisherConnected:{},trademarkDeclared:{},trademarkConnected:{},passes:0
}]));

const staticAudit={};
for(const id of ids){
 const d=decks[id];
 const methods=new Set(d.filter(c=>c.kind==="momentum").map(c=>c.method));
 const unsupported=[];
 for(const c of d.filter(isOffensiveMove)){
   for(const [m,a] of Object.entries(c.requirements??{})){
     if(a>0 && !methods.has(m)) unsupported.push({id:c.id,name:c.name,method:m,need:a});
   }
 }
 staticAudit[id]={momentumMethods:[...methods],unsupported};
}

for(let rep=0;rep<20;rep++)for(let i=0;i<8;i++)for(let j=0;j<8;j++){
 const a=roster[i],b=roster[j],g=new MatchEngine({superstarA:a,superstarB:b,deckA:decks[a.id],deckB:decks[b.id],startingControl:rep%2?"p2":"p1",rng:seededRng(330000+rep*10000+i*100+j)});
 let li=0,steps=0;
 const pendingSearch={p1:[],p2:[]};
 while(g.state().phase!=="MATCH_OVER"&&steps++<700){
   const st0=g.state(), owner=decisionOwner(st0);
   if(!owner)break;
   if(st0.phase==="ACTION" && st0.playerInControl===owner){
      const sid=owner==="p1"?a.id:b.id,s=stats[sid],p=st0.players[owner];
      s.actionSamples++;
      for(const c of p.hand.filter(isOffensiveMove)){
        s.handOffensive++;
        const e=moveEligibility(st0,owner,c);
        if(e.legal)s.legalOffensive++;
        else{
          const r=e.reason??"unknown";
          s.reasons[r]=(s.reasons[r]??0)+1;
          const key=c.id+"|"+r;
          s.cardReasons[key]=(s.cardReasons[key]??0)+1;
        }
      }
   }
   executeCpuDecision(g,owner);
   const st=g.state(), fresh=st.log.slice(li); li=st.log.length;
   for(const e of fresh){
     const pid=e.playerId;
     const sid=pid==="p1"?a.id:pid==="p2"?b.id:null;
     if(!sid)continue;
     const s=stats[sid];
     if(e.type==="CONTROL_PASSED")s.passes++;
     if(e.type==="CARD_SEARCHED"){
       const key=e.sourceCardId+"->"+e.cardId;
       s.searches[e.sourceCardId]=(s.searches[e.sourceCardId]??0)+1;
       s.searchHits[key]=(s.searchHits[key]??0)+1;
       pendingSearch[pid].push(e.cardId);
     }
     if(e.type==="MOVE_DECLARED"){
       const p=st.players[pid];
       const card=[...p.hand,...p.deck,...p.discard].find(c=>c.id===e.cardId);
       if(card?.finisher)s.finisherDeclared[e.cardId]=(s.finisherDeclared[e.cardId]??0)+1;
       if(card?.trademark)s.trademarkDeclared[e.cardId]=(s.trademarkDeclared[e.cardId]??0)+1;
       const idx=pendingSearch[pid].indexOf(e.cardId);
       if(idx>=0){s.searchedFinisherDeclared[e.cardId]=(s.searchedFinisherDeclared[e.cardId]??0)+1;pendingSearch[pid].splice(idx,1);}
     }
     if(e.type==="MOVE_CONNECTED"){
       const p=st.players[pid];
       const card=[...p.hand,...p.deck,...p.discard].find(c=>c.id===e.cardId);
       if(card?.finisher)s.finisherConnected[e.cardId]=(s.finisherConnected[e.cardId]??0)+1;
       if(card?.trademark)s.trademarkConnected[e.cardId]=(s.trademarkConnected[e.cardId]??0)+1;
       // If a searched finisher was declared, approximate connection conversion separately from totals.
     }
   }
 }
}
console.log(JSON.stringify({staticAudit,stats}));
