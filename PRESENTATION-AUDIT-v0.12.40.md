# v0.12.40 Presentation Audit — Featured Card Menus

## Regression identified
The missing card treatment predates v0.12.39. Historical release notes show v0.12.15 deliberately changed Play-mode hero artwork from collectible-card rectangles to clean Superstar renders. Home action tiles were also using the render helper rather than the collectible preview helper.

## Restored behavior
- Home action destinations render exactly one `.home-tile-card` through `superstarPreviewCardMarkup(...)`.
- Play mode destinations render exactly one `.mode-feature-card` inside `.mode-full-card-art`.
- The shared preview helper provides a finished custom card when available and a generated full-card fallback when it is not, avoiding a return to unframed portrait-only artwork.
- Existing compact/premium layout geometry is retained.

## Mobile presentation target
- Full-width Enter the Ring: one smaller card on the right, copy remains dominant on the left.
- Half-width Home destinations: one compact card on the right with the title/subtitle readable above it.
- Choose Your Path: one large card on the right, mode title and description remain unobstructed.

## Verification
- 183 / 183 automated tests pass.
- Rebuild validation: 0 issues.
- Card IDs: 0 issues.
- Flow audit: 0 issues.
