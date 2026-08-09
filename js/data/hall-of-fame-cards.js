import { normalizeMoveOptions } from "./move-types.js";
const momentum = (method) => ({ id: `hof1-momentum-${method}`, name: `${method[0].toUpperCase()}${method.slice(1)} Momentum`, kind: "momentum", method, amount: 1, setId: "hall-of-fame-series-1" });
const entrance = (id, name, superstarId, abilityText, effects = [], scheduled = []) => ({ id, name, superstarId, kind: "entrance", abilityText, effects, scheduled, setId: "hall-of-fame-series-1" });
const move = (id, name, options = {}) => ({ id, name, kind: "move", setId: "hall-of-fame-series-1", ...normalizeMoveOptions(id, name, options) });
const special = (id, name, options = {}) => ({ id, name, kind: "special", setId: "hall-of-fame-series-1", ...options });
const action = (id, name, abilityText, effects = [], options = {}) => ({ id, name, kind: "action", abilityText, effects, setId: "hall-of-fame-series-1", ...options });
const support = (id, name, abilityText, passive = {}, options = {}) => ({ id, name, kind: "support", abilityText, passive, setId: "hall-of-fame-series-1", ...options });
const manager = (id, name, allowedSuperstarIds, abilityText, trigger, effects, when = {}) => ({ id, name, kind: "manager", allowedSuperstarIds, abilityText, trigger, effects, when, oncePerMatch: true, setId: "hall-of-fame-series-1" });

export const hallCards = {
  momentum: {
    agility: momentum("agility"), knowledge: momentum("knowledge"), strength: momentum("strength"),
    strike: momentum("strike"), technical: momentum("technical")
  },

  hoganEntrance: entrance("hof1-entrance-hulk-hogan", "Hulkamania Runs Wild", "hulk-hogan", "Pre-Match — From Turn 8 onward, the first time Hogan is at 60% HP or less, gain +2 Attitude and draw 1 page.", [], [{ trigger: "TURN_START", minTurn: 8, maxTriggers: 1, when: { hpAtOrBelowPercent: 60 }, effects: [{ type: "gainMomentum", method: "attitude", amount: 2 }, { type: "draw", amount: 1 }] }]),
  andreEntrance: entrance("hof1-entrance-andre-the-giant", "The Eighth Wonder", "andre-the-giant", "Pre-Match — At Turn 8, recover 2 HP.", [], [{ trigger: "TURN_START", atTurn: 8, effects: [{ type: "recoverHp", amount: 2 }] }]),
  savageEntrance: entrance("hof1-entrance-randy-savage", "Pomp and Circumstance", "randy-savage", "Pre-Match — Begin with +1 Agility Momentum. At Turn 6, search your Playbook for a Finisher.", [{ type: "gainMomentum", method: "agility", amount: 1 }], [{ trigger: "TURN_START", atTurn: 6, effects: [{ type: "searchDeck", finisher: true }] }]),
  warriorEntrance: entrance("hof1-entrance-ultimate-warrior", "Feel the Power", "ultimate-warrior", "Pre-Match — At Turn 4, gain +1 Strength and +1 Attitude Momentum.", [], [{ trigger: "TURN_START", atTurn: 4, effects: [{ type: "gainMomentum", method: "strength", amount: 1 }, { type: "gainMomentum", method: "attitude", amount: 1 }] }]),
  austinEntrance: entrance("hof1-entrance-stone-cold", "Glass Shatters", "stone-cold-steve-austin", "Pre-Match — Begin with +1 Strike Momentum. No pin attempts before Turn 6; at Turn 6 Austin gains +1 Attitude.", [{ type: "gainMomentum", method: "strike", amount: 1 }, { type: "blockPinsUntilTurn", turn: 6 }], [{ trigger: "TURN_START", atTurn: 6, effects: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }]),
  undertakerEntrance: entrance("hof1-entrance-undertaker", "Rest in Peace", "the-undertaker", "Pre-Match — Begin with +1 Strength Momentum. Every 4 turns, if the opponent has 4+ Attitude, they lose 1 Attitude (maximum 3 times).", [{ type: "gainMomentum", method: "strength", amount: 1 }], [{ trigger: "TURN_START", startAt: 4, every: 4, maxTriggers: 3, when: { opponentAttitudeAtLeast: 4 }, effects: [{ type: "loseMomentum", target: "opponent", method: "attitude", amount: 1 }] }]),
  mankindEntrance: entrance("hof1-entrance-mankind", "Have a Nice Day", "mankind", "Pre-Match — From Turn 10 onward, the first time Mankind is behind in HP at a turn start, recover 2 HP and gain +1 Attitude.", [], [{ trigger: "TURN_START", minTurn: 10, maxTriggers: 1, when: { behindHp: true }, effects: [{ type: "recoverHp", amount: 2 }, { type: "gainMomentum", method: "attitude", amount: 1 }] }]),
  kaneEntrance: entrance("hof1-entrance-kane", "Through Hellfire", "kane", "Pre-Match — At Turn 6, gain +1 Attitude Momentum.", [], [{ trigger: "TURN_START", atTurn: 6, effects: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }]),

  hofShoulderUp: special("hof1-shoulder-up", "Old-School Kickout", { abilityText: "Pin response — stop the pin and take Control.", pinEscape: true }),
  hofDesperationCounter: special("hof1-desperation-counter", "Veteran Instinct", { abilityText: "Counter response — counter any Move.", counterAny: true }),

  rallyCrowd: action("hof1-rally-crowd", "Rally the Crowd", "Action — Gain 2 Attitude Momentum.", [{ type: "gainMomentum", method: "attitude", amount: 2 }]),
  catchSecondWind: action("hof1-second-wind", "Second Wind", "Action — Recover 3 HP.", [{ type: "recoverHp", amount: 3 }]),
  veteranGamePlan: action("hof1-veteran-game-plan", "Veteran Game Plan", "Action — Your next Move costs 2 less Total Momentum this turn.", [{ type: "nextMoveCostModifier", amount: -2 }]),
  openingCreated: action("hof1-create-opening", "Create an Opening", "Action — Your next connected Move deals +2 damage.", [{ type: "nextMoveDamageBonus", amount: 2 }]),

  crowdRoar: support("hof1-crowd-roar", "Crowd Roar", "Support — Gain +1 extra Attitude when your Move connects.", { connectedAttitudeBonus: 1 }),
  veteranSavvy: support("hof1-veteran-savvy", "Veteran Savvy", "Support — Count +1 virtual Total Momentum for Move costs.", { totalMomentumBonus: 1 }),
  ironWill: support("hof1-iron-will", "Iron Will", "Support — Reduce connected Move damage by 1.", { damageReduction: 1 }),
  ringAwareness: support("hof1-ring-awareness", "Ring Awareness", "Support — Draw 1 extra page after a successful Counter.", { counterDraw: 1 }),

  // Hall of Fame Managers — unique persistent cards, one active Manager per wrestler.
  bobbyHeenan: manager("hof1-manager-bobby-heenan", "Bobby Heenan", ["andre-the-giant"], "Manager — The Brain: once per match after you successfully Counter a Move, draw 1 page and gain 1 Attitude Momentum.", "ON_COUNTER_SUCCESS", [{ type: "draw", amount: 1 }, { type: "gainMomentum", method: "attitude", amount: 1 }]),
  missElizabeth: manager("hof1-manager-miss-elizabeth", "Miss Elizabeth", ["randy-savage"], "Manager — Inspiration: once per match when you fall to half HP or less, recover 2 HP and draw 1 page.", "ON_DAMAGE_TAKEN", [{ type: "recoverHp", amount: 2 }, { type: "draw", amount: 1 }], { hpAtOrBelowPercent: 50 }),
  paulBearer: manager("hof1-manager-paul-bearer", "Paul Bearer", ["the-undertaker", "kane"], "Manager — Power of the Urn: once per match after you connect a Power Move for 6 or more damage, draw 1 page and gain 1 Attitude Momentum.", "ON_MOVE_CONNECTED", [{ type: "draw", amount: 1 }, { type: "gainMomentum", method: "attitude", amount: 1 }], { minDamage: 6, methods: ["strength"] }),

  // Hall of Fame Series 1 shared wrestling vocabulary.
  lockup: move("hof1-lockup", "Collar-and-Elbow Tie-Up", { method: "technical", cost: 1, damage: 1 }),
  headlock: move("hof1-headlock", "Side Headlock", { method: "technical", cost: 1, requirements: { technical: 1 }, damage: 2 }),
  wristlock: move("hof1-wristlock", "Wrist Lock", { method: "technical", cost: 1, requirements: { technical: 1 }, damage: 2 }),
  jab: move("hof1-jab", "Right Hand", { method: "strike", cost: 1, damage: 2 }),
  bodyPunch: move("hof1-body-punch", "Body Punch", { method: "strike", cost: 1, requirements: { strike: 1 }, damage: 2 }),
  shoulderTackle: move("hof1-shoulder-tackle", "Shoulder Tackle", { method: "strength", cost: 2, requirements: { strength: 1 }, damage: 3 }),
  armDrag: move("hof1-arm-drag", "Arm Drag", { method: "technical", cost: 2, requirements: { technical: 1 }, damage: 3, setOpponentPosture: "on-mat", effectText: "On connect: draw 1 page.", onConnect: [{ type: "draw", amount: 1 }] }),
  hipToss: move("hof1-hip-toss", "Hip Toss", { method: "technical", cost: 2, requirements: { technical: 1 }, damage: 3, setOpponentPosture: "on-mat" }),
  snapmare: move("hof1-snapmare", "Snapmare", { method: "technical", cost: 2, requirements: { technical: 1 }, damage: 3, setOpponentPosture: "on-mat", effectText: "On connect: opponent ditches 1 page.", onConnect: [{ type: "discard", target: "opponent", amount: 1 }] }),
  bodyslam: move("hof1-bodyslam", "Bodyslam", { method: "strength", cost: 2, requirements: { strength: 1 }, damage: 4, setOpponentPosture: "on-mat" }),
  forearm: move("hof1-forearm", "Forearm Smash", { method: "strike", cost: 2, requirements: { strike: 1 }, damage: 3 }),
  elbowSmash: move("hof1-elbow-smash", "Elbow Smash", { method: "strike", cost: 2, requirements: { strike: 1 }, damage: 3 }),
  uppercut: move("hof1-uppercut", "Uppercut", { method: "strike", cost: 2, requirements: { strike: 1 }, damage: 3 }),
  clothesline: move("hof1-clothesline", "Clothesline", { method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5, effectText: "On connect: gain +1 additional Attitude.", onConnect: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }),
  bigBoot: move("hof1-big-boot", "Big Boot", { method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5 }),
  dropkick: move("hof1-dropkick", "Dropkick", { method: "agility", cost: 3, requirements: { agility: 1 }, damage: 5 }),
  ddt: move("hof1-ddt", "DDT", { method: "technical", cost: 3, requirements: { technical: 1 }, damage: 5, setOpponentPosture: "on-mat", effectText: "On connect: opponent loses 1 additional Attitude.", onConnect: [{ type: "loseMomentum", target: "opponent", method: "attitude", amount: 1 }] }),
  neckbreaker: move("hof1-neckbreaker", "Neckbreaker", { method: "technical", cost: 3, requirements: { technical: 1 }, damage: 5, setOpponentPosture: "on-mat" }),
  backbreaker: move("hof1-backbreaker", "Backbreaker", { method: "strength", cost: 3, requirements: { strength: 1 }, damage: 5, setOpponentPosture: "on-mat" }),
  elbowDrop: move("hof1-elbow-drop", "Elbow Drop", { method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5, requiresPosture: "on-mat" }),
  kneeDrop: move("hof1-knee-drop", "Knee Drop", { method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5, requiresPosture: "on-mat" }),
  legDrop: move("hof1-leg-drop", "Leg Drop", { method: "agility", cost: 3, requirements: { agility: 1 }, damage: 5, requiresPosture: "on-mat" }),
  runningKnee: move("hof1-running-knee", "Running Knee", { method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5 }),
  piledriver: move("hof1-piledriver", "Piledriver", { method: "strength", cost: 5, requirements: { strength: 2 }, damage: 8, setOpponentPosture: "on-mat" }),
  verticalSuplex: move("hof1-vertical-suplex", "Vertical Suplex", { method: "technical", cost: 4, requirements: { technical: 1, strength: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  germanSuplex: move("hof1-german-suplex", "German Suplex", { method: "strength", cost: 4, requirements: { strength: 1 }, damage: 6, setOpponentPosture: "on-mat", effectText: "On connect: draw 1 page.", onConnect: [{ type: "draw", amount: 1 }] }),
  bellyToBelly: move("hof1-belly-to-belly", "Belly-to-Belly Suplex", { method: "strength", cost: 4, requirements: { strength: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  russianSweep: move("hof1-russian-sweep", "Russian Leg Sweep", { method: "technical", cost: 4, requirements: { technical: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  bulldog: move("hof1-bulldog", "Bulldog", { method: "technical", cost: 4, requirements: { technical: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  powerslam: move("hof1-powerslam", "Powerslam", { method: "strength", cost: 4, requirements: { strength: 1 }, damage: 7, setOpponentPosture: "on-mat" }),
  spinebuster: move("hof1-spinebuster", "Spinebuster", { method: "strength", cost: 4, requirements: { strength: 1 }, damage: 7, setOpponentPosture: "on-mat" }),
  atomicDrop: move("hof1-atomic-drop", "Atomic Drop", { method: "strength", cost: 4, requirements: { strength: 1 }, damage: 6 }),
  sleeper: move("hof1-sleeper", "Sleeper Hold", { cost: 4, requirements: { technical: 1 }, damage: 1, submission: { bodyPart: "head", damage: 3 } }),
  bearhug: move("hof1-bearhug", "Bearhug", { cost: 4, requirements: { strength: 1 }, damage: 1, submission: { bodyPart: "back", damage: 3 } }),
  bostonCrab: move("hof1-boston-crab", "Boston Crab", { cost: 5, requirements: { technical: 1 }, damage: 1, requiresPosture: "on-mat", submission: { bodyPart: "back", damage: 4 } }),
  camelClutch: move("hof1-camel-clutch", "Camel Clutch", { cost: 5, requirements: { strength: 1 }, damage: 1, requiresPosture: "on-mat", submission: { bodyPart: "back", damage: 4 } }),
  powerbomb: move("hof1-powerbomb", "Powerbomb", { method: "strength", cost: 5, requirements: { strength: 2 }, damage: 8, setOpponentPosture: "on-mat" }),
  flyingClothesline: move("hof1-flying-clothesline", "Flying Clothesline", { method: "agility", cost: 4, requirements: { agility: 1 }, damage: 6 }),
  divingCrossbody: move("hof1-diving-crossbody", "Diving Crossbody", { method: "agility", cost: 5, requirements: { agility: 1 }, damage: 7 }),
  flyingElbow: move("hof1-flying-elbow", "Flying Elbow Drop", { method: "agility", cost: 5, requirements: { agility: 1 }, damage: 7, requiresPosture: "on-mat" }),
  splash: move("hof1-splash", "Big Splash", { method: "strength", cost: 5, requirements: { strength: 1 }, damage: 7, requiresPosture: "on-mat" }),
  suplexRingside: move("hof1-ringside-suplex", "Ringside Suplex", { method: "technical", cost: 4, requirements: { technical: 1 }, damage: 7, requiresLocation: "ringside", setOpponentPosture: "on-mat" }),
  ringsideClothesline: move("hof1-ringside-clothesline", "Ringside Clothesline", { method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5, requiresLocation: "ringside" }),
  ringsideSlam: move("hof1-ringside-slam", "Ringside Slam", { method: "strength", cost: 4, requirements: { strength: 1 }, damage: 7, requiresLocation: "ringside", setOpponentPosture: "on-mat" }),
  throwOutside: move("hof1-throw-over-ropes", "Throw Over the Ropes", { method: "strength", cost: 3, requirements: { strength: 1 }, damage: 4, requiresLocation: "ring", sendOpponentOutside: true }),
  axeHandle: move("hof1-axe-handle", "Double Axe Handle", { method: "strike", cost: 4, requirements: { strike: 1 }, damage: 6 }),
  gutwrench: move("hof1-gutwrench-suplex", "Gutwrench Suplex", { method: "strength", cost: 5, requirements: { strength: 2 }, damage: 7, setOpponentPosture: "on-mat" }),
  militaryPress: move("hof1-military-press", "Military Press", { method: "strength", cost: 5, requirements: { strength: 2 }, damage: 8, setOpponentPosture: "on-mat" }),
  sideSlam: move("hof1-side-slam", "Side Slam", { method: "strength", cost: 4, requirements: { strength: 1 }, damage: 7, setOpponentPosture: "on-mat" }),

  dodge: move("hof1-dodge", "Dodge", { method: "agility", cost: 1, counters: ["strike", "power"], effectText: "On counter: draw 1 page.", onCounter: [{ type: "draw", amount: 1 }] }),
  duck: move("hof1-duck", "Duck", { method: "agility", cost: 1, counters: ["strike"] }),
  reversal: move("hof1-reversal", "Veteran Reversal", { method: "technical", cost: 2, counters: ["technical", "power", "submission"], effectText: "On counter: gain 1 Attitude Momentum.", onCounter: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }),
  scramble: move("hof1-scramble", "Scramble Free", { method: "technical", cost: 2, counters: ["submission", "technical"], effectText: "On counter: draw 1 page.", onCounter: [{ type: "draw", amount: 1 }] }),

  // Hulk Hogan
  hoganPunches: move("hof1-hogan-punches", "Hogan Right Hands", { superstarId: "hulk-hogan", method: "strike", cost: 2, requirements: { strike: 1 }, damage: 3 }),
  hoganAxeBomber: move("hof1-hogan-axe-bomber", "Axe Bomber", { superstarId: "hulk-hogan", method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5, effectText: "On connect: gain +1 additional Attitude.", onConnect: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }),
  hoganBackRake: move("hof1-hogan-back-rake", "Back Rake", { superstarId: "hulk-hogan", method: "strike", cost: 2, damage: 3, effectText: "On connect: opponent ditches 1 page.", onConnect: [{ type: "discard", target: "opponent", amount: 1 }] }),
  hoganBodyslam: move("hof1-hogan-bodyslam", "Hogan Bodyslam", { superstarId: "hulk-hogan", method: "strength", cost: 3, requirements: { strength: 1 }, damage: 5, setOpponentPosture: "on-mat", effectText: "On connect: draw 1 page.", onConnect: [{ type: "draw", amount: 1 }] }),
  hoganBigBoot: move("hof1-hogan-big-boot", "Hogan Big Boot", { superstarId: "hulk-hogan", method: "strike", cost: 5, requirements: { strike: 2 }, damage: 7, setOpponentPosture: "on-mat" }),
  hoganRunningClothesline: move("hof1-hogan-running-clothesline", "Running Clothesline", { superstarId: "hulk-hogan", method: "strike", cost: 4, requirements: { strike: 1 }, damage: 6 }),
  hoganSuplex: move("hof1-hogan-suplex", "Hogan Suplex", { superstarId: "hulk-hogan", method: "strength", cost: 4, requirements: { strength: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  hoganBearhug: move("hof1-hogan-bearhug", "Hogan Bearhug", { superstarId: "hulk-hogan", cost: 5, requirements: { strength: 2 }, damage: 1, submission: { bodyPart: "back", damage: 4 } }),
  hoganLegDrop: move("hof1-hogan-leg-drop", "Atomic Leg Drop", { superstarId: "hulk-hogan", method: "strength", cost: 7, requirements: { strength: 2 }, damage: 10, requiresPosture: "on-mat", finisher: true }),
  hoganThreePunch: move("hof1-hogan-three-punch", "Three-Punch Combo", { superstarId: "hulk-hogan", method: "strike", cost: 4, requirements: { strike: 1 }, damage: 6 }),

  // André the Giant
  andreChop: move("hof1-andre-chop", "Giant Chop", { superstarId: "andre-the-giant", method: "strike", cost: 2, requirements: { strike: 1 }, damage: 4, effectText: "On connect: opponent ditches 1 page.", onConnect: [{ type: "discard", target: "opponent", amount: 1 }] }),
  andreHeadbutt: move("hof1-andre-headbutt", "Giant Headbutt", { superstarId: "andre-the-giant", method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5 }),
  andreClub: move("hof1-andre-club", "Clubbing Blow", { superstarId: "andre-the-giant", method: "strike", cost: 3, damage: 5 }),
  andreBoot: move("hof1-andre-boot", "Giant Boot", { superstarId: "andre-the-giant", method: "strike", cost: 4, requirements: { strike: 1 }, damage: 6 }),
  andreBearhug: move("hof1-andre-bearhug", "Giant Bearhug", { superstarId: "andre-the-giant", cost: 4, requirements: { strength: 2 }, damage: 1, submission: { bodyPart: "back", damage: 4 } }),
  andreBodyslam: move("hof1-andre-bodyslam", "Giant Bodyslam", { superstarId: "andre-the-giant", method: "strength", cost: 4, requirements: { strength: 2 }, damage: 7, setOpponentPosture: "on-mat" }),
  andreSitDown: move("hof1-andre-sit-down", "Giant Sit-Down", { superstarId: "andre-the-giant", method: "strength", cost: 5, requirements: { strength: 2 }, damage: 8, requiresPosture: "on-mat" }),
  andreHeadVice: move("hof1-andre-head-vice", "Head Vice", { superstarId: "andre-the-giant", cost: 5, requirements: { strength: 2 }, damage: 1, submission: { bodyPart: "head", damage: 4 } }),
  andreButterfly: move("hof1-andre-butterfly-suplex", "Butterfly Suplex", { superstarId: "andre-the-giant", method: "strength", cost: 6, requirements: { strength: 2 }, damage: 9, setOpponentPosture: "on-mat", effectText: "On connect: draw 1 page.", onConnect: [{ type: "draw", amount: 1 }] }),
  andreElbowDrop: move("hof1-andre-elbow-drop", "Giant Elbow Drop", { superstarId: "andre-the-giant", method: "strength", cost: 7, requirements: { strength: 3 }, damage: 11, requiresPosture: "on-mat", finisher: true }),

  // Randy Savage
  savageJab: move("hof1-savage-jab", "Macho Man Jabs", { superstarId: "randy-savage", method: "strike", cost: 2, requirements: { strike: 1 }, damage: 3 }),
  savageAxeHandle: move("hof1-savage-axe-handle", "Flying Double Axe Handle", { superstarId: "randy-savage", method: "agility", cost: 3, requirements: { agility: 1 }, damage: 5, effectText: "On connect: draw 1 page.", onConnect: [{ type: "draw", amount: 1 }] }),
  savageNeckbreaker: move("hof1-savage-neckbreaker", "Macho Neckbreaker", { superstarId: "randy-savage", method: "agility", cost: 3, requirements: { agility: 1 }, damage: 5, setOpponentPosture: "on-mat", effectText: "On connect: opponent ditches 1 page.", onConnect: [{ type: "discard", target: "opponent", amount: 1 }] }),
  savageKneeDrop: move("hof1-savage-knee-drop", "Macho Knee Drop", { superstarId: "randy-savage", method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5, requiresPosture: "on-mat" }),
  savageHotshot: move("hof1-savage-hotshot", "Hotshot", { superstarId: "randy-savage", method: "strike", cost: 4, requirements: { strike: 1 }, damage: 6 }),
  savageSuplex: move("hof1-savage-suplex", "Macho Suplex", { superstarId: "randy-savage", method: "agility", cost: 4, requirements: { agility: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  savageCrossbody: move("hof1-savage-crossbody", "Flying Crossbody", { superstarId: "randy-savage", method: "agility", cost: 5, requirements: { agility: 1 }, damage: 7 }),
  savageElbowSmash: move("hof1-savage-elbow-smash", "Macho Elbow Smash", { superstarId: "randy-savage", method: "strike", cost: 4, requirements: { strike: 1 }, damage: 6 }),
  savagePiledriver: move("hof1-savage-piledriver", "Macho Piledriver", { superstarId: "randy-savage", method: "technical", cost: 5, requirements: { technical: 1 }, damage: 8, setOpponentPosture: "on-mat", stunTurns: 1, effectText: "On connect: Stun the opponent for 1 turn." }),
  savageElbow: move("hof1-savage-elbow", "Macho Man Elbow Drop", { superstarId: "randy-savage", method: "agility", cost: 7, requirements: { agility: 2 }, damage: 10, requiresPosture: "on-mat", finisher: true }),

  // Ultimate Warrior
  warriorPunch: move("hof1-warrior-punch", "Warrior Punch", { superstarId: "ultimate-warrior", method: "strike", cost: 2, requirements: { strike: 1 }, damage: 3 }),
  warriorClothesline: move("hof1-warrior-clothesline", "Warrior Clothesline", { superstarId: "ultimate-warrior", method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5, effectText: "On connect: gain +1 additional Attitude.", onConnect: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }),
  warriorShoulder: move("hof1-warrior-shoulder", "Flying Shoulder Block", { superstarId: "ultimate-warrior", method: "strength", cost: 3, requirements: { strength: 1 }, damage: 5, setOpponentPosture: "on-mat" }),
  warriorPress: move("hof1-warrior-press", "Gorilla Press", { superstarId: "ultimate-warrior", method: "strength", cost: 5, requirements: { strength: 2 }, damage: 8, setOpponentPosture: "on-mat", effectText: "On connect: opponent ditches 1 page.", onConnect: [{ type: "discard", target: "opponent", amount: 1 }] }),
  warriorBearhug: move("hof1-warrior-bearhug", "Warrior Bearhug", { superstarId: "ultimate-warrior", cost: 4, requirements: { strength: 1 }, damage: 1, submission: { bodyPart: "back", damage: 3 } }),
  warriorPowerslam: move("hof1-warrior-powerslam", "Warrior Powerslam", { superstarId: "ultimate-warrior", method: "strength", cost: 4, requirements: { strength: 1 }, damage: 7, setOpponentPosture: "on-mat" }),
  warriorBigBoot: move("hof1-warrior-big-boot", "Warrior Big Boot", { superstarId: "ultimate-warrior", method: "strike", cost: 4, requirements: { strike: 1 }, damage: 6 }),
  warriorSuplex: move("hof1-warrior-suplex", "Warrior Suplex", { superstarId: "ultimate-warrior", method: "strength", cost: 4, requirements: { strength: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  warriorSplash: move("hof1-warrior-splash", "Warrior Splash", { superstarId: "ultimate-warrior", method: "strength", cost: 7, requirements: { strength: 2 }, damage: 10, requiresPosture: "on-mat", finisher: true }),
  warriorPressDrop: move("hof1-warrior-press-drop", "Gorilla Press Drop", { superstarId: "ultimate-warrior", method: "strength", cost: 6, requirements: { strength: 2 }, damage: 9, setOpponentPosture: "on-mat" }),

  // Stone Cold Steve Austin
  austinPunch: move("hof1-austin-punch", "Stone Cold Right Hands", { superstarId: "stone-cold-steve-austin", method: "strike", cost: 2, requirements: { strike: 1 }, damage: 3 }),
  austinClothesline: move("hof1-austin-clothesline", "Stone Cold Clothesline", { superstarId: "stone-cold-steve-austin", method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5 }),
  austinElbow: move("hof1-austin-elbow", "Pointed Elbow Drop", { superstarId: "stone-cold-steve-austin", method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5, requiresPosture: "on-mat" }),
  austinSpinebuster: move("hof1-austin-spinebuster", "Stone Cold Spinebuster", { superstarId: "stone-cold-steve-austin", method: "strength", cost: 4, requirements: { strength: 1 }, damage: 7, setOpponentPosture: "on-mat" }),
  austinSuplex: move("hof1-austin-suplex", "Stone Cold Suplex", { superstarId: "stone-cold-steve-austin", method: "technical", cost: 4, requirements: { technical: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  austinMudhole: move("hof1-austin-mudhole", "Stomp a Mudhole", { superstarId: "stone-cold-steve-austin", method: "strike", cost: 5, requirements: { strike: 2 }, damage: 7, requiresPosture: "on-mat", effectText: "On connect: gain +1 additional Attitude.", onConnect: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }),
  austinLouThesz: move("hof1-austin-lou-thesz", "Lou Thesz Press", { superstarId: "stone-cold-steve-austin", method: "strike", cost: 4, requirements: { strike: 1 }, damage: 7, setOpponentPosture: "on-mat", effectText: "On connect: draw 1 page.", onConnect: [{ type: "draw", amount: 1 }] }),
  austinMillionDollarDream: move("hof1-austin-million-dollar-dream", "Million Dollar Dream", { superstarId: "stone-cold-steve-austin", cost: 5, requirements: { technical: 1 }, damage: 1, submission: { bodyPart: "head", damage: 4 } }),
  austinKickGut: move("hof1-austin-kick-gut", "Kick to the Gut", { superstarId: "stone-cold-steve-austin", method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5, effectText: "On connect: search your Playbook for Stone Cold Stunner and put it in your hand.", onConnect: [{ type: "searchDeck", cardId: "hof1-austin-stunner" }] }),
  austinStunner: move("hof1-austin-stunner", "Stone Cold Stunner", { superstarId: "stone-cold-steve-austin", method: "strike", cost: 7, requirements: { strike: 2 }, damage: 10, setOpponentPosture: "on-mat", finisher: true }),

  // Undertaker
  takerPunch: move("hof1-taker-punch", "Undertaker Right Hands", { superstarId: "the-undertaker", method: "strike", cost: 2, requirements: { strike: 1 }, damage: 3 }),
  takerBigBoot: move("hof1-taker-big-boot", "Undertaker Big Boot", { superstarId: "the-undertaker", method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5 }),
  takerOldSchool: move("hof1-taker-old-school", "Old School", { superstarId: "the-undertaker", method: "strike", cost: 4, requirements: { strike: 1 }, damage: 6, effectText: "On connect: draw 1 page.", onConnect: [{ type: "draw", amount: 1 }] }),
  takerFlyingClothesline: move("hof1-taker-flying-clothesline", "Flying Clothesline", { superstarId: "the-undertaker", method: "strike", cost: 4, requirements: { strike: 1 }, damage: 6 }),
  takerLegDrop: move("hof1-taker-leg-drop", "Apron Leg Drop", { superstarId: "the-undertaker", method: "strike", cost: 5, requirements: { strike: 1 }, damage: 7, requiresPosture: "on-mat" }),
  takerChokeslam: move("hof1-taker-chokeslam", "Chokeslam", { superstarId: "the-undertaker", method: "strength", cost: 5, requirements: { strength: 1 }, damage: 9, setOpponentPosture: "on-mat", effectText: "On connect: opponent loses 1 additional Attitude; search your Playbook for Tombstone Piledriver.", onConnect: [{ type: "loseMomentum", target: "opponent", method: "attitude", amount: 1 }, { type: "searchDeck", cardId: "hof1-taker-tombstone" }] }),
  takerSnakeEyes: move("hof1-taker-snake-eyes", "Snake Eyes", { superstarId: "the-undertaker", method: "strength", cost: 4, requirements: { strength: 1 }, damage: 6, effectText: "On connect: opponent ditches 1 page.", onConnect: [{ type: "discard", target: "opponent", amount: 1 }] }),
  takerLastRide: move("hof1-taker-last-ride", "Last Ride", { superstarId: "the-undertaker", method: "strength", cost: 6, requirements: { strength: 2 }, damage: 9, setOpponentPosture: "on-mat" }),
  takerHellGate: move("hof1-taker-hells-gate", "Hell's Gate", { superstarId: "the-undertaker", cost: 6, requirements: { technical: 2 }, damage: 1, requiresPosture: "on-mat", submission: { bodyPart: "head", damage: 5 } }),
  takerTombstone: move("hof1-taker-tombstone", "Tombstone Piledriver", { superstarId: "the-undertaker", method: "strength", cost: 7, requirements: { strength: 2 }, damage: 11, setOpponentPosture: "on-mat", finisher: true }),

  // Mankind
  mankindPunch: move("hof1-mankind-punch", "Mankind Right Hands", { superstarId: "mankind", method: "strike", cost: 2, requirements: { strike: 1 }, damage: 3, effectText: "On connect: opponent ditches 1 page.", onConnect: [{ type: "discard", target: "opponent", amount: 1 }] }),
  mankindKnee: move("hof1-mankind-knee", "Running Knee", { superstarId: "mankind", method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5, effectText: "On connect: gain +1 additional Attitude.", onConnect: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }),
  mankindNeckbreaker: move("hof1-mankind-neckbreaker", "Swinging Neckbreaker", { superstarId: "mankind", method: "technical", cost: 3, requirements: { technical: 1 }, damage: 5, setOpponentPosture: "on-mat" }),
  mankindElbow: move("hof1-mankind-elbow", "Cactus Elbow", { superstarId: "mankind", method: "strike", cost: 4, requirements: { strike: 1 }, damage: 6, requiresPosture: "on-mat" }),
  mankindLegDrop: move("hof1-mankind-leg-drop", "Ringside Leg Drop", { superstarId: "mankind", method: "agility", cost: 4, requirements: { agility: 1 }, damage: 6, requiresLocation: "ringside" }),
  mankindBulldog: move("hof1-mankind-bulldog", "Mankind Bulldog", { superstarId: "mankind", method: "technical", cost: 4, requirements: { technical: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  mankindPiledriver: move("hof1-mankind-piledriver", "Mankind Piledriver", { superstarId: "mankind", method: "strength", cost: 5, requirements: { strength: 1 }, damage: 8, setOpponentPosture: "on-mat" }),
  mankindDoubleArm: move("hof1-mankind-double-arm-ddt", "Double Arm DDT", { superstarId: "mankind", method: "technical", cost: 5, requirements: { technical: 1 }, damage: 9, setOpponentPosture: "on-mat", effectText: "On connect: opponent ditches 1 page.", onConnect: [{ type: "discard", target: "opponent", amount: 1 }] }),
  mankindSocko: move("hof1-mankind-mr-socko", "Mr. Socko", { superstarId: "mankind", cost: 5, requirements: { technical: 1 }, damage: 1, submission: { bodyPart: "head", damage: 4 } }),
  mankindClaw: move("hof1-mankind-mandible-claw", "Mandible Claw", { superstarId: "mankind", cost: 7, requirements: { technical: 2 }, damage: 1, submission: { bodyPart: "head", damage: 6 }, finisher: true }),

  // Kane
  kaneUppercut: move("hof1-kane-uppercut", "Kane Uppercut", { superstarId: "kane", method: "strike", cost: 2, requirements: { strike: 1 }, damage: 4, effectText: "On connect: gain +1 additional Attitude.", onConnect: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }),
  kaneBigBoot: move("hof1-kane-big-boot", "Kane Big Boot", { superstarId: "kane", method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5 }),
  kaneClothesline: move("hof1-kane-clothesline", "Kane Clothesline", { superstarId: "kane", method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5 }),
  kaneSidewalk: move("hof1-kane-sidewalk-slam", "Sidewalk Slam", { superstarId: "kane", method: "strength", cost: 4, requirements: { strength: 1 }, damage: 7, setOpponentPosture: "on-mat", effectText: "On connect: draw 1 page.", onConnect: [{ type: "draw", amount: 1 }] }),
  kaneFlyingClothesline: move("hof1-kane-flying-clothesline", "Flying Clothesline", { superstarId: "kane", method: "agility", cost: 4, requirements: { agility: 1 }, damage: 6 }),
  kanePowerbomb: move("hof1-kane-powerbomb", "Kane Powerbomb", { superstarId: "kane", method: "strength", cost: 5, requirements: { strength: 2 }, damage: 8, setOpponentPosture: "on-mat", effectText: "On connect: opponent ditches 1 page.", onConnect: [{ type: "discard", target: "opponent", amount: 1 }] }),
  kaneChokeslam: move("hof1-kane-chokeslam", "Chokeslam from Hell", { superstarId: "kane", method: "strength", cost: 6, requirements: { strength: 2 }, damage: 9, setOpponentPosture: "on-mat" }),
  kaneBearhug: move("hof1-kane-bearhug", "Kane Bearhug", { superstarId: "kane", cost: 5, requirements: { strength: 2 }, damage: 1, submission: { bodyPart: "back", damage: 4 } }),
  kaneTombstone: move("hof1-kane-tombstone", "Tombstone Piledriver", { superstarId: "kane", method: "strength", cost: 7, requirements: { strength: 2 }, damage: 10, setOpponentPosture: "on-mat", finisher: true }),
  kaneTiltWhirl: move("hof1-kane-tilt-whirl", "Tilt-a-Whirl Slam", { superstarId: "kane", method: "strength", cost: 5, requirements: { strength: 1 }, damage: 8, setOpponentPosture: "on-mat" })
};
