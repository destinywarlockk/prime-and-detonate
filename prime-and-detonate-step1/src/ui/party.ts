import type { LoadoutState, CharacterDef, ClassId } from '../game/types';
import VanguardIcon from '../../assets/images/Vanguard.png';
import TechnomancerIcon from '../../assets/images/Technomancer.png';
import PyromancerIcon from '../../assets/images/Pyromancer.png';
import VoidrunnerIcon from '../../assets/images/Voidrunner.png';


const CLASS_META: Record<ClassId, { label: string; short: string; badge: string; icon: string; description: string; abilities: string[] }> = {
  vanguard: { 
    label: 'Vanguard', 
    short: 'KIN', 
    badge: 'badge-kin', 
    icon: VanguardIcon,
    description: 'Tank with high shield and health. Excels at protecting allies and controlling the battlefield.',
    abilities: ['Shield Bash', 'Guardian Stance', 'Rallying Cry', 'Iron Will']
  },
  technomancer: { 
    label: 'Technomancer', 
    short: 'ARC', 
    badge: 'badge-arc', 
    icon: TechnomancerIcon,
    description: 'Arc damage specialist with crowd control abilities. Manipulates enemies and supports the team.',
    abilities: ['Arc Surge', 'Static Field', 'Chain Lightning', 'Overcharge']
  },
  pyromancer: { 
    label: 'Pyromancer', 
    short: 'THR', 
    badge: 'badge-thr', 
    icon: PyromancerIcon,
    description: 'Thermal damage dealer with area attacks. Burns through enemy defenses and groups.',
    abilities: ['Flame Burst', 'Heat Wave', 'Inferno', 'Thermal Overload']
  },
  voidrunner: { 
    label: 'Voidrunner', 
    short: 'VOID', 
    badge: 'badge-void', 
    icon: VoidrunnerIcon,
    description: 'Void damage assassin with mobility. Strikes from shadows and disrupts enemy plans.',
    abilities: ['Void Strike', 'Shadow Step', 'Dark Pulse', 'Void Rift']
  },
};

export function mountParty(
  container: HTMLElement,
  loadout: LoadoutState,
  setState: (updater: ((state: any) => void) | Record<string, any>) => void,
  onContinueToLoadout: () => void,
  onGoToMissions?: () => void
): () => void {
  let onClick: ((e: Event) => void) | null = null;

  const canPickMore = () => loadout.partySelection.length < loadout.maxParty;
  const isPicked = (defId: string) => loadout.partySelection.includes(defId);

  function pick(defId: string) {
    const picked = isPicked(defId);
    // Prevent removing locked protagonist
    if (picked && loadout.lockedCharacterId && defId === loadout.lockedCharacterId) {
      return;
    }
    if (picked) {
      const newSelection = loadout.partySelection.filter((id: string) => id !== defId);
      const newSelectedByChar = { ...loadout.selectedByChar } as any;
      delete newSelectedByChar[defId];
      setState({ partySelection: newSelection, selectedByChar: newSelectedByChar });
    } else if (canPickMore()) {
      const newSelection = [...loadout.partySelection, defId];
      const newSelectedByChar = { ...loadout.selectedByChar, [defId]: loadout.selectedByChar[defId] || [] } as any;
      setState({ partySelection: newSelection, selectedByChar: newSelectedByChar });
    }
    // App will re-render via root subscription
  }

  function renderCard(c: CharacterDef) {
    const meta = CLASS_META[c.classId];
    const picked = isPicked(c.id);
    const disablePick = !picked && !canPickMore();
    const isLocked = loadout.lockedCharacterId === c.id;

    const cardHtml = `
      <div class="char-card ${picked ? 'selected' : ''}" data-pick="${c.id}">
        <div class="char-info">
          <div class="char-icon">
            <img src="${meta.icon}" alt="${meta.label}" />
          </div>
          <div class="char-name">${c.name}</div>
        </div>
        <div class="char-stats">
          <div class="class-pill">
            <span class="stat">${meta.label}</span>
          </div>
          <div class="stat-row">
            <span class="stat element-${meta.short.toLowerCase()}">${meta.short}</span>
            <span class="stat">SH${c.baseBars.sh}</span>
            <span class="stat">HP${c.baseBars.hp}</span>
          </div>
          <div class="class-description">
            <div class="description-text">${meta.description}</div>
          </div>
        </div>
        <div class="card-cta">
          <button class="pick-btn" data-pick="${c.id}" ${disablePick || (picked && isLocked) ? 'disabled' : ''}>
            ${isLocked ? 'Locked' : (picked ? 'Remove' : 'Add')}
          </button>
        </div>
      </div>
    `;
    
    return cardHtml;
  }

  function render() {
    const { roster, partySelection, maxParty } = loadout;
    const filtered = roster;
    container.innerHTML = `
      <div class="party-screen mx-auto h-[100dvh] max-w-[100vw] bg-slate-950 text-slate-100 grid grid-rows-[auto_1fr_auto]" style="overflow-x:hidden; width: 100vw; max-width: 100vw;">
        <!-- Header -->
        <header class="h-12 flex items-center justify-between px-2 border-b border-white/10">
          <div></div>
          <div class="text-sm font-semibold">Select Your Party</div>
          <div class="text-xs opacity-80">${partySelection.length}/${maxParty}</div>
        </header>

        <!-- Scrollable content -->
        <main class="overflow-y-auto" style="overflow-x: hidden; margin-top: 5px;">
          <div class="px-2 pt-3 pb-20" style="width: 100%; box-sizing: border-box;">
            <div class="card-grid" style="grid-template-columns: 1fr; width: 100%; box-sizing: border-box; margin-top: 5px;">
              ${filtered.map(renderCard).join('')}
            </div>
          </div>
        </main>

        <!-- Footer action bar -->
        <footer class="px-2 pb-[env(safe-area-inset-bottom,12px)] pt-2" style="width: 100%; box-sizing: border-box;">
          <div class="sticky-cta" style="position:static; background:transparent; border:0; padding:0; width: 100%; box-sizing: border-box;">
            <div class="flex justify-between">
              <button id="backBtn" class="btn btn-back text-lg px-4 py-2">Back</button>
              <div class="progress text-right">
                ${partySelection.length} selected • Tap a card to add/remove
              </div>
            </div>
            <button class="primary w-full mt-2" id="cfgLoadout" ${partySelection.length === maxParty ? '' : 'disabled'}>
              Configure Loadout
            </button>
          </div>
        </footer>
      </div>
    `;

    wireEvents();
  }

  function wireEvents() {
    if (onClick) return;
    onClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const pickBtn = target.closest('[data-pick]') as HTMLElement | null;
      if (pickBtn) {
        const id = pickBtn.getAttribute('data-pick');
        if (id) pick(id);
        return;
      }

      if ((target as HTMLElement).id === 'cfgLoadout') {
        if (loadout.partySelection.length === loadout.maxParty) {
          setState((state: any) => {
            state.loadout.loadoutActiveIndex = 0;
          });
          onContinueToLoadout();
        }
        return;
      }

      if ((target as HTMLElement).id === 'backBtn') {
        if (onGoToMissions) onGoToMissions();
        return;
      }
    };
    container.addEventListener('click', onClick);
  }

  render();

  return () => {
    if (onClick) {
      container.removeEventListener('click', onClick);
      onClick = null;
    }
    container.innerHTML = '';
  };
}


