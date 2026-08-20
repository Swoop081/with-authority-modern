# WWE Legacy v0.13.71 — Build Certification

**Build:** v0.13.71 — Live Event UI + Counter Integrity Pass  
**Frozen:** 20 August 2026

## Automated regression
- **687 / 687 tests pass** in the source tree.
- Nine v0.13.71 regressions cover Entrance hero layering, Live Event PLAY labels, birthday-boss ordering and route containment, Action/Move Counter legality, pin-result secrecy, true Pack Complete 2/1/2 centering, overflow-name marquee behavior, post-pack comparison containment, and Championship Road copy cleanup.
- All v0.13.70 and earlier regression coverage remains green.

## UI / interaction certification
- Entrance screens reserve separate show-logo, ability/status-callout and entrance-heading bands; callouts cannot sit behind the show logo.
- Available Live Event tiles restore readable **PLAY** copy without changing the existing event colour system; active runs retain contextual **CONTINUE** copy.
- The shared Live Event route rail contains complete opponent previews on iPhone, including artwork, name and subtitle, without vertical clipping.
- Birthday Live Events place the featured birthday Superstar in Match 5 / the final route position, including pre-run previews and repaired persisted runs.
- Pack Complete uses a fixed, hard-centered **2 / 1 / 2** slot layout. Highest rarity occupies the center; ties resolve by NEW, then Foil, then original pull order.
- Overflowing layered card names marquee only after measured overflow; fitting names remain static and the animation stays within the authored name plate.
- Post-pack Deck Assistance comparison panels reserve stable card/caption/body-copy space so previews cannot cover text.
- Championship Road removes the redundant persistence/difficulty explanatory prose and simplifies the selected-Superstar command panel.

## Counter / pin integrity certification
- Standard Move Counters now require the incoming card to be a **Move**. Actions/supports such as **Crowd Support** cannot be answered by a normal Move Counter such as Senton merely because a physical state matches.
- Both the direct `canCounter` path and `counterEligibility` path enforce the incoming-Move requirement; authored explicit reactive exceptions remain separately governed by their own rules.
- Pin-count presentation through the 1-count and 2-count obscures the underlying match UI consistently regardless of the eventual kickout result, removing the early hand-visibility tell.
- The accepted actual-HP pin probability table is unchanged.

## Data validation
- **62 Superstars**
- **62 decks**
- **562 gameplay cards**
- **0 orphan cards**
- **0 validation issues**

## Flow / collector audits
- Flow audit: **62 Superstars / 0 issues**
- Card-ID audit: **624 / 624 collector cards / 0 issues**
- Counter-State audit: **562 gameplay cards / 62 decks / 0 issues**
- Card-effect audit: **45 internal-test Superstars / 443 scoped gameplay cards / 281 effect-bearing cards / 0 issues**

## Artwork audit
- Collector cards audited: **624**
- Custom fronts currently missing: **584**
- Missing-front count is unchanged from v0.13.70; canonical fallback presentation remains expected for those cards.

## Simulation certification
The counter-integrity hardening was rechecked against both roster simulation suites:
- Released-roster launch balance: **6,000 matches / 0 stalls / 26.95 average turns**
- Internal/pre-release balance: **19,800 matches / 0 stalls / 25.12 average turns**
- Diesel internal/pre-release cross-field: **880 matches / 59.4% win rate / 0 stalls / 24.4 average turns**

## Release scope
No card values, deck composition, collector numbering, pack odds, economy values, progression requirements, rewards or release dates change in this pass. The only rules-engine behavior change is stricter normal Counter eligibility for incoming Actions/supports. All v0.13.70 and earlier accepted systems remain authoritative unless explicitly superseded above.
