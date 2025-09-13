## Validation and Migration

Validation
- On startup, load JSON/MD content and validate against schemas:
  - Unique IDs per domain (abilities, weapons, characters, enemies, factions, tiers, missions).
  - All references (allowedClasses, enemy abilities, weapon ids) resolve.
  - Numbers in safe ranges: splashFactor 0..1; multipliers > 0; costs ≥ 0.
  - DamageType and ClassId enums strictly enforced.
  - Mission scripts parse into `DialogueLine[]`; choices have labels and optional followups.
- Fail soft: log invalid entries and skip them; continue loading others.

Migration checklist (from current project)
1) Export tables
   - Copy `src/content/abilities.ts` → `spec/examples/abilities.example.json` shape.
   - Copy `src/content/weapons.ts` → `spec/examples/weapons.example.json` shape.
   - Copy `src/content/characters.ts` → `spec/examples/characters.example.json` shape.
   - Copy `data/factions.ts` → `spec/examples/factions.example.json` shape.
   - Copy `data/tiers.ts` → `spec/examples/tiers.example.json` shape.
   - Copy `data/enemies.ts` (and generated) → `spec/examples/enemies.example.json` shape.
2) Define constants in engine
   - ARC_VS_SH=1.3, VOID_PIERCE=0.15
   - Role damage multipliers: det=1.15, prime=0.92, sustain=1.0
   - Detonation constants: SINGLE(1.5/0.10), SAME(2.15/0.25), MIXED(1.20/0.90), CHAIN_HOP_DECAY=0.8
   - Super Balance (as listed in combat.md)
3) Implement loaders/validators to read JSON/MD content and construct runtime tables.
4) Rebuild UI per ui.md with existing assets; wire auto-mapping for scene backgrounds.
5) Add dev harness pages (optional): loadout demo, battle demo, enemy grid demo, dialogue demo.
6) Recreate mission content in MD/JSON using examples; do not port old story text unless rewriting.
7) QA pass
   - Compare outputs against current game: damage numbers, detonation behavior, super flow, AOE targeting.
   - Verify mobile layout stability and primer dot behavior.



