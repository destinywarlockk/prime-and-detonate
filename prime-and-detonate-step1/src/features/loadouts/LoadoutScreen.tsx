/*
README: LoadoutScreen state shape and integration

This mobile-first screen manages a small local reducer store with:
- state: { currentCharacterIndex, characters[], abilities[] }
- actions: nextCharacter(), prevCharacter(), selectCharacter(index), addAbility(id), removeAbility(id), clearLoadout(characterId)

By default it boots with mock data from mockData.ts. In your real app, provide real data by
passing props to replace the initial characters/abilities, or fork this to wire into your global store/router.
TailwindCSS classes are used throughout; ensure Tailwind is configured in your project.
*/

import React from "react";
import { AbilityCard } from "./components/AbilityCard";
import type { Ability, Character, LoadoutsState } from "./types";
import { weaponSummary } from "./types";
import { getCurrentCharacter, getRemainingSlots, getAvailableAbilitiesForCharacter, isAbilitySelected } from "./types";
import { useLoadoutsStore } from "./state";
import { MOCK_ABILITIES, MOCK_CHARACTERS, MOCK_WEAPONS } from "./mockData";
import VanguardIcon from "../../../assets/images/Vanguard.png";
import TechnomancerIcon from "../../../assets/images/Technomancer.png";
import PyromancerIcon from "../../../assets/images/Pyromancer.png";
import VoidrunnerIcon from "../../../assets/images/Voidrunner.png";

type Props = {
  initialCharacters?: Character[];
  initialAbilities?: Ability[];
  initialWeapons?: import("./types").Weapon[];
  initialSelectedWeaponByCharacterId?: Record<string, string | undefined>;
  onDone?: (state: LoadoutsState) => void;
  onBack?: () => void;
};

type Toast = { id: number; text: string };

export const LoadoutScreen: React.FC<Props> = ({ initialCharacters, initialAbilities, onDone, onBack, initialWeapons, initialSelectedWeaponByCharacterId }) => {
  const initial: LoadoutsState = React.useMemo(
    () => ({
      currentCharacterIndex: 0,
      characters: initialCharacters ?? MOCK_CHARACTERS,
      abilities: initialAbilities ?? MOCK_ABILITIES,
      weapons: initialWeapons ?? MOCK_WEAPONS,
      selectedWeaponByCharacterId: initialSelectedWeaponByCharacterId ?? {},
    }),
    [initialCharacters, initialAbilities, initialWeapons, initialSelectedWeaponByCharacterId]
  );

  const { state, actions } = useLoadoutsStore(initial);

  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const addToast = (text: string) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, text }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 1400);
  };

  const containerRef = React.useRef<HTMLDivElement | null>(null);

  // Debug logging for mobile devices
  React.useEffect(() => {
    console.log('LoadoutScreen mounted');
    console.log('Viewport dimensions:', {
      width: window.innerWidth,
      height: window.innerHeight,
      visualViewport: window.visualViewport ? {
        width: window.visualViewport.width,
        height: window.visualViewport.height,
        scale: window.visualViewport.scale
      } : 'not supported'
    });
    console.log('Safe area insets:', {
      top: getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-top)'),
      bottom: getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-bottom)'),
      left: getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-left)'),
      right: getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-right)')
    });
  }, []);

  const character = getCurrentCharacter(state);
  const remainingSlots = getRemainingSlots(state);
  const abilities = getAvailableAbilitiesForCharacter(state, character);
  const currentWeaponId = state.selectedWeaponByCharacterId[character.id];
  const currentWeapon = state.weapons.find(w => w.id === currentWeaponId);
  // Split abilities into sustain vs offensive for separate sections
  const sustainAbilities = React.useMemo(() => abilities.filter(a => a.abilityType === 'sustain' || (a as any)?.sustain === true), [abilities]);
  const offensiveAbilities = React.useMemo(() => abilities.filter(a => !(a.abilityType === 'sustain' || (a as any)?.sustain === true)), [abilities]);
  const nonSustainSelectedCount = React.useMemo(() => character.selectedAbilityIds
    .map(id => state.abilities.find(a => a.id === id))
    .filter(a => a && !(a.abilityType === 'sustain' || (a as any)?.sustain === true)).length, [character.selectedAbilityIds, state.abilities]);
  const equippedBy: Record<string, string> = (() => {
    const map: Record<string, string> = {};
    for (const c of state.characters) {
      const wid = state.selectedWeaponByCharacterId[c.id];
      if (wid) map[wid] = c.name;
    }
    return map;
  })();
  const hasSustainSelected = React.useMemo(() => {
    return character.selectedAbilityIds
      .map(id => state.abilities.find(a => a.id === id))
      .some(a => a?.abilityType === 'sustain' || (a as any)?.sustain === true);
  }, [character.selectedAbilityIds, state.abilities]);

  // Preset helpers
  // Suggested build based on our recommended per-class loadouts
  function computeSuggestedIdsForCurrent(): string[] {
    const max = character.maxSlots;
    const availableIdSet = new Set(state.abilities.map(a => a.id));
    const pick = (ids: string[]) => ids.filter(id => availableIdSet.has(id)).slice(0, max);
    switch (character.className) {
      case 'vanguard': {
        // Nova: Rail Shot, Overwatch, Suppressive Burst, Shatter Round
        return pick(['rail-shot', 'overwatch', 'suppressive-burst', 'shatter-round', 'coordinated-strike', 'detonator-strike']);
      }
      case 'technician': {
        // Volt: Arc Surge, Capacitor Overload, Disruptor Pulse, Chain Discharge
        return pick(['arc-surge', 'capacitor-overload', 'disruptor-pulse', 'chain-discharge']);
      }
      case 'mage': {
        // Ember: Thermal Lance, Meltdown Strike, Incendiary Sweep, Cryo Grenade
        return pick(['thermal-lance', 'meltdown-strike', 'incendiary-sweep', 'cryo-grenade', 'thermal-burst', 'thermal-bomb']);
      }
      case 'infiltrator': {
        // Shade: Void Suppression, Singularity Spike, Gravity Collapse, Void Lance
        return pick(['void-suppression', 'singularity-spike', 'gravity-collapse', 'void-lance']);
      }
      default:
        return [];
    }
  }

  function applySuggested() {
    const ids = computeSuggestedIdsForCurrent();
    if (ids.length > 0) {
      actions.applyPreset(ids);
      addToast('Suggested preset applied');
    } else {
      addToast('No suggested abilities available');
    }
  }
  function byNumberDesc(a: number | undefined, b: number | undefined): number {
    const av = typeof a === 'number' ? a : -Infinity;
    const bv = typeof b === 'number' ? b : -Infinity;
    return bv - av;
  }

  type PresetKind = "Balanced" | "Offensive" | "Control" | "AoE" | "Burst" | "Self-sufficient";

  function computePresetIds(kind: PresetKind): string[] {
    const max = character.maxSlots;
    const primes = abilities.filter(a => a.abilityType === 'prime').sort((x,y) => byNumberDesc(x.splashPct, y.splashPct) || byNumberDesc(x.damage, y.damage));
    const detonators = abilities.filter(a => a.abilityType === 'detonator').sort((x,y) => byNumberDesc(x.damage, y.damage) || byNumberDesc(x.splashPct, y.splashPct));
    const aoe = abilities.slice().sort((x,y) => byNumberDesc(x.splashPct, y.splashPct) || byNumberDesc(x.damage, y.damage));
    const highDmg = abilities.slice().sort((x,y) => byNumberDesc(x.damage, y.damage) || byNumberDesc(x.splashPct, y.splashPct));

    const pick = (...lists: string[][]) => {
      const ids: string[] = [];
      for (const list of lists) {
        for (const id of list) {
          if (ids.length >= max) break;
          if (!ids.includes(id)) ids.push(id);
        }
        if (ids.length >= max) break;
      }
      if (ids.length < max) {
        for (const a of highDmg) {
          if (ids.length >= max) break;
          if (!ids.includes(a.id)) ids.push(a.id);
        }
      }
      return ids;
    };

    switch (kind) {
      case "Balanced": {
        const primeTop = primes.slice(0, 1).map(a => a.id);
        const detTop = detonators.slice(0, 1).map(a => a.id);
        return pick(primeTop, detTop);
      }
      case "Offensive": {
        const det = detonators.slice(0, max).map(a => a.id);
        const prime = primes.slice(0, max).map(a => a.id);
        return pick(det, prime);
      }
      case "Control": {
        const primeAoE = primes.slice(0, max).map(a => a.id);
        const rest = aoe.slice(0, max).map(a => a.id);
        return pick(primeAoE, rest);
      }
      case "AoE": {
        const ids = aoe.slice(0, max).map(a => a.id);
        return pick(ids);
      }
      case "Burst": {
        const det = detonators.slice(0, max).map(a => a.id);
        const dmg = highDmg.slice(0, max).map(a => a.id);
        return pick(det, dmg);
      }
      case "Self-sufficient": {
        const primeTop = primes.slice(0, 1).map(a => a.id);
        const detTop = detonators.slice(0, 1).map(a => a.id);
        return pick(primeTop, detTop);
      }
    }
  }

  function applyPreset(kind: PresetKind) {
    const ids = computePresetIds(kind);
    actions.applyPreset(ids);
    addToast(`${kind} preset applied`);
  }

  function handleAdd(abilityId: string) {
    console.log('handleAdd called with:', abilityId);
    console.log('Current state before add:', {
      remainingSlots,
      selectedCount: character.selectedAbilityIds.length,
      maxSlots: character.maxSlots
    });
    
    if (remainingSlots <= 0) {
      console.log('handleAdd blocked: no remaining slots');
      return;
    }
    
    actions.addAbility(abilityId);
    const a = state.abilities.find((x) => x.id === abilityId);
    addToast(`${a?.name ?? "Ability"} added`);
    
    console.log('handleAdd completed successfully');
  }

  function handleRemove(abilityId: string) {
    actions.removeAbility(abilityId);
    const a = state.abilities.find((x) => x.id === abilityId);
    addToast(`${a?.name ?? "Ability"} removed`);
  }

  const headerSlots = Array.from({ length: character.maxSlots }, (_, i) => i < character.selectedAbilityIds.length);

  function getClassIconAndLabel(cls: Character["className"]) {
    switch (cls) {
      case "vanguard":
        return { icon: VanguardIcon, label: "Vanguard" };
      case "technician":
        return { icon: TechnomancerIcon, label: "Technician" };
      case "mage":
        return { icon: PyromancerIcon, label: "Mage" };
      case "infiltrator":
        return { icon: VoidrunnerIcon, label: "Infiltrator" };
    }
  }

  return (
    <div className="loadout-screen" style={{ 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      width: '100vw',
      maxWidth: '100vw',
      overflow: 'hidden',
      paddingLeft: 'max(12px, env(safe-area-inset-left))',
      paddingRight: 'max(12px, env(safe-area-inset-right))',
      paddingTop: 'max(12px, env(safe-area-inset-top))',
      paddingBottom: 'env(safe-area-inset-bottom)',
      boxSizing: 'border-box',
      position: 'relative'
    }}>

      {/* Scrollable Content Area */}
      <div 
        ref={containerRef} 
        className="loadout-content" 
        style={{ 
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          width: '100%',
          paddingBottom: '180px', // Ensure footer doesn't overlap content
          boxSizing: 'border-box',
          WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
          scrollBehavior: 'smooth'
        }}
      >
        {/* Weapons Section */}
        <div className="section" style={{ marginBottom: 20 }}>
          <div className="loadout-sub" style={{ marginBottom: 10, fontSize: '15px', fontWeight: 600, color: '#e2e8f0' }}>
            Weapon {currentWeapon ? `— ${currentWeapon.name}` : '(none)'}
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', 
            gap: 8,
            padding: '0 2px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            {state.weapons.map(w => {
              const heldBy = equippedBy[w.id];
              const isMine = currentWeaponId === w.id;
              const disabled = !!heldBy && !isMine && w.id !== 'none';
              return (
                <button
                  key={w.id}
                  className={`ability ${isMine ? 'is-selected' : ''}`}
                  onClick={() => {
                    actions.equipWeapon(isMine ? undefined : w.id);
                    addToast(isMine ? 'Weapon unequipped' : `Equipped ${w.name}`);
                  }}
                  disabled={disabled}
                  title={disabled ? `Equipped by ${heldBy}` : weaponSummary(w)}
                  aria-label={disabled ? `Equipped by ${heldBy}` : `Equip ${w.name}`}
                  style={{
                    minHeight: '52px',
                    padding: '10px',
                    fontSize: '13px',
                    touchAction: 'manipulation',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  <div className="ability-header" style={{ marginBottom: 4 }}>
                    <span className="ability-name" style={{ fontSize: '13px', fontWeight: 600 }}>{w.name}</span>
                    {w.basicType && (
                      <span 
                        className="weapon-element-badge"
                        style={{
                          display: 'inline-block',
                          marginLeft: '8px',
                          padding: '2px 6px',
                          fontSize: '10px',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          borderRadius: '4px',
                          border: '1px solid',
                          ...(w.basicType === 'kinetic' ? {
                            background: 'rgba(148, 163, 184, 0.8)',
                            color: '#1e293b',
                            borderColor: 'rgba(148, 163, 184, 0.6)'
                          } : w.basicType === 'arc' ? {
                            background: 'rgba(56, 189, 248, 0.8)',
                            color: '#0c4a6e',
                            borderColor: 'rgba(56, 189, 248, 0.6)'
                          } : w.basicType === 'thermal' ? {
                            background: 'rgba(239, 68, 68, 0.8)',
                            color: '#7f1d1d',
                            borderColor: 'rgba(239, 68, 68, 0.6)'
                          } : w.basicType === 'void' ? {
                            background: 'rgba(168, 85, 247, 0.8)',
                            color: '#581c87',
                            borderColor: 'rgba(168, 85, 247, 0.6)'
                          } : {})
                        }}
                      >
                        {w.basicType}
                      </span>
                    )}
                  </div>
                  <div className="ability-effect" style={{ fontSize: '11px', lineHeight: 1.3 }}>
                    {heldBy && !isMine && w.id !== 'none' ? `Equipped by ${heldBy}` : weaponSummary(w)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sustain Abilities Section */}
        <div className="section" style={{ marginBottom: 20 }}>
          <div className="loadout-sub" style={{ marginBottom: 10, fontSize: '15px', fontWeight: 600, color: '#e2e8f0' }}>
            Sustain (1 slot) - Selected: {character.selectedAbilityIds.filter(id => {
              const ability = state.abilities.find(a => a.id === id);
              return ability?.abilityType === 'sustain' || (ability as any)?.sustain === true;
            }).length}/1
          </div>
          <div className="ability-list" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px', 
            width: '100%', 
            boxSizing: 'border-box' 
          }}>
            {sustainAbilities.map((a) => {
              const added = isAbilitySelected(character, a.id);
              const isSustain = true;
              const disabledBySlots = !added && remainingSlots <= 0;
              const disabledBySustain = !added && isSustain && hasSustainSelected;
              
              return (
                <AbilityCard
                  key={a.id}
                  ability={a}
                  isAdded={added}
                  isDisabled={disabledBySlots || disabledBySustain}
                  disabledReason={disabledBySustain ? 'sustain' : (disabledBySlots ? 'slots' : undefined)}
                  onAdd={() => handleAdd(a.id)}
                  onRemove={() => handleRemove(a.id)}
                />
              );
            })}
          </div>
        </div>

        {/* Offensive Abilities Section */}
        <div className="section">
          <div className="loadout-sub" style={{ marginBottom: 10, fontSize: '15px', fontWeight: 600, color: '#e2e8f0' }}>Offense (4 slots)</div>
          <div className="ability-list" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px', 
            width: '100%', 
            boxSizing: 'border-box' 
          }}>
            {offensiveAbilities.map((a) => {
              const added = isAbilitySelected(character, a.id);
              const disabledBySlots = !added && remainingSlots <= 0;
              const disabledByOffenseCap = !added && nonSustainSelectedCount >= 4;
              
              // Temporary debugging for button states
              if (!added) {
                console.log(`Button ${a.name}:`, {
                  remainingSlots,
                  nonSustainSelectedCount,
                  disabledBySlots,
                  disabledByOffenseCap,
                  finalDisabled: disabledBySlots || disabledByOffenseCap
                });
              }
              
              return (
                <AbilityCard
                  key={a.id}
                  ability={a}
                  isAdded={added}
                  isDisabled={disabledBySlots || disabledByOffenseCap}
                  disabledReason={disabledByOffenseCap ? 'offense-cap' : (disabledBySlots ? 'slots' : undefined)}
                  onAdd={() => handleAdd(a.id)}
                  onRemove={() => handleRemove(a.id)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Fixed Action Footer */}
      <div className="action-footer" style={{ 
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: '#0b0f1a',
        borderTop: '3px solid #3b82f6',
        padding: '16px max(12px, env(safe-area-inset-left)) 16px max(12px, env(safe-area-inset-right))',
        paddingBottom: 'max(16px, calc(16px + env(safe-area-inset-bottom)))',
        boxSizing: 'border-box',
        minHeight: '150px',
        width: '100vw',
        maxWidth: '100vw',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.8)'
      }}>
        {/* Debug indicator - remove in production */}
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          height: '4px', 
          background: '#ef4444',
          zIndex: 10000
        }}></div>
        
        {/* Row 1: Character Info and Clear Button */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          gap: 12, 
          marginBottom: 16 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
            {(() => { const meta = getClassIconAndLabel(character.className); return (
              <>
                <img className="class-icon" src={meta.icon} alt={meta.label} style={{ 
                  width: 44, 
                  height: 44, 
                  borderRadius: 12, 
                  flexShrink: 0,
                  border: '2px solid #1f2a3a'
                }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0, flex: 1 }}>
                  <span className="character-name" style={{ 
                    fontSize: '16px', 
                    fontWeight: 800, 
                    whiteSpace: 'nowrap', 
                    textOverflow: 'ellipsis', 
                    overflow: 'hidden', 
                    color: '#f8fafc'
                  }}>{character.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="equipped-label" style={{ fontSize: '12px', color: '#94a3b8' }}>Equipped</span>
                    <span className="footer-count" style={{ fontSize: '14px', fontWeight: 700, color: '#3b82f6' }}>{character.selectedAbilityIds.length}/{character.maxSlots}</span>
                  </div>
                </div>
              </>
            ); })()}
          </div>
          <button 
            className="btn btn--ghost" 
            style={{ 
              minHeight: 44, 
              fontSize: '13px', 
              fontWeight: 600,
              padding: '10px 16px',
              touchAction: 'manipulation',
              flexShrink: 0
            }} 
            onClick={() => actions.clearLoadout(character.id)} 
            aria-label="Clear loadout"
          >
            Clear
          </button>
        </div>

        {/* Row 2: Navigation and Action Buttons */}
        <div className="footer-actions" style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr 1.3fr', 
          gap: 10, 
          alignItems: 'stretch', 
          width: '100%' 
        }}>
          <button 
            className="btn btn--ghost back-btn" 
            title="Back" 
            style={{ 
              width: '100%', 
              minHeight: 48, 
              fontSize: '14px', 
              fontWeight: 600,
              touchAction: 'manipulation'
            }} 
            onClick={onBack}
          >
            Escape
          </button>
          <button 
            className="btn btn--ghost" 
            style={{ 
              width: '100%', 
              minHeight: 48, 
              fontSize: '20px', 
              fontWeight: 700,
              touchAction: 'manipulation'
            }} 
            onClick={actions.prevCharacter} 
            aria-label="Previous character"
          >
            ‹
          </button>
          <button 
            className="btn btn--ghost" 
            style={{ 
              width: '100%', 
              minHeight: 48, 
              fontSize: '20px', 
              fontWeight: 700,
              touchAction: 'manipulation'
            }} 
            onClick={actions.nextCharacter} 
            aria-label="Next character"
          >
            ›
          </button>
          <button 
            className="btn btn--primary" 
            style={{ 
              width: '100%', 
              minHeight: 48, 
              fontSize: '14px', 
              fontWeight: 700,
              touchAction: 'manipulation'
            }} 
            onClick={() => onDone ? onDone(state) : undefined}
          >
            Use
          </button>
        </div>
      </div>

      {/* Toasts positioned above the footer */}
      <div
        style={{
          position: 'fixed',
          left: 'max(12px, env(safe-area-inset-left))',
          right: 'max(12px, env(safe-area-inset-right))',
          bottom: 'calc(180px + env(safe-area-inset-bottom))',
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 100,
        }}
      >
        <div style={{ pointerEvents: 'auto', display: 'grid', gap: 8 }}>
          {toasts.map((t) => (
            <div key={t.id} className="preview" role="status" aria-live="polite">{t.text}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadoutScreen;


