import { assetUrl, BUILD_VERSION } from "../config/build.js?v=0.12.14";
import { superstars } from "../data/superstars.js?v=0.12.14";
import { decks } from "../data/decks.js?v=0.12.14";
import { sets } from "../data/sets.js?v=0.12.14";
import { LAUNCH_LIVE_SET_IDS, isLaunchLiveSetId, isPlayerReleasedSetId, isPlayerVisibleSuperstar } from "../data/release.js?v=0.12.14";
import { collectionCards, setCollection, setCollections, cardsForSet } from "../data/collection.js?v=0.12.14";
import { artworkFor, superstarArtwork, superstarCardArtFor, superstarHeadshotFor, finishedCardArtFor, legacyFinishedCardArtFor } from "../data/artwork.js?v=0.12.14";
import { STARTER_CHOICES, createProfile, hasSuperstar, loadProfile, saveProfile, resetProfile, setDeckAssistance, ownedCount } from "../data/profile.js?v=0.12.14";
import { openBooster, openLadderCompletionPack, openChampionshipPack, grantBooster, boosterCreditsFor, finalizePackUniversePoints } from "../data/boosters.js?v=0.12.14";
import { STORE_BOOSTER_PRICE, STORE_SUPERSTAR_PRICE, storeRotation, storeSuperstars, storeLeadOffCards, purchaseStoreBooster, purchaseStoreSuperstar } from "../data/store.js?v=0.12.14";
import { randomExhibitionOpponent } from "../data/matchmaking.js?v=0.12.14";
import { buildPlayableDeck, findPackUpgrades, applyUpgrade } from "../data/deck-assistant.js?v=0.12.14";
import { MatchEngine } from "../engine/MatchEngine.js?v=0.12.14";
import { canPlayMomentum, canPlayEntrance, canPlayAction, canPlaySupport, canPlayManager, canPlaySpecial, effectiveTotalMomentum, moveEligibility, canCounter, canAttemptPin, canPlayPinEscape, submissionThreshold, canReturnToRing, canFollowOutside } from "../engine/rules.js?v=0.12.14";
import { totalMomentum } from "../engine/utils.js?v=0.12.14";
import { healthZone } from "../engine/health.js?v=0.12.14";
import { decisionOwner } from "../ai/WrestlingAI.js?v=0.12.14";
import { advanceCpuUntilHuman } from "./turn-driver.js?v=0.12.14";
import { LADDER_LIVES, LADDER_BRANCHES, ladderState, startLadderRun, currentLadderOpponent, recordLadderMatch } from "../data/ladder.js?v=0.12.14";
import { CHAMPIONSHIP_ROAD_LENGTH, CHAMPIONSHIP_STAGES, CHAMPIONSHIP_BRANCHES, championshipRoadState, startChampionshipRoad, currentChampionshipOpponent, recordChampionshipMatch, resetChampionshipRoad } from "../data/championship-road.js?v=0.12.14";
import { challengeState, claimChallenge, recordCompletedMatchChallenges } from "../data/challenges.js?v=0.12.14";
import { setProgressState, collectionProgress, availableMilestoneRewards, claimMilestone } from "../data/set-progression.js?v=0.12.14";
import { MOVE_TYPE_LABELS } from "../data/move-types.js?v=0.12.14";
import { CATALOGUE_PAGE_SIZE, defaultCatalogueFilters, catalogueOptions, filterAndSortCatalogue, superstarIdsForCard, isSharedCard } from "../data/catalogue.js?v=0.12.14";
import { DECK_LAB_CATEGORIES, createDeckDraft, recommendedDeckDraft, optimizeDeck, aggregateDeck, eligibleOwnedCards, allOwnedEntrances, ownedCardsForCategory, addCardToDraft, removeCardFromDraft, replaceLeadOffSlot, validateDeckDraft, materializeDraft, leadOffIds, buildOwnedRecommendedDraft, autoFillOwnedDraft, recommendedCategoryCounts, currentCategoryCounts, cardEligibilityForSuperstar, entranceEligibilityForSuperstar, selectedEntranceId, setSelectedEntrance, ownedTotal } from "../data/deck-builder.js?v=0.12.14";
import { RECOMMENDED_DECK_SHAPE } from "../data/deck-health.js?v=0.12.14";
import { SEASON_1, SEASON_TIER_COUNT, XP_PER_TIER, MATCH_XP, seasonState, seasonTier, seasonLevelProgress, seasonTimeRemaining, nextRoadmapNode, roadmapNodeStatus, awardMatchSeasonXp, tierReward, claimSeasonTier, claimAllSeasonTiers, freePackStatus, claimFreeSeasonBooster } from "../data/seasons.js?v=0.12.14";

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
let collectionRenderLimit = 48;
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
let deckLabStage = "roster";
let deckLabPicker = null;
let deckLabOnlyValid = false;
let deckLabEntranceId = null;
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
let pendingTierUp = null;

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

const roster = Object.values(superstars).filter(star => !star.developmentOnly && isLaunchLiveSetId(star.setId));
const superstarById = Object.fromEntries(Object.values(superstars).filter(star => !star.developmentOnly && isPlayerReleasedSetId(star.setId)).map(star => [star.id, star]));
const launchCollectionCards = collectionCards.filter(card => isLaunchLiveSetId(card.setId));
const launchSetCollections = Object.fromEntries(Object.entries(setCollections).filter(([setId]) => isLaunchLiveSetId(setId)));
function playerFacingCollectionCards() {
  const rewardCards = collectionCards.filter(card => card.setId === "season-1-final-boss" && (ownedCount(profile, card.id, "normal") + ownedCount(profile, card.id, "foil") > 0));
  return [...launchCollectionCards, ...rewardCards];
}
function playerFacingSetCollections() {
  const out = { ...launchSetCollections };
  if (playerFacingCollectionCards().some(card => card.setId === "season-1-final-boss")) out["season-1-final-boss"] = setCollections["season-1-final-boss"];
  return out;
}
const collectionById = new Map(collectionCards.map(card => [card.id, card]));
function onboardingMarkup() {
  if (!profile?.onboarding || profile.onboarding.complete || !game) return "";
  const st=game.state();
  let text="Play a Momentum page first. Momentum stays with you all match and helps meet Method requirements and costs.";
  const human=st?.players?.[HUMAN];
  const momentumTotal=Object.values(human?.momentum??{}).reduce((sum,v)=>sum+(Number(v)||0),0);
  if (momentumTotal>0) text="Now play a legal Move. Control lets you keep attacking until the sequence ends.";
  if ((st?.turnNumber??1)>2) text="Wear the opponent down, then PIN after a connected Move or work a body part with Submissions.";
  return `<aside class="onboarding-coach" role="dialog" aria-label="First match guide"><span>FIRST MATCH</span><b>${text}</b><button id="skip-onboarding" type="button">Got it</button></aside>`;
}
const rosterForBranch = (branch) => roster.filter(star => star.setId === branch.setId && (!branch.era || star.era === branch.era));
const $ = selector => document.querySelector(selector);
const nameFor = id => id ? game.state().players[id]?.superstar.name ?? id : "No one";
const cardNameFor = id => id ? collectionById.get(id)?.name ?? id : "";
const superstarVisualMarkup = (id, name, cls = "") => {
  const cardArt = superstarCardArtFor(id);
  const portrait = superstarArtwork[id] ?? null;
  const placeholder = assetUrl("assets/cards/art/temp/superstar-placeholder.svg");
  if (cardArt) {
    const fallback = portrait || placeholder;
    return `<img class="${cls} superstar-card-visual" src="${cardArt}" alt="${name}" data-superstar-card-art="${id}" onerror="this.onerror=null;this.dataset.artFallback='portrait';this.src='${fallback}';">`;
  }
  if (portrait && !portrait.includes('superstar-placeholder.svg')) return `<img class="${cls} superstar-card-visual" src="${portrait}" alt="${name}" onerror="this.onerror=null;this.dataset.artFallback='placeholder';this.src='${placeholder}';">`;
  return `<img class="${cls} superstar-card-visual is-placeholder-art" src="${placeholder}" alt="${name} artwork pending">`;
};
const portraitMarkup = superstarVisualMarkup;
const GENERIC_SUPERSTAR_PLACEHOLDER = assetUrl("assets/cards/art/temp/superstar-placeholder.svg");

const SET_LOGO_ASSETS = {
  "survivor-series-series-1": assetUrl("assets/branding/survivor-series-series-1/survivor-series-wargames-houston-2026.png"),
  "summerslam-series-1": assetUrl("assets/art/summerslam-series-1/summerslam-2026-logo.png"),
  "hall-of-fame-series-1": assetUrl("assets/art/hall-of-fame-series-1/hall-of-fame-logo.png"),
  "evolution-series-1": assetUrl("assets/art/evolution-series-1/evolution-logo.png"),
  "season-1-final-boss": assetUrl("assets/art/season-1-final-boss/rewards-logo.png"),
  "season-2-whos-next": assetUrl("assets/art/season-1-final-boss/rewards-logo.png"),
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

function uiIcon(name, className = "ui-icon") {
  const icons = {
    bolt: '<path d="M13 2 4 14h7l-1 8 9-13h-7z"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4M17 3v4M3 10h18"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0V4Z"/><path d="M8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4M12 13v4M8 21h8M9 17h6"/>',
    cards: '<rect x="6" y="4" width="13" height="16" rx="2"/><path d="M3 8V6a2 2 0 0 1 2-2h9M9 8h7M9 12h7M9 16h5"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z"/>',
    xp: '<circle cx="12" cy="12" r="9"/><path d="m8 9 8 6M16 9l-8 6"/>',
    points: '<path d="M12 3 4 7v10l8 4 8-4V7z"/><path d="m8 12 3 3 5-6"/>',
    drop: '<path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/>',
    gift: '<rect x="4" y="9" width="16" height="12" rx="2"/><path d="M12 9v12M3 9h18M7.5 9C5 9 4 7.5 4.8 6.2 6.2 4 9.5 7 12 9c2.5-2 5.8-5 7.2-2.8C20 7.5 19 9 16.5 9"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="m8 12 2.7 2.7L16.5 9"/>',
    pack: '<path d="M6 4h12l2 5-2 11H6L4 9z"/><path d="M4 9h16M9 4l1 5M15 4l-1 5"/>'
  };
  return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons[name] ?? icons.star}</svg>`;
}

const MATCH_PRESENTATION_SETS = [...LAUNCH_LIVE_SET_IDS];
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
function superstarPreviewCardMarkup(starId, extraClass = "") {
  const star = superstarById[starId];
  const card = superstarCollectibleFor(starId);
  if (!star) return "";
  if (card && superstarCardArtFor(starId)) return collectibleCardMarkup(card,{extraClass,interactive:false});
  const rarity = Math.max(1, Math.min(4, Number(card?.rarity ?? 4)));
  const portrait = superstarArtwork[starId] ?? GENERIC_SUPERSTAR_PLACEHOLDER;
  return `<span class="generated-superstar-preview ${extraClass} set-${star.setId}">
    <span class="generated-superstar-art"><img src="${portrait}" alt="${star.name}" onerror="this.onerror=null;this.src='${GENERIC_SUPERSTAR_PLACEHOLDER}';"></span>
    <span class="generated-superstar-shade"></span>
    <span class="generated-superstar-stars">${Array.from({length:rarity},()=>"★").join("")}</span>
    <span class="generated-superstar-logo">${setLogoMarkup(star.setId,"generated-set-logo")}</span>
    <strong>${star.name}</strong>
  </span>`;
}
function configuredEntranceForStar(starId) {
  const star = superstarById[starId];
  if (!star) return null;
  const entranceId = selectedEntranceId(profile, starId) ?? star.entranceId;
  if (!entranceId || entranceId === star.entranceId) return star.entrance ?? collectionById.get(entranceId) ?? null;
  const card = collectionById.get(entranceId);
  return card ? { ...card, rulesText: card.rulesText ?? card.abilityText ?? card.effectText ?? "" } : star.entrance;
}
function superstarWithConfiguredEntrance(starId) {
  const star = superstarById[starId];
  if (!star) return null;
  const entrance = configuredEntranceForStar(starId);
  return { ...star, entranceId: entrance?.id ?? star.entranceId, entrance: entrance ?? star.entrance };
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

function attentionState() {
  if (!profile) return { boosters: 0, challenges: 0, seasons: 0 };
  const boosters = Object.values(profile.boosterCreditsBySet ?? {}).reduce((sum, value) => sum + (Number(value) || 0), 0);
  const challengeData = challengeState(profile);
  const challenges = [...(challengeData.daily ?? []), ...(challengeData.weekly ?? [])].filter(c => !c.claimed && (c.progress ?? 0) >= c.target).length;
  const reached = seasonTier(profile);
  const claimed = new Set(seasonState(profile).claimedTiers ?? []);
  const seasons = Array.from({ length: reached }, (_, i) => i + 1).filter(tier => !claimed.has(tier)).length + (freePackStatus(profile).available ? 1 : 0);
  return { boosters, challenges, seasons };
}
function attentionBadge(key) { const count = attentionState()[key] ?? 0; return count > 0 ? `<i class="attention-badge">${count > 99 ? '99+' : count}</i>` : ''; }
function attentionClass(key) { return (attentionState()[key] ?? 0) > 0 ? 'has-attention' : ''; }

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
    const activeTarget = screen === "setup" || screen === "ladder" || screen === "championship" ? "play-menu" : screen === "deck-builder" ? "deck-builder" : screen === "catalogue" ? "catalogue" : screen === "collection" ? "collection" : screen;
    const notices = attentionState();
    mobileNav.querySelectorAll("[data-mobile-nav]").forEach(button => {
      button.classList.toggle("is-active", button.dataset.mobileNav === activeTarget);
      button.setAttribute("aria-current", button.dataset.mobileNav === activeTarget ? "page" : "false");
      const key = button.dataset.mobileNav === "boosters" ? "boosters" : button.dataset.mobileNav === "challenges" ? "challenges" : button.dataset.mobileNav === "seasons" ? "seasons" : null;
      const count = key ? notices[key] ?? 0 : 0;
      button.classList.toggle("has-attention", count > 0);
      let badge = button.querySelector(".nav-attention-badge");
      if (count > 0 && !badge) { badge = document.createElement("i"); badge.className = "nav-attention-badge"; button.appendChild(badge); }
      if (badge && count > 0) badge.textContent = count > 99 ? "99+" : String(count);
      if (badge && count < 1) badge.remove();
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
  const p1Star = superstarWithConfiguredEntrance(p1Id), p2Star = superstarById[p2Id];
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
  const entranceCard = collectionById.get(star.entranceId) ?? entranceCollectibleFor(star.id);
  const isHuman = entranceIntroPlayerId === HUMAN;
  const callouts = entranceEffectCallouts(star);
  const brandSetId = pendingMatch?.brandSetId ?? matchPresentationSetId ?? star.setId;
  root.innerHTML = `<section class="prematch-screen entrance-intro-screen ${presentationThemeClass(brandSetId)}">
    <div class="prematch-brand">${setLogoMarkup(brandSetId, "prematch-show-logo")}</div>
    <div class="entrance-intro-heading"><span>${isHuman ? "YOUR ENTRANCE" : "OPPONENT ENTRANCE"}</span><h2>${star.name}</h2></div>
    <div class="entrance-crowd-chants ${entranceIntroRevealed ? "entrance-revealed" : ""}">${callouts.map((text,index)=>`<span class="entrance-callout callout-${index+1}">${text}</span>`).join("")}</div>
    <div class="entrance-stage ${entranceIntroRevealed ? "entrance-revealed" : ""}">
      <div class="entrance-card-transition intro-superstar-layer">${starCard ? collectibleCardMarkup(starCard,{extraClass:"intro-superstar-card"}) : superstarVisualMarkup(star.id,star.name)}</div>
      <div class="entrance-card-transition intro-entrance-layer">${entranceCard ? collectibleCardMarkup(entranceCard,{flipped:entranceIntroFlipped,extraClass:"intro-main-card",flipAttr:'data-flip-entrance="1"'}) : `<div class="entrance-card-fallback"><b>${star.entrance?.name ?? "Entrance"}</b><p>${star.entrance?.rulesText ?? ""}</p></div>`}</div>
    </div>
    <small class="entrance-tap-hint">Tap the Entrance card to ${entranceIntroFlipped ? "return to artwork" : "flip and view effects"}.</small>
    <button id="entrance-next" class="start-match prematch-start">Next</button>
  </section>`;
  if (!entranceIntroRevealed) requestAnimationFrame(() => requestAnimationFrame(() => { root.querySelector(".entrance-stage")?.classList.add("entrance-revealed"); root.querySelector(".entrance-crowd-chants")?.classList.add("entrance-revealed"); entranceIntroRevealed = true; }));
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
function showDeckBuilder(starId = null) {
  if (!profile) { screen = "starter"; renderStarter(); return; }
  const unlocked = profile.unlockedSuperstars ?? [];
  if (starId && unlocked.includes(starId)) {
    deckBuilderStarId = starId;
    deckDraft = createDeckDraft(profile, deckBuilderStarId);
    deckLabEntranceId = selectedEntranceId(profile, deckBuilderStarId);
    deckLabStage = "editor";
  } else {
    deckBuilderStarId = unlocked.includes(deckBuilderStarId) ? deckBuilderStarId : (unlocked[0] ?? profile.starterId);
    deckDraft = null;
    deckLabEntranceId = null;
    deckLabStage = "roster";
  }
  deckLabPicker = null;
  deckLabOnlyValid = false;
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
    setTimeout(() => { if (screen !== "boosters") return; packStage = "reveal"; message = "Tap each card to reveal it, then tap again to continue through the pack." ; renderBoosters(); }, 900);
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
          ${collectibleCardMarkup(p.card,{flipped:false,foil:p.foil,extraClass:"booster-ccg",flipAttr:`data-booster-inspect="${boosterFocusIndex}"`})}
        </div>`;
    const dots=pulls.map((_,i)=>`<i class="${i===boosterFocusIndex?'current':''} ${revealedPackCards.has(i)?'revealed':''}"></i>`).join("");
    packArea=`<section class="single-card-reveal-stage">
      <div class="booster-card-progress"><span>CARD ${boosterFocusIndex+1} OF ${pulls.length}</span><div>${dots}</div></div>
      <div class="booster-pull-rarity-slot">${revealed?`<div class="booster-pull-rarity rarity-${p.card.rarity}"><span>${rarityName(p).toUpperCase()}</span>${p.foil?'<b>FOIL</b>':''}${p.isNewCard?'<b>NEW</b>':''}</div>`:'<span aria-hidden="true"></span>'}</div>
      <div class="single-card-slot">${cardMarkup}</div>
      <p class="reveal-progress">${revealed ? (boosterFocusIndex===pulls.length-1?'Tap card to view pack summary':'Tap card for next') : 'Tap card to reveal'}</p>
    </section>`;
  } else if (packStage === "summary" && pulls.length) {
    const newCount=pulls.filter(p=>p.isNewCard).length;
    const convertedPulls=pulls.filter(p=>p.universePointsValue>0);
    const convertedUp=convertedPulls.reduce((sum,p)=>sum+(p.universePointsValue||0),0);
    const conversionRows=convertedPulls.map(p=>`<div class="up-conversion-row"><span><b>${p.card.name}</b> ×${p.ownershipBefore+1} → MAX ×${p.ownershipCap}</span><strong>+${p.universePointsValue} UP</strong></div>`).join('');
    packArea=`<section class="pack-summary-screen premium-pack-summary">
      <div class="pack-complete-hero"><span>PACK COMPLETE</span><h3>${newCount ? `${newCount} NEW CARD${newCount===1?'':'S'}` : 'COLLECTION UPDATED'}${convertedUp ? ` · +${convertedUp} UP` : ''}</h3></div>
      <div class="pack-summary-top-actions"><button id="review-pack-upgrades-top" class="primary">REVIEW UPGRADES</button><button id="finish-pack-top" class="nav-button">RETURN TO BOOSTER VAULT</button></div>
      <div class="pack-summary-grid pack-summary-pyramid">${summaryThumbs}</div>
      <div class="pack-summary-key"><span><b class="new-card-symbol">NEW</b> First time owned</span><span>Tap any card to flip it.</span></div>
      ${convertedUp?`<details class="universe-conversion-panel compact-conversion"><summary><span>EXCESS COPIES</span><b>${convertedPulls.length} ${convertedPulls.length===1?'copy':'copies'} converted · +${convertedUp} UP</b><small>Balance · ${profile.universePoints} UP</small></summary><div class="up-conversion-list">${conversionRows}</div></details>`:''}
      <div class="pack-summary-actions"><button id="review-pack-upgrades" class="start-match">Review Roster & Deck Upgrades</button><button id="finish-pack-summary" class="nav-button">Done</button></div>
    </section>`;
  } else if (packStage === "upgrades" && pulls.length) {
    const manual = profile.deckAssistance === "manual";
    packArea=`<section class="pack-summary-screen compact-summary">
      <div class="section-title"><div><span>PACK ACQUIRED</span><h3>Roster Construction</h3></div><span>Suggestions from these five cards</span></div>
      <div class="pack-summary-grid pack-summary-pyramid">${summaryThumbs}</div>
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

  const vaultSets = Object.values(launchSetCollections);
  const vaultBuckets = [];
  for (const vaultSet of vaultSets) {
    const standard = boosterCreditsFor(profile, vaultSet.id);
    const ladderCount = ladder.completionPackCreditsBySet?.[vaultSet.id] ?? 0;
    const championshipCount = road.championshipPackCreditsBySet?.[vaultSet.id] ?? 0;
    if (standard > 0) vaultBuckets.push({ setId:vaultSet.id, type:"standard", count:standard, label:"STANDARD BOOSTER", subtitle:"5 CARDS · 1 GUARANTEED FOIL" });
    if (ladderCount > 0) vaultBuckets.push({ setId:vaultSet.id, type:"ladder", count:ladderCount, label:"LADDER COMPLETION", subtitle:"1 FOIL · 1 VERY RARE+" });
    if (championshipCount > 0) vaultBuckets.push({ setId:vaultSet.id, type:"championship", count:championshipCount, label:"CHAMPIONSHIP PACK", subtitle:"1 FOIL · 1 RARE+" });
  }
  const totalVaultPacks = vaultBuckets.reduce((sum,b)=>sum+b.count,0);
  const vaultShelf = vaultBuckets.length ? `<section class="booster-vault-shelf" aria-label="Openable booster packs">${vaultBuckets.map((bucket,index)=>{
    const info=setCollections[bucket.setId]??setCollection;
    const logo=setLogoMarkup(bucket.setId,"pack-set-logo") || `<span class="pack-text-logo"><b>${info.name.toUpperCase()}</b><small>SERIES 1</small></span>`;
    return `<button type="button" class="vault-pack-product pack-set-${bucket.setId}" data-open-vault-pack="${bucket.setId}:${bucket.type}" aria-label="Open ${info.displayName} ${bucket.label}">
      <span class="vault-pack-quantity">×${bucket.count}</span>
      <span class="booster-pack vault-product-pack pack-set-${bucket.setId}">${logo}<span>${info.name.toUpperCase()}</span><b>${bucket.type==='standard'?'SERIES 1':bucket.label}</b><small>${bucket.subtitle}</small></span>
      <strong>${info.displayName}</strong><em>${bucket.label}</em><small>TAP PACK TO OPEN</small>
    </button>`;
  }).join('')}</section>` : `<section class="booster-empty-stage"><div class="booster-empty-state"><span>VAULT EMPTY</span><h3>No unopened packs right now</h3><p>Earn packs through Season rewards, Challenges, Climb the Ladder, Championship Road or the Card Shop.</p><button id="booster-empty-home" class="nav-button">Back to Main Menu</button></div></section>`;

  // During an opening, the active set drives the modal theme. At idle the Vault is
  // intentionally set-agnostic: all openable packs live together on one shelf.
  document.body.dataset.set = packInProgress ? activeBoosterSetId : "all";

  const modal = packInProgress ? `<section class="booster-pack-modal ${setVisualClass(activeBoosterSetId)}" role="dialog" aria-modal="true" aria-label="${setInfo.name} pack opening">
    <div class="booster-pack-modal-shell">
      <div class="booster-pack-modal-head"><span>PACK OPENING</span><b>${setInfo.displayName}</b></div>
      ${message?`<p class="booster-modal-message">${message}</p>`:''}
      <div class="booster-pack-modal-body">${packArea}</div>
    </div>
  </section>` : "";

  root.innerHTML=`<section class="collection-screen booster-screen premium-screen booster-vault-all">
    <section class="collection-hero booster-feature feature-hero booster-vault-hero">${modePortraits([profile.starterId],"feature-art")}<div class="feature-shade"></div><div class="feature-copy">${modeLogoMarkup("boosters",true)}<span class="booster-live-label">YOUR SEALED COLLECTION</span><h2>BOOSTER VAULT</h2><h3 class="booster-release-headline">${totalVaultPacks} PACK${totalVaultPacks===1?'':'S'} READY TO OPEN</h3><p>Every unopened pack you own is on the shelf below. No filters, no set buttons — tap the physical pack you want to rip.</p></div></section>
    ${message&&!packInProgress?`<p class="setup-message">${message}</p>`:''}
    ${vaultShelf}
    <section class="booster-vault-lower"><div class="set-stats booster-vault-stats"><div class="set-stat"><b>${totalVaultPacks}</b><span>Packs ready</span></div><div class="set-stat"><b>${Object.values(profile.packsOpenedBySet??{}).reduce((a,b)=>a+(Number(b)||0),0)}</b><span>Packs opened</span></div><div class="set-stat"><b>${profile.unlockedSuperstars?.length??0}</b><span>Superstars</span></div><div class="set-stat"><b>${profile.universePoints ?? 0} UP</b><span>Universe Points</span></div></div><label class="booster-assistance">Deck Assistance <select id="deck-assistance" ${packInProgress?'disabled':''}><option value="ask" ${profile.deckAssistance==='ask'?'selected':''}>Ask me</option><option value="auto" ${profile.deckAssistance==='auto'?'selected':''}>Auto-upgrade</option><option value="manual" ${profile.deckAssistance==='manual'?'selected':''}>Manual</option></select></label></section>
  </section>${modal}`;

  root.querySelectorAll('[data-open-vault-pack]').forEach(btn=>btn.addEventListener('click',()=>{
    const [setId,type] = btn.dataset.openVaultPack.split(':');
    activeBoosterSetId=setId; currentPackType=type; message=''; processPack(type);
  }));
  $("#deck-assistance")?.addEventListener("change",e=>{setDeckAssistance(profile,e.target.value);saveProfile(profile);message=`Deck Assistance set to ${e.target.options[e.target.selectedIndex].text}.`;renderBoosters();});
  root.querySelectorAll('[data-reveal-card]').forEach(btn=>btn.addEventListener('click',()=>revealPackCard(Number(btn.dataset.revealCard))));
  root.querySelectorAll('[data-booster-inspect]').forEach(btn=>btn.addEventListener('click',()=>{if(packStage==="reveal"){nextBoosterCard();return;}const i=Number(btn.dataset.boosterInspect);if(boosterRulesFlipped.has(i))boosterRulesFlipped.delete(i);else boosterRulesFlipped.add(i);renderBoosters();}));
  $("#review-pack-upgrades")?.addEventListener("click", beginPackUpgradeReview);
  $("#review-pack-upgrades-top")?.addEventListener("click", beginPackUpgradeReview);
  $("#finish-pack-top")?.addEventListener("click", finishPackFlow);
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
    <div class="store-balance-card"><span>UNIVERSE POINTS</span><b>${balance.toLocaleString()} UP</b><small>Never expires</small></div>
    <section class="feature-hero store-feature">${modePortraits(stars.slice(0,3).map(s=>s.id),"feature-art")}<div class="feature-shade"></div><div class="feature-copy">${setLogoMarkup(rotation.setId,"feature-set-logo")}<span class="premium-kicker">DAILY STORE</span><h2>${setInfo?.displayName ?? setInfo?.name ?? rotation.setId}</h2><p>Spend Universe Points on guaranteed roster progress. The featured set rotates every 24 hours.</p></div></section>
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
    const launchReleases = node.type === 'launch' ? `<div class="roadmap-release-grid">
        <button data-season-booster-set="summerslam-series-1">${setLogoMarkup("summerslam-series-1","season-set-logo")}<strong>SummerSlam — Series 1</strong><span>Cody · Brock · Roman</span></button>
        <button data-season-booster-set="hall-of-fame-series-1">${setLogoMarkup("hall-of-fame-series-1","season-set-logo")}<strong>Hall of Fame — Series 1</strong><span>Hogan · Austin · Undertaker</span></button>
        <button data-season-booster-set="evolution-series-1">${setLogoMarkup("evolution-series-1","season-set-logo")}<strong>Evolution — Series 1</strong><span>Becky · Rhea · Charlotte</span></button>
      </div>` : '';
    const futureSetId = node.setId ?? (node.id === "season-2" ? "survivor-series-series-1" : null);
    const futureLogo = futureSetId ? setLogoMarkup(futureSetId,"roadmap-future-logo") : "";
    return `<article class="season-roadmap-node ${status} ${node.type}">
      <div class="roadmap-marker"><span>${index + 1}</span></div>
      <div class="roadmap-copy"><div class="roadmap-meta"><b>${node.dateLabel}</b><em>${node.kicker}</em></div>${futureLogo}<h3>${node.title}</h3><small>${slots}</small>${launchReleases}</div>
    </article>`;
  }).join('');
  const tierRoad = Array.from({length: SEASON_TIER_COUNT}, (_, i) => i + 1).map(tier => {
    const reward = tierReward(tier), reached = tier <= progress.tier, claimed = state.claimedTiers.includes(tier), current = tier === Math.min(SEASON_TIER_COUNT, progress.tier + 1);
    const setName = reward.kind === "booster" ? (sets[reward.setId]?.name ?? reward.setId) : "";
    const rewardTitle = reward.kind === "full-deck-superstar" ? `THE ROCK · FULL DECK SUPERSTAR` : reward.kind === "universe-points" ? `${reward.amount} UNIVERSE POINTS` : `${reward.amount}× ${setName} Booster${reward.amount === 1 ? '' : 's'}`;
    const rewardSub = reward.kind === "full-deck-superstar" ? `SEASON 1 COMPLETION EXCLUSIVE · The Final Boss` : reward.kind === "universe-points" ? `STORE CURRENCY · ${tier * XP_PER_TIER} XP milestone` : `${tier * XP_PER_TIER} XP milestone`;
    const rewardIcon = reward.kind === "full-deck-superstar" ? "star" : reward.kind === "universe-points" ? "points" : "pack";
    return `<article class="season-tier ${reached ? 'reached' : ''} ${claimed ? 'claimed' : ''} ${current ? 'current' : ''} ${reward.kind === 'full-deck-superstar' ? 'season-final-reward' : ''}">
      <div class="season-tier-number"><span>TIER</span><b>${tier}</b></div>
      <div class="season-tier-reward-icon">${uiIcon(rewardIcon)}</div>
      <div class="season-tier-reward"><strong>${rewardTitle}</strong><small>${rewardSub}</small></div>
      ${claimed ? '<button disabled>Claimed</button>' : reached ? `<button class="primary" data-claim-season-tier="${tier}">Claim</button>` : '<button disabled>Locked</button>'}
    </article>`;
  }).join('');
  root.innerHTML = `<section class="seasons-screen premium-screen">
    <section class="feature-hero seasons-feature season-final-boss-hero">${modePortraits(["the-rock"],"feature-art")}<div class="feature-shade"></div><div class="feature-copy">${modeLogoMarkup("seasons")}${setLogoMarkup("season-1-final-boss","feature-set-logo rewards-set-logo")}<span class="season-live-label">SEASON 1 · LIVE NOW</span><h2>THE ROAD TO THE FINAL BOSS</h2><p>Earn XP. Climb 50 tiers. Unlock The Rock — Final Boss.</p><div class="season-hero-status"><span>${uiIcon("trophy")}<b>Tier ${progress.tier}</b></span><span>${uiIcon("gift")}<b>${claimable.length} ready</b></span><span>${uiIcon("xp")}<b>${progress.xp} XP</b></span></div><div class="season-hero-actions"><button id="season-challenges" class="nav-button">${uiIcon("check")} Challenges</button><button id="season-boosters" class="nav-button">${uiIcon("pack")} Boosters</button></div></div><div class="season-countdown-card"><span>SEASON ENDS · 28 NOV 2026</span><b data-season-countdown>${remaining.ended ? 'Season complete' : formatCountdown(remaining.ms)}</b><small>Season 2 · Survivor Series</small></div></section>
    ${message ? `<p class="setup-message">${message}</p>` : ''}
    <section class="free-pack-panel ${free.available ? 'ready' : ''}">
      <div class="free-pack-icon"><span>24H</span><b>FREE</b></div><div class="free-pack-copy"><span>DAILY LOGIN BOOSTER</span><h3>${free.available ? 'Your free booster is ready' : 'Next free booster is counting down'}</h3><p>Claim one booster from a currently Featured Season 1 set every rolling 24 hours. Miss a day and nothing is lost — one pack simply waits for you.</p><small data-free-pack-countdown>${free.available ? 'FREE PACK READY' : formatCountdown(free.msRemaining)}</small></div><button id="claim-free-pack" class="start-match" ${free.available ? '' : 'disabled'}>${free.available ? 'Claim Free Booster' : `Next Free Booster · ${formatCountdown(free.msRemaining)}`}</button>
    </section>
    <section class="season-progress-panel season-command-center">
      <div class="season-tier-summary">
        <div class="season-stat-card"><span class="season-stat-icon">${uiIcon("trophy")}</span><span>CURRENT TIER</span><b>${progress.tier}/${SEASON_TIER_COUNT}</b><small>${progress.tier >= SEASON_TIER_COUNT ? 'Road complete' : `Next: Tier ${progress.tier + 1}`}</small></div>
        <div class="season-stat-card"><span class="season-stat-icon">${uiIcon("xp")}</span><span>SEASON XP</span><b>${progress.xp.toLocaleString()}</b><small>of ${(SEASON_TIER_COUNT * XP_PER_TIER).toLocaleString()} XP</small></div>
        <div class="season-stat-card"><span class="season-stat-icon">${uiIcon("points")}</span><span>UNIVERSE POINTS</span><b>${profile.universePoints ?? 0} UP</b><small>Store currency</small></div>
        <div class="season-stat-card next-drop-card"><span class="season-stat-icon">${uiIcon("drop")}</span><span>NEXT DROP</span><b>${next.title}</b><small data-next-drop-countdown></small></div>
      </div>
      <div class="season-progress-heading"><strong>${progress.tier >= SEASON_TIER_COUNT ? 'SEASON ROAD COMPLETE' : `TIER ${progress.tier + 1} PROGRESS`}</strong><span>${progress.intoTier}/${XP_PER_TIER} XP</span></div>
      <div class="season-xp-track"><i style="width:${progress.tier >= SEASON_TIER_COUNT ? 100 : Math.min(100,(progress.intoTier/XP_PER_TIER)*100)}%"></i></div>
      <div class="season-xp-caption"><span>Win ${MATCH_XP.win} XP · Loss/Draw ${MATCH_XP.loss} XP</span><span>Daily 50 XP · Weekly 200 XP</span></div>
    </section>
    <section class="season-section"><div class="section-title"><h3>50-Tier Season Road</h3><span>${claimable.length ? `${claimable.length} reward${claimable.length===1?'':'s'} ready` : 'Earn XP to unlock rewards'}</span></div>${claimable.length ? '<button id="claim-all-season" class="primary season-claim-all">Claim All Available</button>' : ''}<div class="season-tier-road">${tierRoad}</div></section>

    <section class="season-section"><div class="section-title"><h3>Season 1 Content Roadmap</h3><span>Launch → Worlds Collide → Money in the Bank → Survivor Series</span></div><div class="season-roadmap">${roadmap}</div></section>
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
  const setRows = Object.values(launchSetCollections).map(set => {
    const progress = collectionProgress(profile, set.id);
    const state = setProgressState(profile, set.id);
    const rewards = availableMilestoneRewards(profile, set.id);
    return { set, progress, state, rewards };
  });
  const challengeCard = (c, group) => {
    const complete = (c.progress ?? 0) >= c.target;
    const xp = c.xpReward ?? (group === 'WEEKLY' ? 200 : 50);
    const icon = group === 'WEEKLY' ? 'calendar' : 'bolt';
    return `<article class="challenge-card premium-challenge-card ${complete ? 'complete' : ''} ${c.claimed ? 'claimed' : ''}">
      <div class="challenge-card-head"><span class="challenge-type-icon">${uiIcon(icon)}</span><div><span>${group}</span><h3>${c.label}</h3></div><b>${c.progress ?? 0}/${c.target}</b></div>
      <div class="challenge-progress"><i style="width:${Math.min(100, ((c.progress??0)/c.target)*100)}%"></i></div>
      <div class="challenge-reward-chips"><span>${uiIcon('xp')} ${xp} XP</span><span>${uiIcon('pack')} ${c.reward} Booster${c.reward===1?'':'s'}</span></div>
      ${c.claimed ? '<button disabled>CLAIMED</button>' : complete ? `<button class="primary" data-claim-challenge="${c.id}">${uiIcon('gift')} Claim Reward</button>` : '<button disabled>IN PROGRESS</button>'}
    </article>`;
  };
  const milestone = (setId, setName, m, type) => `<article class="milestone-row premium-milestone-row"><span class="milestone-icon">${uiIcon(type === 'foil' ? 'star' : 'trophy')}</span><div><b>${type === 'foil' ? 'Foil' : 'Collection'} ${m.percent}%</b><span>${setName} · ${m.reward} booster${m.reward===1?'':'s'}</span></div><button class="primary" data-claim-milestone="${setId}:${type}:${m.percent}">Claim</button></article>`;
  const milestoneSections = setRows.map(({set,progress,state,rewards}) => `<section class="challenge-section"><div class="section-title"><h3>${set.displayName} Milestones</h3><span>${progress.ownedUnique}/${progress.total} unique · ${progress.foilUnique}/${progress.total} Foil · ${state.lifecycle.toUpperCase()}</span></div><div class="milestone-grid">${[...rewards.collection.map(m=>milestone(set.id,set.name,m,'collection')),...rewards.foil.map(m=>milestone(set.id,set.name,m,'foil'))].join('') || '<p class="collection-empty">Your next collection rewards are still in progress.</p>'}</div></section>`).join('');
  const challengeSetStats = setRows.map(({set,progress})=>{ const packs=boosterCreditsFor(profile,set.id); const pct=progress.percent??0; return `<article class="challenge-set-stat" style="--set-progress:${pct}"><div class="challenge-set-logo">${setLogoMarkup(set.id,"challenge-mini-set-logo")}</div><div class="challenge-progress-ring"><b>${pct}%</b></div><div class="challenge-set-copy"><strong>${set.name}</strong><small>${progress.ownedUnique}/${progress.total} unique · ${progress.foilUnique} foil</small></div><span class="challenge-pack-count">${uiIcon('pack')} ${packs}</span></article>`; }).join('');
  const dailyReady = challenges.daily.filter(c=>!c.claimed && (c.progress??0)>=c.target).length;
  const weeklyReady = challenges.weekly.filter(c=>!c.claimed && (c.progress??0)>=c.target).length;
  const milestoneReady = setRows.reduce((n,row)=>n+row.rewards.collection.length+row.rewards.foil.length,0);
  root.innerHTML = `<section class="challenges-screen premium-screen challenges-premium">
    <section class="feature-hero challenges-feature premium-challenges-hero">${modePortraits(["becky-lynch"],"feature-art")}<div class="feature-shade"></div><button id="challenge-main-menu" class="challenge-home-button">← MAIN MENU</button><div class="feature-copy">${modeLogoMarkup("challenges",true)}<div class="challenge-hero-status"><span>${uiIcon('bolt')}<b>${dailyReady}</b><small>Daily ready</small></span><span>${uiIcon('calendar')}<b>${weeklyReady}</b><small>Weekly ready</small></span><span>${uiIcon('trophy')}<b>${milestoneReady}</b><small>Milestones</small></span></div></div></section>
    ${message ? `<p class="setup-message">${message}</p>` : ''}
    <section class="challenge-command-panel"><div class="section-title icon-section-title"><span class="section-icon">${uiIcon('cards')}</span><div><h3>Set Progress</h3><small>Collection completion and unopened reward packs</small></div></div><div class="challenge-set-stats">${challengeSetStats}</div></section>
    <section class="challenge-section premium-challenge-section"><div class="section-title icon-section-title"><span class="section-icon daily">${uiIcon('bolt')}</span><div><h3>Daily Challenges</h3><small>Quick rotating goals</small></div><span>${dailyReady ? `${dailyReady} READY` : '3 GOALS'}</span></div><div class="challenge-grid">${challenges.daily.map(c=>challengeCard(c,'DAILY')).join('')}</div></section>
    <section class="challenge-section premium-challenge-section"><div class="section-title icon-section-title"><span class="section-icon weekly">${uiIcon('calendar')}</span><div><h3>Weekly Challenges</h3><small>Larger goals · bigger XP</small></div><span>${weeklyReady ? `${weeklyReady} READY` : '3 GOALS'}</span></div><div class="challenge-grid">${challenges.weekly.map(c=>challengeCard(c,'WEEKLY')).join('')}</div></section>
    ${milestoneSections}
    
  </section>`;
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
  root.innerHTML=`<section class="ladder-screen championship-screen premium-screen compact-mode-run"><section class="feature-hero championship-feature single-feature-hero">${modePortraits([chosenId],"feature-art")}<div class="feature-shade"></div><div class="feature-copy">${modeLogoMarkup("championship")}<p>Choose a road and an owned Superstar. Four matches lead to the title.</p><div class="horizontal-branch-selector">${tabs}</div></div><div class="ladder-summary"><div><b>${road.clearsByBranch?.[branch.id]??0}</b><span>${branch.label} clears</span></div><div><b>${road.bestStageByBranch?.[branch.id]??0}/4</b><span>Best stage</span></div><div><b>${completed}/${roster.length}</b><span>Launch Superstar clears</span></div><div><b>${road.championshipPackCreditsBySet?.[branch.setId]??0}</b><span>${sets[branch.setId]?.name} packs</span></div></div></section><p class="setup-message">${message||status}</p>${!active?`<section class="ladder-picker horizontal-selector"><h3>Choose your Superstar</h3>${selectionCarouselMarkup(unlocked,chosenId,'champ-select',star=>road.completedByBranch?.[branch.id]?.includes(star.id)?'ROAD CLEARED':'READY')}<button id="start-championship" class="start-match">Confirm & Start ${branch.label.replace(' — Series 1','')} Road</button></section>`:`<section class="ladder-current"><div><span>ROAD</span><strong>${branch.label}</strong></div><div><span>YOUR SUPERSTAR</span><strong>${superstarById[run.superstarId].name}</strong></div><div><span>NEXT MATCH</span><strong>${run.stage+1}/4 · ${CHAMPIONSHIP_STAGES[run.stage]} · ${superstarById[currentChampionshipOpponent(profile)].name}</strong></div><button id="continue-championship" class="start-match">Fight ${CHAMPIONSHIP_STAGES[run.stage]}</button></section>`}${routeRows?`<section class="ladder-stack">${routeRows}</section>`:''}${run&&run.status!=='active'?`<button id="new-championship" class="start-match">Start Another Road</button>`:''}</section>`;
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
    seasons: { kicker: "LIVE CONTENT", top: "LEGACY", bottom: "SEASONS" },
    challenges: { kicker: "DAILY · WEEKLY · MILESTONES", top: "LIVE", bottom: "CHALLENGES" },
    collection: { kicker: `${playerFacingCollectionCards().length} CARDS · ${Object.keys(playerFacingSetCollections()).length} SETS`, top: "THE", bottom: "COLLECTION" },
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
  return (profile?.unlockedSuperstars ?? []).map(id => superstarById[id]).filter(Boolean).filter(star => isPlayerVisibleSuperstar(star, profile)).filter(star => star.id !== excludeId).sort((a,b) => {
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
  if (setId === "survivor-series-series-1") return "theme-survivor";
  return "theme-summerslam";
}

function setHeroSuperstars(setId) {
  if (setId === "hall-of-fame-series-1") return ["stone-cold-steve-austin", "the-undertaker", "hulk-hogan"];
  if (setId === "evolution-series-1") return ["rhea-ripley", "becky-lynch", "iyo-sky"];
  if (setId === "survivor-series-series-1") return ["bron-breakker", "drew-mcintyre", "randy-orton"];
  return ["cody-rhodes", "roman-reigns", "gunther"];
}

function renderSplash() {
  setChrome({ hideTopbar: true });
  const root = $("#game");
  const returning = !!profile;
  const starter = returning ? superstarById[profile.starterId] : null;
  const launchUnlocked = (profile?.unlockedSuperstars ?? []).filter(id => roster.some(star => star.id === id)).length;
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
        <small>${returning ? `${launchUnlocked}/${roster.length} Launch Superstars unlocked · Season progress saved locally` : "Choose your first World Champion, receive their full starter deck, then discover the three live Season 1 booster sets."}</small>
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
  const allBoosterCredits = Object.values(profile.boosterCreditsBySet ?? {}).reduce((sum, value) => sum + (Number(value) || 0), 0);
  const seasonProgress = seasonLevelProgress(profile);
  const seasonRemaining = seasonTimeRemaining(new Date());
  const visibleCards = playerFacingCollectionCards();
  const ownedUnique = visibleCards.filter(card => ownedCount(profile, card.id, "normal") + ownedCount(profile, card.id, "foil") > 0).length;
  const ownedCopies = visibleCards.reduce((sum, card) => sum + ownedCount(profile, card.id, "normal") + ownedCount(profile, card.id, "foil"), 0);
  const launchUnlocked = (profile.unlockedSuperstars ?? []).filter(id => roster.some(star => star.id === id)).length;
  root.innerHTML = `<section class="main-menu-screen premium-screen home-hub-v2">
    <button id="menu-season-countdown" class="season-led-strip ${attentionClass("seasons")}" aria-label="Open Season 1 hub">${attentionBadge("seasons")}
      <span class="season-led-live"><i></i><b>SEASON ONE LIVE</b><i></i></span>
      <span class="season-led-label">ENDS IN</span>
      <strong class="season-led-countdown" data-season-countdown>${seasonRemaining.ended ? 'SEASON COMPLETE' : formatCountdown(seasonRemaining.ms)}</strong>
      <span class="season-led-next">SURVIVOR SERIES · 28 NOV</span>
    </button>


    <button id="menu-owned-collection" class="menu-owned-hero">
      <span class="owned-hero-copy">
        <em>YOUR CARDS</em>
        <strong>MY COLLECTION</strong>
        <small>${ownedUnique} / ${visibleCards.length} unique cards owned · ${ownedCopies} total copies</small>
        <span>${launchUnlocked}/${roster.length} Launch Superstars unlocked</span>
      </span>
      <span class="owned-hero-art">${portraitMarkup(starter.id, starter.name)}</span>
      <span class="owned-hero-arrow">VIEW OWNED CARDS →</span>
    </button>

    ${message ? `<p class="menu-message">${message}</p>` : ""}

    <button id="menu-season-campaign" class="menu-season-campaign ${attentionClass("seasons")}" style="--season-progress:${Math.min(100,(seasonProgress.tier/SEASON_TIER_COUNT)*100)}%">
      <span class="menu-season-rock">${portraitMarkup("the-rock","The Rock")}</span>
      <span class="menu-season-copy"><em>SEASON 1 · TIER 50 REWARD</em><strong>UNLOCK THE FINAL BOSS</strong><small>Season 1 completion reward · The strongest Superstar of Season 1</small></span>
      <span class="menu-season-tier"><b>${seasonProgress.tier}</b><small>/ ${SEASON_TIER_COUNT}</small></span>
    </button>

    <div class="main-menu-grid premium-menu-grid compact-hub-grid">
      <button id="menu-play" class="main-menu-tile premium-menu-tile primary-tile tile-play"><span class="tile-bg-art">${portraitMarkup("roman-reigns","Roman Reigns")}</span><span class="tile-shade"></span><span class="tile-copy"><em>PLAY</em><strong>ENTER THE RING</strong><small>Exhibition · Ladder · Championship</small></span></button>
      <button id="menu-catalogue" class="main-menu-tile premium-menu-tile tile-collection"><span class="tile-bg-art">${portraitMarkup("stone-cold-steve-austin","Stone Cold Steve Austin")}</span><span class="tile-shade"></span><span class="tile-copy"><em>ALL ${visibleCards.length} CARDS</em><strong>CARD CATALOGUE</strong><small>Search the live card pool</small></span></button>
      <button id="menu-boosters" class="main-menu-tile premium-menu-tile tile-boosters ${attentionClass("boosters")}">${attentionBadge("boosters")}<span class="tile-bg-art">${portraitMarkup("iyo-sky","IYO SKY")}</span><span class="tile-shade"></span><span class="tile-copy"><em>${allBoosterCredits} AVAILABLE</em><strong>BOOSTER PACKS</strong><small>Rip · Reveal · Collect</small></span></button>
      <button id="menu-decks" class="main-menu-tile premium-menu-tile tile-decks"><span class="tile-bg-art">${portraitMarkup("cm-punk","CM Punk")}</span><span class="tile-shade"></span><span class="tile-copy"><em>BUILD YOUR ROSTER</em><strong>DECK LAB</strong><small>Build · Optimize · Save</small></span></button>
      <button id="menu-challenges" class="main-menu-tile premium-menu-tile tile-challenges ${attentionClass("challenges")}">${attentionBadge("challenges")}<span class="tile-bg-art">${portraitMarkup("becky-lynch","Becky Lynch")}</span><span class="tile-shade"></span><span class="tile-copy"><em>EARN REWARDS</em><strong>CHALLENGES</strong><small>Daily · Weekly · Season XP</small></span></button>
      <button id="menu-profile" class="main-menu-tile premium-menu-tile tile-profile"><span class="tile-bg-art">${portraitMarkup(starter.id,starter.name)}</span><span class="tile-shade"></span><span class="tile-copy"><em>YOUR CAREER</em><strong>MY LEGACY</strong><small>Progress · Stats · Tools</small></span></button>
      <button id="menu-store" class="main-menu-tile premium-menu-tile tile-store"><span class="tile-bg-art">${portraitMarkup("gunther","Gunther")}</span><span class="tile-shade"></span><span class="tile-copy"><em>DAILY ROTATION</em><strong>CARD SHOP</strong><small>Spend Universe Points</small></span></button>
      <button id="menu-options" class="main-menu-tile premium-menu-tile tile-options"><span class="tile-bg-art">${portraitMarkup("cody-rhodes","Cody Rhodes")}</span><span class="tile-shade"></span><span class="tile-copy"><em>GAME SETTINGS</em><strong>OPTIONS</strong><small>Assistance · Data · Build</small></span></button>
    </div>
  </section>`;
  $("#menu-season-countdown")?.addEventListener("click", showSeasons);
  $("#menu-owned-collection")?.addEventListener("click", showOwnedCollection);
  $("#menu-season-campaign")?.addEventListener("click", showSeasons);
  $("#menu-play")?.addEventListener("click", showPlayMenu);
  $("#menu-catalogue")?.addEventListener("click", showCardCatalogue);
  $("#menu-boosters")?.addEventListener("click", showBoosters);
  $("#menu-decks")?.addEventListener("click", () => showDeckBuilder());
  $("#menu-challenges")?.addEventListener("click", showChallenges);
  $("#menu-profile")?.addEventListener("click", showProfile);
  $("#menu-store")?.addEventListener("click", showStore);
  $("#menu-options")?.addEventListener("click", showOptions);
  refreshSeasonClocks();
}

function renderPlayMenu() {
  setChrome();
  const root = $("#game");
  const modeCard = starId => {
    const src = superstarArtwork[starId] ?? superstarHeadshotFor(starId);
    return `<div class="mode-art mode-superstar-render"><img src="${src}" alt="${superstarById[starId]?.name ?? starId}"></div>`;
  };
  root.innerHTML = `<section class="play-menu-screen premium-screen">
    <div class="premium-screen-title"><span>PLAY</span><h2>Choose Your Path</h2><p>Three modes. Three identities. One WWE Legacy roster.</p></div>
    <div class="play-mode-grid premium-mode-grid">
      <article id="play-exhibition" role="button" tabindex="0" class="play-mode-card premium-mode-card exhibition-card single-hero-mode">${modeCard("cody-rhodes")}<div class="mode-card-shade"></div><div class="mode-card-copy">${modeLogoMarkup("exhibition",true)}<p>Choose any Superstar you own. Your CPU opponent is randomly drawn from the other ${Math.max(0,roster.length-1)} complete roster decks.</p><b>PLAY EXHIBITION →</b></div></article>
      <article id="play-ladder" role="button" tabindex="0" class="play-mode-card premium-mode-card ladder-card single-hero-mode">${modeCard("gunther")}<div class="mode-card-shade"></div><div class="mode-card-copy">${modeLogoMarkup("ladder",true)}<p>Three lives. Clear a full branch. Survive every rung.</p><b>START THE CLIMB →</b></div></article>
      <article id="play-championship" role="button" tabindex="0" class="play-mode-card premium-mode-card championship-card single-hero-mode">${modeCard("roman-reigns")}<div class="mode-card-shade"></div><div class="mode-card-copy">${modeLogoMarkup("championship",true)}<p>Opening Bout to Championship Match across a four-fight road.</p><b>CHASE THE TITLE →</b></div></article>
    </div>
  </section>`;
  const wireModeCard = (selector, action) => { const el = $(selector); el?.addEventListener("click", action); el?.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); action(); } }); };
  wireModeCard("#play-exhibition", showSetup);
  wireModeCard("#play-ladder", showLadder);
  wireModeCard("#play-championship", showChampionship);
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
  screen = "menu";
  message = `${superstarById[starId].name} is now your starter Superstar.`;
  renderMainMenu();
}

function renderStarter() {
  setChrome({ hideTopbar: true });
  const root = $("#game");
  const choices = STARTER_CHOICES.map(id => superstarById[id]).filter(Boolean);
  const titleFor = id => id === "cm-punk" ? "UNDISPUTED WWE CHAMPION" : "WORLD HEAVYWEIGHT CHAMPION";
  root.innerHTML = `<section class="starter-screen onboarding-screen">
    <div class="onboarding-brand">${legacyLogoMarkup(true)}</div>
    <div class="starter-hero"><span class="eyebrow">FIRST-TIME ONBOARDING</span><h2>Choose Your Champion</h2><p>Pick your starter Superstar.</p></div>
    <div class="starter-choice-grid champion-choice-grid">${choices.map(star => `<button class="starter-choice champion-starter" data-starter="${star.id}">
      <div class="starter-photo">${superstarVisualMarkup(star.id,star.name)}</div>
      <span class="champion-tag">${titleFor(star.id)}</span>
      <strong>${star.name}</strong><small>${star.nickname}</small>
      <b class="choose-starter-cta">CHOOSE ${star.name.toUpperCase()}</b>
    </button>`).join("")}</div>

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
    .replace(/cite[^]+/g, "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/(?:WWE (?:has |specifically )?(?:documented|identifies|lists)[^.]*\.|Seth (?:has |continues to |used it as )[^.]*\.)/gi, "")
    .replace(/\b(?:Shared )?canonical(?: shared card| shared Chokeslam| move)?;?\s*/gi, "")
    .replace(/^New canonical(?: shared card| shared Chokeslam)?;?\s*/i, "")
    .replace(/^New canonical\s*/i, "")
    .replace(/\bgrounds opponent\b/gi, "Ground your opponent")
    .replace(/\bgrounds\b/gi, "Ground your opponent")
    .replace(/\bgrounded opponent,?\s*/gi, "Requires a grounded opponent. ")
    .replace(/\bground\s*\+\s*Stun\s*(\d+)/gi, "Ground your opponent. Stun $1")
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
    // Momentum is a live UI card family rather than a static exported front.
    // Rendering it from markup lets method colour and arena/set presentation stay vivid on mobile.
    return momentumMockupMarkup(card);
  }
  const art = artworkFor(card);
  const finished = finishedCardArtFor(card);
  const legacyFinished = legacyFinishedCardArtFor(card);
  if (finished) {
    const legacyCandidate = legacyFinished && legacyFinished !== finished ? legacyFinished : "";
    return `<img loading="lazy" decoding="async" class="ccg-finished-card-art-image" src="${finished}" alt="${card.name}" data-finished-card-art="${card.id}" data-legacy-finished-art="${legacyCandidate}" onerror="if(!this.dataset.legacyFinishedTried&&this.dataset.legacyFinishedArt){this.dataset.legacyFinishedTried='1';this.src=this.dataset.legacyFinishedArt;return;}this.onerror=null;this.style.display='none';this.closest('.ccg-card')?.classList.remove('is-full-art-finished','is-full-art-move');">`;
  }
  const fallback = card.name;
  return art
    ? `<img loading="lazy" decoding="async" src="${art}" alt="${card.name}">`
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

function collectibleCardMarkup(card, { flipped = false, foil = false, extraClass = "", footer = "", flipAttr = "", interactive = true } = {}) {
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
  const rootTag = interactive ? "button" : "span";
  const rootAttrs = interactive ? `type="button" ${flipAttr} aria-label="${card.name}. Tap to ${flipped ? "view artwork" : "view effects"}."` : `aria-hidden="true"`;
  return `<${rootTag} ${rootAttrs} class="ccg-card ${flipped ? "is-flipped" : ""} ${setClass} ${typeClass} ${finisherClass} ${foilClass} ${superstarFront ? "is-full-art-superstar" : ""} ${finishedFront ? "is-full-art-finished" : ""} ${extraClass}">
    <span class="ccg-card-inner">
      <span class="ccg-card-face ccg-card-front">${frontMarkup}</span>
      <span class="ccg-card-face ccg-card-rules ${setClass}">
        <span class="ccg-rules-head"><small>${typeLabel}</small><strong>${card.name}</strong><em>${subtitle}</em></span>
        ${card.kind === "move" ? `<span class="ccg-rules-statline"><span><small>COST</small><b>${card.cost ?? 0}</b></span><span><small>DAMAGE</small><b>${card.damage ?? 0}</b></span></span>` : ""}
        <span class="ccg-rules-body"><b class="ccg-effect-label">${card.kind === "move" ? "EFFECT" : card.kind === "superstar" ? "SUPERSTAR ABILITY" : card.kind === "entrance" ? "ENTRANCE EFFECT" : "RULES"}</b><span>${ruleText}</span></span>
        ${card.kind === "superstar" ? (()=>{const star=superstarById[card.superstarId]; if(!star)return ""; const limits=Object.entries(star.methodLimits??{}).map(([m,v])=>`${m.slice(0,2).toUpperCase()} ${v==null?"∞":v}`).join(" · "); const starter=Object.entries(star.starterMomentum??{}).map(([m,v])=>`${m.slice(0,2).toUpperCase()} ×${v}`).join(" · "); return `<span class="ccg-rules-reference"><b>METHOD LIMITS</b>${limits}</span><span class="ccg-rules-reference"><b>STARTER MOMENTUM</b>${starter}</span>`;})() : ""}
        ${card.kind === "move" && !card.finisher && card.requirements && Object.keys(card.requirements).length ? `<span class="ccg-rules-requirements"><b>REQUIRES</b> ${Object.entries(card.requirements).map(([m,n])=>`${n} ${m}`).join(" · ")}</span>` : ""}
        ${card.kind === "move" && card.counters?.length ? `<span class="ccg-rules-requirements"><b>COUNTERS</b> ${card.counters.map(t=>MOVE_TYPE_LABELS[t] ?? t).join(", ")}</span>` : ""}
        ${card.kind === "move" && card.counterMethods?.length ? `<span class="ccg-rules-requirements"><b>COUNTERS</b> Any ${card.counterMethods.map(m=>m[0].toUpperCase()+m.slice(1)).join(" / ")} Move</span>` : ""}
        ${cardPlayRestrictionText(card)}
        <span class="ccg-rules-foot"><span>${card.cardCode ?? card.setId ?? "WWE LEGACY"}</span><span class="rarity-stars">${rarityStars(card.rarity ?? 1)}</span></span>
      </span>
    </span>${footer}
  </${rootTag}>`;
}
function collectionText(card) {
  if (card.kind === "superstar") return `${card.hp} HP · ${card.abilityName}: ${card.abilityText}`;
  if (card.kind === "momentum") return `Gain 1 permanent ${card.method[0].toUpperCase() + card.method.slice(1)} Momentum. Move costs never spend Momentum.`;
  if (["entrance", "special", "action", "support", "manager"].includes(card.kind)) return card.abilityText ?? card.kind;
  const req = Object.entries(card.finisher ? {} : (card.requirements ?? {})).map(([m,n]) => `${n} ${m}`).join(", ");
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
  const visibleCards = playerFacingCollectionCards();
  const visibleSets = playerFacingSetCollections();
  const baseCards = allSets ? visibleCards : visibleCards.filter(card => card.setId === activeCollectionSetId);
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
  const displayed = visible.slice(0, collectionRenderLimit);
  const hasMoreCollection = displayed.length < visible.length;
  const ownedUniqueAll = visibleCards.filter(isOwned).length;
  const ownedUniqueHere = baseCards.filter(isOwned).length;
  const starCards = baseCards.filter(c => c.kind === "superstar");
  const unlocked = starCards.filter(c => hasSuperstar(profile, c.superstarId)).length;
  const tabs = [`<button class="nav-button ${allSets ? 'active' : ''}" data-collection-set="all">All Sets</button>`, ...Object.values(visibleSets).map(set => `<button class="nav-button ${set.id === activeCollectionSetId ? 'active' : ''}" data-collection-set="${set.id}">${set.displayName}</button>`)].join('');
  const heroIds = allSets ? [profile.starterId, "stone-cold-steve-austin", "rhea-ripley"] : setHeroSuperstars(activeCollectionSetId);
  const setLogo = allSets ? "" : setLogoMarkup(activeCollectionSetId, "feature-set-logo");
  const title = collectionView === "owned" ? "MY COLLECTION" : "CARD CATALOGUE";
  const eyebrow = collectionView === "owned" ? "OWNED CARDS" : "EVERY ACTIVE CARD";
  const intro = collectionView === "owned"
    ? `Everything you currently own. Search ${ownedUniqueAll} unique cards across every set, or narrow the view below.`
    : `The live WWE Legacy card catalogue. Search and filter all ${visibleCards.length} currently available cards.`;
  const themeClass = allSets ? "theme-catalogue-all" : setVisualClass(activeCollectionSetId);
  document.body.dataset.set = activeCollectionSetId;
  root.innerHTML = `<section class="collection-screen premium-screen ${themeClass}">
    <section class="feature-hero collection-feature collection-all-hero">
      ${modePortraits(heroIds, "feature-art")}<div class="feature-shade"></div>
      <div class="feature-copy">${modeLogoMarkup("collection", true)}${setLogo}<span class="set-feature-name">${title}</span><p>${intro}</p>
        <div class="collection-view-switch"><button id="collection-owned-view" class="nav-button ${collectionView === 'owned' ? 'active' : ''}">My Collection</button><button id="collection-catalogue-view" class="nav-button ${collectionView === 'catalogue' ? 'active' : ''}">Card Catalogue</button></div>
        <div class="mode-branch-tabs collection-set-tabs">${tabs}</div>
      </div>
      <div class="set-stats"><div class="set-stat"><b>${collectionView === 'owned' ? ownedUniqueHere : baseCards.length}</b><span>${collectionView === 'owned' ? 'Owned here' : 'In view'}</span></div><div class="set-stat"><b>${unlocked}/${starCards.length}</b><span>Superstars</span></div><div class="set-stat"><b>${ownedUniqueAll}</b><span>Total owned</span></div><div class="set-stat"><b>${visibleCards.length}</b><span>Catalogue</span></div></div>
    </section>
    <section class="collection-tools"><span class="collection-mode-label">${eyebrow}</span><input id="collection-search" type="search" placeholder="Search name, move, ability or card code" value="${collectionFilter.search.replaceAll('"','&quot;')}"><select id="collection-kind">${kinds.map(k => `<option value="${k}" ${collectionFilter.kind === k ? 'selected' : ''}>${k === 'all' ? 'All card types' : k[0].toUpperCase()+k.slice(1)}</option>`).join('')}</select><select id="collection-rarity"><option value="all">All rarities</option>${[1,2,3,4].map(r => `<option value="${r}" ${collectionFilter.rarity === String(r) ? 'selected' : ''}>${rarityStars(r)} ${rarityLabels[r]}</option>`).join('')}</select><select id="collection-sort" aria-label="Sort My Collection"><option value="newest" ${collectionSort === 'newest' ? 'selected' : ''}>Newest Owned</option><option value="alpha-asc" ${collectionSort === 'alpha-asc' ? 'selected' : ''}>A–Z</option><option value="alpha-desc" ${collectionSort === 'alpha-desc' ? 'selected' : ''}>Z–A</option><option value="rarity-desc" ${collectionSort === 'rarity-desc' ? 'selected' : ''}>Rarity High → Low</option><option value="rarity-asc" ${collectionSort === 'rarity-asc' ? 'selected' : ''}>Rarity Low → High</option><option value="copies-desc" ${collectionSort === 'copies-desc' ? 'selected' : ''}>Most Copies</option></select><span class="collection-count">Showing ${displayed.length} / ${visible.length} matching · ${scopedCards.length} in scope</span></section>
    <section class="catalogue-grid collectible-catalogue">${displayed.length ? displayed.map(card => {
      const cardSet = setCollections[card.setId] ?? setCollection;
      return `<article class="catalogue-collectible ${card.kind === 'superstar' && !hasSuperstar(profile, card.superstarId) ? 'collection-locked' : ''}">${collectibleCardMarkup(card,{flipped:flippedCollectionCards.has(card.id),flipAttr:`data-flip-collection="${card.id}"`})}<div class="catalogue-under-card"><span>${card.cardCode}</span><b>${cardSet.rarityLabels[card.rarity]}</b><small>${card.kind === 'superstar' || card.kind === 'entrance' ? `Owned ${ownedCount(profile,card.id,'foil') ? 'FOIL' : '—'}` : `Owned ${ownedCount(profile,card.id,'normal')} · Foil ${ownedCount(profile,card.id,'foil')}`}</small>${card.kind==='superstar'&&hasSuperstar(profile,card.superstarId)?`<button type="button" class="favourite-star-button ${(profile.favouriteSuperstars??[]).includes(card.superstarId)?'active':''}" data-favourite-star="${card.superstarId}">${(profile.favouriteSuperstars??[]).includes(card.superstarId)?'★ FAVOURITE':'☆ ADD FAVOURITE'}</button>`:''}</div></article>`;
    }).join('') : `<div class="collection-empty">${collectionView === 'owned' ? 'No owned cards match these filters.' : 'No cards match these filters.'}</div>`}</section>${hasMoreCollection?`<div class="collection-load-more"><button id="collection-load-more" class="nav-button">Show ${Math.min(48,visible.length-displayed.length)} More Cards</button><small>${displayed.length} of ${visible.length} matching cards rendered</small></div>`:''}
  </section>`;
  root.querySelectorAll('[data-flip-collection]').forEach(btn => btn.addEventListener('click', () => { const id = btn.dataset.flipCollection; if (flippedCollectionCards.has(id)) flippedCollectionCards.delete(id); else flippedCollectionCards.add(id); renderCollection(); }));
  root.querySelectorAll('[data-collection-set]').forEach(btn => btn.addEventListener('click', () => { activeCollectionSetId = btn.dataset.collectionSet; collectionFilter = {kind:'all',rarity:'all',search:''}; collectionRenderLimit=48; flippedCollectionCards = new Set(); renderCollection(); }));
  $("#collection-owned-view")?.addEventListener("click", showOwnedCollection);
  $("#collection-catalogue-view")?.addEventListener("click", showCardCatalogue);
  $("#collection-search")?.addEventListener("input", e => { collectionFilter.search = e.target.value; collectionRenderLimit=48; renderCollection(); requestAnimationFrame(() => $("#collection-search")?.focus()); });
  $("#collection-kind")?.addEventListener("change", e => { collectionFilter.kind = e.target.value; collectionRenderLimit=48; renderCollection(); });
  $("#collection-rarity")?.addEventListener("change", e => { collectionFilter.rarity = e.target.value; collectionRenderLimit=48; renderCollection(); });
  $("#collection-sort")?.addEventListener("change", e => { collectionSort = e.target.value; collectionRenderLimit=48; renderCollection(); });
  $("#collection-load-more")?.addEventListener("click",()=>{ collectionRenderLimit += 48; renderCollection(); });
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
  const visibleCards = playerFacingCollectionCards();
  const visibleSets = playerFacingSetCollections();
  const options = catalogueOptions(visibleCards);
  const ownershipFor = card => catalogueOwned(card);
  const filtered = filterAndSortCatalogue(visibleCards, catalogueFilter, ownershipFor);
  const ownedUnique = visibleCards.filter(card => ownershipFor(card).total > 0).length;
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
  const setOptions = [select("all","All Sets",catalogueFilter.setId), ...Object.values(visibleSets).map(set => select(set.id,set.displayName,catalogueFilter.setId))].join("");
  const moveTypeOptions = [select("all","All Move Types",catalogueFilter.moveType), ...options.moveTypes.map(type => select(type, MOVE_TYPE_LABELS[type] ?? type, catalogueFilter.moveType))].join("");
  const moveFamilyOptions = [select("all","All Move Families",catalogueFilter.moveFamily), ...options.moveFamilies.map(family => select(family, family.replaceAll("-"," ").replace(/\b\w/g,m=>m.toUpperCase()), catalogueFilter.moveFamily))].join("");
  const methodOptions = [select("all","All Methods",catalogueFilter.method), ...options.methods.map(method => select(method, method[0].toUpperCase()+method.slice(1), catalogueFilter.method))].join("");
  const pagination = `<div class="catalogue-pagination"><button class="nav-button" data-catalogue-page="prev" ${cataloguePage <= 1 ? "disabled" : ""}>← Previous</button><b>Page ${cataloguePage} / ${pageCount}</b><button class="nav-button" data-catalogue-page="next" ${cataloguePage >= pageCount ? "disabled" : ""}>Next →</button></div>`;

  root.innerHTML = `<section class="catalogue-screen premium-screen theme-catalogue-all">
    <section class="catalogue-master-hero">
      <div><span class="eyebrow">MASTER CARD DATABASE</span><h1>CARD CATALOGUE</h1><p>Every released WWE Legacy card stays visible here. Unowned cards are greyed out; owned quantities are shown on every card.</p></div>
      <div class="catalogue-master-stats"><span><b>${visibleCards.length}</b> Released</span><span><b>${ownedUnique}</b> Owned</span><span><b>${filtered.length}</b> Matching</span></div>
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
  if (card.kind === "move") return card.finisher ? "Finisher" : card.trademark ? "Trademark" : (card.defensiveOnly || card.moveType === "counter") ? "Counter" : card.counters?.length ? "Move / Counter" : `Move · Cost ${card.cost ?? 0}`;
  return card.kind[0].toUpperCase() + card.kind.slice(1);
}

function renderDeckBuilder() {
  setChrome();
  const root = $("#game");
  if (!profile?.unlockedSuperstars?.length) { showSetup(); return; }
  const unlocked = orderedUnlockedSuperstars();

  if (deckLabStage === "roster") {
    root.innerHTML = `<section class="deck-builder-screen deck-lab-screen premium-screen">
      <section class="deck-lab-title"><span>DECK LAB</span><h2>Choose Your Superstar</h2></section>
      <section class="deck-lab-roster" aria-label="Unlocked Superstars">${unlocked.map(star => {
        const draft = createDeckDraft(profile, star.id);
        const check = validateDeckDraft(profile, star.id, draft, selectedEntranceId(profile, star.id));
        return `<article role="button" tabindex="0" class="deck-lab-star-card ${check.healthy ? 'is-valid' : 'needs-work'}" data-deck-lab-star="${star.id}">
          <span class="deck-lab-star-art deck-lab-full-superstar-card">${superstarPreviewCardMarkup(star.id,"deck-lab-roster-collectible")}</span>
          <span class="deck-lab-star-status"><em>${check.healthy ? 'VALID' : `${draft.length}/55`}</em><strong>${star.name}</strong></span>
        </article>`;
      }).join("")}</section>
    </section>`;
    const chooseDeckLabStar = btn => {
      deckBuilderStarId = btn.dataset.deckLabStar;
      deckDraft = createDeckDraft(profile, deckBuilderStarId);
      deckLabEntranceId = selectedEntranceId(profile, deckBuilderStarId);
      deckBuilderFilter = "";
      deckLabOnlyValid = false;
      deckLabPicker = null;
      deckLabStage = "editor";
      message = "";
      renderDeckBuilder();
    };
    root.querySelectorAll("[data-deck-lab-star]").forEach(btn => {
      btn.addEventListener("click", () => chooseDeckLabStar(btn));
      btn.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); chooseDeckLabStar(btn); } });
    });
    return;
  }

  if (!profile.unlockedSuperstars.includes(deckBuilderStarId)) {
    deckLabStage = "roster";
    renderDeckBuilder();
    return;
  }
  if (!deckDraft) deckDraft = createDeckDraft(profile, deckBuilderStarId);
  deckLabEntranceId ??= selectedEntranceId(profile, deckBuilderStarId);

  const star = superstarById[deckBuilderStarId];
  const entranceCard = collectionById.get(deckLabEntranceId) ?? collectionById.get(star.entranceId);
  const health = validateDeckDraft(profile, deckBuilderStarId, deckDraft, deckLabEntranceId);
  const currentCounts = currentCategoryCounts(deckDraft);
  const recommendedCounts = recommendedCategoryCounts(deckBuilderStarId);
  const lead = deckDraft.slice(0, 5).map((entry, index) => ({ entry, index, card: collectionById.get(entry.id ?? entry) }));
  const deckCountClass = health.healthy ? "valid" : deckDraft.length === 55 ? "invalid" : "incomplete";

  if (deckLabPicker) {
    let title = "Choose Card", subtitle = "All owned cards are shown. Invalid choices stay visible but shaded.", cards = [], pickType = deckLabPicker.type;
    if (pickType === "entrance") {
      title = "Change Entrance";
      subtitle = "Default Superstar Entrances and future shared booster Entrances appear here. Incompatible Entrances remain visible but shaded.";
      cards = allOwnedEntrances(profile).map(card => ({ card, eligibility: entranceEligibilityForSuperstar(star, card) }));
    } else if (pickType === "lead") {
      title = `Change Lead Off ${Number(deckLabPicker.slot) + 1}`;
      subtitle = "Choose any owned Move or Momentum page. Invalid Method or Superstar restrictions remain visible but shaded.";
      cards = playerFacingCollectionCards().filter(card => ["move", "momentum"].includes(card.kind) && ownedTotal(profile, card.id) > 0).map(card => ({ card, eligibility: cardEligibilityForSuperstar(star, card) }));
    } else {
      const category = DECK_LAB_CATEGORIES.find(c => c.id === deckLabPicker.category);
      title = category?.label ?? "Deck Cards";
      subtitle = `Current ${currentCounts[deckLabPicker.category] ?? 0} · Recommended ${recommendedCounts[deckLabPicker.category] ?? 0}. Recommendations are guidance only.`;
      cards = ownedCardsForCategory(profile, deckLabPicker.category).map(card => ({ card, eligibility: cardEligibilityForSuperstar(star, card) }));
    }
    const query = deckBuilderFilter.trim().toLowerCase();
    cards = cards.filter(row => !query || `${row.card.name} ${row.card.kind} ${row.card.moveType ?? ""} ${row.card.method ?? ""}`.toLowerCase().includes(query));
    if (deckLabOnlyValid) cards = cards.filter(row => row.eligibility.legal);
    cards.sort((a, b) => Number(b.eligibility.legal) - Number(a.eligibility.legal) || a.card.name.localeCompare(b.card.name));

    root.innerHTML = `<section class="deck-builder-screen deck-lab-screen premium-screen deck-lab-picker-screen">
      <header class="deck-lab-picker-head"><button id="deck-picker-back" type="button" class="ghost">← Deck</button><div><span>DECK LAB · ${star.name.toUpperCase()}</span><h2>${title}</h2><p>${subtitle}</p></div><strong class="deck-lab-counter ${deckCountClass}">${deckDraft.length}/55</strong></header>
      <div class="deck-lab-picker-tools"><input id="deck-search" type="search" placeholder="Search owned cards" value="${deckBuilderFilter.replaceAll('"','&quot;')}"><label class="valid-only-toggle"><input id="deck-valid-only" type="checkbox" ${deckLabOnlyValid ? 'checked' : ''}><span>Only Show Valid</span></label></div>
      <section class="deck-lab-card-picker deck-lab-card-grid">${cards.length ? cards.map(({card, eligibility}) => {
        const used = deckDraft.filter(e => (e.id ?? e) === card.id).length;
        const owned = ownedTotal(profile, card.id);
        const cap = card.kind === "momentum" ? 12 : 5;
        const canAdd = eligibility.legal && deckDraft.length < 55 && used < Math.min(cap, owned);
        const tailIndex = deckDraft.map(e => e.id ?? e).lastIndexOf(card.id);
        const canRemove = tailIndex >= 5 && pickType === "category";
        const action = pickType === "entrance"
          ? `<button data-pick-entrance="${card.id}" class="deck-card-change primary" ${eligibility.legal ? '' : 'disabled'}>${card.id === deckLabEntranceId ? 'SELECTED' : 'CHANGE'}</button>`
          : pickType === "lead"
            ? `<button data-pick-lead="${card.id}" class="deck-card-change primary" ${eligibility.legal ? '' : 'disabled'}>CHANGE</button>`
            : `<div class="deck-card-stepper"><button data-deck-remove-index="${tailIndex}" class="secondary" ${canRemove ? '' : 'disabled'} aria-label="Remove one ${card.name}">−</button><strong>${used}</strong><button data-add-deck="${card.id}" class="primary" ${canAdd ? '' : 'disabled'} aria-label="Add one ${card.name}">+</button></div>`;
        return `<article class="deck-lab-card-tile ${eligibility.legal ? 'is-valid' : 'is-invalid'}">
          <div class="deck-lab-full-card">${collectibleCardMarkup(card,{extraClass:"deck-lab-picker-ccg"})}<span class="deck-card-owned-chip">${used}/${owned}</span>${eligibility.legal ? '' : `<span class="deck-card-invalid-chip">LOCKED</span>`}</div>
          ${eligibility.legal ? '' : `<div class="deck-card-invalid-reason">${eligibility.reason}</div>`}
          ${action}
        </article>`;
      }).join("") : `<div class="collection-empty">No owned cards match this filter.</div>`}</section>
    </section>`;

    $("#deck-picker-back")?.addEventListener("click", () => { deckLabPicker = null; deckBuilderFilter = ""; renderDeckBuilder(); });
    $("#deck-search")?.addEventListener("input", e => { deckBuilderFilter = e.target.value; renderDeckBuilder(); requestAnimationFrame(() => { const input = $("#deck-search"); input?.focus(); input?.setSelectionRange(input.value.length, input.value.length); }); });
    $("#deck-valid-only")?.addEventListener("change", e => { deckLabOnlyValid = e.target.checked; renderDeckBuilder(); });
    root.querySelectorAll("[data-pick-entrance]").forEach(btn => btn.addEventListener("click", () => { deckLabEntranceId = btn.dataset.pickEntrance; deckLabPicker = null; deckBuilderFilter = ""; message = `${collectionById.get(deckLabEntranceId)?.name ?? 'Entrance'} selected. Save the deck to keep this Entrance.`; renderDeckBuilder(); }));
    root.querySelectorAll("[data-pick-lead]").forEach(btn => btn.addEventListener("click", () => { const before = deckDraft; deckDraft = replaceLeadOffSlot(profile, deckBuilderStarId, deckDraft, deckLabPicker.slot, btn.dataset.pickLead); if (deckDraft === before) message = "That card cannot replace this Lead Off slot with your current ownership/copy limits."; else message = `Lead Off ${Number(deckLabPicker.slot)+1} changed.`; deckLabPicker = null; deckBuilderFilter = ""; renderDeckBuilder(); }));
    root.querySelectorAll("[data-add-deck]").forEach(btn => btn.addEventListener("click", () => { const before = deckDraft.length; deckDraft = addCardToDraft(profile, deckBuilderStarId, deckDraft, btn.dataset.addDeck); message = deckDraft.length > before ? "Card added." : "That card cannot be added."; renderDeckBuilder(); }));
    root.querySelectorAll("[data-deck-remove-index]").forEach(btn => btn.addEventListener("click", () => { const idx = Number(btn.dataset.deckRemoveIndex); if (idx >= 5) { deckDraft = removeCardFromDraft(profile, deckBuilderStarId, deckDraft, idx); message = "Card removed."; } renderDeckBuilder(); }));
    return;
  }

  const superstarCard = collectionById.get(star.cardId ?? `superstar-${star.id}`);
  const violations = health.violations.length
    ? `<div class="deck-validity-list">${health.violations.map(v => `<p>• ${v}</p>`).join("")}</div>`
    : `<p class="deck-validity-ok">✓ 55/55 · Deck is valid and ready to save.</p>`;

  root.innerHTML = `<section class="deck-builder-screen deck-lab-screen premium-screen">
    <header class="deck-lab-editor-head"><button id="deck-lab-roster-back" type="button" class="ghost">← Superstars</button><div><span>DECK LAB</span><h2>${star.name}</h2><p>Recommendations are guidance. Build your own legal 55-page deck.</p></div><strong class="deck-lab-counter ${deckCountClass}">${deckDraft.length}/55</strong></header>
    ${message ? `<p class="setup-message">${message}</p>` : ""}

    <section class="deck-identity-row">
      <article class="deck-identity-card"><span>SUPERSTAR</span><div class="deck-identity-visual">${superstarCard ? collectibleCardMarkup(superstarCard,{extraClass:"deck-lab-identity-card"}) : superstarVisualMarkup(star.id,star.name)}</div><strong>${star.name}</strong></article>
      <article class="deck-identity-card entrance-slot"><span>ENTRANCE</span><div class="deck-identity-visual">${entranceCard ? collectibleCardMarkup(entranceCard,{extraClass:"deck-lab-identity-card"}) : '<div class="portrait-placeholder">Entrance</div>'}</div><strong>${entranceCard?.name ?? star.entrance?.name ?? 'Entrance'}</strong><button id="change-entrance" type="button" class="nav-button">Change</button></article>
    </section>

    <section class="deck-lead-off-panel"><div class="section-title"><h3>Lead Off 5</h3><span>Opening hand</span></div><div class="deck-lead-off-row">${lead.map(({card,index}) => `<article class="deck-lead-slot visual-lead-slot"><span class="lead-slot-label">LEAD ${index+1}</span>${card ? collectibleCardMarkup(card,{interactive:false,extraClass:"deck-lead-card"}) : '<span class="lead-empty">EMPTY</span>'}<button type="button" data-change-lead="${index}">Change</button></article>`).join("")}</div></section>

    <section class="deck-category-list"><div class="section-title"><h3>Deck Sections</h3><span>Tap a section to browse all owned cards</span></div>${DECK_LAB_CATEGORIES.map(category => {
      const current = currentCounts[category.id] ?? 0, recommended = recommendedCounts[category.id] ?? 0;
      return `<button type="button" class="deck-category-row" data-deck-category="${category.id}"><span><em>${category.label.toUpperCase()}</em><strong>${current}</strong></span><span class="deck-category-rec">RECOMMENDED ${recommended}</span><b>›</b></button>`;
    }).join("")}</section>

    <section class="deck-validity-panel"><div class="section-title"><h3>Deck Validity</h3><span class="${health.healthy ? 'valid' : 'invalid'}">${health.healthy ? 'VALID' : 'CHECK REQUIRED'}</span></div>${violations}<div class="deck-builder-actions"><button id="optimize-deck" class="nav-button">Auto Fill Owned</button><button id="reset-recommended" class="nav-button">Reset to Owned Recommended</button><button id="save-deck" class="start-match" ${health.healthy ? '' : 'disabled'}>Save Deck</button></div></section>
  </section>`;

  $("#deck-lab-roster-back")?.addEventListener("click", () => { deckLabStage = "roster"; deckLabPicker = null; deckDraft = null; deckLabEntranceId = null; message = ""; renderDeckBuilder(); });
  $("#change-entrance")?.addEventListener("click", () => { deckLabPicker = { type: "entrance" }; deckLabOnlyValid = false; deckBuilderFilter = ""; renderDeckBuilder(); });
  root.querySelectorAll("[data-change-lead]").forEach(btn => btn.addEventListener("click", () => { deckLabPicker = { type: "lead", slot: Number(btn.dataset.changeLead) }; deckLabOnlyValid = false; deckBuilderFilter = ""; renderDeckBuilder(); }));
  root.querySelectorAll("[data-deck-category]").forEach(btn => btn.addEventListener("click", () => { deckLabPicker = { type: "category", category: btn.dataset.deckCategory }; deckLabOnlyValid = false; deckBuilderFilter = ""; renderDeckBuilder(); }));
  $("#optimize-deck")?.addEventListener("click", () => { deckDraft = autoFillOwnedDraft(profile, deckBuilderStarId, deckDraft.slice(0,5)); message = deckDraft.length === 55 ? "Auto Fill completed the deck using legal owned cards." : `Auto Fill used every legal owned card available. ${55-deckDraft.length} slots remain.`; renderDeckBuilder(); });
  $("#reset-recommended")?.addEventListener("click", () => { deckDraft = buildOwnedRecommendedDraft(profile, deckBuilderStarId); deckLabEntranceId = star.entranceId; message = `Owned recommended cards restored. ${Math.max(0,55-deckDraft.length)} slots remain.`; renderDeckBuilder(); });
  $("#save-deck")?.addEventListener("click", () => {
    const check = validateDeckDraft(profile, deckBuilderStarId, deckDraft, deckLabEntranceId);
    if (!check.healthy) { message = "Deck is not valid yet. Review the checker below."; renderDeckBuilder(); return; }
    profile.savedDecks ??= {};
    profile.savedDecks[deckBuilderStarId] = deckDraft.map(entry => ({ ...entry }));
    if (!setSelectedEntrance(profile, deckBuilderStarId, deckLabEntranceId)) { message = "Selected Entrance is not legal or owned."; renderDeckBuilder(); return; }
    saveProfile(profile);
    message = `${star.name}'s deck and Entrance saved.`;
    renderDeckBuilder();
  });
}

function cardMeta(card) {
  if (card.kind === "momentum") return `${card.method.toUpperCase()} +${card.amount ?? 1}`;
  if (["entrance", "special", "action", "support", "manager"].includes(card.kind)) return card.abilityText ?? card.kind;
  const req = Object.entries(card.finisher ? {} : (card.requirements ?? {})).map(([m, n]) => `${n} ${m}`).join(" · ");
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
  if (card.kind === "action") { const p=state.players[playerId]; if (p.turn.actionPlayed >= 1) return "Action already played this turn"; if (p.actionLocked) return "Actions are currently locked"; const need=Math.max(0,card.cost??0),have=effectiveTotalMomentum(state,playerId); return have<need ? `Need ${need} total Momentum` : ""; }
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

function afterHumanAction() {
  flippedHandCards = new Set();
  const before = game.state().log.length;
  advanceCpu();
  const events = game.state().log.slice(before);
  const sequence = presentationFromEvents(events);
  if (sequence) spectacleSequence(sequence, () => render()); else render();
}

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
  const logBefore = state.log.length;
  try {
    if (decisionOwner(state) !== HUMAN) return;
    if (state.phase === "COUNTER") game.passCounter(HUMAN);
    else if (state.phase === "PIN_RESPONSE") game.passPinResponse(HUMAN);
    else if (state.phase === "ACTION") game.passTurn(HUMAN);
  } catch (error) { message = error.message; }
  const immediateEvents = game.state().log.slice(logBefore);
  if (immediateEvents.some(e => ["PIN_CHECK","KICK_OUT","MATCH_ENDED"].includes(e.type))) {
    flippedHandCards = new Set();
    const beforeCpu = game.state().log.length; advanceCpu();
    const sequence = presentationFromEvents([...immediateEvents,...game.state().log.slice(beforeCpu)]);
    if (sequence) spectacleSequence(sequence, () => render()); else render();
  } else afterHumanAction();
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
  if (player.superstar?.id === "goldberg") return `${player.streakCounters ?? 0}/3 STREAK`;
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
  const zone = healthZone(player);
  return zone === "green" ? "healthy" : zone === "amber" ? "average" : "danger";
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
let playPileOverlayCard = null, playPileOverlayFlipped = false;
let matchSpectacle = null, matchSpectacleTimer = null;

function renderSuperstarOverlay() {
  if (!superstarOverlayId) return "";
  const star = superstarById[superstarOverlayId];
  const card = superstarCollectibleFor(superstarOverlayId);
  if (!star || !card) return "";
  return `<div class="superstar-card-modal" data-superstar-modal-backdrop="1"><div class="superstar-card-modal-inner">${collectibleCardMarkup(card,{flipped:superstarOverlayFlipped,extraClass:"hud-superstar-modal-card",flipAttr:'data-flip-superstar-modal="1"'})}<small>Tap card to ${superstarOverlayFlipped ? "show front" : "flip"} · Tap outside to close</small></div></div>`;
}

function renderPlayPileOverlay() {
  if (!playPileOverlayCard) return "";
  return `<div class="superstar-card-modal play-pile-card-modal" data-play-pile-modal-backdrop="1"><div class="superstar-card-modal-inner play-pile-card-modal-inner">${collectibleCardMarkup(playPileOverlayCard,{flipped:playPileOverlayFlipped,extraClass:"hud-superstar-modal-card play-pile-modal-card",flipAttr:'data-flip-play-pile-modal="1"'})}<small>Tap card to ${playPileOverlayFlipped ? "show front" : "flip"} · Tap outside to close</small></div></div>`;
}

function renderMatchSpectacle() {
  if (!matchSpectacle) return "";
  return `<div class="match-spectacle ${matchSpectacle.kind ?? "pin"}" aria-live="assertive"><div class="match-spectacle-copy">${matchSpectacle.text}</div></div>`;
}

function spectacleSequence(steps, done) {
  if (matchSpectacleTimer) clearTimeout(matchSpectacleTimer);
  let i = 0;
  const next = () => {
    if (i >= steps.length) { matchSpectacle = null; matchSpectacleTimer = null; done?.(); return; }
    matchSpectacle = steps[i++];
    render();
    matchSpectacleTimer = setTimeout(next, matchSpectacle.duration ?? 650);
  };
  next();
}

function presentationFromEvents(events) {
  if (!events?.length) return null;
  const ended = [...events].reverse().find(e => e.type === "MATCH_ENDED");
  const pinCheck = [...events].reverse().find(e => e.type === "PIN_CHECK");
  const kicked = events.some(e => e.type === "KICK_OUT");
  if (ended?.finishType === "submission") return [{text:"SUBMISSION LOCKED IN",kind:"submission",duration:800},{text:"TAP OUT!",kind:"submission",duration:1150}];
  if (ended?.finishType === "i-quit" || ended?.finishType === "i quit") return [{text:"I QUIT!",kind:"submission",duration:1150}];
  if (pinCheck || ended?.finishType === "pin") {
    const success = ended?.finishType === "pin";
    return success
      ? [{text:"1!",kind:"pin",duration:620},{text:"2!!",kind:"pin",duration:760},{text:"3!!!",kind:"pin final",duration:1100}]
      : kicked ? [{text:"1!",kind:"pin",duration:560},{text:"2!!",kind:"pin",duration:success?760:920},{text:"KICK OUT!",kind:"kickout",duration:950}] : null;
  }
  return null;
}

function renderMatchHud() {
  return `<section class="match-hud-shell premium-match-hud">
    <div class="match-hud-grid">${renderWrestlerHud(HUMAN)}${renderWrestlerHud(CPU)}</div>
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
    return `<div class="play-pile-item ${isHuman?"from-you":"from-cpu"} ${latest?"is-latest":""}"><div class="play-pile-context"><span>${owner}</span><b>${actionLabel}</b></div><div class="play-pile-card-trigger" data-open-play-pile="${card.id}" role="button" tabindex="0" aria-label="Inspect ${card.name}">${collectibleCardMarkup(card,{flipped:false,extraClass:"play-pile-ccg"})}</div><small>${shortCardMeta(card)}</small></div>`;
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
    <div class="command-status"><span>TURN ${state.turnNumber} / ${state.turnLimit ?? 50}</span><b>${state.phase.replaceAll("_", " ")}</b></div>
    <div class="command-prompt"><strong>${prompt}</strong><small>${message}</small></div>
    <div class="command-actions">
      ${owner === HUMAN && state.phase === "COUNTER" ? '<button id="pass-action" class="primary show-command-button single-context-action">PASS</button>' : ""}
      ${owner === HUMAN && state.phase === "ACTION" && pinCheck?.legal ? `<button id="attempt-pin" class="primary pin-ready show-command-button single-context-action">PIN</button>` : ""}
      ${owner === HUMAN && state.phase === "ACTION" && !pinCheck?.legal && canReturnToRing(state, HUMAN) ? '<button id="return-ring" class="primary show-command-button single-context-action">RETURN TO RING</button>' : ""}
      ${owner === HUMAN && state.phase === "ACTION" && !pinCheck?.legal && !canReturnToRing(state, HUMAN) ? '<button id="pass-action" class="secondary show-command-button pass-control-button single-context-action">PASS</button>' : ""}
      ${owner === HUMAN && state.phase === "PIN_RESPONSE" ? '<button id="pass-action" class="primary show-command-button single-context-action">PASS</button>' : ""}
      ${owner === HUMAN && state.phase === "SUBMISSION_MAINTAIN" ? '<button id="release-submission" class="primary show-command-button">Release Hold</button>' : ""}
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
    ENTRANCE_PLAYED: () => `${n(event.playerId)} played Entrance ${event.cardId}.`, ACTION_PLAYED: () => `${n(event.playerId)} played ${cardNameFor(event.cardId)}.`, HEALTH_RESTORED: () => `${cardNameFor(event.cardId)} restores ${event.amount} HP to ${n(event.playerId)}.`, FIGHT_FOREVER: () => `Fight Forever restores ${event.playerHeal} HP to ${n(event.playerId)} and ${event.opponentHeal} HP to ${n(event.opponentId)}; turn limit ${event.oldTurnLimit} → ${event.newTurnLimit}.`, SUPPORT_PLAYED: () => `${n(event.playerId)} put ${cardNameFor(event.cardId)} into play.`, SUPPORT_REPLACED: () => `${n(event.playerId)} discarded ${cardNameFor(event.cardId)}.`, MANAGER_PLAYED: () => `${n(event.playerId)} brought ${event.managerName} to ringside.`, MANAGER_ABILITY: () => `${event.managerName} assisted ${n(event.playerId)}.`, MOVE_DECLARED: () => `${n(event.playerId)} declared ${cardNameFor(event.cardId)}.`,
    MOVE_COUNTERED: () => `${n(event.defenderId)} countered ${cardNameFor(event.incomingCardId)} with ${cardNameFor(event.counterCardId)}.`, AUTO_COUNTER: () => `${n(event.defenderId)} Auto Countered by ditching 7 pages.`,
    COUNTER_PASSED: () => `${n(event.defenderId)} passed the counter window.`, MOVE_CONNECTED: () => `${cardNameFor(event.cardId)} connected for ${event.damage} damage${event.finisher ? " (FINISHER)" : ""}.`,
    CARDS_DRAWN: () => `${n(event.playerId)} drew ${event.cardIds.length} page${event.cardIds.length === 1 ? "" : "s"}.`, CONTROL_PASSED: () => `${n(event.from)} passed Control to ${n(event.to)}.`, CONTROL_RETAINED: () => `${n(event.playerId)} connected and keeps Control.`, CRITICAL_EXHAUSTION: () => `${n(event.playerId)} is at 0 HP and cannot retain Control. Control passes to ${n(event.to)}.`,
    POST_MOVE_WINDOW: () => `${n(event.attackerId)} has a post-move finish window.`, PIN_ATTEMPTED: () => `${n(event.attackerId)} attempts pin #${event.attemptNumber}; ${event.chance}% prototype chance.`,
    PIN_ESCAPED_SPECIAL: () => `${n(event.defenderId)} used a pin-escape Special.`, PIN_CHECK: () => `Pin check: rolled ${event.roll} vs ${event.chance}%.`, KICK_OUT: () => `${n(event.defenderId)} kicks out and takes Control.`,
    BODY_PART_DAMAGE: () => `${cardNameFor(event.cardId)} deals +${event.amount} ${event.bodyPart} body-part damage (${event.total}/${event.threshold}).`, SUBMISSION_DAMAGE: () => `${event.bodyPart} submission pressure ${event.total}/${event.threshold}.`, SUBMISSION_MAINTAINED: () => `${n(event.attackerId)} maintained the hold.`, SUBMISSION_RELEASED: () => `${n(event.attackerId)} released the hold and kept Control.`,
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
  return `<section class="submission-panel premium-submission"><div class="submission-lock-head"><span>${sub.finisher ? "SUBMISSION FINISHER" : sub.trademark ? "TRADEMARK HOLD" : "SUBMISSION LOCKED IN"}</span><h3>${cardNameFor(sub.cardId)}</h3><small>${sub.bodyPart.toUpperCase()} PRESSURE</small></div><div class="submission-pressure"><div><b>${total}</b><span>/ ${threshold} PRESSURE</span></div><i><em style="width:${pct}%"></em></i></div><p>Submission Turn <b>${sub.holdTurn ?? 1}</b>. Ditch one page to squeeze again for <b>+${sub.damage}</b> pressure. Tap-outs begin on Turn 3 unless this body part was already worked by a previous Submission.</p><div class="ditch-row">${attacker.hand.map((c,i)=>`<button data-ditch="${i}"><span>DITCH</span><b>${c.name}</b></button>`).join("")}</div></section>`;
}

function handleCompletedMatch() {
  const state = game.state();
  if (state.phase !== "MATCH_OVER" || matchRewarded) return;
  if (profile.onboarding && !profile.onboarding.complete) profile.onboarding.complete = true;
  matchRewarded = true;
  recordCompletedMatchChallenges(profile, state, HUMAN, activeMode);
  const result = state.winner === HUMAN ? "win" : state.winner === CPU ? "loss" : "draw";
  const seasonXpReward = awardMatchSeasonXp(profile, result);
  if (seasonXpReward.tierAfter > seasonXpReward.tierBefore) pendingTierUp = { tier: seasonXpReward.tierAfter, reward: tierReward(seasonXpReward.tierAfter) };
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

function renderTierUpCelebration() {
  if (!pendingTierUp) return "";
  const reward = pendingTierUp.reward;
  const rewardName = reward.kind === "booster" ? `${sets[reward.setId]?.displayName ?? reward.setId} Booster` : reward.kind === "universe-points" ? `${reward.amount} Universe Points` : "The Rock — Final Boss";
  return `<div class="tier-up-celebration"><div class="tier-up-card"><span>SEASON PROGRESSION</span><h2>TIER ${pendingTierUp.tier}</h2><h3>REACHED</h3><p>Reward unlocked: <b>${rewardName}</b></p><button id="tier-up-continue" type="button">CONTINUE</button></div></div>`;
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
    root.innerHTML = renderMatchResults() + renderTierUpCelebration();
    $("#tier-up-continue")?.addEventListener("click", () => { pendingTierUp = null; render(); });
    $("#results-reward")?.addEventListener("click", showBoosters);
    $("#results-continue")?.addEventListener("click", activeMode === "ladder" ? showLadder : activeMode === "championship" ? showChampionship : showMainMenu);
    $("#results-rematch")?.addEventListener("click", restartMatch);
    return;
  }
  document.body.dataset.matchTheme = matchPresentationSetId ?? "summerslam-series-1";
  root.innerHTML = `<section class="match-experience ${presentationThemeClass(matchPresentationSetId)} ${(!profile?.onboarding || profile.onboarding.complete)?"":"has-onboarding"}">${onboardingMarkup()}${renderMatchHud()}${renderPlayPile()}${renderCommandBar()}${renderSubmissionChooser()}${renderHumanHand()}${renderMatchLog()}</section>${renderSuperstarOverlay()}${renderPlayPileOverlay()}${renderMatchSpectacle()}`;
  $("#skip-onboarding")?.addEventListener("click",()=>{ profile.onboarding={complete:true,step:0}; saveProfile(profile); render(); });
  root.querySelectorAll("[data-flip-hand]").forEach(btn => btn.addEventListener("click", () => { const key = btn.dataset.flipHand; if (flippedHandCards.has(key)) flippedHandCards.delete(key); else flippedHandCards.add(key); render(); }));
  root.querySelectorAll("[data-play-hand]").forEach(btn => btn.addEventListener("click", () => playCard(HUMAN, Number(btn.dataset.playHand))));
  const openPlayPileCard = (trigger, event) => { event?.stopPropagation?.(); playPileOverlayCard = collectionById.get(trigger.dataset.openPlayPile) ?? null; playPileOverlayFlipped = false; render(); };
  root.querySelectorAll("[data-open-play-pile]").forEach(trigger => {
    trigger.addEventListener("click", event => openPlayPileCard(trigger, event));
    trigger.addEventListener("keydown", event => { if (event.key !== "Enter" && event.key !== " ") return; event.preventDefault(); openPlayPileCard(trigger, event); });
  });
  root.querySelectorAll("[data-flip-play-pile-modal]").forEach(btn => btn.addEventListener("click", event => { event.stopPropagation(); playPileOverlayFlipped = !playPileOverlayFlipped; render(); }));
  root.querySelectorAll("[data-play-pile-modal-backdrop]").forEach(backdrop => backdrop.addEventListener("click", event => { if (event.target !== backdrop) return; playPileOverlayCard = null; playPileOverlayFlipped = false; render(); }));
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
  else if (target === "challenges") showChallenges();
  else if (target === "deck-builder") showDeckBuilder();
  else if (target === "store") showStore();
  else if (target === "profile") showProfile();
  else if (target === "options") showOptions();
}));

if (screen === "splash") renderSplash(); else if (screen === "starter") renderStarter(); else if (screen === "menu") renderMainMenu(); else if (screen === "play-menu") renderPlayMenu(); else if (screen === "profile") renderProfile(); else if (screen === "options") renderOptions(); else if (screen === "launch-releases") renderLaunchReleases(); else if (screen === "boosters") renderBoosters(); else if (screen === "store") renderStore(); else if (screen === "catalogue") renderCardCatalogue(); else if (screen === "ladder") renderLadder(); else if (screen === "championship") renderChampionship(); else if (screen === "challenges") renderChallenges(); else if (screen === "seasons") renderSeasons(); else if (screen === "deck-builder") renderDeckBuilder(); else renderSetup();

setInterval(refreshSeasonClocks, 1000);
