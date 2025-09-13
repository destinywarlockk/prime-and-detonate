## Enemies, Factions, Tiers, Waves

Factions (config)
- Each faction defines per-stat multipliers, elemental resist/vuln, optional prime mods, and specials.
- Example (Accord):
  - hpMult 1.15, shMult 1.0, spdMult 1.0, dmgMult 1.20
  - resistVuln: kinetic 0.9, thermal 1.4, arc 1.0, void 1.0
  - specials: detonationBonus 0.25, reinforcementChance 0.1
- Example (Voidborn): thermal 1.4 vuln; specials: regenPerTurn 2.
- Example (Syndicate): counterChance 0.1.
- Example (Outlaws): swarmAura { radius: 3, dmgBonus: 0.1 }.

Enemy archetypes
- Fields: key, name, faction, role, baseStats { hp, shields, speed, damage }, abilities[], tags[].
- Abilities are simple entries with damageType and flags isPrimer/isDetonator/primeType.

Tier templates
- Grunt | Elite | Miniboss | Boss with multipliers and AI knobs.
- From current templates:
  - Grunt: mult { hp 0.5, shields 0.6, speed 1.1, damage 0.6 }, spawnWeight 60, abilitySlots { P1 D0 N1 }
  - Elite: mult { hp 1.1, shields 1.0, speed 1.0, damage 1.0 }, spawnWeight 30, abilitySlots { P1 D1 N1 }
  - Miniboss: mult { hp 1.6, shields 1.3, speed 0.95, damage 1.2 }, spawnWeight 8, abilitySlots { P1 D1 N2 }
  - Boss: mult { hp 2.64, shields 1.8, speed 1.0, damage 1.68 }, spawnWeight 2, abilitySlots { P1 D2 N2 }
- Name formats like "${base} Grunt" per tier.

Instantiation
- Effective stats = round(archetype.baseStats × tier.mult × faction multipliers).
- Grunts have shields forced to 0.

Scaling (optional)
- scaleEnemyStats(base, { difficulty, playerLevel }) uses d = 1 + difficulty*0.15 + playerLevel*0.08 to scale hp/shields/damage.

Wave building
- Single-faction wave (size N): randomly sample archetypes of a given faction with replacement, then aggregate counts.
- Threat-budget based wave:
  - Threat cost per tier: { Grunt:1, Elite:2, Miniboss:4, Boss:8 }.
  - Pick a random faction present; pre-bucket archetypes by tier within that faction.
  - While remaining budget > 0 and enemyCap not reached:
    - Filter tiers whose threat cost ≤ remaining and with candidates available.
    - Weighted pick among affordable tiers using each tier’s spawnWeight.
    - Pick a random key within the chosen tier; increment count; decrement budget by tier cost.
  - Ensure at least one enemy if nothing selected.

Reinforcements
- Per-faction reinforcementChance may be checked between waves to add extra enemies.

AI sketch
- chooseEnemyAction considers: primers, detonators, nukes; prefers detonators on primed targets; low-HP defensive leaning; allies with detonators → prefer priming; prioritized targets by low SH/HP.



