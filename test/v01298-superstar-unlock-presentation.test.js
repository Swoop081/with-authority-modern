import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const profile = fs.readFileSync(new URL('../js/data/profile.js', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

test('v0.12.98 superstar unlocks queue a celebration with deck-ready state and Deck Lab shortcut copy', () => {
  assert.match(profile, /deckReady:\s*\(profile\.deckNeedsCards\?\.\[sid\] \?\? 60\) === 0/);
  assert.match(app, /const deckNeeds = Math\.max\(0, Number\(profile\?\.deckNeedsCards\?\.\[event\.superstarId\] \?\? \(event\.deckReady \? 0 : 60\)\) \|\| 0\);/);
  assert.match(app, /OPEN IN DECK LAB/);
  assert.match(app, /READY TO PLAY/);
  assert.match(app, /PAGES TO BUILD/);
  assert.match(css, /\.superstar-unlock-status\{/);
});
