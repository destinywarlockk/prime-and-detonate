import { EnemyArchetype } from '../engine/combat/types';

export const ENEMIES: EnemyArchetype[] = [
  {
    key: 'voidborn_sentinel',
    name: 'Voidborn Sentinel',
    faction: 'Voidborn',
    role: 'Controller',
    baseStats: { hp: 96, shields: 30, speed: 7, damage: 16 },
    abilities: [
      { id: 'void_lance', display: 'Void Lance', damageType: 'void', isPrimer: true, primeType: 'suppress', aiWeight: 0.5 },
      { id: 'entropy_burst', display: 'Entropy Burst', damageType: 'void', isDetonator: true, aiWeight: 0.5 }
    ],
    tags: ['Debuffer']
  },
  {
    key: 'syndicate_raptor',
    name: 'Syndicate Raptor',
    faction: 'Syndicate',
    role: 'Skirmisher',
    baseStats: { hp: 72, shields: 40, speed: 10, damage: 20 },
    abilities: [
      { id: 'smart_shot', display: 'Smart Shot', damageType: 'kinetic', aiWeight: 0.5 },
      { id: 'arc_net', display: 'Arc Net', damageType: 'arc', isPrimer: true, primeType: 'overload', aiWeight: 0.3 },
      { id: 'detpack', display: 'DetPack', damageType: 'thermal', isDetonator: true, aiWeight: 0.2 }
    ],
    tags: ['Opportunist']
  },
  {
    key: 'accord_trooper',
    name: 'Accord Trooper',
    faction: 'Accord',
    role: 'Bruiser',
    baseStats: { hp: 114, shields: 25, speed: 8, damage: 18 },
    abilities: [
      { id: 'rifle_burst', display: 'Rifle Burst', damageType: 'kinetic', aiWeight: 0.6 },
      { id: 'focus_fire', display: 'Focus Fire', damageType: 'kinetic', isDetonator: true, aiWeight: 0.4 }
    ],
    tags: ['DetonatorFocus']
  },
  {
    key: 'outlaw_scrapper',
    name: 'Outlaw Scrapper',
    faction: 'Outlaws',
    role: 'Minion',
    baseStats: { hp: 42, shields: 0, speed: 11, damage: 10 },
    abilities: [
      { id: 'rust_blade', display: 'Rust Blade', damageType: 'kinetic', aiWeight: 0.8 },
      { id: 'molotov', display: 'Molotov', damageType: 'thermal', isPrimer: true, primeType: 'burn', aiWeight: 0.2 }
    ],
    tags: ['Swarm']
  }
];


