import React from 'react';
import type { AppState } from '../game/types';

type Props = {
  state: AppState;
  setState: (updater: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => void;
};

export function PartyScreen({ state, setState }: Props) {
  const handleContinueToLoadout = () => {
    setState({ screen: 'loadout' });
  };

  const handleGoToMissions = () => {
    setState({ screen: 'missions' });
  };

  return (
    <div className="min-h-[100dvh] w-full bg-slate-950 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Party Selection</h1>
        <div className="text-center">
          <p className="text-slate-400 mb-4">Party selection screen - React version coming soon!</p>
          <div className="flex gap-4 justify-center">
            <button 
              className="big"
              onClick={handleContinueToLoadout}
            >
              Continue to Loadout
            </button>
            <button 
              className="big ghost"
              onClick={handleGoToMissions}
            >
              Back to Missions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
