import { useCallback, useState } from 'react'

export function useCalculationResult<TInput, TResult>(
  calculate: (input: TInput) => TResult,
) {
  const [lastInput, setLastInput] = useState<TInput | null>(null)
  const [result, setResult] = useState<TResult | null>(null)

  const run = useCallback(
    (input: TInput) => {
      setLastInput(input)
      setResult(calculate(input))
    },
    [calculate],
  )

  return { lastInput, result, run }
}

