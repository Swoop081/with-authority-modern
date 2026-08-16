# v0.12.46 Presentation Audit — iPhone Density + Hierarchy

## Why this pass exists
v0.12.44 established the new game-first visual architecture and v0.12.45 cleaned the first obvious spacing regressions. Direct iPhone screenshots then exposed a second layer of problems: useful content was still being delayed by empty space, duplicate information, clipped product art, and legacy web-form layouts.

## Screenshot findings and corrections

### Home
The new Home composition is substantially stronger and remains intact. No new architecture change was needed here; the pass instead focuses on screens that still lag behind Home.

### Play
The mode banners were visually strong but their collectible cards were visibly cropped below the banner boundary, while a large unused black zone remained above bottom navigation. v0.12.46 fully contains the cards and lets the three banners stretch to consume the available viewport.

### Deck Lab
With only CM Punk unlocked, the entire screen was a single card in the upper-left followed by empty space. Choosing between one option is not a meaningful interaction. v0.12.46 bypasses the chooser for one-Superstar profiles. The chooser remains only when there is an actual choice to make.

### Season
The Season hero repeated Tier and XP values already shown in persistent chrome and was tall enough that the Command Center was still mostly below the fold. The hero is now reward-focused, with the first progression controls moved upward by reducing hero/status/free-pack height.

### Challenges
Set Progress was acceptable, but one completed Daily Challenge still consumed most of the remaining viewport. Goals are now command rows: name/progress/reward stay readable while the Claim action occupies a fixed right-side control.

### Booster Vault
The horizontal shelf architecture was correct, but one pack sat against the left edge with a large empty shelf to its right. The small pack also inherited typography designed for the large pack-opening render, causing visible clipping. Single-pack shelves now centre and the compact pack has dedicated typography.

### Store
The featured pack had the same inherited-typography problem, visibly clipping `EVOLUTION`. Superstar inventory was still a vertically stacked information list. v0.12.46 gives the compact pack a dedicated type scale and converts Superstar inventory into a horizontally swipeable collectible-card product shelf.

### Collection
The hero had too many responsibilities: title, description, view switch, set switch, four statistics and character art. Set tabs visibly ran into the artwork and were clipped. Set navigation now owns a separate horizontal rail and filters collapse below a permanently visible search field. The card grid appears much earlier.

### Catalogue
This was the clearest remaining web-app screen. An always-open 20+ control form occupied essentially the entire first viewport before a single card could be seen. Search is now always visible, primary filters are collapsed by default, and specialist Move filtering is nested one level deeper. The default experience is now catalogue-first rather than form-first.

### My Legacy
The previous profile screen used one large hero, a separate starter panel and five large metric boxes despite having very little data. The new command band treats these as one identity/progress component and exposes Career Tools much sooner.

## Design principle carried forward
The pass does not add more decoration. It follows a stricter rule: **every first-screen element must justify the vertical space it occupies.** Persistent chrome should not be repeated inside screen heroes; controls should expand only when the player asks for them; collectible/game content should appear before administrative filters and settings.
