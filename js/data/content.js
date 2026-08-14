export const allGameplayCards = [
  {
    "id": "cody-rhodes-dropdown-uppercut",
    "name": "Dropdown Uppercut",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 1,
    "damage": 3,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "cody-rhodes",
    "rarity": 1,
    "rulesText": "Cody-exclusive. Fast opening strike.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "dropkick",
    "name": "Dropkick",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 2,
    "damage": 3,
    "requirements": {
      "agility": 1
    },
    "moveType": "strike",
    "method": "agility",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Opponent becomes grounded.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "knee-drop",
    "name": "Knee Drop",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Grounded opponent only. Opponent ditches 1.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "discardOpponent",
        "amount": 1
      }
    ],
    "tacticalType": "standing-above"
  },
  {
    "id": "russian-leg-sweep",
    "name": "Russian Leg Sweep",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 3,
    "damage": 4,
    "requirements": {
      "technical": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Grounds opponent; opponent ditches 1.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "discardOpponent",
        "amount": 1
      }
    ]
  },
  {
    "id": "cody-rhodes-bionic-elbow",
    "name": "Bionic Elbow",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "cody-rhodes",
    "rarity": 1,
    "rulesText": "Gain +1 additional Attitude on connect.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "gainAdrenaline",
        "amount": 1
      }
    ]
  },
  {
    "id": "vertical-suplex",
    "name": "Vertical Suplex",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "technical": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "diving-crossbody",
    "name": "Diving Crossbody",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "agility": 1
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "snap-powerslam",
    "name": "Snap Powerslam",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "technical": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Grounds opponent; draw 1.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "bulldog",
    "name": "Bulldog",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "technical": 2
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent; opponent ditches 1.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "gourdbuster",
    "name": "Gourdbuster",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "technical": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "suicide-dive",
    "name": "Suicide Dive",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 7,
    "requirements": {
      "agility": 2
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Cody takes 2 damage after it connects.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 2,
    "effects": []
  },
  {
    "id": "cody-rhodes-disaster-kick",
    "name": "Disaster Kick",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 9,
    "requirements": {
      "strike": 1,
      "agility": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "cody-rhodes",
    "rarity": 2,
    "rulesText": "Cody-exclusive. Gain +1 additional Attitude.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "alabama-slam",
    "name": "Alabama Slam",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 6,
    "damage": 10,
    "requirements": {
      "technical": 2
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "missile-dropkick",
    "name": "Missile Dropkick",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 6,
    "damage": 9,
    "requirements": {
      "agility": 2
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds and Stuns opponent for 1.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "figure-four-leglock",
    "name": "Figure-Four Leglock",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 6,
    "damage": 3,
    "requirements": {
      "technical": 2
    },
    "moveType": "submission",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounded opponent only; Submission + Leg pressure 4.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "legs",
      "pressure": 4
    },
    "effects": []
  },
  {
    "id": "moonsault",
    "name": "Moonsault",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 7,
    "damage": 10,
    "requirements": {
      "agility": 2
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounded opponent only.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "superplex",
    "name": "Superplex",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 7,
    "damage": 12,
    "requirements": {
      "technical": 2,
      "agility": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds/Stuns opponent; Cody takes 3 damage.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 3,
    "effects": []
  },
  {
    "id": "cody-rhodes-cody-cutter",
    "name": "Cody Cutter",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 7,
    "damage": 12,
    "requirements": {
      "technical": 1,
      "agility": 2
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "cody-rhodes",
    "rarity": 3,
    "rulesText": "Cody-exclusive Trademark. Grounds opponent; search Cross Rhodes.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Cross Rhodes"
      }
    ]
  },
  {
    "id": "cody-rhodes-cross-rhodes",
    "name": "Cross Rhodes",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "cody-rhodes",
    "rarity": 4,
    "rulesText": "Cody-exclusive Finisher. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": []
  },
  {
    "id": "punch",
    "name": "Punch",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 1,
    "damage": 3,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared fundamental",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "headbutt",
    "name": "Headbutt",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 2,
    "damage": 4,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "shoulder-tackle",
    "name": "Shoulder Tackle",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 2,
    "damage": 4,
    "requirements": {
      "strength": 1
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Ground opponent",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "throat-thrust",
    "name": "Throat Thrust",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 2,
    "damage": 4,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared; simple quick strike",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "big-boot",
    "name": "Big Boot",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "strike": 1
    },
    "moveType": "grapple",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Ground opponent",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "leaping-clothesline",
    "name": "Leaping Clothesline",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Ground opponent",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "roman-reigns-corner-clotheslines",
    "name": "Corner Clotheslines",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "roman-reigns",
    "rarity": 2,
    "rulesText": "Roman exclusive; gain +1 Adrenaline",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "roman-reigns-drive-by",
    "name": "Drive-By",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 2
    },
    "moveType": "grapple",
    "method": "strike",
    "superstarId": "roman-reigns",
    "rarity": 2,
    "rulesText": "Roman exclusive; grounded opponent only; Stun 1",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 1,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "samoan-drop",
    "name": "Samoan Drop",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 7,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Ground opponent",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "uranage",
    "name": "Uranage",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Shared; ground opponent",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "spinebuster",
    "name": "Spinebuster",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 7,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Shared; ground opponent",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "powerbomb",
    "name": "Powerbomb",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 6,
    "damage": 10,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Shared; Stun 1",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "exploder-suplex",
    "name": "Exploder Suplex",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 7,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Shared",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "tilt-a-whirl-slam",
    "name": "Tilt-a-Whirl Slam",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Shared; ground opponent",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "roman-reigns-sitout-crucifix-powerbomb",
    "name": "Sitout Crucifix Powerbomb",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 7,
    "damage": 11,
    "requirements": {
      "strength": 3
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "roman-reigns",
    "rarity": 2,
    "rulesText": "Distinct Roman career signature.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "roman-reigns-guillotine",
    "name": "Guillotine",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 7,
    "damage": 3,
    "requirements": {
      "strength": 3
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "roman-reigns",
    "rarity": 2,
    "rulesText": "Roman exclusive; strong Head submission",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "roman-reigns-superman-punch",
    "name": "Superman Punch",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 7,
    "damage": 10,
    "requirements": {
      "strike": 3
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "roman-reigns",
    "rarity": 3,
    "rulesText": "Roman exclusive Trademark; ground opponent; search Roman's Spear",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Roman's Spear"
      }
    ]
  },
  {
    "id": "roman-reigns-spear",
    "name": "Roman's Spear",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 10,
    "damage": 17,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "roman-reigns",
    "rarity": 4,
    "rulesText": "Roman-exclusive Finisher. Grounds opponent. Stun 1.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "finisher": true,
    "effects": []
  },
  {
    "id": "running-forearm",
    "name": "Running Forearm",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 2,
    "damage": 4,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Gain +1 Adrenaline on connect.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "gainAdrenaline",
        "amount": 1
      }
    ]
  },
  {
    "id": "sling-blade",
    "name": "Sling Blade",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "agility": 1
    },
    "moveType": "grapple",
    "method": "agility",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Ground opponent; draw 1.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "enzuigiri",
    "name": "Enzuigiri",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "strike": 1
    },
    "moveType": "grapple",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Clean shared strike.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "tacticalType": "leg-extended",
    "countersCardIds": [
      "short-arm-clothesline"
    ]
  },
  {
    "id": "superkick",
    "name": "Superkick",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Ground opponent. This becomes the one canonical Superkick.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "seth-rollins-turnbuckle-sto",
    "name": "Turnbuckle STO",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "technical": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "seth-rollins",
    "rarity": 1,
    "rulesText": "Seth-exclusive; ground opponent and Stun 1.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "seth-rollins-springboard-knee",
    "name": "Springboard Knee",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "agility": 2
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": "seth-rollins",
    "rarity": 2,
    "rulesText": "Ground opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "ripcord-knee",
    "name": "Ripcord Knee",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Stun 1.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "standing-shooting-star-press",
    "name": "Standing Shooting Star Press",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "agility": 2
    },
    "moveType": "grapple",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounded opponent only.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "blockbuster",
    "name": "Blockbuster",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "agility": 2
    },
    "moveType": "submission",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Ground opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "head",
      "pressure": 4
    },
    "effects": []
  },
  {
    "id": "falcon-arrow",
    "name": "Falcon Arrow",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "technical": 2
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "frog-splash",
    "name": "Frog Splash",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 6,
    "damage": 10,
    "requirements": {
      "agility": 2
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounded opponent only.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "seth-rollins-buckle-bomb",
    "name": "Buckle Bomb",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 6,
    "damage": 9,
    "requirements": {
      "technical": 2
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "seth-rollins",
    "rarity": 3,
    "rulesText": "Seth-exclusive Trademark. Ground opponent; search Curb Stomp.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Curb Stomp"
      }
    ]
  },
  {
    "id": "pedigree",
    "name": "Pedigree",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 7,
    "damage": 11,
    "requirements": {
      "technical": 2
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "seth-rollins-phoenix-splash",
    "name": "Phoenix Splash",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 8,
    "damage": 12,
    "requirements": {
      "agility": 3
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": "seth-rollins",
    "rarity": 2,
    "rulesText": "Grounded opponent only.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "seth-rollins-curb-stomp",
    "name": "Curb Stomp",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "strike",
    "method": null,
    "superstarId": "seth-rollins",
    "rarity": 4,
    "rulesText": "Seth-exclusive Finisher. Grounded opponent only.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": []
  },
  {
    "id": "roundhouse-kick",
    "name": "Roundhouse Kick",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "New shared canonical card",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "swinging-neckbreaker",
    "name": "Swinging Neckbreaker",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "technical": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Ground opponent; draw 1",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "double-underhook-backbreaker",
    "name": "Double Underhook Backbreaker",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "technical": 2
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "New shared card; +3 Back damage",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "springboard-clothesline",
    "name": "Springboard Clothesline",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 7,
    "requirements": {
      "agility": 2
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Ground opponent",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "koji-clutch",
    "name": "Koji Clutch",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 6,
    "damage": 2,
    "requirements": {
      "technical": 2
    },
    "moveType": "submission",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Submission; Head/Arm pressure 4",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "head",
      "pressure": 4
    },
    "effects": []
  },
  {
    "id": "diving-elbow-drop",
    "name": "Diving Elbow Drop",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 6,
    "damage": 10,
    "requirements": {
      "agility": 2
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounded opponent only.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "cm-punk-corner-running-knee",
    "name": "Corner Running Knee",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 6,
    "damage": 9,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "cm-punk",
    "rarity": 2,
    "rulesText": "Punk-exclusive signature; Stun 1; search Bulldog",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "cm-punk-anaconda-vise",
    "name": "Anaconda Vise",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 7,
    "damage": 4,
    "requirements": {
      "technical": 3
    },
    "moveType": "submission",
    "method": "technical",
    "superstarId": "cm-punk",
    "rarity": 3,
    "rulesText": "Punk-exclusive Trademark; grounded opponent; Head submission pressure 5",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "head",
      "pressure": 5
    },
    "trademark": true,
    "effects": []
  },
  {
    "id": "cm-punk-g-t-s",
    "name": "G.T.S.",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "cm-punk",
    "rarity": 4,
    "rulesText": "Punk-exclusive Finisher. Grounds opponent. Stun 1.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "finisher": true,
    "effects": []
  },
  {
    "id": "stomp",
    "name": "Stomp",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 2,
    "damage": 4,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "tacticalType": "standing-above"
  },
  {
    "id": "body-slam",
    "name": "Body Slam",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "strength": 1
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "front-dropkick",
    "name": "Front Dropkick",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "back-suplex",
    "name": "Back Suplex",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "strength": 1
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "gunther-gunther-s-chop",
    "name": "Gunther's Chop",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "gunther",
    "rarity": 1,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "bodyPressure",
        "bodyPart": "chest",
        "amount": 2
      }
    ]
  },
  {
    "id": "german-suplex",
    "name": "German Suplex",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 7,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "butterfly-suplex",
    "name": "Butterfly Suplex",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "gunther-burning-lariat",
    "name": "Burning Lariat",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "gunther",
    "rarity": 2,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "boston-crab",
    "name": "Boston Crab",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 1,
    "requirements": {
      "technical": 2
    },
    "moveType": "submission",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "legs",
      "pressure": 4
    },
    "effects": []
  },
  {
    "id": "last-symphony",
    "name": "Last Symphony",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 7,
    "damage": 12,
    "requirements": {
      "strength": 3
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "gunther-folding-powerbomb",
    "name": "Folding Powerbomb",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 7,
    "damage": 11,
    "requirements": {
      "strength": 3
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "gunther",
    "rarity": 2,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Gojira Clutch"
      }
    ]
  },
  {
    "id": "gunther-gojira-clutch",
    "name": "Gojira Clutch",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 9,
    "damage": 4,
    "requirements": {},
    "moveType": "submission",
    "method": null,
    "superstarId": "gunther",
    "rarity": 4,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "head",
      "pressure": 4
    },
    "effects": []
  },
  {
    "id": "double-leg-takedown",
    "name": "Double Leg Takedown",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 2,
    "damage": 3,
    "requirements": {
      "technical": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Grounds opponent",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "knee-strike",
    "name": "Knee Strike",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared canonical",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "corner-shoulder-thrusts",
    "name": "Corner Shoulder Thrusts",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "strength": 1
    },
    "moveType": "strike",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared canonical",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "ground-and-pound",
    "name": "Ground-and-Pound",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strike": 2
    },
    "moveType": "grapple",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Grounded opponent only",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "belly-to-belly-suplex",
    "name": "Belly-to-Belly Suplex",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared canonical",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": []
  },
  {
    "id": "overhead-belly-to-belly-suplex",
    "name": "Overhead Belly-to-Belly Suplex",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Distinct from regular belly-to-belly",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "lariat",
    "name": "Lariat",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Shared canonical",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "brock-lesnar-kimura-lock",
    "name": "Kimura Lock",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 7,
    "damage": 4,
    "requirements": {
      "technical": 3
    },
    "moveType": "submission",
    "method": "technical",
    "superstarId": "brock-lesnar",
    "rarity": 3,
    "rulesText": "Brock-exclusive Trademark; Arm submission pressure 5",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "arms",
      "pressure": 5
    },
    "trademark": true,
    "effects": []
  },
  {
    "id": "brock-lesnar-f-5",
    "name": "F-5",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 10,
    "damage": 17,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "brock-lesnar",
    "rarity": 4,
    "rulesText": "Brock-exclusive Finisher. Grounds opponent. Stun 1.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "finisher": true,
    "effects": []
  },
  {
    "id": "senton",
    "name": "Senton",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "agility": 1
    },
    "moveType": "grapple",
    "method": "agility",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Grounded opponent only",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "cannonball",
    "name": "Cannonball",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strike": 2
    },
    "moveType": "grapple",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "New canonical; grounds",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "fisherman-buster",
    "name": "Fisherman Buster",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "spinning-torture-rack-neckbreaker",
    "name": "Spinning Torture Rack Neckbreaker",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 6,
    "damage": 9,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "New canonical; ground + Stun 1",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "swanton-bomb",
    "name": "Swanton Bomb",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 7,
    "damage": 10,
    "requirements": {
      "agility": 2
    },
    "moveType": "grapple",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounded opponent only.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "pop-up-powerbomb",
    "name": "Pop-Up Powerbomb",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 7,
    "damage": 12,
    "requirements": {
      "strength": 3
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Major KO signature. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "kevin-owens-package-piledriver",
    "name": "Package Piledriver",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 8,
    "damage": 13,
    "requirements": {
      "strength": 3
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "kevin-owens",
    "rarity": 2,
    "rulesText": "Ground + Stun 1",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "kevin-owens-stunner",
    "name": "Stunner",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "kevin-owens",
    "rarity": 4,
    "rulesText": "Finisher. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": []
  },
  {
    "id": "reverse-elbow",
    "name": "Reverse Elbow",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "New shared canonical",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "running-uppercut",
    "name": "Running Uppercut",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "New shared canonical",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "chokeslam",
    "name": "Chokeslam",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 5,
    "damage": 9,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "New canonical shared Chokeslam",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "gorilla-press-slam",
    "name": "Gorilla Press Slam",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 6,
    "damage": 9,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Shared canonical",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": []
  },
  {
    "id": "oba-femi-one-handed-backbreaker",
    "name": "One-Handed Backbreaker",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 6,
    "damage": 10,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "oba-femi",
    "rarity": 3,
    "rulesText": "Oba-exclusive Trademark; +3 Back pressure",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": []
  },
  {
    "id": "oba-femi-fall-from-grace",
    "name": "Fall From Grace",
    "kind": "move",
    "setId": "summerslam-series-1",
    "cost": 10,
    "damage": 17,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "oba-femi",
    "rarity": 4,
    "rulesText": "Oba-exclusive Finisher.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": []
  },
  {
    "id": "kick-to-the-gut",
    "name": "Kick to the Gut",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 3,
    "damage": 4,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "If Austin connects with this, Stone Cold Stunner cannot be Countered as his immediately following Move.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "back-body-drop",
    "name": "Back Body Drop",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "strength": 1
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "New canonical shared card; grounds opponent",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "clothesline",
    "name": "Clothesline",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared canonical",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "stone-cold-steve-austin-pointed-elbow-drop",
    "name": "Pointed Elbow Drop",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "stone-cold-steve-austin",
    "rarity": 1,
    "rulesText": "Austin-exclusive; grounded opponent only",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "mounted-punches",
    "name": "Mounted Punches",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "New shared card; grounded opponent only",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "stone-cold-steve-austin-mudhole-stomps",
    "name": "Mudhole Stomps",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "stone-cold-steve-austin",
    "rarity": 2,
    "rulesText": "Austin-exclusive; grounded opponent; opponent loses 1 Adrenaline",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "stone-cold-steve-austin-lou-thesz-press",
    "name": "Lou Thesz Press",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 1,
      "strength": 1
    },
    "moveType": "grapple",
    "method": "strike",
    "superstarId": "stone-cold-steve-austin",
    "rarity": 3,
    "rulesText": "Austin-exclusive Trademark; ground opponent; search Mounted Punches",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Mounted Punches"
      }
    ]
  },
  {
    "id": "stone-cold-steve-austin-stone-cold-stunner",
    "name": "Stone Cold Stunner",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 9,
    "damage": 17,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "stone-cold-steve-austin",
    "rarity": 4,
    "rulesText": "Austin-exclusive Finisher. If Austin connected with Kick to the Gut as his immediately previous Move, this cannot be Countered.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "finisher": true,
    "effects": []
  },
  {
    "id": "running-big-boot",
    "name": "Running Big Boot",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 1
    },
    "moveType": "grapple",
    "method": "strike",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Shared; ground opponent",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "sidewalk-slam",
    "name": "Sidewalk Slam",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strength": 1
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared; ground opponent",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "front-backbreaker",
    "name": "Front Backbreaker",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared; ground opponent",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "the-undertaker-snake-eyes",
    "name": "Snake Eyes",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "the-undertaker",
    "rarity": 2,
    "rulesText": "Undertaker-exclusive; next Running Big Boot this Control gets +2 Damage",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "buffNextByName",
        "name": "Big Boot",
        "damage": 2
      }
    ]
  },
  {
    "id": "the-undertaker-old-school",
    "name": "Old School",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "technical": 1,
      "strike": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "the-undertaker",
    "rarity": 3,
    "rulesText": "Undertaker-exclusive Trademark; ground opponent; opponent ditches 1 page",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "discardOpponent",
        "amount": 1
      }
    ]
  },
  {
    "id": "tombstone-piledriver",
    "name": "Tombstone Piledriver",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 10,
    "damage": 17,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": null,
    "rarity": 4,
    "rulesText": "Shared Finisher; ground opponent; Stun 1",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "finisher": true,
    "effects": []
  },
  {
    "id": "uppercut",
    "name": "Uppercut",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 2,
    "damage": 4,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared canonical",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "short-arm-clothesline",
    "name": "Short-Arm Clothesline",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared canonical",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "countersCardIds": [
      "big-boot"
    ]
  },
  {
    "id": "powerslam",
    "name": "Powerslam",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared canonical",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "backbreaker",
    "name": "Backbreaker",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared canonical",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "kane-two-handed-choke-lift",
    "name": "Two-Handed Choke Lift",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "kane",
    "rarity": 2,
    "rulesText": "Kane-exclusive",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "buffNextByName",
        "name": "Chokeslam From Hell",
        "damage": 1
      }
    ]
  },
  {
    "id": "flying-clothesline",
    "name": "Flying Clothesline",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "agility": 1,
      "strike": 1
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Kane signature treatment",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "kane-chokeslam-from-hell",
    "name": "Chokeslam From Hell",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 7,
    "damage": 12,
    "requirements": {
      "strength": 3
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "kane",
    "rarity": 3,
    "rulesText": "Kane-exclusive Trademark",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": []
  },
  {
    "id": "forearm-smash",
    "name": "Forearm Smash",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 2,
    "damage": 4,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "ddt",
    "name": "DDT",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "technical": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared; grounds",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "neckbreaker",
    "name": "Neckbreaker",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "technical": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared; grounds",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "piledriver",
    "name": "Piledriver",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 6,
    "damage": 9,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Shared; ground + Stun 1",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "mankind-running-knee-to-the-corner",
    "name": "Running Knee to the Corner",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "mankind",
    "rarity": 2,
    "rulesText": "Mankind-exclusive",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "mankind-double-arm-ddt",
    "name": "Double-Arm DDT",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 7,
    "damage": 11,
    "requirements": {
      "technical": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "mankind",
    "rarity": 3,
    "rulesText": "Mankind-exclusive Trademark",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": []
  },
  {
    "id": "mankind-mandible-claw",
    "name": "Mandible Claw",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 9,
    "damage": 4,
    "requirements": {},
    "moveType": "submission",
    "method": null,
    "superstarId": "mankind",
    "rarity": 4,
    "rulesText": "Mankind-exclusive Finisher; Submission",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "head",
      "pressure": 6
    },
    "finisher": true,
    "effects": []
  },
  {
    "id": "elbow-drop",
    "name": "Elbow Drop",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "tacticalType": "standing-above"
  },
  {
    "id": "atomic-drop",
    "name": "Atomic Drop",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "strength": 1
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "bearhug",
    "name": "Bearhug",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 2,
    "requirements": {
      "strength": 2
    },
    "moveType": "submission",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "head",
      "pressure": 4
    },
    "effects": []
  },
  {
    "id": "military-press-slam",
    "name": "Military Press Slam",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "hogans-big-boot",
    "name": "Hogan\u2019s Big Boot",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 6,
    "damage": 9,
    "requirements": {
      "strike": 2
    },
    "moveType": "grapple",
    "method": "strike",
    "superstarId": "hulk-hogan",
    "rarity": 2,
    "rulesText": "Hogan-exclusive Trademark. Ground opponent. On connect: search your Playbook for Atomic Leg Drop and draw it.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "search",
        "name": "Atomic Leg Drop"
      }
    ],
    "trademark": true
  },
  {
    "id": "hulk-hogan-atomic-leg-drop",
    "name": "Atomic Leg Drop",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "hulk-hogan",
    "rarity": 4,
    "rulesText": "Hogan-exclusive Finisher. Grounded opponent only.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": []
  },
  {
    "id": "double-axe-handle",
    "name": "Double Axe Handle",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "strike": 1,
      "agility": 1
    },
    "moveType": "grapple",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "ultimate-warrior-diving-shoulder-block",
    "name": "Diving Shoulder Block",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 1,
      "agility": 1
    },
    "moveType": "submission",
    "method": "strike",
    "superstarId": "ultimate-warrior",
    "rarity": 2,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "head",
      "pressure": 4
    },
    "effects": []
  },
  {
    "id": "ultimate-warrior-gorilla-press-slam",
    "name": "Warrior's Gorilla Press Slam",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 7,
    "damage": 11,
    "requirements": {
      "strength": 3
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "ultimate-warrior",
    "rarity": 2,
    "rulesText": "Warrior-exclusive Trademark. Ground opponent. On connect: search your Playbook for Warrior Splash and draw it.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Warrior Splash"
      }
    ]
  },
  {
    "id": "ultimate-warrior-warrior-splash",
    "name": "Warrior Splash",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "aerial",
    "method": null,
    "superstarId": "ultimate-warrior",
    "rarity": 4,
    "rulesText": "Warrior-exclusive Finisher. Grounded opponent only.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": []
  },
  {
    "id": "back-elbow",
    "name": "Back Elbow",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 2,
    "damage": 4,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "running-knee",
    "name": "Running Knee",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "hotshot",
    "name": "Hotshot",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "technical": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "leaping-rope-clothesline",
    "name": "Leaping Rope Clothesline",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 7,
    "requirements": {
      "strike": 1,
      "agility": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "diving-body-press",
    "name": "Diving Body Press",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "agility": 2
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "randy-savage-flying-elbow-drop",
    "name": "Flying Elbow Drop",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "aerial",
    "method": null,
    "superstarId": "randy-savage",
    "rarity": 4,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": []
  },
  {
    "id": "chop",
    "name": "Chop",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 2,
    "damage": 4,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "corner-avalanche",
    "name": "Corner Avalanche",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "andre-the-giant-double-underhook-suplex",
    "name": "Double Underhook Suplex",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "andre-the-giant",
    "rarity": 2,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": []
  },
  {
    "id": "andre-the-giant-sitdown-splash",
    "name": "Sitdown Splash",
    "kind": "move",
    "setId": "hall-of-fame-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "aerial",
    "method": null,
    "superstarId": "andre-the-giant",
    "rarity": 4,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": []
  },
  {
    "id": "northern-lights-suplex",
    "name": "Northern Lights Suplex",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "strength": 1
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "rhea-ripley-electric-chair-facebuster",
    "name": "Electric Chair Facebuster",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "rhea-ripley",
    "rarity": 2,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "rhea-ripley-reverse-alabama-slam",
    "name": "Reverse Alabama Slam",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 6,
    "damage": 10,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "rhea-ripley",
    "rarity": 2,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "razor-s-edge",
    "name": "Razor's Edge",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 7,
    "damage": 11,
    "requirements": {
      "strength": 3
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "rhea-ripley-prism-trap",
    "name": "Prism Trap",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 7,
    "damage": 3,
    "requirements": {
      "strength": 2
    },
    "moveType": "submission",
    "method": "strength",
    "superstarId": "rhea-ripley",
    "rarity": 2,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "legs",
      "pressure": 4
    },
    "trademark": true,
    "effects": []
  },
  {
    "id": "rhea-ripley-riptide",
    "name": "Riptide",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "rhea-ripley",
    "rarity": 4,
    "rulesText": "Rhea Ripley-exclusive Finisher. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": []
  },
  {
    "id": "arm-drag",
    "name": "Arm Drag",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 3,
    "damage": 4,
    "requirements": {
      "technical": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "New/shared",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "becky-lynch-diamond-dust",
    "name": "Diamond Dust",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "technical": 1,
      "agility": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "becky-lynch",
    "rarity": 2,
    "rulesText": "New shared",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "becky-lynch-diving-leg-drop",
    "name": "Diving Leg Drop",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "agility": 1
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": "becky-lynch",
    "rarity": 2,
    "rulesText": "New shared; grounded only",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "becky-lynch-dis-arm-her",
    "name": "Dis-arm-her",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 7,
    "damage": 3,
    "requirements": {
      "technical": 2
    },
    "moveType": "submission",
    "method": "technical",
    "superstarId": "becky-lynch",
    "rarity": 3,
    "rulesText": "Becky-exclusive Trademark. Arm Submission Pressure 5.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "arms",
      "pressure": 5
    },
    "trademark": true,
    "effects": []
  },
  {
    "id": "becky-lynch-manhandle-slam",
    "name": "Manhandle Slam",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "becky-lynch",
    "rarity": 4,
    "rulesText": "Becky-exclusive Finisher. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": []
  },
  {
    "id": "hurricanrana",
    "name": "Hurricanrana",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 3,
    "damage": 4,
    "requirements": {
      "agility": 1
    },
    "moveType": "grapple",
    "method": "agility",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "liv-morgan-jersey-codebreaker",
    "name": "Jersey Codebreaker",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 2
    },
    "moveType": "grapple",
    "method": "strike",
    "superstarId": "liv-morgan",
    "rarity": 3,
    "rulesText": "Liv Morgan-exclusive Trademark. Grounds opponent. Stun 1.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "trademark": true,
    "effects": []
  },
  {
    "id": "liv-morgan-oblivion",
    "name": "Oblivion",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "liv-morgan",
    "rarity": 4,
    "rulesText": "Liv Morgan-exclusive Finisher. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": []
  },
  {
    "id": "sunset-flip-powerbomb",
    "name": "Sunset Flip Powerbomb",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 7,
    "damage": 10,
    "requirements": {
      "technical": 1,
      "agility": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Shared",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "crossface",
    "name": "Crossface",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 6,
    "damage": 2,
    "requirements": {
      "technical": 2
    },
    "moveType": "submission",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "New shared submission",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "head",
      "pressure": 4
    },
    "effects": []
  },
  {
    "id": "bayley-rose-plant",
    "name": "Rose Plant",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "bayley",
    "rarity": 4,
    "rulesText": "Bayley-exclusive Finisher. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": []
  },
  {
    "id": "running-knee-strike",
    "name": "Running Knee Strike",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "middle-rope-stunner",
    "name": "Middle-Rope Stunner",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 1,
      "agility": 1
    },
    "moveType": "grapple",
    "method": "strike",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Shared/new",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "fallaway-slam",
    "name": "Fallaway Slam",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strength": 1
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "New shared",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "spear",
    "name": "Spear",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 6,
    "damage": 9,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 4,
    "rulesText": "Shared Spear. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": []
  },
  {
    "id": "charlotte-flair-natural-selection",
    "name": "Natural Selection",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 6,
    "damage": 11,
    "requirements": {
      "technical": 1,
      "agility": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "charlotte-flair",
    "rarity": 3,
    "rulesText": "Charlotte Flair-exclusive Trademark.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "discardOpponent",
        "amount": 1
      }
    ]
  },
  {
    "id": "charlotte-flair-figure-eight-leglock",
    "name": "Figure-Eight Leglock",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 10,
    "damage": 4,
    "requirements": {
      "technical": 2
    },
    "moveType": "submission",
    "method": null,
    "superstarId": "charlotte-flair",
    "rarity": 4,
    "rulesText": "Charlotte-exclusive Finisher",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "legs",
      "pressure": 5
    },
    "finisher": true,
    "effects": []
  },
  {
    "id": "paige-rope-hung-knee-strikes",
    "name": "Rope-Hung Knee Strikes",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "paige",
    "rarity": 2,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "paige-paige-turner",
    "name": "Paige Turner",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 6,
    "damage": 9,
    "requirements": {
      "strike": 1,
      "technical": 1
    },
    "moveType": "grapple",
    "method": "strike",
    "superstarId": "paige",
    "rarity": 2,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "paige-pto",
    "name": "PTO",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 7,
    "damage": 3,
    "requirements": {
      "technical": 2
    },
    "moveType": "submission",
    "method": "technical",
    "superstarId": "paige",
    "rarity": 2,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "arms",
      "pressure": 4
    },
    "trademark": true,
    "effects": []
  },
  {
    "id": "paige-ram-paige",
    "name": "Ram-Paige",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "paige",
    "rarity": 4,
    "rulesText": "",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": []
  },
  {
    "id": "dragon-screw",
    "name": "Dragon Screw",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 3,
    "damage": 4,
    "requirements": {
      "technical": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "reverse-suplex",
    "name": "Reverse Suplex",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "technical": 2
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "stephanie-vaquer-svb",
    "name": "SVB",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 7,
    "damage": 11,
    "requirements": {
      "strike": 1,
      "technical": 2
    },
    "moveType": "grapple",
    "method": "strike",
    "superstarId": "stephanie-vaquer",
    "rarity": 2,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "stephanie-vaquer-devils-kiss",
    "name": "Devil\u2019s Kiss",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 6,
    "damage": 7,
    "requirements": {
      "technical": 2
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "stephanie-vaquer",
    "rarity": 2,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "searchChoice",
        "names": [
          "SVB",
          "Vaquer Inferno"
        ]
      }
    ]
  },
  {
    "id": "stephanie-vaquer-vaquer-inferno",
    "name": "Vaquer Inferno",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "stephanie-vaquer",
    "rarity": 4,
    "rulesText": "Stephanie Vaquer-exclusive Finisher. Grounded opponent only.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": []
  },
  {
    "id": "meteora",
    "name": "Meteora",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "strike": 1,
      "agility": 1
    },
    "moveType": "grapple",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "double-stomp",
    "name": "Double Stomp",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "agility": 2
    },
    "moveType": "strike",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "loseOpponentAdrenaline",
        "amount": 1
      }
    ]
  },
  {
    "id": "iyo-sky-bullet-train-attack",
    "name": "Bullet Train Attack",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 6,
    "damage": 9,
    "requirements": {
      "strike": 1,
      "agility": 2
    },
    "moveType": "grapple",
    "method": "strike",
    "superstarId": "iyo-sky",
    "rarity": 2,
    "rulesText": "IYO SKY-exclusive Trademark. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "discountNextByName",
        "name": "Over the Moonsault",
        "amount": 1
      }
    ]
  },
  {
    "id": "iyo-sky-over-the-moonsault",
    "name": "Over the Moonsault",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "aerial",
    "method": null,
    "superstarId": "iyo-sky",
    "rarity": 4,
    "rulesText": "IYO SKY-exclusive Finisher. Grounded opponent only.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": []
  },
  {
    "id": "the-rock-final-boss-slap",
    "name": "Final Boss Slap",
    "kind": "move",
    "setId": "season-1-final-boss",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "the-rock",
    "rarity": 1,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "loseOpponentAdrenaline",
        "amount": 1
      }
    ]
  },
  {
    "id": "the-rock-belt-whip",
    "name": "Belt Whip",
    "kind": "move",
    "setId": "season-1-final-boss",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 2
    },
    "moveType": "grapple",
    "method": "strike",
    "superstarId": "the-rock",
    "rarity": 2,
    "rulesText": "",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "discardOpponent",
        "amount": 1
      },
      {
        "type": "loseOpponentAdrenaline",
        "amount": 1
      }
    ]
  },
  {
    "id": "the-rock-rock-bottom",
    "name": "Rock Bottom",
    "kind": "move",
    "setId": "season-1-final-boss",
    "cost": 8,
    "damage": 14,
    "requirements": {
      "strength": 3
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "the-rock",
    "rarity": 2,
    "rulesText": "",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "People's Elbow",
        "discount": 2
      }
    ]
  },
  {
    "id": "the-rock-people-s-elbow",
    "name": "People's Elbow",
    "kind": "move",
    "setId": "season-1-final-boss",
    "cost": 10,
    "damage": 18,
    "requirements": {},
    "moveType": "strike",
    "method": null,
    "superstarId": "the-rock",
    "rarity": 4,
    "rulesText": "The Rock-exclusive Finisher. Grounded opponent only.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": []
  },
  {
    "id": "chain-wrestling",
    "name": "Chain Wrestling",
    "kind": "move",
    "setId": "summerslam-series-1",
    "rarity": 1,
    "cost": 2,
    "damage": 0,
    "requirements": {
      "technical": 1
    },
    "moveType": "counter",
    "defensiveOnly": true,
    "counters": [
      "grapple",
      "submission"
    ],
    "rulesText": "Counter a Grapple or Submission Move."
  },
  {
    "id": "sidestep",
    "name": "Sidestep",
    "kind": "move",
    "setId": "summerslam-series-1",
    "rarity": 1,
    "cost": 2,
    "damage": 0,
    "requirements": {
      "agility": 1
    },
    "moveType": "counter",
    "defensiveOnly": true,
    "counters": [
      "grapple",
      "aerial"
    ],
    "rulesText": "Counter a Grapple or Aerial Move."
  },
  {
    "id": "duck",
    "name": "Duck",
    "kind": "move",
    "setId": "summerslam-series-1",
    "rarity": 1,
    "cost": 1,
    "damage": 0,
    "requirements": {
      "strike": 1
    },
    "moveType": "counter",
    "defensiveOnly": true,
    "counters": [
      "strike"
    ],
    "rulesText": "Counter a Strike Move."
  },
  {
    "id": "no-sell",
    "name": "No Sell",
    "kind": "move",
    "setId": "summerslam-series-1",
    "rarity": 1,
    "cost": 3,
    "damage": 0,
    "requirements": {
      "strength": 1
    },
    "moveType": "counter",
    "defensiveOnly": true,
    "counters": [
      "strike",
      "grapple"
    ],
    "rulesText": "Counter a Strike or Grapple Move dealing 7+ printed damage."
  },
  {
    "id": "shoulder-up",
    "name": "Shoulder Up",
    "kind": "special",
    "setId": "summerslam-series-1",
    "rarity": 1,
    "pinEscape": true,
    "rulesText": "Stop one Pin attempt and take Control."
  },
  {
    "id": "game-plan",
    "name": "Game Plan",
    "kind": "action",
    "setId": "summerslam-series-1",
    "rarity": 1,
    "rulesText": "Your next Move this Control sequence costs 2 less.",
    "effect": {
      "type": "discountNext",
      "amount": 2
    }
  },
  {
    "id": "got-all-of-it",
    "name": "Got All of It",
    "kind": "action",
    "setId": "summerslam-series-1",
    "rarity": 1,
    "rulesText": "Your next Move this Control sequence gets +2 damage.",
    "effect": {
      "type": "buffNext",
      "damage": 2
    }
  },
  {
    "id": "fire-up",
    "name": "Fire Up",
    "kind": "action",
    "setId": "summerslam-series-1",
    "rarity": 1,
    "rulesText": "Gain +1 Adrenaline.",
    "effect": {
      "type": "gainAdrenaline",
      "amount": 1
    }
  },
  {
    "id": "crowd-support",
    "name": "Crowd Support",
    "kind": "support",
    "setId": "summerslam-series-1",
    "rarity": 1,
    "rulesText": "Once per Control sequence after you connect with a Move, gain +1 Adrenaline.",
    "effect": {
      "type": "crowdSupport"
    }
  },
  {
    "id": "open-can",
    "name": "Open Up a Can of Whoop-Ass",
    "kind": "action",
    "setId": "summerslam-series-1",
    "rarity": 1,
    "superstarId": "stone-cold-steve-austin",
    "rulesText": "Austin\u2019s next Strike Move gets +2 damage.",
    "effect": {
      "type": "buffNextMethod",
      "method": "strike",
      "damage": 2
    }
  },
  {
    "id": "what",
    "name": "What?",
    "kind": "support",
    "setId": "summerslam-series-1",
    "rarity": 1,
    "superstarId": "stone-cold-steve-austin",
    "rulesText": "Once per match after the opponent plays an Action, they lose 1 Adrenaline.",
    "effect": {
      "type": "what"
    }
  },
  {
    "id": "people-championship",
    "name": "People's Championship",
    "kind": "support",
    "setId": "season-1-final-boss",
    "rarity": 4,
    "superstarId": "the-rock",
    "rulesText": "Once per match below 50% HP: gain +2 Adrenaline and draw 1.",
    "effect": {
      "type": "peopleChampionship"
    }
  },
  {
    "id": "manager-paul-bearer",
    "name": "Paul Bearer",
    "kind": "manager",
    "setId": "hall-of-fame-series-1",
    "rarity": 3,
    "superstarId": "the-undertaker",
    "rulesText": "Undertaker only. Once per match below 50% HP, recover a page from discard or gain +1 Strength Momentum."
  },
  {
    "id": "manager-bobby-heenan",
    "name": "Bobby Heenan",
    "kind": "manager",
    "setId": "hall-of-fame-series-1",
    "rarity": 3,
    "superstarId": "andre-the-giant",
    "rulesText": "Andr\u00e9 only. Once per match when an important Andr\u00e9 Move is Countered, protect it from being discarded and return it to hand."
  },
  {
    "id": "manager-miss-elizabeth",
    "name": "Miss Elizabeth",
    "kind": "manager",
    "setId": "hall-of-fame-series-1",
    "rarity": 3,
    "superstarId": "randy-savage",
    "rulesText": "Savage only. Once per match below 50% HP, draw 2 then put 1 page on the bottom of the Playbook."
  },
  {
    "id": "momentum-strength",
    "name": "Strength Momentum",
    "kind": "momentum",
    "setId": "summerslam-series-1",
    "rarity": 1,
    "method": "strength",
    "amount": 1,
    "rulesText": "+1 permanent Strength Momentum."
  },
  {
    "id": "momentum-strike",
    "name": "Strike Momentum",
    "kind": "momentum",
    "setId": "summerslam-series-1",
    "rarity": 1,
    "method": "strike",
    "amount": 1,
    "rulesText": "+1 permanent Strike Momentum."
  },
  {
    "id": "momentum-technical",
    "name": "Technical Momentum",
    "kind": "momentum",
    "setId": "summerslam-series-1",
    "rarity": 1,
    "method": "technical",
    "amount": 1,
    "rulesText": "+1 permanent Technical Momentum."
  },
  {
    "id": "momentum-agility",
    "name": "Agility Momentum",
    "kind": "momentum",
    "setId": "summerslam-series-1",
    "rarity": 1,
    "method": "agility",
    "amount": 1,
    "rulesText": "+1 permanent Agility Momentum."
  },
  {
    "id": "entrance-cody-rhodes",
    "name": "Adrenaline in My Soul",
    "kind": "entrance",
    "setId": "summerslam-series-1",
    "rarity": 4,
    "superstarId": "cody-rhodes",
    "rulesText": "Pre-Match: Begin with +1 Agility Momentum and +1 Adrenaline. At the start of Turn 5, gain +1 Technical Momentum.",
    "preMatchMomentum": {
      "technical": 1,
      "agility": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": true
  },
  {
    "id": "entrance-roman-reigns",
    "name": "Acknowledge Me",
    "kind": "entrance",
    "setId": "summerslam-series-1",
    "rarity": 4,
    "superstarId": "roman-reigns",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum. The first Strike Move Roman connects with gains +1 Strike Momentum. At the start of Turn 6, gain +1 Adrenaline.",
    "preMatchMomentum": {
      "strength": 1,
      "strike": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-seth-rollins",
    "name": "Burn It Down",
    "kind": "entrance",
    "setId": "summerslam-series-1",
    "rarity": 4,
    "superstarId": "seth-rollins",
    "rulesText": "Pre-Match: Begin with +1 Agility Momentum. At the start of Turn 5, draw 1 page and gain +1 Adrenaline.",
    "preMatchMomentum": {
      "agility": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": true
  },
  {
    "id": "entrance-cm-punk",
    "name": "It\u2019s Clobbering Time!",
    "kind": "entrance",
    "setId": "summerslam-series-1",
    "rarity": 4,
    "superstarId": "cm-punk",
    "rulesText": "Pre-Match: Begin with +1 Technical Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "technical": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-gunther",
    "name": "Action Over Words",
    "kind": "entrance",
    "setId": "summerslam-series-1",
    "rarity": 4,
    "superstarId": "gunther",
    "rulesText": "Pre-Match: Begin with +1 Strike Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strike": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-brock-lesnar",
    "name": "Here Comes the Pain",
    "kind": "entrance",
    "setId": "summerslam-series-1",
    "rarity": 4,
    "superstarId": "brock-lesnar",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strength": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-kevin-owens",
    "name": "Fight Owens Fight",
    "kind": "entrance",
    "setId": "summerslam-series-1",
    "rarity": 4,
    "superstarId": "kevin-owens",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strength": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-oba-femi",
    "name": "The Ruler Has Arrived",
    "kind": "entrance",
    "setId": "summerslam-series-1",
    "rarity": 4,
    "superstarId": "oba-femi",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strength": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-stone-cold-steve-austin",
    "name": "Glass Shatters",
    "kind": "entrance",
    "setId": "hall-of-fame-series-1",
    "rarity": 4,
    "superstarId": "stone-cold-steve-austin",
    "rulesText": "Pre-Match: Begin with +1 Strike Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strike": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-the-undertaker",
    "name": "Rest in Peace",
    "kind": "entrance",
    "setId": "hall-of-fame-series-1",
    "rarity": 4,
    "superstarId": "the-undertaker",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strength": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-kane",
    "name": "Hellfire and Brimstone",
    "kind": "entrance",
    "setId": "hall-of-fame-series-1",
    "rarity": 4,
    "superstarId": "kane",
    "rulesText": "Pre-Match: Begin with +1 Agility Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "agility": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-mankind",
    "name": "Boiler Room Dweller",
    "kind": "entrance",
    "setId": "hall-of-fame-series-1",
    "rarity": 4,
    "superstarId": "mankind",
    "rulesText": "Pre-Match: Begin with +1 Technical Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "technical": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-hulk-hogan",
    "name": "Real American",
    "kind": "entrance",
    "setId": "hall-of-fame-series-1",
    "rarity": 4,
    "superstarId": "hulk-hogan",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strength": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-ultimate-warrior",
    "name": "Warrior\u2019s Charge",
    "kind": "entrance",
    "setId": "hall-of-fame-series-1",
    "rarity": 4,
    "superstarId": "ultimate-warrior",
    "rulesText": "Pre-Match: Begin with +1 Agility Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "agility": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-randy-savage",
    "name": "Pomp and Circumstance",
    "kind": "entrance",
    "setId": "hall-of-fame-series-1",
    "rarity": 4,
    "superstarId": "randy-savage",
    "rulesText": "Pre-Match: Begin with +1 Technical Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "technical": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-andre-the-giant",
    "name": "The Eighth Wonder",
    "kind": "entrance",
    "setId": "hall-of-fame-series-1",
    "rarity": 4,
    "superstarId": "andre-the-giant",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strength": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-rhea-ripley",
    "name": "This Is My Brutality",
    "kind": "entrance",
    "setId": "evolution-series-1",
    "rarity": 4,
    "superstarId": "rhea-ripley",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum, +1 Strike Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strength": 1,
      "strike": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-becky-lynch",
    "name": "Straight Fire",
    "kind": "entrance",
    "setId": "evolution-series-1",
    "rarity": 4,
    "superstarId": "becky-lynch",
    "rulesText": "Pre-Match: Begin with +1 Agility Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "agility": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-liv-morgan",
    "name": "Watch Me",
    "kind": "entrance",
    "setId": "evolution-series-1",
    "rarity": 4,
    "superstarId": "liv-morgan",
    "rulesText": "Pre-Match: Begin with +1 Agility Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "agility": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-bayley",
    "name": "Role Model",
    "kind": "entrance",
    "setId": "evolution-series-1",
    "rarity": 4,
    "superstarId": "bayley",
    "rulesText": "Pre-Match: Begin with +1 Technical Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "technical": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-charlotte-flair",
    "name": "All Hail the Queen",
    "kind": "entrance",
    "setId": "evolution-series-1",
    "rarity": 4,
    "superstarId": "charlotte-flair",
    "rulesText": "Pre-Match: Begin with +1 Technical Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "technical": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-paige",
    "name": "Anti-Diva",
    "kind": "entrance",
    "setId": "evolution-series-1",
    "rarity": 4,
    "superstarId": "paige",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strength": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-stephanie-vaquer",
    "name": "The Dark Angel",
    "kind": "entrance",
    "setId": "evolution-series-1",
    "rarity": 4,
    "superstarId": "stephanie-vaquer",
    "rulesText": "Pre-Match: Begin with +1 Technical Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "technical": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-iyo-sky",
    "name": "Tokyo Shock",
    "kind": "entrance",
    "setId": "evolution-series-1",
    "rarity": 4,
    "superstarId": "iyo-sky",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strength": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "entrance-the-rock",
    "name": "Final Boss",
    "kind": "entrance",
    "setId": "season-1-final-boss",
    "rarity": 4,
    "superstarId": "the-rock",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum, +1 Strike Momentum and +2 Adrenaline.",
    "preMatchMomentum": {
      "strength": 1,
      "strike": 1
    },
    "preMatchAdrenaline": 2,
    "delayedTurn5": false
  },
  {
    "id": "special-cody-rhodes",
    "name": "Finish the Story",
    "kind": "special",
    "setId": "summerslam-series-1",
    "rarity": 3,
    "superstarId": "cody-rhodes",
    "rulesText": "Once per match when Cody gains Control at 30% HP or less: draw 1, gain +1 Adrenaline, then search Cody Cutter or Cross Rhodes.",
    "special": {
      "type": "lowHpTutor",
      "hpPct": 0.3,
      "draw": 1,
      "adrenaline": 1,
      "names": [
        "Cody Cutter",
        "Cross Rhodes"
      ]
    }
  },
  {
    "id": "special-roman-reigns",
    "name": "Tribal Chief",
    "kind": "special",
    "setId": "summerslam-series-1",
    "rarity": 3,
    "superstarId": "roman-reigns",
    "rulesText": "Once per match immediately after Roman loses Control: regain Control.",
    "special": {
      "type": "regainAfterLoseControl"
    }
  },
  {
    "id": "special-seth-rollins",
    "name": "The Visionary",
    "kind": "special",
    "setId": "summerslam-series-1",
    "rarity": 3,
    "superstarId": "seth-rollins",
    "rulesText": "Once per match after Seth successfully Counters a Move, immediately begin an offensive Control window without advancing the turn.",
    "special": {
      "type": "counterKeepSequence"
    }
  },
  {
    "id": "special-cm-punk",
    "name": "Best in the World",
    "kind": "special",
    "setId": "summerslam-series-1",
    "rarity": 3,
    "superstarId": "cm-punk",
    "rulesText": "Once per match when Punk is being pinned: stop the Pin and take Control.",
    "special": {
      "type": "pinEscape"
    }
  },
  {
    "id": "special-gunther",
    "name": "The Mat Is Sacred",
    "kind": "special",
    "setId": "summerslam-series-1",
    "rarity": 3,
    "superstarId": "gunther",
    "rulesText": "Once per match after Gunther successfully Counters: opponent loses 2 Adrenaline and cannot play an Action until committing another Move.",
    "special": {
      "type": "counterDrainActionLock",
      "amount": 2
    }
  },
  {
    "id": "special-brock-lesnar",
    "name": "The Beast Incarnate",
    "kind": "special",
    "setId": "summerslam-series-1",
    "rarity": 3,
    "superstarId": "brock-lesnar",
    "rulesText": "Once per match when Brock would take 10+ damage from a single Move: reduce it by 5 and gain +1 Strength Momentum.",
    "special": {
      "type": "reduceIncomingBig",
      "minDamage": 10,
      "reduce": 5,
      "methodMomentum": "strength"
    }
  },
  {
    "id": "special-kevin-owens",
    "name": "Welcome to the KO Show",
    "kind": "special",
    "setId": "summerslam-series-1",
    "rarity": 3,
    "superstarId": "kevin-owens",
    "rulesText": "Once per match when the opponent plays an Action or Support: cancel it and take Control.",
    "special": {
      "type": "cancelOpponentUtility"
    }
  },
  {
    "id": "special-oba-femi",
    "name": "The Destroyer",
    "kind": "special",
    "setId": "summerslam-series-1",
    "rarity": 3,
    "superstarId": "oba-femi",
    "rulesText": "Once per match after Oba connects with a Strength Move, his next non-Finisher Strength Move in that Control sequence cannot be Countered.",
    "special": {
      "type": "nextStrengthUncounterable"
    }
  },
  {
    "id": "special-stone-cold-steve-austin",
    "name": "Austin 3:16",
    "kind": "special",
    "setId": "hall-of-fame-series-1",
    "rarity": 3,
    "superstarId": "stone-cold-steve-austin",
    "rulesText": "Once per match after Austin successfully Counters a Move, search your Playbook for a Strike Move costing C5 or less.",
    "special": {
      "type": "counterTutorStrike",
      "maxCost": 5
    }
  },
  {
    "id": "special-the-undertaker",
    "name": "The Deadman Rises",
    "kind": "special",
    "setId": "hall-of-fame-series-1",
    "rarity": 3,
    "superstarId": "the-undertaker",
    "rulesText": "Once per match after Undertaker kicks out of a pin, immediately take Control and gain +1 Adrenaline.",
    "special": {
      "type": "kickoutControlAdrenaline",
      "amount": 1
    }
  },
  {
    "id": "special-kane",
    "name": "Rise From the Flames",
    "kind": "special",
    "setId": "hall-of-fame-series-1",
    "rarity": 3,
    "superstarId": "kane",
    "rulesText": "Once per match when Kane would become Stunned, ignore that Stun and gain +1 Adrenaline.",
    "special": {
      "type": "ignoreStun",
      "adrenaline": 1
    }
  },
  {
    "id": "special-mankind",
    "name": "Mr. Socko",
    "kind": "special",
    "setId": "hall-of-fame-series-1",
    "rarity": 3,
    "superstarId": "mankind",
    "rulesText": "Once per match when Mankind gains Control while the opponent is grounded, activate Mr. Socko; Mandible Claw gains +2 pressure this Control sequence.",
    "special": {
      "type": "socko"
    }
  },
  {
    "id": "special-hulk-hogan",
    "name": "Hulk Up",
    "kind": "special",
    "setId": "hall-of-fame-series-1",
    "rarity": 3,
    "superstarId": "hulk-hogan",
    "rulesText": "Once per match when Hogan gains Control at 50% HP or less: clear Stun, gain +2 Adrenaline and his next Hogan\u2019s Big Boot this Control cannot be Countered by a Move.",
    "special": {
      "type": "hulkUp"
    }
  },
  {
    "id": "special-ultimate-warrior",
    "name": "Shake the Ropes",
    "kind": "special",
    "setId": "hall-of-fame-series-1",
    "rarity": 3,
    "superstarId": "ultimate-warrior",
    "rulesText": "Once per match after Warrior loses Control at 50% HP or less, gain +2 Adrenaline; the next time he gains Control, clear Stun.",
    "special": {
      "type": "shakeRopes"
    }
  },
  {
    "id": "special-randy-savage",
    "name": "Oh Yeah!",
    "kind": "special",
    "setId": "hall-of-fame-series-1",
    "rarity": 3,
    "superstarId": "randy-savage",
    "rulesText": "Once per match after Savage successfully Counters, his next Agility Move this Control sequence costs 2 less.",
    "special": {
      "type": "counterDiscountMethod",
      "method": "agility",
      "amount": 2
    }
  },
  {
    "id": "special-andre-the-giant",
    "name": "Nobody Slams Andr\u00e9",
    "kind": "special",
    "setId": "hall-of-fame-series-1",
    "rarity": 3,
    "superstarId": "andre-the-giant",
    "rulesText": "Once per match when an opponent Strength Move would ground Andr\u00e9: he remains standing and gains +1 Adrenaline.",
    "special": {
      "type": "nobodySlams"
    }
  },
  {
    "id": "special-rhea-ripley",
    "name": "Brutality",
    "kind": "special",
    "setId": "evolution-series-1",
    "rarity": 3,
    "superstarId": "rhea-ripley",
    "rulesText": "Once per match after Rhea connects with Headbutt, her next Riptide this Control sequence costs 2 less.",
    "special": {
      "type": "headbuttDiscount",
      "name": "Riptide",
      "amount": 2
    }
  },
  {
    "id": "special-becky-lynch",
    "name": "Tap or Snap",
    "kind": "special",
    "setId": "evolution-series-1",
    "rarity": 3,
    "superstarId": "becky-lynch",
    "rulesText": "Once per match after Becky successfully Counters, her next Dis-arm-her this Control sequence costs 2 less.",
    "special": {
      "type": "counterDiscountNamed",
      "name": "Dis-arm-her",
      "amount": 2
    }
  },
  {
    "id": "special-liv-morgan",
    "name": "Revenge Tour",
    "kind": "special",
    "setId": "evolution-series-1",
    "rarity": 3,
    "superstarId": "liv-morgan",
    "rulesText": "Once per match after Liv successfully Counters, her next Jersey Codebreaker this Control sequence costs 2 less.",
    "special": {
      "type": "counterDiscountNamed",
      "name": "Jersey Codebreaker",
      "amount": 2
    }
  },
  {
    "id": "special-bayley",
    "name": "Veteran Instincts",
    "kind": "special",
    "setId": "evolution-series-1",
    "rarity": 3,
    "superstarId": "bayley",
    "rulesText": "Once per match after Bayley successfully Counters, draw 1 page and immediately take Control.",
    "special": {
      "type": "counterDrawControl",
      "draw": 1
    }
  },
  {
    "id": "special-charlotte-flair",
    "name": "Wooo!",
    "kind": "special",
    "setId": "evolution-series-1",
    "rarity": 3,
    "superstarId": "charlotte-flair",
    "rulesText": "Once per match after Charlotte connects with Flair Chop, draw 1 page and gain +2 Adrenaline.",
    "special": {
      "type": "flairChopWooo",
      "afterName": "Flair Chop",
      "draw": 1,
      "adrenaline": 2
    }
  },
  {
    "id": "special-paige",
    "name": "This Is My House",
    "kind": "special",
    "setId": "evolution-series-1",
    "rarity": 3,
    "superstarId": "paige",
    "rulesText": "Once per match after Paige successfully Counters, choose Paige Turner or PTO in hand; it costs 2 less this Control sequence.",
    "special": {
      "type": "counterChooseDiscount",
      "names": [
        "Paige Turner",
        "PTO"
      ],
      "amount": 2
    }
  },
  {
    "id": "special-stephanie-vaquer",
    "name": "Sin Piedad",
    "kind": "special",
    "setId": "evolution-series-1",
    "rarity": 3,
    "superstarId": "stephanie-vaquer",
    "rulesText": "Once per match after Vaquer successfully Counters, her next non-Finisher Technical Move this Control sequence cannot be Countered by a Move.",
    "special": {
      "type": "counterUncounterableMethod",
      "method": "technical"
    }
  },
  {
    "id": "special-iyo-sky",
    "name": "Take Flight",
    "kind": "special",
    "setId": "evolution-series-1",
    "rarity": 3,
    "superstarId": "iyo-sky",
    "rulesText": "Once per match after IYO successfully Counters, her next non-Finisher Agility Move this Control sequence cannot be Countered by a Move.",
    "special": {
      "type": "counterUncounterableMethod",
      "method": "agility"
    }
  },
  {
    "id": "special-the-rock",
    "name": "Bloodline Rules",
    "kind": "special",
    "setId": "season-1-final-boss",
    "rarity": 3,
    "superstarId": "the-rock",
    "rulesText": "Once per match after one of Rock\u2019s non-Finisher Moves is Countered: the Counter resolves, but Rock retains Control, draws 1 and the opponent loses 1 Adrenaline.",
    "special": {
      "type": "retainOnCounter",
      "draw": 1,
      "opponentAdrenaline": -1
    }
  },
  {
    "id": "running-powerslam",
    "name": "Running Powerslam",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent. Stun 1.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "standing-moonsault",
    "name": "Standing Moonsault",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 5,
    "damage": 6,
    "requirements": {
      "agility": 2
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounded opponent only. If the opponent kicks out, remain in Control and draw 1 page.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "kickoutRetainControlDraw": 1,
    "effects": []
  },
  {
    "id": "flipping-lariat",
    "name": "Flipping Lariat",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "agility": 1,
      "strike": 1
    },
    "moveType": "strike",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent. If another Move already connected this Control sequence, +2 Damage.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "priorMoveBonusDamage": 2,
    "effects": []
  },
  {
    "id": "450-splash",
    "name": "450 Splash",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 7,
    "damage": 11,
    "requirements": {
      "agility": 3
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 3,
    "rulesText": "Grounded opponent only. If Countered, you are Stunned for 1.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "selfStunIfCountered": 1,
    "effects": []
  },
  {
    "id": "asai-moonsault",
    "name": "Asai Moonsault",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 6,
    "damage": 9,
    "requirements": {
      "agility": 3
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 3,
    "rulesText": "Opponent ditches 1 page. If Countered, you are Stunned for 1.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "selfStunIfCountered": 1,
    "effects": [
      {
        "type": "discardOpponent",
        "amount": 1
      }
    ]
  },
  {
    "id": "springboard-crossbody",
    "name": "Springboard Crossbody",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 5,
    "damage": 7,
    "requirements": {
      "agility": 2
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent. If it connects after a Strike Move in the same Control sequence, draw 2 pages, then ditch 1 page.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "drawThenDiscardSelf",
        "draw": 2,
        "discard": 1,
        "ifAfterMethod": "strike"
      }
    ]
  },
  {
    "id": "logan-paul-knockout-punch",
    "name": "Knockout Punch",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 7,
    "damage": 11,
    "requirements": {
      "strike": 3
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "logan-paul",
    "rarity": 3,
    "rulesText": "Logan Paul-exclusive Trademark. Stun 1.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "trademark": true,
    "effects": []
  },
  {
    "id": "logan-paul-paulverizer",
    "name": "Paulverizer",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 9,
    "damage": 13,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "logan-paul",
    "rarity": 4,
    "rulesText": "Logan Paul-exclusive Finisher. No Method requirement. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": []
  },
  {
    "id": "entrance-logan-paul",
    "name": "The Maverick",
    "kind": "entrance",
    "setId": "raw-series-1",
    "rarity": 4,
    "superstarId": "logan-paul",
    "rulesText": "Pre-Match: Begin with +1 Agility Momentum, +1 Strength Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "agility": 1,
      "strength": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-logan-paul",
    "name": "Brass Knuckles",
    "kind": "special",
    "setId": "raw-series-1",
    "rarity": 3,
    "superstarId": "logan-paul",
    "rulesText": "Once per match, after Logan connects with a Strike Move, play this card. That Move deals +2 Damage and gains Stun 1. After it resolves, end the current Control sequence.",
    "special": {
      "type": "brassKnuckles",
      "bonusDamage": 2,
      "stun": 1,
      "requireMethod": "strike",
      "endControl": true
    }
  },
  {
    "id": "stf",
    "name": "STF",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 5,
    "damage": 6,
    "requirements": {
      "technical": 2
    },
    "moveType": "submission",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounded opponent only. Submission. On connect, opponent loses 1 Adrenaline.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "legs",
      "pressure": 4
    },
    "effects": [
      {
        "type": "loseOpponentAdrenaline",
        "amount": 1
      }
    ]
  },
  {
    "id": "sol-ruca-avalanche-x-factor",
    "name": "Avalanche X-Factor",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 6,
    "damage": 11,
    "requirements": {
      "agility": 2,
      "strength": 1
    },
    "moveType": "grapple",
    "method": "agility",
    "superstarId": "sol-ruca",
    "rarity": 3,
    "rulesText": "Sol Ruca-exclusive Trademark. Grounds opponent. Stun 1. If Sol connected with an Agility Move immediately before this card in the same Control sequence, +2 Damage.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "trademark": true,
    "priorConnectedMethodBonus": {
      "method": "agility",
      "damage": 2
    },
    "effects": []
  },
  {
    "id": "sol-ruca-sol-snatcher",
    "name": "Sol Snatcher",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "sol-ruca",
    "rarity": 4,
    "rulesText": "Sol Ruca-exclusive Finisher. No Method requirement. Grounds opponent. If Sol successfully Countered a Move earlier during this Control sequence, costs 2 less.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "discountAfterCounter": 2,
    "effects": []
  },
  {
    "id": "entrance-sol-ruca",
    "name": "Good Vibes",
    "kind": "entrance",
    "setId": "raw-series-1",
    "rarity": 4,
    "superstarId": "sol-ruca",
    "rulesText": "Pre-Match: Begin with +1 Agility Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "agility": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-sol-ruca",
    "name": "No Wipeout",
    "kind": "special",
    "setId": "raw-series-1",
    "rarity": 3,
    "superstarId": "sol-ruca",
    "rulesText": "Once per match, when one of Sol's Agility Moves is Countered, prevent any Stun applied to Sol by that card's if-Countered effect and draw 1 page.",
    "special": {
      "type": "noWipeout",
      "draw": 1,
      "method": "agility"
    }
  },
  {
    "id": "chad-gable-chaos-theory",
    "name": "Chaos Theory",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 7,
    "damage": 11,
    "requirements": {
      "technical": 2,
      "strength": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "chad-gable",
    "rarity": 3,
    "rulesText": "Chad Gable-exclusive Trademark. Grounds opponent. If the opponent kicks out, remain in Control.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "kickoutRetainControl": true,
    "effects": []
  },
  {
    "id": "chad-gable-ankle-lock",
    "name": "Ankle Lock",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 9,
    "damage": 4,
    "requirements": {},
    "moveType": "submission",
    "method": null,
    "superstarId": "chad-gable",
    "rarity": 4,
    "rulesText": "Chad Gable-exclusive Finisher. No Method requirement. Grounded opponent only. Submission, Leg Pressure 6. On connect, opponent loses 1 Adrenaline.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "submission": {
      "bodyPart": "legs",
      "pressure": 6
    },
    "effects": [
      {
        "type": "loseOpponentAdrenaline",
        "amount": 1
      }
    ]
  },
  {
    "id": "entrance-chad-gable",
    "name": "Ready, Willing and Gable",
    "kind": "entrance",
    "setId": "raw-series-1",
    "rarity": 4,
    "superstarId": "chad-gable",
    "rulesText": "Pre-Match: Begin with +1 Technical Momentum, +1 Agility Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "technical": 1,
      "agility": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-chad-gable",
    "name": "Shoosh!",
    "kind": "special",
    "setId": "raw-series-1",
    "rarity": 3,
    "superstarId": "chad-gable",
    "rulesText": "Once per match, after one of Chad\u2019s Moves is successfully Countered, draw 1 page and the opponent loses 2 Adrenaline.",
    "special": {
      "type": "moveCounteredDrawDrain",
      "draw": 1,
      "opponentAdrenaline": -2
    }
  },
  {
    "id": "raquel-rodriguez-corkscrew-splash",
    "name": "Corkscrew Splash",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 8,
    "damage": 11,
    "requirements": {
      "strength": 2,
      "agility": 1
    },
    "moveType": "aerial",
    "method": "strength",
    "superstarId": "raquel-rodriguez",
    "rarity": 3,
    "rulesText": "Raquel Rodriguez-exclusive Trademark. Grounded opponent only. If Countered, Raquel is Stunned 1.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "selfStunIfCountered": 1,
    "trademark": true,
    "effects": []
  },
  {
    "id": "raquel-rodriguez-tejana-bomb",
    "name": "Tejana Bomb",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 11,
    "damage": 13,
    "requirements": {},
    "moveType": "powerbomb",
    "method": null,
    "superstarId": "raquel-rodriguez",
    "rarity": 4,
    "rulesText": "Raquel Rodriguez-exclusive Finisher. No Method requirement. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": []
  },
  {
    "id": "entrance-raquel-rodriguez",
    "name": "Big Mami Cool",
    "kind": "entrance",
    "setId": "raw-series-1",
    "rarity": 4,
    "superstarId": "raquel-rodriguez",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum, +1 Agility Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strength": 1,
      "agility": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-raquel-rodriguez",
    "name": "Judgment Day Backup",
    "kind": "special",
    "setId": "raw-series-1",
    "rarity": 3,
    "superstarId": "raquel-rodriguez",
    "rulesText": "Once per match, when Raquel would take 8+ Damage from a Move, reduce that Damage by 1.",
    "special": {
      "type": "reduceIncomingBig",
      "minDamage": 8,
      "reduce": 1
    }
  },
  {
    "id": "tilt-a-whirl-headscissors",
    "name": "Tilt-a-Whirl Headscissors",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "agility": 1,
      "technical": 1
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent. Counters Grapple Moves. If used to successfully Counter a Grapple Move, draw 1 page.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "counters": [
      "grapple"
    ],
    "drawOnCounterTypes": [
      "grapple"
    ],
    "drawOnCounter": 1,
    "effects": []
  },
  {
    "id": "619",
    "name": "619",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 6,
    "damage": 9,
    "requirements": {
      "agility": 2,
      "strike": 1
    },
    "moveType": "strike",
    "method": "agility",
    "superstarId": null,
    "allowedSuperstarIds": [
      "rey-mysterio",
      "dominik-mysterio"
    ],
    "rarity": 3,
    "rulesText": "Mysterio family only (Rey Mysterio or Dominik Mysterio). Grounded opponent only. Stun 1. When Rey connects, search/draw West Coast Pop and it costs 2 less this Control sequence. When Dominik connects, search/draw Dominik\u2019s Frog Splash and it costs 2 less this Control sequence.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 1,
    "selfDamage": 0,
    "effects": [
      {
        "type": "search",
        "name": "West Coast Pop",
        "discount": 2,
        "ifSuperstarIds": [
          "rey-mysterio"
        ]
      },
      {
        "type": "search",
        "name": "Dominik\u2019s Frog Splash",
        "discount": 2,
        "ifSuperstarIds": [
          "dominik-mysterio"
        ]
      }
    ]
  },
  {
    "id": "rey-mysterio-mysterio-express",
    "name": "Mysterio Express",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 6,
    "damage": 8,
    "requirements": {
      "agility": 2,
      "technical": 1
    },
    "moveType": "grapple",
    "method": "agility",
    "superstarId": "rey-mysterio",
    "rarity": 3,
    "rulesText": "Rey Mysterio-exclusive Trademark. Grounds opponent. Draw 1 page on connect. If the opponent kicks out, remain in Control.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "kickoutRetainControl": true,
    "effects": [
      {
        "type": "drawSelf",
        "amount": 1
      }
    ]
  },
  {
    "id": "rey-mysterio-west-coast-pop",
    "name": "West Coast Pop",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 9,
    "damage": 15,
    "requirements": {},
    "moveType": "aerial",
    "method": null,
    "superstarId": "rey-mysterio",
    "rarity": 4,
    "rulesText": "Rey Mysterio-exclusive Finisher. No Method requirement. Grounded opponent only. If played immediately after 619 in the same Control sequence, +2 Damage.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "bonusDamageAfterNamed": {
      "name": "619",
      "damage": 2
    }
  },
  {
    "id": "entrance-rey-mysterio",
    "name": "Booyaka 619",
    "kind": "entrance",
    "setId": "worlds-collide-series-1",
    "rarity": 4,
    "superstarId": "rey-mysterio",
    "rulesText": "Pre-Match: Begin with +1 Agility Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "agility": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-rey-mysterio",
    "name": "Lucha Libre Legend",
    "kind": "special",
    "setId": "worlds-collide-series-1",
    "rarity": 3,
    "superstarId": "rey-mysterio",
    "rulesText": "Once per match, after Rey successfully Counters an opponent's Move with an Agility counter-attack, that counter-attack deals +3 Damage and Rey retains Control after it resolves.",
    "special": {
      "type": "luchaLibreLegend",
      "method": "agility",
      "bonusDamage": 3,
      "retainControl": true
    }
  },
  {
    "id": "drop-toe-hold",
    "name": "Drop Toe Hold",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 3,
    "damage": 4,
    "requirements": {
      "technical": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "low-blow",
    "name": "Low Blow",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 4,
    "damage": 5,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Stun 1. Opponent loses 1 Adrenaline.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "effects": [
      {
        "type": "loseOpponentAdrenaline",
        "amount": 1
      }
    ]
  },
  {
    "id": "three-amigos",
    "name": "Three Amigos",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 7,
    "damage": 10,
    "requirements": {
      "technical": 2,
      "strength": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 3,
    "rulesText": "Grounds opponent. On connect, gain +2 Adrenaline.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "gainAdrenaline",
        "amount": 2
      }
    ]
  },
  {
    "id": "dominik-mysterio-frog-splash",
    "name": "Dominik\u2019s Frog Splash",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 9,
    "damage": 15,
    "requirements": {},
    "moveType": "aerial",
    "method": null,
    "superstarId": "dominik-mysterio",
    "rarity": 4,
    "rulesText": "Dominik Mysterio-exclusive Finisher. No Method requirement. Grounded opponent only. If played immediately after 619 in the same Control sequence, +1 Damage.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "bonusDamageAfterNamed": {
      "name": "619",
      "damage": 1
    }
  },
  {
    "id": "entrance-dominik-mysterio",
    "name": "Dirty Dom",
    "kind": "entrance",
    "setId": "worlds-collide-series-1",
    "rarity": 4,
    "superstarId": "dominik-mysterio",
    "rulesText": "Pre-Match: Begin with +1 Agility Momentum, +1 Strength Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "agility": 1,
      "strength": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-dominik-mysterio",
    "name": "Hammer in the Boot",
    "kind": "special",
    "setId": "worlds-collide-series-1",
    "rarity": 3,
    "superstarId": "dominik-mysterio",
    "rulesText": "Once per match, after one of Dominik\u2019s Moves is successfully Countered, the opponent loses 2 Adrenaline. After that Counter resolves, Dominik regains Control.",
    "special": {
      "type": "hammerInBoot",
      "opponentAdrenaline": -2,
      "regainControl": true
    }
  },
  {
    "id": "backstabber",
    "name": "Backstabber",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 5,
    "damage": 7,
    "requirements": {
      "agility": 1,
      "technical": 1
    },
    "moveType": "grapple",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent. Counters Aerial Moves. When used as a successful Counter to an Aerial Move, +2 Damage.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "counters": [
      "aerial"
    ],
    "counterBonusDamage": 2,
    "effects": []
  },
  {
    "id": "tope-con-hilo",
    "name": "Tope con Hilo",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 6,
    "damage": 9,
    "requirements": {
      "agility": 3
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Playable in-ring. Draw 1 page on connect. If Countered, attacker is Stunned 1.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "selfStunIfCountered": 1,
    "effects": [
      {
        "type": "drawSelf",
        "amount": 1
      }
    ]
  },
  {
    "id": "penta-the-sacrifice",
    "name": "The Sacrifice",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 5,
    "damage": 7,
    "requirements": {
      "technical": 2
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "penta",
    "rarity": 3,
    "rulesText": "Penta-exclusive. Stun 1. Opponent loses 1 Adrenaline. On connect, search/draw Penta Driver; that searched Penta Driver costs 1 less during this Control sequence.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "effects": [
      {
        "type": "loseOpponentAdrenaline",
        "amount": 1
      },
      {
        "type": "search",
        "name": "Penta Driver",
        "discount": 1
      }
    ]
  },
  {
    "id": "penta-driver",
    "name": "Penta Driver",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 7,
    "damage": 12,
    "requirements": {
      "technical": 2,
      "strength": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "penta",
    "rarity": 3,
    "rulesText": "Penta-exclusive Trademark. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": []
  },
  {
    "id": "penta-mexican-destroyer",
    "name": "Mexican Destroyer",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "penta",
    "rarity": 4,
    "rulesText": "Penta-exclusive Finisher. No Method requirement. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": []
  },
  {
    "id": "entrance-penta",
    "name": "Cero Miedo",
    "kind": "entrance",
    "setId": "worlds-collide-series-1",
    "rarity": 4,
    "superstarId": "penta",
    "rulesText": "Pre-Match: Begin with +1 Agility Momentum, +1 Strength Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "agility": 1,
      "strength": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-penta",
    "name": "Fearless Assault",
    "kind": "special",
    "setId": "worlds-collide-series-1",
    "rarity": 3,
    "superstarId": "penta",
    "rulesText": "Once per match, after Penta connects with an Agility Move, his next Move this Control sequence, if it is a Strike, costs 2 less and deals +2 Damage.",
    "special": {
      "type": "fearlessAssault",
      "afterMethod": "agility",
      "nextMethod": "strike",
      "discount": 2,
      "bonusDamage": 2
    }
  },
  {
    "id": "el-grande-americano-jumping-headbutt",
    "name": "Jumping Headbutt",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 7,
    "damage": 11,
    "requirements": {
      "strike": 2,
      "agility": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "el-grande-americano",
    "rarity": 3,
    "rulesText": "El Grande Americano-exclusive Trademark. Grounds opponent. Stun 1.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "trademark": true,
    "effects": []
  },
  {
    "id": "el-grande-americano-loaded-mask-headbutt",
    "name": "Loaded Mask Headbutt",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "strike",
    "method": null,
    "superstarId": "el-grande-americano",
    "rarity": 4,
    "rulesText": "El Grande Americano-exclusive Finisher. No Method requirement. Grounds opponent. Stun 1.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "finisher": true,
    "effects": []
  },
  {
    "id": "entrance-el-grande-americano",
    "name": "Los Americanos",
    "kind": "entrance",
    "setId": "worlds-collide-series-1",
    "rarity": 4,
    "superstarId": "el-grande-americano",
    "rulesText": "Pre-Match: Begin with +1 Technical Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "technical": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-el-grande-americano",
    "name": "Steel Plate",
    "kind": "special",
    "setId": "worlds-collide-series-1",
    "rarity": 3,
    "superstarId": "el-grande-americano",
    "rulesText": "Once per match, after El Grande Americano connects with Headbutt or Jumping Headbutt, search/draw Loaded Mask Headbutt. That searched Loaded Mask Headbutt costs 2 less during the current Control sequence.",
    "special": {
      "type": "steelPlate",
      "afterNames": [
        "Headbutt",
        "Jumping Headbutt"
      ],
      "searchName": "Loaded Mask Headbutt",
      "discount": 2
    }
  },
  {
    "id": "running-hip-attack",
    "name": "Running Hip Attack",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent. Stun 1.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "uso-splash",
    "name": "Uso Splash",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "aerial",
    "method": null,
    "superstarId": null,
    "allowedSuperstarIds": [
      "jey-uso"
    ],
    "rarity": 4,
    "rulesText": "Uso-family Finisher. Currently playable by Jey Uso; Jimmy Uso may share this card when added. No Method requirement. Grounded opponent only. If played immediately after Spear in the same Control sequence, +1 Damage.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "bonusDamageAfterNamed": {
      "name": "Spear",
      "damage": 1
    }
  },
  {
    "id": "entrance-jey-uso",
    "name": "Main Event Jey",
    "kind": "entrance",
    "setId": "money-in-the-bank-series-1",
    "rarity": 4,
    "superstarId": "jey-uso",
    "rulesText": "Pre-Match: Begin with +1 Strike Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strike": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-jey-uso",
    "name": "YEET!",
    "kind": "special",
    "setId": "money-in-the-bank-series-1",
    "rarity": 3,
    "superstarId": "jey-uso",
    "rulesText": "Once per match, after Jey connects with Spear, search/draw Uso Splash. That searched Uso Splash costs 2 less during the current Control sequence.",
    "special": {
      "type": "yeetTutor",
      "afterName": "Spear",
      "searchName": "Uso Splash",
      "discount": 2
    }
  },
  {
    "id": "jumping-neckbreaker",
    "name": "Jumping Neckbreaker",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "technical": 1,
      "agility": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent. If played immediately after a Strike Move in the same Control sequence, draw 1 page.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "drawSelf",
        "amount": 1,
        "ifAfterMethod": "strike"
      }
    ]
  },
  {
    "id": "burning-hammer",
    "name": "Burning Hammer",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 7,
    "damage": 11,
    "requirements": {
      "strength": 2,
      "technical": 1
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 3,
    "rulesText": "Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "la-knight-bft",
    "name": "BFT",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "strike",
    "method": null,
    "superstarId": "la-knight",
    "rarity": 4,
    "rulesText": "LA Knight-exclusive Finisher. No Method requirement. Grounds opponent. If played immediately after Diving Elbow Drop in the same Control sequence, +1 Damage.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "bonusDamageAfterNamed": {
      "name": "Diving Elbow Drop",
      "damage": 1
    }
  },
  {
    "id": "entrance-la-knight",
    "name": "Let Me Talk to Ya!",
    "kind": "entrance",
    "setId": "money-in-the-bank-series-1",
    "rarity": 4,
    "superstarId": "la-knight",
    "rulesText": "Pre-Match: Begin with +1 Strike Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strike": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-la-knight",
    "name": "YEAH!",
    "kind": "special",
    "setId": "money-in-the-bank-series-1",
    "rarity": 3,
    "superstarId": "la-knight",
    "rulesText": "Once per match, after LA Knight connects with Diving Elbow Drop, search/draw BFT. That searched BFT costs 2 less during the current Control sequence.",
    "special": {
      "type": "yeahTutor",
      "afterName": "Diving Elbow Drop",
      "searchName": "BFT",
      "discount": 2
    }
  },
  {
    "id": "double-knees",
    "name": "Double Knees",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "strike": 1,
      "agility": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounded opponent only. Stun 1.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 1,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "code-red",
    "name": "Code Red",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 5,
    "damage": 7,
    "requirements": {
      "agility": 1,
      "technical": 1
    },
    "moveType": "grapple",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "alexa-bliss-sister-abigail",
    "name": "Sister Abigail",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 7,
    "damage": 11,
    "requirements": {
      "technical": 2,
      "strike": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "alexa-bliss",
    "rarity": 3,
    "rulesText": "Alexa Bliss-exclusive Trademark. Grounds opponent. Stun 1. On connect, search/draw Twisted Bliss; that searched Twisted Bliss costs 1 less during the current Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "trademark": true,
    "effects": [
      {
        "type": "search",
        "name": "Twisted Bliss",
        "discount": 1
      }
    ]
  },
  {
    "id": "alexa-bliss-twisted-bliss",
    "name": "Twisted Bliss",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 9,
    "damage": 15,
    "requirements": {},
    "moveType": "aerial",
    "method": null,
    "superstarId": "alexa-bliss",
    "rarity": 4,
    "rulesText": "Alexa Bliss-exclusive Finisher. No Method requirement. Grounded opponent only. If played immediately after Sister Abigail in the same Control sequence, +2 Damage.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "bonusDamageAfterNamed": {
      "name": "Sister Abigail",
      "damage": 2
    }
  },
  {
    "id": "entrance-alexa-bliss",
    "name": "The Goddess",
    "kind": "entrance",
    "setId": "money-in-the-bank-series-1",
    "rarity": 4,
    "superstarId": "alexa-bliss",
    "rulesText": "Pre-Match: Begin with +1 Agility Momentum, +1 Technical Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "agility": 1,
      "technical": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-alexa-bliss",
    "name": "Mind Games",
    "kind": "special",
    "setId": "money-in-the-bank-series-1",
    "rarity": 3,
    "superstarId": "alexa-bliss",
    "rulesText": "Once per match, after Alexa successfully kicks out of a Pin, draw 1 page and gain +1 Adrenaline.",
    "special": {
      "type": "mindGames",
      "drawOnKickout": 1,
      "adrenalineOnKickout": 1
    }
  },
  {
    "id": "shotgun-dropkick",
    "name": "Shotgun Dropkick",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 2,
      "agility": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent. Stun 1. When played by Finn B\u00e1lor, on connect search/draw Coup de Gr\u00e2ce; that searched Coup de Gr\u00e2ce costs 1 less during the current Control sequence.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "effects": [
      {
        "type": "search",
        "name": "Coup de Gr\u00e2ce",
        "discount": 1,
        "ifSuperstarIds": [
          "finn-balor"
        ]
      }
    ]
  },
  {
    "id": "finn-balor-1916",
    "name": "1916",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 7,
    "damage": 12,
    "requirements": {
      "technical": 2,
      "strength": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "finn-balor",
    "rarity": 3,
    "rulesText": "Finn B\u00e1lor-exclusive Trademark. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": []
  },
  {
    "id": "finn-balor-coup-de-grace",
    "name": "Coup de Gr\u00e2ce",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {},
    "moveType": "aerial",
    "method": null,
    "superstarId": "finn-balor",
    "rarity": 4,
    "rulesText": "Finn B\u00e1lor-exclusive Finisher. No Method requirement. Grounded opponent only. If played immediately after Shotgun Dropkick in the same Control sequence, +1 Damage.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "bonusDamageAfterNamed": {
      "name": "Shotgun Dropkick",
      "damage": 1
    }
  },
  {
    "id": "entrance-finn-balor",
    "name": "The Prince",
    "kind": "entrance",
    "setId": "money-in-the-bank-series-1",
    "rarity": 4,
    "superstarId": "finn-balor",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strength": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-finn-balor",
    "name": "B\u00e1lor Club",
    "kind": "special",
    "setId": "money-in-the-bank-series-1",
    "rarity": 3,
    "superstarId": "finn-balor",
    "rulesText": "Once per match, after Finn connects with Sling Blade, search/draw Shotgun Dropkick. That searched Shotgun Dropkick costs 2 less during the current Control sequence.",
    "special": {
      "type": "balorClubTutor",
      "afterName": "Sling Blade",
      "searchName": "Shotgun Dropkick",
      "discount": 2
    }
  },
  {
    "id": "pump-kick",
    "name": "Pump Kick",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent. If the opponent was already Stunned when this Move connected, +2 Damage.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "bonusDamageIfOpponentStunned": 2,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "inverted-ddt",
    "name": "Inverted DDT",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 5,
    "damage": 7,
    "requirements": {
      "technical": 1,
      "strike": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent. Stun 1.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "octopus-hold",
    "name": "Octopus Hold",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 5,
    "damage": 5,
    "requirements": {
      "technical": 2
    },
    "moveType": "submission",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounded opponent only. Submission. Arm Pressure 5.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "arms",
      "pressure": 5
    },
    "effects": []
  },
  {
    "id": "danhausen-very-nice-knee-vil",
    "name": "Very Nice, Very Knee-vil",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 7,
    "damage": 11,
    "requirements": {
      "strike": 2,
      "strength": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "danhausen",
    "rarity": 3,
    "rulesText": "Danhausen-exclusive Trademark. Grounds opponent. Stun 1.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 1,
    "selfDamage": 0,
    "trademark": true,
    "effects": []
  },
  {
    "id": "danhausen-triple-d",
    "name": "Triple D",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 9,
    "damage": 15,
    "requirements": {},
    "moveType": "grapple",
    "method": null,
    "superstarId": "danhausen",
    "rarity": 4,
    "rulesText": "Danhausen-exclusive Finisher. No Method requirement. Grounds opponent. +1 Damage if the opponent was already Stunned when this Move connected.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": [],
    "bonusDamageIfOpponentStunned": 1
  },
  {
    "id": "entrance-danhausen",
    "name": "Very Nice, Very Evil",
    "kind": "entrance",
    "setId": "smackdown-series-1",
    "rarity": 4,
    "superstarId": "danhausen",
    "rulesText": "Pre-Match: Begin with +1 Technical Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "technical": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-danhausen",
    "name": "Jar of Teeth",
    "kind": "special",
    "setId": "smackdown-series-1",
    "rarity": 3,
    "superstarId": "danhausen",
    "rulesText": "Once per match, after Danhausen connects with a Move that grounds the opponent, play this: opponent ditches 1 page and loses 1 Adrenaline; Danhausen draws 1 page. Continue the Control sequence normally.",
    "special": {
      "type": "jarOfTeeth",
      "ditchOpponent": 1,
      "opponentAdrenaline": -1,
      "draw": 1
    }
  },
  {
    "id": "cutter",
    "name": "Cutter",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "technical": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "front-kick",
    "name": "Front Kick",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 2,
    "damage": 4,
    "requirements": {
      "agility": 1
    },
    "moveType": "strike",
    "method": "agility",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "A fast front kick used to create space and start an athletic offensive sequence.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "snap-suplex",
    "name": "Snap Suplex",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "technical": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "finlay-roll",
    "name": "Finlay Roll",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 5,
    "damage": 7,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "tiffany-stratton-handspring-back-elbow",
    "name": "Handspring Back Elbow",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 5,
    "damage": 7,
    "requirements": {
      "agility": 2
    },
    "moveType": "strike",
    "method": "agility",
    "superstarId": "tiffany-stratton",
    "rarity": 3,
    "rulesText": "Tiffany Stratton-exclusive Trademark. Grounds opponent. On Connect: search/draw Prettiest Moonsault Ever.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "searchOnConnectName": "Prettiest Moonsault Ever",
    "effects": []
  },
  {
    "id": "tiffany-stratton-prettiest-moonsault-ever",
    "name": "Prettiest Moonsault Ever",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 10,
    "damage": 16,
    "requirements": {},
    "moveType": "aerial",
    "method": "agility",
    "superstarId": "tiffany-stratton",
    "rarity": 4,
    "rulesText": "Tiffany Stratton-exclusive Finisher. No Method requirement. Grounded opponent only.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": []
  },
  {
    "id": "entrance-tiffany-stratton",
    "name": "It\u2019s Tiffy Time",
    "kind": "entrance",
    "setId": "smackdown-series-1",
    "rarity": 4,
    "superstarId": "tiffany-stratton",
    "rulesText": "Pre-Match: Begin with +1 Agility Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "agility": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-tiffany-stratton",
    "name": "Tiffany Epiphany",
    "kind": "special",
    "setId": "smackdown-series-1",
    "rarity": 3,
    "superstarId": "tiffany-stratton",
    "rulesText": "Once per match during your Control sequence, search your deck for one Strength Move and one Agility Move. Draw the one that best fits the current position and shuffle the other back.",
    "special": {
      "type": "tiffanyEpiphany",
      "methods": [
        "strength",
        "agility"
      ]
    }
  },
  {
    "id": "chelsea-green-im-prettier",
    "name": "I\u2019m Prettier",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 7,
    "damage": 11,
    "requirements": {
      "technical": 2
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "chelsea-green",
    "rarity": 3,
    "rulesText": "Chelsea Green-exclusive Trademark. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "effects": []
  },
  {
    "id": "chelsea-green-green-with-envy",
    "name": "Green With Envy",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 9,
    "damage": 15,
    "requirements": {},
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "chelsea-green",
    "rarity": 4,
    "rulesText": "Chelsea Green-exclusive Finisher. No Method requirement. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": []
  },
  {
    "id": "entrance-chelsea-green",
    "name": "Hot Mess",
    "kind": "entrance",
    "setId": "smackdown-series-1",
    "rarity": 4,
    "superstarId": "chelsea-green",
    "rulesText": "Pre-Match: Begin with +2 Adrenaline. Your first Counter this match costs 1 less.",
    "preMatchMomentum": {},
    "preMatchAdrenaline": 2,
    "preMatchCounterDiscount": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-chelsea-green",
    "name": "File a Complaint",
    "kind": "special",
    "setId": "smackdown-series-1",
    "rarity": 3,
    "superstarId": "chelsea-green",
    "rulesText": "Once per match during your Control sequence: search/draw a Counter. Your next Counter costs 1 less.",
    "special": {
      "type": "fileComplaint",
      "counterDiscount": 1
    }
  },
  {
    "id": "damian-priest-south-of-heaven",
    "name": "South of Heaven",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 7,
    "damage": 12,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "damian-priest",
    "rarity": 3,
    "rulesText": "Damian Priest-exclusive Trademark. Grounds opponent. On Connect: your next Finisher this Control sequence costs 2 less.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "nextFinisherDiscountOnConnect": 2,
    "effects": []
  },
  {
    "id": "damian-priest-razors-edge",
    "name": "Razor\u2019s Edge",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 8,
    "damage": 13,
    "requirements": {
      "strength": 3
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "damian-priest",
    "rarity": 3,
    "rulesText": "Damian Priest-exclusive Trademark. Grounds opponent. On Connect: opponent loses 1 Adrenaline.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "opponentAdrenalineOnConnect": -1,
    "effects": []
  },
  {
    "id": "damian-priest-hit-the-lights",
    "name": "Hit the Lights",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 10,
    "damage": 16,
    "requirements": {},
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "damian-priest",
    "rarity": 4,
    "rulesText": "Damian Priest-exclusive Finisher. No Method requirement. Grounded opponent only.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "effects": []
  },
  {
    "id": "entrance-damian-priest",
    "name": "Rise of the Punisher",
    "kind": "entrance",
    "setId": "smackdown-series-1",
    "rarity": 4,
    "superstarId": "damian-priest",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strength": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-damian-priest",
    "name": "Last Rites",
    "kind": "special",
    "setId": "smackdown-series-1",
    "rarity": 3,
    "superstarId": "damian-priest",
    "rulesText": "Once per match during your Control sequence: search/draw a Trademark or Finisher. Your next Strength Move this Control sequence costs 1 less.",
    "special": {
      "type": "lastRites",
      "strengthDiscount": 1
    }
  },
  {
    "id": "mexican-surfboard",
    "name": "Mexican Surfboard",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 5,
    "damage": 2,
    "requirements": {
      "technical": 2
    },
    "moveType": "submission",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Grounded opponent only. Submission + Back pressure 4.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "back",
      "pressure": 4
    },
    "effects": []
  },
  {
    "id": "firemans-carry",
    "name": "Fireman\u2019s Carry",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "strength": 1
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared fundamental takedown.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "leapfrog",
    "name": "Leapfrog",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 2,
    "damage": 0,
    "requirements": {
      "agility": 1
    },
    "moveType": "counter",
    "method": "agility",
    "superstarId": null,
    "rarity": 1,
    "defensiveOnly": true,
    "counters": [
      "strike",
      "grapple"
    ],
    "rulesText": "Counter a Strike or Grapple Move. On success, gain Control."
  },
  {
    "id": "abdominal-stretch",
    "name": "Abdominal Stretch",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 4,
    "damage": 2,
    "requirements": {
      "technical": 1
    },
    "moveType": "submission",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Submission + Body pressure 3.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "body",
      "pressure": 3
    },
    "effects": []
  },
  {
    "id": "punches-in-the-corner",
    "name": "Punches in the Corner",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "On Connect: opponent loses 1 Adrenaline.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "opponentAdrenalineOnConnect": -1,
    "effects": []
  },
  {
    "id": "running-clothesline",
    "name": "Running Clothesline",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Shared running strike.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "clothesline-over-the-top-rope",
    "name": "Clothesline Over the Top Rope",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 5,
    "damage": 7,
    "requirements": {
      "strength": 1
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Playable in the ring. On Connect: opponent loses 1 Adrenaline.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "opponentAdrenalineOnConnect": -1,
    "effects": []
  },
  {
    "id": "bron-breakker-gorilla-press-powerslam",
    "name": "Gorilla Press Powerslam",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 7,
    "damage": 11,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "bron-breakker",
    "rarity": 3,
    "rulesText": "Bron Breakker-exclusive Trademark. Grounds opponent. On Connect: search/draw Breakker\u2019s Spear.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "searchOnConnectName": "Breakker\u2019s Spear",
    "effects": []
  },
  {
    "id": "bron-breakker-breakkers-spear",
    "name": "Breakker\u2019s Spear",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 10,
    "damage": 16,
    "requirements": {
      "strength": 3
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "bron-breakker",
    "rarity": 4,
    "rulesText": "Bron Breakker-exclusive Finisher. If Bron connected with an Agility Move earlier in this Control sequence, costs 2 less.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "finisher": true,
    "discountIfPriorAgility": 2,
    "effects": []
  },
  {
    "id": "bron-breakker-steiner-recliner",
    "name": "Steiner Recliner",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 7,
    "damage": 2,
    "requirements": {
      "strength": 2
    },
    "moveType": "submission",
    "method": "strength",
    "superstarId": "bron-breakker",
    "rarity": 3,
    "rulesText": "Bron Breakker-exclusive Back Submission. Pressure 5.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "back",
      "pressure": 5
    },
    "effects": []
  },
  {
    "id": "entrance-bron-breakker",
    "name": "Breakker Unleashed",
    "kind": "entrance",
    "setId": "survivor-series-series-1",
    "rarity": 4,
    "superstarId": "bron-breakker",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum and +1 Agility Momentum.",
    "preMatchMomentum": {
      "strength": 1,
      "agility": 1
    },
    "preMatchAdrenaline": 0,
    "delayedTurn5": false
  },
  {
    "id": "special-bron-breakker",
    "name": "Full Speed",
    "kind": "special",
    "setId": "survivor-series-series-1",
    "rarity": 3,
    "superstarId": "bron-breakker",
    "rulesText": "Once per match during your Control sequence: your next connected Move this Control sequence deals +2 Damage; if it is an Agility Move, draw 1 page.",
    "special": {
      "type": "fullSpeed",
      "damage": 2,
      "agilityDraw": 1
    }
  },
  {
    "id": "penta-handstand-dropkick",
    "name": "Penta\u2019s Handstand Dropkick",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "agility": 2
    },
    "moveType": "strike",
    "method": "agility",
    "superstarId": "penta",
    "rarity": 2,
    "rulesText": "Penta-exclusive. Grounds opponent. If Penta connected with another Agility Move earlier in this Control sequence, +1 Damage.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "priorConnectedMethodBonus": {
      "method": "agility",
      "damage": 1
    },
    "effects": []
  },
  {
    "id": "apron-german-suplex",
    "name": "Apron German Suplex",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 6,
    "damage": 10,
    "requirements": {
      "strength": 1,
      "technical": 1
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent. Opponent loses 1 Adrenaline. Counts as German Suplex for card effects and synergies.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "opponentAdrenalineOnConnect": -1,
    "countsAs": [
      "German Suplex"
    ],
    "effects": []
  },
  {
    "id": "corner-clothesline",
    "name": "Corner Clothesline",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 2,
    "damage": 4,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Standing opponent only. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "dropkick-to-the-back",
    "name": "Dropkick to the Back",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "agility": 1
    },
    "moveType": "strike",
    "method": "agility",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Standing opponent only. Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "elbow",
    "name": "Elbow",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 2,
    "damage": 3,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Standing opponent only. May also Counter a Strike Move.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "counters": [
      "strike"
    ],
    "effects": []
  },
  {
    "id": "running-knees-to-the-back",
    "name": "Running Knees to the Back",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "agility": 1,
      "strike": 1
    },
    "moveType": "strike",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Standing opponent only. Grounds opponent.",
    "standingOnly": true,
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "fight-forever",
    "name": "Fight Forever",
    "kind": "action",
    "setId": "raw-series-1",
    "rarity": 4,
    "boosterOnly": true,
    "rulesText": "Restore 10 HP to both Superstars, up to their starting HP. Increase this match\u2019s turn limit by 10.",
    "effect": {
      "type": "fightForever",
      "healEach": 10,
      "turns": 10
    }
  },
  {
    "id": "flapjack",
    "name": "Flapjack",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "strength": 1
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "boosterOnly": true,
    "rulesText": "Standing opponent only. Grounds opponent.",
    "standingOnly": true,
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "side-headlock",
    "name": "Side Headlock",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 3,
    "damage": 2,
    "requirements": {
      "technical": 1
    },
    "moveType": "submission",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "boosterOnly": true,
    "rulesText": "Standing opponent only. Submission. Head pressure 3.",
    "standingOnly": true,
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "head",
      "pressure": 3
    },
    "effects": []
  },
  {
    "id": "wristlock",
    "name": "Wristlock",
    "kind": "move",
    "setId": "money-in-the-bank-series-1",
    "cost": 2,
    "damage": 1,
    "requirements": {
      "technical": 1
    },
    "moveType": "submission",
    "method": "technical",
    "superstarId": null,
    "rarity": 1,
    "boosterOnly": true,
    "rulesText": "Standing opponent only. Submission. Arm pressure 2.",
    "standingOnly": true,
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "arms",
      "pressure": 2
    },
    "effects": []
  },
  {
    "id": "catch-your-breath",
    "name": "Catch Your Breath",
    "kind": "action",
    "setId": "money-in-the-bank-series-1",
    "rarity": 3,
    "boosterOnly": true,
    "rulesText": "Restore 5 HP to your Superstar, up to starting HP.",
    "effect": {
      "type": "healSelf",
      "amount": 5
    }
  },
  {
    "id": "knee-to-the-gut",
    "name": "Knee to the Gut",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 3,
    "damage": 4,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "boosterOnly": true,
    "rulesText": "Standing opponent only. May also Counter a Grapple Move.",
    "standingOnly": true,
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "counters": [
      "grapple"
    ],
    "effects": []
  },
  {
    "id": "throw-into-steel-steps",
    "name": "Throw Into Steel Steps",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strength": 1
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "boosterOnly": true,
    "rulesText": "On connect, deal +1 Back body-part damage. This impact is not a maintainable hold.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "bodyDamage": {
      "bodyPart": "back",
      "pressure": 1
    },
    "effects": []
  },
  {
    "id": "sleeper-hold",
    "name": "Sleeper Hold",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 4,
    "damage": 2,
    "requirements": {
      "technical": 2
    },
    "moveType": "submission",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "boosterOnly": true,
    "rulesText": "Standing opponent only. Submission. Head pressure 4.",
    "standingOnly": true,
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "submission": {
      "bodyPart": "head",
      "pressure": 4
    },
    "effects": []
  },
  {
    "id": "scissors-kick",
    "name": "Scissors Kick",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 2,
    "boosterOnly": true,
    "rulesText": "Standing opponent only. Grounds opponent.",
    "standingOnly": true,
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "senton-splash",
    "name": "Senton Splash",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "agility": 2
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "boosterOnly": true,
    "rulesText": "Grounded opponent only.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "spinning-back-kick",
    "name": "Spinning Back Kick",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 3,
    "damage": 5,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 1,
    "boosterOnly": true,
    "rulesText": "Standing opponent only.",
    "standingOnly": true,
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": []
  },
  {
    "id": "throw-into-ringpost",
    "name": "Throw Into Ringpost",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strength": 1
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": null,
    "rarity": 2,
    "boosterOnly": true,
    "rulesText": "On connect, deal +1 Head body-part damage. This impact is not a maintainable hold.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "bodyDamage": {
      "bodyPart": "head",
      "pressure": 1
    },
    "effects": []
  },
  {
    "id": "corner-barrage",
    "name": "Corner Barrage",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 4,
    "damage": 6,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 2,
    "boosterOnly": true,
    "rulesText": "Standing opponent only. If you connected with a Strike earlier in this Control sequence, +2 Damage.",
    "standingOnly": true,
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "bonusDamageIfStrikeEarlierThisControl": 2,
    "effects": []
  },
  {
    "id": "drew-mcintyre-glasgow-kiss",
    "name": "Glasgow Kiss",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "drew-mcintyre",
    "rarity": 2,
    "rulesText": "Drew McIntyre-exclusive. On Connect: deal +1 Head body-part damage.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "bodyDamage": {
      "bodyPart": "head",
      "pressure": 1
    }
  },
  {
    "id": "drew-mcintyre-future-shock-ddt",
    "name": "Future Shock DDT",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 7,
    "damage": 11,
    "requirements": {
      "strength": 2,
      "technical": 1
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "drew-mcintyre",
    "rarity": 3,
    "rulesText": "Drew McIntyre-exclusive Trademark. Grounds opponent. On Connect: search/draw Claymore.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "trademark": true,
    "searchOnConnectName": "Claymore"
  },
  {
    "id": "drew-mcintyre-claymore",
    "name": "Claymore",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 10,
    "damage": 17,
    "requirements": {
      "strike": 3
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "drew-mcintyre",
    "rarity": 4,
    "rulesText": "Drew McIntyre-exclusive Finisher. Standing opponent only. Grounds opponent. Costs 2 less if the opponent already has Head body-part damage.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "finisher": true,
    "standingOnly": true,
    "discountIfOpponentBodyDamage": {
      "bodyPart": "head",
      "min": 1,
      "amount": 2
    }
  },
  {
    "id": "entrance-drew-mcintyre",
    "name": "Scottish Warrior",
    "kind": "entrance",
    "setId": "survivor-series-series-1",
    "rarity": 4,
    "superstarId": "drew-mcintyre",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum, +1 Strike Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strength": 1,
      "strike": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-drew-mcintyre",
    "name": "Claymore Countdown",
    "kind": "special",
    "setId": "survivor-series-series-1",
    "rarity": 3,
    "superstarId": "drew-mcintyre",
    "rulesText": "Once per match during your Control sequence: search/draw Claymore. Your next Claymore this Control sequence costs 2 less.",
    "special": {
      "type": "claymoreCountdown",
      "name": "Claymore",
      "discount": 2
    }
  },
  {
    "id": "randy-orton-draping-ddt",
    "name": "Draping DDT",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 7,
    "damage": 10,
    "requirements": {
      "technical": 2
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "randy-orton",
    "rarity": 3,
    "rulesText": "Randy Orton-exclusive Trademark. Grounds opponent. On Connect: search/draw RKO and deal +1 Head body-part damage.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "trademark": true,
    "searchOnConnectName": "RKO",
    "bodyDamage": {
      "bodyPart": "head",
      "pressure": 1
    }
  },
  {
    "id": "randy-orton-rko",
    "name": "RKO",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 10,
    "damage": 17,
    "requirements": {
      "technical": 2,
      "strength": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "randy-orton",
    "rarity": 4,
    "rulesText": "Randy Orton-exclusive Finisher. Standing opponent only. Grounds opponent. If Randy connected with a Technical Move earlier this Control sequence, costs 2 less.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "finisher": true,
    "standingOnly": true,
    "discountIfMethodConnectedThisControl": {
      "method": "technical",
      "amount": 2
    }
  },
  {
    "id": "randy-orton-punt-kick",
    "name": "Punt Kick",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 8,
    "damage": 13,
    "requirements": {
      "strike": 3
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "randy-orton",
    "rarity": 4,
    "rulesText": "Randy Orton-exclusive Finisher. Grounded opponent only. On Connect: deal +1 Head body-part damage and opponent loses 1 Adrenaline.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "finisher": true,
    "bodyDamage": {
      "bodyPart": "head",
      "pressure": 1
    },
    "opponentAdrenalineOnConnect": -1
  },
  {
    "id": "entrance-randy-orton",
    "name": "Voices",
    "kind": "entrance",
    "setId": "survivor-series-series-1",
    "rarity": 4,
    "superstarId": "randy-orton",
    "rulesText": "Pre-Match: Begin with +1 Technical Momentum, +1 Strike Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "technical": 1,
      "strike": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-randy-orton",
    "name": "Outta Nowhere",
    "kind": "special",
    "setId": "survivor-series-series-1",
    "rarity": 3,
    "superstarId": "randy-orton",
    "rulesText": "Once per match, when the opponent attempts a Move: Randy may play RKO from hand as a Counter. If he does, RKO costs 2 less.",
    "special": {
      "type": "outtaNowhere",
      "name": "RKO",
      "discount": 2
    }
  },
  {
    "id": "sami-zayn-exploder-turnbuckle",
    "name": "Exploder Suplex Into Turnbuckle",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "technical": 1,
      "strength": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "sami-zayn",
    "rarity": 2,
    "rulesText": "Sami Zayn-exclusive. Standing opponent only. Grounds opponent. On Connect: Sami\u2019s next Helluva Kick this Control sequence costs 2 less.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "discountNextByName",
        "name": "Helluva Kick",
        "amount": 2
      }
    ],
    "standingOnly": true
  },
  {
    "id": "sami-zayn-blue-thunder-bomb",
    "name": "Blue Thunder Bomb",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 7,
    "damage": 11,
    "requirements": {
      "technical": 2,
      "strength": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": "sami-zayn",
    "rarity": 3,
    "rulesText": "Sami Zayn-exclusive Trademark. Standing opponent only. Grounds opponent. On Connect: draw 1. If Sami has less HP than his opponent, also gain +1 Adrenaline.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "drawSelf",
        "amount": 1
      },
      {
        "type": "gainAdrenalineIfBehind",
        "amount": 1
      }
    ],
    "trademark": true,
    "standingOnly": true
  },
  {
    "id": "sami-zayn-helluva-kick",
    "name": "Helluva Kick",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 9,
    "damage": 16,
    "requirements": {
      "strike": 3
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": "sami-zayn",
    "rarity": 4,
    "rulesText": "Sami Zayn-exclusive Finisher. Standing opponent only. Grounds opponent. If Exploder Suplex Into Turnbuckle connected earlier this Control sequence, costs 2 less.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "finisher": true,
    "standingOnly": true
  },
  {
    "id": "entrance-sami-zayn",
    "name": "Worlds Apart",
    "kind": "entrance",
    "setId": "survivor-series-series-1",
    "rarity": 4,
    "superstarId": "sami-zayn",
    "rulesText": "Pre-Match: Begin with +1 Technical Momentum, +1 Agility Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "technical": 1,
      "agility": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-sami-zayn",
    "name": "Never Say Die",
    "kind": "special",
    "setId": "survivor-series-series-1",
    "rarity": 3,
    "superstarId": "sami-zayn",
    "rulesText": "Once per match, when Sami enters Red Health (24% HP or lower): draw 2 cards and gain +2 Adrenaline.",
    "special": {
      "type": "neverSayDie",
      "hpPct": 0.24,
      "draw": 2,
      "adrenaline": 2
    }
  },
  {
    "id": "jacob-fatu-pop-up-samoan-drop",
    "name": "Pop-Up Samoan Drop",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 7,
    "damage": 12,
    "requirements": {
      "strength": 2
    },
    "moveType": "grapple",
    "method": "strength",
    "superstarId": "jacob-fatu",
    "rarity": 3,
    "rulesText": "Jacob Fatu-exclusive Trademark. Standing opponent only. Grounds opponent. On Connect: search/draw Moonsault; Jacob\u2019s next Moonsault this Control sequence costs 2 less.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [
      {
        "type": "discountNextByName",
        "name": "Moonsault",
        "amount": 2
      }
    ],
    "trademark": true,
    "standingOnly": true,
    "searchOnConnectName": "Moonsault"
  },
  {
    "id": "jacob-fatu-moonsault",
    "name": "Moonsault",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 10,
    "damage": 17,
    "requirements": {
      "agility": 3
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": "jacob-fatu",
    "rarity": 4,
    "rulesText": "Jacob Fatu-exclusive Finisher. Grounded opponent only. If Pop-Up Samoan Drop connected earlier this Control sequence, costs 2 less.",
    "groundOpponent": true,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "finisher": true
  },
  {
    "id": "jacob-fatu-tongan-death-grip",
    "name": "Tongan Death Grip",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 8,
    "damage": 2,
    "requirements": {
      "strength": 2
    },
    "moveType": "submission",
    "method": "strength",
    "superstarId": "jacob-fatu",
    "rarity": 4,
    "rulesText": "Jacob Fatu-exclusive Submission Finisher. Standing opponent. Head Pressure 6.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "finisher": true,
    "standingOnly": true,
    "submission": {
      "bodyPart": "head",
      "pressure": 6
    }
  },
  {
    "id": "entrance-jacob-fatu",
    "name": "Samoan Werewolf",
    "kind": "entrance",
    "setId": "survivor-series-series-1",
    "rarity": 4,
    "superstarId": "jacob-fatu",
    "rulesText": "Pre-Match: Begin with +1 Strength Momentum, +1 Agility Momentum and +1 Adrenaline.",
    "preMatchMomentum": {
      "strength": 1,
      "agility": 1
    },
    "preMatchAdrenaline": 1,
    "delayedTurn5": false
  },
  {
    "id": "special-jacob-fatu",
    "name": "Built Different",
    "kind": "special",
    "setId": "survivor-series-series-1",
    "rarity": 3,
    "superstarId": "jacob-fatu",
    "rulesText": "Once per match, after Jacob takes 8 or more Damage from a single Move: gain +2 Adrenaline and draw 1 card.",
    "special": {
      "type": "builtDifferent",
      "minDamage": 8,
      "draw": 1,
      "adrenaline": 2
    }
  },
  {
    "id": "shoulder-block",
    "name": "Shoulder Block",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 3,
    "damage": 4,
    "requirements": {
      "strength": 1
    },
    "moveType": "strike",
    "method": "strength",
    "superstarId": null,
    "rarity": 1,
    "rulesText": "Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "boosterOnly": true,
    "standingOnly": true
  },
  {
    "id": "shining-wizard",
    "name": "Shining Wizard",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "strike": 2
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounded opponent only. On connect, deal +1 Head body-part damage.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "bodyDamage": {
      "bodyPart": "head",
      "pressure": 1
    },
    "effects": [],
    "boosterOnly": true
  },
  {
    "id": "double-underhook-facebuster",
    "name": "Double Underhook Facebuster",
    "kind": "move",
    "setId": "survivor-series-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "technical": 1,
      "strength": 1
    },
    "moveType": "grapple",
    "method": "technical",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "boosterOnly": true,
    "standingOnly": true
  },
  {
    "id": "steel-chair-to-the-back",
    "name": "Steel Chair to the Back",
    "kind": "move",
    "setId": "raw-series-1",
    "cost": 4,
    "damage": 7,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounded opponent only. On connect, deal +1 Back body-part damage. This impact damage is one-shot and cannot be maintained as a hold.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "bodyDamage": {
      "bodyPart": "back",
      "pressure": 1
    },
    "effects": [],
    "boosterOnly": true
  },
  {
    "id": "spanish-fly",
    "name": "Spanish Fly",
    "kind": "move",
    "setId": "worlds-collide-series-1",
    "cost": 6,
    "damage": 10,
    "requirements": {
      "agility": 2,
      "strength": 1
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 3,
    "rulesText": "Grounds opponent.",
    "groundOpponent": true,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "boosterOnly": true,
    "standingOnly": true
  },
  {
    "id": "second-rope-leg-drop",
    "name": "2nd Rope Leg Drop",
    "kind": "move",
    "setId": "smackdown-series-1",
    "cost": 5,
    "damage": 8,
    "requirements": {
      "agility": 1
    },
    "moveType": "aerial",
    "method": "agility",
    "superstarId": null,
    "rarity": 2,
    "rulesText": "Grounded opponent only.",
    "groundOpponent": false,
    "groundedOnly": true,
    "stun": 0,
    "selfDamage": 0,
    "effects": [],
    "boosterOnly": true
  },
  {
    "id": "flair-chop",
    "name": "Flair Chop",
    "kind": "move",
    "setId": "evolution-series-1",
    "cost": 3,
    "damage": 6,
    "requirements": {
      "strike": 1
    },
    "moveType": "strike",
    "method": "strike",
    "superstarId": null,
    "allowedSuperstarIds": [
      "charlotte-flair"
    ],
    "rarity": 3,
    "rulesText": "Flair Family Trademark. Currently playable by Charlotte Flair. On connect, deal +1 Chest body-part damage.",
    "groundOpponent": false,
    "groundedOnly": false,
    "stun": 0,
    "selfDamage": 0,
    "trademark": true,
    "bodyDamage": {
      "bodyPart": "chest",
      "pressure": 1
    },
    "effects": []
  }
];
