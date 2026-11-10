import { useCallback, useState } from "react"

export const useApiMutation = <TInput, TResult>(mutationFn: (input: TInput) => Promise<TResult>) => {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const mutateAsync = useCallback(
    async (input: TInput): Promise<TResult> => {
      setSubmitting(true)
      setError(null)
      try {
        return await mutationFn(input)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Something went wrong"))
        throw err
      } finally {
        setSubmitting(false)
      }
    },
    [mutationFn],
  )

  const reset = useCallback(() => setError(null), [])

  return { mutateAsync, submitting, error, reset }
}
