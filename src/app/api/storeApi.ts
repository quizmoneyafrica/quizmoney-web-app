/**
 * storeApi.ts
 *
 * In-game store API calls (power-ups, items, scratch cards).
 * Replaces old storeApi.ts which called: products (GET), products/purchase.
 *
 * New endpoints: /api/store/*
 */

import { apiClient } from '@/lib/api-client'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StoreItem {
  id: string               // UUID
  name: string
  description: string | null
  price: number            // in kobo
  category: string         // e.g. "eraser", "extra_life", etc.
  is_available: boolean
}

export interface InventoryItem {
  id: string
  item_id: string
  item: StoreItem
  quantity: number
  acquired_at: string
}

export interface PurchaseResult {
  item: StoreItem
  quantity: number
  total_cost: number       // in kobo
  remaining_balance: number  // in kobo
}

export interface ScratchCardResult {
  won: boolean
  prize: number | null     // in kobo, null if no win
  message: string
}

// ─── Store API ────────────────────────────────────────────────────────────────

const StoreAPI = {
  /**
   * Get all available store items.
   * Replaces: getProducts() → products (GET)
   */
  getCatalogue(): Promise<{ success: boolean; data: StoreItem[] }> {
    return apiClient.get('/api/store/catalogue')
  },

  // Legacy alias — un-migrated screens call getProducts()
  getProducts(): Promise<{ success: boolean; data: StoreItem[] }> {
    return apiClient.get('/api/store/catalogue')
  },

  /**
   * Get the current player's inventory.
   */
  getInventory(): Promise<{ success: boolean; data: InventoryItem[] }> {
    return apiClient.get('/api/store/inventory')
  },

  /**
   * Purchase an item from the store.
   * Replaces: purchaseItem(productId) → products/purchase
   * @param item_id - UUID from catalogue
   * @param quantity - 1–10
   */
  purchaseItem(body: { item_id: string; quantity: number } | string): Promise<{ success: boolean; data: PurchaseResult }> {
    const payload = typeof body === 'string' ? { item_id: body, quantity: 1 } : body
    return apiClient.post('/api/store/purchase', payload)
  },

  /**
   * Purchase a scratch card for a chance to win a prize.
   */
  purchaseScratchCard(): Promise<{ success: boolean; data: ScratchCardResult }> {
    return apiClient.post('/api/store/scratch-card/purchase')
  },
}

export default StoreAPI
