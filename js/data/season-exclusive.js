// Season-exclusive Superstar registry. These rewards live outside normal set boosters.
// Season 1 is now the babyface John Cena — The Last Time Is Now chase.
// The Rock — Final Boss is retained internally as a banked future reward.
export const seasonExclusiveSuperstars = {
  "john-cena": {
    id: "john-cena",
    name: "John Cena",
    nickname: "The Last Time Is Now",
    persona: "babyface farewell run",
    seasonId: "season-1",
    unlock: "tier-100-completion",
    postSeasonAvailability: "future-decision",
    boosterEligible: false,
    fullDeckReward: true
  },
  "the-rock": {
    id: "the-rock",
    name: "The Rock",
    nickname: "The Final Boss",
    persona: "Final Boss",
    seasonId: null,
    unlock: "banked-future-reward",
    postSeasonAvailability: "future-decision",
    boosterEligible: false,
    fullDeckReward: true,
    developmentOnly: true
  },
  "goldberg": {
    id: "goldberg",
    name: "Goldberg",
    nickname: "Who’s Next?",
    persona: "WCW undefeated-streak era",
    seasonId: "season-2",
    unlock: "tier-100-completion",
    postSeasonAvailability: "store-in-game-currency",
    boosterEligible: false,
    fullDeckReward: true
  }
};
