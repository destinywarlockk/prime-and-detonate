import React from "react";
import type { Ability } from "../types";
import { badgeToneClass, formatElementLabel, formatTypeLabel, shouldShowBaseDamage, typeTooltip } from "../../../ui/abilityCopy";

type Props = {
  ability: Ability;
  isAdded: boolean;
  isDisabled: boolean;
  disabledReason?: 'slots' | 'sustain' | 'offense-cap';
  onAdd: () => void;
  onRemove: () => void;
};

function dmgTypeClass(type: Ability["damageType"]) {
  return `dt-icon dt-icon--${type}`;
}

export const AbilityCard: React.FC<Props> = ({ ability, isAdded, isDisabled, disabledReason, onAdd, onRemove }) => {
  const buttonLabel = isAdded
    ? "Added"
    : isDisabled
    ? (disabledReason === 'sustain' ? 'Sustain Taken' : 
       disabledReason === 'offense-cap' ? 'Offense Full' : 
       'Slots Full')
    : "Add Ability";
  const isSustain = ability.abilityType === 'sustain';

  return (
    <div
      className={`ability-card ability-card--compact ${isSustain ? 'ability-card--sustain' : ''}`}
      role="group"
      aria-label={`${ability.name} card`}
      style={{
        background: '#0e1420',
        border: '1px solid #1f2a3a',
        borderRadius: '12px',
        padding: '12px',
        gap: '8px',
        touchAction: 'manipulation',
        width: '100%',
        boxSizing: 'border-box',
        transition: 'all 0.2s ease',
        minHeight: 'auto'
      }}
    >
      {/* Main Ability Row */}
      <div className="ability-main-row" style={{ 
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        minHeight: '44px'
      }}>
        {/* Left side: Name and stats */}
        <div className="ability-info" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          flex: 1, 
          minWidth: 0 
        }}>
          <div className="ability-title-and-description" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            flex: 1,
            minWidth: 0
          }}>
            <span 
              className="ability-name" 
              style={{ 
                fontSize: '14px', 
                fontWeight: '700', 
                color: '#f8fafc',
                lineHeight: '1.2'
              }}
              title={ability.name}
            >
              {ability.name}
            </span>
            {(ability.effectText || ability.synergyHint) && (
              <span className="ability-description" style={{
                fontSize: '11px',
                color: '#94a3b8',
                lineHeight: '1.2',
                fontStyle: 'italic'
              }}>
                {ability.effectText && `${ability.effectText}`}
                {ability.effectText && ability.synergyHint && ' • '}
                {ability.synergyHint && `${ability.synergyHint}`}
              </span>
            )}
            {/* Show DMG and SPLASH stats inline for offensive abilities */}
            {!isSustain && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                {shouldShowBaseDamage(ability.abilityType, ability.damage) && (
                  <span className="stat-inline" style={{ 
                    fontSize: '10px',
                    color: '#94a3b8',
                    fontWeight: 500
                  }}>
                    DMG {ability.damage}
                  </span>
                )}
                {typeof ability.splashPct === 'number' && (
                  <span className="stat-inline" style={{ 
                    fontSize: '10px',
                    color: '#94a3b8',
                    fontWeight: 500
                  }}>
                    SPLASH {ability.splashPct}%
                  </span>
                )}
              </div>
            )}
          </div>
          {/* Role pill for offensive abilities */}
          {!isSustain && (
            <span
              style={{
                padding: '2px 6px',
                fontSize: '10px',
                fontWeight: 600,
                borderRadius: 999,
                border: `1px solid ${ability.abilityType === 'prime' ? '#245a9b' : '#7a3a1c'}`,
                color: ability.abilityType === 'prime' ? '#9cd2ff' : '#ffb38a',
                background: 'rgba(31,41,55,0.35)',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
              aria-label={ability.abilityType === 'prime' ? 'Primer' : 'Detonator'}
              title={ability.abilityType === 'prime' ? 'Primer' : 'Detonator'}
            >
              {ability.abilityType === 'prime' ? 'Primer' : 'Detonator'}
            </span>
          )}

          {/* CD and Super stats inline with title */}
          {typeof ability.cooldown === 'number' && (
            <span className="stat-inline" style={{ 
              fontSize: '10px',
              color: '#94a3b8',
              fontWeight: 500,
              flexShrink: 0
            }}>
              CD {ability.cooldown}
            </span>
          )}
          {typeof ability.superCost === 'number' && (
            <span className="stat-inline" style={{ 
              fontSize: '10px',
              color: '#94a3b8',
              fontWeight: 500,
              flexShrink: 0
            }}>
              SP {ability.superCost > 0 ? `-${ability.superCost}` : ability.superCost}
            </span>
          )}
        </div>

        {/* Right side: Badges and action button */}
        <div className="ability-actions" style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0
        }}>




          {/* Action button */}
          {!isAdded ? (
            <button
              type="button"
              className="btn btn-add-ability-compact"
              onClick={() => {
                console.log('Button clicked for:', ability.name);
                onAdd();
              }}
              onMouseDown={() => console.log('Mouse down on:', ability.name)}
              onMouseUp={() => console.log('Mouse up on:', ability.name)}
              onTouchStart={() => console.log('Touch start on:', ability.name)}
              onTouchEnd={() => console.log('Touch end on:', ability.name)}
              disabled={isDisabled}
              role="button"
              aria-label={`${buttonLabel} ${ability.name}`}
              style={{
                minHeight: '36px',
                minWidth: '96px',
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: '600',
                touchAction: 'manipulation',
                flexShrink: 0,
                borderRadius: '8px',
                border: '1px solid #3b82f6',
                background: isDisabled ? '#374151' : '#3b82f6',
                color: '#ffffff',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.6 : 1,
                // Temporary debugging styles
                position: 'relative',
                zIndex: 1000,
                boxShadow: isDisabled ? 'none' : '0 0 10px rgba(59, 130, 246, 0.5)'
              }}
            >
              {buttonLabel}
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-remove-ability"
              onClick={onRemove}
              role="button"
              aria-label={`Remove ${ability.name}`}
              style={{
                minHeight: '36px',
                minWidth: '96px',
                padding: '8px 12px',
                fontSize: '12px',
                background: '#475569',
                borderColor: '#64748b',
                color: '#f1f5f9',
                fontWeight: 600,
                touchAction: 'manipulation',
                flexShrink: 0,
                borderRadius: '8px',
                border: '1px solid #64748b',
                cursor: 'pointer'
              }}
            >
              Remove
            </button>
          )}
        </div>
      </div>




    </div>
  );
};


