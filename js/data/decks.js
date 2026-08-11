import { cards } from "./cards.js";
import { hallCards } from "./hall-of-fame-cards.js";
import { evolutionCards } from "./evolution-cards.js";
import { rockCards } from "./season1-rock-cards.js";

const M = cards.momentum;
const copies = (card, count) => Array.from({ length: count }, () => card);

const reviewedDeck = (leadOff, tailGroups) => {
  const deck = [...leadOff, ...tailGroups.flat()];
  if (leadOff.length !== 5) throw new Error(`Reviewed Lead Off must contain 5 pages, got ${leadOff.length}`);
  if (deck.length !== 55) throw new Error(`Reviewed playable deck must contain 55 pages, got ${deck.length}`);
  return deck;
};

// SummerSlam — Series 1 expanded-pool recommended decks.
// Fixed Lead Off five: two Momentum + three playable offensive/counter Moves.
// The linked Entrance sits on the Superstar card and is not part of the 55-page deck.
// Remaining 50 shuffle. Decks deliberately use broad move variety rather than relying on 4–6 copies of a handful of attacks.
export const decks = {
  "cody-rhodes": reviewedDeck(
    [M.technical, M.strike, cards.codyPowerslam, cards.codyDropDownPunch, cards.armDrag],
    [
      copies(M.technical,4), copies(M.strike,4), copies(M.agility,4),
      copies(cards.chainWrestling,1), copies(cards.sidestep,1),
      copies(cards.codyFinishStory,1),
      [cards.gamePlan,cards.createOpening,cards.fireUp],
      [cards.crowdConnection],
      copies(cards.codyDropDownPunch,2), copies(cards.armDrag,1), copies(cards.hipToss,1), copies(cards.runningForearm,1), copies(cards.knifeEdgeChopCommon,1), copies(cards.dropkick,2),
      copies(cards.codyPowerslam,2), copies(cards.disasterKick,2), copies(cards.russianLegSweep,1), copies(cards.neckbreaker,1),
      copies(cards.flyingClothesline,3), copies(cards.alabamaSlam,3), copies(cards.bionicElbow,2),
      copies(cards.codyCutter,2), copies(cards.codyMoonsault,2), copies(cards.crossRhodes,2), copies(cards.snapSuplex,2), copies(cards.dropToeHold,1)
    ]
  ),

  "cm-punk": reviewedDeck(
    [M.technical, M.strike, cards.punkSnapSuplex, cards.punkRoundhouse, cards.sideHeadlock],
    [
      copies(M.technical,4), copies(M.strike,4), copies(M.agility,4),
      copies(cards.chainWrestling,1), copies(cards.duckStrike,1),
      copies(cards.bestInTheWorld,1),
      [cards.fireUp,cards.gamePlan,cards.createOpening],
      [cards.fightingSpirit],
      copies(cards.punkLegLariat,2), copies(cards.punkRoundhouse,2), copies(cards.punkSnapSuplex,2), copies(cards.runningKnee,2),
      copies(cards.punkNeckbreaker,1), copies(cards.punkBulldog,1), copies(cards.punkHighKick,1),
      copies(cards.shiningWizard,2), copies(cards.divingElbowDrop,1), copies(cards.elbowDrop,1), copies(cards.springboardClothesline,2),
      copies(cards.punkStepUpHighKnee,2), copies(cards.anacondaVise,1), copies(cards.gts,2), copies(cards.runningForearm,1),
      copies(cards.bulldog,1), copies(cards.snapmare,1), copies(cards.schoolboy,1), copies(cards.ddt,1), copies(cards.armbar,1), copies(cards.neckbreaker,1), copies(cards.dropkick,1), copies(cards.smallPackage,1)
    ]
  ),

  "roman-reigns": reviewedDeck(
    [M.strength, M.strike, cards.romanUppercut, cards.headbutt, cards.shoulderTackle],
    [
      copies(M.strength,4), copies(M.strike,4), copies(M.technical,3),
      copies(cards.noSell,1), copies(cards.duckStrike,1), copies(cards.chainWrestling,1),
      copies(cards.tribalChief,1),
      [cards.fireUp,cards.gamePlan,cards.createOpening],
      [cards.fightingSpirit,cards.crowdConnection],
      copies(cards.romanUppercut,2), copies(cards.headbutt,2), copies(cards.shoulderTackle,3), copies(cards.bigBoot,1), copies(cards.firemansCarry,1),
      copies(cards.leapingClothesline,2), copies(cards.driveBy,2), copies(cards.romanClothesline,1), copies(cards.irishWhip,1),
      copies(cards.samoanUranage,2), copies(cards.samoanDrop,3), copies(cards.spinebuster,2),
      copies(cards.romanCornerClotheslines,2), copies(cards.supermanPunch,2), copies(cards.guillotine,2), copies(cards.spear,2)
    ]
  ),

  "seth-rollins": reviewedDeck(
    [M.agility, M.strike, cards.sethSuperkick, cards.slingBlade, cards.dropkick],
    [
      copies(M.agility,4), copies(M.strike,4), copies(M.technical,4),
      copies(cards.sidestep,1), copies(cards.duckStrike,1), copies(cards.chainWrestling,1),
      copies(cards.sethVisionary,1),
      [cards.gamePlan,cards.createOpening,cards.fireUp],
      [cards.crowdConnection,cards.scoutingReport],
      copies(cards.superkick,2), copies(cards.slingBlade,2), copies(cards.dropkick,2), copies(cards.frontKick,1), copies(cards.enzuigiri,1),
      copies(cards.runningForearm,2), copies(cards.runningKneeCommon,1), copies(cards.kneeDrop,1), copies(cards.legDrop,1), copies(cards.snapSuplex,1), copies(cards.basicStomp,1), copies(cards.flyingClothesline,1),
      copies(cards.falconArrow,2), copies(cards.sethSpringboardKnee,2), copies(cards.sethRipcordKnee,1),
      copies(cards.sethBuckleBomb,2), copies(cards.pedigree,2), copies(cards.sethSuperplexFalcon,1),
      copies(cards.sethPhoenixSplashReviewed,1), copies(cards.stomp,2)
    ]
  ),

  "oba-femi": reviewedDeck(
    [M.strength, M.strike, cards.obaShoulderBlock, cards.obaLariat, cards.shoulderTackle],
    [
      copies(M.strength,4), copies(M.strike,4),
      copies(cards.noSell,2), copies(cards.duckStrike,1),
      copies(cards.obaDestroyer,1),
      [cards.fireUp,cards.gamePlan,cards.createOpening],
      [cards.fightingSpirit,cards.crowdConnection],
      copies(cards.shoulderTackle,3), copies(cards.obaLariat,2), copies(cards.obaRunningUppercut,2), copies(cards.obaRollingElbow,2),
      copies(cards.bodyslam,2), copies(cards.bigBoot,2), copies(cards.powerslam,2), copies(cards.sidewalkSlam,3),
      copies(cards.militaryPress,3), copies(cards.spinebuster,2), copies(cards.obaChokeslam,2), copies(cards.obaPowerbomb,3),
      copies(cards.obaPendulumBackbreaker,2), copies(cards.obaF10,2), copies(cards.fallFromGrace,1)
    ]
  ),

  "brock-lesnar": reviewedDeck(
    [M.strength, M.technical, cards.brockGermanSuplex, cards.bellyToBellyCommon, cards.shoulderTackle],
    [
      copies(M.strength,4), copies(M.technical,4), copies(M.strike,4),
      copies(cards.noSell,2), copies(cards.chainWrestling,2), copies(cards.duckStrike,1),
      copies(cards.brockBeastIncarnate,1),
      [cards.fireUp,cards.gamePlan,cards.createOpening],
      [cards.fightingSpirit,cards.crowdConnection],
      copies(cards.brockGermanSuplex,3), copies(cards.bellyToBellyCommon,2), copies(cards.shoulderTackle,2), copies(cards.clothesline,2),
      copies(cards.brockOverheadBelly,2), copies(cards.powerbomb,2), copies(cards.brockKneeStrike,2), copies(cards.brockTripleGermans,3),
      copies(cards.kimuraLock,2), copies(cards.f5,2), copies(cards.headbutt,1), copies(cards.bigBoot,1),
      copies(cards.spinebuster,1), copies(cards.lariat,1), copies(cards.verticalSuplex,1)
    ]
  ),

  "kevin-owens": reviewedDeck(
    [M.strike, M.strength, cards.runningForearm, cards.superkick, cards.shoulderTackle],
    [
      copies(M.strike,4), copies(M.strength,4),
      copies(cards.duckStrike,2), copies(cards.noSell,3),
      copies(cards.koShow,1),
      [cards.fireUp,cards.gamePlan,cards.createOpening],
      [cards.fightingSpirit,cards.crowdConnection],
      copies(cards.runningForearm,2), copies(cards.superkick,2), copies(cards.cannonball,3), copies(cards.punch,1),
      copies(cards.senton,2), copies(cards.cannonball,2), copies(cards.clothesline,2), copies(cards.lariat,3),
      copies(cards.powerbomb,2), copies(cards.frogSplash,3), copies(cards.owensPackagePiledriver,3),
      copies(cards.popUpPowerbomb,1), copies(cards.koStunner,1), copies(cards.headbutt,3), copies(cards.bigBoot,1)
    ]
  ),

  "gunther": reviewedDeck(
    [M.strike, M.strength, cards.guntherChopReviewed, cards.uppercut, cards.bigBoot],
    [
      copies(M.strike,4), copies(M.strength,4), copies(M.technical,4),
      copies(cards.noSell,2), copies(cards.duckStrike,1), copies(cards.chainWrestling,1),
      copies(cards.matIsSacred,1),
      [cards.fireUp,cards.gamePlan,cards.createOpening],
      [cards.fightingSpirit,cards.crowdConnection],
      copies(cards.guntherChopReviewed,4), copies(cards.uppercut,2), copies(cards.bigBoot,2), copies(cards.frontDropkick,1), copies(cards.kneeDrop,1),
      copies(cards.germanSuplexCommon,2), copies(cards.guntherButterflySuplex,2), copies(cards.backbreaker,2),
      copies(cards.runningKneeCommon,2), copies(cards.bostonCrab,1), copies(cards.sleeperCommon,1), copies(cards.burningLariat,2),
      copies(cards.foldingPowerbomb,2), copies(cards.gojiraClutch,2), copies(cards.powerbomb,1), copies(cards.lariat,1), copies(cards.headbutt,0)
    ]
  ),
  "hulk-hogan": reviewedDeck(
    [M.strength, M.strike, hallCards.hoganPunchReviewed, hallCards.bodyslam, hallCards.jab],
    [
      copies(M.strength,4), copies(M.strike,4),
      copies(cards.noSell,2), copies(cards.duckStrike,2),
      [hallCards.hoganSpecial,hallCards.hoganYou],
      [hallCards.rallyCrowd,hallCards.veteranGamePlan,hallCards.crowdRoar,hallCards.ironWill],
      copies(hallCards.hoganPunchReviewed,3), copies(cards.headbutt,2), copies(cards.clothesline,2), copies(hallCards.elbowSmash,2),
      copies(hallCards.atomicDrop,2), copies(hallCards.runningClotheslineReviewed,2), copies(hallCards.verticalSuplex,2), copies(hallCards.backSuplexReviewed,2),
      copies(cards.powerslam,2), copies(cards.backbreaker,1), copies(hallCards.bearhug,1), copies(hallCards.runningElbowDropReviewed,2),
      copies(hallCards.hoganBigBootReviewed,3), copies(hallCards.hoganAxeBomberReviewed,2), copies(hallCards.hoganAtomicLegDropReviewed,3),
      copies(hallCards.eyeRakeReviewed,1)
    ]
  ),
  "andre-the-giant": reviewedDeck(
    [M.strength, M.strike, hallCards.andreHeadbuttReviewed, hallCards.andreChop, hallCards.bodyslam],
    [
      copies(M.strength,4), copies(M.strike,4),
      copies(cards.noSell,2), copies(cards.duckStrike,2),
      [hallCards.andreSpecial,hallCards.bobbyHeenan],
      [hallCards.rallyCrowd,hallCards.veteranGamePlan,hallCards.ironWill],
      copies(hallCards.andreHeadbuttReviewed,2), copies(hallCards.andreChop,3), copies(cards.uppercut,2), copies(cards.bigBoot,2),
      copies(cards.shoulderTackle,2), copies(hallCards.bodyslam,2), copies(cards.sidewalkSlam,2), copies(cards.backbreaker,2),
      copies(hallCards.andreBearhugReviewed,2), copies(hallCards.andreBoot,2), copies(hallCards.andreButterfly,2),
      copies(hallCards.andreGiantBodyslam,2), copies(hallCards.andreGiantSplash,1),
      copies(hallCards.elbowDrop,4), copies(hallCards.runningClotheslineReviewed,3)
    ]
  ),
  "randy-savage": reviewedDeck(
    [M.agility, M.strike, hallCards.savageJab, hallCards.forearm, hallCards.jab],
    [
      copies(M.agility,4), copies(M.strike,4), copies(M.strength,4),
      copies(cards.sidestep,2), copies(cards.duckStrike,1), copies(cards.noSell,1),
      [hallCards.savageSpecial,hallCards.missElizabeth],
      [hallCards.rallyCrowd,hallCards.veteranGamePlan,hallCards.crowdRoar],
      copies(hallCards.savageJab,2), copies(hallCards.axeHandle,2), copies(hallCards.runningKnee,2), copies(hallCards.neckbreaker,2),
      copies(hallCards.runningKnee,1), copies(cards.flyingClothesline,1), copies(hallCards.backSuplexReviewed,0), copies(hallCards.divingCrossbody,2),
      copies(cards.flyingClothesline,2), copies(hallCards.elbowSmash,1), copies(hallCards.savageHotshot,2),
      copies(hallCards.savageCrossbodyReviewed,2), copies(hallCards.savageDoubleAxeReviewed,3), copies(hallCards.savageFlyingElbowReviewed,3),
      copies(hallCards.elbowSmash,2), copies(hallCards.runningClotheslineReviewed,1),
      copies(cards.headbutt,1),
    ]
  ),
  "ultimate-warrior": reviewedDeck(
    [M.strength, M.strike, hallCards.warriorPunch, hallCards.warriorClotheslineReviewed, cards.shoulderTackle],
    [
      copies(M.strength,4), copies(M.strike,4),
      copies(cards.noSell,3), copies(cards.duckStrike,2),
      [hallCards.warriorSpecial,hallCards.warriorShakeRopes],
      [hallCards.rallyCrowd,hallCards.ironWill,hallCards.crowdRoar],
      copies(hallCards.warriorPunch,2), copies(cards.headbutt,2), copies(cards.shoulderTackle,2), copies(cards.clothesline,1),
      copies(hallCards.bodyslam,2), copies(cards.bigBoot,2), copies(hallCards.axeHandle,2), copies(hallCards.runningClotheslineReviewed,2),
      copies(hallCards.flyingShoulderReviewed,2), copies(hallCards.warriorShoulderReviewed,2), copies(cards.powerslam,2),
      copies(hallCards.militaryPressDropReviewed,2), copies(hallCards.warriorClotheslineReviewed,2),
      copies(hallCards.warriorPressReviewed,3), copies(hallCards.warriorSplashReviewed,3), copies(hallCards.bearhug,1)
    ]
  ),
  "stone-cold-steve-austin": reviewedDeck(
    [M.strike, M.strength, hallCards.austinPunch, cards.headbutt, hallCards.jab],
    [
      copies(M.strike,4), copies(M.strength,4),
      copies(cards.duckStrike,2), copies(cards.noSell,2),
      [hallCards.austinSpecial,hallCards.austinWhoopAss,hallCards.austinWhat],
      [hallCards.rallyCrowd,hallCards.veteranGamePlan,hallCards.crowdRoar],
      copies(hallCards.austinPunch,2), copies(cards.headbutt,2), copies(hallCards.runningClotheslineReviewed,2), copies(hallCards.elbowSmash,2),
      copies(hallCards.bodyslam,2), copies(hallCards.verticalSuplex,2), copies(hallCards.backSuplexReviewed,2), copies(cards.spinebuster,2),
      copies(hallCards.piledriver,1), copies(hallCards.middleRopeElbowReviewed,2), copies(hallCards.austinMudholeReviewed,2),
      copies(hallCards.austinLouTheszReviewed,3), copies(hallCards.austinKickReviewed,3), copies(hallCards.austinStunnerReviewed,3),
      copies(hallCards.eyeRakeReviewed,1),
      copies(cards.headbutt,1)
    ]
  ),
  "the-undertaker": reviewedDeck(
    [M.strength, M.strike, hallCards.takerPunch, cards.headbutt, hallCards.jab],
    [
      copies(M.strength,4), copies(M.strike,4), copies(M.technical,4),
      copies(cards.noSell,2), copies(cards.duckStrike,1), copies(cards.chainWrestling,1),
      [hallCards.takerSpecial,hallCards.paulBearer,hallCards.takerDigGrave],
      [hallCards.rallyCrowd,hallCards.ironWill],
      copies(hallCards.takerPunch,3), copies(cards.uppercut,3), copies(cards.bigBoot,2), copies(cards.clothesline,2),
      copies(cards.sidewalkSlam,2), copies(cards.backbreaker,1), copies(hallCards.verticalSuplex,1), copies(hallCards.runningBigBootReviewed,2),
      copies(hallCards.takerSnakeEyesReviewed,2), copies(hallCards.takerOldSchoolReviewed,4), copies(hallCards.takerChokeslamReviewed,3),
      copies(hallCards.takerTombstoneReviewed,3), copies(cards.powerslam,0), copies(hallCards.piledriver,1)
    ]
  ),
  "mankind": reviewedDeck(
    [M.technical, M.strike, hallCards.mankindPunch, cards.sideHeadlock, hallCards.forearm],
    [
      copies(M.technical,4), copies(M.strike,4), copies(M.strength,3),
      copies(cards.chainWrestling,2), copies(cards.duckStrike,1), copies(cards.noSell,1),
      [hallCards.mankindSpecial,hallCards.mankindSockoSupport,hallCards.mankindPainFriend],
      [hallCards.rallyCrowd,hallCards.veteranGamePlan],
      copies(hallCards.mankindPunch,2), copies(hallCards.mankindHeadbuttReviewed,2), copies(hallCards.forearm,2), copies(cards.clothesline,2),
      copies(cards.ddt,2), copies(hallCards.neckbreaker,2), copies(hallCards.bodyslam,1), copies(cards.backbreaker,1),
      copies(hallCards.mankindKneeReviewed,2), copies(hallCards.mankindBulldog,2), copies(hallCards.piledriver,1),
      copies(hallCards.mankindDoubleArmReviewed,2), copies(hallCards.mankindClawReviewed,2), copies(hallCards.eyeRakeReviewed,2),
      copies(hallCards.runningElbowDropReviewed,5)
    ]
  ),
  "kane": reviewedDeck(
    [M.strength, M.strike, cards.headbutt, hallCards.jab, cards.shoulderTackle],
    [
      copies(M.strength,4), copies(M.strike,4),
      copies(cards.noSell,3), copies(cards.duckStrike,2),
      [hallCards.kaneSpecial,hallCards.kaneRaiseArms],
      [hallCards.rallyCrowd,hallCards.ironWill,hallCards.crowdRoar],
      copies(hallCards.kaneUppercutReviewed,2), copies(cards.headbutt,2), copies(cards.bigBoot,3), copies(cards.clothesline,2),
      copies(hallCards.bodyslam,2), copies(cards.shoulderTackle,2), copies(hallCards.kaneSidewalkReviewed,2), copies(hallCards.tiltWhirlReviewed,2),
      copies(hallCards.kaneFlyingReviewed,2), copies(hallCards.kaneChokeLift,2), copies(hallCards.militaryPressDropReviewed,2),
      copies(hallCards.kaneChokeslamReviewed,3), copies(hallCards.kaneTombstoneReviewed,3), copies(hallCards.bearhug,1),
      copies(hallCards.runningClotheslineReviewed,2)
    ]
  ),

  "rhea-ripley": reviewedDeck(
    [M.strength, M.strike, evolutionCards.rheaHeadbutt, hallCards.forearm, evolutionCards.bodySlamReviewed],
    [
      copies(M.strength, 4), copies(M.strike, 2), copies(hallCards.forearm, 2), copies(cards.powerslam, 1), copies(evolutionCards.bodySlamReviewed, 1), copies(M.technical, 4), copies(evolutionCards.rheaSpecial, 1), copies(evolutionCards.rheaEradicate, 1), copies(evolutionCards.rheaShortArmClothesline, 2), copies(evolutionCards.rheaRipcordKnee, 2), copies(evolutionCards.riptide, 3), copies(evolutionCards.prismTrap, 2), copies(evolutionCards.avalancheRiptide, 2), copies(evolutionCards.germanSuplex, 2), copies(cards.bigBoot, 4), copies(evolutionCards.scramble, 1), copies(evolutionCards.bodySlamReviewed, 2), copies(hallCards.runningKnee, 2), copies(evolutionCards.clothesline, 1), copies(evolutionCards.dodge, 2), copies(evolutionCards.duck, 2), copies(evolutionCards.clothesline, 3), copies(evolutionCards.scramble, 1), copies(evolutionCards.backbreaker, 3)
    ]
  ),
  "liv-morgan": reviewedDeck(
    [M.agility, M.strike, evolutionCards.livDropkickReviewed, evolutionCards.armDrag, hallCards.forearm],
    [
      copies(M.agility, 4), copies(M.strike, 2), copies(evolutionCards.livDropkickReviewed, 2), copies(evolutionCards.armDrag, 1), copies(M.technical, 4), copies(evolutionCards.livSpecial, 1), copies(evolutionCards.livRevengeTour, 1), copies(evolutionCards.livJerseyCodebreaker, 2), copies(evolutionCards.livGotcha, 2), copies(evolutionCards.livCodebreaker, 3), copies(evolutionCards.oblivion, 3), copies(evolutionCards.enzuigiri, 2), copies(evolutionCards.hurricanrana, 2), copies(cards.dropkick, 2), copies(hallCards.runningKnee, 2), copies(evolutionCards.hurricanrana, 3), copies(evolutionCards.springboardDropkick, 2), copies(evolutionCards.dodge, 2), copies(evolutionCards.duck, 2), copies(evolutionCards.headscissors, 3), copies(evolutionCards.missileDropkick, 3), copies(evolutionCards.facebuster, 2)
    ]
  ),

  "becky-lynch": reviewedDeck(
    [M.technical, M.strike, evolutionCards.beckyUppercut, evolutionCards.armDrag, hallCards.forearm],
    [
      copies(M.technical, 4), copies(M.strike, 3), copies(evolutionCards.beckyUppercut, 2), copies(evolutionCards.armDrag, 2), copies(hallCards.forearm, 2), copies(M.agility, 3), copies(evolutionCards.beckySpecial, 1), copies(evolutionCards.beckyBeatThat, 1), copies(evolutionCards.beckyArmbarTakedown, 2), copies(evolutionCards.beckyExploder, 2), copies(evolutionCards.manhandleSlam, 3), copies(evolutionCards.disarmher, 3), copies(evolutionCards.snapSuplex, 2), copies(hallCards.runningKnee, 2), copies(cards.dropkick, 2), copies(evolutionCards.beckyLegDrop, 2), copies(evolutionCards.armbar, 2), copies(evolutionCards.dodge, 2), copies(evolutionCards.duck, 2), copies(evolutionCards.europeanUppercut, 3), copies(cards.neckbreaker, 3), copies(evolutionCards.missileDropkick, 2)
    ]
  ),

  "bayley": reviewedDeck(
    [M.technical, M.strike, evolutionCards.armDrag, evolutionCards.bayleyBackElbowReviewed, evolutionCards.snapmare],
    [
      copies(M.technical, 4), copies(M.strike, 3), copies(evolutionCards.armDrag, 2), copies(evolutionCards.bayleyBackElbowReviewed, 2), copies(evolutionCards.snapmare, 2), copies(M.agility, 3), copies(evolutionCards.bayleySpecial, 1), copies(evolutionCards.bayleyGetUp, 1), copies(evolutionCards.bayleyMiddleRopeStunner, 2), copies(evolutionCards.bayleySunsetReviewed, 2), copies(evolutionCards.bayleyToBelly, 3), copies(evolutionCards.rosePlant, 3), copies(cards.dropkick, 2), copies(cards.neckbreaker, 2), copies(hallCards.runningKnee, 2), copies(evolutionCards.ddt, 2), copies(evolutionCards.bayleyElbowDrop, 2), copies(evolutionCards.dodge, 2), copies(evolutionCards.duck, 2), copies(hallCards.forearm, 3), copies(evolutionCards.backElbow, 3), copies(evolutionCards.divingElbow, 2)
    ]
  ),

  "charlotte-flair": reviewedDeck(
    [M.technical, M.strength, evolutionCards.charlotteChops, evolutionCards.armDrag, evolutionCards.legSweep],
    [
      copies(M.technical, 4), copies(M.strength, 2), copies(evolutionCards.charlotteChops, 2), copies(evolutionCards.armDrag, 2), copies(evolutionCards.legSweep, 2), copies(M.agility, 4), copies(evolutionCards.charlotteSpecial, 1), copies(evolutionCards.charlotteGenetic, 1), copies(evolutionCards.charlotteBigBoot, 2), copies(evolutionCards.charlotteChopBlock, 2), copies(evolutionCards.charlotteBackpackStunner, 2), copies(evolutionCards.naturalSelection, 3), copies(evolutionCards.figureEight, 3), copies(evolutionCards.charlotteFigureFour, 2), copies(evolutionCards.exploderSuplex, 2), copies(evolutionCards.charlotteMoonsault, 2), copies(evolutionCards.charlotteFallaway, 2), copies(evolutionCards.spear, 2), copies(evolutionCards.dodge, 2), copies(evolutionCards.duck, 2), copies(evolutionCards.backbreaker, 1), copies(evolutionCards.charlotteQueensGambit, 1), copies(evolutionCards.moonsault, 1), copies(evolutionCards.charlotteQueensGambit, 1), copies(cards.neckbreaker, 2)
    ]
  ),

  "iyo-sky": reviewedDeck(
    [M.agility, M.strike, evolutionCards.iyoSpringboardDropkick, evolutionCards.armDrag, evolutionCards.enzuigiri],
    [
      copies(M.agility, 4), copies(M.strike, 3), copies(evolutionCards.iyoSpringboardDropkick, 2), copies(evolutionCards.enzuigiri, 2), copies(M.technical, 3), copies(evolutionCards.iyoSpecial, 1), copies(evolutionCards.iyoTakeFlight, 1), copies(evolutionCards.iyoMeteora, 2), copies(evolutionCards.iyoMoonstomp, 3), copies(evolutionCards.overTheMoonsault, 3), copies(evolutionCards.iyoAsaiMoonsault, 2), copies(evolutionCards.hurricanrana, 2), copies(evolutionCards.doubleStomp, 4), copies(evolutionCards.hurricanrana, 2), copies(cards.dropkick, 2), copies(evolutionCards.divingCrossbody, 2), copies(evolutionCards.springboardDropkick, 2), copies(evolutionCards.dodge, 2), copies(evolutionCards.duck, 2), copies(evolutionCards.headscissors, 3), copies(evolutionCards.missileDropkick, 3)
    ]
  ),

  "paige": reviewedDeck(
    [M.technical, M.strike, hallCards.forearm, evolutionCards.armDrag, evolutionCards.paigeSuperkick],
    [
      copies(M.technical, 4), copies(M.strike, 3), copies(hallCards.forearm, 2), copies(evolutionCards.armDrag, 2), copies(evolutionCards.paigeSuperkick, 2), copies(M.agility, 3), copies(evolutionCards.paigeSpecial, 1), copies(evolutionCards.paigeThinkAgain, 1), copies(evolutionCards.paigeRopeKnees, 2), copies(evolutionCards.paigeTurner, 2), copies(evolutionCards.ramPaige, 3), copies(evolutionCards.pto, 3), copies(evolutionCards.ddt, 2), copies(cards.neckbreaker, 2), copies(evolutionCards.snapSuplex, 2), copies(evolutionCards.bostonCrab, 2), copies(evolutionCards.dodge, 3), copies(evolutionCards.duck, 3), copies(evolutionCards.europeanUppercut, 3), copies(evolutionCards.legSweep, 3), copies(evolutionCards.crossface, 2)
    ]
  ),

  "stephanie-vaquer": reviewedDeck(
    [M.technical, M.strike, evolutionCards.vaquerHeadbutt, evolutionCards.armDrag, hallCards.forearm],
    [
      copies(M.technical, 4), copies(M.strike, 4), copies(evolutionCards.vaquerHeadbutt, 2), copies(evolutionCards.armDrag, 2), copies(hallCards.forearm, 2), copies(M.agility, 2), copies(evolutionCards.vaquerSpecial, 1), copies(evolutionCards.vaquerKeepUp, 1), copies(evolutionCards.devilsKiss, 3), copies(evolutionCards.vaquerMeteora, 2), copies(evolutionCards.vaquerDragonScrew, 2), copies(evolutionCards.vaquerBackbreaker, 3), copies(evolutionCards.svb, 3), copies(hallCards.runningKnee, 2), copies(evolutionCards.snapSuplex, 2), copies(evolutionCards.ddt, 2), copies(evolutionCards.enzuigiri, 2), copies(evolutionCards.dodge, 2), copies(evolutionCards.duck, 2), copies(evolutionCards.legSweep, 3), copies(evolutionCards.headscissors, 2), copies(evolutionCards.ddt, 2)
    ]
  ),
  "the-rock": reviewedDeck(
    [cards.momentum.strength, cards.momentum.strike, rockCards.finalBossPunches, rockCards.bodySlam, rockCards.finalBossSlap],
    [
      copies(cards.momentum.strength, 4), copies(cards.momentum.strike, 3), copies(rockCards.finalBossPunches, 2), copies(rockCards.bodySlam, 1), copies(rockCards.kickout, 1), copies(rockCards.finalBossSlap, 2), copies(cards.momentum.technical, 3), copies(rockCards.mamaRhodes, 1), copies(rockCards.bloodlineRules, 1), copies(rockCards.beltWhip, 2), copies(rockCards.finalBossCombination, 2), copies(rockCards.finalBossSpinebuster, 3), copies(rockCards.rockBottomFinalBoss, 3), copies(rockCards.peoplesElbowFinalBoss, 3), copies(rockCards.sharedPunch, 2), copies(rockCards.counter, 1), copies(rockCards.counter, 1), copies(rockCards.shortArmClothesline, 1), copies(rockCards.counter, 1), copies(rockCards.powerslam, 2), copies(rockCards.bellyToBelly, 2), copies(cards.samoanDrop, 2), copies(rockCards.ddt, 1), copies(rockCards.bodySlam, 1), copies(cards.headbutt, 1), copies(rockCards.knowYourRoleCounter, 2), copies(rockCards.clothesline, 1), copies(rockCards.clothesline, 1)
    ]
  )

};