"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Trash2, Calendar, ListChecks, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { PRIORITY_MAP, type Todo } from "@/lib/types"
import { useChain } from "@/hooks/useChain"

const JELLY_EASE = "cubic-bezier(0.34, 1.56, 0.64, 1)"

interface Props {
  todo: Todo
  isDragOverlay?: boolean
}

export function KanbanCard({ todo, isDragOverlay }: Props) {
  const { dispatch, isWalletConnected } = useStore()
  const { deleteTodo, isPending } = useChain()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: todo.id,
    transition: { duration: 400, easing: JELLY_EASE },
  })

  const completedSubtasks = todo.subtasks.filter((s) => s.completed).length

  function handleDelete() {
    const id = todo.id
    dispatch({ type: "DELETE_TODO", payload: id })
    if (isWalletConnected) {
      deleteTodo(id, () => {})
    }
  }

  return (
    <div
      ref={isDragOverlay ? undefined : setNodeRef}
      style={
        isDragOverlay
          ? undefined
          : {
              transform: CSS.Transform.toString(transform),
              transition: transition || undefined,
            }
      }
      className={`group border ${
        isDragOverlay
          ? "animate-wobble border-purple-400/60 bg-zinc-900 shadow-[0_0_40px_oklch(0.65_0.25_285/0.3),0_0_80px_oklch(0.65_0.25_285/0.1)]"
          : "border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm hover:border-zinc-700/60 hover:bg-zinc-900/80 hover:shadow-[0_0_15px_oklch(0.65_0.25_285/0.03)]"
      } ${isDragging ? "opacity-[0.08]" : "opacity-100"} px-3 py-2.5`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab touch-none text-zinc-700 transition-colors duration-150 hover:text-zinc-400 active:cursor-grabbing"
          >
            <GripVertical className="h-3 w-3" />
          </button>
          <span className="truncate text-[13px] leading-snug text-zinc-200">
            {todo.title}
          </span>
        </div>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="shrink-0 rounded-[1px] p-0.5 text-zinc-700 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40 max-sm:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
        >
          {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
        </button>
      </div>

      {todo.description && (
        <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-zinc-600">
          {todo.description}
        </p>
      )}

      {todo.labels.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {todo.labels.map((label) => (
            <Badge
              key={label}
              variant="outline"
              className="border-zinc-700/50 bg-zinc-800/50 px-1.5 py-0 text-[8px] font-normal uppercase tracking-[0.12em] text-zinc-500"
            >
              {label}
            </Badge>
          ))}
        </div>
      )}

      <div className="mt-2.5 flex items-center gap-2 text-[9px] uppercase tracking-wider text-zinc-600">
        <span className={`border px-1 py-0.5 leading-none ${PRIORITY_MAP[todo.priority]}`}>
          {todo.priority}
        </span>
        {todo.subtasks.length > 0 && (
          <span className="flex items-center gap-1">
            <ListChecks className="h-2.5 w-2.5" />
            {completedSubtasks}/{todo.subtasks.length}
          </span>
        )}
        {todo.dueDate && (
          <span className="flex items-center gap-1">
            <Calendar className="h-2.5 w-2.5" />
            {new Date(todo.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        )}
      </div>
    </div>
  )
}
