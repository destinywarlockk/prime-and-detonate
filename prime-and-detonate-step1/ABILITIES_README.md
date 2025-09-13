# Prime & Detonate - Ability System

## Overview
The ability system is now table-driven and highly extensible. You can easily add new abilities, modify existing ones, and create complex interactions between different prime types and detonation triggers.

## How to Add New Abilities

### 1. **Simple Addition**
Just add a new ability object to the `ABILITIES_TABLE` array in `src/content/abilities.ts`:

```typescript
{
  id: 'my-new-ability',
  name: 'My New Ability',
  type: 'kinetic',
  role: 'prime',
  baseDamage: 15,
  primesApplied: 1,
  primeType: 'weakpoint'
}
```

### 2. **Advanced Abilities**
Add special properties for more complex effects:

```typescript
{
  id: 'super-combo',
  name: 'Super Combo',
  type: 'thermal',
  role: 'hybrid',
  baseDamage: 25,
  primesApplied: 1,
  primeType: 'burn',
  detonates: true,
  detonationTriggers: ['burn', 'weakpoint'],
  splashFactor: 0.8,
  aoeRadius: 3,
  critBonus: 2.0,
  comboMultiplier: 1.5,
  cost: 30,
  statusEffects: ['stun', 'burn-dot']
}
```

## Prime Types

The system now supports 5 different prime types:

- **`weakpoint`** - Kinetic primes, increases crit chance
- **`overload`** - Arc primes, stuns shields, bonus vs shields  
- **`burn`** - Thermal primes, applies DoT damage
- **`suppress`** - Void primes, delays enemy turns
- **`freeze`** - Special primes, slows enemies

## Ability Roles

- **`prime`** - Applies primes, doesn't detonate
- **`detonator`** - Detonates existing primes, doesn't apply new ones
 

## Detonation Triggers

Abilities can specify which prime types they can detonate:

```typescript
// Only detonates burn primes
detonationTriggers: ['burn']

// Detonates multiple prime types
detonationTriggers: ['burn', 'weakpoint', 'overload']

// Detonates any prime type (universal detonator)
detonationTriggers: ['weakpoint', 'overload', 'burn', 'suppress', 'freeze']
```

## Special Properties

### **Splash & AOE**
- `splashFactor: 0.5` - 50% of damage splashes to nearby enemies
- `aoeRadius: 3` - Affects enemies within 3 tiles

### **Critical Hits**
- `critBonus: 1.5` - 50% increased critical hit damage

### **Combo Multipliers**
- `comboMultiplier: 2.0` - Double damage when detonating primes

### **Status Effects**
- `statusEffects: ['stun', 'slow']` - Applies status conditions

### **Resource Costs**
- `cost: 25` - Costs 25 SP/energy to use

## Helper Functions

Use these functions to find abilities:

```typescript
import { 
  getAbilityById, 
  getAbilitiesByRole, 
  getAbilitiesByType,
  getPrimeAbilities,
  getDetonatorAbilities,
   
} from './content/abilities';

// Find specific ability
const railShot = getAbilityById('rail-shot');

// Find all prime abilities
const primers = getPrimeAbilities();

// Find all abilities that can detonate burn
const burnDetonators = getDetonatorAbilities().filter(a => 
  a.detonationTriggers?.includes('burn')
);
```

## Example: Adding a New Ability

Want to add a new ability? Here's the complete process:

1. **Design the ability concept**
   - What does it do?
   - What role does it fill?
   - What primes does it interact with?

2. **Create the ability object**
   ```typescript
   {
     id: 'plasma-blast',
     name: 'Plasma Blast',
     type: 'thermal',
      role: 'detonator',
     baseDamage: 28,
      detonates: true,
     detonationTriggers: ['burn'],
     splashFactor: 0.6,
     aoeRadius: 2
   }
   ```

3. **Add it to the table**
   - Copy the object to `ABILITIES_TABLE` in `src/content/abilities.ts`
   - The system automatically handles it!

4. **Test it**
   - The ability will appear in the game
   - All prime/detonation logic works automatically
   - UI updates to show the new ability

## Future Extensions

The system is designed to easily support:

- **Elemental combinations** (Arc + Thermal = Plasma)
- **Chain reactions** (detonating one prime triggers others)
- **Environmental effects** (terrain bonuses, weather effects)
- **Equipment modifiers** (weapons that enhance specific ability types)
- **Character specializations** (bonuses for certain prime types)

## Current Abilities

The system comes with 20+ pre-built abilities covering all damage types and roles. See `src/content/abilities.ts` for the complete list.

---

**Happy ability crafting!** 🚀✨
