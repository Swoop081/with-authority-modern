# WWE Legacy v0.12.04 — Premium Card Typography Pass

## Card Art Studio typography

- Keeps the v0.12.03 premium frame structure, rarity stars, set-specific backgrounds, set-coloured borders and top-right logos unchanged.
- Replaces the heavy italic `Arial Black` move-name treatment with a cleaner condensed heavyweight display stack: **Bahnschrift Condensed → Avenir Next Condensed → Arial Narrow → system fallback**.
- Reduces the name outline/shadow weight so long move names remain crisp instead of looking inflated.
- COST / DAMAGE labels use tracked semi-condensed typography; stat values use a dedicated condensed-number stack.
- Method requirements, Move type and non-Move type labels use a cleaner semi-condensed hierarchy with restrained tracking.
- Collector code and WWE Legacy footer branding are slightly smaller/lighter so the footer reads like trading-card microtype rather than game UI text.
- No bundled/custom font files are required; the Studio uses system fonts with safe fallbacks on Windows, iPhone/iPad and macOS.

## Release safety

- No gameplay values, cards, decks, booster pools, collector numbering, set backgrounds or logo assets changed.
- Cache keys and the visible Card Art Studio build label are bumped to v0.12.04.
- Cache stamping now accepts any `0.x.y` build version rather than the old v0.11-only BUILD_VERSION pattern.
