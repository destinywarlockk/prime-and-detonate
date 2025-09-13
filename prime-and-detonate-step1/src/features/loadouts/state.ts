import React from "react";
import type { LoadoutsAction, LoadoutsState } from "./types";

export function loadoutsReducer(state: LoadoutsState, action: LoadoutsAction): LoadoutsState {
  switch (action.type) {
    case "equipWeapon": {
      const idx = state.currentCharacterIndex;
      const curChar = state.characters[idx];
      const map = { ...state.selectedWeaponByCharacterId };
      const wid = action.weaponId;
      // Unique for real weapons; allow multiple 'none'/undefined
      if (wid && wid !== 'none') {
        for (const [cid, held] of Object.entries(map)) {
          if (held === wid) map[cid] = undefined;
        }
      }
      map[curChar.id] = wid;
      return { ...state, selectedWeaponByCharacterId: map };
    }
    case "nextCharacter": {
      const next = (state.currentCharacterIndex + 1) % state.characters.length;
      return { ...state, currentCharacterIndex: next };
    }
    case "prevCharacter": {
      const prev = (state.currentCharacterIndex - 1 + state.characters.length) % state.characters.length;
      return { ...state, currentCharacterIndex: prev };
    }
    case "selectCharacter": {
      const index = Math.max(0, Math.min(action.index, state.characters.length - 1));
      return { ...state, currentCharacterIndex: index };
    }
    case "addAbility": {
      const { abilityId } = action;
      const idx = state.currentCharacterIndex;
      const ability = state.abilities.find((a) => a.id === abilityId);
      const characters = state.characters.map((c, i) => {
        if (i !== idx) return c;
        if (!ability) return c;
        // Enforce class restriction if present on the ability
        if (ability.allowedClasses && ability.allowedClasses.length > 0 && !ability.allowedClasses.includes(c.className)) {
          return c;
        }
        if (c.selectedAbilityIds.includes(abilityId)) return c; // no dups
        if (c.selectedAbilityIds.length >= c.maxSlots) return c; // respect character's max slots
        // Enforce only one sustain overall
        const hasSustainSelected = c.selectedAbilityIds
          .map(id => state.abilities.find(a => a.id === id))
          .some(a => a?.abilityType === 'sustain' || (a as any)?.sustain === true);
        const isIncomingSustain = ability.abilityType === 'sustain' || (ability as any)?.sustain === true;
        if (isIncomingSustain && hasSustainSelected) return c;
        // Enforce at most four non-sustain abilities (4 offensive slots)
        const nonSustainCount = c.selectedAbilityIds
          .map(id => state.abilities.find(a => a.id === id))
          .filter(a => a && !(a.abilityType === 'sustain' || (a as any)?.sustain === true)).length;
        const isIncomingNonSustain = !isIncomingSustain;
        if (isIncomingNonSustain && nonSustainCount >= 4) return c;
        return { ...c, selectedAbilityIds: [...c.selectedAbilityIds, abilityId] };
      });
      return { ...state, characters };
    }
    case "removeAbility": {
      const { abilityId } = action;
      const idx = state.currentCharacterIndex;
      const characters = state.characters.map((c, i) => {
        if (i !== idx) return c;
        if (!c.selectedAbilityIds.includes(abilityId)) return c;
        return { ...c, selectedAbilityIds: c.selectedAbilityIds.filter((id) => id !== abilityId) };
      });
      return { ...state, characters };
    }
    case "clearLoadout": {
      const { characterId } = action;
      const characters = state.characters.map((c) => (c.id === characterId ? { ...c, selectedAbilityIds: [] } : c));
      return { ...state, characters };
    }
    case "applyPreset": {
      const idx = state.currentCharacterIndex;
      const characters = state.characters.map((c, i) => {
        if (i !== idx) return c;
        const max = c.maxSlots; // Use character's actual max slots
        const unique = Array.from(new Set(action.abilityIds));
        // Keep at most one sustain
        const result: string[] = [];
        let sustainAdded = false;
        let nonSustainCount = 0;
        for (const id of unique) {
          if (result.length >= max) break;
          const ability = state.abilities.find(a => a.id === id);
          if (!ability) continue;
          const isSustain = ability.abilityType === 'sustain' || (ability as any)?.sustain === true;
          if (isSustain) {
            if (sustainAdded) continue;
            sustainAdded = true;
            result.push(id);
          } else {
            if (nonSustainCount >= 4) continue; // Allow up to 4 offensive abilities
            nonSustainCount++;
            result.push(id);
          }
        }
        return { ...c, selectedAbilityIds: result };
      });
      return { ...state, characters };
    }
    default:
      return state;
  }
}

export function useLoadoutsStore(initial: LoadoutsState) {
  const [state, dispatch] = React.useReducer(loadoutsReducer, initial);

  const actions = React.useMemo(
    () => ({
      nextCharacter: () => dispatch({ type: "nextCharacter" }),
      prevCharacter: () => dispatch({ type: "prevCharacter" }),
      selectCharacter: (index: number) => dispatch({ type: "selectCharacter", index }),
      addAbility: (abilityId: string) => dispatch({ type: "addAbility", abilityId }),
      removeAbility: (abilityId: string) => dispatch({ type: "removeAbility", abilityId }),
      clearLoadout: (characterId: string) => dispatch({ type: "clearLoadout", characterId }),
      applyPreset: (abilityIds: string[]) => dispatch({ type: "applyPreset", abilityIds }),
      equipWeapon: (weaponId: string | undefined) => dispatch({ type: "equipWeapon", weaponId }),
    }),
    []
  );

  return { state, actions } as const;
}


