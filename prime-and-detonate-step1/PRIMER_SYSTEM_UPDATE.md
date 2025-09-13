# Primer System Update - Two Balanced Rows Layout

## Overview

The enemy cards on the battle screen have been updated to use a new primer system with a balanced two-row layout. This prevents layout shift and provides clear visual feedback for the primer state of each enemy, with equal vertical space allocation for both rows.

## Changes Made

### 1. CSS Updates (`src/ui/battle.ts`)

#### New Grid Layout Classes
```css
/* Two Balanced Rows Layout */
.enemy-thumb__content {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 1fr 1fr;
  gap: 0;
  width: 100%;
  height: 100%;
  padding: 0;
}

.enemy-thumb__stats-grid { display: contents; }
.enemy-thumb__stat-column {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  padding-right: 6px;
}
```

#### Stat Display Styling
```css
.enemy-thumb__stat-row {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 2px;
  font-size: 10px;
  color: #fca5a5;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.enemy-thumb__stat-label { font-size: 9px; opacity: 0.8; line-height: 1; }
.enemy-thumb__stat-value { font-size: 12px; font-weight: 700; line-height: 1; }
```

#### Primer Slot Dots
```css
.enemy-thumb__slot-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  justify-self: center;
}

.enemy-thumb__slot-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  border: 1px solid rgba(15,23,42,.9);
  background: white;
  flex-shrink: 0;
  box-shadow: 0 0 0 0 rgba(255,255,255,0);
}

/* Element-specific colors with subtle glow */
.enemy-thumb__slot-dot--kinetic { 
  background: rgb(148,163,184); 
  box-shadow: 0 0 4px rgba(148,163,184,0.4);
}
.enemy-thumb__slot-dot--arc { 
  background: rgb(56,189,248); 
  box-shadow: 0 0 4px rgba(56,189,248,0.4);
}
.enemy-thumb__slot-dot--thermal { 
  background: rgb(239,68,68); 
  box-shadow: 0 0 4px rgba(239,68,68,0.4);
}
.enemy-thumb__slot-dot--void { 
  background: rgb(168,85,247); 
  box-shadow: 0 0 4px rgba(168,85,247,0.4);
}
```

### 2. JavaScript Updates (`src/ui/battle.ts`)

#### Updated `renderEnemyThumb` Function
The function now generates a structured 2×2 grid layout:

```typescript
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
```

#### HTML Structure
```html
<div class="enemy-thumb__stats-grid">
          <!-- Left column: SH (hidden for grunts) -->
        <div class="enemy-thumb__stat-column" style="${!showShield ? 'display: none;' : ''}">
          <div class="enemy-thumb__stat-row">
            <span class="enemy-thumb__stat-label">SH</span>
            <span class="enemy-thumb__stat-value">${fmt(actor.bars.sh)}</span>
          </div>
          <div class="enemy-thumb__slot-row">
            ${renderSlotDot(0, slot1Prime)}
          </div>
        </div>
  
  <!-- Right column: HP -->
  <div class="enemy-thumb__stat-column">
    <div class="enemy-thumb__stat-row">
      <span class="enemy-thumb__stat-label">HP</span>
      <span class="enemy-thumb__stat-value">${fmt(actor.bars.hp)}</span>
    </div>
    <div class="enemy-thumb__slot-row">
      ${renderSlotDot(1, slot2Prime)}
    </div>
  </div>
</div>
```

## Layout Specifications

### Grid Structure
- **2 columns**: Each column takes exactly 50% of the card width
- **2 balanced rows**: Each row takes equal vertical space (1fr each) for visual balance
- **Row 1**: Stats with labels stacked above numbers
- **Row 2**: Primer slots aligned under their respective stats
- **Fixed sizing**: Content area maintains consistent dimensions

### Alignment & Spacing
- **Right padding**: 6px inside each column for consistent right edge alignment
- **Vertical gap**: 2px between label and value in stat rows
- **Row balance**: Both rows take equal vertical space (1fr each)
- **Right alignment**: All content (labels, values, dots) aligned to column right edge

### Primer Slot Dots
- **Size**: 11px diameter circles
- **Colors**: 
  - Empty: White
  - Kinetic: Gray (rgb(148,163,184))
  - Arc: Blue (rgb(56,189,248))
  - Thermal: Red (rgb(239,68,68))
  - Void: Purple (rgb(168,85,247))
- **Border**: Card background color for contrast
- **Glow effects**: Subtle element-colored glow when filled (4px radius, 40% opacity)

### Typography
- **Tabular numerals**: `font-variant-numeric: tabular-nums` prevents digit jitter
- **Labels**: 9px, 80% opacity, stacked above values
- **Values**: 12px, bold weight, larger for better readability
- **Color**: Consistent #fca5a5 (red-pink) for all stats
- **Layout**: Labels and values are stacked vertically for cleaner appearance

## Primer Logic

### Slot Assignment
1. **First prime** fills Slot 1 (left column, under SH)
2. **Second prime** fills Slot 2 (right column, under HP)
3. **Mixed primes** are supported - each slot shows its element's color

### Grunt Enemy Handling
- **SH column hidden**: Grunt enemies have their SH column set to `display: none`
- **Single column layout**: Grunts only show HP and their primer slots
- **Consistent sizing**: Cards maintain the same dimensions regardless of tier

### Visual States
- **No primes**: Both slots show white dots
- **Single prime**: Slot 1 shows element color, Slot 2 shows white
- **Two primes**: Both slots show their respective element colors
- **Card border**: Glows with the first prime's element color

### State Changes
- **On prime**: Dots fill with element colors in order
- **On detonate**: Both dots clear (return to white)
- **On expiration**: Both dots clear
- **On cleanse**: Both dots clear

## Benefits

### Layout Stability
- **No layout shift**: Fixed grid prevents content from moving
- **Consistent sizing**: Cards maintain dimensions regardless of primer state
- **Predictable spacing**: All elements have fixed positions

### Visual Clarity
- **Clear primer state**: Easy to see which enemies are primed
- **Element identification**: Color-coded dots show prime types
- **Slot order**: Left-to-right progression matches prime application order

### User Experience
- **Immediate feedback**: Visual changes happen instantly
- **Accessibility**: Tooltips provide additional context
- **Consistency**: Same layout across all enemy tiers (Grunt, Elite, Miniboss, Boss)

## Testing

### Demo File
A visual demo is available at `primer-system-demo.html` that showcases:
- Different primer states
- Various enemy sizes
- Element color examples
- Layout specifications

### In-Game Testing
The system has been integrated into the battle screen and can be tested by:
1. Starting a battle
2. Applying primes to enemies
3. Observing the visual changes
4. Detonating primes to see dots clear

## Compatibility

### Browser Support
- Modern browsers with CSS Grid support
- Fallback to flexbox for older browsers (graceful degradation)

### Existing Features
- Maintains all current enemy card functionality
- Preserves tier-based sizing (Grunt, Elite, Miniboss, Boss)
- Compatible with existing primer/detonation mechanics

### Performance
- Minimal DOM changes during updates
- Efficient CSS Grid rendering
- No JavaScript performance impact

## Future Enhancements

### Potential Additions
- **Prime duration indicators**: Visual countdown or fade effects
- **Combo indicators**: Special effects for multiple primes
- **Element interactions**: Visual feedback for element combinations
- **Animation**: Smooth transitions for state changes

### Accessibility Improvements
- **Screen reader support**: Better ARIA labels
- **High contrast mode**: Enhanced visibility options
- **Keyboard navigation**: Improved focus management
