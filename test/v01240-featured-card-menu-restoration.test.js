import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const ui = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');
const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

test('v0.12.40 restores one collectible Superstar card to each Home action tile', () => {
  for (const id of ['stone-cold-steve-austin','iyo-sky','seth-rollins','becky-lynch','gunther','cody-rhodes']) {
    assert.match(ui, new RegExp(`superstarPreviewCardMarkup\\("${id}","home-tile-card"\\)`));
  }
  assert.match(ui, /superstarPreviewCardMarkup\(starter\.id,"home-tile-card"\)/);
  assert.match(css, /\.compact-hub-grid \.tile-bg-art \.home-tile-card\{/);
  assert.match(css, /\.compact-hub-grid \.primary-tile \.tile-bg-art \.home-tile-card\{/);
});

test('v0.12.40 Choose Your Path uses a single full Superstar card per mode', () => {
  assert.match(ui, /const modeCard = starId => `<div class="mode-full-card-art">\$\{superstarPreviewCardMarkup\(starId,"mode-feature-card"\)\}<\/div>`;/);
  assert.match(ui, /\$\{modeCard\("cody-rhodes"\)\}/);
  assert.match(ui, /\$\{modeCard\("gunther"\)\}/);
  assert.match(ui, /\$\{modeCard\("roman-reigns"\)\}/);
  assert.match(css, /\.premium-mode-card \.mode-full-card-art \.mode-feature-card\{/);
});
