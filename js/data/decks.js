import { cards } from "./cards.js";
import { hallCards } from "./hall-of-fame-cards.js";
import { evolutionCards } from "./evolution-cards.js";
import { rockCards } from "./season1-rock-cards.js";

const M = cards.momentum;
const HM = hallCards.momentum;
const EM = evolutionCards.momentum;
const copies = (card, count) => Array.from({ length: count }, () => card);

// With the restored tactical Move-Type system, ordinary offensive Moves also act as
// counters. Keep a small specialist defensive package, but do not let pure reversal
// pages crowd useful offense out of a 55-card deck.
const tacticalOffense = {
  "cody-rhodes": [cards.armDrag, cards.runningForearm, cards.dropkick, cards.ddt],
  "cm-punk": [cards.sideHeadlock, cards.armDrag, cards.runningForearm, cards.dropkick],
  "roman-reigns": [cards.shoulderTackle, cards.romanUppercut, cards.clothesline, cards.bigBoot],
  "seth-rollins": [cards.dropkick, cards.sethSuperkick, cards.slingBlade, cards.runningForearm],
  "oba-femi": [cards.shoulderTackle, cards.bodyslam, cards.bigBoot, cards.powerslam],
  "brock-lesnar": [cards.shoulderTackle, cards.germanSuplexCommon, cards.clothesline, cards.bellyToBellyCommon],
  "kevin-owens": [cards.runningForearm, cards.clothesline, cards.superkick, cards.ddt],
  gunther: [cards.uppercut, cards.bigBoot, cards.lariat, cards.backbreaker],
  "hulk-hogan": [hallCards.jab, hallCards.clothesline, hallCards.bodyslam, hallCards.bigBoot],
  "andre-the-giant": [hallCards.uppercut, hallCards.bodyslam, hallCards.bigBoot, hallCards.sideSlam],
  "randy-savage": [hallCards.jab, hallCards.dropkick, hallCards.neckbreaker, hallCards.flyingClothesline],
  "ultimate-warrior": [hallCards.shoulderTackle, hallCards.clothesline, hallCards.bigBoot, hallCards.bodyslam],
  "stone-cold-steve-austin": [hallCards.jab, hallCards.clothesline, hallCards.forearm, hallCards.ddt],
  "the-undertaker": [hallCards.forearm, hallCards.bigBoot, hallCards.clothesline, hallCards.headlock],
  mankind: [hallCards.forearm, hallCards.headlock, hallCards.ddt, hallCards.neckbreaker],
  kane: [hallCards.bigBoot, hallCards.clothesline, hallCards.sideSlam, hallCards.bodyslam],
  "rhea-ripley": [evolutionCards.clothesline, evolutionCards.bigBoot, evolutionCards.powerslam, evolutionCards.forearmSmash],
  "liv-morgan": [evolutionCards.dropkick, evolutionCards.enzuigiri, evolutionCards.armDrag, evolutionCards.hurricanrana],
  "becky-lynch": [evolutionCards.europeanUppercut, evolutionCards.armDrag, evolutionCards.snapSuplex, evolutionCards.forearmSmash],
  bayley: [evolutionCards.armDrag, evolutionCards.dropkick, evolutionCards.snapSuplex, evolutionCards.runningKnee],
  "charlotte-flair": [evolutionCards.knifeEdgeChop, evolutionCards.bigBoot, evolutionCards.spear, evolutionCards.exploderSuplex],
  "iyo-sky": [evolutionCards.dropkick, evolutionCards.hurricanrana, evolutionCards.springboardDropkick, evolutionCards.enzuigiri],
  paige: [evolutionCards.armDrag, evolutionCards.forearmSmash, evolutionCards.ddt, evolutionCards.neckbreaker],
  "stephanie-vaquer": [evolutionCards.legSweep, evolutionCards.runningKnee, evolutionCards.snapSuplex, evolutionCards.forearmSmash],
  "the-rock": [rockCards.bodyShot, rockCards.shoulderBlock, rockCards.clothesline, rockCards.snapDDT]
};

const buildDeck = (opening, tailGroups) => {
  // The Entrance is permanently linked to the Superstar and resolves from outside
  // the playable 55-page deck. Lead Off is now five fixed PLAYABLE pages.
  const entrance = opening.find(card => card.kind === "entrance");
  const superstarId = entrance?.superstarId;
  const replacements = tacticalOffense[superstarId] ?? [];
  const fixedFour = opening.filter(card => card.kind !== "entrance");
  const ids = new Set(fixedFour.map(card => card.id));
  const fifth = replacements.find(card => card.kind === "move" && card.requiresLocation !== "ringside" && !ids.has(card.id))
    ?? replacements.find(card => card.kind === "move" && card.requiresLocation !== "ringside")
    ?? fixedFour.find(card => card.kind === "move");
  if (!entrance || fixedFour.length !== 4 || !fifth) throw new Error(`Invalid linked opening package for ${superstarId ?? "unknown Superstar"}`);
  const deck = [...fixedFour, fifth, ...tailGroups.flat()];
  if (deck.length !== 55) throw new Error(`Playable deck must contain 55 pages, got ${deck.length}`);
  const counts = new Map();
  for (const card of deck) counts.set(card.id, (counts.get(card.id) ?? 0) + 1);
  let defensiveSeen = 0, replacementIndex = 0;
  for (let i = 5; i < deck.length; i += 1) {
    if (!(deck[i].kind === "move" && deck[i].defensiveOnly)) continue;
    defensiveSeen += 1;
    if (defensiveSeen <= 3 || !replacements.length) continue;
    let attempts = 0;
    while (attempts < replacements.length) {
      const replacement = replacements[replacementIndex++ % replacements.length];
      attempts += 1;
      if ((counts.get(replacement.id) ?? 0) >= 5) continue;
      counts.set(deck[i].id, (counts.get(deck[i].id) ?? 1) - 1);
      counts.set(replacement.id, (counts.get(replacement.id) ?? 0) + 1);
      deck[i] = replacement;
      break;
    }
  }
  // Standard starter decks should not be clogged by Moves that are legal only
  // at ringside. Those cards remain collectible/custom-deck legal and are ideal
  // for Falls Count Anywhere / ringside-focused builds, but ordinary Moves are
  // already playable outside in standard matches. Replace any ringside-only Move
  // in a starter with a broadly playable tactical Move, preferring the same method.
  for (let i = 5; i < deck.length; i += 1) {
    const current = deck[i];
    if (!(current.kind === "move" && current.requiresLocation === "ringside")) continue;
    const candidates = replacements.filter(card => !(card.requiresLocation === "ringside") && card.kind === "move");
    const ordered = [...candidates].sort((a, b) => Number(b.method === current.method) - Number(a.method === current.method));
    for (const replacement of ordered) {
      if ((counts.get(replacement.id) ?? 0) >= 5) continue;
      counts.set(current.id, (counts.get(current.id) ?? 1) - 1);
      counts.set(replacement.id, (counts.get(replacement.id) ?? 0) + 1);
      deck[i] = replacement;
      break;
    }
  }
  // Keep standard starters offense-forward. Telemetry showed too many Control
  // turns with no Move in hand. Preserve tactical identity, but trim surplus
  // utility once minimum packages are met: 13 Momentum, 3 Actions, 3 Supports.
  const kindCount = kind => deck.filter(card => card.kind === kind).length;
  const replaceOneUtility = () => {
    const priorities = [
      card => card.kind === "support" && kindCount("support") > 3,
      card => card.kind === "action" && kindCount("action") > 3,
      card => card.kind === "momentum" && kindCount("momentum") > 13
    ];
    for (const eligible of priorities) {
      const index = deck.findIndex((card, i) => i >= 5 && eligible(card));
      if (index < 0) continue;
      const current = deck[index];
      for (const replacement of replacements) {
        if (replacement.kind !== "move" || replacement.requiresLocation === "ringside") continue;
        if ((counts.get(replacement.id) ?? 0) >= 5) continue;
        counts.set(current.id, (counts.get(current.id) ?? 1) - 1);
        counts.set(replacement.id, (counts.get(replacement.id) ?? 0) + 1);
        deck[index] = replacement;
        return true;
      }
    }
    return false;
  };
  const offenseFloor = superstarId === "the-rock" ? 31 : 32;
  while (deck.filter(card => card.kind === "move").length < offenseFloor && replaceOneUtility()) {}

  const overCap = [...counts.entries()].filter(([, count]) => count > 5);
  if (overCap.length) throw new Error(`Deck exceeds five-copy cap: ${overCap.map(([id,c]) => `${id} x${c}`).join(", ")}`);
  return deck;
};

// SummerSlam — Series 1 expanded-pool recommended decks.
// Fixed Lead Off five: two Momentum + three playable offensive/counter Moves.
// The linked Entrance sits on the Superstar card and is not part of the 55-page deck.
// Remaining 50 shuffle. Decks deliberately use broad move variety rather than relying on 4–6 copies of a handful of attacks.
export const decks = {
  "cody-rhodes": buildDeck(
    [cards.codyEntrance, M.technical, M.strike, cards.codyPowerslam, cards.codyDropDownPunch],
    [
      copies(M.technical, 4), copies(M.agility, 4), copies(M.strike, 3), copies(M.strength, 1),
      copies(cards.dodge, 2), copies(cards.duck, 1), copies(cards.reversal, 2), copies(cards.scramble, 1),
      copies(cards.shoulderUp, 1), copies(cards.desperationCounter, 1),
      copies(cards.gamePlan, 1), copies(cards.createOpening, 1), copies(cards.fireUp, 1), copies(cards.catchBreath, 1),
      copies(cards.ringGeneralship, 1), copies(cards.crowdConnection, 1), copies(cards.fightingSpirit, 1),
      copies(cards.codyDropDownPunch, 1), copies(cards.disasterKick, 1), copies(cards.codyPowerslam, 2), copies(cards.bionicElbow, 2),
      copies(cards.codyCutter, 2), copies(cards.codyMoonsault, 1), copies(cards.codySpear, 1), copies(cards.runningForearm, 1),
      copies(cards.codySuicideDive, 1), copies(cards.crossRhodes, 2), copies(cards.armDrag, 1),
      copies(cards.armDrag, 1), copies(cards.dropkick, 1), copies(cards.ddt, 1), copies(cards.snapSuplex, 1),
      copies(cards.flyingClothesline, 1), copies(cards.neckbreaker, 1), copies(cards.runningForearm, 1), copies(cards.throwOverRopes, 1)
    ]
  ),

  "cm-punk": buildDeck(
    [cards.punkEntrance, M.technical, M.strike, cards.punkSnapSuplex, cards.punkRoundhouse],
    [
      copies(M.technical, 4), copies(M.strike, 4), copies(M.agility, 4),
      copies(cards.reversal, 2), copies(cards.scramble, 2), copies(cards.dodge, 1), copies(cards.duck, 1),
      copies(cards.shoulderUp, 1), copies(cards.desperationCounter, 1),
      copies(cards.fireUp, 1), copies(cards.gamePlan, 1), copies(cards.catchBreath, 1), copies(cards.createOpening, 1),
      copies(cards.ringGeneralship, 1), copies(cards.scoutingReport, 1), copies(cards.fightingSpirit, 1),
      copies(cards.punkLegLariat, 2), copies(cards.punkRoundhouse, 2), copies(cards.punkSnapSuplex, 2), copies(cards.runningKnee, 2),
      copies(cards.punkNeckbreaker, 2), copies(cards.punkBulldog, 1), copies(cards.punkHighKick, 1), copies(cards.anacondaVise, 2), copies(cards.gts, 2), copies(cards.runningForearm, 1),
      copies(cards.sideHeadlock, 1), copies(cards.snapmare, 1), copies(cards.runningForearm, 1), copies(cards.ddt, 1), copies(cards.armbar, 1), copies(cards.neckbreaker, 1)
    ]
  ),

  "roman-reigns": buildDeck(
    [cards.romanEntrance, M.strength, M.strike, cards.romanUppercut, cards.driveBy],
    [
      copies(M.strength, 4), copies(M.strike, 4), copies(M.technical, 4),
      copies(cards.dodge, 1), copies(cards.duck, 2), copies(cards.reversal, 2), copies(cards.scramble, 1),
      copies(cards.shoulderUp, 1), copies(cards.desperationCounter, 1),
      copies(cards.fireUp, 1), copies(cards.gamePlan, 1), copies(cards.catchBreath, 1), copies(cards.createOpening, 1),
      copies(cards.ringGeneralship, 1), copies(cards.fightingSpirit, 1), copies(cards.crowdConnection, 1),
      copies(cards.romanUppercut, 2), copies(cards.driveBy, 2), copies(cards.romanClothesline, 3), copies(cards.uranage, 1),
      copies(cards.samoanDrop, 1), copies(cards.supermanPunch, 1), copies(cards.romanDriveByRingside, 1),
      copies(cards.guillotine, 2), copies(cards.spear, 3),
      copies(cards.shoulderTackle, 2), copies(cards.bigBoot, 2), copies(cards.jab, 1), copies(cards.spinebuster, 1), copies(cards.throwOverRopes, 1)
    ]
  ),

  "seth-rollins": buildDeck(
    [cards.sethEntrance, M.agility, M.strike, cards.sethSuperkick, cards.slingBlade],
    [
      copies(M.agility, 4), copies(M.strike, 4), copies(M.technical, 4),
      copies(cards.dodge, 2), copies(cards.duck, 1), copies(cards.reversal, 2), copies(cards.scramble, 1),
      copies(cards.shoulderUp, 1), copies(cards.desperationCounter, 1),
      copies(cards.gamePlan, 1), copies(cards.createOpening, 1), copies(cards.fireUp, 1), copies(cards.catchBreath, 1),
      copies(cards.ringGeneralship, 1), copies(cards.crowdConnection, 1), copies(cards.scoutingReport, 1),
      copies(cards.sethSuperkick, 1), copies(cards.slingBlade, 2), copies(cards.enzuigiri, 1), copies(cards.sethSuicideDive, 1),
      copies(cards.sethSpringboardKnee, 1), copies(cards.falconArrow, 1), copies(cards.sethRipcordKnee, 1), copies(cards.pedigree, 1),
      copies(cards.stomp, 3), copies(cards.dropkick, 1), copies(cards.sethSuperplexFalcon, 2),
      copies(cards.jab, 1), copies(cards.dropkick, 1), copies(cards.runningKneeCommon, 1), copies(cards.snapSuplex, 1), copies(cards.runningForearm, 1), copies(cards.superkick, 1), copies(cards.flyingClothesline, 1), copies(cards.throwOverRopes, 1)
    ]
  ),

  "oba-femi": buildDeck(
    [cards.obaEntrance, M.strength, M.strike, cards.obaShoulderBlock, cards.obaLariat],
    [
      copies(M.strength, 4), copies(M.strike, 4), copies(M.technical, 4),
      copies(cards.dodge, 1), copies(cards.duck, 1), copies(cards.reversal, 2), copies(cards.scramble, 2),
      copies(cards.shoulderUp, 1), copies(cards.desperationCounter, 1),
      copies(cards.fireUp, 1), copies(cards.gamePlan, 1), copies(cards.catchBreath, 1), copies(cards.createOpening, 1),
      copies(cards.ringGeneralship, 1), copies(cards.fightingSpirit, 1), copies(cards.crowdConnection, 1),
      copies(cards.obaShoulderBlock, 1), copies(cards.obaLariat, 1), copies(cards.obaRunningUppercut, 2), copies(cards.obaSpinebuster, 2),
      copies(cards.obaBackbreaker, 2), copies(cards.obaChokeslam, 2), copies(cards.obaPowerbomb, 2), copies(cards.obaPopUpPowerbomb, 1), copies(cards.fallFromGrace, 3),
      copies(cards.bodyslam, 1), copies(cards.bigBoot, 1), copies(cards.powerslam, 1), copies(cards.spinebuster, 1), copies(cards.shoulderTackle, 1), copies(cards.ringsideSlam, 1), copies(cards.throwOverRopes, 1)
    ]
  ),

  "brock-lesnar": buildDeck(
    [cards.brockEntrance, M.strength, M.technical, cards.germanSuplex, cards.bellyToBelly],
    [
      copies(M.strength, 4), copies(M.technical, 4), copies(M.strike, 4),
      copies(cards.dodge, 1), copies(cards.duck, 1), copies(cards.reversal, 2), copies(cards.scramble, 2),
      copies(cards.shoulderUp, 1), copies(cards.desperationCounter, 1),
      copies(cards.fireUp, 1), copies(cards.gamePlan, 1), copies(cards.catchBreath, 1), copies(cards.createOpening, 1),
      copies(cards.ringGeneralship, 1), copies(cards.fightingSpirit, 1), copies(cards.crowdConnection, 1),
      copies(cards.brockKneeStrike, 3), copies(cards.germanSuplex, 1), copies(cards.bellyToBelly, 2), copies(cards.brockOverheadBelly, 1),
      copies(cards.brockClothesline, 3), copies(cards.brockTripleGermans, 1), copies(cards.brockPowerbomb, 1), copies(cards.kimuraLock, 2), copies(cards.f5, 2),
      copies(cards.shoulderTackle, 1), copies(cards.germanSuplexCommon, 1), copies(cards.bellyToBellyCommon, 1), copies(cards.powerbomb, 1), copies(cards.clothesline, 1), copies(cards.ringsideSlam, 1), copies(cards.throwOverRopes, 1)
    ]
  ),

  "kevin-owens": buildDeck(
    [cards.owensEntrance, M.strike, M.strength, cards.owensForearm, cards.owensSuperkick],
    [
      copies(M.strike, 4), copies(M.strength, 4), copies(M.technical, 4),
      copies(cards.dodge, 1), copies(cards.duck, 2), copies(cards.reversal, 2), copies(cards.scramble, 1),
      copies(cards.shoulderUp, 1), copies(cards.desperationCounter, 1),
      copies(cards.fireUp, 1), copies(cards.gamePlan, 1), copies(cards.catchBreath, 1), copies(cards.createOpening, 1),
      copies(cards.ringGeneralship, 1), copies(cards.fightingSpirit, 1), copies(cards.crowdConnection, 1),
      copies(cards.owensForearm, 2), copies(cards.owensSuperkick, 2), copies(cards.owensDDT, 2), copies(cards.senton, 1), copies(cards.cannonball, 2),
      copies(cards.popUpPowerbomb, 2), copies(cards.owensPackagePiledriver, 1), copies(cards.koStunner, 2), copies(cards.runningForearm, 1),
      copies(cards.clothesline, 1), copies(cards.superkick, 1), copies(cards.powerbomb, 1), copies(cards.lariat, 1), copies(cards.ddt, 1), copies(cards.neckbreaker, 1), copies(cards.runningForearm, 1), copies(cards.ringsideClothesline, 1)
    ]
  ),

  "gunther": buildDeck(
    [cards.guntherEntrance, M.strike, M.strength, cards.guntherBigBoot, cards.guntherChop],
    [
      copies(M.strike, 4), copies(M.strength, 4), copies(M.technical, 4),
      copies(cards.dodge, 1), copies(cards.duck, 1), copies(cards.reversal, 2), copies(cards.scramble, 2),
      copies(cards.shoulderUp, 1), copies(cards.desperationCounter, 1),
      copies(cards.fireUp, 1), copies(cards.gamePlan, 1), copies(cards.catchBreath, 1), copies(cards.createOpening, 1),
      copies(cards.ringGeneralship, 1), copies(cards.fightingSpirit, 1), copies(cards.crowdConnection, 1),
      copies(cards.guntherBigBoot, 2), copies(cards.guntherChop, 3), copies(cards.guntherLariat, 2), copies(cards.guntherGerman, 1),
      copies(cards.guntherButterflySuplex, 1), copies(cards.guntherPowerbomb, 1), copies(cards.guntherBostonCrab, 1), copies(cards.sleeperHold, 3),
      copies(cards.uppercut, 1), copies(cards.bigBoot, 1), copies(cards.lariat, 1), copies(cards.germanSuplexCommon, 1), copies(cards.powerbomb, 1), copies(cards.backbreaker, 1), copies(cards.bostonCrab, 1), copies(cards.jab, 1), copies(cards.runningKneeCommon, 1)
    ]
  )
,
  "hulk-hogan": buildDeck(
    [hallCards.hoganEntrance, HM.strength, HM.strike, hallCards.hoganPunches, hallCards.hoganBodyslam],
    [
      copies(HM.strength,4), copies(HM.strike,4), copies(HM.technical,4),
      copies(hallCards.dodge,2), copies(hallCards.duck,2), copies(hallCards.reversal,2), copies(hallCards.scramble,1),
      copies(hallCards.hofShoulderUp,1), copies(hallCards.hofDesperationCounter,1),
      [hallCards.rallyCrowd,hallCards.catchSecondWind,hallCards.veteranGamePlan,hallCards.openingCreated,hallCards.crowdRoar,hallCards.veteranSavvy,hallCards.ironWill,hallCards.ringAwareness],
      copies(hallCards.hoganPunches,1), copies(hallCards.hoganAxeBomber,2), copies(hallCards.hoganBackRake,1), copies(hallCards.hoganBodyslam,2), copies(hallCards.hoganBigBoot,2),
      copies(hallCards.hoganRunningClothesline,1), copies(hallCards.hoganSuplex,1), copies(hallCards.hoganBearhug,1), copies(hallCards.hoganLegDrop,3), copies(hallCards.hoganThreePunch,1),
      [hallCards.clothesline,hallCards.bigBoot,hallCards.bodyslam,hallCards.powerslam,hallCards.throwOutside,hallCards.ringsideClothesline]
    ]
  ),
  "andre-the-giant": buildDeck(
    [hallCards.andreEntrance, HM.strength, HM.strike, hallCards.andreChop, hallCards.andreBodyslam],
    [
      copies(HM.strength,4), copies(HM.strike,4), copies(HM.technical,4),
      copies(hallCards.dodge,1), copies(hallCards.duck,1), copies(hallCards.reversal,3), copies(hallCards.scramble,2),
      copies(hallCards.hofShoulderUp,1), copies(hallCards.hofDesperationCounter,1),
      [hallCards.rallyCrowd,hallCards.catchSecondWind,hallCards.veteranGamePlan,hallCards.openingCreated,hallCards.crowdRoar,hallCards.veteranSavvy,hallCards.ironWill,hallCards.bobbyHeenan],
      copies(hallCards.andreChop,1), copies(hallCards.andreHeadbutt,3), copies(hallCards.andreClub,1), copies(hallCards.andreBoot,1), copies(hallCards.andreBearhug,2),
      copies(hallCards.andreBodyslam,2), copies(hallCards.andreSitDown,1), copies(hallCards.andreHeadVice,1), copies(hallCards.andreButterfly,1), copies(hallCards.andreElbowDrop,2),
      [hallCards.bodyslam,hallCards.bigBoot,hallCards.bearhug,hallCards.powerslam,hallCards.spinebuster,hallCards.sideSlam]
    ]
  ),
  "randy-savage": buildDeck(
    [hallCards.savageEntrance, HM.agility, HM.strike, hallCards.savageJab, hallCards.savageAxeHandle],
    [
      copies(HM.agility,4), copies(HM.strike,4), copies(HM.technical,4),
      copies(hallCards.dodge,2), copies(hallCards.duck,2), copies(hallCards.reversal,2), copies(hallCards.scramble,1),
      copies(hallCards.hofShoulderUp,1), copies(hallCards.hofDesperationCounter,1),
      [hallCards.rallyCrowd,hallCards.catchSecondWind,hallCards.veteranGamePlan,hallCards.openingCreated,hallCards.crowdRoar,hallCards.veteranSavvy,hallCards.ironWill,hallCards.missElizabeth],
      copies(hallCards.savageJab,1), copies(hallCards.savageAxeHandle,2), copies(hallCards.savageNeckbreaker,2), copies(hallCards.savageKneeDrop,1), copies(hallCards.savageHotshot,1),
      copies(hallCards.savageSuplex,1), copies(hallCards.savageCrossbody,1), copies(hallCards.savageElbowSmash,1), copies(hallCards.savagePiledriver,1), copies(hallCards.savageElbow,3),
      [hallCards.dropkick,hallCards.flyingClothesline,hallCards.divingCrossbody,hallCards.flyingElbow,hallCards.neckbreaker,hallCards.ddt,hallCards.snapmare]
    ]
  ),
  "ultimate-warrior": buildDeck(
    [hallCards.warriorEntrance, HM.strength, HM.strike, hallCards.warriorPunch, hallCards.warriorShoulder],
    [
      copies(HM.strength,4), copies(HM.strike,4), copies(HM.agility,4),
      copies(hallCards.dodge,2), copies(hallCards.duck,2), copies(hallCards.reversal,2), copies(hallCards.scramble,1),
      copies(hallCards.hofShoulderUp,1), copies(hallCards.hofDesperationCounter,1),
      [hallCards.rallyCrowd,hallCards.catchSecondWind,hallCards.veteranGamePlan,hallCards.openingCreated,hallCards.crowdRoar,hallCards.veteranSavvy,hallCards.ironWill,hallCards.ringAwareness],
      copies(hallCards.warriorPunch,1), copies(hallCards.warriorClothesline,2), copies(hallCards.warriorShoulder,2), copies(hallCards.warriorPress,2), copies(hallCards.warriorBearhug,1),
      copies(hallCards.warriorPowerslam,1), copies(hallCards.warriorBigBoot,1), copies(hallCards.warriorSuplex,1), copies(hallCards.warriorSplash,3), copies(hallCards.warriorPressDrop,1),
      [hallCards.shoulderTackle,hallCards.clothesline,hallCards.bigBoot,hallCards.bodyslam,hallCards.militaryPress,hallCards.powerslam]
    ]
  ),
  "stone-cold-steve-austin": buildDeck(
    [hallCards.austinEntrance, HM.strike, HM.strength, hallCards.austinPunch, hallCards.austinKickGut],
    [
      copies(HM.strike,4), copies(HM.strength,3), copies(HM.technical,5),
      copies(hallCards.dodge,2), copies(hallCards.duck,2), copies(hallCards.reversal,2), copies(hallCards.scramble,1),
      copies(hallCards.hofShoulderUp,1), copies(hallCards.hofDesperationCounter,1),
      [hallCards.rallyCrowd,hallCards.catchSecondWind,hallCards.veteranGamePlan,hallCards.openingCreated,hallCards.crowdRoar,hallCards.veteranSavvy,hallCards.ironWill,hallCards.ringAwareness],
      copies(hallCards.austinPunch,1), copies(hallCards.austinClothesline,2), copies(hallCards.austinElbow,1), copies(hallCards.austinSpinebuster,1), copies(hallCards.austinSuplex,1),
      copies(hallCards.austinMudhole,1), copies(hallCards.austinLouThesz,2), copies(hallCards.austinMillionDollarDream,1), copies(hallCards.austinKickGut,2), copies(hallCards.austinStunner,2), copies(hallCards.bodyPunch,1),
      [hallCards.jab,hallCards.clothesline,hallCards.forearm,hallCards.spinebuster,hallCards.ddt,hallCards.throwOutside]
    ]
  ),
  "the-undertaker": buildDeck(
    [hallCards.undertakerEntrance, HM.strength, HM.strike, hallCards.takerPunch, hallCards.takerBigBoot],
    [
      copies(HM.strength,4), copies(HM.strike,4), copies(HM.technical,4),
      copies(hallCards.dodge,2), copies(hallCards.duck,1), copies(hallCards.reversal,2), copies(hallCards.scramble,2),
      copies(hallCards.hofShoulderUp,1), copies(hallCards.hofDesperationCounter,1),
      [hallCards.rallyCrowd,hallCards.catchSecondWind,hallCards.veteranGamePlan,hallCards.openingCreated,hallCards.crowdRoar,hallCards.veteranSavvy,hallCards.ironWill,hallCards.paulBearer],
      copies(hallCards.takerPunch,1), copies(hallCards.takerBigBoot,2), copies(hallCards.takerOldSchool,1), copies(hallCards.takerFlyingClothesline,1), copies(hallCards.takerLegDrop,1),
      copies(hallCards.takerChokeslam,1), copies(hallCards.takerSnakeEyes,1), copies(hallCards.takerLastRide,1), copies(hallCards.takerHellGate,1), copies(hallCards.takerTombstone,3), copies(hallCards.uppercut,1),
      [hallCards.bigBoot,hallCards.clothesline,hallCards.forearm,hallCards.powerbomb,hallCards.piledriver,hallCards.sleeper,hallCards.headlock]
    ]
  ),
  "mankind": buildDeck(
    [hallCards.mankindEntrance, HM.technical, HM.strike, hallCards.mankindPunch, hallCards.mankindNeckbreaker],
    [
      copies(HM.technical,4), copies(HM.strike,4), copies(HM.strength,2),
      copies(hallCards.dodge,1), copies(hallCards.duck,1), copies(hallCards.reversal,3), copies(hallCards.scramble,2),
      copies(hallCards.hofShoulderUp,1), copies(hallCards.hofDesperationCounter,1),
      [hallCards.rallyCrowd,hallCards.catchSecondWind,hallCards.veteranGamePlan,hallCards.openingCreated,hallCards.crowdRoar,hallCards.veteranSavvy,hallCards.ironWill,hallCards.ringAwareness],
      copies(hallCards.mankindPunch,2), copies(hallCards.mankindKnee,2), copies(hallCards.mankindNeckbreaker,1), copies(hallCards.mankindElbow,1), copies(hallCards.suplexRingside,1),
      copies(hallCards.mankindBulldog,1), copies(hallCards.mankindPiledriver,1), copies(hallCards.mankindDoubleArm,1), copies(hallCards.mankindSocko,1), copies(hallCards.mankindClaw,2), copies(hallCards.forearm,1), copies(hallCards.headlock,1),
      [hallCards.ddt,hallCards.neckbreaker,hallCards.snapmare,hallCards.bulldog,hallCards.sleeper,hallCards.forearm,hallCards.ringsideClothesline,hallCards.throwOutside]
    ]
  ),
  "kane": buildDeck(
    [hallCards.kaneEntrance, HM.strength, HM.strike, hallCards.kaneUppercut, hallCards.kaneSidewalk],
    [
      copies(HM.strength,4), copies(HM.strike,4), copies(HM.agility,4),
      copies(hallCards.dodge,1), copies(hallCards.duck,2), copies(hallCards.reversal,2), copies(hallCards.scramble,2),
      copies(hallCards.hofShoulderUp,1), copies(hallCards.hofDesperationCounter,1),
      [hallCards.rallyCrowd,hallCards.catchSecondWind,hallCards.veteranGamePlan,hallCards.openingCreated,hallCards.crowdRoar,hallCards.veteranSavvy,hallCards.ironWill,hallCards.paulBearer],
      copies(hallCards.kaneUppercut,1), copies(hallCards.kaneBigBoot,2), copies(hallCards.kaneClothesline,3), copies(hallCards.kaneSidewalk,2), copies(hallCards.kaneFlyingClothesline,1),
      copies(hallCards.kanePowerbomb,1), copies(hallCards.kaneChokeslam,2), copies(hallCards.kaneBearhug,1), copies(hallCards.kaneTombstone,2), copies(hallCards.kaneTiltWhirl,1),
      [hallCards.bigBoot,hallCards.clothesline,hallCards.sideSlam,hallCards.powerbomb,hallCards.bodyslam]
    ]
  )
,

  // Evolution — Series 1 recommended decks. Each is a self-contained 55-card
  // starter using only Evolution cards, with 14 Momentum, eight utility pages,
  // a compact defensive package and a wrestler-exclusive finishing suite.
  "rhea-ripley": buildDeck(
    [evolutionCards.rheaEntrance, EM.strength, EM.strike, evolutionCards.rheaShortArmClothesline, evolutionCards.rheaHeadbutt],
    [
      copies(EM.strength, 4), copies(EM.strike, 4), copies(EM.technical, 3), copies(EM.agility, 1),
      copies(evolutionCards.dodge, 2), copies(evolutionCards.duck, 2), copies(evolutionCards.scramble, 2),
      copies(evolutionCards.evolutionKickout, 1), copies(evolutionCards.evolutionCounter, 1),
      copies(evolutionCards.seizeMoment, 1), copies(evolutionCards.regroup, 1), copies(evolutionCards.changePace, 1), copies(evolutionCards.openingStrike, 1),
      copies(evolutionCards.crowdEnergy, 1), copies(evolutionCards.ringIQ, 1), copies(evolutionCards.fightingHeart, 1), copies(evolutionCards.counterTiming, 1),
      copies(evolutionCards.riptide, 3), copies(evolutionCards.prismTrap, 2), copies(evolutionCards.rheaRazorEdge, 2), copies(evolutionCards.rheaPowerbomb, 2),
      copies(evolutionCards.rheaGerman, 1), copies(evolutionCards.rheaRipcordKnee, 1), copies(evolutionCards.rheaElectricChair, 1), copies(evolutionCards.rheaDropkick, 1), copies(evolutionCards.rheaCannonball, 1),
      copies(evolutionCards.clothesline, 1), copies(evolutionCards.bigBoot, 1), copies(evolutionCards.powerslam, 1), copies(evolutionCards.forearmSmash, 1), copies(evolutionCards.backbreaker, 1), copies(evolutionCards.spinebuster, 1), copies(evolutionCards.runningKnee, 1), copies(evolutionCards.neckbreaker, 1)
    ]
  ),

  "liv-morgan": buildDeck(
    [evolutionCards.livEntrance, EM.agility, EM.strike, evolutionCards.livEnzuigiri, evolutionCards.livDoubleKnees],
    [
      copies(EM.agility, 4), copies(EM.strike, 4), copies(EM.technical, 4),
      copies(evolutionCards.dodge, 2), copies(evolutionCards.duck, 2), copies(evolutionCards.scramble, 2),
      copies(evolutionCards.evolutionKickout, 1), copies(evolutionCards.evolutionCounter, 1),
      copies(evolutionCards.seizeMoment, 1), copies(evolutionCards.regroup, 1), copies(evolutionCards.changePace, 1), copies(evolutionCards.openingStrike, 1),
      copies(evolutionCards.crowdEnergy, 1), copies(evolutionCards.ringIQ, 1), copies(evolutionCards.fightingHeart, 1), copies(evolutionCards.counterTiming, 1),
      copies(evolutionCards.oblivion, 3), copies(evolutionCards.livCodebreaker, 2), copies(evolutionCards.livSunsetBomb, 2), copies(evolutionCards.livRings, 2),
      copies(evolutionCards.livMissileDropkick, 1), copies(evolutionCards.livHurricanrana, 1), copies(evolutionCards.livDDT, 1), copies(evolutionCards.livFacebuster, 1), copies(evolutionCards.livSpringboardKnee, 1),
      copies(evolutionCards.dropkick, 1), copies(evolutionCards.enzuigiri, 1), copies(evolutionCards.armDrag, 1), copies(evolutionCards.hurricanrana, 1), copies(evolutionCards.superkick, 1), copies(evolutionCards.facebuster, 1), copies(evolutionCards.springboardDropkick, 1), copies(evolutionCards.neckbreaker, 1)
    ]
  ),

  "becky-lynch": buildDeck(
    [evolutionCards.beckyEntrance, EM.technical, EM.strike, evolutionCards.beckyUppercut, evolutionCards.beckyForearm],
    [
      copies(EM.technical, 4), copies(EM.strike, 4), copies(EM.strength, 3), copies(EM.agility, 1),
      copies(evolutionCards.dodge, 2), copies(evolutionCards.duck, 2), copies(evolutionCards.scramble, 2),
      copies(evolutionCards.evolutionKickout, 1), copies(evolutionCards.evolutionCounter, 1),
      copies(evolutionCards.seizeMoment, 1), copies(evolutionCards.regroup, 1), copies(evolutionCards.changePace, 1), copies(evolutionCards.openingStrike, 1),
      copies(evolutionCards.crowdEnergy, 1), copies(evolutionCards.ringIQ, 1), copies(evolutionCards.fightingHeart, 1), copies(evolutionCards.counterTiming, 1),
      copies(evolutionCards.manhandleSlam, 3), copies(evolutionCards.disarmher, 2), copies(evolutionCards.beckyExploder, 2), copies(evolutionCards.beckyDiscusForearm, 2),
      copies(evolutionCards.beckyLegDrop, 1), copies(evolutionCards.beckyMissileDropkick, 1), copies(evolutionCards.beckyReverseDDT, 1), copies(evolutionCards.beckySpringboardKick, 1), copies(evolutionCards.beckyArmDrag, 1),
      copies(evolutionCards.europeanUppercut, 1), copies(evolutionCards.armDrag, 1), copies(evolutionCards.snapSuplex, 1), copies(evolutionCards.forearmSmash, 1), copies(evolutionCards.exploderSuplex, 1), copies(evolutionCards.ddt, 1), copies(evolutionCards.crossface, 1), copies(evolutionCards.neckbreaker, 1)
    ]
  ),

  bayley: buildDeck(
    [evolutionCards.bayleyEntrance, EM.technical, EM.agility, evolutionCards.bayleyRunningKnee, evolutionCards.bayleySuplex],
    [
      copies(EM.technical, 4), copies(EM.agility, 4), copies(EM.strike, 3), copies(EM.strength, 1),
      copies(evolutionCards.dodge, 2), copies(evolutionCards.duck, 2), copies(evolutionCards.scramble, 2),
      copies(evolutionCards.evolutionKickout, 1), copies(evolutionCards.evolutionCounter, 1),
      copies(evolutionCards.seizeMoment, 1), copies(evolutionCards.regroup, 1), copies(evolutionCards.changePace, 1), copies(evolutionCards.openingStrike, 1),
      copies(evolutionCards.crowdEnergy, 1), copies(evolutionCards.ringIQ, 1), copies(evolutionCards.fightingHeart, 1), copies(evolutionCards.counterTiming, 1),
      copies(evolutionCards.rosePlant, 3), copies(evolutionCards.bayleyToBelly, 2), copies(evolutionCards.bayleyElbowDrop, 2), copies(evolutionCards.bayleySunsetBomb, 2),
      copies(evolutionCards.bayleySlidingClothesline, 1), copies(evolutionCards.bayleyBackSuplex, 1), copies(evolutionCards.bayleyMiddleElbow, 1), copies(evolutionCards.bayleyKneeDrop, 1), copies(evolutionCards.bayleyDDT, 1),
      copies(evolutionCards.armDrag, 1), copies(evolutionCards.dropkick, 1), copies(evolutionCards.snapSuplex, 1), copies(evolutionCards.runningKnee, 1), copies(evolutionCards.neckbreaker, 1), copies(evolutionCards.divingElbow, 1), copies(evolutionCards.facebuster, 1), copies(evolutionCards.armDrag, 1)
    ]
  ),

  "charlotte-flair": buildDeck(
    [evolutionCards.charlotteEntrance, EM.agility, EM.strike, evolutionCards.charlotteChops, evolutionCards.charlotteBigBoot],
    [
      copies(EM.agility, 3), copies(EM.strength, 3), copies(EM.technical, 5), copies(EM.strike, 1),
      copies(evolutionCards.dodge, 2), copies(evolutionCards.duck, 2), copies(evolutionCards.scramble, 2),
      copies(evolutionCards.evolutionKickout, 1), copies(evolutionCards.evolutionCounter, 1),
      copies(evolutionCards.seizeMoment, 1), copies(evolutionCards.regroup, 1), copies(evolutionCards.changePace, 1), copies(evolutionCards.openingStrike, 1),
      copies(evolutionCards.crowdEnergy, 1), copies(evolutionCards.ringIQ, 1), copies(evolutionCards.fightingHeart, 1), copies(evolutionCards.counterTiming, 1),
      copies(evolutionCards.figureEight, 3), copies(evolutionCards.naturalSelection, 2), copies(evolutionCards.charlotteSpear, 2), copies(evolutionCards.charlotteMoonsault, 2),
      copies(evolutionCards.charlotteExploder, 1), copies(evolutionCards.charlotteNeckbreaker, 1), copies(evolutionCards.charlottePowerbomb, 1), copies(evolutionCards.charlotteFallaway, 1), copies(evolutionCards.charlotteFigureFour, 1),
      copies(evolutionCards.knifeEdgeChop, 1), copies(evolutionCards.bigBoot, 1), copies(evolutionCards.spear, 1), copies(evolutionCards.exploderSuplex, 1), copies(evolutionCards.moonsault, 1), copies(evolutionCards.powerslam, 1), copies(evolutionCards.armbar, 1), copies(evolutionCards.backbreaker, 1)
    ]
  ),

  "iyo-sky": buildDeck(
    [evolutionCards.iyoEntrance, EM.agility, EM.technical, evolutionCards.iyoDropkick, evolutionCards.iyoMissileDropkick],
    [
      copies(EM.agility, 4), copies(EM.technical, 4), copies(EM.strike, 4),
      copies(evolutionCards.dodge, 2), copies(evolutionCards.duck, 2), copies(evolutionCards.scramble, 2),
      copies(evolutionCards.evolutionKickout, 1), copies(evolutionCards.evolutionCounter, 1),
      copies(evolutionCards.seizeMoment, 1), copies(evolutionCards.regroup, 1), copies(evolutionCards.changePace, 1), copies(evolutionCards.openingStrike, 1),
      copies(evolutionCards.crowdEnergy, 1), copies(evolutionCards.ringIQ, 1), copies(evolutionCards.fightingHeart, 1), copies(evolutionCards.counterTiming, 1),
      copies(evolutionCards.overTheMoonsault, 3), copies(evolutionCards.bulletTrain, 2), copies(evolutionCards.iyoPoisonRana, 2), copies(evolutionCards.iyoSpanishFly, 2),
      copies(evolutionCards.iyoDoubleStomp, 1), copies(evolutionCards.iyoGerman, 1), copies(evolutionCards.iyoSpringboardDropkick, 1), copies(evolutionCards.iyoSuicideDive, 1), copies(evolutionCards.iyoMeteora, 1),
      copies(evolutionCards.dropkick, 1), copies(evolutionCards.hurricanrana, 1), copies(evolutionCards.springboardDropkick, 1), copies(evolutionCards.enzuigiri, 1), copies(evolutionCards.doubleStomp, 1), copies(evolutionCards.suicideDive, 1), copies(evolutionCards.missileDropkick, 1), copies(evolutionCards.facebuster, 1)
    ]
  ),

  paige: buildDeck(
    [evolutionCards.paigeEntrance, EM.technical, EM.strike, evolutionCards.paigeSideKick, evolutionCards.paigeKneeStrikes],
    [
      copies(EM.technical, 4), copies(EM.strike, 4), copies(EM.strength, 4),
      copies(evolutionCards.dodge, 2), copies(evolutionCards.duck, 2), copies(evolutionCards.scramble, 2),
      copies(evolutionCards.evolutionKickout, 1), copies(evolutionCards.evolutionCounter, 1),
      copies(evolutionCards.seizeMoment, 1), copies(evolutionCards.regroup, 1), copies(evolutionCards.changePace, 1), copies(evolutionCards.openingStrike, 1),
      copies(evolutionCards.crowdEnergy, 1), copies(evolutionCards.ringIQ, 1), copies(evolutionCards.fightingHeart, 1), copies(evolutionCards.counterTiming, 1),
      copies(evolutionCards.ramPaige, 3), copies(evolutionCards.pto, 2), copies(evolutionCards.paigeTurner, 2), copies(evolutionCards.paigeCrossface, 2),
      copies(evolutionCards.paigeShortClothesline, 1), copies(evolutionCards.paigeCradleDDT, 1), copies(evolutionCards.paigeFallaway, 1), copies(evolutionCards.paigeSuperkick, 1), copies(evolutionCards.paigeFisherman, 1),
      copies(evolutionCards.armDrag, 1), copies(evolutionCards.forearmSmash, 1), copies(evolutionCards.ddt, 1), copies(evolutionCards.neckbreaker, 1), copies(evolutionCards.crossface, 1), copies(evolutionCards.europeanUppercut, 1), copies(evolutionCards.snapSuplex, 1), copies(evolutionCards.legSweep, 1)
    ]
  ),

  "stephanie-vaquer": buildDeck(
    [evolutionCards.stephanieEntrance, EM.technical, EM.strike, evolutionCards.vaquerDragonScrew, evolutionCards.vaquerRunningKnee],
    [
      copies(EM.technical, 4), copies(EM.strike, 4), copies(EM.agility, 3), copies(EM.strength, 1),
      copies(evolutionCards.dodge, 2), copies(evolutionCards.duck, 2), copies(evolutionCards.scramble, 2),
      copies(evolutionCards.evolutionKickout, 1), copies(evolutionCards.evolutionCounter, 1),
      copies(evolutionCards.seizeMoment, 1), copies(evolutionCards.regroup, 1), copies(evolutionCards.changePace, 1), copies(evolutionCards.openingStrike, 1),
      copies(evolutionCards.crowdEnergy, 1), copies(evolutionCards.ringIQ, 1), copies(evolutionCards.fightingHeart, 1), copies(evolutionCards.counterTiming, 1),
      copies(evolutionCards.svb, 3), copies(evolutionCards.devilsKiss, 2), copies(evolutionCards.vaquerInferno, 2), copies(evolutionCards.lastChancery, 2),
      copies(evolutionCards.vaquerDoubleKnees, 1), copies(evolutionCards.vaquerMeteora, 1), copies(evolutionCards.vaquerSnapSuplex, 1), copies(evolutionCards.vaquerBackbreaker, 1), copies(evolutionCards.vaquerCrossbody, 1),
      copies(evolutionCards.legSweep, 1), copies(evolutionCards.runningKnee, 1), copies(evolutionCards.snapSuplex, 1), copies(evolutionCards.forearmSmash, 1), copies(evolutionCards.doubleStomp, 1), copies(evolutionCards.crossface, 1), copies(evolutionCards.armDrag, 1), copies(evolutionCards.ddt, 1)
    ]
  ),
  "the-rock": buildDeck(
    [rockCards.entrance, rockCards.momentum.strength, rockCards.momentum.strike, rockCards.bodyShot, rockCards.shoulderBlock],
    [
      copies(rockCards.momentum.strength, 4), copies(rockCards.momentum.strike, 4), copies(rockCards.momentum.technical, 4),
      copies(rockCards.kickout, 2), copies(rockCards.counter, 2),
      copies(rockCards.eyebrow, 3), copies(rockCards.knowRole, 2), copies(rockCards.finalBossOrder, 3), copies(rockCards.crowd, 1),
      copies(rockCards.rockBottomFinalBoss, 3), copies(rockCards.peoplesElbowFinalBoss, 2), copies(rockCards.finalBossSpinebuster, 2), copies(rockCards.finalBossSharpshooter, 2),
      copies(rockCards.samoanDrop, 1), copies(rockCards.spinebuster, 2), copies(rockCards.snapDDT, 2), copies(rockCards.clothesline, 2),
      copies(rockCards.runningLariat, 1), copies(rockCards.powerslam, 2), copies(rockCards.gutbuster, 1), copies(rockCards.neckbreaker, 1),
      copies(rockCards.russianLegSweep, 2), copies(rockCards.cornerPunches, 2)
    ]
  )

};
