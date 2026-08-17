# WWE Legacy v0.12.89 — Amber/Red Pin Gate Hotfix

This hotfix restores the intended health-zone gate for pin attempts.

- **Green health cannot be pinned.** A connected Move no longer opens a legal cover while the defending Superstar remains in Green health.
- **Amber and Red health can be pinned.** Once the defender reaches Amber or Red, the existing actual-HP pin chance table applies exactly as before.
- The gate is enforced in both `canAttemptPin()` and `MatchEngine.attemptPin()`, keeping player UI, CPU logic and engine calls consistent.
- The actual-HP pin curve itself is unchanged, including the locked **75% chance at 0–4 HP** and the **5% chance at 16+ HP** once the pin is otherwise legal.
- This closes the early 5% Green-health cover loophole that could allow extremely short finishes such as a Turn 3 pin.

All v0.12.89 presentation, Live Events, Season 1 100-tier road, Deck Assistance, pack-conversion fixes and prior gameplay locks remain intact.


## v0.12.89 — Live Events Presentation Repair Pass
- Repaired the Daily Live Events screen after the previous redesign regressed on iPhone. The hero Superstar render is now dramatically larger, with the head and shoulders clearly visible instead of only the top of the head peeking above the stats row.
- Show-branded days no longer repeat RAW / NXT / SmackDown naming in multiple stacked text lines. Branded days now keep the logo lockup and use a cleaner generic page title.
- The setup panel no longer nests the chosen Superstar inside two boxes. It now uses a single featured Superstar card treatment alongside the copy and Start Live Event CTA.
- The lower route area now uses larger readable Superstar cards instead of tiny unreadable mini boxes, making the five-match tower easier to scan on phone screens.
- Presentation only; rewards, rules, scheduling and tower progression remain unchanged.


## v0.12.89 — Prematch Rule Panel Placement Hotfix
- Live Event prematch screens no longer place the stage/rules callout as an overlay above the matchup cards.
- The Opening Bout / rule panel now sits directly beneath the Start Match CTA and matches the CTA width, improving readability and preserving the full matchup presentation.
- Presentation-only hotfix; match rules, rewards and prematch flow are unchanged.
