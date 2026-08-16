# WWE Legacy v0.12.24 — Targeted Roster Balance Pass

This pass is driven by the v0.12.23 24,500-match deep audit. It does not add another global combat rule. It improves practical reversal access, signature sequencing and comeback reliability for the weak outliers while keeping every recommended deck at 60 pages with 12 Momentum.

## Targeted deck coverage
- Seth Rollins: moves reversal slots toward Torso Trapped / Body Elevated / Rear Control responses instead of overloading already-covered Running Aerial responses.
- Gunther: adds dependable ungated aerial/state responses appropriate for an Agility-0 powerhouse and improves his practical reaction density.
- Cody Rhodes: redistributes utility into more useful state-matched responses.
- Paige: shifts utility into aerial/body-state responses.
- Sami Zayn: removes low-pressure hold clutter, adds authentic Exploder / Blue Thunder sequencing, improves counter spread, and removes the single Strength-Momentum choke point.
- Randy Orton: restores a valid five-page Lead Off and expands practical reversal access while retaining his RKO/Punt identity.
- Randy Savage: adds more authentic aerial pages so Macho Madness can actually occur in normal matches.
- André the Giant: trades one Bearhug for Military Press Slam to improve late-match pressure without changing deck size.
- Rey Mysterio: recommended West Coast Pop count is reduced from 3 to 2, replaced by Bulldog, lowering finisher density without removing his core 619 identity.

## Signature / Superstar tuning
- Seth’s Buckle Bomb is C5 with Technical 1 and makes the searched Curb Stomp cost 1 less that Control sequence.
- Gunther’s Folding Powerbomb is C6 / Strength 2; searched Gojira Clutch gets a 2-Cost discount; Gojira Clutch is C7.
- Sami’s Underdog From the Underground gives the first Move of a behind-on-HP Control sequence -2 Cost and +4 Damage; Exploder discounts Helluva Kick by 3; Blue Thunder Bomb is C6; Never Say Die now triggers at 30%, draws 3 and gains 2 Attitude.
- Kane’s Big Red Machine fires on the first two 8+ Damage connects; Chokeslam From Hell is Strength 2 and discounts the next Tombstone Piledriver by 2.
- André’s Giant’s Reach fires twice, gives the next Strength Move -2 Cost / +2 Damage and gains +1 Attitude; Double Underhook Suplex is D10 and discounts Sitdown Splash by 2.
- Savage’s Macho Madness recognizes an Agility Move after any earlier connected Strike in the same Control sequence, draws 1 and gains +1 Attitude; Savage’s Double Axe Handle also gains +1 Attitude and discounts Flying Elbow Drop by 2; Flying Elbow Drop is C8.
- Rey’s 619 is C7 and searches the family finisher at -1 Cost rather than -2; Mysterio Express is C7 and no longer draws a page; West Coast Pop’s immediate-after-619 bonus is +1; Ultimate Underdog draws 1 per kickout; Lucha Libre Legend is +2 Damage.

## AI sequencing
CPU scoring now recognizes the important signature chains and setup states for Seth, Gunther, Cody, Paige, Sami, Kane, Randy Orton, Randy Savage and André rather than judging those cards only by raw Damage/Cost.

## Saved-deck migration
Profile schema is v24. An untouched v0.12.23 recommended 60-page saved deck migrates to the v0.12.24 tuned recommendation and receives any missing required pages. A customized deck is not overwritten.

## Automated certification before packaging
- Unit/regression: 138/138
- Flow audit: 50 Superstars, 0 issues
- Validation: 50 decks, 432 gameplay cards, 0 orphans/issues
- Collector IDs: 482/482 clean
- Counter-state audit: clean
- Ordered balance: 2,450 matches, 0 stalls, 21.12 average turns
- Extended balance: 4,900 matches, 0 stalls, 21.26 average turns, 0 draws
- Deep audit: 24,500 matches across two independent full-roster batches, 0 stalls, ~21.35 average turns
- Art audit remains intentionally open because most authored/future card art is not yet final.
