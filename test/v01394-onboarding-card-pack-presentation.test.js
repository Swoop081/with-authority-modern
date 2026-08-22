import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

test('v0.13.96 starter choice renders actual Normal Superstar cards for Punk and Roman', () => {
  assert.match(app, /champion-card-onboarding/);
  assert.match(app, /starter-superstar-card-face/);
  assert.match(app, /collectionCards\.find\(c => c\.id === `superstar-\$\{star\.id\}`\)/);
  assert.match(app, /collectibleCardMarkup\(card,\{tier:'normal',interactive:false,eagerArt:true,extraClass:'starter-onboarding-ccg'\}\)/);
  assert.doesNotMatch(app, /<div class="starter-photo">\$\{superstarVisualMarkup\(star\.id,star\.name\)\}<\/div>/);
  assert.match(css, /\.starter-superstar-card-face \.ccg-card/);
});

test('v0.13.96 Welcome era choice renders the five physical set packs as selectors', () => {
  assert.match(app, /welcome-pack-screen/);
  assert.match(app, /welcome-pack-choice-grid/);
  assert.match(app, /physicalBoosterPackMarkup\(\{setId,title:set\?\.name/);
  assert.match(app, /subtitle:'WELCOME SUPERSTAR'/);
  assert.match(css, /\.welcome-pack-choice-grid\{display:grid!important;grid-template-columns:repeat\(6,minmax\(0,1fr\)\)!important/);
  assert.match(css, /\.physical-booster-pack\.pack-set-new-generation-series-1/);
});
