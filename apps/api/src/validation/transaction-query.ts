import type { Request } from "express"

import { MAX_PAGE_SIZE } from "../config.js"
import type { ApiErrorResponse } from "../models/error.js"
import type { TransactionListQuery } from "../models/transaction.js"

type ErrorDetails = NonNullable<ApiErrorResponse["details"]>

export type ParseResult<T> = { ok: true; value: T } | { ok: false; details: ErrorDetails }

const parseIntParam = (
  raw: unknown,
  field: string,
  { min, max, fallback }: { min: number; max: number; fallback?: number },
  details: ErrorDetails,
): number => {
  if (raw === undefined && fallback !== undefined) return fallback

  const value = typeof raw === "string" && /^\d+$/.test(raw) ? Number(raw) : NaN
  if (!Number.isSafeInteger(value) || value < min || value > max) {
    const range = max === Number.MAX_SAFE_INTEGER ? `>= ${min}` : `between ${min} and ${max}`
    const prefix = raw === undefined ? "is required and " : ""
    details.push({ field, message: `${prefix}must be an integer ${range}` })
    return NaN
  }
  return value
}

const parseSearchParam = (raw: unknown, details: ErrorDetails): string | undefined => {
  if (raw === undefined) return undefined

  if (typeof raw !== "string") {
    details.push({ field: "search", message: "must be a single string" })
    return undefined
  }
  return raw.trim() || undefined
}

export const parseTransactionListQuery = (query: Request["query"]): ParseResult<TransactionListQuery> => {
  const details: ErrorDetails = []

  const value: TransactionListQuery = {
    page: parseIntParam(query.page, "page", { min: 1, max: Number.MAX_SAFE_INTEGER, fallback: 1 }, details),
    pageSize: parseIntParam(query.pageSize, "pageSize", { min: 1, max: MAX_PAGE_SIZE }, details),
    search: parseSearchParam(query.search, details),
  }

  return details.length ? { ok: false, details } : { ok: true, value }
}

export const parseSearchQuery = (query: Request["query"]): ParseResult<string | undefined> => {
  const details: ErrorDetails = []
  const value = parseSearchParam(query.search, details)
  return details.length ? { ok: false, details } : { ok: true, value }
}
