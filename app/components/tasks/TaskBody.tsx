"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { CalendarDays, ListChecks, MessageSquareText } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

import SearchInput from "@/app/components/Search_Input"
import { getTasks } from "@/lib/tasks"
import { getProjects, type Project } from "@/lib/project"

export default function TaskBodyPage() {
  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  })

  const [checkedById, setCheckedById] = useState<Record<string, boolean>>({})

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: getProjects,
  })

  const projectNameById = projects.reduce<Record<string, string>>((acc, project) => {
    acc[project.id] = project.name
    return acc
  }, {})

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="todo">To Do</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="done">Done</TabsTrigger>
          </TabsList>
        </Tabs>

        <SearchInput />
      </div>

      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500">
          Failed to load tasks.
        </p>
      )}

      {!isLoading && tasks.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No tasks found.
        </p>
      )}

      {tasks.length > 0 && (
        <div className="border rounded-lg divide-y">
          {tasks.map((task) => {
            const isChecked = checkedById[task.id] ?? task.status === "done"

            const statusLabel =
              isChecked
                ? "Done"
                : task.status === "in_progress" || task.status === "in-progress"
                ? "In Progress"
                : "To Do"

            const badgeVariant =
              isChecked
                ? "default"
                : task.status === "in_progress" || task.status === "in-progress"
                ? "secondary"
                : "outline"

            const commentCount = task.comments?.length ?? 0
            const subtasksTotal = task.subtasks?.length ?? 0
            const subtasksDone = task.subtasks?.filter((s) => s.completed).length ?? 0
            const projectName = projectNameById[task.projectId] ?? ""

            return (
              <div key={task.id} className="px-4 py-4 hover:bg-muted/40 transition">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={isChecked}
                    className="mt-1"
                    onCheckedChange={(checked) => {
                      setCheckedById((prev) => ({
                        ...prev,
                        [task.id]: checked === true,
                      }))
                    }}
                  />

                  <Link
                    href={`/tasks/${task.id}`}
                    className="flex flex-1 items-start justify-between gap-4 min-w-0"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3
                          className={`font-medium truncate ${
                            isChecked
                              ? "line-through text-muted-foreground"
                              : ""
                          }`}
                        >
                          {task.title}
                        </h3>

                        <Badge
                          variant={badgeVariant}
                          className={
                            isChecked
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300"
                              : undefined
                          }
                        >
                          {statusLabel}
                        </Badge>
                      </div>

                      {task.description && (
                        <p className="text-sm text-muted-foreground truncate">
                          {task.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {projectName && (
                        <Badge variant="secondary" className="font-normal">
                          {projectName}
                        </Badge>
                      )}

                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MessageSquareText className="h-4 w-4" />
                        <span>{commentCount}</span>
                      </div>

                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <ListChecks className="h-4 w-4" />
                        <span>
                          {subtasksDone}/{subtasksTotal}
                        </span>
                      </div>

                      {task.dueDate && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <CalendarDays className="h-4 w-4" />
                          <span>
                            {new Date(task.dueDate).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      )}

                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-purple-600 text-white">
                          {task.title
                            .split(" ")
                            .slice(0, 2)
                            .map((w) => w[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
