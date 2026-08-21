import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { superstars } from '../js/data/superstars.js?v=0.13.93';

await import('../js/data/superstar-nameplates.js?v=0.13.93');
const profiles = globalThis.WWE_LEGACY_SUPERSTAR_NAMEPLATES;

test('v0.13.72 authors a nameplate identity for every current Superstar', () => {
  const roster = Object.values(superstars);
  assert.equal(roster.length, 76);
  assert.equal(Object.keys(profiles).length, roster.length);
  for (const star of roster) assert.ok(profiles[star.id], `missing ${star.id}`);
});

test('every Superstar has a distinct typographic treatment fingerprint', () => {
  const fingerprints = new Set();
  for (const [id,p] of Object.entries(profiles)) {
    assert.ok(p.styleName, `${id} style name`);
    assert.ok(p.fontFamily, `${id} font family`);
    assert.ok(p.setId, `${id} set id`);
    const fp=[p.fontFamily,p.weight,p.italic,p.tracking,p.skew,p.scaleX,p.fontScale].join('|');
    assert.ok(!fingerprints.has(fp), `duplicate typography treatment for ${id}`);
    fingerprints.add(fp);
  }
  assert.equal(fingerprints.size, 76);
});

test('Card Studio loads and renders authored Superstar nameplate identities', () => {
  const html=fs.readFileSync(new URL('../tools/card-art-studio.html',import.meta.url),'utf8');
  const js=fs.readFileSync(new URL('../js/tools/card-art-studio.js',import.meta.url),'utf8');
  assert.match(html,/superstar-nameplates\.js\?v=0\.13\.93/);
  assert.match(html,/id="nameplate-preview"/);
  assert.match(js,/function drawSuperstarName\(/);
  assert.match(js,/WWE_LEGACY_SUPERSTAR_NAMEPLATES/);
  assert.match(js,/nameplate-style/);
});

test('live Superstar cards use the same authored nameplate system', () => {
  const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
  const app=fs.readFileSync(new URL('../js/ui/app.js',import.meta.url),'utf8');
  const css=fs.readFileSync(new URL('../css/game.css',import.meta.url),'utf8');
  assert.match(html,/superstar-nameplates\.js\?v=0\.13\.93/);
  assert.match(app,/function superstarNameplateMarkup\(card\)/);
  assert.match(app,/ccg-superstar-nameplate/);
  assert.match(css,/v0\.13\.72 — Superstar Nameplate Identity system/);
  assert.match(css,/set-new-generation-series-1/);
  assert.match(css,/set-golden-era-series-1/);
  assert.match(css,/set-attitude-era-series-1/);
  assert.match(css,/set-evolution-series-1/);
});
