"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { CalendarDays, ListChecks, MessageSquareText } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

import SearchInput from "@/app/components/Search_Input"
import { getTasks, updateTask } from "@/lib/tasks"
import { getProjects, type Project } from "@/lib/project"
import { cn } from "@/lib/utils"

type TaskStatus = "todo" | "in_progress" | "done"

export default function TaskBodyPage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  })

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: getProjects,
  })

  const { mutate: toggleTaskStatus } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      updateTask(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
  })

  const projectNameById = useMemo(() =>
    projects.reduce<Record<string, string>>((acc, p) => ({ ...acc, [p.id]: p.name }), {}),
    [projects]
  )

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesTab = activeTab === "all" || task.status === activeTab
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesTab && matchesSearch
    })
  }, [tasks, activeTab, searchQuery])

  const tabTriggerStyle = cn(
    "rounded-md px-4 py-2 text-sm font-medium transition-all border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    "data-[state=active]:bg-zinc-900 data-[state=active]:text-white data-[state=active]:border-zinc-900 shadow-sm"
  )

  return (
    <div className="flex-1 p-6 space-y-6 bg-white min-h-screen">
      <div className="flex items-center justify-between w-auto mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
          <TabsList className="bg-transparent p-0 gap-2 h-auto flex flex-wrap justify-between">
            <TabsTrigger value="all" className={tabTriggerStyle}>All</TabsTrigger>
            <TabsTrigger value="todo" className={tabTriggerStyle}>To Do</TabsTrigger>
            <TabsTrigger value="in_progress" className={tabTriggerStyle}>In Progress</TabsTrigger>
            <TabsTrigger value="done" className={tabTriggerStyle}>Done</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="w-72">
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <div className="p-4 border border-red-200 bg-red-50 text-red-600 rounded-lg text-sm">
          Failed to load tasks. Please try again.
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg bg-slate-50/50">
          <p className="text-sm text-muted-foreground">No tasks found in this category.</p>
        </div>
      ) : (
        <div className="border rounded-xl divide-y bg-white shadow-sm">
          {filteredTasks.map((task) => {
            const isDone = task.status === "done"
            const statusLabel = isDone ? "Done" : task.status === "in_progress" ? "In Progress" : "To Do"

            const badgeClass =
              task.status === "in_progress" ? "bg-orange-100 text-orange-700 hover:bg-orange-200 border-none" :
              task.status === "done" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none" :
              "bg-slate-100 text-slate-600 hover:bg-slate-200 border-none"

            return (
              <div key={task.id} className="group px-4 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={isDone}
                    className="mt-1 data-[state=checked]:bg-black data-[state=checked]:border-black"
                    onCheckedChange={(checked) => {
                      toggleTaskStatus({
                        id: task.id,
                        status: checked ? "done" : "todo"
                      })
                    }}
                  />

                  <Link href={`/tasks/${task.id}`} className="flex flex-1 items-start justify-between gap-4 min-w-0">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={cn(
                          "font-medium truncate transition-all text-slate-900",
                          isDone && "line-through text-slate-400"
                        )}>
                          {task.title}
                        </h3>

                        <Badge variant="secondary" className={cn("font-normal rounded-md px-2 py-0.5", badgeClass)}>
                          {statusLabel}
                        </Badge>
                      </div>

                      {task.description && (
                        <p className="text-sm text-slate-500 truncate max-w-md">
                          {task.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      {projectNameById[task.projectId] && (
                        <Badge variant="secondary" className="hidden lg:block bg-slate-100 text-slate-600 font-normal hover:bg-slate-200 border-none">
                          {projectNameById[task.projectId]}
                        </Badge>
                      )}

                      <div className="hidden md:flex items-center gap-3 text-xs text-slate-400 font-medium">
                        <span className="flex items-center gap-1 hover:text-slate-600 transition-colors">
                          <MessageSquareText className="h-3.5 w-3.5" /> {task.comments?.length ?? 0}
                        </span>
                        <span className="flex items-center gap-1 hover:text-slate-600 transition-colors">
                          <ListChecks className="h-3.5 w-3.5" />
                          {task.subtasks?.filter((s: { completed: boolean }) => s.completed).length ?? 0}/{task.subtasks?.length ?? 0}
                        </span>
                      </div>

                      {task.dueDate && (
                        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <CalendarDays className="h-3.5 w-3.5" />
                          <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      )}

                      <Avatar className="h-7 w-7 border ring-1 ring-slate-100">
                        <AvatarFallback className="text-[10px] bg-indigo-600 text-white font-bold">
                          {task.title.substring(0, 2).toUpperCase()}
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