# WWE Legacy: Collectible Card Game — v0.12.08
## Premium Navigation + Dashboard Pass

### Deck Lab Superstar roster
- Rebuilt the Deck Lab Superstar entry grid around **full collectible card presentation** rather than portrait/name tiles.
- Existing finished Superstar card fronts are used directly.
- Superstars without a finished custom front receive a generated full-card fallback using their set identity, set logo, rarity stars, wrestler art/placeholder and name treatment.
- Deck validity remains visible as a compact overlay without covering the card artwork.
- Locked Superstars remain hidden exactly as before.

### Play — Choose Your Path
- Exhibition, Climb the Ladder and Championship Road tiles now use **larger full Superstar cards** on the right side.
- The cards remain secondary to the mode title, but are no longer tiny postage-stamp images.
- Tiles were changed to non-nested interactive containers so full card previews can be shown without invalid button-inside-button markup.
- Keyboard activation remains supported.

### Challenges premium dashboard
- Rebuilt the top of Challenges into an icon-led status view for Daily, Weekly and Milestone readiness.
- Set collection progress now uses branded set logos, progress rings, unique/Foil counts and unopened-pack counts.
- Daily and Weekly challenge cards now use clearer icons, progress bars, reward chips and compact claim states instead of long text rows.
- Milestone rows and lifecycle messaging received the same premium treatment.

### Season premium dashboard
- Season summary is now a **Season Command Center** with dedicated icons for Current Tier, Season XP, Universe Points and Next Drop.
- Tier progress uses a stronger dedicated progress header/bar.
- Tier reward rows now include reward-type icons and improved current-tier/final-reward presentation.
- The Final Boss hero keeps the same content but uses shorter copy and compact status chips for Tier, ready rewards and XP.

### Navigation alerts
- Alert badges with a value of **0 are removed from the DOM entirely**.
- Only positive/actionable values can render a badge or attention glow.
- This fixes stale red `0` badges on Season/Challenges and other destinations.

### Preserved from previous builds
- Full horizontally scrollable bottom navigation with all major tabs.
- Challenges dedicated tab and all major Home tiles.
- Deck Lab visual 3-wide card pickers, legality shading, Only Show Valid, editable Entrance/Lead Off 5 and deck validity checking.
- Compact Superstar match select.
- Larger Tonight's Main Event and Entrance show logos.
- Entrance effect callouts outside the flipped card.
- Arena/show-coloured live match buttons.
- Stronger Method-coloured Momentum cards.
- Premium Card Art Studio frame/typography and official Survivor Series Houston branding.

### Validation
- **80/80 automated tests pass.**
- **46 Superstars / 46 recommended decks.**
- **406 gameplay cards / 452 collector-manifest cards.**
- **0 orphan cards / 0 rebuild issues.**
- Card-ID audit: clean.
- Flow audit: clean.
- Deterministic final balance simulation: **4,140 matches, 0 stalls, 36.8 average turns**.
- Finish distribution: **3,225 pins / 610 submissions / 305 turn-limit draws**.

No canonical card values, Superstar designs, deck lists, booster contents or collector numbering changed in v0.12.08.
