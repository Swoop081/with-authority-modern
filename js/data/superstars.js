export const superstars = {
  codyRhodes: {
    id: "cody-rhodes", name: "Cody Rhodes", nickname: "The American Nightmare", hp: 69, setId: "summerslam-series-1",
    cardId: "superstar-cody-rhodes", entranceId: "entrance-cody-rhodes", leadOffIds: ["momentum-technical", "momentum-strike", "cody-powerslam", "cody-drop-down-punch", "arm-drag"],
    signatures: ["cross-rhodes", "cody-cutter"], archetype: "balanced",
    ability: { id: "undeniable-variety", name: "Undeniable", text: "The first time Cody connects with a Move Type he has not connected with before this match, draw 1 page.", trigger: "ON_MOVE_CONNECTED", maxUses: 1, when: { firstTimeMoveType: true }, effects: [{ type: "draw", amount: 1 }] }
  },
  cmPunk: {
    id: "cm-punk", name: "CM Punk", nickname: "The Best in the World", hp: 73, setId: "summerslam-series-1",
    cardId: "superstar-cm-punk", entranceId: "entrance-cm-punk", leadOffIds: ["momentum-technical", "momentum-strike", "punk-snap-suplex", "punk-roundhouse", "side-headlock"],
    signatures: ["gts", "anaconda-vise"], archetype: "technical-strike", starterEligible: true,
    ability: { id: "pipe-bomb", name: "Pipe Bomb", text: "The first time Punk successfully Counters a Move, gain +1 Technical Momentum.", trigger: "ON_COUNTER_SUCCESS", maxUses: 1, effects: [{ type: "gainMomentum", method: "technical", amount: 1 }] }
  },
  romanReigns: {
    id: "roman-reigns", name: "Roman Reigns", nickname: "The OTC", hp: 84, setId: "summerslam-series-1",
    cardId: "superstar-roman-reigns", entranceId: "entrance-roman-reigns", leadOffIds: ["momentum-strength", "momentum-strike", "roman-uppercut", "headbutt", "shoulder-tackle"],
    signatures: ["spear", "superman-punch", "guillotine"], archetype: "power-strike", starterEligible: true,
    ability: { id: "head-of-the-table", name: "Head of the Table", text: "The first 2 times Roman connects a Move for 6+ damage, draw 1 page and gain +1 Attitude Momentum.", trigger: "ON_MOVE_CONNECTED", maxUses: 2, when: { minDamage: 6 }, effects: [{ type: "draw", amount: 1 }, { type: "gainMomentum", method: "attitude", amount: 1 }] }
  },
  sethRollins: {
    id: "seth-rollins", name: "Seth Rollins", nickname: "The Visionary", hp: 71, setId: "summerslam-series-1",
    cardId: "superstar-seth-rollins", entranceId: "entrance-seth-rollins", leadOffIds: ["momentum-agility", "momentum-strike", "seth-superkick", "sling-blade", "dropkick"],
    signatures: ["stomp"], archetype: "agility-technical-strike",
    ability: { id: "the-architect", name: "The Architect", text: "The first 2 times Seth connects with a Method he has not connected with before this match, draw 1 page.", trigger: "ON_MOVE_CONNECTED", maxUses: 2, when: { firstTimeMethod: true }, effects: [{ type: "draw", amount: 1 }] }
  },
  obaFemi: {
    id: "oba-femi", name: "Oba Femi", nickname: "The Ruler", hp: 84, setId: "summerslam-series-1",
    cardId: "superstar-oba-femi", entranceId: "entrance-oba-femi", leadOffIds: ["momentum-strength", "momentum-strike", "oba-shoulder-block", "oba-lariat", "shoulder-tackle"],
    signatures: ["fall-from-grace"], archetype: "power-strength",
    ability: { id: "the-ruler", name: "The Ruler", text: "The first 2 times Oba connects a cost-6+ Strength Move, draw 1 page and gain +1 Attitude Momentum.", trigger: "ON_MOVE_CONNECTED", maxUses: 2, when: { minCost: 6, methods: ["strength"] }, effects: [{ type: "draw", amount: 1 }, { type: "gainMomentum", method: "attitude", amount: 1 }] }
  },
  brockLesnar: {
    id: "brock-lesnar", name: "Brock Lesnar", nickname: "The Beast Incarnate", hp: 82, setId: "summerslam-series-1",
    cardId: "superstar-brock-lesnar", entranceId: "entrance-brock-lesnar", leadOffIds: ["momentum-strength", "momentum-technical", "brock-german-suplex", "belly-to-belly-common", "shoulder-tackle"],
    signatures: ["f5", "kimura-lock"], archetype: "power-grappling",
    ability: { id: "suplex-city", name: "Suplex City", text: "The first 2 times Brock connects Brock's German Suplex, gain +1 Attitude Momentum and search your Playbook for another Brock's German Suplex. This caps the chain at 3.", trigger: "ON_MOVE_CONNECTED", maxUses: 2, when: { cardIds: ["brock-german-suplex"] }, effects: [{ type: "gainMomentum", method: "attitude", amount: 1 }, { type: "searchDeck", cardId: "brock-german-suplex" }] }
  },
  kevinOwens: {
    id: "kevin-owens", name: "Kevin Owens", nickname: "KO", hp: 75, setId: "summerslam-series-1",
    cardId: "superstar-kevin-owens", entranceId: "entrance-kevin-owens", leadOffIds: ["momentum-strike", "momentum-strength", "running-forearm", "superkick", "shoulder-tackle"],
    signatures: ["ko-stunner", "pop-up-powerbomb"], archetype: "brawler-technical",
    ability: { id: "the-prize-fighter", name: "The Prize Fighter", text: "The first 2 times Owens is hit by a Move for 7+ damage, draw 1 page and gain +1 Attitude Momentum.", trigger: "ON_DAMAGE_TAKEN", maxUses: 2, when: { minDamage: 7 }, effects: [{ type: "draw", amount: 1 }, { type: "gainMomentum", method: "attitude", amount: 1 }] }
  },
  gunther: {
    id: "gunther", name: "Gunther", nickname: "The Ring General", hp: 82, setId: "summerslam-series-1",
    cardId: "superstar-gunther", entranceId: "entrance-gunther", leadOffIds: ["momentum-strike", "momentum-strength", "gunther-chop-reviewed", "uppercut", "big-boot"],
    signatures: ["gunther-powerbomb", "sleeper-hold"], archetype: "strike-power",
    ability: { id: "ring-general", name: "Ring General", text: "The first time Gunther connects a Strike Move for 5+ damage, draw 1 page and gain +1 Attitude Momentum.", trigger: "ON_MOVE_CONNECTED", maxUses: 1, when: { minDamage: 5, methods: ["strike"] }, effects: [{ type: "draw", amount: 1 }, { type: "gainMomentum", method: "attitude", amount: 1 }] }
  },
  hulkHogan: {
    id: "hulk-hogan", name: "Hulk Hogan", nickname: "Hulkster", hp: 72, setId: "hall-of-fame-series-1", era: "golden-era",
    cardId: "superstar-hulk-hogan", entranceId: "hof1-entrance-hulk-hogan", leadOffIds: ["momentum-strength", "momentum-strike", "hof1-hogan-punch-reviewed", "hof1-bodyslam", "hof1-jab"],
    signatures: ["hof1-hogan-big-boot-reviewed", "hof1-hogan-atomic-leg-drop-reviewed"], archetype: "power-strike",
    ability: { id: "hulkamania", name: "Hulkamania", text: "First time Hogan falls below 40% HP: gain +2 Attitude, draw 2, and ignore the next Stun.", trigger: "ON_DAMAGE_TAKEN", maxUses: 1, when: { hpAtOrBelowPercent: 40 }, effects: [{ type: "gainMomentum", method: "attitude", amount: 2 }, { type: "draw", amount: 2 }, { type: "ignoreNextStun", amount: 1 }] }
  },
  andreTheGiant: {
    id: "andre-the-giant", name: "André the Giant", nickname: "The Eighth Wonder of the World", hp: 60, setId: "hall-of-fame-series-1", era: "golden-era",
    cardId: "superstar-andre-the-giant", entranceId: "hof1-entrance-andre-the-giant", leadOffIds: ["momentum-strength", "momentum-strike", "hof1-andre-headbutt-reviewed", "hof1-andre-chop", "hof1-bodyslam"],
    signatures: ["hof1-andre-giant-bodyslam", "hof1-andre-giant-splash"], archetype: "giant-power",
    ability: { id: "eighth-wonder", name: "The Eighth Wonder", text: "The first time André would be Stunned or sent Ringside, ignore that effect.", passive: { ignoreFirstStun: true, ignoreFirstRingside: true } }
  },
  randySavage: {
    id: "randy-savage", name: "Randy Savage", nickname: "Macho Man", hp: 66, setId: "hall-of-fame-series-1", era: "golden-era",
    cardId: "superstar-randy-savage", entranceId: "hof1-entrance-randy-savage", leadOffIds: ["momentum-agility", "momentum-strike", "hof1-savage-jab", "hof1-forearm", "hof1-jab"],
    signatures: ["hof1-savage-diving-double-axe", "hof1-savage-flying-elbow-reviewed"], archetype: "agility-strike",
    ability: { id: "madness", name: "Madness", text: "Once per match after Savage connects two different Move methods during the same Control sequence, draw 1 and gain +1 Attitude.", passive: { madness: true } }
  },
  ultimateWarrior: {
    id: "ultimate-warrior", name: "Ultimate Warrior", nickname: "The Ultimate Warrior", hp: 72, setId: "hall-of-fame-series-1", era: "golden-era",
    cardId: "superstar-ultimate-warrior", entranceId: "hof1-entrance-ultimate-warrior", leadOffIds: ["momentum-strength", "momentum-strike", "hof1-warrior-punch", "hof1-warrior-clothesline-reviewed", "shoulder-tackle"],
    signatures: ["hof1-warrior-gorilla-press-reviewed", "hof1-warrior-splash-reviewed"], archetype: "power-rush",
    ability: { id: "feel-the-power", name: "Feel the Power", text: "The first 2 times Warrior connects a Move for 6+ damage, gain +1 Attitude.", trigger: "ON_MOVE_CONNECTED", maxUses: 2, when: { minDamage: 6 }, effects: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }
  },
  stoneCold: {
    id: "stone-cold-steve-austin", name: "Stone Cold Steve Austin", nickname: "Stone Cold", hp: 68, setId: "hall-of-fame-series-1", era: "attitude-era",
    cardId: "superstar-stone-cold-steve-austin", entranceId: "hof1-entrance-stone-cold", leadOffIds: ["momentum-strike", "momentum-strength", "hof1-austin-punch", "headbutt", "hof1-jab"],
    signatures: ["hof1-austin-kick-reviewed", "hof1-austin-stunner-reviewed"], archetype: "brawler-strike",
    ability: { id: "bottom-line", name: "And That’s the Bottom Line", text: "The first 2 times one of Austin’s Moves is Countered, gain +1 Attitude.", trigger: "ON_MOVE_COUNTERED", maxUses: 2, effects: [{ type: "gainMomentum", method: "attitude", amount: 1 }] }
  },
  undertaker: {
    id: "the-undertaker", name: "The Undertaker", nickname: "The Deadman", hp: 74, setId: "hall-of-fame-series-1", era: "attitude-era",
    cardId: "superstar-the-undertaker", entranceId: "hof1-entrance-undertaker", leadOffIds: ["momentum-strength", "momentum-strike", "hof1-taker-punch", "headbutt", "hof1-jab"],
    signatures: ["hof1-taker-old-school-reviewed", "hof1-taker-chokeslam-reviewed", "hof1-taker-tombstone-reviewed"], archetype: "power-strike",
    ability: { id: "deadman-walking", name: "Deadman Walking", text: "Once per match, if a Move would reduce Undertaker to 0 HP, leave him at 1 HP, gain +2 Attitude and draw 1 page.", passive: { surviveAtOneOnce: true, deadmanComeback: true } }
  },
  mankind: {
    id: "mankind", name: "Mankind", nickname: "The Deranged One", hp: 64, setId: "hall-of-fame-series-1", era: "attitude-era",
    cardId: "superstar-mankind", entranceId: "hof1-entrance-mankind", leadOffIds: ["momentum-technical", "momentum-strike", "hof1-mankind-punch", "side-headlock", "hof1-forearm"],
    signatures: ["hof1-mankind-double-arm-reviewed", "hof1-mankind-claw-reviewed"], archetype: "hardcore-technical",
    ability: { id: "have-a-nice-day", name: "Have a Nice Day!", text: "First time below 50% HP draw 2; first time below 25% HP gain +1 Attitude.", trigger: "ON_DAMAGE_TAKEN", maxUses: 2, effects: [{ type: "mankindThresholds" }] }
  },
  kane: {
    id: "kane", name: "Kane", nickname: "The Big Red Machine", hp: 74, setId: "hall-of-fame-series-1", era: "attitude-era",
    cardId: "superstar-kane", entranceId: "hof1-entrance-kane", leadOffIds: ["momentum-strength", "momentum-strike", "headbutt", "hof1-jab", "shoulder-tackle"],
    signatures: ["hof1-kane-chokeslam-reviewed", "hof1-kane-tombstone-reviewed"], archetype: "power-strike",
    ability: { id: "big-red-machine", name: "The Big Red Machine", text: "The first 2 times Kane connects a Move for 8+ damage, draw 1 page and gain +1 Attitude. If that Move leaves the opponent On Mat, Kane's next Strike Move this Control gets +1 damage.", trigger: "ON_MOVE_CONNECTED", maxUses: 2, when: { minDamage: 8 }, effects: [{ type: "draw", amount: 1 }, { type: "gainMomentum", method: "attitude", amount: 1 }] }
  },
  rheaRipley: {
    id: "rhea-ripley", name: "Rhea Ripley", nickname: "Mami", hp: 66, setId: "evolution-series-1",
    cardId: "superstar-rhea-ripley", entranceId: "evo1-entrance-rhea-ripley",
    leadOffIds: ["momentum-strength", "momentum-strike", "evo1-rhea-headbutt", "hof1-forearm", "evo1-body-slam-reviewed"],
    signatures: ["evo1-rhea-riptide","evo1-rhea-prism-trap","evo1-rhea-avalanche-riptide"], archetype: "power-strike-submission",
    ability: { id:"mamis-always-on-top", name:"Mami’s Always on Top", text:"The first 2 times Rhea connects a Strength Move for 7+ damage, gain +1 Attitude.", trigger:"ON_MOVE_CONNECTED", maxUses:2, when:{minDamage:7,methods:["strength"]}, effects:[{type:"gainMomentum",method:"attitude",amount:1},{type:"draw",amount:1}] }
  },
  livMorgan: {
    id:"liv-morgan", name:"Liv Morgan", nickname:"Watch Me", hp:58, setId:"evolution-series-1",
    cardId:"superstar-liv-morgan", entranceId:"evo1-entrance-liv-morgan",
    leadOffIds: ["momentum-agility", "momentum-strike", "evo1-liv-dropkick-reviewed", "evo1-arm-drag", "hof1-forearm"],
    signatures:["evo1-liv-code-red","evo1-liv-oblivion"], archetype:"agility-counter",
    ability:{id:"watch-me",name:"Watch Me",text:"Once per match below 40% HP, draw 2 and gain +1 Attitude.",trigger:"ON_DAMAGE_TAKEN",maxUses:1,when:{hpAtOrBelowPercent:40},effects:[{type:"draw",amount:2},{type:"gainMomentum",method:"attitude",amount:1}]}
  },
  beckyLynch: {
    id:"becky-lynch", name:"Becky Lynch", nickname:"The Man", hp:60, setId:"evolution-series-1",
    cardId:"superstar-becky-lynch", entranceId:"evo1-entrance-becky-lynch",
    leadOffIds: ["momentum-technical", "momentum-strike", "evo1-becky-uppercut", "evo1-arm-drag", "hof1-forearm"],
    signatures:["evo1-becky-manhandle-slam","evo1-becky-disarmher"], archetype:"technical-strike",
    ability:{id:"the-man",name:"The Man",text:"The first 2 times Becky connects a Technical Move after a Strike Move or a Strike Move after a Technical Move, gain +1 Attitude.",passive:{methodCombo:true}}
  },
  bayley: {
    id:"bayley", name:"Bayley", nickname:"The Role Model", hp:59, setId:"evolution-series-1",
    cardId:"superstar-bayley", entranceId:"evo1-entrance-bayley",
    leadOffIds: ["momentum-technical", "momentum-strike", "evo1-arm-drag", "evo1-bayley-back-elbow-reviewed", "evo1-snapmare"],
    signatures:["evo1-bayley-to-belly","evo1-bayley-rose-plant"], archetype:"technical-control",
    ability:{id:"role-model",name:"Role Model",text:"The first 2 times Bayley connects a Technical Move, look at the top 2 pages; she may take a Move and puts the rest on the bottom.",passive:{roleModelTop2:true}}
  },
  charlotteFlair: {
    id:"charlotte-flair", name:"Charlotte Flair", nickname:"The Queen", hp:62, setId:"evolution-series-1",
    cardId:"superstar-charlotte-flair", entranceId:"evo1-entrance-charlotte-flair",
    leadOffIds: ["momentum-technical", "momentum-strength", "evo1-charlotte-chops", "evo1-arm-drag", "evo1-leg-sweep"],
    signatures:["evo1-charlotte-natural-selection","evo1-charlotte-figure-eight"], archetype:"technical-strength-agility",
    ability:{id:"the-queen",name:"The Queen",text:"After Charlotte has connected Technical, Strength and Agility Moves, gain +2 Attitude and draw 2 once per match.",passive:{threeMethodQueen:true}}
  },
  iyoSky: {
    id:"iyo-sky", name:"IYO SKY", nickname:"The Genius of the Sky", hp:56, setId:"evolution-series-1",
    cardId:"superstar-iyo-sky", entranceId:"evo1-entrance-iyo-sky",
    leadOffIds: ["momentum-agility", "momentum-strike", "evo1-iyo-springboard-dropkick", "evo1-arm-drag", "evo1-enzuigiri"],
    signatures:["evo1-iyo-moonstomp","evo1-iyo-over-the-moonsault"], archetype:"agility-combo",
    ability:{id:"genius-of-the-sky",name:"Genius of the Sky",text:"The first 2 times IYO connects a second Agility Move in one Control sequence, gain +1 Attitude.",passive:{iyoCombo:true}}
  },
  paige: {
    id:"paige", name:"Paige", nickname:"The Anti-Diva", hp:60, setId:"evolution-series-1",
    cardId:"superstar-paige", entranceId:"evo1-entrance-paige",
    leadOffIds: ["momentum-technical", "momentum-strike", "hof1-forearm", "evo1-arm-drag", "evo1-paige-superkick"],
    signatures:["evo1-paige-ram-paige","evo1-paige-pto","evo1-paige-turner"], archetype:"technical-counter",
    ability:{id:"this-is-my-house",name:"This Is My House",text:"The first 2 successful Counters gain +1 Attitude; the first Counter against a cost-7+ Move also draws 1.",trigger:"ON_COUNTER_SUCCESS",maxUses:2,effects:[{type:"gainMomentum",method:"attitude",amount:1}]}
  },
  stephanieVaquer: {
    id:"stephanie-vaquer", name:"Stephanie Vaquer", nickname:"La Primera", hp:60, setId:"evolution-series-1",
    cardId:"superstar-stephanie-vaquer", entranceId:"evo1-entrance-stephanie-vaquer",
    leadOffIds: ["momentum-technical", "momentum-strike", "evo1-vaquer-headbutt", "evo1-arm-drag", "hof1-forearm"],
    signatures:["evo1-vaquer-backbreaker","evo1-vaquer-svb","evo1-vaquer-devils-kiss"], archetype:"method-transition",
    ability:{id:"la-primera",name:"La Primera",text:"The first 2 times Stephanie changes Move method during a Control sequence, gain +1 Attitude. The first such change also draws 1 page.",passive:{methodCombo:true}}
  },
  theRock: {
    id:"the-rock", name:"The Rock", nickname:"The Final Boss", hp:66, setId:"season-1-final-boss", era:"final-boss",
    cardId:"superstar-the-rock", entranceId:"s1rock-entrance-final-boss",
    leadOffIds: ["momentum-strength", "momentum-strike", "s1rock-final-boss-punches", "s1rock-body-slam", "s1rock-final-boss-slap"],
    signatures:["s1rock-final-boss-spinebuster","s1rock-rock-bottom-final-boss","s1rock-peoples-elbow-final-boss"], archetype:"resource-control", seasonExclusive:true,
    ability:{id:"the-final-boss",name:"The Final Boss",text:"The first 2 times Rock connects a cost-7+ Move, opponent loses 1 Attitude; if already at 0, Rock gains +1 Attitude. Draw 1 page.",trigger:"ON_MOVE_CONNECTED",maxUses:2,when:{minCost:7},effects:[{type:"loseMomentum",target:"opponent",method:"attitude",amount:1},{type:"draw",amount:1}]}
  }

};
