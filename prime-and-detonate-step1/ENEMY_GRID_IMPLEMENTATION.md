# Enemy Grid System Implementation

## Overview
The enemy grid system has been completely redesigned to provide a stable, fixed 4×3 grid layout that prevents layout shifts and properly handles different enemy sizes. Enemy cards now display only essential combat information (SH and HP values) in a clean, minimalist design.

## Grid Specifications
- **Dimensions**: 4 columns × 3 rows = 12 total slots
- **Total Height**: 260px (3 rows × 80px + 2 gaps × 10px)
- **Column Width**: 80px each
- **Column Gap**: 12px between columns
- **Row Height**: 80px each
- **Row Gap**: 10px between rows
- **Container Width**: 368px (4 × 80px + 3 × 12px)

## Enemy Card Sizes
- **Standard Enemies (Grunt/Elite)**: 80px × 80px (1 grid slot)
- **Mini-boss**: 172px × 80px (spans 2 columns + 1 gap)
- **Boss**: 264px × 80px (spans 3 columns + 2 gaps)

## Implementation Details

### 1. Grid Structure
The grid is implemented using CSS Grid with fixed dimensions:
```css
.enemy-grid-container {
  display: grid;
  grid-template-rows: repeat(3, 80px);
  gap: 10px;
  height: 260px;
  max-width: 368px;
  margin: 0 auto;
}

.enemy-grid-row {
  display: grid;
  grid-template-columns: repeat(4, 80px);
  gap: 12px;
  height: 80px;
}
```

### 2. Enemy Placement Algorithm
Enemies are placed in the grid based on their tier and size:
1. **Boss enemies** are placed first, taking 3 consecutive slots
2. **Mini-boss enemies** are placed next, taking 2 consecutive slots
3. **Elite enemies** are placed in single slots
4. **Grunt enemies** fill remaining single slots

### 3. Slot Management
- Empty slots are marked with `enemy-grid-slot--empty` class
- Slots occupied by larger enemies are marked with `enemy-grid-slot--occupied` class
- This prevents layout shifts and maintains grid structure

### 4. Responsive Design
- Grid is centered with `margin: 0 auto`
- Responsive adjustments for screens smaller than 400px
- Fallback styles for browsers that don't support CSS Grid

## CSS Classes

### Grid Container
- `.enemy-grid-container` - Main grid wrapper
- `.enemy-grid-row` - Individual row container
- `.enemy-grid-slot` - Individual grid slot
- `.enemy-grid-slot--empty` - Empty slot placeholder
- `.enemy-grid-slot--occupied` - Occupied slot placeholder

### Enemy Cards
- `.enemy-thumb--standard` - Standard enemy (80×80)
- `.enemy-thumb--miniboss` - Mini-boss (172×80)
- `.enemy-thumb--boss` - Boss (264×80)

### Content Elements
- `.enemy-thumb__content` - Card content wrapper (centered with 8px horizontal padding)
- `.enemy-thumb__hp-num` - HP display for grunts (10px font, e.g., "HP 15")
- `.enemy-thumb__stats` - SH/HP display for other enemies (10px font, e.g., "SH 30 HP 130")

## Benefits

1. **Stable Layout**: Fixed dimensions prevent layout shifts
2. **Predictable Sizing**: Each enemy type has consistent dimensions
3. **Efficient Space Usage**: Grid automatically handles different enemy sizes
4. **Mobile Optimized**: Designed for mobile screens with touch-friendly sizing
5. **Clean Interface**: Minimalist design showing only essential combat information
6. **Accessibility**: Proper ARIA labels and keyboard navigation support

## Usage

The grid system automatically activates when enemies are present in the battle. No additional configuration is required. The system will:

- Automatically size enemies based on their tier
- Place enemies in appropriate grid slots
- Maintain grid structure even when enemies are added/removed
- Center the grid horizontally in the available space

## Browser Support

- **Modern Browsers**: Full CSS Grid support with `:has()` selector
- **Legacy Browsers**: Fallback styles ensure basic functionality
- **Mobile Browsers**: Optimized for mobile devices with responsive adjustments
