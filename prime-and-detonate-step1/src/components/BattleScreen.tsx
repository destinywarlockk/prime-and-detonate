import React, { useEffect, useRef } from 'react';
import type { AppState, BattleState, Ability, Actor, PartyMember, ClassId } from '../game/types';
import { getEnemyInstance } from '../../engine/combat/registry';
import { playerAttack, enemyAttack, canCastSuper, castSuper, castSuperAnytime, getSuperTier, BalanceSustain, checkVictoryCondition, findNextValidTarget } from '../game/engine';
import { ALL_ABILITIES, DEFENSIVE_BY_CLASS, ABILITY_BY_ID } from '../content/abilities';
import { WEAPON_BY_ID } from '../content/weapons';
// Class icons
import VanguardIcon from '../../assets/images/Vanguard.png';
import TechnomancerIcon from '../../assets/images/Technomancer.png';
import PyromancerIcon from '../../assets/images/Pyromancer.png';
import VoidrunnerIcon from '../../assets/images/Voidrunner.png';

const CLASS_ICON: Record<ClassId, string> = {
  vanguard: VanguardIcon,
  technomancer: TechnomancerIcon,
  pyromancer: PyromancerIcon,
  voidrunner: VoidrunnerIcon,
};

// Auto-map uploaded enemy icons by filename to enemy names/keys
const ENEMY_ICON_URLS: Record<string, string> = (() => {
  try {
    const mods = (import.meta as any).glob('../../assets/**/*.{png,jpg,jpeg,webp,svg}', {
      eager: true,
      import: 'default',
    }) as Record<string, string>;
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const map: Record<string, string> = {};
    for (const [path, url] of Object.entries(mods)) {
      const file = path.split('/').pop() || '';
      const base = file.substring(0, file.lastIndexOf('.')) || file;
      if (base) map[normalize(base)] = url;
    }
    return map;
  } catch {
    return {};
  }
})();

function resolveEnemyIcon(candidateName?: string, inst?: { name?: string; key?: string }): string | undefined {
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const candidates = [candidateName, inst?.name, inst?.key].filter(Boolean) as string[];
  for (const c of candidates) {
    const k = normalize(c);
    if (ENEMY_ICON_URLS[k]) return ENEMY_ICON_URLS[k];
  }
  return undefined;
}

type Props = {
  state: AppState;
  setState: (updater: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => void;
};

export function BattleScreen({ state, setState }: Props) {
  const battle = state.battle;
  const containerRef = useRef<HTMLDivElement>(null);

  // Bind FX to app wrap for battle effects
  useEffect(() => {
    try {
      const appWrap = document.getElementById('app-wrap') as any;
      if (appWrap && (window as any).BattleFX?.bindCanvas) {
        (window as any).BattleFX.bindCanvas(appWrap);
      }
    } catch {}
  }, []);

  // Format numbers for UI
  const fmt = (n: number): string => {
    const num = Number(n ?? 0);
    const abs = Math.abs(num);
    const decimals = abs >= 10 ? 0 : 1;
    return Number.isFinite(num) ? String(Number(num.toFixed(decimals))) : '0';
  };

  const handleReturnToLoadout = () => {
    setState({ screen: 'loadout' });
  };

  const handleMissionSelect = () => {
    setState({ screen: 'missions' });
  };

  const handleAbilityClick = (abilityId: string) => {
    setState(state => ({
      battle: {
        ...state.battle,
        selectedAbilityId: abilityId
      }
    }));
  };

  const handleEnemyClick = (enemyIndex: number) => {
    setState(state => ({
      battle: {
        ...state.battle,
        targetIndex: enemyIndex
      }
    }));
  };

  const handleAttack = () => {
    if (!battle.selectedAbilityId || battle.turn !== 'player') return;

    // Use the existing battle engine - it takes the entire battle state
    const result = playerAttack(battle);
    
    setState(state => ({
      battle: result
    }));

    // Check victory condition
    const victoryCheck = checkVictoryCondition(result);
    
    if (victoryCheck) {
      setState(state => ({
        battle: {
          ...state.battle,
          isOver: true,
          log: [...state.battle.log, 'Victory!']
        }
      }));
    }
  };

  const handleEndTurn = () => {
    if (battle.turn === 'player') {
      setState(state => ({
        battle: {
          ...state.battle,
          turn: 'enemy',
          activePartyIndex: 0
        }
      }));
      
      // Process enemy turn
      setTimeout(() => {
        processEnemyTurn();
      }, 1000);
    }
  };

  const processEnemyTurn = () => {
    const aliveEnemies = battle.enemies.filter(enemy => enemy.bars.hp > 0);
    if (aliveEnemies.length === 0) return;

    // Use the existing battle engine for enemy attacks
    const result = enemyAttack(battle);
    
    setState(state => ({
      battle: result
    }));
  };

  const renderPartyMember = (member: PartyMember, index: number) => {
    const abilities = member.abilityIds.map(id => ABILITY_BY_ID[id]).filter(Boolean);
    const weapon = member.weaponId ? WEAPON_BY_ID[member.weaponId] : null;
    const classIcon = CLASS_ICON[member.classId];
    const isActive = battle.turn === 'player' && battle.activePartyIndex === index;

    return (
      <div key={member.actorId} className={`party-member-card ${isActive ? 'active' : ''}`}>
        <div className="member-header">
          <img src={classIcon} alt={member.classId} className="class-icon" />
          <div className="member-info">
            <div className="member-name">{member.name}</div>
            <div className="member-stats">
              <span className="stat">SH{fmt(member.bars.sh)}</span>
              <span className="stat">HP{fmt(member.bars.hp)}</span>
              <span className="stat">SP{fmt(member.bars.sp)}</span>
            </div>
          </div>
        </div>
        <div className="member-abilities">
          {abilities.map(ability => (
            <button
              key={ability.id}
              className={`ability-btn ${battle.selectedAbilityId === ability.id ? 'selected' : ''}`}
              onClick={() => handleAbilityClick(ability.id)}
              disabled={battle.turn !== 'player' || !isActive}
            >
              {ability.name}
            </button>
          ))}
        </div>
        {weapon && (
          <div className="member-weapon">
            <span className="weapon-name">{weapon.name}</span>
          </div>
        )}
      </div>
    );
  };

  const renderEnemy = (enemy: Actor, index: number) => {
    const icon = resolveEnemyIcon(enemy.name, enemy);
    const isDead = enemy.bars.hp <= 0;
    
    return (
      <div 
        key={enemy.id} 
        className={`enemy-card ${battle.targetIndex === index ? 'targeted' : ''} ${isDead ? 'dead' : ''}`}
        onClick={() => !isDead && handleEnemyClick(index)}
      >
        <div className="enemy-header">
          {icon && <img src={icon} alt={enemy.name} className="enemy-icon" />}
          <div className="enemy-info">
            <div className="enemy-name">{enemy.name}</div>
            <div className="enemy-stats">
              <span className="stat">SH{fmt(enemy.bars.sh)}</span>
              <span className="stat">HP{fmt(enemy.bars.hp)}</span>
            </div>
          </div>
        </div>
        <div className="enemy-status">
          {enemy.primes.map((prime, primeIndex) => (
            <span key={primeIndex} className="prime-indicator">{prime.element}</span>
          ))}
        </div>
      </div>
    );
  };

  if (battle.isOver) {
    return (
      <div className="battle-screen">
        <div className="victory-screen">
          <h1>Victory!</h1>
          <p>The battle is won! Your tactical prowess has secured victory against all odds.</p>
          <div className="victory-actions">
            <button className="btn btn-primary" onClick={handleReturnToLoadout}>
              Return to Loadout
            </button>
            <button className="btn" onClick={handleMissionSelect}>
              Mission Select
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          .battle-screen {
            width: 100%;
            max-width: 100vw;
            margin: 0 auto;
            overflow-x: hidden;
            position: relative;
            height: 100vh;
            background: #0b0f1a;
            color: #f8fafc;
            display: flex;
            flex-direction: column;
          }
          
          .battle-header {
            padding: 1rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .battle-content {
            flex: 1;
            padding: 1rem;
            overflow-y: auto;
          }
          
          .enemy-section {
            margin-bottom: 2rem;
          }
          
          .enemy-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
          }
          
          .enemy-card {
            background: #1e293b;
            border-radius: 8px;
            padding: 1rem;
            cursor: pointer;
            transition: all 0.2s;
            border: 2px solid transparent;
          }
          
          .enemy-card.targeted {
            border-color: #3b82f6;
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
          }
          
          .enemy-card.dead {
            opacity: 0.3;
            filter: grayscale(80%);
            cursor: default;
          }
          
          .enemy-card:hover:not(.dead) {
            background: #334155;
          }
          
          .party-section {
            margin-bottom: 2rem;
          }
          
          .party-cards {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            justify-content: center;
          }
          
          .party-member-card {
            background: #1e293b;
            border-radius: 8px;
            padding: 1rem;
            min-width: 200px;
            flex: 1;
            border: 2px solid transparent;
          }
          
          .party-member-card.active {
            border-color: #10b981;
            box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
          }
          
          .member-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1rem;
          }
          
          .class-icon {
            width: 32px;
            height: 32px;
            border-radius: 4px;
          }
          
          .member-name {
            font-weight: bold;
            font-size: 1.1rem;
          }
          
          .member-stats {
            display: flex;
            gap: 0.5rem;
            font-size: 0.9rem;
            opacity: 0.8;
          }
          
          .member-abilities {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 0.5rem;
          }
          
          .ability-btn {
            background: #374151;
            border: 1px solid #4b5563;
            color: #f8fafc;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .ability-btn:hover:not(:disabled) {
            background: #4b5563;
          }
          
          .ability-btn.selected {
            background: #3b82f6;
            border-color: #2563eb;
          }
          
          .ability-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          
          .member-weapon {
            font-size: 0.8rem;
            opacity: 0.7;
          }
          
          .battle-log {
            background: #111827;
            border-radius: 8px;
            padding: 1rem;
            max-height: 200px;
            overflow-y: auto;
            margin-bottom: 1rem;
          }
          
          .log-entry {
            margin-bottom: 0.25rem;
            font-size: 0.9rem;
          }
          
          .battle-controls {
            display: flex;
            gap: 1rem;
            justify-content: center;
            padding: 1rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .btn {
            background: #374151;
            border: 1px solid #4b5563;
            color: #f8fafc;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .btn:hover {
            background: #4b5563;
          }
          
          .btn-primary {
            background: #3b82f6;
            border-color: #2563eb;
          }
          
          .btn-primary:hover {
            background: #2563eb;
          }
          
          .victory-screen {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            text-align: center;
            padding: 2rem;
          }
          
          .victory-screen h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            color: #10b981;
          }
          
          .victory-screen p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.8;
          }
          
          .victory-actions {
            display: flex;
            gap: 1rem;
          }
        `}
      </style>
      <div className="battle-screen" ref={containerRef}>
        <div className="battle-header">
          <button className="btn" onClick={handleReturnToLoadout}>
            Back to Loadout
          </button>
          <div className="battle-title">Battle - {battle.turn === 'player' ? 'Your Turn' : 'Enemy Turn'}</div>
          <button className="btn" onClick={handleMissionSelect}>
            Missions
          </button>
        </div>
        
        <div className="battle-content">
          {/* Enemy Section */}
          <div className="enemy-section">
            <h3>Enemies</h3>
            <div className="enemy-cards">
              {battle.enemies.map(renderEnemy)}
            </div>
          </div>
          
          {/* Party Section */}
          <div className="party-section">
            <h3>Your Party</h3>
            <div className="party-cards">
              {battle.party.map(renderPartyMember)}
            </div>
          </div>
          
          {/* Battle Log */}
          <div className="battle-log">
            <h4>Battle Log</h4>
            {battle.log.map((entry, index) => (
              <div key={index} className="log-entry">{entry}</div>
            ))}
          </div>
        </div>
        
        <div className="battle-controls">
          {battle.turn === 'player' && battle.selectedAbilityId && (
            <button className="btn btn-primary" onClick={handleAttack}>
              Attack!
            </button>
          )}
          <button className="btn" onClick={handleEndTurn}>
            End Turn
          </button>
        </div>
      </div>
    </>
  );
}
