## Content Schemas

Notation
- JSON-first, but MD is allowed for dialogue scripts (see mission DSL below).
- Types match current content; keep names stable to ease migration.

Common enums
- DamageType: "kinetic" | "arc" | "thermal" | "void"
- ClassId: "vanguard" | "technomancer" | "pyromancer" | "voidrunner"
- AbilityRole: "prime" | "detonator" | "sustain"

Ability (src/content/abilities)
```json
{
  "id": "rail-shot",
  "name": "Rail Shot",
  "type": "kinetic",
  "role": "detonator",
  "baseDamage": 25,
  "cooldown": 0,
  "primesApplied": 0,
  "primeType": "weakpoint",
  "detonates": true,
  "detonationTriggers": ["weakpoint", "overload", "burn", "suppress", "freeze"],
  "splashFactor": 0.3,
  "allowedClasses": ["vanguard"],
  "critBonus": 0,
  "aoeRadius": 0,
  "statusEffects": [],
  "comboMultiplier": 1,
  "cost": 0,
  "targeting": { "mode": "single" },
  "riders": [],
  "superCost": 0,
  "cooldownTurns": 0,
  "grantsSuperOnHit": true,
  "tags": {
    "prime": false,
    "detonator": true,
    "primeElement": null,
    "primeName": null,
    "sustain": false,
    "AOE": false,
    "NoPrimeNoDet": false,
    "ShieldBreaker": false
  }
}
```

Weapon (src/content/weapons)
```json
{
  "id": "det-gauntlet",
  "name": "Detonator Gauntlet",
  "basicMult": null,
  "basicType": "void",
  "totalDamageMult": null,
  "detonationDirectMult": 1.25,
  "detonationSplashMult": 1.5,
  "maxHpBonus": null,
  "maxShBonus": null,
  "superGainMult": null
}
```

Character (src/content/characters)
```json
{
  "id": "nova",
  "name": "Nova",
  "classId": "vanguard",
  "baseBars": { "sh": 35, "hp": 130, "sp": 0 },
  "abilitySlots": 5
}
```

Faction (data/factions)
```json
{
  "id": "Accord",
  "hpMult": 1.15,
  "shMult": 1.0,
  "spdMult": 1.0,
  "dmgMult": 1.20,
  "resistVuln": { "kinetic": 0.9, "thermal": 1.4, "arc": 1.0, "void": 1.0 },
  "primeMods": {
    "applyChanceBonus": { "suppress": 0 },
    "durationMod": { "suppress": 1 }
  },
  "specials": {
    "detonationBonus": 0.25,
    "reinforcementChance": 0.1,
    "counterChance": 0,
    "swarmAura": null
  }
}
```

Tier template (data/tiers)
```json
{
  "tier": "Elite",
  "mult": { "hp": 1.1, "shields": 1.0, "speed": 1.0, "damage": 1.0 },
  "ai": { "actionPoints": 1, "preferDetonation": 0.2, "preferPrimers": 0.2, "targetDiscipline": 0.5, "counterChance": 0.05, "primeResistMod": 0.95 },
  "spawnWeight": 30,
  "lootTier": "Uncommon",
  "abilitySlots": { "primers": 1, "detonators": 1, "nukes": 1 },
  "nameFormat": "${base} Elite"
}
```

Enemy archetype (data/enemies)
```json
{
  "key": "accord_trooper",
  "name": "Accord Trooper",
  "faction": "Accord",
  "role": "Bruiser",
  "baseStats": { "hp": 114, "shields": 25, "speed": 8, "damage": 18 },
  "abilities": [
    { "id": "rifle_burst", "display": "Rifle Burst", "damageType": "kinetic", "aiWeight": 0.6 },
    { "id": "focus_fire", "display": "Focus Fire", "damageType": "kinetic", "isDetonator": true, "aiWeight": 0.4 }
  ],
  "tags": ["DetonatorFocus", "Elite"]
}
```

Mission (story DSL, implementation-independent)
- Either JSON or MD with frontmatter; UI renders `DialogueLine[]` at runtime.
- MD format:
```md
---
id: nova_boldness_under_fire
name: Boldness Under Fire
character: Nova
factionMet: Outlaws
factionFought: Syndicate
---

# scene: nova_boldness_intro
Narrator: Dockside meeting with Outlaws, planning a daring ambush.
Outlaw Lead (right): We move fast or we don't move at all. Your call, Nova.
Nova (left): One shot to hit the spine while they blink...

? choice: Boldness
- [★] Spine route
- Crane route
- Wait

# scene: nova_boldness_battle
Narrator: Drones dart into formation. Time to move.
```

Validation rules
- IDs must be unique within their domain.
- Referenced IDs (abilities on characters, weapons, enemy abilities) must exist.
- DamageType and ClassId must match enums.
- Numeric ranges: splash factors 0..1, multipliers > 0, costs ≥ 0.



