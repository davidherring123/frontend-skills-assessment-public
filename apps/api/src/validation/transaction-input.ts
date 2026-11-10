import type { ApiErrorResponse } from "../models/error.js"
import { CardBrand, TransactionStatus } from "../models/transaction.js"
import { MAX_MERCHANT_NAME_LENGTH, MAX_SURCHARGE_RATE, MAX_TRANSACTION_AMOUNT } from "../services/transaction-service.js"
import type { NewTransactionInput } from "../services/transaction-service.js"
import type { ParseResult } from "./transaction-query.js"

type ErrorDetails = NonNullable<ApiErrorResponse["details"]>

const isOneOf = <T>(values: readonly T[], value: unknown): value is T => values.includes(value as T)

const hasAtMostDecimals = (value: number, places: number): boolean => {
  const scaled = value * 10 ** places
  return Math.abs(scaled - Math.round(scaled)) < 1e-6
}

const isFiniteNumber = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value)

export const parseNewTransactionInput = (body: unknown): ParseResult<NewTransactionInput> => {
  const details: ErrorDetails = []
  const input = (typeof body === "object" && body !== null ? body : {}) as Record<string, unknown>

  const merchantName = typeof input.merchantName === "string" ? input.merchantName.trim() : ""
  if (!merchantName) {
    details.push({ field: "merchantName", message: "is required" })
  } else if (merchantName.length > MAX_MERCHANT_NAME_LENGTH) {
    details.push({ field: "merchantName", message: `must be at most ${MAX_MERCHANT_NAME_LENGTH} characters` })
  }

  const cardBrands = Object.values(CardBrand)
  if (!isOneOf(cardBrands, input.cardBrand)) {
    details.push({ field: "cardBrand", message: `must be one of ${cardBrands.join(", ")}` })
  }

  const { amount } = input
  if (!isFiniteNumber(amount)) {
    details.push({ field: "amount", message: "must be a number" })
  } else if (amount <= 0 || amount > MAX_TRANSACTION_AMOUNT) {
    details.push({
      field: "amount",
      message: `must be greater than $0 and at most $${MAX_TRANSACTION_AMOUNT.toLocaleString("en-US")}`,
    })
  } else if (!hasAtMostDecimals(amount, 2)) {
    details.push({ field: "amount", message: "must have at most 2 decimal places" })
  }

  const { surchargeRate } = input
  if (!isFiniteNumber(surchargeRate)) {
    details.push({ field: "surchargeRate", message: "must be a number" })
  } else if (surchargeRate < 0 || surchargeRate > MAX_SURCHARGE_RATE) {
    details.push({ field: "surchargeRate", message: `must be between 0% and ${MAX_SURCHARGE_RATE * 100}%` })
  } else if (!hasAtMostDecimals(surchargeRate, 4)) {
    details.push({ field: "surchargeRate", message: "must have at most 2 decimal places as a percentage" })
  }

  const statuses = Object.values(TransactionStatus)
  if (!isOneOf(statuses, input.status)) {
    details.push({ field: "status", message: `must be one of ${statuses.join(", ")}` })
  }

  if (details.length) return { ok: false, details }

  return {
    ok: true,
    value: {
      merchantName,
      cardBrand: input.cardBrand as CardBrand,
      amount: amount as number,
      surchargeRate: surchargeRate as number,
      status: input.status as TransactionStatus,
    },
  }
}
