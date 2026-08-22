import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectionCards } from '../js/data/collection.js?v=0.14.04';
import { layeredCardArtFor, superstarCardArtFor, superstarHeadshotFor } from '../js/data/artwork.js?v=0.14.04';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const strip=u=>String(u??'').replace(/\?v=.*$/,'');

test('v0.13.96 stores every image in one flat assets/images directory',()=>{
  const walk=(d,o=[])=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);e.isDirectory()?walk(p,o):o.push(p)}return o};
  const imgs=walk(path.join(root,'assets')).filter(p=>/\.(png|jpe?g|webp|svg|gif|ico|avif)$/i.test(p));
  assert.ok(imgs.length>=600);
  assert.deepEqual([...new Set(imgs.map(p=>path.dirname(p)))],[path.join(root,'assets/images')]);
});

test('v0.13.96 canonical card and headshot resolvers use flat filenames',()=>{
  const roman=collectionCards.find(c=>c.kind==='superstar'&&c.superstarId==='roman-reigns');
  assert.equal(strip(layeredCardArtFor(roman)),'assets/images/card-layered-superstar-roman-reigns.webp');
  assert.equal(strip(superstarCardArtFor('roman-reigns')),'assets/images/card-custom-superstar-roman-reigns.webp');
  assert.equal(strip(superstarHeadshotFor('roman-reigns')),'assets/images/headshot-roman-reigns.webp');
});

test('v0.13.96 recovered known card art and headshots are physically packaged',()=>{
  for(const rel of ['assets/images/card-layered-move-kevin-owens-stunner.webp','assets/images/card-custom-move-chop.webp','assets/images/headshot-cm-punk.webp','assets/images/headshot-roman-reigns.webp']) assert.equal(fs.existsSync(path.join(root,rel)),true,rel);
});

test('v0.13.96 Welcome screen owns the viewport without legacy chrome top gap',()=>{
  const css=fs.readFileSync(path.join(root,'css/game.css'),'utf8');
  assert.match(css,/body\[data-screen="welcome-superstar"\] main\{[^}]*padding-top:0!important/);
  assert.match(css,/body\[data-screen="welcome-superstar"\] \.topbar[^}]*display:none!important/);
});
