import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createProfile, migrateProfile, PROFILE_VERSION } from '../js/data/profile.js?v=0.14.04';
import { deckIds } from '../js/data/decks.js?v=0.14.04';

const desiredLead = ['momentum-strength','momentum-strike','momentum-technical','fallaway-slam','punch'];

test('v0.14.04 existing Razor saved decks receive the authored Technical Lead Off', () => {
  const p = createProfile('roman-reigns');
  p.version = 38;
  p.unlockedSuperstars.push('razor-ramon');

  // Simulate a valid pre-v0.14.04 saved Razor deck whose sole Technical
  // Momentum exists in the deck but is outside the first five pages. Use only
  // launch-safe cards so public-launch filtering cannot invalidate the fixture.
  const ids = [
    'momentum-strength','momentum-strike','fallaway-slam','punch','punch',
    'punch','punch','punch','momentum-technical',
    ...Array(51).fill('momentum-strength')
  ];
  assert.equal(ids.length, 60);
  p.savedDecks['razor-ramon'] = ids.map((id, index) => ({ id, tier: index === 8 ? 'sapphire' : 'normal' }));

  const counts = new Map();
  for (const id of ids) counts.set(id,(counts.get(id)??0)+1);
  for (const [id,count] of counts) {
    p.ownedCards[id] ??= { normal:0, emerald:0, sapphire:0, ruby:0 };
    p.ownedCards[id].normal = Math.max(p.ownedCards[id].normal ?? 0, count);
  }
  // The Technical page is Sapphire in the saved deck; make that exact printing
  // owned too so the migration can demonstrate it preserves the entry object.
  p.ownedCards['momentum-technical'].sapphire = 1;

  const migrated = migrateProfile(p);
  assert.equal(migrated.version, PROFILE_VERSION);
  assert.equal(migrated.savedDecks['razor-ramon'].length, 60);
  assert.deepEqual(migrated.savedDecks['razor-ramon'].slice(0,5).map(x=>x.id), desiredLead);
  assert.equal(migrated.savedDecks['razor-ramon'][2].tier, 'sapphire');
  assert.deepEqual([...migrated.savedDecks['razor-ramon'].map(x=>x.id)].sort(), [...ids].sort());
});

test('v0.14.04 fresh/authored Razor deck still begins with the same Lead Off', () => {
  assert.deepEqual(deckIds['razor-ramon'].slice(0,5), desiredLead);
});

test('v0.14.04 includes all tabled presentation fixes in source', () => {
  const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url),'utf8');
  const css = fs.readFileSync(new URL('../css/game.css', import.meta.url),'utf8');
  assert.match(app,/collectibleCardMarkup\(card,\{ tier:"ruby"/);
  assert.match(css,/season-one-cena-authored-collectible/);
  assert.match(css,/width:53%!important/);
  assert.match(css,/streamlined-pack-summary[\s\S]*overflow-y:auto!important/);
  assert.match(css,/grid-template-rows:auto minmax\(28px,auto\)/);
});
