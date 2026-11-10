export const formatCurrency = (value: number): string => {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" })
}

export const formatPercent = (rate: number): string => {
  return rate.toLocaleString("en-US", { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 2 })
}

export const formatDate = (iso: string): string => {
  return new Date(iso).toLocaleDateString("en-US", { timeZone: "UTC" })
}

export const formatDateTime = (iso: string): string => {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  })
}
