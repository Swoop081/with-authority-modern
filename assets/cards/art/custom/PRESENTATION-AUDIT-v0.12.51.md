# Presentation Audit — v0.12.51

The v0.12.51 pass addresses one specific readability issue identified from the F-5 Card Art Studio screenshot.

## Locked lower-plate hierarchy
For a Move with a Method requirement:
1. Move name
2. Large unboxed Cost and Damage figures
3. Real requirement text such as `◆ 3 STRENGTH`
4. `MOVE • <TYPE>`

For a Move with **no** Method requirement:
1. Move name
2. Large unboxed Cost and Damage figures
3. No requirement line
4. Enlarged, raised `MOVE • <TYPE>` line

No placeholder such as `NO METHOD REQUIREMENT` or `NO MOMENTUM REQUIRED` is rendered.

This preserves the global gameplay rule that Finishers require no Method Momentum while keeping that implementation detail off the collectible front unless a requirement actually exists.
