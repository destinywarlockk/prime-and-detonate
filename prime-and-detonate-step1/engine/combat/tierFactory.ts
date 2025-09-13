import { TIER_TEMPLATES } from '../../data/tiers';
import { EnemyArchetype, EnemyArchetypeOverride, EnemyTier, FactionConfig } from './types';

type FactionBase = {
  baseName: string;
  baseStats: { hp: number; shields: number; speed: number; damage: number };
  // default ability pools for this faction; the generator will pick slots from here
  pools: {
    primers: ReadonlyArray<EnemyArchetype['abilities'][number]>;
    detonators: ReadonlyArray<EnemyArchetype['abilities'][number]>;
    nukes: ReadonlyArray<EnemyArchetype['abilities'][number]>;
  };
  roleByTier?: Partial<Record<EnemyTier, EnemyArchetype['role']>>;
};

export function buildFactionArchetypes(
  factionId: FactionConfig['id'],
  base: FactionBase,
  overrides: EnemyArchetypeOverride[] = []
): EnemyArchetype[] {
  const out: EnemyArchetype[] = [];

  (Object.keys(TIER_TEMPLATES) as EnemyTier[]).forEach((tier) => {
    const T = TIER_TEMPLATES[tier];
    const role = base.roleByTier?.[tier] || defaultRoleForTier(tier);
    const name = T.nameFormat(base.baseName);
    const key = `${factionId.toLowerCase()}_${tier.toLowerCase()}`;

    // slot abilities
    const abilities = [
      ...pickFrom(base.pools.primers, T.abilitySlots.primers),
      ...pickFrom(base.pools.detonators, T.abilitySlots.detonators),
      ...pickFrom(base.pools.nukes, T.abilitySlots.nukes)
    ];

    // stats: base × tier (faction multipliers applied at instantiation time)
    const stats = {
      hp: Math.round(base.baseStats.hp * T.mult.hp),
      shields: Math.round(base.baseStats.shields * T.mult.shields),
      speed: Math.round(base.baseStats.speed * T.mult.speed),
      damage: Math.round(base.baseStats.damage * T.mult.damage),
    };

    const arch: EnemyArchetype = {
      key,
      name,
      faction: factionId,
      role,
      baseStats: stats,
      abilities,
      tags: [tier]
    };

    out.push(arch);
  });

  // apply explicit overrides after defaults are created
  for (const o of overrides.filter(o => o.faction === factionId)) {
    const idx = out.findIndex(a => a.key === o.key);
    if (idx >= 0) {
      out[idx] = {
        ...out[idx],
        ...(o.name ? { name: o.name } : {}),
        ...(o.role ? { role: o.role } : {}),
        ...(o.tags ? { tags: [...new Set([...(out[idx].tags||[]), ...o.tags])] } : {}),
        ...(o.baseStats ? { baseStats: { ...out[idx].baseStats, ...o.baseStats } } : {}),
        ...(o.abilities ? { abilities: o.abilities } : {})
      };
    } else {
      // allow creating brand-new specific archetypes (e.g., storyline bosses)
    }
  }

  return out;
}

function pickFrom<T>(pool: ReadonlyArray<T>, n: number): T[] {
  if (n <= 0) return [];
  if (pool.length <= n) return pool.slice(0, n);
  const copy = pool.slice();
  const out: T[] = [];
  while (out.length < n && copy.length) {
    out.push(copy.splice(rand(copy.length), 1)[0]);
  }
  return out;
}
const rand = (n:number) => Math.floor(Math.random()*n);
function defaultRoleForTier(t: EnemyTier): EnemyArchetype['role'] {
  if (t==='Grunt') return 'Minion';
  if (t==='Elite') return 'Skirmisher';
  if (t==='Miniboss') return 'Bruiser';
  return 'Captain';
}


