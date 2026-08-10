# WWE Legacy v0.11.21 — URL Artwork Loader Fix

- Fixed **Load URL Artwork** appearing to do nothing when the Card Art Studio is opened directly from `file://`.
- Added a status message directly beneath the URL button so loading/errors are visible without scrolling to the export section.
- URL import now tries the source URL first, then automatically retries through the public `wsrv.nl` image proxy when the source blocks browser CORS/hotlink access.
- Imported URL images are still converted into browser-memory data URLs before entering the canvas so finished WebP export remains origin-clean.
- The URL button displays **Loading…** while work is in progress and always restores itself after success/failure.
