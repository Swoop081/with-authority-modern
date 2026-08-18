import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

test('v0.12.38 Climb the Ladder uses compact command and 4x2 progress presentation', () => {
  assert.match(app, /premium-run-screen/);
  assert.match(app, /mode-run-command ladder-run-command/);
  assert.match(app, /ladder-progress-grid/);
  assert.match(css, /\.premium-run-screen \.ladder-progress-grid\{grid-template-columns:repeat\(4,minmax\(0,1fr\)\)!important\}/);
  assert.match(css, /\.premium-run-screen \.select-superstar-card\{[\s\S]*height:184px!important/);
});

test('v0.13.24 Championship Road supersedes the old 4-stage rail with the 24-match difficulty map', () => {
  assert.match(app, /champ-road-command/);
  assert.match(app, /champ-road-map/);
  assert.match(app, /CHAMPIONSHIP_ROAD_LENGTH/);
  assert.match(app, /champ-difficulty-rail/);
  assert.match(css, /\.champ-road-map\{/);
  assert.match(css, /\.champ-difficulty-rail\{/);
});

test('v0.12.38 mobile run screens are deliberately bounded for one-screen iPhone presentation', () => {
  assert.match(css, /@media\(max-width:600px\)[\s\S]*\.premium-run-screen \.mode-run-hero\{min-height:214px!important;height:214px!important/);
  assert.match(css, /\.premium-run-screen \.mode-run-node\{min-height:63px!important/);
  assert.match(css, /\.premium-run-screen \.select-superstar-card\{flex-basis:112px!important;width:112px!important;height:164px!important/);
});
