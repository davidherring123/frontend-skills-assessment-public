import { Button, Descriptions, Modal, Tag } from "antd"

import type { Transaction } from "../models/transaction"
import { formatCurrency, formatDate } from "../utils/format"
import { statusTagColor } from "../utils/status"

interface TransactionModalProps {
  transaction: Transaction | null
  onClose: () => void
}

export const TransactionModal = ({ transaction, onClose }: TransactionModalProps) => {
  return (
    <Modal
      open={transaction !== null}
      title={transaction?.id}
      onCancel={onClose}
      footer={[
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
              children: `${formatCurrency(transaction.surcharge)} (${(transaction.surchargeRate * 100).toFixed(1)}%)`,
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
