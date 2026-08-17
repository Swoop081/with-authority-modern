import test from 'node:test';
import assert from 'node:assert/strict';
import { claimSeasonTier, tierReward, FINAL_BOSS_TIER_REWARDS } from '../js/data/seasons.js?v=0.12.69';
import { createProfile, migrateProfile, totalOwnedCopies, PROFILE_VERSION } from '../js/data/profile.js?v=0.12.69';
import { selectedEntranceId } from '../js/data/deck-builder.js?v=0.12.69';

const milestones = [5,10,15,20,25,30,40,50];

test('v0.12.55 Final Boss prestige cards are distributed across the 50-tier road',()=>{
  assert.equal(PROFILE_VERSION,27);
  assert.deepEqual(milestones.map(t=>[t,tierReward(t).cardId]),[
    [5,'the-rock-final-boss-slap'],
    [10,'the-rock-rock-bottom'],
    [15,'the-rock-belt-whip'],
    [20,'special-the-rock'],
    [25,'people-championship'],
    [30,'the-rock-people-s-elbow'],
    [40,'entrance-the-rock'],
    [50,'superstar-the-rock']
  ]);
  assert.equal(tierReward(10).label,'SIGNATURE · TRADEMARK');
  assert.equal(tierReward(20).rewardType,'special');
  assert.equal(tierReward(30).rewardType,'finisher');
  assert.equal(tierReward(40).rewardType,'entrance');
  assert.equal(tierReward(50).rewardType,'superstar');
});

test('v0.12.55 Final Boss milestones award the authored exclusive playsets and Tier 50 identity only',()=>{
  const p=createProfile('cm-punk');
  p.seasons['season-1'].xp=5000;
  for(const tier of milestones) claimSeasonTier(p,tier);

  for(const [tier,reward] of Object.entries(FINAL_BOSS_TIER_REWARDS)) {
    if(Number(tier)===50) continue;
    assert.equal(totalOwnedCopies(p,reward.cardId),reward.amount,reward.cardId);
  }
  assert.equal(p.ownedCards['entrance-the-rock']?.foil,1);
  assert.equal(p.ownedCards['superstar-the-rock']?.foil,1);
  assert.ok(p.unlockedSuperstars.includes('the-rock'));
  assert.equal(selectedEntranceId(p,'the-rock'),'entrance-amazing');
  assert.equal(p.savedDecks['the-rock'],undefined,'Tier 50 must not auto-install the complete Final Boss deck');
  assert.equal(p.universePoints,1000,'replaced milestone UP remains attached as bonus currency');
});

test('v0.12.55 profile migration backfills already-claimed Final Boss milestones',()=>{
  const p=createProfile('roman-reigns');
  p.version=26;
  p.seasons['season-1'].claimedTiers=[5,10,20,30,40];
  for(const reward of Object.values(FINAL_BOSS_TIER_REWARDS)) delete p.ownedCards[reward.cardId];
  const migrated=migrateProfile(p);
  assert.equal(totalOwnedCopies(migrated,'the-rock-final-boss-slap'),1);
  assert.equal(totalOwnedCopies(migrated,'the-rock-rock-bottom'),3);
  assert.equal(totalOwnedCopies(migrated,'special-the-rock'),1);
  assert.equal(totalOwnedCopies(migrated,'the-rock-people-s-elbow'),2);
  assert.equal(totalOwnedCopies(migrated,'entrance-the-rock'),1);
  assert.equal(migrated.unlockedSuperstars.includes('the-rock'),false);
});
