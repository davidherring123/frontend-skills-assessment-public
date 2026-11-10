import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { Button, Descriptions, Result, Skeleton, Tag, Typography } from "antd"

import { BackToDashboardButton } from "../components/BackToDashboardButton"
import { useTransaction } from "../hooks/useTransactions"
import type { Transaction } from "../models/transaction"
import { formatCurrency, formatDateTime, formatPercent } from "../utils/format"
import { statusTagColor } from "../utils/status"

const TransactionDetails = ({ transaction }: { transaction: Transaction }) => (
  <>
    <div className="transaction-detail-header">
      <div>
        <Typography.Title level={3} className="mono" copyable={{ text: transaction.id }}>
          {transaction.id}
        </Typography.Title>
        <Typography.Text type="secondary">{transaction.merchantName}</Typography.Text>
      </div>
      <Tag color={statusTagColor(transaction.status)}>{transaction.status}</Tag>
    </div>

    <Descriptions
      column={1}
      bordered
      items={[
        { key: "merchant", label: "Merchant", children: transaction.merchantName },
        { key: "card", label: "Card brand", children: transaction.cardBrand },
        { key: "amount", label: "Amount", children: formatCurrency(transaction.amount) },
        {
          key: "surcharge",
          label: "Surcharge",
          children: `${formatCurrency(transaction.surcharge)} (${formatPercent(transaction.surchargeRate)})`,
        },
        { key: "total", label: "Total", children: <strong>{formatCurrency(transaction.total)}</strong> },
        {
          key: "status",
          label: "Status",
          children: <Tag color={statusTagColor(transaction.status)}>{transaction.status}</Tag>,
        },
        { key: "created", label: "Created", children: formatDateTime(transaction.createdAt) },
      ]}
    />
  </>
)

export const TransactionDetailPage = () => {
  const { id = "" } = useParams()
  const { data, loading, error, errorStatus, retry } = useTransaction(id)

  useEffect(() => {
    document.title = `${id} · Payment Portal`
    return () => {
      document.title = "Payment Portal"
    }
  }, [id])

  let content
  if (loading) {
    content = <Skeleton active title paragraph={{ rows: 7 }} />
  } else if (errorStatus === 404) {
    content = (
      <Result
        status="404"
        title="Transaction not found"
        subTitle={
          <>
            There's no transaction with ID <span className="mono">{id}</span>.
          </>
        }
      />
    )
  } else if (error || !data) {
    content = (
      <Result
        status="error"
        title="Couldn't load this transaction"
        subTitle={error ?? "Something went wrong"}
        extra={
          <Button type="primary" onClick={retry}>
            Try again
          </Button>
        }
      />
    )
  } else {
    content = <TransactionDetails transaction={data} />
  }

  return (
    <>
      <div className="page-toolbar">
        <BackToDashboardButton />
      </div>
      <div className="panel transaction-detail">{content}</div>
    </>
  )
}
