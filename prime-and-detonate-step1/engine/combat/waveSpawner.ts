import { instantiateEnemy, ALL_ARCHETYPES } from './enemyFactory';
import { EnemyTier } from './types';
import { TIER_TEMPLATES } from '../../data/tiers';
import type { FactionConfig } from './types';

export interface WaveDef { enemies: Array<{ key: string; count: number }>; reinforcementChance?: number; }
export function spawnWave(def: WaveDef){ return def.enemies.flatMap(e => Array.from({length: e.count}, () => instantiateEnemy(e.key))); }
export function maybeSpawnReinforcement(accum:any[], chance:number, key:string){ if (Math.random() < chance) accum.push(instantiateEnemy(key)); return accum; }

// Build a wave that contains only enemies from a single faction
export function buildSingleFactionWave(faction: FactionConfig['id'], size: number): WaveDef {
  const pool = ALL_ARCHETYPES.filter(e => e.faction === faction);
  if (pool.length === 0) return { enemies: [] };
  // Pick `size` enemies with replacement from the pool
  const picks: string[] = Array.from({ length: Math.max(0, size) }, () => pool[Math.floor(Math.random() * pool.length)].key);
  // Aggregate counts by key
  const counts = picks.reduce<Record<string, number>>((map, key) => {
    map[key] = (map[key] ?? 0) + 1;
    return map;
  }, {});
  return { enemies: Object.entries(counts).map(([key, count]) => ({ key, count })) };
}

// Convenience: choose a random faction present in ENEMIES and build a single-faction wave
export function buildRandomSingleFactionWave(size: number): WaveDef {
  const factions = Array.from(new Set(ALL_ARCHETYPES.map(e => e.faction)));
  const pick = factions[Math.floor(Math.random() * factions.length)];
  return buildSingleFactionWave(pick as FactionConfig['id'], size);
}

export function randomByTier(tier: EnemyTier, faction?: string){
  const pool = ALL_ARCHETYPES.filter(a => (a.tags||[]).includes(tier) && (!faction || a.faction === faction));
  return pool[Math.floor(Math.random()*pool.length)];
}

export function pickWeightedTier(): EnemyTier {
  const entries = Object.values(TIER_TEMPLATES);
  const total = entries.reduce((s,t)=>s+t.spawnWeight,0);
  let r = Math.random()*total;
  for(const t of entries){ r -= t.spawnWeight; if(r<=0) return t.tier; }
  return 'Grunt';
}

// Threat-budget based wave building
export const THREAT_COST_BY_TIER: Record<EnemyTier, number> = {
  Grunt: 1,
  Elite: 2,
  Miniboss: 4,
  Boss: 8,
};

function getTierForKey(key: string): EnemyTier | undefined {
  const arch = ALL_ARCHETYPES.find(a => a.key === key);
  const tags = arch?.tags || [];
  if (tags.includes('Grunt')) return 'Grunt';
  if (tags.includes('Elite')) return 'Elite';
  if (tags.includes('Miniboss')) return 'Miniboss';
  if (tags.includes('Boss')) return 'Boss';
  return undefined;
}

export function buildRandomFactionWaveByThreat(budget: number, enemyCap: number = 10): WaveDef {
  const factions = Array.from(new Set(ALL_ARCHETYPES.map(e => e.faction)));
  const pickFaction = factions[Math.floor(Math.random() * factions.length)];
  const pool = ALL_ARCHETYPES.filter(e => e.faction === pickFaction);
  if (pool.length === 0) return { enemies: [] };

  let remaining = Math.max(0, Math.floor(budget));
  let count = 0;
  const counts: Record<string, number> = {};

  // Pre-bucket by tier for quick candidate filters
  const byTier: Partial<Record<EnemyTier, string[]>> = {
    Grunt: pool.filter(a => (a.tags||[]).includes('Grunt')).map(a => a.key),
    Elite: pool.filter(a => (a.tags||[]).includes('Elite')).map(a => a.key),
    Miniboss: pool.filter(a => (a.tags||[]).includes('Miniboss')).map(a => a.key),
    Boss: pool.filter(a => (a.tags||[]).includes('Boss')).map(a => a.key),
  };

  // Keep picking while we have budget and haven't hit the cap
  while (remaining > 0 && count < enemyCap) {
    // Candidate tiers we can afford
    const affordables = (Object.keys(THREAT_COST_BY_TIER) as EnemyTier[])
      .filter(t => THREAT_COST_BY_TIER[t] <= remaining && (byTier[t]?.length || 0) > 0)
      // Light bias toward lower tiers so budget tends to create more bodies
      .sort((a, b) => THREAT_COST_BY_TIER[a] - THREAT_COST_BY_TIER[b]);

    if (affordables.length === 0) break;

    // Weighted pick among affordable tiers using tier spawnWeight
    const entries = affordables.map(t => TIER_TEMPLATES[t]);
    const total = entries.reduce((s, t) => s + t.spawnWeight, 0);
    let r = Math.random() * total;
    let chosen: EnemyTier = affordables[0];
    for (const t of entries) { r -= t.spawnWeight; if (r <= 0) { chosen = t.tier; break; } }

    const keys = byTier[chosen]!;
    const key = keys[Math.floor(Math.random() * keys.length)];
    counts[key] = (counts[key] ?? 0) + 1;
    count += 1;
    remaining -= THREAT_COST_BY_TIER[chosen];
  }

  // Fallback: ensure at least one enemy if nothing selected
  if (count === 0) {
    const anyKey = pool[0]?.key;
    if (anyKey) counts[anyKey] = 1;
  }

  return { enemies: Object.entries(counts).map(([key, c]) => ({ key, count: c })) };
}


