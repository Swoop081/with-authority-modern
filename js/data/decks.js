import { cards } from "./cards.js";
import { hallCards } from "./hall-of-fame-cards.js";

const M = cards.momentum;
const HM = hallCards.momentum;
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
  kane: [hallCards.bigBoot, hallCards.clothesline, hallCards.sideSlam, hallCards.bodyslam]
};

const buildDeck = (opening, tailGroups) => {
  const deck = [...opening, ...tailGroups.flat()];
  if (deck.length !== 55) throw new Error(`Deck must contain 55 pages, got ${deck.length}`);
  const superstarId = opening[0]?.superstarId;
  const replacements = tacticalOffense[superstarId] ?? [];
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
  const overCap = [...counts.entries()].filter(([, count]) => count > 5);
  if (overCap.length) throw new Error(`Deck exceeds five-copy cap: ${overCap.map(([id,c]) => `${id} x${c}`).join(", ")}`);
  return deck;
};

// SummerSlam — Series 1 expanded-pool recommended decks.
// Fixed opening five: Entrance + two Momentum + two immediately useful wrestler Moves.
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
      copies(cards.codySuicideDive, 1), copies(cards.crossRhodes, 3),
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
      copies(cards.punkNeckbreaker, 2), copies(cards.punkBulldog, 1), copies(cards.punkHighKick, 1), copies(cards.anacondaVise, 2), copies(cards.gts, 3),
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
      copies(cards.stomp, 4), copies(cards.sethSuperplexFalcon, 2),
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
      copies(cards.popUpPowerbomb, 2), copies(cards.owensPackagePiledriver, 1), copies(cards.koStunner, 3),
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
      copies(HM.strength,4), copies(HM.strike,3), copies(HM.technical,5),
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

};
