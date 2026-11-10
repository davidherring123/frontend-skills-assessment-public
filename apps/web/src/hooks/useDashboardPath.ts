import { useLocation } from "react-router-dom"

export interface DashboardLinkState {
  from?: string
}

export const useDashboardSearch = (): string => {
  const from = (useLocation().state as DashboardLinkState | null)?.from
  return typeof from === "string" && from.startsWith("?") ? from : ""
}

export const useDashboardPath = (): string => `/${useDashboardSearch()}`
