import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  STARTER_CHOICES,
  WELCOME_SUPERSTAR_SET_IDS,
  createProfile,
  claimWelcomeSuperstar,
  welcomeSuperstarCandidates,
  freshNormalDeckBlueprint,
  ownedCount
} from '../js/data/profile.js?v=0.14.04';
import { validateDeckDraft, selectedEntranceId } from '../js/data/deck-builder.js?v=0.14.04';
import { superstars } from '../js/data/superstars.js?v=0.14.04';

const starById = new Map(Object.values(superstars).map(star => [star.id, star]));

test('v0.13.89 Welcome choice offers all five live launch sets including SummerSlam', () => {
  assert.deepEqual(WELCOME_SUPERSTAR_SET_IDS, [
    'evolution-series-1',
    'new-generation-series-1',
    'golden-era-series-1',
    'attitude-era-series-1',
    'summerslam-series-1'
  ]);
});

test('v0.13.89 SummerSlam Welcome pool excludes the already-selected starter and contains seven candidates', () => {
  for (const starterId of STARTER_CHOICES) {
    const p = createProfile(starterId);
    const candidates = welcomeSuperstarCandidates(p, 'summerslam-series-1');
    assert.equal(candidates.length, 7, starterId);
    assert.ok(!candidates.some(star => star.id === starterId), starterId);
    assert.ok(candidates.every(star => star.setId === 'summerslam-series-1'));
  }
});

test('v0.13.89 every possible Welcome Superstar grants a complete legal 60-page Normal deck', () => {
  for (const starterId of STARTER_CHOICES) {
    const base = createProfile(starterId);
    for (const setId of WELCOME_SUPERSTAR_SET_IDS) {
      const candidates = welcomeSuperstarCandidates(base, setId);
      for (let i = 0; i < candidates.length; i += 1) {
        const p = createProfile(starterId);
        const result = claimWelcomeSuperstar(p, setId, () => (i + 0.1) / candidates.length);
        const star = starById.get(result.superstarId);
        assert.ok(star, result.superstarId);
        assert.equal(star.setId, setId);
        assert.notEqual(star.id, starterId);
        assert.equal(result.deckReady, true);
        assert.equal(ownedCount(p, `superstar-${star.id}`, 'normal'), 1);
        assert.equal(ownedCount(p, `superstar-${star.id}`, 'emerald'), 0);
        assert.equal(ownedCount(p, `superstar-${star.id}`, 'sapphire'), 0);
        assert.equal(ownedCount(p, `superstar-${star.id}`, 'ruby'), 0);
        const saved = p.savedDecks[star.id];
        assert.equal(saved.length, 60, star.id);
        assert.ok(saved.every(entry => entry.tier === 'normal'), star.id);
        const counts = new Map();
        for (const entry of saved) counts.set(entry.id, (counts.get(entry.id) ?? 0) + 1);
        assert.ok([...counts.values()].every(count => count <= 5), `${star.id}: deck exceeds five Normal copies`);
        for (const [id, count] of counts) assert.ok(ownedCount(p, id, 'normal') >= count, `${star.id}:${id}`);
        assert.equal(p.deckNeedsCards[star.id], 0);
        const health = validateDeckDraft(p, star.id, saved, selectedEntranceId(p, star.id));
        assert.equal(health.healthy, true, `${star.id}: ${health.violations.join(' | ')}`);
      }
    }
  }
});

test('v0.13.89 fresh Normal deck materializer preserves 60 pages and five-copy cap for every live Welcome set', () => {
  for (const star of Object.values(superstars)) {
    if (!WELCOME_SUPERSTAR_SET_IDS.includes(star.setId) || star.developmentOnly) continue;
    const deck = freshNormalDeckBlueprint(star.id);
    assert.equal(deck.length, 60, star.id);
    const counts = new Map();
    for (const card of deck) counts.set(card.id, (counts.get(card.id) ?? 0) + 1);
    assert.ok([...counts.values()].every(count => count <= 5), star.id);
  }
});

test('v0.13.89 Welcome UI promises a full Normal deck and five selectable live sets', () => {
  const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
  assert.match(app, /complete 60-page Normal deck/);
  assert.match(app, /1 RANDOM SUPERSTAR · FULL NORMAL DECK/);
  assert.match(app, /WELCOME_SUPERSTAR_SET_IDS\.map/);
});
