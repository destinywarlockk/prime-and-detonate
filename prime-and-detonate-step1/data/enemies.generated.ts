import { buildFactionArchetypes } from '../engine/combat/tierFactory';
import { FACTION_BASES, ENEMY_OVERRIDES } from './enemies.custom';

export const GENERATED_ENEMIES = [
  ...buildFactionArchetypes('Voidborn', FACTION_BASES.Voidborn, ENEMY_OVERRIDES),
  ...buildFactionArchetypes('Syndicate', FACTION_BASES.Syndicate, ENEMY_OVERRIDES),
  ...buildFactionArchetypes('Accord',   FACTION_BASES.Accord,   ENEMY_OVERRIDES),
  ...buildFactionArchetypes('Outlaws',  FACTION_BASES.Outlaws,  ENEMY_OVERRIDES)
];


