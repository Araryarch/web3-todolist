"use client"

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { TODO_NFT_ABI, TODO_NFT_ADDRESS, TODO_LIST_ABI, TODO_LIST_ADDRESS } from "@/lib/contract"
import { BADGES } from "@/lib/badges"
import { useCallback, useMemo } from "react"

export function useBadges() {
  const { address, isConnected } = useAccount()

  const { data: stats } = useReadContract({
    address: TODO_LIST_ADDRESS,
    abi: TODO_LIST_ABI,
    functionName: "getUserStats",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  const { data: claimedData } = useReadContract({
    address: TODO_NFT_ADDRESS,
    abi: TODO_NFT_ABI,
    functionName: "balanceOfBatch",
    args: address
      ? [BADGES.map(() => address), BADGES.map((b) => BigInt(b.id))]
      : undefined,
    query: { enabled: !!address },
  })

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isSuccess: txConfirmed } = useWaitForTransactionReceipt({ hash })

  const claimBadge = useCallback(
    (badgeId: number) => {
      if (!isConnected) return
      writeContract({
        address: TODO_NFT_ADDRESS,
        abi: TODO_NFT_ABI,
        functionName: "claimBadge",
        args: [BigInt(badgeId)],
      })
    },
    [writeContract, isConnected]
  )

  const claimedSet = useMemo(() => {
    const balances = claimedData as bigint[] | undefined
    if (!balances) return new Set<number>()
    const set = new Set<number>()
    for (let i = 0; i < balances.length; i++) {
      if (balances[i] > BigInt(0)) set.add(BADGES[i].id)
    }
    return set
  }, [claimedData])

  const badges = useMemo(
    () =>
      BADGES.map((badge) => ({
        ...badge,
        claimed: claimedSet.has(badge.id),
      })),
    [claimedSet]
  )

  return {
    badges,
    stats,
    claimBadge,
    isClaiming: isPending,
    isConnected,
    txConfirmed,
  }
}
