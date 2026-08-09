export const superstars = {
  codyRhodes: {
    id: "cody-rhodes", name: "Cody Rhodes", nickname: "The American Nightmare", hp: 40, setId: "summerslam-series-1",
    cardId: "superstar-cody-rhodes", leadOffIds: ["entrance-cody-rhodes", "momentum-technical", "momentum-strike", "cody-powerslam", "cody-drop-down-punch"],
    signatures: ["cross-rhodes", "cody-cutter"], archetype: "balanced",
    ability: { id: "undeniable-variety", name: "Undeniable", text: "The first time Cody connects with a Move Type he has not connected with before this match, draw 1 page.", trigger: "ON_MOVE_CONNECTED", maxUses: 1, when: { firstTimeMoveType: true }, effects: [{ type: "draw", amount: 1 }] }
  },
  cmPunk: {
    id: "cm-punk", name: "CM Punk", nickname: "The Best in the World", hp: 38, setId: "summerslam-series-1",
    cardId: "superstar-cm-punk", leadOffIds: ["entrance-cm-punk", "momentum-technical", "momentum-strike", "punk-snap-suplex", "punk-roundhouse"],
    signatures: ["gts", "anaconda-vise"], archetype: "technical-strike", starterEligible: true,
    ability: { id: "counter-culture", name: "Counter Culture", text: "The first time Punk successfully Counters a Move, gain +1 Technical Momentum.", trigger: "ON_COUNTER_SUCCESS", maxUses: 1, effects: [{ type: "gainMomentum", method: "technical", amount: 1 }] }
  },
  romanReigns: {
    id: "roman-reigns", name: "Roman Reigns", nickname: "The OTC", hp: 46, setId: "summerslam-series-1",
    cardId: "superstar-roman-reigns", leadOffIds: ["entrance-roman-reigns", "momentum-strength", "momentum-strike", "roman-uppercut", "drive-by"],
    signatures: ["spear", "superman-punch", "guillotine"], archetype: "power-strike", starterEligible: true,
    ability: { id: "head-of-the-table", name: "Head of the Table", text: "Once per match after Roman connects a Move for 6+ damage, draw 1 page and gain +1 Attitude Momentum.", trigger: "ON_MOVE_CONNECTED", maxUses: 1, when: { minDamage: 6 }, effects: [{ type: "draw", amount: 1 }, { type: "gainMomentum", method: "attitude", amount: 1 }] }
  },
  sethRollins: {
    id: "seth-rollins", name: "Seth Rollins", nickname: "The Visionary", hp: 41, setId: "summerslam-series-1",
    cardId: "superstar-seth-rollins", leadOffIds: ["entrance-seth-rollins", "momentum-agility", "momentum-strike", "seth-superkick", "sling-blade"],
    signatures: ["stomp"], archetype: "agility-technical-strike",
    ability: { id: "the-architect", name: "The Architect", text: "The first time Seth connects with a Method he has not connected with before this match, draw 1 page.", trigger: "ON_MOVE_CONNECTED", maxUses: 1, when: { firstTimeMethod: true }, effects: [{ type: "draw", amount: 1 }] }
  },
  obaFemi: {
    id: "oba-femi", name: "Oba Femi", nickname: "The Ruler", hp: 46, setId: "summerslam-series-1",
    cardId: "superstar-oba-femi", leadOffIds: ["entrance-oba-femi", "momentum-strength", "momentum-strike", "oba-shoulder-block", "oba-lariat"],
    signatures: ["fall-from-grace"], archetype: "power-strength",
    ability: { id: "the-ruler", name: "The Ruler", text: "Once per match after Oba connects a cost-6+ Strength Move, gain +1 Attitude Momentum.", trigger: "ON_MOVE_CONNECTED", maxUses: 1, when: { minCost: 6, methods: ["strength"] }, effects: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }
  },
  brockLesnar: {
    id: "brock-lesnar", name: "Brock Lesnar", nickname: "The Beast Incarnate", hp: 43, setId: "summerslam-series-1",
    cardId: "superstar-brock-lesnar", leadOffIds: ["entrance-brock-lesnar", "momentum-strength", "momentum-technical", "german-suplex", "belly-to-belly"],
    signatures: ["f5", "kimura-lock"], archetype: "power-grappling",
    ability: { id: "next-big-thing", name: "The Next Big Thing", text: "At Turn 8, Brock gains +1 Strength Momentum.", trigger: "TURN_START", maxUses: 1, when: { turns: [8] }, effects: [{ type: "gainMomentum", method: "strength", amount: 1 }] }
  },
  kevinOwens: {
    id: "kevin-owens", name: "Kevin Owens", nickname: "KO", hp: 40, setId: "summerslam-series-1",
    cardId: "superstar-kevin-owens", leadOffIds: ["entrance-kevin-owens", "momentum-strike", "momentum-strength", "owens-forearm", "owens-superkick"],
    signatures: ["ko-stunner", "pop-up-powerbomb"], archetype: "brawler-technical",
    ability: { id: "fight-owens-fight", name: "Fight Owens Fight", text: "The first time Owens is hit by a Move for 6+ damage, draw 1 page.", trigger: "ON_DAMAGE_TAKEN", maxUses: 1, when: { minDamage: 6 }, effects: [{ type: "draw", amount: 1 }] }
  },
  gunther: {
    id: "gunther", name: "Gunther", nickname: "The Ring General", hp: 43, setId: "summerslam-series-1",
    cardId: "superstar-gunther", leadOffIds: ["entrance-gunther", "momentum-strike", "momentum-strength", "gunther-big-boot", "gunther-chop"],
    signatures: ["gunther-powerbomb", "sleeper-hold"], archetype: "strike-power",
    ability: { id: "ring-general", name: "Ring General", text: "The first 2 times Gunther connects a Strike Move for 5+ damage, gain +1 Attitude Momentum.", trigger: "ON_MOVE_CONNECTED", maxUses: 2, when: { minDamage: 5, methods: ["strike"] }, effects: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }
  },
  hulkHogan: {
    id: "hulk-hogan", name: "Hulk Hogan", nickname: "The Immortal", hp: 44, setId: "hall-of-fame-series-1", era: "golden-era",
    cardId: "superstar-hulk-hogan", leadOffIds: ["hof1-entrance-hulk-hogan", "hof1-momentum-strength", "hof1-momentum-strike", "hof1-hogan-punches", "hof1-hogan-bodyslam"],
    signatures: ["hof1-hogan-leg-drop", "hof1-hogan-big-boot"], archetype: "power-strike",
    ability: { id: "hulking-up", name: "Hulking Up", text: "Once per match when Hogan falls to half HP or less, gain +2 Attitude and his next connected Move gets +2 damage.", trigger: "ON_DAMAGE_TAKEN", when: { hpAtOrBelowPercent: 50 }, effects: [{ type: "gainMomentum", method: "attitude", amount: 2 }, { type: "nextConnectedMoveDamageBonus", amount: 2 }] }
  },
  andreTheGiant: {
    id: "andre-the-giant", name: "André the Giant", nickname: "The Eighth Wonder of the World", hp: 46, setId: "hall-of-fame-series-1", era: "golden-era",
    cardId: "superstar-andre-the-giant", leadOffIds: ["hof1-entrance-andre-the-giant", "hof1-momentum-strength", "hof1-momentum-strike", "hof1-andre-chop", "hof1-andre-bodyslam"],
    signatures: ["hof1-andre-elbow-drop", "hof1-andre-bearhug"], archetype: "giant-power",
    ability: { id: "eighth-wonder", name: "Eighth Wonder", text: "Once per match after André connects a Strength Move for 8+ damage, gain +1 Attitude Momentum.", trigger: "ON_MOVE_CONNECTED", maxUses: 1, when: { minDamage: 8, methods: ["strength"] }, effects: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }
  },
  randySavage: {
    id: "randy-savage", name: "Randy Savage", nickname: "Macho Man", hp: 40, setId: "hall-of-fame-series-1", era: "golden-era",
    cardId: "superstar-randy-savage", leadOffIds: ["hof1-entrance-randy-savage", "hof1-momentum-agility", "hof1-momentum-strike", "hof1-savage-jab", "hof1-savage-axe-handle"],
    signatures: ["hof1-savage-elbow", "hof1-savage-axe-handle"], archetype: "agility-strike",
    ability: { id: "macho-madness", name: "Macho Madness", text: "Once per match after Savage connects an Agility Move, draw 1 page and gain +1 Attitude Momentum.", trigger: "ON_MOVE_CONNECTED", maxUses: 1, when: { methods: ["agility"] }, effects: [{ type: "draw", amount: 1 }, { type: "gainMomentum", method: "attitude", amount: 1 }] }
  },
  ultimateWarrior: {
    id: "ultimate-warrior", name: "Ultimate Warrior", nickname: "The Ultimate Warrior", hp: 43, setId: "hall-of-fame-series-1", era: "golden-era",
    cardId: "superstar-ultimate-warrior", leadOffIds: ["hof1-entrance-ultimate-warrior", "hof1-momentum-strength", "hof1-momentum-strike", "hof1-warrior-punch", "hof1-warrior-shoulder"],
    signatures: ["hof1-warrior-splash", "hof1-warrior-press"], archetype: "power-rush",
    ability: { id: "warrior-rush", name: "Warrior Rush", text: "Once per match after Warrior connects a Move for 7+ damage, gain +1 Strength and his next connected Move gets +1 damage.", trigger: "ON_MOVE_CONNECTED", when: { minDamage: 7 }, effects: [{ type: "gainMomentum", method: "strength", amount: 1 }, { type: "nextConnectedMoveDamageBonus", amount: 1 }] }
  },
  stoneCold: {
    id: "stone-cold-steve-austin", name: "Stone Cold Steve Austin", nickname: "Stone Cold", hp: 42, setId: "hall-of-fame-series-1", era: "attitude-era",
    cardId: "superstar-stone-cold-steve-austin", leadOffIds: ["hof1-entrance-stone-cold", "hof1-momentum-strike", "hof1-momentum-strength", "hof1-austin-punch", "hof1-austin-kick-gut"],
    signatures: ["hof1-austin-stunner", "hof1-austin-lou-thesz"], archetype: "brawler-strike",
    ability: { id: "stone-cold", name: "Stone Cold", text: "Once per match after Austin connects a Strike Move for 5+ damage, draw 1 page.", trigger: "ON_MOVE_CONNECTED", maxUses: 1, when: { minDamage: 5, methods: ["strike"] }, effects: [{ type: "draw", amount: 1 }] }
  },
  undertaker: {
    id: "the-undertaker", name: "The Undertaker", nickname: "The Deadman", hp: 47, setId: "hall-of-fame-series-1", era: "attitude-era",
    cardId: "superstar-the-undertaker", leadOffIds: ["hof1-entrance-undertaker", "hof1-momentum-strength", "hof1-momentum-strike", "hof1-taker-punch", "hof1-taker-big-boot"],
    signatures: ["hof1-taker-tombstone", "hof1-taker-chokeslam"], archetype: "power-strike",
    ability: { id: "deadman-rises", name: "The Deadman Rises", text: "The first 3 times an opponent Counters one of Undertaker's cost-3+ Moves, draw 1 page.", trigger: "ON_MOVE_COUNTERED", maxUses: 3, when: { minCost: 3 }, effects: [{ type: "draw", amount: 1 }] }
  },
  mankind: {
    id: "mankind", name: "Mankind", nickname: "The Deranged One", hp: 43, setId: "hall-of-fame-series-1", era: "attitude-era",
    cardId: "superstar-mankind", leadOffIds: ["hof1-entrance-mankind", "hof1-momentum-technical", "hof1-momentum-strike", "hof1-mankind-punch", "hof1-mankind-neckbreaker"],
    signatures: ["hof1-mankind-mandible-claw", "hof1-mankind-double-arm-ddt"], archetype: "hardcore-technical",
    ability: { id: "have-a-nice-day", name: "Have a Nice Day", text: "The first time Mankind is hit by a Move for 6+ damage, draw 1 page.", trigger: "ON_DAMAGE_TAKEN", maxUses: 1, when: { minDamage: 6 }, effects: [{ type: "draw", amount: 1 }] }
  },
  kane: {
    id: "kane", name: "Kane", nickname: "The Big Red Machine", hp: 44, setId: "hall-of-fame-series-1", era: "attitude-era",
    cardId: "superstar-kane", leadOffIds: ["hof1-entrance-kane", "hof1-momentum-strength", "hof1-momentum-strike", "hof1-kane-uppercut", "hof1-kane-sidewalk-slam"],
    signatures: ["hof1-kane-tombstone", "hof1-kane-chokeslam"], archetype: "power-strike",
    ability: { id: "big-red-machine", name: "Big Red Machine", text: "Passive — Kane takes 1 less damage from High Risk Moves and ignores the first Stun that would affect him.", passive: { damageReduction: { amount: 1, moveTypes: ["high-risk"] }, ignoreFirstStun: true } }
  }
};
