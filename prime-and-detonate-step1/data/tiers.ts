import { TierTemplate } from '../engine/combat/types';

export const TIER_TEMPLATES: Record<TierTemplate['tier'], TierTemplate> = {
  Grunt: {
    tier: 'Grunt',
    mult: { hp: 0.5, shields: 0.6, speed: 1.1, damage: 0.6 },
    ai: { preferPrimers: 0.1, targetDiscipline: 0.2, primeResistMod: 1.0 },
    spawnWeight: 60,
    lootTier: 'Common',
    abilitySlots: { primers: 1, detonators: 0, nukes: 1 },
    nameFormat: (n) => `${n} Grunt`
  },
  Elite: {
    tier: 'Elite',
    mult: { hp: 1.1, shields: 1.0, speed: 1.0, damage: 1.0 },
    ai: { preferDetonation: 0.2, preferPrimers: 0.2, targetDiscipline: 0.5, counterChance: 0.05, primeResistMod: 0.95 },
    spawnWeight: 30,
    lootTier: 'Uncommon',
    abilitySlots: { primers: 1, detonators: 1, nukes: 1 },
    nameFormat: (n) => `${n} Elite`
  },
  Miniboss: {
    tier: 'Miniboss',
    mult: { hp: 1.6, shields: 1.3, speed: 0.95, damage: 1.2 },
    ai: { preferDetonation: 0.35, targetDiscipline: 0.7, counterChance: 0.08, primeResistMod: 0.9 },
    spawnWeight: 8,
    lootTier: 'Rare',
    abilitySlots: { primers: 1, detonators: 1, nukes: 2 },
    nameFormat: (n) => `${n} Miniboss`
  },
  Boss: {
    tier: 'Boss',
    mult: { hp: 2.64, shields: 1.8, speed: 1.0, damage: 1.68 },
    ai: { actionPoints: 2, preferDetonation: 0.5, targetDiscipline: 0.9, counterChance: 0.12, primeResistMod: 0.85 },
    spawnWeight: 2,
    lootTier: 'Epic',
    abilitySlots: { primers: 1, detonators: 2, nukes: 2 },
    nameFormat: (n) => `${n} Boss`
  }
};


