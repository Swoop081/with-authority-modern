# WWE Legacy: Collectible Card Game — v0.12.14
## Pre-1.0 Presentation + Rules Pass

v0.12.14 consolidates the final running UI/gameplay punch-list gathered from hands-on mobile testing of v0.12.13. It is intended as the next working baseline on the road to Version 1.0.

### Core match rules and flow
- Fixed turn-start draw timing. Turn 1 still begins from the Lead Off 5; every new turn after Turn 1 draws exactly one page for the Superstar whose turn begins, including when Control is retained.
- Failed pins now always transfer Control to the opponent.
- Successful pins use the visible 1 → 2 → 3 presentation before Match Complete instead of jumping directly to the result.
- Match actions are simplified contextually: a legal post-move pin state shows one centered `PIN` action; response/counter states use a centered `PASS` action rather than redundant paired controls.
- Submission tap-outs no longer occur solely from an HP/body-damage comparison. A tap becomes eligible only after that body area has previously been worked by another connected Submission, or from Submission Turn 3 onward while the current hold remains applied.
- Submission victories now receive a visible submission-resolution / tap-out presentation before Match Complete.
- First-match tutorial now teaches Momentum before Moves and explains why permanent Momentum matters.
- Added regression coverage for retained-Control draws, failed-pin Control transfer and Submission Turn 3 eligibility.

### Momentum visual system
- Global method colors are now Strength orange, Strike red, Technical green and Agility blue.
- Momentum presentation has been updated across HUD/chips and card UI.
- Momentum cards now use full-card flame treatments with the method name, `MOMENTUM` and `+1` emphasized rather than the old symbol-first presentation.

### Match presentation
- Active show/set accenting now drives general match chrome. Evolution uses purple, with equivalent themed accents available for other shows.
- Standardized left/right Superstar HUD HP alignment.
- Enlarged show logos on match-intro and Entrance presentation screens.
- Removed UI shading over collectible-card faces so printed artwork/text remains unobstructed.
- Rules/flip sides inherit set-themed visual treatment instead of a generic black reverse.
- Fixed play-pile label clipping and overflow handling.

### First-time flow
- Starter selection is now a compact side-by-side comparison intended to fit within a single mobile viewport.
- Removed redundant starter deck-size/readiness copy and other onboarding prose.
- Removed the post-starter “Choose What You Want to Chase Next” interstitial; starter selection now enters the main experience directly.

### Season
- Reworked the Season hero and removed stray/ghost supporting card layers.
- Moved Daily Login Booster above the Season Command Center.
- Command Center is organized as a 2×2 dashboard: Current Tier, Season XP, Universe Points and Next Drop.
- Replaced generic stat-box styling with stronger Season-tinted surfaces.
- Future roadmap entries use their actual set/show logos and less placeholder prose.
- Removed Season 2 Rotation Preview and the duplicate lifecycle note from Challenges.
- Removed the hard-coded live-content day count from the Season hero.
- Added a full-screen Tier Up presentation that clearly announces the tier reached and reward unlocked before returning to the Season screen.

### Packs and rewards
- Fixed decorative/divider layers crossing through booster-pack artwork/text.
- Tightened pack-opening presentation and pack-complete layout.
- Pack-complete actions are available at the top without requiring a long scroll.
- Rarity/foil/new metadata no longer sits on top of the collectible-card frame.

### Deck Lab / Store / navigation
- Deck Lab Superstar cards no longer duplicate card-face text with UI overlays.
- Lead Off 5 now displays actual collectible-card miniatures rather than text-only placeholders.
- Store Superstar purchase rows have improved action spacing.
- Global presentation pass reduces nested “box inside box” styling in favor of spacing, hierarchy, tint and lighter grouping.
- Persistent navigation order is now: Home → Play → Deck Lab → Season → Challenges → Packs → Store → Collection → Catalogue → My Legacy → Options.

### Other UI polish
- Fixed Options reset controls so Cancel no longer collapses into a vertical label.
- Home booster notification badge is positioned clear of tile copy.
- Play mode tiles use integrated Superstar presentation art instead of small floating card thumbnails.
- Reduced shared ghost-card/header decoration across menu heroes.

### Validation
- Automated regression suite expanded from 95 to 97 tests for the new rules paths.
