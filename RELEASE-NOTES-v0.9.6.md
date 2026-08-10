# WWE Legacy: Collectible Card Game — v0.9.6

## First generic-move exclusivity cleanup
The first confirmed set of obviously generic wrestling techniques is now shared rather than tied to one Superstar.

Restrictions removed from:
- CM Punk: Roundhouse Kick, Running Knee, Snap Suplex
- Roman Reigns: Samoan Drop
- Seth Rollins: Superkick
- Oba Femi: Powerbomb, Chokeslam
- Brock Lesnar: German Suplex, Powerbomb
- Kevin Owens: Superkick, DDT
- Gunther: German Suplex
- Mankind: Running Knee
- Final Boss Rock: Samoan Drop, Neckbreaker

These remain their existing card identities/editions and effects, but Deck Builder and collection logic no longer treat them as exclusive to the listed Superstar.

## Signature exceptions retained
- Gunther's Powerbomb remains exclusive because that specific card is currently his Finisher.
- Undertaker's Chokeslam remains exclusive because that card is a character-linked signature sequence that searches for Tombstone Piledriver.
- Named/character-specific signature versions remain untouched until reviewed.

## CM Punk correction
- Anaconda Vise is now formally flagged as CM Punk's Trademark.
- G.T.S. remains his exclusive Finisher.

## Certification
- 157/157 automated regression tests passing.
