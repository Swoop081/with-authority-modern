import { normalizeMoveOptions } from "./move-types.js";

const SET_ID = "evolution-series-1";
const momentum = (method) => ({ id: `evo1-momentum-${method}`, name: `${method[0].toUpperCase()}${method.slice(1)} Momentum`, kind: "momentum", method, amount: 1, setId: SET_ID });
const entrance = (id, name, superstarId, abilityText, effects = [], scheduled = []) => ({ id, name, superstarId, kind: "entrance", abilityText, effects, scheduled, setId: SET_ID });
const move = (id, name, options = {}) => {
  const normalized = normalizeMoveOptions(id, name, options);
  return { id, name, kind: "move", setId: SET_ID, ...normalized };
};
const special = (id, name, options = {}) => ({ id, name, kind: "special", setId: SET_ID, ...options });
const action = (id, name, abilityText, effects = [], options = {}) => ({ id, name, kind: "action", abilityText, effects, setId: SET_ID, ...options });
const support = (id, name, abilityText, passive = {}, options = {}) => ({ id, name, kind: "support", abilityText, passive, setId: SET_ID, ...options });

export const evolutionCards = {
  momentum: {
    agility: momentum("agility"), strength: momentum("strength"), strike: momentum("strike"), technical: momentum("technical")
  },

  // Entrances are linked to the named Superstar and resolve before the bell.
  rheaEntrance: entrance("evo1-entrance-rhea-ripley", "This Is My Brutality", "rhea-ripley", "Pre-Match — Begin with +1 Strength. First Strike Move for 6+ damage gains +1 Attitude.", [{ type: "gainMomentum", method: "strength", amount: 1 }], [{ trigger: "ON_MOVE_CONNECTED", maxTriggers: 1, when: { methods: ["strike"], minDamage: 6 }, effects: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }]),
  livEntrance: entrance("evo1-entrance-liv-morgan", "Livin’ Large", "liv-morgan", "Pre-Match — Begin with +1 Agility. First Agility Move costing 5+ draws 1.", [{ type: "gainMomentum", method: "agility", amount: 1 }], [{ trigger: "ON_MOVE_CONNECTED", maxTriggers: 1, when: { methods: ["agility"], minCost: 5 }, effects: [{ type: "draw", amount: 1 }] }]),
  beckyEntrance: entrance("evo1-entrance-becky-lynch", "Big Time Becks", "becky-lynch", "Pre-Match — Begin with +1 Technical. First successful Counter draws 1.", [{ type: "gainMomentum", method: "technical", amount: 1 }]),
  bayleyEntrance: entrance("evo1-entrance-bayley", "Ding Dong, Hello!", "bayley", "Pre-Match — Begin with +1 Technical. First posture-changing Move draws 1.", [{ type: "gainMomentum", method: "technical", amount: 1 }]),
  charlotteEntrance: entrance("evo1-entrance-charlotte-flair", "All Hail The Queen", "charlotte-flair", "Pre-Match — Begin with +1 Technical. First multi-method Move gains +1 Attitude.", [{ type: "gainMomentum", method: "technical", amount: 1 }]),
  iyoEntrance: entrance("evo1-entrance-iyo-sky", "Tokyo Shock", "iyo-sky", "Pre-Match — Begin with +1 Agility. First low-cost Agility Move costs 1 less.", [{ type: "gainMomentum", method: "agility", amount: 1 }, { type: "nextControlMoveCostModifier", amount: -1 }]),
  paigeEntrance: entrance("evo1-entrance-paige", "Scream for Me", "paige", "Pre-Match — Begin with +1 Technical. First Technical connection searches the top of the Playbook for Counter/Submission support.", [{ type: "gainMomentum", method: "technical", amount: 1 }]),
  stephanieEntrance: entrance("evo1-entrance-stephanie-vaquer", "The Dark Angel", "stephanie-vaquer", "Pre-Match — Begin with +1 Technical. First Move after a posture change draws 1.", [{ type: "gainMomentum", method: "technical", amount: 1 }]),

  evolutionKickout: special("evo1-shoulder-up", "Refuse to Stay Down", { abilityText: "Pin response — stop the pin and take Control.", pinEscape: true }),
  evolutionCounter: special("evo1-desperation-counter", "Momentum Shift", { abilityText: "Counter response — counter any Move.", counterAny: true }),

  seizeMoment: action("evo1-seize-moment", "Seize the Moment", "Action — Gain 2 Attitude Momentum.", [{ type: "gainMomentum", method: "attitude", amount: 2 }]),
  regroup: action("evo1-regroup", "Regroup", "Action — Recover 3 HP.", [{ type: "recoverHp", amount: 3 }]),
  changePace: action("evo1-change-pace", "Change the Pace", "Action — Your next Move costs 2 less Total Momentum this turn.", [{ type: "nextMoveCostModifier", amount: -2 }]),
  openingStrike: action("evo1-opening-strike", "Create the Opening", "Action — Your next connected Move deals +2 damage.", [{ type: "nextMoveDamageBonus", amount: 2 }]),

  crowdEnergy: support("evo1-crowd-energy", "Crowd Energy", "Support — Gain +1 extra Attitude when your Move connects.", { connectedAttitudeBonus: 1 }),
  ringIQ: support("evo1-ring-iq", "Ring IQ", "Support — Count +1 virtual Total Momentum for Move costs.", { totalMomentumBonus: 1 }),
  fightingHeart: support("evo1-fighting-heart", "Fighting Heart", "Support — Reduce connected Move damage by 1.", { damageReduction: 1 }),
  counterTiming: support("evo1-counter-timing", "Counter Timing", "Support — Draw 1 extra page after a successful Counter.", { counterDraw: 1 }),

  // 50 shared common Moves — a broad wrestling vocabulary usable by every Superstar.
  quickJab: move("evo1-quick-jab", "Quick Jab", { method: "strike", cost: 1, damage: 2 }),
  forearmSmash: move("evo1-forearm-smash", "Forearm Smash", { method: "strike", cost: 2, requirements: { strike: 1 }, damage: 3 }),
  europeanUppercut: move("evo1-european-uppercut", "European Uppercut", { method: "strike", cost: 2, requirements: { strike: 1 }, damage: 3 }),
  knifeEdgeChop: move("evo1-knife-edge-chop", "Knife-Edge Chop", { method: "strike", cost: 2, requirements: { strike: 1 }, damage: 3, effectText: "On connect: opponent loses 1 additional Attitude.", onConnect: [{ type: "loseMomentum", target: "opponent", method: "attitude", amount: 1 }] }),
  backElbow: move("evo1-back-elbow", "Back Elbow", { method: "strike", cost: 2, damage: 3 }),
  runningKnee: move("evo1-running-knee", "Running Knee", { method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5 }),
  dropkick: move("evo1-dropkick", "Dropkick", { method: "agility", cost: 3, requirements: { agility: 1 }, damage: 5 }),
  missileDropkick: move("evo1-missile-dropkick", "Missile Dropkick", { method: "agility", cost: 4, requirements: { agility: 1 }, damage: 6 }),
  enzuigiri: move("evo1-enzuigiri", "Enzuigiri", { method: "agility", cost: 2, requirements: { agility: 1 }, damage: 4 }),
  superkick: move("evo1-superkick", "Superkick", { method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5 }),
  bigBoot: move("evo1-big-boot", "Big Boot", { method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5 }),
  clothesline: move("evo1-clothesline", "Clothesline", { method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5 }),
  lariat: move("evo1-lariat", "Lariat", { method: "strike", cost: 4, requirements: { strike: 2 }, damage: 6 }),
  slingBlade: move("evo1-sling-blade", "Sling Blade", { method: "agility", cost: 3, requirements: { agility: 1 }, damage: 5, setOpponentPosture: "on-mat" }),
  hipToss: move("evo1-hip-toss", "Hip Toss", { method: "technical", cost: 2, requirements: { technical: 1 }, damage: 3, setOpponentPosture: "on-mat" }),
  armDrag: move("evo1-arm-drag", "Arm Drag", { method:"technical", cost:2, requirements:{}, damage:4, setOpponentPosture:"on-mat" }),
  snapmare: move("evo1-snapmare", "Snapmare", { method: "technical", cost: 2, requirements: { technical: 1 }, damage: 3, setOpponentPosture: "on-mat" }),
  neckbreaker: move("evo1-neckbreaker", "Neckbreaker", { method: "technical", cost: 3, requirements: { technical: 1 }, damage: 5, setOpponentPosture: "on-mat" }),
  ddt: move("evo1-ddt", "DDT", { method: "technical", cost: 3, requirements: { technical: 1 }, damage: 5, setOpponentPosture: "on-mat" }),
  snapSuplex: move("evo1-snap-suplex", "Snap Suplex", { method: "technical", cost: 3, requirements: { technical: 1 }, damage: 5, setOpponentPosture: "on-mat" }),
  germanSuplex: move("evo1-german-suplex", "German Suplex", { method: "strength", cost: 4, requirements: { strength: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  bellyToBelly: move("evo1-belly-to-belly", "Belly-to-Belly Suplex", { method: "strength", cost: 4, requirements: { strength: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  dragonSuplex: move("evo1-dragon-suplex", "Dragon Suplex", { method: "technical", cost: 5, requirements: { technical: 2 }, damage: 7, setOpponentPosture: "on-mat" }),
  exploderSuplex: move("evo1-exploder-suplex", "Exploder Suplex", { method: "strength", cost: 4, requirements: { strength: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  backbreaker: move("evo1-backbreaker", "Backbreaker", { method: "strength", cost: 3, requirements: { strength: 1 }, damage: 5 }),
  sidewalkSlam: move("evo1-sidewalk-slam", "Sidewalk Slam", { method: "strength", cost: 4, requirements: { strength: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  spinebuster: move("evo1-spinebuster", "Spinebuster", { method: "strength", cost: 4, requirements: { strength: 1 }, damage: 7, setOpponentPosture: "on-mat" }),
  powerslam: move("evo1-powerslam", "Powerslam", { method: "strength", cost: 4, requirements: { strength: 1 }, damage: 7, setOpponentPosture: "on-mat" }),
  powerbomb: move("evo1-powerbomb", "Powerbomb", { method: "strength", cost: 5, requirements: { strength: 2 }, damage: 8, setOpponentPosture: "on-mat" }),
  sitoutPowerbomb: move("evo1-sitout-powerbomb", "Sit-Out Powerbomb", { method: "strength", cost: 6, requirements: { strength: 2 }, damage: 9, setOpponentPosture: "on-mat" }),
  hurricanrana: move("evo1-hurricanrana", "Hurricanrana", { method: "agility", cost: 3, requirements: { agility: 1 }, damage: 5, setOpponentPosture: "on-mat" }),
  headscissors: move("evo1-headscissors", "Headscissors Takedown", { method: "agility", cost: 3, requirements: { agility: 1 }, damage: 5, setOpponentPosture: "on-mat" }),
  facebuster: move("evo1-facebuster", "Facebuster", { method: "technical", cost: 3, requirements: { technical: 1 }, damage: 5, setOpponentPosture: "on-mat" }),
  bulldog: move("evo1-bulldog", "Bulldog", { method: "technical", cost: 3, requirements: { technical: 1 }, damage: 5, setOpponentPosture: "on-mat" }),
  sto: move("evo1-sto", "STO", { method: "technical", cost: 4, requirements: { technical: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  uranage: move("evo1-uranage", "Uranage", { method: "strength", cost: 5, requirements: { strength: 1 }, damage: 7, setOpponentPosture: "on-mat" }),
  legSweep: move("evo1-leg-sweep", "Leg Sweep", { method: "technical", cost: 2, requirements: { technical: 1 }, damage: 3, setOpponentPosture: "on-mat" }),
  kneeDrop: move("evo1-knee-drop", "Knee Drop", { method: "agility", cost: 3, requirements: { agility: 1 }, damage: 5, requiresPosture: "on-mat" }),
  elbowDrop: move("evo1-elbow-drop", "Elbow Drop", { method: "agility", cost: 3, requirements: { agility: 1 }, damage: 5, requiresPosture: "on-mat" }),
  doubleStomp: move("evo1-double-stomp", "Double Stomp", { method: "agility", cost: 4, requirements: { agility: 1 }, damage: 6, requiresPosture: "on-mat" }),
  divingCrossbody: move("evo1-diving-crossbody", "Diving Crossbody", { method: "agility", cost: 5, requirements: { agility: 2 }, damage: 7 }),
  divingElbow: move("evo1-diving-elbow", "Diving Elbow", { method: "agility", cost: 5, requirements: { agility: 2 }, damage: 7, requiresPosture: "on-mat" }),
  moonsault: move("evo1-moonsault", "Moonsault", { method: "agility", cost: 6, requirements: { agility: 2 }, damage: 8, requiresPosture: "on-mat" }),
  springboardDropkick: move("evo1-springboard-dropkick", "Springboard Dropkick", { method: "agility", cost: 4, requirements: { agility: 1 }, damage: 6 }),
  suicideDive: move("evo1-suicide-dive", "Suicide Dive", { method: "agility", cost: 4, requirements: { agility: 1 }, damage: 6, sendOpponentRingside: true, followOutside: true }),
  spear: move("evo1-spear", "Spear", { method: "strength", cost: 5, requirements: { strength: 1 }, damage: 8, setOpponentPosture: "on-mat" }),
  armbar: move("evo1-armbar", "Armbar", { method: "technical", cost: 4, requirements: { technical: 1 }, damage: 1, requiresPosture: "on-mat", submission: { bodyPart: "arm", damage: 4 } }),
  bostonCrab: move("evo1-boston-crab", "Boston Crab", { method: "technical", cost: 4, requirements: { technical: 1 }, damage: 1, requiresPosture: "on-mat", submission: { bodyPart: "leg", damage: 4 } }),
  crossface: move("evo1-crossface", "Crossface", { method: "technical", cost: 5, requirements: { technical: 2 }, damage: 1, requiresPosture: "on-mat", submission: { bodyPart: "head", damage: 5 } }),
  ringsOfSaturn: move("evo1-rings-of-saturn", "Rings of Saturn", { method: "technical", cost: 5, requirements: { technical: 2 }, damage: 1, requiresPosture: "on-mat", submission: { bodyPart: "arm", damage: 5 } }),
  dodge: move("evo1-dodge", "Dodge", { method: "agility", cost: 1, damage: 0, defensiveOnly: true }),
  duck: move("evo1-duck", "Duck", { method: "technical", cost: 1, damage: 0, defensiveOnly: true }),
  scramble: move("evo1-scramble-free", "Scramble Free", { method: "technical", cost: 2, damage: 0, defensiveOnly: true }),

  // Rhea Ripley — power, punishing strikes and the Prism Trap/Riptide finish sequence.
  rheaShortArmClothesline: move("evo1-rhea-short-arm-clothesline", "Rhea’s Short-Arm Clothesline", { superstarId:"rhea-ripley", method:"strength", cost:5, requirements:{strength:1,strike:1}, damage:8, setOpponentPosture:"on-mat" }),
  rheaHeadbutt: move("evo1-rhea-headbutt", "Rhea’s Headbutt", { superstarId:"rhea-ripley", method:"strike", cost:3, requirements:{strike:1}, damage:5, onConnect:[{type:"loseMomentum",target:"opponent",method:"attitude",amount:1}] }),
  rheaDropkick: move("evo1-rhea-dropkick", "Rhea Dropkick", { superstarId: "rhea-ripley", method: "agility", cost: 3, requirements: { agility: 1 }, damage: 5 }),
  rheaGerman: move("evo1-rhea-german-suplex", "Release German Suplex", { superstarId: "rhea-ripley", method: "strength", cost: 4, requirements: { strength: 1 }, damage: 7, setOpponentPosture: "on-mat" }),
  rheaRazorEdge: move("evo1-rhea-razors-edge", "Razor's Edge", { superstarId: "rhea-ripley", method: "strength", cost: 5, requirements: { strength: 2 }, damage: 8, setOpponentPosture: "on-mat", signature: true }),
  rheaPowerbomb: move("evo1-rhea-sitout-powerbomb", "Rhea Sit-Out Powerbomb", { superstarId: "rhea-ripley", method: "strength", cost: 5, requirements: { strength: 2 }, damage: 8, setOpponentPosture: "on-mat", signature: true }),
  rheaRipcordKnee: move("evo1-rhea-ripcord-knee", "Ripcord Knee", { superstarId:"rhea-ripley", method:"strike", cost:6, requirements:{strike:2}, damage:9, onConnect:[{type:"gainMomentum",method:"attitude",amount:1}] }),
  rheaElectricChair: move("evo1-rhea-electric-chair", "Electric Chair Drop", { superstarId: "rhea-ripley", method: "strength", cost: 5, requirements: { strength: 2 }, damage: 8, setOpponentPosture: "on-mat" }),
  rheaCannonball: move("evo1-rhea-cannonball", "Rhea Cannonball", { superstarId: "rhea-ripley", method: "agility", cost: 4, requirements: { agility: 1, strength: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  prismTrap: move("evo1-rhea-prism-trap", "Prism Trap", { superstarId:"rhea-ripley", method:"technical", cost:9, requirements:{technical:2,strength:1}, damage:8, requiresPosture:"on-mat", submission:{bodyPart:"leg",damage:7}, finisher:true }),
  riptide: move("evo1-rhea-riptide", "Riptide", { superstarId:"rhea-ripley", method:"strength", cost:8, requirements:{strength:2,strike:1}, damage:12, setOpponentPosture:"on-mat", trademark:true, pinBonus:4, pinAtHpRatio:0.20, onConnect:[{type:"searchDeck",cardIds:["evo1-rhea-prism-trap","evo1-rhea-avalanche-riptide"]},{type:"gainMomentum",method:"attitude",amount:2},{type:"gainMomentum",method:"strength",amount:1},{type:"gainMomentum",method:"technical",amount:1}] }),

  // Liv Morgan — speed, counters and sudden impact.
  livEnzuigiri: move("evo1-liv-enzuigiri", "Step-Up Enzuigiri", { superstarId: "liv-morgan", method: "agility", cost: 2, requirements: { agility: 1 }, damage: 4 }),
  livMissileDropkick: move("evo1-liv-missile-dropkick", "Liv Missile Dropkick", { superstarId: "liv-morgan", method: "agility", cost: 3, requirements: { agility: 1 }, damage: 5 }),
  livDoubleKnees: move("evo1-liv-double-knees", "Double Knees", { superstarId: "liv-morgan", method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5 }),
  livHurricanrana: move("evo1-liv-hurricanrana", "Liv Hurricanrana", { superstarId: "liv-morgan", method: "agility", cost: 3, requirements: { agility: 1 }, damage: 5, setOpponentPosture: "on-mat" }),
  livDDT: move("evo1-liv-ddt", "Liv DDT", { superstarId: "liv-morgan", method: "technical", cost: 3, requirements: { technical: 1 }, damage: 5, setOpponentPosture: "on-mat" }),
  livFacebuster: move("evo1-liv-facebuster", "Running Facebuster", { superstarId: "liv-morgan", method: "technical", cost: 4, requirements: { technical: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  livSpringboardKnee: move("evo1-liv-springboard-knee", "Springboard Knee", { superstarId: "liv-morgan", method: "agility", cost: 4, requirements: { agility: 1 }, damage: 6 }),
  livCodebreaker: move("evo1-liv-code-red", "Liv’s Code Red", { superstarId:"liv-morgan", method:"agility", cost:7, requirements:{agility:2,technical:1}, damage:10, setOpponentPosture:"standing", trademark:true, onConnect:[{type:"searchDeck",cardId:"evo1-liv-oblivion"},{type:"cardCostModifier",cardId:"evo1-liv-oblivion",amount:-1}] }),
  livRings: move("evo1-liv-rings-of-saturn", "Liv's Rings of Saturn", { superstarId: "liv-morgan", method: "technical", cost: 5, requirements: { technical: 1 }, damage: 1, requiresPosture: "on-mat", submission: { bodyPart: "arm", damage: 5 }, signature: true }),
  livSunsetBomb: move("evo1-liv-sunset-bomb", "Sunset Flip Bomb", { superstarId: "liv-morgan", method: "agility", cost: 5, requirements: { agility: 2 }, damage: 7, setOpponentPosture: "on-mat", signature: true }),
  oblivion: move("evo1-liv-oblivion", "Oblivion", { superstarId:"liv-morgan", method:"agility", cost:9, requirements:{agility:2,strike:1}, damage:15, requiresPosture:"standing", finisher:true }),

  // Becky Lynch — technical pressure, striking and submissions.
  beckyUppercut: move("evo1-becky-uppercut", "Becky European Uppercut", { superstarId: "becky-lynch", method: "strike", cost: 2, requirements: { strike: 1 }, damage: 4 }),
  beckyForearm: move("evo1-becky-forearm", "Running Forearm", { superstarId: "becky-lynch", method: "strike", cost: 2, requirements: { strike: 1 }, damage: 4 }),
  beckyExploder: move("evo1-becky-exploder", "Bexploder Suplex", { superstarId:"becky-lynch", method:"technical", cost:5, requirements:{technical:1,strike:1}, damage:8, setOpponentPosture:"on-mat", onConnect:[{type:"draw",amount:1}] }),
  beckyLegDrop: move("evo1-becky-leg-drop", "Diving Leg Drop", { superstarId: "becky-lynch", method: "agility", cost: 4, requirements: { agility: 1 }, damage: 6, requiresPosture: "on-mat" }),
  beckyMissileDropkick: move("evo1-becky-missile-dropkick", "Becky Missile Dropkick", { superstarId: "becky-lynch", method: "agility", cost: 4, requirements: { agility: 1 }, damage: 6 }),
  beckyReverseDDT: move("evo1-becky-reverse-ddt", "Reverse DDT", { superstarId: "becky-lynch", method: "technical", cost: 4, requirements: { technical: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  beckySpringboardKick: move("evo1-becky-springboard-kick", "Springboard Side Kick", { superstarId: "becky-lynch", method: "agility", cost: 4, requirements: { agility: 1, strike: 1 }, damage: 6 }),
  beckyDiscusForearm: move("evo1-becky-discus-forearm", "Discus Forearm", { superstarId: "becky-lynch", method: "strike", cost: 4, requirements: { strike: 2 }, damage: 7 }),
  beckyArmDrag: move("evo1-becky-arm-drag", "Becky Arm Drag", { superstarId: "becky-lynch", method: "technical", cost: 3, requirements: { technical: 1 }, damage: 4, setOpponentPosture: "on-mat" }),
  disarmher: move("evo1-becky-disarmher", "Dis-Arm-Her", { superstarId:"becky-lynch", method:"technical", cost:9, requirements:{technical:2,strike:1}, damage:7, requiresPosture:"on-mat", submission:{bodyPart:"arm",damage:8}, finisher:true }),
  manhandleSlam: move("evo1-becky-manhandle-slam", "Manhandle Slam", { superstarId:"becky-lynch", method:"strike", cost:7, requirements:{strike:2,technical:1}, damage:11, setOpponentPosture:"on-mat", trademark:true, onConnect:[{type:"searchDeck",cardId:"evo1-becky-disarmher"}] }),

  // Bayley — patient technical offense with bursts of aerial damage.
  bayleyRunningKnee: move("evo1-bayley-running-knee", "Bayley Running Knee", { superstarId: "bayley", method: "strike", cost: 2, requirements: { strike: 1 }, damage: 4 }),
  bayleySlidingClothesline: move("evo1-bayley-sliding-clothesline", "Sliding Clothesline", { superstarId: "bayley", method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5 }),
  bayleySuplex: move("evo1-bayley-suplex", "Bayley Suplex", { superstarId: "bayley", method: "technical", cost: 3, requirements: { technical: 1 }, damage: 5, setOpponentPosture: "on-mat" }),
  bayleyBackSuplex: move("evo1-bayley-back-suplex", "Bayley Back Suplex", { superstarId: "bayley", method: "technical", cost: 4, requirements: { technical: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  bayleyElbowDrop: move("evo1-bayley-elbow-drop", "Top-Rope Elbow Drop", { superstarId: "bayley", method: "agility", cost: 5, requirements: { agility: 1 }, damage: 7, requiresPosture: "on-mat", signature: true }),
  bayleySunsetBomb: move("evo1-bayley-sunset-bomb", "Sunset Flip Powerbomb", { superstarId: "bayley", method: "agility", cost: 5, requirements: { agility: 1, technical: 1 }, damage: 7, setOpponentPosture: "on-mat" }),
  bayleyMiddleElbow: move("evo1-bayley-middle-elbow", "Middle-Rope Elbow", { superstarId: "bayley", method: "agility", cost: 4, requirements: { agility: 1 }, damage: 6, requiresPosture: "on-mat" }),
  bayleyKneeDrop: move("evo1-bayley-knee-drop", "Running Knee Drop", { superstarId: "bayley", method: "strike", cost: 4, requirements: { strike: 1 }, damage: 6, requiresPosture: "on-mat" }),
  bayleyDDT: move("evo1-bayley-ddt", "Bayley DDT", { superstarId: "bayley", method: "technical", cost: 4, requirements: { technical: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  bayleyToBelly: move("evo1-bayley-to-belly", "Bayley-to-Belly", { superstarId:"bayley", method:"technical", cost:7, requirements:{technical:2,strike:1}, damage:10, setOpponentPosture:"on-mat", trademark:true, onConnect:[{type:"searchDeck",cardId:"evo1-bayley-rose-plant"}] }),
  rosePlant: move("evo1-bayley-rose-plant", "Rose Plant", { superstarId:"bayley", method:"technical", cost:9, requirements:{technical:2,strike:1}, damage:15, requiresPosture:"on-mat", finisher:true }),

  // Charlotte Flair — athletic power, precision and leg submissions.
  charlotteChops: move("evo1-charlotte-chops", "Charlotte’s Chop", { superstarId:"charlotte-flair", method:"technical", cost:3, requirements:{technical:1}, damage:5 }),
  charlotteBigBoot: move("evo1-charlotte-big-boot", "Charlotte’s Big Boot", { superstarId:"charlotte-flair", method:"strength", cost:5, requirements:{strength:1,technical:1}, damage:8, setOpponentPosture:"on-mat" }),
  charlotteExploder: move("evo1-charlotte-exploder", "Charlotte Exploder", { superstarId: "charlotte-flair", method: "strength", cost: 4, requirements: { strength: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  charlotteNeckbreaker: move("evo1-charlotte-neckbreaker", "Charlotte Neckbreaker", { superstarId: "charlotte-flair", method: "technical", cost: 4, requirements: { technical: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  charlottePowerbomb: move("evo1-charlotte-powerbomb", "Charlotte Powerbomb", { superstarId: "charlotte-flair", method: "strength", cost: 5, requirements: { strength: 2 }, damage: 8, setOpponentPosture: "on-mat" }),
  charlotteSpear: move("evo1-charlotte-spear", "Charlotte Spear", { superstarId: "charlotte-flair", method: "strength", cost: 5, requirements: { strength: 1 }, damage: 8, setOpponentPosture: "on-mat", signature: true }),
  charlotteMoonsault: move("evo1-charlotte-moonsault", "Charlotte Moonsault", { superstarId: "charlotte-flair", method: "agility", cost: 6, requirements: { agility: 2 }, damage: 8, requiresPosture: "on-mat", signature: true }),
  charlotteFallaway: move("evo1-charlotte-fallaway", "Fallaway Slam", { superstarId: "charlotte-flair", method: "strength", cost: 4, requirements: { strength: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  charlotteFigureFour: move("evo1-charlotte-figure-four", "Figure-Four Leglock", { superstarId:"charlotte-flair", method:"technical", cost:6, requirements:{technical:2}, damage:4, requiresPosture:"on-mat", submission:{bodyPart:"leg",damage:5}, onConnect:[{type:"searchDeck",cardId:"evo1-charlotte-figure-eight"},{type:"cardCostModifier",cardId:"evo1-charlotte-figure-eight",amount:-2},{type:"gainMomentum",method:"technical",amount:1},{type:"gainMomentum",method:"agility",amount:1}] }),
  naturalSelection: move("evo1-charlotte-natural-selection", "Natural Selection", { superstarId:"charlotte-flair", method:"technical", cost:7, requirements:{technical:2,agility:1}, damage:11, setOpponentPosture:"on-mat", trademark:true, pinBonus:5, pinAtHpRatio:0.22 }),
  figureEight: move("evo1-charlotte-figure-eight", "Figure Eight", { superstarId:"charlotte-flair", method:"technical", cost:10, requirements:{technical:3,agility:1}, damage:6, requiresPosture:"on-mat", submission:{bodyPart:"leg",damage:9}, finisher:true }),

  // IYO SKY — aerial innovation and explosive transitions.
  iyoDropkick: move("evo1-iyo-dropkick", "IYO Dropkick", { superstarId: "iyo-sky", method: "agility", cost: 2, requirements: { agility: 1 }, damage: 4 }),
  iyoMissileDropkick: move("evo1-iyo-missile-dropkick", "IYO Missile Dropkick", { superstarId: "iyo-sky", method: "agility", cost: 3, requirements: { agility: 1 }, damage: 5 }),
  iyoDoubleStomp: move("evo1-iyo-double-stomp", "IYO Double Stomp", { superstarId: "iyo-sky", method: "agility", cost: 4, requirements: { agility: 1 }, damage: 6, requiresPosture: "on-mat" }),
  iyoGerman: move("evo1-iyo-german", "IYO German Suplex", { superstarId: "iyo-sky", method: "technical", cost: 4, requirements: { technical: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  iyoPoisonRana: move("evo1-iyo-poison-rana", "Poison Rana", { superstarId: "iyo-sky", method: "agility", cost: 5, requirements: { agility: 2 }, damage: 7, setOpponentPosture: "on-mat", signature: true }),
  iyoSpanishFly: move("evo1-iyo-spanish-fly", "Spanish Fly", { superstarId: "iyo-sky", method: "agility", cost: 5, requirements: { agility: 2 }, damage: 7, setOpponentPosture: "on-mat", signature: true }),
  iyoSpringboardDropkick: move("evo1-iyo-springboard-dropkick", "IYO’s Springboard Dropkick", { superstarId:"iyo-sky", method:"agility", cost:3, requirements:{agility:1}, damage:5 }),
  iyoSuicideDive: move("evo1-iyo-suicide-dive", "IYO Suicide Dive", { superstarId: "iyo-sky", method: "agility", cost: 4, requirements: { agility: 1 }, damage: 6, sendOpponentRingside: true, followOutside: true }),
  iyoMeteora: move("evo1-iyo-meteora", "Running Meteora", { superstarId:"iyo-sky", method:"agility", cost:5, requirements:{agility:1,strike:1}, damage:8, setOpponentPosture:"on-mat" }),
  bulletTrain: move("evo1-iyo-bullet-train", "Bullet Train Attack", { superstarId: "iyo-sky", method: "strike", cost: 5, requirements: { strike: 1, agility: 1 }, damage: 7, trademark: true }),
  overTheMoonsault: move("evo1-iyo-over-the-moonsault", "Over the Moonsault", { superstarId:"iyo-sky", method:"agility", cost:10, requirements:{agility:3,strike:1}, damage:16, requiresPosture:"on-mat", finisher:true }),

  // Paige — technical counters and dangerous submissions.
  paigeSideKick: move("evo1-paige-side-kick", "Paige Side Kick", { superstarId: "paige", method: "strike", cost: 2, requirements: { strike: 1 }, damage: 4 }),
  paigeKneeStrikes: move("evo1-paige-knee-strikes", "Kneeling Knee Strikes", { superstarId: "paige", method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5 }),
  paigeShortClothesline: move("evo1-paige-short-clothesline", "Paige Short-Arm Clothesline", { superstarId: "paige", method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5 }),
  paigeCradleDDT: move("evo1-paige-cradle-ddt", "Cradle DDT", { superstarId: "paige", method: "technical", cost: 4, requirements: { technical: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  paigeFallaway: move("evo1-paige-fallaway", "Paige Fallaway Slam", { superstarId: "paige", method: "strength", cost: 4, requirements: { strength: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  paigeSuperkick: move("evo1-paige-superkick", "Paige’s Superkick", { superstarId:"paige", method:"strike", cost:4, requirements:{strike:1}, damage:7 }),
  paigeFisherman: move("evo1-paige-fisherman", "Fisherman Suplex", { superstarId: "paige", method: "technical", cost: 4, requirements: { technical: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  paigeTurner: move("evo1-paige-turner", "Paige Turner", { superstarId:"paige", method:"technical", cost:6, requirements:{technical:2}, damage:9, setOpponentPosture:"on-mat" }),
  paigeCrossface: move("evo1-paige-crossface", "Paige Crossface", { superstarId: "paige", method: "technical", cost: 5, requirements: { technical: 2 }, damage: 1, requiresPosture: "on-mat", submission: { bodyPart: "head", damage: 5 }, signature: true }),
  pto: move("evo1-paige-pto", "PTO — Paige Tap Out", { superstarId:"paige", method:"technical", cost:9, requirements:{technical:2,agility:1}, damage:7, requiresPosture:"on-mat", submission:{bodyPart:"leg",damage:8}, finisher:true }),
  ramPaige: move("evo1-paige-ram-paige", "Ram-Paige", { superstarId:"paige", method:"technical", cost:7, requirements:{technical:2,strike:1}, damage:11, setOpponentPosture:"on-mat", trademark:true, onConnect:[{type:"searchDeck",cardId:"evo1-paige-pto"},{type:"gainMomentum",method:"agility",amount:1},{type:"gainMomentum",method:"attitude",amount:2}] }),

  // Stephanie Vaquer — hard-hitting technical combinations.
  vaquerDragonScrew: move("evo1-vaquer-dragon-screw", "Dragon Screw Barrage", { superstarId:"stephanie-vaquer", method:"technical", cost:6, requirements:{technical:2}, damage:8, setOpponentPosture:"on-mat" }),
  vaquerRunningKnee: move("evo1-vaquer-running-knee", "Vaquer Running Knee", { superstarId: "stephanie-vaquer", method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5 }),
  vaquerDoubleKnees: move("evo1-vaquer-double-knees", "Vaquer Double Knees", { superstarId: "stephanie-vaquer", method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5 }),
  vaquerMeteora: move("evo1-vaquer-meteora", "Stephanie’s Meteora", { superstarId:"stephanie-vaquer", method:"agility", cost:6, requirements:{agility:1,strike:1}, damage:9, setOpponentPosture:"on-mat" }),
  vaquerSnapSuplex: move("evo1-vaquer-snap-suplex", "Vaquer Snap Suplex", { superstarId: "stephanie-vaquer", method: "technical", cost: 4, requirements: { technical: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  vaquerBackbreaker: move("evo1-vaquer-backbreaker", "Package Backbreaker", { superstarId:"stephanie-vaquer", method:"technical", cost:7, requirements:{technical:2,strike:1}, damage:11, setOpponentPosture:"standing", trademark:true, onConnect:[{type:"searchDeck",cardId:"evo1-vaquer-svb"},{type:"gainMomentum",method:"agility",amount:1},{type:"gainMomentum",method:"attitude",amount:2}] }),
  vaquerCrossbody: move("evo1-vaquer-crossbody", "Vaquer Diving Crossbody", { superstarId: "stephanie-vaquer", method: "agility", cost: 5, requirements: { agility: 1 }, damage: 7 }),
  lastChancery: move("evo1-vaquer-last-chancery", "Last Chancery", { superstarId: "stephanie-vaquer", method: "technical", cost: 5, requirements: { technical: 2 }, damage: 1, requiresPosture: "on-mat", submission: { bodyPart: "head", damage: 5 }, signature: true }),
  vaquerInferno: move("evo1-vaquer-inferno", "Vaquer Inferno", { superstarId: "stephanie-vaquer", method: "strike", cost: 5, requirements: { strike: 1, technical: 1 }, damage: 7, signature: true }),
  devilsKiss: move("evo1-vaquer-devils-kiss", "Devil’s Kiss", { superstarId:"stephanie-vaquer", method:"technical", cost:5, requirements:{technical:1,strike:1}, damage:7, requiresPosture:"on-mat", onConnect:[{type:"loseMomentum",target:"opponent",method:"attitude",amount:1}] }),
  svb: move("evo1-vaquer-svb", "SVB", { superstarId:"stephanie-vaquer", method:"technical", cost:9, requirements:{technical:2,strike:1,agility:1}, damage:15, requiresPosture:"standing", finisher:true }),

  bodySlamReviewed: move("evo1-body-slam-reviewed","Body Slam",{method:"strength",cost:2,requirements:{strength:1},damage:4,setOpponentPosture:"on-mat"}),
  rheaSpecial: special("evo1-rhea-eradicator","The Eradicator",{superstarId:"rhea-ripley",counterBoost:true}),
  rheaEradicate: action("evo1-rhea-eradicate","Eradicate","Rhea only — next Strength Move +2 damage; on connect strip 1 Attitude.",[{type:"nextMoveDamageBonus",amount:2}],{superstarId:"rhea-ripley"}),
  avalancheRiptide: move("evo1-rhea-avalanche-riptide","Avalanche Riptide",{superstarId:"rhea-ripley",method:"strength",cost:10,requirements:{strength:3,strike:1},damage:16,requiresPosture:"on-mat",finisher:true,pinBonus:5,pinAtHpRatio:0.22}),

  livSpecial: special("evo1-liv-extreme","Extreme",{superstarId:"liv-morgan",livExtreme:true}),
  livDropkickReviewed: move("evo1-liv-dropkick-reviewed","Liv’s Dropkick",{superstarId:"liv-morgan",method:"agility",cost:2,requirements:{agility:1},damage:5}),
  livJerseyCodebreaker: move("evo1-liv-jersey-codebreaker","Jersey Codebreaker",{superstarId:"liv-morgan",method:"strike",cost:6,requirements:{agility:1,strike:1},damage:9,onConnect:[{type:"discard",target:"opponent",amount:1}]}),
  livGotcha: move("evo1-liv-gotcha","Gotcha!",{superstarId:"liv-morgan",method:"agility",cost:4,requirements:{agility:1,technical:1},damage:4,setOpponentPosture:"on-mat"}),
  livRevengeTour: action("evo1-liv-revenge-tour","Revenge Tour","Liv only — draw 2 then discard 1; next Move +1 damage.",[{type:"draw",amount:2},{type:"nextMoveDamageBonus",amount:1}],{superstarId:"liv-morgan"}),

  beckySpecial: special("evo1-becky-straight-fire","Straight Fire",{superstarId:"becky-lynch",counterBoost:true}),
  beckyArmbarTakedown: move("evo1-becky-armbar-takedown","Becky’s Armbar Takedown",{superstarId:"becky-lynch",method:"technical",cost:4,requirements:{technical:1},damage:5,setOpponentPosture:"on-mat"}),
  beckyBeatThat: action("evo1-becky-beat-that","Been There, Beat That","Becky only — gain +1 Attitude, opponent loses 1, draw 1.",[{type:"gainMomentum",method:"attitude",amount:1},{type:"loseMomentum",target:"opponent",method:"attitude",amount:1},{type:"draw",amount:1}],{superstarId:"becky-lynch"}),

  bayleySpecial: special("evo1-bayley-grand-slam","Grand Slam",{superstarId:"bayley",bayleyGrandSlam:true}),
  bayleyBackElbowReviewed: move("evo1-bayley-back-elbow-reviewed","Bayley’s Back Elbow",{superstarId:"bayley",method:"strike",cost:3,requirements:{strike:1},damage:5,setOpponentPosture:"on-mat"}),
  bayleyMiddleRopeStunner: move("evo1-bayley-middle-rope-stunner","Middle Rope Stunner",{superstarId:"bayley",method:"technical",cost:5,requirements:{technical:1,agility:1},damage:8,setOpponentPosture:"on-mat",onConnect:[{type:"draw",amount:1}]}),
  bayleySunsetReviewed: move("evo1-bayley-sunset-reviewed","Turnbuckle Sunset Flip Powerbomb",{superstarId:"bayley",method:"agility",cost:7,requirements:{agility:2,technical:1},damage:10,setOpponentPosture:"on-mat",onConnect:[{type:"discard",target:"opponent",amount:1}]}),
  bayleyGetUp: action("evo1-bayley-get-up","Get Up!","Bayley only — stand the opponent up.",[{type:"setOpponentPosture",posture:"standing"}],{superstarId:"bayley"}),

  charlotteQueensGambit: move("evo1-charlotte-queens-gambit","Queen’s Gambit",{superstarId:"charlotte-flair",method:"technical",cost:3,requirements:{technical:1},damage:0,defensiveOnly:true,counterMethods:["technical","strength"],onCounter:[{type:"loseMomentum",target:"opponent",method:"attitude",amount:1}]}),
  charlotteSpecial: special("evo1-charlotte-bow-down","Bow Down",{superstarId:"charlotte-flair",bigCounterSpecial:true}),
  charlotteChopBlock: move("evo1-charlotte-chop-block","Charlotte’s Chop Block",{superstarId:"charlotte-flair",method:"technical",cost:4,requirements:{technical:1},damage:5,setOpponentPosture:"on-mat",onConnect:[{type:"limbDamage",target:"opponent",bodyPart:"leg",amount:3}]}),
  charlotteBackpackStunner: move("evo1-charlotte-backpack-stunner","Backpack Stunner",{superstarId:"charlotte-flair",method:"technical",cost:6,requirements:{strength:1,technical:1},damage:9,setOpponentPosture:"on-mat"}),
  charlotteGenetic: action("evo1-charlotte-genetic","Genetic Superiority","Charlotte only — next Move +2 damage.",[{type:"nextMoveDamageBonus",amount:2}],{superstarId:"charlotte-flair"}),

  iyoSpecial: special("evo1-iyo-skys-limit","Sky’s the Limit",{superstarId:"iyo-sky",iyoSkyLimit:true}),
  iyoMoonstomp: move("evo1-iyo-moonstomp","Moonstomp",{superstarId:"iyo-sky",method:"agility",cost:7,requirements:{agility:2,strike:1},damage:11,requiresPosture:"on-mat",trademark:true,onConnect:[{type:"searchDeck",cardId:"evo1-iyo-over-the-moonsault"},{type:"cardCostModifier",cardId:"evo1-iyo-over-the-moonsault",amount:-2},{type:"gainMomentum",method:"agility",amount:1},{type:"gainMomentum",method:"attitude",amount:1}]}),
  iyoAsaiMoonsault: move("evo1-iyo-asai-moonsault","Asai Moonsault",{superstarId:"iyo-sky",method:"agility",cost:7,requirements:{agility:3},damage:10}),
  iyoTakeFlight: action("evo1-iyo-take-flight","Take Flight","IYO only — draw 1 page and gain +1 Attitude.",[{type:"draw",amount:1},{type:"gainMomentum",method:"attitude",amount:1}],{superstarId:"iyo-sky"}),

  paigeSpecial: special("evo1-paige-anti-diva","Anti-Diva",{superstarId:"paige",bigCounterSpecial:true}),
  paigeRopeKnees: move("evo1-paige-rope-knees","Rope-Hung Knee Strikes",{superstarId:"paige",method:"strike",cost:5,requirements:{strike:1,technical:1},damage:8,setOpponentPosture:"on-mat"}),
  paigeThinkAgain: action("evo1-paige-think-again","Think Again","Paige only — opponent loses 1 Attitude.",[{type:"loseMomentum",target:"opponent",method:"attitude",amount:1}],{superstarId:"paige"}),

  vaquerSpecial: special("evo1-vaquer-la-vaquera","La Vaquera",{superstarId:"stephanie-vaquer",methodMixSpecial:true}),
  vaquerHeadbutt: move("evo1-vaquer-headbutt","Stephanie’s Headbutt",{superstarId:"stephanie-vaquer",method:"strike",cost:3,requirements:{strike:1},damage:5}),
  vaquerKeepUp: action("evo1-vaquer-keep-up","Keep Up","Stephanie only — draw 1 and gain +1 Attitude.",[{type:"draw",amount:1},{type:"gainMomentum",method:"attitude",amount:1}],{superstarId:"stephanie-vaquer"})

};