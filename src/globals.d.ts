// src/globals.d.ts
export {};

declare global {
  interface Window {
    Tawk_API?: {
      onLoad?: () => void;
      addEvent?: (eventName: string) => void;
      setAttributes?: (
        attributes: Record<string, unknown>,
        callback?: (error: unknown) => void
      ) => void;
      [key: string]: unknown;
    };
  }
}
