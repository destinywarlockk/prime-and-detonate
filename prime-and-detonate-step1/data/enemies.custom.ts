import { EnemyArchetypeOverride } from '../engine/combat/types';

export const FACTION_BASES = {
  Voidborn: {
    baseName: 'Voidborn Sentinel',
    baseStats: { hp: 96, shields: 30, speed: 7, damage: 16 },
    pools: {
      primers: [
        { id:'void_lance', display:'Void Lance', damageType:'void', isPrimer:true, primeType:'suppress', aiWeight:0.5 }
      ],
      detonators: [
        { id:'entropy_burst', display:'Entropy Burst', damageType:'void', isDetonator:true, aiWeight:0.5 }
      ],
      nukes: [
        { id:'negentropy_ray', display:'Negentropy Ray', damageType:'void', aiWeight:0.4 }
      ]
    },
    roleByTier: { Boss:'Controller' }
  },
  Syndicate: {
    baseName: 'Syndicate Raptor',
    baseStats: { hp: 72, shields: 40, speed: 10, damage: 20 },
    pools: {
      primers: [
        { id:'arc_net', display:'Arc Net', damageType:'arc', isPrimer:true, primeType:'overload', aiWeight:0.3 }
      ],
      detonators: [
        { id:'detpack', display:'DetPack', damageType:'thermal', isDetonator:true, aiWeight:0.2 }
      ],
      nukes: [
        { id:'smart_shot', display:'Smart Shot', damageType:'kinetic', aiWeight:0.5 }
      ]
    }
  },
  Accord: {
    baseName: 'Accord Trooper',
    baseStats: { hp: 114, shields: 25, speed: 8, damage: 18 },
    pools: {
      primers: [
        { id:'smoke_marker', display:'Smoke Marker', damageType:'kinetic', isPrimer:true, primeType:'pierce', aiWeight:0.3 }
      ],
      detonators: [
        { id:'focus_fire', display:'Focus Fire', damageType:'kinetic', isDetonator:true, aiWeight:0.4 }
      ],
      nukes: [
        { id:'rifle_burst', display:'Rifle Burst', damageType:'kinetic', aiWeight:0.6 }
      ]
    }
  },
  Outlaws: {
    baseName: 'Outlaw Scrapper',
    baseStats: { hp: 42, shields: 0, speed: 11, damage: 10 },
    pools: {
      primers: [
        { id:'molotov', display:'Molotov', damageType:'thermal', isPrimer:true, primeType:'burn', aiWeight:0.2 }
      ],
      detonators: [
        { id:'kick_it', display:'Kick-It', damageType:'kinetic', isDetonator:true, aiWeight:0.2 }
      ],
      nukes: [
        { id:'rust_blade', display:'Rust Blade', damageType:'kinetic', aiWeight:0.8 }
      ]
    }
  }
} as const;

export const ENEMY_OVERRIDES: EnemyArchetypeOverride[] = [
  // Example: hand-name a story boss and tweak stats/abilities
  {
    key: 'voidborn_boss',
    faction: 'Voidborn',
    tier: 'Boss',
    name: 'The Null Archon',
    baseStats: { hp: 120 }, // in addition to generated
    tags: ['StoryBoss']
  }
];


