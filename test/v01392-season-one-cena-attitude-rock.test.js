import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { allGameplayCards } from '../js/data/content.js?v=0.13.95';
import { decks } from '../js/data/decks.js?v=0.13.95';
import { sets } from '../js/data/sets.js?v=0.13.95';
import { superstars } from '../js/data/superstars.js?v=0.13.95';
import { SEASON_1_CHASE_TIER_REWARDS, SEASON_1_COMPLETION_SUPERSTAR, SEASON_START, SEASON_END, SEASON_TIER_COUNT, MAX_SEASON_XP, tierReward, claimSeasonTier, claimAllSeasonTiers } from '../js/data/seasons.js?v=0.13.95';
import { LAUNCH_LIVE_SET_IDS, LIVE_SEASON_REWARD_SET_IDS, isLaunchRosterSuperstar } from '../js/data/release.js?v=0.13.95';
import { MatchEngine } from '../js/engine/MatchEngine.js?v=0.13.95';
import { canPlaySpecial } from '../js/engine/rules.js?v=0.13.95';
import { createProfile, ownedCount } from '../js/data/profile.js?v=0.13.95';

const byId = new Map(allGameplayCards.map(card => [card.id, card]));
const starById = new Map(Object.values(superstars).map(star => [star.id, star]));
const counterCapable = card => card?.kind === 'move' && (
  (card.counters?.length ?? 0) ||
  (card.counterStates?.length ?? 0) ||
  (card.counterSubmissionTargets?.length ?? 0) ||
  (card.countersCardIds?.length ?? 0)
);

test('v0.13.92 Attitude Era replaces Chyna with The Rock — The People’s Champion', () => {
  const attitude = sets['attitude-era-series-1'];
  assert.equal(attitude.plannedSuperstarIds.length, 8);
  assert.ok(attitude.plannedSuperstarIds.includes('the-rock-attitude'));
  assert.ok(!attitude.plannedSuperstarIds.includes('chyna'));
  assert.equal(starById.get('the-rock-attitude')?.nickname, 'The People’s Champion');
  assert.equal(starById.get('the-rock-attitude')?.developmentOnly, false);
  assert.equal(starById.get('chyna')?.developmentOnly, true);
  assert.equal(starById.get('chyna')?.setId, 'parked-chyna');
  assert.equal(isLaunchRosterSuperstar(starById.get('the-rock-attitude')), true);
  assert.equal(isLaunchRosterSuperstar(starById.get('chyna')), false);
});

test('v0.13.92 Final Boss Rock is banked and John Cena is the live Season 1 chase', () => {
  const finalBoss = starById.get('the-rock');
  const cena = starById.get('john-cena');
  assert.equal(finalBoss?.developmentOnly, true);
  assert.equal(finalBoss?.setId, 'season-1-final-boss');
  assert.equal(sets['season-1-final-boss']?.lifecycleDefault, 'future');
  assert.equal(sets['season-1-final-boss']?.developmentOnly, true);
  assert.equal(cena?.developmentOnly, false);
  assert.equal(cena?.seasonExclusive, true);
  assert.equal(cena?.setId, 'season-1-last-time-is-now');
  assert.equal(SEASON_1_COMPLETION_SUPERSTAR, 'john-cena');
  assert.deepEqual(LIVE_SEASON_REWARD_SET_IDS, ['season-1-last-time-is-now']);
  assert.ok(!LAUNCH_LIVE_SET_IDS.includes('season-1-final-boss'));
  const roadCards = Object.values(SEASON_1_CHASE_TIER_REWARDS).map(reward => reward.cardId);
  assert.ok(roadCards.every(id => !String(id).startsWith('the-rock-') && id !== 'superstar-the-rock' && id !== 'special-the-rock' && id !== 'entrance-the-rock'));
  assert.deepEqual(tierReward(50), {
    tier: 50,
    kind: 'season-card',
    exclusive: true,
    cardId: 'superstar-john-cena',
    name: 'John Cena — The Last Time Is Now',
    amount: 1,
    rewardType: 'superstar',
    label: 'RUBY SUPERSTAR',
    printingTier: 'ruby',
    superstarId: 'john-cena'
  });
});

test('v0.13.92 Season 1 is a 50-tier chase lasting exactly 30 days', () => {
  assert.equal(SEASON_TIER_COUNT, 50);
  assert.equal(MAX_SEASON_XP, 5000);
  assert.equal(new Date(SEASON_END).getTime() - new Date(SEASON_START).getTime(), 30 * 24 * 60 * 60 * 1000);
});

test('v0.13.92 Season 1 awards five Normal copies of every Cena-exclusive Move', () => {
  const moveIds = [
    'john-cena-protobomb',
    'john-cena-five-knuckle-shuffle',
    'john-cena-stf',
    'john-cena-attitude-adjustment'
  ];
  for (const id of moveIds) {
    const rewards = Object.entries(SEASON_1_CHASE_TIER_REWARDS)
      .filter(([, reward]) => reward.cardId === id)
      .map(([tier, reward]) => ({ tier: Number(tier), ...reward }));
    assert.equal(rewards.length, 5, id);
    assert.ok(rewards.every(reward => reward.amount === 1), `${id} is awarded one copy at a time`);
    assert.ok(rewards.every(reward => !reward.printingTier || reward.printingTier === 'normal'), `${id} rewards remain Normal`);
  }
});

test('v0.13.92 completing all 50 tiers leaves a full five-copy Cena Move playset', () => {
  const p = createProfile('cm-punk');
  p.seasons['season-1'].xp = 5000;
  const rewards = claimAllSeasonTiers(p, new Date('2026-08-22T12:00:00'));
  assert.equal(rewards.length, 50);
  for (const id of [
    'john-cena-protobomb',
    'john-cena-five-knuckle-shuffle',
    'john-cena-stf',
    'john-cena-attitude-adjustment'
  ]) assert.equal(ownedCount(p, id, 'normal'), 5, id);
  assert.equal(ownedCount(p, 'entrance-john-cena', 'ruby'), 1);
  assert.equal(ownedCount(p, 'superstar-john-cena', 'ruby'), 1);
  assert.ok(p.unlockedSuperstars.includes('john-cena'));
});

test('v0.13.92 Rock and Cena each have complete 60-page authored decks', () => {
  for (const id of ['the-rock-attitude', 'john-cena']) {
    const deck = decks[id];
    assert.equal(deck.length, 60, id);
    assert.equal(deck.filter(card => card.kind === 'momentum').length, 12, `${id} Momentum`);
    assert.ok(deck.every(Boolean), `${id} contains only resolved cards`);
  }
  for (const id of ['the-rock-attitude', 'john-cena']) {
    const count = decks[id].filter(counterCapable).length;
    assert.ok(count >= 7 && count <= 10, `${id} counter density ${count}`);
  }
});

test('v0.13.92 Know Your Role is a real one-use Superstar Action and tutors Rock Bottom/People’s Elbow', () => {
  const rock = starById.get('the-rock-attitude');
  const opponent = starById.get('stone-cold-steve-austin');
  const action = byId.get('special-the-rock-attitude');
  const rockBottom = byId.get('the-rock-attitude-rock-bottom');
  assert.equal(action?.kind, 'action');
  assert.equal(action?.special?.type, 'knowYourRole');
  const game = new MatchEngine({ p1: rock, p2: opponent, decks, rng: () => 0.99 });
  const state = game.state();
  const p = state.players.p1;
  state.phase = 'ACTION';
  state.playerInControl = 'p1';
  p.turn = { momentumPlayed: 0, momentumPlayLimit: 1, actionPlayed: 0, supportPlayed: 0, specialPlayed: 0 };
  p.momentum = { strength: 5, strike: 5, technical: 2, agility: 0, attitude: 0 };
  p.hand = [action];
  p.deck = [rockBottom, ...p.deck.filter(card => card.id !== rockBottom.id && card.id !== action.id)];
  assert.equal(canPlaySpecial(state, 'p1', action), true);
  assert.equal(game.playSpecial('p1', action), true);
  assert.ok(p.hand.some(card => card.id === rockBottom.id));
  assert.equal(p.namedDiscount['Rock Bottom'], 1);
  assert.ok(p.usedSpecialIds.includes(action.id));
});


test('v0.13.92 Cena prestige milestones grant Ruby printings without overwriting the numeric Season tier', () => {
  const p = createProfile('cm-punk');
  p.seasons['season-1'].xp = 5000;

  const entranceReward = claimSeasonTier(p, 48);
  assert.equal(entranceReward.tier, 48);
  assert.equal(entranceReward.printingTier, 'ruby');
  assert.equal(ownedCount(p, 'entrance-john-cena', 'ruby'), 1);
  assert.equal(ownedCount(p, 'entrance-john-cena', 'normal'), 0);

  const superstarReward = claimSeasonTier(p, 50);
  assert.equal(superstarReward.tier, 50);
  assert.equal(superstarReward.printingTier, 'ruby');
  assert.equal(ownedCount(p, 'superstar-john-cena', 'ruby'), 1);
  assert.equal(ownedCount(p, 'superstar-john-cena', 'normal'), 0);
  assert.ok(p.unlockedSuperstars.includes('john-cena'));
});

test.skip('v0.13.92 Golden and Attitude card-corner logos use the corrected assets/layout — superseded by v0.13.95 flat asset paths', () => {
  const goldenLogo = fs.readFileSync(new URL('../assets/images/branding-golden-era-series-1-wwf-classic-block-card.svg', import.meta.url), 'utf8');
  const studio = fs.readFileSync(new URL('../js/tools/card-art-studio.js', import.meta.url), 'utf8');
  const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
  assert.doesNotMatch(goldenLogo, /GOLDEN ERA|<text\b/i);
  assert.match(studio, /"golden-era-series-1":"assets\/branding\/golden-era-series-1\/wwf-classic-block-card\.svg"/);
  assert.match(app, /"golden-era-series-1": assetUrl\("assets\/branding\/golden-era-series-1\/wwf-classic-block-card\.svg"\)/);
  assert.match(studio, /"attitude-era-series-1":"assets\/branding\/attitude-era-series-1\/wwf-scratch-logo-card\.png"/);
  assert.match(app, /"attitude-era-series-1": assetUrl\("assets\/branding\/attitude-era-series-1\/wwf-scratch-logo-card\.png"\)/);
  assert.match(studio, /else if\(isAttitude\)\{cx=w\*\.82;cy=h\*\.10;maxW=w\*\.36;maxH=h\*\.18;\}/);
});
