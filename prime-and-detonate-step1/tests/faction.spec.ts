import { FACTIONS } from '../data/factions';
import { instantiateEnemy } from '../engine/combat/enemyFactory';
import { ENEMIES } from '../data/enemies';

function approx(a: number, b: number, eps = 1e-6) { if (Math.abs(a-b) > eps) throw new Error(`Expected ${a} ≈ ${b}`); }

// Verify resist/vuln multipliers modify damage correctly
(function testResistVuln() {
  const accord = FACTIONS['Accord'];
  const thermalMult = (accord.resistVuln as any)['thermal'] as number; // 1.15
  const base = 100;
  const final = base * thermalMult;
  approx(final, 115);
})();

// Syndicate enemy with Arc primer, verify prime chance bonus presence in data (structural)
(function testPrimeBonusPresence() {
  const synd = FACTIONS['Syndicate'];
  if (!synd.primeMods || !synd.primeMods.applyChanceBonus || synd.primeMods.applyChanceBonus['overload'] == null) {
    throw new Error('Syndicate prime applyChanceBonus for Overload missing');
  }
})();


