import { normalizeMoveOptions } from "./move-types.js";
const momentum = (method) => ({ id: `s1rock-momentum-${method}`, name: `${method[0].toUpperCase()}${method.slice(1)} Momentum`, kind: "momentum", method, amount: 1, seasonId: "season-1" });
const entrance = (id, name, superstarId, abilityText, effects = [], scheduled = []) => ({ id, name, superstarId, kind: "entrance", abilityText, effects, scheduled, seasonId: "season-1", foilOnly: true });
const move = (id, name, options = {}) => ({ id, name, kind: "move", seasonId: "season-1", ...normalizeMoveOptions(id, name, options) });
const action = (id, name, abilityText, effects = []) => ({ id, name, kind: "action", seasonId: "season-1", abilityText, effects });
const special = (id, name, options = {}) => ({ id, name, kind: "special", seasonId: "season-1", ...options });
const support = (id, name, abilityText, passive = {}) => ({ id, name, kind: "support", seasonId: "season-1", abilityText, passive });

export const rockCards = {
  momentum: { strength: momentum("strength"), strike: momentum("strike"), technical: momentum("technical") },

  entrance: entrance("s1rock-entrance-final-boss", "Final Boss Has Arrived", "the-rock",
    "Pre-Match — Begin with +1 Strength Momentum. At Turn 8, gain +1 Attitude Momentum.",
    [{ type: "gainMomentum", method: "strength", amount: 1 }],
    [{ trigger: "TURN_START", atTurn: 8, effects: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }]),

  // Final Boss identity package — intentionally modern Bloodline-era Rock, not Attitude/Hollywood Rock.
  finalBossSpinebuster: move("s1rock-final-boss-spinebuster", "Final Boss Spinebuster", { superstarId: "the-rock", method: "strength", cost: 5, requirements: { strength: 2 }, damage: 7, setOpponentPosture: "on-mat", trademark: true }),
  peoplesElbowFinalBoss: move("s1rock-peoples-elbow-final-boss", "People's Elbow — Final Boss", { superstarId: "the-rock", method: "strike", cost: 7, requirements: { strike: 2, strength: 1 }, damage: 10, requiresOpponentPosture: "on-mat", finisher: true }),
  rockBottomFinalBoss: move("s1rock-rock-bottom-final-boss", "Rock Bottom — Final Boss", { superstarId: "the-rock", method: "strength", cost: 8, requirements: { strength: 2, technical: 1 }, damage: 11, setOpponentPosture: "on-mat", finisher: true }),
  finalBossSharpshooter: move("s1rock-final-boss-sharpshooter", "Final Boss Sharpshooter", { superstarId: "the-rock", method: "technical", cost: 7, requirements: { technical: 2 }, damage: 4, requiresOpponentPosture: "on-mat", submission: true, submissionPressure: 4, trademark: true }),

  samoanDrop: move("s1rock-samoan-drop", "Samoan Drop", { superstarId: "the-rock", method: "strength", cost: 4, requirements: { strength: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  spinebuster: move("s1rock-spinebuster", "Spinebuster", { superstarId: "the-rock", method: "strength", cost: 4, requirements: { strength: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  snapDDT: move("s1rock-snap-ddt", "Snap DDT", { superstarId: "the-rock", method: "technical", cost: 3, requirements: { technical: 1 }, damage: 5, setOpponentPosture: "on-mat" }),
  clothesline: move("s1rock-clothesline", "Final Boss Clothesline", { superstarId: "the-rock", method: "strike", cost: 2, requirements: { strike: 1 }, damage: 4 }),
  bodyShot: move("s1rock-body-shot", "Body Shot", { superstarId: "the-rock", method: "strike", cost: 1, requirements: { strike: 1 }, damage: 3 }),
  shoulderBlock: move("s1rock-shoulder-block", "Shoulder Block", { superstarId: "the-rock", method: "strength", cost: 2, requirements: { strength: 1 }, damage: 4 }),
  russianLegSweep: move("s1rock-russian-leg-sweep", "Russian Leg Sweep", { superstarId: "the-rock", method: "technical", cost: 3, requirements: { technical: 1 }, damage: 5, setOpponentPosture: "on-mat" }),
  runningLariat: move("s1rock-running-lariat", "Running Lariat", { superstarId: "the-rock", method: "strike", cost: 4, requirements: { strike: 1 }, damage: 6 }),
  powerslam: move("s1rock-powerslam", "Powerslam", { superstarId: "the-rock", method: "strength", cost: 3, requirements: { strength: 1 }, damage: 5, setOpponentPosture: "on-mat" }),
  gutbuster: move("s1rock-gutbuster", "Gutbuster", { superstarId: "the-rock", method: "strength", cost: 5, requirements: { strength: 2 }, damage: 7 }),
  neckbreaker: move("s1rock-neckbreaker", "Neckbreaker", { superstarId: "the-rock", method: "technical", cost: 4, requirements: { technical: 1 }, damage: 6, setOpponentPosture: "on-mat" }),
  cornerPunches: move("s1rock-corner-punches", "Final Boss Corner Punches", { superstarId: "the-rock", method: "strike", cost: 3, requirements: { strike: 1 }, damage: 5 }),

  eyebrow: action("s1rock-raise-eyebrow", "Raise the Eyebrow", "Action — Gain 2 Attitude Momentum.", [{ type: "gainMomentum", method: "attitude", amount: 2 }]),
  knowRole: action("s1rock-know-your-role", "Know Your Role", "Action — Your next Move this Control turn has its total Momentum threshold reduced by 2.", [{ type: "nextMoveCostModifier", amount: -2 }]),
  finalBossOrder: action("s1rock-final-boss-order", "Orders From the Final Boss", "Action — Draw 1 page.", [{ type: "draw", amount: 1 }]),
  crowd: support("s1rock-brahma-bull-presence", "Brahma Bull Presence", "Support — The Final Boss brings constant pressure.", {}),
  kickout: special("s1rock-shoulder-up", "Final Boss Shoulder Up", { abilityText: "Pin response — stop the pin and take Control.", pinEscape: true }),
  counter: special("s1rock-desperation-counter", "Final Boss Counter", { abilityText: "Counter response — counter any Move.", counterAny: true })
};
