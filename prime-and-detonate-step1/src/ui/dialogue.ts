import type { DialogueState, ChoiceOption } from '../game/types';

export function mountDialogue(
  root: HTMLElement,
  getState: () => DialogueState,
  setState: (updates: Partial<DialogueState>) => void,
  onComplete: (result: { stars: number } & { route?: 'party' | 'loadout' | 'battle' } & { skipDialogue?: boolean }) => void
): () => void {
  // Auto-map uploaded images for use as scene backgrounds by name
  const SCENE_BG_URLS: Record<string, string> = (() => {
    try {
      const mods = (import.meta as any).glob('../../assets/images/**/*.{png,jpg,jpeg,webp,svg}', {
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

  root.innerHTML = '';
  const el = document.createElement('div');
  el.className = 'dialogue-screen';
  root.appendChild(el);
  el.innerHTML = `
    <style id="dialogue-inline-style">.dlg-wrap{display:grid;position:relative;grid-template-rows:auto 1fr auto;height:100dvh;max-width:480px;margin:0 auto;background-color:#0b1220;color:#e5e7eb;background-position:center center;background-repeat:no-repeat;background-size:auto 100dvh}.dlg-bg{position:absolute;inset:0;z-index:0;pointer-events:none}.dlg-bg__layer{position:absolute;inset:0;background-position:center center;background-repeat:no-repeat;background-size:auto 100dvh;opacity:0;transition:opacity 1200ms ease}.dlg-bg__layer.is-visible{opacity:1}.dlg-hud{position:relative;z-index:5;height:60px;display:flex;align-items:center;justify-content:center;border-bottom:1px solid rgba(255,255,255,.08)}.dlg-header{display:flex;align-items:center;justify-content:space-between;width:100%;padding:0 16px;pointer-events:auto}.dlg-stars{font-size:24px;color:#fbbf24}.dlg-skip{display:flex;justify-content:flex-end}.dlg-skip .btn{background:rgba(220,38,38,.2);border:1px solid rgba(220,38,38,.5);color:#fca5a5;font-size:12px;padding:6px 12px;border-radius:6px;font-weight:600;transition:all .2s ease}.dlg-skip .btn:hover{background:rgba(220,38,38,.3);border-color:rgba(220,38,38,.7)}.dlg-scene{position:relative;z-index:1;display:grid;grid-template-columns:1fr 1fr;align-items:end;gap:8px;padding:12px;height:100%}.dlg-char{display:flex;flex-direction:column;align-items:center;gap:6px;opacity:.6;transition:opacity .2s ease;z-index:1}.dlg-char.active{opacity:1}.dlg-char.greyed-out{opacity:0.3;filter:grayscale(80%)}.dlg-portrait{width:120px;height:120px;border-radius:8px;background:rgba(15,23,42,.9);border:1px solid rgba(148,163,184,.25);background-size:cover;background-position:center}.dlg-name{font-size:12px;opacity:.9}.dlg-bubble-row{grid-column:1 / -1;display:flex;gap:8px;align-items:flex-end;justify-content:space-between;padding-bottom:200px}.dlg-bubble-row.center{position:absolute;left:12px;right:12px;bottom:calc(env(safe-area-inset-bottom, 12px) + 240px);top:auto;transform:none;justify-content:center;align-items:center;min-height:0;padding-bottom:0;z-index:2}.dlg-bubble-row.center > div[style*="flex:1"]{display:none}.dlg-bubble-row.left{position:absolute;left:12px;bottom:calc(env(safe-area-inset-bottom, 12px) + 240px);top:auto;transform:none;justify-content:flex-start;align-items:flex-end;min-height:0;padding-bottom:0;z-index:2;width:auto}.dlg-bubble-row.right{position:absolute;right:2px;bottom:calc(env(safe-area-inset-bottom, 12px) + 240px);top:auto;transform:none;justify-content:flex-end;align-items:flex-end;min-height:0;padding-bottom:0;z-index:2;width:auto}.dlg-bubble{max-width:75%;background:rgba(30,41,59,.9);border:1px solid rgba(148,163,184,.25);border-radius:12px;padding:10px}.dlg-bubble.left{align-self:flex-end;max-width:300px}.dlg-bubble.right{align-self:flex-end;background:rgba(51,65,85,.9);max-width:280px;margin-right:4px}.dlg-bubble.narrator{background:linear-gradient(180deg,rgba(30,41,59,.95),rgba(15,23,42,.95));border-color:rgba(250,204,21,.35);box-shadow:0 0 20px rgba(250,204,21,.08) inset,0 4px 24px rgba(0,0,0,.35);max-width:400px}.dlg-bubble.narrator .dlg-text{font-size:16px;line-height:1.3;text-shadow:0 1px 2px rgba(0,0,0,.6)}.dlg-speaker{font-size:11px;font-weight:700;margin-bottom:4px;color:#93c5fd}.dlg-text{font-size:14px;line-height:1.25}.choice-wrap{position:absolute;left:12px;right:12px;bottom:calc(env(safe-area-inset-bottom, 12px) + 200px);display:flex;align-items:flex-end;justify-content:center;background:transparent;pointer-events:none}.choice-card{background:rgba(15,23,42,.95);border:1px solid rgba(148,163,184,.3);border-radius:12px;padding:12px;max-width:420px;width:90%;pointer-events:auto}.choice-title{font-weight:800;margin-bottom:8px}.choice-list{display:flex;flex-direction:column;gap:8px}.choice-list .btn{white-space:normal;word-wrap:break-word;text-align:left;min-height:44px;line-height:1.3;padding:12px}.tap{position:absolute;left:0;right:0;bottom:0;height:50%;opacity:0;z-index:4}#char-left{position:absolute;left:12px;bottom:8px}#char-right{position:absolute;right:12px;bottom:8px}.dlg-final{position:absolute;left:0;right:0;bottom:calc(env(safe-area-inset-bottom, 12px) + 156px);display:flex;align-items:flex-end;justify-content:center;z-index:3}.dlg-final .final-card{display:flex;gap:8px;align-items:center;justify-content:center;background:rgba(15,23,42,.95);border:1px solid rgba(148,163,184,.3);border-radius:12px;padding:12px;backdrop-filter:blur(6px)}</style>
    <div class="dlg-wrap">
      <div class="dlg-bg">
        <div class="dlg-bg__layer" data-bg="a"></div>
        <div class="dlg-bg__layer" data-bg="b"></div>
      </div>
      <div class="dlg-hud" id="hud">
        <div class="dlg-header">
          <div class="dlg-stars" id="header-stars"></div>
          <div class="dlg-skip" id="header-skip"></div>
        </div>
      </div>
      <div class="dlg-scene" id="scene">
        <div class="dlg-char" id="char-left">
          <div class="dlg-portrait" aria-hidden="true"></div>
          <div class="dlg-name" id="name-left"></div>
        </div>
        <div class="dlg-char" id="char-right">
          <div class="dlg-portrait" aria-hidden="true"></div>
          <div class="dlg-name" id="name-right"></div>
        </div>
        <div class="dlg-bubble-row">
          <div class="dlg-bubble left" id="bubble-left">
            <div class="dlg-speaker" id="speaker-left"></div>
            <div class="dlg-text" id="text-left"></div>
          </div>
          <div class="dlg-bubble right" id="bubble-right">
            <div class="dlg-speaker" id="speaker-right"></div>
            <div class="dlg-text" id="text-right"></div>
          </div>
        </div>
      </div>
      <div class="rails" id="rails"></div>
      <div id="choiceWrap" class="choice-wrap" style="display:none">
        <div class="choice-card">
          <div id="choiceTitle" class="choice-title"></div>
          <div id="choiceList" class="choice-list"></div>
        </div>
      </div>

      <div id="tap" class="tap" aria-label="Advance"></div>
    </div>
  `;

  const sceneEl = el.querySelector('#scene') as HTMLElement;
  const bubbleLeft = el.querySelector('#bubble-left') as HTMLElement;
  const bubbleRight = el.querySelector('#bubble-right') as HTMLElement;
  const speakerLeft = el.querySelector('#speaker-left') as HTMLElement;
  const speakerRight = el.querySelector('#speaker-right') as HTMLElement;
  const textLeft = el.querySelector('#text-left') as HTMLElement;
  const textRight = el.querySelector('#text-right') as HTMLElement;
  const nameLeft = el.querySelector('#name-left') as HTMLElement;
  const nameRight = el.querySelector('#name-right') as HTMLElement;
  const portraitLeft = el.querySelector('#char-left .dlg-portrait') as HTMLElement;
  const portraitRight = el.querySelector('#char-right .dlg-portrait') as HTMLElement;
  const railsEl = el.querySelector('#rails') as HTMLElement;
  const choiceWrap = el.querySelector('#choiceWrap') as HTMLElement;
  const choiceTitle = el.querySelector('#choiceTitle') as HTMLElement;
  const choiceList = el.querySelector('#choiceList') as HTMLElement;
  const headerStars = el.querySelector('#header-stars') as HTMLElement;
  const headerSkip = el.querySelector('#header-skip') as HTMLElement;
  const tapEl = el.querySelector('#tap') as HTMLElement;
  const hudEl = el.querySelector('#hud') as HTMLElement;
  const wrapEl = el.querySelector('.dlg-wrap') as HTMLElement;
  
  // Background fader utilities
  function preloadImage(url: string): Promise<void> {
    return new Promise((resolve) => {
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
    const a = scope.querySelector('.dlg-bg [data-bg="a"]') as HTMLElement | null;
    const b = scope.querySelector('.dlg-bg [data-bg="b"]') as HTMLElement | null;
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
  const bgFader = makeBackgroundFader(el);
  let bgInitialized = false;

  function setSceneBackground(scene?: string) {
    try {
      const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
      const key = scene ? normalize(scene) : '';
      const url = key ? SCENE_BG_URLS[key] : undefined;
      if (url) {
        if (!bgInitialized) { bgFader.setInitial(url); bgInitialized = true; }
        else { bgFader.setBackground(url); }
      }
    } catch {}
  }

  function setSceneBackgroundFallback(...keys: (string | undefined)[]) {
    for (const k of keys) {
      if (!k) continue;
      try {
        const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
        const url = SCENE_BG_URLS[normalize(k)];
        if (url) {
          if (!bgInitialized) { bgFader.setInitial(url); bgInitialized = true; }
          else { bgFader.setBackground(url); }
          return;
        }
      } catch {}
    }
  }

  function handleBattleNow() {
    // Add a brief narrator line before completing
    const s = getState();
    const currentScene = s.script[0]?.scene || 'default';
    
    // Get character name from the dialogue state
    const characterName = s.leftName || 'The hero';
    
    // Create character-specific messages that explain the handicap
    const handicapMessages = {
      'Nova': 'Nova rushes into battle without preparation...',
      'Ember': 'Ember is caught by surprise, forced to fight...',
      'Shade': 'Shade stumbles into combat unprepared...',
      'Volt': 'Volt charges forward without strategy...',
      'default': 'The hero rushes into battle unprepared...'
    };
    
    // Select the appropriate message based on character
    const message = handicapMessages[characterName as keyof typeof handicapMessages] || handicapMessages.default;
    
    // Create a special handicap message with a flag to prevent auto-advance
    const handicapLine = {
      scene: currentScene,
      speaker: 'Narrator',
      side: 'center' as const,
      text: message,
      isHandicapMessage: true // Custom flag to identify this message
    };
    
    // Replace the entire script with just this message to prevent auto-advance
    setState({ script: [handicapLine], index: 0 });
    renderLine();
    
    // Don't auto-advance - let the user read and tap to continue
    // The normal dialogue advancement will handle moving to battle
  }

  function renderHud() {
    const s = getState();
    const stars = Math.max(0, Math.min(3, s.stars || 0));
    const filled = '★'.repeat(stars);
    const empty = '☆'.repeat(3 - stars);
    headerStars.textContent = `${filled}${empty}`;
    
    // Show "Battle Now" button throughout the entire mission dialogue
    if (!headerSkip.querySelector('#battleNowBtn')) {
      headerSkip.innerHTML = '<button id="battleNowBtn" class="btn btn--secondary">Battle Now</button>';
      const battleNowBtn = headerSkip.querySelector('#battleNowBtn') as HTMLButtonElement;
      if (battleNowBtn) {
        battleNowBtn.addEventListener('click', handleBattleNow, { passive: true });
      }
    }
  }

  function renderLine() {
    renderHud();
    const s = getState();
    const line = s.script[s.index];
    

    
    // Ensure a mission-level default background is applied at start if present
    if (s.index === 0 && (s as any).defaultSceneBg) {
      setSceneBackground((s as any).defaultSceneBg);
    }
    if (!line) { onComplete({ stars: s.stars || 0, route: 'party' }); return; }
    
    // Helper function to strip leading speaker names from dialogue text
    const stripLeadingSpeaker = (label: string | undefined, text: string | undefined) => {
      if (!text) return '';
      const lbl = (label || '').trim();
      if (!lbl) return text;
      const normalize = (s: string) => s.replace(/[^a-z0-9]/gi, '').toLowerCase();
      const normLbl = normalize(lbl);
      const m = text.match(/^([^:]{1,60}):\s*(.*)$/);
      if (m) {
        const lead = m[1];
        if (normalize(lead) === normLbl) {
          return m[2];
        }
      }
      return text;
    };

    // Helper function to determine if a speaker is an enemy faction character
    const isEnemyFaction = (speaker: string | undefined) => {
      if (!speaker) return false;
      const lowerSpeaker = speaker.toLowerCase();
      // Check for enemy faction indicators in speaker names
      return lowerSpeaker.includes('syndicate') || 
             lowerSpeaker.includes('accord') || 
             lowerSpeaker.includes('voidborn') ||
             lowerSpeaker.includes('outlaw') ||
             lowerSpeaker.includes('enemy faction') ||
             lowerSpeaker.includes('captured');
    };

    // Helper function to get faction title for enemy characters
    const getFactionTitle = (speaker: string | undefined) => {
      if (!speaker) return '';
      if (speaker.includes('Syndicate')) return 'Syndicate';
      if (speaker.includes('Accord')) return 'Accord';
      if (speaker.includes('Voidborn')) return 'Voidborn';
      if (speaker.includes('Outlaw')) return 'Outlaws';
      if (speaker.includes('Enemy Faction')) return 'Enemy';
      return '';
    };
    
    nameLeft.textContent = s.leftName || 'Left';
    nameRight.textContent = s.rightName || 'Right';
    // Apply portraits if provided
    try {
      if (portraitLeft) portraitLeft.setAttribute('style', `${portraitLeft.getAttribute('style') || ''};background-image:${s.leftImgUrl ? `url('${s.leftImgUrl}')` : 'none'}`);
      if (portraitRight) portraitRight.setAttribute('style', `${portraitRight.getAttribute('style') || ''};background-image:${s.rightImgUrl ? `url('${s.rightImgUrl}')` : 'none'}`);
    } catch {}
    // Clear footer rails each line
    if (railsEl) railsEl.innerHTML = '';
    if ((line as any).type === 'choice') {
      const node = line as Extract<typeof line, { type: 'choice' }>;
      choiceWrap.style.display = '';
      try { (tapEl.style as any).pointerEvents = 'none'; } catch {}
      try { (choiceWrap.style as any).pointerEvents = 'auto'; (choiceWrap.style as any).zIndex = '5'; } catch {}
      choiceTitle.textContent = node.title;
      // Hide title block when empty
      (choiceTitle.style as any).display = node.title ? '' : 'none';
      choiceList.innerHTML = '';
      node.options.forEach((opt) => {
        const btn = document.createElement('button');
        btn.className = 'btn btn--primary';
        btn.textContent = opt.followup?.text || opt.label;
        btn.onclick = () => applyChoice(opt);
        choiceList.appendChild(btn);
      });
      // Hide dialogue bubbles during a choice to reduce eye travel and avoid overlap
      speakerLeft.textContent = '';
      textLeft.textContent = '';
      speakerRight.textContent = '';
      textRight.textContent = '';
      bubbleLeft.style.visibility = 'hidden';
      bubbleRight.style.visibility = 'hidden';
      // Prefer explicit scene key over title/default to ensure mission-specific images show
      const bgKey = node.scene || (s as any).defaultSceneBg || node.title;
      if (bgKey) {
        sceneEl.setAttribute('data-scene', bgKey);
        setSceneBackgroundFallback(node.scene, (s as any).defaultSceneBg, node.title);
      }
    } else {
      choiceWrap.style.display = 'none';
      try { (choiceWrap.style as any).pointerEvents = 'none'; (choiceWrap.style as any).zIndex = ''; } catch {}
      try { (tapEl.style as any).pointerEvents = 'auto'; } catch {}
      const node = line as Extract<typeof line, { text: string }>;
      const bgKey = node.scene || (s as any).defaultSceneBg;
      if (bgKey) {
        sceneEl.setAttribute('data-scene', bgKey);
        setSceneBackgroundFallback(node.scene, (s as any).defaultSceneBg);
      }
      const side = (node as any).side as ('left'|'right'|'center'|undefined);
      const leftActive = side === 'left';
      const rightActive = side === 'right';
      const leftChar = el.querySelector('#char-left') as HTMLElement;
      const rightChar = el.querySelector('#char-right') as HTMLElement;
      leftChar.classList.toggle('active', !!leftActive);
      rightChar.classList.toggle('active', !!rightActive);
      
      // Handle Outlaw character greying in Shade mission
      if (rightChar && s.leftName === 'Shade') {
        if (rightActive) {
          // Outlaw character is speaking - make them active
          rightChar.classList.remove('greyed-out');
          rightChar.classList.add('active');
        } else {
          // Outlaw character is not speaking - grey them out
          rightChar.classList.add('greyed-out');
          rightChar.classList.remove('active');
        }
      }
      const mapSpeaker = (spk?: string) => {
        const lower = (spk || '').toLowerCase();
        if (lower === 'left') return s.leftName || 'Left';
        if (lower === 'right') return s.rightName || 'Right';
        return spk || '';
      };
      const isCenter = side === 'center';
      if (isCenter) {
        // Centered character: determine if it's narrator or enemy faction
        const isEnemy = isEnemyFaction(node.speaker);
        const row = el.querySelector('.dlg-bubble-row') as HTMLElement;
        row.classList.remove('left', 'right');
        row.classList.add('center');
        bubbleLeft.style.visibility = '';
        bubbleRight.style.visibility = 'hidden';
        
        if (isEnemy) {
          // Enemy faction character: show with faction title
          bubbleLeft.classList.remove('narrator');
          const factionTitle = getFactionTitle(node.speaker);
          speakerLeft.textContent = factionTitle || node.speaker || '';
          textLeft.textContent = node.text || '';
        } else {
          // Narrator: no title, narrator styling
          bubbleLeft.classList.add('narrator');
          speakerLeft.textContent = '';
          textLeft.textContent = node.text || '';
        }
        
        speakerRight.textContent = '';
        textRight.textContent = '';
      } else if (side === 'left') {
        // Left character speaking: position bubble near left character
        const row = el.querySelector('.dlg-bubble-row') as HTMLElement;
        row.classList.remove('center', 'right');
        row.classList.add('left');
        bubbleLeft.style.visibility = '';
        bubbleLeft.classList.remove('narrator');
        bubbleRight.style.visibility = 'hidden';
        const leftSpeaker = mapSpeaker(node.speaker);
        speakerLeft.textContent = leftSpeaker;
        speakerRight.textContent = '';
        const rawText = node.text || '';
        const cleanedForLeft = stripLeadingSpeaker(leftSpeaker, rawText);
        textLeft.textContent = cleanedForLeft;
        textRight.textContent = '';
      } else if (side === 'right') {
        // Right character speaking: position bubble near right character
        const row = el.querySelector('.dlg-bubble-row') as HTMLElement;
        row.classList.remove('center', 'left');
        row.classList.add('right');
        bubbleLeft.style.visibility = 'hidden';
        bubbleRight.style.visibility = '';
        speakerLeft.textContent = '';
        const rightSpeaker = mapSpeaker(node.speaker);
        speakerRight.textContent = rightSpeaker;
        const rawText = node.text || '';
        const cleanedForRight = stripLeadingSpeaker(rightSpeaker, rawText);
        textLeft.textContent = '';
        textRight.textContent = cleanedForRight;
        
        // Apply greying effect for Outlaw characters
        const rightChar = el.querySelector('#char-right') as HTMLElement;
        if (rightSpeaker.toLowerCase().includes('outlaw')) {
          // Outlaw characters are active when speaking
          rightChar.classList.remove('greyed-out');
          rightChar.classList.add('active');
        }
      } else if (side === 'left' || side === 'center') {
        // When left side or narrator is speaking, grey out Outlaw characters
        const rightChar = el.querySelector('#char-right') as HTMLElement;
        if (rightChar) {
          const rightSpeaker = el.querySelector('.dlg-speaker-right')?.textContent || '';
          if (rightSpeaker.toLowerCase().includes('outlaw')) {
            rightChar.classList.add('greyed-out');
            rightChar.classList.remove('active');
          }
        }
      } else {
        // Default case: no specific side, hide both bubbles
        const row = el.querySelector('.dlg-bubble-row') as HTMLElement;
        row.classList.remove('center', 'left', 'right');
        bubbleLeft.classList.remove('narrator');
        bubbleLeft.style.visibility = 'hidden';
        bubbleRight.style.visibility = 'hidden';
        speakerLeft.textContent = '';
        speakerRight.textContent = '';
        textLeft.textContent = '';
        textRight.textContent = '';
      }
      // If at the final line, check if it's a handicap message
      const atEnd = s.index >= s.script.length - 1;
      if (atEnd) {
        // Check if this is the handicap message - if so, don't auto-advance
        if (line && 'isHandicapMessage' in line && (line as any).isHandicapMessage) {
          // This is a handicap message, don't auto-advance - wait for user input
          try { (tapEl.style as any).pointerEvents = 'auto'; } catch {}
          return;
        }
        
        // Normal end-of-dialogue behavior - auto-continue to Party select
        try { (tapEl.style as any).pointerEvents = 'none'; } catch {}
        if (railsEl) railsEl.innerHTML = '';
        setTimeout(() => onComplete({ stars: s.stars || 0, route: 'party' }), 250);
      }
    }
  }

  function applyChoice(opt: ChoiceOption) {
    const s = getState();
    const nextStars = Math.min(3, (s.stars || 0) + (opt.star ? 1 : 0));
    let nextScript = s.script.slice();
    if (opt.followup) {
      // Preserve the scene context when adding followup text
      const currentScene = s.script[s.index]?.scene;
      const followupWithScene = { ...opt.followup, scene: currentScene };
      nextScript.splice(s.index + 1, 0, followupWithScene);
    }
    // Advance past the choice node; if no followup and this was the last node,
    // index will equal nextScript.length and renderLine will complete.
    setState({ stars: nextStars, script: nextScript, index: s.index + 1 });
    renderLine();
    
    // If there's a followup, automatically advance to show it
    if (opt.followup) {
      // Small delay to ensure the followup is rendered, then advance
      setTimeout(() => {
        const currentState = getState();
        // Only auto-advance if we're still on the followup line
        if (currentState.index === s.index + 1) {
          setState({ index: currentState.index + 1 });
          renderLine();
        }
      }, 100);
    }
  }

  function next() {
    const s = getState();
    const line = s.script[s.index];
    if ((line as any)?.type === 'choice') return;
    
    // Check if this is the handicap message (special case for Battle Now)
    if (line && 'isHandicapMessage' in line && (line as any).isHandicapMessage) {
      // This is the handicap message, complete the dialogue and go to party screen
      // This follows the normal mission flow: dialogue -> party selection -> battle
      onComplete({ stars: 0, route: 'party', skipDialogue: true });
      return;
    }
    
    // Check if we're at the end of the script
    if (s.index >= s.script.length - 1) { 
      // Don't auto-complete on the final line; wait for explicit button
      return; 
    }
    
    // Normal advancement to next line
    setState({ index: s.index + 1 });
    renderLine();
  }

  tapEl.addEventListener('click', next, { passive: true });
  

  
  const onKey = (e: KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') { e.preventDefault(); next(); }
  };
  document.addEventListener('keydown', onKey);

  // Set initial character states
  const leftChar = el.querySelector('#char-left') as HTMLElement;
  const rightChar = el.querySelector('#char-right') as HTMLElement;
  
  // Check if this is the Shade mission with Outlaw allies
  const dialogueState = getState();
  const isShadeMission = dialogueState.leftName === 'Shade';
  
  // Outlaw characters start greyed out in Shade mission
  if (rightChar && isShadeMission) {
    rightChar.classList.add('greyed-out');
    rightChar.classList.remove('active');
  }
  
  // Left character (player) is always active
  if (leftChar) {
    leftChar.classList.remove('greyed-out');
    leftChar.classList.add('active');
  }

  renderLine();
  return () => {
    document.removeEventListener('keydown', onKey);
    try { root.removeChild(el); } catch {}
  };
}


