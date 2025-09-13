import type { Actor, BattleState, Ability, DamageType, PrimeType, PartyMember, AbilityRole, Prime } from './types';
import { chooseEnemyDamage } from './ai';
import { ALL_ABILITIES, DEFENSIVE_BY_CLASS, ABILITY_BY_ID } from '../content/abilities';
import { WEAPON_BY_ID } from '../content/weapons';
function getWeaponForActor(state: BattleState, actorId: string) {
  const pm = state.party.find(m => m.actorId === actorId);
  if (!pm?.weaponId) return undefined;
  return WEAPON_BY_ID[pm.weaponId];
}
import { elementalMultiplierFor, accordDetonationBonus, outlawSwarmBonus } from '../../engine/combat/factions';
import { getEnemyInstance, registerEnemyActor } from '../../engine/combat/registry';
import { instantiateEnemy } from '../../engine/combat/enemyFactory';
import { chooseEnemyAction } from '../../engine/combat/enemyAI';

import { FACTIONS } from '../../data/factions';

// Utility function to convert PrimeType to DamageType
function primeTypeToLowerDamageType(primeType: PrimeType): DamageType {
  switch (primeType) {
    case 'weakpoint': return 'kinetic';
    case 'overload': return 'arc';
    case 'burn': return 'thermal';
    case 'suppress': return 'void';
    case 'freeze': return 'thermal';
    case 'pierce': return 'kinetic';
    default: return 'kinetic';
  }
}

// Utility function to convert DamageType to PrimeType
function damageTypeToPrimeType(damageType: DamageType): PrimeType {
  switch (damageType) {
    case 'kinetic': return 'weakpoint';
    case 'arc': return 'overload';
    case 'thermal': return 'burn';
    case 'void': return 'suppress';
    default: return 'weakpoint';
  }
}

// Constants for tuning
export const PRIME_CAP = 2;
export const PRIME_DAMAGE = 15;   // legacy (unused in new model, kept for compat)
export const ARC_VS_SH = 1.3;
export const VOID_PIERCE = 0.15;  // after SH, portion to HP directly

// Role-based base damage multipliers (reduced)
const ROLE_BASE_DAMAGE_MULTIPLIER: Record<AbilityRole, number> = {
  detonator: 1.15,  // Reduced from 1.25 (-8%)
  prime: 0.92,      // Reduced from 1.0 (-8%)
  sustain: 1.0,
};

// Super meter config and helpers
export const BalanceSuper = {
  l1Cost: 100,
  gainBasic: 40,                // Reduced from 45 (-11%)
  gainDealPer100: 16,           // Reduced from 18 (-11%)
  gainTakePer100: 27,           // Increased from 18 (+50%)
  // Action-based gains
  gainPrimeSuccess: 22,         // Reduced from 25 (-12%)
  gainDetonateSuccess: 31,      // Reduced from 35 (-11%)
  gainCritical: 18,             // Reduced from 20 (-10%)
  gainKillShot: 36,             // Reduced from 40 (-10%)
  gainHitPrimed: 13,            // Reduced from 15 (-13%)
  // Costs and refunds
  drainPrime: 3,                // Reduced from 5 to 3
  costDetonate: 6,              // Reduced from 10 to 6
  refundDetonate: 25,           // Increased from 15 to 25
  // Turn caps
  maxGainPerTurn: 120,          // Cap total gain per turn
  maxGainPerAction: 60,         // Cap gain per single action
  decayOOC: 2,                  // out-of-turn decay (gentler)
  tierSize: 100,                // 0-100-200-300
  maxEnergy: 300,
  sameTypePrimeMult: 1.25,      // multiplier when priming same type consecutively
  // Phase 3 knobs
  l2Cost: 200,
  l3Cost: 300,
  sameTypeDoublePrimeSuperMult: 1.35
} as const;

// Enhanced super energy calculation with action rewards
function calculateActionSuperGain(
  action: 'basic' | 'prime' | 'detonate' | 'sustain',
  damage: number,
  isCritical: boolean,
  isKillShot: boolean,
  targetHasPrimes: boolean,
  currentTurnGain: number
): number {
  let gain = 0;

  // Base action gains
  switch (action) {
    case 'basic':
      gain += BalanceSuper.gainBasic;
      break;
    case 'prime':
      gain += BalanceSuper.gainPrimeSuccess;
      break;
    case 'detonate':
      gain += BalanceSuper.gainDetonateSuccess;
      break;
    case 'sustain':
      break;
  }

  // Bonus gains
  if (isCritical) gain += BalanceSuper.gainCritical;
  if (isKillShot) gain += BalanceSuper.gainKillShot;
  if (targetHasPrimes) gain += BalanceSuper.gainHitPrimed;

  // Damage-based gains
  gain += Math.round((damage / 100) * BalanceSuper.gainDealPer100);

  // Apply caps
  gain = Math.min(gain, BalanceSuper.maxGainPerAction);
  gain = Math.min(gain, BalanceSuper.maxGainPerTurn - currentTurnGain);

  return Math.max(0, gain);
}

// Sustain balance per Phase 2
export const BalanceSustain = {
  healMin: 22,
  healMax: 28,
  barrierAmount: 20,            // temporary absorb pool
  barrierHits: 2,
  barrierPhases: 1,             // lasts through next enemy phase
  cleanseShGain: 10,
  guardRedirectPct: 0.30,
  guardPhases: 1,
  guardSuperPer50: 3,
  fatiguePenalty: 0.20,
  fatigueWindow: 3,             // member-turns
} as const;

function clampSuper(n: number): number { return Math.max(0, Math.min(BalanceSuper.maxEnergy, Math.round(n))); }
export function getSuperTier(energy: number): 0|1|2|3 {
  const e = clampSuper(energy);
  if (e >= 300) return 3; if (e >= 200) return 2; if (e >= 100) return 1; return 0;
}
export function addSuper(current: number | undefined, delta: number): number {
  return clampSuper((current ?? 0) + delta);
}

export function canCastSuper(member: PartyMember | undefined, level: 1 | 2 | 3): boolean {
  if (!member) return false;
  const energy = Math.floor(member.superEnergy ?? 0);
  if (level === 1) return energy >= BalanceSuper.l1Cost;
  return level === 2 ? energy >= BalanceSuper.l2Cost : energy >= BalanceSuper.l3Cost;
}

export function spendSuper(member: PartyMember, level: 1 | 2 | 3): PartyMember {
  const cost = level === 1 ? BalanceSuper.l1Cost : level === 2 ? BalanceSuper.l2Cost : BalanceSuper.l3Cost;
  return { ...member, superEnergy: addSuper(member.superEnergy, -cost) };
}

export interface DamageResult {
  defender: Actor;
  shLoss: number;
  hpLoss: number;
}

// Helper functions for multi-enemy battles
export function currentTarget(state: BattleState): Actor | undefined {
  return state.enemies[state.targetIndex];
}

// Helper function to check if all enemies are defeated (for victory conditions)
export function checkVictoryCondition(state: BattleState): boolean {
  const livingEnemies = state.enemies.filter(e => e.bars.hp > 0);
  return livingEnemies.length === 0;
}

// Helper function to find the next valid enemy target
export function findNextValidTarget(state: BattleState): number {
  const livingEnemies = state.enemies.filter(e => e.bars.hp > 0);
  if (livingEnemies.length === 0) return -1; // No living enemies
  
  // If current target is dead or invalid, find the first living enemy
  if (state.targetIndex < 0 || state.targetIndex >= state.enemies.length || state.enemies[state.targetIndex].bars.hp <= 0) {
    return state.enemies.findIndex(e => e.bars.hp > 0);
  }
  
  // Find the next living enemy after the current target
  let nextIndex = (state.targetIndex + 1) % state.enemies.length;
  let attempts = 0;
  
  while (attempts < state.enemies.length) {
    if (state.enemies[nextIndex].bars.hp > 0) {
      return nextIndex;
    }
    nextIndex = (nextIndex + 1) % state.enemies.length;
    attempts++;
  }
  
  // Fallback: find any living enemy
  return state.enemies.findIndex(e => e.bars.hp > 0);
}

export function removeDeadEnemies(state: BattleState): number {
  const before = state.enemies.length;
  
  // Mark enemies for death animation before removing them
  state.enemies.forEach(enemy => {
    if (enemy.bars.hp <= 0 && !(enemy as any)._deathAnimationState) {
      (enemy as any)._deathAnimationState = 'dying';
      (enemy as any)._deathAnimationPlayed = false; // Reset animation flag for new death
      (enemy as any)._wasDeadInPreviousRender = false; // Reset previous render flag for new death
    }
  });
  
  // Filter out enemies that have completed their death animation
  state.enemies = state.enemies.filter(e => {
    if (e.bars.hp <= 0) {
      // If enemy is marked as dying, keep it for animation
      if ((e as any)._deathAnimationState === 'dying') {
        return true;
      }
      // If enemy has been dying for more than 1.5 seconds, remove it
      if ((e as any)._deathStartTime && Date.now() - (e as any)._deathStartTime > 1500) {
        return false;
      }
      // Mark start of death animation
      if (!(e as any)._deathStartTime) {
        (e as any)._deathStartTime = Date.now();
      }
      return true;
    }
    return true;
  });
  
  // Check for victory condition: if no living enemies remain
  if (checkVictoryCondition(state)) { 
    state.isOver = true; 
    console.log('🎯 Engine: Victory condition met - all enemies defeated!');
  }
  
  // Auto-advance target if current target is dead
  if (state.targetIndex >= 0 && state.targetIndex < state.enemies.length) {
    if (state.enemies[state.targetIndex].bars.hp <= 0) {
      const nextTarget = findNextValidTarget(state);
      if (nextTarget !== -1) {
        state.targetIndex = nextTarget;
        console.log(`🎯 Auto-targeting: ${state.enemies[state.targetIndex].name}`);
      }
    }
  }
  
  // Clamp targetIndex to valid range
  if (state.targetIndex >= state.enemies.length) {
    state.targetIndex = Math.max(0, state.enemies.length - 1);
  }
  return before - state.enemies.length; // how many removed
}

// Core damage routing: SH → HP (no armor)
export function routeDamage_SH_HP(target: Actor, raw: number, type: DamageType) {
  // Create a copy to avoid mutation
  const newTarget = { ...target, bars: { ...target.bars } };
  
  // 1) hit SH first (Arc bonus applies only to SH)
  let shHit = Math.min(newTarget.bars.sh, type === 'arc' ? raw * ARC_VS_SH : raw);
  newTarget.bars.sh -= shHit;
  let rem = raw - (type === 'arc' ? shHit / ARC_VS_SH : shHit);
  if (newTarget.bars.sh > 0) rem = 0; // all consumed by shields if any remains
  
  // 2) if SH is down, apply to HP (Void pierce applies here)
  let hpHit = 0;
  if (rem > 0) {
    if (type === 'void') {
      const pierce = rem * VOID_PIERCE;
      hpHit += pierce;
      rem -= pierce; // rest is "would-be armor" in old model; here we dump to HP
    }
    hpHit += rem;
    newTarget.bars.hp = Math.max(0, newTarget.bars.hp - hpHit);
  }
  
  return { defender: newTarget, shLoss: Math.round(shHit), hpLoss: Math.round(hpHit) };
}

// New prime data model and helpers
export const MAX_PRIMES_PER_TARGET = 2;
// Detonation tuning to match spec:
// - single prime: heavy + damage boost
// - same double prime: heavy + big damage boost
// - mixed double prime: heavy + big AOE boost
// Tunable constants per spec
export const BASE_DETONATOR_MULT = 1.0;
export const SINGLE_PRIME_DAMAGE_MULT = 1.50;
export const SINGLE_PRIME_SPLASH_PCT = 0.10;
export const SAME_PRIME_DAMAGE_MULT = 2.15;
export const SAME_PRIME_SPLASH_PCT = 0.25;
export const MIXED_PRIME_DAMAGE_MULT = 1.20;
export const MIXED_PRIME_SPLASH_PCT = 0.90;
export const CHAIN_HOP_DECAY = 0.8;

function elementFromPrimeType(p: PrimeType): DamageType {
  switch (p) {
    case 'overload': return 'arc';
    case 'burn': return 'thermal';
    case 'suppress': return 'void';
    case 'weakpoint': return 'kinetic';
    case 'freeze': return 'thermal'; // map as needed
    default: return 'kinetic';
  }
}

export function applyPrimeNew(target: Actor, element: DamageType, source: string): Actor {
  const primes: Prime[] = Array.isArray(target.primes) ? [...target.primes] : [];
  const idx = primes.findIndex(p => p.element === element);
  
  if (idx >= 0) {
    // Same element prime - add it as a duplicate for stacking
    if (primes.length >= MAX_PRIMES_PER_TARGET) {
      // Remove oldest prime to make room
      primes.sort((a, b) => a.appliedAt - b.appliedAt);
      primes.shift();
    }
    primes.push({ element, source, appliedAt: Date.now() });
    if ((window as any).__PD_DEBUG__) {
      console.log(`[DEBUG] Stacked ${element} prime on ${target.name} (now ${primes.length} total primes)`);
    }
  } else {
    // New element prime
    if (primes.length >= MAX_PRIMES_PER_TARGET) {
      primes.sort((a, b) => a.appliedAt - b.appliedAt);
      primes.shift();
    }
    primes.push({ element, source, appliedAt: Date.now() });
    if ((window as any).__PD_DEBUG__) {
      console.log(`[DEBUG] Applied new ${element} prime on ${target.name} (now ${primes.length} total primes)`);
    }
  }
  
  return { ...target, primes };
}

function classifyPrimePair(primes: Prime[] | undefined): 'none'|'single'|'same'|'mixed' {
  if (!primes || primes.length === 0) return 'none';
  if (primes.length === 1) return 'single';
  return primes[0].element === primes[1].element ? 'same' : 'mixed';
}

function resolveDetonatorHit(attacker: Actor, primary: Actor, ability: Ability, allEnemies: Actor[], events: string[], state?: BattleState, overrides?: { sameMult?: number; hopFactor?: number; visited?: Set<string> }) {
  // Start from "heavy" baseline for detonation actions
  const base = Math.round(ability.baseDamage * ROLE_BASE_DAMAGE_MULTIPLIER.detonator);
  const pair = classifyPrimePair(primary.primes);
  let directMult = 1.0;
  let splashPct = 0.0;
  const hopFactor = Math.max(0, Math.min(1, overrides?.hopFactor ?? 1));
  const visited = overrides?.visited ?? new Set<string>();
  visited.add(primary.id);

  if (pair === 'none') {
    const seg = routeDamage_SH_HP(primary, base, ability.type);
    events.push(`${ability.name}: no primes on target → no explosion.`);
    return seg.defender;
  }

  if (pair === 'single') {
    directMult = SINGLE_PRIME_DAMAGE_MULT;
    splashPct = SINGLE_PRIME_SPLASH_PCT;
  } else if (pair === 'same') {
    directMult = overrides?.sameMult ?? SAME_PRIME_DAMAGE_MULT;
    splashPct = SAME_PRIME_SPLASH_PCT;
  } else {
    directMult = MIXED_PRIME_DAMAGE_MULT;
    splashPct = MIXED_PRIME_SPLASH_PCT;
  }

  if (state) {
    const w = getWeaponForActor(state, attacker.id);
    if (w?.detonationDirectMult) directMult *= w.detonationDirectMult;
    if (w?.totalDamageMult) directMult *= w.totalDamageMult;
    if (w?.detonationSplashMult) splashPct *= w.detonationSplashMult;
    if (state.missionBuff?.detonationSplashMult) splashPct *= state.missionBuff.detonationSplashMult;
  }
  const directBase = Math.round(base * directMult);
  const directRaw = Math.max(0, Math.round(applyFactionAndSpecials(directBase, ability.type, true, attacker, primary, state)));
  const mul = getElementalMultiplierForActor(primary, ability.type);
  if (mul > 1) events.push(`Weakness hit (${ability.type}) x${mul.toFixed(2)}.`);
  else if (mul < 1) events.push(`Resisted (${ability.type}) x${mul.toFixed(2)}.`);
  const directFinal = Math.max(1, Math.round(directRaw * hopFactor));
  const seg = routeDamage_SH_HP(primary, directFinal, ability.type);
  let newPrimary = seg.defender;

  let didAnySplash = false;
  if (splashPct > 0) {
    const splashBase = Math.max(1, Math.round(directBase * splashPct));
    for (const e of allEnemies) {
      if (e.id !== primary.id && e.bars.hp > 0) {
        const mul = getElementalMultiplierForActor(e, ability.type);
        const splashFinalRaw = Math.max(1, Math.round(splashBase * mul));
        const splashFinal = Math.max(1, Math.round(splashFinalRaw * hopFactor));
        const splashRes = routeDamage_SH_HP(e, splashFinal, ability.type);
        const idx = allEnemies.findIndex(x => x.id === e.id);
        if (idx !== -1) {
          allEnemies[idx] = splashRes.defender;
          const dealt = (splashRes.shLoss || 0) + (splashRes.hpLoss || 0);
          if (dealt > 0) {
            didAnySplash = true;
            events.push(`Splash damage to ${e.name}: ${dealt} damage (SH: ${splashRes.shLoss || 0}, HP: ${splashRes.hpLoss || 0})`);
          }
        }
      }
    }
  }

  // clear primes after explosion
  newPrimary = { ...newPrimary, primes: [] };
  const detLabel = pair === 'single' ? 'single' : pair === 'same' ? 'same' : 'mixed';
  const directText = detLabel === 'mixed' && directMult === 1 ? 'x1.00' : `x${directMult.toFixed(2)}`;
  const directDamage = seg.shLoss + seg.hpLoss;
  events.push(`Detonation: ${detLabel} → direct ${directText} (${directDamage} damage), splash ${(splashPct * 100) | 0}%`);
  if (splashPct > 0) {
    for (let i = 0; i < allEnemies.length; i++) {
      const victim = allEnemies[i];
      if (!victim || victim.id === primary.id || victim.bars.hp <= 0) continue;
      const pairKind = classifyPrimePair(victim.primes);
      // Mixed prime detonations can chain to single, mixed, and same primes (full AOE potential)
      // Same primes remain single-target focused
      if ((pairKind === 'single' || pairKind === 'same' || pairKind === 'mixed') && !visited.has(victim.id)) {
        events.push(`Chain detonation on ${victim.name} (hop factor: ${(hopFactor * CHAIN_HOP_DECAY).toFixed(2)}).`);
        const after = resolveDetonatorHit(
          attacker,
          victim,
          ability,
          allEnemies,
          events,
          state,
          { sameMult: overrides?.sameMult, hopFactor: hopFactor * CHAIN_HOP_DECAY, visited }
        );
        allEnemies[i] = after;
      }
    }
  }
  return newPrimary;
}

// AOE ability execution with targeting and rider mechanics
function executeAOEAbility(state: BattleState, attacker: Actor, target: Actor, ability: Ability) {
  const events: string[] = [];
  let newTarget = { ...target };
  
  // Get living enemies for targeting
  const livingEnemies = state.enemies.filter(e => e.bars.hp > 0);
  if (livingEnemies.length === 0) {
    events.push(`${ability.name}: no valid targets.`);
    return { events, newTarget };
  }
  
  // Determine targets based on targeting mode
  let targets: Actor[] = [];
  if (ability.targeting?.mode === 'all') {
    targets = livingEnemies;
  } else if (ability.targeting?.mode === 'n-random') {
    const count = ability.targeting.count || 1;
    const shuffled = [...livingEnemies].sort(() => Math.random() - 0.5);
    targets = shuffled.slice(0, Math.min(count, livingEnemies.length));
  } else if (ability.targeting?.mode === 'n-closest') {
    const count = ability.targeting.count || 1;
    // For simplicity, use array order as "closeness" - can be improved later
    targets = livingEnemies.slice(0, Math.min(count, livingEnemies.length));
  } else {
    // Default to single target
    targets = [target];
  }
  
  events.push(`${attacker.name} uses ${ability.name} on ${targets.length} target${targets.length !== 1 ? 's' : ''}.`);
  
  // Apply damage and effects to each target
  const updatedEnemies = [...state.enemies];
  let totalDamage = 0;
  
  for (const enemyTarget of targets) {
    const enemyIndex = updatedEnemies.findIndex(e => e.id === enemyTarget.id);
    if (enemyIndex === -1) continue;
    
    let damage = ability.baseDamage;
    let finalDamage = damage;
    
    // Apply weapon multipliers
    const weapon = getWeaponForActor(state, attacker.id);
    if (weapon?.totalDamageMult) {
      finalDamage = Math.round(finalDamage * weapon.totalDamageMult);
    }
    
    // Apply faction and special modifiers
    finalDamage = Math.max(0, Math.round(applyFactionAndSpecials(finalDamage, ability.type, false, attacker, enemyTarget, state)));
    
    // Apply elemental multipliers
    const mul = getElementalMultiplierForActor(enemyTarget, ability.type);
    if (mul > 1) events.push(`Weakness hit (${ability.type}) x${mul.toFixed(2)}.`);
    else if (mul < 1) events.push(`Resisted (${ability.type}) x${mul.toFixed(2)}.`);
    finalDamage = Math.max(1, Math.round(finalDamage * mul));
    
    // Apply rider mechanics
    if (ability.riders?.includes('ignore10pctShields')) {
      // Nova: ignore 10% of shields (implement as damage boost)
      if (enemyTarget.bars.sh > 0) {
        const shieldIgnore = Math.round(enemyTarget.bars.sh * 0.1);
        finalDamage += shieldIgnore;
        events.push(`${ability.name} ignores ${shieldIgnore} shields.`);
      }
    }
    
    if (ability.riders?.includes('doubleVsShields')) {
      // Volt: double damage vs shields
      if (enemyTarget.bars.sh > 0) {
        finalDamage *= 2;
        events.push(`${ability.name} deals double damage vs shields!`);
      }
    }
    
    // Apply damage
    const seg = routeDamage_SH_HP(enemyTarget, finalDamage, ability.type);
    updatedEnemies[enemyIndex] = seg.defender;
    
    const targetDamage = seg.shLoss + seg.hpLoss;
    totalDamage += targetDamage;
    
    // Apply primes if specified
    if (ability.primesApplied && ability.primeType) {
      // Convert PrimeType to DamageType for applyPrimeNew
      const primeElement = primeTypeToLowerDamageType(ability.primeType);
      const primed = applyPrimeNew(seg.defender, primeElement, ability.name);
      updatedEnemies[enemyIndex] = primed;
      events.push(`${ability.name} applied ${ability.primeType} to ${enemyTarget.name}.`);
    }
    
    // Handle detonation if specified
    if (ability.detonates && ability.detonationTriggers) {
      const hasValidPrimes = seg.defender.primes.some(p => {
        // Convert DamageType to PrimeType for comparison
        const primeType = damageTypeToPrimeType(p.element);
        return ability.detonationTriggers!.includes(primeType);
      });
      if (hasValidPrimes) {
        // Calculate detonation bonus
        const detonationBonus = calculateDetonationBonus(seg.defender.primes);
        const detonationDamage = finalDamage + detonationBonus;
        
        // Apply detonation damage
        const detSeg = routeDamage_SH_HP(seg.defender, detonationDamage, ability.type);
        updatedEnemies[enemyIndex] = detSeg.defender;
        
        // Consume primes
        updatedEnemies[enemyIndex] = { ...updatedEnemies[enemyIndex], primes: [] };
        
        // Apply Suppress if specified
        if (ability.riders?.includes('applySuppressOnDetonate')) {
          // Apply 1-turn Suppress debuff (simplified implementation)
          events.push(`${ability.name} detonated primes and applied Suppress to ${enemyTarget.name}.`);
        }
        
        events.push(`${ability.name} detonated primes for +${detonationBonus} bonus damage!`);
      }
    }
  }
  
  // Update the main target for compatibility
  const mainTargetIndex = updatedEnemies.findIndex(e => e.id === target.id);
  if (mainTargetIndex !== -1) {
    newTarget = updatedEnemies[mainTargetIndex];
  }
  
  // Update all enemies in the state
  state.enemies.splice(0, state.enemies.length, ...updatedEnemies);
  
  events.push(`${ability.name} dealt ${totalDamage} total damage.`);
  
  return { events, newTarget };
}

// Helper function to calculate detonation bonus
function calculateDetonationBonus(primes: Prime[]): number {
  if (primes.length === 0) return 0;
  if (primes.length === 1) return 30; // single prime: +30
  if (primes.length === 2) {
    if (primes[0].element === primes[1].element) {
      return 43; // same double: +43
    } else {
      return 24; // mixed double: +24
    }
  }
  return 0;
}

// Main ability execution
export function executeAbility(state: BattleState, attacker: Actor, target: Actor, ability: Ability) {
  const events: string[] = [];
  let newTarget = { ...target };
  let detonatedOccurred = false;
  // Sustain abilities handled elsewhere; they do not produce enemy damage here
  if (ability.tags?.sustain) {
    events.push(`${attacker.name} uses ${ability.name} (sustain ability).`);
    return { events, newTarget };
  }
  
  // AOE abilities handled specially
  if (ability.tags?.AOE) {
    return executeAOEAbility(state, attacker, target, ability);
  }
  
  // New semantics
  const isPrime = ability.tags?.prime;
  const isDet = ability.tags?.detonator;
  const isHybrid = false; // hybrid removed

  // Overdrive L3: hits auto-detonate if primes exist
  const overdrive = state.overdriveByMember?.[attacker.id];
  const hasPrimesNow = Array.isArray(newTarget.primes) && newTarget.primes.length > 0;
  if (overdrive?.active && overdrive.autoDetonateHits && hasPrimesNow && !isDet) {
    const after = resolveDetonatorHit(attacker, newTarget, ability, state.enemies, events, state);
    newTarget = after;
    detonatedOccurred = true;
  } else if (!overdrive?.active && isDet) {
    if (Array.isArray(newTarget.primes) && newTarget.primes.length > 0) {
      newTarget = resolveDetonatorHit(attacker, newTarget, ability, state.enemies, events, state);
      detonatedOccurred = true;
    } else {
      // Detonators still perform a heavy hit even if there is nothing to explode
      const raw = Math.round(ability.baseDamage * ROLE_BASE_DAMAGE_MULTIPLIER.detonator);
      const finalRaw = Math.max(0, Math.round(applyFactionAndSpecials(raw, ability.type, true, attacker, newTarget, state)));
      const mul = getElementalMultiplierForActor(newTarget, ability.type);
      if (mul > 1) events.push(`Weakness hit (${ability.type}) x${mul.toFixed(2)}.`);
      else if (mul < 1) events.push(`Resisted (${ability.type}) x${mul.toFixed(2)}.`);
      const seg = routeDamage_SH_HP(newTarget, finalRaw, ability.type);
      newTarget = seg.defender;
      const totalDamage = seg.shLoss + seg.hpLoss;
      events.push(`${ability.name}: no primes on target → no explosion. Heavy hit: ${raw} base → ${finalRaw} final — SH −${seg.shLoss}, HP −${seg.hpLoss} (${totalDamage} total).`);
    }
  } else if (isPrime) {
    // Pure primers should not detonate and can have zero base damage in UI; still allow minimal strike if baseDamage > 0
    const elem: DamageType = ability.tags?.primeElement ?? ability.type;
    if (ability.baseDamage > 0) {
      const w = getWeaponForActor(state, attacker.id);
      let raw = Math.round(ability.baseDamage * ROLE_BASE_DAMAGE_MULTIPLIER.prime);
      if (w?.totalDamageMult) raw = Math.round(raw * w.totalDamageMult);
      const finalRaw = Math.max(0, Math.round(applyFactionAndSpecials(raw, ability.type, false, attacker, newTarget, state)));
      const mul = getElementalMultiplierForActor(newTarget, ability.type);
      if (mul > 1) events.push(`Weakness hit (${ability.type}) x${mul.toFixed(2)}.`);
      else if (mul < 1) events.push(`Resisted (${ability.type}) x${mul.toFixed(2)}.`);
      const seg = routeDamage_SH_HP(newTarget, finalRaw, ability.type);
      newTarget = seg.defender;
      const totalDamage = seg.shLoss + seg.hpLoss;
      events.push(`${attacker.name} used ${ability.name} (${raw} base → ${finalRaw} final) — SH −${seg.shLoss}, HP −${seg.hpLoss} (${totalDamage} total).`);
    }
    
    // Check current primes before applying new one
    const currentPrimes = Array.isArray(newTarget.primes) ? newTarget.primes : [];
    const currentPrimeCounts = new Map<string, number>();
    currentPrimes.forEach(p => {
      currentPrimeCounts.set(p.element, (currentPrimeCounts.get(p.element) || 0) + 1);
    });
    const currentCount = currentPrimeCounts.get(elem) || 0;
    
    newTarget = applyPrimeNew(newTarget, elem, ability.tags?.primeName ?? ability.name);
    
    // Check new prime counts after applying
    const newPrimes = Array.isArray(newTarget.primes) ? newTarget.primes : [];
    const newPrimeCounts = new Map<string, number>();
    newPrimes.forEach(p => {
      newPrimeCounts.set(p.element, (newPrimeCounts.get(p.element) || 0) + 1);
    });
    const newCount = newPrimeCounts.get(elem) || 0;
    
    const label = ability.tags?.primeName ? ability.tags.primeName : `${elem.charAt(0).toUpperCase()}${elem.slice(1)} prime`;
    if (newCount > currentCount) {
      if (newCount === 1) {
        events.push(`${ability.name} applied ${label}.`);
      } else {
        events.push(`${ability.name} stacked ${label} (now ${newCount}x).`);
      }
    } else {
      events.push(`${ability.name} refreshed ${label} (${newCount}x total).`);
    }
  } else {
    // plain ability fallback
    const w = getWeaponForActor(state, attacker.id);
    const isBasic = ability.id === '__basic';
    let type = ability.type;
    let raw = ability.baseDamage;
    if (w) {
      if (isBasic && w.basicMult) raw = Math.round(raw * w.basicMult);
      if (w.totalDamageMult) raw = Math.round(raw * w.totalDamageMult);
      if (isBasic && w.basicType) type = w.basicType;
    }
    const finalRaw = Math.max(0, Math.round(applyFactionAndSpecials(raw, type, false, attacker, newTarget, state)));
    const mul = getElementalMultiplierForActor(newTarget, type);
    if (mul > 1) events.push(`Weakness hit (${type}) x${mul.toFixed(2)}.`);
    else if (mul < 1) events.push(`Resisted (${type}) x${mul.toFixed(2)}.`);
    const seg = routeDamage_SH_HP(newTarget, finalRaw, type);
    newTarget = seg.defender;
    const totalDamage = seg.shLoss + seg.hpLoss;
    events.push(`${attacker.name} used ${ability.name} (${raw} base → ${finalRaw} final) — SH −${seg.shLoss}, HP −${seg.hpLoss} (${totalDamage} total).`);
  }
  
  // 3) base damage of the ability (only if target is still alive)
  // In the new model, damage already applied in the branches above
  
  // 4) death check
  if (newTarget.bars.hp <= 0) events.push(`${target.name} is defeated.`);
  
  return { events, newTarget };
}

// Balance values for class Supers
export const BalanceSupers = {
  Vanguard: {
    L2: { base: 42, chainFactor: 0.6 },
    L3: { speedBuffMixed: 0.05 }
  },
  Technomancer: {
    L2: { smallAoE: 18, mediumAoE: 24 },
    L3: { base: 22, forkBonus: 0.5 }
  },
  Pyromancer: {
    L2: { base: 16, burstBonusSame: BalanceSuper.sameTypeDoublePrimeSuperMult },
    L3: { fieldPhases: 2, igniteTick: 5 }
  },
  Voidrunner: {
    L2: { base: 28 },
    L3: { base: 26, radiusBonusMixed: 0.25 }
  }
} as const;

export function castSuper(state: BattleState, level: 1 | 2 | 3): BattleState {
  const active = state.party[state.activePartyIndex];
  if (!active || active.bars.hp <= 0) return state;
  const target = currentTarget(state);
  if (!target || target.bars.hp <= 0) return { ...state, log: [...state.log, `${active.name} cannot cast Super L${level} (insufficient energy).`] };
  if (!canCastSuper(active, level)) return { ...state, log: [...state.log, `${active.name} cannot cast Super L${level} (insufficient energy).`] };

  const spentMember = spendSuper(active, level);
  let newParty = [...state.party];
  newParty[state.activePartyIndex] = spentMember;
  let newEnemies = [...state.enemies];
  const events: string[] = [];
  const beforeTarget = { ...target };
  const targetIdx = state.targetIndex;

  const tempActor: Actor = { id: spentMember.actorId, name: spentMember.name, bars: spentMember.bars, maxBars: { sh: 100, hp: 100, sp: 100 }, primes: spentMember.primes };
  const applyToEnemyIndex = (idx: number, raw: number, type: DamageType) => {
    const enemy = newEnemies[idx];
    const finalRaw = Math.max(0, Math.round(applyFactionAndSpecials(raw, type, false, tempActor, enemy, state)));
    const mul = getElementalMultiplierForActor(enemy, type);
    if (mul > 1) events.push(`Weakness hit (${type}) x${mul.toFixed(2)}.`);
    else if (mul < 1) events.push(`Resisted (${type}) x${mul.toFixed(2)}.`);
    const res = routeDamage_SH_HP(enemy, finalRaw, type);
    newEnemies[idx] = res.defender;
    return res;
  };

  const pairKind = classifyPrimePair(beforeTarget.primes);
  const hadAnyPrimes = pairKind !== 'none';
  const hadSameDouble = pairKind === 'same';
  const hadMixedDouble = pairKind === 'mixed';

  if (spentMember.classId === 'vanguard') {
    if (level === 1) {
      // Vanguard L1: Heavy kinetic strike that detonates if primed (no chain)
      const ability: Ability = { id: '__vg_l1', name: 'Adrenal Surge', type: 'kinetic', role: 'detonator', baseDamage: 28, allowedClasses: ['vanguard'], tags: { detonator: true } } as any;
      const after = resolveDetonatorHit(tempActor, newEnemies[targetIdx], ability, newEnemies, events, state);
      newEnemies[targetIdx] = after;
    } else if (level === 2) {
      const ability: Ability = { id: '__vg_l2', name: 'Bullet Time', type: 'kinetic', role: 'detonator', baseDamage: BalanceSupers.Vanguard.L2.base, allowedClasses: ['vanguard'], tags: { detonator: true } } as any;
      const after = resolveDetonatorHit(tempActor, newEnemies[targetIdx], ability, newEnemies, events, state, { sameMult: BalanceSuper.sameTypeDoublePrimeSuperMult });
      newEnemies[targetIdx] = after;
      if (hadAnyPrimes) {
        const candidates = newEnemies.map((e, i) => ({ e, i })).filter(x => x.i !== targetIdx && x.e.bars.hp > 0);
        if (candidates.length > 0) {
          const chainTo = candidates[Math.floor(Math.random() * candidates.length)].i;
          const chainDmg = Math.round(BalanceSupers.Vanguard.L2.base * BalanceSupers.Vanguard.L2.chainFactor);
          const res2 = applyToEnemyIndex(chainTo, chainDmg, 'kinetic');
          const totalChainDamage = res2.shLoss + res2.hpLoss;
          events.push(`Bullet Time chains to ${newEnemies[chainTo].name}: ${chainDmg} base → ${totalChainDamage} total damage (SH: ${res2.shLoss}, HP: ${res2.hpLoss}).`);
        }
      }
    } else { // level === 3
      const map = { ...(state.overdriveByMember || {}) } as NonNullable<BattleState['overdriveByMember']>;
      map[spentMember.actorId] = { autoDetonateHits: true, active: true };
      state.overdriveByMember = map;
      if (hadMixedDouble) events.push('Overdrive bonus: Team speed up (1 turn).');
    }
  } else if (spentMember.classId === 'technomancer') {
    if (level === 1) {
      // Technomancer L1: Arc overload on primary with bonus vs SH
      const base = 20;
      const res = applyToEnemyIndex(targetIdx, base, 'arc');
      const totalDamage = res.shLoss + res.hpLoss;
      events.push(`Overload Spike hits ${newEnemies[targetIdx].name}: ${base} base → ${totalDamage} total damage (SH: ${res.shLoss}, HP: ${res.hpLoss}).`);
    } else if (level === 2) {
      const dmg = hadMixedDouble ? BalanceSupers.Technomancer.L2.mediumAoE : BalanceSupers.Technomancer.L2.smallAoE;
      newEnemies.forEach((_, i) => {
        if (newEnemies[i].bars.hp > 0) {
          const res = applyToEnemyIndex(i, dmg, 'arc');
          if (i === targetIdx) {
            const totalDamage = res.shLoss + res.hpLoss;
            events.push(`Storm Cage hits ${newEnemies[i].name}: ${dmg} base → ${totalDamage} total damage (SH: ${res.shLoss}, HP: ${res.hpLoss}).`);
          }
        }
      });
      events.push('Storm Cage deployed.');
    } else { // level === 3
      const base = BalanceSupers.Technomancer.L3.base * (hadSameDouble ? BalanceSuper.sameTypeDoublePrimeSuperMult : 1);
      const order = newEnemies.map((e, i) => i).filter(i => newEnemies[i].bars.hp > 0);
      for (const i of order) {
        const res = applyToEnemyIndex(i, base, 'arc');
        if (i === targetIdx) {
          const totalDamage = res.shLoss + res.hpLoss;
          events.push(`Ion Tempest surges through ${newEnemies[i].name}: ${base} base → ${totalDamage} total damage (SH: ${res.shLoss}, HP: ${res.hpLoss}).`);
        }
      }
      if (hadMixedDouble) {
        const forks = 2;
        let totalForkDamage = 0;
        for (let f = 0; f < forks; f++) {
          const choices = newEnemies.map((e, i) => i).filter(i => newEnemies[i].bars.hp > 0);
          if (choices.length === 0) break;
          const j = choices[Math.floor(Math.random() * choices.length)];
          const forkDamage = Math.round(base * BalanceSupers.Technomancer.L3.forkBonus);
          const res = applyToEnemyIndex(j, forkDamage, 'arc');
          totalForkDamage += (res.shLoss + res.hpLoss);
        }
        events.push(`Ion Tempest forks through the battlefield: ${forks} forks, ${totalForkDamage} total fork damage dealt.`);
      }
    }
  } else if (spentMember.classId === 'pyromancer') {
    if (level === 1) {
      // Pyromancer L1: Apply a Burn stack and small thermal burst
      newEnemies[targetIdx] = applyPrimeNew(newEnemies[targetIdx], 'thermal', 'Ignite');
      const res = applyToEnemyIndex(targetIdx, 12, 'thermal');
      const totalDamage = res.shLoss + res.hpLoss;
      events.push(`Ignite burst: 12 base → ${totalDamage} total damage (SH: ${res.shLoss}, HP: ${res.hpLoss}).`);
    } else if (level === 2) {
      const ability: Ability = { id: '__pm_l2', name: 'Solar Flare', type: 'thermal', role: 'detonator', baseDamage: BalanceSupers.Pyromancer.L2.base, allowedClasses: ['pyromancer'], tags: { detonator: true } } as any;
      const after = resolveDetonatorHit(tempActor, newEnemies[targetIdx], ability, newEnemies, events, state, { sameMult: BalanceSupers.Pyromancer.L2.burstBonusSame });
      const reapplied = applyPrimeNew(after, 'thermal', 'Solar Flare');
      newEnemies[targetIdx] = reapplied;
      newEnemies[targetIdx] = applyPrimeNew(newEnemies[targetIdx], 'thermal', 'Solar Flare');
    } else { // level === 3
      const phases = BalanceSupers.Pyromancer.L3.fieldPhases;
      state.infernoFieldPhasesLeft = Math.max(state.infernoFieldPhasesLeft || 0, phases);
      newEnemies.forEach((_, i) => { if (newEnemies[i].bars.hp > 0) newEnemies[i] = applyPrimeNew(newEnemies[i], 'thermal', 'Inferno Field'); });
      if (hadMixedDouble) {
        let totalIgniteDamage = 0;
        newEnemies.forEach((_, i) => { 
          if (newEnemies[i].bars.hp > 0) {
            const res = applyToEnemyIndex(i, BalanceSupers.Pyromancer.L3.igniteTick, 'thermal');
            totalIgniteDamage += (res.shLoss + res.hpLoss);
          }
        });
        events.push(`Inferno ignites the ground: ${BalanceSupers.Pyromancer.L3.igniteTick} base damage per enemy, ${totalIgniteDamage} total damage dealt.`);
      }
      events.push('Inferno field established.');
    }
  } else if (spentMember.classId === 'voidrunner') {
    if (level === 1) {
      // Voidrunner L1: Void pierce jab; minor detonation if primed
      const ability: Ability = { id: '__vr_l1', name: 'Gravitic Jab', type: 'void', role: 'detonator', baseDamage: 18, allowedClasses: ['voidrunner'], tags: { detonator: true } } as any;
      const after = resolveDetonatorHit(tempActor, newEnemies[targetIdx], ability, newEnemies, events, state);
      newEnemies[targetIdx] = after;
    } else if (level === 2) {
      const ability: Ability = { id: '__vr_l2', name: 'Event Horizon', type: 'void', role: 'detonator', baseDamage: BalanceSupers.Voidrunner.L2.base, allowedClasses: ['voidrunner'], tags: { detonator: true } } as any;
      const after = resolveDetonatorHit(tempActor, newEnemies[targetIdx], ability, newEnemies, events, state, { sameMult: BalanceSuper.sameTypeDoublePrimeSuperMult });
      newEnemies[targetIdx] = after;
      events.push(`${newEnemies[targetIdx].name} is Suppressed for 1 turn.`);
    } else { // level === 3
      const base = BalanceSupers.Voidrunner.L3.base;
      for (let i = 0; i < newEnemies.length; i++) {
        if (newEnemies[i].bars.hp <= 0) continue;
        const ability: Ability = { id: '__vr_l3', name: 'Singularity', type: 'void', role: 'detonator', baseDamage: base, allowedClasses: ['voidrunner'], tags: { detonator: true } } as any;
        const after = resolveDetonatorHit(tempActor, newEnemies[i], ability, newEnemies, events, state);
        newEnemies[i] = after;
      }
      if (hadMixedDouble) events.push('Singularity shockwave slows enemies for 1 turn.');
    }
  }

  const baseState: BattleState = { ...state, enemies: newEnemies, party: newParty };
  const killed = removeDeadEnemies(baseState);
  if (baseState.isOver) {
    return { ...baseState, log: [...state.log, ...events, 'All enemies defeated! Victory!'] };
  }
  const over = baseState.overdriveByMember?.[spentMember.actorId];
  if (over?.active && killed > 0) {
    return { ...baseState, log: [...state.log, ...events, `${spentMember.name} Overdrive: extra action granted!`] };
  }
  const livingMembers = getLivingPartyMembers(baseState);
  if (livingMembers.length > 1) {
    const prevIndex = baseState.activePartyIndex;
    const nextState = advancePartyTurn(baseState);
          // Apply OOC decay to all party at end of player's turn step
      const decayedParty = nextState.party.map(m => ({ ...m, superEnergy: addSuper(m.superEnergy, -BalanceSuper.decayOOC) }));
    const decCd: NonNullable<BattleState['cooldownsByMember']> = { ...(nextState.cooldownsByMember || {}) };
    for (const k of Object.keys(decCd)) {
      const inner = decCd[k];
      const upd: Record<string, number> = {};
      for (const abId of Object.keys(inner)) {
        const v = inner[abId];
        const nv = Math.max(0, (v || 0) - 1);
        if (nv > 0) upd[abId] = nv;
      }
      decCd[k] = upd;
    }
    const wrappedRound = nextState.activePartyIndex <= prevIndex;
    return { ...nextState, party: decayedParty, cooldownsByMember: decCd, log: [...state.log, ...events, `Turn passed to ${nextState.party[nextState.activePartyIndex].name}.`], turn: wrappedRound ? 'enemy' : nextState.turn };
  }
  // End of player's round → clear time-limited round buffs
  const cleared: BattleState = { ...baseState, overdriveByMember: {} };
  return { ...cleared, log: [...state.log, ...events], turn: 'enemy' };
}

// Out-of-turn super casting: can be used any time and by any living member
export function castSuperAnytime(state: BattleState, memberId: string, level: 1 | 2 | 3): BattleState {
  const memberIdx = state.party.findIndex(m => m.actorId === memberId);
  const member = state.party[memberIdx];
  if (memberIdx === -1 || !member || member.bars.hp <= 0) return state;
  if (!canCastSuper(member, level)) return state;

  const originalTurn = state.turn;
  const spentMember = spendSuper(member, level);
  const newParty = [...state.party];
  newParty[memberIdx] = spentMember;
  let newEnemies = [...state.enemies];
  const events: string[] = [];
  const target = currentTarget(state) || state.enemies.find(e => e.bars.hp > 0);
  if (!target) return { ...state, party: newParty };
  const targetIdx = state.enemies.findIndex(e => e.id === target.id);

  const tempActor: Actor = { id: spentMember.actorId, name: spentMember.name, bars: spentMember.bars, maxBars: { sh: 100, hp: 100, sp: 100 }, primes: spentMember.primes };
  const applyToEnemyIndex = (idx: number, raw: number, type: DamageType) => {
    const enemy = newEnemies[idx];
    const finalRaw = Math.max(0, Math.round(applyFactionAndSpecials(raw, type, false, tempActor, enemy, state)));
    const mul = getElementalMultiplierForActor(enemy, type);
    if (mul > 1) events.push(`Weakness hit (${type}) x${mul.toFixed(2)}.`);
    else if (mul < 1) events.push(`Resisted (${type}) x${mul.toFixed(2)}.`);
    const res = routeDamage_SH_HP(enemy, finalRaw, type);
    newEnemies[idx] = res.defender;
    return res;
  };

  const beforeTarget = { ...state.enemies[targetIdx] };
  const pairKind = classifyPrimePair(beforeTarget?.primes);
  const hadAnyPrimes = pairKind && pairKind !== 'none';
  const hadSameDouble = pairKind === 'same';
  const hadMixedDouble = pairKind === 'mixed';

  if (spentMember.classId === 'vanguard') {
    if (level === 1) {
      const ability: Ability = { id: '__vg_l1', name: 'Adrenal Surge', type: 'kinetic', role: 'detonator', baseDamage: 28, allowedClasses: ['vanguard'], tags: { detonator: true } } as any;
      const after = resolveDetonatorHit(tempActor, newEnemies[targetIdx], ability, newEnemies, events, state);
      newEnemies[targetIdx] = after;
    } else if (level === 2) {
      const ability: Ability = { id: '__vg_l2', name: 'Bullet Time', type: 'kinetic', role: 'detonator', baseDamage: BalanceSupers.Vanguard.L2.base, allowedClasses: ['vanguard'], tags: { detonator: true } } as any;
      const after = resolveDetonatorHit(tempActor, newEnemies[targetIdx], ability, newEnemies, events, state, { sameMult: BalanceSuper.sameTypeDoublePrimeSuperMult });
      newEnemies[targetIdx] = after;
      if (hadAnyPrimes) {
        const candidates = newEnemies.map((e, i) => ({ e, i })).filter(x => x.i !== targetIdx && x.e.bars.hp > 0);
        if (candidates.length > 0) {
          const chainTo = candidates[Math.floor(Math.random() * candidates.length)].i;
          const chainDmg = Math.round(BalanceSupers.Vanguard.L2.base * BalanceSupers.Vanguard.L2.chainFactor);
          const res2 = applyToEnemyIndex(chainTo, chainDmg, 'kinetic');
          const totalChainDamage = res2.shLoss + res2.hpLoss;
          events.push(`Bullet Time chains to ${newEnemies[chainTo].name}: ${chainDmg} base → ${totalChainDamage} total damage (SH: ${res2.shLoss}, HP: ${res2.hpLoss}).`);
        }
      }
    } else { // level === 3
      const map = { ...(state.overdriveByMember || {}) } as NonNullable<BattleState['overdriveByMember']>;
      map[spentMember.actorId] = { autoDetonateHits: true, active: true };
      state.overdriveByMember = map;
      if (hadMixedDouble) events.push('Overdrive bonus: Team speed up (1 turn).');
    }
  } else if (spentMember.classId === 'technomancer') {
    if (level === 1) {
      const base = 20;
      const res = applyToEnemyIndex(targetIdx, base, 'arc');
      const totalDamage = res.shLoss + res.hpLoss;
      events.push(`Overload Spike hits ${newEnemies[targetIdx].name}: ${base} base → ${totalDamage} total damage (SH: ${res.shLoss}, HP: ${res.hpLoss}).`);
    } else if (level === 2) {
      const dmg = hadMixedDouble ? BalanceSupers.Technomancer.L2.mediumAoE : BalanceSupers.Technomancer.L2.smallAoE;
      newEnemies.forEach((_, i) => {
        if (newEnemies[i].bars.hp > 0) {
          const res = applyToEnemyIndex(i, dmg, 'arc');
          if (i === targetIdx) {
            const totalDamage = res.shLoss + res.hpLoss;
            events.push(`Storm Cage hits ${newEnemies[i].name}: ${dmg} base → ${totalDamage} total damage (SH: ${res.shLoss}, HP: ${res.hpLoss}).`);
          }
        }
      });
      events.push('Storm Cage deployed.');
    } else { // level === 3
      const base = BalanceSupers.Technomancer.L3.base * (hadSameDouble ? BalanceSuper.sameTypeDoublePrimeSuperMult : 1);
      const order = newEnemies.map((e, i) => i).filter(i => newEnemies[i].bars.hp > 0);
      for (const i of order) {
        const res = applyToEnemyIndex(i, base, 'arc');
        if (i === targetIdx) {
          const totalDamage = res.shLoss + res.hpLoss;
          events.push(`Ion Tempest surges through ${newEnemies[i].name}: ${base} base → ${totalDamage} total damage (SH: ${res.shLoss}, HP: ${res.hpLoss}).`);
        }
      }
      if (hadMixedDouble) {
        const forks = 2;
        let totalForkDamage = 0;
        for (let f = 0; f < forks; f++) {
          const choices = newEnemies.map((e, i) => i).filter(i => newEnemies[i].bars.hp > 0);
          if (choices.length === 0) break;
          const j = choices[Math.floor(Math.random() * choices.length)];
          const forkDamage = Math.round(base * BalanceSupers.Technomancer.L3.forkBonus);
          const res = applyToEnemyIndex(j, forkDamage, 'arc');
          totalForkDamage += (res.shLoss + res.hpLoss);
        }
        events.push(`Ion Tempest forks through the battlefield: ${forks} forks, ${totalForkDamage} total fork damage dealt.`);
      }
    }
  } else if (spentMember.classId === 'pyromancer') {
    if (level === 1) {
      newEnemies[targetIdx] = applyPrimeNew(newEnemies[targetIdx], 'thermal', 'Ignite');
      const res = applyToEnemyIndex(targetIdx, 12, 'thermal');
      const totalDamage = res.shLoss + res.hpLoss;
      events.push(`Ignite burst: 12 base → ${totalDamage} total damage (SH: ${res.shLoss}, HP: ${res.hpLoss}).`);
    } else if (level === 2) {
      const ability: Ability = { id: '__pm_l2', name: 'Solar Flare', type: 'thermal', role: 'detonator', baseDamage: BalanceSupers.Pyromancer.L2.base, allowedClasses: ['pyromancer'], tags: { detonator: true } } as any;
      const after = resolveDetonatorHit(tempActor, newEnemies[targetIdx], ability, newEnemies, events, state, { sameMult: BalanceSupers.Pyromancer.L2.burstBonusSame });
      const reapplied = applyPrimeNew(after, 'thermal', 'Solar Flare');
      newEnemies[targetIdx] = reapplied;
      newEnemies[targetIdx] = applyPrimeNew(newEnemies[targetIdx], 'thermal', 'Solar Flare');
    } else { // level === 3
      const phases = BalanceSupers.Pyromancer.L3.fieldPhases;
      state.infernoFieldPhasesLeft = Math.max(state.infernoFieldPhasesLeft || 0, phases);
      newEnemies.forEach((_, i) => { if (newEnemies[i].bars.hp > 0) newEnemies[i] = applyPrimeNew(newEnemies[i], 'thermal', 'Inferno Field'); });
      if (hadMixedDouble) {
        let totalIgniteDamage = 0;
        newEnemies.forEach((_, i) => { 
          if (newEnemies[i].bars.hp > 0) {
            const res = applyToEnemyIndex(i, BalanceSupers.Pyromancer.L3.igniteTick, 'thermal');
            totalIgniteDamage += (res.shLoss + res.hpLoss);
          }
        });
        events.push(`Inferno ignites the ground: ${BalanceSupers.Pyromancer.L3.igniteTick} base damage per enemy, ${totalIgniteDamage} total damage dealt.`);
      }
      events.push('Inferno field established.');
    }
  } else if (spentMember.classId === 'voidrunner') {
    if (level === 1) {
      const ability: Ability = { id: '__vr_l1', name: 'Gravitic Jab', type: 'void', role: 'detonator', baseDamage: 18, allowedClasses: ['voidrunner'], tags: { detonator: true } } as any;
      const after = resolveDetonatorHit(tempActor, newEnemies[targetIdx], ability, newEnemies, events, state);
      newEnemies[targetIdx] = after;
    } else if (level === 2) {
      const ability: Ability = { id: '__vr_l2', name: 'Event Horizon', type: 'void', role: 'detonator', baseDamage: BalanceSupers.Voidrunner.L2.base, allowedClasses: ['voidrunner'], tags: { detonator: true } } as any;
      const after = resolveDetonatorHit(tempActor, newEnemies[targetIdx], ability, newEnemies, events, state, { sameMult: BalanceSuper.sameTypeDoublePrimeSuperMult });
      newEnemies[targetIdx] = after;
      events.push(`${newEnemies[targetIdx].name} is Suppressed for 1 turn.`);
    } else { // level === 3
      const base = BalanceSupers.Voidrunner.L3.base;
      for (let i = 0; i < newEnemies.length; i++) {
        if (newEnemies[i].bars.hp <= 0) continue;
        const ability: Ability = { id: '__vr_l3', name: 'Singularity', type: 'void', role: 'detonator', baseDamage: base, allowedClasses: ['voidrunner'], tags: { detonator: true } } as any;
        const after = resolveDetonatorHit(tempActor, newEnemies[i], ability, newEnemies, events, state);
        newEnemies[i] = after;
      }
      if (hadMixedDouble) events.push('Singularity shockwave slows enemies for 1 turn.');
    }
  }

  const baseState: BattleState = { ...state, enemies: newEnemies, party: newParty } as BattleState;
  const killed = removeDeadEnemies(baseState);
  const final: BattleState = { ...baseState, log: [...state.log, ...events], turn: originalTurn };
  return final;
}

function getElementalMultiplierForActor(defender: Actor, type: DamageType): number {
  const inst = getEnemyInstance(defender.id);
  if (!inst) return 1.0;
  return elementalMultiplierFor(inst.faction, type as any);
}

function applyFactionAndSpecials(raw: number, type: DamageType, isDetonator: boolean, attacker: Actor, defender: Actor, state?: BattleState): number {
  // Defender resist/vuln (enemies only)
  let result = raw * getElementalMultiplierForActor(defender, type);

  // Player-side mission bonus (attacker is not an enemy instance)
  const attackerInst = getEnemyInstance(attacker.id);
  if (!attackerInst && state?.missionBuff && typeof state.missionBuff.playerDamageMult === 'number') {
    result *= state.missionBuff.playerDamageMult;
  }

  // Attacker specials (enemies only)
  if (attackerInst) {
    // Accord detonation bonus
    const hasPrime = Array.isArray(defender.primes) && defender.primes.length > 0;
    const detBonus = accordDetonationBonus(attackerInst.faction, isDetonator, hasPrime);
    if (detBonus > 0) result *= (1 + detBonus);

    // Outlaws swarm aura
    if (state && attackerInst.faction === 'Outlaws') {
      const alliesTags: string[] = state.enemies
        .filter(e => e.id !== attacker.id && e.bars.hp > 0)
        .map(e => getEnemyInstance(e.id)?.tags || [])
        .flat();
      const swarm = outlawSwarmBonus(attackerInst.faction, alliesTags);
      if (swarm > 0) result *= (1 + swarm);
    }
  }

  return result;
}

// Legacy functions for enemy AI (simplified)
export function playerAttack(state: BattleState): BattleState {
  // Get the actual ability object from the master list or synthesize specials
  const selectedId = state.selectedAbilityId;
  let selectedAbility = selectedId ? ABILITY_BY_ID[selectedId] : undefined;
  if (!selectedAbility && (selectedId === '__basic' || selectedId === '__defend')) {
    // Synthesize Basic
    if (selectedId === '__basic') {
      // Get weapon element for basic attack
      const weapon = getWeaponForActor(state, state.party[state.activePartyIndex]?.actorId);
      const weaponElement = weapon?.basicType || 'kinetic';
      
      const base: Ability = {
        id: selectedId,
        name: 'Basic Attack',
        type: weaponElement, // Use weapon element instead of hardcoded kinetic
        role: 'prime',
        baseDamage: 12,
        allowedClasses: ['vanguard','technomancer','pyromancer','voidrunner']
      } as any;
      selectedAbility = base;
    }
  }
  
  // Get the active party member
  const activeMember = state.party[state.activePartyIndex];
  if (!activeMember) return state;
  
  // Check if the active member is alive
  if (activeMember.bars.hp <= 0) {
    return {
      ...state,
      log: [...state.log, `${activeMember.name} is defeated and cannot act.`]
    };
  }
  
  // Create a temporary actor for the active member to use in executeAbility
  const tempActor: Actor = {
    id: activeMember.actorId,
    name: activeMember.name,
    bars: activeMember.bars,
    maxBars: { sh: 100, hp: 100, sp: 100 }, // Using standard max values
    primes: activeMember.primes
  };
  
  // If special __defend was selected, translate to mapped class sustain
  if (selectedId === '__defend') {
    const mapId = DEFENSIVE_BY_CLASS[activeMember.classId];
    const mapped = mapId ? ABILITY_BY_ID[mapId] : undefined;
    if (!mapped) return state;
    // Check class, cooldown, super
    const cds = (state.cooldownsByMember || {})[activeMember.actorId] || {};
    const cdLeft = cds[mapped.id] || 0;
    const superNow = Math.floor(activeMember.superEnergy ?? 0);
    const superNeed = Math.floor(mapped.superCost ?? 0);
    if (cdLeft > 0 || superNow < superNeed) {
      return { ...state, log: [...state.log, `${activeMember.name} cannot use Defend: ${cdLeft>0?`CD ${cdLeft}`:''}${(cdLeft>0&&superNow<superNeed)?' · ':''}${superNow<superNeed?`Super ${superNow}/${superNeed}`:''}`.trim()] };
    }
    selectedAbility = mapped;
  }

  // If still not found, report clearly now that __defend mapping has been attempted
  if (!selectedAbility) {
    return { ...state, log: [...state.log, `Action failed: ability '${selectedId || 'none'}' not found.`] };
  }

  // Check super cost for AOE abilities
  if (selectedAbility.superCost && selectedAbility.superCost > 0) {
    const superNow = Math.floor(activeMember.superEnergy ?? 0);
    const superNeed = Math.floor(selectedAbility.superCost);
    if (superNow < superNeed) {
      return {
        ...state,
        log: [...state.log, `${activeMember.name} cannot use ${selectedAbility.name}: insufficient Super (${superNow}/${superNeed}).`]
      };
    }
  }

  // For sustains, allow execution even without a valid enemy target
  // Only non-sustain actions require an enemy target
  const willSustain = !!selectedAbility.tags?.sustain;
  let target = currentTarget(state) || state.enemies[0];
  if (!target && !willSustain) {
    return { ...state, log: [...state.log, `Action failed: no valid target.`] };
  }

  // Sustain branch: apply to party and resources
  const isSustain = !!selectedAbility.tags?.sustain;
  let sustainEvents: string[] = [];
  let sustainState: BattleState = state;
  if (isSustain) {
    // Ally targeting support for single-target sustains
    const targetAllyIndex = (selectedAbility.id === 'heal' || selectedAbility.id === 'arc-restore' || selectedAbility.id === 'kinetic-barrier')
      ? (typeof state.selectedAllyIndex === 'number' ? state.selectedAllyIndex : undefined)
      : undefined;
    const applied = applySustain(state, activeMember, selectedAbility, targetAllyIndex);
    sustainEvents = applied.events;
    sustainState = applied.state;
  }

  const beforeEnemies = state.enemies.map(e => ({
    id: e.id,
    sh: e.bars.sh,
    hp: e.bars.hp,
    primes: (e.primes || []).length
  }));
  const { events, newTarget } = isSustain ? { events: sustainEvents, newTarget: target } : executeAbility(state, tempActor, target, selectedAbility);
  let targetAfter = newTarget;

  // Super hooks: onPrimeCast / onDetonateCast
  let newPartyMember = { ...activeMember } as PartyMember;
  const isPrime = selectedAbility.tags?.prime;
  const isDet = selectedAbility.tags?.detonator;
  const isBasic = selectedAbility.id === '__basic';
  const memId = activeMember.actorId;
  const streakMap = { ...(state.basicStreakByMember || {}) } as NonNullable<BattleState['basicStreakByMember']>;
  const prevStreak = streakMap[memId] || 0;
  let appliedPrimeFromBasic = false;
  let gainedBasicImmediate = false;
  if (isBasic) {
    const nextStreak = prevStreak + 1;
    streakMap[memId] = nextStreak;
    // If this is the second consecutive basic, apply a prime of the weapon's element
    if (nextStreak >= 2) {
      const weapon = getWeaponForActor(state, activeMember.actorId);
      const weaponElement = weapon?.basicType || 'kinetic';
      const primed = applyPrimeNew(targetAfter, weaponElement, 'Basic Streak');
      targetAfter = primed;
      appliedPrimeFromBasic = true;
      streakMap[memId] = 0; // reset after proccing
      events.push(`Basic streak primes ${weaponElement.charAt(0).toUpperCase() + weaponElement.slice(1)}!`);
    }
    // Immediate gain handled by consolidated calculator after damage calc
    gainedBasicImmediate = true;
  } else {
    // Any non-basic action resets the streak
    streakMap[memId] = 0;
  }
  if (isPrime) {
    newPartyMember.superEnergy = addSuper(newPartyMember.superEnergy, -BalanceSuper.drainPrime);
  }
  if (isDet) {
    newPartyMember.superEnergy = addSuper(newPartyMember.superEnergy, -BalanceSuper.costDetonate);
  }
  if (isSustain) {
    const cost = selectedAbility.superCost || 0;
    newPartyMember.superEnergy = addSuper(newPartyMember.superEnergy, -cost);
  }
  
  // Deduct super cost for AOE abilities
  if (selectedAbility.superCost && selectedAbility.superCost > 0 && !isSustain) {
    newPartyMember.superEnergy = addSuper(newPartyMember.superEnergy, -selectedAbility.superCost);
  }
  
  // Update the target enemy in the enemies array
  const newEnemies = [...state.enemies];
  const targetIndex = newEnemies.findIndex(e => e.id === target.id);
  let detonationSucceeded = false;
  if (targetIndex !== -1) {
    newEnemies[targetIndex] = targetAfter;
  }
  // Wave-wide deltas so chained hops count
  let dealt = 0;
  let isKillShot = false;
  for (let i = 0; i < newEnemies.length; i++) {
    const prev = beforeEnemies[i];
    const cur = newEnemies[i];
    if (!prev || !cur) continue;
    const shDealt = Math.max(0, prev.sh - cur.bars.sh);
    const hpDealt = Math.max(0, prev.hp - cur.bars.hp);
    if (shDealt + hpDealt > 0) dealt += (shDealt + hpDealt);
    if (cur.bars.hp <= 0 && prev.hp > 0) isKillShot = true;
    if ((prev.primes || 0) > ((cur.primes || []).length || 0)) detonationSucceeded = true;
  }
  const hasAnyPrimes = detonationSucceeded;
  const currentTurnGain = state.superEnergyGainedThisTurn?.[activeMember.actorId] || 0;
  const actionType: 'basic' | 'prime' | 'detonate' | 'sustain' = isBasic ? 'basic' : isPrime ? 'prime' : (isDet && detonationSucceeded) ? 'detonate' : 'sustain';
  const actionGain = calculateActionSuperGain(
    actionType,
    dealt,
    false, // TODO: implement critical hit system
    isKillShot,
    hasAnyPrimes,
    currentTurnGain
  );
  const wSuper = getWeaponForActor(state, activeMember.actorId)?.superGainMult ?? 1;
  const finalGain = Math.round(actionGain * wSuper);
  
  // Check if AOE ability should grant no super on hit
  if (selectedAbility.grantsSuperOnHit === false) {
    // AOE abilities with no super gain
    if (finalGain > 0) {
      events.push(`${selectedAbility.name} grants no Super on hit.`);
    }
  } else if (finalGain > 0) {
    // Normal super gain for other abilities
    newPartyMember.superEnergy = addSuper(newPartyMember.superEnergy, finalGain);
  }
  
  // Track turn-based gains
  const newTurnGains = { ...(state.superEnergyGainedThisTurn || {}) } as NonNullable<BattleState['superEnergyGainedThisTurn']>;
  newTurnGains[activeMember.actorId] = (newTurnGains[activeMember.actorId] || 0) + finalGain;

  // Cooldown apply on cast
  let newCooldowns = { ...(state.cooldownsByMember || {}) } as NonNullable<BattleState['cooldownsByMember']>;
  if (!newCooldowns[memId]) newCooldowns[memId] = {};
  if (selectedAbility.cooldown && selectedAbility.cooldown > 0) {
    newCooldowns[memId] = { ...newCooldowns[memId], [selectedAbility.id]: selectedAbility.cooldown };
  }
  // Support for AOE ability cooldowns
  if (selectedAbility.cooldownTurns && selectedAbility.cooldownTurns > 0) {
    newCooldowns[memId] = { ...newCooldowns[memId], [selectedAbility.id]: selectedAbility.cooldownTurns };
  }
  
  // Remove dead enemies and check for victory
  const baseState = isSustain ? sustainState : state;
  const partySource = baseState.party;
  const partyWithActor = partySource.map((m, i) => i === state.activePartyIndex ? { ...m, bars: { ...m.bars }, superEnergy: newPartyMember.superEnergy } : m);
  const newState = { ...baseState, enemies: newEnemies, party: partyWithActor, cooldownsByMember: newCooldowns, basicStreakByMember: streakMap, superEnergyGainedThisTurn: newTurnGains } as BattleState;
  // Increment per-member turn counter for fatigue tracking
  const turnMap = { ...(newState.memberTurnCountById || {}) } as NonNullable<BattleState['memberTurnCountById']>;
  const memId2 = activeMember.actorId;
  turnMap[memId2] = (turnMap[memId2] || 0) + 1;
  newState.memberTurnCountById = turnMap;
  const deadCount = removeDeadEnemies(newState);
  
  // Check for victory
  if (newState.isOver) {
    return {
      ...newState,
      log: [...state.log, ...events, 'All enemies defeated! Victory!']
    };
  }
  
  // Check if we need to advance to the next party member
  const livingMembers = getLivingPartyMembers(newState);
  if (livingMembers.length === 0) {
    return {
      ...newState,
      log: [...state.log, ...events, 'All party members defeated!'],
      isOver: true
    };
  }
  
  // New turn system: track how many party members have acted
  const currentActedCount = (newState.partyMembersActedThisRound || 0) + 1;
  const totalLivingMembers = livingMembers.length;
  
  console.log(`🎯 Turn System: Member ${activeMember.name} acted. Progress: ${currentActedCount}/${totalLivingMembers}`);
  
  // If all living party members have acted, pass turn to enemies
  if (currentActedCount >= totalLivingMembers) {
    // Reset the counter and pass to enemies
    console.log('🎯 All party members have acted, passing to enemies');
    return {
      ...newState,
      partyMembersActedThisRound: 0,
      superEnergyGainedThisTurn: {},
      log: [...state.log, ...events, 'All party members have acted. Enemies\' turn!'],
      turn: 'enemy'
    };
  }
  
  // Otherwise, advance to next living party member
  const prevIndex = newState.activePartyIndex;
  const nextState = advancePartyTurn(newState);
  // Apply OOC decay to all party at end of player's turn step
  const decayedParty = nextState.party.map(m => ({ ...m, superEnergy: addSuper(m.superEnergy, -BalanceSuper.decayOOC) }));
  // Decrement cooldowns by 1 at end of player's turn
  const decCd: NonNullable<BattleState['cooldownsByMember']> = { ...(nextState.cooldownsByMember || {}) };
  for (const k of Object.keys(decCd)) {
    const inner = decCd[k];
    const upd: Record<string, number> = {};
    for (const abId of Object.keys(inner)) {
      const v = inner[abId];
      const nv = Math.max(0, (v || 0) - 1);
      if (nv > 0) upd[abId] = nv;
    }
    decCd[k] = upd;
  }
  // Apply super refunds and gains
  const partyAfterHooks = decayedParty.map((m, idx) => {
    if (idx !== state.activePartyIndex) return m;
    let energy = m.superEnergy ?? 0;
    // onBasicResolved: if ability has neither prime nor detonator tag treat as basic
    const wasBasic = !isPrime && !isDet;
    if (wasBasic && !gainedBasicImmediate) energy = addSuper(energy, BalanceSuper.gainBasic);
    if (detonationSucceeded) energy = addSuper(energy, BalanceSuper.refundDetonate);
    return { ...m, superEnergy: energy };
  });
  
  return {
    ...nextState,
    party: partyAfterHooks,
    cooldownsByMember: decCd,
    partyMembersActedThisRound: currentActedCount,
    log: [...state.log, ...events, `Turn passed to ${nextState.party[nextState.activePartyIndex].name}.`],
    turn: 'player' // Keep it player's turn until all members have acted
  };
  
  // Syndicate counterChance: if target survived and is Syndicate, roll and counter
  const stillIdx = newState.enemies.findIndex(e => e.id === target.id);
  if (stillIdx !== -1) {
    const inst = getEnemyInstance(target.id);
    if (inst && inst!.faction === 'Syndicate') {
      const chance = FACTIONS['Syndicate']?.specials?.counterChance ?? 0;
      if (Math.random() < chance) {
        const activeMember = newState.party[newState.activePartyIndex];
        if (activeMember && activeMember.bars.hp > 0) {
          const counterRaw = inst!.stats.damage;
          const tempDef: Actor = { id: activeMember.actorId, name: activeMember.name, bars: activeMember.bars, maxBars: { sh: 100, hp: 100, sp: 100 }, primes: activeMember.primes };
          const finalRaw = Math.max(0, Math.round(applyFactionAndSpecials(counterRaw, 'kinetic', false, newState.enemies[stillIdx], tempDef, newState)));
          const mul = getElementalMultiplierForActor(tempDef, 'kinetic');
          if (mul > 1) events.push(`Weakness hit (kinetic) x${mul.toFixed(2)}.`);
          else if (mul < 1) events.push(`Resisted (kinetic) x${mul.toFixed(2)}.`);
          const res = routeDamage_SH_HP(tempDef, finalRaw, 'kinetic');
          const partyCopy = [...newState.party];
          // Award super energy to the player for damage taken from the counter
          const taken = (res.shLoss || 0) + (res.hpLoss || 0);
          const superGain = Math.round((taken / 100) * BalanceSuper.gainTakePer100);
          const updatedMember = superGain > 0
            ? { ...activeMember, bars: res.defender.bars, superEnergy: addSuper(activeMember.superEnergy, superGain) }
            : { ...activeMember, bars: res.defender.bars };
          partyCopy[newState.activePartyIndex] = updatedMember;
          const logLines = [...events, `[Syndicate] ${inst!.name} counters ${activeMember.name} [COUNTER][KINETIC]: ${finalRaw}.`];
          return { ...newState, party: partyCopy, log: [...state.log, ...logLines], turn: 'enemy' };
        }
      }
    }
  }

  // Enemy survives, continue battle
  // End-turn hooks if only one member
  const hookParty = newState.party.map((m, idx) => {
    let energy = addSuper(m.superEnergy, -BalanceSuper.decayOOC);
    if (idx === state.activePartyIndex) {
      const wasBasic = !isPrime && !isDet;
      if (wasBasic && !gainedBasicImmediate) energy = addSuper(energy, BalanceSuper.gainBasic);
      if (detonationSucceeded) energy = addSuper(energy, BalanceSuper.refundDetonate);
    }
    return { ...m, superEnergy: energy };
  });
  // Also decrement cooldowns when staying on same member
  const decCd2: NonNullable<BattleState['cooldownsByMember']> = { ...(newState.cooldownsByMember || {}) };
  for (const k of Object.keys(decCd2)) {
    const inner = decCd2[k];
    const upd: Record<string, number> = {};
    for (const abId of Object.keys(inner)) {
      const v = inner[abId];
      const nv = Math.max(0, (v || 0) - 1);
      if (nv > 0) upd[abId] = nv;
    }
    decCd2[k] = upd;
  }
  return { ...newState, party: hookParty, cooldownsByMember: decCd2, superEnergyGainedThisTurn: {}, log: [...state.log, ...events], turn: 'enemy' };
}

export function enemyAttack(state: BattleState): BattleState {
  // Pick a random living enemy to act
  const livingEnemies = state.enemies.filter(e => e.bars.hp > 0);
  if (livingEnemies.length === 0) return state;

  // Optional override: allow caller to force which enemy acts this step
  const forcedId = (state as any)._forceEnemyId as (string | undefined);
  const actingEnemy = (forcedId
    ? (state.enemies.find(e => e.id === forcedId && e.bars.hp > 0) || livingEnemies[0])
    : livingEnemies[Math.floor(Math.random() * livingEnemies.length)]
  );
  let inst = getEnemyInstance(actingEnemy.id);
  // If registry was cleared (e.g., HMR), re-hydrate from stored key
  if (!inst && (actingEnemy as any).enemyKey) {
    try {
      inst = instantiateEnemy((actingEnemy as any).enemyKey);
      // Cache for subsequent lookups
      registerEnemyActor(actingEnemy.id, inst);
    } catch {}
  }

  // Fallback to legacy simple attack if we have no instance mapping
  if (!inst) {
    const decision = chooseEnemyDamage(state);
    const damage = decision.dmg;
    return basicEnemyAttack(state, actingEnemy, damage, 'kinetic', `legacy: ${decision.reason}`);
  }

  const playersSnap = state.party.filter(m => m.bars.hp > 0).map(m => ({
    id: m.actorId,
    hp: m.bars.hp,
    shields: m.bars.sh,
    hasPrime: {
      Overload: (m.primes || []).some(p => p.element === 'arc') || undefined,
      Burn: (m.primes || []).some(p => p.element === 'thermal') || undefined,
      Suppress: (m.primes || []).some(p => p.element === 'void') || undefined,
      Pierce: (m.primes || []).some(p => p.element === 'kinetic') || undefined,
    }
  }));

  const enemiesSnap = state.enemies
    .map(e => getEnemyInstance(e.id))
    .filter(Boolean) as any[];
  const selfHpPct = Math.max(0, Math.min(1, actingEnemy.bars.hp / Math.max(1, actingEnemy.maxBars.hp)));
  const decision = chooseEnemyAction(inst, { enemies: enemiesSnap as any, players: playersSnap as any, turnIndex: 0, selfHpPct });
  const chosenAbility = decision.ability;
  const targetId = (decision.target as any)?.id || playersSnap[0]?.id || state.party[0]?.actorId;
  const targetIdx = state.party.findIndex(m => m.actorId === targetId) !== -1 ? state.party.findIndex(m => m.actorId === targetId) : state.party.findIndex(m => m.bars.hp > 0);
  const targetMember = state.party[targetIdx];
  if (!targetMember) return state;

  // Determine damage
  if (!inst) return state; // Safety check
  const base = inst.stats.damage;
  const roleMult = chosenAbility.isDetonator ? 1.10 : 1.0;
  const lowerType: DamageType = (chosenAbility.damageType.toLowerCase() as DamageType);
  const hasPrime = (targetMember.primes || []).length > 0;
  let raw = Math.round(base * roleMult);
  raw = Math.max(0, Math.round(applyFactionAndSpecials(raw, lowerType, !!chosenAbility.isDetonator, actingEnemy, {
    id: targetMember.actorId,
    name: targetMember.name,
    bars: targetMember.bars,
    maxBars: { sh: 100, hp: 100, sp: 100 },
    primes: targetMember.primes
  }, state)));

  // Guard redirect: split incoming raw if guarding another
  const guard = state.guardBuff;
  let targetRaw = raw;
  let redirectedRaw = 0;
  let guardCasterIdx = -1;
  if (guard && guard.casterId && guard.phasesLeft > 0) {
    guardCasterIdx = state.party.findIndex(m => m.actorId === guard.casterId);
    if (guardCasterIdx !== -1 && state.party[guardCasterIdx].bars.hp > 0 && state.party[guardCasterIdx].actorId !== targetMember.actorId) {
      redirectedRaw = Math.round(raw * guard.redirectPct);
      targetRaw = Math.max(0, raw - redirectedRaw);
    }
  }

  // Apply damage routing
  const tempActor: Actor = {
    id: targetMember.actorId,
    name: targetMember.name,
    bars: targetMember.bars,
    maxBars: { sh: 100, hp: 100, sp: 100 },
    primes: targetMember.primes
  };
  // Barrier absorb for target
  const barrierAfterTarget = applyBarrierAbsorption(state, targetMember.actorId, targetRaw);
  const result = routeDamage_SH_HP(tempActor, barrierAfterTarget.rawRemaining, lowerType);
  consumeBarrierHitIfApplicable(state, targetMember.actorId, barrierAfterTarget.hitConsumed);

  // Apply redirected portion to guard caster
  let casterResult: { defender: Actor; shLoss: number; hpLoss: number } | undefined;
  if (redirectedRaw > 0 && guardCasterIdx !== -1) {
    const casterMember = state.party[guardCasterIdx];
    const casterTemp: Actor = { id: casterMember.actorId, name: casterMember.name, bars: casterMember.bars, maxBars: { sh: 100, hp: 100, sp: 100 }, primes: casterMember.primes };
    const afterBarrier = applyBarrierAbsorption(state, casterMember.actorId, redirectedRaw);
    casterResult = routeDamage_SH_HP(casterTemp, afterBarrier.rawRemaining, lowerType);
    consumeBarrierHitIfApplicable(state, casterMember.actorId, afterBarrier.hitConsumed);
  }

  // Apply primer effect if any
  const logLines: string[] = [];
  const tags: string[] = [];
  if (chosenAbility.isPrimer) tags.push('Primer');
  if (chosenAbility.isDetonator) tags.push('Detonator');

  // Log elemental multiplier effects
  const mul = getElementalMultiplierForActor({
    id: targetMember.actorId,
    name: targetMember.name,
    bars: targetMember.bars,
    maxBars: { sh: 100, hp: 100, sp: 100 },
    primes: targetMember.primes
  }, lowerType);
  if (mul > 1) logLines.push(`Weakness hit (${lowerType}) x${mul.toFixed(2)}.`);
  else if (mul < 1) logLines.push(`Resisted (${lowerType}) x${mul.toFixed(2)}.`);

  const typeLabel = chosenAbility.damageType.toUpperCase();
  logLines.push(`[${inst.faction}] ${inst.name} uses ${chosenAbility.display} ${tags.length ? '['+tags.join('+')+'] ' : ''}[${typeLabel}]: ${raw} base.`);

  if (chosenAbility.isDetonator && hasPrime) {
    logLines.push(`Detonation triggered on ${targetMember.name}.`);
    try { (window as any).BattleFX?.explosion?.(chosenAbility.primeType || chosenAbility.damageType); } catch {}
    // Clear target primes after detonation
    result.defender.primes = [];
  }

  if (chosenAbility.isPrimer) {
    const primeElem = chosenAbility.primeType ? primeTypeToLowerDamageType(chosenAbility.primeType) : (lowerType as any);
    const afterPrime = applyPrimeNew(result.defender, primeElem, chosenAbility.display);
    result.defender = afterPrime;
    logLines.push(`${chosenAbility.display} applies ${chosenAbility.primeType || chosenAbility.damageType} prime to ${targetMember.name}.`);
    try { (window as any).BattleFX?.prime?.(chosenAbility.primeType || chosenAbility.damageType); } catch {}
  }

  if (result.shLoss > 0) {
    logLines.push(`${targetMember.name}'s shields took ${result.shLoss} damage`);
  }
  if (result.hpLoss > 0) {
    logLines.push(`${targetMember.name} takes ${result.hpLoss} HP damage`);
  }
  if (casterResult && (casterResult.shLoss > 0 || casterResult.hpLoss > 0) && guardCasterIdx !== -1) {
    const casterMember = state.party[guardCasterIdx];
    logLines.push(`${casterMember.name} guards: takes ${casterResult.shLoss} SH and ${casterResult.hpLoss} HP redirected.`);
    // Guard super gain
    const taken = casterResult.shLoss + casterResult.hpLoss;
    const superGain = Math.floor(taken / 50) * BalanceSustain.guardSuperPer50;
    if (superGain > 0) {
      const pm = { ...casterMember, superEnergy: addSuper(casterMember.superEnergy, superGain) };
      const nParty = [...state.party];
      nParty[guardCasterIdx] = pm;
      (state as any).party = nParty;
      logLines.push(`${casterMember.name} gains ${superGain} Super from guarding.`);
    }
  }

  // Super: onTakeDamage for target, onDealDamage for acting enemy is ignored for enemies
  // Apply player super gain on take damage
  const dmgTaken = result.shLoss + result.hpLoss;
  if (dmgTaken > 0) {
    const gain = Math.round((dmgTaken / 100) * BalanceSuper.gainTakePer100);
    const pm = { ...targetMember, superEnergy: addSuper(targetMember.superEnergy, gain) };
    const newParty2 = [...state.party];
    newParty2[targetIdx] = pm;
    // replace state.party reference for subsequent mutations
    (state as any).party = newParty2;
  }

  // Update party member
  const newParty = [...state.party];
  // Preserve any super energy adjustments applied above when updating bars/primes
  const prevMemberState = newParty[targetIdx];
  newParty[targetIdx] = { ...prevMemberState, bars: result.defender.bars, primes: result.defender.primes };
  if (casterResult && guardCasterIdx !== -1) {
    const casterMember = state.party[guardCasterIdx];
    newParty[guardCasterIdx] = { ...casterMember, bars: casterResult.defender.bars };
  }

  // FX and floaters
  try {
    const prev = state.party[targetIdx];
    const next = newParty[targetIdx];
    if (prev && next && (window as any).BattleFX?.floatDamage) {
      const shDelta = Math.max(0, prev.bars.sh - next.bars.sh);
      const hpDelta = Math.max(0, prev.bars.hp - next.bars.hp);
      const cardEls = document.querySelectorAll('.party-cards .pm-card');
      const cardEl = cardEls[targetIdx] as HTMLElement | undefined;
      if (cardEl) {
        const r = cardEl.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const rootRect = (document.getElementById('app-wrap') as HTMLElement)?.getBoundingClientRect();
        const relX = rootRect ? cx - rootRect.left : cx;
        const relY = rootRect ? cy - rootRect.top : cy;
        const toCanvas = (x: number, y: number) => ({ x, y });
        if (shDelta > 0) (window as any).BattleFX.floatDamage(toCanvas(relX, relY), shDelta, { shield: true });
        if (hpDelta > 0) (window as any).BattleFX.floatDamage(toCanvas(relX, relY - 10), hpDelta, { type: chosenAbility.damageType });
        // Removed BattleFX.hit() to eliminate white screen effect
      }
    }
  } catch {}

  // End-of-turn faction specials: Voidborn regen
  const actingIdx = state.enemies.findIndex(e => e.id === actingEnemy.id);
  const newEnemies = [...state.enemies];
  if (inst.faction === 'Voidborn') {
    const regen = FACTIONS['Voidborn']?.specials?.regenPerTurn || 0;
    if (regen > 0) {
      const cur = newEnemies[actingIdx];
      const hp = Math.min(cur.maxBars.hp, cur.bars.hp + regen);
      newEnemies[actingIdx] = { ...cur, bars: { ...cur.bars, hp } };
      logLines.push(`${inst.name} regenerates ${regen} HP.`);
    }
  }

  // Check defeat
  const livingMembers = newParty.filter(m => m.bars.hp > 0);
  if (livingMembers.length === 0) {
    return { ...state, party: newParty, enemies: newEnemies, log: [...state.log, ...logLines, 'All party members defeated!'], isOver: true };
  }

  // Advance back to player; expire guard/barriers
  let finalState: BattleState = { ...state, party: newParty, enemies: newEnemies, log: [...state.log, ...logLines], turn: 'player' };
  // Clear any forced id hint carried through spreads
  try { (finalState as any)._forceEnemyId = undefined; } catch {}
  if (finalState.guardBuff && finalState.guardBuff.phasesLeft > 0) {
    const left = finalState.guardBuff.phasesLeft - 1;
    finalState.guardBuff = left > 0 ? { ...finalState.guardBuff, phasesLeft: left } : undefined;
  }
  if (finalState.barriersByMember) {
    const upd: NonNullable<BattleState['barriersByMember']> = {};
    for (const [id, b] of Object.entries(finalState.barriersByMember)) {
      const left = (b?.phasesLeft ?? 0) - 1;
      if (b && left > 0 && b.amountLeft > 0 && b.hitsLeft > 0) {
        upd[id] = { ...b, phasesLeft: left };
      }
    }
    finalState.barriersByMember = upd;
  }
  if (finalState.party[finalState.activePartyIndex].bars.hp <= 0) {
    // If the active party member dies, we need to handle turn progression
    const livingMembers = finalState.party.filter(m => m.bars.hp > 0);
    if (livingMembers.length === 0) {
      // All party members defeated
      finalState.isOver = true;
      return finalState;
    }
    
    // Check if we need to advance to next living member or end the round
    const currentActedCount = (finalState.partyMembersActedThisRound || 0);
    const totalLivingMembers = livingMembers.length;
    
    if (currentActedCount >= totalLivingMembers) {
      // All living members have acted, pass to enemies
      finalState.turn = 'enemy';
      finalState.partyMembersActedThisRound = 0;
      finalState.log.push('All party members have acted. Enemies\' turn!');
    } else {
      // Advance to next living member
      finalState = advancePartyTurn(finalState);
      finalState.log.push(`Turn passed to ${finalState.party[finalState.activePartyIndex].name}.`);
    }
  }
  return finalState;
}

// Sustain application with fatigue and super cost handled by caller
function applySustain(state: BattleState, member: PartyMember, ability: Ability, targetAllyIndex?: number): { state: BattleState; events: string[] } {
  const events: string[] = [];
  const memId = member.actorId;
  const next: BattleState = { ...state, party: [...state.party] };
  const idx = next.party.findIndex(m => m.actorId === memId);
  if (idx === -1) return { state, events };

  // Fatigue calc
  const turnMap = { ...(next.memberTurnCountById || {}) } as NonNullable<BattleState['memberTurnCountById']>;
  const lastMap = { ...(next.sustainLastUseByMember || {}) } as NonNullable<BattleState['sustainLastUseByMember']>;
  const key = ability.id as 'heal'|'barrier'|'cleanse'|'guard'|'kinetic-barrier'|'thermal-burst-sustain'|'arc-restore'|'void-drain';
  const nowTurn = turnMap[memId] || 0;
  const lastTurn = (lastMap[memId]?.[key]) ?? -Infinity;
  const fatigued = (nowTurn - lastTurn) < BalanceSustain.fatigueWindow;
  const effMult = fatigued ? (1 - BalanceSustain.fatiguePenalty) : 1;
  if (fatigued) events.push(`Fatigue −${Math.round(BalanceSustain.fatiguePenalty*100)}%`);

  if (key === 'heal' || key === 'arc-restore' || key === 'thermal-burst-sustain' || key === 'void-drain') {
    const amt = Math.round((BalanceSustain.healMin + Math.random() * (BalanceSustain.healMax - BalanceSustain.healMin)) * effMult);
    // Decide beneficiary
    const beneficiaryIndex = (key === 'heal' || key === 'arc-restore') && typeof targetAllyIndex === 'number'
      ? Math.max(0, Math.min(next.party.length - 1, targetAllyIndex))
      : idx;
    const pm = next.party[beneficiaryIndex];
    const hp = Math.min(100, pm.bars.hp + amt);
    next.party[beneficiaryIndex] = { ...pm, bars: { ...pm.bars, hp } };
    if (key === 'arc-restore') {
      const bonus = Math.round(amt * 0.25);
      const hp2 = Math.min(100, hp + bonus);
      const superRegen = 6;
      next.party[beneficiaryIndex] = { ...pm, bars: { ...pm.bars, hp: hp2 }, superEnergy: addSuper(pm.superEnergy, superRegen) } as any;
      events.push(`${pm.name} restores ${amt + bonus} HP (${amt} base + ${bonus} bonus) and recovers ${superRegen} Super.`);
    } else if (key === 'thermal-burst-sustain') {
      const teamAmt = Math.round(amt * 0.5);
      next.party = next.party.map((m, i) => {
        const newHp = Math.min(100, m.bars.hp + (i === idx ? 0 : teamAmt));
        return i === idx ? next.party[idx] : { ...m, bars: { ...m.bars, hp: newHp } };
      });
      events.push(`${pm.name} bursts warmth: allies heal ${teamAmt} HP (${amt} base × 50% team bonus).`);
    } else if (key === 'void-drain') {
      events.push(`${pm.name} siphons vitality for ${amt} HP (${Math.round(BalanceSustain.healMin)}-${Math.round(BalanceSustain.healMax)} base range).`);
    } else {
      events.push(`${pm.name} heals ${amt} HP (${Math.round(BalanceSustain.healMin)}-${Math.round(BalanceSustain.healMax)} base range).`);
    }
  } else if (key === 'barrier') {
    const pool = Math.round(BalanceSustain.barrierAmount * effMult);
    const map = { ...(next.barriersByMember || {}) } as NonNullable<BattleState['barriersByMember']>;
    map[memId] = { amountLeft: pool, hitsLeft: BalanceSustain.barrierHits, phasesLeft: BalanceSustain.barrierPhases };
    next.barriersByMember = map;
    events.push(`${member.name} gains a barrier: ${pool} absorb pool (${BalanceSustain.barrierAmount} base), ${BalanceSustain.barrierHits} hits, ${BalanceSustain.barrierPhases} phases.`);
  } else if (key === 'kinetic-barrier') {
    const pool = Math.round((BalanceSustain.barrierAmount + 5) * effMult);
    const map = { ...(next.barriersByMember || {}) } as NonNullable<BattleState['barriersByMember']>;
    // Allow targeting an ally; default to self if none selected
    const beneficiaryIndex = typeof targetAllyIndex === 'number'
      ? Math.max(0, Math.min(next.party.length - 1, targetAllyIndex))
      : idx;
    const targetPm = next.party[beneficiaryIndex];
    const targetId = targetPm.actorId;
    map[targetId] = { amountLeft: pool, hitsLeft: BalanceSustain.barrierHits, phasesLeft: Math.max(1, BalanceSustain.barrierPhases) };
    next.barriersByMember = map;
    // Stronger heal component for Kinetic Barrier
    const heal = Math.round(BalanceSustain.healMin * 0.7 * effMult);
    const hp = Math.min(100, targetPm.bars.hp + heal);
    next.party[beneficiaryIndex] = { ...targetPm, bars: { ...targetPm.bars, hp } };
    events.push(`${member.name} grants ${targetPm.name} a kinetic barrier: ${pool} absorb pool (${BalanceSustain.barrierAmount + 5} base), ${BalanceSustain.barrierHits} hits, ${Math.max(1, BalanceSustain.barrierPhases)} phases, and restores ${heal} HP (${Math.round(BalanceSustain.healMin * 0.7)} base × 70%).`);
  } else if (key === 'cleanse') {
    const pm = next.party[idx];
    const cleaned = (pm.primes || []).filter(p => !(p.element === 'thermal' || p.element === 'void'));
    const shGain = Math.round(BalanceSustain.cleanseShGain * effMult);
    const sh = Math.min(100, pm.bars.sh + shGain);
    next.party[idx] = { ...pm, bars: { ...pm.bars, sh }, primes: cleaned };
    events.push(`${pm.name} cleanses and restores ${shGain} SH (${BalanceSustain.cleanseShGain} base).`);
  } else if (key === 'guard') {
    next.guardBuff = { casterId: memId, redirectPct: BalanceSustain.guardRedirectPct, phasesLeft: BalanceSustain.guardPhases };
    events.push(`${member.name} guards allies: ${Math.round(BalanceSustain.guardRedirectPct * 100)}% damage redirect, ${BalanceSustain.guardPhases} phases.`);
  }

  // Record usage turn
  lastMap[memId] = { ...(lastMap[memId] || {}), [key]: nowTurn };
  next.sustainLastUseByMember = lastMap;

  return { state: next, events };
}

function applyBarrierAbsorption(state: BattleState, memberId: string, rawIncoming: number): { rawRemaining: number; hitConsumed: boolean } {
  const b = state.barriersByMember?.[memberId];
  if (!b || b.amountLeft <= 0 || b.hitsLeft <= 0) return { rawRemaining: rawIncoming, hitConsumed: false };
  const absorb = Math.min(b.amountLeft, rawIncoming);
  const map = { ...(state.barriersByMember || {}) } as NonNullable<BattleState['barriersByMember']>;
  map[memberId] = { ...b, amountLeft: b.amountLeft - absorb };
  (state as any).barriersByMember = map;
  return { rawRemaining: Math.max(0, rawIncoming - absorb), hitConsumed: absorb > 0 };
}

function consumeBarrierHitIfApplicable(state: BattleState, memberId: string, hitOccurred: boolean): BattleState {
  const b = state.barriersByMember?.[memberId];
  if (!b) return state;
  if (hitOccurred) {
    const map = { ...(state.barriersByMember || {}) } as NonNullable<BattleState['barriersByMember']>;
    const hitsLeft = Math.max(0, (b.hitsLeft || 0) - 1);
    if (hitsLeft <= 0 || (b.amountLeft || 0) <= 0) {
      delete map[memberId];
    } else {
      map[memberId] = { ...b, hitsLeft };
    }
    (state as any).barriersByMember = map;
  }
  return state;
}
function basicEnemyAttack(state: BattleState, actingEnemy: Actor, damage: number, type: DamageType, reason: string): BattleState {
  const livingPartyMembers = state.party.filter(m => m.bars.hp > 0);
  if (livingPartyMembers.length === 0) {
    return { ...state, log: [...state.log, 'All party members defeated!'], isOver: true };
  }
  const targetMemberIndex = Math.floor(Math.random() * livingPartyMembers.length);
  const targetMember = livingPartyMembers[targetMemberIndex];
  const tempActor: Actor = { id: targetMember.actorId, name: targetMember.name, bars: targetMember.bars, maxBars: { sh: 100, hp: 100, sp: 100 }, primes: targetMember.primes };
  const result = routeDamage_SH_HP(tempActor, damage, type);
  const totalDamage = result.shLoss + result.hpLoss;
  const logLines = [`${actingEnemy.name} attacks ${targetMember.name} [${type.toUpperCase()}] (${reason}): ${damage} base → ${totalDamage} total damage!`];
  if (result.shLoss > 0) logLines.push(`${targetMember.name}'s shields absorbed ${result.shLoss} damage`);
  if (result.hpLoss > 0) logLines.push(`${targetMember.name} takes ${result.hpLoss} HP damage`);
  const newParty = [...state.party];
  const actualTargetIndex = state.party.findIndex(m => m.actorId === targetMember.actorId);
  if (actualTargetIndex !== -1) {
    // Award super on damage taken for legacy/basic enemy attacks
    const taken = (result.shLoss || 0) + (result.hpLoss || 0);
    const superGain = Math.round((taken / 100) * BalanceSuper.gainTakePer100);
    const prev = state.party[actualTargetIndex];
    const updated = superGain > 0
      ? { ...prev, bars: result.defender.bars, superEnergy: addSuper(prev.superEnergy, superGain) }
      : { ...prev, bars: result.defender.bars };
    newParty[actualTargetIndex] = updated;
  }
  return { ...state, party: newParty, log: [...state.log, ...logLines], turn: 'player' };
}

// Party management functions
export function getNextLivingPartyMember(state: BattleState): number {
  const { party, activePartyIndex } = state;
  let nextIndex = activePartyIndex;
  
  // Try to find the next living party member
  for (let i = 1; i <= party.length; i++) {
    const checkIndex = (activePartyIndex + i) % party.length;
    if (party[checkIndex].bars.hp > 0) {
      nextIndex = checkIndex;
      break;
    }
  }
  
  return nextIndex;
}

export function getLivingPartyMembers(state: BattleState): PartyMember[] {
  return state.party.filter(member => member.bars.hp > 0);
}

export function isPartyDefeated(state: BattleState): boolean {
  return getLivingPartyMembers(state).length === 0;
}

export function advancePartyTurn(state: BattleState): BattleState {
  const nextIndex = getNextLivingPartyMember(state);
  
  // If we're back to the same member, it means only one is alive
  if (nextIndex === state.activePartyIndex) {
    // Check if we have any living members
    if (getLivingPartyMembers(state).length === 0) {
      return { ...state, isOver: true };
    }
  }
  
  return {
    ...state,
    activePartyIndex: nextIndex,
    selectedAbilityId: undefined // Reset ability selection for new member
  };
}

// Check if party can continue fighting
export function canPartyContinue(state: BattleState): boolean {
  const livingMembers = getLivingPartyMembers(state);
  return livingMembers.length > 0;
}

// Get party health percentage (for UI display)
export function getPartyHealthPercentage(state: BattleState): number {
  const totalHealth = state.party.reduce((sum, member) => sum + member.bars.hp, 0);
  const maxHealth = state.party.length * 100; // Assuming 100 HP per member
  return Math.round((totalHealth / maxHealth) * 100);
}
