"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Todo, KanbanColumn as KanbanColumnType } from "@/lib/types";
import { KanbanCard } from "./KanbanCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Circle } from "lucide-react";

interface Props {
  column: {
    id: KanbanColumnType;
    title: string;
    icon: typeof Circle;
    gradient: string;
    dotColor: string;
  };
  todos: Todo[];
  isActive?: boolean;
}

export function KanbanColumn({ column, todos, isActive }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const Icon = column.icon;

  return (
    <div className="flex w-72 shrink-0 flex-col max-sm:w-[calc(100vw-2rem)]">
      <div
        className={`relative flex flex-col overflow-hidden border transition-all duration-300 ${
          isOver
            ? "border-purple-500/50 shadow-[0_0_25px_oklch(0.65_0.25_285/0.1)]"
            : isActive
              ? "border-purple-500/20"
              : "border-zinc-800/60"
        } bg-zinc-950/40 backdrop-blur-sm`}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-b ${column.gradient} opacity-30 transition-opacity duration-300 ${isOver ? "opacity-60" : ""}`}
        />
        <div className="relative flex flex-col">
          <div className="flex items-center justify-between border-b border-zinc-800/50 px-2.5 py-2 sm:px-3 sm:py-2.5">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span
                className={`flex h-2 w-2 ${column.dotColor} shadow-[0_0_6px] shadow-current/50`}
              />
              <Icon className={`hidden h-3 w-3 sm:block ${column.dotColor}`} />
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-400 sm:text-[11px]">
                {column.title}
              </h3>
            </div>
            <span
              className={`flex h-5 min-w-5 items-center justify-center border px-1 text-[10px] font-medium transition-all duration-300 ${
                isOver
                  ? "border-purple-500/40 bg-purple-500/10 text-purple-400"
                  : "border-zinc-700/50 bg-zinc-900/80 text-zinc-500"
              }`}
            >
              {todos.length}
            </span>
          </div>
          <div
            ref={setNodeRef}
            className={`flex min-h-[120px] flex-col gap-1.5 p-1.5 transition-all duration-200 sm:min-h-[160px] sm:p-2 ${
              isOver ? "bg-purple-500/8" : ""
            }`}
          >
            <SortableContext
              items={todos.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              {todos.length === 0 ? (
                <div
                  className={`flex flex-1 flex-col items-center justify-center border border-dashed py-6 transition-all duration-300 sm:py-10 ${
                    isOver
                      ? "border-purple-500/30 bg-purple-500/5"
                      : "border-zinc-800"
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-widest text-zinc-700">
                    drop here
                  </span>
                </div>
              ) : (
                <ScrollArea className="flex-1 -mx-1.5 px-1.5 sm:-mx-2 sm:px-2">
                  <div className="flex flex-col gap-1.5 min-h-[100px] sm:min-h-[120px]">
                    {todos.map((todo) => (
                      <KanbanCard key={todo.id} todo={todo} />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </SortableContext>
          </div>
        </div>
      </div>
    </div>
  );
}
