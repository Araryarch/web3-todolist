"use client";

import { useBadges } from "@/hooks/useBadges";
import { BADGES } from "@/lib/badges";
import { Badge as BadgeIcon, Loader2, Lock, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";
import { useState } from "react";

export function BadgeGrid() {
  const { badges, stats, claimBadge, isClaiming, isConnected } = useBadges();
  const { address } = useAccount();
  const [open, setOpen] = useState(false);

  const statValue = stats as
    | Readonly<{
        tasksCreated: bigint;
        tasksDone: bigint;
        columnsBitmask: number;
        totalLabels: bigint;
      }>
    | undefined;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            size="sm"
            className="border-zinc-700/50 bg-zinc-900/60 text-[11px] uppercase tracking-[0.15em] text-zinc-500 transition-all duration-200 hover:border-zinc-600/50 hover:text-zinc-400"
          >
            <Sparkles className="mr-1 h-3 w-3" />
            Badges
          </Button>
        }
      />
      <DialogContent className="w-full max-w-lg max-sm:max-w-[calc(100vw-1.5rem)] border-zinc-800/60 bg-zinc-950/90 shadow-[0_0_40px_oklch(0_0_0/0.5)] backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-purple-400">
            <span className="inline-block h-1.5 w-1.5 rounded-[1px] bg-purple-500 shadow-[0_0_6px_oklch(0.65_0.25_285/0.5)]" />
            Achievement Badges
          </DialogTitle>
        </DialogHeader>

        {isConnected && address && statValue ? (
          <div className="grid grid-cols-4 gap-2 rounded-[1px] border border-zinc-800/50 bg-zinc-900/30 p-3 text-center text-[10px] uppercase tracking-[0.1em]">
            <div>
              <div className="text-[11px] font-bold text-zinc-300">
                {Number(statValue.tasksCreated)}
              </div>
              <div className="text-zinc-600">Created</div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-zinc-300">
                {Number(statValue.tasksDone)}
              </div>
              <div className="text-zinc-600">Done</div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-zinc-300">
                {Number(statValue.totalLabels)}
              </div>
              <div className="text-zinc-600">Labels</div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-zinc-300">
                {badges.filter((b) => b.claimed).length}/{BADGES.length}
              </div>
              <div className="text-zinc-600">Badges</div>
            </div>
          </div>
        ) : (
          <div className="rounded-[1px] border border-dashed border-zinc-800 py-3 text-center text-[10px] uppercase tracking-widest text-zinc-700">
            Connect wallet to track badges
          </div>
        )}

        <div role="list" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              role="listitem"
              aria-label={`${badge.name} badge: ${badge.description}${badge.claimed ? ' (earned)' : ''}`}
              className={`group relative flex flex-col items-center border p-3 text-center transition-all duration-200 ${
                badge.claimed
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-zinc-800/50 bg-zinc-900/30"
              }`}
            >
              <div className="relative mb-2 flex h-10 w-10 items-center justify-center text-xl">
                {badge.claimed ? (
                  <span>{badge.icon}</span>
                ) : (
                  <span className="grayscale opacity-40">{badge.icon}</span>
                )}
                {badge.claimed && (
                  <div className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-[1px] bg-emerald-500 shadow-[0_0_6px_oklch(0.7_0.2_145/0.5)]">
                    <BadgeIcon className="h-2 w-2 text-white" />
                  </div>
                )}
                {!badge.claimed && !isConnected && (
                  <Lock className="absolute -right-0.5 -top-0.5 h-3 w-3 text-zinc-700" />
                )}
              </div>
              <div className="mb-0.5 text-[11px] font-semibold leading-tight text-zinc-300">
                {badge.name}
              </div>
              <div className="mb-1 text-[9px] leading-tight text-zinc-600">
                {badge.description}
              </div>
              <div className="mb-1.5 text-[8px] uppercase tracking-[0.12em] text-zinc-700">
                {badge.requirement}
              </div>
              {isConnected && !badge.claimed && (
                <button
                  onClick={() => claimBadge(badge.id)}
                  disabled={isClaiming}
                  className="mt-auto flex w-full items-center justify-center gap-1 border border-purple-500/20 bg-purple-500/8 px-2 py-1 text-[9px] uppercase tracking-[0.1em] text-purple-400 transition-all duration-200 hover:border-purple-500/40 hover:bg-purple-500/15 disabled:opacity-40"
                >
                  {isClaiming ? (
                    <>
                      <Loader2 className="h-2 w-2 animate-spin" />
                      Claiming
                    </>
                  ) : (
                    "Claim"
                  )}
                </button>
              )}
              {badge.claimed && (
                <div className="mt-auto flex w-full items-center justify-center gap-1 border border-emerald-500/15 bg-emerald-500/5 px-2 py-1 text-[9px] uppercase tracking-[0.1em] text-emerald-500">
                  <BadgeIcon className="h-2 w-2" />
                  Earned
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
