import { normalizeMoveOptions } from "./move-types.js?v=0.11.44";
const momentum = (method) => ({ id: `s1rock-momentum-${method}`, name: `${method[0].toUpperCase()}${method.slice(1)} Momentum`, kind: "momentum", method, amount: 1, seasonId: "season-1" });
const entrance = (id, name, superstarId, abilityText, effects = [], scheduled = []) => ({ id, name, superstarId, kind: "entrance", abilityText, effects, scheduled, seasonId: "season-1", foilOnly: true });
const move = (id, name, options = {}) => ({ id, name, kind: "move", seasonId: "season-1", ...normalizeMoveOptions(id, name, options) });
const action = (id, name, abilityText, effects = []) => ({ id, name, kind: "action", seasonId: "season-1", abilityText, effects });
const special = (id, name, options = {}) => ({ id, name, kind: "special", seasonId: "season-1", ...options });
const support = (id, name, abilityText, passive = {}) => ({ id, name, kind: "support", seasonId: "season-1", abilityText, passive });

export const rockCards = {
  momentum: { strength: momentum("strength"), strike: momentum("strike"), technical: momentum("technical") },

  entrance: entrance("s1rock-entrance-final-boss", "Final Boss Has Arrived", "the-rock",
    "Pre-Match — Begin with +1 Strength. First Strength/Strike Move for 8+ damage gains +1 Attitude.",
    [{ type: "gainMomentum", method: "strength", amount: 1 }],
    [{ trigger: "ON_MOVE_CONNECTED", maxTriggers: 1, when: { methods: ["strength","strike"], minDamage: 8 }, effects: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }]),

  // Final Boss identity package — intentionally modern Bloodline-era Rock, not Attitude/Hollywood Rock.
  finalBossSpinebuster: move("s1rock-final-boss-spinebuster", "Rock's Spinebuster", { superstarId:"the-rock", method:"strength", cost:7, requirements:{strength:2,strike:1}, damage:11, setOpponentPosture:"on-mat", trademark:true, pinBonus:4, pinAtHpRatio:0.22, onConnect:[{type:"searchDeck",cardId:"s1rock-peoples-elbow-final-boss"},{type:"cardCostModifier",cardId:"s1rock-peoples-elbow-final-boss",amount:-2},{type:"gainMomentum",method:"strike",amount:1},{type:"gainMomentum",method:"attitude",amount:2}] }),
  peoplesElbowFinalBoss: move("s1rock-peoples-elbow-final-boss", "People's Elbow", { superstarId:"the-rock", method:"strike", cost:10, requirements:{strike:2,strength:1}, damage:16, requiresPosture:"on-mat", finisher:true, pinBonus:12, pinAtHpRatio:0.28 }),
  rockBottomFinalBoss: move("s1rock-rock-bottom-final-boss", "Rock Bottom", { superstarId:"the-rock", method:"strength", cost:8, requirements:{strength:2,technical:1}, damage:13, setOpponentPosture:"on-mat", trademark:true, finisher:true, pinBonus:14, pinAtHpRatio:0.32, onConnect:[{type:"searchDeck",cardId:"s1rock-peoples-elbow-final-boss"},{type:"cardCostModifier",cardId:"s1rock-peoples-elbow-final-boss",amount:-2},{type:"gainMomentum",method:"strike",amount:2},{type:"gainMomentum",method:"attitude",amount:2}] }),

  samoanDrop: move("s1rock-samoan-drop", "Samoan Drop", { method: "strength", cost: 4, requirements: { strength: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  clothesline: move("s1rock-clothesline", "Final Boss Clothesline", { superstarId: "the-rock", method: "strike", cost: 2, requirements: { strike: 1 }, damage: 4 }),
  powerslam: move("s1rock-powerslam", "Powerslam", { superstarId: "the-rock", method: "strength", cost: 3, requirements: { strength: 1 }, damage: 5, setOpponentPosture: "on-mat" }),
  neckbreaker: move("s1rock-neckbreaker", "Neckbreaker", { method: "technical", cost: 4, requirements: { technical: 1 }, damage: 6, setOpponentPosture: "on-mat" }),

  eyebrow: action("s1rock-raise-eyebrow", "Raise the Eyebrow", "Action — Gain 2 Attitude Momentum.", [{ type: "gainMomentum", method: "attitude", amount: 2 }]),
  knowRole: action("s1rock-know-your-role", "Know Your Role", "Action — Your next Move this Control turn has its total Momentum threshold reduced by 2.", [{ type: "nextMoveCostModifier", amount: -2 }]),
  finalBossOrder: action("s1rock-final-boss-order", "Orders From the Final Boss", "Action — Draw 1 page.", [{ type: "draw", amount: 1 }]),
  crowd: support("s1rock-brahma-bull-presence", "Brahma Bull Presence", "Support — The Final Boss brings constant pressure.", {}),
  kickout: special("s1rock-shoulder-up", "Final Boss Shoulder Up", { abilityText: "Pin response — stop the pin and take Control.", pinEscape: true }),
  counter: special("s1rock-desperation-counter", "Final Boss Counter", { abilityText: "Counter response — counter any Move.", counterAny: true }),

  finalBossPunches: move("s1rock-final-boss-punches","Final Boss Punches",{superstarId:"the-rock",moveFamily:"punch",method:"strike",cost:3,requirements:{strike:1},damage:5}),
  finalBossSlap: move("s1rock-final-boss-slap","The Final Boss Slap",{superstarId:"the-rock",method:"strike",cost:4,requirements:{strike:1},damage:6,onConnect:[{type:"loseMomentum",target:"opponent",method:"attitude",amount:1}]}),
  beltWhip: move("s1rock-belt-whip","Belt Whip",{superstarId:"the-rock",method:"strike",cost:5,requirements:{strike:1,technical:1},damage:7,setOpponentPosture:"standing",onConnect:[{type:"loseMomentum",target:"opponent",method:"attitude",amount:1}]}),
  finalBossCombination: move("s1rock-final-boss-combination","Final Boss Combination",{superstarId:"the-rock",method:"strike",cost:6,requirements:{strike:2},damage:9,onConnect:[{type:"searchDeck",cardId:"s1rock-rock-bottom-final-boss"}]}),
  bloodlineRules: action("s1rock-bloodline-rules","Bloodline Rules","Final Boss only — opponent's first Counter this Control costs +1 Attitude.",[]),
  mamaRhodes: special("s1rock-mama-rhodes","Mama Rhodes",{superstarId:"the-rock",mamaRhodes:true}),
  knowYourRoleCounter: move("s1rock-know-your-role-counter","Know Your Role",{superstarId:"the-rock",method:"technical",cost:3,requirements:{technical:1},counterMethods:["strike","strength"],defensiveOnly:true,onCounter:[{type:"loseMomentum",target:"opponent",method:"attitude",amount:1}]}),

  duckCounter: move("s1rock-duck-counter","Duck",{method:"strike",cost:2,requirements:{strike:1},counterMethods:["strike"],defensiveOnly:true}),
  noSellCounter: move("s1rock-no-sell","No Sell",{method:"strength",cost:3,requirements:{strength:1},counterMethods:["strength"],defensiveOnly:true}),
  technicalCounter: move("s1rock-technical-reversal","Technical Reversal",{method:"technical",cost:3,requirements:{technical:1},counterMethods:["technical"],defensiveOnly:true}),
  sharedPunch: move("s1rock-punch","Final Boss Right Hand",{superstarId:"the-rock",preserveSharedCollectorOrder:true,moveFamily:"punch",method:"strike",cost:2,requirements:{strike:1},damage:5}),
  headbutt: move("s1rock-headbutt","Headbutt",{method:"strike",cost:2,requirements:{strike:1},damage:4}),
  bodySlam: move("s1rock-body-slam","Body Slam",{method:"strength",cost:2,requirements:{strength:1},damage:5,setOpponentPosture:"on-mat"}),
  shortArmClothesline: move("s1rock-short-arm-clothesline","Short-Arm Clothesline",{method:"strike",cost:3,requirements:{strike:1},damage:5}),
  bigBoot: move("s1rock-big-boot","Big Boot",{method:"strike",cost:3,requirements:{strike:1},damage:5}),
  bellyToBelly: move("s1rock-belly-to-belly","Belly-to-Belly Suplex",{method:"strength",cost:5,requirements:{strength:1},damage:8,setOpponentPosture:"on-mat"}),
  ddt: move("s1rock-ddt","DDT",{method:"technical",cost:4,requirements:{technical:1},damage:7,setOpponentPosture:"on-mat"}),
  sharpshooterShared: move("s1rock-sharpshooter-shared","Sharpshooter",{method:"technical",cost:6,requirements:{technical:2},damage:4,requiresPosture:"on-mat",submission:{bodyPart:"leg",damage:5}})

};
