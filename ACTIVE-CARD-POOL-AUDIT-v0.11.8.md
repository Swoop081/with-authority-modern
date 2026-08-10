# WWE Legacy v0.11.8 — Active Card Pool / Booster Audit

## Core rule now enforced
A set's active booster collection contains only:
1. the Superstar cards in that set,
2. cards actually used by at least one current starter deck in that set,
3. that set's linked Entrance cards,
4. approved Manager cards for Superstars in that set.

If a later starter uses an identical card already first-printed in an earlier set, the later deck now references the earlier global card directly instead of reprinting it.

Cards no longer used by any current starter remain dormant in source data for possible future sets, but are removed from the active collection and cannot appear in boosters.

## Pool size before / after
- SummerSlam — Series 1: 204 -> 135 cards (69 removed from active boosters)
- Hall of Fame — Series 1: 231 -> 106 cards (125 removed from active boosters)
- Evolution — Series 1: 203 -> 110 cards (93 removed from active boosters)
- Season 1 Rewards — Final Boss Rock: 45 -> 21 cards (24 removed from active boosters)
- Global active card base: 683 -> 372 cards (311 fewer, 45.5% reduction)

## Final main-set sizes
- SummerSlam — Series 1: 135 cards, including 8 Superstars
- Hall of Fame — Series 1: 106 cards, including 8 Superstars
- Evolution — Series 1: 110 cards, including 8 Superstars

These are intentionally not padded to identical numbers; all three are now in the same general range while containing only cards that are actually being used.

## Shared-card consolidation
29 exact active reprints across Hall of Fame and Evolution were consolidated to an earlier canonical print, plus 5 exact Final Boss reprints. Examples include Agility/Strength/Strike/Technical Momentum, Side Headlock, Shoulder Tackle, Uppercut, Clothesline, Big Boot, DDT, Backbreaker, Powerslam, Flying Clothesline, No Sell, Duck, Chain Wrestling, Sidestep, Headbutt, Sidewalk Slam, Dropkick, Forearm Smash, Running Knee, Neckbreaker, Samoan Drop and other exact matches.

## Hall of Fame Managers retained
- Bobby "The Brain" Heenan — André the Giant
- Miss Elizabeth — Randy Savage
- Paul Bearer — The Undertaker

## Rarity / type shape after pruning
- SummerSlam — Series 1: 135 total; rarities {'1': 66, '2': 30, '3': 22, '4': 17}; card kinds {'superstar': 8, 'entrance': 8, 'move': 101, 'special': 8, 'momentum': 4, 'action': 3, 'support': 3}
- Hall of Fame — Series 1: 106 total; rarities {'1': 24, '2': 41, '3': 25, '4': 16}; card kinds {'superstar': 8, 'entrance': 8, 'special': 8, 'move': 67, 'action': 9, 'support': 3, 'manager': 3}
- Evolution — Series 1: 110 total; rarities {'1': 29, '2': 48, '3': 16, '4': 17}; card kinds {'superstar': 8, 'entrance': 8, 'move': 78, 'special': 8, 'action': 8}
- Season 1 Rewards — Final Boss Rock: 21 total; rarities {'1': 5, '2': 10, '3': 3, '4': 3}; card kinds {'superstar': 1, 'entrance': 1, 'move': 15, 'special': 3, 'action': 1}

## Dormant source cards removed from active boosters

### SummerSlam — Series 1 — 69 dormant definitions
- Shoulder Up (special) — `shoulder-up`
- Desperation Counter (special) — `desperation-counter`
- Catch Your Breath (action) — `catch-breath`
- Cut Off the Ring (action) — `cut-off-ring`
- Ring Generalship (support) — `ring-generalship`
- Quick Jab (move) — `jab`
- Throw Over the Ropes (move) — `throw-over-ropes`
- Ringside Clothesline (move) — `ringside-clothesline`
- Ringside Slam (move) — `ringside-slam`
- Ringside DDT (move) — `ringside-ddt`
- Collar-and-Elbow Tie-Up (move) — `collar-elbow`
- Wrist Lock (move) — `wrist-lock`
- Elbow Smash (move) — `elbow-smash`
- Hip Toss (move) — `hip-toss`
- Leg Sweep (move) — `leg-sweep`
- Elbow Drop (move) — `elbow-drop`
- Knee Drop (move) — `knee-drop`
- Leg Drop (move) — `leg-drop`
- Vertical Suplex (move) — `vertical-suplex`
- Russian Leg Sweep (move) — `russian-leg-sweep`
- Bulldog (move) — `bulldog`
- Samoan Drop (move) — `samoan-drop-common`
- Enzuigiri (move) — `enzuigiri-common`
- Senton (move) — `senton-common`
- Body Splash (move) — `splash`
- Sleeper Hold (move) — `sleeper-common`
- Piledriver (move) — `piledriver`
- Fisherman Suplex (move) — `fisherman-suplex`
- Moonsault (move) — `moonsault`
- Diving Crossbody (move) — `diving-crossbody`
- Suicide Dive (move) — `suicide-dive`
- Sit-Out Powerbomb (move) — `sitout-powerbomb`
- Superplex (move) — `superplex`
- Brainbuster (move) — `brainbuster`
- Dodge (move) — `dodge`
- Duck (move) — `duck`
- Technical Reversal (move) — `reversal`
- Scramble Free (move) — `scramble`
- Cody Suicide Dive (move) — `cody-suicide-dive`
- Pedigree (move) — `cody-pedigree`
- Spear (move) — `cody-spear`
- Diving Elbow Drop (move) — `diving-elbow`
- Piledriver (move) — `punk-piledriver`
- Uranage (move) — `uranage`
- Sit-Out Powerbomb (move) — `roman-powerbomb`
- Drive-By Dropkick (move) — `roman-drive-by-ringside`
- Crucifix Powerbomb (move) — `roman-crucifix-powerbomb`
- Phoenix Splash (move) — `phoenix-splash`
- Suicide Dive (move) — `seth-suicide-dive`
- Spinebuster (move) — `oba-spinebuster`
- Backbreaker (move) — `oba-backbreaker`
- Pop-Up Powerbomb (move) — `oba-pop-up-powerbomb`
- German Suplex (move) — `german-suplex`
- Belly-to-Belly Suplex (move) — `belly-to-belly`
- Powerbomb (move) — `brock-powerbomb`
- Brock Clothesline (move) — `brock-clothesline`
- Superkick (move) — `owens-superkick`
- Running Forearm (move) — `owens-forearm`
- DDT (move) — `owens-ddt`
- Swanton Bomb (move) — `owens-swanton`
- Frog Splash (move) — `owens-frog-splash`
- Knife-Edge Chop (move) — `gunther-chop`
- Lariat (move) — `gunther-lariat`
- Powerbomb (move) — `gunther-powerbomb`
- Big Boot (move) — `gunther-big-boot`
- German Suplex (move) — `gunther-german`
- Boston Crab (move) — `gunther-boston-crab`
- Top-Rope Splash (move) — `gunther-splash`
- Sleeper Hold (move) — `sleeper-hold`

### Hall of Fame — Series 1 — 125 dormant definitions
- Agility Momentum (momentum) — `hof1-momentum-agility`
- Strength Momentum (momentum) — `hof1-momentum-strength`
- Strike Momentum (momentum) — `hof1-momentum-strike`
- Technical Momentum (momentum) — `hof1-momentum-technical`
- Old-School Kickout (special) — `hof1-shoulder-up`
- Veteran Instinct (special) — `hof1-desperation-counter`
- Second Wind (action) — `hof1-second-wind`
- Create an Opening (action) — `hof1-create-opening`
- Veteran Savvy (support) — `hof1-veteran-savvy`
- Ring Awareness (support) — `hof1-ring-awareness`
- Collar-and-Elbow Tie-Up (move) — `hof1-lockup`
- Side Headlock (move) — `hof1-headlock`
- Wrist Lock (move) — `hof1-wristlock`
- Body Punch (move) — `hof1-body-punch`
- Shoulder Tackle (move) — `hof1-shoulder-tackle`
- Arm Drag (move) — `hof1-arm-drag`
- Hip Toss (move) — `hof1-hip-toss`
- Snapmare (move) — `hof1-snapmare`
- Uppercut (move) — `hof1-uppercut`
- Clothesline (move) — `hof1-clothesline`
- Big Boot (move) — `hof1-big-boot`
- Dropkick (move) — `hof1-dropkick`
- DDT (move) — `hof1-ddt`
- Backbreaker (move) — `hof1-backbreaker`
- Knee Drop (move) — `hof1-knee-drop`
- Leg Drop (move) — `hof1-leg-drop`
- German Suplex (move) — `hof1-german-suplex`
- Belly-to-Belly Suplex (move) — `hof1-belly-to-belly`
- Russian Leg Sweep (move) — `hof1-russian-sweep`
- Bulldog (move) — `hof1-bulldog`
- Powerslam (move) — `hof1-powerslam`
- Sleeper Hold (move) — `hof1-sleeper`
- Boston Crab (move) — `hof1-boston-crab`
- Camel Clutch (move) — `hof1-camel-clutch`
- Powerbomb (move) — `hof1-powerbomb`
- Flying Clothesline (move) — `hof1-flying-clothesline`
- Flying Elbow Drop (move) — `hof1-flying-elbow`
- Big Splash (move) — `hof1-splash`
- Ringside Suplex (move) — `hof1-ringside-suplex`
- Ringside Clothesline (move) — `hof1-ringside-clothesline`
- Ringside Slam (move) — `hof1-ringside-slam`
- Throw Over the Ropes (move) — `hof1-throw-over-ropes`
- Gutwrench Suplex (move) — `hof1-gutwrench-suplex`
- Military Press (move) — `hof1-military-press`
- Side Slam (move) — `hof1-side-slam`
- Dodge (move) — `hof1-dodge`
- Duck (move) — `hof1-duck`
- Veteran Reversal (move) — `hof1-reversal`
- Scramble Free (move) — `hof1-scramble`
- Hogan Right Hands (move) — `hof1-hogan-punches`
- Axe Bomber (move) — `hof1-hogan-axe-bomber`
- Back Rake (move) — `hof1-hogan-back-rake`
- Hogan Bodyslam (move) — `hof1-hogan-bodyslam`
- Hogan Big Boot (move) — `hof1-hogan-big-boot`
- Running Clothesline (move) — `hof1-hogan-running-clothesline`
- Hogan Suplex (move) — `hof1-hogan-suplex`
- Hogan Bearhug (move) — `hof1-hogan-bearhug`
- Atomic Leg Drop (move) — `hof1-hogan-leg-drop`
- Three-Punch Combo (move) — `hof1-hogan-three-punch`
- Giant Headbutt (move) — `hof1-andre-headbutt`
- Clubbing Blow (move) — `hof1-andre-club`
- Giant Bearhug (move) — `hof1-andre-bearhug`
- Giant Bodyslam (move) — `hof1-andre-bodyslam`
- Giant Sit-Down (move) — `hof1-andre-sit-down`
- Head Vice (move) — `hof1-andre-head-vice`
- Giant Elbow Drop (move) — `hof1-andre-elbow-drop`
- Flying Double Axe Handle (move) — `hof1-savage-axe-handle`
- Macho Neckbreaker (move) — `hof1-savage-neckbreaker`
- Macho Knee Drop (move) — `hof1-savage-knee-drop`
- Macho Suplex (move) — `hof1-savage-suplex`
- Flying Crossbody (move) — `hof1-savage-crossbody`
- Macho Elbow Smash (move) — `hof1-savage-elbow-smash`
- Macho Piledriver (move) — `hof1-savage-piledriver`
- Macho Man Elbow Drop (move) — `hof1-savage-elbow`
- Warrior Clothesline (move) — `hof1-warrior-clothesline`
- Flying Shoulder Block (move) — `hof1-warrior-shoulder`
- Gorilla Press (move) — `hof1-warrior-press`
- Warrior Bearhug (move) — `hof1-warrior-bearhug`
- Warrior Powerslam (move) — `hof1-warrior-powerslam`
- Warrior Big Boot (move) — `hof1-warrior-big-boot`
- Warrior Suplex (move) — `hof1-warrior-suplex`
- Warrior Splash (move) — `hof1-warrior-splash`
- Gorilla Press Drop (move) — `hof1-warrior-press-drop`
- Stone Cold Clothesline (move) — `hof1-austin-clothesline`
- Pointed Elbow Drop (move) — `hof1-austin-elbow`
- Stone Cold Spinebuster (move) — `hof1-austin-spinebuster`
- Stone Cold Suplex (move) — `hof1-austin-suplex`
- Stomp a Mudhole (move) — `hof1-austin-mudhole`
- Lou Thesz Press (move) — `hof1-austin-lou-thesz`
- Million Dollar Dream (move) — `hof1-austin-million-dollar-dream`
- Kick to the Gut (move) — `hof1-austin-kick-gut`
- Stone Cold Stunner (move) — `hof1-austin-stunner`
- Undertaker Big Boot (move) — `hof1-taker-big-boot`
- Old School (move) — `hof1-taker-old-school`
- Flying Clothesline (move) — `hof1-taker-flying-clothesline`
- Apron Leg Drop (move) — `hof1-taker-leg-drop`
- Chokeslam (move) — `hof1-taker-chokeslam`
- Snake Eyes (move) — `hof1-taker-snake-eyes`
- Last Ride (move) — `hof1-taker-last-ride`
- Hell's Gate (move) — `hof1-taker-hells-gate`
- Tombstone Piledriver (move) — `hof1-taker-tombstone`
- Running Knee (move) — `hof1-mankind-knee`
- Swinging Neckbreaker (move) — `hof1-mankind-neckbreaker`
- Cactus Elbow (move) — `hof1-mankind-elbow`
- Ringside Leg Drop (move) — `hof1-mankind-leg-drop`
- Mankind Piledriver (move) — `hof1-mankind-piledriver`
- Double Arm DDT (move) — `hof1-mankind-double-arm-ddt`
- Mr. Socko (move) — `hof1-mankind-mr-socko`
- Mandible Claw (move) — `hof1-mankind-mandible-claw`
- Kane Uppercut (move) — `hof1-kane-uppercut`
- Kane Big Boot (move) — `hof1-kane-big-boot`
- Kane Clothesline (move) — `hof1-kane-clothesline`
- Sidewalk Slam (move) — `hof1-kane-sidewalk-slam`
- Flying Clothesline (move) — `hof1-kane-flying-clothesline`
- Kane Powerbomb (move) — `hof1-kane-powerbomb`
- Chokeslam from Hell (move) — `hof1-kane-chokeslam`
- Kane Bearhug (move) — `hof1-kane-bearhug`
- Tombstone Piledriver (move) — `hof1-kane-tombstone`
- Tilt-a-Whirl Slam (move) — `hof1-kane-tilt-whirl`
- No Sell (move) — `hof1-no-sell`
- Duck (move) — `hof1-duck-strike`
- Chain Wrestling (move) — `hof1-chain-wrestling`
- Sidestep (move) — `hof1-sidestep`
- Headbutt (move) — `hof1-headbutt-reviewed`
- Sidewalk Slam (move) — `hof1-sidewalk-slam-reviewed`

### Evolution — Series 1 — 93 dormant definitions
- Agility Momentum (momentum) — `evo1-momentum-agility`
- Strength Momentum (momentum) — `evo1-momentum-strength`
- Strike Momentum (momentum) — `evo1-momentum-strike`
- Technical Momentum (momentum) — `evo1-momentum-technical`
- Refuse to Stay Down (special) — `evo1-shoulder-up`
- Momentum Shift (special) — `evo1-desperation-counter`
- Seize the Moment (action) — `evo1-seize-moment`
- Regroup (action) — `evo1-regroup`
- Change the Pace (action) — `evo1-change-pace`
- Create the Opening (action) — `evo1-opening-strike`
- Crowd Energy (support) — `evo1-crowd-energy`
- Ring IQ (support) — `evo1-ring-iq`
- Fighting Heart (support) — `evo1-fighting-heart`
- Counter Timing (support) — `evo1-counter-timing`
- Quick Jab (move) — `evo1-quick-jab`
- Forearm Smash (move) — `evo1-forearm-smash`
- Knife-Edge Chop (move) — `evo1-knife-edge-chop`
- Running Knee (move) — `evo1-running-knee`
- Dropkick (move) — `evo1-dropkick`
- Superkick (move) — `evo1-superkick`
- Big Boot (move) — `evo1-big-boot`
- Lariat (move) — `evo1-lariat`
- Sling Blade (move) — `evo1-sling-blade`
- Hip Toss (move) — `evo1-hip-toss`
- Neckbreaker (move) — `evo1-neckbreaker`
- Belly-to-Belly Suplex (move) — `evo1-belly-to-belly`
- Dragon Suplex (move) — `evo1-dragon-suplex`
- Sidewalk Slam (move) — `evo1-sidewalk-slam`
- Spinebuster (move) — `evo1-spinebuster`
- Powerslam (move) — `evo1-powerslam`
- Powerbomb (move) — `evo1-powerbomb`
- Sit-Out Powerbomb (move) — `evo1-sitout-powerbomb`
- Bulldog (move) — `evo1-bulldog`
- STO (move) — `evo1-sto`
- Uranage (move) — `evo1-uranage`
- Knee Drop (move) — `evo1-knee-drop`
- Elbow Drop (move) — `evo1-elbow-drop`
- Suicide Dive (move) — `evo1-suicide-dive`
- Rings of Saturn (move) — `evo1-rings-of-saturn`
- Rhea Dropkick (move) — `evo1-rhea-dropkick`
- Release German Suplex (move) — `evo1-rhea-german-suplex`
- Razor's Edge (move) — `evo1-rhea-razors-edge`
- Rhea Sit-Out Powerbomb (move) — `evo1-rhea-sitout-powerbomb`
- Electric Chair Drop (move) — `evo1-rhea-electric-chair`
- Rhea Cannonball (move) — `evo1-rhea-cannonball`
- Step-Up Enzuigiri (move) — `evo1-liv-enzuigiri`
- Liv Missile Dropkick (move) — `evo1-liv-missile-dropkick`
- Double Knees (move) — `evo1-liv-double-knees`
- Liv Hurricanrana (move) — `evo1-liv-hurricanrana`
- Liv DDT (move) — `evo1-liv-ddt`
- Running Facebuster (move) — `evo1-liv-facebuster`
- Springboard Knee (move) — `evo1-liv-springboard-knee`
- Liv's Rings of Saturn (move) — `evo1-liv-rings-of-saturn`
- Sunset Flip Bomb (move) — `evo1-liv-sunset-bomb`
- Running Forearm (move) — `evo1-becky-forearm`
- Becky Missile Dropkick (move) — `evo1-becky-missile-dropkick`
- Reverse DDT (move) — `evo1-becky-reverse-ddt`
- Springboard Side Kick (move) — `evo1-becky-springboard-kick`
- Discus Forearm (move) — `evo1-becky-discus-forearm`
- Becky Arm Drag (move) — `evo1-becky-arm-drag`
- Bayley Running Knee (move) — `evo1-bayley-running-knee`
- Sliding Clothesline (move) — `evo1-bayley-sliding-clothesline`
- Bayley Suplex (move) — `evo1-bayley-suplex`
- Bayley Back Suplex (move) — `evo1-bayley-back-suplex`
- Sunset Flip Powerbomb (move) — `evo1-bayley-sunset-bomb`
- Middle-Rope Elbow (move) — `evo1-bayley-middle-elbow`
- Running Knee Drop (move) — `evo1-bayley-knee-drop`
- Bayley DDT (move) — `evo1-bayley-ddt`
- Charlotte Exploder (move) — `evo1-charlotte-exploder`
- Charlotte Neckbreaker (move) — `evo1-charlotte-neckbreaker`
- Charlotte Powerbomb (move) — `evo1-charlotte-powerbomb`
- Charlotte Spear (move) — `evo1-charlotte-spear`
- IYO Dropkick (move) — `evo1-iyo-dropkick`
- IYO Missile Dropkick (move) — `evo1-iyo-missile-dropkick`
- IYO Double Stomp (move) — `evo1-iyo-double-stomp`
- IYO German Suplex (move) — `evo1-iyo-german`
- Poison Rana (move) — `evo1-iyo-poison-rana`
- Spanish Fly (move) — `evo1-iyo-spanish-fly`
- IYO Suicide Dive (move) — `evo1-iyo-suicide-dive`
- Bullet Train Attack (move) — `evo1-iyo-bullet-train`
- Paige Side Kick (move) — `evo1-paige-side-kick`
- Kneeling Knee Strikes (move) — `evo1-paige-knee-strikes`
- Paige Short-Arm Clothesline (move) — `evo1-paige-short-clothesline`
- Cradle DDT (move) — `evo1-paige-cradle-ddt`
- Paige Fallaway Slam (move) — `evo1-paige-fallaway`
- Fisherman Suplex (move) — `evo1-paige-fisherman`
- Paige Crossface (move) — `evo1-paige-crossface`
- Vaquer Running Knee (move) — `evo1-vaquer-running-knee`
- Vaquer Double Knees (move) — `evo1-vaquer-double-knees`
- Vaquer Snap Suplex (move) — `evo1-vaquer-snap-suplex`
- Vaquer Diving Crossbody (move) — `evo1-vaquer-crossbody`
- Last Chancery (move) — `evo1-vaquer-last-chancery`
- Vaquer Inferno (move) — `evo1-vaquer-inferno`

### Season 1 Rewards — Final Boss Rock — 24 dormant definitions
- Strength Momentum (momentum) — `s1rock-momentum-strength`
- Strike Momentum (momentum) — `s1rock-momentum-strike`
- Technical Momentum (momentum) — `s1rock-momentum-technical`
- Final Boss Sharpshooter (move) — `s1rock-final-boss-sharpshooter`
- Samoan Drop (move) — `s1rock-samoan-drop`
- Spinebuster (move) — `s1rock-spinebuster`
- Snap DDT (move) — `s1rock-snap-ddt`
- Body Shot (move) — `s1rock-body-shot`
- Shoulder Block (move) — `s1rock-shoulder-block`
- Russian Leg Sweep (move) — `s1rock-russian-leg-sweep`
- Running Lariat (move) — `s1rock-running-lariat`
- Gutbuster (move) — `s1rock-gutbuster`
- Neckbreaker (move) — `s1rock-neckbreaker`
- Final Boss Corner Punches (move) — `s1rock-corner-punches`
- Raise the Eyebrow (action) — `s1rock-raise-eyebrow`
- Know Your Role (action) — `s1rock-know-your-role`
- Orders From the Final Boss (action) — `s1rock-final-boss-order`
- Brahma Bull Presence (support) — `s1rock-brahma-bull-presence`
- Duck (move) — `s1rock-duck-counter`
- No Sell (move) — `s1rock-no-sell`
- Technical Reversal (move) — `s1rock-technical-reversal`
- Headbutt (move) — `s1rock-headbutt`
- Big Boot (move) — `s1rock-big-boot`
- Sharpshooter (move) — `s1rock-sharpshooter-shared`

## Safety validation
- 25 starter decks certify at 55 pages with all copy/family caps legal.
- 0 starter-deck cards are missing from the global collection.
- 0 linked Entrances are missing from the global collection.
- 0 orphan non-Superstar cards remain in any active set collection.
- 60 booster packs were opened from each of the four active set pools with 0 errors.
- 10,000-match post-consolidation matrix: 0 stalls, 47 draws, 22.04 average turns.
- AI legality audit: 73,114 Action decisions, 0 passes while a legal offensive Move was available.
