# WWE Legacy v0.13.46 — Home Season Title Consistency Hotfix

## Home hub typography fix
- The **SEASON ONE** Home destination directly above Deck Lab now calls the same `homeHubSplitTitle()` component used by **DECK LAB**, **MY CHALLENGES**, **OPEN PACKS**, **MY STORE**, **MY COLLECTION** and **MY LEGACY**.
- The Home Season title therefore shares the same italic heavy display font treatment, **1.48rem** standard Home size, **.9** line height, **5px** vertical title rhythm and the same **390px** small-phone size fallback as Deck Lab.
- The Season palette is preserved: **SEASON** stays white and **ONE** stays cyan (`#55e4ff`).
- The old Home-only `season-home-title` markup is no longer used, eliminating the conflicting `max-width:600px` rule that was making SEASON ONE visibly smaller than DECK LAB on iPhone widths such as 393px.

## Scope
- Presentation-only hotfix.
- The full Season tab presentation and reward road are unchanged.
- No gameplay, card data, balance, economy, booster, deck, collector, profile-schema or release-calendar changes.
- All v0.13.45 Mr. Iguana / Worlds Collide completion content remains intact.
