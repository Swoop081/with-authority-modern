import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../js/ui/app.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../css/game.css", import.meta.url), "utf8");

function between(source, start, end) {
  const a = source.indexOf(start);
  assert.notEqual(a, -1, `Missing start marker: ${start}`);
  const b = source.indexOf(end, a + start.length);
  assert.notEqual(b, -1, `Missing end marker: ${end}`);
  return source.slice(a, b);
}

test("v0.12.62 Season daily booster is only one full-width purple state button", () => {
  const season = between(app, "function renderSeasons()", "function renderChallenges()");
  const clocks = between(app, "function refreshSeasonClocks()", "function formatStoreCountdown");

  assert.match(css, /v0\.12\.62 — Daily Booster Button Pass/);
  assert.match(season, /<section class="season-free-pack-cta \${free\.available \? 'ready' : 'waiting'}">/);
  assert.doesNotMatch(season, /season-free-pack-strip|data-free-pack-copy|Daily Login Booster|Next Free Booster|Claim Free Booster/);
  assert.match(season, /free\.available \? 'Claim Pack' : formatCountdown\(free\.msRemaining\)/);
  assert.match(clocks, /claim\.textContent = free\.available \? 'Claim Pack' : formatCountdown\(free\.msRemaining\)/);
  assert.match(css, /\.season-free-pack-cta \.season-free-pack-button\{[\s\S]*?width:100%!important;[\s\S]*?background:linear-gradient\(135deg,#7636c8,#a647df\)!important/);
});
