type Listener<T> = (s: T) => void;

export function createStore<T>(initial: T) {
  let state = initial;
  const listeners = new Set<Listener<T>>();
  return {
    getState: () => state,
    setState(updater: Partial<T> | ((s: T) => Partial<T>)) {
      const patch = typeof updater === 'function' ? updater(state) : updater;
      state = { ...state, ...patch };
      listeners.forEach((l) => l(state));
    },
    subscribe(l: Listener<T>) { listeners.add(l); return () => listeners.delete(l); }
  };
}
