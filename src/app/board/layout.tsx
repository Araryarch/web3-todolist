"use client"

import { Web3Provider } from "@/components/web3/Web3Provider"
import { StoreProvider } from "@/lib/store"

export default function BoardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Web3Provider>
      <StoreProvider>
        {children}
      </StoreProvider>
    </Web3Provider>
  )
}
