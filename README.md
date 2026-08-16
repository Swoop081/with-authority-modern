# WWE Legacy: Collectible Card Game

Current working build: **v0.12.63 — Card Back Fallback Pass**.

v0.12.63 supersedes v0.12.62. It fixes blank collectible cards when a private/custom finished-front WebP is not installed. Every non-Superstar card now keeps the canonical WWE Legacy rules/details back underneath the optional custom front. If the custom front exists it remains the visible front; if it is missing or fails to load, the art layer disappears and the original card back remains visible instead of a blank rectangle. With no custom front installed, both flip states therefore show the original back.

The v0.12.62 Daily Booster Button Pass, v0.12.61 Final Boss launch scale correction, and all v0.12.60 Season / Deck Lab cleanup work remain intact. No gameplay, balance, ownership, deck, booster, or collector-data rules are changed.

Certification: **294/294 automated tests pass**; validation reports **50 Superstars / 50 decks / 435 gameplay cards / 0 orphans / 0 issues**; flow audit reports **50 Superstars / 0 issues**; card-ID audit reports **485/485 / 0 issues**.

See `RELEASE-NOTES-v0.12.63.md` for the complete change list.
