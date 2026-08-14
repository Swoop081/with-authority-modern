import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { allGameplayCards } from '../js/data/content.js';
import { canCounter } from '../js/engine/rules.js';

const byId=id=>allGameplayCards.find(c=>c.id===id);

test('v0.12.20 Leapfrog is an Agility-1 Running Aerial reversal without broad-type leakage',()=>{
  const leapfrog=byId('leapfrog');
  assert.ok(leapfrog);
  assert.deepEqual(leapfrog.requirements,{agility:1});
  assert.deepEqual(leapfrog.counterStates,['running-aerial']);
  assert.deepEqual(leapfrog.counters,[]);
  const running=allGameplayCards.find(c=>c.counterState==='running-aerial'&&!c.defensiveOnly);
  const diving=allGameplayCards.find(c=>c.counterState==='diving-aerial'&&!c.defensiveOnly);
  assert.ok(running&&diving);
  assert.equal(canCounter(running,leapfrog),true);
  assert.equal(canCounter(diving,leapfrog),false);
});

test('v0.12.20 finished Move fronts repeat Cost and Damage in large live corner tiles',()=>{
  const app=fs.readFileSync(new URL('../js/ui/app.js',import.meta.url),'utf8');
  const css=fs.readFileSync(new URL('../css/game.css',import.meta.url),'utf8');
  assert.ok(app.includes('moveFront && finishedFront ? "is-full-art-move"'));
  assert.match(css,/\.ccg-card\.is-full-art-move \.ccg-card-stats[\s\S]*display:flex!important/);
  assert.ok(css.includes('font-size:14.5cqw!important'));
  assert.ok(css.includes('font-size:4.2cqw!important'));
});

test('v0.12.20 Momentum cards use canonical four method colours and explicit full-card flames',()=>{
  const app=fs.readFileSync(new URL('../js/ui/app.js',import.meta.url),'utf8');
  const css=fs.readFileSync(new URL('../css/game.css',import.meta.url),'utf8');
  const studio=fs.readFileSync(new URL('../js/tools/card-art-studio.js',import.meta.url),'utf8');
  assert.ok(app.includes('class="momentum-flames"'));
  assert.ok(app.includes('<small>MOMENTUM</small>'));
  for(const [method,color] of Object.entries({strength:'#ff8a1f',strike:'#ef3f4e',technical:'#36c86f',agility:'#2fa8ff'})){
    assert.ok(css.includes(`--momentum-${method}:${color}`),`${method} live colour`);
    assert.ok(studio.includes(`color:"${color}"`),`${method} Studio colour`);
  }
  assert.ok(css.includes('.momentum-flames i{'));
  assert.ok(css.includes('font-size:39cqw!important'));
  assert.equal(css.slice(css.indexOf('/* v0.12.20')).includes('20vw'),false,'new Momentum typography must not use viewport-sized text');
  assert.ok(studio.includes('function drawMomentumFlame('));
});

test('v0.12.20 Card Art Studio exports larger Cost and Damage tiles',()=>{
  const studio=fs.readFileSync(new URL('../js/tools/card-art-studio.js',import.meta.url),'utf8');
  assert.ok(studio.includes('cardFont(META_STACK,14.5,850)'));
  assert.ok(studio.includes('cardFont(NUMBER_STACK,62,1000)'));
  assert.ok(studio.includes('tileW=w*.205,tileH=h*.095'));
});
