import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createProfile } from '../js/data/profile.js?v=0.13.90';
import { superstars } from '../js/data/superstars.js?v=0.13.90';
import { allGameplayCards } from '../js/data/content.js?v=0.13.90';
import { decks } from '../js/data/decks.js?v=0.13.90';
import { activeLiveEventTowers, startLiveEventTower, RAW_LIVE_EVENT } from '../js/data/live-events.js?v=0.13.90';
import { counterEligibility } from '../js/engine/rules.js?v=0.13.90';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.90';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');
const rosterIds = Object.values(superstars).map(star => star.id);
const once = allGameplayCards.find(card => card.id === 'once-too-often');

test.skip('v0.13.76 RAW LIVE is a non-Monday RAW Series 1 tower with persistent 24-hour use cooldown', () => {
  const p = createProfile('cm-punk');
  const monday = new Date(2026, 7, 24, 12, 0, 0);
  assert.equal(activeLiveEventTowers(monday, p).some(t => t.event.id === RAW_LIVE_EVENT.id), false, 'RAW LIVE never overlaps Monday Night RAW');

  const tuesday = new Date(2026, 7, 25, 12, 0, 0);
  const raw = activeLiveEventTowers(tuesday, p).find(t => t.event.id === RAW_LIVE_EVENT.id);
  assert.ok(raw, 'RAW LIVE is eligible Tuesday-Sunday when off cooldown');
  assert.equal(raw.event.name, 'RAW LIVE');
  assert.equal(raw.event.rewardSetId, 'raw-series-1');
  assert.equal(raw.length, 5);
  assert.deepEqual(raw.event.opponentPool.sort(), [...RAW_LIVE_EVENT.opponentPool].sort());

  const run = startLiveEventTower(p, raw.key, 'cm-punk', rosterIds, () => 0.42, tuesday);
  assert.equal(run.rewardSetId, 'raw-series-1');
  assert.equal(run.opponents.length, 5);
  assert.ok(p.liveEventTowers.rawLiveLastUsedAt, 'using RAW LIVE persists a cooldown timestamp in the profile');
  assert.ok(activeLiveEventTowers(tuesday, p).some(t => t.key === raw.key), 'today\'s active RAW LIVE stays visible after the cooldown starts');

  const wednesday = new Date(2026, 7, 26, 0, 1, 0);
  assert.equal(activeLiveEventTowers(wednesday, p).some(t => t.event.id === RAW_LIVE_EVENT.id), false, 'next day is suppressed while 24-hour cooldown is still active');
  const thursday = new Date(2026, 7, 27, 0, 1, 0);
  assert.equal(activeLiveEventTowers(thursday, p).some(t => t.event.id === RAW_LIVE_EVENT.id), true, 'RAW LIVE can return after the cooldown has fully expired');
});

test('v0.13.76 Once Too Often is terminal and cannot answer another Once Too Often or any Action', () => {
  assert.ok(once);
  const game = new MatchEngine({ p1: superstars.cmPunk, p2: superstars.codyRhodes, decks, rng: () => 0.42 });
  const state = game.state();
  state.phase = 'COUNTER';
  state.proposedMove = { attackerId: 'p2', defenderId: 'p1', card: once, isCounterAttack: false };
  state.players.p1.hand = [once];
  assert.equal(counterEligibility(state, 'p1', once, once).legal, false);
  assert.equal(game.counter('p1', once), false);

  const ordinaryAction = allGameplayCards.find(card => card.kind === 'action' && card.id !== once.id);
  state.phase = 'COUNTER';
  state.proposedMove = { attackerId: 'p2', defenderId: 'p1', card: ordinaryAction, isCounterAttack: false };
  assert.equal(counterEligibility(state, 'p1', ordinaryAction, once).legal, false);
  assert.equal(game.counter('p1', once), false);
});

test('v0.13.76 Deck Assistance exposes one-click Apply All without overriding prior Keep As-Is choices', () => {
  assert.match(app, /function applyAllPendingUpgrades\(\)/);
  assert.match(app, /id="apply-all-upgrades"/);
  assert.match(app, /APPLY ALL UPGRADES/);
  assert.match(app, /pendingUpgrades = \[\]/);
  assert.match(app, /skipped/);
  assert.match(app, /data-decline-upgrade/);
  assert.match(css, /\.focused-pack-upgrades \.pack-apply-all/);
});

test('v0.13.76 iPhone Live Event details scroll to complete route cards instead of clipping their bottoms', () => {
  assert.match(css, /body\[data-screen="live-events"\]\[data-live-view="detail"\] main\{[\s\S]*?overflow-y:auto!important/);
  assert.match(css, /\.live-tower-route\{[\s\S]*?min-height:330px!important[\s\S]*?overflow:visible!important/);
  assert.match(css, /\.live-tower-route-card\{[\s\S]*?min-height:258px!important[\s\S]*?overflow:visible!important/);
});

test('v0.13.76 Booster Vault quantity badges are inset inside unclipped product tiles', () => {
  assert.match(css, /body\[data-screen="boosters"\] \.vault-pack-product\{[\s\S]*?clip-path:none!important[\s\S]*?overflow:visible!important/);
  assert.match(css, /body\[data-screen="boosters"\] \.vault-pack-quantity\{[\s\S]*?top:18px!important[\s\S]*?right:18px!important/);
});
