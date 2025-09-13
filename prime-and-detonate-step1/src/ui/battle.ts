import type { BattleState, Ability, Actor, PartyMember, ClassId } from '../game/types';
import { getEnemyInstance } from '../../engine/combat/registry';
import { playerAttack, enemyAttack, canCastSuper, castSuper, castSuperAnytime, getSuperTier, BalanceSustain, checkVictoryCondition, findNextValidTarget } from '../game/engine';
import type { PmCardData } from './pm-card';
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
// Example: assets/images/warp_stalker.png -> maps to enemy name/key "Warp Stalker"/"warp_stalker"
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

// (Audio SFX removed)

export function mountBattle(root: HTMLElement, getState: () => BattleState, setState: (updates: Partial<BattleState>) => void, subscribe: (listener: (state: BattleState) => void) => void, onReturnToLoadout?: () => void, onMissionSelect?: () => void) {
  // Helper function to get current mission victory text
  const getCurrentMissionVictoryText = (): string => {
    const s = getState();
    if (s.currentMission?.victoryText) {
      return s.currentMission.victoryText;
    }
    // Fallback to a generic victory message
    return 'The battle is won! Your tactical prowess has secured victory against all odds.';
  };
  // Format numbers for UI (avoid long decimals). Use 0 decimals for >=10, otherwise 1.
  const fmt = (n: number): string => {
    const num = Number(n ?? 0);
    const abs = Math.abs(num);
    const decimals = abs >= 10 ? 0 : 1;
    return Number.isFinite(num) ? String(Number(num.toFixed(decimals))) : '0';
  };
  // Bind FX to app wrap (we don't use a canvas here). This makes position mapping simple
  try {
    const appWrap = document.getElementById('app-wrap') as any;
    if (appWrap && (window as any).BattleFX?.bindCanvas) {
      (window as any).BattleFX.bindCanvas(appWrap);
    }
  } catch {}
  
  // Inject mobile/compact CSS once
  try {
    const STYLE_ID = 'battle-mobile-inline';
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = `
         /* Contain layout to viewport width and prevent horizontal scroll */
         .battle-mobile{width:100%;max-width:100vw;margin:0 auto;overflow-x:hidden;position:relative;height:100vh}

         /* Ensure our battle layout doesn't inherit the global grid that forces 280px tracks */
         .battle-mobile .enemy-cards{display:block}
         .battle-mobile .party-cards{display:flex;flex-wrap:nowrap;gap:8px;justify-content:center;padding:2px 0}
         
         /* Ensure proper viewport containment */
         .battle-mobile .app {
           height: 100vh !important;
           height: 100dvh !important;
           overflow: hidden !important;
         }
         
         /* Remove any potential covering bars */
         .battle-mobile .main::after,
         .battle-mobile .main::before {
           display: none !important;
         }
         
         /* Ensure clean layout without overlapping elements */
         .battle-mobile .enemy-row,
         .battle-mobile .party-row,
         .battle-mobile .log,
         .battle-mobile #abilities {
           position: relative !important;
           float: none !important;
           clear: both !important;
         }

         /* Prevent global .big min-width from forcing overflow in the actions row */
         .battle-mobile .big{min-width:0}

         /* Fixed 4×2 Enemy Grid System */
         .battle-mobile .enemy-grid-container {
           display: grid;
           grid-template-rows: repeat(2, 94px);
           gap: 8px;
           height: 188px;
           width: 100%;
           max-width: 368px; /* 4 columns × 80px + 3 gaps × 12px */
           margin: -8px auto 0 auto;
           /* Ensure grid items can span properly */
           grid-auto-flow: dense;
         }
         
         .battle-mobile .enemy-grid-row {
           display: grid;
           grid-template-columns: repeat(4, 80px);
           gap: 12px;
           height: 94px;
           /* Ensure grid items can span properly */
           grid-auto-flow: dense;
         }
         
         .battle-mobile .enemy-grid-slot {
           width: 80px;
           height: 94px;
           display: flex;
           align-items: center;
           justify-content: flex-start;
           /* Debug: subtle border to show grid structure */
           border: 1px solid rgba(148, 163, 184, 0.1);
         }
         
         .battle-mobile .enemy-grid-slot--empty {
           /* Invisible placeholder to maintain grid structure */
         }
         
         .battle-mobile .enemy-grid-slot--occupied {
           /* Invisible placeholder for slots taken by larger enemies */
         }
         
         .battle-mobile .enemy-grid-slot--span-2 {
           grid-column: span 2;
           width: 168px; /* 2 columns + 1 gap */
         }
         
         .battle-mobile .enemy-grid-slot--span-3 {
           grid-column: span 3;
           width: 256px; /* 3 columns + 2 gaps */
         }
         
         /* Enemy card sizing and positioning */
         .battle-mobile .enemy-thumb {
           display: flex;
           background: rgba(15,23,42,.9);
           border: 1px solid rgba(100,116,139,.4);
           border-radius: 8px;
           padding: 3px;
           cursor: pointer;
           box-sizing: border-box;
           height: 94px;
           min-height: 94px;
           transition: all 150ms ease;
           /* Ensure proper grid behavior */
           grid-column: auto;
         }
         
         /* Death animation classes */
         .battle-mobile .enemy-thumb.is-dying {
           animation: enemyDeath 1.2s ease-in-out forwards;
           pointer-events: none;
           cursor: default;
         }
         
         .battle-mobile .enemy-thumb.is-dead {
           opacity: 0.3;
           filter: grayscale(80%) brightness(0.6);
           transform: scale(0.95);
           pointer-events: none;
           cursor: default;
         }
         
         /* Death animation keyframes */
         @keyframes enemyDeath {
           0% {
             transform: scale(1) rotate(0deg);
             opacity: 1;
             filter: grayscale(0%) brightness(1);
           }
           25% {
             transform: scale(1.1) rotate(-2deg);
             opacity: 0.9;
             filter: grayscale(20%) brightness(1.1);
           }
           50% {
             transform: scale(0.9) rotate(2deg);
             opacity: 0.7;
             filter: grayscale(40%) brightness(0.9);
           }
           75% {
             transform: scale(0.8) rotate(-1deg);
             opacity: 0.5;
             filter: grayscale(60%) brightness(0.7);
           }
           100% {
             transform: scale(0.95) rotate(0deg);
             opacity: 0.3;
             filter: grayscale(80%) brightness(0.6);
           }
         }
         
         /* Death particle effects */
         .battle-mobile .enemy-thumb__death-particles {
           position: absolute;
           top: 0;
           left: 0;
           width: 100%;
           height: 100%;
           pointer-events: none;
           z-index: 10;
         }
         
         .battle-mobile .enemy-thumb__death-particle {
           position: absolute;
           width: 4px;
           height: 4px;
           background: rgba(239, 68, 68, 0.8);
           border-radius: 50%;
           animation: deathParticle 0.8s ease-out forwards;
         }
         
         @keyframes deathParticle {
           0% {
             opacity: 1;
             transform: scale(1) translate(0, 0);
           }
           100% {
             opacity: 0;
             transform: scale(0) translate(var(--particle-x), var(--particle-y));
           }
         }
         

         
         /* Element-specific death effects */
         .battle-mobile .enemy-thumb.is-dying.prime-elem--kinetic .enemy-thumb__death-particle {
           background: rgba(148, 163, 184, 0.8);
         }
         
         .battle-mobile .enemy-thumb.is-dying.prime-elem--arc .enemy-thumb__death-particle {
           background: rgba(56, 189, 248, 0.8);
         }
         
         .battle-mobile .enemy-thumb.is-dying.prime-elem--thermal .enemy-thumb__death-particle {
           background: rgba(239, 68, 68, 0.8);
         }
         
         .battle-mobile .enemy-thumb.is-dying.prime-elem--void .enemy-thumb__death-particle {
           background: rgba(168, 85, 247, 0.8);
         }
         
         /* Enhanced death state styling */
         .battle-mobile .enemy-thumb.is-dying {
           z-index: 20;
           box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
         }
         
         .battle-mobile .enemy-thumb.is-dying.prime-elem--kinetic {
           box-shadow: 0 0 20px rgba(148, 163, 184, 0.4);
         }
         
         .battle-mobile .enemy-thumb.is-dying.prime-elem--arc {
           box-shadow: 0 0 20px rgba(56, 189, 248, 0.4);
         }
         
         .battle-mobile .enemy-thumb.is-dying.prime-elem--thermal {
           box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
         }
         
         .battle-mobile .enemy-thumb.is-dying.prime-elem--void {
           box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
         }
         
         /* Disable interactions during death animation */
         .battle-mobile .enemy-thumb.is-dying,
         .battle-mobile .enemy-thumb.is-dead {
           pointer-events: none;
           cursor: default;
         }
         
         /* Auto-targeting highlight effect */
         .battle-mobile .enemy-thumb.auto-targeted {
           animation: autoTargetPulse 0.8s ease-out;
         }
         
         @keyframes autoTargetPulse {
           0% {
             box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.7);
           }
           50% {
             box-shadow: 0 0 0 8px rgba(56, 189, 248, 0.4);
           }
           100% {
             box-shadow: 0 0 0 0 rgba(56, 189, 248, 0);
           }
         }
         
         /* Ensure dying enemies stay visible during animation */
         .battle-mobile .enemy-thumb.is-dying {
           position: relative;
           z-index: 20;
         }
         
         /* Smooth transition for death state changes */
         .battle-mobile .enemy-thumb {
           transition: all 150ms ease, opacity 1.2s ease-in-out, filter 1.2s ease-in-out, transform 1.2s ease-in-out;
         }
         
         .battle-mobile .enemy-thumb--standard {
           width: 80px;
           max-width: 80px;
         }
         
         .battle-mobile .enemy-thumb--miniboss {
           width: 168px; /* 2 columns + 1 gap */
           max-width: 168px;
         }
         
         .battle-mobile .enemy-thumb--boss {
           width: 256px; /* 3 columns + 2 gaps */
           max-width: 256px;
         }
         
         /* Grid slot spanning for larger enemies */
         .battle-mobile .enemy-grid-slot--span-2 {
           grid-column: span 2;
           width: 168px; /* 2 columns + 1 gap */
         }
         
         .battle-mobile .enemy-grid-slot--span-3 {
           grid-column: span 3;
           width: 256px; /* 3 columns + 2 gaps */
         }
         
         /* Ensure grid layout works correctly with spanning */
         
         /* Ensure grid maintains structure even with larger enemies */
         
         /* Responsive adjustments for smaller screens */
         @media (max-width: 400px) {
           .battle-mobile .enemy-grid-container {
             max-width: 100%;
             padding: 0 8px;
           }
           
           .battle-mobile .enemy-grid-row {
             grid-template-columns: repeat(4, 1fr);
             gap: 8px;
           }
           
           .battle-mobile .enemy-grid-slot {
             width: auto;
             min-width: 0;
           }
         }

         .battle-mobile .enemy-thumb.is-selected{outline:2px solid rgba(250,204,21,.8);outline-offset:1px}
         /* Element-colored enemy highlight when primed */
         .battle-mobile .enemy-thumb.has-primes{border-color:rgba(148,163,184,.4)}
         .battle-mobile .enemy-thumb.prime-elem--kinetic{border-color:rgba(148,163,184,.6);box-shadow:0 0 10px rgba(148,163,184,.35),0 0 20px rgba(148,163,184,.2)}
         .battle-mobile .enemy-thumb.prime-elem--arc{border-color:rgba(56,189,248,.6);box-shadow:0 0 10px rgba(56,189,248,.35),0 0 20px rgba(56,189,248,.2)}
         .battle-mobile .enemy-thumb.prime-elem--thermal{border-color:rgba(239,68,68,.6);box-shadow:0 0 10px rgba(239,68,68,.35),0 0 20px rgba(239,68,68,.2)}
         .battle-mobile .enemy-thumb.prime-elem--void{border-color:rgba(168,85,247,.6);box-shadow:0 0 10px rgba(168,85,247,.35),0 0 20px rgba(168,85,247,.2)}
         
         /* Enemy thumb content styling - Icon + SH/HP + Dots Layout */
         .battle-mobile .enemy-thumb__content{display:flex;flex-direction:column;align-items:center;justify-content:space-between;width:100%;height:100%;min-height:100%;padding:4px;box-sizing:border-box}
         .battle-mobile .enemy-thumb__icon{width:40px;height:40px;object-fit:cover;border-radius:4px;margin-bottom:4px;flex-shrink:0;background:rgba(15,23,42,.6);border:1px solid rgba(100,116,139,.3)}
         .battle-mobile .enemy-thumb__simple-layout{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;flex:1;margin-top:2px}
         .battle-mobile .enemy-thumb__stat-line{display:flex;align-items:center;justify-content:center;gap:8px}
         .battle-mobile .enemy-thumb__sh-value{font-size:10px;color:#38bdf8;font-weight:700;font-variant-numeric:tabular-nums}
         .battle-mobile .enemy-thumb__hp-value{display:flex;align-items:center;justify-content:center;gap:2px;font-size:10px;color:#ef4444;font-weight:700;font-variant-numeric:tabular-nums}
         .battle-mobile .enemy-thumb__heart{color:#ef4444;font-size:11px}
         .battle-mobile .enemy-thumb__shield{color:#38bdf8;font-size:11px}
         .battle-mobile .enemy-thumb__primer-dots{display:flex;align-items:center;justify-content:center;gap:6px}
         .battle-mobile .enemy-thumb__slot-dot{width:8px;height:8px;border-radius:50%;border:1px solid rgba(15,23,42,.9);background:white;flex-shrink:0}
         .battle-mobile .enemy-thumb__slot-dot--kinetic{background:rgb(148,163,184)}
         .battle-mobile .enemy-thumb__slot-dot--arc{background:rgb(56,189,248)}
         .battle-mobile .enemy-thumb__slot-dot--thermal{background:rgb(239,68,68)}
         .battle-mobile .enemy-thumb__slot-dot--void{background:rgb(168,85,247)}
         
         /* Grunt layout adjustments */
         .battle-mobile .enemy-thumb__stats-grid--grunt{grid-template-columns:1fr}
         .battle-mobile .enemy-thumb__stats-grid--grunt .enemy-thumb__stat-column:last-child{align-items:center;justify-content:center}

         .battle-mobile .prime-badge{font-size:8px;line-height:1;padding:1px 4px;border-radius:999px;border:1px solid rgba(148,163,184,.35);background:rgba(30,41,59,.6);color:#e5e7eb}
         /* Fixed Battle Footer Styles */
         .battle-footer {
           position: fixed !important;
           bottom: 0 !important;
           left: 0 !important;
           right: 0 !important;
           z-index: 100 !important;
           background: #0b0f1a !important;
           padding: 12px max(12px, env(safe-area-inset-left)) 12px max(12px, env(safe-area-inset-right)) !important;
           padding-bottom: max(12px, calc(12px + env(safe-area-inset-bottom))) !important;
           box-sizing: border-box !important;
           min-height: 60px !important;
           width: 100vw !important;
           max-width: 100vw !important;
           box-shadow: 0 -4px 20px rgba(0,0,0,0.8) !important;
         }

         /* Main content area with proper spacing for fixed footer */
         .main {
           position: relative !important;
           z-index: 1 !important;
           height: calc(100vh - 70px) !important;
           padding-bottom: 60px !important;
           display: block !important;
           overflow: hidden !important;
         }

         /* Fixed positioning for key sections */
         .enemy-row {
           position: relative !important;
           z-index: 10 !important;
           background: rgba(15, 23, 42, 0.95) !important;
           backdrop-filter: blur(8px) !important;
           padding: 8px 8px 6px 8px !important;
           margin: 0 !important;
           border-bottom: 1px solid rgba(148, 163, 184, 0.2) !important;
         }
         
         .party-row {
           position: relative !important;
           z-index: 10 !important;
           background: rgba(15, 23, 42, 0.95) !important;
           backdrop-filter: blur(8px) !important;
           padding: 8px 8px !important;
           margin: 0 !important;
           margin-top: -4px !important;
           margin-bottom: 4px !important;
           border-bottom: 1px solid rgba(148, 163, 184, 0.2) !important;
           min-height: 160px !important;
         }
         
         .log {
           position: relative !important;
           z-index: 10 !important;
           background: rgba(15, 23, 42, 0.95) !important;
           backdrop-filter: blur(8px) !important;
           padding: 6px !important;
           margin: 0 !important;
           margin-top: -8px !important;
           margin-bottom: 8px !important;
         }

         /* Content area styling with proper heights */
         .enemy-cards {
           min-height: 188px !important;
           max-height: 188px !important;
         }
         
         .party-cards {
           min-height: 160px !important;
           max-height: 160px !important;
           padding: 4px 0 !important;
         }
         
         .log-content {
           min-height: 82px !important;
           max-height: 82px !important;
           overflow-y: scroll !important;
           -webkit-overflow-scrolling: touch !important;
           scroll-behavior: smooth !important;
           padding: 3px 0 !important;
           scrollbar-width: thin !important;
           scrollbar-color: rgba(148, 163, 184, 0.6) transparent !important;
         }
         
         .log-content::-webkit-scrollbar {
           width: 8px !important;
         }
         
         .log-content::-webkit-scrollbar-track {
           background: rgba(148, 163, 184, 0.2) !important;
           border-radius: 4px !important;
         }
         
         .log-content::-webkit-scrollbar-thumb {
           background: rgba(148, 163, 184, 0.8) !important;
           border-radius: 4px !important;
         }
         
         .log-content::-webkit-scrollbar-thumb:hover {
           background: rgba(148, 163, 184, 1) !important;
         }
         
         /* Abilities section - container for ability tray */
         #abilities {
           position: relative !important;
           z-index: 5 !important;
           height: 220px !important;
           padding: 6px !important;
           margin: 6px !important;
           margin-top: 4px !important;
           background: rgba(15, 23, 42, 0.8) !important;
           border-radius: 8px !important;
           border: 1px solid rgba(148, 163, 184, 0.2) !important;
           /* Ensure proper sizing for scrolling */
           box-sizing: border-box !important;
           overflow: hidden !important;
         }
         
         /* Ensure abilities container has proper scroll behavior */
         #abilities .ability-tray,
         .ability-tray {
           display: grid !important;
           grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
           grid-auto-rows: 84px !important;
           gap: 8px !important;
           padding: 2px 12px 12px 12px !important;
           height: 220px !important;
           max-height: 220px !important;
           overflow-y: scroll !important;
           -webkit-overflow-scrolling: touch !important;
           scroll-behavior: smooth !important;
           scrollbar-width: thin !important;
           scrollbar-color: rgba(148, 163, 184, 0.3) transparent !important;
           /* Force scrollbar to always be visible for testing */
           overflow-y: scroll !important;
         }
         
         /* Clear separation between log and abilities */
         #log + #abilities {
           margin-top: 8px !important;
         }
         
         /* Ensure abilities are not covered by any other elements */
         #abilities {
           position: relative !important;
           z-index: 5 !important;
           clear: both !important;
         }
         
         .ability-tray::-webkit-scrollbar {
           width: 8px !important;
         }
         
         .ability-tray::-webkit-scrollbar-track {
           background: rgba(148, 163, 184, 0.2) !important;
           border-radius: 4px !important;
         }
         
         .ability-tray::-webkit-scrollbar-thumb {
           background: rgba(148, 163, 184, 0.8) !important;
           border-radius: 4px !important;
         }
         
         .ability-tray::-webkit-scrollbar-thumb:hover {
           background: rgba(148, 163, 184, 1) !important;
         }

         .battle-footer-actions {
           display: grid !important;
           grid-template-columns: 1fr 1fr 1.5fr !important;
           gap: 12px !important;
           align-items: stretch !important;
           width: 100% !important;
         }

         .battle-footer-btn {
           background: transparent !important;
           color: #e2e8f0 !important;
           border: 1px solid #374151 !important;
           border-radius: 8px !important;
           padding: 8px 12px !important;
           font-size: 14px !important;
           font-weight: 600 !important;
           cursor: pointer !important;
           min-height: 36px !important;
           transition: all 0.2s ease !important;
           display: flex !important;
           align-items: center !important;
           justify-content: center !important;
           white-space: nowrap !important;
           user-select: none !important;
         }

         .battle-footer-btn:hover {
           background: rgba(55, 65, 81, 0.5) !important;
           border-color: #4b5563 !important;
           transform: translateY(-1px) !important;
         }

         .battle-footer-btn:active {
           transform: translateY(0) !important;
         }

         .battle-footer-btn--primary {
           background: #3b82f6 !important;
           color: #ffffff !important;
           border-color: #3b82f6 !important;
         }

         .battle-footer-btn--primary:hover {
           background: #2563eb !important;
           border-color: #2563eb !important;
         }

         /* Mobile optimizations for battle footer */
         @media (max-width: 768px) {
           .battle-footer {
             padding: 10px max(10px, env(safe-area-inset-left)) 10px max(10px, env(safe-area-inset-right)) !important;
             padding-bottom: max(10px, calc(10px + env(safe-area-inset-bottom))) !important;
             min-height: 52px !important;
           }
           
           .battle-footer-actions {
             gap: 10px !important;
           }
           
           .battle-footer-btn {
             min-height: 32px !important;
             font-size: 13px !important;
             padding: 6px 10px !important;
           }
           
           /* No sticky positioning needed */
         }

         @media (max-width: 480px) {
           .battle-footer {
             padding: 8px max(8px, env(safe-area-inset-left)) 8px max(8px, env(safe-area-inset-right)) !important;
             padding-bottom: max(8px, calc(8px + env(safe-area-inset-bottom))) !important;
           }
           
           .battle-footer-actions {
             gap: 8px !important;
           }
           
           .battle-footer-btn {
             min-height: 28px !important;
             font-size: 12px !important;
             padding: 5px 8px !important;
           }
           
           /* No sticky positioning needed */
         }

         @media (orientation: landscape) and (max-height: 600px) {
           .battle-footer {
             min-height: 45px !important;
             padding: 6px max(8px, env(safe-area-inset-left)) 6px max(8px, env(safe-area-inset-right)) !important;
             padding-bottom: max(6px, calc(6px + env(safe-area-inset-bottom))) !important;
           }
           
           .battle-footer-btn {
             min-height: 27px !important;
             font-size: 12px !important;
           }
           
           /* No sticky positioning needed */
         }
         .battle-mobile .prime--kinetic{border-color:rgba(148,163,184,.6);background:rgba(30,41,59,.6);color:rgb(148,163,184)}
         .battle-mobile .prime--arc{border-color:rgba(56,189,248,.6);background:rgba(8,47,73,.5);color:rgb(56,189,248)}
         .battle-mobile .prime--thermal{border-color:rgba(239,68,68,.6);background:rgba(69,10,10,.5);color:rgb(239,68,68)}
         .battle-mobile .prime--void{border-color:rgba(168,85,247,.6);background:rgba(59,7,100,.5);color:rgb(168,85,247)}
         .battle-mobile .enemy-thumb__bar{position:relative;height:6px;border-radius:6px;background:rgba(148,163,184,.15);margin:2px 0}
        .battle-mobile .enemy-thumb__bar-fill{position:absolute;left:0;top:0;bottom:0;border-radius:6px;background:linear-gradient(180deg,rgba(148,163,184,.65),rgba(100,116,139,.65))}
        .battle-mobile .enemy-thumb__bar--sh .enemy-thumb__bar-fill{background:linear-gradient(180deg,rgba(56,189,248,.6),rgba(2,132,199,.6))}
        .battle-mobile .enemy-thumb__bar--hp .enemy-thumb__bar-fill{background:linear-gradient(180deg,rgba(248,113,113,.55),rgba(185,28,28,.55))}
        .battle-mobile .enemy-thumb__bar-text{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:9px;color:#f8fafc;text-shadow:0 1px 2px rgba(0,0,0,.8),0 0 2px rgba(0,0,0,.6)}
        
         /* Party member card rendering using consistent layout with party select screen */
         .battle-mobile .party-cards.pm-compact{display:flex;flex-wrap:nowrap;gap:6px;justify-content:center;padding:4px 0}
                   .battle-mobile .party-cards.pm-compact .char-card.battle-char-card{display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:6px;border:1px solid rgba(100,116,139,.4);border-radius:8px;background:rgba(15,23,42,.9);width:100px;min-width:100px;height:180px;margin-top:-5px}
         /* Super slot inside card to avoid layout shifts */
         .battle-mobile .pm-super-slot{margin-top:4px;min-height:40px;width:100%}
         .battle-mobile .pm-avatar-wrap{position:relative;width:48px;height:48px}
         .battle-mobile .pm-strip-avatar{width:48px;height:48px;object-fit:cover;border-radius:6px;box-shadow:0 0 12px rgba(148,163,184,.25)}
         /* Super ring removed - yellow buttons provide clear visual feedback */
        .battle-mobile .pm-strip-name{margin-top:4px;font-size:10px;line-height:1.1;text-align:center;max-width:90px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .battle-mobile .pm-strip-status{margin-top:2px;font-size:10px;padding:1px 6px;border-radius:999px}
        .battle-mobile .pm-strip-status--active{background:rgba(34,197,94,.15);color:rgb(34,197,94);border:1px solid rgba(34,197,94,.35)}
        .battle-mobile .pm-strip-status--down{background:rgba(239,68,68,.15);color:rgb(239,68,68);border:1px solid rgba(239,68,68,.35)}
        
        /* Element-specific colors for character elements */
        .battle-mobile .pm-strip-status.pm-element--kinetic{background:rgba(75,85,99,.6);color:#e2e8f0;border-color:rgba(75,85,99,.4)}
        .battle-mobile .pm-strip-status.pm-element--arc{background:rgba(30,64,175,.6);color:#bfdbfe;border-color:rgba(30,64,175,.4)}
        .battle-mobile .pm-strip-status.pm-element--thermal{background:rgba(154,52,18,.6);color:#fed7aa;border-color:rgba(154,52,18,.4)}
        .battle-mobile .pm-strip-status.pm-element--void{background:rgba(88,28,135,.6);color:#c4b5fd;border-color:rgba(88,28,135,.4)}
        .battle-mobile .pm-card.pm-strip.is-turn{outline:2px solid rgba(250,204,21,.6);outline-offset:1px}
         /* Super description box acts as CTA button (in-card) */
         .battle-mobile .pm-super-box{display:block;width:100%;padding:4px 6px;border-radius:6px;background:rgba(234,179,8,.9);color:#000000;font-weight:700;font-size:9px;line-height:1.2;text-align:center;cursor:pointer;border:1px solid rgba(250,204,21,.8);box-shadow:0 2px 10px rgba(250,204,21,.2);white-space:normal}
         .battle-mobile .char-card.battle-char-card.super-l2 .pm-super-box{background:rgba(217,119,6,.9)}
         .battle-mobile .char-card.battle-char-card.super-l3 .pm-super-box{background:rgba(194,65,12,.9)}
         .battle-mobile .pm-super-box:disabled{opacity:.6;cursor:default}
         .battle-mobile .pm-super-box:focus-visible{outline:2px solid rgba(250,204,21,.9);outline-offset:2px}
        .battle-mobile .pm-strip-stats{margin-top:4px;font-size:10px;color:#cbd5e1;text-align:center;white-space:nowrap;width:100%}
        .battle-mobile .pm-stat-mini{display:block}
        .battle-mobile .pm-stat-line{line-height:1}
        .battle-mobile .pm-stat-current{color:#cbd5e1;font-weight:600}
        .battle-mobile .pm-stat-max{color:#64748b;opacity:0.7}
        
         /* Background crossfade stack */
         .battle-mobile{position:relative}
         .battle-mobile .main{position:relative;z-index:1}
         .battle-bg{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;display:none}
         .battle-bg__layer{position:absolute;inset:0;background-size:cover;background-position:center;background-repeat:no-repeat;opacity:0;transition:opacity .4s ease;will-change:opacity}
         .battle-bg__layer.is-visible{opacity:1}
         @media (prefers-reduced-motion: reduce){
           .battle-bg__layer{transition:none}
         }
         
        /* Heal targeting highlights */
        .battle-mobile .char-card.battle-char-card.is-heal-valid{outline:2px solid rgba(34,197,94,.55);outline-offset:1px}
        .battle-mobile .char-card.battle-char-card.is-heal-selected{outline:3px solid rgba(34,197,94,.95);outline-offset:1px;box-shadow:0 0 12px rgba(34,197,94,.25)}
        .battle-mobile .char-card.battle-char-card.is-heal-invalid{opacity:.55;filter:grayscale(10%)}
        
                 /* Turn indicator glow */
         .battle-mobile .char-card.battle-char-card.is-turn{outline:2px solid rgba(250,204,21,.6);outline-offset:1px;box-shadow:0 0 8px rgba(250,204,21,.3)}
         
         /* Damage shake animation when taking damage */
         .battle-mobile .char-card.battle-char-card.is-taking-damage {
           animation: damageShake 0.6s ease-in-out !important;
           will-change: transform !important;
           z-index: 10 !important;
         }
         
         /* Enemy damage shake animation */
         .battle-mobile .enemy-thumb.is-taking-damage {
           animation: enemyDamageShake 0.4s ease-in-out !important;
           will-change: transform !important;
           z-index: 10 !important;
         }
         
         @keyframes damageShake {
           0%, 100% { transform: translateX(0); }
           10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
           20%, 40%, 60%, 80% { transform: translateX(3px); }
         }
         
         @keyframes enemyDamageShake {
           0%, 100% { transform: translateX(0); }
           25%, 75% { transform: translateX(-3px); }
           50% { transform: translateX(3px); }
         }
        
                 /* Ability tray grid items maintain consistent height */
         .battle-mobile .ability-tray > *,
         #abilities .ability-tray > *,
         .ability-tray > * {
           height: 84px !important;
           min-height: 84px !important;
           max-height: 84px !important;
         }
        .battle-mobile .ability{display:flex;flex-direction:column;justify-content:space-between;min-width:0;width:100%;height:84px !important;min-height:84px !important;max-height:84px !important;padding:8px;border-radius:8px;border:1px solid rgba(148,163,184,.25);color:#e5e7eb;background:rgba(30,41,59,.85);cursor:pointer;pointer-events:auto;touch-action:manipulation;user-select:none;box-sizing:border-box;overflow:hidden}
        .battle-mobile .ability .ability-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;flex-shrink:0;gap:6px}
        .battle-mobile .ability .ability-name{font-weight:800;white-space:normal;word-wrap:break-word;line-height:1.2;font-size:11px;flex-shrink:0;padding:1px 0}
        .battle-mobile .ability .ability-role{font-size:10px;opacity:.9;flex-shrink:0;padding:1px 0}
        .battle-mobile .ability .ability-role--primer{background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);border-radius:3px;padding:1px 4px;margin-left:2px}
        .battle-mobile .ability .ability-role--detonator{background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.3);border-radius:3px;padding:1px 4px;margin-left:2px}
        .battle-mobile .ability .ability-effect{font-size:11px;color:#cbd5e1;flex-shrink:0;margin-bottom:4px;padding:1px 0}
        .battle-mobile .ability.is-selected{outline:2px solid rgba(250,204,21,.7);outline-offset:1px}
        .battle-mobile .ability--kinetic{background:linear-gradient(180deg,rgba(30,41,59,.92),rgba(15,23,42,.92));border-color:rgba(148,163,184,.35)}
        .battle-mobile .ability--arc{background:linear-gradient(180deg,rgba(12,74,110,.55),rgba(8,47,73,.55));border-color:rgba(56,189,248,.35)}
        .battle-mobile .ability--thermal{background:linear-gradient(180deg,rgba(127,29,29,.55),rgba(69,10,10,.55));border-color:rgba(239,68,68,.35)}
        .battle-mobile .ability--void{background:linear-gradient(180deg,rgba(88,28,135,.55),rgba(59,7,100,.55));border-color:rgba(168,85,247,.35)}
        
        /* Weapon element labels - colored badges showing weapon element */
        .battle-mobile .weapon-element {
          display: inline-block;
          font-size: 9px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 12px;
          margin-left: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: 1px solid;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        
        .battle-mobile .weapon-element--kinetic {
          background: rgba(148, 163, 184, 0.8);
          color: #1e293b;
          border-color: rgba(148, 163, 184, 0.6);
        }
        
        .battle-mobile .weapon-element--arc {
          background: rgba(56, 189, 248, 0.8);
          color: #0c4a6e;
          border-color: rgba(56, 189, 248, 0.6);
        }
        
        .battle-mobile .weapon-element--thermal {
          background: rgba(239, 68, 68, 0.8);
          color: #7f1d1d;
          border-color: rgba(239, 68, 68, 0.6);
        }
        
        .battle-mobile .weapon-element--void {
          background: rgba(168, 85, 247, 0.8);
          color: #581c87;
          border-color: rgba(168, 85, 247, 0.6);
        }
        
        /* Weapon selection UI styles */
        .weapon-selection {
          margin: 16px 0;
          padding: 16px;
          background: rgba(15, 23, 42, 0.6);
          border-radius: 8px;
          border: 1px solid rgba(148, 163, 184, 0.2);
        }
        
        .weapon-selection h4 {
          margin: 0 0 12px 0;
          color: #e2e8f0;
          font-size: 14px;
          font-weight: 600;
        }
        
        .weapon-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 8px;
        }
        
        .weapon-option {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          padding: 12px;
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(148, 163, 184, 0.3);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }
        
        .weapon-option:hover {
          background: rgba(30, 41, 59, 0.9);
          border-color: rgba(148, 163, 184, 0.5);
          transform: translateY(-1px);
        }
        
        .weapon-option.is-selected {
          background: rgba(59, 130, 246, 0.2);
          border-color: rgba(59, 130, 246, 0.6);
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
        }
        
        .weapon-info {
          margin-bottom: 8px;
        }
        
        .weapon-name {
          font-weight: 600;
          color: #e2e8f0;
          margin-bottom: 4px;
        }
        
        .weapon-stats {
          font-size: 11px;
          color: #94a3b8;
          line-height: 1.3;
        }
        
        .weapon-stats span {
          display: inline-block;
          margin-right: 8px;
        }
        .battle-mobile .ability:disabled{opacity:.6}
        .battle-mobile .ability--basic{background:linear-gradient(180deg,rgba(34,197,94,.3),rgba(21,128,61,.3));border-color:rgba(34,197,94,.55)}
        .battle-mobile .ability--defend{background:linear-gradient(180deg,rgba(96,165,250,.3),rgba(30,64,175,.3));border-color:rgba(59,130,246,.55)}
        
                 /* Ensure all ability buttons are consistently 84px tall */
         .battle-mobile #abilities .ability,
         .battle-mobile .ability-tray .ability,
         .battle-mobile .ability,
         .battle-mobile button.ability {
           height: 84px !important;
           min-height: 84px !important;
           max-height: 84px !important;
         }
        
         /* Centered short divider between enemies and party */
         .battle-mobile .battle-divider{width:25%;height:1px;background:rgba(148,163,184,.15);margin:0 auto;border-radius:999px;position:relative;z-index:5}
         
         /* Proper spacing for sticky layout */
         .battle-mobile .enemy-row{margin-bottom:0}
         .battle-mobile .party-row{margin-bottom:0}
         .battle-mobile .log{margin-bottom:0;margin-top:0 !important}
         .battle-mobile .ability-tray{margin-bottom:0}
         
         /* Content padding for better readability */
         .battle-mobile .enemy-cards{padding:4px 0}
         .battle-mobile .party-cards{padding:4px 0}
         .battle-mobile .log-content{padding:4px 0}
         
         /* Battle result buttons layout */
         .battle-result-buttons{display:flex;gap:12px;justify-content:center;margin-top:24px}
         .battle-result-buttons .btn{min-width:120px}
         

      `;
      document.head.appendChild(style);
    }
  } catch {}
  // Helper function to get character element
  const getCharacterElement = (classId: string): string => {
    switch (classId) {
      case 'vanguard': return 'KINETIC';
      case 'technomancer': return 'ARC';
      case 'pyromancer': return 'THERMAL';
      case 'voidrunner': return 'VOID';
      case 'shade': return 'VOID';
      case 'ember': return 'THERMAL';
      case 'nova': return 'KINETIC';
      case 'volt': return 'ARC';
      default: return 'KINETIC';
    }
  };

  // Helper function to get super ability descriptions
  const getSuperDescription = (classId: string, level: number): string => {
    switch (classId) {
      case 'vanguard':
        return level === 1 ? 'Shield Bash: Stun & damage' : level === 2 ? 'Guardian Wall: Protect allies' : 'Iron Fortress: Team invulnerability';
      case 'technomancer':
        return level === 1 ? 'Overload Spike: Chain lightning' : level === 2 ? 'Storm Cage: Trap enemies' : 'Ion Tempest: Massive AOE damage';
      case 'pyromancer':
        return level === 1 ? 'Ignite Burst: Burn & explode' : level === 2 ? 'Solar Flare: AOE burn' : 'Inferno Field: Continuous damage';
      case 'voidrunner':
        return level === 1 ? 'Gravitic Jab: Void pierce' : level === 2 ? 'Event Horizon: Suppress & damage' : 'Singularity: AOE void damage';
      case 'shade':
        return level === 1 ? 'Shadow Strike: Stealth damage' : level === 2 ? 'Dark Veil: Hide team' : 'Abyssal Night: Mass debuff';
      case 'ember':
        return level === 1 ? 'Flame Touch: Burn target' : level === 2 ? 'Burning Path: Fire trail' : 'Wildfire: Spread burns';
      case 'nova':
        return level === 1 ? 'Light Burst: Blind enemies' : level === 2 ? 'Stellar Wind: Push back' : 'Supernova: Massive explosion';
      case 'volt':
        return level === 1 ? 'Static Shock: Stun target' : level === 2 ? 'Lightning Arc: Chain damage' : 'Thunderstorm: AOE shock';
      default:
        return level === 1 ? 'Super L1: Basic super' : level === 2 ? 'Super L2: Enhanced super' : 'Super L3: Ultimate super';
    }
  };

  // Party member card rendering using consistent layout with party select screen
  const renderPartyCard = (member: PartyMember, isActive: boolean = false, isDead: boolean = false, opts?: { index?: number; isHealTargeting?: boolean; isValidHeal?: boolean; isSelectedHeal?: boolean; predictedHeal?: number; invalidReason?: string; isEnemyTurn?: boolean; isTakingDamage?: boolean; }) => {
    const data: PmCardData = {
      id: member.actorId,
      name: member.name,
      role: member.classId,
      status: isDead ? 'DOWN' : isActive ? 'ACTIVE' : 'ACTIVE',
      primes: (member.primes || []).map(p => ({ type: (p.element.charAt(0).toUpperCase() + p.element.slice(1)) as any })),
      stats: {
        sh: { cur: member.bars.sh, max: 100 },
        hp: { cur: member.bars.hp, max: 100 },
        sp: { cur: member.bars.sp, max: 100 },
      },
    };
    // Only show turn glow when it's player's turn AND this member is active
    const turnClass = (isActive && !opts?.isEnemyTurn) ? 'is-turn' : '';
    // Add shake animation class when taking damage (regardless of turn)
    const damageClass = opts?.isTakingDamage ? 'is-taking-damage' : '';
    const healClass = opts?.isHealTargeting ? (opts?.isSelectedHeal ? 'is-heal-selected' : (opts?.isValidHeal ? 'is-heal-valid' : 'is-heal-invalid')) : '';
    
    const sh = member.bars.sh;
    const hp = member.bars.hp;
    const sp = member.bars.sp;
    
    // Super energy calculation
    const superEnergy = Math.max(0, Math.min(300, (member as any).superEnergy ?? 0));
    const superPct = Math.round((superEnergy / 300) * 100);
    const canUseSuper = Math.floor(superEnergy / 100) >= 1 && !isDead;  // Removed isActive check - supers can be used anytime
    const superTierClass = superEnergy >= 300 ? 'super-l3' : superEnergy >= 200 ? 'super-l2' : superEnergy >= 100 ? 'super-l1' : '';
    
    // Debug logging for damage class
    if (opts?.isTakingDamage) {
      console.log(`🎯 Rendering ${member.name} with damage class: ${damageClass}`);
      console.log(`🎯 ${member.name} will get class: "char-card battle-char-card ${turnClass} ${healClass} ${superTierClass} ${damageClass}"`);
      console.log(`🎯 ${member.name} damageClass value: "${damageClass}"`);
      console.log(`🎯 ${member.name} opts.isTakingDamage: ${opts.isTakingDamage}, opts.isEnemyTurn: ${opts.isEnemyTurn}`);
    }
    
    // Use compact card layout for battle screen
    const superTier = Math.floor(superEnergy / 100);
    const superLabel = superTier === 3 ? 'SUPER L3' : superTier === 2 ? 'SUPER L2' : superTier === 1 ? 'SUPER L1' : '';
    
    return `
      <div class="char-card battle-char-card ${turnClass} ${healClass} ${superTierClass} ${damageClass}" data-actor-id="${data.id}" ${opts?.index !== undefined ? `data-ally-index="${opts.index}"` : ''} ${opts?.invalidReason ? `title="${opts.invalidReason}"` : ''}>
        <div class="pm-avatar-wrap">
          <img class="pm-strip-avatar" src="${CLASS_ICON[member.classId]}" alt="${data.name}" />
        </div>
        <div class="pm-strip-name">${data.name}</div>
        <div class="pm-strip-status pm-strip-status--${isDead ? 'down' : 'active'} pm-element--${getCharacterElement(member.classId).toLowerCase()}">${isDead ? 'DOWN' : data.name}</div>
        
        <div class="pm-strip-stats">
          <div class="pm-stat-mini">
            <div class="pm-stat-line">SH: <span class="pm-stat-current">${fmt(sh)}</span><span class="pm-stat-max">/100</span></div>
          </div>
          <div class="pm-stat-mini" style="margin-top: 4px">
            <div class="pm-stat-line">HP: <span class="pm-stat-current">${fmt(hp)}</span><span class="pm-stat-max">/100</span></div>
          </div>
          <div class="pm-stat-mini" style="margin-top: 4px">
            <div class="pm-stat-line">SUPER: <span class="pm-stat-current">${superEnergy}</span><span class="pm-stat-max">/300</span></div>
          </div>
        </div>
        
        <div class="pm-super-slot">
          ${superEnergy >= 100 ? `
            <button class="pm-super-box" data-use-super-tier="1" data-actor-id="${member.actorId}" aria-label="Use Super L1" style="font-size: 8px; text-align: center; padding: 3px; font-weight: 600; margin-bottom: 1px;">
              ${getSuperDescription(member.classId, 1)}
            </button>
          ` : ''}
          ${superEnergy >= 200 ? `
            <button class="pm-super-box" data-use-super-tier="2" data-actor-id="${member.actorId}" aria-label="Use Super L2" style="font-size: 8px; text-align: center; padding: 3px; font-weight: 600; margin-bottom: 1px;">
              ${getSuperDescription(member.classId, 2)}
            </button>
          ` : ''}
          ${superEnergy >= 300 ? `
            <button class="pm-super-box" data-use-super-tier="3" data-actor-id="${member.actorId}" aria-label="Use Super L3" style="font-size: 8px; text-align: center; padding: 3px; font-weight: 600; margin-bottom: 1px;">
              ${getSuperDescription(member.classId, 3)}
            </button>
          ` : ''}
        </div>
      </div>
    `;
  };

  const renderEnemies = () => {
    const s = getState();
    const buckets: Record<'Grunt'|'Elite'|'Miniboss'|'Boss', string[]> = {
      Grunt: [], Elite: [], Miniboss: [], Boss: []
    };
    const getTierFromTags = (tags: string[] | undefined): 'Grunt'|'Elite'|'Miniboss'|'Boss' => {
      if (!tags) return 'Grunt';
      if (tags.includes('Boss')) return 'Boss';
      if (tags.includes('Miniboss')) return 'Miniboss';
      if (tags.includes('Elite')) return 'Elite';
      return 'Grunt';
    };
    for (let i = 0; i < s.enemies.length; i++) {
      const enemy = s.enemies[i];
      const isDead = enemy.bars.hp <= 0;
      const inst = getEnemyInstance(enemy.id) || { tags: [] };
      const tier = getTierFromTags(inst.tags as string[] | undefined);
      const isSelected = i === s.targetIndex;
      buckets[tier].push(renderEnemyThumb(enemy, i, isDead, isSelected));
    }

    // Create a fixed 4×2 grid (8 slots total)
    const gridSlots: (string | null)[] = new Array(8).fill(null);
    
    // Helper function to find next available slot that can fit the enemy size
    const findNextSlot = (size: number, startFrom: number = 0): number => {
      for (let slot = startFrom; slot < 8; slot++) {
        const row = Math.floor(slot / 4);
        const col = slot % 4;
        
        // Check if the enemy fits within the current row
        if (col + size <= 4) {
          // Check if all required slots are available
          let canPlace = true;
          for (let i = 0; i < size; i++) {
            if (gridSlots[slot + i] !== null) {
              canPlace = false;
              break;
            }
          }
          if (canPlace) {
            return slot;
          }
        }
        
        // If we can't fit in current row, jump to next row
        if (col + size > 4) {
          slot = (row + 1) * 4 - 1; // -1 because loop will increment
        }
      }
      return -1; // No slot found
    };
    
    // Place Boss enemies first (they take 3 slots)
    for (const boss of buckets.Boss) {
      const slot = findNextSlot(3);
      if (slot !== -1) {
        gridSlots[slot] = boss;
        gridSlots[slot + 1] = ''; // Mark as occupied
        gridSlots[slot + 2] = ''; // Mark as occupied
      }
    }
    
    // Place Miniboss enemies (they take 2 slots)
    for (const miniboss of buckets.Miniboss) {
      const slot = findNextSlot(2);
      if (slot !== -1) {
        gridSlots[slot] = miniboss;
        gridSlots[slot + 1] = ''; // Mark as occupied
      }
    }
    
    // Place Elite enemies (they take 1 slot)
    for (const elite of buckets.Elite) {
      const slot = findNextSlot(1);
      if (slot !== -1) {
        gridSlots[slot] = elite;
      }
    }
    
    // Place Grunt enemies (they take 1 slot)
    for (const grunt of buckets.Grunt) {
      const slot = findNextSlot(1);
      if (slot !== -1) {
        gridSlots[slot] = grunt;
      }
    }
    
    // Render the fixed grid
    const rows: string[] = [];
    for (let row = 0; row < 2; row++) {
      const rowStart = row * 4;
      const rowSlots = gridSlots.slice(rowStart, rowStart + 4);
      
      const rowHtml = rowSlots.map((slot, colIndex) => {
        if (slot === null) {
          return '<div class="enemy-grid-slot enemy-grid-slot--span-3"></div>';
        } else if (slot === '') {
          return ''; // Don't render occupied slots - they're spanned by larger enemies
        } else {
          // Determine if this is a larger enemy and set appropriate spanning
          const isMiniboss = slot.includes('enemy-thumb--miniboss');
          const isBoss = slot.includes('enemy-thumb--boss');
          const spanClass = isBoss ? 'enemy-grid-slot--span-3' : isMiniboss ? 'enemy-grid-slot--span-2' : '';
          return `<div class="enemy-grid-slot ${spanClass}">${slot}</div>`;
        }
      }).join('');
      
      rows.push(`
        <div class="enemy-grid-row">
          ${rowHtml}
        </div>
      `);
    }
    
    return `
      <div class="enemy-grid-container">
        ${rows.join('')}
      </div>
    `;
  };

  // Legacy card rendering for enemies (keeping the old function for compatibility)
  const renderCard = (actor: Actor, isSelected: boolean = false, isDead: boolean = false) => {
    // Enhanced prime display with stacking indicators
    const primeCounts = new Map<string, number>();
    if (Array.isArray(actor.primes)) {
      actor.primes.forEach(p => {
        primeCounts.set(p.element, (primeCounts.get(p.element) || 0) + 1);
      });
    }
    
    let primeDisplay = '';
    if (primeCounts.size > 0) {
      primeDisplay = Array.from(primeCounts.entries())
        .map(([type, count]) => {
          const isStacked = count > 1;
          const stackClass = isStacked ? 'chip--stacked' : '';
          const countBadge = isStacked ? `<span class="chip-count">${count}</span>` : '';
          return `<span class="chip chip--${type} ${stackClass}" title="${type}${isStacked ? ` (${count}x)` : ''}">${type}${countBadge}</span>`;
        })
        .join('');
    } else {
      primeDisplay = '<span class="chip chip--empty">No Primes</span>';
    }
    
    const cardClasses = ['card'];
    if (isDead) cardClasses.push('is-dead');
    
    return `
      <div class="${cardClasses.join(' ')}">
        <div class="card-head">
          <h3>${actor.name}</h3>
          <div class="chips">${primeDisplay}</div>
        </div>
        
        <div class="meters">
          <label>SH</label>
          <div class="meter meter--sh">
            <div style="width: ${actor.maxBars.sh > 0 ? (actor.bars.sh / actor.maxBars.sh) * 100 : 0}%"></div>
            <span>${actor.bars.sh}/${actor.maxBars.sh}</span>
          </div>
          
          <label>HP</label>
          <div class="meter meter--hp">
            <div style="width: ${actor.maxBars.hp > 0 ? (actor.bars.hp / actor.maxBars.hp) * 100 : 0}%"></div>
            <span>${actor.bars.hp}/${actor.maxBars.hp}</span>
          </div>
          
          <label>SP</label>
          <div class="meter meter--sp">
            <div style="width: ${actor.maxBars.sp > 0 ? (actor.bars.sp / actor.maxBars.sp) * 100 : 0}%"></div>
            <span>${actor.bars.sp}/${actor.maxBars.sp}</span>
          </div>
        </div>
      </div>
    `;
  };

  // Helper function to get enemy icon path based on faction and tier
  const getEnemyIconPath = (faction: string, tier: string): string => {
    const factionMap: Record<string, string> = {
      'Voidborn': 'Voidborn Sentinel',
      'Syndicate': 'Syndicate Raptor',
      'Accord': 'Accord Trooper',
      'Outlaws': 'Outlaw Scrapper'
    };
    
    const tierMap: Record<string, string> = {
      'Grunt': 'Grunt',
      'Elite': 'Elite',
      'Miniboss': 'MiniBoss',
      'Boss': 'Boss'
    };
    
    const baseName = factionMap[faction] || 'Voidborn Sentinel';
    const tierName = tierMap[tier] || 'Grunt';
    
    // Use the dynamic import mapping instead of hardcoded paths
    const iconKey = `${baseName} ${tierName}`;
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normalizedKey = normalize(iconKey);
    
    // Try to find the icon in our dynamic imports
    if (ENEMY_ICON_URLS[normalizedKey]) {
      return ENEMY_ICON_URLS[normalizedKey];
    }
    
    // Fallback to the existing resolveEnemyIcon function
    const fallbackIcon = resolveEnemyIcon(iconKey);
    if (fallbackIcon) {
      return fallbackIcon;
    }
    
    // Final fallback - return a placeholder or empty string
    console.warn(`Could not find enemy icon for: ${iconKey} (normalized: ${normalizedKey})`);
    return '';
  };

  // Generate death particle effects for dying enemies
  const generateDeathParticles = (actor: Actor, tier: 'Grunt'|'Elite'|'Miniboss'|'Boss') => {
    const particles = [];
    const particleCount = tier === 'Boss' ? 8 : tier === 'Miniboss' ? 6 : tier === 'Elite' ? 4 : 2;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const distance = 20 + Math.random() * 30;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      
      particles.push(`
        <div class="enemy-thumb__death-particle" 
             style="--particle-x: ${x}px; --particle-y: ${y}px; 
                    left: 50%; top: 50%; margin-left: -2px; margin-top: -2px; 
                    animation-delay: ${i * 0.1}s;"></div>
      `);
    }
    
    return `<div class="enemy-thumb__death-particles">${particles.join('')}</div>`;
  };

  // Compact enemy thumb for mobile with new primer system
  const renderEnemyThumb = (actor: Actor, idx: number, isDead: boolean = false, isSelected: boolean = false) => {
    const shPct = actor.maxBars.sh > 0 ? Math.round((actor.bars.sh / actor.maxBars.sh) * 100) : 0;
    const hpPct = actor.maxBars.hp > 0 ? Math.round((actor.bars.hp / actor.maxBars.hp) * 100) : 0;
    
    // Enhanced death state handling with animation classes
    let deadClass = '';
    if (isDead) {
      // Check if this enemy was just killed (has death animation state)
      const wasJustKilled = (actor as any)._deathAnimationState === 'dying';
      const hasPlayedDeathAnimation = (actor as any)._deathAnimationPlayed === true;
      const wasAlreadyDead = (actor as any)._wasDeadInPreviousRender === true;
      
      // Only play death animation if:
      // 1. Enemy is marked as dying
      // 2. Death animation hasn't been played yet
      // 3. Enemy wasn't already dead in previous render
      if (wasJustKilled && !hasPlayedDeathAnimation && !wasAlreadyDead) {
        deadClass = 'is-dying';
        // Mark that we've played the death animation for this enemy
        (actor as any)._deathAnimationPlayed = true;
      } else {
        deadClass = 'is-dead';
      }
      
      // Mark that this enemy is now dead for future renders
      (actor as any)._wasDeadInPreviousRender = true;
    } else {
      // Enemy is alive, reset the dead flag
      (actor as any)._wasDeadInPreviousRender = false;
    }
    
    const selClass = isSelected ? 'is-selected' : '';
    const hasPrimes = Array.isArray(actor.primes) && actor.primes.length > 0;
    const firstPrime = hasPrimes ? (actor.primes[0]?.element || '').toLowerCase() : '';
    const primeClass = hasPrimes ? `has-primes prime-elem--${firstPrime}` : '';
    const autoTargetedClass = (actor as any)._autoTargeted ? 'auto-targeted' : '';
    const inst = getEnemyInstance(actor.id) || { tags: [], faction: 'Voidborn' };
    const tags = (inst.tags as string[] | undefined) || [];
    const tier: 'Grunt'|'Elite'|'Miniboss'|'Boss' = tags.includes('Boss') ? 'Boss' : tags.includes('Miniboss') ? 'Miniboss' : tags.includes('Elite') ? 'Elite' : 'Grunt';
    
    // Get faction for icon selection
    const faction = inst.faction || 'Voidborn';
    const iconPath = getEnemyIconPath(faction, tier);
    
    // Determine card size based on tier
    let cardSizeClass = '';
    let cardWidth = '';
    if (tier === 'Boss') {
      cardSizeClass = 'enemy-thumb--boss';
      cardWidth = 'width: 256px;'; // 3 columns + 2 gaps
    } else if (tier === 'Miniboss') {
      cardSizeClass = 'enemy-thumb--miniboss';
      cardWidth = 'width: 168px;'; // 2 columns + 1 gap
    } else {
      cardSizeClass = 'enemy-thumb--standard';
      cardWidth = 'width: 80px;'; // 1 column
    }
    
    // New primer system: Two balanced rows layout
    // Row 1: Stats (SH left, HP right) with labels stacked above numbers
    // Row 2: Primer slots (Slot 1 under SH, Slot 2 under HP)
    const primes = Array.isArray(actor.primes) ? actor.primes : [];
    const slot1Prime = primes[0]?.element || null;
    const slot2Prime = primes[1]?.element || null;
    
    // Generate primer slot dots with element colors and subtle glow
    const renderSlotDot = (slotIndex: number, primeElement: string | null) => {
      if (!primeElement) {
        return `<div class="enemy-thumb__slot-dot" title="Empty slot ${slotIndex + 1}"></div>`;
      }
      const elementClass = `enemy-thumb__slot-dot--${primeElement.toLowerCase()}`;
      const elementName = primeElement.charAt(0).toUpperCase() + primeElement.slice(1);
      return `<div class="enemy-thumb__slot-dot ${elementClass}" title="${elementName} prime in slot ${slotIndex + 1}"></div>`;
    };
    
    // Handle grunts (no SH display) vs other tiers
    const showShield = tier !== 'Grunt';
    
    // For grunts, we need to adjust the grid to use full width for HP
    const gridClass = showShield ? 'enemy-thumb__stats-grid' : 'enemy-thumb__stats-grid enemy-thumb__stats-grid--grunt';
    
    // Generate death particles if enemy is dying
    const deathParticles = deadClass === 'is-dying' ? generateDeathParticles(actor, tier) : '';
    
    const statsDisplay = `
      <img class="enemy-thumb__icon" src="${iconPath}" alt="${faction} ${tier}" onerror="this.style.display='none'">
      <div class="enemy-thumb__simple-layout">
        <div class="enemy-thumb__stat-line">
          ${showShield ? `<span class="enemy-thumb__sh-value"><span class="enemy-thumb__shield">🛡</span>${fmt(actor.bars.sh)}</span>` : ''}
          <span class="enemy-thumb__hp-value">
            <span class="enemy-thumb__heart">♥</span>${fmt(actor.bars.hp)}
          </span>
        </div>
        <div class="enemy-thumb__primer-dots">
          ${renderSlotDot(0, slot1Prime)}
          ${renderSlotDot(1, slot2Prime)}
        </div>
      </div>
    `;
    
    // Check if enemy is taking damage
    const damageClass = (actor as any)._isTakingDamage ? 'is-taking-damage' : '';
    
    return `
      <button class="enemy-thumb ${deadClass} ${selClass} ${primeClass} ${cardSizeClass} ${autoTargetedClass} ${damageClass}" 
        data-enemy-index="${idx}" 
        aria-label="${actor.name}" 
        aria-pressed="${isSelected}" 
        tabindex="0"
        style="${cardWidth} height: 94px; position: relative;">
        <div class="enemy-thumb__content">
          ${statsDisplay}
        </div>
        ${deathParticles}
      </button>
    `;
  };

  // New ability button generation with tabs and filtering for the active party member
  const generateAbilityButtons = () => {
    const s = getState();
    const activeMember = s.party[s.activePartyIndex];
    if (!activeMember) return '';
    
    // Get abilities for the active party member
    const abilities = activeMember.abilityIds.map(id => ABILITY_BY_ID[id]).filter(Boolean) as Ability[];
    const sustainAbility = abilities.find(a => a.tags?.sustain || a.role === 'sustain');
    const offensiveAbilities = abilities.filter(a => a.id !== sustainAbility?.id);
    
    // Handle case when member has no abilities
    if (abilities.length === 0) {
      return `
        <div class="no-abilities">
          <div class="no-abilities-message">
            <h3>${activeMember.name} has no abilities equipped</h3>
            <p>Return to loadout to assign abilities to this character.</p>
          </div>
        </div>
      `;
    }
    
    const cds = (s.cooldownsByMember || {})[activeMember.actorId] || {};
    // Inject Basic/Defend buttons with unique style at the start
    const basicBtn = (() => {
      const isSel = s.selectedAbilityId === '__basic';
      const active = s.party[s.activePartyIndex];
      const wid = active?.weaponId;
      const w = wid ? WEAPON_BY_ID[wid] : undefined;
      const basicType = (w?.basicType) ?? 'kinetic';
      const typeCls = `ability--${basicType}`;
      
      // Create weapon element label if weapon has an element
      let elementLabel = '';
      if (w?.basicType) {
        const elementName = w.basicType.charAt(0).toUpperCase() + w.basicType.slice(1);
        const elementClass = `weapon-element weapon-element--${w.basicType}`;
        elementLabel = `<span class="${elementClass}">${elementName}</span>`;
      }
      
      return `<button id=\"AbilityBasic\" class=\"ability ${typeCls} ${isSel ? 'is-selected' : ''}\" data-ability-id=\"__basic\" type=\"button\" role=\"button\" aria-pressed=\"${isSel}\" aria-label=\"Attack\" style=\"height: 78px !important; min-height: 78px !important; max-height: 78px !important; display: flex; flex-direction: column; justify-content: space-between;\"><div class=\"ability-header\"><span class=\"ability-name\">Attack</span>${elementLabel}</div><div class=\"ability-effect\">Gain Super</div></button>`;
    })();
    const sustainBtn = (() => {
      // Prefer the player's chosen sustain; fallback to class defensive if none found
      const active = s.party[s.activePartyIndex];
      const abil = sustainAbility || (() => {
        const mappedId = active ? DEFENSIVE_BY_CLASS[active.classId] : undefined;
        return mappedId ? ABILITY_BY_ID[mappedId] : undefined;
      })();
      if (!abil) {
        // No sustain available — render a disabled placeholder to keep grid shape
        return `<button class=\"ability ability--void\" type=\"button\" disabled style=\"height: 78px !important; min-height: 78px !important; max-height: 78px !important; display: flex; flex-direction: column; justify-content: space-between;\"><div class=\"ability-header\"><span class=\"ability-name\">Sustain</span><span class=\"ability-role\">Defensive</span></div><div class=\"ability-effect\">None equipped</div></button>`;
      }
      const isSel = s.selectedAbilityId === abil.id;
      const cds = (s.cooldownsByMember || {})[active?.actorId || ''] || {};
      const cdLeft = cds[abil.id] || 0;
      const superNow = Math.floor((active as any)?.superEnergy ?? 0);
      const superNeed = Math.floor(abil?.superCost ?? 0);
      const disabled = cdLeft > 0 || superNow < superNeed;
      const typeCls = `ability--${abil.type}`;
      // Copy from sustain effect block further below
      let effect = '';
      if (abil.id === 'heal') effect = 'Heal (single target).';
      else if (abil.id === 'barrier') effect = 'Gain shields (barrier).';
      else if (abil.id === 'cleanse') effect = 'Cleanse burns/suppress. +SH';
      else if (abil.id === 'guard') effect = 'Guard allies (redirect).';
      else if (abil.id === 'kinetic-barrier') effect = 'Barrier + strong heal (ally).';
      else if (abil.id === 'arc-restore') effect = 'Big heal + Super regen (single).';
      else if (abil.id === 'thermal-burst-sustain') effect = 'AOE heal (allies).';
      else if (abil.id === 'void-drain') effect = 'Lifesteal heal (self).';
      return `<button id=\"AbilitySustain\" class=\"ability ${typeCls} ${isSel ? 'is-selected' : ''}\" data-ability-id=\"${abil.id}\" type=\"button\" role=\"button\" aria-pressed=\"${isSel}\" aria-label=\"${abil.name}\" ${disabled ? 'disabled' : ''} style=\"height: 78px !important; min-height: 78px !important; max-height: 78px !important; display: flex; flex-direction: column; justify-content: space-between;\"><div class=\"ability-header\"><span class=\"ability-name\">${abil.name}</span><span class=\"ability-role\">Defensive</span></div><div class=\"ability-effect\">${effect}</div></button>`;
    })();
    
    // Create a 2x3 grid layout: 2 columns, 3 rows
    // Row 1: Basic Attack, Sustain
    // Row 2: Offensive Ability 1, Offensive Ability 2  
    // Row 3: Offensive Ability 3, Offensive Ability 4
    
    const offensiveAbilitiesHtml = offensiveAbilities.slice(0, 4).map((ability, i) => {
      const isSelected = ability.id === s.selectedAbilityId;
      const role = ability.role === 'detonator' ? 'det' : 'prime';
      const cd = cds[ability.id] || 0;
      const isSustain = !!ability.tags?.sustain;
      
      // Check if this is an AOE ability
      const isAOE = ability.tags?.AOE;
      const aoeIndicator = isAOE ? ' [AOE]' : '';
      
      // Generate standardized role/effect copy
       let effect = '';
      const tgt = s.enemies[s.targetIndex];
      const hasAnyPrimes = Array.isArray(tgt.primes) && tgt.primes.length > 0;
      if (ability.role === 'detonator') {
        effect = 'Detonates existing primes.';
      } else {
        effect = `Primes target.`;
      }
      // Sustain effect copy overrides
      if (isSustain) {
        if (ability.id === 'heal') effect = 'Heal (single target).';
        else if (ability.id === 'barrier') effect = 'Gain shields (barrier).';
        else if (ability.id === 'cleanse') effect = 'Cleanse burns/suppress. +SH';
        else if (ability.id === 'guard') effect = 'Guard allies (redirect).';
        else if (ability.id === 'kinetic-barrier') effect = 'Barrier + strong heal (ally).';
        else if (ability.id === 'arc-restore') effect = 'Big heal + Super regen (single).';
        else if (ability.id === 'thermal-burst-sustain') effect = 'AOE heal (allies).';
        else if (ability.id === 'void-drain') effect = 'Lifesteal heal (self).';
      }
      
      // Special descriptions for AOE abilities
      if (isAOE) {
        if (ability.id === 'nova_aoe_suppressive_barrage') {
          effect = 'Area: 3 random targets. Ignores 10% shields.';
        } else if (ability.id === 'volt_aoe_static_surge') {
          effect = 'Area: all targets. Double vs shields.';
        } else if (ability.id === 'ember_aoe_emberwave') {
          effect = 'Area: 2 random targets. Applies Burn.';
        } else if (ability.id === 'shade_aoe_entropy_collapse') {
          effect = 'Area: 2 random targets. Detonates + Suppress.';
        }
      }
      
      // Check if ability is compatible with current target
       const tgt2 = s.enemies[s.targetIndex];
       let isCompatible = true;
      if (ability.role === 'prime') {
        // Prime abilities are always compatible
        isCompatible = true;
      } else if (ability.role === 'detonator') {
        // Detonator abilities can always be used (deal base damage)
        // They're even better when primes are present
        isCompatible = true;
      }
      
      return `
        <button class=\"ability ability--${ability.type} ${isSelected ? 'is-selected' : ''}\" 
                data-ability-id=\"${ability.id}\" 
                data-role=\"${role}\"
                data-ok=\"${isCompatible}\"
                ${(!isCompatible || cd > 0) ? 'disabled' : ''}
                style=\"height: 78px !important; min-height: 78px !important; max-height: 78px !important; display: flex; flex-direction: column; justify-content: space-between;\">
          <div class=\"ability-header\">
            <span class=\"ability-name\">${ability.name}${aoeIndicator}</span>
            <span class=\"ability-role ability-role--${ability.role === 'detonator' ? 'detonator' : 'primer'}\">${ability.role === 'detonator' ? 'Detonator' : 'Primer'}</span>
          </div>
          <div class=\"ability-effect\">${cd > 0 ? `CD ${cd}` : isSustain ? `${effect}` : `${effect} D ${ability.baseDamage}`}</div>
        </button>
      `;
    }).join('');
    
    // Fill remaining offensive slots with placeholders if needed
    const remainingOffensiveSlots = 4 - offensiveAbilities.length;
    const placeholderSlots = Array.from({ length: remainingOffensiveSlots }, (_, i) => 
      `<button class=\"ability ability--void\" type=\"button\" disabled style=\"height: 78px !important; min-height: 78px !important; max-height: 78px !important; display: flex; flex-direction: column; justify-content: space-between;\"><div class=\"ability-header\"><span class=\"ability-name\">Empty</span><span class=\"ability-role\">Slot</span></div><div class=\"ability-effect\">No ability equipped</div></button>`
    ).join('');
    
    return `
      <div class=\"ability-tray\">
        ${basicBtn}
        ${sustainBtn}
        ${offensiveAbilitiesHtml}
        ${placeholderSlots}
      </div>
    `;
  };

  // New main layout with party display and fixed footer
  root.innerHTML = `
    <div class="app battle-mobile h-[100dvh] w-full mx-auto bg-slate-950 text-slate-100 flex flex-col">
      <div class="battle-bg">
        <div class="battle-bg__layer" data-bg="a"></div>
        <div class="battle-bg__layer" data-bg="b"></div>
      </div>
      <div class="main flex-1 overflow-y-auto">
        <!-- Enemy row: compact grid of enemy cards -->
         <div class="enemy-row">
          <div class="enemy-cards text-[11px]"></div>
         </div>
         <div class="battle-divider" role="separator" aria-hidden="true"></div>
        
        <!-- Party strip: horizontal, scrollable -->
         <div class="party-row">
          <div class="party-cards pm-compact"></div>
         </div>
        

        
        <!-- Log: small height, scrollable -->
         <div id="log" class="log">
          <div id="logContent" class="log-content text-[11px] leading-snug"></div>
        </div>
        
        <!-- Abilities: scrollable tray -->
        <div id="abilities"></div>
      </div>

      <!-- Fixed Battle Footer -->
      <div class="battle-footer">
        <div class="battle-footer-actions">
          ${onReturnToLoadout ? '<button class="battle-footer-btn" id="btnReturnToLoadout">Escape</button>' : '<button class="battle-footer-btn" id="btnEscape">Escape</button>'}
          <button class="battle-footer-btn" id="btnEnd">End Turn</button>
          <button class="battle-footer-btn battle-footer-btn--primary" id="btnUse">Use</button>
        </div>
      </div>
    </div>
        
        <!-- Victory/Defeat overlay -->
        ${getState().isOver ? `
          <div class="battle-result-overlay">
            <div class="battle-result">
              <h2>${getState().party.filter(m => m.bars.hp > 0).length > 0 ? 'Victory!' : 'Defeat!'}</h2>
              ${getState().party.filter(m => m.bars.hp > 0).length > 0 ? 
                `<div class="victory-narrative">
                  <p class="victory-text">${getCurrentMissionVictoryText()}</p>
                </div>` : 
                '<p>All party members have been defeated!</p>'
              }
              <div class="battle-result-buttons">
                <button class="btn btn--primary" id="btnBattleAgain">Battle Again</button>
                <button class="btn ghost" id="btnMissionSelect">Mission Select</button>
              </div>
            </div>
          </div>
        ` : ''}
  `;

  // Background preloader + crossfade fader
  function preloadImage(url: string): Promise<void> {
    return new Promise((resolve) => {
      if (!url) { resolve(); return; }
      const img = new Image();
      img.onload = () => {
        try {
          const p = (img as any).decode?.();
          if (p && typeof p.then === 'function') {
            p.then(() => resolve(), () => resolve());
          } else {
            resolve();
          }
        } catch { resolve(); }
      };
      img.onerror = () => resolve();
      img.src = url;
    });
  }

  function makeBackgroundFader(scope: HTMLElement) {
    const a = scope.querySelector('.battle-bg [data-bg="a"]') as HTMLElement;
    const b = scope.querySelector('.battle-bg [data-bg="b"]') as HTMLElement;
    let showing = a;
    let hidden = b;

    const setInitial = (url: string) => {
      if (!showing) return;
      showing.style.backgroundImage = `url('${url}')`;
      showing.classList.add('is-visible');
    };

    const setBackground = async (url: string) => {
      if (!hidden || !showing) return;
      await preloadImage(url);
      hidden.style.backgroundImage = `url('${url}')`;
      hidden.classList.add('is-visible');
      showing.classList.remove('is-visible');
      [showing, hidden] = [hidden, showing];
    };

    return { setInitial, setBackground };
  }

  const { setInitial: setBgInitial, setBackground: setBattleBackground } = makeBackgroundFader(root);
  // Initialize with a safe default image if available
  try {
    const defaultBg = ENEMY_ICON_URLS['enemyhero'];
    if (defaultBg) setBgInitial(defaultBg);
  } catch {}

  const els = {
    log: root.querySelector('#log') as HTMLElement,
    logContent: root.querySelector('#logContent') as HTMLElement,
    abilitiesContainer: root.querySelector('#abilities') as HTMLElement,
    partyCardsContainer: root.querySelector('.party-cards') as HTMLElement,
    enemyCardsContainer: root.querySelector('.enemy-cards') as HTMLElement,
    btnUse: root.querySelector('#btnUse') as HTMLButtonElement,
    btnEnd: root.querySelector('#btnEnd') as HTMLButtonElement,
    // These buttons don't exist in our current HTML structure
    btnNextMember: root.querySelector('#btnNextMember') as HTMLButtonElement | null,
    btnCancelTargeting: root.querySelector('#btnCancelTargeting') as HTMLButtonElement | null,
  };

  // Debug: Check if containers were found
  console.log('🔍 CONTAINER SELECTION RESULTS:');
  console.log('📝 Log:', !!els.log);
  console.log('📝 LogContent:', !!els.logContent);
  console.log('⚔️ Abilities:', !!els.abilitiesContainer);
  console.log('👥 PartyCards:', !!els.partyCardsContainer);
  console.log('👹 EnemyCards:', !!els.enemyCardsContainer);
  console.log('🎮 BtnUse:', !!els.btnUse);
  console.log('🎮 BtnEnd:', !!els.btnEnd);
  
  // Debug: Check if root has the expected HTML structure
  console.log('🏗️ Root HTML structure check:');
  console.log('  - Has #abilities:', !!root.querySelector('#abilities'));
  console.log('  - Has .party-cards:', !!root.querySelector('.party-cards'));
  console.log('  - Has .enemy-cards:', !!root.querySelector('.enemy-cards'));
  console.log('  - Has #btnUse:', !!root.querySelector('#btnUse'));
  console.log('  - Has #btnEnd:', !!root.querySelector('#btnEnd'));

  // Throttled render via subscribe to reduce reflows
  let renderPending = false;
  const scheduleRender = () => {
    if (renderPending) return;
    renderPending = true;
    requestAnimationFrame(() => { 
      renderPending = false; 
      render(); 
    });
  };

  const unsubscribe = typeof subscribe === 'function' ? subscribe(() => scheduleRender()) : undefined as any;
  const lastTierByMember: Record<string, number> = {};
  const lastEnergyByMember: Record<string, number> = {};
  const activeTimeouts: number[] = [];

  // Event listeners for target navigation
  const onRootClick = (e: Event) => {
    const target = e.target as HTMLElement;
    // Super description box triggers highest-tier available super
    const superBox = target.closest('.pm-super-box') as HTMLElement | null;
    if (superBox) {
      const tierAttr = superBox.getAttribute('data-use-super-tier');
      const actorId = superBox.getAttribute('data-actor-id') || '';
      const tier = Math.max(1, Math.min(3, parseInt(tierAttr || '1', 10)));
      const s = getState();
      const idx = s.party.findIndex(m => m.actorId === actorId);
      if (idx !== -1) {
        const member = s.party[idx];
        if (canCastSuper(member as any, tier as any)) {
          const before = getState();
          const next = castSuperAnytime(before, actorId, tier as any);
          setState(next);
        }
      }
      return;
    }
    // Use Super L1/L2/L3 buttons under any party card (usable anytime)
    const superL1Btn = target.closest('[data-use-super-l1]') as HTMLElement | null;
    const superL2Btn = target.closest('[data-use-super-l2]') as HTMLElement | null;
    const superL3Btn = target.closest('[data-use-super-l3]') as HTMLElement | null;
    if (superL1Btn || superL2Btn || superL3Btn) {
      const actorId = (superL1Btn || superL2Btn || superL3Btn)!.getAttribute(superL1Btn ? 'data-use-super-l1' : superL2Btn ? 'data-use-super-l2' : 'data-use-super-l3')!;
      const s = getState();
      const idx = s.party.findIndex(m => m.actorId === actorId);
      if (idx !== -1) {
        const member = s.party[idx];
        const level = superL3Btn ? 3 : superL2Btn ? 2 : 1;
        if (canCastSuper(member as any, level as any)) {
          const before = getState();
          const next = castSuperAnytime(before, actorId, level as any);
          setState(next);
        }
      }
      return;
    }
    
    // Battle result buttons
    if (target.id === 'btnBattleAgain' && onReturnToLoadout) {
      onReturnToLoadout();
      return;
    }
    
    if (target.id === 'btnMissionSelect' && onMissionSelect) {
      onMissionSelect();
      return;
    }
    
    // Return to loadout button
    if (target.id === 'btnReturnToLoadout' && onReturnToLoadout) {
      onReturnToLoadout();
      return;
    }
    
    // Escape button (when no loadout return available)
    if (target.id === 'btnEscape') {
      // Could add escape logic here, for now just end turn or go to mission select
      if (onMissionSelect) {
        onMissionSelect();
      }
      return;
    }
    
    // Enemy card selection - support both legacy card and new thumb
    let enemyEl = target.closest('.enemy-thumb') as HTMLElement | null;
    if (!enemyEl) enemyEl = target.closest('.card') as HTMLElement | null;
    if (enemyEl) {
      const idxAttr = enemyEl.getAttribute('data-enemy-index');
      if (idxAttr) {
        const clickedIndex = parseInt(idxAttr, 10);
        if (!Number.isNaN(clickedIndex)) {
          // Clear damage flags from all enemies when target changes
          const currentState = getState();
          currentState.enemies.forEach(enemy => {
            if ((enemy as any)._isTakingDamage) {
              (enemy as any)._isTakingDamage = false;
            }
          });
          setState({ targetIndex: clickedIndex });
        }
      } else {
        const list = Array.from(root.querySelectorAll('.enemy-cards .enemy-thumb, .enemy-cards .card')) as HTMLElement[];
        const clickedIndex = list.indexOf(enemyEl);
        if (clickedIndex !== -1) {
          // Clear damage flags from all enemies when target changes
          const currentState = getState();
          currentState.enemies.forEach(enemy => {
            if ((enemy as any)._isTakingDamage) {
              (enemy as any)._isTakingDamage = false;
            }
          });
          setState({ targetIndex: clickedIndex });
        }
      }
    }
    
    // Party member selection (ally targeting or switching active)
    const partyCard = target.closest('.char-card') as HTMLElement | null;
    if (partyCard) {
      const s = getState();
      const cards = root.querySelectorAll('.char-card');
      const clickedIndex = Array.from(cards).indexOf(partyCard as HTMLElement);
      if (clickedIndex !== -1) {
        const abil = s.selectedAbilityId ? ABILITY_BY_ID[s.selectedAbilityId] : undefined;
        const healArmed = !!s.isTargetingAlly && !!s.armedAbilityId && !!abil?.tags?.sustain && (abil.id === 'heal' || abil.id === 'arc-restore');
        if (healArmed) {
          const m = s.party[clickedIndex];
          const valid = m && m.bars.hp > 0 && m.bars.hp < 100;
          if (valid) setState({ selectedAllyIndex: clickedIndex });
        } else {
          // Check if this member can be selected for their turn
          const clickedMember = s.party[clickedIndex];
          if (clickedMember && clickedMember.bars.hp > 0) {
            // Check if they've already acted this round
            const hasActed = s.partyMembersActedThisRound && clickedIndex < s.partyMembersActedThisRound;
            if (!hasActed) {
              setState({ activePartyIndex: clickedIndex });
            }
          }
        }
      }
    }
    
    // Ability selection: make entire card clickable
    const abilityEl = target.closest('.ability') as HTMLElement | null;
    if (abilityEl) {
      const abilityId = abilityEl.getAttribute('data-ability-id');
      if (abilityId) {
        const s = getState();
        if (s.selectedAbilityId !== abilityId) {
          const active = s.party[s.activePartyIndex];
          if (active) {
            const map = { ...(s.lastSelectedAbilityByMember || {}) } as NonNullable<BattleState['lastSelectedAbilityByMember']>;
            map[active.actorId] = abilityId;
            const abil = ABILITY_BY_ID[abilityId];
            if (abil?.tags?.sustain && (abil.id === 'heal' || abil.id === 'arc-restore' || abil.id === 'kinetic-barrier')) {
              // Arm ally targeting; preselect lowest HP ally
              const candidates = s.party.map((m, i) => ({ m, i })).filter(x => x.m.bars.hp > 0 && x.m.bars.hp < 100);
              const pick = candidates.sort((a, b) => a.m.bars.hp - b.m.bars.hp)[0];
              setState({ selectedAbilityId: abilityId, lastSelectedAbilityByMember: map, isTargetingAlly: true, armedAbilityId: abilityId, selectedAllyIndex: pick ? pick.i : undefined });
            } else {
              setState({ selectedAbilityId: abilityId, lastSelectedAbilityByMember: map, isTargetingAlly: false, armedAbilityId: undefined, selectedAllyIndex: undefined });
            }
          } else {
            setState({ selectedAbilityId: abilityId, isTargetingAlly: false, armedAbilityId: undefined, selectedAllyIndex: undefined });
          }
        }
        // Move focus to Use button to facilitate double-tap confirm
        try { (els.btnUse as HTMLButtonElement)?.focus(); } catch {}
      }
    }
  };
  root.addEventListener('click', onRootClick);

  // Swipe-to-cycle removed; abilities are shown in a grid and selected by tap

  // Generate ability buttons dynamically
  const render = () => {
    const s = getState();
    
    // Debug logging for render function
    console.log(`🎯 RENDER FUNCTION: turn=${s.turn}, party members with damage flags:`);
    s.party.forEach(member => {
      if ((member as any)._isTakingDamage) {
        console.log(`🎯 ${member.name} has _isTakingDamage=true`);
      }
    });
    
    // Render party cards with heal targeting visuals and preview
    const abilForHeal = s.selectedAbilityId ? ABILITY_BY_ID[s.selectedAbilityId] : undefined;
    const isHealTargeting = !!s.isTargetingAlly && !!s.armedAbilityId && !!abilForHeal?.tags?.sustain && (abilForHeal.id === 'heal' || abilForHeal.id === 'arc-restore' || abilForHeal.id === 'kinetic-barrier');
    const avgHeal = isHealTargeting ? Math.round(((BalanceSustain as any).healMin + (BalanceSustain as any).healMax) / 2) : 0;
    
    if (els.partyCardsContainer && s.party && s.party.length > 0) {
      const partyHTML = s.party.map((member, index) => {
        const isDead = member.bars.hp <= 0;
        const valid = isHealTargeting && !isDead && member.bars.hp < 100;
        const sel = isHealTargeting && index === (s.selectedAllyIndex ?? -1);
        const reason = isHealTargeting && (isDead ? 'Down' : member.bars.hp >= 100 ? 'Full HP' : '') || '';
        // Check if this member is taking damage (regardless of turn - damage should be visible even after turn switches)
        const isEnemyTurn = s.turn === 'enemy';
        const isTakingDamage = (member as any)._isTakingDamage; // Remove the isEnemyTurn requirement
        
        // Debug logging for damage state
        console.log(`🎯 Rendering ${member.name}: turn=${s.turn}, isEnemyTurn=${isEnemyTurn}, _isTakingDamage=${!!(member as any)._isTakingDamage}, isTakingDamage=${isTakingDamage}`);
        if ((member as any)._isTakingDamage) {
          console.log(`🎯 ${member.name} has damage flag set!`);
        }
        

        
        // Debug logging for renderPartyCard call
        if ((member as any)._isTakingDamage) {
          console.log(`🎯 Calling renderPartyCard for ${member.name}: isEnemyTurn=${isEnemyTurn}, isTakingDamage=${isTakingDamage}`);
        }
        
        return renderPartyCard(member, index === s.activePartyIndex, isDead, { 
          index, 
          isHealTargeting, 
          isValidHeal: valid, 
          isSelectedHeal: sel, 
          predictedHeal: sel ? avgHeal : 0, 
          invalidReason: reason,
          isEnemyTurn,
          isTakingDamage
        });
      }).join('');
      els.partyCardsContainer.innerHTML = partyHTML;
    } else {
      // Party container missing or no party members
    }
    

    
    // Track super tier changes without audio
    try {
      for (const m of s.party) {
        const energy = Math.max(0, Math.min(300, (m as any).superEnergy ?? 0));
        const tier = getSuperTier(energy as any);
        lastEnergyByMember[m.actorId] = energy;
        lastTierByMember[m.actorId] = tier as any;
      }
    } catch {}

    // Render enemy cards with tier-aware grids
    if (els.enemyCardsContainer) {
      const enemyHTML = renderEnemies();
      els.enemyCardsContainer.innerHTML = enemyHTML;
    } else {
      // Enemy container missing
    }
    
      // Ensure we have a valid selected ability for the active party member
  const activeMember = s.party[s.activePartyIndex];
  if (activeMember) {
    // If the active member is defeated, automatically advance to next living member
    if (activeMember.bars.hp <= 0) {
      let nextIndex = s.activePartyIndex;
      let attempts = 0;
      
      do {
        nextIndex = (nextIndex + 1) % s.party.length;
        attempts++;
      } while (s.party[nextIndex].bars.hp <= 0 && attempts < s.party.length);
      
      if (nextIndex !== s.activePartyIndex && s.party[nextIndex].bars.hp > 0) {
        setState({ 
          activePartyIndex: nextIndex,
          selectedAbilityId: undefined
        });
        return; // Will re-render with new state
      }
    }
    
    const abilities = activeMember.abilityIds.map(id => ABILITY_BY_ID[id]).filter(Boolean) as Ability[];
    const isSpecialSel = s.selectedAbilityId === '__basic' || s.selectedAbilityId === '__defend';
    const isAbilitySel = !!abilities.find(a => a.id === s.selectedAbilityId);
    if (!s.selectedAbilityId || (!isAbilitySel && !isSpecialSel)) {
      const remembered = (s.lastSelectedAbilityByMember || {})[activeMember.actorId];
      const rememberedIsSpecial = remembered === '__basic' || remembered === '__defend';
      const rememberedIsValid = rememberedIsSpecial || abilities.some(a => a.id === remembered);
      const nextSel = rememberedIsValid ? remembered! : '__basic';
      const map = { ...(s.lastSelectedAbilityByMember || {}) } as NonNullable<BattleState['lastSelectedAbilityByMember']>;
      map[activeMember.actorId] = nextSel;
      setState({ selectedAbilityId: nextSel, lastSelectedAbilityByMember: map });
      return; // Will re-render with new state
    }
  }
    
    // Update ability buttons
    if (els.abilitiesContainer) {
      const abilityHTML = generateAbilityButtons();
      els.abilitiesContainer.innerHTML = abilityHTML;
    } else {
      // Abilities container missing
    }
    
    // Update button states
    // Disable Use if selected ability is on cooldown for the active member
    let selectedOnCooldown = false;
    try {
      const active = s.party[s.activePartyIndex];
      if (active && s.selectedAbilityId && s.selectedAbilityId !== '__basic' && s.selectedAbilityId !== '__defend') {
        const cds = (s.cooldownsByMember || {})[active.actorId] || {};
        selectedOnCooldown = (cds[s.selectedAbilityId] || 0) > 0;
        // Also check super cost for sustains
        const sel = s.selectedAbilityId ? ABILITY_BY_ID[s.selectedAbilityId] : undefined;
        if (sel?.tags?.sustain) {
          const superNow = Math.floor((active as any)?.superEnergy ?? 0);
          const superNeed = Math.floor(sel?.superCost ?? 0);
          if (superNow < superNeed) selectedOnCooldown = true;
        }
      } else if (active && s.selectedAbilityId === '__defend') {
        // Mirror the defend button gating for Use
        const mappedId = DEFENSIVE_BY_CLASS[active.classId];
        const abil = ABILITY_BY_ID[mappedId];
        const cds = (s.cooldownsByMember || {})[active.actorId] || {};
        const cdLeft = abil ? (cds[abil.id] || 0) : 0;
        const superNow = Math.floor((active as any)?.superEnergy ?? 0);
        const superNeed = Math.floor(abil?.superCost ?? 0);
        selectedOnCooldown = !abil || cdLeft > 0 || superNow < superNeed;
      }
    } catch {}
    // Sustain abilities (heals, barrier, cleanse, guard) should not require an enemy target
    let isSustainSelected = false;
    try {
      if (s.selectedAbilityId === '__defend') {
        isSustainSelected = true;
      } else if (s.selectedAbilityId && s.selectedAbilityId !== '__basic') {
        const ab = s.selectedAbilityId ? ABILITY_BY_ID[s.selectedAbilityId] : undefined;
        isSustainSelected = !!ab?.tags?.sustain;
      }
    } catch {}
    const anyLivingEnemy = s.enemies.some(e => e && e.bars.hp > 0);
    const curEnemyDeadOrMissing = !s.enemies[s.targetIndex] || s.enemies[s.targetIndex].bars.hp <= 0;
    const requiresEnemyTarget = !isSustainSelected;
    // If single-target heal is armed, require valid ally selection
    const healArmed = !!s.isTargetingAlly && !!s.armedAbilityId && !!abilForHeal?.tags?.sustain && (abilForHeal.id === 'heal' || abilForHeal.id === 'arc-restore' || abilForHeal.id === 'kinetic-barrier');
    const hasValidAllySel = healArmed ? (typeof s.selectedAllyIndex === 'number' && s.party[s.selectedAllyIndex] && s.party[s.selectedAllyIndex].bars.hp > 0 && s.party[s.selectedAllyIndex].bars.hp < 100) : true;
    const shouldDisableUse =
      s.turn !== 'player' ||
      s.isOver ||
      !s.selectedAbilityId ||
      selectedOnCooldown ||
      (requiresEnemyTarget && !anyLivingEnemy) || !hasValidAllySel;
    const shouldDisableEnd = s.turn !== 'player' || s.isOver;
    const shouldDisableNextMember = s.turn !== 'player' || s.isOver;
    
    els.btnUse.disabled = shouldDisableUse;
    // Ensure click target remains enabled even when ability grid is updating
    els.btnUse.setAttribute('aria-disabled', String(shouldDisableUse));
    els.btnEnd.disabled = shouldDisableEnd;
    // Only update button states if buttons exist
    if (els.btnNextMember) {
      els.btnNextMember.disabled = shouldDisableNextMember;
    }
    // Show/hide Cancel button (only if it exists)
    try { 
      if (els.btnCancelTargeting) {
        els.btnCancelTargeting.style.display = (s.isTargetingAlly ? '' : 'none');
      }
    } catch {}
    // Update Use label for heal preview and show Cancel when targeting
    try {
      if (healArmed) {
        const idx = s.selectedAllyIndex ?? -1;
        if (idx >= 0 && s.party[idx]) {
          const curHp = s.party[idx].bars.hp;
          const gain = Math.min(100 - curHp, avgHeal);
          els.btnUse.textContent = `Use (+${gain})`;
        } else {
          els.btnUse.textContent = 'Use (Select target)';
        }
      } else if (abilForHeal && abilForHeal.id === 'thermal-burst-sustain') {
        const allies = s.party.filter(m => m.bars.hp > 0);
        els.btnUse.textContent = `Use (${allies.length} allies)`;
      } else {
        els.btnUse.textContent = 'Use';
      }
    } catch {}
    
    // Update log content - newest entries at the top
    const partyNames = new Set(s.party.map(m => m.name.toLowerCase()));
    const enemyNames = new Set(s.enemies.map(e => e.name.toLowerCase()));
    const lines = s.log.length > 100 ? s.log.slice(-100) : s.log;
    // Reverse the order so newest entries appear at the top
    const reversedLines = [...lines].reverse();
    els.logContent.innerHTML = reversedLines.map(line => {
      let className = 'row';
      // Granular tagging
      const lower = line.toLowerCase();
      let isPlayer = false;
      let isEnemy = false;
      // Attribute by presence of names in the line
      for (const n of partyNames) { if (lower.includes(n)) { isPlayer = true; break; } }
      for (const n of enemyNames) { if (lower.includes(n)) { isEnemy = true; break; } }
      // Fallback keywords
      if (!isPlayer && (lower.startsWith('you ') || lower.includes(' you '))) isPlayer = true;
      if (!isEnemy && (lower.includes(' attacks ') || lower.includes(' uses '))) isEnemy = true;
      if (isPlayer && isEnemy) { // resolve tie: prefer explicit name match
        // If both present, choose the first name occurrence
        const firstPartyIdx = Array.from(partyNames).map(n=>lower.indexOf(n)).filter(i=>i>=0).sort((a,b)=>a-b)[0] ?? Infinity;
        const firstEnemyIdx = Array.from(enemyNames).map(n=>lower.indexOf(n)).filter(i=>i>=0).sort((a,b)=>a-b)[0] ?? Infinity;
        if (firstPartyIdx < firstEnemyIdx) isEnemy = false; else isPlayer = false;
      }
      const isDmgOut = lower.includes('you deal') || lower.includes('sh −') || lower.includes('hp −');
      const isDmgIn = lower.includes('takes') || lower.includes("'s shields took");
      const isPrime = lower.includes('applied') && lower.includes('prime');
      const isDet = lower.includes('detonation');
      const isExplode = lower.includes('detonation:') || lower.includes('explosion');
      if (isPlayer) className += ' log-player-action';
      if (isEnemy) className += ' log-enemy-action';
      if (isDmgOut) className += ' log-dmg-out';
      if (isDmgIn) className += ' log-dmg-in';
      if (isPrime) className += ' log-prime';
      if (isDet) className += ' log-detonate';
      if (isExplode) className += ' log-explode';
      if (line.includes('Victory') || line.includes('Defeat')) className += ' log-battle-result';
      return `<div class="${className}">${line}</div>`;
    }).join('');
    
    // Note: Manual scrolling enabled - users can scroll through log history
  };

  // Button event listeners
  const onUseClick = () => {
    const s = getState();
    
    if (s.turn === 'player' && !s.isOver) {
      const target = s.enemies[s.targetIndex];
      // Allow sustain abilities to cast without requiring a valid enemy target
      let isSustainSelected = false;
      try {
        if (s.selectedAbilityId === '__defend') {
          isSustainSelected = true;
        } else if (s.selectedAbilityId && s.selectedAbilityId !== '__basic') {
          const ab = s.selectedAbilityId ? ABILITY_BY_ID[s.selectedAbilityId] : undefined;
          isSustainSelected = !!ab?.tags?.sustain;
        }
      } catch {}
      const hasLivingEnemy = s.enemies.some(e => e.bars.hp > 0);
      // If there are no living enemies and this isn't a sustain, do nothing
      if (!isSustainSelected && !hasLivingEnemy) return;
      {
        // Ensure we have a valid selection; default to Basic if none
        const noSel = !s.selectedAbilityId;
        // If offensive but current target invalid, auto-retarget to first living enemy
        let s2 = noSel ? { ...s, selectedAbilityId: '__basic' as any } : s;
        if (!isSustainSelected) {
          const curInvalid = !target || target.bars.hp <= 0;
          if (curInvalid) {
            const idx = s.enemies.findIndex(e => e.bars.hp > 0);
            if (idx !== -1) s2 = { ...s2, targetIndex: idx } as any;
          }
        }
        // If selected id is unknown (stale), fall back to Basic so Use always does something
        const knownId = s2.selectedAbilityId === '__basic' || s2.selectedAbilityId === '__defend' || !!ABILITY_BY_ID[s2.selectedAbilityId as string];
        if (!knownId) {
          s2 = { ...s2, selectedAbilityId: '__basic' as any } as any;
        }
        // Play SFX and FX based on selected ability and target state
        const ability = (s2.selectedAbilityId ? ABILITY_BY_ID[s2.selectedAbilityId] : undefined) as Ability | undefined;
        if (ability && !isSustainSelected) {
          const tgtForFx = s2.enemies[s2.targetIndex];
          const hasPrimes = Array.isArray(tgtForFx?.primes) && tgtForFx.primes.length > 0;
          // No audio on super charge or use; keep only visual FX
          if (ability.role === 'prime') {
            try { (window as any).BattleFX?.prime?.(String(ability.type).charAt(0).toUpperCase() + String(ability.type).slice(1)); } catch {}
          } else if (ability.role === 'detonator') {
            const elem = String(ability.type).charAt(0).toUpperCase() + String(ability.type).slice(1);
            try {
              if (hasPrimes) (window as any).BattleFX?.explosion?.(elem);
              else (window as any).BattleFX?.detonate?.(elem);
            } catch {}
          }
        }
        // Snapshot only target values for floaters to avoid deep cloning the whole state
        const prevIdx = s2.targetIndex;
        const prevEnemySnap = s2.enemies[prevIdx]
          ? { id: s2.enemies[prevIdx].id, sh: s2.enemies[prevIdx].bars.sh, hp: s2.enemies[prevIdx].bars.hp }
          : undefined;
        // If we were targeting an ally, keep the selected index for the engine
        if (s2.isTargetingAlly && typeof s2.selectedAllyIndex === 'number') {
          // no-op: state already carries selectedAllyIndex
        }
        const newState = playerAttack(s2);
        // Disarm targeting after use
        newState.isTargetingAlly = false as any;
        newState.armedAbilityId = undefined as any;
        newState.selectedAllyIndex = undefined as any;
        // If we had no selection and defaulted to Basic, record that as last for this member
        if (noSel) {
          const active = s.party[s.activePartyIndex];
          if (active) {
            const map = { ...(s.lastSelectedAbilityByMember || {}) } as NonNullable<BattleState['lastSelectedAbilityByMember']>;
            map[active.actorId] = '__basic';
            setState({ ...newState, lastSelectedAbilityByMember: map });
          } else {
            setState(newState);
          }
        } else {
          // If no log lines were added, surface a minimal message to aid debugging
          const sameLog = (newState.log?.length || 0) === (s2.log?.length || 0);
          setState(sameLog ? { ...newState, log: [...(newState.log||[]), 'Use: action produced no effect.'] } : newState);
        }
        // Emit floaters for damage applied to the primary target and mark enemy as taking damage
        try {
          const prevEnemy = prevEnemySnap;
          const nextEnemy = newState.enemies[newState.targetIndex];
          if (prevEnemy && nextEnemy && (window as any).BattleFX?.floatDamage) {
            const shDelta = Math.max(0, prevEnemy.sh - nextEnemy.bars.sh);
            const hpDelta = Math.max(0, prevEnemy.hp - nextEnemy.bars.hp);
            
            // Mark enemy as taking damage for shake animation
            if (shDelta > 0 || hpDelta > 0) {
              (nextEnemy as any)._isTakingDamage = true;
              console.log(`🎯 Enemy ${nextEnemy.name} marked as taking damage: SH=${shDelta}, HP=${hpDelta}`);
              
              // Clear damage flag after animation
              setTimeout(() => {
                const currentState = getState();
                const currentEnemy = currentState.enemies[currentState.targetIndex];
                if (currentEnemy && (currentEnemy as any)._isTakingDamage) {
                  (currentEnemy as any)._isTakingDamage = false;
                  console.log(`🎯 Enemy ${currentEnemy.name} damage flag cleared`);
                  scheduleRender();
                }
              }, 800); // Slightly shorter than party member animation
            }
            
            // approximate canvas coords using card element center
            let cards = root.querySelectorAll('.enemy-cards .enemy-thumb');
            if (!cards || cards.length === 0) {
              cards = root.querySelectorAll('.enemy-cards .card');
            }
            const cardEl = cards[newState.targetIndex] as HTMLElement | undefined;
            if (cardEl) {
              const r = cardEl.getBoundingClientRect();
              const cx = r.left + r.width / 2;
              const cy = r.top + r.height / 2;
              const rootRect = (document.getElementById('app-wrap') as HTMLElement)?.getBoundingClientRect();
              const relX = rootRect ? cx - rootRect.left : cx;
              const relY = rootRect ? cy - rootRect.top : cy;
              const toCanvas = (x: number, y: number) => ({ x, y });
              const typeMap: Record<string, any> = { kinetic: 'Kinetic', arc: 'Arc', thermal: 'Thermal', void: 'Void' };
              const selectedAbility = (newState.selectedAbilityId ? ABILITY_BY_ID[newState.selectedAbilityId] : undefined) as any;
              const dmgType = typeMap[selectedAbility?.type || 'kinetic'] || 'Kinetic';
              if (shDelta > 0) (window as any).BattleFX.floatDamage(toCanvas(relX, relY), shDelta, { shield: true });
              if (hpDelta > 0) (window as any).BattleFX.floatDamage(toCanvas(relX, relY - 10), hpDelta, { type: dmgType });
            }
          }
        } catch {}
        
        // If the turn switched to enemy, automatically process enemy turn
        if (newState.turn === 'enemy') {
          // Make each living enemy act once, sequentially
          const enemiesToAct = newState.enemies.map(e => e.id).filter((id, idx) => newState.enemies[idx].bars.hp > 0);
          const actNext = (i: number, s0: typeof newState) => {
            if (i >= enemiesToAct.length) { 
              // Reset party turn counter and pass back to players
              console.log('🎯 End Turn: Enemy turn complete, resetting to player turn');
              // Clear any remaining damage flags when switching back to player turn
              const clearedState = { 
                ...s0, 
                turn: 'player' as const,
                partyMembersActedThisRound: 0,
                activePartyIndex: 0 // Start with first party member
              };
              
              // Clear damage flags from all party members
              clearedState.party.forEach(member => {
                if ((member as any)._isTakingDamage) {
                  (member as any)._isTakingDamage = false;
                }
              });
              
              // Clear damage flags from all enemies
              clearedState.enemies.forEach(enemy => {
                if ((enemy as any)._isTakingDamage) {
                  (enemy as any)._isTakingDamage = false;
                }
              });
              
              return setState(clearedState); 
            }
            const id = enemiesToAct[i];
            const t = setTimeout(() => {
              // Hint to engine which enemy is taking this step
              const hinted = { ...(s0 as any), _forceEnemyId: id } as any;
              
              // Store party state before attack to detect damage
              const partyBeforeAttack = s0.party.map(m => ({ 
                actorId: m.actorId, 
                sh: m.bars.sh, 
                hp: m.bars.hp 
              }));
              
              const after = enemyAttack(hinted as any);
              
              // Mark party members who took damage
              console.log(`🎯 Checking for damage on ${after.party.length} party members...`);
              after.party.forEach((member, index) => {
                const before = partyBeforeAttack[index];
                console.log(`🎯 ${member.name}: Before SH=${before?.sh}, HP=${before?.hp} | After SH=${member.bars.sh}, HP=${member.bars.hp}`);
                if (before && (before.sh > member.bars.sh || before.hp > member.bars.hp)) {
                  (member as any)._isTakingDamage = true;
                  console.log(`🎯 Party member ${member.name} marked as taking damage`);
                  console.log(`🎯 Damage details: SH ${before.sh} -> ${member.bars.sh}, HP ${before.hp} -> ${member.bars.hp}`);
                } else {
                  console.log(`🎯 ${member.name}: No damage detected`);
                }
              });
              
              // Set state with damage flags
              console.log(`🎯 Setting state with damage flags, turn=${after.turn}`);
              setState(after);
              
              // Clear damage flags after a delay to allow render to complete
              setTimeout(() => {
                const currentState = getState();
                console.log(`🎯 Clearing damage flags, current turn=${currentState.turn}`);
                currentState.party.forEach((member, index) => {
                  if ((member as any)._isTakingDamage) {
                    (member as any)._isTakingDamage = false;
                    console.log(`🎯 Party member ${member.name} damage flag cleared`);
                  }
                });
                // Force a re-render to remove the damage class
                console.log(`🎯 Scheduling render after clearing damage flags`);
                scheduleRender();
              }, 2000); // Much longer than animation to ensure it's visible
              // Continue chain if still enemy turn and party not defeated
              if (!after.isOver) {
                actNext(i + 1, { ...(after as any), turn: 'enemy' } as any);
              }
            }, 500) as unknown as number;
            activeTimeouts.push(t);
          };
          actNext(0, newState);
        }
      }
    }
  };
  els.btnUse.addEventListener('click', onUseClick);

  const onEndClick = () => {
    const s = getState();
    if (s.turn === 'player' && !s.isOver) {
      const enemiesToAct = s.enemies.map(e => e.id).filter((id, idx) => s.enemies[idx].bars.hp > 0);
      const actNext = (i: number, s0: typeof s) => {
        if (i >= enemiesToAct.length) { 
          // Reset party turn counter and pass back to players
          // Clear any remaining damage flags when switching back to player turn
          const clearedState = { 
            ...s0, 
            turn: 'player' as const,
            partyMembersActedThisRound: 0,
            activePartyIndex: 0 // Start with first party member
          };
          
          // Clear damage flags from all party members
          clearedState.party.forEach(member => {
            if ((member as any)._isTakingDamage) {
              (member as any)._isTakingDamage = false;
            }
          });
          
          return setState(clearedState); 
        }
        const id = enemiesToAct[i];
        const t = setTimeout(() => {
          const hinted = { ...(s0 as any), _forceEnemyId: id } as any;
          
          // Store party state before attack to detect damage
          const partyBeforeAttack = s0.party.map(m => ({ 
            actorId: m.actorId, 
            sh: m.bars.sh, 
            hp: m.bars.hp 
          }));
          
          const after = enemyAttack(hinted as any);
          
          // Mark party members who took damage
          console.log(`🎯 Checking for damage on ${after.party.length} party members...`);
          after.party.forEach((member, index) => {
            const before = partyBeforeAttack[index];
            console.log(`🎯 ${member.name}: Before SH=${before?.sh}, HP=${before?.hp} | After SH=${member.bars.sh}, HP=${member.bars.hp}`);
            if (before && (before.sh > member.bars.sh || before.hp > member.bars.hp)) {
              (member as any)._isTakingDamage = true;
              console.log(`🎯 Party member ${member.name} marked as taking damage (End Turn)`);
              console.log(`🎯 Damage details: SH ${before.sh} -> ${member.bars.sh}, HP ${before.hp} -> ${member.bars.hp}`);
            } else {
              console.log(`🎯 ${member.name}: No damage detected`);
            }
          });
          
          // Set state with damage flags
          console.log(`🎯 Setting state with damage flags (End Turn), turn=${after.turn}`);
          setState(after);
          
          // Clear damage flags after a delay to allow render to complete
          setTimeout(() => {
            const currentState = getState();
            console.log(`🎯 Clearing damage flags (End Turn), current turn=${currentState.turn}`);
            currentState.party.forEach((member, index) => {
              if ((member as any)._isTakingDamage) {
                (member as any)._isTakingDamage = false;
                console.log(`🎯 Party member ${member.name} damage flag cleared (End Turn)`);
              }
            });
            // Force a re-render to remove the damage class
            console.log(`🎯 Scheduling render after clearing damage flags (End Turn)`);
            scheduleRender();
          }, 2000); // Much longer than animation to ensure it's visible
          if (!after.isOver) {
            actNext(i + 1, { ...(after as any), turn: 'enemy' } as any);
          }
        }, 500) as unknown as number;
        activeTimeouts.push(t);
      };
      actNext(0, { ...s, turn: 'enemy' });
    }
  };
  els.btnEnd.addEventListener('click', onEndClick);

  const onNextMemberClick = () => {
    const s = getState();
    if (s.turn === 'player' && !s.isOver) {
      // Find the next living party member
      let nextIndex = s.activePartyIndex;
      let attempts = 0;
      
      do {
        nextIndex = (nextIndex + 1) % s.party.length;
        attempts++;
      } while (s.party[nextIndex].bars.hp <= 0 && attempts < s.party.length);
      
      // Only switch if we found a different living member
      if (nextIndex !== s.activePartyIndex && s.party[nextIndex].bars.hp > 0) {
        setState({ 
          activePartyIndex: nextIndex,
          selectedAbilityId: undefined // Reset ability selection
        });
      }
    }
  };
  // Only add event listener if button exists
  if (els.btnNextMember) {
    els.btnNextMember.addEventListener('click', onNextMemberClick);
  }

  // Cancel targeting
  let onCancelClick: ((this: HTMLButtonElement, ev: MouseEvent) => any) | undefined;
  try {
    const cancelBtn = root.querySelector('#btnCancelTargeting') as HTMLButtonElement | null;
    if (cancelBtn) {
      onCancelClick = () => {
        const s = getState();
        if (s.isTargetingAlly) setState({ isTargetingAlly: false, armedAbilityId: undefined, selectedAllyIndex: undefined });
      };
      cancelBtn.addEventListener('click', onCancelClick);
    }
  } catch {}

  // Initial render
  scheduleRender();
  


  // Function to ensure target is always valid
  const ensureValidTarget = () => {
    const s = getState();
    if (s.targetIndex < 0 || s.targetIndex >= s.enemies.length || s.enemies[s.targetIndex].bars.hp <= 0) {
      const nextTarget = findNextValidTarget(s);
      if (nextTarget !== -1 && nextTarget !== s.targetIndex) {
        const oldTarget = s.targetIndex >= 0 && s.targetIndex < s.enemies.length ? s.enemies[s.targetIndex].name : 'none';
        s.targetIndex = nextTarget;
        const newTarget = s.enemies[s.targetIndex].name;
        console.log(`🎯 Auto-targeting: ${oldTarget} → ${newTarget}`);
        
        // Mark the new target for visual feedback
        (s.enemies[s.targetIndex] as any)._autoTargeted = true;
        
        // Add a brief log message about target change
        if (s.log && s.log.length > 0) {
          s.log.push(`Targeting ${newTarget}`);
        }
        
        // Remove the auto-targeted flag after a short delay
        setTimeout(() => {
          if ((s.enemies[s.targetIndex] as any)?._autoTargeted) {
            (s.enemies[s.targetIndex] as any)._autoTargeted = false;
          }
        }, 800);
      }
    }
  };

  // Death animation cleanup function
  const cleanupDeathAnimations = () => {
    const s = getState();
    s.enemies.forEach((enemy, index) => {
      if (enemy.bars.hp <= 0 && (enemy as any)._deathAnimationState === 'dying') {
        // Check if death animation has completed
        if ((enemy as any)._deathStartTime && Date.now() - (enemy as any)._deathStartTime > 1500) {
                  // Mark as completed and remove from state
        (enemy as any)._deathAnimationState = 'completed';
        
        // Check if this was the current target
        const wasCurrentTarget = index === s.targetIndex;
        
        // Remove the enemy from the state
        s.enemies.splice(index, 1);
        
        // Update target index if needed
        if (wasCurrentTarget || s.targetIndex >= s.enemies.length) {
          const nextTarget = findNextValidTarget(s);
          if (nextTarget !== -1) {
            s.targetIndex = nextTarget;
            console.log(`🎯 UI: Auto-targeting ${s.enemies[s.targetIndex].name} after enemy removal`);
          } else {
            s.targetIndex = Math.max(0, s.enemies.length - 1);
          }
        }
        }
      }
    });
    
    // Check for victory condition: if no living enemies remain (regardless of dying enemies)
    if (checkVictoryCondition(s) && !s.isOver) {
      s.isOver = true;
      console.log('🎯 Victory! All enemies defeated - mission complete!');
    }
    
    // Debug logging for death animation states
    const dyingCount = s.enemies.filter(e => (e as any)._deathAnimationState === 'dying').length;
    const deadCount = s.enemies.filter(e => e.bars.hp <= 0).length;
    const livingCount = s.enemies.filter(e => e.bars.hp > 0).length;
    
    // Ensure target is always valid after any state changes
    ensureValidTarget();
  };

  // Set up periodic cleanup of death animations
  const deathCleanupInterval = setInterval(cleanupDeathAnimations, 100);

  // Return cleanup function
  return () => {
    try { if (typeof unsubscribe === 'function') unsubscribe(); } catch {}
    try { root.removeEventListener('click', onRootClick); } catch {}
    try { els.btnUse.removeEventListener('click', onUseClick); } catch {}
    try { els.btnEnd.removeEventListener('click', onEndClick); } catch {}
    // Only remove event listeners if buttons exist
    try { 
      if (els.btnNextMember) {
        els.btnNextMember.removeEventListener('click', onNextMemberClick);
      }
    } catch {}
    try { activeTimeouts.splice(0).forEach((t)=> clearTimeout(t as any)); } catch {}
    try {
      const cancelBtn = root.querySelector('#btnCancelTargeting') as HTMLButtonElement | null;
      if (cancelBtn && onCancelClick) cancelBtn.removeEventListener('click', onCancelClick);
    } catch {}
    // Clear death animation cleanup interval
    try { clearInterval(deathCleanupInterval); } catch {}
  };
}
