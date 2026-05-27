"use client"

import { useAccount, useConnect, useDisconnect } from "wagmi"
import { useStore } from "@/lib/store"
import { Wallet, Loader2 } from "lucide-react"
import { useState } from "react"

export function ConnectButton() {
  const { address, isConnected } = useAccount()
  const { connectAsync, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { pendingTx } = useStore()
  const [error, setError] = useState<string | null>(null)

  async function handleConnect() {
    setError(null)
    const c = connectors[0]
    if (!c) { setError("No wallet detected"); return }
    try {
      await connectAsync({ connector: c })
    } catch (e) {
      if ((e as { code?: string }).code === "USER_REJECTED") return
      setError((e as Error).message || "Connection failed")
    }
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-1 sm:gap-1.5">
        {pendingTx && (
          <div className="flex items-center gap-1 border border-amber-500/20 bg-amber-500/8 px-1.5 py-1 text-[8px] uppercase tracking-[0.1em] text-amber-400 sm:px-2 sm:py-1.5 sm:text-[10px]">
            <Loader2 className="h-2 w-2 animate-spin sm:h-2.5 sm:w-2.5" />
            <span className="hidden sm:inline">Confirming</span>
          </div>
        )}
        <button
          onClick={() => disconnect()}
          aria-label="Disconnect wallet"
          className="flex items-center gap-1.5 border border-red-500/20 bg-red-500/5 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.1em] text-red-300 backdrop-blur-sm transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/10 hover:shadow-[0_0_15px_oklch(0.6_0.22_25/0.1)] sm:gap-2 sm:px-2.5 sm:py-1.5 sm:text-[11px]"
        >
          {address?.slice(0, 4)}...{address?.slice(-2)}
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-end gap-0.5">
      <button
        onClick={handleConnect}
        disabled={isPending}
        aria-label="Connect wallet"
        className="flex items-center gap-1.5 border border-purple-500/20 bg-purple-500/5 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.1em] text-purple-300 shadow-[0_0_10px_oklch(0.65_0.25_285/0.05)] backdrop-blur-sm transition-all duration-200 hover:border-purple-500/40 hover:bg-purple-500/10 hover:shadow-[0_0_20px_oklch(0.65_0.25_285/0.12)] disabled:opacity-40 sm:gap-2 sm:px-2.5 sm:py-1.5 sm:text-[11px]"
      >
        {isPending ? <Loader2 className="h-2.5 w-2.5 animate-spin sm:h-3 sm:w-3" /> : <Wallet className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
        <span className="hidden sm:inline">{isPending ? "Connecting..." : "Connect"}</span>
      </button>
      {error && (
        <span className="text-[8px] uppercase tracking-[0.1em] text-red-400">{error}</span>
      )}
    </div>
  )
}
