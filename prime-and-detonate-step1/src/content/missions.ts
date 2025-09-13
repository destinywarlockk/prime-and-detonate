import type { DialogueLine, Mission, ExtendedMission } from '../game/types';
import { novaBoldnessUnderFire, voltAdaptingToChaos, shadeShadowsOfEmpathy, novaRunTowardTheFire, justiceRunsCold } from './extendedMissions';

// Adapter: convert an ExtendedMission into the DialogueLine[] script used by the Dialogue UI
function convertExtendedToDialogue(m: ExtendedMission): DialogueLine[] {
  const script: DialogueLine[] = [];
  
  // Helper: determine if a speaker is an enemy faction character based on mission.factionFought
  const isEnemyFaction = (speaker: string, mission: ExtendedMission) => {
    const lowerSpeaker = speaker.toLowerCase();
    const fought = (mission.factionFought || '').toLowerCase();
    const aliases: Record<string, string[]> = {
      'syndicate': ['syndicate', 'syndicate lieutenant', 'syndicate trooper', 'syndicate captain'],
      'accord': ['accord', 'accord trooper', 'accord officer', 'mech-sergeant'],
      'voidborn': ['voidborn', 'voidborn acolyte', 'thrall'],
      'outlaws': ['outlaw', 'outlaws', 'outlaw lieutenant', 'outlaw lead', 'outlaw scrapper']
    };
    const fightTerms = aliases[fought] || [fought].filter(Boolean);
    const generic = ['enemy faction', 'captured'];
    return fightTerms.some(term => term && lowerSpeaker.includes(term)) || generic.some(term => lowerSpeaker.includes(term));
  };

  for (const scene of m.scenes) {
    const sceneKey = (scene.image || '').replace(/\.[^.]+$/, '');
    for (const line of scene.dialogue) {
      // Determine the correct side based on positioning rules
      let side: 'left' | 'right' | 'center';
      if (line.position === 'narrator') {
        side = 'center';
      } else if (line.position === 'left') {
        side = 'left';
      } else if (line.position === 'right') {
        // Check if this is an enemy faction character that should be center
        if (isEnemyFaction(line.speaker, m)) {
          side = 'center';
        } else {
          side = 'right';
        }
      } else {
        side = 'left'; // default to left
      }

      script.push({
        scene: sceneKey,
        speaker: line.speaker,
        side: side,
        text: line.text,
        ...(line.greyedOut ? { greyedOut: line.greyedOut } : {}),
      });
    }
    // Insert skill check as a choice node
    if (scene.skillCheck) {
      const hideSkillTitle = m.id === 'nova_run_toward_the_fire';
      script.push({
        type: 'choice',
        scene: sceneKey,
        title: hideSkillTitle ? '' : scene.skillCheck.description,
        options: scene.skillCheck.choices.map((c) => ({
          label: c.label,
          star: c.result === 'pass',
          followup: { text: c.text },
        }))
      } as any);
    }
  }
  return script;
}

// Scrap the Hesitation — adapted to engine DialogueLine schema
export const scrapHesitation: DialogueLine[] = [
  { scene: 'scrapyard', speaker: 'Narrator', side: 'center', text: 'The salvage yard reeks of ozone. Rival crews prowl between piles of broken ships.' },
  { scene: 'scrapyard', speaker: 'Right', side: 'right', text: 'Nova, you don\'t last long here by thinking it over. You see a score, you take it.' },
  { scene: 'scrapyard', speaker: 'Left', side: 'left', text: 'You mean rushing in blind?' },

  { type: 'choice', scene: 'scrapyard', title: 'Boldness', options: [
    { label: 'Take the shot', star: true },
    { label: 'Wait for sure', star: false },
    { label: 'Probe first', star: false }
  ]},

  { scene: 'scrapyard', speaker: 'Right', side: 'right', text: 'Perfect timing is a bedtime story. Hesitation gets you left with scraps.' },

  { type: 'choice', scene: 'scrapyard', title: 'Risk Assessment', options: [
    { label: 'Risk for winning', star: true },
    { label: 'Keep risks low', star: false },
    { label: 'Balance risk', star: false }
  ]},

  { scene: 'scrapyard', speaker: 'Right', side: 'right', text: 'Costs don\'t matter if you\'re the one holding the prize.' },

  { type: 'choice', scene: 'scrapyard', title: 'Action Choice', options: [
    { label: 'Strike first', star: true },
    { label: 'Plan first', star: false },
    { label: 'Set trap', star: false }
  ]},

  { scene: 'scrapyard', speaker: 'Right', side: 'right', text: 'Looks like you\'ve got some Scrapper spark after all.' },
  { scene: 'scrapyard', speaker: 'Narrator', side: 'center', text: 'With dust on her boots, Nova steps toward the fight, ready to hit hard and fast.' }
];

export const missionNeonMarket: Mission = {
  id: 'scrap-hesitation',
  name: 'Scrap the Hesitation',
  script: scrapHesitation,
  isBoss: false,
  victoryText: 'The rival crews scatter, leaving Nova with the choice salvage. Sometimes the best strategy is to act decisively rather than wait for perfect conditions.',
};


// Nova — Boldness Under Fire
export const novaBoldnessScript: DialogueLine[] = [
  { scene: 'nova_boldness_intro', speaker: 'Narrator', side: 'center', text: 'Dockside meeting with Outlaws, planning a daring ambush.' },
  { scene: 'nova_boldness_intro', speaker: 'Nova', side: 'left', text: 'We hit fast and clean. No second thoughts.' },
  { scene: 'nova_boldness_intro', speaker: 'Outlaw Lead', side: 'right', text: 'We\'ll draw the Syndicate eyes. You slip the net.' },
  { type: 'choice', scene: 'nova_boldness_intro', title: 'Boldness', options: [
    { label: 'Spine route', star: true },
    { label: 'Crane route', star: false },
    { label: 'Wait and follow', star: false }
  ]},
  { scene: 'nova_boldness_conflict', speaker: 'Narrator', side: 'center', text: 'Syndicate security arrives earlier than expected.' },
  { scene: 'nova_boldness_conflict', speaker: 'Narrator', side: 'center', text: 'Syndicate Captain: Perimeter sealed. Surrender your contraband.' },
  { type: 'choice', scene: 'nova_boldness_conflict', title: 'Protect Ally', options: [
    { label: 'Shield them', star: true },
    { label: 'Hold formation', star: false },
    { label: 'Create diversion', star: false }
  ]},
  { scene: 'nova_boldness_battle', speaker: 'Narrator', side: 'center', text: 'Syndicate drones and cyber-troopers flood the platform.' },
  { scene: 'nova_boldness_battle', speaker: 'Nova', side: 'left', text: 'I\'ll draw aggro. Keep them busy.' },
  { type: 'choice', scene: 'nova_boldness_battle', title: 'Confrontation', options: [
    { label: 'Direct approach', star: true },
    { label: 'Avoid contact', star: false },
    { label: 'Parley', star: false }
  ]},
  { scene: 'nova_boldness_battle', speaker: 'Narrator', side: 'center', text: 'Steel your nerves. Time to move.' },
];

export const missionNovaBoldness: Mission = {
  id: 'nova-boldness',
  name: 'Boldness Under Fire',
  script: novaBoldnessScript,
  isBoss: false,
  victoryText: 'The Syndicate forces retreat, their perimeter broken. Nova\'s bold approach proved that calculated risks can turn the tide of battle when hesitation would have meant certain capture.',
};

// Extended versions as selectable missions
export const missionNovaBoldnessExtended: Mission = {
  id: 'nova_boldness_under_fire',
  name: 'Boldness Under Fire (Extended)',
  script: convertExtendedToDialogue(novaBoldnessUnderFire),
  isBoss: false,
  victoryText: novaBoldnessUnderFire.postBattle.threePasses,
};

export const missionNovaAltruismExtended: Mission = {
  id: 'nova_run_toward_the_fire',
  name: 'Run at Danger (Extended)',
  script: convertExtendedToDialogue(novaRunTowardTheFire),
  isBoss: false,
  victoryText: novaRunTowardTheFire.postBattle.threePasses,
};

// Volt — Adapting to Chaos
export const voltAdaptabilityScript: DialogueLine[] = [
  { scene: 'volt_adaptability_intro', speaker: 'Narrator', side: 'center', text: 'Accord hangar, tense talks about tech sharing.' },
  { scene: 'volt_adaptability_intro', speaker: 'Accord Officer', side: 'right', text: 'You\'re late, Volt. Protocol matters.' },
  { type: 'choice', scene: 'volt_adaptability_intro', title: 'Improvisation', options: [
    { label: 'Bypass lock', star: true },
    { label: 'Wait for clearance', star: false },
    { label: 'Contact friend', star: false }
  ]},
  { scene: 'volt_adaptability_conflict', speaker: 'Narrator', side: 'center', text: 'Rift energy anomalies signal Voidborn arrival.' },
  { scene: 'volt_adaptability_conflict', speaker: 'Narrator', side: 'center', text: 'Voidborn Acolyte: The rift opens. Your rules end here.' },
  { type: 'choice', scene: 'volt_adaptability_conflict', title: 'Change Tactics', options: [
    { label: 'Change tactics', star: true },
    { label: 'Stick to plan', star: false },
    { label: 'Fall back', star: false }
  ]},
  { scene: 'volt_adaptability_battle', speaker: 'Narrator', side: 'center', text: 'Voidborn cult troops breach reality into the hangar.' },
  { scene: 'volt_adaptability_battle', speaker: 'Volt', side: 'left', text: 'New plan, new path. Move.' },
  { type: 'choice', scene: 'volt_adaptability_battle', title: 'Negotiation', options: [
    { label: 'Negotiate', star: true },
    { label: 'Refuse', star: false },
    { label: 'Offer trade', star: false }
  ]},
  { scene: 'volt_adaptability_battle', speaker: 'Narrator', side: 'center', text: 'Adjust on the fly. Execute the new plan.' },
];

export const missionVoltAdaptability: Mission = {
  id: 'volt-adaptability',
  name: 'Adapting to Chaos',
  script: voltAdaptabilityScript,
  isBoss: false,
  victoryText: 'The Voidborn rift closes as their forces are repelled. Volt\'s ability to adapt mid-mission and change tactics when the original plan failed proved crucial to securing the Accord hangar.',
};

export const missionVoltAdaptabilityExtended: Mission = {
  id: 'volt_adapting_to_chaos',
  name: 'Adapting to Chaos (Extended)',
  script: convertExtendedToDialogue(voltAdaptingToChaos),
  isBoss: false,
  victoryText: voltAdaptingToChaos.postBattle.threePasses,
};

// Ember — Mastering the Flame (Extended Version)
export const emberSelfControlScript: DialogueLine[] = [
  { scene: 'ember_self_control_intro', speaker: 'Narrator', side: 'center', text: 'The depot is alive with tension. Massive cylindrical tanks sit in neat rows, each with hazard markings glowing under pulsing red warning lights. Cargo drones zip between the tanks like nervous insects.' },
  { scene: 'ember_self_control_intro', speaker: 'Syndicate Exec', side: 'right', text: 'Accord patrols have been sniffing around for three nights. They\'re building toward a move. I want them spooked before they try anything.' },
  { scene: 'ember_self_control_intro', speaker: 'Ember', side: 'left', text: 'Spooked without scratching the tanks? That\'s a tall order.' },
  { scene: 'ember_self_control_intro', speaker: 'Syndicate Exec', side: 'right', text: 'Control, Ember. Make them think they\'re in danger, but not from us. That\'s good business.' },
  { scene: 'ember_self_control_intro', speaker: 'Narrator', side: 'center', text: 'The Exec leads Ember through a narrow walkway between tanks. Steam hisses from a valve overhead, wrapping the catwalk in ghostly white vapor.' },
  { scene: 'ember_self_control_intro', speaker: 'Ember', side: 'left', text: 'Feels like this whole place is holding its breath.' },
  { scene: 'ember_self_control_intro', speaker: 'Syndicate Exec', side: 'right', text: 'It is. And you\'re the one walking around with matches.' },
  { scene: 'ember_self_control_intro', speaker: 'Narrator', side: 'center', text: 'Near the control shack, a Syndicate tech leans against a console, visor tilted back, smirk in place. His fingers drum against a thermal scanner.' },
  { scene: 'ember_self_control_intro', speaker: 'Syndicate Exec', side: 'right', text: 'This one\'s always got bright ideas.' },
  { scene: 'ember_self_control_intro', speaker: 'Syndicate Tech', side: 'right', text: 'I say light a flash demo. One second of ignition and their sensors go nuts. Accord pulls back, job done.' },
  { scene: 'ember_self_control_intro', speaker: 'Ember', side: 'left', text: 'Or we make the news for turning a depot into a crater.' },
  { scene: 'ember_self_control_intro', speaker: 'Syndicate Tech', side: 'right', text: 'Come on, Ember. Just a wink of flame—enough to make their hair stand on end.' },
  { scene: 'ember_self_control_intro', speaker: 'Ember', side: 'left', text: 'And if that wink turns into a wildfire?' },
  { scene: 'ember_self_control_intro', speaker: 'Syndicate Tech', side: 'right', text: 'Then we know you\'ve still got it.' },
  { type: 'choice', scene: 'ember_self_control_intro', title: 'Fire Safety', options: [
    { label: 'Fake readings', star: true, followup: { speaker: 'Ember', side: 'left', text: 'Negative. We fake readings, not flames.' } },
    { label: 'Tiny spark', star: false, followup: { speaker: 'Ember', side: 'left', text: 'Just a tiny spark. No harm.' } },
    { label: 'Torch yard', star: false, followup: { speaker: 'Ember', side: 'left', text: 'Let\'s torch the whole yard.' } }
  ]},
  { scene: 'ember_self_control_conflict', speaker: 'Narrator', side: 'center', text: 'A deep, distant whump vibrates through the metal underfoot. The Exec\'s gaze snaps to the west perimeter.' },
  { scene: 'ember_self_control_conflict', speaker: 'Syndicate Exec', side: 'right', text: 'Movement. They\'re early.' },
  { scene: 'ember_self_control_conflict', speaker: 'Narrator', side: 'center', text: 'Sirens erupt. Accord mechs stride into view, alloy plating catching the depot\'s red glow.' },
  { scene: 'ember_self_control_conflict', speaker: 'Accord Mech-Sergeant', side: 'center', text: 'Hands off the depot, Syndicate scum! Step away or be crushed.' },
  { scene: 'ember_self_control_conflict', speaker: 'Ember', side: 'left', text: 'Bold entrance. Didn\'t expect the Accord to show up this far from home turf.' },
  { scene: 'ember_self_control_conflict', speaker: 'Accord Mech-Sergeant', side: 'center', text: 'We go where the threat is. And right now, that\'s you.' },
  { scene: 'ember_self_control_conflict', speaker: 'Narrator', side: 'center', text: 'A targeting reticle dances across Ember\'s chestplate. The ground hums under armored feet settling into firing stance.' },
  { scene: 'ember_self_control_conflict', speaker: 'Syndicate Exec', side: 'right', text: 'They fire here, we all burn. Keep your head, Ember.' },
  { scene: 'ember_self_control_conflict', speaker: 'Ember', side: 'left', text: 'You really want to test your armor against a depot full of fuel?' },
  { scene: 'ember_self_control_conflict', speaker: 'Accord Mech-Sergeant', side: 'center', text: 'We\'ll risk it if it stops you.' },
  { scene: 'ember_self_control_conflict', speaker: 'Syndicate Exec', side: 'right', text: 'Then you\'re dumber than I thought.' },
  { scene: 'ember_self_control_conflict', speaker: 'Accord Mech-Sergeant', side: 'center', text: 'Last chance. Step away from the tanks.' },
  { type: 'choice', scene: 'ember_self_control_conflict', title: 'Conflict Resolution', options: [
    { label: 'Take it outside', star: true, followup: { speaker: 'Ember', side: 'left', text: 'You fire here, you vaporize your own district. Let\'s take this outside the city grid.' } },
    { label: 'Leave', star: false, followup: { speaker: 'Ember', side: 'left', text: 'Alright, alright, we\'re leaving.' } },
    { label: 'Make me', star: false, followup: { speaker: 'Ember', side: 'left', text: 'Make me.' } }
  ]},
  { scene: 'ember_self_control_battle', speaker: 'Narrator', side: 'center', text: 'Above, drones dart into formation. Shadows jitter across the depot. A loose panel clatters in the wind.' },
  { scene: 'ember_self_control_battle', speaker: 'Syndicate Exec', side: 'right', text: 'Tank field seven\'s behind you. One stray shot and we\'re scrap.' },
  { scene: 'ember_self_control_battle', speaker: 'Accord Trooper', side: 'center', text: 'Pyro fraud! All flash, no control. I\'ve seen rookies with steadier hands.' },
  { scene: 'ember_self_control_battle', speaker: 'Ember', side: 'left', text: 'That\'s a brave insult from someone in my blast radius.' },
  { scene: 'ember_self_control_battle', speaker: 'Accord Trooper', side: 'center', text: 'Prove me wrong.' },
  { scene: 'ember_self_control_battle', speaker: 'Narrator', side: 'center', text: 'Ember\'s gloves hum with stored heat, the depot\'s red lights pulsing in time with her heartbeat.' },
  { type: 'choice', scene: 'ember_self_control_battle', title: 'Emotional Control', options: [
    { label: 'Whatever', star: false, followup: { speaker: 'Ember', side: 'left', text: 'Whatever.' } },
    { label: 'Say it again', star: false, followup: { speaker: 'Ember', side: 'left', text: 'Say that again.' } },
    { label: 'Stabilize', star: true, followup: { speaker: 'Ember', side: 'left', text: 'I\'m here to stabilize, not light it up.' } }
  ]},
];

export const missionEmberSelfControl: Mission = {
  id: 'ember-self_control',
  name: 'Mastering the Flame',
  script: emberSelfControlScript,
  isBoss: false,
  victoryText: 'Accord command reopens a secure channel—respect replaces hostility. \'Next time, maybe we talk before we shoot.\'',
};

// Shade — Shadows of Empathy
export const shadeEmpathyScript: DialogueLine[] = [
  { scene: 'shade_empathy_intro', speaker: 'Narrator', side: 'center', text: 'Shade moves through a Voidborn shrine, blending in with rituals.' },
  { scene: 'shade_empathy_intro', speaker: 'Narrator', side: 'center', text: 'Voidborn Acolyte: The veil thins. Who trespasses?' },
  { type: 'choice', scene: 'shade_empathy_intro', title: 'Listen', options: [
    { label: 'Listen to loss', star: true },
    { label: 'Ignore thrall', star: false },
    { label: 'Ask questions', star: false }
  ]},
  { scene: 'shade_empathy_conflict', speaker: 'Narrator', side: 'center', text: 'Intel theft is exposed, forcing an escape.' },
  { scene: 'shade_empathy_conflict', speaker: 'Outlaw Scout', side: 'center', text: 'You picked the wrong shrine to rob.' },
  { type: 'choice', scene: 'shade_empathy_conflict', title: 'Mercy', options: [
    { label: 'Offer mercy', star: true },
    { label: 'Interrogate harshly', star: false },
    { label: 'Release with warning', star: false }
  ]},
  { scene: 'shade_empathy_battle', speaker: 'Narrator', side: 'center', text: 'Outlaw mercenaries hired as Voidborn muscle block the exit.' },
  { scene: 'shade_empathy_battle', speaker: 'Left', side: 'left', text: 'Everyone has a story. We leave with ours intact.' },
  { type: 'choice', scene: 'shade_empathy_battle', title: 'Dignity', options: [
    { label: 'Preserve dignity', star: true },
    { label: 'Dismiss them', star: false },
    { label: 'Acknowledge status', star: false }
  ]},
  { scene: 'shade_empathy_battle', speaker: 'Narrator', side: 'center', text: 'Slip the net. Keep the peace where possible.' },
];

export const missionShadeEmpathy: Mission = {
  id: 'shade-empathy',
  name: 'Shadows of Empathy',
  script: shadeEmpathyScript,
  isBoss: false,
  victoryText: 'The outlaws stand down, recognizing Shade\'s respect for their dignity. Sometimes the greatest victory comes not from defeating enemies, but from finding common ground and preserving peace.',
};

export const missionShadeEmpathyExtended: Mission = {
  id: 'shade_shadows_of_empathy',
  name: 'Shadows of Empathy (Extended)',
  script: convertExtendedToDialogue(shadeShadowsOfEmpathy),
  isBoss: false,
  victoryText: shadeShadowsOfEmpathy.postBattle.threePasses,
};

// Shade — Justice Runs Cold (Extended)
export const missionJusticeRunsColdExtended: Mission = {
  id: 'justice_runs_cold',
  name: 'Justice Runs Cold (Extended)',
  script: convertExtendedToDialogue(justiceRunsCold),
  isBoss: false,
  victoryText: justiceRunsCold.postBattle.threePasses,
};


