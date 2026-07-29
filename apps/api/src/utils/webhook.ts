import { PROCESSOR_WEBHOOK_SECRET } from "../config.js"
import type { Transaction } from "../models/transaction.js"

// not wired up yet, will use this for the settlement notifications
export const notifySettlement = async (url: string, transaction: Transaction): Promise<void> => {
  await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-webhook-secret": PROCESSOR_WEBHOOK_SECRET,
    },
    body: JSON.stringify(transaction),
  })
}
