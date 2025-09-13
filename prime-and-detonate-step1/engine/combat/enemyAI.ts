import { EnemyInstance } from './enemyFactory';
import { PrimeType } from './types';
import { TIER_TEMPLATES } from '../../data/tiers';
import { FACTIONS } from '../../data/factions';

// Minimal snapshot for AI decisions
interface BattleSnapshot {
  enemies: EnemyInstance[];
  players: Array<{ id: string; hp: number; shields: number; hasPrime?: Partial<Record<PrimeType, boolean>> }>;
  turnIndex: number;
  // Optional: current acting enemy HP percentage (0..1) for defensive behaviors
  selfHpPct?: number;
}

export function chooseEnemyAction(actor: EnemyInstance, snap: BattleSnapshot) {
  const f = FACTIONS[actor.faction];
  const tier = (actor.tags||[]).find(t => t==='Grunt' || t==='Elite' || t==='Miniboss' || t==='Boss');
  const tierTemplate = tier ? TIER_TEMPLATES[tier as keyof typeof TIER_TEMPLATES] : undefined;
  const detonators = actor.abilities.filter(a => a.isDetonator);
  const primers = actor.abilities.filter(a => a.isPrimer);
  const nukes   = actor.abilities.filter(a => !a.isPrimer && !a.isDetonator);

  // Focus fire on weakened party members (60% chance)
  const weakened = snap.players.filter(p => p.hp < 50);
  if (weakened.length > 0 && Math.random() < 0.6) {
    const target = targetAmongLowestHP(snap, 2);
    // Prefer detonators if target has primes
    const hasAnyPrime = Object.values((target?.hasPrime || {})).some(Boolean);
    if (hasAnyPrime && detonators.length) return { ability: weightedPick(detonators), target };
    // Otherwise prefer nukes for finishing blow, fallback to primer
    if (nukes.length) return { ability: weightedPick(nukes), target };
    if (primers.length) return { ability: weightedPick(primers), target };
  }

  // Use defensive-leaning behavior when low HP (40% chance)
  // We treat "defensive" as choosing a primer or non-detonator to avoid empowering player detonations
  if ((snap.selfHpPct ?? 1) < 0.3 && Math.random() < 0.4) {
    if (primers.length) return { ability: weightedPick(primers), target: targetAmongLowestShields(snap, 2) };
    if (nukes.length) return { ability: weightedPick(nukes), target: targetAmongLowestHP(snap, 2) };
  }

  // Prioritize priming when allies are ready to detonate (50% chance)
  const alliesWithDetonators = (snap.enemies || []).filter(e => e.key !== actor.key && (e.abilities||[]).some(a => a.isDetonator));
  if (alliesWithDetonators.length > 0 && primers.length && Math.random() < 0.5) {
    return { ability: weightedPick(primers), target: targetAmongLowestShields(snap, 2) };
  }

  const primedTargets = snap.players.filter(p => Object.values(p.hasPrime || {}).some(Boolean));
  if (detonators.length && primedTargets.length) {
    const t = softTargetPickForDetonation(primedTargets);
    return { ability: weightedPick(detonators), target: t };
  }

  if (actor.faction === 'Voidborn' && primers.length) return { ability: weightedPick(primers), target: targetAmongLowestShields(snap, 2) };
  if (actor.faction === 'Accord' && detonators.length) return { ability: weightedPick(detonators), target: targetAmongLowestHP(snap, 2) };
  if (actor.faction === 'Outlaws') return { ability: weightedPick([...primers, ...nukes]), target: targetAmongLowestHP(snap, 2) };

  // base weights normalized
  let pool = normalizeWeights([...primers, ...detonators, ...nukes]);
  // apply tier prefer knobs
  if (tierTemplate) {
    const detBoost = tierTemplate.ai.preferDetonation || 0;
    const priBoost = tierTemplate.ai.preferPrimers || 0;
    pool = pool.map(a => ({
      ...a,
      aiWeight: (a.aiWeight || 0.33) + (a.isDetonator ? detBoost : 0) + (a.isPrimer ? priBoost : 0)
    }));
  }
  const discipline = tierTemplate?.ai.targetDiscipline ?? 0;
  return { ability: weightedPick(pool), target: pickTargetWithDiscipline(snap, discipline) };
}

function targetAmongLowestHP(snap: BattleSnapshot, k: number = 2) {
  const sorted = snap.players.slice().sort((a,b)=>a.hp-b.hp);
  const pool = sorted.slice(0, Math.min(k, sorted.length));
  return pool[Math.floor(Math.random()*pool.length)];
}
function targetAmongLowestShields(snap: BattleSnapshot, k: number = 2) {
  const sorted = snap.players.slice().sort((a,b)=>a.shields-b.shields);
  const pool = sorted.slice(0, Math.min(k, sorted.length));
  return pool[Math.floor(Math.random()*pool.length)];
}
function targetFocusFire(snap: BattleSnapshot) { return targetAmongLowestHP(snap, 2); }
function softTargetPickForDetonation(ts: BattleSnapshot['players']) {
  return ts[Math.floor(Math.random()*ts.length)];
}
function normalizeWeights<T extends { aiWeight?: number }>(arr: T[]): T[] { return arr.map(a => ({...a, aiWeight: a.aiWeight ?? 0.33})); }
function weightedPick<T extends { aiWeight?: number }>(arr: T[]): T { const t=arr.reduce((s,a)=>s+(a.aiWeight||0),0)||1; let r=Math.random()*t; for (const a of arr){r-=a.aiWeight||0.1; if(r<=0)return a;} return arr[0]; }

function pickTargetWithDiscipline(snap: BattleSnapshot, discipline: number){
  const d = Math.max(0, Math.min(1, discipline ?? 0));
  if (Math.random() < d) return targetAmongLowestHP(snap, 2);
  return snap.players[Math.floor(Math.random()*snap.players.length)];
}

export function getActionPointsFor(actor: EnemyInstance): number {
  const tier = (actor.tags||[]).find(t => t==='Grunt' || t==='Elite' || t==='Miniboss' || t==='Boss');
  const tierTemplate = tier ? TIER_TEMPLATES[tier as keyof typeof TIER_TEMPLATES] : undefined;
  return tierTemplate?.ai.actionPoints ?? 1;
}

export function getPrimeResistModFor(actor: EnemyInstance): number {
  const tier = (actor.tags||[]).find(t => t==='Grunt' || t==='Elite' || t==='Miniboss' || t==='Boss');
  const tierTemplate = tier ? TIER_TEMPLATES[tier as keyof typeof TIER_TEMPLATES] : undefined;
  return tierTemplate?.ai.primeResistMod ?? 1.0;
}

export function getCounterChanceBonusFor(actor: EnemyInstance): number {
  const tier = (actor.tags||[]).find(t => t==='Grunt' || t==='Elite' || t==='Miniboss' || t==='Boss');
  const tierTemplate = tier ? TIER_TEMPLATES[tier as keyof typeof TIER_TEMPLATES] : undefined;
  return tierTemplate?.ai.counterChance ?? 0;
}

export function computePrimeDurationMultiplier(actor: EnemyInstance, prime: PrimeType): number {
  const f = FACTIONS[actor.faction];
  const factionMod = f.primeMods?.durationMod?.[prime] ?? 1.0;
  const tierMod = getPrimeResistModFor(actor);
  return factionMod * tierMod;
}


