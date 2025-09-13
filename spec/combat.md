## Combat Spec

Damage types and routing
- Elements: kinetic, arc, thermal, void.
- Shields/HP routing: incoming damage is split by element rules; apply faction multipliers; then route to SH first, overflow to HP. Arc gets bonus vs shields; Void partially pierces to HP.
- Tunables (from engine):
  - ARC_VS_SH = 1.3 (arc damage vs shields multiplier)
  - VOID_PIERCE = 0.15 (portion of post-mitigation damage that bypasses SH to HP)

Roles and base damage
- Role multipliers applied to ability.baseDamage:
  - detonator: 1.15
  - prime: 0.92
  - sustain: 1.0

Prime system
- MAX_PRIMES_PER_TARGET = 2. Order matters; classify as: none | single | same | mixed.
- Applying a prime records: element (DamageType), source (string), appliedAt (turn counter).

Detonation rules
- Tunables:
  - SINGLE_PRIME_DAMAGE_MULT = 1.50
  - SINGLE_PRIME_SPLASH_PCT = 0.10
  - SAME_PRIME_DAMAGE_MULT   = 2.15
  - SAME_PRIME_SPLASH_PCT    = 0.25
  - MIXED_PRIME_DAMAGE_MULT  = 1.20
  - MIXED_PRIME_SPLASH_PCT   = 0.90
  - CHAIN_HOP_DECAY          = 0.8 (when chaining/hopping detonation to neighbors)
- Direct damage baseline for detonation starts from ability.baseDamage × role multiplier (detonator).
- Splash applies to nearby enemies as percent of direct.
- Mixed favors splash; same favors direct.
- After a successful detonation, primes are consumed on the primary target.

Faction multipliers and specials (applied during resolve)
- Apply defender elemental resist/vuln (from faction table) to current hit.
- If attacker is an enemy instance: add faction specials
  - Accord: detonationBonus (additive to damage as (1 + bonus) when isDetonator and defender had primes)
  - Outlaws: swarmAura damage bonus based on nearby allies’ tags
  - Syndicate: counterChance can trigger a post-attack counter (see enemy AI)

AOE targeting
- Targeting modes:
  - single (default)
  - all (all living enemies)
  - n-random (pick count from living enemies at random)
  - n-closest (use positional order; deterministic selection of first N)
- Each hit resolves independently with damage routing and riders.

Super meter
- Range 0..300; L1 cost = 100.
- Gains (approximate per engine BalanceSuper):
  - gainBasic = 40
  - gainDealPer100 = 16 (per 100 damage dealt)
  - gainTakePer100 = 27 (per 100 damage taken)
  - gainPrimeSuccess = 22
  - gainDetonateSuccess = 31
  - gainCritical = 18
  - gainKillShot = 36
  - gainHitPrimed = 13
- Costs/refunds:
  - drainPrime = 3 (Primer use)
  - costDetonate = 6 (Detonator use)
  - refundDetonate = 25 (on successful detonation)
- Cap per turn: maxGainPerTurn = 120 per member.
- AOE abilities can set `grantsSuperOnHit: false` to disable gain per hit.

Weapons impact
- basicMult/basicType: modifies the basic attack element and multiplier.
- totalDamageMult: multiplies all dealt damage by the wielder.
- detonationDirectMult/detonationSplashMult: multiply respective components on detonations.
- maxHpBonus/maxShBonus: increase party member max bars.
- superGainMult: multiply computed super gains for wielder.

Enemy scaling and tiers (hooks)
- Apply tier multipliers (see enemies-factions-tiers.md) during instantiation, plus faction multipliers.
- Grunt enemies have zero shields.

Logging
- Log elemental resist/vuln messages when multipliers ≠ 1.0.
- Log detonation classification and splash.



