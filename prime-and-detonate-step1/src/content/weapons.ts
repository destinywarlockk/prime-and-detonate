import type { Weapon } from '../game/types';

export const ALL_WEAPONS: Weapon[] = [
  // Synthetic "None": lowers basic damage; not unique
  { id: 'none',          name: 'None',              basicMult: 0.85, basicType: 'kinetic' },

  // Elemental weapons - these change the basic attack element
  { id: 'sidearm',       name: 'Sidearm',           basicMult: 1.30, basicType: 'kinetic' },
  { id: 'shock-baton',   name: 'Shock Baton',       basicMult: 1.25, basicType: 'arc' },
  { id: 'flame-pistol',  name: 'Flame Pistol',      basicMult: 1.25, basicType: 'thermal' },
  { id: 'void-blade',    name: 'Void Blade',        basicMult: 1.25, basicType: 'void' },
  { id: 'kinetic-rifle', name: 'Kinetic Rifle',     basicMult: 1.25, basicType: 'kinetic' },
  
  // Non-elemental weapons (keep existing ones but add elements)
  { id: 'heavy-blade',   name: 'Heavy Blade',       totalDamageMult: 1.20, basicType: 'kinetic' },
  { id: 'det-gauntlet',  name: 'Detonator Gauntlet',detonationDirectMult: 1.25, detonationSplashMult: 1.50, basicType: 'void' },
  { id: 'shield-emitter',name: 'Shield Emitter',    maxShBonus: 40, basicType: 'arc' },
  { id: 'medgel-frame',  name: 'Medgel Frame',      maxHpBonus: 40, basicType: 'thermal' },
  { id: 'overcharger',   name: 'Overcharger',       superGainMult: 1.25, basicType: 'arc' },
];

// Fast lookup map for weapon id → object
export const WEAPON_BY_ID: Record<string, Weapon> = Object.fromEntries(
  ALL_WEAPONS.map(w => [w.id, w])
);


