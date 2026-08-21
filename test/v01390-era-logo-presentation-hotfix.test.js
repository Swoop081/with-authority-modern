import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test.skip('v0.13.90 Golden Era card logo is the existing WWF block without invented GOLDEN ERA text',()=>{
  const svg=read('assets/branding/golden-era-series-1/golden-era-wwf-logo.svg');
  assert.match(svg,/aria-label="Golden Era WWF logo"/);
  assert.doesNotMatch(svg,/>GOLDEN ERA<\/text>/);
  assert.match(svg,/<path d="m93\.938 131\.69/);
});

test.skip('v0.13.90 Attitude Era card-art-studio logo draw box is exactly doubled',()=>{
  const studio=read('js/tools/card-art-studio.js');
  assert.match(studio,/isAttitude\)\{cx=w\*\.80;cy=h\*\.105;maxW=w\*\.60;maxH=h\*\.29;\}/);
  assert.doesNotMatch(studio,/isAttitude\)\{cx=w\*\.80;cy=h\*\.105;maxW=w\*\.30;maxH=h\*\.145;\}/);
});

test.skip('v0.13.90 local-file Card Art Studio uses corrected Golden logo override',()=>{
  const studio=read('js/tools/card-art-studio.js');
  assert.match(studio,/CARD_STUDIO_SET_LOGO_OVERRIDES=\{"golden-era-series-1":"data:image\/svg\+xml;base64,/);
  assert.match(studio,/const src=CARD_STUDIO_SET_LOGO_OVERRIDES\[id\]\|\|/);
});
