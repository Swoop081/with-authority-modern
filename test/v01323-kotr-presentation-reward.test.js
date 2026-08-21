import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createProfile } from '../js/data/profile.js?v=0.13.90';
import { superstars } from '../js/data/superstars.js?v=0.13.90';
import { playerReleasedCollectibleSetIds } from '../js/data/release.js?v=0.13.90';
import { boosterCreditsFor } from '../js/data/boosters.js?v=0.13.90';
import { kingOfTheRingState, startKingOfTheRing, recordKingOfTheRingMatch, markKingOfTheRingCoronationSeen } from '../js/data/king-of-the-ring.js?v=0.13.90';

const ids = Object.values(superstars).filter(s => !s.developmentOnly).map(s => s.id);
const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');
const now = new Date(2026, 7, 21, 12, 0, 0);

function winTournament(profile) {
  startKingOfTheRing(profile, 'cm-punk', ids, () => 0.314159);
  recordKingOfTheRingMatch(profile, 'win', () => 0.314159, now);
  recordKingOfTheRingMatch(profile, 'win', () => 0.314159, now);
  recordKingOfTheRingMatch(profile, 'win', () => 0.314159, now);
  return kingOfTheRingState(profile).activeRun;
}

test('v0.13.85 KOTR winner is crowned and persists as reigning King', () => {
  const p = createProfile('cm-punk');
  const run = winTournament(p);
  const state = kingOfTheRingState(p);
  assert.equal(run.status, 'cleared');
  assert.equal(state.reigningKingId, 'cm-punk');
  assert.ok(state.reigningKingAt);
  assert.equal(state.clears, 1);
});

test('v0.13.85 KOTR win immediately awards exactly one random released-set standard booster', () => {
  const p = createProfile('cm-punk');
  const run = winTournament(p);
  const released = playerReleasedCollectibleSetIds(now);
  assert.ok(released.includes(run.rewardSetId));
  assert.equal(released.reduce((sum,setId)=>sum+boosterCreditsFor(p,setId),0),1);
  assert.equal(run.coronationSeen,false);
  markKingOfTheRingCoronationSeen(p);
  assert.equal(run.coronationSeen,true);
});

test('v0.13.85 KOTR UI keeps bracket/coronation but removes choose-one and Super Pack reward flow', () => {
  assert.match(app, /kotr-visual-bracket/);
  assert.match(app, /quarterfinal-view/);
  assert.match(app, /semifinal-view/);
  assert.match(app, /final-view/);
  assert.match(app, /CLAIM THE CROWN/);
  assert.match(app, /REIGNING KING/);
  assert.match(app, /booster awarded for winning the tournament/);
  const kotr = app.slice(app.indexOf('function renderKingOfTheRing()'), app.indexOf('function beginChampionshipRoad()'));
  assert.doesNotMatch(kotr, /data-kotr-reward-set|CHOOSE YOUR REWARD|Super Pack|SUPER PACK/);
  assert.match(css, /kotr-coronation-screen/);
  assert.match(css, /kotr-career-king/);
});
