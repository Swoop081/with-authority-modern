import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { collectionCards } from '../js/data/collection.js';
import { defaultCatalogueFilters, filterAndSortCatalogue, isSharedCard, superstarIdsForCard, CATALOGUE_PAGE_SIZE } from '../js/data/catalogue.js';

const ownNone = () => ({ normal: 0, foil: 0, total: 0 });

test('Card Catalogue exposes every released active card without rendering the whole database at once', () => {
  assert.equal(collectionCards.length, 387);
  assert.equal(CATALOGUE_PAGE_SIZE, 48);
  const app = readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
  assert.match(app, /screen = "catalogue"/);
  assert.match(app, /renderCardCatalogue\(\)/);
  assert.match(app, /CATALOGUE_PAGE_SIZE/);
  assert.match(app, /catalogue-unowned/);
  assert.match(app, /×\$\{owned\.total\} OWNED/);
});

test('Super Sort can filter by exact gameplay values and move requirements', () => {
  const filters = defaultCatalogueFilters();
  filters.kind = 'move';
  filters.costOp = 'eq';
  filters.costValue = '4';
  filters.damageOp = 'eq';
  filters.damageValue = '7';
  filters.strengthReq = '1';
  const result = filterAndSortCatalogue(collectionCards, filters, ownNone);
  assert.ok(result.length > 0);
  assert.ok(result.every(card => card.kind === 'move' && card.cost === 4 && card.damage === 7 && (card.requirements?.strength ?? 0) === 1));
  assert.ok(result.some(card => card.id === 'spinebuster'));
});

test('Superstar usage filter includes shared cards in the current deck while exclusive scope does not', () => {
  const usage = defaultCatalogueFilters();
  usage.superstarId = 'roman-reigns';
  usage.superstarScope = 'usage';
  const usageIds = new Set(filterAndSortCatalogue(collectionCards, usage, ownNone).map(card => card.id));
  assert.ok(usageIds.has('superman-punch'));
  assert.ok(usageIds.has('spinebuster'));

  const exclusive = { ...usage, superstarScope: 'exclusive' };
  const exclusiveIds = new Set(filterAndSortCatalogue(collectionCards, exclusive, ownNone).map(card => card.id));
  assert.ok(exclusiveIds.has('superman-punch'));
  assert.equal(exclusiveIds.has('spinebuster'), false);
});

test('Shared / Generic filter distinguishes foundational cards from Superstar exclusives', () => {
  const filters = defaultCatalogueFilters();
  filters.superstarId = 'shared';
  const result = filterAndSortCatalogue(collectionCards, filters, ownNone);
  assert.ok(result.some(card => card.id === 'punch'));
  assert.equal(result.some(card => card.id === 'superman-punch'), false);
  assert.equal(isSharedCard(collectionCards.find(card => card.id === 'punch')), true);
  assert.deepEqual(superstarIdsForCard(collectionCards.find(card => card.id === 'superman-punch')), ['roman-reigns']);
});

test('Ownership filter and owned-quantity sort use live profile counts supplied by the UI', () => {
  const ownership = card => card.id === 'punch' ? { normal: 3, foil: 1, total: 4 } : card.id === 'spinebuster' ? { normal: 1, foil: 0, total: 1 } : { normal: 0, foil: 0, total: 0 };
  const filters = defaultCatalogueFilters();
  filters.ownership = 'owned';
  filters.sortBy = 'owned';
  filters.sortDir = 'desc';
  const result = filterAndSortCatalogue(collectionCards, filters, ownership);
  assert.deepEqual(result.map(card => card.id), ['punch', 'spinebuster']);
});

test('Alphabetical Super Sort is deterministic', () => {
  const filters = defaultCatalogueFilters();
  filters.search = 'punch';
  filters.sortBy = 'alpha';
  const result = filterAndSortCatalogue(collectionCards, filters, ownNone);
  const names = result.map(card => card.name);
  assert.deepEqual(names, [...names].sort((a,b) => a.localeCompare(b)));
});

test('Every Catalogue entry point routes to the standalone Catalogue screen', () => {
  const app = readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
  assert.match(app, /\$\("#menu-catalogue"\)\?\.addEventListener\("click", showCardCatalogue\)/);
  assert.match(app, /\$\("#collection-catalogue-view"\)\?\.addEventListener\("click", showCardCatalogue\)/);
  assert.match(app, /target === "catalogue"\) showCardCatalogue\(\)/);
  assert.match(app, /function showCollection\(\) \{ showOwnedCollection\(\); \}/);
});
