import todoListAbi from "./todo-list-abi.json"
import todoNftAbi from "./todo-nft-abi.json"

export const TODO_LIST_ADDRESS = (
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3"
) as `0x${string}`

export const TODO_NFT_ADDRESS = (
  process.env.NEXT_PUBLIC_NFT_ADDRESS || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
) as `0x${string}`

export const TODO_LIST_ABI = todoListAbi
export const TODO_NFT_ABI = todoNftAbi

export const PRIORITY_MAP_CHAIN: Record<string, number> = {
  low: 0,
  medium: 1,
  high: 2,
  urgent: 3,
}

export const PRIORITY_MAP_UI: Record<number, string> = {
  0: "low",
  1: "medium",
  2: "high",
  3: "urgent",
}

export const COLUMN_MAP_CHAIN: Record<string, number> = {
  backlog: 0,
  todo: 1,
  "in-progress": 2,
  done: 3,
}

export const COLUMN_MAP_UI: Record<number, string> = {
  0: "backlog",
  1: "todo",
  2: "in-progress",
  3: "done",
}
