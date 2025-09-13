export type DamageType = 'kinetic' | 'arc' | 'thermal' | 'void';
export type PrimeType = 'weakpoint' | 'overload' | 'burn' | 'suppress' | 'freeze' | 'pierce';

export type ResistVuln = Partial<Record<DamageType, number>>;

export interface PrimeMods {
  applyChanceBonus?: Partial<Record<PrimeType, number>>; // additive % points
  durationMod?: Partial<Record<PrimeType, number>>; // multiplier
}

export interface FactionConfig {
  id: 'Voidborn' | 'Syndicate' | 'Accord' | 'Outlaws';
  hpMult: number;        // base HP multiplier
  shMult: number;        // base Shields multiplier
  spdMult: number;       // initiative/speed multiplier
  dmgMult: number;       // outgoing damage multiplier
  resistVuln: ResistVuln;
  primeMods?: PrimeMods;
  specials?: {
    regenPerTurn?: number;              // flat HP regen
    counterChance?: number;             // 0..1
    detonationBonus?: number;           // extra % when detonating (Accord)
    swarmAura?: { radius: number; dmgBonus: number }; // Outlaws
    reinforcementChance?: number;       // chance to spawn add
  };
}

export interface EnemyArchetype {
  key: string;                // "voidborn_sentinal"
  name: string;
  faction: FactionConfig['id'];
  role: 'Bruiser' | 'Skirmisher' | 'Artillery' | 'Controller' | 'Minion' | 'Captain';
  baseStats: { hp: number; shields: number; speed: number; damage: number };
  abilities: Array<{
    id: string;
    display: string;
    damageType: DamageType;
    isPrimer?: boolean;
    isDetonator?: boolean;
    primeType?: PrimeType;  // if primer, which prime it applies
    aiWeight?: number;      // default likelihood 0..1
  }>;
  tags?: string[];           // e.g., ["DetonatorFocus","Swarm"]
  lootTableId?: string;
}

// Enemy tiering system
export type EnemyTier = 'Grunt' | 'Elite' | 'Miniboss' | 'Boss';

export interface TierTemplate {
  tier: EnemyTier;
  // core multipliers applied after faction multipliers
  mult: { hp: number; shields: number; speed: number; damage: number };
  // behavior/AI knobs
  ai: {
    actionPoints?: number;           // default 1 (Boss can be 2)
    preferDetonation?: number;       // 0..1 weight boost for detonators
    preferPrimers?: number;          // 0..1 weight boost for primers
    targetDiscipline?: number;       // 0..1 focus-fire tendency
    counterChance?: number;          // additive to faction.specials
    primeResistMod?: number;         // e.g., 0.85 => shorter prime duration on them
  };
  // economy & encounter knobs
  spawnWeight: number;               // relative frequency in random spawns
  lootTier: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  abilitySlots: { primers: number; detonators: number; nukes: number };
  nameFormat: (baseName: string) => string; // naming helper
}

export interface EnemyArchetypeOverride {
  key: string;                         // unique id
  faction: FactionConfig['id'];
  tier: EnemyTier;
  baseStats?: Partial<{ hp: number; shields: number; speed: number; damage: number }>;
  role?: EnemyArchetype['role'];
  name?: string;
  abilities?: EnemyArchetype['abilities'];
  tags?: string[];
}

