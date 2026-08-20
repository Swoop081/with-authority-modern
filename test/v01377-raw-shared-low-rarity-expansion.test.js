import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { allGameplayCards } from '../js/data/content.js?v=0.13.81';
import { collectionCards } from '../js/data/collection.js?v=0.13.81';
import { decks } from '../js/data/decks.js?v=0.13.81';
import { boosterEligible } from '../js/data/boosters.js?v=0.13.81';
import { CARD_NUMBER_BY_ID, CARD_IDS_BY_SET } from '../js/data/card-number-manifest.js?v=0.13.81';

const expected = [
  ['snapmare','Snapmare',72,1,2,3,'technical',{technical:1},'grapple','front-control'],
  ['scoop-slam','Scoop Slam',73,1,3,5,'strength',{strength:1},'grapple','body-elevated'],
  ['chop-block','Chop Block',74,1,2,3,'strike',{strike:1},'strike','leg-extended'],
  ['spinning-backfist','Spinning Backfist',75,1,3,5,'strike',{strike:1},'strike','arm-extended'],
  ['single-leg-dropkick','Single-Leg Dropkick',76,1,3,5,'agility',{agility:1},'aerial','running-aerial'],
  ['back-rake','Back Rake',77,1,2,3,'strike',{strike:1},'strike','rear-control'],
  ['arm-wrench','Arm Wrench',78,1,2,2,'technical',{technical:1},'grapple','arm-extended'],
  ['knee-lift','Knee Lift',79,1,3,5,'strike',{strike:1},'strike','front-control'],
  ['t-bone-suplex','T-Bone Suplex',80,2,4,7,'strength',{strength:2},'grapple','body-elevated'],
  ['gutwrench-suplex','Gutwrench Suplex',81,2,4,7,'strength',{strength:2},'grapple','torso-trapped'],
  ['michinoku-driver','Michinoku Driver',82,2,5,8,'technical',{technical:2},'grapple','body-elevated'],
  ['pumphandle-slam','Pumphandle Slam',83,2,5,8,'strength',{strength:2},'grapple','torso-trapped'],
  ['bicycle-kick','Bicycle Kick',84,2,4,7,'strike',{strike:2},'strike','leg-extended'],
  ['rolling-elbow','Rolling Elbow',85,2,4,7,'strike',{strike:2},'strike','arm-extended'],
  ['springboard-forearm','Springboard Forearm',86,2,4,7,'agility',{agility:2},'aerial','running-aerial'],
  ['dragon-sleeper','Dragon Sleeper',87,2,4,0,'technical',{technical:2},'submission','rear-control'],
  ['camel-clutch','Camel Clutch',88,2,4,0,'strength',{strength:2},'submission','rear-control'],
  ['slingshot-suplex','Slingshot Suplex',89,2,4,7,'technical',{technical:2},'grapple','body-elevated'],
];
const byId = new Map(allGameplayCards.map(card => [card.id, card]));

test('v0.13.77 adds RAW1-072 through RAW1-089 as the approved shared booster-only block', () => {
  for (const [id,name,num,rarity,cost,damage,method,requirements,moveType,counterState] of expected) {
    const card = byId.get(id);
    assert.ok(card,id);
    assert.equal(card.name,name,id);
    assert.equal(card.setId,'raw-series-1',id);
    assert.equal(card.superstarId,null,id);
    assert.equal(card.boosterOnly,true,id);
    assert.equal(card.rarity,rarity,id);
    assert.equal(card.cost,cost,id);
    assert.equal(card.damage,damage,id);
    assert.equal(card.method,method,id);
    assert.deepEqual(card.requirements,requirements,id);
    assert.equal(card.moveType,moveType,id);
    assert.equal(card.counterState,counterState,id);
    assert.equal(CARD_NUMBER_BY_ID[id]?.cardCode,`RAW1-${String(num).padStart(3,'0')}`,id);
    assert.equal(boosterEligible(card),true,`${id} is live in RAW boosters`);
    const inRecommended=Object.entries(decks).filter(([,deck])=>deck.some(c=>c.id===id)).map(([sid])=>sid);
    if(id==='back-rake') assert.deepEqual(inRecommended,['doink-the-clown'],'Back Rake is the approved Doink blueprint exception while remaining booster-acquired');
    else assert.deepEqual(inRecommended,[],`${id} stays out of authored recommended decks`);
  }
  assert.equal(CARD_IDS_BY_SET['raw-series-1'].length,89);
  assert.equal(collectionCards.filter(c=>c.setId==='raw-series-1').length,89);
});

test('v0.13.77 RAW low-rarity distribution is 14 Commons and 19 Uncommons', () => {
  const raw = allGameplayCards.filter(c=>c.setId==='raw-series-1');
  assert.equal(raw.filter(c=>c.rarity===1).length,14);
  assert.equal(raw.filter(c=>c.rarity===2).length,19);
});

test('v0.13.77 persistent damage and submission posture details match the approved cards', () => {
  assert.deepEqual(byId.get('chop-block').bodyDamage,{bodyPart:'legs',pressure:1});
  assert.deepEqual(byId.get('back-rake').bodyDamage,{bodyPart:'back',pressure:1});
  assert.deepEqual(byId.get('arm-wrench').bodyDamage,{bodyPart:'arms',pressure:1});
  const dragon=byId.get('dragon-sleeper');
  assert.equal(dragon.standingOnly,true);
  assert.equal(dragon.groundedOnly,false);
  assert.deepEqual(dragon.submission,{bodyPart:'head',pressure:4});
  const camel=byId.get('camel-clutch');
  assert.equal(camel.groundedOnly,true);
  assert.deepEqual(camel.submission,{bodyPart:'back',pressure:3});
});

test('v0.13.77 Card Art Studio database includes the complete new RAW collector block', () => {
  const studio=fs.readFileSync(new URL('../js/tools/card-art-studio-data.js',import.meta.url),'utf8');
  for (const [id,,num] of expected) {
    assert.match(studio,new RegExp(`"id":"${id}"[\\s\\S]{0,260}"cardCode":"RAW1-${String(num).padStart(3,'0')}"`),id);
  }
});
