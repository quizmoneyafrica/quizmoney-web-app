/**
 * KoboAmount.tsx
 *
 * Always use this component to display monetary amounts.
 * Never divide by 100 or format currency inline in JSX.
 *
 * Usage:
 *   <KoboAmount value={100000} />              → ₦1,000.00
 *   <KoboAmount value={100000} className="..." />
 *   <KoboAmount value={100000} showCurrency={false} />  → 1,000.00
 *   <KoboAmount value={null} />                → ₦0.00
 */

'use client'

import { formatNaira } from '@/lib/utils'

interface KoboAmountProps {
  /** Amount in kobo (integer). e.g. 100000 = ₦1,000.00 */
  value: number | null | undefined
  className?: string
  showCurrency?: boolean
}

export default function KoboAmount({
  value,
  className,
  showCurrency = true,
}: KoboAmountProps) {
  const amount = value ?? 0
  const formatted = showCurrency ? formatNaira(amount) : (amount / 100).toLocaleString('en-NG', { minimumFractionDigits: 2 })

  return <span className={className}>{formatted}</span>
}
