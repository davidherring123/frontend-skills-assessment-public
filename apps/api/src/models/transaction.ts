import type { PaginatedResponse, PaginationQuery } from "./pagination.js"

export enum CardBrand {
  VISA = "VISA",
  MASTERCARD = "MASTERCARD",
  AMEX = "AMEX",
  DISCOVER = "DISCOVER",
}

export enum TransactionStatus {
  APPROVED = "APPROVED",
  DECLINED = "DECLINED",
  REFUNDED = "REFUNDED",
  PENDING = "PENDING",
  VOIDED = "VOIDED", // this was missing from the original List
}

export interface Transaction {
  id: string
  merchantName: string
  cardBrand: CardBrand
  amount: number
  surchargeRate: number
  surcharge: number
  total: number
  status: TransactionStatus
  createdAt: string
}

export interface TransactionListQuery extends PaginationQuery {
  search?: string
}

export type TransactionListResponse = PaginatedResponse<Transaction>
