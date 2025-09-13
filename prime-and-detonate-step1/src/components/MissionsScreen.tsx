import React from 'react';
import type { AppState } from '../game/types';

type Props = {
  state: AppState;
  setState: (updater: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => void;
};

export function MissionsScreen({ state, setState }: Props) {
  const handleBackToWelcome = () => {
    setState({ screen: 'welcome' });
  };

  const handleGoToParty = () => {
    setState({ screen: 'party' });
  };

  return (
    <div className="min-h-[100dvh] w-full bg-slate-950 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Missions</h1>
        <div className="text-center">
          <p className="text-slate-400 mb-4">Missions screen - React version coming soon!</p>
          <div className="flex gap-4 justify-center">
            <button 
              className="big"
              onClick={handleGoToParty}
            >
              Start Mission
            </button>
            <button 
              className="big ghost"
              onClick={handleBackToWelcome}
            >
              Back to Welcome
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
