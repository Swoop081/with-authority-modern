import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { STORE_SUPERSTAR_PRICE, DUPLICATE_UNIVERSE_POINTS, FOIL_DUPLICATE_UNIVERSE_POINTS } from '../js/data/store.js?v=0.13.9';

test('v0.13.6 long-term economy certification keeps economy values locked while the simulator can follow the release calendar',()=>{
  assert.equal(STORE_SUPERSTAR_PRICE,2500);
  assert.equal(DUPLICATE_UNIVERSE_POINTS,10);
  assert.equal(FOIL_DUPLICATE_UNIVERSE_POINTS,20);
  const sim=fs.readFileSync(new URL('../tools/long-term-economy-sim.mjs',import.meta.url),'utf8');
  assert.match(sim,/casual:/);
  assert.match(sim,/regular:/);
  assert.match(sim,/heavy:/);
  assert.match(sim,/\[7,30,60,90\]/);
  assert.match(sim,/release-calendar economy model/);
});
