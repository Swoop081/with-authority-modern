import { normalizeMoveOptions } from "./move-types.js?v=0.11.37";
const momentum = (method) => ({ id: `hof1-momentum-${method}`, name: `${method[0].toUpperCase()}${method.slice(1)} Momentum`, kind: "momentum", method, amount: 1, setId: "hall-of-fame-series-1" });
const entrance = (id, name, superstarId, abilityText, effects = [], scheduled = []) => ({ id, name, superstarId, kind: "entrance", abilityText, effects, scheduled, setId: "hall-of-fame-series-1" });
const move = (id, name, options = {}) => ({ id, name, kind: "move", setId: "hall-of-fame-series-1", ...normalizeMoveOptions(id, name, options) });
const special = (id, name, options = {}) => ({ id, name, kind: "special", setId: "hall-of-fame-series-1", ...options });
const action = (id, name, abilityText, effects = [], options = {}) => ({ id, name, kind: "action", abilityText, effects, setId: "hall-of-fame-series-1", ...options });
const support = (id, name, abilityText, passive = {}, options = {}) => ({ id, name, kind: "support", abilityText, passive, setId: "hall-of-fame-series-1", ...options });
const manager = (id, name, allowedSuperstarIds, abilityText, trigger, effects, when = {}, options = {}) => ({ id, name, kind: "manager", allowedSuperstarIds, abilityText, trigger, effects, when, oncePerMatch: true, setId: "hall-of-fame-series-1", ...options });

export const hallCards = {
  momentum: {
    agility: momentum("agility"), strength: momentum("strength"),
    strike: momentum("strike"), technical: momentum("technical")
  },

  hoganEntrance: entrance("hof1-entrance-hulk-hogan", "Whatcha Gonna Do?", "hulk-hogan", "Pre-Match — Begin with +1 Strike. First time Hogan takes 8+ damage, gain +1 Attitude.", [{ type: "gainMomentum", method: "strike", amount: 1 }], [{ trigger: "ON_DAMAGE_TAKEN", maxTriggers: 1, when: { minDamage: 8 }, effects: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }]),
  andreEntrance: entrance("hof1-entrance-andre-the-giant", "Larger Than Life", "andre-the-giant", "Pre-Match — Begin with +1 Strength. First time André gains Control below 50% HP, gain +1 Attitude.", [{ type: "gainMomentum", method: "strength", amount: 1 }], [{ trigger: "CONTROL_START", maxTriggers: 1, when: { hpAtOrBelowPercent: 50 }, effects: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }]),
  savageEntrance: entrance("hof1-entrance-randy-savage", "Ooh Yeah!", "randy-savage", "Pre-Match — Begin with +1 Agility. First Agility Move connection gains +1 Attitude and draws 1 page.", [{ type: "gainMomentum", method: "agility", amount: 1 }], [{ trigger: "ON_MOVE_CONNECTED", maxTriggers: 1, when: { methods: ["agility"] }, effects: [{ type: "gainMomentum", method: "attitude", amount: 1 }, { type: "draw", amount: 1 }] }]),
  warriorEntrance: entrance("hof1-entrance-ultimate-warrior", "Parts Unknown", "ultimate-warrior", "Pre-Match — Begin with +1 Strength and +1 Strike. Draw one fewer page on first Control.", [{ type: "gainMomentum", method: "strength", amount: 1 }, { type: "gainMomentum", method: "strike", amount: 1 }]),
  austinEntrance: entrance("hof1-entrance-stone-cold", "Glass Shatters", "stone-cold-steve-austin", "Pre-Match — Begin with +1 Strike. First successful Counter that takes Control draws 1.", [{ type: "gainMomentum", method: "strike", amount: 1 }]),
  undertakerEntrance: entrance("hof1-entrance-undertaker", "Rest in Peace", "the-undertaker", "Pre-Match — Begin with +1 Technical. First submission or cost-7+ Move connection gains +1 Attitude.", [{ type: "gainMomentum", method: "technical", amount: 1 }]),
  mankindEntrance: entrance("hof1-entrance-mankind", "Car Crash", "mankind", "Pre-Match — Begin with +1 Technical. First time Mankind takes 8+ damage, draw 1.", [{ type: "gainMomentum", method: "technical", amount: 1 }], [{ trigger: "ON_DAMAGE_TAKEN", maxTriggers: 1, when: { minDamage: 8 }, effects: [{ type: "draw", amount: 1 }] }]),
  kaneEntrance: entrance("hof1-entrance-kane", "Hellfire and Brimstone", "kane", "Pre-Match — Begin with +1 Strength. First Strength Move for 8+ damage draws 1.", [{ type: "gainMomentum", method: "strength", amount: 1 }]),

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
  bobbyHeenan: manager("hof1-manager-bobby-heenan", "Bobby \"The Brain\" Heenan", ["andre-the-giant"], "THE BRAIN — Once per match, when one of your Moves is Countered, recover that Move to your hand OR interfere with an opponent Pin (-1 Pin level).", "MANUAL", [], {}, { managerChoice: "heenan" }),
  missElizabeth: manager("hof1-manager-miss-elizabeth", "Miss Elizabeth", ["randy-savage"], "FIRST LADY OF WRESTLING — Once per match below 50% HP: draw 2, then put 1 page from hand on the bottom of your Playbook.", "MANUAL", [], {}, { managerChoice: "elizabeth" }),
  paulBearer: manager("hof1-manager-paul-bearer", "Paul Bearer", ["the-undertaker"], "URN OF POWER — Once per match below 50% HP: gain +1 Strength and +1 Attitude OR recover one Undertaker-exclusive non-Finisher from discard.", "MANUAL", [], {}, { managerChoice: "bearer" }),

  // Hall of Fame Series 1 shared wrestling vocabulary.
  lockup: move("hof1-lockup", "Collar-and-Elbow Tie-Up", { method: "technical", cost: 1, damage: 1 }),
  headlock: move("hof1-headlock", "Side Headlock", { method: "technical", cost: 1, requirements: { technical: 1 }, damage: 2 }),
  wristlock: move("hof1-wristlock", "Wrist Lock", { method: "technical", cost: 1, requirements: { technical: 1 }, damage: 2 }),
  jab: move("hof1-jab", "Right Hand", { moveFamily: "punch", method: "strike", cost: 1, damage: 2 }),
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
  neckbreaker: move("hof1-neckbreaker", "Neckbreaker", { method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5, setOpponentPosture: "on-mat" }),
  backbreaker: move("hof1-backbreaker", "Backbreaker", { method: "strength", cost: 3, requirements: { strength: 1 }, damage: 5, setOpponentPosture: "on-mat" }),
  elbowDrop: move("hof1-elbow-drop", "Elbow Drop", { method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5, requiresPosture: "on-mat" }),
  kneeDrop: move("hof1-knee-drop", "Knee Drop", { method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5, requiresPosture: "on-mat" }),
  legDrop: move("hof1-leg-drop", "Leg Drop", { method: "agility", cost: 3, requirements: { agility: 1 }, damage: 5, requiresPosture: "on-mat" }),
  runningKnee: move("hof1-running-knee", "Running Knee", { method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5 }),
  piledriver: move("hof1-piledriver", "Piledriver", { method: "strength", cost: 5, requirements: { strength: 2 }, damage: 8, setOpponentPosture: "on-mat" }),
  verticalSuplex: move("hof1-vertical-suplex", "Vertical Suplex", { method: "strength", cost: 4, requirements: { strength: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  germanSuplex: move("hof1-german-suplex", "German Suplex", { method: "strength", cost: 4, requirements: { strength: 1 }, damage: 6, setOpponentPosture: "on-mat", effectText: "On connect: draw 1 page.", onConnect: [{ type: "draw", amount: 1 }] }),
  bellyToBelly: move("hof1-belly-to-belly", "Belly-to-Belly Suplex", { method: "strength", cost: 4, requirements: { strength: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  russianSweep: move("hof1-russian-sweep", "Russian Leg Sweep", { method: "technical", cost: 4, requirements: { technical: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  bulldog: move("hof1-bulldog", "Bulldog", { method: "technical", cost: 4, requirements: { technical: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  powerslam: move("hof1-powerslam", "Powerslam", { method: "strength", cost: 4, requirements: { strength: 1 }, damage: 7, setOpponentPosture: "on-mat" }),
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

  // André the Giant
  andreChop: move("hof1-andre-chop", "Giant Chop", { superstarId: "andre-the-giant", method: "strike", cost: 2, requirements: { strike: 1 }, damage: 4, effectText: "On connect: opponent ditches 1 page.", onConnect: [{ type: "discard", target: "opponent", amount: 1 }] }),
  andreBoot: move("hof1-andre-boot", "Giant Boot", { superstarId: "andre-the-giant", method: "strike", cost: 4, requirements: { strike: 1 }, damage: 6 }),
  andreButterfly: move("hof1-andre-butterfly-suplex", "Butterfly Suplex", { superstarId: "andre-the-giant", method: "strength", cost: 6, requirements: { strength: 2 }, damage: 9, setOpponentPosture: "on-mat", effectText: "On connect: draw 1 page.", onConnect: [{ type: "draw", amount: 1 }] }),

  // Randy Savage
  savageJab: move("hof1-savage-jab", "Macho Man Jabs", { superstarId: "randy-savage", method: "strike", cost: 2, requirements: { strike: 1 }, damage: 3 }),
  savageHotshot: move("hof1-savage-hotshot", "Hotshot", { superstarId: "randy-savage", method: "strike", cost: 4, requirements: { strike: 1 }, damage: 6 }),

  // Ultimate Warrior
  warriorPunch: move("hof1-warrior-punch", "Warrior Punch", { superstarId: "ultimate-warrior", moveFamily: "punch", method: "strike", cost: 2, requirements: { strike: 1 }, damage: 5 }),

  // Stone Cold Steve Austin
  austinPunch: move("hof1-austin-punch", "Stone Cold Right Hands", { superstarId: "stone-cold-steve-austin", moveFamily: "punch", method: "strike", cost: 2, requirements: { strike: 1 }, damage: 5 }),

  // Undertaker
  takerPunch: move("hof1-taker-punch", "Undertaker Right Hands", { superstarId: "the-undertaker", moveFamily: "punch", method: "strike", cost: 2, requirements: { strike: 1 }, damage: 5 }),

  // Mankind
  mankindPunch: move("hof1-mankind-punch", "Mankind Right Hands", { superstarId: "mankind", moveFamily: "punch", method: "strike", cost: 2, requirements: { strike: 1 }, damage: 4, effectText: "On connect: opponent ditches 1 page.", onConnect: [{ type: "discard", target: "opponent", amount: 1 }] }),
  mankindKnee: move("hof1-mankind-knee", "Running Knee", { method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5, effectText: "On connect: gain +1 additional Attitude.", onConnect: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }),
  mankindBulldog: move("hof1-mankind-bulldog", "Mankind Bulldog", { superstarId: "mankind", method: "technical", cost: 4, requirements: { technical: 1 }, damage: 6, setOpponentPosture: "on-mat" }),

  // Kane

  // Reviewed Hall of Fame — Series 1 identity cards
  andreSpecial: special("hof1-andre-unstoppable-giant","Unstoppable Giant",{superstarId:"andre-the-giant",giantSpecial:true,abilityText:"When André takes 10+ damage, remain Standing, prevent Stun/ringside effects and draw 1."}),
  andreHeadbuttReviewed: move("hof1-andre-headbutt-reviewed","André's Headbutt",{superstarId:"andre-the-giant",moveFamily:"headbutt",method:"strike",cost:3,requirements:{strike:1},damage:5,onConnect:[{type:"loseMomentum",target:"opponent",method:"attitude",amount:1}]}),
  andreBearhugReviewed: move("hof1-andre-bearhug-reviewed","André's Bearhug",{superstarId:"andre-the-giant",method:"strength",cost:8,requirements:{strength:2},damage:8,submission:{bodyPart:"back",damage:3},trademark:true}),
  andreGiantBodyslam: move("hof1-andre-giant-bodyslam","Giant Body Slam",{superstarId:"andre-the-giant",moveFamily:"bodyslam",method:"strength",cost:9,requirements:{strength:3},damage:10,trademark:true,setOpponentPosture:"on-mat",onConnect:[{type:"searchDeck",cardId:"hof1-andre-giant-splash"}]}),
  andreGiantSplash: move("hof1-andre-giant-splash","Giant Splash",{superstarId:"andre-the-giant",method:"strength",cost:11,requirements:{strength:3},damage:15,requiresPosture:"on-mat",finisher:true}),

  hoganSpecial: special("hof1-hogan-hulking-up","Hulking Up",{superstarId:"hulk-hogan",hoganSpecial:true,abilityText:"When Hogan gains Control at 40% HP or less, draw 2. Next Punch or Big Boot this Control gets +2 damage."}),
  hoganPunchReviewed: move("hof1-hogan-punch-reviewed","Hogan's Punch",{superstarId:"hulk-hogan",moveFamily:"punch",method:"strike",cost:3,requirements:{strike:1},damage:5}),
  hoganBigBootReviewed: move("hof1-hogan-big-boot-reviewed","Hogan's Big Boot",{superstarId:"hulk-hogan",moveFamily:"big-boot",method:"strike",cost:7,requirements:{strike:2},damage:10,trademark:true,setOpponentPosture:"on-mat",onConnect:[{type:"searchDeck",cardId:"hof1-hogan-atomic-leg-drop-reviewed"},{type:"cardCostModifier",cardId:"hof1-hogan-atomic-leg-drop-reviewed",amount:-2},{type:"gainMomentum",method:"strength",amount:1},{type:"gainMomentum",method:"attitude",amount:1},{type:"draw",amount:1}]}),
  hoganAxeBomberReviewed: move("hof1-hogan-axe-bomber-reviewed","Axe Bomber",{superstarId:"hulk-hogan",method:"strike",cost:7,requirements:{strike:2,strength:1},damage:11,trademark:true,setOpponentPosture:"on-mat"}),
  hoganAtomicLegDropReviewed: move("hof1-hogan-atomic-leg-drop-reviewed","Atomic Leg Drop",{superstarId:"hulk-hogan",moveFamily:"leg-drop",method:"strength",cost:10,requirements:{strength:2,strike:1},damage:15,requiresPosture:"on-mat",finisher:true}),
  hoganYou: action("hof1-hogan-you","You!","Hogan only — gain +1 Attitude; next Hogan's Punch this Control gets +1 damage.",[{type:"gainMomentum",method:"attitude",amount:1}],{superstarId:"hulk-hogan"}),

  savageSpecial: special("hof1-savage-cream","The Cream Rises to the Top",{superstarId:"randy-savage",savageSpecial:true,abilityText:"After Savage connects for 8+ damage, search a Trademark; if one is already in hand, draw 2."}),
  savageDoubleAxeReviewed: move("hof1-savage-diving-double-axe","Diving Double Axe Handle",{superstarId:"randy-savage",moveFamily:"double-axe-handle",method:"agility",cost:7,requirements:{agility:2,strike:1},damage:11,trademark:true,setOpponentPosture:"on-mat",onConnect:[{type:"searchDeck",cardId:"hof1-savage-flying-elbow-reviewed"},{type:"cardCostModifier",cardId:"hof1-savage-flying-elbow-reviewed",amount:-2},{type:"gainMomentum",method:"attitude",amount:2},{type:"draw",amount:1}]}),
  savageCrossbodyReviewed: move("hof1-savage-crossbody-reviewed","Macho Man's Flying Crossbody",{superstarId:"randy-savage",moveFamily:"crossbody",method:"agility",cost:6,requirements:{agility:2,strike:1},damage:10,trademark:true,onConnect:[{type:"draw",amount:2}]}),
  savageFlyingElbowReviewed: move("hof1-savage-flying-elbow-reviewed","Flying Elbow Drop",{superstarId:"randy-savage",method:"agility",cost:9,requirements:{agility:2,strike:1},damage:16,requiresPosture:"on-mat",finisher:true}),

  warriorSpecial: special("hof1-warrior-comeback","Warrior's Comeback",{superstarId:"ultimate-warrior",warriorSpecial:true,abilityText:"After Warrior takes Control following an 8+ damage hit: +1 Attitude, draw 1, next Move +2 damage."}),
  warriorClotheslineReviewed: move("hof1-warrior-clothesline-reviewed","Warrior's Clothesline",{superstarId:"ultimate-warrior",moveFamily:"clothesline",method:"strike",cost:4,requirements:{strike:1},damage:7}),
  warriorShoulderReviewed: move("hof1-warrior-shoulder-reviewed","Warrior's Shoulder Block",{superstarId:"ultimate-warrior",moveFamily:"shoulder-tackle",method:"strength",cost:6,requirements:{strength:1,strike:1},damage:9,onConnect:[{type:"gainMomentum",method:"attitude",amount:1}]}),
  warriorPressReviewed: move("hof1-warrior-gorilla-press-reviewed","Gorilla Press Slam",{superstarId:"ultimate-warrior",method:"strength",cost:8,requirements:{strength:2,strike:1},damage:11,trademark:true,setOpponentPosture:"on-mat",onConnect:[{type:"searchDeck",cardId:"hof1-warrior-splash-reviewed"},{type:"gainMomentum",method:"attitude",amount:1}]}),
  warriorSplashReviewed: move("hof1-warrior-splash-reviewed","Warrior Splash",{superstarId:"ultimate-warrior",method:"strength",cost:10,requirements:{strength:2,strike:1},damage:15,requiresPosture:"on-mat",finisher:true}),
  warriorShakeRopes: action("hof1-warrior-shake-ropes","Shake the Ropes","Warrior only — gain +1 Attitude. Below 50% HP also draw 1.",[{type:"gainMomentum",method:"attitude",amount:1}],{superstarId:"ultimate-warrior"}),

  austinSpecial: special("hof1-austin-316","Austin 3:16",{superstarId:"stone-cold-steve-austin",austinSpecial:true,abilityText:"After Austin successfully Counters: +1 Attitude and search a Strike Move costing 5 or less."}),
  austinMudholeReviewed: move("hof1-austin-mudhole-reviewed","Stone Cold's Mudhole Stomps",{superstarId:"stone-cold-steve-austin",method:"strike",cost:5,requirements:{strike:2},damage:8,onConnect:[{type:"loseMomentum",target:"opponent",method:"attitude",amount:1}]}),
  austinLouTheszReviewed: move("hof1-austin-lou-thesz-reviewed","Stone Cold's Lou Thesz Press",{superstarId:"stone-cold-steve-austin",moveFamily:"thesz-press",method:"strike",cost:7,requirements:{strike:2,strength:1},damage:10,trademark:true,setOpponentPosture:"on-mat",onConnect:[{type:"draw",amount:1}]}),
  austinKickReviewed: move("hof1-austin-kick-reviewed","Stone Cold's Kick to the Gut",{superstarId:"stone-cold-steve-austin",moveFamily:"kick-to-gut",method:"strike",cost:6,requirements:{strike:2},damage:8,setOpponentPosture:"standing",onConnect:[{type:"searchDeck",cardId:"hof1-austin-stunner-reviewed"},{type:"cardCostModifier",cardId:"hof1-austin-stunner-reviewed",amount:-2},{type:"gainMomentum",method:"attitude",amount:1},{type:"draw",amount:1}]}),
  austinStunnerReviewed: move("hof1-austin-stunner-reviewed","Stone Cold Stunner",{superstarId:"stone-cold-steve-austin",moveFamily:"stunner",method:"strike",cost:10,requirements:{strike:2,strength:1},damage:16,requiresPosture:"standing",finisher:true,onConnect:[{type:"discard",target:"opponent",amount:2}]}),
  austinWhoopAss: action("hof1-austin-whoop-ass","Open Up a Can of Whoop-Ass","Austin only — next Strike Move this Control gets +2 damage.",[{type:"nextMoveDamageBonus",amount:2}],{superstarId:"stone-cold-steve-austin"}),
  austinWhat: action("hof1-austin-what","What?","Austin only — opponent discards 1 random page.",[{type:"discard",target:"opponent",amount:1}],{superstarId:"stone-cold-steve-austin"}),

  takerSpecial: special("hof1-taker-sit-up","Sit Up",{superstarId:"the-undertaker",takerSpecial:true,abilityText:"After surviving a Pin, take Control and draw 1."}),
  takerOldSchoolReviewed: move("hof1-taker-old-school-reviewed","Old School",{superstarId:"the-undertaker",method:"strike",cost:6,requirements:{strike:1,technical:1},damage:10,trademark:true,onConnect:[{type:"searchDeck",cardId:"hof1-taker-chokeslam-reviewed"},{type:"gainMomentum",method:"attitude",amount:1}]}),
  takerSnakeEyesReviewed: move("hof1-taker-snake-eyes-reviewed","Snake Eyes",{superstarId:"the-undertaker",method:"strength",cost:6,requirements:{strength:1,strike:1},damage:9,onConnect:[{type:"searchDeck",cardId:"hof1-running-big-boot"}]}),
  takerChokeslamReviewed: move("hof1-taker-chokeslam-reviewed","Undertaker's Chokeslam",{superstarId:"the-undertaker",moveFamily:"chokeslam",method:"strength",cost:7,requirements:{strength:1,strike:1},damage:12,setOpponentPosture:"on-mat",onConnect:[{type:"searchDeck",cardId:"hof1-taker-tombstone-reviewed"},{type:"gainMomentum",method:"strength",amount:1},{type:"gainMomentum",method:"attitude",amount:1}]}),
  takerTombstoneReviewed: move("hof1-taker-tombstone-reviewed","Tombstone Piledriver",{superstarId:"the-undertaker",moveFamily:"tombstone",method:"strength",cost:9,requirements:{strength:2,technical:1},damage:16,requiresPosture:"on-mat",finisher:true,noGenericPinEscape:true}),
  takerDigGrave: action("hof1-taker-dig-grave","Dig Your Grave","Undertaker only — opponent loses 1 Attitude; next high-level Move +1 damage.",[{type:"loseMomentum",target:"opponent",method:"attitude",amount:1},{type:"nextMoveDamageBonus",amount:1}],{superstarId:"the-undertaker"}),

  kaneSpecial: special("hof1-kane-through-hellfire","Through Hellfire",{superstarId:"kane",kaneSpecial:true,abilityText:"After taking 10+ damage, next Move costs 2 less total Attitude; if it connects gain +1 Attitude."}),
  kaneUppercutReviewed: move("hof1-kane-uppercut-reviewed","Kane's Uppercut",{superstarId:"kane",moveFamily:"uppercut",method:"strike",cost:4,requirements:{strike:1},damage:6}),
  kaneSidewalkReviewed: move("hof1-kane-sidewalk-reviewed","Kane's Sidewalk Slam",{superstarId:"kane",moveFamily:"sidewalk-slam",method:"strength",cost:5,requirements:{strength:2},damage:8,setOpponentPosture:"on-mat"}),
  kaneFlyingReviewed: move("hof1-kane-flying-reviewed","Kane's Flying Clothesline",{superstarId:"kane",moveFamily:"flying-clothesline",method:"strike",cost:7,requirements:{strength:1,strike:2},damage:10,setOpponentPosture:"on-mat"}),
  kaneChokeLift: move("hof1-kane-choke-lift","Two-Handed Choke Lift",{superstarId:"kane",method:"strength",cost:6,requirements:{strength:2},damage:9,onConnect:[{type:"discard",target:"opponent",amount:1}]}),
  kaneChokeslamReviewed: move("hof1-kane-chokeslam-reviewed","Kane's Chokeslam",{superstarId:"kane",moveFamily:"chokeslam",method:"strength",cost:7,requirements:{strength:2,strike:1},damage:12,trademark:true,setOpponentPosture:"on-mat",onConnect:[{type:"searchDeck",cardId:"hof1-kane-tombstone-reviewed"},{type:"gainMomentum",method:"attitude",amount:2}]}),
  kaneTombstoneReviewed: move("hof1-kane-tombstone-reviewed","Kane's Tombstone Piledriver",{superstarId:"kane",moveFamily:"tombstone",method:"strength",cost:9,requirements:{strength:2,strike:1},damage:16,requiresPosture:"on-mat",finisher:true,onConnect:[{type:"loseMomentum",target:"opponent",method:"attitude",amount:2}]}),
  kaneRaiseArms: action("hof1-kane-raise-arms","Raise the Arms","Kane only — gain +1 Attitude; next Strength Move +1 damage.",[{type:"gainMomentum",method:"attitude",amount:1},{type:"nextMoveDamageBonus",amount:1}],{superstarId:"kane"}),

  mankindSpecial: special("hof1-mankind-bang-bang","Bang Bang!",{superstarId:"mankind",mankindSpecial:true,abilityText:"After a Mankind Move is Countered, ditch 1 page to search a Strike or Technical Move costing 5 or less."}),
  mankindHeadbuttReviewed: move("hof1-mankind-headbutt-reviewed","Mankind's Headbutt",{superstarId:"mankind",moveFamily:"headbutt",method:"strike",cost:3,requirements:{strike:1},damage:5,selfDamage:1}),
  mankindKneeReviewed: move("hof1-mankind-knee-reviewed","Running Knee to the Corner",{superstarId:"mankind",method:"strike",cost:5,requirements:{strike:2},damage:8,setOpponentPosture:"on-mat"}),
  mankindDoubleArmReviewed: move("hof1-mankind-double-arm-reviewed","Double-Arm DDT",{superstarId:"mankind",method:"technical",cost:7,requirements:{technical:2,strength:1},damage:11,trademark:true,setOpponentPosture:"on-mat",onConnect:[{type:"searchDeck",cardId:"hof1-mankind-claw-reviewed"}]}),
  mankindClawReviewed: move("hof1-mankind-claw-reviewed","Mandible Claw",{superstarId:"mankind",method:"technical",cost:10,requirements:{technical:2,strike:1},damage:10,requiresPosture:"on-mat",submission:{bodyPart:"head",damage:5},finisher:true}),
  mankindSockoSupport: support("hof1-mankind-socko-support","Mr. Socko","Mankind only — Mandible Claw gains +1 Head submission pressure per squeeze.",{}, {superstarId:"mankind",socko:true}),
  mankindPainFriend: action("hof1-mankind-pain-friend","Pain Is My Friend","Mankind only — take 3 damage to gain +2 Attitude.",[{type:"gainMomentum",method:"attitude",amount:2}],{superstarId:"mankind",selfDamage:3}),

  // Shared reviewed Hall moves
  runningClotheslineReviewed: move("hof1-running-clothesline-reviewed","Running Clothesline",{method:"strike",cost:4,requirements:{strike:1},damage:7}),
  backSuplexReviewed: move("hof1-back-suplex-reviewed","Back Suplex",{method:"strength",cost:4,requirements:{strength:1},damage:7}),
  runningElbowDropReviewed: move("hof1-running-elbow-drop-reviewed","Running Elbow Drop",{method:"strike",cost:4,requirements:{strike:1},damage:7,requiresPosture:"on-mat"}),
  flyingShoulderReviewed: move("hof1-flying-shoulder-reviewed","Flying Shoulder Tackle",{method:"strength",cost:5,requirements:{strength:1,strike:1},damage:8}),
  militaryPressDropReviewed: move("hof1-military-press-drop-reviewed","Military Press Drop",{method:"strength",cost:6,requirements:{strength:2},damage:9,setOpponentPosture:"on-mat"}),
  runningBigBootReviewed: move("hof1-running-big-boot","Running Big Boot",{method:"strike",cost:5,requirements:{strike:1},damage:8}),
  middleRopeElbowReviewed: move("hof1-middle-rope-elbow-reviewed","Middle-Rope Elbow Drop",{method:"strike",cost:5,requirements:{strike:1,strength:1},damage:8,requiresPosture:"on-mat"}),
  eyeRakeReviewed: move("hof1-eye-rake-reviewed","Eye Rake",{method:"strike",cost:2,requirements:{strike:1},damage:4,onConnect:[{type:"loseMomentum",target:"opponent",method:"attitude",amount:1}]})
,

  hofNoSell: move("hof1-no-sell","No Sell",{method:"strength",cost:3,requirements:{strength:1},counterMethods:["strength"],defensiveOnly:true,effectText:"Counter any Strength Move."}),
  hofDuckStrike: move("hof1-duck-strike","Duck",{method:"strike",cost:3,requirements:{strike:1},counterMethods:["strike"],defensiveOnly:true,effectText:"Counter any Strike Move."}),
  hofChainWrestling: move("hof1-chain-wrestling","Chain Wrestling",{method:"technical",cost:3,requirements:{technical:1},counterMethods:["technical"],defensiveOnly:true,effectText:"Counter any Technical Move."}),
  hofSidestep: move("hof1-sidestep","Sidestep",{method:"agility",cost:3,requirements:{agility:1},counterMethods:["agility"],defensiveOnly:true,effectText:"Counter any Agility Move."}),
  headbuttReviewed: move("hof1-headbutt-reviewed","Headbutt",{method:"strike",cost:2,requirements:{strike:1},damage:4}),
  sidewalkSlamReviewed: move("hof1-sidewalk-slam-reviewed","Sidewalk Slam",{method:"strength",cost:4,requirements:{strength:1},damage:7,setOpponentPosture:"on-mat"}),
  tiltWhirlReviewed: move("hof1-tilt-whirl-reviewed","Tilt-a-Whirl Powerslam",{method:"strength",cost:6,requirements:{strength:2},damage:9,setOpponentPosture:"on-mat"})

};
