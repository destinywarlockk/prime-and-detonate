import React from 'react';
import type { AppState } from '../game/types';

type Props = {
  state: AppState;
  setState: (updater: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => void;
};

export function WelcomeScreen({ state, setState }: Props) {
  const handleMissionSelect = () => {
    setState({ screen: 'missions' });
  };

  const handleQuickBattle = () => {
    setState({ screen: 'party' });
  };

  return (
    <div className="min-h-[100dvh] w-full grid place-items-center bg-slate-950 text-slate-100">
      <div className="flex flex-col items-center gap-6 p-6">
        <div className="text-5xl font-extrabold tracking-widest">Prime</div>
        <div className="opacity-70">Tactical Prime and Detonate</div>
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button 
            id="welcome-missions" 
            className="big"
            onClick={handleMissionSelect}
          >
            Mission Select
          </button>
          <button 
            id="welcome-battle" 
            className="big ghost"
            onClick={handleQuickBattle}
          >
            Battle
          </button>
        </div>
      </div>
    </div>
  );
}
