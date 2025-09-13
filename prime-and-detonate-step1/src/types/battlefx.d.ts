export type ElementType = 'Kinetic' | 'Arc' | 'Thermal' | 'Void';

declare global {
  interface Window {
    BattleFX: {
      hit: (intensity?: number) => void;
      prime: (type?: ElementType, intensity?: number) => void;
      detonate: (type?: ElementType, intensity?: number) => void;
      explosion: (type?: ElementType, intensity?: number) => void;
      bindCanvas: (canvasEl: HTMLCanvasElement) => void;
      floatDamage: (
        pos: { x: number; y: number },
        value: number,
        opts?: { type?: ElementType; crit?: boolean; heal?: boolean; shield?: boolean }
      ) => void;
    };
  }

  // Allow bare global usage: BattleFX.hit(...)
  const BattleFX: Window['BattleFX'];
}

export {};


