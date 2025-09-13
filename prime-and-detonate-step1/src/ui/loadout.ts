import type { LoadoutState, CharacterDef, Ability, ClassId, Weapon } from '../game/types';
import VanguardIcon from '../../assets/images/Vanguard.png';
import TechnomancerIcon from '../../assets/images/Technomancer.png';
import PyromancerIcon from '../../assets/images/Pyromancer.png';
import VoidrunnerIcon from '../../assets/images/Voidrunner.png';
import { getAbilitiesByClass } from '../content/abilities';
import { ALL_WEAPONS } from '../content/weapons';

export function mountLoadout(
  container: HTMLElement,
  loadout: LoadoutState,
  setState: (updater: (state: any) => void) => void,
  goBackToParty: () => void,
  goStartBattle: () => void
): () => void {
  let onClick: ((e: Event) => void) | null = null;
  // Persist expanded state of ability cards across re-renders
  const expandedAbilityIds = new Set<string>();
  function render() {
    const { roster, partySelection, maxParty, allAbilities, selectedByChar, loadoutActiveIndex } = loadout;
    const clampedIndex = Math.min(Math.max(loadoutActiveIndex || 0, 0), Math.max(partySelection.length - 1, 0));
    const activeDefId = partySelection[clampedIndex];
    const activeChar = roster.find(c => c.id === activeDefId);

    container.innerHTML = `
      <div class="loadout-screen">
        <div class="loadout-fixed-header">
          <div class="lfh-left">
            <div class="lfh-label">Configure Loadouts</div>
            ${partySelection.length > 0 && activeChar ? `
              <div class="lfh-name">${activeChar.name} <span class="lfh-class">(<img class="class-icon" src="${getClassIcon(activeChar.classId)}" alt="${formatClassName(activeChar.classId)}" /> ${formatClassName(activeChar.classId)})</span></div>
              <div class="lfh-sub">
                ${renderSlotDots(activeChar.abilitySlots, (loadout.selectedByChar[activeChar.id] || []).length)}
                <span class="lfh-slots">${(loadout.selectedByChar[activeChar.id] || []).length}/${activeChar.abilitySlots} Slots</span>
              </div>
            ` : '<div class="lfh-name">No party selected</div>'}
          </div>
          <div class="lfh-right">
            <button id="btnBackToParty" class="btn ghost-btn">Back</button>
          </div>
        </div>

        ${partySelection.length > 0 && activeChar ? `
          <div class="party-selector" role="tablist" aria-label="Party members">
            ${partySelection.map((defId, idx) => {
              const char = roster.find(c => c.id === defId)!;
              const isActive = idx === clampedIndex;
              return `
                <button class="party-chip ${isActive ? 'is-active' : ''}" data-action="select-party-index" data-index="${idx}" role="tab" aria-selected="${isActive}">
                  <span class="chip-name">${char.name}</span>
                  <span class="chip-class"><img class="class-icon" src="${getClassIcon(char.classId)}" alt="${formatClassName(char.classId)}" /> ${formatClassName(char.classId)}</span>
                </button>
              `;
            }).join('')}
          </div>

          <div class="ability-assignment">
            ${renderCharacterAbilityAssignment(activeChar, selectedByChar[activeChar.id] || [], allAbilities)}
          </div>
        ` : `
          <div class="empty-state">
            <p>Please select your party first.</p>
          </div>
        `}

        ${partySelection.length > 0 && activeChar ? `
          <div class="sticky-footer">
            <div class="footer-left">
              <span class="footer-label">Slots Remaining</span>
              <span class="footer-count">${Math.max(activeChar.abilitySlots - (loadout.selectedByChar[activeChar.id]?.length || 0), 0)}</span>
            </div>
            <div class="footer-actions">
              <button id="btnStartBattle" class="btn btn--primary big-btn" ${canStartBattle() ? '' : 'disabled'}>Done</button>
            </div>
          </div>
        ` : ''}
      </div>
    `;
    
    addEventListeners();
  }
  
  // No character grid on this screen — focused on one character at a time
  
  function renderCharacterAbilityAssignment(char: CharacterDef, selectedAbilityIds: string[], allAbilities: Ability[]): string {
    const availableAbilities = getAbilitiesByClass(char.classId);
    const selectedAbilities = selectedAbilityIds.map(id => allAbilities.find(a => a.id === id)!).filter(Boolean);
    const remainingSlots = char.abilitySlots - selectedAbilities.length;
    
    // Categorize selected abilities
    const basicAttacks = selectedAbilities.filter(a => a.id.startsWith('basic-attack-'));
    const sustains = selectedAbilities.filter(a => a.role === 'sustain');
    const offensive = selectedAbilities.filter(a => a.role === 'prime' || a.role === 'detonator');
    
    return `
      <div class="character-ability-section" data-char-id="${char.id}">
        <div class="character-ability-header">
          <div class="cah-left">
            <div class="cah-title">${char.name} <span class="cah-class">(<img class="class-icon" src="${getClassIcon(char.classId)}" alt="${formatClassName(char.classId)}" /> ${formatClassName(char.classId)})</span></div>
            <div class="cah-sub">${renderSlotDots(char.abilitySlots, selectedAbilities.length)}</div>
          </div>
          <div class="cah-right"><span class="slots-info">${selectedAbilities.length}/${char.abilitySlots} Slots</span></div>
        </div>
        
        <!-- Weapon Selection -->
        <div class="weapon-selection">
          <h4>Weapon:</h4>
          <div class="weapon-grid">
            ${renderWeaponOptions(char.id)}
          </div>
        </div>
        
        <!-- Slot Requirements -->
        <div class="slot-requirements">
          <h4>Required Slots:</h4>
          <div class="slot-requirement-list">
            <div class="slot-requirement ${sustains.length >= 1 ? 'is-filled' : 'is-empty'}">
              <span class="requirement-label">Sustain:</span>
              <span class="requirement-status">${sustains.length >= 1 ? '✓ Filled' : '✗ Empty'}</span>
            </div>
            <div class="slot-requirement ${offensive.length >= 4 ? 'is-filled' : 'is-empty'}">
              <span class="requirement-label">Offensive (4):</span>
              <span class="requirement-status">${offensive.length}/4 ${offensive.length >= 4 ? '✓ Filled' : '✗ Incomplete'}</span>
            </div>
          </div>
        </div>
        
        <!-- Selected Abilities -->
        ${selectedAbilities.length > 0 ? `
          <div class="selected-abilities">
            <h4>Selected Abilities:</h4>
            <div class="selected-ability-list">
              ${selectedAbilities.map((ability, index) => {
                const isAOE = ability.tags?.AOE;
                const aoeIndicator = isAOE ? '<span class="aoe-badge">AOE</span>' : '';
                return `
                  <div class="selected-ability" data-ability-id="${ability.id}">
                    <span class="ability-name">${index + 1}. ${ability.name}</span>
                    ${aoeIndicator}
                    <span class="ability-role ${ability.role}">${formatRoleLabel(ability.role)}</span>
                    <button class="btn-remove" data-action="remove-ability" data-char-id="${char.id}" data-ability-id="${ability.id}">×</button>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}
        
        <!-- Available Abilities -->
        ${remainingSlots > 0 ? `
          <div class="available-abilities">
            <h4>Available Abilities (${remainingSlots} slots remaining):</h4>
            <div class="ability-grid ability-grid--mobile">
              ${availableAbilities
                .filter(ability => !selectedAbilityIds.includes(ability.id))
                .map(ability => renderAbilityCardMobile(ability, char.id))
                .join('')}
            </div>
          </div>
        ` : `
          <div class="no-slots-remaining">
            <p>All ability slots filled for ${char.name}.</p>
          </div>
        `}
      </div>
    `;
  }
  
  function renderAbilityCardMobile(ability: Ability, charId: string): string {
    const isExpanded = expandedAbilityIds.has(ability.id);
    const synergy = getSynergyHint(ability);
    const splash = ability.splashFactor ? `${Math.round(ability.splashFactor * 100)}%` : '—';
    const primes = ability.primesApplied != null ? `${ability.primesApplied}` : '—';
    
    // Check if this is an AOE ability
    const isAOE = ability.tags?.AOE;
    const aoeIndicator = isAOE ? '<span class="aoe-badge">AOE</span>' : '';
    
    // Create the title text separately to avoid complex template literal issues
    const roleTitle = ability.role === 'prime' 
      ? 'Applies a prime; target won\'t explode until a Detonator hits.' 
      : 'Same primes = more direct damage. Mixed primes = bigger AoE.';

    return `
      <div class="ability-card ability-card--mobile ${isExpanded ? 'is-expanded' : 'is-collapsed'}" data-ability-id="${ability.id}" data-char-id="${charId}">
        <button class="ability-toggle" data-action="toggle-ability" data-ability-id="${ability.id}">
          <div class="ability-left-content">
            <div class="ability-title-row">
              <span class="ability-title">${ability.name}</span>
              ${aoeIndicator}
            </div>
            <div class="ability-description">${getAbilityDescription(ability)}</div>
          </div>
          <div class="ability-right-content">
            <div class="ability-stats">
              ${ability.role === 'prime' && ability.baseDamage === 0 ? '' : `<span class="stat-compact">D ${ability.baseDamage}</span>`}
              <span class="stat-compact">CD ${ability.cooldownTurns || ability.cooldown || 0}</span>
              <span class="stat-compact">SP ${ability.superCost ? `-${ability.superCost}` : 0}</span>
            </div>
            <button class="btn btn-add-ability-compact" data-action="add-ability" data-ability-id="${ability.id}" data-char-id="${charId}" aria-label="Add ${ability.name}">+</button>
          </div>
        </button>
      </div>
    `;
  }
  
  function getClassBadge(classId: ClassId): string {
    const badges = {
      'vanguard': 'KIN',
      'technomancer': 'ARC', 
      'pyromancer': 'THR',
      'voidrunner': 'VOID'
    };
    return badges[classId];
  }

  function getClassIcon(classId: ClassId): string {
    const map: Record<ClassId, string> = {
      vanguard: VanguardIcon,
      technomancer: TechnomancerIcon,
      pyromancer: PyromancerIcon,
      voidrunner: VoidrunnerIcon,
    };
    return map[classId];
  }

  function formatClassName(classId: ClassId): string {
    const map: Record<ClassId, string> = {
      vanguard: 'Vanguard',
      technomancer: 'Technomancer',
      pyromancer: 'Pyromancer',
      voidrunner: 'Voidrunner'
    };
    return map[classId];
  }

  function formatDamageType(type: Ability['type']): string {
    const map = { kinetic: 'Kinetic', arc: 'Arc', thermal: 'Thermal', void: 'Void' } as const;
    return map[type];
  }

  function formatRoleLabel(role: Ability['role']): string {
    const map = { prime: 'Primer', detonator: 'Detonator', sustain: 'Sustain' } as const;
    return map[role];
  }

  function getDamageTypeIcon(type: Ability['type']): string {
    // Using CSS for color; return a semantic label if needed
    return `<span class="dt-icon dt-icon--${type}" aria-hidden="true"></span>`;
  }

  function renderSlotDots(total: number, used: number): string {
    const dots = Array.from({ length: total }, (_, i) => `<span class="slot-dot ${i < used ? 'is-filled' : ''}"></span>`).join('');
    return `<span class="slot-dots" aria-label="${used} of ${total} slots used">${dots}</span>`;
  }

  function getSynergyHint(ability: Ability): string {
    if (ability.role === 'detonator') {
      const primeName = pickExamplePrime(ability.type);
      return `Best used against primed targets. Pairs well with: ${primeName}`;
    }
    if (ability.role === 'prime') {
      const detName = pickExampleDetonator(ability.type);
      return `Sets up combos. Pairs well with: ${detName}`;
    }
    return 'Detonates existing primes.';
  }

  function getAbilityDescription(ability: Ability): string {
    // Special descriptions for AOE abilities
    if (ability.id === 'nova_aoe_suppressive_barrage') {
      return 'Area attack: hits 3 random enemies. Ignores 10% of shields. Costs 40 Super.';
    }
    if (ability.id === 'volt_aoe_static_surge') {
      return 'Area attack: hits all enemies. Double damage vs shielded targets. Costs 40 Super.';
    }
    if (ability.id === 'ember_aoe_emberwave') {
      return 'Area attack: hits 2 random enemies. Applies Burn prime to each. Costs 40 Super.';
    }
    if (ability.id === 'shade_aoe_entropy_collapse') {
      return 'Area attack: hits 2 random enemies. Detonates primes for bonus damage + Suppress. Costs 40 Super.';
    }
    
    // Default descriptions for other abilities
    if (ability.role === 'detonator') {
      return `Detonates existing primes for bonus damage. Base damage: ${ability.baseDamage}`;
    }
    if (ability.role === 'prime') {
      return `Applies ${ability.primeType || 'prime'} to target. Base damage: ${ability.baseDamage}`;
    }
    if (ability.role === 'sustain') {
      return 'Defensive ability with special effects.';
    }
    
    return `Base damage: ${ability.baseDamage}`;
  }

  function pickExamplePrime(type: Ability['type']): string {
    const examples: Record<Ability['type'], string> = {
      kinetic: 'Suppressive Burst',
      arc: 'Arc Surge',
      thermal: 'Thermal Lance',
      void: 'Void Suppression'
    };
    return examples[type];
  }

  function pickExampleDetonator(type: Ability['type']): string {
    const examples: Record<Ability['type'], string> = {
      kinetic: 'Rail Shot',
      arc: 'Chain Discharge',
      thermal: 'Thermal Burst',
      void: 'Gravity Collapse'
    };
    return examples[type];
  }
  
  function canStartBattle(): boolean {
    const { partySelection, selectedByChar } = loadout;
    
    // Must have exactly 3 characters selected
    if (partySelection.length !== 3) return false;
    // If a protagonist is locked, ensure they are included
    if (loadout.lockedCharacterId && !partySelection.includes(loadout.lockedCharacterId)) return false;
    
    // Each character must have abilities with proper distribution
    return partySelection.every((defId: string) => {
      const abilities = selectedByChar[defId] || [];
      if (abilities.length === 0) return false; // Must have at least some abilities
      
      // Get the actual ability objects
      const abilityObjects = abilities.map(id => loadout.allAbilities.find(a => a.id === id)).filter((a): a is NonNullable<typeof a> => a !== undefined);
      
      // Check slot constraints: 1 sustain, 4 offensive (including basic attack)
      const sustains = abilityObjects.filter(a => a.role === 'sustain');
      const offensive = abilityObjects.filter(a => a.role === 'prime' || a.role === 'detonator');
      
      // Must have exactly 1 sustain and at least 1 offensive ability (basic attack)
      return sustains.length === 1 && offensive.length >= 1;
    });
  }
  
  function addEventListeners() {
    if (onClick) return;
    onClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const addBtn = target.closest('[data-action="add-ability"]') as HTMLElement | null;
      if (addBtn) {
        const abilityId = addBtn.getAttribute('data-ability-id')!;
        const charId = addBtn.getAttribute('data-char-id')!;
        addAbilityToCharacter(charId, abilityId);
        return;
      }
      
      const removeBtn = target.closest('[data-action="remove-ability"]') as HTMLElement | null;
      if (removeBtn) {
        const abilityId = removeBtn.getAttribute('data-ability-id')!;
        const charId = removeBtn.getAttribute('data-char-id')!;
        removeAbilityFromCharacter(charId, abilityId);
        return;
      }
      
      const weaponBtn = target.closest('[data-action="select-weapon"]') as HTMLElement | null;
      if (weaponBtn) {
        const weaponId = weaponBtn.getAttribute('data-weapon-id')!;
        const charId = weaponBtn.getAttribute('data-char-id')!;
        selectWeaponForCharacter(charId, weaponId);
        return;
      }

      const partyChip = target.closest('[data-action="select-party-index"]') as HTMLElement | null;
      if (partyChip) {
        const idx = Number(partyChip.getAttribute('data-index')) || 0;
        setState((state: any) => {
          const total = state.loadout.partySelection.length;
          if (total === 0) return;
          state.loadout.loadoutActiveIndex = Math.min(Math.max(idx, 0), total - 1);
        });
        setTimeout(render, 0);
        return;
      }

      const toggleBtn = target.closest('[data-action="toggle-ability"]') as HTMLElement | null;
      if (toggleBtn) {
        const abilityId = toggleBtn.getAttribute('data-ability-id');
        if (abilityId) {
          if (expandedAbilityIds.has(abilityId)) expandedAbilityIds.delete(abilityId); else expandedAbilityIds.add(abilityId);
          // Toggle the class without full re-render to avoid scroll jumps
          const card = toggleBtn.closest('.ability-card');
          if (card) card.classList.toggle('is-expanded');
          if (card) card.classList.toggle('is-collapsed');
        }
        return;
      }
      
      if ((target as HTMLElement).id === 'btnStartBattle') {
        if (canStartBattle()) {
          goStartBattle();
        }
        return;
      }

      if ((target as HTMLElement).id === 'btnBackToParty') {
        goBackToParty();
        return;
      }
    };
    container.addEventListener('click', onClick);
  }
  
  // No add/remove party here — that happens on the party screen
  
  function addAbilityToCharacter(charId: string, abilityId: string) {
    setState(state => {
      const char = state.loadout.roster.find((c: any) => c.id === charId);
      if (!char) return;
      
      const currentAbilities = state.loadout.selectedByChar[charId] || [];
      const alreadySelected = currentAbilities.includes(abilityId);
      if (alreadySelected) return;
      
      // Get the ability being added
      const ability = state.loadout.allAbilities.find((a: Ability) => a.id === abilityId);
      if (!ability) return;
      
      console.log(`🔍 Adding ability ${abilityId} (${ability.role}) to ${charId}`);
      console.log(`📊 Current abilities:`, currentAbilities);
      console.log(`🎯 Character has ${char.abilitySlots} slots`);
      
      // Check slot constraints
      const abilityObjects: Ability[] = [];
      for (const id of currentAbilities) {
        const found = state.loadout.allAbilities.find((a: Ability) => a.id === id);
        if (found) {
          abilityObjects.push(found);
        }
      }
      
      const sustains = abilityObjects.filter((a: Ability) => a.role === 'sustain');
      const offensive = abilityObjects.filter((a: Ability) => a.role === 'prime' || a.role === 'detonator');
      
      console.log(`📈 Current counts - Sustains: ${sustains.length}, Offensive: ${offensive.length}`);
      
      // Check if adding this ability would violate constraints
      if (ability.role === 'sustain') {
        if (sustains.length >= 1) {
          console.log(`❌ Cannot add sustain - already have ${sustains.length}`);
          return; // Already have a sustain
        }
      } else if (ability.role === 'prime' || ability.role === 'detonator') {
        if (offensive.length >= 4) {
          console.log(`❌ Cannot add offensive - already have ${offensive.length}`);
          return; // Already have 4 offensive abilities
        }
      }
      
      // Check if we're at the slot limit
      if (currentAbilities.length >= char.abilitySlots) {
        console.log(`❌ Cannot add - at slot limit ${currentAbilities.length}/${char.abilitySlots}`);
        return;
      }
      
      // All checks passed, add the ability
      console.log(`✅ Adding ability ${abilityId} to ${charId}`);
      state.loadout.selectedByChar[charId] = [...currentAbilities, abilityId];
      console.log(`📊 New ability list:`, state.loadout.selectedByChar[charId]);
    });
  }
  
  function removeAbilityFromCharacter(charId: string, abilityId: string) {
    setState(state => {
      const currentAbilities = state.loadout.selectedByChar[charId] || [];
      state.loadout.selectedByChar[charId] = currentAbilities.filter((id: string) => id !== abilityId);
    });
  }
  
  function selectWeaponForCharacter(charId: string, weaponId: string) {
    setState(state => {
      if (!state.loadout.selectedWeaponByChar) {
        state.loadout.selectedWeaponByChar = {};
      }
      state.loadout.selectedWeaponByChar[charId] = weaponId;
    });
    // Re-render to show the selection
    setTimeout(render, 0);
  }
  
  function renderWeaponOptions(charId: string): string {
    const currentWeaponId = loadout.selectedWeaponByChar?.[charId] || 'none';
    
    console.log('Rendering weapon options for char:', charId);
    console.log('Available weapons:', ALL_WEAPONS);
    
    return ALL_WEAPONS.map(weapon => {
      const isSelected = weapon.id === currentWeaponId;
      const elementType = weapon.basicType || 'kinetic';
      const elementClass = `weapon-element weapon-element--${elementType}`;
      const elementName = elementType.charAt(0).toUpperCase() + elementType.slice(1);
      
      console.log(`Weapon ${weapon.name}:`, { elementType, elementClass, elementName });
      
      return `
        <button class="weapon-option ${isSelected ? 'is-selected' : ''}" 
                data-action="select-weapon" 
                data-char-id="${charId}" 
                data-weapon-id="${weapon.id}">
          <div class="weapon-info">
            <div class="weapon-name">${weapon.name}</div>
            <div class="weapon-stats">
              ${weapon.basicMult ? `Basic x${weapon.basicMult.toFixed(2)}` : ''}
              ${weapon.totalDamageMult ? `Damage x${weapon.totalDamageMult.toFixed(2)}` : ''}
              ${weapon.maxHpBonus ? `+${weapon.maxHpBonus} HP` : ''}
              ${weapon.maxShBonus ? `+${weapon.maxShBonus} SH` : ''}
              ${weapon.superGainMult ? `Super x${weapon.superGainMult.toFixed(2)}` : ''}
            </div>
          </div>
          <span class="${elementClass}">${elementName}</span>
        </button>
      `;
    }).join('');
  }
  
  render();
  
  // Return cleanup function
  return () => {
    if (onClick) {
      container.removeEventListener('click', onClick);
      onClick = null;
    }
    container.innerHTML = '';
  };
}
