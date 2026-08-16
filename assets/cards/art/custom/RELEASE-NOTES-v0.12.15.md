# WWE Legacy: Collectible Card Game — v0.12.15

## Corrective Presentation + Deck-Legality Pass

v0.12.15 is a corrective release built directly from the packaged v0.12.14 artifact. It addresses items that v0.12.14 release notes claimed too broadly but did not fully deliver at runtime. This release deliberately distinguishes automated/source verification from final iPhone visual approval.

### Tier Up — rebuilt as an actual full-screen event
- Tier progression is now queued whenever Season XP crosses one or more 100-XP thresholds from a completed match or a claimed Daily/Weekly Challenge.
- Tier Up renders in a dedicated body-level fixed layer (`#tier-up-layer`) above the entire app rather than inside the Match Complete card.
- The presentation occupies the full safe mobile viewport, locks background scrolling, animates TIER UP / TIER X REACHED, fills the XP bar, and reveals the newly unlocked tier reward before Continue.
- Booster rewards show the set-branded pack; Universe Point milestones show the UP reward; Tier 50 shows the Final Boss reward.
- Tier 10/20/30/40/50 milestones receive the larger prestige treatment.

### Match HUD — HP lanes rebuilt symmetrically
- Player and CPU HP now use the same fixed-height 78px HUD row and the same 66px HP lane, mirrored left/right rather than independently positioned.
- Number and HP label use identical flex centering, line-height and spacing on both sides.
- A 390px mobile override preserves the same mirrored geometry with a 60px HP lane / 72px row.

### Booster opening — rebuilt flow
- Opening a booster now enters a sealed-pack stage first; it no longer jumps directly into card review.
- The pack must be tapped to rip open, with a dedicated opening transition before the first card appears.
- Cards reveal one at a time with rarity atmosphere, foil treatment and external NEW / FOIL / unlock metadata so the collectible face stays unobstructed.
- The fifth card transitions into a Pack Complete summary.
- Pack Complete actions are at the top: Open Another Pack when available / Review Upgrades, plus Return to Booster Vault. The five pulls remain below for inspection.

### Other v0.12.14 misses corrected structurally
- Removed the obsolete post-starter `launch-releases` screen/function instead of merely bypassing it.
- Removed the Deck Lab `VALID` / duplicate-name overlay from Superstar card faces.
- Play-mode hero artwork now uses clean Superstar renders instead of collectible-card rectangles.
- Corrected the Home attention-badge selector so badges anchor to `.main-menu-tile` rather than covering tile copy.
- Play-pile outer containers now allow the red context/status label to render without being clipped.
- Set-themed rules backs now include their set logo treatment rather than only a dark generic reverse.
- Card Art Studio visible build label and all browser cache keys now match v0.12.15.

## Locked-content regression fixes
- Kane — `Hellfire and Brimstone` restored to its locked +1 Agility Momentum / +1 Adrenaline pre-match package.
- Becky Lynch — `Straight Fire` restored to its locked +1 Agility Momentum / +1 Adrenaline pre-match package.

## Recommended-deck legality cleanup
A new automated deck-legality test rejects recommended-deck Moves/Counters whose Method requirement is above that Superstar's Method Limit or above the maximum Method supply the build can actually provide.

The audit removed/replaced unreachable pages while preserving 55 pages and 12 Momentum per deck, including affected Logan Paul, Sol Ruca, Chad Gable, Danhausen, Chelsea Green, Damian Priest and Jade Cargill recommended decks. Replacements use legal pages without changing canonical card values.

## Dead-turn balance audit
The old `0 stalls` metric only proved matches eventually finished; it did not measure boring draw/pass stretches. v0.12.15 adds `npm run dead-turns` as a separate flow metric.

After the deck-legality cleanup across all 2,450 ordered roster matchups:
- 14,689 explicit pass decisions
- 6.00 pass decisions per match
- 288 matches (11.8%) contained a 4+ consecutive-pass streak
- longest observed pass streak: 15
- CM Punk: 3.78 passes per match; 20.4% of his simulated matchup samples participated in a 4+ pass-streak match

This is improved slightly by removing impossible pages, but it is **not considered solved**. A later balance pass should reduce long no-play stretches without inventing a new rescue-draw rule unless that rule is deliberately approved.

## Certification
Workspace certification after the corrective changes:
- Automated tests: **102 / 102 pass**
- Flow audit: **50 Superstars / 0 issues**
- Rebuild validation: **50 Superstars / 50 decks / 422 gameplay cards / 0 orphans / 0 issues**
- Collector ID audit: **472 / 472 / 0 issues**
- Deterministic balance simulation: **2,450 matches / 0 stalls / 21.99 average turns**
  - 2,156 pin finishes
  - 288 submission finishes
  - 6 turn-limit finishes
- Launch-set economy simulation: **60 packs / 300 cards / 0 Entrance leaks / 0 foil-first failures**

Presentation is source/automated-verified here, but final visual approval remains the real-device iPhone pass.
