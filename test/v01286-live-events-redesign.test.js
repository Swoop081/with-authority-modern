import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');

test('v0.12.86 Live Events screen uses the refined hero, featured panel and horizontal route redesign',()=>{
  assert.match(app, /const heroTitle = isShowBranded \? "Today's Five-Match Tower" : event\.name;/);
  assert.match(app, /class=\"live-event-screen-refined/);
  assert.match(app, /class=\"live-event-feature-panel/);
  assert.match(app, /class=\"live-event-route-strip\"/);
  assert.match(css, /\.live-event-screen-refined\{display:grid;gap:14px;max-width:980px/);
  assert.match(css, /\.live-event-route-strip\{display:grid;grid-auto-flow:column;grid-auto-columns:minmax\(148px,1fr\);gap:10px;overflow-x:auto/);
});
