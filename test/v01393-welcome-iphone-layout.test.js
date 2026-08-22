import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

test.skip('v0.13.93 Welcome era choice uses compact set identity rather than fake pack art — superseded by v0.13.96 pack-choice presentation', () => {
  assert.match(app, /welcome-choice-screen/);
  assert.match(app, /welcome-set-logo/);
  assert.match(app, /setLogoMarkup\(setId,"welcome-era-logo"\)/);
  assert.doesNotMatch(app, /welcome-set-choice[^`]*physicalBoosterPackMarkup/);
  assert.match(css, /\.welcome-set-choice-grid\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)!important/);
  assert.match(css, /\.welcome-set-choice:nth-child\(5\)\{grid-column:1\/-1/);
});

test('v0.13.93 Welcome Superstar reveal gives the actual card a full iPhone hero stage', () => {
  assert.match(app, /welcome-reveal-screen/);
  assert.match(app, /welcome-superstar-card-wrap/);
  assert.match(css, /\.welcome-reveal-screen\{height:100svh!important;min-height:100svh!important/);
  assert.match(css, /\.welcome-superstar-card-wrap \.ccg-card\{display:block!important/);
  assert.match(css, /width:min\(80vw,39svh,350px\)!important/);
  assert.match(css, /\.welcome-continue-cta\{width:100%!important;min-height:54px!important/);
});
