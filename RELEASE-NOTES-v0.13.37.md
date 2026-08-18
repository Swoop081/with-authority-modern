# WWE Legacy v0.13.37 — Hub + Selector Consistency Pass

v0.13.37 supersedes v0.13.36 as the current working baseline.

## Live Events hub polish
- Live Events selection cards are compressed into a cleaner Play-style stacked layout.
- Decorative Superstar renders are removed from Money in the Bank, Daily, 3-Day and Weekly event tiles.
- Event titles are larger and more dominant while progress text remains compact.
- Primary CTAs stay on the left and `ENDS IN` / `RESETS` timing metadata sits on the right, preventing timer chips from overlapping buttons.

## Shared Superstar selection system
- The Exhibition horizontal Superstar carousel is now the standard player-facing character selector.
- Deck Lab and Live Event tower setup use the same horizontal selector component rather than stacked vertical roster cards.
- First tap on a different Superstar selects that Superstar and updates the primary action without flipping the card.
- A second tap on the already-selected Superstar flips to details; subsequent taps toggle front/back.
- Switching to another Superstar always selects first before any flip interaction.

## Home + Season presentation
- The Home `Season One` destination tile now matches Deck Lab / My Challenges headline font, weight, italic treatment, spacing and padding rhythm.
- The Season page wraps its hero/context and Free Booster control in a sticky shell.
- When the reward road scrolls or auto-focuses the current tier, a compact sticky state preserves current Season/tier context and the Free Booster claim/countdown.
- The 100-tier road continues to auto-focus the player's current tier without horizontally shifting the page.

## Theme tile system
- Recently introduced themed stat tiles now use full-fill alternating theme-color / white surfaces rather than black panels with colored accent strips.
- Packs uses full orange / white alternation across its four summary tiles.
- Equivalent recent mode stat rows use their screen theme color / white treatment with contrast-safe text.

## King of the Ring density
- The King of the Ring hero no longer reserves a large empty portrait-height region.
- Crown / Best Run / Life / Field tiles now sit directly beneath the title and subtitle in normal document flow.
- Existing gold/purple KOTR identity and bracket presentation are unchanged.

## Unchanged
- No gameplay-card balance, Superstar HP, authored-deck, collector-number, booster odds, duplicate-UP values, reward-economy rules, release calendar or profile-schema changes.
- v0.13.36 Super Pack completion and Deck Lab ownership hotfixes remain intact.
- Profile schema remains **31**.
