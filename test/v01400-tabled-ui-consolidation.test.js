import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');
const build = JSON.parse(fs.readFileSync(new URL('../build.json', import.meta.url), 'utf8'));
const cenaRender = new URL('../assets/images/art-wwe-menu-superstars-john-cena.webp', import.meta.url);

test('v0.14.00 packages the official WWE.com Cena presentation render and uses it on Season 1 character hero surfaces', () => {
  assert.match(build.version, /^0\.(?:14|1[5-9]|[2-9]\d)\.\d+$/);
  assert.ok(fs.existsSync(cenaRender));
  assert.ok(fs.statSync(cenaRender).size > 20000);
  assert.match(app, /SEASON_ONE_CENA_RENDER = assetUrl\("assets\/images\/art-wwe-menu-superstars-john-cena\.webp"\)/);
  assert.match(app, /season-road-rock">\$\{seasonOneCenaRenderMarkup\("season-road-cena"\)\}/);
  assert.match(app, /legacy-season-rock">\$\{seasonOneCenaRenderMarkup\("legacy-season-cena"\)\}/);
});

test('v0.14.00 keeps the splash completion Superstar card and explicitly centers it in the left promo bay', () => {
  assert.match(app, /season-ad-rock">\$\{seasonOneCenaCardMarkup\("season-ad-cena"\)\}/);
  assert.match(css, /\.season-one-ad \.season-ad-rock\{[\s\S]*justify-content:center!important/);
  assert.match(css, /\.season-one-ad \.season-ad-rock \.season-ad-cena\{[\s\S]*margin:0 auto!important/);
});

test('v0.14.00 removes duplicate Superstar name boxes only when a layered front falls back to a finished flat front', () => {
  assert.match(app, /has-flat-superstar-front/);
  assert.match(css, /\.ccg-card\.has-flat-superstar-front \.ccg-superstar-nameplate\{display:none!important\}/);
  assert.match(app, /classList\.remove\('has-flat-superstar-front'\)/);
  assert.match(app, /live-tower-opponent-card/);
});
