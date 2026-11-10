import { Button, Descriptions, Modal, Tag } from "antd"
import { useLocation, useNavigate } from "react-router-dom"

import type { DashboardLinkState } from "../hooks/useDashboardPath"
import type { Transaction } from "../models/transaction"
import { formatCurrency, formatDate, formatPercent } from "../utils/format"
import { statusTagColor } from "../utils/status"

interface TransactionModalProps {
  transaction: Transaction | null
  onClose: () => void
}

export const TransactionModal = ({ transaction, onClose }: TransactionModalProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  const openDetails = () => {
    if (!transaction) return
    const state: DashboardLinkState = { from: location.search }
    navigate(`/transactions/${encodeURIComponent(transaction.id)}`, { state })
  }

  return (
    <Modal
      open={transaction !== null}
      title={transaction?.id}
      onCancel={onClose}
      footer={[
        <Button key="details" onClick={openDetails}>
          View full details
        </Button>,
        <Button key="close" type="primary" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      {transaction && (
        <Descriptions
          column={1}
          size="small"
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
            { key: "total", label: "Total", children: formatCurrency(transaction.total) },
            {
              key: "status",
              label: "Status",
              children: <Tag color={statusTagColor(transaction.status)}>{transaction.status}</Tag>,
            },
            { key: "date", label: "Date", children: formatDate(transaction.createdAt) },
          ]}
        />
      )}
    </Modal>
  )
}
