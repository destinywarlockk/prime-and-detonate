import type { LoadoutState, BattleState, AppState, Mission } from '../game/types';
import { mountDialogue } from './dialogue';
import { mountLoadout } from './loadout';
import { mountBattle } from './battle';
import { mountParty } from './party';
import { mountMissions } from './missions';
import { mountWelcome } from './welcome';
import { spawnWave, type WaveDef, buildRandomSingleFactionWave, buildRandomFactionWaveByThreat, buildSingleFactionWave } from '../../engine/combat/waveSpawner';
import { registerEnemyActor, clearRegistry } from '../../engine/combat/registry';
import { ALL_WEAPONS } from '../content/weapons';
import { justiceRunsCold } from '../content/extendedMissions';
// Dialogue portraits
import VanguardPortrait from '../../assets/images/Vanguard.png';
import OutlawScrapperFemale from '../../assets/images/Outlaw Scrapper Female1.png';
import TechnomancerPortrait from '../../assets/images/Technomancer.png';
import AccordTrooper from '../../assets/images/Accord Trooper Grunt.png';
import PyromancerPortrait from '../../assets/images/Pyromancer.png';
import SyndicateRaptor from '../../assets/images/Syndicate Raptor Grunt.png';
import VoidrunnerPortrait from '../../assets/images/Voidrunner.png';
import OutlawScrapper from '../../assets/images/Outlaw Scrapper Grunt.png';
import ShadeJusticeRunsCold from '../../assets/images/Shade_JusticeRunsCold.png';
import AccordTrooperJusticeRunsCold from '../../assets/images/AccordTrooper_JusticeRunsCold.png';

export function mountApp(
  root: HTMLElement,
  getState: () => AppState,
  setState: (updater: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => void,
  subscribe: (listener: (state: AppState) => void) => (() => void)
) {
  let currentUnmount: (() => void) | null = null;

  const switchToBattle = (opts?: { key?: string; count?: number; faction?: 'Outlaws'|'Voidborn'|'Syndicate'|'Accord' }) => {
    setState(state => {
      // Create party members from the loadout selection
      const party: BattleState['party'] = state.loadout.partySelection.map((defId, index) => {
        const charDef = state.loadout.roster.find(c => c.id === defId);
        if (!charDef) {
          // Fallback character if something goes wrong
          return {
            actorId: `party-${index}`,
            defId: defId,
            name: `Character ${index + 1}`,
            classId: 'vanguard' as const,
            bars: { sh: 100, hp: 100, sp: 100 },
            primes: [],
            abilityIds: [],
            superEnergy: 25  // Start with some super energy so players can see the bar working
          };
        }
        
        const selectedAbilities = state.loadout.selectedByChar[defId] || [];
        const selectedWeaponId = state.loadout.selectedWeaponByChar?.[defId] ?? 'none';
        const weapon = (state.loadout.allWeapons || ALL_WEAPONS).find(w => w.id === selectedWeaponId);
        return {
          actorId: `party-${index}`,
          defId: defId,
          name: charDef.name,
          classId: charDef.classId,
          bars: {
            sh: (charDef.baseBars.sh + (weapon?.maxShBonus ?? 0)),
            hp: (charDef.baseBars.hp + (weapon?.maxHpBonus ?? 0)),
            sp: charDef.baseBars.sp,
          },
          primes: [],
          abilityIds: selectedAbilities,
          superEnergy: 25,  // Start with some super energy so players can see the bar working
          weaponId: selectedWeaponId,
        };
      });
      
      // Guard: if no party is selected, route to Loadout instead of entering battle
      if (!party || party.length === 0) {
        return { screen: 'loadout' } as Partial<AppState> as any;
      }
      
      // Build enemies
      clearRegistry();
      // If caller requested a specific enemy key or faction, honor it
      let wave: WaveDef;
      if (opts?.key) {
        const cnt = Math.max(1, Math.floor(opts.count ?? 1));
        wave = { enemies: [{ key: opts.key, count: cnt }] };
      } else if (opts?.faction) {
        wave = buildSingleFactionWave(opts.faction, 3);
      } else {
        // Default: random faction by threat budget
        wave = buildRandomFactionWaveByThreat(8, 10);
      }
      const instances = spawnWave(wave);
      const enemies: BattleState['enemies'] = instances.map((inst, i) => {
        const actorId = `e${i+1}`;
        registerEnemyActor(actorId, inst);
        return {
          id: actorId,
          name: inst.name,
          bars: { sh: inst.stats.shields, hp: inst.stats.hp, sp: 0 },
          maxBars: { sh: inst.stats.maxShields, hp: inst.stats.maxHp, sp: 100 },
          primes: [],
          enemyKey: inst.key
        };
      });

      // Check for mission buff from skipped dialogue
      const missionBuff = state.mission?.current?.missionBuff;
      let battleLog = ['Battle begins!'];
      
      // Add mission buff info to battle log if present
      if (missionBuff) {
        if (missionBuff.playerDamageMult && missionBuff.playerDamageMult !== 1) {
          const pct = Math.round((missionBuff.playerDamageMult - 1) * 100);
          battleLog.push(`Dialogue skipped - Fight begins with disadvantage: ${pct}% damage penalty`);
        }
      }
      
      // Determine the enemy faction for the battle animation
      const enemyFaction = opts?.faction || (instances.length > 0 ? instances[0].faction : 'Voidborn');
      
      // Return the updated state
      return {
        screen: 'battle',
        loadout: {
          ...state.loadout
        },
        battle: {
          party: party,
          enemies,
          targetIndex: Math.min(1, Math.max(0, enemies.length - 1)),
          turn: 'player',
          activePartyIndex: 0,
          selectedAbilityId: party[0]?.abilityIds[0] || undefined,
          log: battleLog,
          isOver: false,
          cooldownsByMember: {},
          basicStreakByMember: {},
          superEnergyGainedThisTurn: {}, // Initialize super energy tracking
          missionBuff: missionBuff, // Apply the mission buff to battle
          currentMission: state.mission?.current ? { 
            id: state.mission.current.id, 
            name: state.mission.current.name, 
            victoryText: state.mission.current.victoryText 
          } : undefined
        }
      };
    });
  };

  const switchToLoadout = () => { setState(() => ({ screen: 'loadout' })); };
  const switchToParty = () => { setState(() => ({ screen: 'party' })); };

  // Branch to dialogue if an active mission with a script exists
  const switchToDialogueOrBattle = () => {
    const s = getState();
    const m = s.mission?.current;
      if (m && Array.isArray(m.script) && m.script.length > 0) {
      // Best-effort defaults
      let leftName = 'Left';
      let rightName = 'NPC';
      let leftImgUrl: string | undefined;
      let rightImgUrl: string | undefined;
        // Optional faction context for dialogue positioning
        let allyFaction: 'Outlaws'|'Voidborn'|'Syndicate'|'Accord' | undefined;
        let enemyFaction: 'Outlaws'|'Voidborn'|'Syndicate'|'Accord' | undefined;
      // Special-case our mission for custom names and portraits
      if (m.id === 'scrap-hesitation') {
        leftName = 'Nova';
        rightName = 'Scrapper';
        leftImgUrl = VanguardPortrait;
        rightImgUrl = OutlawScrapperFemale;
          allyFaction = 'Outlaws';
          enemyFaction = 'Outlaws';
      } else if (m.id === 'nova-boldness') {
        // Nova mission: label right as the contact by default
        leftName = 'Nova';
        rightName = 'Outlaw';
        leftImgUrl = VanguardPortrait;
        rightImgUrl = OutlawScrapperFemale;
          allyFaction = 'Outlaws';
          enemyFaction = 'Syndicate';
      } else if (m.id === 'volt-adaptability') {
        // Volt mission: label right as Accord Officer by default
        leftName = 'Volt';
        rightName = 'Accord Officer';
        leftImgUrl = TechnomancerPortrait;
        rightImgUrl = AccordTrooper;
          allyFaction = 'Accord';
          enemyFaction = 'Voidborn';
      } else if (m.id === 'ember-self_control') {
        leftName = 'Ember';
        rightName = 'Syndicate Exec';
        leftImgUrl = PyromancerPortrait;
        rightImgUrl = SyndicateRaptor;
          allyFaction = 'Syndicate';
          enemyFaction = 'Accord';
      } else if (m.id === 'shade-empathy') {
        leftName = 'Shade';
        rightName = 'Voidborn Thrall';
        leftImgUrl = VoidrunnerPortrait;
        rightImgUrl = OutlawScrapper;
          allyFaction = 'Outlaws';
          enemyFaction = 'Voidborn';
      } else if (m.id === 'nova_boldness_under_fire') {
        leftName = 'Nova';
        rightName = 'Outlaw Lead';
        leftImgUrl = VanguardPortrait;
        rightImgUrl = OutlawScrapperFemale;
        allyFaction = 'Outlaws';
        enemyFaction = 'Syndicate';
      } else if (m.id === 'nova_run_toward_the_fire') {
        // Nova — Run at Danger (Extended)
        leftName = 'Nova';
        rightName = 'Accord Rescuer';
        leftImgUrl = VanguardPortrait;
        rightImgUrl = AccordTrooper;
        allyFaction = 'Accord';
        enemyFaction = 'Syndicate';
      } else if (m.id === 'volt_adapting_to_chaos') {
        leftName = 'Volt';
        rightName = 'Accord Officer';
        leftImgUrl = TechnomancerPortrait;
        rightImgUrl = AccordTrooper;
        allyFaction = 'Accord';
        enemyFaction = 'Voidborn';
      } else if (m.id === 'shade_shadows_of_empathy') {
        leftName = 'Shade';
        rightName = 'Voidborn Thrall';
        leftImgUrl = VoidrunnerPortrait;
        rightImgUrl = OutlawScrapper;
        allyFaction = 'Outlaws';
        enemyFaction = 'Voidborn';
      } else if (m.id === 'justice_runs_cold') {
        // Shade + Accord ally vs Syndicate
        leftName = 'Shade';
        rightName = 'Accord Trooper';
        leftImgUrl = ShadeJusticeRunsCold || VoidrunnerPortrait;
        rightImgUrl = AccordTrooperJusticeRunsCold || AccordTrooper;
        allyFaction = 'Accord';
        enemyFaction = 'Syndicate';
      }
      // Fallback to first party member name only if still defaulting to generic label
      if (leftName === 'Left') {
        const s2 = getState();
        if (s2.loadout.partySelection.length > 0) {
          leftName = s2.loadout.roster.find(c => c.id === s2.loadout.partySelection[0])?.name || 'Left';
        }
      }
      // Ensure the right speaker is not a placeholder
      if (rightName === 'NPC') {
        const labelByFaction: Record<'Outlaws'|'Voidborn'|'Syndicate'|'Accord', string> = {
          Outlaws: 'Outlaw',
          Voidborn: 'Voidborn Thrall',
          Syndicate: 'Syndicate Operative',
          Accord: 'Accord Officer'
        };
        rightName = enemyFaction ? labelByFaction[enemyFaction] : 'Opponent';
      }

      // Only set a default background for the legacy mission; new missions provide explicit scene keys
      const defaultSceneBg = (m.id === 'scrap-hesitation') ? 'Boldness' : undefined as any;
      setState({
        screen: 'dialogue',
          dialogue: { script: m.script.slice(), index: 0, stars: 0, isBossNext: !!m.isBoss, rewardWeaponId: m.rewardWeaponId, leftName, rightName, leftImgUrl, rightImgUrl, ...(defaultSceneBg ? { defaultSceneBg } : {}), ...(allyFaction ? { allyFaction } : {}), ...(enemyFaction ? { enemyFaction } : {}) }
      } as Partial<AppState>);
    } else {
      switchToBattle();
    }
  };

  // Create adapter functions for the different setState signatures
  const setLoadoutState = (updater: any) => {
    // Delegate to root store setState while supporting both mutation and return-patch styles
    setState((state) => {
      if (typeof updater === 'function') {
        // Allow updater to mutate nested state directly or return a patch
        const maybePatch = updater(state);
        if (maybePatch && typeof maybePatch === 'object') {
          if ((maybePatch as Partial<AppState>).screen === 'battle') {
            // Build battle state using the helper to ensure party is created
            switchToBattle();
            return {};
          }
          return maybePatch;
        }
        return {};
      }
      // Object form: merge into loadout
      if (updater && typeof updater === 'object' && updater.screen === 'battle') {
        switchToBattle();
        return {};
      }
      return { loadout: { ...state.loadout, ...updater } } as Partial<AppState>;
    });
  };

  const setBattleState = (updates: Partial<BattleState>) => {
    setState(state => ({
      battle: { ...state.battle, ...updates }
    }));
  };

  const render = () => {
    const state = getState();
    
    // Clean up previous screen
    if (currentUnmount) {
      currentUnmount();
      currentUnmount = null;
    }

    // Mount appropriate screen
    if (state.screen === 'welcome') {
      currentUnmount = mountWelcome(
        root,
        () => setState(s => ({ screen: 'missions', lastScreenBeforeMissions: s.screen } as any)),
        () => setState(() => ({ screen: 'party' }))
      );
    } else if (state.screen === 'party') {
      currentUnmount = mountParty(
        root,
        state.loadout,
        setLoadoutState,
        () => setState(() => ({ screen: 'loadout' })),
        () => setState(() => ({ screen: 'welcome' }))
      );
    } else if (state.screen === 'loadout') {
      // Prefer the React-based LoadoutScreen; fall back to legacy if no party is selected
      if (state.loadout.partySelection.length > 0) {
        // Code-split the React loadout to reduce initial bundle size
        import('./react-loadout').then(mod => {
          if (getState().screen !== 'loadout') return;
          currentUnmount = mod.mountReactLoadout(
            root,
            state.loadout,
            setLoadoutState,
            switchToParty,
            switchToDialogueOrBattle
          );
        });
      } else {
        currentUnmount = mountLoadout(
          root,
          state.loadout,
          setLoadoutState,
          switchToParty,
          switchToDialogueOrBattle
        );
      }
    } else if (state.screen === 'dialogue') {
      const onComplete = (result: { stars: number } & { route?: 'party' | 'loadout' | 'battle' } & { skipDialogue?: boolean }) => {
        const stars = result.stars || 0;
        const sBefore = getState();
        const currentMissionId = sBefore.mission?.current?.id;
        const protagonistId = (() => {
          const id = (currentMissionId || '').toLowerCase();
          const name = (sBefore.mission?.current?.name || '').toLowerCase();
          if (id.includes('nova') || name.includes('nova') || id === 'scrap-hesitation') return 'nova';
          if (id.includes('volt') || name.includes('volt')) return 'volt';
          if (id.includes('ember') || name.includes('ember')) return 'ember';
          if (id.includes('shade') || name.includes('shade') || id === 'justice_runs_cold') return 'shade';
          return undefined;
        })();
        const isBoss = !!sBefore.dialogue?.isBossNext;
        const rewardWeaponId = sBefore.dialogue?.rewardWeaponId;
        
        // Compute mission bonus based on stars earned or apply penalty for skipping dialogue
        let missionBuff;
        if (result.skipDialogue) {
          // Apply 25% damage penalty for skipping dialogue
          missionBuff = { playerDamageMult: 0.75, detonationSplashMult: 1.0 };
        } else {
          missionBuff = stars >= 3 ? { playerDamageMult: 1.10, detonationSplashMult: 1.20 } : undefined;
        }

        // 1) Route first to avoid transient blank dialogue renders
        if (result.route === 'party') {
          setState((s) => {
            const locked = protagonistId;
            const already = s.loadout.partySelection.includes(locked || '');
            const nextParty = locked && !already
              ? [locked, ...s.loadout.partySelection].slice(0, s.loadout.maxParty)
              : s.loadout.partySelection;
            return ({ screen: 'party', loadout: { ...s.loadout, lockedCharacterId: locked, partySelection: nextParty } } as any);
          });
        } else if (result.route === 'loadout') {
          setState(() => ({ screen: 'loadout' } as any));
        } else if (result.route === 'battle') {
          // Guard: if no party is selected, send the player to Loadout instead
          const hasParty = (sBefore.loadout?.partySelection?.length || 0) > 0;
          if (!hasParty) {
            setState(() => ({ screen: 'loadout' } as any));
          } else if (currentMissionId === 'scrap-hesitation') {
            switchToBattle({ faction: 'Voidborn' });
          } else {
            // Star-dependent victory text for extended missions with narrator outcomes
            try {
              if (currentMissionId === 'justice_runs_cold') {
                const txt = (stars >= 3)
                  ? justiceRunsCold.postBattle.threePasses
                  : (stars >= 1)
                    ? justiceRunsCold.postBattle.oneOrTwoPasses
                    : justiceRunsCold.postBattle.zeroPasses;
                setState(s => ({ mission: { ...(s.mission || { completed: {} }), current: s.mission?.current ? { ...s.mission.current, victoryText: txt } : s.mission?.current } } as any));
              }
            } catch {}
            switchToBattle();
          }
        }

        // 2) Record mission completion and clear dialogue; if routing to party/loadout, retain a shell mission with empty script so next "Done" starts battle
        setState(s => {
          // Compute star-dependent victory text for Justice Runs Cold
          let updatedCurrent = s.mission?.current || null;
          try {
            if (currentMissionId === 'justice_runs_cold') {
              const txt = (stars >= 3)
                ? justiceRunsCold.postBattle.threePasses
                : (stars >= 1)
                  ? justiceRunsCold.postBattle.oneOrTwoPasses
                  : justiceRunsCold.postBattle.zeroPasses;
              updatedCurrent = updatedCurrent ? { ...updatedCurrent, victoryText: txt } : updatedCurrent;
            }
          } catch {}
          const keepShell = result.route === 'party' || result.route === 'loadout';
          // Always clear script for any mission when keeping shell, to avoid re-entering dialogue
          // Also store mission buff if dialogue was skipped
          const shellCurrent = keepShell && updatedCurrent ? { 
            ...updatedCurrent, 
            script: [] as any,
            missionBuff: result.skipDialogue ? missionBuff : undefined
          } : (keepShell ? updatedCurrent : null);
          return ({
            mission: {
              ...(s.mission || { completed: {} }),
              completed: {
                ...(s.mission?.completed || {}),
                ...(s.mission?.current ? { [s.mission!.current!.id]: { bestStars: Math.max(stars, s.mission?.completed?.[s.mission!.current!.id]?.bestStars || 0) } } : {})
              },
              current: shellCurrent
            },
            ...(isBoss && stars >= 3 && rewardWeaponId
              ? { loadout: { ...s.loadout, allWeapons: [...(s.loadout.allWeapons || []), { id: rewardWeaponId, name: rewardWeaponId }] } }
              : {}),
            dialogue: undefined
          });
        });

        // 3) If we routed to battle, attach mission bonus log
        if (result.route === 'battle') {
          setState(s => {
            const details: string[] = [];
            const mb = missionBuff;
            if (mb && typeof mb.playerDamageMult === 'number' && mb.playerDamageMult !== 1) {
              const pct = Math.round((mb.playerDamageMult - 1) * 100);
              if (result.skipDialogue) {
                details.push(`${pct}% damage penalty`);
              } else {
                details.push(`+${pct}% damage`);
              }
            }
            if (mb && typeof mb.detonationSplashMult === 'number' && mb.detonationSplashMult !== 1) {
              const pct = Math.round((mb.detonationSplashMult - 1) * 100);
              details.push(`+${pct}% detonation splash`);
            }
            let line;
            if (result.skipDialogue) {
              line = `Dialogue skipped - Fight begins with disadvantage: ${details.join(', ')}`;
            } else if (mb) {
              line = `Next-fight bonus active: ${details.join(', ')}`;
            } else {
              line = 'Next-fight bonus not earned.';
            }
            return {
              battle: { ...s.battle, missionBuff: mb, log: [...s.battle.log, line] }
            };
          });
        }
      };
      currentUnmount = mountDialogue(
        root,
        () => getState().dialogue!,
        (updates) => setState(s => ({ dialogue: { ...s.dialogue!, ...updates } })),
        onComplete
      );
    } else if (state.screen === 'battle') {
      // Mount the battle UI wired to the real engine/state (replaces mock mobile demo)
      const subscribeBattle = (listener: (s: BattleState) => void) => {
        return subscribe((appState) => listener(appState.battle));
      };
      currentUnmount = mountBattle(
        root,
        () => getState().battle,
        setBattleState,
        subscribeBattle,
        () => setState(() => ({ screen: 'loadout' })),
        () => setState(() => ({ screen: 'missions' }))
      );
    } else if (state.screen === 'missions') {
      currentUnmount = mountMissions(
        root,
        () => getState().mission!,
        () => setState(s => ({ screen: s.lastScreenBeforeMissions || 'party', lastScreenBeforeMissions: undefined } as any)),
        (mission: Mission) => {
          setState(s => ({ mission: { ...(s.mission || { completed: {} }), current: mission } }));
          switchToDialogueOrBattle();
        }
      );
    }
  };

  // Subscribe to state changes and re-render
  const unsubscribe: () => void = subscribe(render);

  // Initial render
  render();

  // Return cleanup function
  return () => {
    if (currentUnmount) {
      currentUnmount();
    }
    unsubscribe();
  };
}
