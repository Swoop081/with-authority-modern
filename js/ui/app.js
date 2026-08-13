import { assetUrl, BUILD_VERSION } from "../config/build.js?v=0.11.73";
import { superstars } from "../data/superstars.js?v=0.11.73";
import { decks } from "../data/decks.js?v=0.11.73";
import { sets } from "../data/sets.js?v=0.11.73";
import { collectionCards, setCollection, setCollections, cardsForSet } from "../data/collection.js?v=0.11.73";
import { artworkFor, superstarArtwork, superstarCardArtFor, superstarHeadshotFor, finishedCardArtFor, legacyFinishedCardArtFor } from "../data/artwork.js?v=0.11.73";
import { STARTER_CHOICES, createProfile, hasSuperstar, loadProfile, saveProfile, resetProfile, setDeckAssistance, ownedCount } from "../data/profile.js?v=0.11.73";
import { openBooster, openLadderCompletionPack, openChampionshipPack, grantBooster, boosterCreditsFor, finalizePackUniversePoints } from "../data/boosters.js?v=0.11.73";
import { STORE_BOOSTER_PRICE, STORE_SUPERSTAR_PRICE, storeRotation, storeSuperstars, storeLeadOffCards, purchaseStoreBooster, purchaseStoreSuperstar } from "../data/store.js?v=0.11.73";
import { randomExhibitionOpponent } from "../data/matchmaking.js?v=0.11.73";
import { buildPlayableDeck, findPackUpgrades, applyUpgrade } from "../data/deck-assistant.js?v=0.11.73";
import { MatchEngine } from "../engine/MatchEngine.js?v=0.11.73";
import { canPlayMomentum, canPlayEntrance, canPlayAction, canPlaySupport, canPlayManager, canPlaySpecial, effectiveTotalMomentum, moveEligibility, canCounter, canAttemptPin, canPlayPinEscape, submissionThreshold, canReturnToRing, canFollowOutside } from "../engine/rules.js?v=0.11.73";
import { totalMomentum } from "../engine/utils.js?v=0.11.73";
import { decisionOwner } from "../ai/WrestlingAI.js?v=0.11.73";
import { advanceCpuUntilHuman } from "./turn-driver.js?v=0.11.73";
import { LADDER_LIVES, LADDER_BRANCHES, ladderState, startLadderRun, currentLadderOpponent, recordLadderMatch } from "../data/ladder.js?v=0.11.73";
import { CHAMPIONSHIP_ROAD_LENGTH, CHAMPIONSHIP_STAGES, CHAMPIONSHIP_BRANCHES, championshipRoadState, startChampionshipRoad, currentChampionshipOpponent, recordChampionshipMatch, resetChampionshipRoad } from "../data/championship-road.js?v=0.11.73";
import { challengeState, claimChallenge, recordCompletedMatchChallenges } from "../data/challenges.js?v=0.11.73";
import { setProgressState, collectionProgress, availableMilestoneRewards, claimMilestone } from "../data/set-progression.js?v=0.11.73";
import { MOVE_TYPE_LABELS } from "../data/move-types.js?v=0.11.73";
import { CATALOGUE_PAGE_SIZE, defaultCatalogueFilters, catalogueOptions, filterAndSortCatalogue, superstarIdsForCard, isSharedCard } from "../data/catalogue.js?v=0.11.73";
import { createDeckDraft, recommendedDeckDraft, optimizeDeck, aggregateDeck, eligibleOwnedCards, addCardToDraft, removeCardFromDraft, validateDeckDraft, materializeDraft, leadOffIds, buildOwnedRecommendedDraft, autoFillOwnedDraft } from "../data/deck-builder.js?v=0.11.73";
import { RECOMMENDED_DECK_SHAPE } from "../data/deck-health.js?v=0.11.73";
import { SEASON_1, SEASON_TIER_COUNT, XP_PER_TIER, MATCH_XP, seasonState, seasonTier, seasonLevelProgress, seasonTimeRemaining, nextRoadmapNode, roadmapNodeStatus, awardMatchSeasonXp, tierReward, claimSeasonTier, claimAllSeasonTiers, freePackStatus, claimFreeSeasonBooster } from "../data/seasons.js?v=0.11.73";

const HUMAN = "p1";
const CPU = "p2";
let game = null;
let message = "";
let profile = loadProfile();
let screen = "splash";
let selection = { p1: profile?.starterId ?? "cm-punk", p2: profile?.starterId === "roman-reigns" ? "cm-punk" : "roman-reigns" };
let lastMatchup = { ...selection };
let collectionFilter = { kind: "all", rarity: "all", search: "" };
let collectionSort = "newest";
let collectionView = "owned";
let catalogueFilter = defaultCatalogueFilters();
let cataloguePage = 1;
let flippedCatalogueCards = new Set();
let lastPack = null;
let pendingUpgrades = [];
let packStage = "idle";
let revealedPackCards = new Set();
let boosterFocusIndex = 0;
let packFinalized = false;
let matchRewarded = false;
let activeMode = "exhibition";
let currentPackType = "standard";
let deckBuilderStarId = profile?.starterId ?? "cm-punk";
let deckDraft = null;
let deckBuilderFilter = "";
let activeCollectionSetId = "all";
let activeBoosterSetId = "summerslam-series-1";
let unlockCelebration = null;
let unlockCelebrationIndex = 0;
let optionsResetArmed = false;
let ladderBranchId = "modern";
let championshipBranchId = "modern";
let flippedHandCards = new Set();
let flippedCollectionCards = new Set();
let playPileFlipped = false;
let playPileCardKey = null;
let boosterRulesFlipped = new Set();
let lastChromeScreen = null;
let exhibitionConfirmed = { p1: false, p2: true };
let selectDetailKeys = new Set();
let pendingMatch = null;
let matchPresentationSetId = null;
let entranceIntroPlayerId = null;
let entranceIntroFlipped = false;
let entranceIntroRevealed = false;
let superstarOverlayId = null;
let superstarOverlayFlipped = false;
let pendingDeckBuildSuperstarId = null;
let pendingDeckBuildStep = null;

if ("scrollRestoration" in history) history.scrollRestoration = "manual";

function scrollNewScreenToTop() {
  if (lastChromeScreen === screen) return;
  lastChromeScreen = screen;
  const reset = () => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  };
  // Reset immediately, then again after the newly rendered screen has been
  // painted. The second pass prevents mobile Safari from restoring the old
  // page's scroll offset after a large DOM replacement.
  reset();
  requestAnimationFrame(() => {
    reset();
    requestAnimationFrame(reset);
  });
}

const roster = Object.values(superstars);
const superstarById = Object.fromEntries(roster.map(star => [star.id, star]));
const collectionById = new Map(collectionCards.map(card => [card.id, card]));
const rosterForBranch = (branch) => roster.filter(star => star.setId === branch.setId && (!branch.era || star.era === branch.era));
const $ = selector => document.querySelector(selector);
const nameFor = id => id ? game.state().players[id]?.superstar.name ?? id : "No one";
const cardNameFor = id => id ? collectionById.get(id)?.name ?? id : "";
const superstarVisualMarkup = (id, name, cls = "") => {
  const cardArt = superstarCardArtFor(id);
  const placeholder = assetUrl("assets/cards/art/temp/superstar-placeholder.svg");
  if (cardArt) return `<img class="${cls} superstar-card-visual" src="${cardArt}" alt="${name}" data-superstar-card-art="${id}" onerror="this.onerror=null;this.dataset.artFallback='placeholder';this.src='${placeholder}';">`;
  return `<img class="${cls} superstar-card-visual is-placeholder-art" src="${placeholder}" alt="${name} artwork pending">`;
};
const portraitMarkup = superstarVisualMarkup;
const GENERIC_SUPERSTAR_PLACEHOLDER = assetUrl("assets/cards/art/temp/superstar-placeholder.svg");

const SET_LOGO_ASSETS = {
  "summerslam-series-1": assetUrl("assets/art/summerslam-series-1/summerslam-2026-logo.png"),
  "hall-of-fame-series-1": assetUrl("assets/art/hall-of-fame-series-1/hall-of-fame-logo.png"),
  "evolution-series-1": assetUrl("assets/art/evolution-series-1/evolution-logo.png"),
  "season-1-final-boss": assetUrl("assets/art/season-1-final-boss/rewards-logo.png"),
  "raw-series-1": assetUrl("assets/branding/raw-series-1/raw-logo.webp"),
  "worlds-collide-series-1": assetUrl("assets/branding/worlds-collide-series-1/worlds-collide-logo.webp"),
  "money-in-the-bank-series-1": assetUrl("assets/branding/money-in-the-bank-series-1/money-in-the-bank-logo.webp"),
  "smackdown-series-1": assetUrl("assets/branding/smackdown-series-1/smackdown-logo-official.png")
};
function setLogoMarkup(setId, className = "") {
  const src = SET_LOGO_ASSETS[setId];
  if (!src) return "";
  const label = sets[setId]?.displayName ?? sets[setId]?.name ?? "WWE set";
  return `<img class="set-brand-logo ${className}" src="${src}" alt="${label}">`;
}

const MATCH_PRESENTATION_SETS = [
  "summerslam-series-1",
  "evolution-series-1",
  "raw-series-1",
  "worlds-collide-series-1",
  "money-in-the-bank-series-1",
  "smackdown-series-1"
];
function randomMatchPresentationSet() {
  return MATCH_PRESENTATION_SETS[Math.floor(Math.random() * MATCH_PRESENTATION_SETS.length)] ?? "summerslam-series-1";
}
function presentationThemeClass(setId) { return `presentation-${setId ?? "summerslam-series-1"}`; }
function superstarCollectibleFor(starId) {
  const star = superstarById[starId];
  return collectionCards.find(card => card.kind === "superstar" && card.superstarId === starId)
    ?? (star?.cardId ? collectionById.get(star.cardId) : null);
}
function entranceCollectibleFor(starId) {
  const star = superstarById[starId];
  return collectionCards.find(card => card.kind === "entrance" && card.superstarId === starId)
    ?? (star?.entranceId ? collectionById.get(star.entranceId) : null);
}
function entranceEffectCallouts(star) {
  const entrance = star?.entrance ?? {};
  const callouts = [];
  for (const [method, amount] of Object.entries(entrance.preMatchMomentum ?? {})) {
    if (amount) callouts.push(`+${amount} ${method.toUpperCase()}`);
  }
  if (entrance.preMatchAdrenaline) callouts.push(`+${entrance.preMatchAdrenaline} ADRENALINE`);
  if (entrance.firstStrikeMomentum) callouts.push(`FIRST STRIKE +${entrance.firstStrikeMomentum} STRIKE`);
  if (entrance.delayedTurn5) callouts.push("TURN 5 ENTRANCE EFFECT");
  return callouts;
}

function setChrome({ hideTopbar = false } = {}) {
  const bar = document.querySelector("#app-topbar");
  if (bar) {
    bar.hidden = hideTopbar;
    bar.style.display = hideTopbar ? "none" : "";
    bar.setAttribute("aria-hidden", hideTopbar ? "true" : "false");
  }
  document.body.dataset.screen = screen;
  document.body.dataset.mode = activeMode ?? "";
  scrollNewScreenToTop();

  const mobileNav = document.querySelector("#mobile-game-nav");
  if (mobileNav) {
    const navScreens = new Set(["menu", "play-menu", "setup", "ladder", "championship", "collection", "catalogue", "boosters", "store", "challenges", "seasons", "deck-builder", "profile", "options"]);
    mobileNav.hidden = !profile || !navScreens.has(screen);
    const activeTarget = screen === "setup" || screen === "ladder" || screen === "championship" ? "play-menu" : screen === "deck-builder" ? "collection" : screen === "catalogue" ? "catalogue" : screen === "collection" ? "collection" : screen;
    mobileNav.querySelectorAll("[data-mobile-nav]").forEach(button => {
      button.classList.toggle("is-active", button.dataset.mobileNav === activeTarget);
      button.setAttribute("aria-current", button.dataset.mobileNav === activeTarget ? "page" : "false");
    });
  }
}

function showSplash() { screen = "splash"; message = ""; renderSplash(); }
function showMainMenu() {
  if (!profile) { screen = "starter"; message = ""; renderStarter(); return; }
  screen = "menu"; message = ""; renderMainMenu();
}
function showPlayMenu() {
  if (!profile) { screen = "starter"; renderStarter(); return; }
  screen = "play-menu"; message = ""; renderPlayMenu();
}
function showProfile() {
  if (!profile) { screen = "starter"; renderStarter(); return; }
  screen = "profile"; message = ""; renderProfile();
}

function showOptions() {
  if (!profile) { screen = "starter"; renderStarter(); return; }
  screen = "options";
  message = "";
  optionsResetArmed = false;
  renderOptions();
}

function startMatch(p1Id = selection.p1, p2Id = selection.p2, { mode = "exhibition" } = {}) {
  if (!profile) { screen = "starter"; renderStarter(); return; }
  const p1Star = superstarById[p1Id], p2Star = superstarById[p2Id];
  if (!p1Star || !p2Star) { message = "That Superstar is not active in this build."; renderSetup(); return; }
  const p1Deck = buildPlayableDeck(profile, p1Id), p2Deck = decks[p2Id] ?? [];
  if (p1Deck.length !== 55 || p2Deck.length !== 55) { message = "One of these Superstar decks is not yet complete."; renderSetup(); return; }
  activeMode = mode;
  selection = { p1: p1Id, p2: p2Id };
  lastMatchup = { ...selection };
  matchRewarded = false;
  flippedHandCards = new Set();
  playPileFlipped = false;
  superstarOverlayId = null;
  superstarOverlayFlipped = false;
  matchPresentationSetId = randomMatchPresentationSet();
  pendingMatch = { p1Id, p2Id, mode, p1Star, p2Star, p1Deck, p2Deck, brandSetId: matchPresentationSetId };
  screen = "matchup";
  message = "";
  renderMatchupSplash();
}

function createPendingMatchEngine() {
  if (!pendingMatch) return false;
  const { p1Star, p2Star, p1Deck, p2Deck } = pendingMatch;
  game = new MatchEngine({ p1: p1Star, p2: p2Star, decks: { [p1Star.id]: p1Deck, [p2Star.id]: p2Deck } });
  return true;
}

function renderMatchupSplash() {
  if (!pendingMatch) { showSetup(); return; }
  setChrome({ hideTopbar: true });
  const root = $("#game");
  const { p1Star, p2Star, brandSetId } = pendingMatch;
  const p1Card = superstarCollectibleFor(p1Star.id);
  const p2Card = superstarCollectibleFor(p2Star.id);
  root.innerHTML = `<section class="prematch-screen matchup-splash ${presentationThemeClass(brandSetId)}">
    <div class="prematch-brand">${setLogoMarkup(brandSetId, "prematch-show-logo")}</div>
    <div class="prematch-heading"><span>TONIGHT’S</span><h2>MAIN EVENT</h2></div>
    <div class="prematch-versus">
      <article class="prematch-side player-side"><span class="prematch-side-label">YOU</span><div class="prematch-superstar-card">${p1Card ? collectibleCardMarkup(p1Card,{extraClass:"matchup-superstar-card"}) : superstarVisualMarkup(p1Star.id,p1Star.name)}</div></article>
      <div class="prematch-vs">VS</div>
      <article class="prematch-side cpu-side"><span class="prematch-side-label">CPU</span><div class="prematch-superstar-card">${p2Card ? collectibleCardMarkup(p2Card,{extraClass:"matchup-superstar-card"}) : superstarVisualMarkup(p2Star.id,p2Star.name)}</div></article>
    </div>
    <button id="begin-entrances" class="start-match prematch-start">Start Match</button>
  </section>`;
  $("#begin-entrances")?.addEventListener("click", () => {
    if (!createPendingMatchEngine()) return;
    entranceIntroPlayerId = HUMAN;
    entranceIntroFlipped = false;
    entranceIntroRevealed = false;
    screen = "entrance-intro";
    renderEntranceIntro();
  });
}

function renderEntranceIntro() {
  if (!game || !entranceIntroPlayerId) { renderMatchupSplash(); return; }
  setChrome({ hideTopbar: true });
  const root = $("#game");
  const player = game.state().players[entranceIntroPlayerId];
  const star = player.superstar;
  const starCard = superstarCollectibleFor(star.id);
  const entranceCard = entranceCollectibleFor(star.id);
  const isHuman = entranceIntroPlayerId === HUMAN;
  const callouts = entranceEffectCallouts(star);
  const brandSetId = pendingMatch?.brandSetId ?? matchPresentationSetId ?? star.setId;
  root.innerHTML = `<section class="prematch-screen entrance-intro-screen ${presentationThemeClass(brandSetId)}">
    <div class="prematch-brand">${setLogoMarkup(brandSetId, "prematch-show-logo")}</div>
    <div class="entrance-intro-heading"><span>${isHuman ? "YOUR ENTRANCE" : "OPPONENT ENTRANCE"}</span><h2>${star.name}</h2></div>
    <div class="entrance-stage ${entranceIntroRevealed ? "entrance-revealed" : ""}">
      <div class="entrance-card-transition intro-superstar-layer">${starCard ? collectibleCardMarkup(starCard,{extraClass:"intro-superstar-card"}) : superstarVisualMarkup(star.id,star.name)}</div>
      <div class="entrance-card-transition intro-entrance-layer">${entranceCard ? collectibleCardMarkup(entranceCard,{flipped:entranceIntroFlipped,extraClass:"intro-main-card",flipAttr:'data-flip-entrance="1"'}) : `<div class="entrance-card-fallback"><b>${star.entrance?.name ?? "Entrance"}</b><p>${star.entrance?.rulesText ?? ""}</p></div>`}</div>
      <div class="entrance-callouts">${callouts.map((text,index)=>`<span class="entrance-callout callout-${index+1}">${text}</span>`).join("")}</div>
    </div>
    <small class="entrance-tap-hint">Tap the Entrance card to ${entranceIntroFlipped ? "return to artwork" : "flip and view effects"}.</small>
    <button id="entrance-next" class="start-match prematch-start">Next</button>
  </section>`;
  if (!entranceIntroRevealed) requestAnimationFrame(() => requestAnimationFrame(() => { root.querySelector(".entrance-stage")?.classList.add("entrance-revealed"); entranceIntroRevealed = true; }));
  root.querySelectorAll("[data-flip-entrance]").forEach(btn => btn.addEventListener("click", () => { entranceIntroFlipped = !entranceIntroFlipped; renderEntranceIntro(); }));
  $("#entrance-next")?.addEventListener("click", () => {
    if (isHuman) { entranceIntroPlayerId = CPU; entranceIntroFlipped = false; entranceIntroRevealed = false; renderEntranceIntro(); return; }
    entranceIntroPlayerId = null;
    entranceIntroFlipped = false;
    entranceIntroRevealed = false;
    pendingMatch = null;
    screen = "match";
    advanceCpuUntilHuman(game, HUMAN, CPU);
    render();
  });
}

function restartMatch() { startMatch(lastMatchup.p1, lastMatchup.p2, { mode: activeMode }); }
function showSetup() {
  if (!profile) { screen = "starter"; renderStarter(); return; }
  activeMode = "exhibition";
  screen = "setup";
  message = "";
  pendingMatch = null;
  game = null;
  exhibitionConfirmed = { p1: false, p2: true };
  selectDetailKeys = new Set();
  const owned = orderedUnlockedSuperstars();
  if (!owned.some(s => s.id === selection.p1)) selection.p1 = owned[0]?.id ?? profile.starterId;
  selection.p2 = null;
  renderSetup();
}
function showLadder() { if (!profile) { screen = "starter"; renderStarter(); return; } screen = "ladder"; message = ""; setChrome(); renderLadder(); }
function showChampionship() { if (!profile) { screen = "starter"; renderStarter(); return; } screen = "championship"; message = ""; setChrome(); renderChampionship(); }
function showCollection() { showOwnedCollection(); }
function showOwnedCollection() {
  collectionView = "owned";
  lastChromeScreen = null;
  activeCollectionSetId = "all";
  collectionFilter = { kind: "all", rarity: "all", search: "" };
  flippedCollectionCards = new Set();
  screen = "collection"; message = ""; setChrome(); renderCollection();
}
function showCardCatalogue() {
  collectionView = "catalogue";
  lastChromeScreen = null;
  catalogueFilter = defaultCatalogueFilters();
  cataloguePage = 1;
  flippedCatalogueCards = new Set();
  screen = "catalogue"; message = ""; setChrome(); renderCardCatalogue();
}
function entranceFor(starId) { const star=superstarById[starId]; return star?.entrance ?? null; }
function showBoosters() { screen = "boosters"; message = ""; setChrome(); renderBoosters(); }
function showStore() { if (!profile) { screen = "starter"; renderStarter(); return; } screen = "store"; message = ""; setChrome(); renderStore(); }
function showBoosterSet(setId) {
  activeBoosterSetId = setId;
  lastPack = null;
  pendingUpgrades = [];
  packStage = "idle";
  revealedPackCards = new Set();
  boosterRulesFlipped = new Set();
  boosterFocusIndex = 0;
  screen = "boosters";
  message = "";
  renderBoosters();
}
function showChallenges() { if (!profile) { screen = "starter"; renderStarter(); return; } screen = "challenges"; message = ""; setChrome(); renderChallenges(); }
function showSeasons() { if (!profile) { screen = "starter"; renderStarter(); return; } screen = "seasons"; message = ""; setChrome(); renderSeasons(); }
function showDeckBuilder(starId = selection.p1) {
  if (!profile) { screen = "starter"; renderStarter(); return; }
  const unlocked = profile.unlockedSuperstars ?? [];
  deckBuilderStarId = unlocked.includes(starId) ? starId : (unlocked[0] ?? profile.starterId);
  deckDraft = createDeckDraft(profile, deckBuilderStarId);
  deckBuilderFilter = "";
  screen = "deck-builder";
  message = "";
  setChrome();
  renderDeckBuilder();
}

function cardById(id) { return collectionCards.find(card => card.id === id) ?? Object.values(decks).flat().find(card => card.id === id) ?? null; }
function beginUnlockCelebration() {
  const queue = profile?.pendingUnlockCelebrations ?? [];
  if (!queue.length) return false;
  unlockCelebration = queue[0]; unlockCelebrationIndex = 0; screen = "unlock-celebration"; renderUnlockCelebration(); return true;
}
function renderUnlockCelebration() {
  setChrome();
  const root = $("#game"), event = unlockCelebration;
  if (!event) { showCollection(); return; }
  const star = superstarById[event.superstarId], ids = event.cardIds ?? [], card = cardById(ids[unlockCelebrationIndex]);
  if (!card) { finishUnlockCelebration(); return; }
  const first = unlockCelebrationIndex === 0, last = unlockCelebrationIndex === ids.length - 1;
  root.innerHTML = `<section class="unlock-celebration premium-screen"><div class="unlock-burst"><span>${first ? 'NEW SUPERSTAR UNLOCKED' : 'NEW CARD'}</span><h2>${first ? star.name : card.name}</h2><p>${first ? `${star.nickname ?? ''} joins your WWE Legacy roster.` : `Added to ${star.name}'s collection.`}</p>${collectibleCardMarkup(card,{foil:card.kind==='superstar'||card.kind==='entrance',extraClass:'unlock-reward-card'})}<div class="unlock-progress">${unlockCelebrationIndex+1} / ${ids.length}</div><button id="unlock-next" class="start-match">${last ? 'Finish' : 'Next'}</button></div></section>`;
  $("#unlock-next")?.addEventListener("click",()=>{ if(last) finishUnlockCelebration(); else { unlockCelebrationIndex += 1; renderUnlockCelebration(); } });
}
function finishUnlockCelebration() {
  profile.pendingUnlockCelebrations ??= [];
  profile.pendingUnlockCelebrations.shift(); saveProfile(profile); unlockCelebration = null; unlockCelebrationIndex = 0;
  if (profile.pendingUnlockCelebrations.length) beginUnlockCelebration(); else { screen = "boosters"; renderBoosters(); }
}

function processPack(kind = "standard") {
  try {
    currentPackType = kind;
    lastPack = kind === "ladder" ? openLadderCompletionPack(profile, Math.random, activeBoosterSetId) : kind === "championship" ? openChampionshipPack(profile, Math.random, activeBoosterSetId) : openBooster(profile, Math.random, activeBoosterSetId);
    if (lastPack?.[0]?.card?.setId) activeBoosterSetId = lastPack[0].card.setId;
    pendingUpgrades = []; revealedPackCards = new Set(); boosterRulesFlipped = new Set(); boosterFocusIndex = 0; packFinalized = false; packStage = "opening";
    const setName = setCollections[activeBoosterSetId]?.displayName ?? activeBoosterSetId;
    message = kind === "ladder" ? `Opening ${setName} Climb the Ladder Completion Pack…` : kind === "championship" ? `Opening ${setName} Championship Pack…` : `Opening ${setName} booster…`;
    saveProfile(profile); renderBoosters();
    setTimeout(() => { if (screen !== "boosters") return; packStage = "reveal"; message = "Reveal Card 1, then use Next Card to move through the pack." ; renderBoosters(); }, 900);
  } catch (error) { message = error.message; renderBoosters(); }
}

function preparePackSummary() {
  if (!lastPack?.length || revealedPackCards.size !== lastPack.length) return;
  const converted = finalizePackUniversePoints(profile, lastPack);
  packStage = "summary";
  packFinalized = false;
  pendingUpgrades = [];
  message = converted ? `Pack complete — excess copies converted into +${converted} Universe Points.` : "Pack complete — review everything you acquired.";
  saveProfile(profile);
  renderBoosters();
}

function beginPackUpgradeReview() {
  if (!lastPack?.length) return;
  pendingUpgrades = findPackUpgrades(profile, lastPack);
  packFinalized = true;
  packStage = "upgrades";

  if (profile.deckAssistance === "auto") {
    const count = pendingUpgrades.length;
    for (const upgrade of pendingUpgrades) applyUpgrade(profile, upgrade);
    pendingUpgrades = [];
    message = count ? `${count} safe roster/deck upgrade${count===1?"":"s"} applied automatically.` : "No safe roster/deck upgrades found from this pack.";
  } else if (profile.deckAssistance === "manual") {
    pendingUpgrades = [];
    message = "Deck Assistance is Manual. Your cards are in the collection; no automatic roster changes were made.";
  } else {
    message = pendingUpgrades.length
      ? `${pendingUpgrades.length} roster/deck upgrade suggestion${pendingUpgrades.length===1?"":"s"} found from this pack.`
      : "No safe roster/deck upgrades found from this pack.";
  }
  saveProfile(profile);
  renderBoosters();
}

function revealPackCard(index) {
  if (packStage !== "reveal" || !lastPack?.[index] || index !== boosterFocusIndex || revealedPackCards.has(index)) return;
  revealedPackCards.add(index);
  renderBoosters();
  if (lastPack[index]?.superstarUnlocked) {
    saveProfile(profile);
    setTimeout(()=>beginUnlockCelebration(), 450);
  }
}

function nextBoosterCard() {
  if (!lastPack?.length || !revealedPackCards.has(boosterFocusIndex)) return;
  if (boosterFocusIndex < lastPack.length - 1) {
    boosterFocusIndex += 1;
    boosterRulesFlipped.delete(boosterFocusIndex);
    renderBoosters();
  } else {
    preparePackSummary();
  }
}

function acceptUpgrade(index) {
  const upgrade=pendingUpgrades[index];
  if(!upgrade)return;
  applyUpgrade(profile,upgrade);
  pendingUpgrades.splice(index,1);
  saveProfile(profile);
  message="Deck upgrade applied.";
  renderBoosters();
}
function declineUpgrade(index) {
  pendingUpgrades.splice(index,1);
  message="Upgrade skipped. The card remains in your collection.";
  renderBoosters();
}

function finishPackFlow() {
  lastPack=null; revealedPackCards=new Set(); boosterRulesFlipped=new Set(); boosterFocusIndex=0; pendingUpgrades=[]; packStage="idle"; currentPackType="standard"; message="";
  document.body.classList.remove("booster-modal-open");
  renderBoosters();
  requestAnimationFrame(()=>window.scrollTo(0,0));
}

function renderBoosters() {
  const root=$("#game"), pulls=lastPack??[];
  const packInProgress = pulls.length > 0 && packStage !== "idle";
  const setInfo=setCollections[activeBoosterSetId]??setCollection;
  const standardCredits=boosterCreditsFor(profile,activeBoosterSetId);
  const ladder=ladderState(profile), road=championshipRoadState(profile);
  const ladderPacks=ladder.completionPackCreditsBySet?.[activeBoosterSetId]??0, championshipPacks=road.championshipPackCreditsBySet?.[activeBoosterSetId]??0;
  const packTitle=currentPackType==="ladder"?"CLIMB THE LADDER":currentPackType==="championship"?"CHAMPIONSHIP ROAD":setInfo.name.toUpperCase();
  const packSubtitle=currentPackType==="ladder"?"COMPLETION PACK · 1 FOIL · 1 VERY RARE+":currentPackType==="championship"?"CHAMPIONSHIP PACK · 1 FOIL · 1 RARE+":"SERIES 1 · 5 CARDS · 1 GUARANTEED FOIL";
  const brand=setLogoMarkup(activeBoosterSetId,"pack-set-logo") || `<span class="pack-text-logo"><b>${setInfo.name.toUpperCase()}</b><small>SERIES 1</small></span>`;
  const packSetClass=`pack-set-${activeBoosterSetId}`;

  document.body.classList.toggle("booster-modal-open", packInProgress);
  const mobileNav=document.querySelector("#mobile-game-nav");
  if (mobileNav) mobileNav.hidden=packInProgress;

  const rarityName = pull => (setCollections[pull?.card?.setId]?.rarityLabels ?? setInfo.rarityLabels)?.[pull?.card?.rarity ?? 1] ?? "Common";
  const summaryCard = (p,index,slotClass="") => `
    <article class="pack-summary-card actual-card-summary ${slotClass} rarity-${p.card.rarity} ${p.foil?'is-foil':''}">
      <div class="pack-summary-actual-card">${collectibleCardMarkup(p.card,{flipped:boosterRulesFlipped.has(index),foil:p.foil,extraClass:"pack-summary-ccg",flipAttr:`data-booster-inspect="${index}"`})}</div>
      <div class="pack-summary-badges"><span class="summary-rarity-badge">${rarityName(p)}</span>${p.foil?'<span class="foil-summary-symbol">FOIL</span>':''}${p.isNewCard?'<span class="new-card-symbol">NEW</span>':''}${p.superstarUnlocked?'<span class="unlock-symbol">SUPERSTAR</span>':''}${p.universePointsValue?`<span class="up-conversion-badge">+${p.universePointsValue} UP</span>`:''}</div>
    </article>`;
  const premiumScore = p => (Number(p?.card?.rarity) || 1) * 100 + (p?.foil ? 10 : 0) + (p?.card?.kind === "superstar" ? 2 : 0);
  const featuredPullIndex = pulls.length ? pulls.reduce((best, _p, i) => premiumScore(pulls[i]) > premiumScore(pulls[best]) ? i : best, 0) : -1;
  const otherPullIndices = pulls.map((_p,i)=>i).filter(i=>i!==featuredPullIndex);
  const pyramidOrder = pulls.length === 5 ? [otherPullIndices[0], otherPullIndices[1], featuredPullIndex, otherPullIndices[2], otherPullIndices[3]] : pulls.map((_p,i)=>i);
  const pyramidSlots = ["summary-top-left","summary-top-right","summary-center","summary-bottom-left","summary-bottom-right"];
  const summaryThumbs = pyramidOrder.map((pullIndex,position)=>summaryCard(pulls[pullIndex],pullIndex,pyramidSlots[position] ?? "")).join("");
  const compactSummaryThumbs = pulls.map((p,index)=>summaryCard(p,index)).join("");

  let packArea = "";
  if (packStage === "opening") {
    packArea=`<section class="pack-opening-stage"><div class="booster-pack is-opening ${packSetClass}"><div class="pack-tear"></div>${brand}<span>${packTitle}</span><b>SERIES 1</b><small>${packSubtitle}</small></div></section>`;
  } else if (packStage === "reveal" && pulls.length) {
    const p=pulls[boosterFocusIndex], revealed=revealedPackCards.has(boosterFocusIndex), owned=profile.ownedCards?.[p.card.id]??{normal:0,foil:0};
    const cardMarkup = !revealed
      ? `<button type="button" class="booster-flip-card single-pack-card is-facedown is-current rarity-${p.card.rarity} ${p.foil?'is-foil':''}" data-reveal-card="${boosterFocusIndex}" aria-label="Card ${boosterFocusIndex+1} of ${pulls.length}, tap to reveal"><span class="flip-card-face card-back ${packSetClass}">${brand}<b>${packTitle}</b><small>${packSubtitle}</small>${p.foil?'<i class="foil-sweep"></i>':''}</span></button>`
      : `<div class="booster-flip-card single-pack-card is-revealed is-current rarity-${p.card.rarity} ${p.foil?'is-foil':''}">
          ${collectibleCardMarkup(p.card,{flipped:boosterRulesFlipped.has(boosterFocusIndex),foil:p.foil,extraClass:"booster-ccg",flipAttr:`data-booster-inspect="${boosterFocusIndex}"`})}
          <div class="booster-card-caption"><span>${boosterRulesFlipped.has(boosterFocusIndex)?'Tap to view artwork':'Tap to view effects'}</span><small>Owned ${owned.normal} normal · ${owned.foil} foil</small>${p.isNewCard?'<b class="new-pull-label">NEW CARD</b>':''}${p.replacedNormal?'<b>FOIL REPLACED NORMAL</b>':''}${p.superstarUnlocked?'<b>SUPERSTAR UNLOCKED</b>':''}</div>
        </div>`;
    const dots=pulls.map((_,i)=>`<i class="${i===boosterFocusIndex?'current':''} ${revealedPackCards.has(i)?'revealed':''}"></i>`).join("");
    packArea=`<section class="single-card-reveal-stage">
      <div class="booster-card-progress"><span>CARD ${boosterFocusIndex+1} OF ${pulls.length}</span><div>${dots}</div></div>
      ${revealed?`<div class="booster-pull-rarity rarity-${p.card.rarity}"><span>${rarityName(p).toUpperCase()}</span>${p.foil?'<b>FOIL</b>':''}</div>`:''}
      <div class="single-card-slot">${cardMarkup}</div>
      <div class="single-card-actions">
        <button id="next-pack-card" class="start-match" ${revealed?'':'disabled'}>${boosterFocusIndex===pulls.length-1?'View Pack Summary':'Next Card'}</button>
      </div>
      <p class="reveal-progress">${revealed ? (boosterFocusIndex===pulls.length-1?'All five cards revealed — continue to your pack summary.':'Card revealed — tap Next Card when ready.') : 'Tap the card to reveal it.'}</p>
    </section>`;
  } else if (packStage === "summary" && pulls.length) {
    const newCount=pulls.filter(p=>p.isNewCard).length;
    const convertedPulls=pulls.filter(p=>p.universePointsValue>0);
    const convertedUp=convertedPulls.reduce((sum,p)=>sum+(p.universePointsValue||0),0);
    const conversionRows=convertedPulls.map(p=>`<div class="up-conversion-row"><span><b>${p.card.name}</b> ×${p.ownershipBefore+1} → MAX ×${p.ownershipCap}</span><strong>+${p.universePointsValue} UP</strong></div>`).join('');
    packArea=`<section class="pack-summary-screen premium-pack-summary">
      <div class="pack-complete-hero"><span>PACK COMPLETE</span><h3>${newCount ? `${newCount} NEW CARD${newCount===1?'':'S'}` : 'COLLECTION UPDATED'}${convertedUp ? ` · +${convertedUp} UP` : ''}</h3><p>These are the five cards from your ${setInfo.displayName} pack.</p></div>
      <div class="pack-summary-grid pack-summary-pyramid">${summaryThumbs}</div>
      <div class="pack-summary-key"><span><b class="new-card-symbol">NEW</b> First time owned</span><span>Tap any card to flip it.</span></div>
      ${convertedUp?`<details class="universe-conversion-panel compact-conversion"><summary><span>EXCESS COPIES</span><b>3 copies converted · +${convertedUp} UP</b><small>Balance · ${profile.universePoints} UP</small></summary><div class="up-conversion-list">${conversionRows}</div></details>`:''}
      <div class="pack-summary-actions"><button id="review-pack-upgrades" class="start-match">Review Roster & Deck Upgrades</button><button id="finish-pack-summary" class="nav-button">Done</button></div>
    </section>`;
  } else if (packStage === "upgrades" && pulls.length) {
    const manual = profile.deckAssistance === "manual";
    packArea=`<section class="pack-summary-screen compact-summary">
      <div class="section-title"><div><span>PACK ACQUIRED</span><h3>Roster Construction</h3></div><span>Suggestions from these five cards</span></div>
      <div class="pack-summary-grid">${compactSummaryThumbs}</div>
    </section>
    <section class="upgrade-panel booster-modal-upgrades">
      <div class="section-title"><div><span>DECK ASSISTANCE</span><h3>${pendingUpgrades.length ? `${pendingUpgrades.length} upgrade${pendingUpgrades.length===1?'':'s'} found` : 'No safe upgrades found'}</h3></div><span>${profile.deckAssistance==='auto'?'Auto-upgrade applied':manual?'Manual mode · suggestions only':'Choose what to change'}</span></div>
      ${pendingUpgrades.length ? pendingUpgrades.map((u,i)=>`<article class="upgrade-row">
        <div class="upgrade-pull-thumb">${cardArtFace(u.pull.card)}</div>
        <div><b>${superstarById[u.superstarId]?.name}</b><span><strong>${u.pull.foil?'Foil ':''}${u.pull.card.name}</strong> can improve this roster deck.</span><small>${u.reason}</small></div>
        ${manual?'':`<div><button data-accept-upgrade="${i}" class="primary">Upgrade Deck</button><button data-decline-upgrade="${i}" class="secondary">Keep As-Is</button></div>`}
      </article>`).join('') : `<div class="no-upgrades-found"><b>Your collection still grew.</b><span>None of these five cards creates a safe automatic improvement to an unlocked Superstar deck right now.</span></div>`}
      <button id="finish-pack-review" class="start-match">Finish Pack & Return to Booster Vault</button>
    </section>`;
  }

  const totalSelectedPacks = standardCredits + ladderPacks + championshipPacks;
  const idlePack = standardCredits > 0
    ? `<section class="pack-opening-stage booster-vault-pack-stage"><button id="pack-wrapper" class="booster-pack ready ${packSetClass}">${brand}<span>${setInfo.name.toUpperCase()}</span><b>SERIES 1</b><small>SERIES 1 · 5 CARDS · 1 GUARANTEED FOIL</small><em>Tap to open</em></button></section>`
    : `<section class="pack-opening-stage booster-vault-pack-stage booster-empty-stage"><div class="booster-empty-state"><span>${totalSelectedPacks > 0 ? 'STANDARD BOOSTERS EMPTY' : 'NO PACKS AVAILABLE'}</span><h3>${totalSelectedPacks > 0 ? `Choose Ladder or Championship above` : `You have opened every ${setInfo.name} pack you currently own.`}</h3><p>${totalSelectedPacks > 0 ? 'Your earned special packs are still ready to open.' : 'Earn more packs through Challenges, Season rewards, Climb the Ladder or Championship Road.'}</p><button id="booster-empty-home" class="nav-button">Back to Main Menu</button></div></section>`;
  const tabs=Object.values(setCollections).filter(set=>set.id!=="season-1-final-boss").map(set=>`<button class="nav-button ${set.id===activeBoosterSetId?'active':''}" data-booster-set="${set.id}" ${packInProgress?'disabled':''}>${set.name} (${boosterCreditsFor(profile,set.id)})</button>`).join('');
  const setStarIds=cardsForSet(activeBoosterSetId).filter(c=>c.kind==='superstar').map(c=>c.superstarId), unlocked=setStarIds.filter(id=>hasSuperstar(profile,id)).length;
  const releaseHeadline = activeBoosterSetId === "summerslam-series-1" ? "CODY RHODES · BROCK LESNAR · ROMAN REIGNS" : activeBoosterSetId === "hall-of-fame-series-1" ? "HULK HOGAN · STONE COLD · THE UNDERTAKER" : "BECKY LYNCH · RHEA RIPLEY · CHARLOTTE FLAIR";
  document.body.dataset.set = activeBoosterSetId;

  const modal = packInProgress ? `<section class="booster-pack-modal ${setVisualClass(activeBoosterSetId)}" role="dialog" aria-modal="true" aria-label="${setInfo.name} pack opening">
    <div class="booster-pack-modal-shell">
      <div class="booster-pack-modal-head"><span>PACK OPENING</span><b>${setInfo.displayName}</b></div>
      ${message?`<p class="booster-modal-message">${message}</p>`:''}
      <div class="booster-pack-modal-body">${packArea}</div>
    </div>
  </section>` : "";

  root.innerHTML=`<section class="collection-screen booster-screen premium-screen ${setVisualClass(activeBoosterSetId)}">
    <section class="collection-hero booster-feature feature-hero booster-vault-hero">${modePortraits(setHeroSuperstars(activeBoosterSetId),"feature-art")}<div class="feature-shade"></div><div class="feature-copy">${modeLogoMarkup("boosters",true)}${setLogoMarkup(activeBoosterSetId,"feature-set-logo")}<span class="booster-live-label">SEASON 1 · NOW AVAILABLE</span><h2>${setInfo.displayName}</h2><h3 class="booster-release-headline">${releaseHeadline}</h3><p>Five cards per pack with <b>one guaranteed Foil</b>. Choose your set, then open your pack.</p><div class="mode-branch-tabs booster-set-tabs">${tabs}</div></div></section>
    <section class="booster-controls booster-primary-controls"><div class="booster-button-row"><button id="open-pack" class="start-match" ${standardCredits<1||packInProgress?'disabled':''}>${setInfo.name} (${standardCredits})</button><button id="open-ladder-pack" class="nav-button" ${ladderPacks<1||packInProgress?'disabled':''}>Ladder (${ladderPacks})</button><button id="open-championship-pack" class="nav-button" ${championshipPacks<1||packInProgress?'disabled':''}>Championship (${championshipPacks})</button></div></section>
    ${message&&!packInProgress?`<p class="setup-message">${message}</p>`:''}
    ${idlePack}
    <section class="booster-vault-lower"><div class="set-stats booster-vault-stats"><div class="set-stat"><b>${standardCredits}</b><span>${setInfo.name} packs</span></div><div class="set-stat"><b>${profile.packsOpenedBySet?.[activeBoosterSetId]??0}</b><span>Packs opened</span></div><div class="set-stat"><b>${unlocked}/${setInfo.superstarCount}</b><span>Set Superstars</span></div><div class="set-stat"><b>${profile.universePoints ?? 0} UP</b><span>Universe Points</span></div></div><label class="booster-assistance">Deck Assistance <select id="deck-assistance" ${packInProgress?'disabled':''}><option value="ask" ${profile.deckAssistance==='ask'?'selected':''}>Ask me</option><option value="auto" ${profile.deckAssistance==='auto'?'selected':''}>Auto-upgrade</option><option value="manual" ${profile.deckAssistance==='manual'?'selected':''}>Manual</option></select></label></section>
  </section>${modal}`;

  root.querySelectorAll('[data-booster-set]').forEach(btn=>btn.addEventListener('click',()=>{activeBoosterSetId=btn.dataset.boosterSet;lastPack=null;revealedPackCards=new Set();boosterRulesFlipped=new Set();boosterFocusIndex=0;pendingUpgrades=[];packStage='idle';message='';renderBoosters();}));
  $("#open-pack")?.addEventListener("click",()=>processPack("standard"));
  $("#open-ladder-pack")?.addEventListener("click",()=>processPack("ladder"));
  $("#open-championship-pack")?.addEventListener("click",()=>processPack("championship"));
  $("#pack-wrapper")?.addEventListener("click",()=>processPack("standard"));
  $("#deck-assistance")?.addEventListener("change",e=>{setDeckAssistance(profile,e.target.value);saveProfile(profile);message=`Deck Assistance set to ${e.target.options[e.target.selectedIndex].text}.`;renderBoosters();});
  root.querySelectorAll('[data-reveal-card]').forEach(btn=>btn.addEventListener('click',()=>revealPackCard(Number(btn.dataset.revealCard))));
  root.querySelectorAll('[data-booster-inspect]').forEach(btn=>btn.addEventListener('click',()=>{const i=Number(btn.dataset.boosterInspect);if(boosterRulesFlipped.has(i))boosterRulesFlipped.delete(i);else boosterRulesFlipped.add(i);renderBoosters();}));
  $("#next-pack-card")?.addEventListener("click", nextBoosterCard);
  $("#review-pack-upgrades")?.addEventListener("click", beginPackUpgradeReview);
  $("#finish-pack-summary")?.addEventListener("click", finishPackFlow);
  $("#finish-pack-review")?.addEventListener("click", finishPackFlow);
  $("#booster-empty-home")?.addEventListener("click", showMainMenu);
  root.querySelectorAll('[data-accept-upgrade]').forEach(btn=>btn.addEventListener('click',()=>acceptUpgrade(Number(btn.dataset.acceptUpgrade))));
  root.querySelectorAll('[data-decline-upgrade]').forEach(btn=>btn.addEventListener('click',()=>declineUpgrade(Number(btn.dataset.declineUpgrade))));
}


function formatCountdown(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return `${days}d ${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
}

function refreshSeasonClocks() {
  if (!profile) return;
  const remaining = seasonTimeRemaining(new Date());
  document.querySelectorAll('[data-season-countdown]').forEach(el => { el.textContent = remaining.ended ? 'Season complete' : formatCountdown(remaining.ms); });
  const free = freePackStatus(profile, new Date());
  document.querySelectorAll('[data-free-pack-countdown]').forEach(el => { el.textContent = free.available ? 'FREE PACK READY' : formatCountdown(free.msRemaining); });
  const next = nextRoadmapNode(new Date());
  const nextMs = Math.max(0, new Date(next.date).getTime() - Date.now());
  document.querySelectorAll('[data-next-drop-countdown]').forEach(el => { el.textContent = nextMs <= 0 ? 'LIVE' : formatCountdown(nextMs); });
  const claim = document.querySelector('#claim-free-pack');
  if (claim) { claim.disabled = !free.available; claim.textContent = free.available ? 'Claim Free Booster' : `Next Free Booster · ${formatCountdown(free.msRemaining)}`; }
  const store = storeRotation(new Date());
  document.querySelectorAll('[data-store-countdown]').forEach(el => { el.textContent = formatStoreCountdown(store.msRemaining); });
  const storeScreen = document.querySelector('[data-store-set]');
  if (screen === "store" && storeScreen && storeScreen.dataset.storeSet !== store.setId) { message = "The Daily Store refreshed."; renderStore(); }
}


function formatStoreCountdown(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return `${String(hours).padStart(2,"0")}:${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
}


function recommendedOwnedStatus(starId) {
  const draft = buildOwnedRecommendedDraft(profile, starId);
  const total = recommendedDeckDraft(starId).length;
  return { draft, total, owned: draft.length, missing: Math.max(0,total-draft.length) };
}
function renderRecommendedDeckPrompt() {
  if (!pendingDeckBuildSuperstarId || !pendingDeckBuildStep) return "";
  const star = superstarById[pendingDeckBuildSuperstarId];
  if (!star) return "";
  const status = recommendedOwnedStatus(star.id);
  const stage = pendingDeckBuildStep;
  return `<div class="deck-build-prompt" role="dialog" aria-modal="true"><div class="deck-build-prompt-card">
    <span class="premium-kicker">SUPERSTAR UNLOCKED</span><h2>${star.name}</h2><p>${stage==="offer"?"Build the recommended starter deck from the cards you already own?":`Recommended cards found: <b>${status.owned}/${status.total}</b>. ${status.missing} slot${status.missing===1?"":"s"} still need filling.`}</p>
    ${stage==="offer"?`<div class="deck-build-actions"><button id="build-recommended-owned" class="start-match">YES — BUILD DECK</button><button id="skip-recommended-owned" class="nav-button">NOT NOW</button></div>`:`<div class="deck-build-meter"><span style="width:${status.total?Math.round(status.owned/status.total*100):0}%"></span></div><div class="deck-build-actions"><button id="auto-fill-recommended" class="start-match">AUTO FILL GAPS</button><button id="manual-fill-recommended" class="nav-button">FILL MANUALLY</button><button id="finish-partial-recommended" class="nav-button">KEEP PARTIAL DECK</button></div>`}
  </div></div>`;
}
function wireRecommendedDeckPrompt() {
  $("#build-recommended-owned")?.addEventListener("click",()=>{ const sid=pendingDeckBuildSuperstarId; profile.savedDecks ??= {}; profile.savedDecks[sid]=buildOwnedRecommendedDraft(profile,sid); saveProfile(profile); pendingDeckBuildStep="fill"; renderStore(); });
  $("#skip-recommended-owned")?.addEventListener("click",()=>{pendingDeckBuildSuperstarId=null;pendingDeckBuildStep=null;renderStore();});
  $("#auto-fill-recommended")?.addEventListener("click",()=>{ const sid=pendingDeckBuildSuperstarId; profile.savedDecks[sid]=autoFillOwnedDraft(profile,sid,profile.savedDecks[sid]??[]); saveProfile(profile); const st=recommendedOwnedStatus(sid); message=st.missing?`Auto Fill used every legal owned option available. ${st.missing} recommended slots remain unavailable.`:`${superstarById[sid].name}'s deck is ready.`; pendingDeckBuildSuperstarId=null;pendingDeckBuildStep=null;renderStore(); });
  $("#manual-fill-recommended")?.addEventListener("click",()=>{ const sid=pendingDeckBuildSuperstarId; pendingDeckBuildSuperstarId=null;pendingDeckBuildStep=null;showDeckBuilder(sid); });
  $("#finish-partial-recommended")?.addEventListener("click",()=>{pendingDeckBuildSuperstarId=null;pendingDeckBuildStep=null;renderStore();});
}

function renderStore() {
  setChrome();
  const root = $("#game");
  const now = new Date();
  const rotation = storeRotation(now);
  const setInfo = setCollections[rotation.setId] ?? sets[rotation.setId];
  const stars = storeSuperstars(rotation.setId);
  const balance = profile.universePoints ?? 0;
  const starRows = stars.map(star => {
    const owned = hasSuperstar(profile, star.id);
    return `<article class="store-superstar-card shop-star-card ${owned?'owned':''}">
      <button type="button" class="store-superstar-art" data-store-inspect-star="${star.id}">${portraitMarkup(star.id,star.name)}</button>
      <div class="store-superstar-copy"><span>${owned?'OWNED':'SUPERSTAR UNLOCK'}</span><h3>${star.name}</h3><small>${star.nickname ?? ''}</small><p>Unlock the Superstar and Entrance. Build the recommended deck from cards you actually own.</p></div>
      <button class="${owned?'nav-button':'start-match'}" data-buy-store-star="${star.id}" ${owned||balance<STORE_SUPERSTAR_PRICE?'disabled':''}>${owned?'Owned':`${STORE_SUPERSTAR_PRICE.toLocaleString()} UP`}</button>
    </article>`;
  }).join('');
  root.innerHTML=`<section class="store-screen premium-screen" data-store-set="${rotation.setId}">
    <section class="feature-hero store-feature">${modePortraits(stars.slice(0,3).map(s=>s.id),"feature-art")}<div class="feature-shade"></div><div class="feature-copy">${setLogoMarkup(rotation.setId,"feature-set-logo")}<span class="premium-kicker">DAILY STORE</span><h2>${setInfo?.displayName ?? setInfo?.name ?? rotation.setId}</h2><p>Spend Universe Points on guaranteed roster progress. The featured set rotates every 24 hours.</p></div><div class="store-balance-card"><span>UNIVERSE POINTS</span><b>${balance.toLocaleString()} UP</b><small>Never expires</small></div></section>
    <button id="store-refresh-strip" class="store-led-strip"><span>STORE REFRESHES IN</span><strong data-store-countdown>${formatStoreCountdown(rotation.msRemaining)}</strong><small>${setInfo?.name ?? rotation.setId} · Daily rotation</small></button>
    ${message?`<p class="setup-message">${message}</p>`:''}
    <section class="store-booster-offer card-shop-counter premium-panel"><div class="shop-pack-display"><div class="booster-pack shop-pack ${`pack-set-${rotation.setId}`}">${setLogoMarkup(rotation.setId,"pack-set-logo")}<span>${(setInfo?.name ?? "WWE LEGACY").toUpperCase()}</span><b>SERIES 1</b><small>5 CARDS · 1 GUARANTEED FOIL</small></div></div><div class="store-offer-copy"><span>FEATURED BOOSTER</span><h3>${setInfo?.displayName ?? setInfo?.name ?? rotation.setId}</h3><p>Take a sealed pack off today’s featured shelf and add it to your Booster Vault.</p><div class="store-offer-price"><b>${STORE_BOOSTER_PRICE} UP</b><button id="buy-store-booster" class="start-match" ${balance<STORE_BOOSTER_PRICE?'disabled':''}>BUY PACK</button></div></div></section>
    <section class="store-roster-section"><div class="section-title"><div><span>SUPERSTAR SHELF</span><h3>${stars.length} Featured Superstars</h3></div><span>${STORE_SUPERSTAR_PRICE.toLocaleString()} UP each</span></div><p class="store-roster-note">Unlock a Superstar and their Entrance. Their recommended deck is assembled only from cards in your Collection; missing slots can be filled manually or with Auto Fill.</p><div class="store-superstar-shelf">${starRows}</div></section>
  </section>${renderRecommendedDeckPrompt()}`;
  $("#buy-store-booster")?.addEventListener("click",()=>{ try { const result=purchaseStoreBooster(profile,rotation.setId,new Date()); saveProfile(profile); message=`${setInfo?.name ?? 'Featured'} booster purchased for ${result.price} UP. ${result.balance} UP remaining.`; } catch(e){message=e.message;} renderStore(); });
  root.querySelectorAll('[data-buy-store-star]').forEach(btn=>btn.addEventListener('click',()=>{ try { const star=superstarById[btn.dataset.buyStoreStar]; const result=purchaseStoreSuperstar(profile,btn.dataset.buyStoreStar,new Date()); saveProfile(profile); message=`${star.name} unlocked for ${result.price.toLocaleString()} UP.`; pendingDeckBuildSuperstarId=star.id; pendingDeckBuildStep="offer"; } catch(e){message=e.message;} renderStore(); }));
  wireRecommendedDeckPrompt();
  refreshSeasonClocks();
}

function renderSeasons() {
  setChrome();
  const root = $("#game");
  const state = seasonState(profile);
  const progress = seasonLevelProgress(profile);
  const remaining = seasonTimeRemaining(new Date());
  const free = freePackStatus(profile, new Date());
  const next = nextRoadmapNode(new Date());
  const claimable = Array.from({length: progress.tier}, (_,i)=>i+1).filter(t => !state.claimedTiers.includes(t));
  const roadmap = SEASON_1.roadmap.map((node, index) => {
    const status = roadmapNodeStatus(node, new Date());
    const slots = node.type === 'launch' ? `${node.superstarCount} playable Superstars` : `${node.superstarCount} Superstar ${node.type === 'season' ? 'set' : 'subset'}`;
    return `<article class="season-roadmap-node ${status} ${node.type}">
      <div class="roadmap-marker"><span>${index + 1}</span></div>
      <div class="roadmap-copy"><div class="roadmap-meta"><b>${node.dateLabel}</b><em>${node.kicker}</em></div><h3>${node.title}</h3><p>${node.description}</p><small>${slots}</small></div>
    </article>`;
  }).join('');
  const tierRoad = Array.from({length: SEASON_TIER_COUNT}, (_, i) => i + 1).map(tier => {
    const reward = tierReward(tier), reached = tier <= progress.tier, claimed = state.claimedTiers.includes(tier), current = tier === Math.min(SEASON_TIER_COUNT, progress.tier + 1);
    const setName = reward.kind === "booster" ? (sets[reward.setId]?.name ?? reward.setId) : "";
    const rewardTitle = reward.kind === "full-deck-superstar" ? `THE ROCK · FULL DECK SUPERSTAR` : reward.kind === "universe-points" ? `${reward.amount} UNIVERSE POINTS` : `${reward.amount}× ${setName} Booster${reward.amount === 1 ? '' : 's'}`;
    const rewardSub = reward.kind === "full-deck-superstar" ? `SEASON 1 COMPLETION EXCLUSIVE · The Final Boss` : reward.kind === "universe-points" ? `STORE CURRENCY · ${tier * XP_PER_TIER} XP milestone` : `${tier * XP_PER_TIER} XP milestone`;
    return `<article class="season-tier ${reached ? 'reached' : ''} ${claimed ? 'claimed' : ''} ${current ? 'current' : ''} ${reward.kind === 'full-deck-superstar' ? 'season-final-reward' : ''}">
      <div class="season-tier-number"><span>TIER</span><b>${tier}</b></div>
      <div class="season-tier-reward"><strong>${rewardTitle}</strong><small>${rewardSub}</small></div>
      ${claimed ? '<button disabled>Claimed</button>' : reached ? `<button class="primary" data-claim-season-tier="${tier}">Claim</button>` : '<button disabled>Locked</button>'}
    </article>`;
  }).join('');
  root.innerHTML = `<section class="seasons-screen premium-screen">
    <section class="feature-hero seasons-feature season-final-boss-hero">${modePortraits(["the-rock","cody-rhodes","rhea-ripley"],"feature-art")}<div class="feature-shade"></div><div class="feature-copy">${modeLogoMarkup("seasons")}${setLogoMarkup("season-1-final-boss","feature-set-logo rewards-set-logo")}<span class="season-live-label">SEASON 1 · LIVE NOW</span><h2>THE ROAD TO THE FINAL BOSS</h2><p>Every match, challenge and booster moves your Legacy toward Tier 50. Reach Tier 50 to unlock The Rock — Final Boss and his complete Season 1 reward deck.</p><div class="season-hero-actions"><button id="season-challenges" class="nav-button">Challenges</button><button id="season-boosters" class="nav-button">Boosters</button></div></div><div class="season-countdown-card"><span>SEASON ENDS · 28 NOV 2026</span><b data-season-countdown>${remaining.ended ? 'Season complete' : formatCountdown(remaining.ms)}</b><small>Season 2 · Survivor Series</small></div></section>
    ${message ? `<p class="setup-message">${message}</p>` : ''}
    <section class="season-live-releases">
      <div class="section-title"><h3>Season 1 · Featured Releases</h3><span>Build the launch roster while you chase The Final Boss</span></div>
      <div class="season-release-grid">
        <button data-season-booster-set="summerslam-series-1">${setLogoMarkup("summerslam-series-1","season-set-logo")}<em>SUMMERSLAM — SERIES 1</em>${modePortraits(["cody-rhodes","brock-lesnar","roman-reigns"],"season-release-art")}<strong>Cody · Brock · Roman</strong><span>NOW IN BOOSTERS →</span></button>
        <button data-season-booster-set="hall-of-fame-series-1">${setLogoMarkup("hall-of-fame-series-1","season-set-logo")}<em>HALL OF FAME — SERIES 1</em>${modePortraits(["hulk-hogan","stone-cold-steve-austin","the-undertaker"],"season-release-art")}<strong>Hogan · Stone Cold · Undertaker</strong><span>NOW IN BOOSTERS →</span></button>
        <button data-season-booster-set="evolution-series-1">${setLogoMarkup("evolution-series-1","season-set-logo")}<em>EVOLUTION — SERIES 1</em>${modePortraits(["becky-lynch","rhea-ripley","charlotte-flair"],"season-release-art")}<strong>Becky · Rhea · Charlotte</strong><span>NOW IN BOOSTERS →</span></button>
      </div>
    </section>
    <section class="season-progress-panel">
      <div class="season-tier-summary"><div><span>CURRENT TIER</span><b>${progress.tier}/${SEASON_TIER_COUNT}</b></div><div><span>SEASON XP</span><b>${progress.xp}/${SEASON_TIER_COUNT * XP_PER_TIER}</b></div><div><span>UNIVERSE POINTS</span><b>${profile.universePoints ?? 0} UP</b></div><div><span>NEXT DROP</span><b>${next.title}</b><small data-next-drop-countdown></small></div></div>
      <div class="season-xp-track"><i style="width:${Math.min(100,(progress.xp/(SEASON_TIER_COUNT*XP_PER_TIER))*100)}%"></i></div>
      <div class="season-xp-caption"><span>${progress.tier >= SEASON_TIER_COUNT ? 'Season Road complete' : `${progress.intoTier}/${XP_PER_TIER} XP toward Tier ${progress.tier + 1}`}</span><span>Win ${MATCH_XP.win} XP · Loss/Draw ${MATCH_XP.loss} XP · Daily 50 XP · Weekly 200 XP</span></div>
    </section>
    <section class="free-pack-panel ${free.available ? 'ready' : ''}">
      <div class="free-pack-icon"><span>24H</span><b>FREE</b></div><div class="free-pack-copy"><span>DAILY LOGIN BOOSTER</span><h3>${free.available ? 'Your free booster is ready' : 'Next free booster is counting down'}</h3><p>Claim one booster from a currently Featured Season 1 set every rolling 24 hours. Miss a day and nothing is lost — one pack simply waits for you.</p><small data-free-pack-countdown>${free.available ? 'FREE PACK READY' : formatCountdown(free.msRemaining)}</small></div><button id="claim-free-pack" class="start-match" ${free.available ? '' : 'disabled'}>${free.available ? 'Claim Free Booster' : `Next Free Booster · ${formatCountdown(free.msRemaining)}`}</button>
    </section>
    <section class="season-section"><div class="section-title"><h3>Season 1 Content Roadmap</h3><span>Launch → Worlds Collide → Money in the Bank → Survivor Series</span></div><div class="season-roadmap">${roadmap}</div><div class="season-rotation-note"><b>Season 2 Rotation Preview</b><span>Owned cards never disappear and remain playable.</span>${SEASON_1.rotationPreview.map(item=>`<small><strong>${sets[item.setId]?.displayName ?? item.setId}</strong> · ${item.from.toUpperCase()} → ${item.to.toUpperCase()} · ${item.note}</small>`).join('')}</div></section>
    <section class="season-section"><div class="section-title"><h3>50-Tier Season Road</h3><span>${claimable.length ? `${claimable.length} reward${claimable.length===1?'':'s'} ready` : 'Earn XP to unlock rewards'}</span></div>${claimable.length ? '<button id="claim-all-season" class="primary season-claim-all">Claim All Available</button>' : ''}<div class="season-tier-road">${tierRoad}</div></section>
  </section>`;
  $("#season-challenges")?.addEventListener("click", showChallenges);
  $("#season-boosters")?.addEventListener("click", showBoosters);
  root.querySelectorAll("[data-season-booster-set]").forEach(btn => btn.addEventListener("click", () => {
    activeBoosterSetId = btn.dataset.seasonBoosterSet;
    lastPack = null; packStage = "idle"; revealedPackCards.clear(); boosterFocusIndex = 0;
    screen = "boosters"; renderBoosters();
  }));
  $("#claim-free-pack")?.addEventListener("click", () => {
    try { const reward = claimFreeSeasonBooster(profile, Math.random, new Date()); saveProfile(profile); message = `Free ${sets[reward.setId]?.displayName ?? reward.setId} booster claimed. It is waiting in Boosters.`; }
    catch (e) { message = e.message; }
    renderSeasons();
  });
  root.querySelectorAll('[data-claim-season-tier]').forEach(btn => btn.addEventListener('click', () => {
    try {
      const reward = claimSeasonTier(profile, Number(btn.dataset.claimSeasonTier)); saveProfile(profile);
      if (reward.kind === "universe-points") message = `Tier ${reward.tier} claimed: +${reward.amount} Universe Points · ${profile.universePoints} UP balance.`;
      else if (reward.kind === "full-deck-superstar") message = `Tier ${reward.tier} claimed: The Final Boss unlocked with his complete deck.`;
      else message = `Tier ${reward.tier} claimed: +${reward.amount} ${sets[reward.setId]?.name ?? reward.setId} booster${reward.amount===1?'':'s'}.`;
    } catch (e) { message = e.message; }
    renderSeasons();
  }));
  $("#claim-all-season")?.addEventListener("click", () => {
    try {
      const rewards = claimAllSeasonTiers(profile); saveProfile(profile);
      const boosters = rewards.filter(r=>r.kind==="booster").reduce((n,r)=>n+r.amount,0);
      const up = rewards.filter(r=>r.kind==="universe-points").reduce((n,r)=>n+r.amount,0);
      const finalBoss = rewards.some(r=>r.kind==="full-deck-superstar");
      message = `${rewards.length} Season reward${rewards.length===1?'':'s'} claimed${boosters?` · ${boosters} booster${boosters===1?'':'s'}`:''}${up?` · +${up} UP`:''}${finalBoss?' · The Final Boss unlocked':''}.`;
    } catch (e) { message = e.message; }
    renderSeasons();
  });
  refreshSeasonClocks();
}

function renderChallenges() {
  const root = $("#game");
  const challenges = challengeState(profile);
  const setRows = Object.values(setCollections).map(set => {
    const progress = collectionProgress(profile, set.id);
    const state = setProgressState(profile, set.id);
    const rewards = availableMilestoneRewards(profile, set.id);
    return { set, progress, state, rewards };
  });
  const challengeCard = (c, group) => {
    const complete = (c.progress ?? 0) >= c.target;
    return `<article class="challenge-card ${complete ? 'complete' : ''} ${c.claimed ? 'claimed' : ''}"><span>${group}</span><h3>${c.label}</h3><div class="challenge-progress"><i style="width:${Math.min(100, ((c.progress??0)/c.target)*100)}%"></i></div><p><b>${c.progress ?? 0}/${c.target}</b> · ${c.xpReward ?? (group === 'WEEKLY' ? 200 : 50)} Season XP · ${c.reward} SummerSlam booster${c.reward===1?'':'s'}</p>${c.claimed ? '<button disabled>Claimed</button>' : complete ? `<button class="primary" data-claim-challenge="${c.id}">Claim Reward</button>` : '<button disabled>In progress</button>'}</article>`;
  };
  const milestone = (setId, setName, m, type) => `<article class="milestone-row"><div><b>${setName} · ${type === 'foil' ? 'Foil' : 'Collection'} ${m.percent}%</b><span>Reward: ${m.reward} ${setName} booster${m.reward===1?'':'s'}</span></div><button class="primary" data-claim-milestone="${setId}:${type}:${m.percent}">Claim</button></article>`;
  const milestoneSections = setRows.map(({set,progress,state,rewards}) => `<section class="challenge-section"><div class="section-title"><h3>${set.displayName} Milestones</h3><span>${progress.ownedUnique}/${progress.total} unique · ${progress.foilUnique}/${progress.total} Foil · ${state.lifecycle.toUpperCase()}</span></div><div class="milestone-grid">${[...rewards.collection.map(m=>milestone(set.id,set.name,m,'collection')),...rewards.foil.map(m=>milestone(set.id,set.name,m,'foil'))].join('') || '<p class="collection-empty">Your next collection rewards are still in progress.</p>'}</div></section>`).join('');
  const challengeSetStats = setRows.map(({set,progress})=>`<div class="set-stat challenge-set-stat"><b>${boosterCreditsFor(profile,set.id)} pack${boosterCreditsFor(profile,set.id)===1?'':'s'} · ${progress.percent??0}%</b><span>${set.name} collection</span></div>`).join('');
  root.innerHTML = `<section class="challenges-screen premium-screen"><section class="feature-hero challenges-feature">${modePortraits(["becky-lynch","kevin-owens"],"feature-art")}<div class="feature-shade"></div><button id="challenge-main-menu" class="challenge-home-button">← MAIN MENU</button><div class="feature-copy">${modeLogoMarkup("challenges",true)}<h2>Challenges & Set Progress</h2><p>Complete rotating goals across Exhibition, Climb the Ladder, Championship Road and Booster Packs. Collection milestones are tracked separately for every set and reward boosters from that same set.</p></div><div class="set-stats challenge-set-stats">${challengeSetStats}</div></section>${message ? `<p class="setup-message">${message}</p>` : ''}<section class="challenge-section"><div class="section-title"><h3>Daily Challenges</h3><span>3 rotating goals</span></div><div class="challenge-grid">${challenges.daily.map(c=>challengeCard(c,'DAILY')).join('')}</div></section><section class="challenge-section"><div class="section-title"><h3>Weekly Challenges</h3><span>3 larger goals</span></div><div class="challenge-grid">${challenges.weekly.map(c=>challengeCard(c,'WEEKLY')).join('')}</div></section>${milestoneSections}<section class="set-lifecycle-card"><span>SET ROTATION FRAMEWORK</span><h3>Featured → Vaulted → Returning</h3><p>Each collection has an independent lifecycle. Vaulting one set removes it from standard boosters without affecting ownership or cross-set deck building; it can later return through event or Legacy packs.</p></section></section>`;
  root.querySelectorAll('[data-claim-challenge]').forEach(btn=>btn.addEventListener('click',()=>{ try { const reward=claimChallenge(profile,btn.dataset.claimChallenge); saveProfile(profile); message=`Challenge claimed: +${reward} SummerSlam booster${reward===1?'':'s'} and Season XP.`; } catch(e){ message=e.message; } renderChallenges(); }));
  root.querySelectorAll('[data-claim-milestone]').forEach(btn=>btn.addEventListener('click',()=>{ try { const [setId,type,pct]=btn.dataset.claimMilestone.split(':'); const reward=claimMilestone(profile,type,Number(pct),setId); saveProfile(profile); message=`${setCollections[setId]?.name??setId} ${type==='foil'?'Foil':'Collection'} milestone claimed: +${reward} booster${reward===1?'':'s'}.`; } catch(e){ message=e.message; } renderChallenges(); }));
  $("#challenge-main-menu")?.addEventListener("click", showMainMenu);
}

function beginLadderRun() {
  const starId = selection.p1;
  if (!hasSuperstar(profile, starId)) { message = "Choose an unlocked Superstar."; renderLadder(); return; }
  const branch = LADDER_BRANCHES[ladderBranchId] ?? LADDER_BRANCHES.modern;
  const opponents = rosterForBranch(branch).map(s => s.id);
  startLadderRun(profile, starId, opponents, Math.random, branch.id);
  saveProfile(profile);
  startCurrentLadderMatch();
}

function startCurrentLadderMatch() {
  const run = ladderState(profile).activeRun;
  const opponentId = currentLadderOpponent(profile);
  if (!run || run.status !== "active" || !opponentId) { showLadder(); return; }
  startMatch(run.superstarId, opponentId, { mode: "ladder" });
}

function renderLadder() {
  setChrome();
  const root=$("#game"), ladder=ladderState(profile), run=ladder.activeRun, active=run?.status==='active';
  const branch=LADDER_BRANCHES[ladderBranchId]??Object.values(LADDER_BRANCHES)[0];
  const totalRungs=rosterForBranch(branch).length;
  const unlocked=orderedUnlockedSuperstars();
  const chosenId=active?run.superstarId:(unlocked.some(s=>s.id===selection.p1)?selection.p1:unlocked[0]?.id); if(chosenId) selection.p1=chosenId;
  const tabs=Object.values(LADDER_BRANCHES).map(b=>`<button class="branch-chip ${b.id===ladderBranchId?'active':''}" data-ladder-branch="${b.id}" ${active?'disabled':''}>${b.label.replace(' — Series 1','')}</button>`).join('');
  const lives=run?.lives??LADDER_LIVES;
  const ladderRows=active?run.opponents.map((id,index)=>{const star=superstarById[id],state=index<run.rung?'cleared':index===run.rung?'current':'upcoming';return `<div class="ladder-rung ${state}"><span>${index+1}</span><div class="ladder-portrait">${portraitMarkup(id,star.name)}</div><div><b>${star.name}</b><small>${state==='cleared'?'Defeated':state==='current'?'Next opponent':'Waiting'}</small></div></div>`}).join(''):'';
  const statusText=run?.status==='cleared'?`${branch.label} cleared!`:active?`Rung ${run.rung+1} · ${superstarById[currentLadderOpponent(profile)]?.name}`:`Defeat every ${branch.label} opponent consecutively.`;
  root.innerHTML=`<section class="ladder-screen premium-screen compact-mode-run"><section class="feature-hero ladder-feature single-feature-hero">${modePortraits([chosenId],"feature-art")}<div class="feature-shade"></div><div class="feature-copy">${modeLogoMarkup("ladder")}<p>Three lives. Choose a path, choose an owned Superstar, then survive the run.</p><div class="horizontal-branch-selector">${tabs}</div></div><div class="ladder-summary"><div><b>${ladder.clearsByBranch?.[branch.id]??0}</b><span>${branch.label} clears</span></div><div><b>${ladder.bestRungByBranch?.[branch.id]??0}/${totalRungs}</b><span>Best rung</span></div><div><b>${'●'.repeat(lives)}${'○'.repeat(LADDER_LIVES-lives)}</b><span>Lives</span></div><div><b>${ladder.completionPackCreditsBySet?.[branch.setId]??0}</b><span>${sets[branch.setId]?.name} packs</span></div></div></section><p class="setup-message">${message||statusText}</p>${!active?`<section class="ladder-picker horizontal-selector"><h3>Choose your Superstar</h3>${selectionCarouselMarkup(unlocked,chosenId,'ladder-select')}<button id="start-ladder" class="start-match">Confirm & Start ${branch.label.replace(' — Series 1','')} Run</button></section>`:`<section class="ladder-current"><div><span>PATH</span><strong>${branch.label}</strong></div><div><span>YOUR SUPERSTAR</span><strong>${superstarById[run.superstarId].name}</strong></div><div><span>NEXT RUNG</span><strong>${run.rung+1}/${run.opponents.length} · ${superstarById[currentLadderOpponent(profile)].name}</strong></div><button id="continue-ladder" class="start-match">Fight Rung ${run.rung+1}</button></section>`}${ladderRows?`<section class="ladder-stack">${ladderRows}</section>`:''}${run&&run.status!=='active'?`<button id="new-ladder" class="start-match">Start Another Run</button>`:''}</section>`;
  root.querySelectorAll('[data-ladder-branch]').forEach(btn=>btn.addEventListener('click',()=>{ladderBranchId=btn.dataset.ladderBranch;message='';renderLadder();}));
  wireSelectionCarousel('ladder-select', id=>{selection.p1=id;renderLadder();});
  $("#start-ladder")?.addEventListener("click",beginLadderRun); $("#continue-ladder")?.addEventListener("click",startCurrentLadderMatch); $("#new-ladder")?.addEventListener("click",()=>{ladder.activeRun=null;saveProfile(profile);renderLadder();});
}


function beginChampionshipRoad() {
  const starId=selection.p1;
  if(!hasSuperstar(profile,starId)){message="Choose an unlocked Superstar.";renderChampionship();return;}
  const branch=CHAMPIONSHIP_BRANCHES[championshipBranchId]??CHAMPIONSHIP_BRANCHES.modern;
  startChampionshipRoad(profile,starId,rosterForBranch(branch).map(s=>s.id),Math.random,branch.id);
  saveProfile(profile);startCurrentChampionshipMatch();
}
function startCurrentChampionshipMatch(){const run=championshipRoadState(profile).activeRun,opponentId=currentChampionshipOpponent(profile);if(!run||run.status!=="active"||!opponentId){showChampionship();return;}startMatch(run.superstarId,opponentId,{mode:"championship"});}
function renderChampionship(){
  setChrome();
  const root=$("#game"),road=championshipRoadState(profile),run=road.activeRun,active=run?.status==='active',branch=CHAMPIONSHIP_BRANCHES[championshipBranchId]??Object.values(CHAMPIONSHIP_BRANCHES)[0];
  const unlocked=orderedUnlockedSuperstars();
  const chosenId=active?run.superstarId:(unlocked.some(s=>s.id===selection.p1)?selection.p1:unlocked[0]?.id);if(chosenId)selection.p1=chosenId;
  const tabs=Object.values(CHAMPIONSHIP_BRANCHES).map(b=>`<button class="branch-chip ${b.id===championshipBranchId?'active':''}" data-champ-branch="${b.id}" ${active?'disabled':''}>${b.label.replace(' — Series 1','')}</button>`).join('');
  const routeRows=active?run.opponents.map((id,index)=>{const star=superstarById[id],state=index<run.stage?'cleared':index===run.stage?'current':'upcoming';return `<div class="ladder-rung ${state}"><span>${index+1}</span><div class="ladder-portrait">${portraitMarkup(id,star.name)}</div><div><b>${CHAMPIONSHIP_STAGES[index]}</b><small>${star.name} · ${state==='cleared'?'Defeated':state==='current'?'Next match':'Waiting'}</small></div></div>`}).join(''):'';
  const completed=road.completedByBranch?.[branch.id]?.length??0;
  const status=run?.status==='cleared'?`${branch.label} Championship Road cleared!`:active?`${CHAMPIONSHIP_STAGES[run.stage]} · ${superstarById[currentChampionshipOpponent(profile)]?.name}`:`Win four matches on the ${branch.label} road.`;
  root.innerHTML=`<section class="ladder-screen championship-screen premium-screen compact-mode-run"><section class="feature-hero championship-feature single-feature-hero">${modePortraits([chosenId],"feature-art")}<div class="feature-shade"></div><div class="feature-copy">${modeLogoMarkup("championship")}<p>Choose a road and an owned Superstar. Four matches lead to the title.</p><div class="horizontal-branch-selector">${tabs}</div></div><div class="ladder-summary"><div><b>${road.clearsByBranch?.[branch.id]??0}</b><span>${branch.label} clears</span></div><div><b>${road.bestStageByBranch?.[branch.id]??0}/4</b><span>Best stage</span></div><div><b>${completed}/${Object.values(superstars).length}</b><span>Superstar clears</span></div><div><b>${road.championshipPackCreditsBySet?.[branch.setId]??0}</b><span>${sets[branch.setId]?.name} packs</span></div></div></section><p class="setup-message">${message||status}</p>${!active?`<section class="ladder-picker horizontal-selector"><h3>Choose your Superstar</h3>${selectionCarouselMarkup(unlocked,chosenId,'champ-select',star=>road.completedByBranch?.[branch.id]?.includes(star.id)?'ROAD CLEARED':'READY')}<button id="start-championship" class="start-match">Confirm & Start ${branch.label.replace(' — Series 1','')} Road</button></section>`:`<section class="ladder-current"><div><span>ROAD</span><strong>${branch.label}</strong></div><div><span>YOUR SUPERSTAR</span><strong>${superstarById[run.superstarId].name}</strong></div><div><span>NEXT MATCH</span><strong>${run.stage+1}/4 · ${CHAMPIONSHIP_STAGES[run.stage]} · ${superstarById[currentChampionshipOpponent(profile)].name}</strong></div><button id="continue-championship" class="start-match">Fight ${CHAMPIONSHIP_STAGES[run.stage]}</button></section>`}${routeRows?`<section class="ladder-stack">${routeRows}</section>`:''}${run&&run.status!=='active'?`<button id="new-championship" class="start-match">Start Another Road</button>`:''}</section>`;
  root.querySelectorAll('[data-champ-branch]').forEach(btn=>btn.addEventListener('click',()=>{championshipBranchId=btn.dataset.champBranch;message='';renderChampionship();}));
  wireSelectionCarousel('champ-select', id=>{selection.p1=id;renderChampionship();});
  $("#start-championship")?.addEventListener("click",beginChampionshipRoad);$("#continue-championship")?.addEventListener("click",startCurrentChampionshipMatch);$("#new-championship")?.addEventListener("click",()=>{resetChampionshipRoad(profile);saveProfile(profile);renderChampionship();});
}



function legacyLogoMarkup(compact = false, showVersion = false) {
  return `<div class="legacy-logo ${compact ? "compact" : ""}" aria-label="WWE Legacy Collectible Card Game">
    <span class="legacy-wwe">WWE</span>
    <span class="legacy-word">LEGACY</span>
    <span class="legacy-subtitle">COLLECTIBLE CARD GAME</span>
    ${showVersion ? `<span class="legacy-version">v${BUILD_VERSION}</span>` : ""}
  </div>`;
}

function modeLogoMarkup(mode, compact = false) {
  const modes = {
    exhibition: { kicker: "ONE NIGHT · ONE MATCH", top: "EXHIBITION", bottom: "SHOWCASE" },
    ladder: { kicker: "SURVIVE THE RUN", top: "CLIMB THE", bottom: "LADDER" },
    championship: { kicker: "FOUR FIGHTS · ONE TITLE", top: "CHAMPIONSHIP", bottom: "ROAD" },
    seasons: { kicker: "LIVE CONTENT · 110 DAYS", top: "LEGACY", bottom: "SEASONS" },
    challenges: { kicker: "DAILY · WEEKLY · MILESTONES", top: "LIVE", bottom: "CHALLENGES" },
    collection: { kicker: `${collectionCards.length} CARDS · ${Object.keys(setCollections).length} SETS`, top: "THE", bottom: "COLLECTION" },
    boosters: { kicker: "RIP · REVEAL · COLLECT", top: "BOOSTER", bottom: "VAULT" },
    decks: { kicker: "BUILD · TUNE · COMPETE", top: "DECK", bottom: "LAB" },
    profile: { kicker: "YOUR CAREER · YOUR CARDS", top: "MY", bottom: "LEGACY" }
  };
  const m = modes[mode] ?? modes.exhibition;
  return `<div class="mode-logo mode-logo-${mode} ${compact ? "compact" : ""}" aria-label="${m.top} ${m.bottom}"><small>${m.kicker}</small><span>${m.top}</span><strong>${m.bottom}</strong></div>`;
}

function modePortraits(ids = [], cls = "") {
  return `<div class="mode-portrait-stack ${cls}">${ids.filter(Boolean).map((id,index)=>`<div class="mode-portrait p${index+1}">${portraitMarkup(id,superstarById[id]?.name ?? id)}</div>`).join("")}</div>`;
}

function orderedUnlockedSuperstars(excludeId = null) {
  const fav = new Set(profile?.favouriteSuperstars ?? []);
  return (profile?.unlockedSuperstars ?? []).map(id => superstarById[id]).filter(Boolean).filter(star => star.id !== excludeId).sort((a,b) => {
    const fd = Number(fav.has(b.id)) - Number(fav.has(a.id));
    return fd || a.name.localeCompare(b.name);
  });
}

function selectionCarouselMarkup(stars, selectedId, context, labelFor = null) {
  const fav = new Set(profile?.favouriteSuperstars ?? []);
  return `<div class="superstar-select-carousel" data-carousel="${context}">${stars.map(star => {
    const key = `${context}:${star.id}`;
    const flipped = selectDetailKeys.has(key);
    return `<button type="button" class="select-superstar-card ${star.id===selectedId?'selected':''} ${flipped?'is-flipped':''}" data-select-context="${context}" data-select-star="${star.id}" aria-label="${star.name}. Tap for details."><span class="select-card-inner"><span class="select-card-face select-card-front"><span class="select-favourite">${fav.has(star.id)?'★':''}</span>${portraitMarkup(star.id,star.name)}</span><span class="select-card-face select-card-back"><strong>${star.name}</strong><span>${star.nickname}</span><b>${star.hp} HP</b><small>${star.archetype.replaceAll('-', ' ')}</small><em>${star.ability?.name ?? ''}</em><p>${star.ability?.text ?? ''}</p><i>TAP AGAIN FOR CARD</i></span></span></button>`;
  }).join('')}</div>`;
}

function wireSelectionCarousel(context, onPick) {
  document.querySelectorAll(`[data-select-context="${context}"]`).forEach(btn => btn.addEventListener('click', () => {
    const key = `${context}:${btn.dataset.selectStar}`;
    const wasSelected = btn.classList.contains('selected');
    if (wasSelected && selectDetailKeys.has(key)) selectDetailKeys.delete(key); else selectDetailKeys.add(key);
    onPick(btn.dataset.selectStar);
  }));
}

function setVisualClass(setId) {
  if (setId === "hall-of-fame-series-1") return "theme-hof";
  if (setId === "evolution-series-1") return "theme-evolution";
  return "theme-summerslam";
}

function setHeroSuperstars(setId) {
  if (setId === "hall-of-fame-series-1") return ["stone-cold-steve-austin", "the-undertaker", "hulk-hogan"];
  if (setId === "evolution-series-1") return ["rhea-ripley", "becky-lynch", "iyo-sky"];
  return ["cody-rhodes", "roman-reigns", "gunther"];
}

function renderSplash() {
  setChrome({ hideTopbar: true });
  const root = $("#game");
  const returning = !!profile;
  const starter = returning ? superstarById[profile.starterId] : null;
  root.innerHTML = `<section class="splash-screen premium-splash clean-launch-splash">
    <div class="splash-glow"></div>
    <div class="clean-splash-content">
      <div class="clean-splash-brand">${legacyLogoMarkup(false, true)}</div>
      <section class="season-one-ad" aria-label="Season 1 Final Boss promotion">
        <div class="season-ad-effects" aria-hidden="true"><span></span><span></span><span></span></div>
        <div class="season-ad-rock">${portraitMarkup("the-rock","The Rock")}</div>
        <div class="season-ad-copy">
          <span class="season-ad-kicker">SEASON 1 · LEGACY BEGINS</span>
          <strong class="season-ad-title">THE FINAL<br>BOSS AWAITS.</strong>
          <p>Complete Season 1 and reach Tier 50 to unlock <b>The Rock</b>. Tier 50 unlocks The Rock — Final Boss with his complete Season 1 reward deck.</p>
          <div class="season-ad-footer"><b>SEASON COMPLETION EXCLUSIVE</b><em>TIER 50</em></div>
        </div>
        <span class="season-ad-watermark" aria-hidden="true">SEASON 1</span>
      </section>
      <div class="clean-splash-profile">
        <span>${returning ? "WELCOME BACK" : "NEW PLAYER"}</span>
        <strong>${returning ? "Continue Your Legacy" : "Begin your WWE Legacy"}</strong>
        <small>${returning ? `${profile.unlockedSuperstars.length}/${roster.length} Superstars unlocked · Season progress saved locally` : "Choose your first World Champion, receive their full starter deck, then discover the three live Season 1 booster sets."}</small>
      </div>
      <button id="enter-legacy" class="legacy-enter">${returning ? "ENTER WWE LEGACY" : "START NEW LEGACY"}</button>
      <small class="splash-local-note">Local single-player profile · no online account required</small>
    </div>
  </section>`;

  $("#enter-legacy")?.addEventListener("click", () => {
    if (profile) showMainMenu();
    else { screen = "starter"; renderStarter(); }
  });
}

function renderLaunchReleases() {
  setChrome({ hideTopbar: true });
  const root = $("#game");
  const releases = [
    {
      setId: "summerslam-series-1",
      kicker: "SUMMERSLAM — SERIES 1",
      title: "The New Era Starts Here",
      copy: "Browse two of SummerSlam's retained Superstar presentations.",
      stars: ["cody-rhodes","brock-lesnar"]
    },
    {
      setId: "hall-of-fame-series-1",
      kicker: "HALL OF FAME — SERIES 1",
      title: "Legends Join WWE Legacy",
      copy: "Browse retained WWE icons while their gameplay is rebuilt.",
      stars: ["hulk-hogan","stone-cold-steve-austin"]
    },
    {
      setId: "evolution-series-1",
      kicker: "EVOLUTION — SERIES 1",
      title: "The Women's Division Arrives",
      copy: "Browse the retained Evolution roster presentation.",
      stars: ["rhea-ripley","becky-lynch"]
    }
  ];

  root.innerHTML = `<section class="launch-releases-screen premium-screen">
    <div class="launch-releases-head">${legacyLogoMarkup(true)}<span>SEASON 1 · NOW LIVE</span><h2>Choose What You Want to Chase Next</h2><p>Your starter is secured. These three Season 1 releases are now available in boosters.</p></div>
    <div class="launch-release-list">${releases.map(release => {
      const cards = release.stars.map(id => cardById(`superstar-${id}`)).filter(Boolean);
      return `<article class="launch-release-panel ${setVisualClass(release.setId)}">
        <div class="launch-release-copy"><span>${release.kicker}</span><h3>${release.title}</h3><p>${release.copy}</p><button class="start-match" data-launch-set="${release.setId}">TAKE ME THERE</button></div>
        <div class="launch-release-cards">${cards.map(card=>collectibleCardMarkup(card,{foil:true,extraClass:"launch-superstar-card"})).join("")}</div>
      </article>`;
    }).join("")}</div>
    <button id="launch-release-continue" class="nav-button launch-release-continue">Continue to WWE Legacy</button>
  </section>`;

  root.querySelectorAll("[data-launch-set]").forEach(btn=>btn.addEventListener("click",()=>showBoosterSet(btn.dataset.launchSet)));
  $("#launch-release-continue")?.addEventListener("click", showMainMenu);
}

function renderMainMenu() {
  setChrome();
  const root = $("#game");
  const starter = superstarById[profile.starterId];
  const ssCredits = boosterCreditsFor(profile, "summerslam-series-1");
  const hofCredits = boosterCreditsFor(profile, "hall-of-fame-series-1");
  const evoCredits = boosterCreditsFor(profile, "evolution-series-1");
  const seasonProgress = seasonLevelProgress(profile);
  const seasonRemaining = seasonTimeRemaining(new Date());
  const ownedUnique = collectionCards.filter(card => ownedCount(profile, card.id, "normal") + ownedCount(profile, card.id, "foil") > 0).length;
  const ownedCopies = collectionCards.reduce((sum, card) => sum + ownedCount(profile, card.id, "normal") + ownedCount(profile, card.id, "foil"), 0);
  root.innerHTML = `<section class="main-menu-screen premium-screen home-hub-v2">
    <button id="menu-season-countdown" class="season-led-strip" aria-label="Open Season 1 hub">
      <span class="season-led-live"><i></i><b>SEASON ONE LIVE</b><i></i></span>
      <span class="season-led-label">ENDS IN</span>
      <strong class="season-led-countdown" data-season-countdown>${seasonRemaining.ended ? 'SEASON COMPLETE' : formatCountdown(seasonRemaining.ms)}</strong>
      <span class="season-led-next">SURVIVOR SERIES · 28 NOV</span>
    </button>


    <button id="menu-owned-collection" class="menu-owned-hero">
      <span class="owned-hero-copy">
        <em>YOUR CARDS</em>
        <strong>MY COLLECTION</strong>
        <small>${ownedUnique} / ${collectionCards.length} unique cards owned · ${ownedCopies} total copies</small>
        <span>${profile.unlockedSuperstars.length}/${roster.length} Superstars unlocked</span>
      </span>
      <span class="owned-hero-art">${portraitMarkup(starter.id, starter.name)}</span>
      <span class="owned-hero-arrow">VIEW OWNED CARDS →</span>
    </button>

    ${message ? `<p class="menu-message">${message}</p>` : ""}

    <button id="menu-season-campaign" class="menu-season-campaign" style="--season-progress:${Math.min(100,(seasonProgress.tier/SEASON_TIER_COUNT)*100)}%">
      <span class="menu-season-rock">${portraitMarkup("the-rock","The Rock")}</span>
      <span class="menu-season-copy"><em>SEASON 1 · TIER 50 REWARD</em><strong>UNLOCK THE FINAL BOSS</strong><small>Season 1 completion reward · The strongest Superstar of Season 1</small></span>
      <span class="menu-season-tier"><b>${seasonProgress.tier}</b><small>/ ${SEASON_TIER_COUNT}</small></span>
    </button>

    <div class="main-menu-grid premium-menu-grid compact-hub-grid">
      <button id="menu-play" class="main-menu-tile premium-menu-tile primary-tile tile-play"><span class="tile-bg-art">${portraitMarkup("roman-reigns","Roman Reigns")}</span><span class="tile-shade"></span><span class="tile-copy"><em>PLAY</em><strong>ENTER THE RING</strong><small>Exhibition · Ladder · Championship</small></span></button>
      <button id="menu-catalogue" class="main-menu-tile premium-menu-tile tile-collection"><span class="tile-bg-art">${portraitMarkup("stone-cold-steve-austin","Stone Cold Steve Austin")}</span><span class="tile-shade"></span><span class="tile-copy"><em>ALL ${collectionCards.length} CARDS</em><strong>CARD CATALOGUE</strong><small>Search and filter every set</small></span></button>
      <button id="menu-boosters" class="main-menu-tile premium-menu-tile tile-boosters"><span class="tile-bg-art">${portraitMarkup("iyo-sky","IYO SKY")}</span><span class="tile-shade"></span><span class="tile-copy"><em>${ssCredits + hofCredits + evoCredits} AVAILABLE</em><strong>BOOSTER PACKS</strong><small>Rip · Reveal · Collect</small></span></button>
      <button id="menu-decks" class="main-menu-tile premium-menu-tile tile-decks"><span class="tile-bg-art">${portraitMarkup("cm-punk","CM Punk")}</span><span class="tile-shade"></span><span class="tile-copy"><em>BUILD YOUR ROSTER</em><strong>DECK LAB</strong><small>Build · Optimize · Save</small></span></button>
      <button id="menu-challenges" class="main-menu-tile premium-menu-tile tile-challenges"><span class="tile-bg-art">${portraitMarkup("becky-lynch","Becky Lynch")}</span><span class="tile-shade"></span><span class="tile-copy"><em>EARN REWARDS</em><strong>CHALLENGES</strong><small>Daily · Weekly · Season XP</small></span></button>
      <button id="menu-profile" class="main-menu-tile premium-menu-tile tile-profile"><span class="tile-bg-art">${portraitMarkup(starter.id,starter.name)}</span><span class="tile-shade"></span><span class="tile-copy"><em>YOUR CAREER</em><strong>MY LEGACY</strong><small>Progress · Stats · Tools</small></span></button>
    </div>
  </section>`;
  $("#menu-season-countdown")?.addEventListener("click", showSeasons);
  $("#menu-owned-collection")?.addEventListener("click", showOwnedCollection);
  $("#menu-season-campaign")?.addEventListener("click", showSeasons);
  $("#menu-play")?.addEventListener("click", showPlayMenu);
  $("#menu-catalogue")?.addEventListener("click", showCardCatalogue);
  $("#menu-boosters")?.addEventListener("click", showBoosters);
  $("#menu-decks")?.addEventListener("click", () => showDeckBuilder(selection.p1));
  $("#menu-challenges")?.addEventListener("click", showChallenges);
  $("#menu-profile")?.addEventListener("click", showProfile);
  refreshSeasonClocks();
}

function renderPlayMenu() {
  setChrome();
  const root = $("#game");
  root.innerHTML = `<section class="play-menu-screen premium-screen">
    <div class="premium-screen-title"><span>PLAY</span><h2>Choose Your Path</h2><p>Three modes. Three identities. One WWE Legacy roster.</p></div>
    <div class="play-mode-grid premium-mode-grid">
      <button id="play-exhibition" class="play-mode-card premium-mode-card exhibition-card single-hero-mode">${modePortraits(["cody-rhodes"],"mode-art")}<div class="mode-card-shade"></div><div class="mode-card-copy">${modeLogoMarkup("exhibition",true)}<p>Choose any Superstar you own. Your CPU opponent is randomly drawn from the other ${Math.max(0,roster.length-1)} complete roster decks.</p><b>PLAY EXHIBITION →</b></div></button>
      <button id="play-ladder" class="play-mode-card premium-mode-card ladder-card single-hero-mode">${modePortraits(["gunther"],"mode-art")}<div class="mode-card-shade"></div><div class="mode-card-copy">${modeLogoMarkup("ladder",true)}<p>Three lives. Clear a full branch. Survive every rung.</p><b>START THE CLIMB →</b></div></button>
      <button id="play-championship" class="play-mode-card premium-mode-card championship-card single-hero-mode">${modePortraits(["roman-reigns"],"mode-art")}<div class="mode-card-shade"></div><div class="mode-card-copy">${modeLogoMarkup("championship",true)}<p>Opening Bout to Championship Match across a four-fight road.</p><b>CHASE THE TITLE →</b></div></button>
    </div>
  </section>`;
  $("#play-exhibition")?.addEventListener("click", showSetup);
  $("#play-ladder")?.addEventListener("click", showLadder);
  $("#play-championship")?.addEventListener("click", showChampionship);
}

function renderProfile() {
  setChrome();
  const root = $("#game");
  const starter = superstarById[profile.starterId];
  const ladder = ladderState(profile);
  const championship = championshipRoadState(profile);
  root.innerHTML = `<section class="profile-screen premium-screen profile-premium">
    <section class="feature-hero profile-feature">${modePortraits([starter.id,"the-undertaker","rhea-ripley"],"feature-art")}<div class="feature-shade"></div><div class="feature-copy">${modeLogoMarkup("profile")}<p>This career and collection are stored locally on this device.</p></div></section>
    <div class="profile-summary-card premium-panel"><div class="profile-summary-photo">${portraitMarkup(starter.id, starter.name)}</div><div><span>ORIGINAL STARTER</span><strong>${starter.name}</strong><small>${starter.nickname}</small></div></div>
    <div class="profile-stat-grid premium-stats"><article><span>SUPERSTARS</span><b>${profile.unlockedSuperstars.length}/${roster.length}</b></article><article><span>PACKS OPENED</span><b>${profile.packsOpened ?? 0}</b></article><article><span>LADDER CLEARS</span><b>${ladder.clears ?? 0}</b></article><article><span>CHAMPIONSHIP CLEARS</span><b>${championship.clears ?? 0}</b></article><article><span>UNIVERSE POINTS</span><b>${profile.universePoints ?? 0} UP</b></article></div>
    <section class="legacy-settings premium-panel"><div class="section-title"><h3>Settings & Tools</h3><span>MY LEGACY</span></div><div class="profile-actions"><button id="profile-home" class="start-match">Main Menu</button><a class="nav-button profile-tool-link" href="./tools/card-art-studio.html">Card Art Studio</a></div><article class="option-row danger-zone"><div><strong>Reset Progress</strong><p>Erase this device's WWE Legacy profile, collection, unlocked Superstars, Season progress and saved decks.</p></div>${optionsResetArmed ? `<div class="reset-confirm-actions"><button id="cancel-reset-progress" class="nav-button">Cancel</button><button id="confirm-reset-progress" class="start-match danger">CONFIRM RESET</button></div>` : `<button id="reset-progress" class="nav-button danger">Reset Progress</button>`}</article>${optionsResetArmed ? `<p class="reset-warning"><b>Testing reset armed.</b> This cannot be undone on this device.</p>` : ""}<div class="option-row"><div><strong>Build</strong><p>WWE Legacy: Collectible Card Game v${BUILD_VERSION}</p></div></div></section>
  </section>`;
  $("#profile-home")?.addEventListener("click", showMainMenu);
  $("#reset-progress")?.addEventListener("click",()=>{optionsResetArmed=true;message="Confirm the reset below to erase all local progress.";renderProfile();});
  $("#cancel-reset-progress")?.addEventListener("click",()=>{optionsResetArmed=false;message="Reset cancelled.";renderProfile();});
  $("#confirm-reset-progress")?.addEventListener("click",()=>{resetProfile();profile=null;game=null;optionsResetArmed=false;selection={p1:"cm-punk",p2:"roman-reigns"};lastMatchup={...selection};lastPack=null;pendingUpgrades=[];message="";showSplash();});
}


function renderOptions() {
  setChrome();
  const root = $("#game");
  root.innerHTML = `<section class="options-screen premium-screen">
    <section class="feature-hero options-feature">
      <div class="options-hero-icon">⚙</div>
      <div class="feature-shade"></div>
      <div class="feature-copy">${modeLogoMarkup("profile")}<span class="premium-kicker">OPTIONS</span><h2>Game Options</h2><p>Local gameplay, audio and profile controls for WWE Legacy.</p></div>
    </section>
    ${message ? `<p class="setup-message">${message}</p>` : ""}
    <section class="options-panel premium-panel">
      <div class="section-title"><h3>Local Save</h3><span>Testing tools</span></div>
      <article class="option-row danger-zone">
        <div><strong>Reset Progress</strong><p>Erase this device's WWE Legacy profile, collection, unlocked Superstars, Season progress and saved decks. You will return to the first-time starter selection.</p></div>
        ${optionsResetArmed
          ? `<div class="reset-confirm-actions"><button id="cancel-reset-progress" class="nav-button">Cancel</button><button id="confirm-reset-progress" class="start-match danger">CONFIRM RESET</button></div>`
          : `<button id="reset-progress" class="nav-button danger">Reset Progress</button>`}
      </article>
      ${optionsResetArmed ? `<p class="reset-warning"><b>Testing reset armed.</b> This cannot be undone on this device.</p>` : ""}
    </section>
    <section class="options-panel premium-panel">
      <div class="section-title"><h3>Build</h3><span>WWE Legacy development</span></div>
      <div class="option-row"><div><strong>Version</strong><p>WWE Legacy: Collectible Card Game v${BUILD_VERSION}</p></div></div>
    </section>
  </section>`;

  $("#reset-progress")?.addEventListener("click", () => {
    optionsResetArmed = true;
    message = "Confirm the reset below to erase all local progress.";
    renderOptions();
  });
  $("#cancel-reset-progress")?.addEventListener("click", () => {
    optionsResetArmed = false;
    message = "Reset cancelled.";
    renderOptions();
  });
  $("#confirm-reset-progress")?.addEventListener("click", () => {
    resetProfile();
    profile = null;
    game = null;
    optionsResetArmed = false;
    selection = { p1: "cm-punk", p2: "roman-reigns" };
    lastMatchup = { ...selection };
    lastPack = null;
    pendingUpgrades = [];
    message = "";
    showSplash();
  });
}

function chooseStarter(starId) {
  profile = createProfile(starId);
  saveProfile(profile);
  selection.p1 = starId;
  selection.p2 = starId === "roman-reigns" ? "cm-punk" : "roman-reigns";
  lastMatchup = { ...selection };
  screen = "launch-releases";
  message = `${superstarById[starId].name} is now your starter Superstar. Their complete recommended deck is ready to play.`;
  renderLaunchReleases();
}

function renderStarter() {
  setChrome({ hideTopbar: true });
  const root = $("#game");
  const choices = STARTER_CHOICES.map(id => superstarById[id]).filter(Boolean);
  const titleFor = id => id === "cm-punk" ? "UNDISPUTED WWE CHAMPION" : "WORLD HEAVYWEIGHT CHAMPION";
  root.innerHTML = `<section class="starter-screen onboarding-screen">
    <div class="onboarding-brand">${legacyLogoMarkup(true)}</div>
    <div class="starter-hero"><span class="eyebrow">FIRST-TIME ONBOARDING</span><h2>Choose Your Champion</h2><p>Your first decision creates your local profile and unlocks a complete recommended deck so you can enter the ring immediately.</p></div>
    <div class="starter-choice-grid champion-choice-grid">${choices.map(star => `<button class="starter-choice champion-starter" data-starter="${star.id}">
      <div class="starter-photo">${superstarVisualMarkup(star.id,star.name)}</div>
      <span class="champion-tag">${titleFor(star.id)}</span>
      <strong>${star.name}</strong><small>${star.nickname}</small>
      <span>55-PAGE RECOMMENDED DECK · READY</span>
      <div class="starter-ability"><span class="starter-ability-name">Ready for WWE Legacy</span><span class="starter-ability-text">Superstar, Entrance, Lead Off and full recommended deck are unlocked with your starter choice.</span></div>
      <b class="choose-starter-cta">START WITH ${star.name.toUpperCase()}</b>
    </button>`).join("")}</div>
    <p class="starter-note">The champion you do not choose remains available to unlock later. Exhibition opponents can still be drawn from the full ${roster.length}-deck roster.</p>
  </section>`;
  root.querySelectorAll("[data-starter]").forEach(btn => btn.addEventListener("click", () => chooseStarter(btn.dataset.starter)));
}


function renderSetup() {
  setChrome();
  const root = $("#game");
  const unlocked = orderedUnlockedSuperstars();
  if (!unlocked.some(s => s.id === selection.p1)) selection.p1 = unlocked[0]?.id ?? profile.starterId;
  const p1 = superstarById[selection.p1];
  root.innerHTML = `<section class="setup-screen premium-screen exhibition-screen compact-match-select">
    <section class="feature-hero exhibition-feature single-feature-hero">${modePortraits([selection.p1],"feature-art")}<div class="feature-shade"></div><div class="feature-copy exhibition-clean-hero">${modeLogoMarkup("exhibition")}</div></section>
    <section class="selector-panel horizontal-selector"><div class="selector-title"><span>YOU · PLAYER 1</span><strong>${p1?.name ?? 'Choose Superstar'}</strong></div>${selectionCarouselMarkup(unlocked,selection.p1,'exhibition-p1')}<button id="confirm-p1" class="select-confirm">${`CONFIRM ${p1?.name?.toUpperCase() ?? 'SUPERSTAR'}`}</button></section>
    ${message ? `<p class="setup-message">${message}</p>` : ""}
  </section>`;
  wireSelectionCarousel('exhibition-p1', id => {
    if (selection.p1 !== id) { selection.p1 = id; selection.p2 = null; exhibitionConfirmed.p1 = false; }
    renderSetup();
  });
  $("#confirm-p1")?.addEventListener('click', () => {
    const opponent = randomExhibitionOpponent(selection.p1);
    if (!opponent) { message = "No eligible Exhibition opponent deck is available."; renderSetup(); return; }
    exhibitionConfirmed.p1 = true;
    selection.p2 = opponent;
    startMatch(selection.p1, opponent, { mode: "exhibition" });
  });
}

function rarityStars(level) { return "★".repeat(Math.max(1, Math.min(4, Number(level) || 1))); }

function playerFacingRulesText(text = "") {
  return String(text)
    .replace(/^New canonical(?: shared card| shared Chokeslam)?;?\s*/i, "")
    .replace(/^New canonical\s*/i, "")
    .replace(/\bgrounds opponent\b/gi, "Ground your opponent")
    .replace(/\bgrounds\b/gi, "Ground your opponent")
    .replace(/\bgrounded opponent,?\s*/gi, "Requires a grounded opponent. ")
    .replace(/\bground\s*\+\s*Pin Bonus\s*(\d+)/gi, "Ground your opponent. Pin Bonus +$1")
    .replace(/\bground\s*\+\s*Stun\s*(\d+)/gi, "Ground your opponent. Stun $1")
    .replace(/\bPin Bonus\s*(\d+)/gi, "Pin Bonus +$1")
    .replace(/\s*;\s*/g, ". ")
    .replace(/\s{2,}/g, " ")
    .replace(/\.\s*\./g, ".")
    .trim();
}

function cardRulesText(card) {
  if (card.kind === "move" && card.rulesText) return playerFacingRulesText(card.rulesText);
  if (card.kind === "superstar") { const star=superstarById[card.superstarId]; const a=star?.ability; return playerFacingRulesText(`${a?.name ?? card.abilityName ?? "Superstar Ability"}: ${a?.text ?? card.abilityText ?? "Ability details pending."}`); }
  if (card.kind === "entrance") { const star=superstarById[card.superstarId]; return playerFacingRulesText(card.rulesText ?? star?.entrance?.rulesText ?? "Entrance effect pending."); }
  if (card.kind === "special") { const star=superstarById[card.superstarId]; return playerFacingRulesText(card.abilityText ?? card.effectText ?? card.rulesText ?? star?.special?.text ?? "Special effect is resolved by the Superstar ability package."); }
  if (card.kind === "momentum") return `Gain ${card.amount ?? 1} permanent ${(card.method ?? "Momentum")[0].toUpperCase() + (card.method ?? "momentum").slice(1)} Momentum. Momentum is not spent when a Move is played.`;
  if (["action", "support", "manager"].includes(card.kind)) return playerFacingRulesText(card.abilityText ?? card.effectText ?? card.rulesText ?? card.kind);
  return collectionText(card);
}

function cardFrontBottom(card) {
  if (card.kind === "move") return `<span><small>COST</small><b>${card.cost ?? 0}</b></span><span><small>DAMAGE</small><b>${card.damage ?? 0}</b></span>`;
  if (card.kind === "superstar") return `<span><small>HP</small><b>${card.hp ?? superstarById[card.superstarId]?.hp ?? "—"}</b></span><span><small>STARS</small><b class="rarity-stars">${rarityStars(card.rarity ?? 4)}</b></span>`;
  if (card.kind === "momentum") return `<span><small>METHOD</small><b>${(card.method ?? "MO").slice(0,2).toUpperCase()}</b></span><span><small>GAIN</small><b>+${card.amount ?? 1}</b></span>`;
  return `<span><small>TYPE</small><b>${card.kind.toUpperCase()}</b></span><span><small>STARS</small><b class="rarity-stars">${rarityStars(card.rarity ?? 1)}</b></span>`;
}

const MOMENTUM_FRONT_META = {
  strength: { short: "ST", icon: "M5 20h14M7 16h10M9 12h6M11 8h2" },
  strike: { short: "SR", icon: "M12 3l2.2 5.1L20 6l-3.1 4.6L22 13l-5.4 1.2L18 20l-5-3.1L9 22l-1.1-5.8L2 17l4-4-4-3 5.8-1L6 3l5 3.2z" },
  technical: { short: "TE", icon: "M4 8h16M4 16h16M8 4v16M16 4v16M6 6l12 12M18 6L6 18" },
  agility: { short: "AG", icon: "M4 17c4-1 7-4 9-8 1 4 3 6 7 8M5 12c3 0 5-2 7-5M8 20c4-2 7-5 9-9" }
};
function momentumMockupMarkup(card) {
  const method = String(card.method || "strength").toLowerCase();
  const meta = MOMENTUM_FRONT_META[method] ?? MOMENTUM_FRONT_META.strength;
  const label = method[0].toUpperCase() + method.slice(1);
  return `<span class="momentum-mock momentum-${method}">
    <span class="momentum-grid"></span>
    <span class="momentum-topline"><b>WWE LEGACY</b><em>MOMENTUM</em></span>
    ${setLogoMarkup(card.setId,"momentum-set-logo")}
    <span class="momentum-emblem"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${meta.icon}"></path></svg><i>${meta.short}</i></span>
    <span class="momentum-value">+${card.amount ?? 1}</span>
    <span class="momentum-method">${label}</span>
    <span class="momentum-permanent">PERMANENT MOMENTUM</span>
    <span class="momentum-code">${card.cardCode ?? "WWE LEGACY"}</span>
  </span>`;
}

function cardArtFace(card) {
  const star = card.superstarId ? superstarById[card.superstarId] : null;
  if (card.kind === "superstar" && card.superstarId) {
    return superstarVisualMarkup(card.superstarId, star?.name ?? card.name, "ccg-superstar-art-image");
  }
  if (card.kind === "momentum") {
    const finished = finishedCardArtFor(card);
    const legacyFinished = legacyFinishedCardArtFor(card);
    const legacyCandidate = legacyFinished && legacyFinished !== finished ? legacyFinished : "";
    const custom = finished ? `<img class="ccg-finished-card-art-image momentum-custom-front" src="${finished}" alt="${card.name}" data-finished-card-art="${card.id}" data-legacy-finished-art="${legacyCandidate}" onerror="if(!this.dataset.legacyFinishedTried&&this.dataset.legacyFinishedArt){this.dataset.legacyFinishedTried='1';this.src=this.dataset.legacyFinishedArt;return;}this.onerror=null;this.style.display='none';">` : "";
    return `${momentumMockupMarkup(card)}${custom}`;
  }
  const art = artworkFor(card);
  const finished = finishedCardArtFor(card);
  const legacyFinished = legacyFinishedCardArtFor(card);
  if (finished) {
    const legacyCandidate = legacyFinished && legacyFinished !== finished ? legacyFinished : "";
    return `<img class="ccg-finished-card-art-image" src="${finished}" alt="${card.name}" data-finished-card-art="${card.id}" data-legacy-finished-art="${legacyCandidate}" onerror="if(!this.dataset.legacyFinishedTried&&this.dataset.legacyFinishedArt){this.dataset.legacyFinishedTried='1';this.src=this.dataset.legacyFinishedArt;return;}this.onerror=null;this.style.display='none';this.closest('.ccg-card')?.classList.remove('is-full-art-finished','is-full-art-move');">`;
  }
  const fallback = card.name;
  return art
    ? `<img src="${art}" alt="${card.name}">`
    : `<span class="ccg-art-placeholder"><span class="pending-mark">WWE LEGACY</span><b>ARTWORK PENDING</b><small>${fallback}</small><em>${card.cardCode ?? card.id}</em></span>`;
}


function cardPlayRestrictionText(card) {
  if (!card) return "";
  if (Array.isArray(card.allowedSuperstarIds) && card.allowedSuperstarIds.length) {
    const names = card.allowedSuperstarIds.map(id => superstarById[id]?.name ?? id);
    return `<span class="ccg-rules-restriction"><b>SUPERSTAR RESTRICTION</b> ${names.length === 1 ? `Only playable by ${names[0]}.` : `Only playable by: ${names.join(", ")}.`}</span>`;
  }
  if (card.superstarId) {
    const name = superstarById[card.superstarId]?.name ?? card.superstarId;
    const label = card.kind === "entrance" ? "LINKED SUPERSTAR" : "SUPERSTAR RESTRICTION";
    const text = card.kind === "entrance" ? `${name}` : `Only playable by ${name}.`;
    return `<span class="ccg-rules-restriction"><b>${label}</b> ${text}</span>`;
  }
  return "";
}

function collectibleCardMarkup(card, { flipped = false, foil = false, extraClass = "", footer = "", flipAttr = "" } = {}) {
  // Superstar and all Card Art Studio exports are premium full-art fronts.
  // Non-Superstar cards keep their generated legacy overlays only as a fallback
  // until the corresponding custom WebP exists on disk.
  const superstarFront = card.kind === "superstar";
  const moveFront = card.kind === "move";
  const finishedFront = !superstarFront && Boolean(finishedCardArtFor(card));
  const visualFoil = !superstarFront && !finishedFront && (foil || card.kind === "entrance");
  const setClass = `set-${card.setId ?? "global"}`;
  const typeClass = `type-${card.kind}`;
  const finisherClass = card.finisher ? "is-finisher" : card.trademark ? "is-trademark" : card.signature ? "is-signature" : "";
  const foilClass = visualFoil ? "is-foil" : "";
  const ruleText = cardRulesText(card);
  const typeLabel = card.finisher ? "FINISHER" : card.trademark ? "TRADEMARK" : card.signature ? "SIGNATURE" : card.kind.toUpperCase();
  const subtitle = card.kind === "move"
    ? [card.method ? card.method.toUpperCase() : "", card.moveType ? (MOVE_TYPE_LABELS[card.moveType] ?? card.moveType).toUpperCase() : ""].filter(Boolean).join(" · ")
    : (card.subtitle ?? typeLabel);
  const frontMarkup = superstarFront
    ? `<span class="ccg-card-art ccg-superstar-full-art">${cardArtFace(card)}</span>`
    : `<span class="ccg-card-art ${moveFront ? "ccg-move-full-art" : ""}">${cardArtFace(card)}</span><span class="ccg-card-title"><small>${typeLabel}${visualFoil ? " · FOIL" : ""}</small><strong>${card.name}</strong></span><span class="ccg-card-stats">${cardFrontBottom(card)}</span>`;
  return `<button type="button" class="ccg-card ${flipped ? "is-flipped" : ""} ${setClass} ${typeClass} ${finisherClass} ${foilClass} ${superstarFront ? "is-full-art-superstar" : ""} ${finishedFront ? "is-full-art-finished" : ""} ${extraClass}" ${flipAttr} aria-label="${card.name}. Tap to ${flipped ? "view artwork" : "view effects"}.">
    <span class="ccg-card-inner">
      <span class="ccg-card-face ccg-card-front">${frontMarkup}</span>
      <span class="ccg-card-face ccg-card-rules">
        <span class="ccg-rules-head"><small>${typeLabel}</small><strong>${card.name}</strong><em>${subtitle}</em></span>
        ${card.kind === "move" ? `<span class="ccg-rules-statline"><span><small>COST</small><b>${card.cost ?? 0}</b></span><span><small>DAMAGE</small><b>${card.damage ?? 0}</b></span></span>` : ""}
        <span class="ccg-rules-body"><b class="ccg-effect-label">${card.kind === "move" ? "EFFECT" : card.kind === "superstar" ? "SUPERSTAR ABILITY" : card.kind === "entrance" ? "ENTRANCE EFFECT" : "RULES"}</b><span>${ruleText}</span></span>
        ${card.kind === "superstar" ? (()=>{const star=superstarById[card.superstarId]; if(!star)return ""; const limits=Object.entries(star.methodLimits??{}).map(([m,v])=>`${m.slice(0,2).toUpperCase()} ${v==null?"∞":v}`).join(" · "); const starter=Object.entries(star.starterMomentum??{}).map(([m,v])=>`${m.slice(0,2).toUpperCase()} ×${v}`).join(" · "); return `<span class="ccg-rules-reference"><b>METHOD LIMITS</b>${limits}</span><span class="ccg-rules-reference"><b>STARTER MOMENTUM</b>${starter}</span>`;})() : ""}
        ${card.kind === "move" && card.requirements && Object.keys(card.requirements).length ? `<span class="ccg-rules-requirements"><b>REQUIRES</b> ${Object.entries(card.requirements).map(([m,n])=>`${n} ${m}`).join(" · ")}</span>` : ""}
        ${card.kind === "move" && card.counters?.length ? `<span class="ccg-rules-requirements"><b>COUNTERS</b> ${card.counters.map(t=>MOVE_TYPE_LABELS[t] ?? t).join(", ")}</span>` : ""}
        ${card.kind === "move" && card.counterMethods?.length ? `<span class="ccg-rules-requirements"><b>COUNTERS</b> Any ${card.counterMethods.map(m=>m[0].toUpperCase()+m.slice(1)).join(" / ")} Move</span>` : ""}
        ${cardPlayRestrictionText(card)}
        <span class="ccg-rules-foot"><span>${card.cardCode ?? card.setId ?? "WWE LEGACY"}</span><span class="rarity-stars">${rarityStars(card.rarity ?? 1)}</span></span>
      </span>
    </span>${footer}
  </button>`;
}
function collectionText(card) {
  if (card.kind === "superstar") return `${card.hp} HP · ${card.abilityName}: ${card.abilityText}`;
  if (card.kind === "momentum") return `Gain 1 permanent ${card.method[0].toUpperCase() + card.method.slice(1)} Momentum. Move costs never spend Momentum.`;
  if (["entrance", "special", "action", "support", "manager"].includes(card.kind)) return card.abilityText ?? card.kind;
  const req = Object.entries(card.requirements ?? {}).map(([m,n]) => `${n} ${m}`).join(", ");
  const stateReq = [card.requiresPosture ? `opponent ${card.requiresPosture}` : "", card.requiresLocation ? card.requiresLocation : ""].filter(Boolean).join(" · ");
  const method = card.method ? `Method ${card.method[0].toUpperCase() + card.method.slice(1)}` : "";
  const moveType = card.moveType ? `Move Type ${MOVE_TYPE_LABELS[card.moveType] ?? card.moveType}` : "";
  const counters = card.counters?.length ? `Counters ${card.counters.map(t => MOVE_TYPE_LABELS[t] ?? t).join(", ")}` : "";
  const defense = card.defensiveOnly ? "Counter only" : "";
  return [`Cost ${card.cost ?? 0}`, `${card.damage ?? 0} damage`, method, moveType, counters, req ? `Requires ${req}` : "", stateReq, defense, card.finisher ? "Finisher" : card.trademark ? "Trademark" : card.signature ? "Signature" : "", card.effectText ?? ""].filter(Boolean).join(" · ");
}
function renderCollection() {
  const root = $("#game");
  const allSets = activeCollectionSetId === "all";
  const rarityLabels = setCollection.rarityLabels;
  const baseCards = allSets ? collectionCards : cardsForSet(activeCollectionSetId);
  const isOwned = card => ownedCount(profile, card.id, "normal") + ownedCount(profile, card.id, "foil") > 0;
  const scopedCards = collectionView === "owned" ? baseCards.filter(isOwned) : baseCards;
  const kinds = ["all","superstar","entrance","momentum","move","action","support","manager","special"];
  const query = collectionFilter.search.trim().toLowerCase();
  const acquisitionOrder = new Map(Object.keys(profile.ownedCards ?? {}).map((id, index) => [id, index]));
  const copiesOwned = card => ownedCount(profile, card.id, "normal") + ownedCount(profile, card.id, "foil");
  const sortOwnedCards = cards => [...cards].sort((a, b) => {
    if (collectionSort === "alpha-asc") return a.name.localeCompare(b.name) || String(a.cardCode ?? "").localeCompare(String(b.cardCode ?? ""));
    if (collectionSort === "alpha-desc") return b.name.localeCompare(a.name) || String(b.cardCode ?? "").localeCompare(String(a.cardCode ?? ""));
    if (collectionSort === "rarity-desc") return (b.rarity ?? 0) - (a.rarity ?? 0) || a.name.localeCompare(b.name);
    if (collectionSort === "rarity-asc") return (a.rarity ?? 0) - (b.rarity ?? 0) || a.name.localeCompare(b.name);
    if (collectionSort === "copies-desc") return copiesOwned(b) - copiesOwned(a) || a.name.localeCompare(b.name);
    return (acquisitionOrder.get(b.id) ?? -1) - (acquisitionOrder.get(a.id) ?? -1) || a.name.localeCompare(b.name);
  });
  const visible = sortOwnedCards(scopedCards.filter(card => {
    if (collectionFilter.kind !== "all" && card.kind !== collectionFilter.kind) return false;
    if (collectionFilter.rarity !== "all" && String(card.rarity) !== collectionFilter.rarity) return false;
    if (query && !`${card.name} ${card.subtitle ?? ""} ${card.kind} ${card.cardCode ?? ""} ${sets[card.setId]?.displayName ?? ""} ${collectionText(card)}`.toLowerCase().includes(query)) return false;
    return true;
  }));
  const ownedUniqueAll = collectionCards.filter(isOwned).length;
  const ownedUniqueHere = baseCards.filter(isOwned).length;
  const starCards = baseCards.filter(c => c.kind === "superstar");
  const unlocked = starCards.filter(c => hasSuperstar(profile, c.superstarId)).length;
  const tabs = [`<button class="nav-button ${allSets ? 'active' : ''}" data-collection-set="all">All Sets</button>`, ...Object.values(setCollections).map(set => `<button class="nav-button ${set.id === activeCollectionSetId ? 'active' : ''}" data-collection-set="${set.id}">${set.displayName}</button>`)].join('');
  const heroIds = allSets ? [profile.starterId, "stone-cold-steve-austin", "rhea-ripley"] : setHeroSuperstars(activeCollectionSetId);
  const setLogo = allSets ? "" : setLogoMarkup(activeCollectionSetId, "feature-set-logo");
  const title = collectionView === "owned" ? "MY COLLECTION" : "CARD CATALOGUE";
  const eyebrow = collectionView === "owned" ? "OWNED CARDS" : "EVERY ACTIVE CARD";
  const intro = collectionView === "owned"
    ? `Everything you currently own. Search ${ownedUniqueAll} unique cards across every set, or narrow the view below.`
    : `The complete active WWE Legacy card catalogue. Search and filter all ${collectionCards.length} cards across every set.`;
  const themeClass = allSets ? "theme-catalogue-all" : setVisualClass(activeCollectionSetId);
  document.body.dataset.set = activeCollectionSetId;
  root.innerHTML = `<section class="collection-screen premium-screen ${themeClass}">
    <section class="feature-hero collection-feature collection-all-hero">
      ${modePortraits(heroIds, "feature-art")}<div class="feature-shade"></div>
      <div class="feature-copy">${modeLogoMarkup("collection", true)}${setLogo}<span class="set-feature-name">${title}</span><p>${intro}</p>
        <div class="collection-view-switch"><button id="collection-owned-view" class="nav-button ${collectionView === 'owned' ? 'active' : ''}">My Collection</button><button id="collection-catalogue-view" class="nav-button ${collectionView === 'catalogue' ? 'active' : ''}">Card Catalogue</button></div>
        <div class="mode-branch-tabs collection-set-tabs">${tabs}</div>
      </div>
      <div class="set-stats"><div class="set-stat"><b>${collectionView === 'owned' ? ownedUniqueHere : baseCards.length}</b><span>${collectionView === 'owned' ? 'Owned here' : 'In view'}</span></div><div class="set-stat"><b>${unlocked}/${starCards.length}</b><span>Superstars</span></div><div class="set-stat"><b>${ownedUniqueAll}</b><span>Total owned</span></div><div class="set-stat"><b>${collectionCards.length}</b><span>Catalogue</span></div></div>
    </section>
    <section class="collection-tools"><span class="collection-mode-label">${eyebrow}</span><input id="collection-search" type="search" placeholder="Search name, move, ability or card code" value="${collectionFilter.search.replaceAll('"','&quot;')}"><select id="collection-kind">${kinds.map(k => `<option value="${k}" ${collectionFilter.kind === k ? 'selected' : ''}>${k === 'all' ? 'All card types' : k[0].toUpperCase()+k.slice(1)}</option>`).join('')}</select><select id="collection-rarity"><option value="all">All rarities</option>${[1,2,3,4].map(r => `<option value="${r}" ${collectionFilter.rarity === String(r) ? 'selected' : ''}>${rarityStars(r)} ${rarityLabels[r]}</option>`).join('')}</select><select id="collection-sort" aria-label="Sort My Collection"><option value="newest" ${collectionSort === 'newest' ? 'selected' : ''}>Newest Owned</option><option value="alpha-asc" ${collectionSort === 'alpha-asc' ? 'selected' : ''}>A–Z</option><option value="alpha-desc" ${collectionSort === 'alpha-desc' ? 'selected' : ''}>Z–A</option><option value="rarity-desc" ${collectionSort === 'rarity-desc' ? 'selected' : ''}>Rarity High → Low</option><option value="rarity-asc" ${collectionSort === 'rarity-asc' ? 'selected' : ''}>Rarity Low → High</option><option value="copies-desc" ${collectionSort === 'copies-desc' ? 'selected' : ''}>Most Copies</option></select><span class="collection-count">Showing ${visible.length} / ${scopedCards.length}</span></section>
    <section class="catalogue-grid collectible-catalogue">${visible.length ? visible.map(card => {
      const cardSet = setCollections[card.setId] ?? setCollection;
      return `<article class="catalogue-collectible ${card.kind === 'superstar' && !hasSuperstar(profile, card.superstarId) ? 'collection-locked' : ''}">${collectibleCardMarkup(card,{flipped:flippedCollectionCards.has(card.id),flipAttr:`data-flip-collection="${card.id}"`})}<div class="catalogue-under-card"><span>${card.cardCode}</span><b>${cardSet.rarityLabels[card.rarity]}</b><small>${card.kind === 'superstar' || card.kind === 'entrance' ? `Owned ${ownedCount(profile,card.id,'foil') ? 'FOIL' : '—'}` : `Owned ${ownedCount(profile,card.id,'normal')} · Foil ${ownedCount(profile,card.id,'foil')}`}</small>${card.kind==='superstar'&&hasSuperstar(profile,card.superstarId)?`<button type="button" class="favourite-star-button ${(profile.favouriteSuperstars??[]).includes(card.superstarId)?'active':''}" data-favourite-star="${card.superstarId}">${(profile.favouriteSuperstars??[]).includes(card.superstarId)?'★ FAVOURITE':'☆ ADD FAVOURITE'}</button>`:''}</div></article>`;
    }).join('') : `<div class="collection-empty">${collectionView === 'owned' ? 'No owned cards match these filters.' : 'No cards match these filters.'}</div>`}</section>
  </section>`;
  root.querySelectorAll('[data-flip-collection]').forEach(btn => btn.addEventListener('click', () => { const id = btn.dataset.flipCollection; if (flippedCollectionCards.has(id)) flippedCollectionCards.delete(id); else flippedCollectionCards.add(id); renderCollection(); }));
  root.querySelectorAll('[data-collection-set]').forEach(btn => btn.addEventListener('click', () => { activeCollectionSetId = btn.dataset.collectionSet; collectionFilter = {kind:'all',rarity:'all',search:''}; flippedCollectionCards = new Set(); renderCollection(); }));
  $("#collection-owned-view")?.addEventListener("click", showOwnedCollection);
  $("#collection-catalogue-view")?.addEventListener("click", showCardCatalogue);
  $("#collection-search")?.addEventListener("input", e => { collectionFilter.search = e.target.value; renderCollection(); requestAnimationFrame(() => $("#collection-search")?.focus()); });
  $("#collection-kind")?.addEventListener("change", e => { collectionFilter.kind = e.target.value; renderCollection(); });
  $("#collection-rarity")?.addEventListener("change", e => { collectionFilter.rarity = e.target.value; renderCollection(); });
  $("#collection-sort")?.addEventListener("change", e => { collectionSort = e.target.value; renderCollection(); });
  root.querySelectorAll('[data-favourite-star]').forEach(btn => btn.addEventListener('click', e => { e.stopPropagation(); const id=btn.dataset.favouriteStar; profile.favouriteSuperstars ??= []; profile.favouriteSuperstars = profile.favouriteSuperstars.includes(id) ? profile.favouriteSuperstars.filter(x=>x!==id) : [...profile.favouriteSuperstars,id]; saveProfile(profile); renderCollection(); }));
}


function catalogueOwned(card) {
  const normal = ownedCount(profile, card.id, "normal");
  const foil = ownedCount(profile, card.id, "foil");
  return { normal, foil, total: normal + foil };
}

function catalogueCardUsageLabel(card) {
  if (isSharedCard(card)) return "SHARED";
  const names = superstarIdsForCard(card).map(id => superstarById[id]?.name ?? id).sort((a,b) => a.localeCompare(b));
  if (!names.length) return "UNASSIGNED";
  return names.length <= 2 ? names.join(" · ") : `${names[0]} · +${names.length - 1}`;
}

function renderCardCatalogue() {
  const root = $("#game");
  const options = catalogueOptions(collectionCards);
  const ownershipFor = card => catalogueOwned(card);
  const filtered = filterAndSortCatalogue(collectionCards, catalogueFilter, ownershipFor);
  const ownedUnique = collectionCards.filter(card => ownershipFor(card).total > 0).length;
  const pageCount = Math.max(1, Math.ceil(filtered.length / CATALOGUE_PAGE_SIZE));
  cataloguePage = Math.min(Math.max(1, cataloguePage), pageCount);
  const start = (cataloguePage - 1) * CATALOGUE_PAGE_SIZE;
  const pageCards = filtered.slice(start, start + CATALOGUE_PAGE_SIZE);
  const kinds = ["all","superstar","entrance","momentum","move","action","support","manager","special"];
  const select = (value, label, selected) => `<option value="${value}" ${String(selected) === String(value) ? "selected" : ""}>${label}</option>`;
  const requirementOptions = selected => [select("any","Any",selected), ...[0,1,2,3].map(n => select(String(n),`= ${n}`,selected))].join("");
  const comparatorOptions = selected => [
    select("any","Any",selected), select("eq","=",selected), select("lte","≤",selected), select("gte","≥",selected)
  ].join("");
  const sortOptions = [
    ["collector","Collector #"],["alpha","Alphabetical"],["set","Set"],["superstar","Superstar"],["kind","Card Type"],["rarity","Rarity"],
    ["cost","Cost"],["damage","Damage"],["strength","Strength Req"],["strike","Strike Req"],["technical","Technical Req"],["agility","Agility Req"],["owned","Owned Quantity"]
  ];
  const superstarOptions = [
    select("all","All Superstars",catalogueFilter.superstarId),
    select("shared","Shared / Generic",catalogueFilter.superstarId),
    ...options.superstars.map(star => select(star.id, star.name, catalogueFilter.superstarId))
  ].join("");
  const setOptions = [select("all","All Sets",catalogueFilter.setId), ...Object.values(setCollections).map(set => select(set.id,set.displayName,catalogueFilter.setId))].join("");
  const moveTypeOptions = [select("all","All Move Types",catalogueFilter.moveType), ...options.moveTypes.map(type => select(type, MOVE_TYPE_LABELS[type] ?? type, catalogueFilter.moveType))].join("");
  const moveFamilyOptions = [select("all","All Move Families",catalogueFilter.moveFamily), ...options.moveFamilies.map(family => select(family, family.replaceAll("-"," ").replace(/\b\w/g,m=>m.toUpperCase()), catalogueFilter.moveFamily))].join("");
  const methodOptions = [select("all","All Methods",catalogueFilter.method), ...options.methods.map(method => select(method, method[0].toUpperCase()+method.slice(1), catalogueFilter.method))].join("");
  const pagination = `<div class="catalogue-pagination"><button class="nav-button" data-catalogue-page="prev" ${cataloguePage <= 1 ? "disabled" : ""}>← Previous</button><b>Page ${cataloguePage} / ${pageCount}</b><button class="nav-button" data-catalogue-page="next" ${cataloguePage >= pageCount ? "disabled" : ""}>Next →</button></div>`;

  root.innerHTML = `<section class="catalogue-screen premium-screen theme-catalogue-all">
    <section class="catalogue-master-hero">
      <div><span class="eyebrow">MASTER CARD DATABASE</span><h1>CARD CATALOGUE</h1><p>Every released WWE Legacy card stays visible here. Unowned cards are greyed out; owned quantities are shown on every card.</p></div>
      <div class="catalogue-master-stats"><span><b>${collectionCards.length}</b> Released</span><span><b>${ownedUnique}</b> Owned</span><span><b>${filtered.length}</b> Matching</span></div>
      <button id="catalogue-my-collection" class="nav-button catalogue-owned-link">My Collection</button>
    </section>

    <details class="catalogue-super-sort" open>
      <summary><span>SUPER SORT</span><small>Search · filter · order the full card database</small></summary>
      <div class="catalogue-super-sort-body">
        <label class="catalogue-search-wide"><span>Search everything</span><input id="catalogue-search" type="search" placeholder="Name, card code, move, Superstar, effect…" value="${String(catalogueFilter.search).replaceAll("&","&amp;").replaceAll("\"","&quot;").replaceAll("<","&lt;")}"></label>
        <div class="catalogue-filter-grid">
          <label><span>Set</span><select data-catalogue-field="setId">${setOptions}</select></label>
          <label><span>Superstar</span><select data-catalogue-field="superstarId">${superstarOptions}</select></label>
          <label><span>Superstar scope</span><select data-catalogue-field="superstarScope">${select("usage","Current deck + linked",catalogueFilter.superstarScope)}${select("exclusive","Exclusive only",catalogueFilter.superstarScope)}</select></label>
          <label><span>Ownership</span><select data-catalogue-field="ownership">${select("all","Owned + Unowned",catalogueFilter.ownership)}${select("owned","Owned only",catalogueFilter.ownership)}${select("unowned","Unowned only",catalogueFilter.ownership)}</select></label>
          <label><span>Card type</span><select data-catalogue-field="kind">${kinds.map(kind=>select(kind,kind === "all" ? "All Card Types" : kind[0].toUpperCase()+kind.slice(1),catalogueFilter.kind)).join("")}</select></label>
          <label><span>Rarity</span><select data-catalogue-field="rarity">${select("all","All Rarities",catalogueFilter.rarity)}${[1,2,3,4].map(r=>select(String(r),`${rarityStars(r)} ${setCollection.rarityLabels[r]}`,catalogueFilter.rarity)).join("")}</select></label>
          <label><span>Method</span><select data-catalogue-field="method">${methodOptions}</select></label>
          <label><span>Move type</span><select data-catalogue-field="moveType">${moveTypeOptions}</select></label>
          <label><span>Move family</span><select data-catalogue-field="moveFamily">${moveFamilyOptions}</select></label>
          <label><span>Move class</span><select data-catalogue-field="moveClass">${select("all","All Move Classes",catalogueFilter.moveClass)}${select("standard","Standard",catalogueFilter.moveClass)}${select("signature","Signature",catalogueFilter.moveClass)}${select("trademark","Trademark",catalogueFilter.moveClass)}${select("finisher","Finisher",catalogueFilter.moveClass)}</select></label>
        </div>
        <div class="catalogue-number-grid">
          <label class="catalogue-number-filter"><span>Cost</span><select data-catalogue-field="costOp">${comparatorOptions(catalogueFilter.costOp)}</select><input data-catalogue-field="costValue" type="number" min="0" max="20" inputmode="numeric" value="${catalogueFilter.costValue}"></label>
          <label class="catalogue-number-filter"><span>Damage</span><select data-catalogue-field="damageOp">${comparatorOptions(catalogueFilter.damageOp)}</select><input data-catalogue-field="damageValue" type="number" min="0" max="30" inputmode="numeric" value="${catalogueFilter.damageValue}"></label>
          <label><span>Strength =</span><select data-catalogue-field="strengthReq">${requirementOptions(catalogueFilter.strengthReq)}</select></label>
          <label><span>Strike =</span><select data-catalogue-field="strikeReq">${requirementOptions(catalogueFilter.strikeReq)}</select></label>
          <label><span>Technical =</span><select data-catalogue-field="technicalReq">${requirementOptions(catalogueFilter.technicalReq)}</select></label>
          <label><span>Agility =</span><select data-catalogue-field="agilityReq">${requirementOptions(catalogueFilter.agilityReq)}</select></label>
        </div>
        <div class="catalogue-sort-row">
          <label><span>Sort by</span><select data-catalogue-field="sortBy">${sortOptions.map(([value,label])=>select(value,label,catalogueFilter.sortBy)).join("")}</select></label>
          <label><span>Direction</span><select data-catalogue-field="sortDir">${select("asc","Ascending",catalogueFilter.sortDir)}${select("desc","Descending",catalogueFilter.sortDir)}</select></label>
          <button id="catalogue-reset" class="nav-button">Reset Super Sort</button>
        </div>
      </div>
    </details>

    <section id="catalogue-results" class="catalogue-results-head"><div><span>${filtered.length} cards match</span><b>${filtered.length ? `${start + 1}–${Math.min(start + CATALOGUE_PAGE_SIZE, filtered.length)} shown` : "Nothing to show"}</b></div>${pagination}</section>
    <section class="catalogue-grid collectible-catalogue master-catalogue-grid">${pageCards.length ? pageCards.map(card => {
      const owned = ownershipFor(card);
      const cardSet = setCollections[card.setId] ?? setCollection;
      const unowned = owned.total === 0;
      return `<article class="catalogue-collectible master-catalogue-card ${unowned ? 'catalogue-unowned' : 'catalogue-owned'}">${collectibleCardMarkup(card,{flipped:flippedCatalogueCards.has(card.id),flipAttr:`data-flip-catalogue="${card.id}"`})}<div class="catalogue-under-card master-catalogue-meta"><span>${card.cardCode}</span><b>${cardSet.rarityLabels[card.rarity]}</b><small class="catalogue-usage">${catalogueCardUsageLabel(card)}</small><strong class="catalogue-owned-count">${unowned ? "NOT OWNED" : `×${owned.total} OWNED`}</strong>${owned.foil ? `<em>${owned.normal} normal · ${owned.foil} foil</em>` : owned.normal ? `<em>${owned.normal} normal</em>` : ""}</div></article>`;
    }).join("") : `<div class="collection-empty catalogue-empty">No released cards match this Super Sort combination.</div>`}</section>
    ${filtered.length ? `<div class="catalogue-pagination catalogue-pagination-bottom">${pagination}</div>` : ""}
  </section>`;

  $("#catalogue-my-collection")?.addEventListener("click", showOwnedCollection);
  $("#catalogue-reset")?.addEventListener("click", () => { catalogueFilter = defaultCatalogueFilters(); cataloguePage = 1; flippedCatalogueCards = new Set(); renderCardCatalogue(); });
  $("#catalogue-search")?.addEventListener("input", e => { catalogueFilter.search = e.target.value; cataloguePage = 1; renderCardCatalogue(); requestAnimationFrame(() => { const input = $("#catalogue-search"); if (input) { input.focus(); input.setSelectionRange(input.value.length,input.value.length); } }); });
  root.querySelectorAll("[data-catalogue-field]").forEach(control => control.addEventListener("change", () => { catalogueFilter[control.dataset.catalogueField] = control.value; cataloguePage = 1; flippedCatalogueCards = new Set(); renderCardCatalogue(); }));
  root.querySelectorAll("[data-flip-catalogue]").forEach(btn => btn.addEventListener("click", () => { const id = btn.dataset.flipCatalogue; if (flippedCatalogueCards.has(id)) flippedCatalogueCards.delete(id); else flippedCatalogueCards.add(id); renderCardCatalogue(); }));
  root.querySelectorAll("[data-catalogue-page]").forEach(btn => btn.addEventListener("click", () => {
    cataloguePage += btn.dataset.cataloguePage === "next" ? 1 : -1;
    flippedCatalogueCards = new Set();
    renderCardCatalogue();
    requestAnimationFrame(() => $("#catalogue-results")?.scrollIntoView({block:"start"}));
  }));
}


function deckRole(card) {
  if (!card) return "Unknown";
  if (card.kind === "move") return card.finisher ? "Finisher" : card.counters?.length ? "Reversal" : `Move · Cost ${card.cost ?? 0}`;
  return card.kind[0].toUpperCase() + card.kind.slice(1);
}

function renderDeckBuilder() {
  const root = $("#game");
  if (!profile?.unlockedSuperstars?.length) { showSetup(); return; }
  if (!profile.unlockedSuperstars.includes(deckBuilderStarId)) deckBuilderStarId = profile.unlockedSuperstars[0];
  if (!deckDraft) deckDraft = createDeckDraft(profile, deckBuilderStarId);
  const star = superstarById[deckBuilderStarId];
  const health = validateDeckDraft(profile, deckBuilderStarId, deckDraft);
  const playable = materializeDraft(deckDraft);
  const leadBlueprint = recommendedDeckDraft(star?.id ?? deckBuilderStarId).slice(0,5);
  const lead = leadBlueprint.map((entry,i)=>({entry,card:collectionById.get(entry.id),slot:i+1,owned:(profile.ownedCards?.[entry.id]?.normal??0)+(profile.ownedCards?.[entry.id]?.foil??0)}));
  const tailRows = aggregateDeck(deckDraft, { tailOnly: true });
  const query = deckBuilderFilter.trim().toLowerCase();
  const pool = eligibleOwnedCards(profile, deckBuilderStarId, deckDraft).filter(row => !query || `${row.card.name} ${row.card.kind} ${row.card.moveType ?? ""}`.toLowerCase().includes(query));
  const tailCount = deckDraft.length;
  const missingSlots = Math.max(0,55-deckDraft.length);
  const superstarCard = collectionById.get(star.cardId ?? `superstar-${star.id}`);
  const linkedLead = leadOffIds(star.id);
  const linkedEntrance = collectionById.get(star.entranceId);
  const stat = (label, value, target) => `<div><span>${label}</span><b>${value}${target ? ` / ${target}` : ""}</b></div>`;
  const problems = health.violations.length ? `<div class="deck-problems">${health.violations.map(v=>`<p>${v}</p>`).join("")}</div>` : `<p class="deck-healthy">Deck is legal and ready for match play.</p>`;

  root.innerHTML = `<section class="deck-builder-screen">
    <section class="feature-hero deck-builder-hero">${modePortraits([deckBuilderStarId,"cm-punk"],"feature-art")}<div class="feature-shade"></div><div class="feature-copy">${modeLogoMarkup("decks",true)}<h2>${star.name} Deck</h2><p>The recommended deck is a blueprint. Owned recommended cards are used first; fill any missing slots manually or let Auto Fill choose legal cards from your Collection.</p><div class="top-actions"><button id="deck-play" class="nav-button">Exhibition</button><button id="deck-collection" class="nav-button">Collection</button><button id="deck-boosters" class="nav-button">Boosters</button><button id="deck-challenges" class="nav-button">Challenges</button><button id="deck-championship" class="nav-button">Championship Road</button></div></div><div class="set-stats"><div class="set-stat"><b>${health.score}</b><span>Deck health</span></div><div class="set-stat"><b>${deckDraft.length}/55</b><span>Total pages</span></div><div class="set-stat"><b>${missingSlots}</b><span>Missing slots</span></div><div class="set-stat"><b>${profile.deckAssistance}</b><span>Assistance</span></div></div></section>
    ${message ? `<p class="setup-message">${message}</p>` : ""}
    <section class="deck-star-tabs">${profile.unlockedSuperstars.map(id=>`<button data-deck-star="${id}" class="${id===deckBuilderStarId?'active':''}">${superstarById[id].name}</button>`).join("")}</section>
    <section class="linked-package"><div class="section-title"><h3>Recommended Opening Five</h3><span>Blueprint only · cards are not gifted</span></div><div class="superstar-package-card"><div class="catalogue-art">${artworkFor(superstarCard) ? `<img src="${artworkFor(superstarCard)}" alt="${star.name}">` : "Artwork pending"}</div><div><span>SUPERSTAR CARD</span><h3>${star.name}</h3><p>${star.ability.name}: ${star.ability.text}</p><small>Attached Entrance: ${linkedEntrance?.name ?? "Linked Entrance"} · Recommended opening: ${linkedLead.length} cards</small></div></div><div class="lead-off-grid">${lead.map(({entry,card,slot,owned})=>`<article class="${owned?'owned':'missing'}"><span>RECOMMENDED ${slot} · ${owned?'OWNED':'MISSING'}</span><b>${card?.name ?? entry.id}</b><small>${owned?deckRole(card):'Open packs or choose a replacement'}</small></article>`).join("")}</div>${missingSlots?`<div class="deck-gap-strip"><b>${missingSlots} DECK SLOT${missingSlots===1?'':'S'} OPEN</b>${Array.from({length:Math.min(missingSlots,10)},()=>'<span>+</span>').join('')}${missingSlots>10?`<em>+${missingSlots-10} more</em>`:''}</div>`:''}</section>
    <section class="deck-health-panel"><div class="section-title"><h3>Deck Shape</h3><span>${health.healthy ? 'LEGAL' : 'NEEDS ATTENTION'}</span></div><div class="deck-health-stats">${stat('Momentum',health.counts.momentum,RECOMMENDED_DECK_SHAPE.momentum.target)}${stat('Low-cost Moves',health.counts.lowCostMoves,RECOMMENDED_DECK_SHAPE.lowCostMoves.target)}${stat('Mid-cost Moves',health.counts.midCostMoves,RECOMMENDED_DECK_SHAPE.midCostMoves.target)}${stat('High-cost Moves',health.counts.highCostMoves,RECOMMENDED_DECK_SHAPE.highCostMoves.target)}${stat('Reversals',health.counts.counters,RECOMMENDED_DECK_SHAPE.counters.target)}${stat('Utility',health.counts.utility,RECOMMENDED_DECK_SHAPE.utility.target)}${stat('Finishers',health.counts.finishers,RECOMMENDED_DECK_SHAPE.finishers.target)}</div>${problems}<div class="deck-builder-actions"><button id="optimize-deck" class="start-match">Optimize Deck</button><button id="reset-recommended" class="nav-button">Reset Recommended</button><button id="save-deck" class="nav-button active" ${health.healthy?'':'disabled'}>Save Deck</button></div></section>
    <section class="deck-builder-columns"><section class="deck-current"><div class="section-title"><h3>Current Deck</h3><span>${deckDraft.length}/55</span></div>${tailRows.length ? tailRows.map(row=>`<article class="deck-row"><div><b>${row.card?.name ?? row.id}</b><span>${deckRole(row.card)} · ${row.normal} Normal${row.foil?` · ${row.foil} Foil`:''}</span></div><div><strong>x${row.indices.length}</strong><button data-remove-deck="${row.indices[row.indices.length-1]}" class="secondary">−1</button></div></article>`).join("") : '<p class="collection-empty">No editable cards in deck.</p>'}</section>
    <section class="deck-pool"><div class="section-title"><h3>Owned Cards</h3><span>Legal for ${star.name}</span></div><input id="deck-search" type="search" placeholder="Search owned cards" value="${deckBuilderFilter.replaceAll('"','&quot;')}"><div class="deck-pool-list">${pool.map(row=>{const available=Math.max(0,Math.min(row.cap,row.owned)-row.used);return `<article class="deck-row ${available?'':'exhausted'}"><div><b>${row.card.name}</b><span>${deckRole(row.card)} · Owned ${row.owned}${row.foilOwned?` (${row.foilOwned} Foil)`:''} · In deck ${row.used}/${row.cap}</span></div><button data-add-deck="${row.card.id}" class="primary" ${available && deckDraft.length<55?'':'disabled'}>+1</button></article>`}).join("")}</div></section></section>
  </section>`;

  root.querySelectorAll("[data-deck-star]").forEach(btn=>btn.addEventListener("click",()=>{ deckBuilderStarId=btn.dataset.deckStar; deckDraft=createDeckDraft(profile,deckBuilderStarId); message=""; renderDeckBuilder(); }));
  root.querySelectorAll("[data-remove-deck]").forEach(btn=>btn.addEventListener("click",()=>{ try { deckDraft=removeCardFromDraft(deckBuilderStarId,deckDraft,Number(btn.dataset.removeDeck)); message="Removed one editable copy. Add another owned card to return to 55."; } catch(e){message=e.message;} renderDeckBuilder(); }));
  root.querySelectorAll("[data-add-deck]").forEach(btn=>btn.addEventListener("click",()=>{ try { deckDraft=addCardToDraft(profile,deckBuilderStarId,deckDraft,btn.dataset.addDeck); message="Card added."; } catch(e){message=e.message;} renderDeckBuilder(); }));
  $("#deck-search")?.addEventListener("input",e=>{deckBuilderFilter=e.target.value;renderDeckBuilder();requestAnimationFrame(()=>$("#deck-search")?.focus());});
  $("#optimize-deck")?.addEventListener("click",()=>{ deckDraft=optimizeDeck(profile,deckBuilderStarId,deckDraft); message=deckDraft.length===55?"Auto Fill completed the deck using legal owned cards.":`Auto Fill used every legal owned card available. ${55-deckDraft.length} slots remain.`; renderDeckBuilder(); });
  $("#reset-recommended")?.addEventListener("click",()=>{ deckDraft=buildOwnedRecommendedDraft(profile,deckBuilderStarId); message=`Owned recommended cards restored. ${55-deckDraft.length} slots still need filling.`; renderDeckBuilder(); });
  $("#save-deck")?.addEventListener("click",()=>{ const check=validateDeckDraft(profile,deckBuilderStarId,deckDraft); if(!check.healthy){message="Deck is not legal yet.";renderDeckBuilder();return;} profile.savedDecks[deckBuilderStarId]=deckDraft.map(e=>({...e})); saveProfile(profile); message=`${star.name}'s deck saved.`; renderDeckBuilder(); });
  $("#deck-play")?.addEventListener("click",showSetup); $("#deck-collection")?.addEventListener("click",showCollection); $("#deck-boosters")?.addEventListener("click",showBoosters); $("#deck-challenges")?.addEventListener("click",showChallenges); $("#deck-championship")?.addEventListener("click",showChampionship);
}

function cardMeta(card) {
  if (card.kind === "momentum") return `${card.method.toUpperCase()} +${card.amount ?? 1}`;
  if (["entrance", "special", "action", "support", "manager"].includes(card.kind)) return card.abilityText ?? card.kind;
  const req = Object.entries(card.requirements ?? {}).map(([m, n]) => `${n} ${m}`).join(" · ");
  const position = [
    card.requiresPosture ? `Foe: ${card.requiresPosture}` : "",
    card.requiresLocation ? `Location: ${card.requiresLocation}` : ""
  ].filter(Boolean).join(" · ");
  const method = card.method ? `Method: ${card.method[0].toUpperCase() + card.method.slice(1)}` : "";
  const moveType = card.moveType ? `Type: ${MOVE_TYPE_LABELS[card.moveType] ?? card.moveType}` : "";
  const counters = card.counters?.length ? `Counters: ${card.counters.map(t => MOVE_TYPE_LABELS[t] ?? t).join(", ")}` : "";
  return [`Cost ${card.cost ?? 0}`, `${card.damage ?? 0} dmg`, method, moveType, counters, req, position, card.defensiveOnly ? "Counter only" : "", card.effectText ?? ""].filter(Boolean).join(" · ");
}

function cardLegal(playerId, card) {
  const state = game.state();
  if (playerId !== HUMAN) return false;
  if (state.phase === "ACTION") {
    if (card.kind === "momentum") return canPlayMomentum(state, playerId, card);
    if (card.kind === "entrance") return canPlayEntrance(state, playerId, card);
    if (card.kind === "action") return canPlayAction(state, playerId, card);
    if (card.kind === "support") return canPlaySupport(state, playerId, card);
    if (card.kind === "manager") return canPlayManager(state, playerId, card);
    if (card.kind === "move") return moveEligibility(state, playerId, card).legal;
  }
  if (state.phase === "POST_MOVE" && card.kind === "special") return canPlaySpecial(state, playerId, card);
  if (state.phase === "COUNTER" && state.proposedMove?.defenderId === playerId) return canCounter(state.proposedMove.card, card);
  if (state.phase === "PIN_RESPONSE") return canPlayPinEscape(state, playerId, card);
  return false;
}

function cardReason(playerId, card) {
  const state = game.state();
  if (playerId === CPU) return "CPU controlled";
  if (state.phase === "MATCH_OVER") return "Match over";
  if (state.playerInControl !== playerId && state.phase === "ACTION") return "Not in Control";
  if (card.kind === "momentum") return (state.players[playerId].turn?.momentumPlayed ?? 0) >= (state.players[playerId].turn?.momentumPlayLimit ?? 1) ? "Momentum already played this turn — connect a Move or begin a new turn to refresh it" : "";
  if (card.kind === "entrance") return "Entrance resolves automatically pre-match";
  if (card.kind === "action") return state.players[playerId].turn.actionPlayed >= 1 ? "Action already played this turn" : "";
  if (card.kind === "support") return state.players[playerId].turn.supportPlayed >= 1 ? "Support already played this turn" : "";
  if (card.kind === "manager") return state.players[playerId].activeManager ? "Manager already active" : "";
  if (card.kind === "special") return canPlaySpecial(state, playerId, card) ? "PLAY SPECIAL" : "Special trigger not available";
  if (card.kind === "move" && state.phase === "ACTION") return moveEligibility(state, playerId, card).reason ?? "";
  if (state.phase === "COUNTER") return canCounter(state.proposedMove.card, card) ? "Counter" : "Not a valid counter";
  if (state.phase === "PIN_RESPONSE") return canPlayPinEscape(state, playerId, card) ? "Escape pin" : "Not a pin response";
  return "";
}

function advanceCpu() {
  const { steps } = advanceCpuUntilHuman(game, CPU);
  if (game?.state().phase === "MATCH_OVER") message = game.state().winner ? `${nameFor(game.state().winner)} wins by ${game.state().finish.type.toUpperCase()}!` : `Match ends by ${game.state().finish.type.toUpperCase()}.`;
  else if (steps) message = `${nameFor(CPU)} completed its CPU decisions. Your response is ready.`;
}

function afterHumanAction() { flippedHandCards = new Set(); advanceCpu(); render(); }

function playCard(playerId, index) {
  const state = game.state(), card = state.players[playerId].hand[index];
  if (!card || playerId !== HUMAN) return;
  try {
    if (state.phase === "COUNTER") game.counter(playerId, card);
    else if (state.phase === "PIN_RESPONSE") game.playPinEscape(playerId, card);
    else if (card.kind === "momentum") game.playMomentum(playerId, card);
    else if (card.kind === "entrance") game.playEntrance(playerId, card);
    else if (card.kind === "action") game.playAction(playerId, card);
    else if (card.kind === "support") game.playSupport(playerId, card);
    else if (card.kind === "manager") game.playManager(playerId, card);
    else if (card.kind === "special") game.playSpecial(playerId, card);
    else game.declareMove(playerId, card);
    message = `${nameFor(playerId)} played ${card.name}.`;
  } catch (error) { message = error.message; }
  afterHumanAction();
}

function passAction() {
  const state = game.state();
  try {
    if (decisionOwner(state) !== HUMAN) return;
    if (state.phase === "COUNTER") game.passCounter(HUMAN);
    else if (state.phase === "PIN_RESPONSE") game.passPinResponse(HUMAN);
    else if (state.phase === "ACTION") game.passTurn(HUMAN);
  } catch (error) { message = error.message; }
  afterHumanAction();
}

function attemptPin() { try { game.attemptPin(HUMAN); } catch (e) { message = e.message; } afterHumanAction(); }
function endPostMove() { try { game.endPostMove(HUMAN); } catch (e) { message = e.message; } afterHumanAction(); }
function followOutside() { try { game.followOutside(HUMAN); message = `${nameFor(HUMAN)} followed the opponent to ringside.`; } catch (e) { message = e.message; } afterHumanAction(); }
function returnToRing() { try { game.returnToRing(HUMAN); message = `${nameFor(HUMAN)} returned to the ring.`; } catch (e) { message = e.message; } afterHumanAction(); }
function releaseSubmission() { try { game.releaseSubmission(HUMAN); } catch (e) { message = e.message; } afterHumanAction(); }
function maintainSubmission(index) {
  try { const card = game.state().players[HUMAN].hand[index]; game.maintainSubmission(HUMAN, card); }
  catch (e) { message = e.message; }
  afterHumanAction();
}

function renderMomentum(player) {
  const resources = [
    ["agility","AG",player.momentum.agility ?? 0],
    ["strength","ST",player.momentum.strength ?? 0],
    ["strike","SR",player.momentum.strike ?? 0],
    ["technical","TE",player.momentum.technical ?? 0],
    ["adrenaline","AD",player.adrenaline ?? 0]
  ];
  return resources.map(([method,label,value]) => `<span class="hud-resource ${method}" title="${method}"><i>${label}</i><b>${value}</b></span>`).join("");
}

function abilityStatus(player) {
  const ability = player.superstar.ability;
  if (ability?.passive) return "PASSIVE";
  const max = ability?.maxUses ?? 1;
  if (max > 1) return `${player.abilityUses ?? 0}/${max}`;
  return player.abilityUsed ? "USED" : "READY";
}

function submissionHud(player) {
  const labels = { head: "HD", arms: "AR", legs: "LG", back: "BK", chest: "CH", arm: "AR", leg: "LG" };
  const threshold = submissionThreshold(player);
  return Object.entries(player.submissionDamage).map(([part, value]) => {
    const pct = Math.max(0, Math.min(100, (value / threshold) * 100));
    const stateClass = pct >= 75 ? "danger" : pct >= 45 ? "warning" : "";
    return `<span class="hud-body-part ${stateClass}" title="${part} submission damage ${value}/${threshold}"><small>${labels[part] ?? part.slice(0,2).toUpperCase()}</small><b>${value}</b></span>`;
  }).join("");
}

function healthClass(player) {
  const pct = player.maxHp ? player.hp / player.maxHp : 0;
  return pct > .60 ? "healthy" : pct > .30 ? "average" : "danger";
}

function renderWrestlerHud(playerId) {
  const state = game.state(), p = state.players[playerId], cpu = playerId === CPU;
  const control = state.playerInControl === playerId && state.phase !== "MATCH_OVER";
  const statusText = `${p.posture === "on-mat" ? "GROUNDED" : "STANDING"}${p.status.stunnedTurns ? ` · STUN ${p.status.stunnedTurns}` : ""}`;
  const headshot = superstarHeadshotFor(p.superstar.id);
  const fallback = GENERIC_SUPERSTAR_PLACEHOLDER;
  return `<article class="wrestler-hud premium-headshot-hud ${cpu ? "cpu" : "human"} ${control ? "in-control" : ""}">
    <div class="hud-primary-line">
      <button type="button" class="hud-headshot-trigger" data-open-superstar="${p.superstar.id}" aria-label="Open ${p.superstar.name} Superstar card">
        <img class="hud-headshot" src="${headshot}" alt="${p.superstar.name}" data-headshot-fallback="${fallback ?? ""}" onerror="if(this.dataset.headshotFallback&&this.src!==this.dataset.headshotFallback){this.src=this.dataset.headshotFallback;return;}this.onerror=null;this.closest('.hud-headshot-trigger')?.classList.add('art-pending');">
        <span class="hud-side-label">${cpu ? "CPU" : "YOU"}${control ? " · CONTROL" : ""}</span>
      </button>
      <div class="hud-hp-number ${healthClass(p)}"><b>${p.hp}</b><small>HP</small></div>
    </div>
    <strong class="hud-superstar-name">${p.superstar.name}</strong>
    <div class="hud-resource-row">${renderMomentum(p)}</div>
    <div class="hud-body-damage"><div>${submissionHud(p)}</div></div>
    <div class="cinematic-hud-status">${statusText}</div>
  </article>`;
}
function renderSuperstarOverlay() {
  if (!superstarOverlayId) return "";
  const star = superstarById[superstarOverlayId];
  const card = superstarCollectibleFor(superstarOverlayId);
  if (!star || !card) return "";
  return `<div class="superstar-card-modal" data-superstar-modal-backdrop="1"><div class="superstar-card-modal-inner">${collectibleCardMarkup(card,{flipped:superstarOverlayFlipped,extraClass:"hud-superstar-modal-card",flipAttr:'data-flip-superstar-modal="1"'})}<small>Tap card to ${superstarOverlayFlipped ? "show front" : "flip"} · Tap outside to close</small></div></div>`;
}

function renderMatchHud() {
  const state = game.state();
  const location = state.players[CPU].location === "ring" && state.players[HUMAN].location === "ring" ? "IN THE RING" : "RINGSIDE";
  const posture = state.players[CPU].posture === "on-mat" || state.players[HUMAN].posture === "on-mat" ? "GROUNDED" : "STANDING";
  return `<section class="match-hud-shell premium-match-hud">
    <div class="match-hud-grid">${renderWrestlerHud(HUMAN)}${renderWrestlerHud(CPU)}</div>
    <div class="compact-ring-strip"><span>${state.countOut.count ? `COUNT ${state.countOut.count}/${state.countOut.limit}` : location}</span><b>${posture}</b><small>T${state.turnNumber}</small></div>
  </section>`;
}
function playedCardFromEvent(event) {
  if (!event) return null;
  let id = event.cardId ?? event.counterCardId ?? event.managerId ?? null;
  let playerId = event.playerId ?? event.attackerId ?? event.defenderId ?? null;
  if (event.type === "MOVE_COUNTERED") playerId = event.defenderId;
  if (event.type === "MOMENTUM_PLAYED") {
    const setId = game.state().players[event.playerId]?.superstar?.setId;
    id = collectionCards.find(c => c.kind === "momentum" && c.method === event.method && c.setId === setId)?.id
      ?? collectionCards.find(c => c.kind === "momentum" && c.method === event.method)?.id;
  }
  let card = id ? collectionById.get(id) : null;
  if (!card && event.type === "ENTRANCE_PREMATCH") {
    const starId = game.state().players[event.playerId]?.superstar?.id;
    card = collectionCards.find(c => c.kind === "entrance" && c.superstarId === starId && c.name === event.cardName)
      ?? collectionCards.find(c => c.kind === "entrance" && c.name === event.cardName);
  }
  return card ? { card, playerId, event } : null;
}

function currentPlayPile() {
  const state = game.state();
  const significant = new Set(["MOVE_CONNECTED","MOVE_COUNTERED","MOMENTUM_PLAYED","ACTION_PLAYED","SUPPORT_PLAYED","MANAGER_PLAYED","SPECIAL_PLAYED","PIN_ESCAPED_SPECIAL"]);
  const items = [];
  for (let i = state.log.length - 1; i >= 0; i--) {
    const event = state.log[i];
    if (event.type === "CONTROL_PASSED" && items.length) break;
    if (!significant.has(event.type)) continue;
    const found = playedCardFromEvent(event);
    if (found) items.unshift(found);
    if (items.length >= 8) break;
  }
  const proposed = state.proposedMove?.card ? { card: state.proposedMove.card, playerId: state.proposedMove.attackerId, event: { type: "MOVE_DECLARED" } } : null;
  if (proposed) items.push(proposed);
  return items.reverse();
}

function shortCardMeta(card) {
  if (card.kind === "momentum") return `${card.method?.toUpperCase() ?? "MOMENTUM"} +${card.amount ?? 1}`;
  if (card.kind === "move") return [`COST ${card.cost ?? 0}`, `${card.damage ?? 0} DMG`, card.method?.toUpperCase(), MOVE_TYPE_LABELS[card.moveType]?.toUpperCase()].filter(Boolean).join(" · ");
  return (card.abilityText ?? card.effectText ?? card.rulesText ?? card.kind).replace(/^Support —\s*/i, "");
}

function handCardMeta(card) {
  if (card.kind === "momentum") return `${card.method?.toUpperCase() ?? "MOMENTUM"} +${card.amount ?? 1}`;
  if (card.kind === "move") return [`C${card.cost ?? 0}`, `${card.damage ?? 0} DMG`, card.method?.toUpperCase(), MOVE_TYPE_LABELS[card.moveType]?.toUpperCase()].filter(Boolean).join(" · ");
  return (card.abilityText ?? card.effectText ?? card.rulesText ?? card.kind).replace(/^Support —\s*/i, "");
}

function renderPlayPile() {
  const items = currentPlayPile();
  if (!items.length) return `<section class="play-pile premium-play-pile ${presentationThemeClass(pendingMatch?.brandSetId ?? matchPresentationSetId)}"><div class="play-pile-label"><span>PLAY PILE</span><small>Ring canvas</small></div><div class="ring-play-surface"><span class="ring-ropes"></span>${setLogoMarkup(matchPresentationSetId,"ring-centre-logo")}</div></section>`;
  const cards = items.map((item,index) => {
    const card=item.card, isHuman=item.playerId===HUMAN, latest=index===0;
    const owner=`${isHuman?"YOU":"CPU"} · ${item.playerId?nameFor(item.playerId):"MATCH"}`;
    const actionLabel=item.event?.type==="MOVE_COUNTERED"?"COUNTERED":item.event?.type==="MOVE_CONNECTED"?"CONNECTED":item.event?.type==="MOVE_DECLARED"?"DECLARED":"PLAYED";
    const key=`${card.id}:${item.event?.type??"played"}:${item.playerId??"match"}`;
    const flipped=latest&&playPileCardKey===key&&playPileFlipped;
    if(latest&&key!==playPileCardKey){playPileCardKey=key;playPileFlipped=false;}
    return `<div class="play-pile-item ${isHuman?"from-you":"from-cpu"} ${latest?"is-latest":""}"><div class="play-pile-context"><span>${owner}</span><b>${actionLabel}</b></div>${collectibleCardMarkup(card,{flipped,extraClass:"play-pile-ccg",flipAttr:latest?'data-flip-play-pile="1"':''})}<small>${shortCardMeta(card)}</small></div>`;
  }).join("");
  return `<section class="play-pile premium-play-pile ${presentationThemeClass(matchPresentationSetId)}"><div class="play-pile-label"><span>PLAY PILE</span><small>${items.length} card${items.length===1?"":"s"} in current exchange</small></div><div class="ring-play-surface"><span class="ring-ropes"></span>${setLogoMarkup(matchPresentationSetId,"ring-centre-logo")}<div class="play-pile-track">${cards}</div></div></section>`;
}
function renderHumanHand() {
  const state = game.state(), p = state.players[HUMAN];
  const active = decisionOwner(state) === HUMAN && state.phase !== "MATCH_OVER";
  const momentumAvailable = (p.turn?.momentumPlayed ?? 0) < (p.turn?.momentumPlayLimit ?? 1);

  const entries = p.hand.map((card, index) => {
    const legal = active && cardLegal(HUMAN, card);
    let priority;
    // Before this turn's Momentum is used, legal Momentum is the first thing shown.
    if (card.kind === "momentum" && legal && momentumAvailable) priority = 0;
    // Then show every other card that can be played right now.
    else if (legal) priority = 1;
    // Non-playable non-Momentum pages stay ahead of spent-turn Momentum.
    else if (card.kind !== "momentum") priority = 2;
    // Once Momentum has been played this turn, all remaining Momentum moves to the end until a Move connects or a new turn begins.
    else priority = 3;
    return { card, index, legal, priority };
  }).sort((a,b) => a.priority - b.priority || a.index - b.index);

  const cards = entries.map(({card,index,legal}) => {
    const reason = legal ? (state.phase === "COUNTER" ? "COUNTER" : state.phase === "PIN_RESPONSE" ? "ESCAPE" : "PLAY") : cardReason(HUMAN, card);
    const flipKey = `${index}:${card.id}`;
    const flipped = flippedHandCards.has(flipKey);
    return `<article class="hand-card-slot horizontal-hand-card ${legal ? "is-playable" : "is-locked"}" data-original-hand-index="${index}">
      ${collectibleCardMarkup(card,{flipped,extraClass:`hand-ccg ${legal ? "playable" : "locked"}`,flipAttr:`data-flip-hand="${flipKey}"`})}
      <div class="hand-card-action"><span>${reason || "Not playable now"}</span><button type="button" data-play-hand="${index}" class="${legal ? "primary" : "secondary"}" ${legal ? "" : "disabled"}>${state.phase === "COUNTER" ? "Counter" : state.phase === "PIN_RESPONSE" ? "Escape" : "Play"}</button></div>
    </article>`;
  }).join("");

  const sortHint = momentumAvailable ? "Playable Momentum first · then playable pages" : "Momentum used this turn · connect a Move or begin a new turn to refresh it";
  return `<section class="player-hand-panel compact-hand-panel">
    <div class="player-hand-head"><div><span>YOUR HAND</span><h3>${p.superstar.name}</h3></div><div class="deck-counts"><b>${p.hand.length}</b> hand · <b>${p.deck.length}</b> deck · <b>${p.discard.length}</b> discard</div></div>
    <p class="hand-instruction">${sortHint} · Swipe horizontally to browse.</p>
    <div class="hand collectible-hand horizontal-card-hand">${cards}</div>
  </section>`;
}

function renderCommandBar() {
  const state = game.state(), owner = decisionOwner(state);
  let prompt = state.phase === "MATCH_OVER" ? (state.winner ? `${nameFor(state.winner)} wins by ${state.finish.type.toUpperCase()}!` : `Match ends by ${state.finish.type.toUpperCase()}!`) : owner === CPU ? `${nameFor(CPU)} is thinking…` : `Your turn — choose a page or action.`;
  if (state.phase === "COUNTER" && owner === HUMAN) prompt = `Counter ${state.proposedMove.card.name}, or pass.`;
  if (state.phase === "PIN_RESPONSE" && owner === HUMAN) prompt = `You are being pinned — escape or pass to the pin check.`;
  if (state.phase === "SUBMISSION_MAINTAIN" && owner === HUMAN) prompt = `Maintain the submission or release it and keep Control.`;
  const pinCheck = state.phase === "ACTION" && owner === HUMAN ? canAttemptPin(state, HUMAN) : null;
  return `<section class="match-command ${state.phase === "MATCH_OVER" ? "match-over" : ""}">
    <div class="command-status"><span>TURN ${state.turnNumber}</span><b>${state.phase.replaceAll("_", " ")}</b></div>
    <div class="command-prompt"><strong>${prompt}</strong><small>${message}</small></div>
    <div class="command-actions">
      ${owner === HUMAN && state.phase === "COUNTER" ? '<button id="pass-action" class="primary">Pass Counter</button>' : ""}
      ${owner === HUMAN && state.phase === "ACTION" && pinCheck?.legal ? `<button id="attempt-pin" class="primary pin-ready">Attempt Pin</button>` : ""}
      ${owner === HUMAN && state.phase === "ACTION" && canReturnToRing(state, HUMAN) ? '<button id="return-ring" class="primary">Return to Ring</button>' : ""}
      ${owner === HUMAN && state.phase === "ACTION" ? '<button id="pass-action" class="secondary">Pass Control</button>' : ""}
      ${owner === HUMAN && state.phase === "PIN_RESPONSE" ? '<button id="pass-action" class="primary">Pass to Pin Check</button>' : ""}
      ${owner === HUMAN && state.phase === "SUBMISSION_MAINTAIN" ? '<button id="release-submission" class="primary">Release Hold</button>' : ""}
      ${state.phase === "MATCH_OVER" && activeMode === "ladder" ? '<button id="ladder-hub" class="primary">Return to Ladder</button>' : ""}
      ${state.phase === "MATCH_OVER" && activeMode === "championship" ? '<button id="championship-hub" class="primary">Return to Championship Road</button>' : ""}
    </div>
    <details class="match-menu"><summary>Match Menu</summary><div>
      ${!(state.phase === "MATCH_OVER" && (activeMode === "ladder" || activeMode === "championship")) ? '<button id="reset-match" class="ghost">Restart</button>' : ""}
      <button id="change-matchup" class="ghost">${activeMode === "ladder" ? "Ladder Hub" : activeMode === "championship" ? "Championship Hub" : "Change Matchup"}</button>
      <button id="browse-main-menu" class="ghost">Main Menu</button><button id="browse-collection" class="ghost">Collection</button><button id="browse-boosters" class="ghost">Boosters (${profile.boosterCredits ?? 0})</button><button id="browse-challenges" class="ghost">Challenges</button><button id="browse-decks" class="ghost">Deck Builder</button>
    </div></details>
  </section>`;
}

function logText(event) {
  const n = id => id ? game.state().players[id]?.superstar.name ?? id : "";
  const map = {
    PRE_MATCH_STARTED: () => `PRE-MATCH: both linked Entrance cards are revealed.`,
    ENTRANCE_PREMATCH: () => `${n(event.playerId)} revealed ${event.cardName}.`,
    ENTRANCE_EFFECT: () => `${event.cardName} triggered for ${n(event.playerId)}.`,
    BELL_RANG: () => `The bell rings! ${n(event.control)} has opening Control.`,
    MATCH_STARTED: () => `${n(event.control)} starts Turn 1 in Control.`, MOMENTUM_PLAYED: () => `${n(event.playerId)} played ${event.method} Momentum.`,
    ENTRANCE_PLAYED: () => `${n(event.playerId)} played Entrance ${event.cardId}.`, ACTION_PLAYED: () => `${n(event.playerId)} played ${cardNameFor(event.cardId)}.`, SUPPORT_PLAYED: () => `${n(event.playerId)} put ${cardNameFor(event.cardId)} into play.`, SUPPORT_REPLACED: () => `${n(event.playerId)} discarded ${cardNameFor(event.cardId)}.`, MANAGER_PLAYED: () => `${n(event.playerId)} brought ${event.managerName} to ringside.`, MANAGER_ABILITY: () => `${event.managerName} assisted ${n(event.playerId)}.`, MOVE_DECLARED: () => `${n(event.playerId)} declared ${cardNameFor(event.cardId)}.`,
    MOVE_COUNTERED: () => `${n(event.defenderId)} countered ${cardNameFor(event.incomingCardId)} with ${cardNameFor(event.counterCardId)}.`, AUTO_COUNTER: () => `${n(event.defenderId)} Auto Countered by ditching 7 pages.`,
    COUNTER_PASSED: () => `${n(event.defenderId)} passed the counter window.`, MOVE_CONNECTED: () => `${cardNameFor(event.cardId)} connected for ${event.damage} damage${event.finisher ? " (FINISHER)" : ""}.`,
    CARDS_DRAWN: () => `${n(event.playerId)} drew ${event.cardIds.length} page${event.cardIds.length === 1 ? "" : "s"}.`, CONTROL_PASSED: () => `${n(event.from)} passed Control to ${n(event.to)}.`, CONTROL_RETAINED: () => `${n(event.playerId)} connected and keeps Control.`, CRITICAL_EXHAUSTION: () => `${n(event.playerId)} is at 0 HP and cannot retain Control. Control passes to ${n(event.to)}.`,
    POST_MOVE_WINDOW: () => `${n(event.attackerId)} has a post-move finish window.`, PIN_ATTEMPTED: () => `${n(event.attackerId)} attempts pin #${event.attemptNumber}; ${event.chance}% prototype chance.`,
    PIN_ESCAPED_SPECIAL: () => `${n(event.defenderId)} used a pin-escape Special.`, PIN_CHECK: () => `Pin check: rolled ${event.roll} vs ${event.chance}%.`, KICK_OUT: () => `${n(event.defenderId)} kicks out and takes Control.`,
    SUBMISSION_DAMAGE: () => `${event.bodyPart} submission pressure ${event.total}/${event.threshold}.`, SUBMISSION_MAINTAINED: () => `${n(event.attackerId)} maintained the hold.`, SUBMISSION_RELEASED: () => `${n(event.attackerId)} released the hold and kept Control.`,
    SUPERSTAR_ABILITY: () => `${n(event.playerId)} triggered ${event.abilityName}${event.maxUses > 1 ? ` (${event.use}/${event.maxUses})` : ""}.`, SUPERSTAR_PASSIVE: () => `${n(event.playerId)}'s ${event.abilityName} prevented the Stun.`, SENT_TO_RINGSIDE: () => `${n(event.defenderId)} was sent to ringside.`, FOLLOWED_OUTSIDE: () => `${n(event.attackerId)} followed the fight to ringside.`, RETURNED_TO_RING: () => `${n(event.playerId)} returned to the ring.`, COUNT_OUT_TICK: () => `Referee count: ${event.count}/${game.state().countOut.limit}.`, COUNT_OUT_RESET: () => `Count-out reset after both wrestlers returned to the ring.`, MATCH_ENDED: () => event.winnerId ? `${n(event.winnerId)} wins by ${event.finishType.toUpperCase()}.` : `Match ends by ${event.finishType.toUpperCase()}.`
  };
  return map[event.type]?.() ?? event.type.replaceAll("_", " ").toLowerCase();
}

function renderMatchLog() {
  const entries = [...game.state().log].reverse();
  return `<details class="match-log compact-log"><summary><span>Match Log</span><b>${entries.length} actions</b></summary><div class="match-log-scroll">${entries.map(e=>`<p><b>T${e.turn}</b> ${logText(e)}</p>`).join("")}</div></details>`;
}

function renderSubmissionChooser() {
  const state = game.state(); if (state.phase !== "SUBMISSION_MAINTAIN" || decisionOwner(state) !== HUMAN) return "";
  const sub = state.submission, attacker = state.players[HUMAN], defender = state.players[sub.defenderId];
  const total = defender.submissionDamage[sub.bodyPart], threshold = submissionThreshold(defender), pct = Math.min(100,(total/threshold)*100);
  return `<section class="submission-panel premium-submission"><div class="submission-lock-head"><span>${sub.finisher ? "SUBMISSION FINISHER" : sub.trademark ? "TRADEMARK HOLD" : "SUBMISSION LOCKED IN"}</span><h3>${cardNameFor(sub.cardId)}</h3><small>${sub.bodyPart.toUpperCase()} PRESSURE</small></div><div class="submission-pressure"><div><b>${total}</b><span>/ ${threshold} TO TAP</span></div><i><em style="width:${pct}%"></em></i></div><p>Ditch one page to squeeze again for <b>+${sub.damage}</b> pressure. Release the hold to keep Control.</p><div class="ditch-row">${attacker.hand.map((c,i)=>`<button data-ditch="${i}"><span>DITCH</span><b>${c.name}</b></button>`).join("")}</div></section>`;
}

function handleCompletedMatch() {
  const state = game.state();
  if (state.phase !== "MATCH_OVER" || matchRewarded) return;
  matchRewarded = true;
  recordCompletedMatchChallenges(profile, state, HUMAN, activeMode);
  const result = state.winner === HUMAN ? "win" : state.winner === CPU ? "loss" : "draw";
  const seasonXpReward = awardMatchSeasonXp(profile, result);
  const seasonXpText = seasonXpReward.awarded ? ` +${seasonXpReward.awarded} Season XP.` : "";

  if (activeMode === "championship") {
    const runBefore = championshipRoadState(profile).activeRun;
    const rewardSetId = runBefore?.setId ?? "summerslam-series-1";
    if (result === "win") grantBooster(profile, 1, rewardSetId);
    const outcome = recordChampionshipMatch(profile, result);
    const run = championshipRoadState(profile).activeRun;
    if (outcome.status === "advance") message = `${CHAMPIONSHIP_STAGES[run.stage - 1]} won! +1 booster. Return to Championship Road for ${CHAMPIONSHIP_STAGES[run.stage]}.`;
    else if (outcome.status === "retry" && result === "loss") message = `Defeat. Championship Road is still alive — retry ${CHAMPIONSHIP_STAGES[run.stage]}.`;
    else if (outcome.status === "retry") message = `Draw. Replay ${CHAMPIONSHIP_STAGES[run.stage]}.`;
    else if (outcome.status === "cleared") {
      if (outcome.firstWithSuperstar) { grantBooster(profile, 1, rewardSetId); message = `CHAMPIONSHIP ROAD CLEARED! Final win: +1 booster, Championship Pack awarded, plus a first-clear bonus booster for ${superstarById[run.superstarId].name}.`; }
      else message = `CHAMPIONSHIP ROAD CLEARED! Final win: +1 booster and a Championship Pack has been awarded.`;
    }
    message += seasonXpText;
    saveProfile(profile);
    return;
  }

  if (activeMode !== "ladder") {
    if (state.winner === HUMAN) {
      const rewardSetId = state.players[HUMAN].superstar.setId ?? "summerslam-series-1";
      grantBooster(profile, 1, rewardSetId);
      message += ` Victory reward: +1 ${sets[rewardSetId]?.displayName ?? rewardSetId} booster.`;
    }
    message += seasonXpText;
    saveProfile(profile);
    return;
  }

  const ladderRunBefore = ladderState(profile).activeRun;
  const ladderRewardSetId = ladderRunBefore?.setId ?? "summerslam-series-1";
  if (result === "win") grantBooster(profile, 1, ladderRewardSetId);
  const outcome = recordLadderMatch(profile, result);
  const run = ladderState(profile).activeRun;
  if (outcome.status === "advance") message = `Rung cleared! +1 booster. ${run.lives} lives remain. Return to Climb the Ladder for rung ${run.rung + 1}.`;
  else if (outcome.status === "retry" && result === "loss") message = `Defeat. One life lost — ${run.lives} remaining. Return to Climb the Ladder to retry this rung.`;
  else if (outcome.status === "retry") message = `Draw. No life lost; replay this rung.`;
  else if (outcome.status === "failed") message = `Run ended. All three lives are gone — start again from rung 1.`;
  else if (outcome.status === "cleared") message = `CLIMB THE LADDER CLEARED! +1 booster for the final win and a Completion Pack has been awarded.`;
  message += seasonXpText;
  saveProfile(profile);
}

function renderMatchResults() {
  const state=game.state();
  const humanWon=state.winner===HUMAN, draw=!state.winner;
  const winnerName=state.winner ? nameFor(state.winner) : "DRAW";
  const loserId=state.winner===HUMAN?CPU:HUMAN;
  const finish=(state.finish?.type??"match").replaceAll("_"," ").toUpperCase();
  const humanStar=state.players[HUMAN].superstar;
  const rewardSetId=humanStar.setId??"summerslam-series-1";
  const rewardName=sets[rewardSetId]?.displayName??rewardSetId;
  const rewardLine=humanWon ? `1 × ${rewardName} Booster` : "Match progression recorded";
  return `<section class="match-results-screen ${humanWon?"victory":draw?"draw":"defeat"}"><div class="results-aura"></div><span class="results-kicker">MATCH COMPLETE</span><h1>${humanWon?"VICTORY":draw?"DRAW":"DEFEAT"}</h1><div class="results-star results-winning-card">${(()=>{const sid=state.winner?state.players[state.winner].superstar.id:humanStar.id;const c=superstarCollectibleFor(sid);return c?collectibleCardMarkup(c,{extraClass:"results-superstar-card"}):portraitMarkup(sid,winnerName);})()}</div><h2>${winnerName}</h2>${state.winner?`<p>def. ${nameFor(loserId)} · ${finish} · TURN ${state.turnNumber}</p>`:`<p>${finish} · TURN ${state.turnNumber}</p>`}<section class="results-rewards"><span>MATCH REWARDS</span>${humanWon?`<div class="results-pack-reward"><div class="booster-pack results-booster pack-set-${state.players[HUMAN].superstar.setId}">${setLogoMarkup(state.players[HUMAN].superstar.setId,"pack-set-logo")}<b>BOOSTER</b></div><strong>${rewardLine}</strong></div>`:`<strong>${rewardLine}</strong>`}<small>${message}</small></section><div class="results-actions">${humanWon?`<button id="results-reward" class="start-match">VIEW REWARDS</button>`:""}<button id="results-continue" class="nav-button">${activeMode==="ladder"?"RETURN TO LADDER":activeMode==="championship"?"CHAMPIONSHIP ROAD":"CONTINUE"}</button>${activeMode==="exhibition"?'<button id="results-rematch" class="nav-button">REMATCH</button>':""}</div></section>`;
}

function render() {
  setChrome();
  if (screen === "setup" || !game) { renderSetup(); return; }
  handleCompletedMatch();
  const root = $("#game");
  if (game.state().phase === "MATCH_OVER") {
    root.innerHTML = renderMatchResults();
    $("#results-reward")?.addEventListener("click", showBoosters);
    $("#results-continue")?.addEventListener("click", activeMode === "ladder" ? showLadder : activeMode === "championship" ? showChampionship : showMainMenu);
    $("#results-rematch")?.addEventListener("click", restartMatch);
    return;
  }
  document.body.dataset.matchTheme = matchPresentationSetId ?? "summerslam-series-1";
  root.innerHTML = `<section class="match-experience ${presentationThemeClass(matchPresentationSetId)}">${renderMatchHud()}${renderPlayPile()}${renderCommandBar()}${renderSubmissionChooser()}${renderHumanHand()}${renderMatchLog()}</section>${renderSuperstarOverlay()}`;
  root.querySelectorAll("[data-flip-hand]").forEach(btn => btn.addEventListener("click", () => { const key = btn.dataset.flipHand; if (flippedHandCards.has(key)) flippedHandCards.delete(key); else flippedHandCards.add(key); render(); }));
  root.querySelectorAll("[data-play-hand]").forEach(btn => btn.addEventListener("click", () => playCard(HUMAN, Number(btn.dataset.playHand))));
  root.querySelectorAll("[data-flip-play-pile]").forEach(btn => btn.addEventListener("click", () => { playPileFlipped = !playPileFlipped; render(); }));
  root.querySelectorAll("[data-open-superstar]").forEach(btn => btn.addEventListener("click", () => { superstarOverlayId = btn.dataset.openSuperstar; superstarOverlayFlipped = false; render(); }));
  root.querySelectorAll("[data-flip-superstar-modal]").forEach(btn => btn.addEventListener("click", event => { event.stopPropagation(); superstarOverlayFlipped = !superstarOverlayFlipped; render(); }));
  root.querySelectorAll("[data-superstar-modal-backdrop]").forEach(backdrop => backdrop.addEventListener("click", event => { if (event.target !== backdrop) return; superstarOverlayId = null; superstarOverlayFlipped = false; render(); }));
  $("#pass-action")?.addEventListener("click", passAction); $("#attempt-pin")?.addEventListener("click", attemptPin);
  $("#return-ring")?.addEventListener("click", returnToRing); $("#follow-outside")?.addEventListener("click", followOutside);
  $("#reset-match")?.addEventListener("click", restartMatch); $("#change-matchup")?.addEventListener("click", activeMode === "ladder" ? showLadder : activeMode === "championship" ? showChampionship : showSetup); $("#browse-main-menu")?.addEventListener("click", showMainMenu); $("#ladder-hub")?.addEventListener("click", showLadder); $("#championship-hub")?.addEventListener("click", showChampionship); $("#browse-collection")?.addEventListener("click", showCollection); $("#browse-boosters")?.addEventListener("click", showBoosters); $("#browse-challenges")?.addEventListener("click", showChallenges); $("#browse-decks")?.addEventListener("click", () => showDeckBuilder(selection.p1)); $("#release-submission")?.addEventListener("click", releaseSubmission);
  root.querySelectorAll("[data-ditch]").forEach(btn => btn.addEventListener("click", () => maintainSubmission(Number(btn.dataset.ditch))));
}

document.querySelectorAll("[data-mobile-nav]").forEach(button => button.addEventListener("click", () => {
  const target = button.dataset.mobileNav;
  if (target === "menu") showMainMenu();
  else if (target === "play-menu") showPlayMenu();
  else if (target === "collection") showOwnedCollection();
  else if (target === "catalogue") showCardCatalogue();
  else if (target === "boosters") showBoosters();
  else if (target === "seasons") showSeasons();
  else if (target === "store") showStore();
  else if (target === "profile") showProfile();
}));

if (screen === "splash") renderSplash(); else if (screen === "starter") renderStarter(); else if (screen === "menu") renderMainMenu(); else if (screen === "play-menu") renderPlayMenu(); else if (screen === "profile") renderProfile(); else if (screen === "options") renderOptions(); else if (screen === "launch-releases") renderLaunchReleases(); else if (screen === "boosters") renderBoosters(); else if (screen === "store") renderStore(); else if (screen === "catalogue") renderCardCatalogue(); else if (screen === "ladder") renderLadder(); else if (screen === "championship") renderChampionship(); else if (screen === "challenges") renderChallenges(); else if (screen === "seasons") renderSeasons(); else if (screen === "deck-builder") renderDeckBuilder(); else renderSetup();

setInterval(refreshSeasonClocks, 1000);
