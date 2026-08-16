import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

test('v0.12.61 fills the complete launch Final Boss art column with Rock', () => {
  assert.match(css, /v0\.12\.61 — Launch Final Boss Scale Correction/);
  assert.match(css, /\.season-one-ad\{\s*grid-template-columns:45% 55%!important;/);
  assert.match(css, /\.season-one-ad \.season-ad-rock\{[\s\S]*?width:100%!important;[\s\S]*?height:100%!important;[\s\S]*?justify-self:stretch!important;/);
  assert.match(css, /\.season-one-ad \.season-ad-rock img\.final-boss-rock-menu-art\{[\s\S]*?left:50%!important;[\s\S]*?width:auto!important;[\s\S]*?height:108%!important;[\s\S]*?transform:translateX\(-50%\)!important;/);
});
