import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { allGameplayCards } from '../js/data/content.js';
import { superstars } from '../js/data/superstars.js';
import { layeredCardArtFor, finishedCardArtFor, legacyFinishedCardArtFor, superstarHeadshotFor, menuSuperstarPhotoFor } from '../js/data/artwork.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imageRoot = path.join(root, 'assets/images');
const imageExt = /\.(?:png|jpe?g|webp|svg|gif|ico|avif)$/i;
const strip = (url) => String(url ?? '').replace(/^\.\//,'').replace(/\?v=.*$/,'');
const exists = (url) => Boolean(url) && fs.existsSync(path.join(root, strip(url)));
const walk = (dir, out=[]) => { for (const e of fs.readdirSync(dir,{withFileTypes:true})) { const p=path.join(dir,e.name); e.isDirectory()?walk(p,out):out.push(p); } return out; };

const allAssetImages = walk(path.join(root,'assets')).filter(p=>imageExt.test(p));
const outside = allAssetImages.filter(p=>path.dirname(p)!==imageRoot);
if (outside.length) throw new Error(`Images outside assets/images: ${outside.map(p=>path.relative(root,p)).join(', ')}`);

const runtimeFiles=[...walk(path.join(root,'js')),...walk(path.join(root,'css')),path.join(root,'index.html'),path.join(root,'manifest.webmanifest')].filter(p=>/\.(?:js|mjs|css|html|webmanifest|json)$/i.test(p));
const oldPath=/assets\/(?:cards\/art|art\/|branding\/|ui\/|icons\/|templates\/)/;
const stale=[];
for(const f of runtimeFiles){const t=fs.readFileSync(f,'utf8'); if(oldPath.test(t)) stale.push(path.relative(root,f));}
if(stale.length) throw new Error(`Runtime still contains legacy image roots: ${stale.join(', ')}`);

const staticRefs=new Set();
const refRe=/assets\/images\/[A-Za-z0-9_.-]+\.(?:png|webp|jpe?g|svg|gif|ico|avif)/g;
for(const f of runtimeFiles){const t=fs.readFileSync(f,'utf8'); for(const m of t.matchAll(refRe)) staticRefs.add(m[0]);}
const missingStatic=[...staticRefs].filter(ref=>!fs.existsSync(path.join(root,ref)));
if(missingStatic.length) throw new Error(`Missing static image refs: ${missingStatic.join(', ')}`);

let installedCardFronts=0, layered=0, flat=0;
for(const card of allGameplayCards){
  if(card.kind==='momentum') continue;
  const l=layeredCardArtFor(card), f=finishedCardArtFor(card), g=legacyFinishedCardArtFor(card);
  if(exists(l)){installedCardFronts++;layered++;}
  else if(exists(f)||exists(g)){installedCardFronts++;flat++;}
}
let headshots=0, menuPortraits=0;
for(const s of Object.values(superstars)){ if(exists(superstarHeadshotFor(s.id))) headshots++; if(exists(menuSuperstarPhotoFor(s.id))) menuPortraits++; }
const files=fs.readdirSync(imageRoot).filter(n=>imageExt.test(n));
console.log(JSON.stringify({imageFiles:files.length,installedGameplayCardFronts:installedCardFronts,layered,flat,headshots,menuPortraits,staticRefs:staticRefs.size},null,2));
if(files.length<600) throw new Error(`Recovered image library unexpectedly small: ${files.length}`);
if(headshots<48) throw new Error(`Expected at least 48 recovered headshots, found ${headshots}`);
if(installedCardFronts<300) throw new Error(`Expected at least 300 installed gameplay card fronts, found ${installedCardFronts}`);
