import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createProfile, addOwnedCard, migrateProfile } from '../js/data/profile.js?v=0.13.90';
import { cardsForSet } from '../js/data/collection.js?v=0.13.90';
import { boosterCreditsFor } from '../js/data/boosters.js?v=0.13.90';
import { playerReleasedCollectibleSetIds } from '../js/data/release.js?v=0.13.90';
import { superstars } from '../js/data/superstars.js?v=0.13.90';
import { startLadderRun, recordLadderMatch, LADDER_LENGTH } from '../js/data/ladder.js?v=0.13.90';
import { startChampionshipRoad, recordChampionshipMatch } from '../js/data/championship-road.js?v=0.13.90';
import { activeLiveEventTowers, startLiveEventTower, recordLiveEventTowerMatch, LIVE_EVENT_LENGTH } from '../js/data/live-events.js?v=0.13.90';
import { startKingOfTheRing, recordKingOfTheRingMatch } from '../js/data/king-of-the-ring.js?v=0.13.90';
import { challengeState, claimChallenge } from '../js/data/challenges.js?v=0.13.90';
import { seasonState } from '../js/data/seasons.js?v=0.13.90';
import { collectionProgress, claimMilestone, COLLECTION_MILESTONES, FOIL_MILESTONES } from '../js/data/set-progression.js?v=0.13.90';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const boosters = fs.readFileSync(new URL('../js/data/boosters.js', import.meta.url), 'utf8');
const ids = Object.values(superstars).filter(s=>!s.developmentOnly).map(s=>s.id);
const fixedRng = () => 0.314159;
const now = new Date(2026,7,21,12,0,0);
const released = playerReleasedCollectibleSetIds(now);
const totalCredits = p => released.reduce((sum,setId)=>sum+boosterCreditsFor(p,setId),0);

test('v0.13.85 removes live Super Pack APIs and uses milestone/completion standard boosters',()=>{
  assert.doesNotMatch(boosters,/SUPER_PACK|superPack|grantSuperPack|openSuperPack/);
  assert.doesNotMatch(app,/Super Pack|SUPER PACK|grantVictoryBooster/);
  assert.match(app,/exhibitionWins % 5 === 0/);
  assert.match(app,/grantRandomBoosters\(profile, 1/);
});

test('v0.13.85 Money in the Bank awards exactly two random packs only after all eight wins',()=>{
  const p=createProfile('cm-punk');
  startLadderRun(p,'cm-punk',ids,fixedRng,'daily',now);
  for(let i=0;i<LADDER_LENGTH-1;i++){
    const outcome=recordLadderMatch(p,'win',now,fixedRng);
    assert.equal(outcome.status,'advance');
    assert.equal(totalCredits(p),0);
  }
  const final=recordLadderMatch(p,'win',now,fixedRng);
  assert.equal(final.status,'cleared');
  assert.equal(final.packCount,2);
  assert.equal(totalCredits(p),2);
});

test('v0.13.85 Championship Road awards one themed pack at each four-match block',()=>{
  const p=createProfile('cm-punk');
  startChampionshipRoad(p,'cm-punk',[],fixedRng,'easy');
  for(let i=0;i<3;i++){
    const outcome=recordChampionshipMatch(p,'win');
    assert.equal(outcome.packAwarded,false);
  }
  const checkpoint=recordChampionshipMatch(p,'win');
  assert.equal(checkpoint.packAwarded,true);
  assert.ok(checkpoint.sectionCleared);
  assert.equal(boosterCreditsFor(p,checkpoint.packSetId),1);
});

test('v0.13.85 Live Events award one random pack only when all five matches are cleared',()=>{
  const p=createProfile('cm-punk');
  const tower=activeLiveEventTowers(now,p)[0];
  startLiveEventTower(p,tower.key,'cm-punk',ids,fixedRng,now);
  for(let i=0;i<LIVE_EVENT_LENGTH-1;i++){
    const outcome=recordLiveEventTowerMatch(p,tower.key,'win',now,fixedRng);
    assert.equal(outcome.status,'advance');
    assert.equal(totalCredits(p),0);
  }
  const final=recordLiveEventTowerMatch(p,tower.key,'win',now,fixedRng);
  assert.equal(final.status,'cleared');
  assert.equal(final.packCount,1);
  assert.equal(totalCredits(p),1);
});

test('v0.13.85 King of the Ring awards one random pack only on tournament victory',()=>{
  const p=createProfile('cm-punk');
  startKingOfTheRing(p,'cm-punk',ids,fixedRng);
  assert.equal(recordKingOfTheRingMatch(p,'win',fixedRng,now).status,'advance');
  assert.equal(totalCredits(p),0);
  assert.equal(recordKingOfTheRingMatch(p,'win',fixedRng,now).status,'advance');
  assert.equal(totalCredits(p),0);
  const final=recordKingOfTheRingMatch(p,'win',fixedRng,now);
  assert.equal(final.status,'cleared');
  assert.equal(totalCredits(p),1);
});

test('v0.13.85 Daily Challenges pay 10 XP only; Weekly Challenges pay 25 XP plus one random pack',()=>{
  const daily=createProfile('cm-punk');
  const dailyChallenge=challengeState(daily,now).daily[0];
  dailyChallenge.progress=dailyChallenge.target;
  const dailyReward=claimChallenge(daily,dailyChallenge.id,now,fixedRng);
  assert.equal(dailyReward.xp,10);
  assert.equal(dailyReward.packs,0);
  assert.equal(totalCredits(daily),0);
  assert.equal(seasonState(daily).xp,10);

  const weekly=createProfile('cm-punk');
  const weeklyChallenge=challengeState(weekly,now).weekly[0];
  weeklyChallenge.progress=weeklyChallenge.target;
  const weeklyReward=claimChallenge(weekly,weeklyChallenge.id,now,fixedRng);
  assert.equal(weeklyReward.xp,25);
  assert.equal(weeklyReward.packs,1);
  assert.equal(totalCredits(weekly),1);
  assert.equal(seasonState(weekly).xp,25);
});

test('v0.13.85 Collection and Foil milestones each pay one random pack at 25/50/75/100',()=>{
  assert.deepEqual(COLLECTION_MILESTONES.map(m=>[m.percent,m.reward]),[[25,1],[50,1],[75,1],[100,1]]);
  assert.deepEqual(FOIL_MILESTONES.map(m=>[m.percent,m.reward]),[[25,1],[50,1],[75,1],[100,1]]);
  const p=createProfile('cm-punk'), setId='summerslam-series-1';
  for(const card of cardsForSet(setId)){
    if(collectionProgress(p,setId).percent>=25) break;
    addOwnedCard(p,card.id,{amount:1});
  }
  const before=totalCredits(p);
  const reward=claimMilestone(p,'collection',25,setId,now,fixedRng);
  assert.equal(reward.packs,1);
  assert.equal(totalCredits(p),before+1);
});

test.skip('v0.13.85 migrates unopened legacy Super Pack credits into same-set standard packs',()=>{
  const p=createProfile('cm-punk');
  p.version=32;
  p.superPackCreditsBySet={'summerslam-series-1':2,'raw-series-1':1};
  p.boosterCreditsBySet={...(p.boosterCreditsBySet??{}),'summerslam-series-1':1};
  const migrated=migrateProfile(p);
  assert.equal(migrated.version,34);
  assert.equal(migrated.superPackCreditsBySet,undefined);
  assert.equal(boosterCreditsFor(migrated,'summerslam-series-1'),3);
  assert.equal(boosterCreditsFor(migrated,'raw-series-1'),1);
});
