# WWE Legacy: Collectible Card Game — v0.11.20

## Card Art Studio — URL artwork import

- Added **Load artwork from URL** to the unified Card Art Studio.
- Paste a direct `http://` or `https://` image URL and press **Load URL Artwork** (or Enter).
- The studio fetches the remote image, converts it to an in-memory data URL, and renders that safe copy to the card canvas. This avoids requiring the source photo to be saved locally before card creation.
- URL-loaded artwork uses the same zoom, horizontal/vertical positioning and WebP export workflow as uploaded files.
- Clear status messages now explain invalid URLs, non-image responses, HTTP failures and likely CORS/hotlink blocking.
- Browser security is not bypassed: hosts that disallow cross-origin image downloads cannot be imported directly; those images still need the file picker or a host that permits CORS.

No gameplay/card-data changes.
