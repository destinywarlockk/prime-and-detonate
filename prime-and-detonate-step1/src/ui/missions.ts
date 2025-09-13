import type { Mission, MissionProgress } from '../game/types';
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

export function mountMissions(
  root: HTMLElement,
  getMission: () => MissionProgress,
  onBack: () => void,
  onSelectMission: (m: Mission) => void
): () => void {
  root.innerHTML = '';
  const el = document.createElement('div');
  el.className = 'missions-screen';
  root.appendChild(el);

  function getMainCharacterIcon(m: Mission): { url: string; label: string } | undefined {
    const id = (m.id || '').toLowerCase();
    const name = (m.name || '').toLowerCase();
    if (id.includes('nova') || name.includes('nova') || id === 'scrap-hesitation') return { url: VanguardIcon, label: 'Nova' };
    if (id.includes('volt') || name.includes('volt')) return { url: TechnomancerIcon, label: 'Volt' };
    if (id.includes('ember') || name.includes('ember')) return { url: PyromancerIcon, label: 'Ember' };
    if (id.includes('shade') || name.includes('shade') || id === 'justice_runs_cold') return { url: VoidrunnerIcon, label: 'Shade' };
    return undefined;
  }

  function render() {
    const progress = getMission();
    el.innerHTML = `
      <style>
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
      </style>
      <div class="mx-auto h-[100dvh] max-w-[420px] bg-slate-950 text-slate-100 grid grid-rows-[auto_1fr_auto]" style="overflow-x:hidden;">
        <header class="h-10 flex items-center justify-between px-3 border-b border-white/10">
          <button id="backBtn" class="ghost">Back</button>
          <div class="text-sm font-semibold">Select Mission</div>
          <div style="width:48px"></div>
        </header>
        <main class="overflow-y-auto">
          <div class="px-3 pt-3 pb-20">
            <div class="card-grid" style="grid-template-columns: 1fr;">
              ${AVAILABLE_MISSIONS.map(m => {
                const best = progress.completed?.[m.id]?.bestStars ?? 0;
                const stars = '★'.repeat(best) + '☆'.repeat(3 - best);
                const icon = getMainCharacterIcon(m);
                return `
                  <div class="char-card mission-card" data-mission="${m.id}">
                    ${icon ? `
                    <div class="char-icon">
                      <img src="${icon.url}" alt="${icon.label}" />
                    </div>
                    ` : ''}
                    <div class="char-left mission-left">
                      <div class="char-name mission-name">${m.name}</div>
                      ${icon ? `<div class="mission-meta">${icon.label}</div>` : ''}
                      <div class="loadout-sub">${stars}</div>
                    </div>
                    <div class="card-cta" style="display:flex;justify-content:flex-end;align-items:center">
                      <button class="pick-btn" data-start="${m.id}">Start</button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </main>
      </div>
    `;
  }

  function onClick(e: Event) {
    const t = e.target as HTMLElement;
    if (!t) return;
    if (t.id === 'backBtn') { onBack(); return; }
    const startBtn = t.closest('[data-start]') as HTMLElement | null;
    if (startBtn) {
      const id = startBtn.getAttribute('data-start')!;
      const mission = AVAILABLE_MISSIONS.find(m => m.id === id);
      if (mission) onSelectMission(mission);
      return;
    }
  }

  el.addEventListener('click', onClick, { passive: true } as any);
  render();

  return () => {
    el.removeEventListener('click', onClick as any);
    try { root.removeChild(el); } catch {}
  };
}


