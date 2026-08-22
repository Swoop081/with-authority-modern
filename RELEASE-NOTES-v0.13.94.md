# WWE Legacy v0.13.96 — Onboarding Card + Pack Presentation

Supersedes v0.13.93. Presentation-only onboarding update; gameplay, rewards, card data, Season 1 Cena, Attitude Era Rock, four-tier progression, starter grants and live-set availability are unchanged.

## Starter Superstar presentation
- CM Punk and Roman Reigns are now shown as their actual collectible **Superstar card faces** during first-time starter selection.
- Both are displayed as **Normal-tier** cards, matching the fresh-save grant.
- The screen continues to award the selected Superstar's complete 60-page Normal starter deck.

## Welcome set presentation
- Evolution, New Generation, Golden Era, Attitude Era and SummerSlam are now represented by their **physical booster-pack designs** rather than generic set-logo tiles.
- The pack is the selection object only: choosing it still awards **one random eligible Superstar from that set plus a complete 60-page Normal deck**.
- The five packs use a compact 3-over-2 iPhone grid.
- New Generation receives a dedicated blue/yellow physical wrapper treatment.

## Welcome reveal
- v0.13.93's full-height Welcome Superstar card reveal remains unchanged.

## v0.13.96 — Asset Recovery + Flat Image Directory

- Recovered the user-supplied image library from the original GitHub export after the prior package omitted most card art.
- All retained image files now live in one flat `assets/images/` directory; no image remains in a move/action/headshot/set subfolder.
- Card Art Studio, live card resolver, Superstar fronts, HUD headshots, menu portraits, logos, templates, UI art and manifest/icon references now point to the flattened filenames.
- Recovered headshots are retained and renamed as `headshot-<superstar-id>.webp`.
- Current card fronts use clean names such as `card-layered-move-<id>.webp`, `card-custom-action-<id>.webp` and `card-custom-superstar-<id>.webp`.
- Missing card artwork still falls back to the canonical rules/details face; no obsolete image is substituted merely because an old path once existed.
- Removed known retired/dead legacy image files while preserving the supplied current artwork library.
- Welcome onboarding no longer inherits the persistent app-chrome top offset, removing the large black gap at the top of the iPhone Welcome screen.


## v0.13.96 — Card Face Overlay Cleanup + Welcome Spacing Hotfix

- Removed the redundant lower-right printing/stat badge from collectible Move card fronts. Labels such as `EMERALD D15` and `NORMAL D5` no longer cover the artwork/card frame.
- Printing identity and live tier values remain available through the existing tier treatment, surrounding UI, and card rules/details face; this is a presentation-only removal of the extra front overlay.
- Corrected the high-specificity persistent app-chrome selector so `welcome-superstar` is explicitly excluded from its top padding.
- Welcome Superstar reveal is top-anchored and its brand row is constrained, eliminating the large black band that could still remain above the WWE Legacy logo on iPhone.
- No gameplay, balance, collection, booster odds, tier values, rewards, deck data, live-set availability, or Season 1 progression changed.


## v0.13.97 — Card Art Studio Export Hotfix

- Fixed Card Art Studio export failure for **John Cena — Season 1: The Last Time Is Now** when the Studio is opened directly from an extracted local folder (`file://`).
- Root cause: locally loaded set-logo files could taint the export canvas even when the user-selected artwork itself was export-safe.
- Card Studio now embeds export-safe copies of every packaged set logo for local-file sessions, including Cena Season 1, New Generation, Attitude Era, RAW, SmackDown, Worlds Collide, Money in the Bank and Survivor Series.
- Corrected exported filenames so they exactly match the flat install path shown in the Studio rather than using only the card art key.
- Example Superstar layered export: `card-layered-superstar-john-cena.webp`.
- Example Move layered export: `card-layered-move-mr-perfect-perfect-plex.webp`.
- Legacy/custom-front and HUD-headshot exports follow the same canonical destination naming rule.
- PNG fallback preserves the canonical basename and changes only the extension.
- No gameplay, balance, card data, pack odds, rewards, progression, collection state or live-set availability changed.


## v0.13.98 — Razor Abdominal Stretch Replacement

- Retired **Razor’s Running Powerslam** from Razor Ramon’s exclusive New Generation signature block.
- **NG1-016** now belongs to **Razor’s Abdominal Stretch**, preserving the collector identity rather than adding or renumbering the set.
- Razor’s Abdominal Stretch is a **3★ Rare Trademark Submission**: **Cost 5**, **Technical 2**, standing opponent only, with **+5 persistent Chest damage per successful turn**.
- Razor’s authored 60-page deck replaces all three copies of the retired exclusive Running Powerslam with three copies of Razor’s Abdominal Stretch.
- Razor’s Fallaway Slam now discounts **Razor’s Chokeslam** directly so its combo remains legal after Fallaway Slam grounds the opponent.
- Existing player ownership migrates every Normal / Emerald / Sapphire / Ruby copy of the retired card one-for-one to Razor’s Abdominal Stretch. Saved Deck Lab references migrate to the new id as well.
- Card Art Studio uses the canonical replacement filename `card-layered-move-razor-ramon-abdominal-stretch.webp`.
- No changes to pack odds, reward economy, Season 1 Cena, live-set availability, Superstar HP, or the flat `assets/images/` layout.


## v0.13.99 — Attitude Rock Finisher Pass

- **Rock Bottom (AE1-058)** is now Attitude Era Rock’s **4★ Very Rare Finisher**: Cost 10 / Damage 17 / no Method requirement / grounds opponent.
- **People’s Elbow (AE1-057)** is now a **3★ Rare Trademark**: Cost 7 / Damage 12 / Strike 2 / grounded opponent only. On Connect it searches/draws Rock Bottom and gives it a 2-Cost discount for the current Control sequence.
- Retired **The Rock’s Samoan Drop** from AE1-060 and replaced it with **Lay The Smack Down**, preserving the collector identity. Lay The Smack Down is a 3★ Rare exclusive Strike at Cost 4 / Damage 7 / Strike 2; on Connect the opponent loses 1 Adrenaline.
- Attitude Rock’s authored 60-page deck uses three copies of Lay The Smack Down and retains two copies of the normal shared **Samoan Drop**.
- Existing ownership of the retired AE1-060 card migrates one-for-one across Normal / Emerald / Sapphire / Ruby printings, and saved Deck Lab references migrate to Lay The Smack Down.
- No pack odds, rewards, Season 1 progression, live-set availability, Superstar HP or unrelated card balance changed.

## v0.14.00 — Tabled UI Consolidation

- Rolled every outstanding item from the current WWE Legacy running/tabled change list into this build instead of shipping only the latest discussed item.
- Centered the physical **John Cena Season 1 completion Superstar card** inside the left-side launch/continue promo bay. The card remains the reward-card presentation on that screen; only its alignment changed.
- Added the official transparent **John Cena profile render from WWE.com** as `assets/images/art-wwe-menu-superstars-john-cena.webp` and use it for Season 1 character-hero presentation on the Home Season 1 tile and Season Road hero.
- Fixed the extra/duplicate Superstar name box seen on Live Event route cards. The renderer now distinguishes between layered Superstar fronts with a blank nameplate area and finished flat/custom fronts that already bake the Superstar name into the image. Runtime nameplates remain on layered fronts but are automatically hidden when the layered asset falls back to a finished flat Superstar front.
- This also prevents the same duplicate-nameplate condition on other surfaces that reuse those finished flat Superstar fronts, without stripping names from layered cards such as Razor Ramon.
- No gameplay, balance, pack odds, rewards, Season XP, Season tier structure, live-set availability, collection ownership or authored deck data changed.
