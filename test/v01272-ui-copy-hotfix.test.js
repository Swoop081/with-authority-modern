import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../js/ui/app.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../css/game.css', import.meta.url), 'utf8');
const content = fs.readFileSync(new URL('../js/data/content.js', import.meta.url), 'utf8');
const challenges = fs.readFileSync(new URL('../js/data/challenges.js', import.meta.url), 'utf8');

function between(source, start, end) {
  const a = source.indexOf(start);
  assert.notEqual(a, -1, `Missing start marker: ${start}`);
  const b = source.indexOf(end, a + start.length);
  assert.notEqual(b, -1, `Missing end marker: ${end}`);
  return source.slice(a, b);
}

test('v0.12.72 renames Electric Chair Facebuster to Electric Chair Drop without changing identity', async () => {
  const { allGameplayCards } = await import('../js/data/content.js?v=0.12.78');
  const card = allGameplayCards.find(c => c.id === 'rhea-ripley-electric-chair-facebuster');
  assert.ok(card);
  assert.equal(card.name, 'Electric Chair Drop');
  assert.doesNotMatch(content, /Electric Chair Facebuster/);
});

test('v0.12.72 Daily Login Booster is one full-width purple state control', () => {
  const season = between(app, 'function renderSeasons()', 'function renderChallenges()');
  assert.match(season, /CLAIM FREE BOOSTER/);
  assert.match(season, /NEXT FREE BOOSTER IN \$\{formatCountdown\(free\.msRemaining\)\}/);
  assert.doesNotMatch(season, /season-free-pack-copy|data-free-pack-copy/);
  assert.match(css, /\.season-free-pack-cta\{[\s\S]*width:100%!important/);
  assert.match(css, /\.season-free-pack-button\{[\s\S]*display:flex!important/);
  assert.match(css, /\.season-free-pack-button\{[\s\S]*width:100%!important/);
  assert.match(css, /\.season-free-pack-button\{[\s\S]*justify-content:center!important/);
});

test('v0.12.72 Climb the Ladder uses Level wording everywhere player-facing', () => {
  const ladder = between(app, 'function renderLadder()', 'function renderChampionship()');
  assert.match(ladder, /Level \$\{run\.rung\+1\} of/);
  assert.match(ladder, /NEXT LEVEL/);
  assert.match(ladder, /Fight Level/);
  assert.doesNotMatch(ladder, />NEXT RUNG|Fight Rung|`Rung /);
  assert.match(challenges, /Clear a Climb the Ladder level/);
  assert.doesNotMatch(challenges, /Clear a Climb the Ladder rung/);
  assert.match(challenges, /Clear 4 Ladder levels/);
  assert.doesNotMatch(challenges, /Ladder rungs/);
  assert.match(app, /Level cleared! \+1 booster/);
  assert.match(app, /retry this level/);
  assert.match(app, /start again from level 1/);
});

test('v0.12.72 special reward pack wrapper says only REWARD', () => {
  const boosters = between(app, 'function renderBoosters()', 'function formatCountdown');
  assert.match(boosters, /const packWrapperTitle=currentPackType===\"standard\"\?\"SERIES 1\":\"REWARD\"/);
  assert.match(boosters, /series:bucket\.type==='standard'\?'SERIES 1':'REWARD'/);
  assert.match(boosters, /label:\"LADDER COMPLETION\"/); // descriptive tile copy remains outside wrapper
});
