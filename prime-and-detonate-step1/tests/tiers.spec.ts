import { GENERATED_ENEMIES } from '../data/enemies.generated';
import { ALL_ARCHETYPES } from '../engine/combat/enemyFactory';
import { EnemyTier } from '../engine/combat/types';
import { chooseEnemyAction } from '../engine/combat/enemyAI';

function expect(cond: boolean, msg: string){ if(!cond) throw new Error(msg); }

(function testFourPerFaction(){
  const factions = ['Voidborn','Syndicate','Accord','Outlaws'] as const;
  for (const f of factions){
    const set = ALL_ARCHETYPES.filter(a=>a.faction===f);
    const tiers: EnemyTier[] = ['Grunt','Elite','Miniboss','Boss'];
    for (const t of tiers){
      expect(set.some(a => (a.tags||[]).includes(t)), `${f} missing ${t}`);
      expect(set.some(a => a.key === `${f.toLowerCase()}_${t.toLowerCase()}`), `Missing key ${f}_${t}`);
    }
  }
})();

(function testStatOrdering(){
  const factions = ['Voidborn','Syndicate','Accord','Outlaws'] as const;
  for (const f of factions){
    const set = ALL_ARCHETYPES.filter(a=>a.faction===f);
    const g = set.find(a=> (a.tags||[]).includes('Grunt'))!;
    const e = set.find(a=> (a.tags||[]).includes('Elite'))!;
    const m = set.find(a=> (a.tags||[]).includes('Miniboss'))!;
    const b = set.find(a=> (a.tags||[]).includes('Boss'))!;
    expect(b.baseStats.hp > m.baseStats.hp && m.baseStats.hp > e.baseStats.hp && e.baseStats.hp >= g.baseStats.hp, `${f} HP tier order`);
    expect(b.baseStats.damage > m.baseStats.damage && m.baseStats.damage >= e.baseStats.damage && e.baseStats.damage >= g.baseStats.damage, `${f} DMG tier order`);
  }
})();

(function testAIWeightBoosts(){
  const sample = ALL_ARCHETYPES.find(a => (a.tags||[]).includes('Boss'))!;
  const primer = { id: 'primer', display:'P', damageType:'Void', isPrimer:true, primeType:'Suppress', aiWeight:0.1 };
  const detonator = { id: 'det', display:'D', damageType:'Void', isDetonator:true, aiWeight:0.1 };
  const actor = { key: sample.key, name: sample.name, faction: sample.faction, stats: {hp:1,maxHp:1,shields:0,maxShields:0,speed:1,damage:1}, abilities: [primer, detonator], role: sample.role, tags: sample.tags };
  const action = chooseEnemyAction(actor as any, { enemies: [], players: [{id:'p', hp: 10, shields: 0}], turnIndex: 0 } as any);
  expect(!!action.ability, 'AI picked ability');
})();


