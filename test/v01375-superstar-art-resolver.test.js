import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { collectionCards } from '../js/data/collection.js?v=0.14.03';
import { superstars } from '../js/data/superstars.js?v=0.14.03';
import { layeredCardArtFor, superstarCardArtFor, superstarHeadshotFor } from '../js/data/artwork.js?v=0.14.03';

const superstarCard = id => collectionCards.find(card => card.kind === 'superstar' && card.superstarId === id);

function stripVersion(url) { return String(url).replace(/\?v=.*$/, ''); }

test.skip('v0.13.75 Superstar layered fronts use the exact Card Studio superstarId filename — superseded by v0.13.96 flat asset paths', () => {
  for (const id of ['roxanne-perez','logan-paul','raquel-rodriguez','sol-ruca','bret-hart','shawn-michaels','razor-ramon','diesel']) {
    const card = superstarCard(id);
    assert.ok(card, id);
    assert.equal(stripVersion(layeredCardArtFor(card)), `assets/cards/art/layered/superstars/${id}.webp`, id);
    assert.doesNotMatch(layeredCardArtFor(card), new RegExp(`/superstar-${id}\\.webp`), id);
  }
});

test.skip('v0.13.75 every roster Superstar resolves Card Studio flat-front and HUD headshot candidate paths without an old registry entry — superseded by v0.13.96 flat asset paths', () => {
  for (const star of Object.values(superstars)) {
    assert.equal(stripVersion(superstarCardArtFor(star.id)), `assets/cards/art/custom/superstars/${star.id}.webp`, star.id);
    assert.equal(stripVersion(superstarHeadshotFor(star.id)), `assets/cards/art/custom/headshots/${star.id}.webp`, star.id);
  }
});

test('v0.13.75 live HUD keeps a sourced legacy portrait fallback only after the canonical headshot candidate fails', () => {
  const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
  assert.match(app, /const headshot = superstarHeadshotFor\(p\.superstar\.id\)/);
  assert.match(app, /const fallback = superstarArtwork\[p\.superstar\.id\] \?\? GENERIC_SUPERSTAR_PLACEHOLDER/);
});

test.skip('v0.13.75 clean packager retains layered Superstar and headshot asset trees — superseded by v0.13.96 flat asset paths', () => {
  const packager = fs.readFileSync(new URL('../tools/package-clean.mjs', import.meta.url), 'utf8');
  assert.match(packager, /const rootDirs = \["assets", "css", "js", "test", "tools"\]/);
  assert.doesNotMatch(packager, /assets\/cards\/art\/layered\/superstars/);
  assert.doesNotMatch(packager, /assets\/cards\/art\/custom\/headshots/);
  assert.ok(fs.existsSync(new URL('../assets/cards/art/layered/superstars/README.md', import.meta.url)));
  assert.ok(fs.existsSync(new URL('../assets/cards/art/custom/headshots/README.md', import.meta.url)));
});
