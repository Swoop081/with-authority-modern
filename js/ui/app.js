import { BUILD_VERSION, assetUrl } from "../config/build.js";
import { superstars } from "../data/superstars.js";
import { sets } from "../data/sets.js";
import { superstarArtwork } from "../data/artwork.js";

const $ = (selector) => document.querySelector(selector);
const roster = Object.values(superstars);
const byId = Object.fromEntries(roster.map((star) => [star.id, star]));
const shellKey = "wwe-legacy-ui-shell-v1";
let screen = "splash";
let selectedSet = "all";

function shellState() {
  try { return JSON.parse(localStorage.getItem(shellKey)) || {}; }
  catch { return {}; }
}
function saveShellState(value) { localStorage.setItem(shellKey, JSON.stringify(value)); }
function ensureShellState() {
  const state = shellState();
  if (!state.createdAt) {
    state.createdAt = new Date().toISOString();
    saveShellState(state);
  }
  return state;
}

function portrait(id, name = byId[id]?.name || id, cls = "") {
  const src = superstarArtwork[id];
  if (!src) return `<span class="portrait-placeholder ${cls}"><b>${name}</b></span>`;
  return `<img class="${cls}" src="${src}" alt="${name}">`;
}

const logos = {
  "summerslam-series-1": assetUrl("assets/art/summerslam-series-1/summerslam-2026-logo.png"),
  "hall-of-fame-series-1": assetUrl("assets/art/hall-of-fame-series-1/hall-of-fame-logo.png"),
  "evolution-series-1": assetUrl("assets/art/evolution-series-1/evolution-logo.png"),
  "season-1-final-boss": assetUrl("assets/art/season-1-final-boss/rewards-logo.png")
};

function logoFor(setId) {
  const src = logos[setId];
  return src ? `<img src="${src}" alt="${sets[setId]?.displayName || "WWE Legacy"}">` : "";
}

function brand() {
  return `<div class="legacy-brand"><span>WWE</span><strong>LEGACY</strong><small>COLLECTIBLE CARD GAME</small></div>`;
}

function setChrome() {
  document.body.dataset.screen = screen;
  const nav = $("#mobile-game-nav");
  if (!nav) return;
  nav.hidden = screen === "splash";
  nav.querySelectorAll("[data-nav]").forEach((button) => {
    const active = button.dataset.nav === screen;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-current", active ? "page" : "false");
  });
  window.scrollTo(0, 0);
}

function go(next) {
  screen = next;
  render();
}

function renderSplash() {
  setChrome();
  $("#game").innerHTML = `<section class="splash-screen">
    <div class="splash-glow"></div>
    <div class="splash-content">
      ${brand()}
      <section class="season-ad">
        <div class="season-ad-art">${portrait("the-rock", "The Rock")}</div>
        <div class="season-ad-shade"></div>
        <div class="season-ad-copy"><span>SEASON 1 · LEGACY BEGINS</span><strong>THE FINAL<br>BOSS AWAITS.</strong><p>The presentation shell is intact and ready for a clean rebuild.</p></div>
      </section>
      <div class="splash-profile"><span>CLEAN BASELINE</span><strong>WWE Legacy UI Shell</strong><small>Branding, menus, roster identity and visual assets retained.</small></div>
      <button id="enter" class="primary-button">ENTER WWE LEGACY</button>
      <small class="local-note">Local UI shell · v${BUILD_VERSION}</small>
    </div>
  </section>`;
  $("#enter")?.addEventListener("click", () => { ensureShellState(); go("home"); });
}

function tile({id, kicker, title, copy, art, cls=""}) {
  return `<button id="${id}" class="menu-tile ${cls}"><span class="tile-art">${portrait(art)}</span><span class="tile-shade"></span><span class="tile-copy"><em>${kicker}</em><strong>${title}</strong><small>${copy}</small></span></button>`;
}

function renderHome() {
  setChrome();
  $("#game").innerHTML = `<section class="premium-screen home-screen">
    <section class="status-strip"><span><i></i><b>CLEAN BASELINE ACTIVE</b></span><strong>UI SHELL</strong><small>v${BUILD_VERSION}</small></section>
    <section class="hero-card"><div class="hero-copy"><em>WWE LEGACY</em><h1>PRESENTATION<br>RETAINED.</h1><p>The visual foundation is preserved as a clean starting point.</p></div><div class="hero-art">${portrait("roman-reigns")}</div></section>
    <div class="menu-grid">
      ${tile({id:"home-roster",kicker:`${roster.length} SUPERSTARS`,title:"ROSTER",copy:"Browse the retained Superstar identity layer",art:"cody-rhodes",cls:"primary"})}
      ${tile({id:"home-releases",kicker:"SEASON 1",title:"RELEASES",copy:"View the retained set branding and roster groups",art:"iyo-sky"})}
      ${tile({id:"home-legacy",kicker:"LOCAL SHELL",title:"MY LEGACY",copy:"Review the clean local presentation profile",art:"cm-punk"})}
      ${tile({id:"home-options",kicker:"BUILD",title:"OPTIONS",copy:"Version and local shell controls",art:"the-undertaker"})}
    </div>
  </section>`;
  $("#home-roster")?.addEventListener("click", () => go("roster"));
  $("#home-releases")?.addEventListener("click", () => go("releases"));
  $("#home-legacy")?.addEventListener("click", () => go("legacy"));
  $("#home-options")?.addEventListener("click", () => go("options"));
}

function rosterCard(star) {
  return `<article class="roster-card"><div class="roster-photo">${portrait(star.id, star.name)}</div><div class="roster-copy"><span>${sets[star.setId]?.shortCode || "WWE"}</span><strong>${star.name}</strong><small>${star.nickname}</small>${star.era ? `<em>${star.era.replaceAll("-", " ")}</em>` : ""}</div></article>`;
}

function renderRoster() {
  setChrome();
  const tabs = [{id:"all",label:"ALL"}, ...Object.values(sets).map(set => ({id:set.id,label:set.shortCode}))];
  const visible = selectedSet === "all" ? roster : roster.filter(star => star.setId === selectedSet);
  $("#game").innerHTML = `<section class="premium-screen">
    <section class="screen-hero"><div><em>SUPERSTAR IDENTITY</em><h1>ROSTER</h1><p>${visible.length} retained Superstar${visible.length===1?"":"s"}. Identity and artwork only.</p></div><div class="screen-hero-art">${portrait("rhea-ripley")}</div></section>
    <div class="filter-tabs">${tabs.map(tab => `<button data-set="${tab.id}" class="${selectedSet===tab.id?"active":""}">${tab.label}</button>`).join("")}</div>
    <div class="roster-grid">${visible.map(rosterCard).join("")}</div>
  </section>`;
  document.querySelectorAll("[data-set]").forEach(btn => btn.addEventListener("click", () => { selectedSet = btn.dataset.set; renderRoster(); }));
}

function releaseCard(setId, starIds) {
  return `<article class="release-card"><div class="release-logo">${logoFor(setId)}</div><div class="release-copy"><span>${sets[setId].shortCode}</span><strong>${sets[setId].displayName}</strong><small>${starIds.length} retained Superstar identities</small></div><div class="release-faces">${starIds.slice(0,3).map(id => portrait(id)).join("")}</div></article>`;
}

function renderReleases() {
  setChrome();
  const groups = Object.fromEntries(Object.keys(sets).map(id => [id, roster.filter(s => s.setId === id).map(s => s.id)]));
  $("#game").innerHTML = `<section class="premium-screen">
    <section class="screen-hero"><div><em>SEASON 1 PRESENTATION</em><h1>RELEASES</h1><p>Set names, logos and Superstar groupings retained.</p></div><div class="screen-hero-art">${portrait("stone-cold-steve-austin")}</div></section>
    <div class="release-list">
      ${releaseCard("summerslam-series-1", groups["summerslam-series-1"])}
      ${releaseCard("hall-of-fame-series-1", groups["hall-of-fame-series-1"])}
      ${releaseCard("evolution-series-1", groups["evolution-series-1"])}
      ${releaseCard("season-1-final-boss", groups["season-1-final-boss"])}
    </div>
  </section>`;
}

function renderLegacy() {
  setChrome();
  const state = ensureShellState();
  const created = new Date(state.createdAt);
  $("#game").innerHTML = `<section class="premium-screen">
    <section class="screen-hero"><div><em>LOCAL PRESENTATION PROFILE</em><h1>MY LEGACY</h1><p>A minimal local shell remains for navigation continuity.</p></div><div class="screen-hero-art">${portrait("cm-punk")}</div></section>
    <section class="profile-panel"><div class="profile-photo">${portrait("cm-punk")}</div><div><span>UI SHELL CREATED</span><strong>${Number.isNaN(created.getTime()) ? "Local device" : created.toLocaleDateString()}</strong><small>No legacy progression payload is read by this build.</small></div></section>
    <div class="stat-grid"><article><span>SUPERSTARS</span><b>${roster.length}</b></article><article><span>SETS</span><b>${Object.keys(sets).length}</b></article><article><span>BUILD</span><b>${BUILD_VERSION}</b></article></div>
  </section>`;
}

function renderOptions() {
  setChrome();
  $("#game").innerHTML = `<section class="premium-screen">
    <section class="screen-hero"><div><em>WWE LEGACY</em><h1>OPTIONS</h1><p>Controls for the clean presentation shell.</p></div><div class="options-icon">⚙</div></section>
    <section class="option-panel"><div><span>BUILD</span><strong>Version</strong><small>WWE Legacy: Collectible Card Game v${BUILD_VERSION}</small></div></section>
    <section class="option-panel danger"><div><span>LOCAL SHELL</span><strong>Reset UI State</strong><small>Clears only the new presentation-shell key used by this build.</small></div><button id="reset-shell" class="secondary-button">RESET</button></section>
    <p id="option-message" class="option-message"></p>
  </section>`;
  $("#reset-shell")?.addEventListener("click", () => {
    localStorage.removeItem(shellKey);
    $("#option-message").textContent = "Local UI shell state cleared.";
  });
}

function render() {
  if (screen === "splash") return renderSplash();
  if (screen === "home") return renderHome();
  if (screen === "roster") return renderRoster();
  if (screen === "releases") return renderReleases();
  if (screen === "legacy") return renderLegacy();
  if (screen === "options") return renderOptions();
  screen = "home";
  renderHome();
}

document.querySelectorAll("[data-nav]").forEach(button => button.addEventListener("click", () => go(button.dataset.nav)));
render();
