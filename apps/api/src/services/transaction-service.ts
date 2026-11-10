import { TransactionStatus } from "../models/transaction.js"
import type { CardBrand, Transaction, TransactionListQuery, TransactionListResponse } from "../models/transaction.js"
import type { PaginatedResponse } from "../models/pagination.js"
import { loadTransactions } from "../data/transactions.js"

export interface TransactionSummary {
  count: number
  totalProcessed: number
  totalSurcharge: number
}

export interface NewTransactionInput {
  merchantName: string
  cardBrand: CardBrand
  amount: number
  surchargeRate: number
  status: TransactionStatus
}

export const MAX_SURCHARGE_RATE = 0.1
export const MAX_TRANSACTION_AMOUNT = 1000000
export const MAX_MERCHANT_NAME_LENGTH = 100

const compareNewestFirst = (a: Transaction, b: Transaction): number =>
  b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id)

const matchesSearch = (t: Transaction, term: string): boolean =>
  t.id.toLowerCase().includes(term) ||
  t.merchantName.toLowerCase().includes(term) ||
  t.cardBrand.toLowerCase().includes(term) ||
  t.status.toLowerCase().includes(term)

export const filterTransactions = (transactions: Transaction[], search?: string): Transaction[] => {
  const term = search?.trim().toLowerCase()
  return term ? transactions.filter((t) => matchesSearch(t, term)) : transactions
}

export const paginate = <T>(items: T[], page: number, pageSize: number): PaginatedResponse<T> => {
  const offset = (page - 1) * pageSize
  return {
    data: items.slice(offset, offset + pageSize),
    pagination: {
      page,
      pageSize,
      totalItems: items.length,
      totalPages: Math.ceil(items.length / pageSize),
    },
  }
}

export const toCents = (dollars: number): number => Math.round(dollars * 100)

export const sumMoney = <T>(items: T[], getAmount: (item: T) => number): number =>
  items.reduce((cents, item) => cents + toCents(getAmount(item)), 0) / 100

export const calculateCharges = (amount: number, surchargeRate: number): { surcharge: number; total: number } => {
  const amountCents = toCents(amount)
  const surchargeCents = Math.round(amountCents * surchargeRate)
  return { surcharge: surchargeCents / 100, total: (amountCents + surchargeCents) / 100 }
}

// Only approved transactions moved money. DECLINED never charged, REFUNDED was
// returned, PENDING hasn't settled, and VOIDED was cancelled.
export const PROCESSED_STATUSES: ReadonlySet<TransactionStatus> = new Set([TransactionStatus.APPROVED])

export const isProcessed = (t: Transaction): boolean => PROCESSED_STATUSES.has(t.status)

// "Processed" means what was charged to the card, so it uses `total` (amount + surcharge).
export const chargedAmount = (t: Transaction): number => t.total

export const summarizeTransactions = (transactions: Transaction[]): TransactionSummary => {
  const processed = transactions.filter(isProcessed)
  return {
    count: transactions.length,
    totalProcessed: sumMoney(processed, chargedAmount),
    totalSurcharge: sumMoney(processed, (t) => t.surcharge),
  }
}

export const createTransactionService = () => {
  const transactions = loadTransactions().sort(compareNewestFirst)

  const getAll = (): Transaction[] => transactions

  const list = ({ page, pageSize, search }: TransactionListQuery): TransactionListResponse =>
    paginate(filterTransactions(transactions, search), page, pageSize)

  const getById = (id: string): Transaction | undefined => transactions.find((t) => t.id === id)

  const getSummary = (search?: string): TransactionSummary =>
    summarizeTransactions(filterTransactions(transactions, search))

  const create = (input: NewTransactionInput): Transaction => {
    const transaction: Transaction = {
      id: `txn_${String(transactions.length + 1).padStart(6, "0")}`,
      merchantName: input.merchantName,
      cardBrand: input.cardBrand,
      amount: input.amount,
      surchargeRate: input.surchargeRate,
      ...calculateCharges(input.amount, input.surchargeRate),
      status: input.status,
      createdAt: new Date().toISOString(),
    }
    transactions.unshift(transaction)
    return transaction
  }

  return { getAll, list, getById, getSummary, create }
}

export type TransactionService = ReturnType<typeof createTransactionService>
