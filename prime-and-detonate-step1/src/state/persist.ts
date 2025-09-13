import type { Ability, CharacterDef, LoadoutState, Weapon, MissionProgress } from '../game/types';

const LOADOUT_KEY = 'pd_loadout_v2';

type PersistedLoadout = Pick<
  LoadoutState,
  'partySelection' | 'selectedByChar' | 'loadoutActiveIndex' | 'selectedWeaponByChar'
> & { allWeapons?: Weapon[] };

export function loadPersistedLoadout(
  roster: CharacterDef[],
  allAbilities: Ability[]
): PersistedLoadout | null {
  try {
    const raw = localStorage.getItem(LOADOUT_KEY);
    if (!raw) {
      console.log('📂 No persisted loadout found');
      return null;
    }
    console.log('📂 Loading persisted loadout from:', raw);
    const data = JSON.parse(raw) as Partial<PersistedLoadout>;
    console.log('📊 Parsed loadout data:', data);

    const rosterIds = new Set(roster.map((c) => c.id));
    const abilityIds = new Set(allAbilities.map((a) => a.id));

    const partySelection = Array.isArray(data.partySelection)
      ? data.partySelection.filter((id): id is string => typeof id === 'string' && rosterIds.has(id)).slice(0, 3)
      : [];

    const selectedByChar: Record<string, string[]> = {};
    if (data.selectedByChar && typeof data.selectedByChar === 'object') {
      for (const [defId, arr] of Object.entries(data.selectedByChar)) {
        if (!rosterIds.has(defId)) continue;
        selectedByChar[defId] = Array.isArray(arr)
          ? arr.filter((id): id is string => typeof id === 'string' && abilityIds.has(id))
          : [];
      }
    }
    
    console.log('👥 Loaded selectedByChar:', selectedByChar);
    
    // Apply default loadouts for characters without abilities
    for (const defId of rosterIds) {
      if (!selectedByChar[defId] || selectedByChar[defId].length === 0) {
        const defaultAbilities = getDefaultLoadoutForCharacter(defId);
        if (defaultAbilities.length > 0) {
          selectedByChar[defId] = defaultAbilities.filter(id => abilityIds.has(id));
          console.log(`🎯 Applied default loadout for ${defId}:`, selectedByChar[defId]);
        }
      }
    }

    const loadoutActiveIndex = typeof data.loadoutActiveIndex === 'number' ? data.loadoutActiveIndex : 0;
    const selectedWeaponByChar = ((): Record<string, string | undefined> => {
      const map: Record<string, string | undefined> = {};
      if (data.selectedWeaponByChar && typeof data.selectedWeaponByChar === 'object') {
        for (const [defId, wid] of Object.entries(data.selectedWeaponByChar as any)) {
          if (!rosterIds.has(defId)) continue;
          if (typeof wid === 'string') map[defId] = wid;
        }
      }
      return map;
    })();
    const allWeapons = Array.isArray((data as any).allWeapons) ? (data as any).allWeapons as Weapon[] : undefined;

    const result = { partySelection, selectedByChar, loadoutActiveIndex, selectedWeaponByChar, allWeapons };
    console.log('✅ Final loaded loadout:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to load persisted loadout:', error);
    return null;
  }
}

// Function to provide default loadouts for characters
export function getDefaultLoadoutForCharacter(characterId: string): string[] {
  const defaultLoadouts: Record<string, string[]> = {
    'nova': ['basic-attack-kinetic', 'nova_aoe_suppressive_barrage'],
    'volt': ['basic-attack-arc', 'volt_aoe_static_surge'],
    'ember': ['basic-attack-thermal', 'ember_aoe_emberwave'],
    'shade': ['basic-attack-void', 'shade_aoe_entropy_collapse']
  };
  
  return defaultLoadouts[characterId] || [];
}

export function persistLoadout(loadout: LoadoutState) {
  try {
    const data: PersistedLoadout = {
      partySelection: loadout.partySelection,
      selectedByChar: loadout.selectedByChar,
      loadoutActiveIndex: loadout.loadoutActiveIndex,
      selectedWeaponByChar: loadout.selectedWeaponByChar,
      allWeapons: loadout.allWeapons,
    };
    console.log('💾 Persisting loadout:', data);
    localStorage.setItem(LOADOUT_KEY, JSON.stringify(data));
    console.log('✅ Loadout persisted successfully');
  } catch (error) {
    console.error('❌ Failed to persist loadout:', error);
  }
}

// --- Mission persistence ---
const MISSIONS_KEY = 'pd_missions_v1';

export function loadPersistedMissions(): MissionProgress | null {
  try {
    const raw = localStorage.getItem(MISSIONS_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    const completed = (data?.completed && typeof data.completed === 'object') ? (data.completed as MissionProgress['completed']) : {};
    return { completed, current: null };
  } catch {
    return null;
  }
}

export function persistMissions(mp: MissionProgress) {
  try {
    const data = { completed: mp.completed };
    localStorage.setItem(MISSIONS_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}


