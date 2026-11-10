import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Alert, Empty, Input, Pagination, Spin } from "antd"
import { SearchOutlined } from "@ant-design/icons"

import { SummaryBar } from "../components/SummaryBar"
import { TransactionList } from "../components/TransactionList"
import { TransactionModal } from "../components/TransactionModal"
import { PAGE_SIZE, SEARCH_DEBOUNCE_MS } from "../config"
import { useTransactionSummary, useTransactions } from "../hooks/useTransactions"
import type { Transaction } from "../models/transaction"

const parsePage = (raw: string | null): number => {
  const page = Number(raw)
  return Number.isSafeInteger(page) && page >= 1 ? page : 1
}

/** Only non-default values go in the URL, so page 1 with no search is just `/`. */
const buildParams = (page: number, search: string): URLSearchParams => {
  const params = new URLSearchParams()
  if (search) params.set("search", search)
  if (page > 1) params.set("page", String(page))
  return params
}

export const TransactionsPage = () => {
  // The URL is the source of truth for page + search, so refresh, back/forward
  // and shared links all show the same results.
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parsePage(searchParams.get("page"))
  const search = (searchParams.get("search") ?? "").trim()

  // What's in the box right now. Lags ahead of `search` by the debounce delay.
  const [searchInput, setSearchInput] = useState(search)
  const [selected, setSelected] = useState<Transaction | null>(null)

  const transactions = useTransactions({ page, pageSize: PAGE_SIZE, search })
  const summary = useTransactionSummary(search)

  // Keep the box in sync when the URL changes from outside (back/forward).
  useEffect(() => {
    setSearchInput((prev) => (prev.trim() === search ? prev : search))
  }, [search])

  // Debounce: commit the typed value to the URL once typing pauses. New
  // searches start on page 1 and replace the history entry so Back doesn't
  // step through every keystroke.
  useEffect(() => {
    const term = searchInput.trim()
    if (term === search) return
    const timer = setTimeout(() => setSearchParams(buildParams(1, term), { replace: true }), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [searchInput, search, setSearchParams])

  // If the URL points past the last page (stale link, or data changed), go to the last page.
  const pagination = transactions.data?.pagination
  useEffect(() => {
    if (transactions.loading || transactions.error || !pagination) return
    if (pagination.totalPages > 0 && page > pagination.totalPages) {
      setSearchParams(buildParams(pagination.totalPages, search), { replace: true })
    }
  }, [transactions.loading, transactions.error, pagination, page, search, setSearchParams])

  const goToPage = (nextPage: number) => {
    setSearchParams(buildParams(nextPage, search))
    window.scrollTo({ top: 0 })
  }

  if (!transactions.data && transactions.loading) {
    return (
      <div className="app-loading">
        <Spin size="large" />
      </div>
    )
  }

  const rows = transactions.data?.data ?? []
  const totalItems = pagination?.totalItems ?? 0

  return (
    <>
      <header className="app-header">
        <h1>Transactions</h1>
        <Input
          style={{ width: 320 }}
          prefix={<SearchOutlined />}
          allowClear
          aria-label="Search transactions"
          placeholder="Search merchant, id, card, status..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </header>

      <SummaryBar summary={summary.data} loading={summary.loading} />

      {transactions.error && (
        <Alert
          className="page-alert"
          type="error"
          showIcon
          message="Couldn't load transactions"
          description={transactions.error}
        />
      )}

      <Spin spinning={transactions.loading} delay={150}>
        {rows.length > 0 ? (
          <TransactionList transactions={rows} onSelect={setSelected} />
        ) : (
          !transactions.loading && (
            <div className="transaction-list transaction-list-empty">
              <Empty description={search ? `No transactions match "${search}"` : "No transactions yet"} />
            </div>
          )
        )}
      </Spin>

      {totalItems > 0 && (
        <div className="pagination-bar">
          <Pagination
            current={page}
            pageSize={PAGE_SIZE}
            total={totalItems}
            showSizeChanger={false}
            showTotal={(total, [from, to]) => `${from}–${to} of ${total.toLocaleString()}`}
            onChange={goToPage}
          />
        </div>
      )}

      <TransactionModal transaction={selected} onClose={() => setSelected(null)} />
    </>
  )
}
