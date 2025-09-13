// Minimal typings to allow use of import.meta.glob without pulling in full Vite types
interface ImportMeta {
  glob(
    pattern: string,
    options?: { eager?: boolean; import?: string }
  ): Record<string, any>;
}


