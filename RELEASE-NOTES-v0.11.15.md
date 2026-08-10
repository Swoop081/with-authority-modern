# WWE Legacy: Collectible Card Game — v0.11.15

## Superstar Studio local-export hardening

- Fixes the remaining Chrome `file://` export failure in Superstar Art Studio.
- Wrestler images chosen with the file picker are now read as in-memory data URLs instead of temporary `blob:` URLs, preventing opaque-origin canvas taint in local-file mode.
- The studio no longer automatically draws built-in project portraits when opened from `file://`; this prevents the preview canvas from becoming permanently tainted before the user selects custom art.
- Selecting a custom wrestler image replaces the preview canvas element with a fresh origin-clean surface before drawing.
- Export performs an origin-clean probe and automatically rebuilds the canvas when possible before encoding WebP.
- `Use current game art` remains available for previewing, but local-file users should use the file picker for export; localhost/GitHub Pages can export project art normally.
