# v0.12.45 Presentation Audit

## iPhone screenshot findings addressed

### Home
The v0.12.44 hierarchy was substantially better, but the foreground collectible card was hard-coded to Roman Reigns while the dominant hero reflected the player starter. With CM Punk selected this created an obvious identity mismatch. The card also intruded into the lower stat rail. v0.12.45 binds the hero card to `starter.id`, reduces its size and lifts it clear of the stat rail.

The hero also repeated Packs even though Pack count already appears in the global top chrome and Booster Vault tile. That stat is replaced with the current Season Tier.

### Season
The Daily Login Booster had `order:-1`, causing it to appear above the actual Season campaign hero and occupy a disproportionate amount of the first viewport. v0.12.45 removes that reorder and compresses the free pack UI into a 70–82px command strip depending on viewport width.

### Challenges
The Challenges screen still had a dedicated Main Menu button despite the persistent bottom Home navigation. The large Set Progress box also stacked three tall set rows on mobile. v0.12.45 removes the duplicate navigation action and converts set progress to three compact side-by-side plates so Daily Challenges surface much earlier in the scroll.

### Booster Vault
With one pack available, the grid shelf produced a large full-width dark container around a single centered product. v0.12.45 changes the shelf to a horizontal scroll/snap product rail and constrains each physical pack product to roughly 150–172px width on mobile/desktop. The lower summary now uses all four statistics in one row.

### Store
The Store duplicated Universe Points in a floating balance pill even though the v0.12.44 global gamebar already exposes UP. The duplicate is removed. Hero, refresh clock and booster offer are also compressed into sharper game plates.

## Design rule reinforced
v0.12.44 established the architecture; v0.12.45 removes places where older web-card conventions still fought it. The guiding rule is now:

**Use global chrome for persistent resources, one dominant piece of artwork per message, compact angular plates for secondary information, and avoid repeating the same data or navigation within the same viewport.**
