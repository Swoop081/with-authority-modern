# WWE Legacy v0.13.34 — Victory + Super Pack Economy Pass

## Universal victory rewards
- Every completed **match victory** in Exhibition, Live Events, King of the Ring, Money in the Bank and Championship Road awards **1 normal booster**.
- **Losses award no match reward** and now award **0 match Season XP**.
- Victory booster routing respects the active mode/reward set so the earned pack remains relevant to the content being played.
- Existing Live Event UP paid for victories is preserved and remains additive to the new victory booster.

## Super Packs
- Full mode/tournament clears now award **1 additional Super Pack**:
  - King of the Ring championship.
  - Live Event tower clear.
  - Money in the Bank 8-level clear.
  - Championship Road full-road clear.
- King of the Ring keeps its post-crown **choose one of three released sets** flow; the chosen reward is now that set's Super Pack.
- Super Pack specification:
  - **5 cards**.
  - First pull guaranteed **Foil** and **Rare-or-better**.
  - Boosted slot weights: **25% Common / 40% Uncommon / 27% Rare / 8% Very Rare**.
  - Up to **2 Very Rares** per Super Pack.
- Superstar chase remains unchanged at **2% natural chance** with the existing **100-pack global pity**.

## Duplicate economy
- Overflow duplicate conversion is now rarity-based:
  - **Common: 1 UP**.
  - **Uncommon: 2 UP**.
  - **Rare: 3 UP**.
  - **Very Rare: 4 UP**.
- Foil overflow uses the **same rarity value**; Foil no longer pays a separate duplicate premium.
- Copies below a card's ownership cap are still retained normally and do not convert to UP.

## Save migration and presentation
- Profile schema advances to **31** with `superPackCreditsBySet`.
- Any unclaimed legacy Money in the Bank completion-pack or Championship-pack credits migrate into the corresponding generic Super Pack balance so earned rewards are not lost.
- Booster Vault and match-result presentation now identify **Super Packs** separately from normal Series 1 boosters.

## Content integrity
- No card Cost, Damage, Method, effect, deck, collector-number, release-date, Superstar-stat or counter-rule changes are included.
- All v0.13.33 Legend Trademark + Shared Move content remains intact.
