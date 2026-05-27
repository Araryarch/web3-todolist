"use client"

import {
  DndContext,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  pointerWithin,
  rectIntersection,
  type CollisionDetection,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { useState, useCallback, useRef } from "react"
import { useStore } from "@/lib/store"
import { useChain } from "@/hooks/useChain"
import { COLUMNS } from "@/lib/types"
import { KanbanColumn } from "./KanbanColumn"
import { KanbanCard } from "./KanbanCard"
import type { Todo } from "@/lib/types"

const JELLY_DROP = { duration: 500, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" }

const collisionDetectionStrategy: CollisionDetection = (args) => {
  const cornerCollisions = closestCorners(args)
  if (cornerCollisions.length > 0) return cornerCollisions
  const pointerCollisions = pointerWithin(args)
  if (pointerCollisions.length > 0) return pointerCollisions
  return rectIntersection(args)
}

export function KanbanBoard() {
  const { state, dispatch, isWalletConnected } = useStore()
  const { moveTodo } = useChain()
  const [activeCard, setActiveCard] = useState<Todo | null>(null)
  const [activeColumn, setActiveColumn] = useState<UniqueIdentifier | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
    useSensor(KeyboardSensor)
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const card = state.todos.find((t) => t.id === event.active.id)
    if (card) {
      setActiveCard(card)
      setActiveColumn(card.column)
    }
  }, [state.todos])

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return
    const activeTodo = state.todos.find((t) => t.id === active.id)
    if (!activeTodo) return
    const overTodo = state.todos.find((t) => t.id === over.id)
    const overColumn = COLUMNS.find((c) => c.id === over.id)
    const targetColumn = overTodo?.column ?? overColumn?.id
    if (targetColumn && activeTodo.column !== targetColumn) {
      dispatch({ type: "MOVE_TODO", payload: { id: activeTodo.id, column: targetColumn } })
    }
  }, [state.todos, dispatch])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveCard(null)
    setActiveColumn(null)
    const { active, over } = event
    if (!over || active.id === over.id) return
    const activeTodo = state.todos.find((t) => t.id === active.id)
    if (!activeTodo) return
    const overTodo = state.todos.find((t) => t.id === over.id)
    if (!overTodo || activeTodo.column !== overTodo.column) return
    const columnTodos = state.todos
      .filter((t) => t.column === activeTodo.column)
      .sort((a, b) => state.todos.indexOf(a) - state.todos.indexOf(b))
    const oldIdx = columnTodos.findIndex((t) => t.id === active.id)
    const newIdx = columnTodos.findIndex((t) => t.id === over.id)
    if (oldIdx === newIdx) return
    const reordered = [...columnTodos]
    reordered.splice(oldIdx, 1)
    reordered.splice(newIdx, 0, activeTodo)
    dispatch({ type: "REORDER", payload: { column: activeTodo.column, ids: reordered.map((t) => t.id) } })
    if (isWalletConnected && activeTodo.column !== overTodo.column) {
      moveTodo(activeTodo.id, overTodo.column, () => {})
    }
  }, [state.todos, dispatch, isWalletConnected, moveTodo])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {state.todos.length === 0 && isWalletConnected && !activeCard ? (
        <div className="flex h-full w-full items-center justify-center">
          <div className="border border-dashed border-zinc-800 px-4 py-3 text-[9px] uppercase tracking-widest text-zinc-700 sm:px-6 sm:py-4 sm:text-[10px]">
            No tasks yet — create one above
          </div>
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex h-full gap-3 overflow-x-auto pb-2 sm:gap-4"
          style={{ scrollBehavior: "smooth" }}
        >
          {COLUMNS.map((col) => {
            const columnTodos = state.todos.filter((t) => t.column === col.id)
            return (
              <KanbanColumn
                key={col.id}
                column={col}
                todos={columnTodos}
                isActive={activeColumn === col.id}
              />
            )
          })}
        </div>
      )}
      <DragOverlay dropAnimation={JELLY_DROP}>
        {activeCard ? (
          <div className="animate-jelly">
            <KanbanCard todo={activeCard} isDragOverlay />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
