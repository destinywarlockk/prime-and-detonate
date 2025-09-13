import { FactionConfig } from '../engine/combat/types';

export const FACTIONS: Record<FactionConfig['id'], FactionConfig> = {
  Voidborn: {
    id: 'Voidborn',
    hpMult: 1.3,
    shMult: 1.0,
    spdMult: 0.85,
    dmgMult: 1.15,
    // Voidborn are weak to thermal (fire) - 1.4x damage
    resistVuln: { void: 0.8, arc: 1.2, thermal: 1.4, kinetic: 1.0 },
    primeMods: { applyChanceBonus: { suppress: 0.15, pierce: 0.10 }, durationMod: { suppress: 1.2 } },
    specials: { regenPerTurn: 2 }
  },
  Syndicate: {
    id: 'Syndicate',
    hpMult: 1.0,
    shMult: 1.15,
    spdMult: 1.15,
    dmgMult: 1.25,
    // Syndicate are weak to void - 1.4x damage
    resistVuln: { arc: 1.0, thermal: 1.0, void: 1.4, kinetic: 1.0 },
    primeMods: { applyChanceBonus: { overload: 0.05, burn: 0.05, suppress: 0.05 } },
    specials: { counterChance: 0.1 }
  },
  Accord: {
    id: 'Accord',
    hpMult: 1.15,
    shMult: 1.0,
    spdMult: 1.0,
    dmgMult: 1.20,
    // Accord are weak to thermal - 1.4x damage
    resistVuln: { kinetic: 0.9, thermal: 1.4, arc: 1.0, void: 1.0 },
    specials: { detonationBonus: 0.25, reinforcementChance: 0.1 }
  },
  Outlaws: {
    id: 'Outlaws',
    hpMult: 0.7,
    shMult: 0.3,
    spdMult: 1.2,
    dmgMult: 1.00,
    // Outlaws are weak to arc - 1.4x damage
    resistVuln: { kinetic: 1.05, arc: 1.4, thermal: 1.1, void: 1.05 },
    specials: { swarmAura: { radius: 3, dmgBonus: 0.1 } }
  }
};


