export type AbilityType = "prime" | "detonator" | "sustain";

export type DamageType = "kinetic" | "arc" | "thermal" | "void";

export interface Ability {
  id: string;
  name: string;
  abilityType: AbilityType;
  damageType: DamageType;
  damage: number;
  primes?: number;
  detonates?: boolean;
  splashPct?: number;
  synergyHint?: string;
  // Sustain slot eligibility (C slot). If true, ability can be equipped in C.
  sustain?: boolean;
  // Sustain-specific metadata shown in UI
  cooldown?: number;
  superCost?: number;
  statusEffects?: string[];
  effectText?: string; // e.g., "Heal", "Barrier", "Cleanse", "Guard"
  // Optional restriction: if provided, only these classes may equip the ability
  allowedClasses?: CharacterClass[];
}

export type CharacterClass = "vanguard" | "mage" | "technician" | "infiltrator";

export interface Character {
  id: string;
  name: string;
  className: CharacterClass;
  maxSlots: number;
  selectedAbilityIds: string[];
}

export interface LoadoutsState {
  currentCharacterIndex: number;
  characters: Character[];
  abilities: Ability[];
  weapons: Weapon[];
  selectedWeaponByCharacterId: Record<string, string | undefined>;
}

export type LoadoutsAction =
  | { type: "nextCharacter" }
  | { type: "prevCharacter" }
  | { type: "selectCharacter"; index: number }
  | { type: "addAbility"; abilityId: string }
  | { type: "removeAbility"; abilityId: string }
  | { type: "clearLoadout"; characterId: string }
  | { type: "applyPreset"; abilityIds: string[] }
  | { type: "equipWeapon"; weaponId: string | undefined };

export interface Weapon {
  id: string;
  name: string;
  basicMult?: number;
  basicType?: DamageType;
  totalDamageMult?: number;
  detonationDirectMult?: number;
  detonationSplashMult?: number;
  maxHpBonus?: number;
  maxShBonus?: number;
  superGainMult?: number;
}

export function weaponSummary(w: Weapon): string {
  const parts: string[] = [];
  if (w.basicMult) parts.push(`Basic x${w.basicMult.toFixed(2)}${w.basicType ? ` (${w.basicType})` : ''}`);
  if (w.totalDamageMult) parts.push(`Damage x${w.totalDamageMult.toFixed(2)}`);
  if (w.detonationDirectMult || w.detonationSplashMult) {
    const d = w.detonationDirectMult ? `dir x${w.detonationDirectMult.toFixed(2)}` : '';
    const s = w.detonationSplashMult ? `splash x${w.detonationSplashMult.toFixed(2)}` : '';
    parts.push(`Det ${[d,s].filter(Boolean).join(', ')}`);
  }
  if (w.maxHpBonus) parts.push(`HP +${w.maxHpBonus}`);
  if (w.maxShBonus) parts.push(`SH +${w.maxShBonus}`);
  if (w.superGainMult) parts.push(`Super x${w.superGainMult.toFixed(2)}`);
  return parts.join(' · ');
}

export function getCurrentCharacter(state: LoadoutsState): Character {
  const index = Math.max(0, Math.min(state.currentCharacterIndex, state.characters.length - 1));
  return state.characters[index];
}

export function getRemainingSlots(state: LoadoutsState): number {
  const character = getCurrentCharacter(state);
  return Math.max(0, character.maxSlots - character.selectedAbilityIds.length);
}

export function getAvailableAbilitiesForCharacter(state: LoadoutsState, character: Character): Ability[] {
  return state.abilities.filter((a) => {
    // Filter out basic attack abilities since players get them by default
    if (a.id.startsWith('basic-attack-')) return false;
    
    // Filter by class restrictions
    if (!a.allowedClasses || a.allowedClasses.length === 0) return true;
    return a.allowedClasses.includes(character.className);
  });
}

export function isAbilitySelected(character: Character, abilityId: string): boolean {
  return character.selectedAbilityIds.includes(abilityId);
}


