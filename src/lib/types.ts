import { Circle, ListTodo, Loader2, CheckCircle2 } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type Priority = "low" | "medium" | "high" | "urgent"

export type KanbanColumn = "backlog" | "todo" | "in-progress" | "done"

export interface SubTask {
  id: string
  title: string
  completed: boolean
}

export interface Todo {
  id: string
  title: string
  description?: string
  priority: Priority
  column: KanbanColumn
  subtasks: SubTask[]
  labels: string[]
  dueDate?: string
  createdAt: string
}

export const COLUMNS: {
  id: KanbanColumn
  title: string
  icon: LucideIcon
  gradient: string
  dotColor: string
}[] = [
  { id: "backlog", title: "Backlog", icon: Circle, gradient: "from-zinc-500/20 to-zinc-500/5", dotColor: "bg-zinc-500" },
  { id: "todo", title: "To Do", icon: ListTodo, gradient: "from-blue-500/20 to-blue-500/5", dotColor: "bg-blue-400" },
  { id: "in-progress", title: "In Progress", icon: Loader2, gradient: "from-amber-500/20 to-amber-500/5", dotColor: "bg-amber-400" },
  { id: "done", title: "Done", icon: CheckCircle2, gradient: "from-emerald-500/20 to-emerald-500/5", dotColor: "bg-emerald-400" },
]

export const PRIORITY = [
  { value: "low" as Priority, label: "Low", color: "text-blue-300 border-blue-500/20 bg-blue-500/5" },
  { value: "medium" as Priority, label: "Medium", color: "text-amber-300 border-amber-500/20 bg-amber-500/5" },
  { value: "high" as Priority, label: "High", color: "text-orange-300 border-orange-500/20 bg-orange-500/5" },
  { value: "urgent" as Priority, label: "Urgent", color: "text-red-300 border-red-500/20 bg-red-500/5" },
]

export const PRIORITY_MAP: Record<Priority, string> = Object.fromEntries(
  PRIORITY.map((p) => [p.value, p.color])
) as Record<Priority, string>
