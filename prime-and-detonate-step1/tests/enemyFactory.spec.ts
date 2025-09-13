import { instantiateEnemy } from '../engine/combat/enemyFactory';

// Verify baseStats × faction multipliers produce expected instance stats.
(function testFactory() {
  const inst = instantiateEnemy('accord_trooper');
  // Accord multipliers: hp 1.15, sh 1.0, spd 1.0, dmg 1.0
  if (inst.stats.maxHp !== Math.round(95 * 1.15)) throw new Error(`HP mismatch: ${inst.stats.maxHp}`);
  if (inst.stats.maxShields !== Math.round(25 * 1.0)) throw new Error(`SH mismatch: ${inst.stats.maxShields}`);
  if (inst.stats.damage !== Math.round(18 * 1.0)) throw new Error(`DMG mismatch: ${inst.stats.damage}`);
})();


