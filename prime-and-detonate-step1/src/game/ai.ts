import type { BattleState } from './types';

export interface EnemyDecision {
  dmg: number;
  reason: string;
}

export function chooseEnemyDamage(state: BattleState): EnemyDecision {
  const activeMember = state.party[state.activePartyIndex];
  if (!activeMember) {
    return { dmg: 20, reason: "no target" };
  }
  
  // Add small random jitter (±2) to make AI feel less predictable
  const jitter = Math.floor(Math.random() * 5) - 2; // -2 to +2
  
  if (activeMember.bars.sh > 0) {
    // Active member has shields - favor higher damage to break through
    const baseDamage = 26; // 24-28 range with jitter
    return {
      dmg: Math.max(1, baseDamage + jitter),
      reason: "target has shields"
    };
  } else {
    // Active member only has HP - lower damage to telegraph "finisher" risk
    const baseDamage = 18; // 16-20 range with jitter
    return {
      dmg: Math.max(1, baseDamage + jitter),
      reason: "finishing blow"
    };
  }
}
