
import { MatchEngine } from "../js/engine/MatchEngine.js";
import { superstars } from "../js/data/superstars.js";
import { decks } from "../js/data/decks.js";
import { executeCpuDecision, decisionOwner } from "../js/ai/WrestlingAI.js";
import { moveEligibility } from "../js/engine/rules.js";

const focus=["randy-savage","hulk-hogan","the-undertaker","kane","roman-reigns"];
const opps=["cody-rhodes","cm-punk","roman-reigns","seth-rollins","oba-femi","brock-lesnar","kevin-owens","gunther","hulk-hogan","andre-the-giant","randy-savage","ultimate-warrior","stone-cold-steve-austin","the-undertaker","mankind","kane"];
const S=id=>Object.values(superstars).find(s=>s.id===id);
const rng=s=>{let x=s>>>0;return()=>((x=(1664525*x+1013904223)>>>0)/4294967296)};
const out=Object.fromEntries(focus.map(id=>[id,{matches:0,wins:0,actionSamples:0,off:0,legal:0,reasons:{},decl:{},conn:{},search:{},specials:{},abilities:{},passes:0,finishersDeclared:0,finishersConnected:0,trademarksConnected:0}]));

for(let rep=0;rep<16;rep++){
  for(const fid of focus){
    for(const oid of opps){
      for(const flip of [0,1]){
        const aid=flip?oid:fid,bid=flip?fid:oid,a=S(aid),b=S(bid);
        const g=new MatchEngine({superstarA:a,superstarB:b,deckA:decks[aid],deckB:decks[bid],startingControl:rep%2?"p2":"p1",rng:rng(4100000+rep*10000+focus.indexOf(fid)*200+opps.indexOf(oid)*2+flip)});
        let li=0,k=0;
        while(g.state().phase!=="MATCH_OVER"&&k++<900){
          const st=g.state(),o=decisionOwner(st); if(!o)break;
          const pid=aid===fid?"p1":"p2", x=out[fid];
          if(st.phase==="ACTION"&&st.playerInControl===pid){
            x.actionSamples++;
            const p=st.players[pid];
            for(const c of p.hand.filter(c=>c.kind==="move"&&!c.defensiveOnly)){
              x.off++;
              const e=moveEligibility(st,pid,c);
              if(e.legal)x.legal++;
              else { const key=c.id+"|"+e.reason; x.reasons[key]=(x.reasons[key]??0)+1; }
            }
          }
          executeCpuDecision(g,o);
          const fresh=g.state().log.slice(li); li=g.state().log.length;
          for(const e of fresh){
            const ep=e.playerId??e.attackerId??e.defenderId;
            const sid=ep==="p1"?aid:ep==="p2"?bid:null;
            if(sid!==fid)continue;
            const x=out[fid];
            if(e.type==="MOVE_DECLARED"){
              x.decl[e.cardId]=(x.decl[e.cardId]??0)+1;
              const c=decks[fid].find(c=>c.id===e.cardId);
              if(c?.finisher)x.finishersDeclared++;
            }
            if(e.type==="MOVE_CONNECTED"){
              x.conn[e.cardId]=(x.conn[e.cardId]??0)+1;
              const c=decks[fid].find(c=>c.id===e.cardId);
              if(c?.finisher)x.finishersConnected++;
              if(c?.trademark)x.trademarksConnected++;
            }
            if(e.type==="CARD_SEARCHED")x.search[e.sourceCardId+"->"+e.cardId]=(x.search[e.sourceCardId+"->"+e.cardId]??0)+1;
            if(e.type==="SUPERSTAR_SPECIAL_PLAYED")x.specials[e.cardId]=(x.specials[e.cardId]??0)+1;
            if(e.type==="SUPERSTAR_ABILITY")x.abilities[e.abilityName??e.abilityId??"ability"]=(x.abilities[e.abilityName??e.abilityId??"ability"]??0)+1;
            if(e.type==="CONTROL_PASSED")x.passes++;
          }
        }
        const st=g.state(); out[fid].matches++;
        if((st.winner==="p1"&&aid===fid)||(st.winner==="p2"&&bid===fid))out[fid].wins++;
      }
    }
  }
}
console.log(JSON.stringify(out));
