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
import { executeCpuDecision, decisionOwner } from "../ai/WrestlingAI.js";
import { LADDER_LIVES, LADDER_BRANCHES, ladderState, startLadderRun, currentLadderOpponent, recordLadderMatch } from "../data/ladder.js";
import { CHAMPIONSHIP_ROAD_LENGTH, CHAMPIONSHIP_STAGES, CHAMPIONSHIP_BRANCHES, championshipRoadState, startChampionshipRoad, currentChampionshipOpponent, recordChampionshipMatch, resetChampionshipRoad } from "../data/championship-road.js";
import { challengeState, claimChallenge, recordCompletedMatchChallenges } from "../data/challenges.js";
import { setProgressState, collectionProgress, availableMilestoneRewards, claimMilestone } from "../data/set-progression.js";
import { MOVE_TYPE_LABELS } from "../data/move-types.js";
import { createDeckDraft, recommendedDeckDraft, optimizeDeck, aggregateDeck, eligibleOwnedCards, addCardToDraft, removeCardFromDraft, validateDeckDraft, materializeDraft, leadOffIds } from "../data/deck-builder.js";

const HUMAN = "p1";
const CPU = "p2";
let game = null;
let message = "";
let profile = loadProfile();
let screen = profile ? "setup" : "starter";
let selection = { p1: profile?.starterId ?? "cm-punk", p2: profile?.starterId === "roman-reigns" ? "cm-punk" : "roman-reigns" };
let lastMatchup = { ...selection };
let collectionFilter = { kind: "all", rarity: "all", search: "" };
let lastPack = null;
let pendingUpgrades = [];
let packStage = "idle";
let revealedPackCards = new Set();
let packFinalized = false;
let matchRewarded = false;
let activeMode = "exhibition";
let currentPackType = "standard";
let deckBuilderStarId = profile?.starterId ?? "cm-punk";
let deckDraft = null;
let deckBuilderFilter = "";
let activeCollectionSetId = "summerslam-series-1";
let activeBoosterSetId = "summerslam-series-1";
let ladderBranchId = "modern";
let championshipBranchId = "modern";

const roster = Object.values(superstars);
const superstarById = Object.fromEntries(roster.map(star => [star.id, star]));
const collectionById = new Map(collectionCards.map(card => [card.id, card]));
const rosterForBranch = (branch) => roster.filter(star => star.setId === branch.setId && (!branch.era || star.era === branch.era));
const $ = selector => document.querySelector(selector);
const nameFor = id => id ? game.state().players[id]?.superstar.name ?? id : "No one";
const portraitMarkup = (id, name, cls = "") => superstarArtwork[id] ? `<img class="${cls}" src="${superstarArtwork[id]}" alt="${name}">` : `<span class="portrait-placeholder ${cls}"><b>${name}</b><small>Artwork pending</small></span>`;

function startMatch(p1Id = selection.p1, p2Id = selection.p2, { mode = "exhibition" } = {}) {
  if (!profile) { screen = "starter"; renderStarter(); return; }
  if (!superstarById[p1Id] || !superstarById[p2Id]) return;
  if (!hasSuperstar(profile, p1Id)) { message = "That Superstar is still locked. Earn their Superstar card to play as them."; mode === "ladder" ? renderLadder() : renderSetup(); return; }
  if (p1Id === p2Id && mode === "exhibition") { message = "Choose two different Superstars."; renderSetup(); return; }
  activeMode = mode;
  selection = { p1: p1Id, p2: p2Id };
  lastMatchup = { ...selection };
  const openingControl = Math.random() < 0.5 ? HUMAN : CPU;
  game = new MatchEngine({ superstarA: superstarById[p1Id], superstarB: superstarById[p2Id], deckA: buildPlayableDeck(profile, p1Id), deckB: decks[p2Id], startingControl: openingControl });
  const openingText = `${nameFor(openingControl)} starts in Control.`;
  message = mode === "ladder" ? `Climb the Ladder · ${nameFor(HUMAN)} faces ${nameFor(CPU)}. ${openingText}` : mode === "championship" ? `Championship Road · ${nameFor(HUMAN)} faces ${nameFor(CPU)}. ${openingText}` : `${openingText} You are Player 1; ${nameFor(CPU)} is CPU controlled.`;
  screen = "match";
  matchRewarded = false;
  render();
}

function restartMatch() { startMatch(lastMatchup.p1, lastMatchup.p2, { mode: activeMode }); }
function showSetup() { if (!profile) { screen = "starter"; renderStarter(); return; } activeMode = "exhibition"; screen = "setup"; message = ""; renderSetup(); }
function showLadder() { if (!profile) { screen = "starter"; renderStarter(); return; } screen = "ladder"; message = ""; renderLadder(); }
function showChampionship() { if (!profile) { screen = "starter"; renderStarter(); return; } screen = "championship"; message = ""; renderChampionship(); }
function showCollection() { screen = "collection"; message = ""; renderCollection(); }
function entranceFor(starId) { return decks[starId]?.slice(0, 5).find(card => card.kind === "entrance"); }
function showBoosters() { screen = "boosters"; message = ""; renderBoosters(); }
function showChallenges() { if (!profile) { screen = "starter"; renderStarter(); return; } screen = "challenges"; message = ""; renderChallenges(); }
function showDeckBuilder(starId = selection.p1) {
  if (!profile) { screen = "starter"; renderStarter(); return; }
  const unlocked = profile.unlockedSuperstars ?? [];
  deckBuilderStarId = unlocked.includes(starId) ? starId : (unlocked[0] ?? profile.starterId);
  deckDraft = createDeckDraft(profile, deckBuilderStarId);
  deckBuilderFilter = "";
  screen = "deck-builder";
  message = "";
  renderDeckBuilder();
}

function processPack(kind = "standard") {
  try {
    currentPackType = kind;
    lastPack = kind === "ladder" ? openLadderCompletionPack(profile, Math.random, activeBoosterSetId) : kind === "championship" ? openChampionshipPack(profile, Math.random, activeBoosterSetId) : openBooster(profile, Math.random, activeBoosterSetId);
    if (lastPack?.[0]?.card?.setId) activeBoosterSetId = lastPack[0].card.setId;
    pendingUpgrades = []; revealedPackCards = new Set(); packFinalized = false; packStage = "opening";
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
function revealPackCard(index) { if (packStage !== "reveal" || !lastPack?.[index] || revealedPackCards.has(index)) return; revealedPackCards.add(index); renderBoosters(); if (revealedPackCards.size === lastPack.length) setTimeout(finalizePackReveal, 350); }
function acceptUpgrade(index) { const upgrade=pendingUpgrades[index]; if(!upgrade)return; applyUpgrade(profile,upgrade); pendingUpgrades.splice(index,1); saveProfile(profile); message="Deck upgrade applied."; renderBoosters(); }
function declineUpgrade(index) { pendingUpgrades.splice(index,1); message="Upgrade skipped. The card remains in your collection."; renderBoosters(); }

function renderBoosters() {
  const root=$("#game"), pulls=lastPack??[], revealComplete=pulls.length>0&&revealedPackCards.size===pulls.length;
  const setInfo=setCollections[activeBoosterSetId]??setCollection, isSummer=activeBoosterSetId==="summerslam-series-1";
  const logo=isSummer?"assets/art/summerslam-series-1/summerslam-2026-logo.webp":null;
  const standardCredits=boosterCreditsFor(profile,activeBoosterSetId);
  const ladder=ladderState(profile), road=championshipRoadState(profile);
  const ladderPacks=ladder.completionPackCreditsBySet?.[activeBoosterSetId]??0, championshipPacks=road.championshipPackCreditsBySet?.[activeBoosterSetId]??0;
  const packTitle=currentPackType==="ladder"?"CLIMB THE LADDER":currentPackType==="championship"?"CHAMPIONSHIP ROAD":setInfo.name.toUpperCase();
  const packSubtitle=currentPackType==="ladder"?"COMPLETION PACK · 1 FOIL · 1 VERY RARE+":currentPackType==="championship"?"CHAMPIONSHIP PACK · 1 FOIL · 1 RARE+":"SERIES 1 · 5 CARDS · 1 GUARANTEED FOIL";
  const brand=logo?`<img src="${logo}" alt="SummerSlam 2026">`:`<span class="pack-text-logo">WWE<br><b>HALL OF FAME</b><small>SERIES 1</small></span>`;
  const packCards=pulls.length&&packStage!=="opening"?pulls.map((p,index)=>{const revealed=revealedPackCards.has(index),owned=profile.ownedCards?.[p.card.id]??{normal:0,foil:0};return `<button class="booster-flip-card ${revealed?'is-revealed':'is-facedown'} rarity-${p.card.rarity} ${p.foil?'is-foil':''}" data-reveal-card="${index}" ${revealed?'disabled':''}><span class="flip-card-inner"><span class="flip-card-face card-back">${brand}<b>${packTitle}</b><small>${packSubtitle}</small>${p.foil?'<i class="foil-sweep"></i>':''}</span><span class="flip-card-face card-front"><span class="catalogue-kind">${p.foil?'FOIL · ':''}${p.card.kind.toUpperCase()}</span><h3>${p.card.name}</h3><div class="catalogue-art">${artworkFor(p.card)?`<img src="${artworkFor(p.card)}" alt="${p.card.name}">`:(p.foil?'✦ Foil finish':'Artwork pending')}</div><p>${p.foil&&p.card.kind==='move'?'Foil bonus: +1 damage when this Move connects.':p.foil?'Foil collectible finish.':collectionText(p.card)}</p><div class="catalogue-meta"><span class="rarity-stars">${rarityStars(p.card.rarity)}</span><span>${p.card.cardCode??''}</span><span>Owned ${owned.normal} normal · ${owned.foil} foil</span>${p.replacedNormal?'<b>FOIL REPLACED NORMAL</b>':''}${p.superstarUnlocked?'<b>SUPERSTAR UNLOCKED</b>':''}</div></span></span></button>`}).join(''):'';
  const packArea=packStage==="opening"?`<section class="pack-opening-stage"><div class="booster-pack is-opening"><div class="pack-tear"></div>${brand}<span>${packTitle}</span><b>SERIES 1</b><small>${packSubtitle}</small></div></section>`:pulls.length?`<section class="booster-reveal-grid">${packCards}</section><p class="reveal-progress">${revealedPackCards.size}/${pulls.length} cards revealed${revealComplete?' · Pack complete':' · Tap a card to flip'}</p>`:`<section class="pack-opening-stage"><button id="pack-wrapper" class="booster-pack ready" ${standardCredits<1?'disabled':''}>${brand}<span>${packTitle}</span><b>SERIES 1</b><small>${packSubtitle}</small><em>Tap to open</em></button></section>`;
  const tabs=Object.values(setCollections).map(set=>`<button class="nav-button ${set.id===activeBoosterSetId?'active':''}" data-booster-set="${set.id}" ${packStage==='opening'||(pulls.length&&!revealComplete)?'disabled':''}>${set.displayName} (${boosterCreditsFor(profile,set.id)})</button>`).join('');
  const setStarIds=cardsForSet(activeBoosterSetId).filter(c=>c.kind==='superstar').map(c=>c.superstarId), unlocked=setStarIds.filter(id=>hasSuperstar(profile,id)).length;
  root.innerHTML=`<section class="collection-screen booster-screen"><section class="collection-hero"><div><span class="eyebrow">SET-SPECIFIC BOOSTERS</span><h2>${setInfo.displayName} Booster Packs</h2><p>Five cards per pack with <b>one guaranteed Foil</b>. Each set has its own pool and credits; compatible owned cards can still be mixed across sets in Deck Builder.</p><div class="mode-branch-tabs">${tabs}</div><div class="top-actions"><button id="booster-back" class="nav-button">Collection</button><button id="booster-play" class="nav-button">Exhibition</button><button id="booster-ladder" class="nav-button">Climb the Ladder</button><button id="booster-championship" class="nav-button">Championship Road</button><button id="booster-decks" class="nav-button">Deck Builder</button></div></div><div class="set-stats"><div class="set-stat"><b>${standardCredits}</b><span>${setInfo.name} packs</span></div><div class="set-stat"><b>${profile.packsOpenedBySet?.[activeBoosterSetId]??0}</b><span>Packs opened</span></div><div class="set-stat"><b>${unlocked}/${setInfo.superstarCount}</b><span>Set Superstars</span></div><div class="set-stat"><b>${profile.deckAssistance}</b><span>Deck assistance</span></div></div></section><section class="booster-controls"><div class="booster-button-row"><button id="open-pack" class="start-match" ${standardCredits<1||packStage==='opening'||(pulls.length&&!revealComplete)?'disabled':''}>${pulls.length&&revealComplete?'Open Another Booster':`Open ${setInfo.name} Booster (${standardCredits})`}</button><button id="open-ladder-pack" class="nav-button" ${ladderPacks<1||packStage==='opening'||(pulls.length&&!revealComplete)?'disabled':''}>Ladder Pack (${ladderPacks})</button><button id="open-championship-pack" class="nav-button" ${championshipPacks<1||packStage==='opening'||(pulls.length&&!revealComplete)?'disabled':''}>Championship Pack (${championshipPacks})</button></div><label>Deck Assistance <select id="deck-assistance"><option value="ask" ${profile.deckAssistance==='ask'?'selected':''}>Ask me</option><option value="auto" ${profile.deckAssistance==='auto'?'selected':''}>Auto-upgrade</option><option value="manual" ${profile.deckAssistance==='manual'?'selected':''}>Manual</option></select></label></section>${message?`<p class="setup-message">${message}</p>`:''}${packArea}${pendingUpgrades.length&&revealComplete?`<section class="upgrade-panel"><div class="section-title"><h3>Deck upgrades found</h3><span>Safe suggestions only</span></div>${pendingUpgrades.map((u,i)=>`<article class="upgrade-row"><div><b>${superstarById[u.superstarId]?.name}: ${u.reason}</b><span>${u.pull.foil?'Foil ':''}${u.pull.card.name}</span></div><div><button data-accept-upgrade="${i}" class="primary">Add now</button><button data-decline-upgrade="${i}" class="secondary">Not now</button></div></article>`).join('')}</section>`:''}</section>`;
  root.querySelectorAll('[data-booster-set]').forEach(btn=>btn.addEventListener('click',()=>{activeBoosterSetId=btn.dataset.boosterSet;lastPack=null;packStage='idle';message='';renderBoosters();}));
  $("#open-pack")?.addEventListener("click",()=>{if(pulls.length&&revealComplete){lastPack=null;revealedPackCards=new Set();pendingUpgrades=[];packStage="idle";currentPackType="standard";message="";renderBoosters();}else processPack("standard");});
  $("#open-ladder-pack")?.addEventListener("click",()=>processPack("ladder")); $("#open-championship-pack")?.addEventListener("click",()=>processPack("championship")); $("#pack-wrapper")?.addEventListener("click",()=>processPack(currentPackType));
  $("#booster-back")?.addEventListener("click",showCollection); $("#booster-play")?.addEventListener("click",showSetup); $("#booster-ladder")?.addEventListener("click",showLadder); $("#booster-championship")?.addEventListener("click",showChampionship); $("#booster-decks")?.addEventListener("click",()=>showDeckBuilder(selection.p1));
  $("#deck-assistance")?.addEventListener("change",e=>{setDeckAssistance(profile,e.target.value);saveProfile(profile);message=`Deck Assistance set to ${e.target.options[e.target.selectedIndex].text}.`;renderBoosters();});
  root.querySelectorAll('[data-reveal-card]').forEach(btn=>btn.addEventListener('click',()=>revealPackCard(Number(btn.dataset.revealCard)))); root.querySelectorAll('[data-accept-upgrade]').forEach(btn=>btn.addEventListener('click',()=>acceptUpgrade(Number(btn.dataset.acceptUpgrade)))); root.querySelectorAll('[data-decline-upgrade]').forEach(btn=>btn.addEventListener('click',()=>declineUpgrade(Number(btn.dataset.declineUpgrade))));
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
    return `<article class="challenge-card ${complete ? 'complete' : ''} ${c.claimed ? 'claimed' : ''}"><span>${group}</span><h3>${c.label}</h3><div class="challenge-progress"><i style="width:${Math.min(100, ((c.progress??0)/c.target)*100)}%"></i></div><p><b>${c.progress ?? 0}/${c.target}</b> · Reward: ${c.reward} SummerSlam booster${c.reward===1?'':'s'}</p>${c.claimed ? '<button disabled>Claimed</button>' : complete ? `<button class="primary" data-claim-challenge="${c.id}">Claim ${c.reward} Booster${c.reward===1?'':'s'}</button>` : '<button disabled>In progress</button>'}</article>`;
  };
  const milestone = (setId, setName, m, type) => `<article class="milestone-row"><div><b>${setName} · ${type === 'foil' ? 'Foil' : 'Collection'} ${m.percent}%</b><span>Reward: ${m.reward} ${setName} booster${m.reward===1?'':'s'}</span></div><button class="primary" data-claim-milestone="${setId}:${type}:${m.percent}">Claim</button></article>`;
  const milestoneSections = setRows.map(({set,progress,state,rewards}) => `<section class="challenge-section"><div class="section-title"><h3>${set.displayName} Milestones</h3><span>${progress.ownedUnique}/${progress.total} unique · ${progress.foilUnique}/${progress.total} Foil · ${state.lifecycle.toUpperCase()}</span></div><div class="milestone-grid">${[...rewards.collection.map(m=>milestone(set.id,set.name,m,'collection')),...rewards.foil.map(m=>milestone(set.id,set.name,m,'foil'))].join('') || '<p class="collection-empty">Your next collection rewards are still in progress.</p>'}</div></section>`).join('');
  const summerProgress = setRows.find(x=>x.set.id==='summerslam-series-1')?.progress;
  const hallProgress = setRows.find(x=>x.set.id==='hall-of-fame-series-1')?.progress;
  root.innerHTML = `<section class="challenges-screen"><section class="collection-hero"><div><span class="eyebrow">LIVE PROGRESSION · TWO COLLECTION SETS</span><h2>Challenges & Set Progress</h2><p>Complete rotating goals across Exhibition, Climb the Ladder, Championship Road and Booster Packs. Collection milestones are tracked separately for every set and reward boosters from that same set.</p><div class="top-actions"><button id="challenge-play" class="nav-button">Exhibition</button><button id="challenge-ladder" class="nav-button">Climb the Ladder</button><button id="challenge-championship" class="nav-button">Championship Road</button><button id="challenge-boosters" class="nav-button">Boosters</button><button id="challenge-collection" class="nav-button">Collection</button><button id="challenge-decks" class="nav-button">Deck Builder</button></div></div><div class="set-stats"><div class="set-stat"><b>${boosterCreditsFor(profile,'summerslam-series-1')}</b><span>SummerSlam packs</span></div><div class="set-stat"><b>${boosterCreditsFor(profile,'hall-of-fame-series-1')}</b><span>Hall of Fame packs</span></div><div class="set-stat"><b>${summerProgress?.percent??0}%</b><span>SummerSlam collection</span></div><div class="set-stat"><b>${hallProgress?.percent??0}%</b><span>Hall of Fame collection</span></div></div></section>${message ? `<p class="setup-message">${message}</p>` : ''}<section class="challenge-section"><div class="section-title"><h3>Daily Challenges</h3><span>3 rotating goals</span></div><div class="challenge-grid">${challenges.daily.map(c=>challengeCard(c,'DAILY')).join('')}</div></section><section class="challenge-section"><div class="section-title"><h3>Weekly Challenges</h3><span>3 larger goals</span></div><div class="challenge-grid">${challenges.weekly.map(c=>challengeCard(c,'WEEKLY')).join('')}</div></section>${milestoneSections}<section class="set-lifecycle-card"><span>SET ROTATION FRAMEWORK</span><h3>Featured → Vaulted → Returning</h3><p>Each collection has an independent lifecycle. Vaulting one set removes it from standard boosters without affecting ownership or cross-set deck building; it can later return through event or Legacy packs.</p></section></section>`;
  root.querySelectorAll('[data-claim-challenge]').forEach(btn=>btn.addEventListener('click',()=>{ try { const reward=claimChallenge(profile,btn.dataset.claimChallenge); saveProfile(profile); message=`Challenge claimed: +${reward} SummerSlam booster${reward===1?'':'s'}.`; } catch(e){ message=e.message; } renderChallenges(); }));
  root.querySelectorAll('[data-claim-milestone]').forEach(btn=>btn.addEventListener('click',()=>{ try { const [setId,type,pct]=btn.dataset.claimMilestone.split(':'); const reward=claimMilestone(profile,type,Number(pct),setId); saveProfile(profile); message=`${setCollections[setId]?.name??setId} ${type==='foil'?'Foil':'Collection'} milestone claimed: +${reward} booster${reward===1?'':'s'}.`; } catch(e){ message=e.message; } renderChallenges(); }));
  $("#challenge-play")?.addEventListener("click", showSetup); $("#challenge-ladder")?.addEventListener("click", showLadder); $("#challenge-championship")?.addEventListener("click", showChampionship); $("#challenge-boosters")?.addEventListener("click", showBoosters); $("#challenge-collection")?.addEventListener("click", showCollection); $("#challenge-decks")?.addEventListener("click", () => showDeckBuilder(selection.p1));
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
  root.innerHTML=`<section class="ladder-screen"><section class="ladder-hero"><div><span class="eyebrow">SINGLE PLAYER · ERA PATHS</span><h2>Climb the Ladder</h2><p>Choose a path: the eight-wrestler Current Era run, four-match Golden Era or Attitude Era branches, or the complete eight-wrestler Hall of Fame run. You have three lives; the third defeat ends the run.</p><div class="mode-branch-tabs">${tabs}</div><div class="top-actions"><button id="ladder-exhibition" class="nav-button">Exhibition</button><button id="ladder-championship" class="nav-button">Championship Road</button><button id="ladder-boosters" class="nav-button">Boosters</button><button id="ladder-collection" class="nav-button">Collection</button></div></div><div class="ladder-summary"><div><b>${ladder.clearsByBranch?.[branch.id]??0}</b><span>${branch.label} clears</span></div><div><b>${ladder.bestRungByBranch?.[branch.id]??0}/${totalRungs}</b><span>Best rung</span></div><div><b>${'●'.repeat(lives)}${'○'.repeat(LADDER_LIVES-lives)}</b><span>Lives</span></div><div><b>${ladder.completionPackCreditsBySet?.[branch.setId]??0}</b><span>${sets[branch.setId]?.name} packs</span></div></div></section><p class="setup-message">${message||statusText}</p>${!active?`<section class="ladder-picker"><h3>Choose any unlocked Superstar</h3><div class="roster-grid">${roster.map(star=>{const locked=!hasSuperstar(profile,star.id),selected=chosenId===star.id;return `<button class="roster-card ${selected?'selected':''} ${locked?'locked-star blocked':''}" data-ladder-star="${star.id}" ${locked?'disabled':''}><div class="roster-photo">${portraitMarkup(star.id,star.name)}</div><strong>${star.name}</strong><small>${locked?'LOCKED':sets[star.setId]?.displayName}</small></button>`}).join('')}</div><button id="start-ladder" class="start-match">Start ${totalRungs}-Match ${branch.label} Run</button></section>`:`<section class="ladder-current"><div><span>PATH</span><strong>${branch.label}</strong></div><div><span>YOUR SUPERSTAR</span><strong>${superstarById[run.superstarId].name}</strong></div><div><span>NEXT RUNG</span><strong>${run.rung+1}/${run.opponents.length} · ${superstarById[currentLadderOpponent(profile)].name}</strong></div><button id="continue-ladder" class="start-match">Fight Rung ${run.rung+1}</button></section>`}<section class="ladder-stack">${ladderRows}</section>${run&&run.status!=='active'?`<button id="new-ladder" class="start-match">Start Another Run</button>`:''}</section>`;
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
  root.innerHTML=`<section class="ladder-screen championship-screen"><section class="ladder-hero"><div><span class="eyebrow">SINGLE PLAYER · ERA PATHS</span><h2>Championship Road</h2><p>Choose Current Era, Golden Era or Attitude Era. Each road is four matches, ending against one of that era's headline champions. Losses and draws replay the current stage rather than resetting the run.</p><div class="mode-branch-tabs">${tabs}</div><div class="top-actions"><button id="champ-exhibition" class="nav-button">Exhibition</button><button id="champ-ladder" class="nav-button">Climb the Ladder</button><button id="champ-boosters" class="nav-button">Boosters</button><button id="champ-collection" class="nav-button">Collection</button></div></div><div class="ladder-summary"><div><b>${road.clearsByBranch?.[branch.id]??0}</b><span>${branch.label} clears</span></div><div><b>${road.bestStageByBranch?.[branch.id]??0}/4</b><span>Best stage</span></div><div><b>${completed}/16</b><span>Superstar clears</span></div><div><b>${road.championshipPackCreditsBySet?.[branch.setId]??0}</b><span>${sets[branch.setId]?.name} packs</span></div></div></section><p class="setup-message">${message||status}</p>${!active?`<section class="ladder-picker"><h3>Choose any unlocked Superstar</h3><div class="roster-grid">${roster.map(star=>{const locked=!hasSuperstar(profile,star.id),selected=chosenId===star.id,crowned=road.completedByBranch?.[branch.id]?.includes(star.id);return `<button class="roster-card ${selected?'selected':''} ${locked?'locked-star blocked':''}" data-champ-star="${star.id}" ${locked?'disabled':''}><div class="roster-photo">${portraitMarkup(star.id,star.name)}</div><strong>${star.name}</strong><small>${locked?'LOCKED':crowned?'ROAD CLEARED':'READY'}</small></button>`}).join('')}</div><button id="start-championship" class="start-match">Start ${branch.label} Road</button></section>`:`<section class="ladder-current"><div><span>ROAD</span><strong>${branch.label}</strong></div><div><span>YOUR SUPERSTAR</span><strong>${superstarById[run.superstarId].name}</strong></div><div><span>NEXT MATCH</span><strong>${run.stage+1}/4 · ${CHAMPIONSHIP_STAGES[run.stage]} · ${superstarById[currentChampionshipOpponent(profile)].name}</strong></div><button id="continue-championship" class="start-match">Fight ${CHAMPIONSHIP_STAGES[run.stage]}</button></section>`}<section class="ladder-stack">${routeRows}</section>${run&&run.status!=='active'?`<button id="new-championship" class="start-match">Start Another Road</button>`:''}</section>`;
  root.querySelectorAll('[data-champ-branch]').forEach(btn=>btn.addEventListener('click',()=>{championshipBranchId=btn.dataset.champBranch;message='';renderChampionship();}));root.querySelectorAll('[data-champ-star]').forEach(btn=>btn.addEventListener('click',()=>{selection.p1=btn.dataset.champStar;renderChampionship();}));
  $("#start-championship")?.addEventListener("click",beginChampionshipRoad);$("#continue-championship")?.addEventListener("click",startCurrentChampionshipMatch);$("#new-championship")?.addEventListener("click",()=>{resetChampionshipRoad(profile);saveProfile(profile);renderChampionship();});$("#champ-exhibition")?.addEventListener("click",showSetup);$("#champ-ladder")?.addEventListener("click",showLadder);$("#champ-boosters")?.addEventListener("click",showBoosters);$("#champ-collection")?.addEventListener("click",showCollection);
}


function chooseStarter(starId) {
  profile = createProfile(starId);
  saveProfile(profile);
  selection.p1 = starId;
  selection.p2 = starId === "roman-reigns" ? "cm-punk" : "roman-reigns";
  lastMatchup = { ...selection };
  screen = "setup";
  message = `${superstarById[starId].name} is your first unlocked Superstar.`;
  renderSetup();
}

function renderStarter() {
  const root = $("#game");
  const choices = STARTER_CHOICES.map(id => superstarById[id]).filter(Boolean);
  root.innerHTML = `<section class="starter-screen"><div class="starter-hero"><span class="eyebrow">SUMMERSLAM — SERIES 1</span><h2>Choose Your Champion</h2><p>Begin the collection with one World Champion. Your choice unlocks that Superstar and a complete playable starter deck. The other seven SummerSlam — Series 1 Superstars begin locked.</p></div><div class="starter-choice-grid">${choices.map(star => `<button class="starter-choice" data-starter="${star.id}"><div class="starter-photo"><img src="${superstarArtwork[star.id]}" alt="${star.name}"></div><span class="champion-tag">STARTER CHOICE</span><strong>${star.name}</strong><small>${star.nickname}</small><span>${star.hp} HP · ${star.archetype.replaceAll("-", " ")}</span><em>${star.ability.name}: ${star.ability.text}</em><b>Choose ${star.name}</b></button>`).join("")}</div><p class="starter-note">Other Superstars can later be unlocked by collecting their ★★★★ Superstar card or through guaranteed progression rewards.</p></section>`;
  root.querySelectorAll("[data-starter]").forEach(btn => btn.addEventListener("click", () => chooseStarter(btn.dataset.starter)));
}


function renderSetup() {
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
  root.innerHTML = `<section class="setup-screen">
    <div class="setup-heading"><span class="eyebrow">16 SUPERSTARS · 2 COLLECTION SETS</span><h2>Choose your Superstar and opponent</h2><p>SummerSlam — Series 1 and Hall of Fame — Series 1 now share one match engine and one cross-set deck-building collection. You can play as unlocked Superstars; all 16 remain available as CPU opponents.</p><p class="unlock-summary"><b>${profile.unlockedSuperstars.length}/16 unlocked</b> · Starter: ${superstarById[profile.starterId].name}</p></div>
    <section class="selector-panel"><div class="selector-title"><span>YOU · PLAYER 1</span><strong>${p1.name}</strong></div><div class="roster-grid">${roster.map(s => rosterCard(s, HUMAN)).join("")}</div></section>
    <div class="versus-strip"><span>${p1.name}</span><b>VS</b><span>${p2.name}</span></div>
    <section class="selector-panel"><div class="selector-title"><span>CPU OPPONENT</span><strong>${p2.name}</strong></div><div class="roster-grid">${roster.map(s => rosterCard(s, CPU)).join("")}</div></section>
    ${message ? `<p class="setup-message">${message}</p>` : ""}<div class="setup-actions"><button id="start-match" class="start-match">Start Exhibition</button><button id="open-ladder" class="nav-button ladder-mode-button">Climb the Ladder</button><button id="open-championship" class="nav-button">Championship Road</button><button id="open-collection" class="nav-button">Browse Collection</button><button id="open-boosters" class="nav-button">Booster Packs (${boosterCreditsFor(profile,"summerslam-series-1")} SS · ${boosterCreditsFor(profile,"hall-of-fame-series-1")} HOF)</button><button id="open-challenges" class="nav-button">Challenges</button><button id="open-deck-builder" class="nav-button">Deck Builder</button><button id="reset-save" class="nav-button danger">Reset Save</button></div>
  </section>`;
  root.querySelectorAll("[data-select-player]").forEach(btn => btn.addEventListener("click", () => {
    const player = btn.dataset.selectPlayer, other = player === HUMAN ? CPU : HUMAN;
    if (selection[other] === btn.dataset.star) return;
    selection[player] = btn.dataset.star; message = ""; renderSetup();
  }));
  $("#start-match")?.addEventListener("click", () => startMatch());
  $("#open-ladder")?.addEventListener("click", showLadder);
  $("#open-championship")?.addEventListener("click", showChampionship);
  $("#open-collection")?.addEventListener("click", showCollection);
  $("#open-boosters")?.addEventListener("click", showBoosters);
  $("#open-challenges")?.addEventListener("click", showChallenges);
  $("#open-deck-builder")?.addEventListener("click", () => showDeckBuilder(selection.p1));
  $("#reset-save")?.addEventListener("click", () => { resetProfile(); profile = null; game = null; screen = "starter"; message = ""; renderStarter(); });
}

function rarityStars(level) { return "★".repeat(level) + "☆".repeat(4 - level); }
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
  return [`Cost ${card.cost ?? 0}`, `${card.damage ?? 0} damage`, method, moveType, counters, req ? `Requires ${req}` : "", stateReq, defense, card.finisher ? "Finisher" : "", card.effectText ?? ""].filter(Boolean).join(" · ");
}
function renderCollection() {
  const root=$("#game"), setInfo=setCollections[activeCollectionSetId]??setCollection, setCards=cardsForSet(activeCollectionSetId);
  const kinds=["all","superstar","entrance","momentum","move","action","support","manager","special"],query=collectionFilter.search.trim().toLowerCase();
  const visible=setCards.filter(card=>{if(collectionFilter.kind!=="all"&&card.kind!==collectionFilter.kind)return false;if(collectionFilter.rarity!=="all"&&String(card.rarity)!==collectionFilter.rarity)return false;if(query&&!`${card.name} ${card.subtitle??""} ${card.kind} ${collectionText(card)}`.toLowerCase().includes(query))return false;return true;});
  const rarityCounts=[1,2,3,4].map(r=>setCards.filter(c=>c.rarity===r).length), starIds=setCards.filter(c=>c.kind==='superstar').map(c=>c.superstarId), unlocked=starIds.filter(id=>hasSuperstar(profile,id)).length;
  const tabs=Object.values(setCollections).map(set=>`<button class="nav-button ${set.id===activeCollectionSetId?'active':''}" data-collection-set="${set.id}">${set.displayName}</button>`).join('');
  const intro=activeCollectionSetId==='hall-of-fame-series-1'?'Eight Hall of Fame legends split between Golden Era and Attitude Era branches. Cards from this set enter the same global deck-building collection once owned.':'The inaugural eight-Superstar modern release. SummerSlam cards remain compatible with future sets.';
  root.innerHTML=`<section class="collection-screen"><section class="collection-hero"><div><span class="eyebrow">COLLECTION SETS · SERIES 1</span><h2>${setInfo.displayName}</h2><p>${intro}</p><div class="mode-branch-tabs">${tabs}</div><div class="top-actions"><button id="collection-play" class="nav-button active">Play Match</button><button id="collection-ladder" class="nav-button">Climb the Ladder</button><button id="collection-championship" class="nav-button">Championship Road</button><button id="collection-decks" class="nav-button">Deck Builder</button><button id="collection-boosters" class="nav-button">Booster Packs (${boosterCreditsFor(profile,activeCollectionSetId)})</button></div></div><div class="set-stats"><div class="set-stat"><b>${unlocked}/${setInfo.superstarCount}</b><span>Set Superstars unlocked</span></div><div class="set-stat"><b>${setInfo.cardCount}</b><span>Set cards</span></div><div class="set-stat"><b>${rarityCounts[2]+rarityCounts[3]}</b><span>Rare +</span></div><div class="set-stat"><b>${collectionCards.length}</b><span>Total game cards</span></div></div></section><section class="collection-tools"><input id="collection-search" type="search" placeholder="Search cards, moves or abilities" value="${collectionFilter.search.replaceAll('"','&quot;')}"><select id="collection-kind">${kinds.map(k=>`<option value="${k}" ${collectionFilter.kind===k?'selected':''}>${k==='all'?'All card types':k[0].toUpperCase()+k.slice(1)}</option>`).join('')}</select><select id="collection-rarity"><option value="all">All rarities</option>${[1,2,3,4].map(r=>`<option value="${r}" ${collectionFilter.rarity===String(r)?'selected':''}>${rarityStars(r)} ${setInfo.rarityLabels[r]}</option>`).join('')}</select><span class="collection-count">Showing ${visible.length} / ${setCards.length}</span></section><section class="catalogue-grid">${visible.length?visible.map(card=>`<article class="catalogue-card ${card.kind} ${card.finisher?'finisher':''} ${card.kind==='superstar'&&!hasSuperstar(profile,card.superstarId)?'collection-locked':''}"><span class="catalogue-num">${card.cardCode}</span><span class="catalogue-kind">${card.kind==='superstar'?(hasSuperstar(profile,card.superstarId)?'SUPERSTAR · UNLOCKED':'SUPERSTAR · LOCKED'):card.finisher?'Finisher':card.kind}</span><h3>${card.name}</h3><span class="subtitle">${card.subtitle??(card.superstarId?superstarById[card.superstarId]?.name??setInfo.displayName:setInfo.displayName)}</span><div class="catalogue-art">${artworkFor(card)?`<img src="${artworkFor(card)}" alt="${card.name}">`:'Artwork pending'}</div><p class="catalogue-text">${collectionText(card)}</p><div class="catalogue-meta"><span class="rarity-stars">${rarityStars(card.rarity)}</span><span>${setInfo.rarityLabels[card.rarity]}</span>${card.moveType?`<span>${MOVE_TYPE_LABELS[card.moveType] ?? card.moveType}</span>`:''}<span>Owned ${ownedCount(profile,card.id,'normal')} · Foil ${ownedCount(profile,card.id,'foil')}</span></div></article>`).join(''):'<div class="collection-empty">No cards match these filters.</div>'}</section></section>`;
  root.querySelectorAll('[data-collection-set]').forEach(btn=>btn.addEventListener('click',()=>{activeCollectionSetId=btn.dataset.collectionSet;collectionFilter={kind:'all',rarity:'all',search:''};renderCollection();}));
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
  const stat = (label, value, target) => `<div><span>${label}</span><b>${value}${target ? ` / ${target}` : ""}</b></div>`;
  const problems = health.violations.length ? `<div class="deck-problems">${health.violations.map(v=>`<p>${v}</p>`).join("")}</div>` : `<p class="deck-healthy">Deck is legal and ready to play.</p>`;

  root.innerHTML = `<section class="deck-builder-screen">
    <section class="collection-hero deck-builder-hero"><div><span class="eyebrow">GLOBAL COLLECTION · CROSS-SET DECKS</span><h2>Deck Builder</h2><p>Owned compatible cards from SummerSlam and Hall of Fame can be mixed. Each Superstar card is permanently linked to its five-card Lead Off package. The Entrance and the other four opening cards cannot be replaced; only the remaining 50 slots are editable. Foil copies automatically take priority when you own them.</p><div class="top-actions"><button id="deck-play" class="nav-button">Exhibition</button><button id="deck-collection" class="nav-button">Collection</button><button id="deck-boosters" class="nav-button">Boosters</button><button id="deck-challenges" class="nav-button">Challenges</button><button id="deck-championship" class="nav-button">Championship Road</button></div></div><div class="set-stats"><div class="set-stat"><b>${health.score}</b><span>Deck health</span></div><div class="set-stat"><b>${deckDraft.length}/55</b><span>Total pages</span></div><div class="set-stat"><b>${tailCount}/50</b><span>Editable pages</span></div><div class="set-stat"><b>${profile.deckAssistance}</b><span>Assistance</span></div></div></section>
    ${message ? `<p class="setup-message">${message}</p>` : ""}
    <section class="deck-star-tabs">${profile.unlockedSuperstars.map(id=>`<button data-deck-star="${id}" class="${id===deckBuilderStarId?'active':''}">${superstarById[id].name}</button>`).join("")}</section>
    <section class="linked-package"><div class="section-title"><h3>Connected Superstar Package</h3><span>Locked identities · Foils may replace Normals</span></div><div class="superstar-package-card"><div class="catalogue-art">${artworkFor(superstarCard) ? `<img src="${artworkFor(superstarCard)}" alt="${star.name}">` : "Artwork pending"}</div><div><span>SUPERSTAR CARD</span><h3>${star.name}</h3><p>${star.ability.name}: ${star.ability.text}</p><small>Linked Lead Off: ${linkedLead.length} cards</small></div></div><div class="lead-off-grid">${lead.map(({entry,card,slot})=>`<article><span>LEAD OFF ${slot} · LOCKED</span><b>${card?.name ?? entry.id}${entry.foil?' ✦':''}</b><small>${deckRole(card)}</small>${card?.kind==='entrance'?'<em>Unique Entrance · max 1 owned</em>':''}</article>`).join("")}</div></section>
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
  let steps = 0;
  while (game && game.state().phase !== "MATCH_OVER" && decisionOwner(game.state()) === CPU && steps < 40) {
    const before = game.state().log.length;
    const decision = executeCpuDecision(game, CPU);
    steps += 1;
    if (decision.type === "none" || game.state().log.length === before) break;
  }
  if (game?.state().phase === "MATCH_OVER") message = game.state().winner ? `${nameFor(game.state().winner)} wins by ${game.state().finish.type.toUpperCase()}!` : `Match ends by ${game.state().finish.type.toUpperCase()}.`;
  else if (steps) message = `${nameFor(CPU)} completed its CPU decisions. Your response is ready.`;
}

function afterHumanAction() { advanceCpu(); render(); }

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

function renderMomentum(player) { return Object.entries(player.momentum).map(([method, value]) => `<span class="momentum-chip ${method}"><b>${method[0].toUpperCase()}</b>${value}</span>`).join(""); }

function abilityStatus(player) {
  const ability = player.superstar.ability;
  if (ability?.passive) return "PASSIVE";
  const max = ability?.maxUses ?? 1;
  if (max > 1) return `${player.abilityUses ?? 0}/${max}`;
  return player.abilityUsed ? "USED" : "READY";
}

function renderPlayer(playerId) {
  const state = game.state(), p = state.players[playerId], cpu = playerId === CPU;
  const active = decisionOwner(state) === playerId && state.phase !== "MATCH_OVER";
  const hpPercent = Math.max(0, (p.hp / p.maxHp) * 100);
  const subTotal = Object.values(p.submissionDamage).reduce((a, b) => a + b, 0);
  const hand = cpu
    ? `<div class="cpu-hand"><b>${p.hand.length}</b><span>cards hidden</span></div>`
    : `<div class="hand">${p.hand.map((card, index) => { const legal = active && cardLegal(playerId, card); return `<button class="game-card ${card.kind} ${legal ? "playable" : "locked"}" data-player="${playerId}" data-index="${index}" ${legal ? "" : "disabled"}><span class="card-kind">${card.finisher ? "FINISHER" : card.kind.toUpperCase()}</span><strong>${card.name}</strong><small>${cardMeta(card)}</small><em>${legal ? "Playable" : cardReason(playerId, card)}</em></button>`; }).join("")}</div>`;
  return `<section class="fighter ${active ? "active" : ""}"><div class="fighter-head"><div><span class="player-label">${cpu ? "CPU OPPONENT" : "YOU · PLAYER 1"}</span><h2>${p.superstar.name}</h2><p>${p.superstar.nickname}</p><p class="ability-line"><b>${p.superstar.ability.name}</b> — ${p.superstar.ability.text} <span>${abilityStatus(p)}</span></p></div>${state.playerInControl === playerId && state.phase !== "MATCH_OVER" ? '<span class="control-badge">IN CONTROL</span>' : ""}</div>
    <div class="hp-row"><b>${p.hp} / ${p.maxHp} HP</b><span>${p.location} · ${p.posture}${p.status.stunnedTurns ? ` · stunned ${p.status.stunnedTurns}` : ""} · submission ${subTotal}</span></div><div class="hp-track"><span style="width:${hpPercent}%"></span></div>
    <div class="momentum-row">${renderMomentum(p)}<span class="total-chip">Total ${effectiveTotalMomentum(p)}${effectiveTotalMomentum(p) !== totalMomentum(p) ? ` (${totalMomentum(p)} + Support)` : ""}</span></div><div class="support-row"><span>Supports</span>${p.activeSupports.length ? p.activeSupports.map(c => `<b title="${c.abilityText}">${c.name}</b>`).join("") : "<em>None active</em>"}</div><div class="support-row manager-row"><span>Manager</span>${p.activeManager ? `<b title="${p.activeManager.abilityText}">${p.activeManager.name} · ${p.managerAbilityUsed ? "USED" : "READY"}</b>` : "<em>None active</em>"}</div><div class="pile-stats">Hand ${p.hand.length} · Deck ${p.deck.length} · Discard ${p.discard.length} · Pin attempts ${p.pinAttempts}</div>${hand}</section>`;
}

function logText(event) {
  const n = id => id ? game.state().players[id]?.superstar.name ?? id : "";
  const map = {
    PRE_MATCH_STARTED: () => `PRE-MATCH: both linked Entrance cards are revealed.`,
    ENTRANCE_PREMATCH: () => `${n(event.playerId)} revealed ${event.cardName}.`,
    ENTRANCE_EFFECT: () => `${event.cardName} triggered for ${n(event.playerId)}.`,
    BELL_RANG: () => `The bell rings! ${n(event.control)} has opening Control.`,
    MATCH_STARTED: () => `${n(event.control)} starts Turn 1 in Control.`, MOMENTUM_PLAYED: () => `${n(event.playerId)} played ${event.method} Momentum.`,
    ENTRANCE_PLAYED: () => `${n(event.playerId)} played Entrance ${event.cardId}.`, ACTION_PLAYED: () => `${n(event.playerId)} played Action ${event.cardId}.`, SUPPORT_PLAYED: () => `${n(event.playerId)} put Support ${event.cardId} into play.`, SUPPORT_REPLACED: () => `${n(event.playerId)} discarded old Support ${event.cardId}.`, MANAGER_PLAYED: () => `${n(event.playerId)} brought ${event.managerName} to ringside.`, MANAGER_ABILITY: () => `${event.managerName} assisted ${n(event.playerId)}.`, MOVE_DECLARED: () => `${n(event.playerId)} declared ${event.cardId}.`,
    MOVE_COUNTERED: () => `${n(event.defenderId)} countered ${event.incomingCardId} with ${event.counterCardId}.`, AUTO_COUNTER: () => `${n(event.defenderId)} Auto Countered by ditching 7 pages.`,
    COUNTER_PASSED: () => `${n(event.defenderId)} passed the counter window.`, MOVE_CONNECTED: () => `${event.cardId} connected for ${event.damage} damage${event.finisher ? " (FINISHER)" : ""}.`,
    CARDS_DRAWN: () => `${n(event.playerId)} drew ${event.cardIds.length} page${event.cardIds.length === 1 ? "" : "s"}.`, CONTROL_PASSED: () => `${n(event.from)} passed Control to ${n(event.to)}.`,
    POST_MOVE_WINDOW: () => `${n(event.attackerId)} has a post-move finish window.`, PIN_ATTEMPTED: () => `${n(event.attackerId)} attempts pin #${event.attemptNumber}; ${event.chance}% prototype chance.`,
    PIN_ESCAPED_SPECIAL: () => `${n(event.defenderId)} used a pin-escape Special.`, PIN_CHECK: () => `Pin check: rolled ${event.roll} vs ${event.chance}%.`, KICK_OUT: () => `${n(event.defenderId)} kicks out and takes Control.`,
    SUBMISSION_DAMAGE: () => `${event.bodyPart} submission pressure ${event.total}/${event.threshold}.`, SUBMISSION_MAINTAINED: () => `${n(event.attackerId)} maintained the hold.`, SUBMISSION_RELEASED: () => `${n(event.attackerId)} released the hold and kept Control.`,
    SUPERSTAR_ABILITY: () => `${n(event.playerId)} triggered ${event.abilityName}${event.maxUses > 1 ? ` (${event.use}/${event.maxUses})` : ""}.`, SUPERSTAR_PASSIVE: () => `${n(event.playerId)}'s ${event.abilityName} prevented the Stun.`, SENT_TO_RINGSIDE: () => `${n(event.defenderId)} was sent to ringside.`, FOLLOWED_OUTSIDE: () => `${n(event.attackerId)} followed the fight to ringside.`, RETURNED_TO_RING: () => `${n(event.playerId)} returned to the ring.`, COUNT_OUT_TICK: () => `Referee count: ${event.count}/${game.state().countOut.limit}.`, COUNT_OUT_RESET: () => `Count-out reset after both wrestlers returned to the ring.`, MATCH_ENDED: () => event.winnerId ? `${n(event.winnerId)} wins by ${event.finishType.toUpperCase()}.` : `Match ends by ${event.finishType.toUpperCase()}.`
  };
  return map[event.type]?.() ?? event.type.replaceAll("_", " ").toLowerCase();
}

function renderCenter() {
  const state = game.state(), owner = decisionOwner(state);
  let prompt = state.phase === "MATCH_OVER" ? (state.winner ? `${nameFor(state.winner)} wins by ${state.finish.type.toUpperCase()}!` : `Match ends by ${state.finish.type.toUpperCase()}!`) : owner === CPU ? `${nameFor(CPU)} is thinking…` : `${nameFor(HUMAN)} — choose your action.`;
  if (state.phase === "COUNTER" && owner === HUMAN) prompt = `Counter ${state.proposedMove.card.name}, or pass.`;
  if (state.phase === "POST_MOVE" && owner === HUMAN) prompt = `Follow up after ${state.postMove.cardId}: pin or end offense.`;
  if (state.phase === "PIN_RESPONSE" && owner === HUMAN) prompt = `You are being pinned: use Shoulder Up or pass to the pin check.`;
  if (state.phase === "SUBMISSION_MAINTAIN" && owner === HUMAN) prompt = `Ditch one page to maintain the submission, or release it and keep Control.`;
  const pinCheck = state.phase === "POST_MOVE" && owner === HUMAN ? canAttemptPin(state, HUMAN) : null;
  return `<section class="match-center ${state.phase === "MATCH_OVER" ? "match-over" : ""}"><div class="turn-box"><span>TURN</span><strong>${state.turnNumber}</strong><small>${state.phase.replaceAll("_", " ")}${state.countOut.count ? ` · COUNT ${state.countOut.count}/${state.countOut.limit}` : ""}</small></div><div class="prompt"><strong>${prompt}</strong><p>${message}</p></div><div class="actions">
    ${owner === HUMAN && state.phase === "COUNTER" ? '<button id="pass-action" class="primary">Pass Counter</button>' : ""}
    ${owner === HUMAN && state.phase === "ACTION" && canReturnToRing(state, HUMAN) ? '<button id="return-ring" class="primary">Return to Ring</button>' : ""}
    ${owner === HUMAN && state.phase === "ACTION" ? '<button id="pass-action" class="secondary">Pass Control</button>' : ""}
    ${owner === HUMAN && state.phase === "POST_MOVE" && pinCheck?.legal ? `<button id="attempt-pin" class="primary">Attempt Pin${pinCheck.cost ? ` · ${pinCheck.cost} Attitude` : ""}</button>` : ""}
    ${owner === HUMAN && state.phase === "POST_MOVE" && canFollowOutside(state, HUMAN) ? '<button id="follow-outside" class="primary">Follow to Ringside</button>' : ""}
    ${owner === HUMAN && state.phase === "POST_MOVE" ? '<button id="end-post-move" class="secondary">End Offense</button>' : ""}
    ${owner === HUMAN && state.phase === "PIN_RESPONSE" ? '<button id="pass-action" class="primary">Pass to Pin Check</button>' : ""}
    ${owner === HUMAN && state.phase === "SUBMISSION_MAINTAIN" ? '<button id="release-submission" class="primary">Release Hold</button>' : ""}
    ${state.phase === "MATCH_OVER" && activeMode === "ladder" ? '<button id="ladder-hub" class="primary">Return to Ladder</button>' : ""}${state.phase === "MATCH_OVER" && activeMode === "championship" ? '<button id="championship-hub" class="primary">Return to Championship Road</button>' : ""}${!(state.phase === "MATCH_OVER" && (activeMode === "ladder" || activeMode === "championship")) ? '<button id="reset-match" class="ghost">Restart Match</button>' : ""}<button id="change-matchup" class="ghost">${activeMode === "ladder" ? "Ladder Hub" : activeMode === "championship" ? "Championship Hub" : "Change Matchup"}</button><button id="browse-collection" class="ghost">Collection</button><button id="browse-boosters" class="ghost">Boosters (${profile.boosterCredits ?? 0})</button><button id="browse-challenges" class="ghost">Challenges</button><button id="browse-decks" class="ghost">Deck Builder</button></div></section>`;
}

function renderSubmissionChooser() {
  const state = game.state(); if (state.phase !== "SUBMISSION_MAINTAIN" || decisionOwner(state) !== HUMAN) return "";
  const sub = state.submission, attacker = state.players[HUMAN], defender = state.players[sub.defenderId];
  return `<section class="submission-panel"><h3>Maintain submission</h3><p>${sub.bodyPart} pressure: <b>${defender.submissionDamage[sub.bodyPart]}/${submissionThreshold(defender)}</b>. Ditch one page:</p><div class="ditch-row">${attacker.hand.map((c,i)=>`<button data-ditch="${i}">${c.name}</button>`).join("")}</div></section>`;
}

function handleCompletedMatch() {
  const state = game.state();
  if (state.phase !== "MATCH_OVER" || matchRewarded) return;
  matchRewarded = true;
  recordCompletedMatchChallenges(profile, state, HUMAN, activeMode);
  const result = state.winner === HUMAN ? "win" : state.winner === CPU ? "loss" : "draw";

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
    saveProfile(profile);
    return;
  }

  if (activeMode !== "ladder") {
    if (state.winner === HUMAN) {
      const rewardSetId = state.players[HUMAN].superstar.setId ?? "summerslam-series-1";
      grantBooster(profile, 1, rewardSetId);
      message += ` Victory reward: +1 ${sets[rewardSetId]?.displayName ?? rewardSetId} booster.`;
    }
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
  saveProfile(profile);
}

function render() {
  if (screen === "setup" || !game) { renderSetup(); return; }
  handleCompletedMatch();
  const root = $("#game");
  root.innerHTML = `${renderPlayer(CPU)}${renderCenter()}${renderSubmissionChooser()}${renderPlayer(HUMAN)}<section class="match-log"><div class="section-title"><h3>Match log</h3><span>Newest first</span></div>${[...game.state().log].reverse().slice(0,22).map(e=>`<p><b>T${e.turn}</b> ${logText(e)}</p>`).join("")}</section>`;
  root.querySelectorAll(".game-card.playable").forEach(btn => btn.addEventListener("click", () => playCard(btn.dataset.player, Number(btn.dataset.index))));
  $("#pass-action")?.addEventListener("click", passAction); $("#attempt-pin")?.addEventListener("click", attemptPin); $("#end-post-move")?.addEventListener("click", endPostMove);
  $("#return-ring")?.addEventListener("click", returnToRing); $("#follow-outside")?.addEventListener("click", followOutside);
  $("#reset-match")?.addEventListener("click", restartMatch); $("#change-matchup")?.addEventListener("click", activeMode === "ladder" ? showLadder : activeMode === "championship" ? showChampionship : showSetup); $("#ladder-hub")?.addEventListener("click", showLadder); $("#championship-hub")?.addEventListener("click", showChampionship); $("#browse-collection")?.addEventListener("click", showCollection); $("#browse-boosters")?.addEventListener("click", showBoosters); $("#browse-challenges")?.addEventListener("click", showChallenges); $("#browse-decks")?.addEventListener("click", () => showDeckBuilder(selection.p1)); $("#release-submission")?.addEventListener("click", releaseSubmission);
  root.querySelectorAll("[data-ditch]").forEach(btn => btn.addEventListener("click", () => maintainSubmission(Number(btn.dataset.ditch))));
}

if (screen === "starter") renderStarter(); else if (screen === "boosters") renderBoosters(); else if (screen === "ladder") renderLadder(); else if (screen === "championship") renderChampionship(); else if (screen === "challenges") renderChallenges(); else if (screen === "deck-builder") renderDeckBuilder(); else renderSetup();
