import { TransactionStatus } from "../models/transaction"

export const statusTagColor = (status: TransactionStatus): string => {
  switch (status) {
    case TransactionStatus.APPROVED:
      return "success"
    case TransactionStatus.DECLINED:
      return "error"
    case TransactionStatus.PENDING:
      return "warning"
    case TransactionStatus.REFUNDED:
      return "default"
  }
}
