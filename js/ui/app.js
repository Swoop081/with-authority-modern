import { superstars } from "../data/superstars.js";
import { decks } from "../data/decks.js";
import { sets } from "../data/sets.js";
import { collectionCards, setCollection, setCollections, cardsForSet } from "../data/collection.js";
import { artworkFor, superstarArtwork } from "../data/artwork.js";
import { STARTER_CHOICES, createProfile, hasSuperstar, loadProfile, saveProfile, resetProfile, setDeckAssistance, ownedCount } from "../data/profile.js";
import { openBooster, openLadderCompletionPack, openChampionshipPack, grantBooster, boosterCreditsFor } from "../data/boosters.js";
import { buildPlayableDeck, findPackUpgrades, applyUpgrade } from "../data/deck-assistant.js";
import { MatchEngine } from "../engine/MatchEngine.js";
import { canPlayMomentum, canPlayEntrance, canPlayAction, canPlaySupport, canPlayManager, effectiveTotalMomentum, moveEligibility, canCounter, canAttemptPin, canPlayPinEscape, submissionThreshold, canReturnToRing, canFollowOutside } from "../engine/rules.js";
import { totalMomentum } from "../engine/utils.js";
import { decisionOwner } from "../ai/WrestlingAI.js";
import { advanceCpuUntilHuman } from "./turn-driver.js";
import { LADDER_LIVES, LADDER_BRANCHES, ladderState, startLadderRun, currentLadderOpponent, recordLadderMatch } from "../data/ladder.js";
import { CHAMPIONSHIP_ROAD_LENGTH, CHAMPIONSHIP_STAGES, CHAMPIONSHIP_BRANCHES, championshipRoadState, startChampionshipRoad, currentChampionshipOpponent, recordChampionshipMatch, resetChampionshipRoad } from "../data/championship-road.js";
import { challengeState, claimChallenge, recordCompletedMatchChallenges } from "../data/challenges.js";
import { setProgressState, collectionProgress, availableMilestoneRewards, claimMilestone } from "../data/set-progression.js";
import { MOVE_TYPE_LABELS } from "../data/move-types.js";
import { createDeckDraft, recommendedDeckDraft, optimizeDeck, aggregateDeck, eligibleOwnedCards, addCardToDraft, removeCardFromDraft, validateDeckDraft, materializeDraft, leadOffIds } from "../data/deck-builder.js";
import { SEASON_1, SEASON_TIER_COUNT, XP_PER_TIER, MATCH_XP, seasonState, seasonTier, seasonLevelProgress, seasonTimeRemaining, nextRoadmapNode, roadmapNodeStatus, awardMatchSeasonXp, tierReward, claimSeasonTier, claimAllSeasonTiers, freePackStatus, claimFreeSeasonBooster } from "../data/seasons.js";

const HUMAN = "p1";
const CPU = "p2";
let game = null;
let message = "";
let profile = loadProfile();
let screen = "splash";
let selection = { p1: profile?.starterId ?? "cm-punk", p2: profile?.starterId === "roman-reigns" ? "cm-punk" : "roman-reigns" };
let lastMatchup = { ...selection };
let collectionFilter = { kind: "all", rarity: "all", search: "" };
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
let activeCollectionSetId = "summerslam-series-1";
let activeBoosterSetId = "summerslam-series-1";
let unlockCelebration = null;
let unlockCelebrationIndex = 0;
let ladderBranchId = "modern";
let championshipBranchId = "modern";
let flippedHandCards = new Set();
let flippedCollectionCards = new Set();
let playPileFlipped = false;
let playPileCardKey = null;
let boosterRulesFlipped = new Set();

const roster = Object.values(superstars);
const superstarById = Object.fromEntries(roster.map(star => [star.id, star]));
const collectionById = new Map(collectionCards.map(card => [card.id, card]));
const rosterForBranch = (branch) => roster.filter(star => star.setId === branch.setId && (!branch.era || star.era === branch.era));
const $ = selector => document.querySelector(selector);
const nameFor = id => id ? game.state().players[id]?.superstar.name ?? id : "No one";
const cardNameFor = id => id ? collectionById.get(id)?.name ?? id : "";
const portraitMarkup = (id, name, cls = "") => superstarArtwork[id] ? `<img class="${cls}" src="${superstarArtwork[id]}" alt="${name}">` : `<span class="portrait-placeholder ${cls}"><b>${name}</b><small>Artwork pending</small></span>`;

function setChrome({ hideTopbar = false } = {}) {
  const bar = document.querySelector("#app-topbar");
  if (bar) bar.hidden = hideTopbar;
  document.body.dataset.screen = screen;
  document.body.dataset.mode = activeMode ?? "";

  const mobileNav = document.querySelector("#mobile-game-nav");
  if (mobileNav) {
    const navScreens = new Set(["menu", "play-menu", "setup", "ladder", "championship", "collection", "boosters", "challenges", "seasons", "deck-builder", "profile"]);
    mobileNav.hidden = !profile || !navScreens.has(screen);
    const activeTarget = screen === "setup" || screen === "ladder" || screen === "championship" ? "play-menu" : screen === "deck-builder" ? "collection" : screen;
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

function startMatch(p1Id = selection.p1, p2Id = selection.p2, { mode = "exhibition" } = {}) {
  if (!profile) { screen = "starter"; renderStarter(); return; }
  if (!superstarById[p1Id] || !superstarById[p2Id]) return;
  if (!hasSuperstar(profile, p1Id)) { message = "That Superstar is still locked. Earn their Superstar card to play as them."; mode === "ladder" ? renderLadder() : renderSetup(); return; }
  if (p1Id === p2Id && mode === "exhibition") { message = "Choose two different Superstars."; renderSetup(); return; }
  activeMode = mode;
  selection = { p1: p1Id, p2: p2Id };
  lastMatchup = { ...selection };
  const playerDeck = buildPlayableDeck(profile, p1Id);
  if (!playerDeck) {
    const have = profile?.savedDecks?.[p1Id]?.length ?? 0;
    const need = Math.max(0, 55 - have);
    message = `${superstarById[p1Id].name} is unlocked, but their collection deck still needs ${need} more owned page${need === 1 ? "" : "s"}. Open boosters or use Deck Builder once you own enough legal cards.`;
    if (mode === "ladder") renderLadder();
    else if (mode === "championship") renderChampionship();
    else renderSetup();
    return;
  }
  const openingControl = Math.random() < 0.5 ? HUMAN : CPU;
  game = new MatchEngine({ superstarA: superstarById[p1Id], superstarB: superstarById[p2Id], deckA: playerDeck, deckB: decks[p2Id], startingControl: openingControl });
  const openingText = `${nameFor(openingControl)} starts in Control.`;
  message = mode === "ladder" ? `Climb the Ladder · ${nameFor(HUMAN)} faces ${nameFor(CPU)}. ${openingText}` : mode === "championship" ? `Championship Road · ${nameFor(HUMAN)} faces ${nameFor(CPU)}. ${openingText}` : `${openingText} You are Player 1; ${nameFor(CPU)} is CPU controlled.`;
  screen = "match";
  matchRewarded = false;
  render();
  // If the CPU wins opening Control, let the browser paint the initial state
  // (including the "thinking…" prompt) and then immediately drive CPU actions
  // until the human has a decision to make. Previously this handoff was missing,
  // leaving human-vs-CPU matches frozen whenever p2 started.
  if (decisionOwner(game.state()) === CPU) {
    setTimeout(() => {
      if (!game || screen !== "match" || decisionOwner(game.state()) !== CPU) return;
      advanceCpu();
      render();
    }, 120);
  }
}

function restartMatch() { startMatch(lastMatchup.p1, lastMatchup.p2, { mode: activeMode }); }
function showSetup() { if (!profile) { screen = "starter"; renderStarter(); return; } activeMode = "exhibition"; screen = "setup"; message = ""; renderSetup(); }
function showLadder() { if (!profile) { screen = "starter"; renderStarter(); return; } screen = "ladder"; message = ""; setChrome(); renderLadder(); }
function showChampionship() { if (!profile) { screen = "starter"; renderStarter(); return; } screen = "championship"; message = ""; setChrome(); renderChampionship(); }
function showCollection() { screen = "collection"; message = ""; setChrome(); renderCollection(); }
function entranceFor(starId) { return decks[starId]?.slice(0, 5).find(card => card.kind === "entrance"); }
function showBoosters() { screen = "boosters"; message = ""; setChrome(); renderBoosters(); }
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
    setTimeout(() => { if (screen !== "boosters") return; packStage = "reveal"; message = "Tap each glowing card to reveal it."; renderBoosters(); }, 900);
  } catch (error) { message = error.message; renderBoosters(); }
}

function finalizePackReveal() {
  if (!lastPack?.length || packFinalized || revealedPackCards.size !== lastPack.length) return;
  packFinalized = true; pendingUpgrades = findPackUpgrades(profile, lastPack);
  if (profile.deckAssistance === "auto") { for (const upgrade of pendingUpgrades) applyUpgrade(profile, upgrade); message = pendingUpgrades.length ? `${pendingUpgrades.length} safe deck upgrade${pendingUpgrades.length===1?"":"s"} applied automatically.` : "Pack complete. No safe deck upgrades found."; pendingUpgrades = []; }
  else if (profile.deckAssistance === "manual") { pendingUpgrades = []; message = "Pack complete. Cards added to your collection; decks were not changed."; }
  else message = pendingUpgrades.length ? `Pack complete — ${pendingUpgrades.length} safe deck upgrade${pendingUpgrades.length===1?"":"s"} available.` : "Pack complete. No safe deck upgrades found.";
  saveProfile(profile); renderBoosters();
}
function revealPackCard(index) {
  if (packStage !== "reveal" || !lastPack?.[index] || revealedPackCards.has(index)) return;
  revealedPackCards.add(index);
  boosterFocusIndex = index;
  renderBoosters();
  if (lastPack[index]?.superstarUnlocked) { saveProfile(profile); setTimeout(()=>beginUnlockCelebration(), 450); return; }
  if (revealedPackCards.size === lastPack.length) setTimeout(finalizePackReveal, 350);
}
function nextBoosterCard() {
  if (!lastPack?.length || !revealedPackCards.has(boosterFocusIndex)) return;
  if (boosterFocusIndex < lastPack.length - 1) {
    boosterFocusIndex += 1;
    renderBoosters();
  }
}
function previousBoosterCard() {
  if (!lastPack?.length || boosterFocusIndex <= 0) return;
  boosterFocusIndex -= 1;
  renderBoosters();
}
function acceptUpgrade(index) { const upgrade=pendingUpgrades[index]; if(!upgrade)return; applyUpgrade(profile,upgrade); pendingUpgrades.splice(index,1); saveProfile(profile); message="Deck upgrade applied."; renderBoosters(); }
function declineUpgrade(index) { pendingUpgrades.splice(index,1); message="Upgrade skipped. The card remains in your collection."; renderBoosters(); }

function renderBoosters() {
  const root=$("#game"), pulls=lastPack??[], revealComplete=pulls.length>0&&revealedPackCards.size===pulls.length;
  const setInfo=setCollections[activeBoosterSetId]??setCollection, isSummer=activeBoosterSetId==="summerslam-series-1", isEvolution=activeBoosterSetId==="evolution-series-1";
  const logo=isSummer?"assets/art/summerslam-series-1/summerslam-2026-logo.webp":null;
  const standardCredits=boosterCreditsFor(profile,activeBoosterSetId);
  const ladder=ladderState(profile), road=championshipRoadState(profile);
  const ladderPacks=ladder.completionPackCreditsBySet?.[activeBoosterSetId]??0, championshipPacks=road.championshipPackCreditsBySet?.[activeBoosterSetId]??0;
  const packTitle=currentPackType==="ladder"?"CLIMB THE LADDER":currentPackType==="championship"?"CHAMPIONSHIP ROAD":setInfo.name.toUpperCase();
  const packSubtitle=currentPackType==="ladder"?"COMPLETION PACK · 1 FOIL · 1 VERY RARE+":currentPackType==="championship"?"CHAMPIONSHIP PACK · 1 FOIL · 1 RARE+":"SERIES 1 · 5 CARDS · 1 GUARANTEED FOIL";
  const brand=logo?`<img src="${logo}" alt="SummerSlam 2026">`:isEvolution?`<span class="pack-text-logo evolution-pack-logo"><small>WWE LEGACY</small><b>EVOLUTION</b><em>WOMEN OF WWE</em><small>SERIES 1</small></span>`:`<span class="pack-text-logo hall-pack-logo">WWE<br><b>HALL OF FAME</b><small>SERIES 1</small></span>`;
  const packSetClass=`pack-set-${activeBoosterSetId}`;
  const packCards=pulls.length&&packStage!=="opening"?pulls.map((p,index)=>{
    const revealed=revealedPackCards.has(index),owned=profile.ownedCards?.[p.card.id]??{normal:0,foil:0};
    if(!revealed) return `<button type="button" class="booster-flip-card is-facedown ${index===boosterFocusIndex?'is-current':''} rarity-${p.card.rarity} ${p.foil?'is-foil':''}" data-reveal-card="${index}" aria-label="Card ${index+1} of ${pulls.length}, tap to reveal"><span class="flip-card-face card-back ${packSetClass}">${brand}<b>${packTitle}</b><small>${packSubtitle}</small>${p.foil?'<i class="foil-sweep"></i>':''}</span></button>`;
    return `<div class="booster-flip-card is-revealed ${index===boosterFocusIndex?'is-current':''} rarity-${p.card.rarity} ${p.foil?'is-foil':''}">
      ${collectibleCardMarkup(p.card,{flipped:boosterRulesFlipped.has(index),foil:p.foil,extraClass:"booster-ccg",flipAttr:`data-booster-inspect="${index}"`})}
      <div class="booster-card-caption"><span>${boosterRulesFlipped.has(index)?'Tap to view artwork':'Tap to view effects'}</span><small>Owned ${owned.normal} normal · ${owned.foil} foil</small>${p.replacedNormal?'<b>FOIL REPLACED NORMAL</b>':''}${p.superstarUnlocked?'<b>SUPERSTAR UNLOCKED</b>':''}</div>
    </div>`;
  }).join(''):'';
  const mobileNav=pulls.length&&packStage!=="opening"?`<div class="booster-mobile-nav"><button id="previous-pack-card" class="nav-button" ${boosterFocusIndex<=0?'disabled':''}>Previous</button><span>Card ${boosterFocusIndex+1} of ${pulls.length}</span><button id="next-pack-card" class="primary" ${!revealedPackCards.has(boosterFocusIndex)||boosterFocusIndex>=pulls.length-1?'disabled':''}>Next Card</button></div>`:'';
  const packArea=packStage==="opening"?`<section class="pack-opening-stage"><div class="booster-pack is-opening ${packSetClass}"><div class="pack-tear"></div>${brand}<span>${packTitle}</span><b>SERIES 1</b><small>${packSubtitle}</small></div></section>`:pulls.length?`<section class="booster-reveal-grid">${packCards}</section>${mobileNav}<p class="reveal-progress">${revealedPackCards.size}/${pulls.length} cards revealed${revealComplete?' · Pack complete':' · Tap the current card to flip, then use Next Card'}</p>`:`<section class="pack-opening-stage"><button id="pack-wrapper" class="booster-pack ready ${packSetClass}" ${standardCredits<1?'disabled':''}>${brand}<span>${packTitle}</span><b>SERIES 1</b><small>${packSubtitle}</small><em>Tap to open</em></button></section>`;
  const tabs=Object.values(setCollections).map(set=>`<button class="nav-button ${set.id===activeBoosterSetId?'active':''}" data-booster-set="${set.id}" ${packStage==='opening'||(pulls.length&&!revealComplete)?'disabled':''}>${set.displayName} (${boosterCreditsFor(profile,set.id)})</button>`).join('');
  const setStarIds=cardsForSet(activeBoosterSetId).filter(c=>c.kind==='superstar').map(c=>c.superstarId), unlocked=setStarIds.filter(id=>hasSuperstar(profile,id)).length;
  document.body.dataset.set = activeBoosterSetId;
  root.innerHTML=`<section class="collection-screen booster-screen premium-screen ${setVisualClass(activeBoosterSetId)}"><section class="collection-hero booster-feature feature-hero">${modePortraits(setHeroSuperstars(activeBoosterSetId),"feature-art")}<div class="feature-shade"></div><div class="feature-copy">${modeLogoMarkup("boosters",true)}<h2>${setInfo.displayName}</h2><p>Five cards per pack with <b>one guaranteed Foil</b>. Each set has its own pool and credits; compatible owned cards can still be mixed across sets in Deck Builder.</p><div class="mode-branch-tabs">${tabs}</div><div class="top-actions"><button id="booster-back" class="nav-button">Collection</button><button id="booster-play" class="nav-button">Exhibition</button><button id="booster-ladder" class="nav-button">Climb the Ladder</button><button id="booster-championship" class="nav-button">Championship Road</button><button id="booster-decks" class="nav-button">Deck Builder</button></div></div><div class="set-stats"><div class="set-stat"><b>${standardCredits}</b><span>${setInfo.name} packs</span></div><div class="set-stat"><b>${profile.packsOpenedBySet?.[activeBoosterSetId]??0}</b><span>Packs opened</span></div><div class="set-stat"><b>${unlocked}/${setInfo.superstarCount}</b><span>Set Superstars</span></div><div class="set-stat"><b>${profile.deckAssistance}</b><span>Deck assistance</span></div></div></section><section class="booster-controls"><div class="booster-button-row"><button id="open-pack" class="start-match" ${standardCredits<1||packStage==='opening'||(pulls.length&&!revealComplete)?'disabled':''}>${pulls.length&&revealComplete?'Open Another Booster':`Open ${setInfo.name} Booster (${standardCredits})`}</button><button id="open-ladder-pack" class="nav-button" ${ladderPacks<1||packStage==='opening'||(pulls.length&&!revealComplete)?'disabled':''}>Ladder Pack (${ladderPacks})</button><button id="open-championship-pack" class="nav-button" ${championshipPacks<1||packStage==='opening'||(pulls.length&&!revealComplete)?'disabled':''}>Championship Pack (${championshipPacks})</button></div><label>Deck Assistance <select id="deck-assistance"><option value="ask" ${profile.deckAssistance==='ask'?'selected':''}>Ask me</option><option value="auto" ${profile.deckAssistance==='auto'?'selected':''}>Auto-upgrade</option><option value="manual" ${profile.deckAssistance==='manual'?'selected':''}>Manual</option></select></label></section>${message?`<p class="setup-message">${message}</p>`:''}${packArea}${pendingUpgrades.length&&revealComplete?`<section class="upgrade-panel"><div class="section-title"><h3>Deck upgrades found</h3><span>Safe suggestions only</span></div>${pendingUpgrades.map((u,i)=>`<article class="upgrade-row"><div><b>${superstarById[u.superstarId]?.name}: ${u.reason}</b><span>${u.pull.foil?'Foil ':''}${u.pull.card.name}</span></div><div><button data-accept-upgrade="${i}" class="primary">Add now</button><button data-decline-upgrade="${i}" class="secondary">Not now</button></div></article>`).join('')}</section>`:''}</section>`;
  root.querySelectorAll('[data-booster-set]').forEach(btn=>btn.addEventListener('click',()=>{activeBoosterSetId=btn.dataset.boosterSet;lastPack=null;revealedPackCards=new Set();boosterRulesFlipped=new Set();boosterFocusIndex=0;packStage='idle';message='';renderBoosters();}));
  $("#open-pack")?.addEventListener("click",()=>{if(pulls.length&&revealComplete){lastPack=null;revealedPackCards=new Set();boosterRulesFlipped=new Set();boosterFocusIndex=0;pendingUpgrades=[];packStage="idle";currentPackType="standard";message="";renderBoosters();}else processPack("standard");});
  $("#open-ladder-pack")?.addEventListener("click",()=>processPack("ladder")); $("#open-championship-pack")?.addEventListener("click",()=>processPack("championship")); $("#pack-wrapper")?.addEventListener("click",()=>processPack(currentPackType));
  $("#booster-back")?.addEventListener("click",showCollection); $("#booster-play")?.addEventListener("click",showSetup); $("#booster-ladder")?.addEventListener("click",showLadder); $("#booster-championship")?.addEventListener("click",showChampionship); $("#booster-decks")?.addEventListener("click",()=>showDeckBuilder(selection.p1));
  $("#deck-assistance")?.addEventListener("change",e=>{setDeckAssistance(profile,e.target.value);saveProfile(profile);message=`Deck Assistance set to ${e.target.options[e.target.selectedIndex].text}.`;renderBoosters();});
  root.querySelectorAll('[data-reveal-card]').forEach(btn=>btn.addEventListener('click',()=>revealPackCard(Number(btn.dataset.revealCard)))); root.querySelectorAll('[data-booster-inspect]').forEach(btn=>btn.addEventListener('click',()=>{const i=Number(btn.dataset.boosterInspect);if(boosterRulesFlipped.has(i))boosterRulesFlipped.delete(i);else boosterRulesFlipped.add(i);renderBoosters();})); $("#next-pack-card")?.addEventListener("click", nextBoosterCard); $("#previous-pack-card")?.addEventListener("click", previousBoosterCard); root.querySelectorAll('[data-accept-upgrade]').forEach(btn=>btn.addEventListener('click',()=>acceptUpgrade(Number(btn.dataset.acceptUpgrade)))); root.querySelectorAll('[data-decline-upgrade]').forEach(btn=>btn.addEventListener('click',()=>declineUpgrade(Number(btn.dataset.declineUpgrade))));
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
    const setName = reward.kind === "full-deck-superstar" ? "" : (sets[reward.setId]?.name ?? reward.setId);
    const rewardTitle = reward.kind === "full-deck-superstar" ? `THE ROCK · FULL DECK SUPERSTAR` : `${reward.amount}× ${setName} Booster${reward.amount === 1 ? '' : 's'}`;
    const rewardSub = reward.kind === "full-deck-superstar" ? `SEASON 1 COMPLETION EXCLUSIVE · The Final Boss` : `${tier * XP_PER_TIER} XP milestone`;
    return `<article class="season-tier ${reached ? 'reached' : ''} ${claimed ? 'claimed' : ''} ${current ? 'current' : ''} ${reward.kind === 'full-deck-superstar' ? 'season-final-reward' : ''}">
      <div class="season-tier-number"><span>TIER</span><b>${tier}</b></div>
      <div class="season-tier-reward"><strong>${rewardTitle}</strong><small>${rewardSub}</small></div>
      ${claimed ? '<button disabled>Claimed</button>' : reached ? `<button class="primary" data-claim-season-tier="${tier}">Claim</button>` : '<button disabled>Locked</button>'}
    </article>`;
  }).join('');
  root.innerHTML = `<section class="seasons-screen premium-screen">
    <section class="feature-hero seasons-feature">${modePortraits(["rhea-ripley","roman-reigns","stone-cold-steve-austin"],"feature-art")}<div class="feature-shade"></div><div class="feature-copy">${modeLogoMarkup("seasons")}<h2>${SEASON_1.subtitle}</h2><p>110 days of launch content, event drops and progression leading into Survivor Series and Season 2.</p><div class="season-hero-actions"><button id="season-home" class="nav-button">Main Menu</button><button id="season-challenges" class="nav-button">Daily / Weekly</button><button id="season-boosters" class="nav-button">Boosters</button></div></div><div class="season-countdown-card"><span>SEASON ENDS · 28 NOV 2026</span><b data-season-countdown>${remaining.ended ? 'Season complete' : formatCountdown(remaining.ms)}</b><small>Season 2 · Survivor Series</small></div></section>
    ${message ? `<p class="setup-message">${message}</p>` : ''}
    <section class="season-progress-panel">
      <div class="season-tier-summary"><div><span>CURRENT TIER</span><b>${progress.tier}/${SEASON_TIER_COUNT}</b></div><div><span>SEASON XP</span><b>${progress.xp}/${SEASON_TIER_COUNT * XP_PER_TIER}</b></div><div><span>NEXT DROP</span><b>${next.title}</b><small data-next-drop-countdown></small></div></div>
      <div class="season-xp-track"><i style="width:${Math.min(100,(progress.xp/(SEASON_TIER_COUNT*XP_PER_TIER))*100)}%"></i></div>
      <div class="season-xp-caption"><span>${progress.tier >= SEASON_TIER_COUNT ? 'Season Road complete' : `${progress.intoTier}/${XP_PER_TIER} XP toward Tier ${progress.tier + 1}`}</span><span>Win ${MATCH_XP.win} XP · Loss/Draw ${MATCH_XP.loss} XP · Daily 50 XP · Weekly 200 XP</span></div>
    </section>
    <section class="free-pack-panel ${free.available ? 'ready' : ''}">
      <div class="free-pack-icon"><span>24H</span><b>FREE</b></div><div class="free-pack-copy"><span>DAILY LOGIN BOOSTER</span><h3>${free.available ? 'Your free booster is ready' : 'Next free booster is counting down'}</h3><p>Claim one booster from a currently Featured Season 1 set every rolling 24 hours. Miss a day and nothing is lost — one pack simply waits for you.</p><small data-free-pack-countdown>${free.available ? 'FREE PACK READY' : formatCountdown(free.msRemaining)}</small></div><button id="claim-free-pack" class="start-match" ${free.available ? '' : 'disabled'}>${free.available ? 'Claim Free Booster' : `Next Free Booster · ${formatCountdown(free.msRemaining)}`}</button>
    </section>
    <section class="season-section"><div class="section-title"><h3>Season 1 Content Roadmap</h3><span>Launch → Worlds Collide → Money in the Bank → Survivor Series</span></div><div class="season-roadmap">${roadmap}</div><div class="season-rotation-note"><b>Season 2 Rotation Preview</b><span>Owned cards never disappear and remain playable.</span>${SEASON_1.rotationPreview.map(item=>`<small><strong>${sets[item.setId]?.displayName ?? item.setId}</strong> · ${item.from.toUpperCase()} → ${item.to.toUpperCase()} · ${item.note}</small>`).join('')}</div></section>
    <section class="season-section"><div class="section-title"><h3>50-Tier Season Road</h3><span>${claimable.length ? `${claimable.length} reward${claimable.length===1?'':'s'} ready` : 'Earn XP to unlock rewards'}</span></div>${claimable.length ? '<button id="claim-all-season" class="primary season-claim-all">Claim All Available</button>' : ''}<div class="season-tier-road">${tierRoad}</div></section>
  </section>`;
  $("#season-home")?.addEventListener("click", showMainMenu);
  $("#season-challenges")?.addEventListener("click", showChallenges);
  $("#season-boosters")?.addEventListener("click", showBoosters);
  $("#claim-free-pack")?.addEventListener("click", () => {
    try { const reward = claimFreeSeasonBooster(profile, Math.random, new Date()); saveProfile(profile); message = `Free ${sets[reward.setId]?.displayName ?? reward.setId} booster claimed. It is waiting in Boosters.`; }
    catch (e) { message = e.message; }
    renderSeasons();
  });
  root.querySelectorAll('[data-claim-season-tier]').forEach(btn => btn.addEventListener('click', () => {
    try { const reward = claimSeasonTier(profile, Number(btn.dataset.claimSeasonTier)); saveProfile(profile); message = `Tier ${reward.tier} claimed: +${reward.amount} ${sets[reward.setId]?.name ?? reward.setId} booster${reward.amount===1?'':'s'}.`; }
    catch (e) { message = e.message; }
    renderSeasons();
  }));
  $("#claim-all-season")?.addEventListener("click", () => {
    try { const rewards = claimAllSeasonTiers(profile); saveProfile(profile); const total = rewards.reduce((n,r)=>n+r.amount,0); message = `${rewards.length} Season reward${rewards.length===1?'':'s'} claimed · ${total} boosters added.`; }
    catch (e) { message = e.message; }
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
  const challengeSetStats = setRows.map(({set,progress})=>`<div class="set-stat"><b>${boosterCreditsFor(profile,set.id)}</b><span>${set.name} packs</span></div><div class="set-stat"><b>${progress.percent??0}%</b><span>${set.name} collection</span></div>`).join('');
  root.innerHTML = `<section class="challenges-screen premium-screen"><section class="feature-hero challenges-feature">${modePortraits(["becky-lynch","kevin-owens"],"feature-art")}<div class="feature-shade"></div><div class="feature-copy">${modeLogoMarkup("challenges",true)}<h2>Challenges & Set Progress</h2><p>Complete rotating goals across Exhibition, Climb the Ladder, Championship Road and Booster Packs. Collection milestones are tracked separately for every set and reward boosters from that same set.</p><div class="top-actions"><button id="challenge-seasons" class="nav-button">Season Road</button><button id="challenge-play" class="nav-button">Exhibition</button><button id="challenge-ladder" class="nav-button">Climb the Ladder</button><button id="challenge-championship" class="nav-button">Championship Road</button><button id="challenge-boosters" class="nav-button">Boosters</button><button id="challenge-collection" class="nav-button">Collection</button><button id="challenge-decks" class="nav-button">Deck Builder</button></div></div><div class="set-stats">${challengeSetStats}</div></section>${message ? `<p class="setup-message">${message}</p>` : ''}<section class="challenge-section"><div class="section-title"><h3>Daily Challenges</h3><span>3 rotating goals</span></div><div class="challenge-grid">${challenges.daily.map(c=>challengeCard(c,'DAILY')).join('')}</div></section><section class="challenge-section"><div class="section-title"><h3>Weekly Challenges</h3><span>3 larger goals</span></div><div class="challenge-grid">${challenges.weekly.map(c=>challengeCard(c,'WEEKLY')).join('')}</div></section>${milestoneSections}<section class="set-lifecycle-card"><span>SET ROTATION FRAMEWORK</span><h3>Featured → Vaulted → Returning</h3><p>Each collection has an independent lifecycle. Vaulting one set removes it from standard boosters without affecting ownership or cross-set deck building; it can later return through event or Legacy packs.</p></section></section>`;
  root.querySelectorAll('[data-claim-challenge]').forEach(btn=>btn.addEventListener('click',()=>{ try { const reward=claimChallenge(profile,btn.dataset.claimChallenge); saveProfile(profile); message=`Challenge claimed: +${reward} SummerSlam booster${reward===1?'':'s'} and Season XP.`; } catch(e){ message=e.message; } renderChallenges(); }));
  root.querySelectorAll('[data-claim-milestone]').forEach(btn=>btn.addEventListener('click',()=>{ try { const [setId,type,pct]=btn.dataset.claimMilestone.split(':'); const reward=claimMilestone(profile,type,Number(pct),setId); saveProfile(profile); message=`${setCollections[setId]?.name??setId} ${type==='foil'?'Foil':'Collection'} milestone claimed: +${reward} booster${reward===1?'':'s'}.`; } catch(e){ message=e.message; } renderChallenges(); }));
  $("#challenge-seasons")?.addEventListener("click", showSeasons); $("#challenge-play")?.addEventListener("click", showSetup); $("#challenge-ladder")?.addEventListener("click", showLadder); $("#challenge-championship")?.addEventListener("click", showChampionship); $("#challenge-boosters")?.addEventListener("click", showBoosters); $("#challenge-collection")?.addEventListener("click", showCollection); $("#challenge-decks")?.addEventListener("click", () => showDeckBuilder(selection.p1));
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
  const root = $("#game"), ladder = ladderState(profile), run = ladder.activeRun, active = run?.status === "active";
  if (active) ladderBranchId = run.branchId ?? "modern";
  const branch = LADDER_BRANCHES[ladderBranchId] ?? LADDER_BRANCHES.modern;
  const branchRoster = rosterForBranch(branch);
  const chosenId = active ? run.superstarId : (hasSuperstar(profile, selection.p1) ? selection.p1 : profile.starterId);
  selection.p1 = chosenId;
  const lives = active ? run.lives : LADDER_LIVES;
  const opponents = active ? run.opponents : branchRoster.map(s => s.id);
  const totalRungs = opponents.length;
  const ladderRows = opponents.map((id,index)=>{ const star=superstarById[id]; const state=active?(index<run.rung?'cleared':index===run.rung?'current':'upcoming'):'upcoming'; return `<div class="ladder-rung ${state}"><span>${index+1}</span><div class="ladder-portrait">${portraitMarkup(id,star.name)}</div><div><b>${star.name}${active&&id===run.superstarId?' · MIRROR':''}</b><small>${state==='cleared'?'Defeated':state==='current'?'Next opponent':branch.label}</small></div></div>`; }).join('');
  const tabs = Object.values(LADDER_BRANCHES).map(b=>`<button class="nav-button ${b.id===ladderBranchId?'active':''}" data-ladder-branch="${b.id}" ${active?'disabled':''}>${b.label}</button>`).join('');
  const statusText = run?.status==='failed'?'Run ended — all 3 lives were lost.':run?.status==='cleared'?`${branch.label} Ladder cleared! Your ${sets[run.setId]?.displayName} Completion Pack is waiting in Boosters.`:active?`Rung ${run.rung+1} of ${run.opponents.length} · ${superstarById[currentLadderOpponent(profile)]?.name}`:`Defeat every ${branch.label} opponent consecutively.`;
  root.innerHTML=`<section class="ladder-screen premium-screen"><section class="feature-hero ladder-feature">${modePortraits([chosenId,branch.finals?.[0] ?? rosterForBranch(branch)[0]?.id],"feature-art")}<div class="feature-shade"></div><div class="feature-copy">${modeLogoMarkup("ladder")}<p>Choose a path: Current Era, Golden Era, Attitude Era, the complete Hall of Fame run, or the eight-wrestler Evolution path. Any unlocked Superstar can enter any path, including mixed matchups. You have three lives; the third defeat ends the run.</p><div class="mode-branch-tabs">${tabs}</div><div class="top-actions"><button id="ladder-exhibition" class="nav-button">Exhibition</button><button id="ladder-championship" class="nav-button">Championship Road</button><button id="ladder-boosters" class="nav-button">Boosters</button><button id="ladder-collection" class="nav-button">Collection</button></div></div><div class="ladder-summary"><div><b>${ladder.clearsByBranch?.[branch.id]??0}</b><span>${branch.label} clears</span></div><div><b>${ladder.bestRungByBranch?.[branch.id]??0}/${totalRungs}</b><span>Best rung</span></div><div><b>${'●'.repeat(lives)}${'○'.repeat(LADDER_LIVES-lives)}</b><span>Lives</span></div><div><b>${ladder.completionPackCreditsBySet?.[branch.setId]??0}</b><span>${sets[branch.setId]?.name} packs</span></div></div></section><p class="setup-message">${message||statusText}</p>${!active?`<section class="ladder-picker"><h3>Choose any unlocked Superstar</h3><div class="roster-grid">${roster.map(star=>{const locked=!hasSuperstar(profile,star.id),selected=chosenId===star.id;return `<button class="roster-card ${selected?'selected':''} ${locked?'locked-star blocked':''}" data-ladder-star="${star.id}" ${locked?'disabled':''}><div class="roster-photo">${portraitMarkup(star.id,star.name)}</div><strong>${star.name}</strong><small>${locked?'LOCKED':sets[star.setId]?.displayName}</small></button>`}).join('')}</div><button id="start-ladder" class="start-match">Start ${totalRungs}-Match ${branch.label} Run</button></section>`:`<section class="ladder-current"><div><span>PATH</span><strong>${branch.label}</strong></div><div><span>YOUR SUPERSTAR</span><strong>${superstarById[run.superstarId].name}</strong></div><div><span>NEXT RUNG</span><strong>${run.rung+1}/${run.opponents.length} · ${superstarById[currentLadderOpponent(profile)].name}</strong></div><button id="continue-ladder" class="start-match">Fight Rung ${run.rung+1}</button></section>`}<section class="ladder-stack">${ladderRows}</section>${run&&run.status!=='active'?`<button id="new-ladder" class="start-match">Start Another Run</button>`:''}</section>`;
  root.querySelectorAll('[data-ladder-branch]').forEach(btn=>btn.addEventListener('click',()=>{ladderBranchId=btn.dataset.ladderBranch;message='';renderLadder();}));
  root.querySelectorAll('[data-ladder-star]').forEach(btn=>btn.addEventListener('click',()=>{selection.p1=btn.dataset.ladderStar;renderLadder();}));
  $("#start-ladder")?.addEventListener("click",beginLadderRun); $("#continue-ladder")?.addEventListener("click",startCurrentLadderMatch); $("#new-ladder")?.addEventListener("click",()=>{ladder.activeRun=null;saveProfile(profile);renderLadder();});
  $("#ladder-exhibition")?.addEventListener("click",showSetup); $("#ladder-championship")?.addEventListener("click",showChampionship); $("#ladder-boosters")?.addEventListener("click",showBoosters); $("#ladder-collection")?.addEventListener("click",showCollection);
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
  const root=$("#game"),road=championshipRoadState(profile),run=road.activeRun,active=run?.status==="active";
  if(active) championshipBranchId=run.branchId??"modern";
  const branch=CHAMPIONSHIP_BRANCHES[championshipBranchId]??CHAMPIONSHIP_BRANCHES.modern;
  const chosenId=active?run.superstarId:(hasSuperstar(profile,selection.p1)?selection.p1:profile.starterId);selection.p1=chosenId;
  const tabs=Object.values(CHAMPIONSHIP_BRANCHES).map(b=>`<button class="nav-button ${b.id===championshipBranchId?'active':''}" data-champ-branch="${b.id}" ${active?'disabled':''}>${b.label}</button>`).join('');
  const routeRows=active?run.opponents.map((id,index)=>{const star=superstarById[id],state=index<run.stage?'cleared':index===run.stage?'current':'upcoming';return `<div class="ladder-rung ${state}"><span>${index+1}</span><div class="ladder-portrait">${portraitMarkup(id,star.name)}</div><div><b>${CHAMPIONSHIP_STAGES[index]}</b><small>${star.name} · ${state==='cleared'?'Defeated':state==='current'?'Next match':'Waiting'}</small></div></div>`}).join(''):CHAMPIONSHIP_STAGES.map((stage,index)=>`<div class="ladder-rung upcoming"><span>${index+1}</span><div><b>${stage}</b><small>${index===3?`Final: ${branch.finals.map(id=>superstarById[id]?.name).join(' or ')}`:`Opponent from ${branch.label}`}</small></div></div>`).join('');
  const completed=road.completedByBranch?.[branch.id]?.length??0;
  const status=run?.status==='cleared'?`${branch.label} Championship Road cleared!`:active?`${CHAMPIONSHIP_STAGES[run.stage]} · ${superstarById[currentChampionshipOpponent(profile)]?.name}`:`Win four matches on the ${branch.label} road.`;
  root.innerHTML=`<section class="ladder-screen championship-screen premium-screen"><section class="feature-hero championship-feature">${modePortraits([chosenId,branch.finals?.[0]],"feature-art")}<div class="feature-shade"></div><div class="feature-copy">${modeLogoMarkup("championship")}<p>Choose Current Era, Golden Era, Attitude Era or Evolution. Each road is four matches, ending against one of that branch's headline opponents. Losses and draws replay the current stage rather than resetting the run.</p><div class="mode-branch-tabs">${tabs}</div><div class="top-actions"><button id="champ-exhibition" class="nav-button">Exhibition</button><button id="champ-ladder" class="nav-button">Climb the Ladder</button><button id="champ-boosters" class="nav-button">Boosters</button><button id="champ-collection" class="nav-button">Collection</button></div></div><div class="ladder-summary"><div><b>${road.clearsByBranch?.[branch.id]??0}</b><span>${branch.label} clears</span></div><div><b>${road.bestStageByBranch?.[branch.id]??0}/4</b><span>Best stage</span></div><div><b>${completed}/24</b><span>Superstar clears</span></div><div><b>${road.championshipPackCreditsBySet?.[branch.setId]??0}</b><span>${sets[branch.setId]?.name} packs</span></div></div></section><p class="setup-message">${message||status}</p>${!active?`<section class="ladder-picker"><h3>Choose any unlocked Superstar</h3><div class="roster-grid">${roster.map(star=>{const locked=!hasSuperstar(profile,star.id),selected=chosenId===star.id,crowned=road.completedByBranch?.[branch.id]?.includes(star.id);return `<button class="roster-card ${selected?'selected':''} ${locked?'locked-star blocked':''}" data-champ-star="${star.id}" ${locked?'disabled':''}><div class="roster-photo">${portraitMarkup(star.id,star.name)}</div><strong>${star.name}</strong><small>${locked?'LOCKED':crowned?'ROAD CLEARED':'READY'}</small></button>`}).join('')}</div><button id="start-championship" class="start-match">Start ${branch.label} Road</button></section>`:`<section class="ladder-current"><div><span>ROAD</span><strong>${branch.label}</strong></div><div><span>YOUR SUPERSTAR</span><strong>${superstarById[run.superstarId].name}</strong></div><div><span>NEXT MATCH</span><strong>${run.stage+1}/4 · ${CHAMPIONSHIP_STAGES[run.stage]} · ${superstarById[currentChampionshipOpponent(profile)].name}</strong></div><button id="continue-championship" class="start-match">Fight ${CHAMPIONSHIP_STAGES[run.stage]}</button></section>`}<section class="ladder-stack">${routeRows}</section>${run&&run.status!=='active'?`<button id="new-championship" class="start-match">Start Another Road</button>`:''}</section>`;
  root.querySelectorAll('[data-champ-branch]').forEach(btn=>btn.addEventListener('click',()=>{championshipBranchId=btn.dataset.champBranch;message='';renderChampionship();}));root.querySelectorAll('[data-champ-star]').forEach(btn=>btn.addEventListener('click',()=>{selection.p1=btn.dataset.champStar;renderChampionship();}));
  $("#start-championship")?.addEventListener("click",beginChampionshipRoad);$("#continue-championship")?.addEventListener("click",startCurrentChampionshipMatch);$("#new-championship")?.addEventListener("click",()=>{resetChampionshipRoad(profile);saveProfile(profile);renderChampionship();});$("#champ-exhibition")?.addEventListener("click",showSetup);$("#champ-ladder")?.addEventListener("click",showLadder);$("#champ-boosters")?.addEventListener("click",showBoosters);$("#champ-collection")?.addEventListener("click",showCollection);
}



function legacyLogoMarkup(compact = false) {
  return `<div class="legacy-logo ${compact ? "compact" : ""}" aria-label="WWE Legacy Collectible Card Game">
    <span class="legacy-wwe">WWE</span>
    <span class="legacy-word">LEGACY</span>
    <span class="legacy-subtitle">COLLECTIBLE CARD GAME</span>
  </div>`;
}

function modeLogoMarkup(mode, compact = false) {
  const modes = {
    exhibition: { kicker: "ONE NIGHT · ONE MATCH", top: "EXHIBITION", bottom: "SHOWCASE" },
    ladder: { kicker: "SURVIVE THE RUN", top: "CLIMB THE", bottom: "LADDER" },
    championship: { kicker: "FOUR FIGHTS · ONE TITLE", top: "CHAMPIONSHIP", bottom: "ROAD" },
    seasons: { kicker: "LIVE CONTENT · 110 DAYS", top: "LEGACY", bottom: "SEASONS" },
    challenges: { kicker: "DAILY · WEEKLY · MILESTONES", top: "LIVE", bottom: "CHALLENGES" },
    collection: { kicker: "510 CARDS · THREE SETS", top: "THE", bottom: "COLLECTION" },
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
  root.innerHTML = `<section class="splash-screen premium-splash">
    <div class="splash-glow"></div>${modePortraits(["cm-punk","roman-reigns"],"splash-roster-art")}
    <div class="splash-content">
      ${legacyLogoMarkup()}
      <p class="legacy-tagline">Build your collection. Take Control. Create your Legacy.</p>
      <div class="splash-profile">
        <span>${returning ? "LOCAL PROFILE" : "NEW PLAYER"}</span>
        <strong>${returning ? `Continue with ${starter?.name ?? "your Superstar"}` : "Begin your WWE Legacy"}</strong>
        <small>${returning ? `${profile.unlockedSuperstars.length}/24 Superstars unlocked · Save stored on this device` : "Choose one of the two World Champions as your first Superstar and starter deck."}</small>
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

function renderMainMenu() {
  setChrome();
  const root = $("#game");
  const starter = superstarById[profile.starterId];
  const ssCredits = boosterCreditsFor(profile, "summerslam-series-1");
  const hofCredits = boosterCreditsFor(profile, "hall-of-fame-series-1");
  const evoCredits = boosterCreditsFor(profile, "evolution-series-1");
  const seasonProgress = seasonLevelProgress(profile);
  const freeSeasonPack = freePackStatus(profile, new Date());
  const seasonRemaining = seasonTimeRemaining(new Date());
  root.innerHTML = `<section class="main-menu-screen premium-screen">
    <section class="premium-menu-hero">
      <div class="premium-menu-art">${portraitMarkup(starter.id,starter.name)}</div>
      <div class="premium-menu-copy">${legacyLogoMarkup(true)}<span class="premium-kicker">WELCOME BACK, ${starter.name.toUpperCase()}</span><h2>Create your Legacy.</h2><p>${profile.unlockedSuperstars.length}/24 Superstars unlocked · Season 1 Tier ${seasonProgress.tier}/${SEASON_TIER_COUNT}</p></div>
      <div class="premium-menu-season"><span>SEASON 1</span><b data-season-countdown>${formatCountdown(seasonRemaining.ms)}</b><small>until Survivor Series</small></div>
    </section>
    ${message ? `<p class="menu-message">${message}</p>` : ""}
    <div class="main-menu-grid premium-menu-grid">
      <button id="menu-play" class="main-menu-tile premium-menu-tile primary-tile tile-play"><span class="tile-bg-art">${portraitMarkup("roman-reigns","Roman Reigns")}</span><span class="tile-shade"></span><span class="tile-copy"><em>PLAY</em><strong>Enter the Ring</strong><small>Exhibition · Ladder · Championship</small></span></button>
      <button id="menu-seasons" class="main-menu-tile premium-menu-tile tile-seasons"><span class="tile-bg-art">${portraitMarkup("rhea-ripley","Rhea Ripley")}</span><span class="tile-shade"></span><span class="tile-copy"><em>SEASONS</em><strong>Tier ${seasonProgress.tier}/${SEASON_TIER_COUNT}</strong><small>${freeSeasonPack.available ? 'FREE BOOSTER READY' : 'Free pack in <b data-free-pack-countdown>'+formatCountdown(freeSeasonPack.msRemaining)+'</b>'}</small></span></button>
      <button id="menu-collection" class="main-menu-tile premium-menu-tile tile-collection"><span class="tile-bg-art">${portraitMarkup("stone-cold-steve-austin","Stone Cold Steve Austin")}</span><span class="tile-shade"></span><span class="tile-copy"><em>COLLECTION</em><strong>${profile.unlockedSuperstars.length}/24</strong><small>510 collectible cards</small></span></button>
      <button id="menu-boosters" class="main-menu-tile premium-menu-tile tile-boosters"><span class="tile-bg-art">${portraitMarkup("iyo-sky","IYO SKY")}</span><span class="tile-shade"></span><span class="tile-copy"><em>BOOSTERS</em><strong>${ssCredits + hofCredits + evoCredits} Packs</strong><small>Rip. Reveal. Collect.</small></span></button>
      <button id="menu-decks" class="main-menu-tile premium-menu-tile tile-decks"><span class="tile-bg-art">${portraitMarkup("cm-punk","CM Punk")}</span><span class="tile-shade"></span><span class="tile-copy"><em>DECKS</em><strong>Deck Lab</strong><small>Build, optimize and save</small></span></button>
      <button id="menu-challenges" class="main-menu-tile premium-menu-tile tile-challenges"><span class="tile-bg-art">${portraitMarkup("becky-lynch","Becky Lynch")}</span><span class="tile-shade"></span><span class="tile-copy"><em>CHALLENGES</em><strong>Daily & Weekly</strong><small>Earn packs + Season XP</small></span></button>
      <button id="menu-profile" class="main-menu-tile premium-menu-tile tile-profile"><span class="tile-bg-art">${portraitMarkup(starter.id,starter.name)}</span><span class="tile-shade"></span><span class="tile-copy"><em>PROFILE</em><strong>My Legacy</strong><small>Progress, stats and tools</small></span></button>
    </div>
  </section>`;
  $("#menu-play")?.addEventListener("click", showPlayMenu);
  $("#menu-seasons")?.addEventListener("click", showSeasons);
  $("#menu-collection")?.addEventListener("click", showCollection);
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
      <button id="play-exhibition" class="play-mode-card premium-mode-card exhibition-card">${modePortraits(["cody-rhodes","rhea-ripley"],"mode-art")}<div class="mode-card-shade"></div><div class="mode-card-copy">${modeLogoMarkup("exhibition",true)}<p>Pick any unlocked Superstar and any opponent for a single showcase match.</p><b>PLAY EXHIBITION →</b></div></button>
      <button id="play-ladder" class="play-mode-card premium-mode-card ladder-card">${modePortraits(["gunther","becky-lynch"],"mode-art")}<div class="mode-card-shade"></div><div class="mode-card-copy">${modeLogoMarkup("ladder",true)}<p>Three lives. Clear a full branch. Survive every rung.</p><b>START THE CLIMB →</b></div></button>
      <button id="play-championship" class="play-mode-card premium-mode-card championship-card">${modePortraits(["roman-reigns","charlotte-flair"],"mode-art")}<div class="mode-card-shade"></div><div class="mode-card-copy">${modeLogoMarkup("championship",true)}<p>Opening Bout to Championship Match across a four-fight road.</p><b>CHASE THE TITLE →</b></div></button>
    </div>
    <button id="play-home" class="nav-button menu-back-button">Back to Main Menu</button>
  </section>`;
  $("#play-exhibition")?.addEventListener("click", showSetup);
  $("#play-ladder")?.addEventListener("click", showLadder);
  $("#play-championship")?.addEventListener("click", showChampionship);
  $("#play-home")?.addEventListener("click", showMainMenu);
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
    <div class="profile-stat-grid premium-stats"><article><span>SUPERSTARS</span><b>${profile.unlockedSuperstars.length}/24</b></article><article><span>PACKS OPENED</span><b>${profile.packsOpened ?? 0}</b></article><article><span>LADDER CLEARS</span><b>${ladder.clears ?? 0}</b></article><article><span>CHAMPIONSHIP CLEARS</span><b>${championship.clears ?? 0}</b></article></div>
    <div class="profile-actions"><button id="profile-home" class="start-match">Main Menu</button><a class="nav-button profile-tool-link" href="./tools/card-art-studio.html">Card Art Studio</a><button id="profile-reset" class="nav-button danger">Reset Local Save</button></div>
  </section>`;
  $("#profile-home")?.addEventListener("click", showMainMenu);
  $("#profile-reset")?.addEventListener("click", () => { resetProfile(); profile = null; game = null; selection = { p1: "cm-punk", p2: "roman-reigns" }; message = ""; showSplash(); });
}

function chooseStarter(starId) {
  profile = createProfile(starId);
  saveProfile(profile);
  selection.p1 = starId;
  selection.p2 = starId === "roman-reigns" ? "cm-punk" : "roman-reigns";
  lastMatchup = { ...selection };
  screen = "menu";
  message = `${superstarById[starId].name} and their linked starter deck are now yours.`;
  renderMainMenu();
}

function renderStarter() {
  setChrome({ hideTopbar: true });
  const root = $("#game");
  const choices = STARTER_CHOICES.map(id => superstarById[id]).filter(Boolean);
  const titleFor = id => id === "cm-punk" ? "UNDISPUTED WWE CHAMPION" : "WORLD HEAVYWEIGHT CHAMPION";
  root.innerHTML = `<section class="starter-screen onboarding-screen">
    <div class="onboarding-brand">${legacyLogoMarkup(true)}</div>
    <div class="starter-hero"><span class="eyebrow">FIRST-TIME ONBOARDING</span><h2>Choose Your Champion</h2><p>Your first decision creates your local profile. Choose one World Champion and receive their Superstar card, linked five-card Lead Off package and complete 55-card starter deck.</p></div>
    <div class="starter-choice-grid champion-choice-grid">${choices.map(star => `<button class="starter-choice champion-starter" data-starter="${star.id}">
      <div class="starter-photo"><img src="${superstarArtwork[star.id]}" alt="${star.name}"></div>
      <span class="champion-tag">${titleFor(star.id)}</span>
      <strong>${star.name}</strong><small>${star.nickname}</small>
      <span>${star.hp} HP · ${star.archetype.replaceAll("-", " ")}</span>
      <em><b>${star.ability.name}</b> — ${star.ability.text}</em>
      <b class="choose-starter-cta">START WITH ${star.name.toUpperCase()}</b>
    </button>`).join("")}</div>
    <p class="starter-note">The champion you do not choose remains collectible and can be unlocked later. Your starter choice is permanent for this local save unless you reset the profile.</p>
  </section>`;
  root.querySelectorAll("[data-starter]").forEach(btn => btn.addEventListener("click", () => chooseStarter(btn.dataset.starter)));
}


function renderSetup() {
  setChrome();
  const root = $("#game");
  const rosterCard = (star, player) => {
    const selected = selection[player] === star.id;
    const duplicate = selection[player === HUMAN ? CPU : HUMAN] === star.id;
    const locked = player === HUMAN && !hasSuperstar(profile, star.id);
    const blocked = duplicate || locked;
    return `<button class="roster-card ${selected ? "selected" : ""} ${blocked ? "blocked" : ""} ${locked ? "locked-star" : ""}" data-select-player="${player}" data-star="${star.id}" ${blocked ? "disabled" : ""}>
      <span class="player-label">${locked ? "LOCKED" : selected ? "SELECTED" : star.archetype.replaceAll("-", " ").toUpperCase()}</span>
      <div class="roster-photo">${portraitMarkup(star.id, star.name)}</div>
      <strong>${star.name}</strong><small>${star.nickname}</small><span class="roster-hp">${star.hp} HP</span>
      <span class="roster-entrance"><b>Entrance:</b> ${entranceFor(star.id)?.name ?? "—"}</span>
      <span class="roster-ability"><b>Ability:</b> ${star.ability?.name ?? "—"}</span><span class="roster-set">${sets[star.setId]?.displayName ?? "Unassigned Set"}</span>
    </button>`;
  };
  const p1 = superstarById[selection.p1], p2 = superstarById[selection.p2];
  root.innerHTML = `<section class="setup-screen premium-screen exhibition-screen">
    <section class="feature-hero exhibition-feature">${modePortraits([selection.p1,selection.p2],"feature-art")}<div class="feature-shade"></div><div class="feature-copy">${modeLogoMarkup("exhibition")}<p>Choose any unlocked Superstar and any CPU opponent. All 24 Superstars share one match engine.</p><small>${profile.unlockedSuperstars.length}/24 unlocked · Starter: ${superstarById[profile.starterId].name}</small></div></section>
    <section class="selector-panel"><div class="selector-title"><span>YOU · PLAYER 1</span><strong>${p1.name}</strong></div><div class="roster-grid">${roster.map(s => rosterCard(s, HUMAN)).join("")}</div></section>
    <div class="versus-strip"><span>${p1.name}</span><b>VS</b><span>${p2.name}</span></div>
    <section class="selector-panel"><div class="selector-title"><span>CPU OPPONENT</span><strong>${p2.name}</strong></div><div class="roster-grid">${roster.map(s => rosterCard(s, CPU)).join("")}</div></section>
    ${message ? `<p class="setup-message">${message}</p>` : ""}<div class="setup-actions exhibition-actions"><button id="start-match" class="start-match">Start Exhibition</button><button id="setup-play-menu" class="nav-button">Back to Play</button><button id="setup-main-menu" class="nav-button">Main Menu</button></div>
  </section>`;
  root.querySelectorAll("[data-select-player]").forEach(btn => btn.addEventListener("click", () => {
    const player = btn.dataset.selectPlayer, other = player === HUMAN ? CPU : HUMAN;
    if (selection[other] === btn.dataset.star) return;
    selection[player] = btn.dataset.star; message = ""; renderSetup();
  }));
  $("#start-match")?.addEventListener("click", () => startMatch());
  $("#setup-play-menu")?.addEventListener("click", showPlayMenu);
  $("#setup-main-menu")?.addEventListener("click", showMainMenu);
}

function rarityStars(level) { return "★".repeat(level) + "☆".repeat(4 - level); }

function cardRulesText(card) {
  if (card.kind === "superstar") return `${card.abilityName ?? card.ability?.name ?? "Superstar Ability"}: ${card.abilityText ?? card.ability?.text ?? ""}`.trim();
  if (card.kind === "momentum") return `Gain ${card.amount ?? 1} permanent ${(card.method ?? "Momentum")[0].toUpperCase() + (card.method ?? "momentum").slice(1)} Momentum. Momentum is not spent when a Move is played.`;
  if (["entrance", "special", "action", "support", "manager"].includes(card.kind)) return card.abilityText ?? card.effectText ?? card.kind;
  return collectionText(card);
}

function cardFrontBottom(card) {
  if (card.kind === "move") return `<span><small>COST</small><b>${card.cost ?? 0}</b></span><span><small>DAMAGE</small><b>${card.damage ?? 0}</b></span>`;
  if (card.kind === "superstar") return `<span><small>HP</small><b>${card.hp ?? superstarById[card.superstarId]?.hp ?? "—"}</b></span><span><small>RARITY</small><b>${rarityStars(card.rarity ?? 4)}</b></span>`;
  if (card.kind === "momentum") return `<span><small>METHOD</small><b>${(card.method ?? "MO").slice(0,2).toUpperCase()}</b></span><span><small>GAIN</small><b>+${card.amount ?? 1}</b></span>`;
  return `<span><small>TYPE</small><b>${card.kind.toUpperCase()}</b></span><span><small>RARITY</small><b>${rarityStars(card.rarity ?? 1)}</b></span>`;
}

function cardArtFace(card) {
  const art = artworkFor(card);
  const star = card.superstarId ? superstarById[card.superstarId] : null;
  const fallback = card.kind === "superstar" ? (star?.name ?? card.name) : card.name;
  return art
    ? `<img src="${art}" alt="${card.name}">`
    : `<span class="ccg-art-placeholder"><b>${fallback}</b><small>ARTWORK SLOT</small><em>${card.id}</em></span>`;
}

function collectibleCardMarkup(card, { flipped = false, foil = false, extraClass = "", footer = "", flipAttr = "" } = {}) {
  foil = foil || card.kind === "superstar" || card.kind === "entrance";
  const setClass = `set-${card.setId ?? "global"}`;
  const typeClass = `type-${card.kind}`;
  const finisherClass = card.finisher ? "is-finisher" : card.trademark ? "is-trademark" : card.signature ? "is-signature" : "";
  const foilClass = foil ? "is-foil" : "";
  const ruleText = cardRulesText(card);
  const typeLabel = card.finisher ? "FINISHER" : card.trademark ? "TRADEMARK" : card.signature ? "SIGNATURE" : card.kind.toUpperCase();
  const subtitle = card.kind === "move"
    ? [card.method ? card.method.toUpperCase() : "", card.moveType ? (MOVE_TYPE_LABELS[card.moveType] ?? card.moveType).toUpperCase() : ""].filter(Boolean).join(" · ")
    : (card.subtitle ?? typeLabel);
  return `<button type="button" class="ccg-card ${flipped ? "is-flipped" : ""} ${setClass} ${typeClass} ${finisherClass} ${foilClass} ${extraClass}" ${flipAttr} aria-label="${card.name}. Tap to ${flipped ? "view artwork" : "view effects"}.">
    <span class="ccg-card-inner">
      <span class="ccg-card-face ccg-card-front">
        <span class="ccg-card-art">${cardArtFace(card)}</span>
        <span class="ccg-card-title"><small>${typeLabel}${foil ? " · FOIL" : ""}</small><strong>${card.name}</strong></span>
        <span class="ccg-card-stats">${cardFrontBottom(card)}</span>
      </span>
      <span class="ccg-card-face ccg-card-rules">
        <span class="ccg-rules-head"><small>${typeLabel}${foil ? " · FOIL" : ""}</small><strong>${card.name}</strong><em>${subtitle}</em></span>
        <span class="ccg-rules-body">${ruleText}</span>
        ${card.kind === "move" && card.requirements && Object.keys(card.requirements).length ? `<span class="ccg-rules-requirements"><b>REQUIRES</b> ${Object.entries(card.requirements).map(([m,n])=>`${n} ${m}`).join(" · ")}</span>` : ""}
        ${card.kind === "move" && card.counters?.length ? `<span class="ccg-rules-requirements"><b>COUNTERS</b> ${card.counters.map(t=>MOVE_TYPE_LABELS[t] ?? t).join(", ")}</span>` : ""}
        <span class="ccg-rules-foot"><span>${card.cardCode ?? card.setId ?? "WWE LEGACY"}</span><span>${rarityStars(card.rarity ?? 1)}</span></span>
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
  const root=$("#game"), setInfo=setCollections[activeCollectionSetId]??setCollection, setCards=cardsForSet(activeCollectionSetId);
  const kinds=["all","superstar","entrance","momentum","move","action","support","manager","special"],query=collectionFilter.search.trim().toLowerCase();
  const visible=setCards.filter(card=>{if(collectionFilter.kind!=="all"&&card.kind!==collectionFilter.kind)return false;if(collectionFilter.rarity!=="all"&&String(card.rarity)!==collectionFilter.rarity)return false;if(query&&!`${card.name} ${card.subtitle??""} ${card.kind} ${collectionText(card)}`.toLowerCase().includes(query))return false;return true;});
  const rarityCounts=[1,2,3,4].map(r=>setCards.filter(c=>c.rarity===r).length), starIds=setCards.filter(c=>c.kind==='superstar').map(c=>c.superstarId), unlocked=starIds.filter(id=>hasSuperstar(profile,id)).length;
  const tabs=Object.values(setCollections).map(set=>`<button class="nav-button ${set.id===activeCollectionSetId?'active':''}" data-collection-set="${set.id}">${set.displayName}</button>`).join('');
  const intro=activeCollectionSetId==='hall-of-fame-series-1'?'Eight Hall of Fame legends split between Golden Era and Attitude Era branches. Cards from this set enter the same global deck-building collection once owned.':activeCollectionSetId==='evolution-series-1'?'Eight women of WWE with a broad shared common-Move pool plus wrestler-locked Entrances, Signatures, Trademarks and Finishers. All eight can face every Superstar in WWE Legacy.':'The inaugural eight-Superstar modern release. SummerSlam cards remain compatible across the global collection.';
  document.body.dataset.set = activeCollectionSetId;
  root.innerHTML=`<section class="collection-screen premium-screen ${setVisualClass(activeCollectionSetId)}"><section class="feature-hero collection-feature">${modePortraits(setHeroSuperstars(activeCollectionSetId),"feature-art")}<div class="feature-shade"></div><div class="feature-copy">${modeLogoMarkup("collection",true)}<span class="set-feature-name">${setInfo.displayName}</span><p>${intro}</p><div class="mode-branch-tabs">${tabs}</div><div class="top-actions"><button id="collection-play" class="nav-button active">Play Match</button><button id="collection-ladder" class="nav-button">Climb the Ladder</button><button id="collection-championship" class="nav-button">Championship Road</button><button id="collection-decks" class="nav-button">Deck Builder</button><button id="collection-boosters" class="nav-button">Booster Packs (${boosterCreditsFor(profile,activeCollectionSetId)})</button></div></div><div class="set-stats"><div class="set-stat"><b>${unlocked}/${setInfo.superstarCount}</b><span>Set Superstars unlocked</span></div><div class="set-stat"><b>${setInfo.cardCount}</b><span>Set cards</span></div><div class="set-stat"><b>${rarityCounts[2]+rarityCounts[3]}</b><span>Rare +</span></div><div class="set-stat"><b>${collectionCards.length}</b><span>Total game cards</span></div></div></section><section class="collection-tools"><input id="collection-search" type="search" placeholder="Search cards, moves or abilities" value="${collectionFilter.search.replaceAll('"','&quot;')}"><select id="collection-kind">${kinds.map(k=>`<option value="${k}" ${collectionFilter.kind===k?'selected':''}>${k==='all'?'All card types':k[0].toUpperCase()+k.slice(1)}</option>`).join('')}</select><select id="collection-rarity"><option value="all">All rarities</option>${[1,2,3,4].map(r=>`<option value="${r}" ${collectionFilter.rarity===String(r)?'selected':''}>${rarityStars(r)} ${setInfo.rarityLabels[r]}</option>`).join('')}</select><span class="collection-count">Showing ${visible.length} / ${setCards.length}</span></section><section class="catalogue-grid collectible-catalogue">${visible.length?visible.map(card=>`<article class="catalogue-collectible ${card.kind==='superstar'&&!hasSuperstar(profile,card.superstarId)?'collection-locked':''}">${collectibleCardMarkup(card,{flipped:flippedCollectionCards.has(card.id),flipAttr:`data-flip-collection="${card.id}"`})}<div class="catalogue-under-card"><span>${card.cardCode}</span><b>${setInfo.rarityLabels[card.rarity]}</b><small>${card.kind==='superstar'||card.kind==='entrance'?`Owned ${ownedCount(profile,card.id,'foil')?'FOIL':'—'}`:`Owned ${ownedCount(profile,card.id,'normal')} · Foil ${ownedCount(profile,card.id,'foil')}`}</small></div></article>`).join(''):'<div class="collection-empty">No cards match these filters.</div>'}</section></section>`;
  root.querySelectorAll('[data-flip-collection]').forEach(btn=>btn.addEventListener('click',()=>{const id=btn.dataset.flipCollection;if(flippedCollectionCards.has(id))flippedCollectionCards.delete(id);else flippedCollectionCards.add(id);renderCollection();}));
  root.querySelectorAll('[data-collection-set]').forEach(btn=>btn.addEventListener('click',()=>{activeCollectionSetId=btn.dataset.collectionSet;collectionFilter={kind:'all',rarity:'all',search:''};flippedCollectionCards=new Set();renderCollection();}));
  $("#collection-play")?.addEventListener("click",showSetup); $("#collection-ladder")?.addEventListener("click",showLadder); $("#collection-boosters")?.addEventListener("click",()=>{activeBoosterSetId=activeCollectionSetId;showBoosters();}); $("#collection-championship")?.addEventListener("click",showChampionship); $("#collection-decks")?.addEventListener("click",()=>showDeckBuilder(selection.p1));
  $("#collection-search")?.addEventListener("input",e=>{collectionFilter.search=e.target.value;renderCollection();requestAnimationFrame(()=>$("#collection-search")?.focus());}); $("#collection-kind")?.addEventListener("change",e=>{collectionFilter.kind=e.target.value;renderCollection();}); $("#collection-rarity")?.addEventListener("change",e=>{collectionFilter.rarity=e.target.value;renderCollection();});
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
  const lead = deckDraft.slice(0, 5).map((entry, i) => ({ entry, card: playable[i] ?? collectionById.get(entry.id), slot: i + 1 }));
  const tailRows = aggregateDeck(deckDraft, { tailOnly: true });
  const query = deckBuilderFilter.trim().toLowerCase();
  const pool = eligibleOwnedCards(profile, deckBuilderStarId, deckDraft).filter(row => !query || `${row.card.name} ${row.card.kind} ${row.card.moveType ?? ""}`.toLowerCase().includes(query));
  const tailCount = Math.max(0, deckDraft.length - 5);
  const superstarCard = collectionById.get(star.cardId ?? `superstar-${star.id}`);
  const linkedLead = leadOffIds(star.id);
  const linkedEntrance = collectionById.get(star.entranceId);
  const stat = (label, value, target) => `<div><span>${label}</span><b>${value}${target ? ` / ${target}` : ""}</b></div>`;
  const problems = health.violations.length ? `<div class="deck-problems">${health.violations.map(v=>`<p>${v}</p>`).join("")}</div>` : `<p class="deck-healthy">Deck is legal and ready to play.</p>`;

  root.innerHTML = `<section class="deck-builder-screen">
    <section class="feature-hero deck-builder-hero">${modePortraits([deckBuilderStarId,"cm-punk"],"feature-art")}<div class="feature-shade"></div><div class="feature-copy">${modeLogoMarkup("decks",true)}<h2>${star.name} Deck</h2><p>Owned compatible cards from SummerSlam, Hall of Fame and Evolution can be mixed. Each Superstar card has its Entrance permanently attached for Pre-Match and a separate five-card playable Lead Off package. The five Lead Off pages cannot be replaced; only the remaining 50 deck slots are editable. Foil copies automatically take priority when you own them.</p><div class="top-actions"><button id="deck-play" class="nav-button">Exhibition</button><button id="deck-collection" class="nav-button">Collection</button><button id="deck-boosters" class="nav-button">Boosters</button><button id="deck-challenges" class="nav-button">Challenges</button><button id="deck-championship" class="nav-button">Championship Road</button></div></div><div class="set-stats"><div class="set-stat"><b>${health.score}</b><span>Deck health</span></div><div class="set-stat"><b>${deckDraft.length}/55</b><span>Total pages</span></div><div class="set-stat"><b>${tailCount}/50</b><span>Editable pages</span></div><div class="set-stat"><b>${profile.deckAssistance}</b><span>Assistance</span></div></div></section>
    ${message ? `<p class="setup-message">${message}</p>` : ""}
    <section class="deck-star-tabs">${profile.unlockedSuperstars.map(id=>`<button data-deck-star="${id}" class="${id===deckBuilderStarId?'active':''}">${superstarById[id].name}</button>`).join("")}</section>
    <section class="linked-package"><div class="section-title"><h3>Connected Superstar Package</h3><span>Locked identities · Foils may replace Normals</span></div><div class="superstar-package-card"><div class="catalogue-art">${artworkFor(superstarCard) ? `<img src="${artworkFor(superstarCard)}" alt="${star.name}">` : "Artwork pending"}</div><div><span>SUPERSTAR CARD</span><h3>${star.name}</h3><p>${star.ability.name}: ${star.ability.text}</p><small>Attached Entrance: ${linkedEntrance?.name ?? "Linked Entrance"} · Lead Off: ${linkedLead.length} playable cards</small></div></div><div class="lead-off-grid">${lead.map(({entry,card,slot})=>`<article><span>LEAD OFF ${slot} · LOCKED</span><b>${card?.name ?? entry.id}${entry.foil?' ✦':''}</b><small>${deckRole(card)}</small>${card?.kind==='entrance'?'<em>Unique Entrance · max 1 owned</em>':''}</article>`).join("")}</div></section>
    <section class="deck-health-panel"><div class="section-title"><h3>Deck Shape</h3><span>${health.healthy ? 'LEGAL' : 'NEEDS ATTENTION'}</span></div><div class="deck-health-stats">${stat('Momentum',health.counts.momentum,'14')}${stat('Low-cost Moves',health.counts.lowCostMoves,'10')}${stat('Mid-cost Moves',health.counts.midCostMoves,'9')}${stat('High-cost Moves',health.counts.highCostMoves,'3')}${stat('Reversals',health.counts.counters,'7')}${stat('Utility',health.counts.utility,'8')}${stat('Finishers',health.counts.finishers,'3')}</div>${problems}<div class="deck-builder-actions"><button id="optimize-deck" class="start-match">Optimize Deck</button><button id="reset-recommended" class="nav-button">Reset Recommended</button><button id="save-deck" class="nav-button active" ${health.healthy?'':'disabled'}>Save Deck</button></div></section>
    <section class="deck-builder-columns"><section class="deck-current"><div class="section-title"><h3>Editable 50</h3><span>${tailCount}/50</span></div>${tailRows.length ? tailRows.map(row=>`<article class="deck-row"><div><b>${row.card?.name ?? row.id}</b><span>${deckRole(row.card)} · ${row.normal} Normal${row.foil?` · ${row.foil} Foil`:''}</span></div><div><strong>x${row.indices.length}</strong><button data-remove-deck="${row.indices[row.indices.length-1]}" class="secondary">−1</button></div></article>`).join("") : '<p class="collection-empty">No editable cards in deck.</p>'}</section>
    <section class="deck-pool"><div class="section-title"><h3>Owned Cards</h3><span>Legal for ${star.name}</span></div><input id="deck-search" type="search" placeholder="Search owned cards" value="${deckBuilderFilter.replaceAll('"','&quot;')}"><div class="deck-pool-list">${pool.map(row=>{const available=Math.max(0,Math.min(row.cap,row.owned)-row.used);return `<article class="deck-row ${available?'':'exhausted'}"><div><b>${row.card.name}</b><span>${deckRole(row.card)} · Owned ${row.owned}${row.foilOwned?` (${row.foilOwned} Foil)`:''} · In deck ${row.used}/${row.cap}</span></div><button data-add-deck="${row.card.id}" class="primary" ${available && deckDraft.length<55?'':'disabled'}>+1</button></article>`}).join("")}</div></section></section>
  </section>`;

  root.querySelectorAll("[data-deck-star]").forEach(btn=>btn.addEventListener("click",()=>{ deckBuilderStarId=btn.dataset.deckStar; deckDraft=createDeckDraft(profile,deckBuilderStarId); message=""; renderDeckBuilder(); }));
  root.querySelectorAll("[data-remove-deck]").forEach(btn=>btn.addEventListener("click",()=>{ try { deckDraft=removeCardFromDraft(deckBuilderStarId,deckDraft,Number(btn.dataset.removeDeck)); message="Removed one editable copy. Add another owned card to return to 55."; } catch(e){message=e.message;} renderDeckBuilder(); }));
  root.querySelectorAll("[data-add-deck]").forEach(btn=>btn.addEventListener("click",()=>{ try { deckDraft=addCardToDraft(profile,deckBuilderStarId,deckDraft,btn.dataset.addDeck); message="Card added."; } catch(e){message=e.message;} renderDeckBuilder(); }));
  $("#deck-search")?.addEventListener("input",e=>{deckBuilderFilter=e.target.value;renderDeckBuilder();requestAnimationFrame(()=>$("#deck-search")?.focus());});
  $("#optimize-deck")?.addEventListener("click",()=>{ deckDraft=optimizeDeck(profile,deckBuilderStarId,deckDraft); message="Deck optimized using owned cards, Foils and the deck-flow guardrails."; renderDeckBuilder(); });
  $("#reset-recommended")?.addEventListener("click",()=>{ deckDraft=recommendedDeckDraft(profile,deckBuilderStarId); message="Recommended 55-card deck restored with your best owned Foil finishes."; renderDeckBuilder(); });
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
  if (state.phase === "COUNTER" && state.proposedMove?.defenderId === playerId) return canCounter(state.proposedMove.card, card);
  if (state.phase === "PIN_RESPONSE") return canPlayPinEscape(state, playerId, card);
  return false;
}

function cardReason(playerId, card) {
  const state = game.state();
  if (playerId === CPU) return "CPU controlled";
  if (state.phase === "MATCH_OVER") return "Match over";
  if (state.playerInControl !== playerId && state.phase === "ACTION") return "Not in Control";
  if (card.kind === "momentum") return state.players[playerId].turn.momentumPlayed >= state.players[playerId].turn.momentumPlayLimit ? "Momentum limit reached" : "";
  if (card.kind === "entrance") return "Entrance resolves automatically pre-match";
  if (card.kind === "action") return state.players[playerId].turn.actionPlayed >= 1 ? "Action already played this turn" : "";
  if (card.kind === "support") return state.players[playerId].turn.supportPlayed >= 1 ? "Support already played this turn" : "";
  if (card.kind === "manager") return state.players[playerId].activeManager ? "Manager already active" : "";
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
  const labels = { agility: "AG", knowledge: "KN", strength: "ST", strike: "SR", technical: "TE", attitude: "AT" };
  return Object.entries(player.momentum).map(([method, value]) => `<span class="hud-momentum ${method}" title="${method}"><b>${labels[method] ?? method.slice(0,2).toUpperCase()}</b><strong>${value}</strong></span>`).join("");
}

function abilityStatus(player) {
  const ability = player.superstar.ability;
  if (ability?.passive) return "PASSIVE";
  const max = ability?.maxUses ?? 1;
  if (max > 1) return `${player.abilityUses ?? 0}/${max}`;
  return player.abilityUsed ? "USED" : "READY";
}

function submissionHud(player) {
  const labels = { head: "H", arm: "A", back: "B", leg: "L" };
  const threshold = submissionThreshold(player);
  return Object.entries(player.submissionDamage).map(([part, value]) => {
    const pct = Math.max(0, Math.min(100, (value / threshold) * 100));
    return `<span class="hud-sub-limb ${pct >= 75 ? "danger" : pct >= 45 ? "warning" : ""}" title="${part} pressure ${value}/${threshold}"><b>${labels[part] ?? part[0].toUpperCase()}</b><i><em style="width:${pct}%"></em></i><strong>${value}</strong></span>`;
  }).join("");
}

function renderWrestlerHud(playerId) {
  const state = game.state(), p = state.players[playerId], cpu = playerId === CPU;
  const hpPercent = Math.max(0, Math.min(100, (p.hp / p.maxHp) * 100));
  const total = effectiveTotalMomentum(p);
  const supportText = p.activeSupports.length ? `${p.activeSupports.length} Support${p.activeSupports.length === 1 ? "" : "s"}` : "No Support";
  const managerText = p.activeManager ? p.activeManager.name : "No Manager";
  const statusText = `${p.location === "ring" ? "In Ring" : "Ringside"} · ${p.posture === "on-mat" ? "On Mat" : "Standing"}${p.status.stunnedTurns ? ` · Stunned ${p.status.stunnedTurns}` : ""}`;
  return `<article class="wrestler-hud ${cpu ? "cpu" : "human"} ${state.playerInControl === playerId && state.phase !== "MATCH_OVER" ? "in-control" : ""}">
    <div class="hud-main">
      <div class="hud-portrait">${portraitMarkup(p.superstar.id, p.superstar.name, "hud-photo")}</div>
      <div class="hud-identity">
        <span class="hud-side">${cpu ? "CPU" : "YOU"}${state.playerInControl === playerId && state.phase !== "MATCH_OVER" ? ' · <b>CONTROL</b>' : ""}</span>
        <strong>${p.superstar.name}</strong>
        <small>${p.superstar.nickname}</small>
        <div class="hud-hp-line"><b>${p.hp}</b><span>/ ${p.maxHp} HP</span></div>
      </div>
    </div>
    <div class="hud-hp-track"><span style="width:${hpPercent}%"></span></div>
    <div class="hud-status">${statusText}</div>
    <div class="hud-momentum-row">${renderMomentum(p)}<span class="hud-total"><b>TOTAL</b>${total}</span></div>
    <div class="hud-submission"><small>SUBMISSION · TAP ${submissionThreshold(p)}</small>${submissionHud(p)}</div>
    <div class="hud-footer"><span title="${p.superstar.ability.text}"><b>${p.superstar.ability.name}</b> · ${abilityStatus(p)}</span><span>${supportText} · ${managerText}</span></div>
  </article>`;
}

function renderMatchHud() {
  const state = game.state();
  return `<section class="match-hud-shell"><div class="match-mode-banner">${modeLogoMarkup(activeMode === "ladder" ? "ladder" : activeMode === "championship" ? "championship" : "exhibition",true)}<span>${state.players[HUMAN].superstar.name} <b>VS</b> ${state.players[CPU].superstar.name}</span></div>
    <div class="match-hud-grid">${renderWrestlerHud(CPU)}${renderWrestlerHud(HUMAN)}</div>
    <div class="ring-state-strip"><span>${state.countOut.count ? `COUNT ${state.countOut.count}/${state.countOut.limit}` : "MATCH"}</span><b>${state.players[CPU].location === "ring" && state.players[HUMAN].location === "ring" ? "IN THE RING" : "RINGSIDE"}</b><span>${state.players[CPU].posture === "on-mat" || state.players[HUMAN].posture === "on-mat" ? "GROUNDED" : "STANDING"} · T${state.turnNumber}</span></div>
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

function latestPlayPile() {
  const state = game.state();
  const significant = new Set(["MOVE_DECLARED","MOVE_COUNTERED","MOVE_CONNECTED","MOMENTUM_PLAYED","ACTION_PLAYED","SUPPORT_PLAYED","MANAGER_PLAYED","ENTRANCE_PREMATCH","PIN_ESCAPED_SPECIAL"]);
  for (const event of [...state.log].reverse()) {
    if (!significant.has(event.type)) continue;
    const found = playedCardFromEvent(event);
    if (found) return found;
  }
  return null;
}

function shortCardMeta(card) {
  if (card.kind === "momentum") return `${card.method?.toUpperCase() ?? "MOMENTUM"} +${card.amount ?? 1}`;
  if (card.kind === "move") {
    return [`COST ${card.cost ?? 0}`, `${card.damage ?? 0} DMG`, card.method?.toUpperCase(), MOVE_TYPE_LABELS[card.moveType]?.toUpperCase()].filter(Boolean).join(" · ");
  }
  return (card.abilityText ?? card.effectText ?? card.kind).replace(/^Support —\s*/i, "");
}

function handCardMeta(card) {
  if (card.kind === "momentum") return `${card.method?.toUpperCase() ?? "MOMENTUM"} +${card.amount ?? 1}`;
  if (card.kind === "move") return [`C${card.cost ?? 0}`, `${card.damage ?? 0} DMG`, card.method?.toUpperCase(), MOVE_TYPE_LABELS[card.moveType]?.toUpperCase()].filter(Boolean).join(" · ");
  return (card.abilityText ?? card.effectText ?? card.kind).replace(/^Support —\s*/i, "");
}

function renderPlayPile() {
  const state = game.state();
  const current = latestPlayPile();
  const proposed = state.proposedMove?.card ? { card: state.proposedMove.card, playerId: state.proposedMove.attackerId, event: { type: "MOVE_DECLARED" } } : null;
  const item = proposed ?? current;
  let body = `<div class="play-pile-empty"><span>◆</span><b>PLAY PILE</b><small>The next played page appears here.</small></div>`;
  if (item?.card) {
    const card = item.card;
    const playerName = item.playerId ? nameFor(item.playerId) : "Match";
    const actionLabel = item.event?.type === "MOVE_COUNTERED" ? "COUNTERED WITH" : item.event?.type === "MOVE_CONNECTED" ? "CONNECTED" : item.event?.type === "ENTRANCE_PREMATCH" ? "PRE-MATCH" : "PLAYED";
    const key = `${card.id}:${item.event?.type ?? "played"}:${item.playerId ?? "match"}`;
    if (key !== playPileCardKey) { playPileCardKey = key; playPileFlipped = false; }
    body = `<div class="play-pile-collectible"><div class="play-pile-context"><span>${playerName}</span><b>${actionLabel}</b></div>${collectibleCardMarkup(card,{flipped:playPileFlipped,extraClass:"play-pile-ccg",flipAttr:'data-flip-play-pile="1"'})}<small class="tap-card-hint">Tap card to ${playPileFlipped ? "return to artwork" : "view effects"}</small></div>`;
  }
  return `<section class="play-pile"><div class="play-pile-label"><span>PLAY PILE</span><small>Latest page played</small></div>${body}</section>`;
}

function renderHumanHand() {
  const state = game.state(), p = state.players[HUMAN];
  const active = decisionOwner(state) === HUMAN && state.phase !== "MATCH_OVER";
  const cards = p.hand.map((card, index) => {
    const legal = active && cardLegal(HUMAN, card);
    const reason = legal ? (state.phase === "COUNTER" ? "COUNTER" : state.phase === "PIN_RESPONSE" ? "ESCAPE" : "PLAY") : cardReason(HUMAN, card);
    const flipKey = `${index}:${card.id}`;
    const flipped = flippedHandCards.has(flipKey);
    return `<article class="hand-card-slot ${legal ? "is-playable" : "is-locked"}">
      ${collectibleCardMarkup(card,{flipped,extraClass:`hand-ccg ${legal ? "playable" : "locked"}`,flipAttr:`data-flip-hand="${flipKey}"`})}
      <div class="hand-card-action"><span>${reason || "Not playable now"}</span><button type="button" data-play-hand="${index}" class="${legal ? "primary" : "secondary"}" ${legal ? "" : "disabled"}>${state.phase === "COUNTER" ? "Counter" : state.phase === "PIN_RESPONSE" ? "Escape" : "Play"}</button></div>
    </article>`;
  }).join("");
  return `<section class="player-hand-panel">
    <div class="player-hand-head"><div><span>YOUR DECK</span><h3>${p.superstar.name}</h3></div><div class="deck-counts"><b>${p.hand.length}</b> hand · <b>${p.deck.length}</b> deck · <b>${p.discard.length}</b> discard</div></div>
    <p class="hand-instruction">Tap a card to flip it and read the effects. Use Play only when you want to commit the card.</p>
    <div class="hand collectible-hand">${cards}</div>
  </section>`;
}

function renderCommandBar() {
  const state = game.state(), owner = decisionOwner(state);
  let prompt = state.phase === "MATCH_OVER" ? (state.winner ? `${nameFor(state.winner)} wins by ${state.finish.type.toUpperCase()}!` : `Match ends by ${state.finish.type.toUpperCase()}!`) : owner === CPU ? `${nameFor(CPU)} is thinking…` : `Your turn — choose a page or action.`;
  if (state.phase === "COUNTER" && owner === HUMAN) prompt = `Counter ${state.proposedMove.card.name}, or pass.`;
  if (state.phase === "POST_MOVE" && owner === HUMAN) prompt = `Follow up after ${state.postMove.cardId}.`;
  if (state.phase === "PIN_RESPONSE" && owner === HUMAN) prompt = `You are being pinned — escape or pass to the pin check.`;
  if (state.phase === "SUBMISSION_MAINTAIN" && owner === HUMAN) prompt = `Maintain the submission or release it and keep Control.`;
  const pinCheck = state.phase === "POST_MOVE" && owner === HUMAN ? canAttemptPin(state, HUMAN) : null;
  return `<section class="match-command ${state.phase === "MATCH_OVER" ? "match-over" : ""}">
    <div class="command-status"><span>TURN ${state.turnNumber}</span><b>${state.phase.replaceAll("_", " ")}</b></div>
    <div class="command-prompt"><strong>${prompt}</strong><small>${message}</small></div>
    <div class="command-actions">
      ${owner === HUMAN && state.phase === "COUNTER" ? '<button id="pass-action" class="primary">Pass Counter</button>' : ""}
      ${owner === HUMAN && state.phase === "ACTION" && canReturnToRing(state, HUMAN) ? '<button id="return-ring" class="primary">Return to Ring</button>' : ""}
      ${owner === HUMAN && state.phase === "ACTION" ? '<button id="pass-action" class="secondary">Pass Control</button>' : ""}
      ${owner === HUMAN && state.phase === "POST_MOVE" && pinCheck?.legal ? `<button id="attempt-pin" class="primary">Attempt Pin${pinCheck.cost ? ` · ${pinCheck.cost} ATT` : ""}</button>` : ""}
      ${owner === HUMAN && state.phase === "POST_MOVE" && canFollowOutside(state, HUMAN) ? '<button id="follow-outside" class="primary">Follow Ringside</button>' : ""}
      ${owner === HUMAN && state.phase === "POST_MOVE" ? '<button id="end-post-move" class="secondary">End Offense</button>' : ""}
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
    CARDS_DRAWN: () => `${n(event.playerId)} drew ${event.cardIds.length} page${event.cardIds.length === 1 ? "" : "s"}.`, CONTROL_PASSED: () => `${n(event.from)} passed Control to ${n(event.to)}.`, CONTROL_RETAINED: () => `${n(event.playerId)} connected and keeps Control.`,
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

function render() {
  setChrome();
  if (screen === "setup" || !game) { renderSetup(); return; }
  handleCompletedMatch();
  const root = $("#game");
  root.innerHTML = `${renderMatchHud()}${renderPlayPile()}${renderCommandBar()}${renderSubmissionChooser()}${renderHumanHand()}${renderMatchLog()}`;
  root.querySelectorAll("[data-flip-hand]").forEach(btn => btn.addEventListener("click", () => { const key = btn.dataset.flipHand; if (flippedHandCards.has(key)) flippedHandCards.delete(key); else flippedHandCards.add(key); render(); }));
  root.querySelectorAll("[data-play-hand]").forEach(btn => btn.addEventListener("click", () => playCard(HUMAN, Number(btn.dataset.playHand))));
  root.querySelectorAll("[data-flip-play-pile]").forEach(btn => btn.addEventListener("click", () => { playPileFlipped = !playPileFlipped; render(); }));
  $("#pass-action")?.addEventListener("click", passAction); $("#attempt-pin")?.addEventListener("click", attemptPin); $("#end-post-move")?.addEventListener("click", endPostMove);
  $("#return-ring")?.addEventListener("click", returnToRing); $("#follow-outside")?.addEventListener("click", followOutside);
  $("#reset-match")?.addEventListener("click", restartMatch); $("#change-matchup")?.addEventListener("click", activeMode === "ladder" ? showLadder : activeMode === "championship" ? showChampionship : showSetup); $("#browse-main-menu")?.addEventListener("click", showMainMenu); $("#ladder-hub")?.addEventListener("click", showLadder); $("#championship-hub")?.addEventListener("click", showChampionship); $("#browse-collection")?.addEventListener("click", showCollection); $("#browse-boosters")?.addEventListener("click", showBoosters); $("#browse-challenges")?.addEventListener("click", showChallenges); $("#browse-decks")?.addEventListener("click", () => showDeckBuilder(selection.p1)); $("#release-submission")?.addEventListener("click", releaseSubmission);
  root.querySelectorAll("[data-ditch]").forEach(btn => btn.addEventListener("click", () => maintainSubmission(Number(btn.dataset.ditch))));
}

document.querySelector("#brand-home")?.addEventListener("click", () => profile ? showMainMenu() : showSplash());

document.querySelectorAll("[data-mobile-nav]").forEach(button => button.addEventListener("click", () => {
  const target = button.dataset.mobileNav;
  if (target === "menu") showMainMenu();
  else if (target === "play-menu") showPlayMenu();
  else if (target === "collection") showCollection();
  else if (target === "boosters") showBoosters();
  else if (target === "seasons") showSeasons();
}));

if (screen === "splash") renderSplash(); else if (screen === "starter") renderStarter(); else if (screen === "menu") renderMainMenu(); else if (screen === "play-menu") renderPlayMenu(); else if (screen === "profile") renderProfile(); else if (screen === "boosters") renderBoosters(); else if (screen === "ladder") renderLadder(); else if (screen === "championship") renderChampionship(); else if (screen === "challenges") renderChallenges(); else if (screen === "seasons") renderSeasons(); else if (screen === "deck-builder") renderDeckBuilder(); else renderSetup();

setInterval(refreshSeasonClocks, 1000);
