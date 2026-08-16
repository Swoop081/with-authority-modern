# WWE Legacy v0.11.92 — Match HUD Safe Area + Show Controls Pass

- Added a guaranteed iPhone match-HUD top safe strip with a 52px fallback floor so Dynamic Island/status chrome does not sit over the combat HUD when `safe-area-inset-top` reports too small a value.
- Rebalanced the upper HUD portrait/HP split from the previous overlapping treatment to a dedicated **74% portrait / 26% HP** layout (72/28 on the narrowest phones).
- Kept the larger 1.68× HUD portrait scale, but nudged Player 1 outward to the left and Player 2/CPU outward to the right so faces no longer collide with HP numbers.
- Removed the redundant **IN THE RING / STANDING / T#** strip from beneath the wrestler HUD. Posture remains visible on each wrestler card and turn/phase remains visible in the command panel.
- Pulled the Play Pile upward immediately beneath the HUD and tightened its heading spacing.
- Centred match command buttons. A lone **Pass Control** button now sits centred instead of occupying the left half of the action row.
- Match command buttons now inherit the active show's `--presentation-accent` / `--presentation-accent2` colours, so RAW, SmackDown, SummerSlam, Evolution, Worlds Collide and Money in the Bank each theme the controls automatically.
- Retains v0.11.91 Chelsea Green **Running Knees to the Back** content unchanged.
