import { useCallback, useEffect, useRef, useState } from "react"

import { ApiError } from "../services/api-client"

interface QueryState<T> {
  key: string
  data?: T
  error?: string
  errorStatus?: number
}

export const useApiQuery = <T>(key: string, fetcher: (signal: AbortSignal) => Promise<T>) => {
  const [state, setState] = useState<QueryState<T> | null>(null)
  const [attempt, setAttempt] = useState(0)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  useEffect(() => {
    const controller = new AbortController()

    fetcherRef
      .current(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setState({ key, data })
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        const error = err instanceof Error ? err.message : "Something went wrong"
        const errorStatus = err instanceof ApiError ? err.status : undefined
        setState((prev) => ({ key, data: prev?.data, error, errorStatus }))
      })

    return () => controller.abort()
  }, [key, attempt])

  const retry = useCallback(() => {
    setState((prev) => (prev ? { ...prev, key: "" } : prev))
    setAttempt((n) => n + 1)
  }, [])

  const isCurrent = state?.key === key
  return {
    data: state?.data ?? null,
    error: isCurrent ? (state.error ?? null) : null,
    errorStatus: isCurrent ? state.errorStatus : undefined,
    loading: !isCurrent,
    retry,
  }
}
