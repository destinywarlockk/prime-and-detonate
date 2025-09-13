## UI Spec

Battle grid
- Fixed 4×3 grid (columns×rows) — 12 total slots.
- Sizes: Grunt/Elite 80×80, Miniboss 172×80 (spans 2 columns + gap), Boss 264×80 (spans 3 columns + gaps).
- Container width: 368px; column gap 12px; row height 80px; row gap 10px; total height ~260px.
- Enemy cards show only essential stats: SH and HP (grunts hide SH).

Primer dots (balanced two-row layout)
- Enemy card content uses a 2×2 grid:
  - Row 1: labels over values (SH left, HP right).
  - Row 2: primer slots under corresponding stat columns.
- Dot spec: 11px circle; border 1px; color-coded by element; subtle 4px glow.
- Colors: kinetic gray, arc blue, thermal red, void purple.
- Prime display rules: slot1 = first prime, slot2 = second prime; detonate/expire/cleanse clears both.

Ability list (battle)
- Each party member has a compact list of selected abilities with role badge (Primer/Detonator/Sustain), damage, cooldown, and super cost.
- AOE abilities display an [AOE] indicator and concise effect text.

Loadout screen
- Per-character panel with:
  - Class icon/name, slot dots (used/total), weapon selector (one selected), selected abilities list, available abilities grid.
  - Slot constraints: exactly 1 sustain; offensive abilities fill remaining slots.
- Ability cards show: name, [AOE] badge if present, description line, stats: D, CD, SP.

Weapons UI
- Show element tag for weapon basicType (KIN/ARC/THR/VOID) and key modifiers (basicMult, totalDamageMult, detonation multipliers, HP/SH bonus, superGainMult).

Mission select
- Single-column grid of missions; show character icon inferred from mission id/name; display best-star rating (0..3).
- Start button wires to dialogue.

Dialogue screen
- Left/right/center speakers with portraits. Narrator uses centered, stylized bubble.
- Choice nodes present buttons with optional follow-up lines; selections award stars (cumulative up to 3).
- “Battle Now” button available throughout; on click, show a one-line handicap message, then continue to party screen.
- Background images auto-mapped by scene key (filename base lowercased, non-alnum stripped).

Accessibility and stability
- No layout shift during battle; tabular numerals for stat jitter prevention.
- Buttons large enough for touch; consistent color contrast.



