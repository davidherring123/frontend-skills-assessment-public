import { useState } from "react"
import { Input, Spin } from "antd"
import { SearchOutlined } from "@ant-design/icons"

import { SummaryBar } from "../components/SummaryBar"
import { TransactionList } from "../components/TransactionList"
import { TransactionModal } from "../components/TransactionModal"
import { useTransactions } from "../hooks/useTransactions"
import type { Transaction } from "../models/transaction"

export const TransactionsPage = () => {
  const { transactions, loading } = useTransactions()
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Transaction | null>(null)

  console.log("render TransactionsPage", transactions.length, "search:", search)

  const term = search.trim().toLowerCase()
  const filtered = transactions.filter((t) => {
    return (
      t.merchantName.toLowerCase().includes(term) ||
      t.id.toLowerCase().includes(term) ||
      t.cardBrand.toLowerCase().includes(term) ||
      t.status.toLowerCase().includes(term)
    )
  })

  if (loading) {
    return (
      <div className="app-loading">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <>
      <header className="app-header">
        <h1>Transactions</h1>
        <Input
          style={{ width: 320 }}
          prefix={<SearchOutlined />}
          allowClear
          placeholder="Search merchant, id, card, status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </header>

      <SummaryBar transactions={filtered} />

      <TransactionList transactions={filtered} onSelect={setSelected} />

      <TransactionModal transaction={selected} onClose={() => setSelected(null)} />
    </>
  )
}
