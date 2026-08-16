# WWE Legacy: Collectible Card Game

Current working build: **v0.12.64 — Momentum Front Exception Pass**.

v0.12.64 supersedes v0.12.63. Method Momentum is now the explicit exception to the generic missing-custom-front fallback: Strength, Strike, Technical and Agility Momentum keep the existing authored WWE Legacy live fronts rather than falling back to a card back. Momentum still flips to its canonical rules/details back.

For all other non-Superstar collectible cards, the v0.12.63 fallback remains intact: a custom finished front overlays the front when installed; if that image is missing or fails to load, the original WWE Legacy rules/details back remains visible instead of a blank rectangle. Superstar presentation is unchanged.

The v0.12.62 Daily Booster Button Pass, v0.12.61 Final Boss launch scale correction, and all v0.12.60 Season / Deck Lab cleanup work remain intact. No gameplay, balance, ownership, deck, booster, or collector-data rules are changed.

Certification: **297/297 automated tests pass**; validation reports **50 Superstars / 50 decks / 435 gameplay cards / 0 orphans / 0 issues**; flow audit reports **50 Superstars / 0 issues**; card-ID audit reports **485/485 / 0 issues**.

See `RELEASE-NOTES-v0.12.64.md` for the complete change list.
