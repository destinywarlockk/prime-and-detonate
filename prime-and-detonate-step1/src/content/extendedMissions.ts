import type { ExtendedMission } from '../game/types';

export const emberMasteringTheFlame: ExtendedMission = {
  "id": "ember_mastering_the_flame",
  "name": "Mastering the Flame",
  "character": "Ember",
  "factionMet": "Syndicate",
  "factionFought": "Accord",
  "lessonTitle": "Self-Control",
  "flavorText": "Control isn't weakness. It's precision — the art is in what you don't burn.",
  "scenes": [
    {
      "image": "ember_self_control_intro.png",
      "dialogue": [
        { "speaker": "Narrator", "position": "narrator", "text": "The depot is alive with tension. Massive cylindrical tanks sit in neat rows, each with hazard markings glowing under pulsing red warning lights. Cargo drones zip between the tanks like nervous insects." },
        { "speaker": "Syndicate Exec", "position": "right", "text": "Accord patrols have been sniffing around for three nights. They're building toward a move. I want them spooked before they try anything." },
        { "speaker": "Ember", "position": "left", "text": "Spooked without scratching the tanks? That's a tall order." },
        { "speaker": "Syndicate Exec", "position": "right", "text": "Control, Ember. Make them think they're in danger, but not from us. That's good business." },
        { "speaker": "Narrator", "position": "narrator", "text": "The Exec leads Ember through a narrow walkway between tanks. Steam hisses from a valve overhead, wrapping the catwalk in ghostly white vapor." },
        { "speaker": "Ember", "position": "left", "text": "Feels like this whole place is holding its breath." },
        { "speaker": "Syndicate Exec", "position": "right", "text": "It is. And you're the one walking around with matches." },
        { "speaker": "Narrator", "position": "narrator", "text": "Near the control shack, a Syndicate tech leans against a console, visor tilted back, smirk in place. His fingers drum against a thermal scanner." },
        { "speaker": "Syndicate Exec", "position": "right", "text": "This one's always got bright ideas." },
        { "speaker": "Syndicate Tech", "position": "right", "text": "I say light a flash demo. One second of ignition and their sensors go nuts. Accord pulls back, job done." },
        { "speaker": "Ember", "position": "left", "text": "Or we make the news for turning a depot into a crater." },
        { "speaker": "Syndicate Tech", "position": "right", "text": "Come on, Ember. Just a wink of flame—enough to make their hair stand on end." },
        { "speaker": "Ember", "position": "left", "text": "And if that wink turns into a wildfire?" },
        { "speaker": "Syndicate Tech", "position": "right", "text": "Then we know you've still got it." }
      ],
      "skillCheck": {
        "description": "Fire Safety",
        "choices": [
          { "label": "B", "text": "Negative. We fake readings, not flames.", "result": "pass" },
          { "label": "C", "text": "Just a tiny spark. No harm.", "result": "fail" },
          { "label": "A", "text": "Let's torch the whole yard.", "result": "fail" }
        ]
      }
    },
    {
      "image": "ember_self_control_conflict.png",
      "dialogue": [
        { "speaker": "Narrator", "position": "narrator", "text": "A deep, distant whump vibrates through the metal underfoot. The Exec's gaze snaps to the west perimeter." },
        { "speaker": "Syndicate Exec", "position": "right", "text": "Movement. They're early." },
        { "speaker": "Narrator", "position": "narrator", "text": "Sirens erupt. Accord mechs stride into view, alloy plating catching the depot's red glow." },
        { "speaker": "Accord Mech-Sergeant", "position": "narrator", "text": "Hands off the depot, Syndicate scum! Step away or be crushed." },
        { "speaker": "Ember", "position": "left", "text": "Bold entrance. Didn't expect the Accord to show up this far from home turf." },
        { "speaker": "Accord Mech-Sergeant", "position": "narrator", "text": "We go where the threat is. And right now, that's you." },
        { "speaker": "Narrator", "position": "narrator", "text": "A targeting reticle dances across Ember's chestplate. The ground hums under armored feet settling into firing stance." },
        { "speaker": "Syndicate Exec", "position": "right", "text": "They fire here, we all burn. Keep your head, Ember." },
        { "speaker": "Ember", "position": "left", "text": "You really want to test your armor against a depot full of fuel?" },
        { "speaker": "Accord Mech-Sergeant", "position": "narrator", "text": "We'll risk it if it stops you." },
        { "speaker": "Syndicate Exec", "position": "right", "text": "Then you're dumber than I thought." },
        { "speaker": "Accord Mech-Sergeant", "position": "narrator", "text": "Last chance. Step away from the tanks." }
      ],
      "skillCheck": {
        "description": "Conflict Resolution",
        "choices": [
          { "label": "C", "text": "You fire here, you vaporize your own district. Let's take this outside the city grid.", "result": "pass" },
          { "label": "A", "text": "Alright, alright, we're leaving.", "result": "fail" },
          { "label": "B", "text": "Make me.", "result": "fail" }
        ]
      }
    },
    {
      "image": "ember_self_control_battle.png",
      "dialogue": [
        { "speaker": "Narrator", "position": "narrator", "text": "Above, drones dart into formation. Shadows jitter across the depot. A loose panel clatters in the wind." },
        { "speaker": "Syndicate Exec", "position": "right", "text": "Tank field seven's behind you. One stray shot and we're scrap." },
        { "speaker": "Accord Trooper", "position": "narrator", "text": "Pyro fraud! All flash, no control. I've seen rookies with steadier hands." },
        { "speaker": "Ember", "position": "left", "text": "That's a brave insult from someone in my blast radius." },
        { "speaker": "Accord Trooper", "position": "narrator", "text": "Prove me wrong." },
        { "speaker": "Narrator", "position": "narrator", "text": "Ember's gloves hum with stored heat, the depot's red lights pulsing in time with her heartbeat." }
      ],
      "skillCheck": {
        "description": "Emotional Control",
        "choices": [
          { "label": "A", "text": "Whatever.", "result": "fail" },
          { "label": "B", "text": "Say that again.", "result": "fail" },
          { "label": "C", "text": "I'm here to stabilize, not light it up.", "result": "pass" }
        ]
      }
    }
  ],
  "postBattle": {
    "threePasses": "Accord command reopens a secure channel—respect replaces hostility. 'Next time, maybe we talk before we shoot.'",
    "oneOrTwoPasses": "Accord retreats but tags Ember as a 'volatile asset.'",
    "zeroPasses": "A scorched depot wall smolders; Accord doubles down—future diplomacy is strained."
  }
};

export const novaBoldnessUnderFire: ExtendedMission = {
  "id": "nova_boldness_under_fire",
  "name": "Boldness Under Fire",
  "character": "Nova",
  "factionMet": "Outlaws",
  "factionFought": "Syndicate",
  "lessonTitle": "Boldness",
  "flavorText": "Boldness isn't noise — it's choosing the shortest hard path and taking it first.",
  "scenes": [
    {
      "image": "nova_boldness_intro.png",
      "dialogue": [
        { "speaker": "Narrator", "position": "narrator", "text": "Dockside after midnight: cranes loom like skeletal giants, fog curling between shipping containers. Somewhere above, sodium lights sputter, threatening to die." },
        { "speaker": "Narrator", "position": "narrator", "text": "Outlaw spotters murmur into throat mics — Syndicate guards rotate off the cargo spine at exactly 00:02. One chance to strike." },
        { "speaker": "Outlaw Lead", "position": "right", "text": "We move fast or we don't move at all. Your call, Nova." },
        { "speaker": "Nova", "position": "left", "text": "One shot to hit the spine while they blink. Miss it, and we're tourists with problems." },
        { "speaker": "Outlaw Lead", "position": "right", "text": "Two routes. Spine corridor is short and straight — fastest to the prize, but their killzone. Roof cranes are slower, safer, but one slip on those cables and we're done." },
        { "speaker": "Nova", "position": "left", "text": "If we hesitate, they'll double the patrols. And if we wait for the next shift, the cargo will be halfway to Syndicate HQ." }
      ],
      "skillCheck": {
        "description": "Route Choice",
        "choices": [
          { "label": "A", "text": "Spine route", "result": "pass" },
          { "label": "B", "text": "Crane route", "result": "fail" },
          { "label": "C", "text": "Wait", "result": "fail" }
        ]
      }
    },
    {
      "image": "nova_boldness_intro.png",
      "dialogue": [
        { "speaker": "Narrator", "position": "narrator", "text": "The decision hangs in the air like the fog. Outlaw Lead nods once, sharp and final." },
        { "speaker": "Outlaw Lead", "position": "right", "text": "Alright then. Slicer, you're on point. Nova, you're our shield." },
        { "speaker": "Outlaw Slicer", "position": "right", "text": "I can crack their security in under two minutes. But I need a clear window." },
        { "speaker": "Nova", "position": "left", "text": "You'll get it. Lead, what's our fallback if this goes sideways?" },
        { "speaker": "Outlaw Lead", "position": "right", "text": "Fallback? We don't have one. That's why we're hitting hard." },
        { "speaker": "Narrator", "position": "narrator", "text": "Metal creaks overhead as a crane arm swings slowly through the mist. The docks hold their breath." }
      ],
      "skillCheck": {
        "description": "Commitment",
        "choices": [
          { "label": "A", "text": "Make it work", "result": "pass" },
          { "label": "B", "text": "Reconsider cranes", "result": "fail" },
          { "label": "C", "text": "Need time", "result": "fail" }
        ]
      }
    },
    {
      "image": "nova_boldness_conflict.png",
      "dialogue": [
        { "speaker": "Narrator", "position": "narrator", "text": "Halfway to the target, movement catches Nova's eye — blue visor lights cutting through the mist like slow-moving predators." },
        { "speaker": "Narrator", "position": "narrator", "text": "Metal boots hit the catwalk in sharp, steady beats. Syndicate patrol, early." },
        { "speaker": "Syndicate Captain", "position": "narrator", "text": "Drop weapons. Corporate property. On your knees, hands where I can see them." },
        { "speaker": "Nova", "position": "left", "text": "Corporate hospitality never changes — all orders, no appetizers." },
        { "speaker": "Outlaw Lead", "position": "right", "text": "They're sighting the slicer. She drops, the lock drops. You block, we live." },
        { "speaker": "Syndicate Captain", "position": "narrator", "text": "Kneel. Now. Noncompliance triggers lethal protocol." },
        { "speaker": "Nova", "position": "left", "text": "Funny how lethal protocols always start with aiming at the smallest target." }
      ],
      "skillCheck": {
        "description": "Protect Ally",
        "choices": [
          { "label": "B", "text": "Stand down", "result": "fail" },
          { "label": "A", "text": "Target me", "result": "pass" },
          { "label": "C", "text": "Run", "result": "fail" }
        ]
      }
    },
    {
      "image": "nova_boldness_conflict.png",
      "dialogue": [
        { "speaker": "Narrator", "position": "narrator", "text": "The Syndicate Captain's visor tilts slightly, processing Nova's defiance." },
        { "speaker": "Syndicate Captain", "position": "narrator", "text": "You're not the target. Step aside." },
        { "speaker": "Nova", "position": "left", "text": "I am now. You want the slicer, you go through me." },
        { "speaker": "Outlaw Slicer", "position": "right", "text": "Thirty seconds. I need thirty seconds." },
        { "speaker": "Syndicate Captain", "position": "narrator", "text": "Last warning. Corporate property is protected by any means necessary." },
        { "speaker": "Nova", "position": "left", "text": "Then let's see what your 'means' look like up close." }
      ],
      "skillCheck": {
        "description": "Hold Position",
        "choices": [
          { "label": "A", "text": "Hold ground", "result": "pass" },
          { "label": "B", "text": "Step back", "result": "fail" },
          { "label": "C", "text": "Charge forward", "result": "fail" }
        ]
      }
    },
    {
      "image": "nova_boldness_battle.png",
      "dialogue": [
        { "speaker": "Narrator", "position": "narrator", "text": "The slicer's voice crackles in comms: frantic, focused — digits racing, the door's security biting back." },
        { "speaker": "Outlaw Lead", "position": "right", "text": "Door's locked. Buy me ten seconds." },
        { "speaker": "Syndicate Trooper", "position": "narrator", "text": "One step and you're ash." },
        { "speaker": "Nova", "position": "left", "text": "You're guarding a dock in a storm, hoping lightning asks permission." },
        { "speaker": "Syndicate Trooper", "position": "narrator", "text": "Last warning." },
        { "speaker": "Nova", "position": "left", "text": "Then I'll make my first move the last one I need." }
      ],
      "skillCheck": {
        "description": "Confrontation",
        "choices": [
          { "label": "C", "text": "Insult", "result": "fail" },
          { "label": "A", "text": "Walk away", "result": "pass" },
          { "label": "B", "text": "Trade", "result": "fail" }
        ]
      }
    },
    {
      "image": "nova_boldness_battle.png",
      "dialogue": [
        { "speaker": "Narrator", "position": "narrator", "text": "Behind Nova, the slicer's fingers fly across the interface. Green lights flicker to life on the security panel." },
        { "speaker": "Outlaw Slicer", "position": "right", "text": "Got it! Door's opening!" },
        { "speaker": "Syndicate Captain", "position": "narrator", "text": "All units, breach in progress. Contain and eliminate." },
        { "speaker": "Nova", "position": "left", "text": "Too late. The prize is ours." },
        { "speaker": "Outlaw Lead", "position": "right", "text": "Nova, we're clear. Time to go!" },
        { "speaker": "Nova", "position": "left", "text": "Not yet. They need to understand who they're dealing with." }
      ],
      "skillCheck": {
        "description": "Exit Statement",
        "choices": [
          { "label": "A", "text": "Tell me who you are, and I'll remember you. Otherwise, you're just another corporate ghost.", "result": "pass" },
          { "label": "B", "text": "We'll be back. Count on it.", "result": "fail" },
          { "label": "C", "text": "Thanks for the hospitality.", "result": "fail" }
        ]
      }
    }
  ],
  "postBattle": {
    "threePasses": "The Captain clocks Nova's nerve. 'Next time, call a truce line.' A quiet data ping arrives later — a Syndicate routing hint.",
    "oneOrTwoPasses": "The patrol breaks; grudges smolder. Outlaws escape, but Syndicate flags Nova's signature.",
    "zeroPasses": "Victory rings hollow; Syndicate blacklists the dock and promises a heavier response."
  }
};

export const novaRunTowardTheFire: ExtendedMission = {
  "id": "nova_run_toward_the_fire",
  "name": "Run at Danger",
  "character": "Nova",
  "factionMet": "Accord",
  "factionFought": "Syndicate",
  "lessonTitle": "Altruism",
  "flavorText": "Altruism is choosing to take the risk so someone else doesn’t have to.",
  "scenes": [
    {
      "image": "nova_altruism_intro.png",
      "dialogue": [
        { "speaker": "Narrator", "position": "narrator", "text": "The tunnel smells of scorched wiring. Smoke curls through cracks in the ceiling, illuminated by stuttering emergency lights." },
        { "speaker": "Accord Rescuer", "position": "right", "text": "There’s a family trapped under the east platform. The Syndicate’s holding the main concourse as a shield." },
        { "speaker": "Nova", "position": "left", "text": "They’ll use civilians to slow you down. They always do." },
        { "speaker": "Accord Rescuer", "position": "right", "text": "We’ve got no safe path in — not without losing people." },
        { "speaker": "Nova", "position": "left", "text": "So we make one. And we take the hit so they don’t have to." }
      ]
    },
    {
      "image": "nova_altruism_intro.png",
      "dialogue": [
        { "speaker": "Accord Rescuer", "position": "right", "text": "The only clear shot is straight through their patrol sweep." }
      ],
      "skillCheck": {
        "description": "Volunteer for highest risk route",
        "choices": [
          { "label": "A", "text": "I’ll draw them. You get the civilians moving.", "result": "pass" },
          { "label": "B", "text": "We wait for reinforcements.", "result": "fail" },
          { "label": "C", "text": "We’ll find another way later.", "result": "fail" }
        ]
      }
    },
    {
      "image": "nova_altruism_conflict.png",
      "dialogue": [
        { "speaker": "Narrator", "position": "narrator", "text": "Shapes move in the haze — Syndicate enforcers with rifles up, stepping into overlapping arcs." },
        { "speaker": "Syndicate Lieutenant", "position": "narrator", "text": "You’re far from home, Nova. Leave the civilians — we just want you." },
        { "speaker": "Nova", "position": "left", "text": "That’s not how this ends." },
        { "speaker": "Accord Rescuer", "position": "right", "text": "They’ve cut the escape lane. We need another distraction." }
      ]
    },
    {
      "image": "nova_altruism_conflict.png",
      "dialogue": [
        { "speaker": "Accord Rescuer", "position": "right", "text": "They’ve got me lined up—" }
      ],
      "skillCheck": {
        "description": "Protect ally from sniper fire",
        "choices": [
          { "label": "B", "text": "Duck and pray.", "result": "fail" },
          { "label": "A", "text": "I’ll take the shot. Move now.", "result": "pass" },
          { "label": "C", "text": "We’re both stuck here until they miss.", "result": "fail" }
        ]
      }
    },
    {
      "image": "nova_altruism_conflict.png",
      "dialogue": [
        { "speaker": "Narrator", "position": "narrator", "text": "More Syndicate reinforcements pour from the concourse, herding civilians into tighter clusters as cover." },
        { "speaker": "Syndicate Lieutenant", "position": "narrator", "text": "Last warning. Leave them and walk away." },
        { "speaker": "Nova", "position": "left", "text": "I’d rather fall here than leave them with you." }
      ]
    },
    {
      "image": "nova_altruism_conflict.png",
      "dialogue": [
        { "speaker": "Syndicate Lieutenant", "position": "narrator", "text": "What are you worth to them, I wonder?" }
      ],
      "skillCheck": {
        "description": "Offer yourself as a bargaining chip",
        "choices": [
          { "label": "C", "text": "Enough to end you right now.", "result": "fail" },
          { "label": "B", "text": "You’ll find out the hard way.", "result": "fail" },
          { "label": "A", "text": "Take me, and you let them go — no harm.", "result": "pass" }
        ]
      }
    },
    {
      "image": "nova_altruism_battle.png",
      "dialogue": [
        { "speaker": "Narrator", "position": "narrator", "text": "The trade is a ruse — as Nova moves toward the Syndicate line, Accord rescuers sweep the civilians out. Then the fighting starts in earnest." }
      ]
    }
  ],
  "postBattle": {
    "threePasses": "Civilians freed, Accord honors Nova as a ‘shield in motion.’ Syndicate lieutenant files a personal vendetta.",
    "oneOrTwoPasses": "Some civilians saved, but losses weigh on Nova. Accord questions the risk, but respects the intent.",
    "zeroPasses": "The rescue fails; Syndicate secures prisoners. Accord pulls back with heavy casualties."
  }
};

export const voltAdaptingToChaos: ExtendedMission = {
  "id": "volt_adapting_to_chaos",
  "name": "Adapting to Chaos",
  "character": "Volt",
  "factionMet": "Accord",
  "factionFought": "Voidborn",
  "lessonTitle": "Adaptability",
  "flavorText": "Adaptability is disciplined improvisation — change the system, not just your mind.",
  "scenes": [
    {
      "image": "volt_adaptability_intro.png",
      "dialogue": [
        { "speaker": "Narrator", "position": "narrator", "text": "Accord hangar: the scent of ozone lingers in the rafters. Dismantled fighters sit in skeletal rows under scaffolds, while engineers shout clipped orders over the hiss of welding torches." },
        { "speaker": "Accord Engineer", "position": "right", "text": "Share specs, get access. No specs, no doors." },
        { "speaker": "Volt", "position": "left", "text": "I'm here for flow, not fences." },
        { "speaker": "Accord Engineer", "position": "right", "text": "Console's air-gapped. Protocol says no uplinks without clearance. Your badge won't bridge a vacuum." },
        { "speaker": "Volt", "position": "left", "text": "Then we make a bridge that isn't in the manual. Current always finds a path." },
        { "speaker": "Accord Engineer", "position": "right", "text": "If you fry my boards, you're paying in hull plating." }
      ],
      "skillCheck": {
        "description": "System Bypass",
        "choices": [
          { "label": "B", "text": "Wait for your tech.", "result": "fail" },
          { "label": "A", "text": "Volt rigs a coil and repurposes a drone battery to jump the service bus. 'Analog bridge, digital win.'", "result": "pass" },
          { "label": "C", "text": "Kick the panel. It'll open.", "result": "fail" }
        ]
      }
    },
    {
      "image": "volt_adaptability_intro.png",
      "dialogue": [
        { "speaker": "Narrator", "position": "narrator", "text": "The console hums to life, displays flickering through boot sequences. Volt's makeshift bridge pulses with borrowed energy." },
        { "speaker": "Accord Engineer", "position": "right", "text": "That shouldn't work. The isolation protocols are military-grade." },
        { "speaker": "Volt", "position": "left", "text": "Military-grade means someone designed it. Someone can redesign it." },
        { "speaker": "Accord Engineer", "position": "right", "text": "You're not just a tech, are you? You're a system bender." },
        { "speaker": "Volt", "position": "left", "text": "I adapt. Systems, plans, whatever the situation needs." },
        { "speaker": "Narrator", "position": "narrator", "text": "A warning light blinks on the console. Something's not right with the power grid." }
      ],
      "skillCheck": {
        "description": "System Analysis",
        "choices": [
          { "label": "A", "text": "Power fluctuation. Something's drawing too much current. Let me trace it.", "result": "pass" },
          { "label": "B", "text": "Probably just a glitch. Let's focus on the main objective.", "result": "fail" },
          { "label": "C", "text": "Not my problem. The console works.", "result": "fail" }
        ]
      }
    },
    {
      "image": "volt_adaptability_conflict.png",
      "dialogue": [
        { "speaker": "Narrator", "position": "narrator", "text": "The floor tingles underfoot. Blue lightning snakes along gantry rails as the air thins — tools and debris begin to drift in lazy arcs." },
        { "speaker": "Accord Officer", "position": "right", "text": "Voidborn signature — brace! Lock down the bays!" },
        { "speaker": "Volt", "position": "left", "text": "Your plan assumed normal physics. Update: physics just quit." },
        { "speaker": "Accord Officer", "position": "right", "text": "Stick to the plan!" },
        { "speaker": "Volt", "position": "left", "text": "The plan's already dead. New one: we make the room fight for us, not them." },
        { "speaker": "Accord Engineer", "position": "right", "text": "Tell me what to reroute and I'll try not to die doing it." }
      ],
      "skillCheck": {
        "description": "Tactical Adaptation",
        "choices": [
          { "label": "C", "text": "Charge the rift!", "result": "fail" },
          { "label": "A", "text": "New plan: ground the gantries, fight in choke points. (Volt flips power routing.)", "result": "pass" },
          { "label": "B", "text": "We hold position and hope.", "result": "fail" }
        ]
      }
    },
    {
      "image": "volt_adaptability_conflict.png",
      "dialogue": [
        { "speaker": "Narrator", "position": "narrator", "text": "Volt's fingers dance across the console, rerouting power through emergency circuits. The gantry lights flicker and stabilize." },
        { "speaker": "Accord Engineer", "position": "right", "text": "You're turning our own systems against them. That's... actually brilliant." },
        { "speaker": "Volt", "position": "left", "text": "When the rules change, you change the rules." },
        { "speaker": "Accord Officer", "position": "right", "text": "But what if they adapt to our adaptations?" },
        { "speaker": "Volt", "position": "left", "text": "Then we adapt faster. That's the game." },
        { "speaker": "Narrator", "position": "narrator", "text": "The air crackles with static as reality itself begins to tear." }
      ],
      "skillCheck": {
        "description": "Maintain Adaptability",
        "choices": [
          { "label": "A", "text": "They're learning our patterns. Time to randomize. (Volt scrambles the power grid.)", "result": "pass" },
          { "label": "B", "text": "Stick with what's working.", "result": "fail" },
          { "label": "C", "text": "We need to fall back and regroup.", "result": "fail" }
        ]
      }
    },
    {
      "image": "volt_adaptability_battle.png",
      "dialogue": [
        { "speaker": "Narrator", "position": "narrator", "text": "A tear opens in midair — a petaled wound in space, edges rimmed in pale fire. Voices ride the static, layered and out of sync." },
        { "speaker": "Voidborn Acolyte", "position": "narrator", "text": "Shed the husk. Join the tide." },
        { "speaker": "Accord Engineer", "position": "right", "text": "If they finish that ritual, the hangar's done. Buy us time to lock the clamps!" },
        { "speaker": "Volt", "position": "left", "text": "Adapter meets undertow. Let's see if you can dance." },
        { "speaker": "Voidborn Acolyte", "position": "narrator", "text": "Prove worth." },
        { "speaker": "Volt", "position": "left", "text": "Close the rift, or lose your harvest. Give me one minute — then you take your pickings." }
      ],
      "skillCheck": {
        "description": "Negotiation",
        "choices": [
          { "label": "A", "text": "Close the rift or lose your harvest. Give me one minute — then take your pickings.", "result": "pass" },
          { "label": "B", "text": "Stand down — we can study this.", "result": "fail" },
          { "label": "C", "text": "You're delusional.", "result": "fail" }
        ]
      }
    },
    {
      "image": "volt_adaptability_battle.png",
      "dialogue": [
        { "speaker": "Narrator", "position": "narrator", "text": "The Voidborn Acolyte's form shimmers, considering Volt's offer. Reality itself seems to hold its breath." },
        { "speaker": "Voidborn Acolyte", "position": "narrator", "text": "One minute. But know this: we remember those who bargain with the tide." },
        { "speaker": "Volt", "position": "left", "text": "And we remember those who keep their word. Engineer, now!" },
        { "speaker": "Accord Engineer", "position": "right", "text": "Clamps are locked! Power grid is stable!" },
        { "speaker": "Voidborn Acolyte", "position": "narrator", "text": "Time's up, adapter. What have you built?" },
        { "speaker": "Volt", "position": "left", "text": "A system that fights back. Welcome to the new rules." }
      ],
      "skillCheck": {
        "description": "Execute Plan",
        "choices": [
          { "label": "A", "text": "Activate the modified power grid, turning the hangar into a weapon.", "result": "pass" },
          { "label": "B", "text": "Try to negotiate for more time.", "result": "fail" },
          { "label": "C", "text": "Run for cover and hope for the best.", "result": "fail" }
        ]
      }
    }
  ],
  "postBattle": {
    "threePasses": "The rifts dim. The Acolyte inclines their head: 'Another cycle, adapter.' Accord grants Volt wider access.",
    "oneOrTwoPasses": "Hangar survives, but distrust lingers; Accord imposes oversight on Volt's methods.",
    "zeroPasses": "The breach collapses violently; Voidborn vow to mark Volt. Accord files a containment complaint."
  }
};

export const shadeShadowsOfEmpathy: ExtendedMission = {
  "id": "shade_shadows_of_empathy",
  "name": "Shadows of Empathy",
  "character": "Shade",
  "factionMet": "Outlaws",
  "factionFought": "Voidborn",
  "lessonTitle": "Empathy",
  "flavorText": "Empathy is precision listening — hearing the wound behind the words.",
  "scenes": [
    {
      "image": "shade_empathy_intro.png",
      "dialogue": [
        { "speaker": "Narrator", "position": "narrator", "text": "The shrine breathes like a living cave — bioluminescent threads pulsing faint light across stone ribs while a low tide of whispers rolls and fades." },
        { "speaker": "Voidborn Thrall", "position": "narrator", "text": "We give so the lost are seen." },
        { "speaker": "Shade", "position": "left", "text": "Seen and named, or just counted?" },
        { "speaker": "Voidborn Thrall", "position": "narrator", "text": "Named. Or they drift forever." },
        { "speaker": "Narrator", "position": "narrator", "text": "A bead chain clicks in the Thrall's hands, each tap a heartbeat trying not to break." },
        { "speaker": "Shade", "position": "left", "text": "What did the Void take from you?" },
        { "speaker": "Voidborn Thrall", "position": "narrator", "text": "A sister. Unmoored in a storm. One moment she laughed; the next, she was an echo." }
      ],
      "skillCheck": {
        "description": "Active Listening",
        "choices": [
          { "label": "B", "text": "Walk me through the moment she slipped… and what you wish you'd said.", "result": "pass" },
          { "label": "A", "text": "I'm sorry.", "result": "fail" },
          { "label": "C", "text": "Not my problem.", "result": "fail" }
        ]
      }
    },
    {
      "image": "shade_empathy_intro.png",
      "dialogue": [
        { "speaker": "Narrator", "position": "narrator", "text": "The Thrall's hands still, the beads silent for the first time. Their eyes meet Shade's, recognition dawning." },
        { "speaker": "Voidborn Thrall", "position": "narrator", "text": "You... you hear the echoes too, don't you?" },
        { "speaker": "Shade", "position": "left", "text": "I hear what others miss. It's why I'm here." },
        { "speaker": "Voidborn Thrall", "position": "narrator", "text": "Then you know why we keep the names. Why we light the candles." },
        { "speaker": "Shade", "position": "left", "text": "Because forgetting them is a second death." },
        { "speaker": "Narrator", "position": "narrator", "text": "The shrine's whispers seem to settle, as if acknowledging this moment of understanding." }
      ],
      "skillCheck": {
        "description": "Emotional Connection",
        "choices": [
          { "label": "A", "text": "Tell me her name. Let me remember her with you.", "result": "pass" },
          { "label": "B", "text": "We should focus on the mission.", "result": "fail" },
          { "label": "C", "text": "That's very touching, but we have work to do.", "result": "fail" }
        ]
      }
    },
    {
      "image": "shade_empathy_conflict.png",
      "dialogue": [
        { "speaker": "Narrator", "position": "narrator", "text": "A hidden cache yawns open; pages of ritual diagrams flutter in the draft. A rough bootprint smears ink across the floor." },
        { "speaker": "Narrator", "position": "narrator", "text": "Figures lurch from the shadows — Outlaws, grim and hungry, dragging a bound raider who shakes like a trapped wire." },
        { "speaker": "Outlaw (Captured)", "position": "right", "text": "Don't hand me over. I was just paid to lift pages, that's all." },
        { "speaker": "Shade", "position": "left", "text": "Pages become leverage. Leverage becomes blood." },
        { "speaker": "Voidborn Thrall", "position": "narrator", "text": "The rites are not trinkets. They are names, and names are lives." },
        { "speaker": "Shade", "position": "left", "text": "Then we decide whether this ends a cycle or starts one." }
      ],
      "skillCheck": {
        "description": "Show Mercy",
        "choices": [
          { "label": "A", "text": "You walk. Next time, walk wiser.", "result": "pass" },
          { "label": "B", "text": "You're lucky I'm not the one who caught you.", "result": "fail" },
          { "label": "C", "text": "You'll pay for what you've done.", "result": "fail" }
        ]
      }
    },
    {
      "image": "shade_empathy_conflict.png",
      "dialogue": [
        { "speaker": "Outlaw (Captured)", "position": "right", "text": "I'll tell you what I know about the Voidborn operation." },
        { "speaker": "Shade", "position": "left", "text": "Start talking." },
        { "speaker": "Outlaw (Captured)", "position": "right", "text": "They're using the shrine to channel something. Something that makes people forget who they are." },
        { "speaker": "Shade", "position": "left", "text": "And you helped them?" },
        { "speaker": "Outlaw (Captured)", "position": "right", "text": "I needed the credits. But I didn't know what they were really doing." }
      ],
      "skillCheck": {
        "description": "Information Extraction",
        "choices": [
          { "label": "A", "text": "Your ignorance doesn't absolve you.", "result": "fail" },
          { "label": "B", "text": "Help me stop them, and we'll call it even.", "result": "pass" },
          { "label": "C", "text": "You'll rot in a cell for this.", "result": "fail" }
        ]
      }
    },
    {
      "image": "shade_empathy_battle.png",
      "dialogue": [
        { "speaker": "Outlaw Lieutenant", "position": "right", "text": "Kneel, cloaker. Hand over the cache and the rat you freed." },
        { "speaker": "Shade", "position": "left", "text": "You've got mouths to feed. So do I. We end this clean." },
        { "speaker": "Voidborn Thrall", "position": "narrator", "text": "Spare the blood. The stone remembers what we do." },
        { "speaker": "Outlaw Lieutenant", "position": "right", "text": "Stones don't pay debts." },
        { "speaker": "Shade", "position": "left", "text": "People do. Let them leave with their names intact, and you keep yours." }
      ],
      "skillCheck": {
        "description": "Preserve Dignity",
        "choices": [
          { "label": "B", "text": "Let me pass.", "result": "fail" },
          { "label": "A", "text": "You've got mouths to feed. So do I. We end this clean.", "result": "fail" },
          { "label": "C", "text": "Stand your men down. The cache stays; civilians walk. You leave with your name — not a headline.", "result": "pass" }
        ]
      }
    },
    {
      "image": "shade_empathy_battle.png",
      "dialogue": [
        { "speaker": "Outlaw (Captured)", "position": "right", "text": "Lieutenant, this place... it's not what we thought. They're not hoarding wealth, they're preserving memories." },
        { "speaker": "Outlaw Lieutenant", "position": "right", "text": "Since when do you care about memories?" },
        { "speaker": "Outlaw (Captured)", "position": "right", "text": "Since someone showed me what it means to be remembered." },
        { "speaker": "Shade", "position": "left", "text": "Every name matters. Every story counts. Even yours." },
        { "speaker": "Narrator", "position": "narrator", "text": "The shrine's light seems to pulse in time with the collective heartbeat of those present." }
      ],
      "skillCheck": {
        "description": "De-escalation",
        "choices": [
          { "label": "A", "text": "What's your name, Lieutenant? Let me remember you as someone who chose peace.", "result": "pass" },
          { "label": "B", "text": "You're outnumbered. Surrender now.", "result": "fail" },
          { "label": "C", "text": "Time's up. Make your choice.", "result": "fail" }
        ]
      }
    }
  ],
  "postBattle": {
    "threePasses": "The lieutenant grunts respect. 'You fight fair, ghost.' A quiet truce corridor is hinted.",
    "oneOrTwoPasses": "Shade escapes with intel, but pride is bruised; the Outlaws spread wary rumors.",
    "zeroPasses": "The win curdles; Outlaw resentment spikes and bounties circulate."
  }
};

// Export all extended missions
export const extendedMissions: ExtendedMission[] = [
  emberMasteringTheFlame,
  novaBoldnessUnderFire,
  novaRunTowardTheFire,
  voltAdaptingToChaos,
  shadeShadowsOfEmpathy
];

export const justiceRunsCold: ExtendedMission = {
  "id": "justice_runs_cold",
  "name": "Justice Runs Cold",
  "character": "Shade",
  "factionMet": "Accord",
  "factionFought": "Syndicate",
  "lessonTitle": "Justice",
  "flavorText": "Justice doesn’t outsource to convenience — keep civilians safe, take the target clean.",
  "scenes": [
    {
      "image": "shade_empathy_intro.png",
      "dialogue": [
        { "speaker": "Narrator", "position": "narrator", "text": "Midnight over Ashenport’s rustbelt. Refineries huff steam; sodium lamps smear the rain into amber veins." },
        { "speaker": "Shade", "position": "left", "text": "Convoy in sight. Civilian buses… that’s not a screen, it’s bait." },
        { "speaker": "Accord Trooper", "position": "right", "text": "Brief said one Syndicate lieutenant, three gun trucks. Civilians weren’t part of the math." },
        { "speaker": "Shade", "position": "left", "text": "They are now. Justice doesn’t outsource to convenience." },
        { "speaker": "Accord Trooper", "position": "right", "text": "Then we do this your way—clean. Mark targets; I’ll stack shooters on your call." },
        { "speaker": "Narrator", "position": "narrator", "text": "Down the ridge, black-window buses tuck close to armored escorts, cables snaking from bomb vests to blinking nodes under seats." }
      ],
      "skillCheck": {
        "description": "Recon Under Pressure",
        "choices": [
          { "label": "A", "text": "Scouts spot you; forced withdrawal. Lose precise civilian positioning.", "result": "fail" },
          { "label": "B", "text": "Full layout tagged — detonators under bus floors, lieutenant in third vehicle.", "result": "pass" },
          { "label": "C", "text": "Convoy accelerates; explosive locations guessed later.", "result": "fail" }
        ]
      }
    },
    {
      "image": "shade_empathy_conflict.png",
      "dialogue": [
        { "speaker": "Narrator", "position": "narrator", "text": "A Syndicate open-channel crackles to life, voice filtered and smug." },
        { "speaker": "Syndicate Lieutenant", "position": "narrator", "text": "You play at justice, but all I see are cowards hiding behind bombs." },
        { "speaker": "Shade", "position": "left", "text": "Your games end here." },
        { "speaker": "Accord Trooper", "position": "right", "text": "Lieutenant’s vehicle peeling off left. Underpass guard rails reinforced—kill zone geometry." },
        { "speaker": "Narrator", "position": "narrator", "text": "Rain pushes sideways. The escort splits; buses crawl toward the tunnel, hazard lights pulsing like a slow heartbeat." }
      ],
      "skillCheck": {
        "description": "Civilians or Target?",
        "choices": [
          { "label": "A", "text": "Escort neutralized; civilians safe; both objectives possible.", "result": "pass" },
          { "label": "B", "text": "Buses reach kill zone; rescue harder.", "result": "fail" },
          { "label": "C", "text": "Lieutenant escapes; Syndicate intel lost.", "result": "fail" }
        ]
      }
    },
    {
      "image": "shade_empathy_conflict.png",
      "dialogue": [
        { "speaker": "Narrator", "position": "narrator", "text": "Sirens stutter awake; convoy bunches. Drone-jammers hum overhead." },
        { "speaker": "Accord Trooper", "position": "right", "text": "Guards wiring human shields to their own vests. Motion triggers; any panic is a spark." },
        { "speaker": "Shade", "position": "left", "text": "Then we become stillness. I’ll kill the signal; you sell the lie." },
        { "speaker": "Syndicate Lieutenant", "position": "narrator", "text": "Tick, tock. Justice is heavy — let us help you drop it." },
        { "speaker": "Accord Trooper", "position": "right", "text": "We can spoof a fuel fire east side, draw their eyes. On your count." }
      ]
    },
    {
      "image": "shade_empathy_battle.png",
      "dialogue": [
        { "speaker": "Narrator", "position": "narrator", "text": "Shade crouches under bus one; condensation drips onto the detonator housings. Guards scan, fingers tight on triggers." }
      ],
      "skillCheck": {
        "description": "Disarming the Trap",
        "choices": [
          { "label": "A", "text": "Gunfire erupts; guards fire on civilians.", "result": "fail" },
          { "label": "B", "text": "Timing slips; one detonator arms — panic spreads.", "result": "fail" },
          { "label": "C", "text": "Detonators disabled; guards retreat; civilians freed silently.", "result": "pass" }
        ]
      }
    },
    {
      "image": "shade_empathy_battle.png",
      "dialogue": [
        { "speaker": "Narrator", "position": "narrator", "text": "The tunnel blooms white as the fake fire crackles; Shade rises from undercarriage to muzzle flash." },
        { "speaker": "Shade", "position": "left", "text": "Stand down. Last warning." },
        { "speaker": "Syndicate Lieutenant", "position": "narrator", "text": "Your principles will be your hesitation… and your downfall." },
        { "speaker": "Accord Trooper", "position": "right", "text": "Who said she has to?" },
        { "speaker": "Narrator", "position": "narrator", "text": "Lieutenant bolts; a tire shreds; SUV fishtails into a barrier. Boots scramble, then stillness." }
      ]
    }
  ],
  "postBattle": {
    "threePasses": "The civilians shuffle into rescue vans under the flicker of emergency lights, their faces pale but alive. The lieutenant lies bound, and the intel is secured — a clean win that leaves the city breathing easier tonight.",
    "oneOrTwoPasses": "An explosion scars the tunnel wall, and the smell of smoke clings to the survivors as they are led to safety. The lieutenant is captured, and fragments of intel are recovered — enough to keep the city’s fragile peace from shattering.",
    "zeroPasses": "Smoke thickens in the underpass, mingling with the wail of sirens and the cold shuffle of survivors. The lieutenant has vanished into the night, and the Syndicate holds the story. The city mourns — but the hunt for justice has only begun."
  }
};

