import { GENERATED_ENEMIES } from '../../data/enemies.generated';
import { ENEMIES as CUSTOM_ENEMIES } from '../../data/enemies';
import { FACTIONS } from '../../data/factions';
import { EnemyArchetype, FactionConfig } from './types';

export interface EnemyInstance {
  key: string;
  name: string;
  faction: FactionConfig['id'];
  stats: { hp: number; maxHp: number; shields: number; maxShields: number; speed: number; damage: number };
  abilities: EnemyArchetype['abilities'];
  role: EnemyArchetype['role'];
  tags?: string[];
}

export const ALL_ARCHETYPES: EnemyArchetype[] = [...GENERATED_ENEMIES, ...((CUSTOM_ENEMIES as EnemyArchetype[]) || [])];

export function instantiateEnemy(key: string): EnemyInstance {
  const arch = ALL_ARCHETYPES.find(e => e.key === key);
  if (!arch) throw new Error(`Enemy archetype not found: ${key}`);
  const f = FACTIONS[arch.faction];
  const stats = {
    hp: Math.round(arch.baseStats.hp * f.hpMult),
    maxHp: Math.round(arch.baseStats.hp * f.hpMult),
    shields: Math.round(arch.baseStats.shields * f.shMult),
    maxShields: Math.round(arch.baseStats.shields * f.shMult),
    speed: Math.round(arch.baseStats.speed * f.spdMult),
    damage: Math.round(arch.baseStats.damage * f.dmgMult)
  };
  // Grunts have no shields at all
  if ((arch.tags || []).includes('Grunt')) {
    stats.shields = 0;
    stats.maxShields = 0;
  }
  return { key: arch.key, name: arch.name, faction: arch.faction, stats, abilities: arch.abilities, role: arch.role, tags: arch.tags };
}


