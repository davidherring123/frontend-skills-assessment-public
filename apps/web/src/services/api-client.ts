import type { ApiErrorResponse } from "../models/error"

const API_BASE = "/api"

type QueryValue = string | number | undefined

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  query?: Record<string, QueryValue>
  body?: unknown
  signal?: AbortSignal
}

export class ApiError extends Error {
  status: number
  details?: ApiErrorResponse["details"]

  constructor(message: string, status: number, details?: ApiErrorResponse["details"]) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.details = details
  }
}

const buildUrl = (path: string, query?: Record<string, QueryValue>): string => {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== "") params.set(key, String(value))
  }
  const queryString = params.toString()
  return `${API_BASE}${path}${queryString ? `?${queryString}` : ""}`
}

const request = async <T>(path: string, { method = "GET", query, body, signal }: RequestOptions = {}): Promise<T> => {
  const rsp = await fetch(buildUrl(path, query), {
    method,
    signal,
    headers: body === undefined ? undefined : { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  const data = await rsp.json().catch(() => null)
  if (!rsp.ok) {
    const error = data as ApiErrorResponse | null
    throw new ApiError(error?.error ?? `Request failed (${rsp.status})`, rsp.status, error?.details)
  }
  return data as T
}

export const apiClient = {
  get: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) => request<T>(path, options),
  post: <T>(path: string, body: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "POST", body }),
}
