import test from 'node:test';
import assert from 'node:assert/strict';
import { allGameplayCards } from '../js/data/content.js?v=0.14.00';
import { decks } from '../js/data/decks.js?v=0.14.00';
import { superstars } from '../js/data/superstars.js?v=0.14.00';
import { CARD_NUMBER_BY_ID } from '../js/data/card-number-manifest.js?v=0.14.00';
import { createProfile, migrateProfile } from '../js/data/profile.js?v=0.14.00';

const byId = Object.fromEntries(allGameplayCards.map(card => [card.id, card]));

test('v0.13.99 Attitude Rock uses Rock Bottom as Finisher and People’s Elbow as Trademark', () => {
  const rockBottom = byId['the-rock-attitude-rock-bottom'];
  const elbow = byId['the-rock-attitude-people-s-elbow'];

  assert.equal(rockBottom.rarity, 4);
  assert.equal(rockBottom.finisher, true);
  assert.equal(rockBottom.trademark, undefined);
  assert.equal(rockBottom.cost, 10);
  assert.equal(rockBottom.damage, 17);
  assert.deepEqual(rockBottom.requirements, {});
  assert.equal(rockBottom.method, null);
  assert.equal(rockBottom.groundOpponent, true);

  assert.equal(elbow.rarity, 3);
  assert.equal(elbow.trademark, true);
  assert.equal(elbow.finisher, undefined);
  assert.equal(elbow.cost, 7);
  assert.equal(elbow.damage, 12);
  assert.deepEqual(elbow.requirements, { strike: 2 });
  assert.equal(elbow.method, 'strike');
  assert.equal(elbow.groundedOnly, true);
  assert.deepEqual(elbow.effects, [{ type: 'search', name: 'Rock Bottom', discount: 2 }]);
});

test('v0.13.99 AE1-060 becomes Lay The Smack Down and Rock keeps shared Samoan Drop', () => {
  const smack = byId['the-rock-attitude-lay-the-smack-down'];
  assert.ok(smack);
  assert.equal(byId['the-rock-attitude-samoan-drop'], undefined);
  assert.equal(CARD_NUMBER_BY_ID['the-rock-attitude-lay-the-smack-down'].cardCode, 'AE1-060');
  assert.equal(smack.rarity, 3);
  assert.equal(smack.cost, 4);
  assert.equal(smack.damage, 7);
  assert.equal(smack.method, 'strike');
  assert.deepEqual(smack.requirements, { strike: 2 });
  assert.deepEqual(smack.effects, [{ type: 'loseOpponentAdrenaline', amount: 1 }]);

  const rockDeck = decks['the-rock-attitude'];
  assert.equal(rockDeck.filter(card => card.id === 'the-rock-attitude-lay-the-smack-down').length, 3);
  assert.equal(rockDeck.filter(card => card.id === 'samoan-drop').length, 2);
  assert.equal(rockDeck.some(card => card.id === 'the-rock-attitude-samoan-drop'), false);
  assert.equal(rockDeck.length, 60);
});

test('v0.13.99 Rock signature metadata still points at the new finisher/trademark package', () => {
  const rock = superstars.theRockAttitude;
  assert.ok(rock.signatures.includes('the-rock-attitude-rock-bottom'));
  assert.ok(rock.signatures.includes('the-rock-attitude-people-s-elbow'));
  assert.equal(rock.signatures.includes('the-rock-attitude-samoan-drop'), false);
});

test('v0.13.99 migrates retired Attitude Rock Samoan Drop ownership and saved decks', () => {
  const p = createProfile('cm-punk');
  p.ownedCards['the-rock-attitude-samoan-drop'] = { normal: 2, emerald: 1, sapphire: 1, ruby: 1 };
  p.savedDecks['the-rock-attitude'] = [
    { id: 'the-rock-attitude-samoan-drop', tier: 'normal' },
    { id: 'the-rock-attitude-samoan-drop', tier: 'emerald' },
    { id: 'the-rock-attitude-samoan-drop', tier: 'sapphire' },
    { id: 'the-rock-attitude-samoan-drop', tier: 'ruby' },
  ];
  const migrated = migrateProfile(p);
  assert.equal(migrated.ownedCards['the-rock-attitude-samoan-drop'], undefined);
  assert.deepEqual(migrated.ownedCards['the-rock-attitude-lay-the-smack-down'], { normal: 2, emerald: 1, sapphire: 1, ruby: 1 });
  assert.deepEqual(migrated.savedDecks['the-rock-attitude'].map(entry => entry.id), Array(4).fill('the-rock-attitude-lay-the-smack-down'));
});
