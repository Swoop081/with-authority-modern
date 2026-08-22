import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { collectionCards } from '../js/data/collection.js?v=0.14.04';
import { buildPlayableDeck } from '../js/data/deck-assistant.js?v=0.14.04';
import { CARD_TIERS } from '../js/data/variants.js?v=0.14.04';
import {
  STARTER_CHOICES,
  WELCOME_SUPERSTAR_SET_IDS,
  createProfile,
  claimWelcomeSuperstar,
  welcomeSuperstarState,
  addOwnedCard,
  ownedCount,
  cardOwnershipCap
} from '../js/data/profile.js?v=0.14.04';
import { superstars } from '../js/data/superstars.js?v=0.14.04';

const byId = new Map(collectionCards.map(card => [card.id, card]));

test('v0.13.87 fresh starter choice remains CM Punk or Roman Reigns and every owned starter printing is Normal', () => {
  assert.deepEqual(STARTER_CHOICES, ['cm-punk','roman-reigns']);
  for (const sid of STARTER_CHOICES) {
    const p = createProfile(sid);
    assert.equal(buildPlayableDeck(p, sid).length, 60, sid);
    for (const [id, tiers] of Object.entries(p.ownedCards)) {
      assert.ok((tiers.normal ?? 0) <= 5, `${sid}:${id} Normal ownership exceeds five`);
      assert.equal(tiers.emerald ?? 0, 0, `${sid}:${id} Emerald starter grant`);
      assert.equal(tiers.sapphire ?? 0, 0, `${sid}:${id} Sapphire starter grant`);
      assert.equal(tiers.ruby ?? 0, 0, `${sid}:${id} Ruby starter grant`);
    }
    assert.ok(p.savedDecks[sid].every(entry => entry.tier === 'normal'));
  }
});

test('v0.13.87 every card type uses an independent five-copy cap per tier and copy six overflows', () => {
  const fixtures = [
    collectionCards.find(card => card.kind === 'move'),
    collectionCards.find(card => card.kind === 'superstar'),
    collectionCards.find(card => card.kind === 'entrance'),
    collectionCards.find(card => card.kind === 'manager'),
    collectionCards.find(card => card.kind === 'momentum')
  ].filter(Boolean);
  assert.ok(fixtures.length >= 4);
  for (const card of fixtures) {
    assert.equal(cardOwnershipCap(card), 5, `${card.kind}:${card.id}`);
    const p = createProfile('cm-punk');
    p.ownedCards[card.id] = { normal: 0, emerald: 0, sapphire: 0, ruby: 0 };
    for (const tier of CARD_TIERS) {
      const five = addOwnedCard(p, card.id, { tier, amount: 5 });
      assert.equal(five.added, 5, `${card.id}:${tier}`);
      const sixth = addOwnedCard(p, card.id, { tier, amount: 1 });
      assert.equal(sixth.added, 0, `${card.id}:${tier}:sixth added`);
      assert.equal(sixth.overflowed, 1, `${card.id}:${tier}:sixth overflow`);
      assert.equal(ownedCount(p, card.id, tier), 5);
    }
  }
});

test.skip('v0.13.87 Welcome reward offers exactly Evolution, Golden Era, Attitude Era and New Generation — superseded by v0.13.89', () => {
  assert.deepEqual(WELCOME_SUPERSTAR_SET_IDS, [
    'evolution-series-1',
    'golden-era-series-1',
    'attitude-era-series-1',
    'new-generation-series-1'
  ]);
});

test('v0.13.87 Welcome choice grants exactly one random Normal Superstar from the chosen set and is one-time', () => {
  for (const setId of WELCOME_SUPERSTAR_SET_IDS) {
    const p = createProfile('cm-punk');
    const unlockedBefore = new Set(p.unlockedSuperstars);
    const result = claimWelcomeSuperstar(p, setId, () => 0);
    const star = Object.values(superstars).find(s => s.id === result.superstarId);
    assert.ok(star);
    assert.equal(star.setId, setId);
    assert.equal(ownedCount(p, `superstar-${star.id}`, 'normal'), 1);
    assert.equal(ownedCount(p, `superstar-${star.id}`, 'emerald'), 0);
    assert.equal(ownedCount(p, `superstar-${star.id}`, 'sapphire'), 0);
    assert.equal(ownedCount(p, `superstar-${star.id}`, 'ruby'), 0);
    assert.equal(p.unlockedSuperstars.length, unlockedBefore.size + 1);
    assert.equal(welcomeSuperstarState(p).claimed, true);
    const second = claimWelcomeSuperstar(p, WELCOME_SUPERSTAR_SET_IDS.at(-1), () => 0.99);
    assert.equal(second.alreadyClaimed, true);
    assert.equal(second.superstarId, result.superstarId);
    assert.equal(p.unlockedSuperstars.length, unlockedBefore.size + 1);
  }
});

test.skip('v0.13.87 onboarding UI copy — superseded by v0.13.89 full-deck Welcome flow', () => {
  const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
  assert.match(app, /screen = "welcome-superstar"/);
  assert.match(app, /ONE-TIME WELCOME REWARD/);
  assert.match(app, /1 RANDOM SUPERSTAR/);
  assert.match(app, /Your random Superstar joins your Collection as a Normal printing/);
});
