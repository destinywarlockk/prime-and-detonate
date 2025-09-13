export type AbilityTypeLike = 'prime' | 'detonator' | 'sustain';
export type DamageTypeLike = 'kinetic' | 'arc' | 'thermal' | 'void';

export function formatTypeLabel(t: AbilityTypeLike): string {
  switch (t) {
    case 'prime': return 'Primer';
    case 'detonator': return 'Detonator';
    case 'sustain': return 'Sustain';
    default: return 'Skill';
  }
}

export function formatElementLabel(e: DamageTypeLike): string {
  return e.charAt(0).toUpperCase() + e.slice(1);
}

export function typeTooltip(t: AbilityTypeLike): string {
  if (t === 'prime') return 'Applies a prime; target won’t explode until a Detonator hits.';
  if (t === 'sustain') return 'Support ability: healing, barriers, cleanses, or guard.';
  return 'Same primes = more direct damage. Mixed primes = bigger AoE.';
}

export function badgeToneClass(t: AbilityTypeLike): string {
  switch (t) {
    case 'prime': return 'tone-amber';
    case 'detonator': return 'tone-sky';
    case 'sustain': return 'tone-emerald';
    default: return 'tone-slate';
  }
}

export function shouldShowBaseDamage(t: AbilityTypeLike, dmg: number | undefined): boolean {
  if (typeof dmg !== 'number') return false;
  if (t === 'prime') return dmg > 0;
  if (t === 'sustain') return false;
  return true;
}


