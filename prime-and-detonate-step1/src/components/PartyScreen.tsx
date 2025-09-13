import React from 'react';
import type { AppState, CharacterDef, ClassId } from '../game/types';
import VanguardIcon from '../../assets/images/Vanguard.png';
import TechnomancerIcon from '../../assets/images/Technomancer.png';
import PyromancerIcon from '../../assets/images/Pyromancer.png';
import VoidrunnerIcon from '../../assets/images/Voidrunner.png';

const CLASS_META: Record<ClassId, { label: string; short: string; badge: string; icon: string; description: string; abilities: string[] }> = {
  vanguard: { 
    label: 'Vanguard', 
    short: 'KIN', 
    badge: 'badge-kin', 
    icon: VanguardIcon,
    description: 'Tank with high shield and health. Excels at protecting allies and controlling the battlefield.',
    abilities: ['Shield Bash', 'Guardian Stance', 'Rallying Cry', 'Iron Will']
  },
  technomancer: { 
    label: 'Technomancer', 
    short: 'ARC', 
    badge: 'badge-arc', 
    icon: TechnomancerIcon,
    description: 'Arc damage specialist with crowd control abilities. Manipulates enemies and supports the team.',
    abilities: ['Arc Surge', 'Static Field', 'Chain Lightning', 'Overcharge']
  },
  pyromancer: { 
    label: 'Pyromancer', 
    short: 'THR', 
    badge: 'badge-thr', 
    icon: PyromancerIcon,
    description: 'Thermal damage dealer with area attacks. Burns through enemy defenses and groups.',
    abilities: ['Flame Burst', 'Heat Wave', 'Inferno', 'Thermal Overload']
  },
  voidrunner: { 
    label: 'Voidrunner', 
    short: 'VOID', 
    badge: 'badge-void', 
    icon: VoidrunnerIcon,
    description: 'Void damage assassin with mobility. Strikes from shadows and disrupts enemy plans.',
    abilities: ['Void Strike', 'Shadow Step', 'Dark Pulse', 'Void Rift']
  },
};

type Props = {
  state: AppState;
  setState: (updater: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => void;
};

export function PartyScreen({ state, setState }: Props) {
  const { loadout } = state;
  const { roster, partySelection, maxParty } = loadout;

  const canPickMore = () => partySelection.length < maxParty;
  const isPicked = (defId: string) => partySelection.includes(defId);

  const pick = (defId: string) => {
    const picked = isPicked(defId);
    // Prevent removing locked protagonist
    if (picked && loadout.lockedCharacterId && defId === loadout.lockedCharacterId) {
      return;
    }
    if (picked) {
      const newSelection = partySelection.filter((id: string) => id !== defId);
      const newSelectedByChar = { ...loadout.selectedByChar };
      delete newSelectedByChar[defId];
      setState({ 
        loadout: { 
          ...loadout, 
          partySelection: newSelection, 
          selectedByChar: newSelectedByChar 
        } 
      });
    } else if (canPickMore()) {
      const newSelection = [...partySelection, defId];
      const newSelectedByChar = { 
        ...loadout.selectedByChar, 
        [defId]: loadout.selectedByChar[defId] || [] 
      };
      setState({ 
        loadout: { 
          ...loadout, 
          partySelection: newSelection, 
          selectedByChar: newSelectedByChar 
        } 
      });
    }
  };

  const handleContinueToLoadout = () => {
    if (partySelection.length === maxParty) {
      setState(state => ({
        loadout: { 
          ...state.loadout, 
          loadoutActiveIndex: 0 
        },
        screen: 'loadout'
      }));
    }
  };

  const handleGoToMissions = () => {
    setState({ screen: 'missions' });
  };

  const renderCard = (c: CharacterDef) => {
    const meta = CLASS_META[c.classId];
    const picked = isPicked(c.id);
    const disablePick = !picked && !canPickMore();
    const isLocked = loadout.lockedCharacterId === c.id;

    return (
      <div key={c.id} className={`char-card ${picked ? 'selected' : ''}`}>
        <div className="char-info">
          <div className="char-icon">
            <img src={meta.icon} alt={meta.label} />
          </div>
          <div className="char-name">{c.name}</div>
        </div>
        <div className="char-stats">
          <div className="class-pill">
            <span className="stat">{meta.label}</span>
          </div>
          <div className="stat-row">
            <span className={`stat element-${meta.short.toLowerCase()}`}>{meta.short}</span>
            <span className="stat">SH{c.baseBars.sh}</span>
            <span className="stat">HP{c.baseBars.hp}</span>
          </div>
          <div className="class-description">
            <div className="description-text">{meta.description}</div>
          </div>
        </div>
        <div className="card-cta">
          <button 
            className="pick-btn" 
            onClick={() => pick(c.id)}
            disabled={disablePick || (picked && isLocked)}
          >
            {isLocked ? 'Locked' : (picked ? 'Remove' : 'Add')}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="party-screen mx-auto h-[100dvh] max-w-[100vw] bg-slate-950 text-slate-100 grid grid-rows-[auto_1fr_auto]" style={{overflowX: 'hidden', width: '100vw', maxWidth: '100vw'}}>
      {/* Header */}
      <header className="h-12 flex items-center justify-between px-2 border-b border-white/10">
        <div></div>
        <div className="text-sm font-semibold">Select Your Party</div>
        <div className="text-xs opacity-80">{partySelection.length}/{maxParty}</div>
      </header>

      {/* Scrollable content */}
      <main className="overflow-y-auto" style={{overflowX: 'hidden', marginTop: '5px'}}>
        <div className="px-2 pt-3 pb-20" style={{width: '100%', boxSizing: 'border-box'}}>
          <div className="card-grid" style={{gridTemplateColumns: '1fr', width: '100%', boxSizing: 'border-box', marginTop: '5px'}}>
            {roster.map(renderCard)}
          </div>
        </div>
      </main>

      {/* Footer action bar */}
      <footer className="px-2 pb-[env(safe-area-inset-bottom,12px)] pt-2" style={{width: '100%', boxSizing: 'border-box'}}>
        <div className="sticky-cta" style={{position: 'static', background: 'transparent', border: 0, padding: 0, width: '100%', boxSizing: 'border-box'}}>
          <div className="flex justify-between">
            <button 
              className="btn btn-back text-lg px-4 py-2"
              onClick={handleGoToMissions}
            >
              Back
            </button>
            <div className="progress text-right">
              {partySelection.length} selected • Tap a card to add/remove
            </div>
          </div>
          <button 
            className="primary w-full mt-2" 
            onClick={handleContinueToLoadout}
            disabled={partySelection.length !== maxParty}
          >
            Configure Loadout
          </button>
        </div>
      </footer>
    </div>
  );
}
