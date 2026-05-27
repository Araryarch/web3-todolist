"use client";

import { useState, useEffect } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/lib/store";
import { useChain } from "@/hooks/useChain";
import {
  PRIORITY,
  COLUMNS,
  type Priority,
  type KanbanColumn,
  type Todo,
  type SubTask,
} from "@/lib/types";

type Props = { editTodo?: Todo };

export function TodoDialog({ editTodo }: Props) {
  const { dispatch, isWalletConnected, pendingTx } = useStore();
  const { createTodo, updateTodo, isPending } = useChain();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(editTodo?.title ?? "");
  const [description, setDescription] = useState(editTodo?.description ?? "");
  const [priority, setPriority] = useState<Priority>(
    editTodo?.priority ?? "medium",
  );
  const [column, setColumn] = useState<KanbanColumn>(
    editTodo?.column ?? "todo",
  );
  const [labels, setLabels] = useState<string[]>(editTodo?.labels ?? []);
  const [labelInput, setLabelInput] = useState("");
  const [dueDate, setDueDate] = useState(
    editTodo?.dueDate
      ? new Date(editTodo.dueDate).toISOString().split("T")[0]
      : "",
  );
  const [subtasks, setSubtasks] = useState<SubTask[]>(editTodo?.subtasks ?? []);
  const [subtaskInput, setSubtaskInput] = useState("");

  const saving = isPending || !!pendingTx;

  // Sync form state when editTodo changes or dialog opens
  useEffect(() => {
    if (open && editTodo) {
      setTitle(editTodo.title);
      setDescription(editTodo.description ?? "");
      setPriority(editTodo.priority);
      setColumn(editTodo.column);
      setLabels([...editTodo.labels]);
      setDueDate(
        editTodo.dueDate
          ? new Date(editTodo.dueDate).toISOString().split("T")[0]
          : "",
      );
      setSubtasks([...editTodo.subtasks]);
    }
  }, [open, editTodo]);

  function addLabel() {
    const v = labelInput.trim();
    if (v && !labels.includes(v)) {
      setLabels([...labels, v]);
      setLabelInput("");
    }
  }

  function addSubtask() {
    const v = subtaskInput.trim();
    if (v) {
      setSubtasks([
        ...subtasks,
        { id: crypto.randomUUID(), title: v, completed: false },
      ]);
      setSubtaskInput("");
    }
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setColumn("todo");
    setLabels([]);
    setLabelInput("");
    setDueDate("");
    setSubtasks([]);
    setSubtaskInput("");
  }

  function handleSubmit() {
    if (!title.trim()) return;
    const todo: Todo = {
      id: editTodo?.id ?? crypto.randomUUID(),
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      column,
      subtasks,
      labels,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      createdAt: editTodo?.createdAt ?? new Date().toISOString(),
    };
    dispatch({ type: editTodo ? "UPDATE_TODO" : "ADD_TODO", payload: todo });
    if (isWalletConnected) {
      if (editTodo) {
        updateTodo(todo, () => {});
      } else {
        createTodo(todo, () => {});
      }
    }
    setOpen(false);
    if (!editTodo) {
      resetForm();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            size="sm"
            disabled={saving}
            className="border-purple-500/30 bg-purple-500/10 text-[11px] font-semibold uppercase tracking-[0.15em] text-purple-300 shadow-[0_0_12px_oklch(0.65_0.25_285/0.08)] backdrop-blur-sm transition-all duration-200 hover:border-purple-500/50 hover:bg-purple-500/20 hover:shadow-[0_0_20px_oklch(0.65_0.25_285/0.15)] disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
            ) : (
              <Plus className="mr-1.5 h-3 w-3" />
            )}
            {saving ? "Confirming..." : "New Task"}
          </Button>
        }
      />
      <DialogContent className="w-full max-w-lg max-sm:max-w-[calc(100vw-1.5rem)] border-zinc-800/60 bg-zinc-950/90 shadow-[0_0_40px_oklch(0_0_0/0.5)] backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-purple-400">
            <span className="inline-block h-1.5 w-1.5 rounded-[1px] bg-purple-500 shadow-[0_0_6px_oklch(0.65_0.25_285/0.5)]" />
            {editTodo ? "Edit" : "New"} Task
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label className="text-[10px] uppercase tracking-[0.15em] text-zinc-600">
              Title
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="task title"
              className="border-zinc-700/50 bg-zinc-900/60 text-[13px] text-zinc-200 backdrop-blur-sm transition-all duration-150 placeholder:text-zinc-700 focus:border-purple-500/40 focus:shadow-[0_0_12px_oklch(0.65_0.25_285/0.06)]"
            />
          </div>
          <div className="grid gap-1">
            <Label className="text-[10px] uppercase tracking-[0.15em] text-zinc-600">
              Description
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="optional description"
              rows={2}
              className="border-zinc-700/50 bg-zinc-900/60 text-[13px] text-zinc-200 backdrop-blur-sm placeholder:text-zinc-700 focus:border-purple-500/40"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-1">
              <Label className="text-[10px] uppercase tracking-[0.15em] text-zinc-600">
                Priority
              </Label>
              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as Priority)}
              >
                <SelectTrigger className="border-zinc-700/50 bg-zinc-900/60 text-[13px] text-zinc-200 backdrop-blur-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-zinc-700/50 bg-zinc-950 text-zinc-200">
                  {PRIORITY.map((p) => (
                    <SelectItem
                      key={p.value}
                      value={p.value}
                      className="text-[13px]"
                    >
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1">
              <Label className="text-[10px] uppercase tracking-[0.15em] text-zinc-600">
                Column
              </Label>
              <Select
                value={column}
                onValueChange={(v) => setColumn(v as KanbanColumn)}
              >
                <SelectTrigger className="border-zinc-700/50 bg-zinc-900/60 text-[13px] text-zinc-200 backdrop-blur-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-zinc-700/50 bg-zinc-950 text-zinc-200">
                  {COLUMNS.map((c) => (
                    <SelectItem key={c.id} value={c.id} className="text-[13px]">
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-1">
            <Label className="text-[10px] uppercase tracking-[0.15em] text-zinc-600">
              Labels
            </Label>
            <div className="flex gap-1">
              <Input
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addLabel())
                }
                placeholder="add label"
                className="h-7 border-zinc-700/50 bg-zinc-900/60 text-[13px] text-zinc-200 placeholder:text-zinc-700"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLabel}
                className="h-7 border-zinc-700/50 text-[11px] text-zinc-500"
              >
                Add
              </Button>
            </div>
            {labels.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {labels.map((l) => (
                  <span
                    key={l}
                    className="inline-flex items-center gap-1.5 border border-zinc-700/40 bg-zinc-800/60 px-1.5 py-0.5 text-[10px] text-zinc-500"
                  >
                    {l}
                    <button
                      aria-label={`Remove label: ${l}`}
                      onClick={() => setLabels(labels.filter((x) => x !== l))}
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-1">
              <Label className="text-[10px] uppercase tracking-[0.15em] text-zinc-600">
                Due Date
              </Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="h-7 border-zinc-700/50 bg-zinc-900/60 text-[13px] text-zinc-200"
              />
            </div>
          </div>
          <div className="grid gap-1">
            <Label className="text-[10px] uppercase tracking-[0.15em] text-zinc-600">
              Subtasks
            </Label>
            <div className="flex gap-1">
              <Input
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addSubtask())
                }
                placeholder="add subtask"
                className="h-7 border-zinc-700/50 bg-zinc-900/60 text-[13px] text-zinc-200 placeholder:text-zinc-700"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSubtask}
                className="h-7 border-zinc-700/50 text-[11px] text-zinc-500"
              >
                Add
              </Button>
            </div>
            {subtasks.length > 0 && (
              <div className="space-y-1">
                {subtasks.map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center gap-2 text-[13px] text-zinc-400"
                  >
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() =>
                        setSubtasks(
                          subtasks.map((s) =>
                            s.id === st.id
                              ? { ...s, completed: !s.completed }
                              : s,
                          ),
                        )
                      }
                      className="h-3 w-3 accent-purple-500"
                    />
                    <span
                      className={
                        st.completed ? "text-zinc-700 line-through" : ""
                      }
                    >
                      {st.title}
                    </span>
                    <button
                      aria-label={`Remove subtask: ${st.title}`}
                      onClick={() =>
                        setSubtasks(subtasks.filter((s) => s.id !== st.id))
                      }
                      className="ml-auto text-zinc-700 hover:text-red-400"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button
            onClick={handleSubmit}
            disabled={saving}
            size="sm"
            className="mt-1 border-purple-500/30 bg-purple-500/15 text-[11px] font-semibold uppercase tracking-[0.2em] text-purple-300 shadow-[0_0_12px_oklch(0.65_0.25_285/0.08)] transition-all duration-200 hover:border-purple-500/50 hover:bg-purple-500/25 hover:shadow-[0_0_20px_oklch(0.65_0.25_285/0.15)] disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                Confirming...
              </>
            ) : (
              <>{editTodo ? "Update" : "Create"} Task</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
