const RAW_ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"string","name":"title","type":"string"}],"name":"TodoCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":true,"internalType":"address","name":"owner","type":"address"}],"name":"TodoDeleted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint8","name":"newColumn","type":"uint8"}],"name":"TodoMoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":true,"internalType":"address","name":"owner","type":"address"}],"name":"TodoUpdated","type":"event"},{"inputs":[{"internalType":"uint256","name":"todoId","type":"uint256"},{"internalType":"string","name":"title","type":"string"}],"name":"addSubTask","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"uint8","name":"priority","type":"uint8"},{"internalType":"uint8","name":"column","type":"uint8"},{"internalType":"string[]","name":"labels","type":"string[]"},{"internalType":"uint256","name":"dueDate","type":"uint256"}],"name":"createTodo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"deleteTodo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"todoId","type":"uint256"}],"name":"getSubtasks","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"title","type":"string"},{"internalType":"bool","name":"completed","type":"bool"}],"internalType":"struct TodoList.SubTask[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getTodos","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"uint8","name":"priority","type":"uint8"},{"internalType":"uint8","name":"column","type":"uint8"},{"internalType":"string[]","name":"labels","type":"string[]"},{"internalType":"uint256","name":"dueDate","type":"uint256"},{"internalType":"uint256","name":"createdAt","type":"uint256"},{"internalType":"bool","name":"exists","type":"bool"}],"internalType":"struct TodoList.Todo[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint8","name":"newColumn","type":"uint8"}],"name":"moveTodo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"todoId","type":"uint256"},{"internalType":"uint256","name":"subId","type":"uint256"}],"name":"toggleSubTask","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"uint8","name":"priority","type":"uint8"},{"internalType":"uint8","name":"column","type":"uint8"},{"internalType":"string[]","name":"labels","type":"string[]"},{"internalType":"uint256","name":"dueDate","type":"uint256"}],"name":"updateTodo","outputs":[],"stateMutability":"nonpayable","type":"function"}] as const

export const TODO_LIST_ABI = RAW_ABI

export const TODO_LIST_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "0x5FbDB2315678afecb367f032d93F642f64180aa3") as `0x${string}`

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
