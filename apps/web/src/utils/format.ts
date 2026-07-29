import type { Transaction } from "../models/transaction"

export const formatCurrency = (value: number): string => {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" })
}

export const formatDate = (iso: string): string => {
  return new Date(iso).toLocaleDateString("en-US")
}

export const computeTotal = (transactions: Transaction[]): number => {
  let total = 0
  for (const t of transactions) {
    total += t.amount
  }
  return total
}
