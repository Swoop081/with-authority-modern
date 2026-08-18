# WWE Legacy v0.13.23 — King of the Ring Presentation + Coronation Pass

## Tournament presentation
- King of the Ring now presents a persistent **8-Superstar bracket** through Quarterfinals, Semifinals and the Final.
- Completed CPU matches resolve visibly in the bracket and winners are marked as advancing.
- The player's current matchup is highlighted and the Final receives dedicated **KING OF THE RING FINAL** treatment.
- Winning the Final no longer jumps straight to a booster reward. The flow is now **Final victory → match result → coronation → reward choice**.

## Coronation
- The tournament winner receives a dedicated full-screen **King of the Ring coronation** using their Superstar card and crown presentation.
- **CLAIM THE CROWN** completes the coronation before the reward selection appears.
- The most recent tournament winner is stored as the **Reigning King**.
- The Play tile uses the Reigning King as its featured Superstar until another King is crowned.
- My Legacy now includes a compact King of the Ring career panel showing career crowns and the current Reigning King. This does not expand or alter the Achievements system.

## Choose-one booster reward
- A King of the Ring tournament still awards the value of **exactly one standard booster**.
- The champion now chooses **one of three different released-set booster options**.
- When exactly three collectible sets are live, all three are offered.
- Once more than three sets are live, **three unique released sets are randomly selected** when the tournament is won.
- The three options are persisted in the tournament save and **cannot be rerolled** by leaving, refreshing or reopening the screen.
- Choosing one pack grants that single booster; the other choices disappear.
- There are still **no per-round booster rewards**.

## Save compatibility
- Existing v0.13.22 King of the Ring winners that already received the old automatic booster are detected as legacy-resolved and cannot receive a duplicate choose-one reward after upgrading.
- Reigning King and reward-choice state are additive inside the existing King of the Ring profile state.
- Profile schema remains **30**.

## Unchanged systems
- King of the Ring remains an 8-Superstar, three-round, one-loss-elimination tournament.
- Daily Climb the Ladder remains in Challenges with 8 opponents, 3 lives and local-midnight reset.
- Superstar chase remains **2% natural** with one global **100-miss pity**.
- Secondary Superstar unlocks remain Superstar + at most 1 Finisher, 1 Trademark and 1 Action; no manufactured 60-page deck or Superstar-specific Entrance auto-grant.
- Special remains retired as a collectible type; triggered/reaction cards remain Actions with their established timing.
- No gameplay/card balance, HP, Method limits, Store prices, duplicate values, release dates, normal booster rarity weights, artwork assets or authored recommended deck blueprints changed.

## Certification
- See `BUILD-CERTIFICATION.md` for the final v0.13.23 audit results.
