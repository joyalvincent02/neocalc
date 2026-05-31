import { useCallback, useState } from 'react'

export function useCalculationResult<TInput, TResult>(
  calculate: (input: TInput) => TResult,
) {
  const [lastInput, setLastInput] = useState<TInput | null>(null)
  const [result, setResult] = useState<TResult | null>(null)
  const [submissionCount, setSubmissionCount] = useState(0)

  const run = useCallback(
    (input: TInput) => {
      setLastInput(input)
      setResult(calculate(input))
      setSubmissionCount((c) => c + 1)
    },
    [calculate],
  )

  return { lastInput, result, run, submissionCount }
}

