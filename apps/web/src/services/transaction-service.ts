import type { CardBrand, Transaction } from "../models/transaction"

const API_BASE = "/api"

export const fetchTransactions = async (): Promise<Transaction[]> => {
  const rsp = await fetch(`${API_BASE}/transactions`)
  const data = await rsp.json()
  return data.transactions
}

export interface NewTransactionInput {
  merchantName: string
  cardBrand: CardBrand
  amount: number
}

export const createTransaction = async (input: NewTransactionInput): Promise<Transaction> => {
  const rsp = await fetch(`${API_BASE}/transactions`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  })
  return rsp.json()
}
