import type {
  CardBrand,
  Transaction,
  TransactionListQuery,
  TransactionListResponse,
  TransactionStatus,
  TransactionSummary,
} from "../models/transaction"
import { apiClient } from "./api-client"

export interface NewTransactionInput {
  merchantName: string
  cardBrand: CardBrand
  amount: number
  surchargeRate: number
  status: TransactionStatus
}

export const fetchTransactions = (query: TransactionListQuery, signal?: AbortSignal) =>
  apiClient.get<TransactionListResponse>("/transactions", { query: { ...query }, signal })

export const fetchTransactionSummary = (search?: string, signal?: AbortSignal) =>
  apiClient.get<TransactionSummary>("/transactions/summary", { query: { search }, signal })

export const fetchTransaction = (id: string, signal?: AbortSignal) =>
  apiClient.get<Transaction>(`/transactions/${encodeURIComponent(id)}`, { signal })

export const createTransaction = (input: NewTransactionInput) => apiClient.post<Transaction>("/transactions", input)
