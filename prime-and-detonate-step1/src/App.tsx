import React from 'react';
import type { AppState } from './game/types';
import { WelcomeScreen } from './components/WelcomeScreen';
import { LoadoutScreen } from './components/LoadoutScreen';
import { BattleScreen } from './components/BattleScreen';
import { PartyScreen } from './components/PartyScreen';
import { MissionsScreen } from './components/MissionsScreen';
import { DialogueScreen } from './components/DialogueScreen';

type Props = {
  state: AppState;
  setState: (updater: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => void;
};

export function App({ state, setState }: Props) {
  switch (state.screen) {
    case 'welcome':
      return <WelcomeScreen state={state} setState={setState} />;
    case 'loadout':
      return <LoadoutScreen state={state} setState={setState} />;
    case 'battle':
      return <BattleScreen state={state} setState={setState} />;
    case 'party':
      return <PartyScreen state={state} setState={setState} />;
    case 'missions':
      return <MissionsScreen state={state} setState={setState} />;
    case 'dialogue':
      return <DialogueScreen state={state} setState={setState} />;
    default:
      return <div>Unknown screen: {state.screen}</div>;
  }
}
