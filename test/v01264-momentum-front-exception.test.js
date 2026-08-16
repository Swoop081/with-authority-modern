import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const app = await readFile(new URL('js/ui/app.js', root), 'utf8');

test('v0.12.64 Momentum is the authored-front exception to generic card-back fallback', () => {
  assert.match(app, /const momentumFront = card\.kind === "momentum"/);
  assert.match(app, /const finishedFront = !superstarFront && !momentumFront && Boolean\(finishedCardArtFor\(card\)\)/);
  assert.match(app, /ccg-momentum-authored-front/);
});

test('v0.12.64 Momentum front uses the existing live WWE Legacy Momentum mockup', () => {
  assert.match(app, /momentumFront[\s\S]*cardArtFace\(card\)/);
  assert.match(app, /if \(card\.kind === "momentum"\)[\s\S]*return momentumMockupMarkup\(card\)/);
  assert.match(app, /class="momentum-arena-lines"/);
});

test('v0.12.64 Momentum still flips to the canonical rules back', () => {
  assert.match(app, /<span class="ccg-card-face ccg-card-rules \$\{setClass\}">\$\{rulesMarkup\}<\/span>/);
});
