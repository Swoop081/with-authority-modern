# WWE Legacy v0.13.50 — Season Fixed Viewport Hotfix

## Fixed
- The Season tab's permanent header is now **physically pinned to the viewport**, not merely separated from the tier scroller in document flow.
- The complete **Season One** hero with The Rock, the three **Current Tier / Rewards Ready / Universe Points** tiles, and the **Free Booster** strip always remain visible directly beneath the global WWE Legacy top band.
- iPhone Safari can no longer restore a stale page scroll offset that clips the Season header and opens the tab looking like a tier-only screen.
- The lower reward-road area is the only vertical scroller. The **100-Tier Reward Road** label now moves with that lower scrolling content rather than occupying the frozen header area.
- Entering or rerendering the Season tab explicitly clears document scroll offsets as a second Safari safeguard.
- Current-tier auto-focus continues to target only the internal Season road scroller.

## Retained
- v0.13.48 Home **SEASON ONE / DECK LAB** typography parity remains locked.
- v0.13.47 Safari card-art broken-image flicker protection remains locked.
- All v0.13.45 Worlds Collide / Mr. Iguana content and all existing gameplay, balance, economy, reward, deck, collector, profile-schema and release-calendar behavior are unchanged.
