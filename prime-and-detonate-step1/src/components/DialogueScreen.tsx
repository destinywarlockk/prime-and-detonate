import React from 'react';
import type { AppState } from '../game/types';

type Props = {
  state: AppState;
  setState: (updater: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => void;
};

export function DialogueScreen({ state, setState }: Props) {
  const handleContinue = () => {
    setState({ screen: 'battle' });
  };

  return (
    <div className="min-h-[100dvh] w-full bg-slate-950 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dialogue</h1>
        <div className="text-center">
          <p className="text-slate-400 mb-4">Dialogue screen - React version coming soon!</p>
          <button 
            className="big"
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
