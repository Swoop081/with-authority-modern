import { normalizeMoveOptions } from "./move-types.js";
const momentum = (method) => ({ id: `momentum-${method}`, name: `${method[0].toUpperCase()}${method.slice(1)} Momentum`, kind: "momentum", method, amount: 1 });
const entrance = (id, name, superstarId, abilityText, effects = [], scheduled = []) => ({ id, name, superstarId, kind: "entrance", abilityText, effects, scheduled });
const move = (id, name, options = {}) => ({ id, name, kind: "move", ...normalizeMoveOptions(id, name, options) });
const special = (id, name, options = {}) => ({ id, name, kind: "special", ...options });
const action = (id, name, abilityText, effects = [], options = {}) => ({ id, name, kind: "action", abilityText, effects, ...options });
const support = (id, name, abilityText, passive = {}, options = {}) => ({ id, name, kind: "support", abilityText, passive, ...options });

export const cards = {
  momentum: {
    agility: momentum("agility"), knowledge: momentum("knowledge"), strength: momentum("strength"),
    strike: momentum("strike"), technical: momentum("technical")
  },

  codyEntrance: entrance("entrance-cody-rhodes", "Finish the Story", "cody-rhodes", "Pre-Match — At the start of Turn 5, gain +1 Agility Momentum.", [], [{ trigger: "TURN_START", atTurn: 5, effects: [{ type: "gainMomentum", method: "agility", amount: 1 }] }]),
  punkEntrance: entrance("entrance-cm-punk", "Best in the World", "cm-punk", "Pre-Match — Begin with +1 Technical Momentum.", [{ type: "gainMomentum", method: "technical", amount: 1 }]),
  romanEntrance: entrance("entrance-roman-reigns", "Acknowledge Me", "roman-reigns", "Pre-Match — Begin with +1 Strength Momentum. At Turn 6, gain +1 Attitude Momentum.", [{ type: "gainMomentum", method: "strength", amount: 1 }], [{ trigger: "TURN_START", atTurn: 6, effects: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }]),
  sethEntrance: entrance("entrance-seth-rollins", "The Visionary", "seth-rollins", "Pre-Match — Begin with +1 Technical Momentum.", [{ type: "gainMomentum", method: "technical", amount: 1 }]),
  obaEntrance: entrance("entrance-oba-femi", "The Ruler Has Arrived", "oba-femi", "Pre-Match — At Turn 10, gain +1 Strength Momentum.", [], [{ trigger: "TURN_START", atTurn: 10, effects: [{ type: "gainMomentum", method: "strength", amount: 1 }] }]),
  brockEntrance: entrance("entrance-brock-lesnar", "Here Comes the Pain", "brock-lesnar", "Pre-Match — On Brock's first two Control turns that begin with the opponent Stunned, draw 1 page.", [], [{ trigger: "CONTROL_START", maxTriggers: 2, when: { opponentStunned: true }, effects: [{ type: "draw", amount: 1 }] }]),
  owensEntrance: entrance("entrance-kevin-owens", "Fight Owens Fight", "kevin-owens", "Pre-Match — Begin with +1 Technical Momentum. From Turn 8 onward, the first time Owens is behind in HP at a turn start, gain +1 Attitude Momentum.", [{ type: "gainMomentum", method: "technical", amount: 1 }], [{ trigger: "TURN_START", minTurn: 8, maxTriggers: 1, when: { behindHp: true }, effects: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }]),
  guntherEntrance: entrance("entrance-gunther", "The Ring General", "gunther", "Pre-Match — Begin with +1 Strike and +1 Technical Momentum. At Turns 5 and 10, gain +1 Attitude Momentum.", [{ type: "gainMomentum", method: "strike", amount: 1 }, { type: "gainMomentum", method: "technical", amount: 1 }], [{ trigger: "TURN_START", startAt: 5, every: 5, maxTriggers: 2, effects: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }]),

  // Defensive Specials.
  shoulderUp: special("shoulder-up", "Shoulder Up", { abilityText: "Pin response — stop the pin and take Control.", pinEscape: true }),
  desperationCounter: special("desperation-counter", "Desperation Counter", { abilityText: "Counter response — counter any Move. Powerful, but scarce.", counterAny: true }),

  // Actions — one per Control turn. They resolve immediately and go to discard.
  fireUp: action("fire-up", "Fire Up", "Action — Gain 2 Attitude Momentum.", [{ type: "gainMomentum", method: "attitude", amount: 2 }]),
  catchBreath: action("catch-breath", "Catch Your Breath", "Action — Recover 3 HP, up to your starting HP.", [{ type: "recoverHp", amount: 3 }]),
  gamePlan: action("game-plan", "Game Plan", "Action — Your next Move this Control turn has its total Momentum threshold reduced by 2.", [{ type: "nextMoveCostModifier", amount: -2 }]),
  createOpening: action("create-opening", "Create an Opening", "Action — Your next declared Move gets +2 damage if it connects.", [{ type: "nextMoveDamageBonus", amount: 2 }]),
  cutOffRing: action("cut-off-ring", "Cut Off the Ring", "Ringside Action — Your opponent cannot Return to Ring on their next Control turn.", [{ type: "blockOpponentReturn", amount: 2 }], { requiresLocation: "ringside", requiresOpponentLocation: "ringside" }),

  // Supports — persistent cards. Maximum two active Supports per wrestler.
  ringGeneralship: support("ring-generalship", "Ring Generalship", "Support — Count +1 virtual Total Momentum when checking Move costs.", { totalMomentumBonus: 1 }),
  fightingSpirit: support("fighting-spirit", "Fighting Spirit", "Support — Reduce damage from each connected Move by 1 (minimum 0).", { damageReduction: 1 }),
  crowdConnection: support("crowd-connection", "Crowd Connection", "Support — Gain +1 extra Attitude whenever one of your Moves connects.", { connectedAttitudeBonus: 1 }),
  scoutingReport: support("scouting-report", "Scouting Report", "Support — Draw 1 extra page whenever you successfully Counter a Move.", { counterDraw: 1 }),

  // Shared engine-test/basic tools.
  jab: move("jab", "Quick Jab", { method: "strike", cost: 1, damage: 2 }),
  armDrag: move("arm-drag", "Arm Drag", { method: "technical", cost: 2, requirements: { technical: 1 }, damage: 3, setOpponentPosture: "on-mat", effectText: "On connect: draw 1 page.", onConnect: [{ type: "draw", amount: 1 }] }),
  throwOverRopes: move("throw-over-ropes", "Throw Over the Ropes", { method: "strength", cost: 3, damage: 4, requiresLocation: "ring", sendOpponentOutside: true }),
  ringsideClothesline: move("ringside-clothesline", "Ringside Clothesline", { method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5, requiresLocation: "ringside" }),
  ringsideSlam: move("ringside-slam", "Ringside Slam", { method: "strength", cost: 4, requirements: { strength: 1 }, damage: 7, requiresLocation: "ringside", stunTurns: 1 }),
  ringsideDDT: move("ringside-ddt", "Ringside DDT", { method: "technical", cost: 5, requirements: { technical: 1 }, damage: 8, requiresLocation: "ringside", setOpponentPosture: "on-mat" }),

  // SummerSlam Series 1 common wrestling move pool — designed to keep decks varied and independently playable.
  collarElbow: move("collar-elbow", "Collar-and-Elbow Tie-Up", { method: "technical", cost: 1, damage: 1 }),
  sideHeadlock: move("side-headlock", "Side Headlock", { method: "technical", cost: 1, requirements: { technical: 1 }, damage: 2 }),
  wristLock: move("wrist-lock", "Wrist Lock", { method: "technical", cost: 1, requirements: { technical: 1 }, damage: 2 }),
  shoulderTackle: move("shoulder-tackle", "Shoulder Tackle", { method: "strength", cost: 2, requirements: { strength: 1 }, damage: 3 }),
  runningForearm: move("running-forearm", "Running Forearm", { method: "strike", cost: 2, requirements: { strike: 1 }, damage: 3, effectText: "On connect: gain +1 additional Attitude.", onConnect: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }),
  elbowSmash: move("elbow-smash", "Elbow Smash", { method: "strike", cost: 2, requirements: { strike: 1 }, damage: 3 }),
  uppercut: move("uppercut", "Uppercut", { method: "strike", cost: 2, requirements: { strike: 1 }, damage: 3 }),
  hipToss: move("hip-toss", "Hip Toss", { method: "technical", cost: 2, requirements: { technical: 1 }, damage: 3, setOpponentPosture: "on-mat", effectText: "On connect: draw 1 page.", onConnect: [{ type: "draw", amount: 1 }] }),
  snapmare: move("snapmare", "Snapmare", { method: "technical", cost: 2, requirements: { technical: 1 }, damage: 3, setOpponentPosture: "on-mat", effectText: "On connect: opponent ditches 1 page.", onConnect: [{ type: "discard", target: "opponent", amount: 1 }] }),
  bodyslam: move("bodyslam", "Bodyslam", { method: "strength", cost: 2, requirements: { strength: 1 }, damage: 4, setOpponentPosture: "on-mat", effectText: "On connect: draw 1 page.", onConnect: [{ type: "draw", amount: 1 }] }),
  clothesline: move("clothesline", "Clothesline", { method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5, effectText: "On connect: gain +1 additional Attitude.", onConnect: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }),
  dropkick: move("dropkick", "Dropkick", { method: "agility", cost: 3, requirements: { agility: 1 }, damage: 5 }),
  bigBoot: move("big-boot", "Big Boot", { method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5 }),
  superkick: move("superkick", "Superkick", { method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5 }),
  ddt: move("ddt", "DDT", { method: "technical", cost: 3, requirements: { technical: 1 }, damage: 5, setOpponentPosture: "on-mat", effectText: "On connect: opponent loses 1 additional Attitude.", onConnect: [{ type: "loseMomentum", target: "opponent", method: "attitude", amount: 1 }] }),
  neckbreaker: move("neckbreaker", "Neckbreaker", { method: "technical", cost: 3, requirements: { technical: 1 }, damage: 5, setOpponentPosture: "on-mat" }),
  backbreaker: move("backbreaker", "Backbreaker", { method: "strength", cost: 3, requirements: { strength: 1 }, damage: 5, setOpponentPosture: "on-mat" }),
  legSweep: move("leg-sweep", "Leg Sweep", { method: "technical", cost: 3, requirements: { technical: 1 }, damage: 4, setOpponentPosture: "on-mat" }),
  elbowDrop: move("elbow-drop", "Elbow Drop", { method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5, requiresPosture: "on-mat" }),
  kneeDrop: move("knee-drop", "Knee Drop", { method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5, requiresPosture: "on-mat" }),
  legDrop: move("leg-drop", "Leg Drop", { method: "agility", cost: 3, requirements: { agility: 1 }, damage: 5, requiresPosture: "on-mat" }),
  verticalSuplex: move("vertical-suplex", "Vertical Suplex", { method: "technical", cost: 4, requirements: { technical: 1, strength: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  snapSuplex: move("snap-suplex", "Snap Suplex", { method: "technical", cost: 4, requirements: { technical: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  germanSuplexCommon: move("german-suplex-common", "German Suplex", { method: "strength", cost: 4, requirements: { strength: 1 }, damage: 6, setOpponentPosture: "on-mat", effectText: "On connect: draw 1 page.", onConnect: [{ type: "draw", amount: 1 }] }),
  bellyToBellyCommon: move("belly-to-belly-common", "Belly-to-Belly Suplex", { method: "strength", cost: 4, requirements: { strength: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  russianLegSweep: move("russian-leg-sweep", "Russian Leg Sweep", { method: "technical", cost: 4, requirements: { technical: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  bulldog: move("bulldog", "Bulldog", { method: "technical", cost: 4, requirements: { technical: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  spinebuster: move("spinebuster", "Spinebuster", { method: "strength", cost: 4, requirements: { strength: 1 }, damage: 7, setOpponentPosture: "on-mat", effectText: "On connect: opponent loses 1 additional Attitude.", onConnect: [{ type: "loseMomentum", target: "opponent", method: "attitude", amount: 1 }] }),
  powerslam: move("powerslam", "Powerslam", { method: "strength", cost: 4, requirements: { strength: 1 }, damage: 7, setOpponentPosture: "on-mat" }),
  samoanDropCommon: move("samoan-drop-common", "Samoan Drop", { method: "strength", cost: 4, requirements: { strength: 1 }, damage: 7, setOpponentPosture: "on-mat" }),
  enzuigiriCommon: move("enzuigiri-common", "Enzuigiri", { method: "agility", cost: 4, requirements: { agility: 1, strike: 1 }, damage: 6, stunTurns: 1 }),
  runningKneeCommon: move("running-knee-common", "Running Knee Strike", { method: "strike", cost: 4, requirements: { strike: 1 }, damage: 6, stunTurns: 1 }),
  lariat: move("lariat", "Lariat", { method: "strike", cost: 4, requirements: { strike: 1 }, damage: 7 }),
  flyingClothesline: move("flying-clothesline", "Flying Clothesline", { method: "agility", cost: 4, requirements: { agility: 1 }, damage: 6 }),
  sentonCommon: move("senton-common", "Senton", { method: "agility", cost: 4, requirements: { agility: 1 }, damage: 6, requiresPosture: "on-mat" }),
  splash: move("splash", "Body Splash", { method: "agility", cost: 4, requirements: { agility: 1 }, damage: 6, requiresPosture: "on-mat" }),
  bostonCrab: move("boston-crab", "Boston Crab", { cost: 5, requirements: { technical: 1 }, damage: 1, requiresPosture: "on-mat", submission: { bodyPart: "leg", damage: 3 } }),
  sleeperCommon: move("sleeper-common", "Sleeper Hold", { cost: 5, requirements: { technical: 1 }, damage: 1, submission: { bodyPart: "head", damage: 3 } }),
  armbar: move("armbar", "Armbar", { cost: 5, requirements: { technical: 2 }, damage: 1, requiresPosture: "on-mat", submission: { bodyPart: "arm", damage: 3 } }),
  powerbomb: move("powerbomb", "Powerbomb", { method: "strength", cost: 5, requirements: { strength: 2 }, damage: 8, setOpponentPosture: "on-mat", effectText: "On connect: opponent ditches 1 page.", onConnect: [{ type: "discard", target: "opponent", amount: 1 }] }),
  piledriver: move("piledriver", "Piledriver", { method: "strength", cost: 6, requirements: { strength: 2 }, damage: 8, setOpponentPosture: "on-mat" }),
  fishermanSuplex: move("fisherman-suplex", "Fisherman Suplex", { method: "technical", cost: 5, requirements: { technical: 2 }, damage: 7, setOpponentPosture: "on-mat" }),
  moonsault: move("moonsault", "Moonsault", { method: "agility", cost: 6, requirements: { agility: 2 }, damage: 8, requiresPosture: "on-mat" }),
  frogSplash: move("frog-splash", "Frog Splash", { method: "agility", cost: 6, requirements: { agility: 2 }, damage: 8, requiresPosture: "on-mat" }),
  divingCrossbody: move("diving-crossbody", "Diving Crossbody", { method: "agility", cost: 5, requirements: { agility: 1 }, damage: 7 }),
  suicideDive: move("suicide-dive", "Suicide Dive", { method: "agility", cost: 5, requirements: { agility: 1 }, damage: 7, sendOpponentOutside: true, requiresLocation: "ring" }),
  sitoutPowerbomb: move("sitout-powerbomb", "Sit-Out Powerbomb", { method: "strength", cost: 6, requirements: { strength: 2 }, damage: 9, setOpponentPosture: "on-mat" }),
  superplex: move("superplex", "Superplex", { method: "strength", cost: 6, requirements: { strength: 2 }, damage: 9, setOpponentPosture: "on-mat" }),
  brainbuster: move("brainbuster", "Brainbuster", { method: "technical", cost: 6, requirements: { technical: 2 }, damage: 9, setOpponentPosture: "on-mat" }),

  // Shared defensive tools.
  dodge: move("dodge", "Dodge", { method: "agility", cost: 1, counters: ["strike", "power"], effectText: "On Counter: draw 1 page.", onCounter: [{ type: "draw", amount: 1 }] }),
  duck: move("duck", "Duck", { method: "agility", cost: 1, counters: ["strike"] }),
  reversal: move("reversal", "Technical Reversal", { method: "technical", cost: 2, counters: ["technical", "power", "submission"], effectText: "On Counter: gain +1 Attitude.", onCounter: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }),
  scramble: move("scramble", "Scramble Free", { method: "technical", cost: 2, counters: ["submission", "technical"], effectText: "On Counter: opponent ditches 1 page.", onCounter: [{ type: "discard", target: "opponent", amount: 1 }] }),

  // Cody Rhodes — balanced agility/technical attack with strike accents.
  disasterKick: move("disaster-kick", "Disaster Kick", { superstarId: "cody-rhodes", method: "agility", cost: 3, requirements: { agility: 1 }, damage: 5, effectText: "On connect: gain +1 additional Attitude.", onConnect: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }),
  codyPowerslam: move("cody-powerslam", "Snap Powerslam", { superstarId: "cody-rhodes", method: "technical", cost: 3, requirements: { technical: 1 }, damage: 5, setOpponentPosture: "on-mat", effectText: "On connect: draw 1 page.", onConnect: [{ type: "draw", amount: 1 }] }),
  bionicElbow: move("bionic-elbow", "Bionic Elbow", { superstarId: "cody-rhodes", method: "strike", cost: 4, requirements: { strike: 1 }, damage: 6, effectText: "On connect: gain +1 additional Attitude.", onConnect: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }),
  codyCutter: move("cody-cutter", "Cody Cutter", { superstarId: "cody-rhodes", method: "agility", cost: 5, requirements: { agility: 2 }, damage: 7, setOpponentPosture: "on-mat", effectText: "On connect: opponent ditches 1 page.", onConnect: [{ type: "discard", target: "opponent", amount: 1 }] }),
  crossRhodes: move("cross-rhodes", "Cross Rhodes", { superstarId: "cody-rhodes", method: "technical", cost: 7, requirements: { technical: 2 }, damage: 10, setOpponentPosture: "on-mat", finisher: true, effectText: "On connect: opponent loses 1 additional Attitude.", onConnect: [{ type: "loseMomentum", target: "opponent", method: "attitude", amount: 1 }] }),

  codyDropDownPunch: move("cody-drop-down-punch", "Drop-Down Punch", { superstarId: "cody-rhodes", method: "strike", cost: 2, requirements: { strike: 1 }, damage: 3, effectText: "On connect: draw 1 page.", onConnect: [{ type: "draw", amount: 1 }] }),
  codySuicideDive: move("cody-suicide-dive", "Cody Suicide Dive", { superstarId: "cody-rhodes", method: "agility", cost: 4, requirements: { agility: 1 }, damage: 6, requiresLocation: "ring", sendOpponentOutside: true }),
  codyMoonsault: move("cody-moonsault", "Cody Moonsault", { superstarId: "cody-rhodes", method: "agility", cost: 5, requirements: { agility: 2 }, damage: 7, requiresPosture: "on-mat" }),
  codyPedigree: move("cody-pedigree", "Pedigree", { superstarId: "cody-rhodes", method: "technical", cost: 6, requirements: { technical: 2 }, damage: 8, setOpponentPosture: "on-mat" }),
  codySpear: move("cody-spear", "Spear", { superstarId: "cody-rhodes", method: "strength", cost: 5, requirements: { strength: 1 }, damage: 7, setOpponentPosture: "on-mat" }),

  // CM Punk — technical counters, strikes and submission pressure.
  punkRoundhouse: move("punk-roundhouse", "Roundhouse Kick", { superstarId: "cm-punk", method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5, effectText: "On connect: opponent ditches 1 page.", onConnect: [{ type: "discard", target: "opponent", amount: 1 }] }),
  runningKnee: move("running-knee", "Running Knee", { superstarId: "cm-punk", method: "strike", cost: 4, requirements: { strike: 1, technical: 1 }, damage: 6, stunTurns: 1, effectText: "On connect: gain +1 additional Attitude.", onConnect: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }),
  punkNeckbreaker: move("punk-neckbreaker", "Swinging Neckbreaker", { superstarId: "cm-punk", method: "technical", cost: 4, requirements: { technical: 1 }, damage: 6, setOpponentPosture: "on-mat", effectText: "On connect: draw 1 page.", onConnect: [{ type: "draw", amount: 1 }] }),
  divingElbow: move("diving-elbow", "Diving Elbow Drop", { superstarId: "cm-punk", method: "agility", cost: 5, requirements: { agility: 1, technical: 1 }, damage: 7, requiresPosture: "on-mat" }),
  anacondaVise: move("anaconda-vise", "Anaconda Vise", { superstarId: "cm-punk", cost: 6, requirements: { technical: 2 }, damage: 2, requiresPosture: "on-mat", submission: { bodyPart: "head", damage: 4 } }),
  gts: move("gts", "G.T.S.", { superstarId: "cm-punk", method: "strike", cost: 7, requirements: { technical: 2 }, damage: 10, stunTurns: 1, finisher: true, effectText: "On connect: opponent ditches 1 page.", onConnect: [{ type: "discard", target: "opponent", amount: 1 }] }),

  punkLegLariat: move("punk-leg-lariat", "Leg Lariat", { superstarId: "cm-punk", method: "agility", cost: 2, requirements: { strike: 1 }, damage: 4 }),
  punkSnapSuplex: move("punk-snap-suplex", "Snap Suplex", { superstarId: "cm-punk", method: "technical", cost: 3, requirements: { technical: 1 }, damage: 5, setOpponentPosture: "on-mat", effectText: "On connect: draw 1 page.", onConnect: [{ type: "draw", amount: 1 }] }),
  punkBulldog: move("punk-bulldog", "Running Bulldog", { superstarId: "cm-punk", method: "technical", cost: 4, requirements: { technical: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  punkHighKick: move("punk-high-kick", "High Kick", { superstarId: "cm-punk", method: "strike", cost: 4, requirements: { strike: 1 }, damage: 6, stunTurns: 1 }),
  punkPiledriver: move("punk-piledriver", "Piledriver", { superstarId: "cm-punk", method: "technical", cost: 6, requirements: { technical: 2 }, damage: 8, setOpponentPosture: "on-mat" }),

  // Roman Reigns — high-damage power/strike offense and a submission route.
  driveBy: move("drive-by", "Drive-By", { superstarId: "roman-reigns", method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5, effectText: "On connect: opponent ditches 1 page.", onConnect: [{ type: "discard", target: "opponent", amount: 1 }] }),
  uranage: move("uranage", "Uranage", { superstarId: "roman-reigns", method: "strength", cost: 4, requirements: { strength: 1 }, damage: 6, setOpponentPosture: "on-mat", effectText: "On connect: opponent ditches 1 page.", onConnect: [{ type: "discard", target: "opponent", amount: 1 }] }),
  samoanDrop: move("samoan-drop", "Samoan Drop", { superstarId: "roman-reigns", method: "strength", cost: 5, requirements: { strength: 2 }, damage: 7, setOpponentPosture: "on-mat" }),
  supermanPunch: move("superman-punch", "Superman Punch", { superstarId: "roman-reigns", method: "strike", cost: 5, requirements: { strike: 2 }, damage: 7, stunTurns: 1, effectText: "On connect: opponent loses 1 additional Attitude; search your Playbook for Spear.", onConnect: [{ type: "loseMomentum", target: "opponent", method: "attitude", amount: 1 }, { type: "searchDeck", cardId: "spear" }] }),
  guillotine: move("guillotine", "Guillotine", { superstarId: "roman-reigns", cost: 6, requirements: { strength: 1 }, damage: 2, submission: { bodyPart: "head", damage: 5 } }),
  spear: move("spear", "Spear", { superstarId: "roman-reigns", method: "strength", cost: 7, requirements: { strength: 2 }, damage: 11, setOpponentPosture: "on-mat", finisher: true, effectText: "On connect: gain +1 additional Attitude.", onConnect: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }),

  romanUppercut: move("roman-uppercut", "Leaping Uppercut", { superstarId: "roman-reigns", method: "strike", cost: 2, requirements: { strike: 1 }, damage: 4, effectText: "On connect: gain +1 additional Attitude.", onConnect: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }),
  romanClothesline: move("roman-clothesline", "Running Clothesline", { superstarId: "roman-reigns", method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5 }),
  romanPowerbomb: move("roman-powerbomb", "Sit-Out Powerbomb", { superstarId: "roman-reigns", method: "strength", cost: 5, requirements: { strength: 2 }, damage: 8, setOpponentPosture: "on-mat" }),
  romanDriveByRingside: move("roman-drive-by-ringside", "Drive-By Dropkick", { superstarId: "roman-reigns", method: "agility", cost: 5, requirements: { strike: 1 }, damage: 7, requiresLocation: "ringside" }),
  romanCrucifixPowerbomb: move("roman-crucifix-powerbomb", "Crucifix Powerbomb", { superstarId: "roman-reigns", method: "strength", cost: 6, requirements: { strength: 2 }, damage: 9, setOpponentPosture: "on-mat" }),

  // Seth Rollins — fast multi-method offense that rewards setup and sequencing.
  slingBlade: move("sling-blade", "Sling Blade", { superstarId: "seth-rollins", method: "agility", cost: 3, requirements: { agility: 1 }, damage: 5, setOpponentPosture: "on-mat", effectText: "On connect: draw 1 page and leave the opponent On the Mat.", onConnect: [{ type: "draw", amount: 1 }] }),
  enzuigiri: move("enzuigiri", "Enzuigiri", { superstarId: "seth-rollins", method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5, stunTurns: 1, effectText: "On connect: opponent ditches 1 page.", onConnect: [{ type: "discard", target: "opponent", amount: 1 }] }),
  falconArrow: move("falcon-arrow", "Falcon Arrow", { superstarId: "seth-rollins", method: "technical", cost: 5, requirements: { technical: 1 }, damage: 7, setOpponentPosture: "on-mat", effectText: "On connect: draw 1 page.", onConnect: [{ type: "draw", amount: 1 }] }),
  pedigree: move("pedigree", "Pedigree", { superstarId: "seth-rollins", method: "technical", cost: 6, requirements: { technical: 2 }, damage: 8, setOpponentPosture: "on-mat", effectText: "On connect: opponent loses 1 additional Attitude; search your Playbook for Stomp.", onConnect: [{ type: "loseMomentum", target: "opponent", method: "attitude", amount: 1 }, { type: "searchDeck", cardId: "stomp" }] }),
  phoenixSplash: move("phoenix-splash", "Phoenix Splash", { superstarId: "seth-rollins", method: "agility", cost: 6, requirements: { agility: 2 }, damage: 8, requiresPosture: "on-mat", effectText: "On connect: draw 1 page.", onConnect: [{ type: "draw", amount: 1 }] }),
  stomp: move("stomp", "Stomp", { superstarId: "seth-rollins", method: "strike", tacticalType: "standing-above", cost: 6, requirements: { strike: 1 }, damage: 11, requiresPosture: "on-mat", finisher: true, effectText: "On connect: gain +1 additional Attitude.", onConnect: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }),

  sethSuperkick: move("seth-superkick", "Superkick", { superstarId: "seth-rollins", method: "strike", cost: 2, requirements: { strike: 1 }, damage: 4 }),
  sethSuicideDive: move("seth-suicide-dive", "Suicide Dive", { superstarId: "seth-rollins", method: "agility", cost: 4, requirements: { agility: 1 }, damage: 6, requiresLocation: "ring", sendOpponentOutside: true }),
  sethSpringboardKnee: move("seth-springboard-knee", "Springboard Knee", { superstarId: "seth-rollins", method: "agility", cost: 4, requirements: { agility: 1, strike: 1 }, damage: 6 }),
  sethRipcordKnee: move("seth-ripcord-knee", "Ripcord Knee", { superstarId: "seth-rollins", method: "strike", cost: 5, requirements: { strike: 2 }, damage: 7, stunTurns: 1 }),
  sethSuperplexFalcon: move("seth-superplex-falcon", "Superplex into Falcon Arrow", { superstarId: "seth-rollins", method: "technical", cost: 7, requirements: { technical: 2 }, damage: 9, setOpponentPosture: "on-mat" }),

  // Oba Femi — overwhelming Strength and power.
  obaLariat: move("oba-lariat", "Ruler's Lariat", { superstarId: "oba-femi", method: "strike", cost: 3, requirements: { strength: 1 }, damage: 5, effectText: "On connect: gain +1 additional Attitude.", onConnect: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }),
  obaSpinebuster: move("oba-spinebuster", "Spinebuster", { superstarId: "oba-femi", method: "strength", cost: 3, requirements: { strength: 1 }, damage: 6, setOpponentPosture: "on-mat", effectText: "On connect: opponent loses 1 additional Attitude.", onConnect: [{ type: "loseMomentum", target: "opponent", method: "attitude", amount: 1 }] }),
  obaPowerbomb: move("oba-powerbomb", "Powerbomb", { superstarId: "oba-femi", method: "strength", cost: 5, requirements: { strength: 2 }, damage: 8, setOpponentPosture: "on-mat" }),
  fallFromGrace: move("fall-from-grace", "Fall from Grace", { superstarId: "oba-femi", method: "strength", cost: 7, requirements: { strength: 3 }, damage: 11, setOpponentPosture: "on-mat", finisher: true, effectText: "On connect: opponent ditches 1 page.", onConnect: [{ type: "discard", target: "opponent", amount: 1 }] }),

  obaShoulderBlock: move("oba-shoulder-block", "Running Shoulder Block", { superstarId: "oba-femi", method: "strength", cost: 2, requirements: { strength: 1 }, damage: 4 }),
  obaChokeslam: move("oba-chokeslam", "Chokeslam", { superstarId: "oba-femi", method: "strength", cost: 4, requirements: { strength: 2 }, damage: 7, setOpponentPosture: "on-mat" }),
  obaBackbreaker: move("oba-backbreaker", "Backbreaker", { superstarId: "oba-femi", method: "strength", cost: 4, requirements: { strength: 1 }, damage: 7, setOpponentPosture: "on-mat" }),
  obaPopUpPowerbomb: move("oba-pop-up-powerbomb", "Pop-Up Powerbomb", { superstarId: "oba-femi", method: "strength", cost: 6, requirements: { strength: 3 }, damage: 9, setOpponentPosture: "on-mat" }),
  obaRunningUppercut: move("oba-running-uppercut", "Running Uppercut", { superstarId: "oba-femi", method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5 }),

  // Brock Lesnar — explosive power plus Kimura submission threat.
  germanSuplex: move("german-suplex", "German Suplex", { superstarId: "brock-lesnar", method: "strength", cost: 3, requirements: { strength: 1 }, damage: 5, setOpponentPosture: "on-mat", effectText: "On connect: draw 1 page.", onConnect: [{ type: "draw", amount: 1 }] }),
  bellyToBelly: move("belly-to-belly", "Belly-to-Belly Suplex", { superstarId: "brock-lesnar", method: "strength", cost: 3, requirements: { strength: 1 }, damage: 6, setOpponentPosture: "on-mat", effectText: "On connect: gain +1 additional Attitude.", onConnect: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }),
  kimuraLock: move("kimura-lock", "Kimura Lock", { superstarId: "brock-lesnar", cost: 6, requirements: { strength: 2, technical: 1 }, damage: 2, requiresPosture: "on-mat", submission: { bodyPart: "arm", damage: 5 } }),
  f5: move("f5", "F-5", { superstarId: "brock-lesnar", method: "strength", cost: 7, requirements: { strength: 3 }, damage: 11, setOpponentPosture: "on-mat", finisher: true, effectText: "On connect: opponent ditches 1 page.", onConnect: [{ type: "discard", target: "opponent", amount: 1 }] }),

  brockKneeStrike: move("brock-knee-strike", "Knee Strike", { superstarId: "brock-lesnar", method: "strike", cost: 2, requirements: { strength: 1 }, damage: 4 }),
  brockOverheadBelly: move("brock-overhead-belly", "Overhead Belly-to-Belly", { superstarId: "brock-lesnar", method: "strength", cost: 4, requirements: { strength: 2 }, damage: 7, setOpponentPosture: "on-mat" }),
  brockTripleGermans: move("brock-triple-germans", "Suplex City", { superstarId: "brock-lesnar", method: "strength", cost: 5, requirements: { strength: 2 }, damage: 8, setOpponentPosture: "on-mat", effectText: "On connect: draw 1 page.", onConnect: [{ type: "draw", amount: 1 }] }),
  brockPowerbomb: move("brock-powerbomb", "Powerbomb", { superstarId: "brock-lesnar", method: "strength", cost: 5, requirements: { strength: 2 }, damage: 8, setOpponentPosture: "on-mat" }),
  brockClothesline: move("brock-clothesline", "Brock Clothesline", { superstarId: "brock-lesnar", method: "strike", cost: 3, requirements: { strength: 1 }, damage: 6 }),

  // Kevin Owens — brawling, sudden counters and explosive finishers.
  owensSuperkick: move("owens-superkick", "Superkick", { superstarId: "kevin-owens", method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5, effectText: "On connect: draw 1 page.", onConnect: [{ type: "draw", amount: 1 }] }),
  senton: move("owens-senton", "Senton", { superstarId: "kevin-owens", method: "agility", cost: 3, requirements: { strike: 1 }, damage: 5, requiresPosture: "on-mat" }),
  cannonball: move("cannonball", "Cannonball", { superstarId: "kevin-owens", method: "strike", cost: 3, requirements: { strike: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  popUpPowerbomb: move("pop-up-powerbomb", "Pop-up Powerbomb", { superstarId: "kevin-owens", method: "strength", cost: 6, requirements: { strength: 1, strike: 1 }, damage: 9, setOpponentPosture: "on-mat", effectText: "On connect: opponent ditches 1 page.", onConnect: [{ type: "discard", target: "opponent", amount: 1 }] }),
  koStunner: move("ko-stunner", "Stunner", { superstarId: "kevin-owens", method: "strike", cost: 7, requirements: { strike: 2 }, damage: 10, stunTurns: 1, finisher: true, effectText: "On connect: gain +1 additional Attitude.", onConnect: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }),

  owensForearm: move("owens-forearm", "Running Forearm", { superstarId: "kevin-owens", method: "strike", cost: 2, requirements: { strike: 1 }, damage: 4, effectText: "On connect: opponent ditches 1 page.", onConnect: [{ type: "discard", target: "opponent", amount: 1 }] }),
  owensDDT: move("owens-ddt", "DDT", { superstarId: "kevin-owens", method: "technical", cost: 3, requirements: { technical: 1 }, damage: 5, setOpponentPosture: "on-mat", effectText: "On connect: opponent ditches 1 page.", onConnect: [{ type: "discard", target: "opponent", amount: 1 }] }),
  owensSwanton: move("owens-swanton", "Swanton Bomb", { superstarId: "kevin-owens", method: "agility", cost: 5, requirements: { agility: 1 }, damage: 7, requiresPosture: "on-mat" }),
  owensPackagePiledriver: move("owens-package-piledriver", "Package Piledriver", { superstarId: "kevin-owens", method: "strength", cost: 6, requirements: { strength: 2 }, damage: 9, setOpponentPosture: "on-mat" }),
  owensFrogSplash: move("owens-frog-splash", "Frog Splash", { superstarId: "kevin-owens", method: "agility", cost: 5, requirements: { agility: 1 }, damage: 7, requiresPosture: "on-mat" }),

  // Gunther — punishing strikes, Powerbomb and Sleeper Hold.
  guntherChop: move("gunther-chop", "Knife-Edge Chop", { superstarId: "gunther", method: "strike", cost: 2, requirements: { strike: 1 }, damage: 4, effectText: "On connect: opponent loses 1 additional Attitude.", onConnect: [{ type: "loseMomentum", target: "opponent", method: "attitude", amount: 1 }] }),
  guntherLariat: move("gunther-lariat", "Lariat", { superstarId: "gunther", method: "strike", cost: 3, requirements: { strike: 2 }, damage: 7, effectText: "On connect: opponent ditches 1 page.", onConnect: [{ type: "discard", target: "opponent", amount: 1 }] }),
  guntherPowerbomb: move("gunther-powerbomb", "Powerbomb", { superstarId: "gunther", method: "strength", cost: 6, requirements: { strength: 1 }, damage: 9, setOpponentPosture: "on-mat", finisher: true, effectText: "On connect: gain +1 additional Attitude.", onConnect: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }),
  guntherBigBoot: move("gunther-big-boot", "Big Boot", { superstarId: "gunther", method: "strike", cost: 2, requirements: { strike: 1 }, damage: 4 }),
  guntherGerman: move("gunther-german", "German Suplex", { superstarId: "gunther", method: "strength", cost: 4, requirements: { strength: 1 }, damage: 7, setOpponentPosture: "on-mat", effectText: "On connect: draw 1 page.", onConnect: [{ type: "draw", amount: 1 }] }),
  guntherButterflySuplex: move("gunther-butterfly-suplex", "Butterfly Suplex", { superstarId: "gunther", method: "technical", cost: 4, requirements: { technical: 1, strength: 1 }, damage: 7, setOpponentPosture: "on-mat" }),
  guntherBostonCrab: move("gunther-boston-crab", "Boston Crab", { superstarId: "gunther", cost: 5, requirements: { technical: 1 }, damage: 1, requiresPosture: "on-mat", submission: { bodyPart: "leg", damage: 4 } }),
  guntherSplash: move("gunther-splash", "Top-Rope Splash", { superstarId: "gunther", method: "agility", cost: 6, requirements: { strength: 1 }, damage: 8, requiresPosture: "on-mat" }),
  sleeperHold: move("sleeper-hold", "Sleeper Hold", { superstarId: "gunther", cost: 7, requirements: { technical: 1, strength: 1 }, damage: 2, submission: { bodyPart: "head", damage: 8 }, finisher: true })
};
