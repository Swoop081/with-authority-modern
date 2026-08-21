import test from 'node:test';
import assert from 'node:assert/strict';
import { collectionCards } from '../js/data/collection.js?v=0.13.93';
import { decks } from '../js/data/decks.js?v=0.13.93';
import { createProfile, addOwnedCard, ownedCount, cardOwnershipCap } from '../js/data/profile.js?v=0.13.93';
import { applyCardTier, CARD_TIERS, DEFAULT_STARTER_TIER, TIER_PULL_WEIGHTS } from '../js/data/variants.js?v=0.13.93';
import { scaleCpuDeckToPlayer } from '../js/data/cpu-tier-scaling.js?v=0.13.93';
import { LAUNCH_LIVE_SET_IDS, BANKED_PLAYER_SET_IDS } from '../js/data/release.js?v=0.13.93';
import { activeLiveEventTowers } from '../js/data/live-events.js?v=0.13.93';
import { SEASON_1 } from '../js/data/seasons.js?v=0.13.93';
import { COLLECTION_MILESTONES, RUBY_MILESTONES } from '../js/data/set-progression.js?v=0.13.93';
import fs from 'node:fs';
import { CHAMPIONSHIP_ROAD_SECTIONS, CHAMPIONSHIP_ROAD_OPPONENTS } from '../js/data/championship-road.js?v=0.13.93';

const byId = new Map(collectionCards.map(c=>[c.id,c]));

test('v0.13.87 four tiers use Sapphire authored baseline and tier submission pressure too', () => {
  assert.deepEqual(CARD_TIERS, ['normal','emerald','sapphire','ruby']);
  const sharpshooter = byId.get('bret-hart-sharpshooter');
  assert.ok(sharpshooter?.submission);
  const normal = applyCardTier(sharpshooter,'normal');
  const emerald = applyCardTier(sharpshooter,'emerald');
  const sapphire = applyCardTier(sharpshooter,'sapphire');
  const ruby = applyCardTier(sharpshooter,'ruby');
  assert.deepEqual([normal.damage,emerald.damage,sapphire.damage,ruby.damage], [0,0,0,0]);
  assert.deepEqual([normal.submission.pressure,emerald.submission.pressure,sapphire.submission.pressure,ruby.submission.pressure], [4,5,6,7]);
});

test('v0.13.87 starter profile begins with Normal deck printings', () => {
  assert.equal(DEFAULT_STARTER_TIER,'normal');
  const p=createProfile('cm-punk');
  assert.equal(p.savedDecks['cm-punk'].length,60);
  assert.ok(p.savedDecks['cm-punk'].every(e=>e.tier==='normal'));
});

test('v0.13.87 CPU mirrors player tier by role, including Finisher and Trademark', () => {
  const player = decks['bret-hart'].map(c=>applyCardTier(c,'normal'));
  const finisherIndex=player.findIndex(c=>c.finisher);
  const trademarkIndex=player.findIndex(c=>c.trademark);
  player[finisherIndex]=applyCardTier(decks['bret-hart'][finisherIndex],'ruby');
  player[trademarkIndex]=applyCardTier(decks['bret-hart'][trademarkIndex],'sapphire');
  const cpu=scaleCpuDeckToPlayer(player,decks['shawn-michaels']);
  assert.ok(cpu.some(c=>c.finisher&&c.tier==='ruby'));
  assert.ok(cpu.some(c=>c.trademark&&c.tier==='sapphire'));
  const fullRuby=scaleCpuDeckToPlayer(decks['bret-hart'].map(c=>applyCardTier(c,'ruby')),decks['shawn-michaels']);
  assert.ok(fullRuby.every(c=>c.tier==='ruby'));
});

test('v0.13.87 live set pool is five sets with RAW banked', () => {
  assert.deepEqual(LAUNCH_LIVE_SET_IDS, ['summerslam-series-1','evolution-series-1','new-generation-series-1','golden-era-series-1','attitude-era-series-1']);
  assert.ok(BANKED_PLAYER_SET_IDS.includes('raw-series-1'));
  assert.equal(LAUNCH_LIVE_SET_IDS.includes('raw-series-1'),false);
});

test('v0.13.87 Championship Road late blocks use live New Generation rather than banked RAW', () => {
  assert.equal(CHAMPIONSHIP_ROAD_SECTIONS.at(-1).setId,'new-generation-series-1');
  assert.equal(CHAMPIONSHIP_ROAD_SECTIONS.at(-2).setId,'new-generation-series-1');
  assert.deepEqual(CHAMPIONSHIP_ROAD_OPPONENTS.slice(-8), ['bret-hart','shawn-michaels','razor-ramon','diesel','doink-the-clown','yokozuna','owen-hart','british-bulldog']);
});

test('v0.13.87 Ruby is the pack chase tier without changing intrinsic card rarity', () => {
  assert.deepEqual(TIER_PULL_WEIGHTS,{normal:.65,emerald:.25,sapphire:.08,ruby:.02});
  const card=byId.get('bret-hart-sharpshooter');
  const rarity=card.rarity;
  for(const tier of CARD_TIERS) assert.equal(applyCardTier(card,tier).rarity,rarity);
});


test('v0.13.87 submission CPU scaling remains exact-role first', () => {
  const player = decks['charlotte-flair'].map(c=>applyCardTier(c,'normal'));
  const ordinary = player.findIndex(c=>c.submission && !c.finisher && !c.trademark);
  assert.ok(ordinary >= 0, 'Charlotte needs an ordinary submission for the role-separation fixture');
  player[ordinary] = applyCardTier(decks['charlotte-flair'][ordinary],'ruby');
  const cpu = scaleCpuDeckToPlayer(player,decks['mankind']);
  const cpuFinisherSubmission = cpu.find(c=>c.finisher && c.submission);
  assert.ok(cpuFinisherSubmission);
  assert.equal(cpuFinisherSubmission.tier,'normal','a Ruby ordinary Submission must not promote a Normal player Finisher role');

  const bret = decks['bret-hart'].map(c=>applyCardTier(c,'normal'));
  const playerFinisherSubmission = bret.findIndex(c=>c.finisher && c.submission);
  assert.ok(playerFinisherSubmission >= 0);
  bret[playerFinisherSubmission] = applyCardTier(decks['bret-hart'][playerFinisherSubmission],'ruby');
  const scaled = scaleCpuDeckToPlayer(bret,decks['mankind']);
  assert.equal(scaled.find(c=>c.finisher && c.submission)?.tier,'ruby');
});

test('v0.13.87 new starter ownership is Normal-only, not merely the saved deck labels', () => {
  const p=createProfile('roman-reigns');
  const ownedIds=Object.keys(p.ownedCards);
  assert.ok(ownedIds.length > 0);
  for (const id of ownedIds) {
    assert.equal(ownedCount(p,id,'emerald'),0,id);
    assert.equal(ownedCount(p,id,'sapphire'),0,id);
    assert.equal(ownedCount(p,id,'ruby'),0,id);
  }
});

test('v0.13.87 standard cards can hold five copies independently in all four tiers', () => {
  const card=byId.get('standing-dropkick') ?? collectionCards.find(c=>c.kind==='move' && !['superstar','entrance','manager'].includes(c.kind));
  assert.ok(card);
  assert.equal(cardOwnershipCap(card),5);
  const p=createProfile('cm-punk');
  p.ownedCards[card.id]={normal:0,emerald:0,sapphire:0,ruby:0};
  for (const tier of CARD_TIERS) {
    const result=addOwnedCard(p,card.id,{tier,amount:5});
    assert.equal(result.added,5,tier);
  }
  assert.equal(CARD_TIERS.reduce((n,t)=>n+ownedCount(p,card.id,t),0),20);
});

test('v0.13.87 RAW cannot surface as an active Live Event while banked', () => {
  const p=createProfile('cm-punk');
  const tuesday=new Date('2026-08-25T12:00:00');
  const towers=activeLiveEventTowers(tuesday,p);
  assert.equal(towers.some(t=>t.event?.id==='raw-live'),false);
});

test('v0.13.87 public Season roadmap is empty and current UI does not advertise RAW live', () => {
  assert.deepEqual(SEASON_1.roadmap,[]);
  assert.deepEqual(SEASON_1.rotationPreview,[]);
  const app=fs.readFileSync(new URL('../js/ui/app.js', import.meta.url),'utf8');
  assert.equal(app.includes('SEASON 1 RELEASES'),false);
  assert.equal(app.includes('RAW IS HERE'),false);
});

test('v0.13.87 Card Art Studio marks New Generation Live and RAW Banked with no release date roadmap', () => {
  const html=fs.readFileSync(new URL('../tools/card-art-studio.html', import.meta.url),'utf8');
  assert.match(html,/New Generation — Series 1 · Live/);
  assert.match(html,/Raw — Series 1 · Banked/);
  assert.doesNotMatch(html,/Raw — Series 1 · Releases/i);
  assert.doesNotMatch(html,/New Generation — Series 1 · Releases/i);
});

test('v0.13.87 collection keeps four overall milestones and four Ruby chase milestones', () => {
  assert.deepEqual(COLLECTION_MILESTONES.map(m=>[m.percent,m.reward]),[[25,1],[50,1],[75,1],[100,1]]);
  assert.deepEqual(RUBY_MILESTONES.map(m=>[m.percent,m.reward]),[[25,1],[50,1],[75,1],[100,1]]);
});
