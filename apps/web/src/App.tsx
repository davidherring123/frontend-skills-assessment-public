import { Button } from "antd"
import { Link, Route, Routes, useLocation, useMatch, useNavigate } from "react-router-dom"

import type { DashboardLinkState } from "./hooks/useDashboardPath"
import { useDashboardSearch } from "./hooks/useDashboardPath"
import { NewTransactionPage } from "./pages/NewTransactionPage"
import { NotFoundPage } from "./pages/NotFoundPage"
import { TransactionDetailPage } from "./pages/TransactionDetailPage"
import { TransactionsPage } from "./pages/TransactionsPage"

const App = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dashboardSearch = useDashboardSearch()
  const isCreatingTransaction = useMatch("/transactions/new") !== null

  const openNewTransaction = () => {
    // Remember the dashboard page/search so "Back to dashboard" and Cancel return there.
    const state: DashboardLinkState = { from: location.pathname === "/" ? location.search : dashboardSearch }
    navigate("/transactions/new", { state })
  }

  return (
    <div className="app">
      <nav className="app-nav">
        <Link to="/" className="brand">
          Payment Portal
        </Link>
        {!isCreatingTransaction && (
          <Button type="primary" onClick={openNewTransaction}>
            New transaction
          </Button>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<TransactionsPage />} />
        <Route path="/transactions/new" element={<NewTransactionPage />} />
        <Route path="/transactions/:id" element={<TransactionDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}

export default App
