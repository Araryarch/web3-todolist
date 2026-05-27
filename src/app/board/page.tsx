"use client"

import Link from "next/link"
import { KanbanBoard } from "@/components/kanban/KanbanBoard"
import { TodoDialog } from "@/components/todo/TodoDialog"
import { ConnectButton } from "@/components/web3/ConnectButton"
import { ArrowLeft } from "lucide-react"
import { useStore } from "@/lib/store"

export default function BoardPage() {
  const { pendingTx } = useStore()

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
          <div className="flex items-center gap-1.5 sm:gap-2">
            <TodoDialog />
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
