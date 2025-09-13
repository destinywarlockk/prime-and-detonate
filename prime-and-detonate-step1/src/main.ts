// Prime & Detonate - Deployed via GitHub Actions
import { createStore } from './state/store';
import { loadPersistedLoadout, persistLoadout, loadPersistedMissions, persistMissions } from './state/persist';
import { mountApp } from './ui/app';
import { ALL_ABILITIES } from './content/abilities';
import { ALL_WEAPONS } from './content/weapons';
import { CHARACTER_ROSTER } from './content/characters';
import type { AppState, LoadoutState, BattleState, Weapon } from './game/types';
import { missionNeonMarket } from './content/missions';

// Merge persisted weapon data with current weapon definitions to ensure all properties are up-to-date
function mergeWeaponData(persistedWeapons: Weapon[], currentWeapons: Weapon[]): Weapon[] {
  const currentWeaponMap = new Map(currentWeapons.map(w => [w.id, w]));
  
  return persistedWeapons.map(persistedWeapon => {
    const currentWeapon = currentWeaponMap.get(persistedWeapon.id);
    if (currentWeapon) {
      // Merge persisted data with current definition, keeping persisted values but adding missing properties
      return { ...currentWeapon, ...persistedWeapon };
    }
    return persistedWeapon;
  });
}

const persisted = loadPersistedLoadout(CHARACTER_ROSTER, ALL_ABILITIES);

const params = new URLSearchParams(window.location.search);
const initialScreen = (params.get('screen') as AppState['screen']) || 'welcome';

const initial: AppState = {
  screen: initialScreen,
  loadout: {
    roster: CHARACTER_ROSTER,
    partySelection: persisted?.partySelection ?? [],
    maxParty: 3,
    allAbilities: ALL_ABILITIES,
    selectedByChar: persisted?.selectedByChar ?? {},
    loadoutActiveIndex: persisted?.loadoutActiveIndex ?? 0,
    allWeapons: mergeWeaponData(persisted?.allWeapons ?? ALL_WEAPONS, ALL_WEAPONS),
    selectedWeaponByChar: persisted?.selectedWeaponByChar ?? {},
  },
  battle: {
    party: [],
    enemies: [],
    targetIndex: 0,
    turn: 'player',
    activePartyIndex: 0,
    selectedAbilityId: undefined,
    log: ['Ready to battle.'],
    isOver: false,
    currentMission: undefined,
    partyMembersActedThisRound: 0,
  }
};

// Initialize missions after constructing initial object to satisfy type extension
const persistedMissions = loadPersistedMissions();
initial.mission = persistedMissions ?? { completed: {}, current: missionNeonMarket };

const store = createStore<AppState>(initial);

const app = document.getElementById('app')!;
mountApp(app, store.getState, store.setState, store.subscribe);

// Persist loadout changes
store.subscribe((state) => {
  try { persistLoadout(state.loadout); } catch {}
  try { if (state.mission) persistMissions(state.mission); } catch {}
});
