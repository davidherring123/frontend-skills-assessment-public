import type { TransactionListQuery } from "../models/transaction"
import {
  createTransaction,
  fetchTransaction,
  fetchTransactionSummary,
  fetchTransactions,
} from "../services/transaction-service"
import { useApiMutation } from "./useApiMutation"
import { useApiQuery } from "./useApiQuery"

export const useTransactions = ({ page, pageSize, search }: TransactionListQuery) =>
  useApiQuery(JSON.stringify(["transactions", page, pageSize, search ?? ""]), (signal) =>
    fetchTransactions({ page, pageSize, search }, signal),
  )

export const useTransactionSummary = (search?: string) =>
  useApiQuery(JSON.stringify(["summary", search ?? ""]), (signal) => fetchTransactionSummary(search, signal))

export const useTransaction = (id: string) =>
  useApiQuery(JSON.stringify(["transaction", id]), (signal) => fetchTransaction(id, signal))

export const useCreateTransaction = () => useApiMutation(createTransaction)
