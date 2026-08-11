# WWE Legacy v0.11.34 — Build-Wide Cache Busting

## What changed
- Added a release-version cache stamp to the main stylesheet, app entry module, web manifest, app icons and Card Art Studio assets.
- Every browser ES-module dependency is stamped with the same build version, so stale child JS modules cannot survive a deployment when the entry module changes.
- Runtime card fronts, Superstar art, fallback portraits, temporary art, exact card overrides and set logos now append the active build version to their URLs.
- Card Art Studio also cache-busts current in-project art when served over HTTP/HTTPS.
- Added `npm run stamp-cache`. It reads the version from `package.json` and stamps browser references, module imports and runtime build constants. Future releases can bump `package.json` once and run the stamp command.

## Why
Mobile Safari and GitHub Pages can retain older CSS, JavaScript and same-filename artwork after a deployment. v0.11.34 gives each release a unique URL identity without renaming project files.

## Scope
No gameplay, decks, card pool, collector numbers, balance, collection progression or Card Art Studio card data changed.
