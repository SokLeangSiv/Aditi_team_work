"use client"

import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

import { getTask } from "@/lib/api"

/* ================= TYPES ================= */

interface Subtask {
  id: string
  title: string
  completed: boolean
}

interface Comment {
  id: string
  author: string
  content: string
  createdAt: string
}

interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "done"
  priority: "low" | "medium" | "high"
  dueDate: string
  subtasks: Subtask[]
  comments: Comment[]
}

/* ================= PAGE ================= */

export default function TaskDetailPage() {
  const params = useParams()
  const taskId = params.id as string

  const {
    data: task,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTask(taskId),
  })

  /* ---------- Loading ---------- */
  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-10 w-2/3 mb-4" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  /* ---------- Error ---------- */
  if (error || !task) {
    return (
      <p className="p-6 text-sm text-red-500">
        Failed to load task.
      </p>
    )
  }

  const statusLabel =
    task.status === "done"
      ? "Done"
      : task.status === "in-progress"
      ? "In Progress"
      : "To Do"

  return (
    <div className="p-6">
      <Card className="p-6">
        {/* ================= HEADER ================= */}
        <div className="mb-4 flex items-center gap-3">
          <h1 className="text-2xl font-semibold">{task.title}</h1>
          <Badge variant="secondary">{statusLabel}</Badge>
        </div>

        <p className="mb-6 text-sm text-muted-foreground">
          {task.description}
        </p>

        <Separator className="my-6" />

        {/* ================= SUBTASKS ================= */}
        <section className="mb-6">
          <h3 className="mb-3 font-medium">Subtasks</h3>

          <div className="space-y-3">
            {task.subtasks.map((subtask) => (
              <div
                key={subtask.id}
                className="flex items-center gap-2"
              >
                <Checkbox checked={subtask.completed} />
                <span className="text-sm">
                  {subtask.title}
                </span>
              </div>
            ))}
          </div>

          <Button variant="ghost" className="mt-3 text-sm">
            + Add subtask
          </Button>
        </section>

        <Separator className="my-6" />

        {/* ================= COMMENTS ================= */}
        <section className="mb-6">
          <h3 className="mb-3 font-medium">Comments</h3>

          {task.comments.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No comments yet.
            </p>
          )}

          {task.comments.map((comment) => (
            <div
              key={comment.id}
              className="mb-4 flex gap-3"
            >
              <Avatar>
                <AvatarFallback>
                  {comment.author.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div>
                <p className="text-sm font-medium">
                  {comment.author}
                </p>
                <p className="text-sm text-muted-foreground">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}

          <Textarea placeholder="Write a comment..." />
          <Button className="mt-2">Post Comment</Button>
        </section>

        <Separator className="my-6" />

        {/* ================= META ================= */}
        <section className="grid grid-cols-2 gap-4 text-sm">
          <Meta label="Status" value={statusLabel} />
          <Meta
            label="Priority"
            value={task.priority}
            highlight={task.priority === "high"}
          />
          <Meta
            label="Due date"
            value={new Date(task.dueDate).toDateString()}
          />
        </section>
      </Card>
    </div>
  )
}

/* ================= META COMPONENT ================= */

function Meta({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={`font-medium ${
          highlight ? "text-red-500" : ""
        }`}
      >
        {value}
      </p>
    </div>
  )
}
