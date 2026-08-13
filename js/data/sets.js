export const sets = {
  "worlds-collide-series-1": {
    id: "worlds-collide-series-1", name: "Worlds Collide", series: 1, type: "event-subset",
    displayName: "Worlds Collide — Series 1", shortCode: "WC1", lifecycleDefault: "future",
    releaseDate: "2026-09-26", developmentOnly: true,
    lifecycleLabels: { future: "Future", featured: "Featured", vaulted: "Vaulted", returning: "Returning" }
  },
  "raw-series-1": {
    id: "raw-series-1", name: "Raw", series: 1, type: "brand-subset",
    displayName: "Raw — Series 1", shortCode: "RAW1", lifecycleDefault: "future",
    releaseDate: "2026-09-05", developmentOnly: true,
    lifecycleLabels: { future: "Future", featured: "Featured", vaulted: "Vaulted", returning: "Returning" }
  },
  "season-1-final-boss": { id: "season-1-final-boss", name: "Season 1", series: 1, type: "season-exclusive", displayName: "Season 1 — Final Boss", shortCode: "S1FB", lifecycleDefault: "exclusive", lifecycleLabels: { exclusive: "Season Exclusive" } },
  "summerslam-series-1": {
    id: "summerslam-series-1", name: "SummerSlam", series: 1, type: "ple", eventYear: 2026,
    displayName: "SummerSlam — Series 1", shortCode: "SS1", lifecycleDefault: "featured",
    lifecycleLabels: { featured: "Featured", vaulted: "Vaulted", returning: "Returning" }
  },
  "hall-of-fame-series-1": {
    id: "hall-of-fame-series-1", name: "Hall of Fame", series: 1, type: "hall-of-fame",
    displayName: "Hall of Fame — Series 1", shortCode: "HOF1", lifecycleDefault: "featured",
    branches: ["golden-era", "attitude-era"],
    lifecycleLabels: { featured: "Featured", vaulted: "Vaulted", returning: "Returning" }
  },
  "evolution-series-1": {
    id: "evolution-series-1", name: "Evolution", series: 1, type: "evolution",
    displayName: "Evolution — Series 1", shortCode: "EVO1", lifecycleDefault: "featured",
    branches: ["evolution"],
    lifecycleLabels: { featured: "Featured", vaulted: "Vaulted", returning: "Returning" }
  }
};
