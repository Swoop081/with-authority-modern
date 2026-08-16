# WWE Legacy v0.12.54 — Home Menu Hierarchy Audit

## Scope
Presentation/navigation only. No gameplay, balance, card, deck, economy, pin, counter, submission, Momentum, Entrance or Adrenaline changes.

## Top status bar
- Replaced the text WWE LEGACY/CCG brand lockup with the installed WWE Legacy app icon (`assets/icons/icon-192.png`).
- Increased the Season 1 label from the old micro-label treatment to a dominant status label.
- Increased Packs and Universe Points values to approximately triple their previous visual size so they fill their status cells.
- Existing Season progress bar and direct Season/Packs navigation remain intact.

## Home hero
- Removed the redundant `PLAY` eyebrow from the Enter the Ring CTA. The button now reads only `ENTER THE RING`.
- Increased the starter Superstar render to roughly twice the previous visual area on iPhone while preserving the left-side title/CTA mask.
- The Home Season strip continues using the dedicated user-supplied Final Boss Rock asset; v0.12.54 reframes it to expose more of the Final Boss vest/render rather than only a small upper-body crop.

## Home destinations
Replaced the two-column command rack + utility rail with six full-width rows in the exact requested order:
1. Deck Lab
2. Challenges
3. Open Packs
4. Store
5. My Collection
6. My Legacy

Visible naming changes:
- `Booster Vault` → `Open Packs`
- `Card Shop` → `Store`

The Open Packs screen and post-pack return copy use the same naming for consistency.

## Attention badge
- Home command badges now sit at the upper-right of the row rather than over the left-side eyebrow copy.
- This specifically prevents the Challenges `2` badge from covering `EARN REWARDS`.

## Options retirement
- Removed Options from the Home UI.
- Removed Options from the bottom navigation.
- Removed the Options navigation route and Options screen implementation.
- Reset/build tools remain available under My Legacy, avoiding duplicate settings destinations.

## Certification
- 244/244 automated tests pass.
- 50 Superstars / 50 decks / 434 gameplay cards.
- 0 validation issues / 0 orphans.
- 484/484 collector IDs / 0 issues.
- Flow audit: 50 Superstars / 0 issues.
- Browser/cache version aligned to 0.12.54.
