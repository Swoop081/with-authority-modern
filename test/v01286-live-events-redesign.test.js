import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../css/game.css", import.meta.url), "utf8");

test("v0.12.89 Live Events uses the repaired premium hero, readable superstar route cards and a single-box superstar selector",()=>{
  assert.match(app, /class=\"live-event-screen-premium/);
  assert.match(app, /class=\"live-event-player-panel/);
  assert.match(app, /class=\"live-event-route-entry/);
  assert.match(app, /data-live-event-pick=/);
  assert.match(app, /heroTitle = isShowBranded \? "Today's Live Event" : event\.name;/);
  assert.match(css, /\.live-event-premium-hero\{position:relative;display:grid;grid-template-columns:minmax\(0,1fr\) 320px;/);
  assert.match(css, /\.live-event-premium-art \.official-menu-superstar-photo\{height:188%/);
  assert.match(css, /\.live-event-route-entry\{scroll-snap-align:start;display:grid;gap:8px;min-height:298px/);
  assert.match(css, /\.live-event-selected-superstar-card\{display:block;width:190px/);
});
