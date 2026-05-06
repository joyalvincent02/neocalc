import { useEffect, useMemo, useState } from 'react'
import { DEFAULT_PROTOCOL } from '../config/defaultProtocol'
import { safeGetItem, safeSetItem } from '../lib/storage'

const KEY = 'neocalc.roundingDp'

export function useRoundingPrecision() {
  const [dp, setDp] = useState<number>(() => {
    const raw = safeGetItem(KEY)
    const parsed = raw ? Number(raw) : NaN
    return Number.isFinite(parsed) ? parsed : DEFAULT_PROTOCOL.roundingDp
  })

  useEffect(() => {
    safeSetItem(KEY, String(dp))
  }, [dp])

  const clamped = useMemo(() => {
    if (!Number.isFinite(dp)) return DEFAULT_PROTOCOL.roundingDp
    return Math.min(6, Math.max(0, Math.trunc(dp)))
  }, [dp])

  return { dp: clamped, setDp }
}

