# WWE Legacy v0.11.14 — Superstar WebP Export Fix

- Fixes the Superstar Art Studio export button when the tool is opened directly from an extracted ZIP / `file://` URL.
- Embeds the three transparent set logos inside the studio script so drawing them cannot taint the export canvas.
- Adds explicit WebP encoding and download error handling instead of silent failure.
- The export button now reports encoding, successful download, and actionable browser-security errors.
- Local-file users are warned that built-in project portraits can still be blocked by browser canvas security; uploaded wrestler images export normally.
- Export remains a finished flattened card: full-bleed set design + wrestler artwork + set logo + Superstar name.
