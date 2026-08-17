# WWE Legacy v0.12.87 — Ladder Redesign + 100-Tier Final Boss Road

Climb the Ladder gets a premium lower-half redesign and Season 1 expands from 50 to 100 tiers.

- **Climb the Ladder lower half:** the redundant current-level strip is removed during active runs. The current opponent and Fight Level CTA now live in one large featured match panel, followed by a cleaner premium 2×4 progress grid with larger portraits and explicit Defeated / Next / Waiting states.
- **Season 1 is now 100 tiers** at the existing 100 XP per tier, for a 10,000 XP completion road. Existing XP and already-claimed tiers remain valid.
- **Tier 100** awards the **Foil The Rock — Final Boss Superstar card**. The Rock is no longer the Tier 50 completion reward.
- Rock-exclusive repeatable Moves are earned **one copy at a time**, five times each across the road: Lay The Smack Down (Tiers 5/25/55/75/88), Belt Whip (10/45/65/82/92), Rock Bottom (20/40/50/70/90), and People’s Elbow (30/60/80/94/98).
- One-off Final Boss rewards are spaced between the Move copies: People’s Championship (15), Bloodline Rules (35), Final Boss Entrance Foil (85), and the Superstar Foil (100).
- Non-Rock tiers alternate between **Universe Points** and **Season 1 booster rewards**. Booster variety expands as the road progresses from the three launch sets into RAW, Worlds Collide, Money in the Bank and SmackDown Series 1. Future-set pack credits remain tied to their authored set and become useful when that set is player-facing.
- No Rock card gameplay values, card IDs, rarities, collector numbering, booster odds, Superstar HP, match rules, career records or achievement requirements changed.

v0.12.82 functional Deck Assistance, v0.12.81 Daily Live Events, and all prior locked gameplay remain intact.


## v0.12.87 — Season Reward Release Gate
- Season Road booster tiers no longer award unreleased future subset packs before those sets are actually promoted live.
- Booster rewards now resolve only from the currently released player-facing set pool. In the current live build, that means SummerSlam — Series 1, Hall of Fame — Series 1 and Evolution — Series 1 only.
- Final Boss card milestones, UP rewards, Season tier count and all existing Rock reward placements remain unchanged.


## v0.12.87 — Live Event Prematch Alignment Hotfix
- Fixed Live Event prematch heading alignment on branded show days. The previous layout relied on a relative top offset for the heading, which caused the match title and rules callout to overlap.
- Branded RAW / NXT / SmackDown Live Event prematch screens now use a neutral "LIVE EVENT" eyebrow beneath the logo instead of repeating the show name as a second text line.
- The match title and rules card now sit in the normal document flow with corrected spacing, improving legibility and vertical balance on iPhone screens.


## v0.12.87 — Live Events Screen Redesign Pass
- Rebuilt the Live Events screen after the previous layout regressed. The screen now uses a cleaner full-page structure: a refined hero panel, a stronger featured fight panel, and a dedicated horizontal route strip for the five-match tower.
- Branded RAW / NXT / SmackDown event days no longer repeat the event name in multiple stacked places. The hero now uses a cleaner title and supporting copy while keeping the show branding.
- Removed the redundant thin match-status strip from the main screen in favor of a single featured action panel that carries the current opponent, match number, rule name and CTA.
- The route tracker is now a swipeable horizontal strip with larger cards and readable state labels instead of cramped five-column mini tiles.
- Presentation only; Daily Live Event rules, rewards, scheduling and progression remain unchanged.


## v0.12.87 — Pack Summary UP Containment Hotfix
- Fixed pack-complete summary alignment when one or more duplicate pulls convert to Universe Points.
- Converted UP tiles are now constrained to the exact same summary-card slot and aspect ratio as ordinary pulls instead of retaining reveal-sized intrinsic dimensions.
- Mobile summary grids are explicitly viewport-bounded and two-column cells can no longer expand past the iPhone screen edge.
- UP tile copy is now bounded and allowed to wrap inside its card face instead of forcing horizontal overflow.
- No pack odds, duplicate conversion values, Deck Assistance behavior, card data, progression or gameplay changed.
