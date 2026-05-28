/**
 * inventory-store.ts
 *
 * Zustand store for player inventory counts.
 * Kept in sync by useEraserCount (and future inventory hooks) via React Query.
 *
 * Why Zustand here?
 *   React Query hooks only work inside React components/hooks.
 *   The live-game socket layer and other non-component code need to read
 *   inventory counts (e.g. "can this player use an eraser right now?")
 *   without mounting a component. Reading from Zustand store state is safe
 *   anywhere: `useInventoryStore.getState().eraserCount`
 *
 * Usage (inside a component):
 *   const eraserCount = useInventoryStore((s) => s.eraserCount)
 *
 * Usage (outside React — e.g. socket handler):
 *   import { useInventoryStore } from '@/lib/inventory-store'
 *   const count = useInventoryStore.getState().eraserCount
 */

import { create } from "zustand";

interface InventoryStore {
  /** Total erasers the player currently owns. -1 = not yet loaded. */
  eraserCount: number;

  /** Whether the inventory has been fetched at least once. */
  inventoryLoaded: boolean;

  /** Actions */
  setEraserCount: (count: number) => void;
  decrementEraserCount: () => void; // optimistic use during a live game
  resetInventory: () => void;
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  eraserCount: -1,
  inventoryLoaded: false,

  setEraserCount: (count) =>
    set({ eraserCount: count, inventoryLoaded: true }),

  decrementEraserCount: () => {
    const current = get().eraserCount;
    if (current > 0) set({ eraserCount: current - 1 });
  },

  resetInventory: () =>
    set({ eraserCount: -1, inventoryLoaded: false }),
}));
