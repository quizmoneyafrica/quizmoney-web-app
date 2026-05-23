/**
 * utils.ts
 *
 * Shared utility functions used across the app.
 * Import from '@/lib/utils' — never define these inline in components.
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ─── Tailwind class merging ───────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Money formatting ─────────────────────────────────────────────────────────

/**
 * Format a kobo amount as Nigerian Naira.
 * @param kobo - Amount in kobo (integer). e.g. 100000 = ₦1,000.00
 */
export function formatNaira(kobo: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(kobo / 100)
}

/**
 * Convert naira input (from a form field) to kobo for API submission.
 * @param naira - Amount in naira (e.g. "1000" or 1000)
 */
export function nairaToKobo(naira: number | string): number {
  return Math.round(Number(naira) * 100)
}

/**
 * Convert kobo to naira for display in form fields.
 */
export function koboToNaira(kobo: number): number {
  return kobo / 100
}

// ─── Date formatting ──────────────────────────────────────────────────────────

/**
 * Format an ISO date string for display.
 * e.g. "2025-01-15T10:30:00.000Z" → "15 Jan 2025"
 */
export function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(isoString))
}

/**
 * Format an ISO date string with time.
 * e.g. "2025-01-15T10:30:00.000Z" → "15 Jan 2025, 11:30 AM"
 */
export function formatDateTime(isoString: string): string {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(isoString))
}

/**
 * Return a human-readable relative time string.
 * e.g. "2 hours ago", "just now"
 */
export function timeAgo(isoString: string): string {
  const seconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

// ─── String utilities ─────────────────────────────────────────────────────────

/**
 * Truncate a string and append ellipsis if it exceeds maxLength.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 3) + '...'
}

/**
 * Get initials from a username or name.
 * e.g. "tosin_dev" → "TO", "Tosin Adewole" → "TA"
 */
export function getInitials(name?: string | null): string {
  if (!name) return '?'
  const parts = name.split(/[\s_]/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

// ─── Rank formatting ──────────────────────────────────────────────────────────

/**
 * Format a rank number with ordinal suffix.
 * e.g. 1 → "1st", 2 → "2nd", 3 → "3rd", 11 → "11th"
 */
export function formatRank(rank: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = rank % 100
  return rank + (s[(v - 20) % 10] || s[v] || s[0])
}

// ─── Toast position (backward compat) ────────────────────────────────────────
// Keep this so existing components that import it don't break immediately
export const toastPosition = 'top-center' as const
