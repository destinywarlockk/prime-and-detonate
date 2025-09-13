## Prime & Detonate — Spec-Driven Rebuild

Purpose: a complete, implementation-agnostic specification of the current game, so we can regenerate a clean, more performant codebase from scratch. This spec captures systems, data schemas, constants, and UX without porting story mission content. It emphasizes drop-in content (JSON/MD) for missions, abilities, weapons, characters, enemies, and factions.

Out of scope for this spec
- Story mission content (we will remake missions). Only the mission format and renderer behavior are specified.
- Non-gameplay build config and bundler details.

Guiding principles
- Table-/data-driven first: all gameplay content is defined in data files; code reads from tables and schemas.
- Four damage elements: kinetic (green), arc (blue), thermal (orange), void (purple).
- Clear separation of content vs. systems. No hardcoded abilities outside the content tables.
- Deterministic, testable subsystems with explicit constants.
- Mobile-first UI with stable layouts (no layout shift in battle grid or enemy cards).

Folders in this spec
- gameplay.md — Core loop, classes, stats, elements, slots, resources
- combat.md — Damage routing, primes/detonation, AOE, super meter
- content-schemas.md — JSON schemas for abilities, weapons, characters, factions, enemies, tiers, missions (DSL)
- enemies-factions-tiers.md — Faction multipliers, tier templates, wave building
- ui.md — Battle grid, primer dots, loadout, dialogue, mission select
- assets-and-structure.md — Asset mapping rules and suggested project structure
- examples/ — Minimal JSON/MD examples to bootstrap new content
- validation-and-migration.md — Validation and a checklist to migrate/regenerate

How to use this spec
1) Implement the systems as described, with the same constants and behaviors.
2) Implement the schemas and loaders; validate JSON/MD content at load time.
3) Wire the UI flows and ensure visual specs for the battle grid and dialogue.
4) Populate content by copying/adapting your existing tables into the new schemas.
5) Reintroduce story missions by writing new MD/JSON per the mission DSL.



