"use client"

import Link from "next/link"
import { useAccount, useConnect } from "wagmi"
import { KanbanBoard } from "@/components/kanban/KanbanBoard"
import { TodoDialog } from "@/components/todo/TodoDialog"
import { BadgeGrid } from "@/components/nft/BadgeGrid"
import { ConnectButton } from "@/components/web3/ConnectButton"
import { ArrowLeft, Wallet, ArrowRight, Loader2 } from "lucide-react"
import { useStore } from "@/lib/store"
import { useState } from "react"

function WalletGate() {
  const { connectAsync, connectors, isPending } = useConnect()
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

  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] animate-float-slow rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] animate-float rounded-full bg-pink-500/8 blur-[100px]" />
      </div>
      <div className="animate-fade-up relative flex flex-col items-center px-4 text-center">
        <div className="relative mb-6 flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20">
          <div className="absolute inset-0 animate-glow rounded-[2px] bg-gradient-to-br from-purple-500 to-pink-500 opacity-40 blur-xl" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-[2px] border border-purple-500/30 bg-zinc-950/80 sm:h-20 sm:w-20">
            <span className="bg-gradient-to-br from-purple-300 to-pink-300 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">T</span>
          </div>
        </div>
        <h1 className="mb-2 text-xl font-bold tracking-tight text-zinc-200 sm:text-2xl">Wallet Required</h1>
        <p className="mb-6 max-w-xs text-[12px] leading-relaxed text-zinc-600">
          Connect your Web3 wallet to access the board. All your tasks are stored on-chain.
        </p>
        <button
          onClick={handleConnect}
          disabled={isPending}
          className="flex items-center gap-2 border border-purple-500/30 bg-purple-500/12 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-purple-200 shadow-[0_0_20px_oklch(0.65_0.25_285/0.08)] backdrop-blur-sm transition-all duration-300 hover:border-purple-500/50 hover:bg-purple-500/20 hover:shadow-[0_0_30px_oklch(0.65_0.25_285/0.15)] disabled:opacity-40 sm:text-[12px]"
        >
          {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wallet className="h-3.5 w-3.5" />}
          {isPending ? "Connecting..." : "Connect Wallet"}
          {!isPending && <ArrowRight className="h-3.5 w-3.5" />}
        </button>
        {error && (
          <p className="mt-3 text-[10px] uppercase tracking-[0.1em] text-red-400">{error}</p>
        )}
        <Link
          href="/"
          className="mt-6 text-[10px] uppercase tracking-[0.15em] text-zinc-700 transition-colors duration-200 hover:text-zinc-500"
        >
          &larr; Back to Home
        </Link>
      </div>
    </div>
  )
}

export default function BoardPage() {
  const { isConnected } = useAccount()
  const { pendingTx } = useStore()

  if (!isConnected) {
    return (
      <div className="relative flex h-full flex-col overflow-hidden">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.65_0.25_285/0.12),transparent)]" />
        <WalletGate />
      </div>
    )
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.65_0.25_285/0.12),transparent)]" />
      {pendingTx && (
        <div className="pointer-events-none fixed top-0 left-0 right-0 z-50 flex items-center justify-center">
          <div className="mt-1 border border-amber-500/20 bg-zinc-950/90 px-2 py-1 text-[8px] uppercase tracking-[0.15em] text-amber-400 backdrop-blur-xl sm:px-3 sm:text-[9px]">
            Tx: {pendingTx.slice(0, 6)}...{pendingTx.slice(-3)}
          </div>
        </div>
      )}
      <header className="relative shrink-0 border-b border-zinc-800/60 bg-zinc-950/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2 sm:px-5 sm:py-2.5">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="flex items-center gap-1 text-[10px] uppercase tracking-[0.12em] text-zinc-600 transition-colors duration-200 hover:text-zinc-400 sm:text-[11px]"
            >
              <ArrowLeft className="h-3 w-3" />
              <span className="hidden sm:inline">Back</span>
            </Link>
            <div className="h-4 w-px bg-gradient-to-b from-transparent via-zinc-700 to-transparent" />
            <div className="relative flex h-6 w-6 items-center justify-center sm:h-7 sm:w-7">
              <div className="absolute inset-0 rounded-[2px] bg-gradient-to-br from-purple-500 to-pink-500 opacity-30 blur-sm" />
              <div className="relative flex h-6 w-6 items-center justify-center rounded-[2px] border border-purple-500/30 bg-zinc-950/80 sm:h-7 sm:w-7">
                <span className="bg-gradient-to-br from-purple-300 to-pink-300 bg-clip-text text-[10px] font-bold text-transparent sm:text-[11px]">T</span>
              </div>
            </div>
            <div className="h-4 w-px bg-gradient-to-b from-transparent via-zinc-700 to-transparent" />
            <span className="bg-gradient-to-r from-zinc-300 to-zinc-500 bg-clip-text text-[10px] font-semibold uppercase tracking-[0.2em] text-transparent sm:text-xs">
              Board
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <TodoDialog />
            <BadgeGrid />
            <ConnectButton />
          </div>
        </div>
      </header>
      <main className="relative flex-1 overflow-hidden p-2 sm:p-3 md:p-4">
        <KanbanBoard />
      </main>
    </div>
  )
}
