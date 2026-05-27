"use client"

import { useCallback } from "react"
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi"
import { readContract } from "@wagmi/core"
import { wagmiConfig } from "@/lib/wagmi"
import { TODO_LIST_ABI, TODO_LIST_ADDRESS, PRIORITY_MAP_CHAIN, PRIORITY_MAP_UI, COLUMN_MAP_CHAIN, COLUMN_MAP_UI } from "@/lib/contract"
import type { Todo, SubTask, Priority, KanbanColumn } from "@/lib/types"

interface ChainTodo {
  id: bigint
  title: string
  description: string
  priority: number
  column: number
  labels: readonly string[]
  dueDate: bigint
  createdAt: bigint
  exists: boolean
}

export function useChain() {
  const { address, isConnected } = useAccount()
  const { data: hash, writeContract, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const { data: rawTodos, refetch: refetchTodos } = useReadContract({
    address: TODO_LIST_ADDRESS,
    abi: TODO_LIST_ABI,
    functionName: "getTodos",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  const fetchSubtasksForTodo = useCallback(async (todoId: number): Promise<SubTask[]> => {
    try {
      const result = await readContract(wagmiConfig, {
        address: TODO_LIST_ADDRESS,
        abi: TODO_LIST_ABI,
        functionName: "getSubtasks",
        args: [BigInt(todoId)],
      })
      const items = result as Array<{ id: bigint; title: string; completed: boolean }>
      return items.map((s) => ({
        id: s.id.toString(),
        title: s.title,
        completed: s.completed,
      }))
    } catch {
      return []
    }
  }, [])

  const fetchAllTodos = useCallback(async (): Promise<Todo[]> => {
    if (!address || !rawTodos) return []
    const chainTodos = rawTodos as ChainTodo[]

    // Filter first, then fetch subtasks — fixes off-by-one when deleted todos exist
    const existingTodos = chainTodos.filter((t) => t.exists)
    const subtaskPromises = existingTodos.map((t) => fetchSubtasksForTodo(Number(t.id)))
    const allSubtasks = await Promise.all(subtaskPromises)

    return existingTodos.map((t, i) => ({
      id: t.id.toString(),
      title: t.title,
      description: t.description || undefined,
      priority: PRIORITY_MAP_UI[t.priority] as Priority,
      column: COLUMN_MAP_UI[t.column] as KanbanColumn,
      subtasks: allSubtasks[i] ?? [],
      labels: [...t.labels],
      dueDate: t.dueDate > BigInt(0) ? new Date(Number(t.dueDate) * 1000).toISOString() : undefined,
      createdAt: new Date(Number(t.createdAt) * 1000).toISOString(),
    }))
  }, [address, rawTodos, fetchSubtasksForTodo])

  const createTodoAction = useCallback(
    (todo: Todo, onSuccess?: () => void) => {
      const priority = PRIORITY_MAP_CHAIN[todo.priority] ?? 1
      const col = COLUMN_MAP_CHAIN[todo.column] ?? 1
      const dueDate = todo.dueDate ? BigInt(Math.floor(new Date(todo.dueDate).getTime() / 1000)) : BigInt(0)
      writeContract(
        {
          address: TODO_LIST_ADDRESS,
          abi: TODO_LIST_ABI,
          functionName: "createTodo",
          args: [todo.title, todo.description ?? "", priority, col, todo.labels, dueDate],
        },
        { onSuccess }
      )
    },
    [writeContract]
  )

  const updateTodoAction = useCallback(
    (todo: Todo, onSuccess?: () => void) => {
      const priority = PRIORITY_MAP_CHAIN[todo.priority] ?? 1
      const col = COLUMN_MAP_CHAIN[todo.column] ?? 1
      const dueDate = todo.dueDate ? BigInt(Math.floor(new Date(todo.dueDate).getTime() / 1000)) : BigInt(0)
      writeContract(
        {
          address: TODO_LIST_ADDRESS,
          abi: TODO_LIST_ABI,
          functionName: "updateTodo",
          args: [BigInt(todo.id), todo.title, todo.description ?? "", priority, col, todo.labels, dueDate],
        },
        { onSuccess }
      )
    },
    [writeContract]
  )

  const deleteTodoAction = useCallback(
    (id: string, onSuccess?: () => void) => {
      writeContract(
        { address: TODO_LIST_ADDRESS, abi: TODO_LIST_ABI, functionName: "deleteTodo", args: [BigInt(id)] },
        { onSuccess }
      )
    },
    [writeContract]
  )

  const moveTodoAction = useCallback(
    (id: string, col: KanbanColumn, onSuccess?: () => void) => {
      const c = COLUMN_MAP_CHAIN[col] ?? 1
      writeContract(
        { address: TODO_LIST_ADDRESS, abi: TODO_LIST_ABI, functionName: "moveTodo", args: [BigInt(id), c] },
        { onSuccess }
      )
    },
    [writeContract]
  )

  return {
    isConnected,
    address,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    refetchTodos,
    fetchAllTodos,
    createTodo: createTodoAction,
    updateTodo: updateTodoAction,
    deleteTodo: deleteTodoAction,
    moveTodo: moveTodoAction,
  }
}
