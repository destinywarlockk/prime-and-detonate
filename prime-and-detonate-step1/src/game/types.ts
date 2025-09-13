export type Bars = { sh: number; hp: number; sp: number };
export type MaxBars = { sh: number; hp: number; sp: number };

export type DamageType = 'kinetic' | 'arc' | 'thermal' | 'void';

export type Weapon = {
  id: string;
  name: string;
  basicMult?: number;
  basicType?: DamageType;
  totalDamageMult?: number;
  detonationDirectMult?: number;
  detonationSplashMult?: number;
  maxHpBonus?: number;
  maxShBonus?: number;
  superGainMult?: number;
};

export type PrimeType = 'weakpoint' | 'overload' | 'burn' | 'suppress' | 'freeze' | 'pierce';

export type AbilityRole = 'prime' | 'detonator' | 'sustain';

export type ClassId = 'vanguard' | 'technomancer' | 'pyromancer' | 'voidrunner';

export type Ability = {
  id: string;
  name: string;
  type: DamageType; // element
  role: AbilityRole;
  baseDamage: number;
  // Optional cooldown in turns; if omitted, ability has no cooldown
  cooldown?: number;
  
  // Prime effects
  primesApplied?: number;           // default 0
  primeType?: PrimeType;            // what type of prime is applied
  
  // Detonation
  detonates?: boolean;              // default false
  detonationTriggers?: PrimeType[]; // what primes can trigger this detonation
  
  // Special effects
  splashFactor?: number;            // 0..1, default 0
  cost?: number;                    // optional SP/energy later
  
  // Class restrictions
  allowedClasses: ClassId[];        // which classes can equip this
  
  // Advanced effects (for future expansion)
  critBonus?: number;               // critical hit multiplier
  aoeRadius?: number;               // area of effect radius
  statusEffects?: string[];         // stun, slow, etc.
  comboMultiplier?: number;         // damage multiplier for combos
  
  // New tagging system for prime/detonate semantics
  tags?: {
    prime?: true;
    detonator?: true;
    primeElement?: DamageType;      // element of prime applied by this ability
    primeName?: string;             // display name of the prime, e.g., Weakpoint
    // Sustain abilities (e.g., guard, overcharge) for slot C constraint
    sustain?: true;
    // AOE targeting modes
    AOE?: true;
    // Special rider tags
    NoPrimeNoDet?: true;
    ShieldBreaker?: true;
    Primer?: true;
    Detonator?: true;
    Control?: true;
  };
  // Optional super cost for abilities that spend Super explicitly (e.g., sustains)
  superCost?: number;
  // Optional cooldown in turns for AOE abilities
  cooldownTurns?: number;
  // Whether this ability grants Super on hit (default true for most abilities)
  grantsSuperOnHit?: boolean;
  // AOE targeting configuration
  targeting?: {
    mode: 'all' | 'n-random' | 'n-closest' | 'single';
    count?: number;
  };
  // Special mechanical riders for AOE abilities
  riders?: string[];
};

export type CharacterDef = {
  id: string;
  name: string;
  classId: ClassId;
  baseBars: { sh: number; hp: number; sp: number };
  abilitySlots: number;             // e.g., 4
};

export type Prime = {
  element: DamageType;
  source: string;
  appliedAt: number;
};

export type PartyMember = {
  actorId: string;                  // instance id in battle
  defId: string;                    // ref to CharacterDef
  name: string;
  classId: ClassId;
  bars: { sh: number; hp: number; sp: number };
  primes: Prime[];                  // at most 2
  abilityIds: string[];             // equipped for this member
  // Super meter (0..300)
  superEnergy?: number;
  weaponId?: string;
};

export type Actor = {
  id: string;
  name: string;
  bars: Bars;
  maxBars: MaxBars;
  primes: Prime[];
  // Optional, used for players primarily
  superEnergy?: number;
  // Optional: enemy archetype key to allow re-hydration of instances if registry is cleared (e.g., during HMR)
  enemyKey?: string;
};

export type DamageRequest = {
  raw: number;
  type: DamageType;
};

export type CombatResult = {
  damage: number;
  remainingDamage: number;
  shieldBroken: boolean;
  targetDestroyed: boolean;
  log: string[];
};

export type LoadoutState = {
  roster: CharacterDef[];           // the 8 options
  partySelection: string[];         // defIds chosen (length 3)
  maxParty: number;                 // 3
  allAbilities: Ability[];          // master ability list
  selectedByChar: Record<string, string[]>; // key: defId → chosen abilityIds
  loadoutActiveIndex: number;       // which selected character is being configured
  allWeapons?: Weapon[];
  selectedWeaponByChar?: Record<string, string | undefined>;
  // If set, this character must be in the party and cannot be removed
  lockedCharacterId?: string;
};

export type BattleState = {
  party: PartyMember[];             // length 3
  enemies: Actor[];                 // unchanged from Step 6
  targetIndex: number;              // Which enemy is targeted (0-based)
  turn: 'player' | 'enemy';
  activePartyIndex: number;         // whose turn it is in the party
  selectedAbilityId?: string;       // which ability is selected for use
  log: string[];
  isOver: boolean;
  // Cooldowns per member per ability id
  cooldownsByMember?: Record<string, Record<string, number>>;
  // Tracks consecutive basic attacks per member
  basicStreakByMember?: Record<string, number>;
  // Track per-member super gains during the current turn
  superEnergyGainedThisTurn?: Record<string, number>;
  // Sustain system: track per-member turn counters for fatigue windows
  memberTurnCountById?: Record<string, number>;
  // Sustain system: last use turn per sustain type for each member
  sustainLastUseByMember?: Record<string, Partial<Record<'heal'|'barrier'|'cleanse'|'guard'|'kinetic-barrier'|'thermal-burst-sustain'|'arc-restore'|'void-drain', number>>>;
  // Barrier buffs: temporary damage absorption that expires after enemy phase or max hits
  barriersByMember?: Record<string, { amountLeft: number; hitsLeft: number; phasesLeft: number }>;
  // Guard buff: redirects damage from allies to the caster for a short time
  guardBuff?: { casterId: string; redirectPct: number; phasesLeft: number } | undefined;
  // Phase 3: class Supers, temporary round effects
  // Overdrive: kills by this member grant extra actions during the current player round
  overdriveByMember?: Record<string, { autoDetonateHits: boolean; active: boolean }>; 
  // Inferno field: thermal field for N enemy phases; detonations refresh/add burn
  infernoFieldPhasesLeft?: number;
  // UI: remember last selected ability per member for this battle
  lastSelectedAbilityByMember?: Record<string, string>;
  // One-battle mission bonus applied to player side only
  missionBuff?: { playerDamageMult?: number; detonationSplashMult?: number };
  // Current mission information for victory screen
  currentMission?: { id: string; name: string; victoryText?: string };
  // Targeting flow for ally-targeted sustains (e.g., heals)
  isTargetingAlly?: boolean;
  selectedAllyIndex?: number; // Which party member is the selected ally target
  armedAbilityId?: string;    // Ability that initiated targeting
  // New turn system: track how many party members have acted this round
  partyMembersActedThisRound?: number;
};

export type AppState = {
  screen: 'welcome' | 'party' | 'loadout' | 'dialogue' | 'battle' | 'missions';
  loadout: LoadoutState;
  battle: BattleState;
  mission?: MissionProgress;
  dialogue?: DialogueState;
  // UI: remember where we navigated from when entering Missions, for proper back behavior
  lastScreenBeforeMissions?: AppState['screen'];
};

// Dialogue and missions
export type ChoiceOption = {
  label: string;
  star?: boolean;
  followup?: { speaker?: string; side?: 'left'|'right'|'center'; text: string };
};

export type DialogueLine =
  | { scene?: string; speaker?: string; side?: 'left'|'right'|'center'; text: string; greyedOut?: boolean }
  | { type: 'choice'; scene?: string; title: string; options: ChoiceOption[] };

export type DialogueState = {
  script: DialogueLine[];
  index: number;
  stars: number;            // 0..3
  isBossNext?: boolean;     // for potential rewards
  rewardWeaponId?: string;  // granted on success
  // Optional UI hints for left/right speaker labels/portraits
  leftName?: string;
  rightName?: string;
  leftImgUrl?: string;
  rightImgUrl?: string;
  // Optional mission-level default background key (e.g., "Boldness")
  defaultSceneBg?: string;
  // Optional: dialogue context for faction-based positioning rules
  allyFaction?: 'Outlaws'|'Voidborn'|'Syndicate'|'Accord';
  enemyFaction?: 'Outlaws'|'Voidborn'|'Syndicate'|'Accord';
};

export type Mission = {
  id: string;
  name: string;
  script: DialogueLine[];
  isBoss?: boolean;
  rewardWeaponId?: string;
  victoryText?: string; // Narrative resolution text shown on victory screen
  missionBuff?: { playerDamageMult?: number; detonationSplashMult?: number }; // Mission buff/penalty from dialogue choices
};

// Extended mission types for the new scene-based system
export type SkillCheckChoice = {
  label: string;
  text: string;
  result: 'pass' | 'fail';
};

export type SkillCheck = {
  description: string;
  choices: SkillCheckChoice[];
};

export type MissionScene = {
  image: string;
  dialogue: Array<{
    speaker: string;
    position: 'left' | 'right' | 'narrator';
    text: string;
    greyedOut?: boolean;
  }>;
  skillCheck?: SkillCheck;
};

export type PostBattleOutcomes = {
  threePasses: string;
  oneOrTwoPasses: string;
  zeroPasses: string;
};

export type ExtendedMission = {
  id: string;
  name: string;
  character: string;
  factionMet: string;
  factionFought: string;
  lessonTitle: string;
  flavorText: string;
  scenes: MissionScene[];
  postBattle: PostBattleOutcomes;
};

export type MissionProgress = {
  completed: Record<string, { bestStars: number }>;
  current?: Mission | null;
};
