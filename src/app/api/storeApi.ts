/**
 * storeApi.ts
 *
 * In-game store API calls (erasers, inventory, scratch cards).
 * All types match the actual backend response shapes from store.service.ts.
 *
 * New endpoints: /api/store/*
 */

import { apiClient } from '@/lib/api-client'

// ─── Types (match store.service.ts response shapes exactly) ──────────────────

export interface StoreItem {
  id: string
  name: string
  description: string | null
  price_kobo: number        // amount in kobo (100 kobo = ₦1)
  item_type: string         // "eraser" | "extra_life" | etc.
  price_formatted: string   // pre-formatted by backend, e.g. "₦500.00"
}

/** A single entry in the player's inventory. */
export interface InventoryEntry {
  inventory_id: string
  quantity: number
  updated_at: string
  item: StoreItem
}

/** Returned by POST /api/store/purchase */
export interface PurchaseResult {
  message: string
  item_name: string
  quantity_purchased: number
  total_cost: number            // in kobo
  total_cost_formatted: string  // e.g. "₦1,000.00"
  reference: string
}

/** Returned by POST /api/store/scratch-card/purchase */
export interface ScratchCardResult {
  message: string
  prize: {
    label: string
    type: 'ngn' | 'qmcoin' | 'item' | 'free_entry' | 'nothing'
    value: number   // in kobo for monetary prizes; 0 otherwise
  }
  cost_formatted: string  // what was deducted, e.g. "₦200.00"
}

// ─── Store API ────────────────────────────────────────────────────────────────

const StoreAPI = {
  /**
   * Get all active store items (erasers, etc.).
   * Ordered by price ascending.
   */
  getCatalogue(): Promise<{ success: boolean; data: StoreItem[] }> {
    return apiClient.get('/api/store/catalogue')
  },

  // Legacy alias
  getProducts(): Promise<{ success: boolean; data: StoreItem[] }> {
    return apiClient.get('/api/store/catalogue')
  },

  /**
   * Get the authenticated player's current inventory.
   * Only items with quantity > 0 are returned.
   */
  getInventory(): Promise<{ success: boolean; data: InventoryEntry[] }> {
    return apiClient.get('/api/store/inventory')
  },

  /**
   * Purchase one or more of an item.
   * @param item_id - UUID from catalogue
   * @param quantity - 1–10
   */
  purchaseItem(body: { item_id: string; quantity: number } | string): Promise<{ success: boolean; data: PurchaseResult }> {
    const payload = typeof body === 'string' ? { item_id: body, quantity: 1 } : body
    return apiClient.post('/api/store/purchase', payload)
  },

  /**
   * Buy a scratch card for a chance to win NGN, QMCoins, items, or a free entry.
   * Cost is deducted from wallet. Prize is credited immediately.
   */
  purchaseScratchCard(): Promise<{ success: boolean; data: ScratchCardResult }> {
    return apiClient.post('/api/store/scratch-card/purchase')
  },
}

export default StoreAPI
