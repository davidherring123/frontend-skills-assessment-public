import express from "express"
import type { NextFunction, Request, Response } from "express"
import cors from "cors"

import { PORT } from "./config.js"
import type { ApiErrorResponse } from "./models/error.js"
import type { Transaction, TransactionListResponse } from "./models/transaction.js"
import { createTransactionService } from "./services/transaction-service.js"
import type { TransactionSummary } from "./services/transaction-service.js"
import { parseNewTransactionInput } from "./validation/transaction-input.js"
import { parseSearchQuery, parseTransactionListQuery } from "./validation/transaction-query.js"

const app = express()

app.use(cors({ origin: "*", credentials: true }))
app.use(express.json())

const transactionService = createTransactionService()

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" })
})

app.get("/api/transactions", (req: Request, res: Response<TransactionListResponse | ApiErrorResponse>) => {
  console.log("GET /api/transactions", req.query)
  const query = parseTransactionListQuery(req.query)
  if (!query.ok) {
    return res.status(400).json({ error: "Invalid query parameters", details: query.details })
  }
  res.json(transactionService.list(query.value))
})

app.get("/api/transactions/summary", (req: Request, res: Response<TransactionSummary | ApiErrorResponse>) => {
  const search = parseSearchQuery(req.query)
  if (!search.ok) {
    return res.status(400).json({ error: "Invalid query parameters", details: search.details })
  }
  res.json(transactionService.getSummary(search.value))
})

app.post("/api/transactions", (req: Request, res: Response<Transaction | ApiErrorResponse>) => {
  const input = parseNewTransactionInput(req.body)
  if (!input.ok) {
    return res.status(400).json({ error: "Invalid transaction", details: input.details })
  }
  res.status(201).json(transactionService.create(input.value))
})

app.get("/api/transactions/:id", (req: Request, res: Response) => {
  const transaction = transactionService.getById(req.params.id)
  if (!transaction) {
    return res.status(404).json({ error: "Transaction not found" })
  }
  res.json(transaction)
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err)
  res.status(500).json({ error: err.message, stack: err.stack })
})

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT} (${transactionService.getAll().length} transactions)`)
})
