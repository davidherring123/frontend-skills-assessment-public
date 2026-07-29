import { Statistic } from "antd"

import type { Transaction } from "../models/transaction"
import { computeTotal } from "../utils/format"

interface SummaryBarProps {
  transactions: Transaction[]
}

export const SummaryBar = ({ transactions }: SummaryBarProps) => {
  const total = computeTotal(transactions)

  return (
    <div className="summary-bar">
      <Statistic title="Transactions" value={transactions.length} />
      <Statistic title="Total processed" value={total} precision={2} prefix="$" />
    </div>
  )
}
