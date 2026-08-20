# WWE Legacy v0.13.71 — Live Event UI + Counter Integrity Pass

Frozen 20 August 2026. This build supersedes v0.13.70.

## Locked changes

- Entrance presentation now reserves separate vertical bands for the show logo, entrance callout/ability row, and the `YOUR ENTRANCE` / `OPPONENT ENTRANCE` heading so callouts cannot stack behind the logo.
- Available Live Event hub tiles restore a readable `PLAY` CTA while retaining the existing cyan, magenta, orange, purple, teal, red and blue event identities. Active runs continue to use contextual `CONTINUE` copy.
- The shared Live Event route rail now uses compact full-card opponent previews on iPhone instead of vertically clipping the opponent artwork, name or match subtitle.
- Birthday Live Events preserve the featured birthday Superstar as Match 5 / the final opponent. The pre-run route preview now communicates that same boss-last rule.
- Counter legality is hardened so standard Move Counters can only answer incoming Moves. Actions/supports such as Crowd Support cannot be answered by Senton or another normal Move Counter merely because a physical state happens to match. Existing explicitly reactive cards such as Once Too Often remain governed by their authored exception rules.
- Pin-count presentation through `1!` and `2!!` now obscures the underlying match interface identically regardless of the eventual kickout result, eliminating the early hand-visibility tell.
- Pack Complete summaries use a literal fixed two-column `2 / 1 / 2` stack centered as a group. The highest-rarity pull remains the middle featured card, with ties resolved by NEW, then Foil, then original pull order.
- Layered card fronts now measure overflowing authored Move names and marquee only when the name actually exceeds the name plate. The movement pauses at the beginning and end and remains confined to the existing plate.
- Post-pack Deck Assistance comparison rows reserve caption/name space so card previews cannot overlap the replacement title or explanatory copy.
- Championship Road removes redundant explanatory sentences from the hero, difficulty-status area and selected-Superstar command panel, eliminating the reported odd wrapping/collision.

## Data / economy impact

- No card values, collector numbers, deck lists, pack odds, rewards, economy values, progression requirements or release dates changed.
- The only rules-engine behavior change is stricter validation of what can enter a normal Move Counter exchange.
