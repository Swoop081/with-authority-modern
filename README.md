# WWE Legacy: Collectible Card Game

Current working build: **v0.12.69 — Package Hygiene Pass**.

v0.12.69 is a packaging/repository-cleanup release on top of v0.12.68. It does **not** change gameplay, balance, card data, progression, booster behavior, or presentation.

The shipped package now uses an explicit clean allowlist. Historical audit/simulation logs and historical release notes are not included in release ZIPs, and confirmed-dead legacy/duplicate image assets have been removed. Future clean release staging is available through `npm run package-clean`.

See `RELEASE-NOTES-v0.12.69.md` for the change list and `BUILD-CERTIFICATION.md` for the current certification results.
