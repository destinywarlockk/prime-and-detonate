import type { Ability, ClassId } from '../game/types'

// Core Abilities Table - Updated for party system with class restrictions
export const ABILITIES_TABLE: Ability[] = [
  // BASIC ATTACK ABILITIES (1 per character)
  {
    id: 'basic-attack-kinetic',
    name: 'Basic Attack',
    type: 'kinetic',
    role: 'prime',
    baseDamage: 12,
    primesApplied: 1,
    primeType: 'weakpoint',
    allowedClasses: ['vanguard'],
    tags: { prime: true, primeElement: 'kinetic', primeName: 'Weakpoint' }
  },
  {
    id: 'basic-attack-arc',
    name: 'Basic Attack',
    type: 'arc',
    role: 'prime',
    baseDamage: 12,
    primesApplied: 1,
    primeType: 'overload',
    allowedClasses: ['technomancer'],
    tags: { prime: true, primeElement: 'arc', primeName: 'Overload' }
  },
  {
    id: 'basic-attack-thermal',
    name: 'Basic Attack',
    type: 'thermal',
    role: 'prime',
    baseDamage: 12,
    primesApplied: 1,
    primeType: 'burn',
    allowedClasses: ['pyromancer'],
    tags: { prime: true, primeElement: 'thermal', primeName: 'Burn' }
  },
  {
    id: 'basic-attack-void',
    name: 'Basic Attack',
    type: 'void',
    role: 'prime',
    baseDamage: 12,
    primesApplied: 1,
    primeType: 'suppress',
    allowedClasses: ['voidrunner'],
    tags: { prime: true, primeElement: 'void', primeName: 'Suppress' }
  },

  // KINETIC ABILITIES
  {
    id: 'rail-shot',
    name: 'Rail Shot',
    type: 'kinetic',
    role: 'detonator',
    baseDamage: 25,
    detonates: true,
    detonationTriggers: ['weakpoint', 'overload', 'burn', 'suppress', 'freeze'],
    splashFactor: 0.3,
    allowedClasses: ['vanguard'],
    tags: { detonator: true }
  },
  {
    id: 'suppressive-burst',
    name: 'Suppressive Burst',
    type: 'kinetic',
    role: 'prime',
    baseDamage: 12,
    primesApplied: 1,
    primeType: 'weakpoint',
    splashFactor: 0.4,
    allowedClasses: ['vanguard'],
    tags: { prime: true, primeElement: 'kinetic', primeName: 'Weakpoint' }
  },
  {
    id: 'overwatch',
    name: 'Overwatch',
    type: 'kinetic',
    role: 'detonator',
    baseDamage: 18,
    primesApplied: 1,
    primeType: 'weakpoint',
    detonates: true,
    detonationTriggers: ['weakpoint', 'overload', 'burn', 'suppress', 'freeze'],
    critBonus: 1.5,
    allowedClasses: ['vanguard'],
    tags: { detonator: true }
  },

  // ARC ABILITIES
  {
    id: 'arc-surge',
    name: 'Arc Surge',
    type: 'arc',
    role: 'prime',
    baseDamage: 15,
    primesApplied: 1,
    primeType: 'overload',
    splashFactor: 0.5,
    allowedClasses: ['technomancer'],
    tags: { prime: true, primeElement: 'arc' }
  },
  {
    id: 'chain-discharge',
    name: 'Chain Discharge',
    type: 'arc',
    role: 'detonator',
    baseDamage: 20,
    detonates: true,
    detonationTriggers: ['overload', 'suppress'],
    splashFactor: 0.6,
    aoeRadius: 2,
    allowedClasses: ['technomancer'],
    tags: { detonator: true }
  },
  {
    id: 'capacitor-overload',
    name: 'Capacitor Overload',
    type: 'arc',
    role: 'detonator',
    baseDamage: 16,
    primesApplied: 1,
    primeType: 'overload',
    detonates: true,
    detonationTriggers: ['overload'],
    splashFactor: 0.4,
    allowedClasses: ['technomancer'],
    tags: { detonator: true }
  },

  // THERMAL ABILITIES
  {
    id: 'thermal-lance',
    name: 'Thermal Lance',
    type: 'thermal',
    role: 'prime',
    baseDamage: 14,
    primesApplied: 1,
    primeType: 'burn',
    splashFactor: 0.3,
    allowedClasses: ['pyromancer'],
    tags: { prime: true, primeElement: 'thermal' }
  },
  {
    id: 'thermal-burst',
    name: 'Thermal Burst',
    type: 'thermal',
    role: 'detonator',
    baseDamage: 22,
    detonates: true,
    detonationTriggers: ['burn'],
    splashFactor: 0.7,
    aoeRadius: 3,
    allowedClasses: ['pyromancer'],
    tags: { detonator: true }
  },
  {
    id: 'meltdown-strike',
    name: 'Meltdown Strike',
    type: 'thermal',
    role: 'detonator',
    baseDamage: 19,
    primesApplied: 1,
    primeType: 'burn',
    detonates: true,
    detonationTriggers: ['burn'],
    comboMultiplier: 2.0,
    allowedClasses: ['pyromancer'],
    tags: { detonator: true }
  },

  // VOID ABILITIES
  {
    id: 'void-suppression',
    name: 'Void Suppression',
    type: 'void',
    role: 'prime',
    baseDamage: 13,
    primesApplied: 1,
    primeType: 'suppress',
    statusEffects: ['turn-delay'],
    allowedClasses: ['voidrunner'],
    tags: { prime: true, primeElement: 'void' }
  },
  {
    id: 'gravity-collapse',
    name: 'Gravity Collapse',
    type: 'void',
    role: 'detonator',
    baseDamage: 24,
    detonates: true,
    detonationTriggers: ['suppress'],
    splashFactor: 0.5,
    allowedClasses: ['voidrunner'],
    tags: { detonator: true }
  },
  {
    id: 'singularity-spike',
    name: 'Singularity Spike',
    type: 'void',
    role: 'detonator',
    baseDamage: 17,
    primesApplied: 1,
    primeType: 'suppress',
    detonates: true,
    detonationTriggers: ['suppress'],
    aoeRadius: 2,
    allowedClasses: ['voidrunner'],
    tags: { detonator: true }
  },

  // HYBRID/SPECIAL ABILITIES
  {
    id: 'cryo-grenade',
    name: 'Cryo Grenade',
    type: 'thermal',
    role: 'prime',
    baseDamage: 10,
    primesApplied: 1,
    primeType: 'freeze',
    splashFactor: 0.6,
    statusEffects: ['slow'],
    allowedClasses: ['pyromancer'],
    tags: { prime: true, primeElement: 'thermal' }
  },
  {
    id: 'shatter-round',
    name: 'Shatter Round',
    type: 'kinetic',
    role: 'detonator',
    baseDamage: 28,
    detonates: true,
    detonationTriggers: ['freeze'],
    critBonus: 2.0,
    allowedClasses: ['vanguard'],
    tags: { detonator: true }
  },
  {
    id: 'disruptor-pulse',
    name: 'Disruptor Pulse',
    type: 'arc',
    role: 'detonator',
    baseDamage: 30,
    detonates: true,
    detonationTriggers: ['overload', 'suppress'],
    splashFactor: 0.8,
    aoeRadius: 3,
    allowedClasses: ['technomancer'],
    tags: { detonator: true }
  },
  {
    id: 'incendiary-sweep',
    name: 'Incendiary Sweep',
    type: 'thermal',
    role: 'detonator',
    baseDamage: 26,
    detonates: true,
    detonationTriggers: ['burn', 'weakpoint'],
    splashFactor: 0.9,
    aoeRadius: 4,
    allowedClasses: ['pyromancer'],
    tags: { detonator: true }
  },
  {
    id: 'coordinated-strike',
    name: 'Coordinated Strike',
    type: 'kinetic',
    role: 'detonator',
    baseDamage: 32,
    detonates: true,
    detonationTriggers: ['weakpoint', 'suppress'],
    splashFactor: 0.5,
    comboMultiplier: 1.8,
    allowedClasses: ['vanguard'],
    tags: { detonator: true }
  }
];

// Sustain ability factory functions
export function makeKineticBarrier(): Ability {
  return {
    id: 'kinetic-barrier',
    name: 'Kinetic Barrier',
    type: 'kinetic',
    role: 'sustain',
    baseDamage: 0,
    cooldown: 2,
    allowedClasses: ['vanguard'],
    superCost: 10,
    tags: { sustain: true }
  };
}

export function makeThermalBurstSustain(): Ability {
  return {
    id: 'thermal-burst-sustain',
    name: 'Thermal Burst',
    type: 'thermal',
    role: 'sustain',
    baseDamage: 0,
    cooldown: 3,
    allowedClasses: ['pyromancer'],
    superCost: 15,
    tags: { sustain: true }
  };
}

export function makeArcRestore(): Ability {
  return {
    id: 'arc-restore',
    name: 'Arc Restore',
    type: 'arc',
    role: 'sustain',
    baseDamage: 0,
    cooldown: 3,
    allowedClasses: ['technomancer'],
    superCost: 12,
    tags: { sustain: true }
  };
}

export function makeVoidDrain(): Ability {
  return {
    id: 'void-drain',
    name: 'Void Drain',
    type: 'void',
    role: 'sustain',
    baseDamage: 0,
    cooldown: 2,
    allowedClasses: ['voidrunner'],
    superCost: 6,
    tags: { sustain: true }
  };
}

export function makeHeal(): Ability {
  return {
    id: 'heal',
    name: 'Heal',
    type: 'kinetic',
    role: 'sustain',
    baseDamage: 0,
    cooldown: 1,
    allowedClasses: ['vanguard', 'technomancer', 'pyromancer', 'voidrunner'],
    superCost: 4,
    tags: { sustain: true }
  };
}

export function makeBarrier(): Ability {
  return {
    id: 'barrier',
    name: 'Barrier',
    type: 'arc',
    role: 'sustain',
    baseDamage: 0,
    cooldown: 2,
    allowedClasses: ['vanguard', 'technomancer', 'pyromancer', 'voidrunner'],
    superCost: 6,
    tags: { sustain: true }
  };
}

export function makeCleanse(): Ability {
  return {
    id: 'cleanse',
    name: 'Cleanse',
    type: 'void',
    role: 'sustain',
    baseDamage: 0,
    allowedClasses: ['vanguard', 'technomancer', 'pyromancer', 'voidrunner'],
    superCost: 2,
    tags: { sustain: true }
  };
}

export function makeGuard(): Ability {
  return {
    id: 'guard',
    name: 'Guard',
    type: 'kinetic',
    role: 'sustain',
    baseDamage: 0,
    cooldown: 2,
    allowedClasses: ['vanguard', 'technomancer', 'pyromancer', 'voidrunner'],
    superCost: 0,
    tags: { sustain: true }
  };
}

// Additional abilities for expanded gameplay
export const NEW_ABILITIES: Ability[] = [
  // Prime Shot (Arc, primesApplied:1, detonates:false) → allowedClasses: ['technomancer','pyromancer','voidrunner']
  {
    id: 'prime-shot',
    name: 'Prime Shot',
    type: 'arc',
    role: 'prime',
    baseDamage: 8,
    primesApplied: 1,
    primeType: 'overload',
    detonates: false,
    allowedClasses: ['technomancer', 'pyromancer', 'voidrunner'],
    tags: { prime: true, primeElement: 'arc' }
  },
  
  // Kinetic Burst (Kinetic, detonates:true) → ['vanguard']
  {
    id: 'kinetic-burst',
    name: 'Kinetic Burst',
    type: 'kinetic',
    role: 'detonator',
    baseDamage: 22,
    detonates: true,
    detonationTriggers: ['weakpoint', 'overload', 'burn', 'suppress', 'freeze'],
    allowedClasses: ['vanguard'],
    tags: { detonator: true }
  },
  
  // Thermal Bomb (Thermal, primesApplied:1, detonates:true, splashFactor:0.5) → ['pyromancer']
  {
    id: 'thermal-bomb',
    name: 'Thermal Bomb',
    type: 'thermal',
    role: 'detonator',
    baseDamage: 16,
    primesApplied: 1,
    primeType: 'burn',
    detonates: true,
    detonationTriggers: ['burn'],
    splashFactor: 0.5,
    allowedClasses: ['pyromancer'],
    tags: { detonator: true }
  },
  
  // Arc Lance (Arc, higher SH damage) → ['technomancer']
  {
    id: 'arc-lance',
    name: 'Arc Lance',
    type: 'arc',
    role: 'prime',
    baseDamage: 18,
    primesApplied: 1,
    primeType: 'overload',
    splashFactor: 0.3,
    allowedClasses: ['technomancer'],
    tags: { prime: true, primeElement: 'arc' }
  },
  
  // Void Lance (Void, pierce effect via type) → ['voidrunner']
  {
    id: 'void-lance',
    name: 'Void Lance',
    type: 'void',
    role: 'prime',
    baseDamage: 16,
    primesApplied: 1,
    primeType: 'suppress',
    splashFactor: 0.2,
    allowedClasses: ['voidrunner'],
    tags: { prime: true, primeElement: 'void' }
  },
  
  // New primes per class (distinct type from each class core)
  {
    id: 'ion-mark',
    name: 'Ion Mark',
    type: 'arc',
    role: 'prime',
    baseDamage: 12,
    primesApplied: 1,
    primeType: 'overload',
    splashFactor: 0.2,
    allowedClasses: ['vanguard'],
    tags: { prime: true, primeElement: 'arc' }
  },
  {
    id: 'targeting-uplink',
    name: 'Targeting Uplink',
    type: 'kinetic',
    role: 'prime',
    baseDamage: 8,
    primesApplied: 1,
    primeType: 'weakpoint',
    splashFactor: 0.3,
    allowedClasses: ['technomancer'],
    tags: { prime: true, primeElement: 'kinetic', primeName: 'Weakpoint' }
  },
  {
    id: 'cinder-bind',
    name: 'Cinder Bind',
    type: 'void',
    role: 'prime',
    baseDamage: 12,
    primesApplied: 1,
    primeType: 'suppress',
    statusEffects: ['turn-delay'],
    allowedClasses: ['pyromancer'],
    tags: { prime: true, primeElement: 'void' }
  },
  {
    id: 'shadow-brand',
    name: 'Shadow Brand',
    type: 'kinetic',
    role: 'prime',
    baseDamage: 10,
    primesApplied: 1,
    primeType: 'weakpoint',
    splashFactor: 0.25,
    allowedClasses: ['voidrunner'],
    tags: { prime: true, primeElement: 'kinetic', primeName: 'Weakpoint' }
  },
  
  // Phase 2 sustains
  makeKineticBarrier(),
  makeThermalBurstSustain(),
  makeArcRestore(),
  makeVoidDrain(),
  makeHeal(),
  makeBarrier(),
  makeCleanse(),
  makeGuard(),
  
  // Detonator Strike (Kinetic, detonates:true, no prime) → ['vanguard']
  {
    id: 'detonator-strike',
    name: 'Detonator Strike',
    type: 'kinetic',
    role: 'detonator',
    baseDamage: 26,
    detonates: true,
    detonationTriggers: ['weakpoint', 'overload', 'burn', 'suppress', 'freeze'],
    splashFactor: 0.4,
    allowedClasses: ['vanguard'],
    tags: { detonator: true }
  },
  
  // New AOE abilities with super cost gating
  {
    id: 'nova_aoe_suppressive_barrage',
    name: 'Suppressive Barrage',
    type: 'kinetic',
    role: 'prime',
    baseDamage: 15,
    allowedClasses: ['vanguard'],
    tags: { AOE: true, NoPrimeNoDet: true },
    targeting: { mode: 'n-random', count: 3 },
    riders: ['ignore10pctShields'],
    superCost: 40,
    cooldownTurns: 1,
    grantsSuperOnHit: false,
  },
  
  {
    id: 'volt_aoe_static_surge',
    name: 'Static Surge',
    type: 'arc',
    role: 'prime',
    baseDamage: 12,
    allowedClasses: ['technomancer'],
    tags: { AOE: true, ShieldBreaker: true, NoPrimeNoDet: true },
    targeting: { mode: 'all' },
    riders: ['doubleVsShields'],
    superCost: 40,
    cooldownTurns: 1,
    grantsSuperOnHit: false,
  },
  
  {
    id: 'ember_aoe_emberwave',
    name: 'Emberwave',
    type: 'thermal',
    role: 'prime',
    baseDamage: 8,
    allowedClasses: ['pyromancer'],
    tags: { AOE: true, Primer: true },
    targeting: { mode: 'n-random', count: 2 },
    primesApplied: 1,
    primeType: 'burn',
    riders: [],
    superCost: 40,
    cooldownTurns: 1,
    grantsSuperOnHit: false,
  },
  
  {
    id: 'shade_aoe_entropy_collapse',
    name: 'Entropy Collapse',
    type: 'void',
    role: 'detonator',
    baseDamage: 9,
    allowedClasses: ['voidrunner'],
    tags: { AOE: true, Detonator: true, Control: true },
    targeting: { mode: 'n-random', count: 2 },
    detonates: true,
    detonationTriggers: ['weakpoint', 'overload', 'burn', 'suppress', 'freeze'],
    riders: ['applySuppressOnDetonate'],
    superCost: 40,
    cooldownTurns: 1,
    grantsSuperOnHit: false,
  }
];

// Combined abilities list
export const ALL_ABILITIES: Ability[] = [...ABILITIES_TABLE, ...NEW_ABILITIES];

// Fast lookup map for ability id → object
export const ABILITY_BY_ID: Record<string, Ability> = Object.fromEntries(
  ALL_ABILITIES.map(a => [a.id, a])
);

// Class → Defensive ability id used when the player hits the "Defend" slot
export const DEFENSIVE_BY_CLASS: Record<ClassId, string> = {
  vanguard: 'kinetic-barrier',
  technomancer: 'arc-restore',
  pyromancer: 'thermal-burst-sustain',
  voidrunner: 'void-drain',
};

// Helper functions for easy ability management
export function getAbilityById(id: string): Ability | undefined {
  return ABILITY_BY_ID[id];
}

export function getAbilitiesByRole(role: Ability['role']): Ability[] {
  return ALL_ABILITIES.filter(ability => ability.role === role);
}

export function getAbilitiesByType(type: Ability['type']): Ability[] {
  return ALL_ABILITIES.filter(ability => ability.type === type);
}

export function getPrimeAbilities(): Ability[] {
  return ALL_ABILITIES.filter(ability => ability.primesApplied && ability.primesApplied > 0);
}

export function getDetonatorAbilities(): Ability[] {
  return ALL_ABILITIES.filter(ability => ability.detonates);
}

export function getAbilitiesByClass(classId: ClassId): Ability[] {
  return ALL_ABILITIES.filter(ability => ability.allowedClasses.includes(classId));
}
