"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

import SearchInput from "@/app/components/Search_Input"
import { getTasks } from "@/lib/api"

/* ================= TYPES ================= */

interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "done"
  dueDate: string
  projectId: string
}

/* ================= PAGE ================= */

export default function TaskBodyPage() {
  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  })

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Tabs + Search */}
      <div className="flex items-center justify-between">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="todo">To Do</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="done">Done</TabsTrigger>
          </TabsList>
        </Tabs>

        <SearchInput />
      </div>

      {/* ================= LOADING ================= */}
      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}

      {/* ================= ERROR ================= */}
      {error && (
        <p className="text-sm text-red-500">
          Failed to load tasks.
        </p>
      )}

      {/* ================= TASK LIST ================= */}
      {tasks && (
        <div className="border rounded-lg divide-y">
          {tasks.map((task: Task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  )
}

/* ================= TASK ITEM ================= */

function TaskItem({ task }: { task: Task }) {
  const statusLabel =
    task.status === "done"
      ? "Done"
      : task.status === "in-progress"
      ? "In Progress"
      : "To Do"

  const statusVariant =
    task.status === "done"
      ? "default"
      : task.status === "in-progress"
      ? "secondary"
      : "outline"

  return (
    <Link
      href={`/tasks/${task.id}`}
      className="block hover:bg-muted/40 transition"
    >
      <div className="flex items-center justify-between px-4 py-4">
        {/* Left */}
        <div className="flex items-start gap-4">
          <Checkbox className="mt-1" />

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{task.title}</h3>
              <Badge variant={statusVariant}>{statusLabel}</Badge>
            </div>

            <p className="text-sm text-muted-foreground">
              {task.description}
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {new Date(task.dueDate).toLocaleDateString()}
          </span>

          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {task.title.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </Link>
  )
}
