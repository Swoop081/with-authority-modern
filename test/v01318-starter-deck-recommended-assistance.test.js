import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createProfile, grantSuperstarUnlockPackage, addOwnedCard, totalOwnedCopies, migrateProfile
} from '../js/data/profile.js?v=0.13.18';
import { decks } from '../js/data/decks.js?v=0.13.18';
import { collectionCards } from '../js/data/collection.js?v=0.13.18';
import {
  validateDeckDraft, selectedEntranceId, recommendedDeckComparison, recommendedDeckDraft
} from '../js/data/deck-builder.js?v=0.13.18';
import { findPackUpgrades, applyUpgrade } from '../js/data/deck-assistant.js?v=0.13.18';

const sid = 'kevin-owens';
const idCount = (draft,id) => draft.filter(entry => (entry.id ?? entry) === id).length;

test('v0.13.18 secondary Superstar unlock grants a legal starter, not the complete recommended chase deck', () => {
  const profile = createProfile('roman-reigns');
  const unlock = grantSuperstarUnlockPackage(profile, sid, { celebrate:false });
  const draft = profile.savedDecks[sid];
  assert.equal(draft.length, 60);
  assert.equal(validateDeckDraft(profile, sid, draft, selectedEntranceId(profile,sid)).healthy, true);
  assert.equal(selectedEntranceId(profile,sid), 'entrance-amazing');
  assert.equal(totalOwnedCopies(profile,'entrance-kevin-owens'), 0);
  assert.ok(unlock.missing > 0, 'starter should still have recommended-build chase slots');

  const signatureExpectations = [
    ['pop-up-powerbomb',3],
    ['kevin-owens-package-piledriver',2],
    ['kevin-owens-stunner',2],
    ['special-kevin-owens',1]
  ];
  for (const [id,recommended] of signatureExpectations) {
    assert.equal(totalOwnedCopies(profile,id),1,`${id} should receive one identity copy`);
    assert.equal(idCount(draft,id),1,`${id} starter should use that one owned copy`);
    assert.equal(decks[sid].filter(card=>card.id===id).length,recommended);
  }
});

test('v0.13.18 recommended comparison identifies collection replacements and missing authored slots', () => {
  const profile = createProfile('roman-reigns');
  grantSuperstarUnlockPackage(profile, sid, { celebrate:false });
  const comparison = recommendedDeckComparison(profile,sid,profile.savedDecks[sid]);
  assert.ok(comparison.matched < 60);
  assert.equal(comparison.missing, 60 - comparison.matched);
  assert.ok(comparison.missingRows.some(row => row.id === 'pop-up-powerbomb' && row.toCollect >= 1));
  assert.ok(comparison.replacements.length > 0, 'starter substitutions should be surfaced as recommendations');
});

test('v0.13.18 a newly pulled recommended signature copy replaces starter filler', () => {
  const profile = createProfile('roman-reigns');
  grantSuperstarUnlockPackage(profile, sid, { celebrate:false });
  const beforeMissing = recommendedDeckComparison(profile,sid,profile.savedDecks[sid]).missing;
  const card = decks[sid].find(card => card.id === 'pop-up-powerbomb');
  const ownershipBefore = totalOwnedCopies(profile,card.id);
  addOwnedCard(profile,card.id,{amount:1});
  const pull = { card, foil:false, ownershipBefore, universePointsValue:0 };
  const upgrade = findPackUpgrades(profile,[pull]).find(row => row.type === 'blueprint' && row.superstarId === sid && row.cardId === card.id);
  assert.ok(upgrade, 'Deck Assistance should recommend the new KO signature copy');
  assert.equal(applyUpgrade(profile,upgrade),true);
  assert.equal(idCount(profile.savedDecks[sid],card.id),2);
  assert.equal(recommendedDeckComparison(profile,sid,profile.savedDecks[sid]).missing,beforeMissing-1);
});

test('v0.13.18 Kevin Owens Entrance is recommended over Amazing Entrance and can be equipped by Deck Assistance', () => {
  const profile = createProfile('roman-reigns');
  grantSuperstarUnlockPackage(profile, sid, { celebrate:false });
  const entrance = collectionCards.find(card=>card.id==='entrance-kevin-owens');
  const ownershipBefore = totalOwnedCopies(profile,entrance.id);
  addOwnedCard(profile,entrance.id,{foil:true,amount:1});
  const pull = { card:entrance, foil:true, ownershipBefore, universePointsValue:0 };
  const upgrade = findPackUpgrades(profile,[pull]).find(row=>row.type==='entrance' && row.superstarId===sid);
  assert.ok(upgrade);
  assert.equal(selectedEntranceId(profile,sid),'entrance-amazing');
  assert.equal(applyUpgrade(profile,upgrade),true);
  assert.equal(selectedEntranceId(profile,sid),entrance.id);
});

test('v0.13.18 migration never claws back a complete deck or legitimately owned old unlock cards', () => {
  const profile = createProfile('roman-reigns');
  profile.version = 29;
  profile.unlockedSuperstars.push(sid);
  profile.savedDecks[sid] = recommendedDeckDraft(sid);
  const needed = new Map();
  for (const card of decks[sid]) needed.set(card.id,(needed.get(card.id)??0)+1);
  for (const [id,count] of needed) {
    const missing = Math.max(0,count-totalOwnedCopies(profile,id));
    if (missing) addOwnedCard(profile,id,{amount:missing});
  }
  addOwnedCard(profile,`superstar-${sid}`,{foil:true});
  profile.deckNeedsCards[sid] = 0;
  const popBefore = totalOwnedCopies(profile,'pop-up-powerbomb');
  const migrated = migrateProfile(profile);
  assert.equal(totalOwnedCopies(migrated,'pop-up-powerbomb'),popBefore);
  assert.equal(migrated.savedDecks[sid].length,60);
});

test('v0.13.18 every normal released + RAW pre-release Superstar receives a legal 60-page secondary starter without their Entrance', async () => {
  const { superstars } = await import('../js/data/superstars.js?v=0.13.18');
  const scope = new Set(['summerslam-series-1','hall-of-fame-series-1','evolution-series-1','raw-series-1']);
  for (const star of Object.values(superstars).filter(item => scope.has(item.setId) && item.id !== 'the-rock')) {
    const first = star.id === 'roman-reigns' ? 'cm-punk' : 'roman-reigns';
    const profile = createProfile(first);
    grantSuperstarUnlockPackage(profile,star.id,{celebrate:false});
    const draft = profile.savedDecks[star.id];
    assert.equal(draft?.length,60,star.id);
    assert.equal(validateDeckDraft(profile,star.id,draft,selectedEntranceId(profile,star.id)).healthy,true,star.id);
    if (star.entranceId) assert.equal(totalOwnedCopies(profile,star.entranceId),0,`${star.id} Entrance remains a booster chase`);
  }
});
