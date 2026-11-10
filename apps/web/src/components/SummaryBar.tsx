import { Statistic } from "antd"

import type { TransactionSummary } from "../models/transaction"

interface SummaryBarProps {
  summary: TransactionSummary | null
  loading: boolean
}

export const SummaryBar = ({ summary, loading }: SummaryBarProps) => {
  const showSkeleton = loading && !summary

  return (
    <div className="summary-bar">
      <Statistic title="Transactions" value={summary?.count ?? 0} loading={showSkeleton} />
      <Statistic
        title="Total processed"
        value={summary?.totalProcessed ?? 0}
        precision={2}
        prefix="$"
        loading={showSkeleton}
      />
      <Statistic
        title="Total surcharge"
        value={summary?.totalSurcharge ?? 0}
        precision={2}
        prefix="$"
        loading={showSkeleton}
      />
    </div>
  )
}
