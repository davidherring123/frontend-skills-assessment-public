import { readFileSync } from "node:fs"

import type { Transaction } from "../models/transaction.js"

const dataFile = new URL("./transactions.json", import.meta.url)

export const loadTransactions = (): Transaction[] => {
  const raw = readFileSync(dataFile, "utf-8")
  return JSON.parse(raw) as Transaction[]
}
