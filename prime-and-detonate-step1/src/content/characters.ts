import type { CharacterDef } from '../game/types';

export const CHARACTER_ROSTER: CharacterDef[] = [
  // Vanguard (kinetic bruiser)
  {
    id: 'nova',
    name: 'Nova',
    classId: 'vanguard',
    baseBars: { sh: 35, hp: 130, sp: 0 },
    abilitySlots: 5
  },
  
  // Technomancer (arc specialist)
  {
    id: 'volt',
    name: 'Volt',
    classId: 'technomancer',
    baseBars: { sh: 45, hp: 105, sp: 0 },
    abilitySlots: 5
  },
  
  // Pyromancer (thermal specialist)
  {
    id: 'ember',
    name: 'Ember',
    classId: 'pyromancer',
    baseBars: { sh: 30, hp: 115, sp: 0 },
    abilitySlots: 5
  },
  
  // Voidrunner (void debuffer)
  {
    id: 'shade',
    name: 'Shade',
    classId: 'voidrunner',
    baseBars: { sh: 25, hp: 110, sp: 0 },
    abilitySlots: 5
  },
  // Hidden others will be re-added later when unique images are ready
];
