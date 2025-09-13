import React from 'react';
import type { AppState, Mission, MissionProgress } from '../game/types';
import { missionNeonMarket, missionNovaBoldness, missionVoltAdaptability, missionEmberSelfControl, missionShadeEmpathy, missionNovaBoldnessExtended, missionVoltAdaptabilityExtended, missionShadeEmpathyExtended, missionNovaAltruismExtended, missionJusticeRunsColdExtended } from '../content/missions';
import VanguardIcon from '../../assets/images/Vanguard.png';
import TechnomancerIcon from '../../assets/images/Technomancer.png';
import PyromancerIcon from '../../assets/images/Pyromancer.png';
import VoidrunnerIcon from '../../assets/images/Voidrunner.png';

const AVAILABLE_MISSIONS: Mission[] = [
  missionNeonMarket,
  missionEmberSelfControl,
  // Extended missions (longer versions)
  missionNovaBoldnessExtended,
  missionNovaAltruismExtended,
  missionVoltAdaptabilityExtended,
  missionShadeEmpathyExtended,
  missionJusticeRunsColdExtended,
];

type Props = {
  state: AppState;
  setState: (updater: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => void;
};

export function MissionsScreen({ state, setState }: Props) {
  const getMainCharacterIcon = (m: Mission): { url: string; label: string } | undefined => {
    const id = (m.id || '').toLowerCase();
    const name = (m.name || '').toLowerCase();
    if (id.includes('nova') || name.includes('nova') || id === 'scrap-hesitation') return { url: VanguardIcon, label: 'Nova' };
    if (id.includes('volt') || name.includes('volt')) return { url: TechnomancerIcon, label: 'Volt' };
    if (id.includes('ember') || name.includes('ember')) return { url: PyromancerIcon, label: 'Ember' };
    if (id.includes('shade') || name.includes('shade') || id === 'justice_runs_cold') return { url: VoidrunnerIcon, label: 'Shade' };
    return undefined;
  };

  const handleBack = () => {
    setState({ screen: 'welcome' });
  };

  const handleSelectMission = (mission: Mission) => {
    setState(state => ({
      mission: {
        ...state.mission!,
        current: mission
      },
      screen: 'party'
    }));
  };

  const renderMissionCard = (m: Mission) => {
    const progress = state.mission!;
    const best = progress.completed?.[m.id]?.bestStars ?? 0;
    const stars = '★'.repeat(best) + '☆'.repeat(3 - best);
    const icon = getMainCharacterIcon(m);

    return (
      <div key={m.id} className="char-card mission-card">
        {icon && (
          <div className="char-icon">
            <img src={icon.url} alt={icon.label} />
          </div>
        )}
        <div className="char-left mission-left">
          <div className="char-name mission-name">{m.name}</div>
          {icon && <div className="mission-meta">{icon.label}</div>}
          <div className="loadout-sub">{stars}</div>
        </div>
        <div className="card-cta" style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
          <button 
            className="pick-btn" 
            onClick={() => handleSelectMission(m)}
          >
            Start
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>
        {`
          .mission-name { 
            white-space: normal !important; 
            overflow: visible !important; 
            text-overflow: unset !important; 
            word-wrap: break-word;
            line-height: 1.2;
          }
          .mission-card { 
            min-height: auto !important;
            align-items: flex-start !important;
            padding: 16px !important;
          }
          .mission-left { 
            min-width: 0 !important; 
            max-width: none !important;
            flex: 1;
          }
          .mission-meta {
            font-size: 12px;
            opacity: 0.8;
            margin-top: 2px;
          }
        `}
      </style>
      <div className="mx-auto h-[100dvh] max-w-[420px] bg-slate-950 text-slate-100 grid grid-rows-[auto_1fr_auto]" style={{overflowX: 'hidden'}}>
        <header className="h-10 flex items-center justify-between px-3 border-b border-white/10">
          <button className="ghost" onClick={handleBack}>Back</button>
          <div className="text-sm font-semibold">Select Mission</div>
          <div style={{width: '48px'}}></div>
        </header>
        <main className="overflow-y-auto">
          <div className="px-3 pt-3 pb-20">
            <div className="card-grid" style={{gridTemplateColumns: '1fr'}}>
              {AVAILABLE_MISSIONS.map(renderMissionCard)}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
