## Gameplay Spec

This document defines the player-facing systems and core loop without referencing a specific UI framework or engine.

Core loop
- Party select (3 members) → Loadout (abilities, one weapon per member) → Optional Dialogue (mission intro) → Battle → Victory screen → Back to missions.

Classes and elements
- Classes: vanguard, technomancer, pyromancer, voidrunner.
- Elements (DamageType): kinetic (KIN), arc (ARC), thermal (THR), void (VOID).

Stats and resources
- Bars per actor: SH (shields), HP (health), SP (super energy).
- Player party members track SH, HP, SP; enemies track SH, HP.
- Super energy range: 0..300 (meter). Costs and gains defined in combat spec.

Party and slots
- Party size: 3.
- Each character has `abilitySlots` (typically 5). Slot composition: at least 1 sustain, the rest offensive (prime/detonator), and a basic attack counts toward offensive.
- One weapon equipped per character; weapons can mod basics, total damage, detonation multipliers, max bars, or super gain.

Abilities (roles)
- role: prime | detonator | sustain.
- Prime: applies primes (see combat spec) and may deal damage.
- Detonator: consumes existing primes and explodes for damage/splash.
- Sustain: defensive or utility (heals, barrier, cleanse, guard, etc.).
- Optional tags: AOE targeting, prime/det flags, sustain flags.

Screens and flows
- Missions: list of missions with best-star display and per-mission character icon hint.
- Dialogue: tap/enter to advance; choice nodes award stars (0..3 total). A persistent “Battle Now” option exists.
- Party screen: choose 3 characters. Loadout screen: per-character ability assignment and weapon selection.
- Battle screen: stable 4×3 enemy grid, per-member ability list with cooldowns and costs, target selection, turn log.

Win/lose
- Win: all enemies defeated. Show mission victory text; persist best stars.
- Lose: all party HP reduced to 0.

Persistence
- Persist loadout (party, abilities, weapons) and mission progress (best stars per mission) to storage.


