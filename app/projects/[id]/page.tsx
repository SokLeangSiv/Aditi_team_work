"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { FolderOpenDot } from "lucide-react"

import { getProject } from "@/lib/project"
import { getTasksByProject, type Task } from "@/lib/tasks"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const STATUS_LABELS: Record<string, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  "in-progress": "In Progress",
  done: "Done",
}

function statusLabel(status: string) {
  return STATUS_LABELS[status] ?? "To Do"
}

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.id as string

  const [checkedById, setCheckedById] = useState<Record<string, boolean>>({})

  const { data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProject(projectId),
    enabled: Boolean(projectId),
  })

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["project-tasks", projectId],
    queryFn: () => getTasksByProject(projectId),
    enabled: Boolean(projectId),
  })

  const isDone = (task: Task) => checkedById[task.id] ?? task.status === "done"

  const effectiveStatus = (task: Task) => {
    if (isDone(task)) return "done"
    if (task.status === "done") return "todo"
    return task.status
  }

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => isDone(task)).length
  const inProgressTasks = tasks.filter((task) => {
    const s = effectiveStatus(task)
    return s === "in_progress" || s === "in-progress"
  }).length
  const todoTasks = tasks.filter((task) => effectiveStatus(task) === "todo").length

  const activeTasks = tasks.filter((task) => !isDone(task))
  const completedTaskList = tasks.filter((task) => isDone(task))

  const teamMembers = Array.from(
    new Set(
      tasks
        .flatMap((task) => task.comments ?? [])
        .map((comment) => comment.author)
    )
  )

  return (
    <div className="p-6 space-y-6">
      <div className="text-sm text-muted-foreground">
        <Link href="/projects" className="hover:underline">
          Projects
        </Link>
        <span className="px-2">›</span>
        <span className="text-foreground">{project?.name}</span>
      </div>

      <div className="flex items-start gap-4">
        <div
          className={`h-12 w-12 rounded-xl flex items-center justify-center ${
            project?.color ?? "bg-muted"
          }`}
        >
          <FolderOpenDot className="h-6 w-6 text-white" />
        </div>

        <div>
          <h1 className="text-3xl font-semibold">{project?.name}</h1>
          <p className="text-muted-foreground mt-1 max-w-3xl">
            {project?.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-3xl font-semibold">{totalTasks}</div>
          <div className="text-sm text-muted-foreground">Total Tasks</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="text-3xl font-semibold text-emerald-600">
            {completedTasks}
          </div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="text-3xl font-semibold text-amber-600">
            {inProgressTasks}
          </div>
          <div className="text-sm text-muted-foreground">In Progress</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="text-3xl font-semibold">{todoTasks}</div>
          <div className="text-sm text-muted-foreground">To Do</div>
        </Card>
      </div>

      <Card className="p-4">
        <Tabs defaultValue="all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-base font-medium">Tasks</div>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all">
            {isLoading ? (
              <div className="text-sm text-muted-foreground">Loading…</div>
            ) : tasks.length === 0 ? (
              <div className="text-sm text-muted-foreground">No tasks found.</div>
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 rounded-lg border px-3 py-2"
                  >
                    <Checkbox
                      checked={isDone(task)}
                      onCheckedChange={(checked) => {
                        setCheckedById((prev) => ({
                          ...prev,
                          [task.id]: checked === true,
                        }))
                      }}
                    />

                    <div className="flex-1 truncate">
                      <div
                        className={`text-sm font-medium ${
                          isDone(task)
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        {task.title}
                      </div>
                    </div>

                    <Badge
                      variant="secondary"
                      className={
                        isDone(task)
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300"
                          : undefined
                      }
                    >
                      {statusLabel(effectiveStatus(task))}
                    </Badge>

                    {task.dueDate && (
                      <div className="text-sm text-muted-foreground">
                        {new Date(task.dueDate).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    )}

                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-purple-600 text-white">
                        {(task.comments?.[0]?.author ?? "")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="active">
            <div className="space-y-2">
              {activeTasks.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No active tasks.
                </div>
              ) : (
                activeTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 rounded-lg border px-3 py-2"
                  >
                    <Checkbox
                      checked={isDone(task)}
                      onCheckedChange={(checked) => {
                        setCheckedById((prev) => ({
                          ...prev,
                          [task.id]: checked === true,
                        }))
                      }}
                    />
                    <div className="flex-1 truncate">
                      <div className="text-sm font-medium">{task.title}</div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        isDone(task)
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300"
                          : undefined
                      }
                    >
                      {statusLabel(effectiveStatus(task))}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="space-y-2">
              {completedTaskList.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No completed tasks.
                </div>
              ) : (
                completedTaskList.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 rounded-lg border px-3 py-2"
                  >
                    <Checkbox
                      checked={isDone(task)}
                      onCheckedChange={(checked) => {
                        setCheckedById((prev) => ({
                          ...prev,
                          [task.id]: checked === true,
                        }))
                      }}
                    />
                    <div className="flex-1 truncate">
                      <div className="text-sm font-medium line-through text-muted-foreground">
                        {task.title}
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300"
                    >
                      Done
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {teamMembers.length > 0 && (
        <Card className="p-4">
          <div className="text-base font-medium">Team Members</div>
          <div className="text-sm text-muted-foreground mb-4">
            {teamMembers.length} members
          </div>

          <div className="space-y-3">
            {teamMembers.map((name) => (
              <div key={name} className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm font-medium">{name}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
