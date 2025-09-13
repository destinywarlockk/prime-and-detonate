import type { EnemyInstance } from './enemyFactory';

const enemyByActorId = new Map<string, EnemyInstance>();
const keyByActorId = new Map<string, string>();

export function registerEnemyActor(actorId: string, instance: EnemyInstance) {
  enemyByActorId.set(actorId, instance);
  keyByActorId.set(actorId, instance.key);
}

export function getEnemyInstance(actorId: string): EnemyInstance | undefined {
  return enemyByActorId.get(actorId);
}

export function getEnemyKey(actorId: string): string | undefined {
  return keyByActorId.get(actorId);
}

export function clearRegistry() {
  enemyByActorId.clear();
  keyByActorId.clear();
}


