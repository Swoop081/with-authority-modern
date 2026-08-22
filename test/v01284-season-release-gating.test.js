import test from 'node:test';
import assert from 'node:assert/strict';
import { tierReward } from '../js/data/seasons.js?v=0.13.95';
import { isUnreleasedSetId, LAUNCH_LIVE_SET_IDS } from '../js/data/release.js?v=0.13.95';

test('v0.12.84 Season Road booster tiers do not surface unreleased sets before they are promoted live',()=>{
  const now = new Date(2026,7,18,12,0,0,0);
  const boosterRewards = Array.from({length:99},(_,i)=>tierReward(i+1,now)).filter(r=>r.kind==='booster');
  assert.ok(boosterRewards.length > 0);
  for (const reward of boosterRewards) {
    assert.equal(isUnreleasedSetId(reward.setId, now), false, `tier ${reward.tier} should not award unreleased set ${reward.setId}`);
    assert.ok(LAUNCH_LIVE_SET_IDS.includes(reward.setId), `tier ${reward.tier} currently stays inside the live launch pool`);
  }
});

