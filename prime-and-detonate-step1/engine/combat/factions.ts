import { FACTIONS } from '../../data/factions';
import { DamageType, FactionConfig } from './types';

export type FactionId = FactionConfig['id'];

export function elementalMultiplierFor(defenderFactionId: FactionId | undefined, dmgType: DamageType): number {
  if (!defenderFactionId) return 1.0;
  const f = FACTIONS[defenderFactionId];
  if (!f) return 1.0;
  const table = f.resistVuln as Record<string, number>;
  return (table as any)[dmgType] ?? 1.0;
}

export function accordDetonationBonus(attackerFactionId: FactionId | undefined, isDetonator: boolean, targetHasPrime: boolean): number {
  if (!attackerFactionId || !isDetonator || !targetHasPrime) return 0;
  const f = FACTIONS[attackerFactionId];
  return f?.specials?.detonationBonus ?? 0;
}

export function outlawSwarmBonus(attackerFactionId: FactionId | undefined, alliesTags: string[] | undefined): number {
  if (!attackerFactionId) return 0;
  const f = FACTIONS[attackerFactionId];
  const aura = f?.specials?.swarmAura;
  if (!aura) return 0;
  // No position system yet; approximate: any ally with Swarm tag alive grants bonus
  const hasSwarmAlly = (alliesTags || []).includes('Swarm');
  return hasSwarmAlly ? (aura.dmgBonus ?? 0) : 0;
}


