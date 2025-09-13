## Assets and Project Structure

Asset mapping
- Images directory keeps existing files; the app auto-maps by normalized filename (lowercased, non-alphanumeric removed) → URL.
- Dialogue backgrounds: match scene keys to image basenames.
- Class icons: `Vanguard.png`, `Technomancer.png`, `Pyromancer.png`, `Voidrunner.png`.
- Enemy thumbnails: can be derived from faction/tier or explicit per-archetype mapping.

Audio
- Reuse existing SFX: prime.mp3, detonation.mp3, ouch.mp3, etc.
- Define a lightweight registry: id → file path; load lazily.

Suggested new project structure (implementation-agnostic)
```
/src
  /assets
    /images
    /audio
  /content
    abilities.json
    weapons.json
    characters.json
    factions.json
    enemies.json       # custom archetypes; generated pool separate if needed
    tiers.json
    /missions          # story content as MD/JSON files
  /engine
    combat/            # damage routing, primes/detonation, AOE, super
    content/           # loaders/validators for schemas
    enemies/           # instantiation, wave builder
  /ui
    battle/
    loadout/
    dialogue/
    missions/
  state/               # store, persistence
```

Build/runtime rules
- No hardcoded abilities/weapons/characters outside tables.
- Enforce schema validation at load-time; log and skip invalid records.
- Provide a dev mode with content hot-reload.



