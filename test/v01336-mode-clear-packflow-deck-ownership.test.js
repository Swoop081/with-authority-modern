import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createProfile, grantSuperstarUnlockPackage } from '../js/data/profile.js?v=0.13.95';
import { collectionCards } from '../js/data/collection.js?v=0.13.95';
import { buildBestOwnedRecommendedDraft, enforceOwnedDraft, recommendedDeckDraft, validateDeckDraft, ownedTotal, cardEligibilityForSuperstar } from '../js/data/deck-builder.js?v=0.13.95';
import { superstars } from '../js/data/superstars.js?v=0.13.95';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const rules = fs.readFileSync(new URL('../js/data/game-rules.js', import.meta.url), 'utf8');

function countDraft(draft = []) {
  const counts = new Map();
  for (const raw of draft) {
    const id = raw?.id ?? raw;
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return counts;
}

test('v0.13.85 structured modes use milestone/completion standard packs and no Super Packs', () => {
  assert.doesNotMatch(app, /grantVictoryBooster|SUPER PACK|Super Pack/);
  assert.match(app, /2 random released-set boosters have been awarded/);
  assert.match(app, /One random released-set booster has been awarded/);
  assert.match(app, /Final 4-match block complete/);
  assert.match(rules, /Pack rewards are tied to mode milestones and completion/i);
  assert.doesNotMatch(rules, /Super Packs/);
});

test('v0.13.85 standard pack final-card reveal uses the explicit next/summary action path', () => {
  assert.match(app, /flipAttr:`data-booster-next="\$\{boosterFocusIndex\}"`/);
  assert.match(app, /boosterFocusIndex===pulls\.length-1\?'TAP CARD · PACK SUMMARY'/);
  assert.match(app, /else \{\s*preparePackSummary\(\);\s*\}/);
});

test('v0.13.36 automatic Deck Lab builders cannot emit more copies than the player owns', () => {
  const profile = createProfile('cm-punk');
  grantSuperstarUnlockPackage(profile, 'roman-reigns', { celebrate: false });
  const roman = Object.values(superstars).find(star => star.id === 'roman-reigns');
  assert.ok(roman);

  const guardedBlueprint = enforceOwnedDraft(profile, 'roman-reigns', recommendedDeckDraft('roman-reigns'));
  const bestOwned = buildBestOwnedRecommendedDraft(profile, 'roman-reigns');
  for (const draft of [guardedBlueprint, bestOwned]) {
    for (const [id, count] of countDraft(draft)) {
      assert.ok(count <= ownedTotal(profile, id), `${id}: ${count} used > ${ownedTotal(profile, id)} owned`);
    }
  }

  const unowned = collectionCards.find(card =>
    !['superstar','entrance'].includes(card.kind) &&
    ownedTotal(profile, card.id) === 0 &&
    cardEligibilityForSuperstar(roman, card).legal
  );
  assert.ok(unowned, 'expected at least one legal unowned Roman card');
  const invalid = [...bestOwned];
  if (invalid.length) invalid[0] = { id: unowned.id, foil: false };
  else invalid.push({ id: unowned.id, foil: false });
  const check = validateDeckDraft(profile, 'roman-reigns', invalid);
  assert.ok(check.violations.some(text => text.includes(unowned.name) && text.includes('Collection owns 0')), check.violations.join('\n'));
});
