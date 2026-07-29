import { useEffect, useState } from "react"

import type { Transaction } from "../models/transaction"
import { fetchTransactions } from "../services/transaction-service"

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTransactions().then((data) => {
      setTransactions(data)
      setLoading(false)
    })
  }, [])

  return { transactions, loading }
}
