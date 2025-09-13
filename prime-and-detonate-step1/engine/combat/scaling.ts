export interface ScalingOpts { difficulty: number; playerLevel: number; }
export function scaleEnemyStats(base: {hp:number;shields:number;damage:number}, s: ScalingOpts){
  const d = 1 + s.difficulty * 0.15 + s.playerLevel * 0.08;
  return { hp: Math.round(base.hp*d), shields: Math.round(base.shields*d), damage: Math.round(base.damage*d) };
}


