import test from 'node:test';
import assert from 'node:assert/strict';
import { deckIds } from '../js/data/decks.js?v=0.14.04';
import { superstars } from '../js/data/superstars.js?v=0.14.04';
import { allGameplayCards } from '../js/data/content.js?v=0.14.04';

const razor = Object.values(superstars).find(star => star.id === 'razor-ramon');
const ids = deckIds['razor-ramon'];
const byId = Object.fromEntries(allGameplayCards.map(card => [card.id, card]));

test('v0.14.02 Razor guarantees his only Technical Momentum in Lead Off 5', () => {
  const expectedLead = ['momentum-strength','momentum-strike','momentum-technical','fallaway-slam','punch'];
  assert.deepEqual(ids.slice(0, 5), expectedLead);
  assert.deepEqual(razor.leadOffIds, expectedLead);
  assert.equal(ids.filter(id => id === 'momentum-technical').length, 1);
  assert.equal(ids.slice(5).some(id => id === 'momentum-technical'), false);
});

test('v0.14.02 Razor uses a 6 Strength / 5 Strike / 1 Technical Momentum plan', () => {
  assert.equal(ids.length, 60);
  assert.equal(ids.filter(id => id === 'momentum-strength').length, 6);
  assert.equal(ids.filter(id => id === 'momentum-strike').length, 5);
  assert.equal(ids.filter(id => id === 'momentum-technical').length, 1);
  assert.equal(ids.filter(id => id.startsWith('momentum-')).length, 12);
  assert.deepEqual(razor.starterMomentum, { strength: 6, strike: 5, technical: 1 });
});

test('v0.14.02 Razor has no Technical 2+ authored card', () => {
  const maxTechnical = Math.max(0, ...ids.map(id => byId[id]?.requirements?.technical ?? 0));
  assert.equal(maxTechnical, 1);
  assert.equal(ids.includes('bulldog'), false);
  assert.equal(ids.filter(id => id === 'clothesline').length, 3);
  assert.equal(ids.filter(id => id === 'razor-ramon-abdominal-stretch').length, 3);
});
