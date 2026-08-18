# WWE Legacy v0.13.19 — Superstar Unlock Progression + Chase Rate Pass

This build corrects secondary Superstar progression and slows Superstar acquisition after the first day of external testing showed two Superstar pulls inside 15 packs.

## Superstar unlock progression
- The first chosen Superstar remains the onboarding exception and receives the complete authored 60-page deck.
- Every later normal Superstar unlock now grants only:
  - the Superstar identity card;
  - at most **1 authored Finisher**;
  - at most **1 authored Trademark**;
  - at most **1 authored Action**.
- If a Superstar has multiple Finishers, Trademarks or Actions, only the first applicable identity from the authored recommended deck is granted.
- Categories that are not authored for that Superstar grant nothing; Specials are not silently treated as Actions.
- Secondary unlocks do **not** grant shared Common/Uncommon filler, Lead Off pages, Once Too Often, extra Momentum, a Superstar-specific Entrance, or an automatically manufactured 60-page deck.
- Deck Lab remains the progression engine: it compares owned cards against the authored 60-page recommended blueprint, uses owned recommended cards first, fills gaps only from legal cards already in the Collection, and recommends authored upgrades as they are collected.
- Existing v0.13.18 saves are never stripped of cards or complete decks already granted by that build.

## Superstar chase
- Natural Superstar chase chance reduced from **5% to 2% per eligible pack**.
- Per-set hard pity increased from **50 packs to 100 packs** while an unowned Superstar remains available in that set.
- Superstar cards remain a separate pack-level chase and still count toward the one-4★-Very-Rare-per-pack ceiling.
- The unlock package is still applied only after all five booster pulls are rolled, preventing an unlock grant from influencing later cards in the same pack.
- Normal rarity weights remain **50% Common / 30% Uncommon / 15% Rare / 5% Very Rare**.

## Presentation and rules
- Superstar unlock presentation now tells players that core identity cards were added and directs them to build from their Collection instead of claiming a starter deck was installed.
- My Legacy Rulebook now documents the lean secondary grant and the **2% / 100-pack** Superstar chase.
- Profile schema remains **30**; no save-structure migration was required.

## Scope
- No card balance, HP, Method limits, Move effects, deck blueprints, Store prices, duplicate values, release dates, artwork assets or normal booster rarity weights changed.
- Active hidden pre-release scope remains currently released content + RAW Series 1 only.
