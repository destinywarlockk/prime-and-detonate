import React from "react";
import { createRoot, Root } from "react-dom/client";
import type { LoadoutState } from "../game/types";
import LoadoutScreen from "../features/loadouts/LoadoutScreen";
import { ALL_WEAPONS } from "../content/weapons";

// Adapter to mount the new React loadout screen within the existing imperative app shell
export function mountReactLoadout(
  container: HTMLElement,
  loadout: LoadoutState,
  setState: (updater: (state: any) => void) => void,
  goBackToParty: () => void,
  goStartBattle: () => void
): () => void {
  container.innerHTML = "";
  const rootEl = document.createElement("div");
  container.appendChild(rootEl);
  const root: Root = createRoot(rootEl);

  const initialCharacters = loadout.partySelection.map((defId) => {
    const def = loadout.roster.find((c) => c.id === defId)!;
    // Clamp any preselected abilities to 3, and ensure max one sustain
    const original = loadout.selectedByChar[def.id] || [];
    const clamped: string[] = [];
    let sustainAdded = false;
    for (const id of original) {
      if (clamped.length >= 3) break;
      const a = loadout.allAbilities.find(x => x.id === id);
      if (!a) continue;
      const isSustain = a.role === 'sustain' || a.tags?.sustain;
      if (isSustain) {
        if (sustainAdded) continue;
        sustainAdded = true;
      }
      clamped.push(id);
    }
    return {
      id: def.id,
      name: def.name,
      className: mapClass(def.classId),
      // Allow 5 ability slots: 1 sustain + 4 offensive (basic attack is automatic)
      maxSlots: 5,
      selectedAbilityIds: clamped,
    };
  });

  const initialAbilities = loadout.allAbilities.map((a) => ({
    id: a.id,
    name: a.name,
    abilityType: a.role === 'sustain' || a.tags?.sustain ? 'sustain' as const : (a.role as any),
    damageType: a.type,
    damage: a.baseDamage,
    primes: a.primesApplied,
    detonates: a.detonates,
    splashPct: a.splashFactor != null ? Math.round(a.splashFactor * 100) : undefined,
    synergyHint: undefined,
    sustain: !!a.tags?.sustain,
    cooldown: a.cooldown,
    superCost: a.superCost,
    statusEffects: a.statusEffects,
    effectText: a.tags?.sustain ? inferSustainEffectText(a.id) : undefined,
    allowedClasses: a.allowedClasses?.map((c) => mapClass(c as any)),
  }));

  const initialWeapons = (loadout.allWeapons && loadout.allWeapons.length > 0 ? loadout.allWeapons : ALL_WEAPONS).map(w => ({ ...w }));
  const initialSelectedWeaponByCharacterId: Record<string, string | undefined> = (() => {
    const map: Record<string, string | undefined> = {};
    for (const defId of loadout.partySelection) {
      const wid = loadout.selectedWeaponByChar?.[defId];
      if (wid) map[defId] = wid;
    }
    return map;
  })();

  function inferSustainEffectText(id: string): string | undefined {
    switch (id) {
      case 'heal': return 'Restore HP each use';
      case 'barrier': return 'Absorb incoming damage temporarily';
      case 'cleanse': return 'Remove negative effects';
      case 'guard': return 'Redirect damage from allies briefly';
      case 'kinetic-barrier': return 'Absorb damage';
      case 'thermal-burst-sustain': return 'Empower burns and resist damage';
      case 'arc-restore': return 'Regenerate shields';
      case 'void-drain': return 'Sap enemy to restore resources';
      default: return undefined;
    }
  }

  function handleDone(localState: any) {
    // Sync selected abilities back to root loadout store
    setState((state: any) => {
      // Ensure we only consider the same party order
      localState.characters.forEach((c: any) => {
        state.loadout.selectedByChar[c.id] = [...c.selectedAbilityIds];
      });
      state.loadout.allWeapons = initialWeapons;
      state.loadout.selectedWeaponByChar = { ...localState.selectedWeaponByCharacterId };
    });
    
    // Pre-load battle to determine actual enemy faction
    preloadBattleAndShowAnimation(localState, () => {
      goStartBattle();
    });
  }

  function preloadBattleAndShowAnimation(localState: any, onComplete: () => void) {
    // Show the battle begins animation
    showBattleBeginsOverlay(onComplete);
  }

  function showBattleBeginsOverlay(onComplete: () => void) {
    // Create fullscreen overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(135deg, #0b0f1a 0%, #1e293b 50%, #0f172a 100%);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.5s ease-in-out;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      overflow: hidden;
    `;
    
    // Create content container
    const content = document.createElement('div');
    content.style.cssText = `
      text-align: center;
      color: #f8fafc;
      transform: scale(0.8);
      transition: transform 0.6s ease-out;
      position: relative;
      z-index: 2;
    `;
    
    // Create main title
    const title = document.createElement('h1');
    title.textContent = 'BATTLE BEGINS';
    title.style.cssText = `
      font-size: clamp(2rem, 8vw, 4rem);
      font-weight: 900;
      margin: 0 0 1rem 0;
      text-shadow: 0 0 30px rgba(59, 130, 246, 0.8);
      letter-spacing: 0.1em;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      position: relative;
      animation: titleGlow 2s ease-in-out infinite;
    `;
    
    // Create subtitle
    const subtitle = document.createElement('p');
    subtitle.textContent = 'Prepare for combat...';
    subtitle.style.cssText = `
      font-size: clamp(1rem, 3vw, 1.5rem);
      margin: 0;
      color: #94a3b8;
      font-weight: 500;
      opacity: 0;
      animation: fadeInUp 0.8s ease-out 0.3s forwards;
    `;
    
    // Create loading dots
    const dots = document.createElement('div');
    dots.style.cssText = `
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 2rem;
      opacity: 0;
      animation: fadeInUp 0.8s ease-out 0.6s forwards;
    `;
    
    // Generate three animated dots
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.style.cssText = `
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #3b82f6;
        animation: pulse 1.4s ease-in-out infinite;
        animation-delay: ${i * 0.2}s;
      `;
      dots.appendChild(dot);
    }
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes pulse {
        0%, 80%, 100% {
          transform: scale(0.8);
          opacity: 0.5;
        }
        40% {
          transform: scale(1.2);
          opacity: 1;
        }
      }
      
      @keyframes titleGlow {
        0%, 100% {
          text-shadow: 0 0 30px rgba(59, 130, 246, 0.8);
        }
        50% {
          text-shadow: 0 0 50px rgba(59, 130, 246, 1), 0 0 80px rgba(139, 92, 246, 0.6);
        }
      }
      
      @keyframes screenShake {
        0%, 100% {
          transform: translateX(0);
        }
        20%, 60% {
          transform: translateX(-5px);
        }
        40%, 80% {
          transform: translateX(5px);
        }
      }
      
      @keyframes titleShake {
        0%, 100% {
          transform: translateX(0) scale(1);
        }
        10%, 30%, 50%, 70%, 90% {
          transform: translateX(-3px) scale(1.05);
        }
        20%, 40%, 60%, 80% {
          transform: translateX(3px) scale(1.05);
        }
      }
      
      @keyframes explosion {
        0% {
          transform: scale(1) rotate(0deg);
          opacity: 1;
        }
        25% {
          transform: scale(1.2) rotate(5deg);
          opacity: 1;
        }
        50% {
          transform: scale(1.5) rotate(-3deg);
          opacity: 0.8;
        }
        75% {
          transform: scale(2) rotate(2deg);
          opacity: 0.4;
        }
        100% {
          transform: scale(3) rotate(0deg);
          opacity: 0;
        }
      }
    `;
    
    // Assemble overlay elements
    content.appendChild(title);
    content.appendChild(subtitle);
    content.appendChild(dots);
    overlay.appendChild(content);
    document.head.appendChild(style);
    document.body.appendChild(overlay);
    
    // Start animation sequence
    requestAnimationFrame(() => {
      // Fade in overlay and scale content
      overlay.style.opacity = '1';
      content.style.transform = 'scale(1)';
      
      // Add screen shake effect
      document.body.style.animation = 'screenShake 0.3s ease-out';
      setTimeout(() => {
        document.body.style.animation = '';
      }, 300);
      
      // Add title shake effect after initial appearance
      setTimeout(() => {
        title.style.animation = 'titleGlow 2s ease-in-out infinite, titleShake 0.3s ease-out';
        setTimeout(() => {
          title.style.animation = 'titleGlow 2s ease-in-out infinite';
        }, 300);
      }, 300);
    });
    
    // Animation completion sequence
    setTimeout(() => {
      // Start explosion effect and fade out
      title.style.animation = 'explosion 0.8s ease-out forwards';
      overlay.style.opacity = '0';
      content.style.transform = 'scale(0.9)';
      
      // Trigger battle transition immediately to prevent screen flash
      onComplete();
      
      // Clean up DOM elements after transition starts
      setTimeout(() => {
        document.body.removeChild(overlay);
        document.head.removeChild(style);
      }, 800);
    }, 1200);
  }

  root.render(
    <React.StrictMode>
      <LoadoutScreen
        initialCharacters={initialCharacters}
        initialAbilities={initialAbilities}
        initialWeapons={initialWeapons}
        initialSelectedWeaponByCharacterId={initialSelectedWeaponByCharacterId}
        onDone={handleDone}
        onBack={goBackToParty}
      />
    </React.StrictMode>
  );

  return () => {
    root.unmount();
    container.innerHTML = "";
  };
}

function mapClass(classId: LoadoutState["roster"][number]["classId"]) {
  switch (classId) {
    case "vanguard":
      return "vanguard" as const;
    case "pyromancer":
      return "mage" as const; // Pyromancer ≈ Mage archetype in new UI
    case "technomancer":
      return "technician" as const;
    case "voidrunner":
      return "infiltrator" as const;
  }
}


