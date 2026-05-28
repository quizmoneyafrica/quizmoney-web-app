/**
 * useEraserCount.ts
 *
 * Returns the number of erasers the logged-in player currently owns and
 * keeps the Zustand inventory-store in sync so the count is readable from
 * anywhere in the app (including non-component contexts like socket handlers).
 *
 * Usage:
 *   const { eraserCount, hasErasers, isLoading, refetch } = useEraserCount()
 *
 * Reading from outside React (e.g. game socket handler):
 *   import { useInventoryStore } from '@/lib/inventory-store'
 *   const count = useInventoryStore.getState().eraserCount  // -1 = not loaded yet
 */

import { useEffect } from "react";
import { useStoreInventory } from "@/lib/queries";
import { useInventoryStore } from "@/lib/inventory-store";
import type { InventoryEntry } from "@/app/api/storeApi";

const ERASER_ITEM_TYPE = "eraser";

export function useEraserCount() {
  const { data: inventory, isLoading, refetch } = useStoreInventory();
  const setEraserCount = useInventoryStore((s) => s.setEraserCount);

  // Derive eraser count from the full inventory response
  const eraserCount: number = (() => {
    if (!inventory) return -1;
    return (inventory as InventoryEntry[])
      .filter((entry) => entry.item.item_type === ERASER_ITEM_TYPE)
      .reduce((sum, entry) => sum + entry.quantity, 0);
  })();

  // Keep Zustand in sync whenever React Query resolves fresh data
  useEffect(() => {
    if (!isLoading && inventory) {
      setEraserCount(eraserCount < 0 ? 0 : eraserCount);
    }
  }, [eraserCount, isLoading, inventory, setEraserCount]);

  return {
    /** Number of erasers the player owns. -1 while the first fetch is in flight. */
    eraserCount: eraserCount < 0 ? 0 : eraserCount,
    /** True once the inventory has loaded and the player has at least 1 eraser. */
    hasErasers: eraserCount > 0,
    /** True on the initial load. Subsequent background refetches do not set this. */
    isLoading,
    /** Manually refetch the inventory (e.g. after purchasing or using an eraser). */
    refetch,
  };
}
