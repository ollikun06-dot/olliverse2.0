"use client"

import { SWRConfig } from "swr"
import type { ReactNode } from "react"

export function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        revalidateOnMount: true,
        refreshInterval: 5 * 60 * 1000, // Refresh every 5 minutes while the tab is open
        dedupingInterval: 30 * 1000, // Deduplicate requests within 30 seconds
        errorRetryCount: 3,
        keepPreviousData: true,
      }}
    >
      {children}
    </SWRConfig>
  )
}
