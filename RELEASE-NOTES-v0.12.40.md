# WWE Legacy: Collectible Card Game — v0.12.40
## Featured Card Menu Restoration

v0.12.40 restores the collectible-card identity to the two menu surfaces highlighted during iPhone testing: Home action tiles and Play → Choose Your Path.

### Home action tiles
- Restores one framed Superstar collectible to each destination rather than using a cropped wrestler render.
- Featured cards: Roman Reigns — Enter the Ring; Stone Cold Steve Austin — Card Catalogue; IYO SKY — Booster Packs; CM Punk — Deck Lab; Becky Lynch — Challenges; the profile starter — My Legacy; Gunther — Card Shop; Cody Rhodes — Options.
- Uses the shared Superstar preview-card renderer so a finished custom Superstar front is shown when installed and a generated set-branded full-card fallback is used otherwise.
- Cards remain secondary to tile copy, with compact right-side placement, controlled rotation and drop shadow.
- v0.12.39's consolidated Season 1 hero remains unchanged.

### Play — Choose Your Path
- Reverses the v0.12.15 presentation decision that replaced collectible cards with clean Superstar renders.
- Exhibition now features one Cody Rhodes card.
- Climb the Ladder now features one Gunther card.
- Championship Road now features one Roman Reigns card.
- Full cards sit to the right of the mode identity and remain non-interactive inside the accessible mode-card hit target.
- Existing premium title, spacing and navigation behavior remain unchanged.

### Scope
- Presentation/navigation only.
- No gameplay, AI, pin curve, Counter logic, retained-Control draw, Momentum, Entrance, Adrenaline, roster, deck or card-value changes.

### Certification
- Automated tests: 183 / 183 pass.
- Validation: 50 Superstars / 50 decks / 432 gameplay cards / 0 orphans / 0 issues.
- Card-ID audit: 0 issues.
- Flow audit: 0 issues.
