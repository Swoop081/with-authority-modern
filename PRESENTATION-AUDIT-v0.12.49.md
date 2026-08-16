# Presentation Audit — v0.12.49 Physical Booster Pack Pass

## Screenshot problem addressed

The prior Booster Vault pack read visually as a rounded collectible card: soft corners, no wrapper seals, no foil seams and no physical tear construction. Reference mobile-game screenshots instead show booster products as clearly sealed packages with crimped foil ends and a strong wrapper silhouette.

## Locked presentation rules

1. **Booster packs are packages, not cards.** The wrapper has a 0.59 width/height ratio, small corners and visible foil construction.
2. **Seals must read at thumbnail size.** Top and bottom heat crimps use repeated foil ridges and remain visible in Vault and Store sizes.
3. **A pack needs side construction.** Left/right seams and a small tear notch stop the silhouette reading as a flat card.
4. **Foil material should move subtly.** A reflective sweep is used on interactive/sealed packs without changing pack contents or odds.
5. **Set identity lives on the wrapper.** Existing official/set logos are retained; only the surrounding pack construction changed.
6. **One component everywhere.** Vault, Store, Season rewards, match rewards and the opening modal call the same `physicalBoosterPackMarkup()` helper.
7. **The rip begins at the seal.** Opening animation removes the crimped top edge, matching the object the player just tapped.

## Context sizes

- Booster Vault: 126px desktop / 118px <=430px.
- Store: 112px desktop / 104px <=430px.
- Tier reward: 84px.
- Match reward: 74px.
- Full-screen sealed/opening pack: up to 310px, 285px <=430px.

## Non-changes

No pack odds, contents, rarity distribution, ownership rules, Universe Point values, booster-credit counts, reveal logic or Deck Assistance behavior changed.
