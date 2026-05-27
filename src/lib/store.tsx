"use client"

import { createContext, useContext, useReducer, useEffect, useRef, useCallback, type ReactNode } from "react"
import { useAccount } from "wagmi"
import { useChain } from "@/hooks/useChain"
import type { Todo, KanbanColumn } from "./types"

interface State {
  todos: Todo[]
  pendingTx: string | null
}

type Action =
  | { type: "ADD_TODO"; payload: Todo }
  | { type: "UPDATE_TODO"; payload: Todo }
  | { type: "DELETE_TODO"; payload: string }
  | { type: "MOVE_TODO"; payload: { id: string; column: KanbanColumn } }
  | { type: "REORDER"; payload: { column: KanbanColumn; ids: string[] } }
  | { type: "SET_TODOS"; payload: Todo[] }
  | { type: "SET_PENDING_TX"; payload: string | null }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_TODO":
      return { ...state, todos: [...state.todos, action.payload] }
    case "UPDATE_TODO":
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      }
    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter((t) => t.id !== action.payload),
      }
    case "MOVE_TODO":
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload.id
            ? { ...t, column: action.payload.column }
            : t
        ),
      }
    case "REORDER": {
      // Preserve relative position of all column groups — only reorder the target column
      const reorderedIds = action.payload.ids
      const idOrderMap = new Map(reorderedIds.map((id, i) => [id, i]))

      return {
        ...state,
        todos: state.todos.map((t) => t).sort((a, b) => {
          // If both are in the reordered column, sort by the new order
          if (a.column === action.payload.column && b.column === action.payload.column) {
            return (idOrderMap.get(a.id) ?? Infinity) - (idOrderMap.get(b.id) ?? Infinity)
          }
          // Otherwise preserve original relative order
          return state.todos.indexOf(a) - state.todos.indexOf(b)
        }),
      }
    }
    case "SET_TODOS":
      return { ...state, todos: action.payload }
    case "SET_PENDING_TX":
      return { ...state, pendingTx: action.payload }
    default:
      return state
  }
}

const StoreContext = createContext<{
  state: State
  dispatch: React.Dispatch<Action>
  isWalletConnected: boolean
  pendingTx: string | null
} | null>(null)

const initialState: State = {
  todos: [],
  pendingTx: null,
}

function StoreInner({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { isConnected, address } = useAccount()
  const { isPending, isConfirming, isSuccess, hash, refetchTodos, fetchAllTodos } = useChain()
  const prevHashRef = useRef<string | null>(null)

  const syncTodos = useCallback(async () => {
    try {
      await refetchTodos()
      const todos = await fetchAllTodos()
      dispatch({ type: "SET_TODOS", payload: todos })
    } catch (err) {
      console.error("Failed to sync todos from chain:", err)
    }
  }, [refetchTodos, fetchAllTodos])

  useEffect(() => {
    if (!isConnected) {
      dispatch({ type: "SET_TODOS", payload: [] })
      dispatch({ type: "SET_PENDING_TX", payload: null })
      prevHashRef.current = null
      return
    }
    if (!address) return
    const h = hash ?? null
    if (isPending || isConfirming) {
      if (h !== prevHashRef.current) {
        prevHashRef.current = h
        dispatch({ type: "SET_PENDING_TX", payload: h ?? "pending" })
      }
    } else if (isSuccess && h) {
      prevHashRef.current = null
      dispatch({ type: "SET_PENDING_TX", payload: null })
      syncTodos()
    }
  }, [isConnected, address, isPending, isConfirming, isSuccess, hash, syncTodos])

  return (
    <StoreContext.Provider value={{ state, dispatch, isWalletConnected: isConnected, pendingTx: state.pendingTx }}>
      {children}
    </StoreContext.Provider>
  )
}

export function StoreProvider({ children }: { children: ReactNode }) {
  return <StoreInner>{children}</StoreInner>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}
