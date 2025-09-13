import React from 'react';
import type { AppState } from '../game/types';
import { mountReactLoadout } from '../ui/react-loadout';

type Props = {
  state: AppState;
  setState: (updater: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => void;
};

export function LoadoutScreen({ state, setState }: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;

    const setLoadoutState = (updater: any) => {
      setState((state) => {
        if (typeof updater === 'function') {
          const maybePatch = updater(state);
          if (maybePatch && typeof maybePatch === 'object') {
            if ((maybePatch as Partial<AppState>).screen === 'battle') {
              // Build battle state using the helper to ensure party is created
              setState({ screen: 'battle' });
              return {};
            }
            return maybePatch;
          }
          return {};
        }
        // Object form: merge into loadout
        if (updater && typeof updater === 'object' && updater.screen === 'battle') {
          setState({ screen: 'battle' });
          return {};
        }
        return { loadout: { ...state.loadout, ...updater } } as Partial<AppState>;
      });
    };

    const switchToParty = () => {
      setState({ screen: 'party' });
    };

    const switchToDialogueOrBattle = () => {
      // This logic would need to be extracted from the original app.ts
      // For now, just go to battle
      setState({ screen: 'battle' });
    };

    const unmount = mountReactLoadout(
      containerRef.current,
      state.loadout,
      setLoadoutState,
      switchToParty,
      switchToDialogueOrBattle
    );

    return unmount;
  }, [state.loadout, setState]);

  return <div ref={containerRef} style={{ height: '100vh', width: '100vw' }} />;
}
