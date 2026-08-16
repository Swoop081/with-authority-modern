import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const app = await readFile(new URL('js/ui/app.js', root), 'utf8');
const css = await readFile(new URL('css/game.css', root), 'utf8');

test('v0.12.63 keeps the canonical card back under every optional non-Superstar finished front', () => {
  assert.match(app, /const rulesMarkup = cardRulesFaceMarkup\(card, setClass, typeLabel, subtitle, ruleText\)/);
  assert.match(app, /ccg-card-front-backup ccg-card-rules/);
  assert.match(app, /ccg-custom-front-overlay/);
});

test('v0.12.63 failed custom front images remove the art layer and reveal the original back', () => {
  assert.match(app, /classList\.add\('is-missing-finished-art'\)/);
  assert.match(app, /classList\.add\('uses-rules-fallback'\)/);
  assert.match(css, /\.ccg-card-front \.ccg-custom-front-overlay\.is-missing-finished-art\{display:none!important\}/);
});

test('v0.12.63 preserves custom move fronts as the front-side overlay when installed', () => {
  assert.match(app, /finishedFront \? `<span class="ccg-card-art ccg-custom-front-overlay \$\{moveFront \? "ccg-move-full-art" : ""\}">\$\{finishedFrontImageMarkup\(card\)\}<\/span>` : ""/);
  assert.match(app, /const displayFlipped = Boolean\(flipped\)/);
});
