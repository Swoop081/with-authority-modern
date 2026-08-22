import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

test('v0.13.96 removes redundant tier/damage stat badges from collectible card fronts', () => {
  assert.doesNotMatch(app, /ccg-tier-stat-override/);
  assert.doesNotMatch(css, /\.ccg-tier-stat-override/);
  assert.match(app, /ccg-tier-overlay/); // retain printing-tier surface treatment
});

test('v0.13.96 excludes Welcome Superstar from persistent chrome top padding', () => {
  assert.match(css, /body\[data-screen="welcome-superstar"\]:not\(\[data-screen="match"\]\).*main\{padding-top:0!important/);
  assert.match(css, /body\[data-screen="welcome-superstar"\] main\{padding-top:0!important/);
  assert.match(css, /\.welcome-reveal-screen\{align-content:start!important\}/);
});
