import { superstars } from "../data/superstars.js";
import { superstarArtwork } from "../data/artwork.js";

const $ = s => document.querySelector(s);
const canvas = $("#card-canvas");
const ctx = canvas.getContext("2d", { alpha: false });
const roster = Object.values(superstars);

const SETS = {
  "summerslam-series-1": {
    label: "SummerSlam — Series 1",
    ids: roster.filter(s=>s.setId==="summerslam-series-1").map(s=>s.id),
    logo: "assets/art/summerslam-series-1/summerslam-2026-logo.png",
    nameTop: "#ffffff", nameBottom: "#ff9d38", stroke: "#071b36", glow: "rgba(93,210,255,.62)"
  },
  "hall-of-fame-series-1": {
    label: "Hall of Fame — Series 1",
    ids: roster.filter(s=>s.setId==="hall-of-fame-series-1").map(s=>s.id),
    logo: "assets/art/hall-of-fame-series-1/hall-of-fame-logo.png",
    nameTop: "#fff8cf", nameBottom: "#c8972a", stroke: "#07152d", glow: "rgba(230,188,75,.52)"
  },
  "evolution-series-1": {
    label: "Evolution — Series 1",
    ids: roster.filter(s=>s.setId==="evolution-series-1").map(s=>s.id),
    logo: "assets/art/evolution-series-1/evolution-logo.png",
    nameTop: "#ffffff", nameBottom: "#ff54d7", stroke: "#351044", glow: "rgba(76,221,255,.55)"
  },
  "season-1-final-boss": {
    label: "Rewards / Season 1 Final Boss",
    ids: roster.filter(s=>s.setId==="season-1-final-boss").map(s=>s.id),
    logo: null,
    nameTop: "#fff4c8", nameBottom: "#ef3d4c", stroke: "#260307", glow: "rgba(228,183,76,.5)"
  }
};
const byId = Object.fromEntries(roster.map(s=>[s.id,s]));
const setLogos = new Map();

const state = {
  wrestler: null, wrestlerUrl: null,
  wrestlerZoom: 1, wrestlerX: 0, wrestlerY: 0
};

function assetUrl(path){ return new URL(`../../${path.replace(/^\.\//,"")}`, import.meta.url).href; }
function loadImage(src){ return new Promise((resolve,reject)=>{ const im=new Image(); im.onload=()=>resolve(im); im.onerror=()=>reject(new Error("Could not load image.")); im.src=src; }); }
function roundedRect(c,x,y,w,h,r){ c.beginPath(); c.roundRect(x,y,w,h,r); }
function setCanvasSize(){ const [w,h]=$("#output-size").value.split("x").map(Number); canvas.width=w; canvas.height=h; draw(); }
function scale(){ return canvas.width/680; }

async function preloadSetLogos(){
  await Promise.all(Object.entries(SETS).map(async([id,set])=>{
    if(!set.logo)return;
    try{setLogos.set(id,await loadImage(assetUrl(set.logo)));}catch{/* Logo stays optional if a local asset cannot load. */}
  }));
  draw();
}

function drawSummerSlam(c,w,h){
  const g=c.createLinearGradient(0,0,w,h); g.addColorStop(0,"#07172b"); g.addColorStop(.42,"#153d70"); g.addColorStop(.72,"#8d2c58"); g.addColorStop(1,"#ee6f32"); c.fillStyle=g;c.fillRect(0,0,w,h);
  const sun=c.createRadialGradient(w*.77,h*.18,0,w*.77,h*.18,w*.52); sun.addColorStop(0,"rgba(255,204,87,.46)"); sun.addColorStop(.35,"rgba(245,87,65,.17)"); sun.addColorStop(1,"rgba(0,0,0,0)"); c.fillStyle=sun;c.fillRect(0,0,w,h);
  c.save();c.globalAlpha=.34;c.strokeStyle="#75d9ff";c.lineWidth=3*scale();for(let i=-4;i<10;i++){c.beginPath();c.moveTo(-w*.15,h*(.17+i*.105));c.lineTo(w*1.12,h*(-.04+i*.105));c.stroke()}c.restore();
  c.fillStyle="rgba(2,7,16,.72)";c.fillRect(0,h*.78,w,h*.22);
  c.fillStyle="rgba(255,255,255,.035)";c.font=`900 ${150*scale()}px sans-serif`;c.textAlign="center";c.fillText("SS",w*.77,h*.93);
}
function drawHall(c,w,h){
  const g=c.createLinearGradient(0,0,w,h); g.addColorStop(0,"#060606");g.addColorStop(.52,"#17130b");g.addColorStop(1,"#4b3710");c.fillStyle=g;c.fillRect(0,0,w,h);
  const glow=c.createRadialGradient(w*.5,h*.28,0,w*.5,h*.28,w*.55);glow.addColorStop(0,"rgba(255,220,125,.25)");glow.addColorStop(.45,"rgba(198,146,42,.07)");glow.addColorStop(1,"rgba(0,0,0,0)");c.fillStyle=glow;c.fillRect(0,0,w,h);
  c.save();c.strokeStyle="rgba(223,184,77,.18)";c.lineWidth=2*scale();for(let i=0;i<7;i++){const inset=w*(.04+i*.018);roundedRect(c,inset,inset,w-inset*2,h-inset*2,28*scale());c.stroke()}c.restore();
  c.save();c.globalAlpha=.14;c.fillStyle="#e5bd55";for(let i=0;i<9;i++){c.beginPath();c.moveTo(w*.5,h*.02);c.lineTo(w*(.04+i*.12),h*.72);c.lineTo(w*(.12+i*.12),h*.72);c.closePath();c.fill()}c.restore();
  c.fillStyle="rgba(0,0,0,.70)";c.fillRect(0,h*.79,w,h*.21);
}
function drawEvolution(c,w,h){
  const g=c.createLinearGradient(0,0,w,h);g.addColorStop(0,"#160b22");g.addColorStop(.38,"#3f1d65");g.addColorStop(.72,"#b1278f");g.addColorStop(1,"#28102f");c.fillStyle=g;c.fillRect(0,0,w,h);
  const glow=c.createRadialGradient(w*.76,h*.26,0,w*.76,h*.26,w*.55);glow.addColorStop(0,"rgba(255,115,227,.42)");glow.addColorStop(.35,"rgba(108,86,255,.13)");glow.addColorStop(1,"rgba(0,0,0,0)");c.fillStyle=glow;c.fillRect(0,0,w,h);
  c.save();c.globalAlpha=.24;c.fillStyle="#f48de8";for(let i=0;i<8;i++){c.beginPath();c.moveTo(w*(-.12+i*.19),h);c.lineTo(w*(.18+i*.19),0);c.lineTo(w*(.29+i*.19),0);c.lineTo(w*(-.01+i*.19),h);c.closePath();c.fill()}c.restore();
  c.save();c.strokeStyle="rgba(255,255,255,.16)";c.lineWidth=2*scale();for(let i=0;i<4;i++){roundedRect(c,w*(.05+i*.016),h*(.05+i*.011),w*(.90-i*.032),h*(.90-i*.022),24*scale());c.stroke()}c.restore();
  c.fillStyle="rgba(11,4,15,.66)";c.fillRect(0,h*.79,w,h*.21);
}
function drawRewards(c,w,h){
  const g=c.createLinearGradient(0,0,w,h);g.addColorStop(0,"#050506");g.addColorStop(.42,"#180508");g.addColorStop(.72,"#680b14");g.addColorStop(1,"#170305");c.fillStyle=g;c.fillRect(0,0,w,h);
  const glow=c.createRadialGradient(w*.55,h*.22,0,w*.55,h*.22,w*.58);glow.addColorStop(0,"rgba(244,48,64,.35)");glow.addColorStop(.30,"rgba(255,182,71,.09)");glow.addColorStop(1,"rgba(0,0,0,0)");c.fillStyle=glow;c.fillRect(0,0,w,h);
  c.save();c.globalAlpha=.28;c.strokeStyle="#ef3345";c.lineWidth=4*scale();for(let i=-5;i<8;i++){c.beginPath();c.moveTo(w*(-.2+i*.18),h);c.lineTo(w*(.28+i*.18),0);c.stroke()}c.restore();
  c.fillStyle="rgba(0,0,0,.66)";c.fillRect(0,h*.78,w,h*.22);
  c.fillStyle="rgba(255,255,255,.035)";c.font=`1000 ${132*scale()}px sans-serif`;c.textAlign="center";c.fillText("BOSS",w*.59,h*.93);
}
function frame(c,w,h,a,b){
  const s=scale();c.save();roundedRect(c,8*s,8*s,w-16*s,h-16*s,28*s);c.lineWidth=8*s;const g=c.createLinearGradient(0,0,w,h);g.addColorStop(0,a);g.addColorStop(.48,"rgba(255,255,255,.72)");g.addColorStop(1,b);c.strokeStyle=g;c.stroke();roundedRect(c,20*s,20*s,w-40*s,h-40*s,21*s);c.lineWidth=2*s;c.strokeStyle="rgba(255,255,255,.28)";c.stroke();c.restore();
}
function drawTemplate(){ const {width:w,height:h}=canvas; const set=$("#set-select").value; if(set==="hall-of-fame-series-1")drawHall(ctx,w,h);else if(set==="evolution-series-1")drawEvolution(ctx,w,h);else if(set==="season-1-final-boss")drawRewards(ctx,w,h);else drawSummerSlam(ctx,w,h); }
function drawImageContain(im,{cx,cy,scaleFactor=1,maxW,maxH,shadow=false}){ if(!im)return; const ratio=Math.min(maxW/im.width,maxH/im.height)*scaleFactor; const w=im.width*ratio,h=im.height*ratio;ctx.save();if(shadow){ctx.shadowColor="rgba(0,0,0,.75)";ctx.shadowBlur=20*scale();ctx.shadowOffsetY=7*scale()}ctx.drawImage(im,cx-w/2,cy-h/2,w,h);ctx.restore(); }
function drawWrestler(){ if(!state.wrestler)return; const s=scale(),w=canvas.width,h=canvas.height,im=state.wrestler; const base=Math.max(w/im.width,h/im.height);const k=base*state.wrestlerZoom;const dw=im.width*k,dh=im.height*k;const x=(w-dw)/2+state.wrestlerX*s,y=(h-dh)/2+state.wrestlerY*s;ctx.save();ctx.shadowColor="rgba(0,0,0,.45)";ctx.shadowBlur=18*s;ctx.drawImage(im,x,y,dw,dh);ctx.restore(); }
function drawSetLogo(){
  const setId=$("#set-select").value, im=setLogos.get(setId); if(!im)return;
  const w=canvas.width,h=canvas.height,s=scale();
  drawImageContain(im,{cx:w*.82,cy:h*.105,maxW:w*.28,maxH:h*.115,shadow:true});
  ctx.save();ctx.globalAlpha=.28;ctx.strokeStyle="rgba(255,255,255,.8)";ctx.lineWidth=1*s;ctx.beginPath();ctx.moveTo(w*.69,h*.17);ctx.lineTo(w*.94,h*.17);ctx.stroke();ctx.restore();
}
function fittedNameFont(text,maxWidth,maxPx,minPx){
  let px=maxPx;
  while(px>minPx){ctx.font=`italic 1000 ${px*scale()}px "Arial Black", Impact, sans-serif`;if(ctx.measureText(text).width<=maxWidth)break;px-=2;}
  return px;
}
function drawName(){
  const star=byId[$("#star-select").value]; if(!star)return;
  const set=SETS[$("#set-select").value],w=canvas.width,h=canvas.height,s=scale(),text=star.name.toUpperCase();
  ctx.save();ctx.textAlign="center";ctx.textBaseline="alphabetic";
  fittedNameFont(text,w*.86,75,39);
  ctx.lineJoin="round";ctx.miterLimit=2;ctx.lineWidth=8*s;ctx.strokeStyle=set.stroke;ctx.shadowColor="rgba(0,0,0,.92)";ctx.shadowBlur=13*s;ctx.shadowOffsetY=7*s;ctx.strokeText(text,w*.5,h*.935);
  const g=ctx.createLinearGradient(0,h*.865,0,h*.945);g.addColorStop(0,set.nameTop);g.addColorStop(.47,set.nameTop);g.addColorStop(1,set.nameBottom);ctx.fillStyle=g;ctx.shadowColor=set.glow;ctx.shadowBlur=8*s;ctx.shadowOffsetY=0;ctx.fillText(text,w*.5,h*.935);
  ctx.shadowColor="transparent";ctx.globalAlpha=.95;ctx.fillStyle=set.nameBottom;ctx.fillRect(w*.17,h*.955,w*.66,3*s);ctx.restore();
}
function drawFrameOverlay(){ const set=$("#set-select").value,w=canvas.width,h=canvas.height; if(set==="hall-of-fame-series-1")frame(ctx,w,h,"#f0cf76","#8e6720");else if(set==="evolution-series-1")frame(ctx,w,h,"#ff8ee8","#8b6cff");else if(set==="season-1-final-boss")frame(ctx,w,h,"#f04a56","#e8bd65");else frame(ctx,w,h,"#67b9ff","#f6a253"); }
function draw(){ drawTemplate(); drawWrestler(); const vignette=ctx.createLinearGradient(0,0,0,canvas.height);vignette.addColorStop(0,"rgba(0,0,0,.08)");vignette.addColorStop(.60,"rgba(0,0,0,0)");vignette.addColorStop(1,"rgba(0,0,0,.34)");ctx.fillStyle=vignette;ctx.fillRect(0,0,canvas.width,canvas.height);drawSetLogo();drawName();drawFrameOverlay(); }

function updateStars(){ const set=$("#set-select").value; const ids=SETS[set].ids; $("#star-select").innerHTML=ids.map(id=>`<option value="${id}">${byId[id].name}</option>`).join(""); $("#preview-label").textContent=SETS[set].label; resetLayout(); updateDestination(); useCurrent(); draw(); }
function updateDestination(){ const id=$("#star-select").value; const path=id?`assets/cards/art/custom/superstars/${id}.webp`:"assets/cards/art/custom/superstars/…"; $("#destination-path").textContent=path; $("#manifest-entry").textContent=id?`"${id}": "${path}",`:"Select a Superstar."; }
function resetLayout(){ state.wrestlerZoom=1;state.wrestlerX=0;state.wrestlerY=0; [["#wrestler-zoom",100],["#wrestler-x",0],["#wrestler-y",0]].forEach(([sel,v])=>$(sel).value=v); updateOutputs();draw(); }
function updateOutputs(){ $("#wrestler-zoom-value").textContent=`${Math.round(state.wrestlerZoom*100)}%`;$("#wrestler-x-value").textContent=Math.round(state.wrestlerX);$("#wrestler-y-value").textContent=Math.round(state.wrestlerY);$("#quality-value").textContent=`${$("#quality").value}%`; }
async function useCurrent(){ const id=$("#star-select").value,path=superstarArtwork[id]; if(!path)return; try{state.wrestler=await loadImage(assetUrl(path));state.wrestlerZoom=1;state.wrestlerX=0;state.wrestlerY=0;$("#wrestler-zoom").value=100;$("#wrestler-x").value=0;$("#wrestler-y").value=0;updateOutputs();draw();status("Loaded current game portrait.",true)}catch{status("Could not load the current portrait.",false)} }
function fileToImage(file){ if(!file)return; if(state.wrestlerUrl)URL.revokeObjectURL(state.wrestlerUrl);const url=URL.createObjectURL(file);state.wrestlerUrl=url;loadImage(url).then(im=>{state.wrestler=im;draw();status("Wrestler image loaded.",true)}).catch(()=>status("Could not read that image.",false)); }
function status(text,ok){ const el=$("#status");el.textContent=text;el.className=`status ${ok===true?"ok":ok===false?"error":""}`; }
function download(blob,name){const u=URL.createObjectURL(blob),a=document.createElement("a");a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1500)}
async function exportWebp(){ const id=$("#star-select").value;if(!id)return;draw();const q=Number($("#quality").value)/100;canvas.toBlob(blob=>{if(!blob){status("This browser could not encode WebP.",false);return}download(blob,`${id}.webp`);status(`Exported ${id}.webp with set logo and name treatment.`,true)},"image/webp",q); }

$("#set-select").addEventListener("change",updateStars);$("#star-select").addEventListener("change",()=>{updateDestination();useCurrent();draw();});$("#wrestler-file").addEventListener("change",e=>fileToImage(e.target.files[0]));$("#use-current-wrestler").addEventListener("click",useCurrent);$("#clear-wrestler").addEventListener("click",()=>{state.wrestler=null;draw()});$("#reset-layout").addEventListener("click",resetLayout);$("#output-size").addEventListener("change",setCanvasSize);$("#quality").addEventListener("input",updateOutputs);$("#export-webp").addEventListener("click",exportWebp);
[["#wrestler-zoom",v=>state.wrestlerZoom=Number(v)/100],["#wrestler-x",v=>state.wrestlerX=Number(v)],["#wrestler-y",v=>state.wrestlerY=Number(v)]].forEach(([sel,set])=>$(sel).addEventListener("input",e=>{set(e.target.value);updateOutputs();draw()}));
preloadSetLogos();updateStars();updateOutputs();
