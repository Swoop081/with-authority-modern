export const superstars = {
  codyRhodes: {
    id: "cody-rhodes", name: "Cody Rhodes", nickname: "The American Nightmare", hp: 29, setId: "summerslam-series-1",
    cardId: "superstar-cody-rhodes", entranceId: "entrance-cody-rhodes", leadOffIds: ["momentum-technical", "momentum-strike", "cody-powerslam", "cody-drop-down-punch", "arm-drag"],
    signatures: ["cross-rhodes", "cody-cutter"], archetype: "balanced",
    ability: { id: "undeniable-variety", name: "Undeniable", text: "The first time Cody connects with a Move Type he has not connected with before this match, draw 1 page.", trigger: "ON_MOVE_CONNECTED", maxUses: 1, when: { firstTimeMoveType: true }, effects: [{ type: "draw", amount: 1 }] }
  },
  cmPunk: {
    id: "cm-punk", name: "CM Punk", nickname: "The Best in the World", hp: 36, setId: "summerslam-series-1",
    cardId: "superstar-cm-punk", entranceId: "entrance-cm-punk", leadOffIds: ["momentum-technical", "momentum-strike", "punk-snap-suplex", "punk-roundhouse", "side-headlock"],
    signatures: ["gts", "anaconda-vise"], archetype: "technical-strike", starterEligible: true,
    ability: { id: "counter-culture", name: "Counter Culture", text: "The first time Punk successfully Counters a Move, gain +1 Technical Momentum.", trigger: "ON_COUNTER_SUCCESS", maxUses: 1, effects: [{ type: "gainMomentum", method: "technical", amount: 1 }] }
  },
  romanReigns: {
    id: "roman-reigns", name: "Roman Reigns", nickname: "The OTC", hp: 55, setId: "summerslam-series-1",
    cardId: "superstar-roman-reigns", entranceId: "entrance-roman-reigns", leadOffIds: ["momentum-strength", "momentum-strike", "roman-uppercut", "drive-by", "shoulder-tackle"],
    signatures: ["spear", "superman-punch", "guillotine"], archetype: "power-strike", starterEligible: true,
    ability: { id: "head-of-the-table", name: "Head of the Table", text: "Once per match after Roman connects a Move for 6+ damage, draw 1 page and gain +1 Attitude Momentum.", trigger: "ON_MOVE_CONNECTED", maxUses: 1, when: { minDamage: 6 }, effects: [{ type: "draw", amount: 1 }, { type: "gainMomentum", method: "attitude", amount: 1 }] }
  },
  sethRollins: {
    id: "seth-rollins", name: "Seth Rollins", nickname: "The Visionary", hp: 34, setId: "summerslam-series-1",
    cardId: "superstar-seth-rollins", entranceId: "entrance-seth-rollins", leadOffIds: ["momentum-agility", "momentum-strike", "seth-superkick", "sling-blade", "dropkick"],
    signatures: ["stomp"], archetype: "agility-technical-strike",
    ability: { id: "the-architect", name: "The Architect", text: "The first time Seth connects with a Method he has not connected with before this match, draw 1 page.", trigger: "ON_MOVE_CONNECTED", maxUses: 1, when: { firstTimeMethod: true }, effects: [{ type: "draw", amount: 1 }] }
  },
  obaFemi: {
    id: "oba-femi", name: "Oba Femi", nickname: "The Ruler", hp: 48, setId: "summerslam-series-1",
    cardId: "superstar-oba-femi", entranceId: "entrance-oba-femi", leadOffIds: ["momentum-strength", "momentum-strike", "oba-shoulder-block", "oba-lariat", "shoulder-tackle"],
    signatures: ["fall-from-grace"], archetype: "power-strength",
    ability: { id: "the-ruler", name: "The Ruler", text: "Once per match after Oba connects a cost-6+ Strength Move, gain +1 Attitude Momentum.", trigger: "ON_MOVE_CONNECTED", maxUses: 1, when: { minCost: 6, methods: ["strength"] }, effects: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }
  },
  brockLesnar: {
    id: "brock-lesnar", name: "Brock Lesnar", nickname: "The Beast Incarnate", hp: 43, setId: "summerslam-series-1",
    cardId: "superstar-brock-lesnar", entranceId: "entrance-brock-lesnar", leadOffIds: ["momentum-strength", "momentum-technical", "german-suplex", "belly-to-belly", "shoulder-tackle"],
    signatures: ["f5", "kimura-lock"], archetype: "power-grappling",
    ability: { id: "next-big-thing", name: "The Next Big Thing", text: "At Turn 8, Brock gains +1 Strength Momentum.", trigger: "TURN_START", maxUses: 1, when: { turns: [8] }, effects: [{ type: "gainMomentum", method: "strength", amount: 1 }] }
  },
  kevinOwens: {
    id: "kevin-owens", name: "Kevin Owens", nickname: "KO", hp: 34, setId: "summerslam-series-1",
    cardId: "superstar-kevin-owens", entranceId: "entrance-kevin-owens", leadOffIds: ["momentum-strike", "momentum-strength", "owens-forearm", "owens-superkick", "running-forearm"],
    signatures: ["ko-stunner", "pop-up-powerbomb"], archetype: "brawler-technical",
    ability: { id: "fight-owens-fight", name: "Fight Owens Fight", text: "The first time Owens is hit by a Move for 7+ damage, gain +1 Attitude Momentum.", trigger: "ON_DAMAGE_TAKEN", maxUses: 1, when: { minDamage: 7 }, effects: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }
  },
  gunther: {
    id: "gunther", name: "Gunther", nickname: "The Ring General", hp: 44, setId: "summerslam-series-1",
    cardId: "superstar-gunther", entranceId: "entrance-gunther", leadOffIds: ["momentum-strike", "momentum-strength", "gunther-big-boot", "gunther-chop", "uppercut"],
    signatures: ["gunther-powerbomb", "sleeper-hold"], archetype: "strike-power",
    ability: { id: "ring-general", name: "Ring General", text: "The first 2 times Gunther connects a Strike Move for 5+ damage, gain +1 Attitude Momentum.", trigger: "ON_MOVE_CONNECTED", maxUses: 2, when: { minDamage: 5, methods: ["strike"] }, effects: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }
  },
  hulkHogan: {
    id: "hulk-hogan", name: "Hulk Hogan", nickname: "The Immortal", hp: 46, setId: "hall-of-fame-series-1", era: "golden-era",
    cardId: "superstar-hulk-hogan", entranceId: "hof1-entrance-hulk-hogan", leadOffIds: ["hof1-momentum-strength", "hof1-momentum-strike", "hof1-hogan-punches", "hof1-hogan-bodyslam", "hof1-jab"],
    signatures: ["hof1-hogan-leg-drop", "hof1-hogan-big-boot"], archetype: "power-strike",
    ability: { id: "hulking-up", name: "Hulking Up", text: "Once per match when Hogan falls to half HP or less, gain +2 Attitude and his next connected Move gets +2 damage.", trigger: "ON_DAMAGE_TAKEN", when: { hpAtOrBelowPercent: 50 }, effects: [{ type: "gainMomentum", method: "attitude", amount: 2 }, { type: "nextConnectedMoveDamageBonus", amount: 2 }] }
  },
  andreTheGiant: {
    id: "andre-the-giant", name: "André the Giant", nickname: "The Eighth Wonder of the World", hp: 52, setId: "hall-of-fame-series-1", era: "golden-era",
    cardId: "superstar-andre-the-giant", entranceId: "hof1-entrance-andre-the-giant", leadOffIds: ["hof1-momentum-strength", "hof1-momentum-strike", "hof1-andre-chop", "hof1-andre-bodyslam", "hof1-uppercut"],
    signatures: ["hof1-andre-elbow-drop", "hof1-andre-bearhug"], archetype: "giant-power",
    ability: { id: "eighth-wonder", name: "Eighth Wonder", text: "The first 2 times André connects a Strength Move for 6+ damage, draw 1 page and gain +1 Attitude Momentum.", trigger: "ON_MOVE_CONNECTED", maxUses: 2, when: { minDamage: 6, methods: ["strength"] }, effects: [{ type: "draw", amount: 1 }, { type: "gainMomentum", method: "attitude", amount: 1 }] }
  },
  randySavage: {
    id: "randy-savage", name: "Randy Savage", nickname: "Macho Man", hp: 39, setId: "hall-of-fame-series-1", era: "golden-era",
    cardId: "superstar-randy-savage", entranceId: "hof1-entrance-randy-savage", leadOffIds: ["hof1-momentum-agility", "hof1-momentum-strike", "hof1-savage-jab", "hof1-savage-axe-handle", "hof1-jab"],
    signatures: ["hof1-savage-elbow", "hof1-savage-axe-handle"], archetype: "agility-strike",
    ability: { id: "macho-madness", name: "Macho Madness", text: "Once per match after Savage connects an Agility Move, draw 1 page.", trigger: "ON_MOVE_CONNECTED", maxUses: 1, when: { methods: ["agility"] }, effects: [{ type: "draw", amount: 1 }] }
  },
  ultimateWarrior: {
    id: "ultimate-warrior", name: "Ultimate Warrior", nickname: "The Ultimate Warrior", hp: 47, setId: "hall-of-fame-series-1", era: "golden-era",
    cardId: "superstar-ultimate-warrior", entranceId: "hof1-entrance-ultimate-warrior", leadOffIds: ["hof1-momentum-strength", "hof1-momentum-strike", "hof1-warrior-punch", "hof1-warrior-shoulder", "hof1-shoulder-tackle"],
    signatures: ["hof1-warrior-splash", "hof1-warrior-press"], archetype: "power-rush",
    ability: { id: "warrior-rush", name: "Warrior Rush", text: "The first 2 times Warrior connects a Move for 7+ damage, gain +1 Strength; the first surge also draws 1 page.", trigger: "ON_MOVE_CONNECTED", maxUses: 2, when: { minDamage: 7 }, effects: [{ type: "gainMomentum", method: "strength", amount: 1 }, { type: "draw", amount: 1 }] }
  },
  stoneCold: {
    id: "stone-cold-steve-austin", name: "Stone Cold Steve Austin", nickname: "Stone Cold", hp: 42, setId: "hall-of-fame-series-1", era: "attitude-era",
    cardId: "superstar-stone-cold-steve-austin", entranceId: "hof1-entrance-stone-cold", leadOffIds: ["hof1-momentum-strike", "hof1-momentum-strength", "hof1-austin-punch", "hof1-austin-kick-gut", "hof1-jab"],
    signatures: ["hof1-austin-stunner", "hof1-austin-lou-thesz"], archetype: "brawler-strike",
    ability: { id: "stone-cold", name: "Stone Cold", text: "Once per match after Austin connects a Strike Move for 5+ damage, draw 1 page.", trigger: "ON_MOVE_CONNECTED", maxUses: 1, when: { minDamage: 5, methods: ["strike"] }, effects: [{ type: "draw", amount: 1 }] }
  },
  undertaker: {
    id: "the-undertaker", name: "The Undertaker", nickname: "The Deadman", hp: 48, setId: "hall-of-fame-series-1", era: "attitude-era",
    cardId: "superstar-the-undertaker", entranceId: "hof1-entrance-undertaker", leadOffIds: ["hof1-momentum-strength", "hof1-momentum-strike", "hof1-taker-punch", "hof1-taker-big-boot", "hof1-forearm"],
    signatures: ["hof1-taker-tombstone", "hof1-taker-chokeslam"], archetype: "power-strike",
    ability: { id: "deadman-rises", name: "The Deadman Rises", text: "The first 3 times an opponent Counters one of Undertaker's cost-3+ Moves, draw 1 page.", trigger: "ON_MOVE_COUNTERED", maxUses: 3, when: { minCost: 3 }, effects: [{ type: "draw", amount: 1 }] }
  },
  mankind: {
    id: "mankind", name: "Mankind", nickname: "The Deranged One", hp: 43, setId: "hall-of-fame-series-1", era: "attitude-era",
    cardId: "superstar-mankind", entranceId: "hof1-entrance-mankind", leadOffIds: ["hof1-momentum-technical", "hof1-momentum-strike", "hof1-mankind-punch", "hof1-mankind-neckbreaker", "hof1-forearm"],
    signatures: ["hof1-mankind-mandible-claw", "hof1-mankind-double-arm-ddt"], archetype: "hardcore-technical",
    ability: { id: "have-a-nice-day", name: "Have a Nice Day", text: "The first time Mankind is hit by a Move for 6+ damage, draw 1 page.", trigger: "ON_DAMAGE_TAKEN", maxUses: 1, when: { minDamage: 6 }, effects: [{ type: "draw", amount: 1 }] }
  },
  kane: {
    id: "kane", name: "Kane", nickname: "The Big Red Machine", hp: 48, setId: "hall-of-fame-series-1", era: "attitude-era",
    cardId: "superstar-kane", entranceId: "hof1-entrance-kane", leadOffIds: ["hof1-momentum-strength", "hof1-momentum-strike", "hof1-kane-uppercut", "hof1-kane-sidewalk-slam", "hof1-big-boot"],
    signatures: ["hof1-kane-tombstone", "hof1-kane-chokeslam"], archetype: "power-strike",
    ability: { id: "big-red-machine", name: "Big Red Machine", text: "Passive — Kane takes 1 less damage from High Risk Moves and ignores the first Stun that would affect him.", passive: { damageReduction: { amount: 1, moveTypes: ["high-risk"] }, ignoreFirstStun: true } }
  }
  ,rheaRipley: {
    id: "rhea-ripley", name: "Rhea Ripley", nickname: "The Eradicator", hp: 45, setId: "evolution-series-1", era: "evolution",
    cardId: "superstar-rhea-ripley", entranceId: "evo1-entrance-rhea-ripley", leadOffIds: ["evo1-momentum-strength", "evo1-momentum-strike", "evo1-rhea-short-arm-clothesline", "evo1-rhea-headbutt", "evo1-clothesline"],
    signatures: ["evo1-rhea-riptide", "evo1-rhea-prism-trap", "evo1-rhea-razors-edge"], archetype: "power-strike",
    ability: { id: "brutality", name: "Brutality", text: "The first 2 times Rhea connects a Strength Move for 7+ damage, draw 1 page and gain +1 Attitude Momentum.", trigger: "ON_MOVE_CONNECTED", maxUses: 2, when: { minDamage: 7, methods: ["strength"] }, effects: [{ type: "draw", amount: 1 }, { type: "gainMomentum", method: "attitude", amount: 1 }] }
  },
  livMorgan: {
    id: "liv-morgan", name: "Liv Morgan", nickname: "Watch Me", hp: 44, setId: "evolution-series-1", era: "evolution",
    cardId: "superstar-liv-morgan", entranceId: "evo1-entrance-liv-morgan", leadOffIds: ["evo1-momentum-agility", "evo1-momentum-strike", "evo1-liv-enzuigiri", "evo1-liv-double-knees", "evo1-dropkick"],
    signatures: ["evo1-liv-oblivion", "evo1-liv-codebreaker"], archetype: "agility-counter",
    ability: { id: "watch-me", name: "Watch Me", text: "The first 2 times Liv successfully Counters a Move, draw 1 page and gain +1 Attitude Momentum.", trigger: "ON_COUNTER_SUCCESS", maxUses: 2, effects: [{ type: "draw", amount: 1 }, { type: "gainMomentum", method: "attitude", amount: 1 }] }
  },
  beckyLynch: {
    id: "becky-lynch", name: "Becky Lynch", nickname: "The Man", hp: 41, setId: "evolution-series-1", era: "evolution",
    cardId: "superstar-becky-lynch", entranceId: "evo1-entrance-becky-lynch", leadOffIds: ["evo1-momentum-technical", "evo1-momentum-strike", "evo1-becky-uppercut", "evo1-becky-forearm", "evo1-european-uppercut"],
    signatures: ["evo1-becky-manhandle-slam", "evo1-becky-disarmher", "evo1-becky-exploder"], archetype: "technical-strike",
    ability: { id: "the-man", name: "The Man", text: "The first time Becky connects a Technical Move, draw 1 page and gain +1 Attitude Momentum.", trigger: "ON_MOVE_CONNECTED", maxUses: 1, when: { methods: ["technical"] }, effects: [{ type: "draw", amount: 1 }, { type: "gainMomentum", method: "attitude", amount: 1 }] }
  },
  bayley: {
    id: "bayley", name: "Bayley", nickname: "The Role Model", hp: 44, setId: "evolution-series-1", era: "evolution",
    cardId: "superstar-bayley", entranceId: "evo1-entrance-bayley", leadOffIds: ["evo1-momentum-technical", "evo1-momentum-agility", "evo1-bayley-running-knee", "evo1-bayley-suplex", "evo1-arm-drag"],
    signatures: ["evo1-bayley-rose-plant", "evo1-bayley-to-belly", "evo1-bayley-elbow-drop"], archetype: "technical-agility",
    ability: { id: "role-model", name: "Role Model", text: "Once per match from Turn 6 onward, when Bayley begins Control while behind in HP, draw 1 page and gain +1 Attitude Momentum.", trigger: "ON_CONTROL_START", maxUses: 1, when: { minTurn: 6, behindHp: true }, effects: [{ type: "draw", amount: 1 }, { type: "gainMomentum", method: "attitude", amount: 1 }] }
  },
  charlotteFlair: {
    id: "charlotte-flair", name: "Charlotte Flair", nickname: "The Queen", hp: 46, setId: "evolution-series-1", era: "evolution",
    cardId: "superstar-charlotte-flair", entranceId: "evo1-entrance-charlotte-flair", leadOffIds: ["evo1-momentum-agility", "evo1-momentum-strike", "evo1-charlotte-chops", "evo1-charlotte-big-boot", "evo1-knife-edge-chop"],
    signatures: ["evo1-charlotte-figure-eight", "evo1-charlotte-natural-selection", "evo1-charlotte-spear"], archetype: "athletic-power",
    ability: { id: "the-queen", name: "The Queen", text: "The first 3 times Charlotte connects a Move for 5+ damage, draw 1 page and gain +1 Attitude Momentum.", trigger: "ON_MOVE_CONNECTED", maxUses: 3, when: { minDamage: 5 }, effects: [{ type: "draw", amount: 1 }, { type: "gainMomentum", method: "attitude", amount: 1 }] }
  },
  iyoSky: {
    id: "iyo-sky", name: "IYO SKY", nickname: "The Genius of the Sky", hp: 42, setId: "evolution-series-1", era: "evolution",
    cardId: "superstar-iyo-sky", entranceId: "evo1-entrance-iyo-sky", leadOffIds: ["evo1-momentum-agility", "evo1-momentum-technical", "evo1-iyo-dropkick", "evo1-iyo-missile-dropkick", "evo1-dropkick"],
    signatures: ["evo1-iyo-over-the-moonsault", "evo1-iyo-bullet-train", "evo1-iyo-poison-rana"], archetype: "high-risk-agility",
    ability: { id: "genius-of-the-sky", name: "Genius of the Sky", text: "The first 2 times IYO connects an Agility Move for 5+ damage, draw 1 page and gain +1 Attitude Momentum.", trigger: "ON_MOVE_CONNECTED", maxUses: 2, when: { minDamage: 5, methods: ["agility"] }, effects: [{ type: "draw", amount: 1 }, { type: "gainMomentum", method: "attitude", amount: 1 }] }
  },
  paige: {
    id: "paige", name: "Paige", nickname: "The Anti-Diva", hp: 39, setId: "evolution-series-1", era: "evolution",
    cardId: "superstar-paige", entranceId: "evo1-entrance-paige", leadOffIds: ["evo1-momentum-technical", "evo1-momentum-strike", "evo1-paige-side-kick", "evo1-paige-knee-strikes", "evo1-arm-drag"],
    signatures: ["evo1-paige-ram-paige", "evo1-paige-pto", "evo1-paige-turner"], archetype: "technical-counter",
    ability: { id: "anti-diva", name: "Anti-Diva", text: "The first 2 times Paige successfully Counters a cost-2+ Move, draw 1 page, gain +1 Technical and +1 Attitude Momentum.", trigger: "ON_COUNTER_SUCCESS", maxUses: 2, when: { minCost: 2 }, effects: [{ type: "draw", amount: 1 }, { type: "gainMomentum", method: "technical", amount: 1 }, { type: "gainMomentum", method: "attitude", amount: 1 }] }
  },
  stephanieVaquer: {
    id: "stephanie-vaquer", name: "Stephanie Vaquer", nickname: "La Primera", hp: 48, setId: "evolution-series-1", era: "evolution",
    cardId: "superstar-stephanie-vaquer", entranceId: "evo1-entrance-stephanie-vaquer", leadOffIds: ["evo1-momentum-technical", "evo1-momentum-strike", "evo1-vaquer-dragon-screw", "evo1-vaquer-running-knee", "evo1-leg-sweep"],
    signatures: ["evo1-vaquer-svb", "evo1-vaquer-devils-kiss", "evo1-vaquer-inferno"], archetype: "technical-strike",
    ability: { id: "la-primera", name: "La Primera", text: "The first 3 times Stephanie connects a Technical or Strike Move for 5+ damage, draw 1 page and gain +1 Attitude Momentum.", trigger: "ON_MOVE_CONNECTED", maxUses: 3, when: { minDamage: 5, methods: ["technical", "strike"] }, effects: [{ type: "draw", amount: 1 }, { type: "gainMomentum", method: "attitude", amount: 1 }] }
  }
,
  theRock: {
    id: "the-rock", name: "The Rock", nickname: "The Final Boss", hp: 56, setId: "season-1-final-boss", era: "final-boss",
    cardId: "superstar-the-rock", entranceId: "s1rock-entrance-final-boss",
    leadOffIds: ["s1rock-momentum-strength", "s1rock-momentum-strike", "s1rock-body-shot", "s1rock-shoulder-block", "s1rock-clothesline"],
    signatures: ["s1rock-rock-bottom-final-boss", "s1rock-peoples-elbow-final-boss", "s1rock-final-boss-spinebuster", "s1rock-final-boss-sharpshooter"],
    archetype: "final-boss-power-strike",
    seasonExclusive: true,
    ability: { id: "final-boss-authority", name: "The Final Boss", text: "The first 3 times Rock connects a Strength or Strike Move for 5+ damage, draw 1 page and gain +1 Attitude Momentum.", trigger: "ON_MOVE_CONNECTED", maxUses: 3, when: { minDamage: 5, methods: ["strength", "strike"] }, effects: [{ type: "draw", amount: 1 }, { type: "gainMomentum", method: "attitude", amount: 1 }] }
  }

};
