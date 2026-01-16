"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Plus,
  Paperclip,
  Calendar,
  Flag,
  Trash2,
  ChevronRight,
  Pencil,
  X,
  Send,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { getTask, updateTask, deleteTask } from "@/lib/tasks"
import { getProjects, Project } from "@/lib/project"
import { cn } from "@/lib/utils"

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

interface Attachment {
  id: string
  name: string
  size?: string
  url?: string
  createdAt: string
}

interface Task {
  id: string
  value: string
  title: string
  description?: string
  status: "todo" | "in_progress" | "done"
  priority: "low" | "medium" | "high"
  dueDate?: string
  projectId: string
  createdAt?: string
  subtasks: Subtask[]
  comments: Comment[]
  attachments: Attachment[]
}

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const taskId = params.id as string
  const queryClient = useQueryClient()

  const [commentText, setCommentText] = useState("")
  const [isAddingSubtask, setIsAddingSubtask] = useState(false)
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("")
  const [isEditingDesc, setIsEditingDesc] = useState(false)
  const [descDraft, setDescDraft] = useState("")

  const { data: task, isLoading, error } = useQuery<Task>({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const data = await getTask(taskId)
      return data as Task
    },
  })

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: getProjects,
  })

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<Task>) => updateTask(taskId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", taskId] })
      setCommentText("")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteTask(taskId),
    onSuccess: () => {
      router.push("/tasks")
    },
  })

  const handleFieldChange = (field: keyof Task, value: unknown) => {
    updateMutation.mutate({ [field]: value })
  }

  const saveNewSubtask = () => {
    if (!newSubtaskTitle.trim() || !task) {
      setIsAddingSubtask(false)
      return
    }
    const newSub: Subtask = {
      id: crypto.randomUUID(),
      title: newSubtaskTitle,
      completed: false,
    }
    handleFieldChange("subtasks", [...(task.subtasks || []), newSub])
    setNewSubtaskTitle("")
    setIsAddingSubtask(false)
  }

  const startEditingDesc = () => {
    setDescDraft(task?.description || "")
    setIsEditingDesc(true)
  }

  const saveDescription = () => {
    handleFieldChange("description", descDraft)
    setIsEditingDesc(false)
  }

  if (isLoading) {
    return (
      <div className="p-10 max-w-5xl mx-auto">
        <Skeleton className="h-150 w-full rounded-xl" />
      </div>
    )
  }

  if (error || !task) {
    return <div className="p-10 text-center text-red-500">Task not found</div>
  }

  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0
  const totalSubtasks = task.subtasks?.length || 0
  const creationDateDisplay = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString()
    : "Just now"

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 pb-32">
      <div className="mx-auto space-y-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span
              className="hover:text-slate-800 cursor-pointer"
              onClick={() => router.push("/tasks")}
            >
              Tasks
            </span>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-slate-900">
              Task #{taskId.substring(0, 4)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 gap-2"
              onClick={() => router.push(`/tasks/${taskId}/edit`)}
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-100 hover:text-red-700 gap-2"
              onClick={() => {
                if (confirm("Are you sure you want to delete this task?")) {
                  deleteMutation.mutate()
                }
              }}
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Button>
          </div>
        </div>

        <Card className="p-8 shadow-sm border border-slate-200 rounded-xl group/card">
          <div className="mb-4">
            <input
              className="text-3xl font-bold text-slate-900 w-full bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-slate-300 p-0"
              defaultValue={task.title}
              onBlur={(e) => handleFieldChange("title", e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 mb-8">
            <Badge className="bg-orange-100 hover:bg-orange-200 text-orange-700 border-none rounded-md px-2.5 py-0.5 font-medium text-xs">
              {task.status === "in_progress"
                ? "In Progress"
                : task.status === "todo"
                ? "To Do"
                : "Done"}
            </Badge>
            <span className="text-sm text-slate-400">
              Created {creationDateDisplay}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-900 text-sm">
                Description
              </h4>
              {!isEditingDesc && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={startEditingDesc}
                  className="h-6 text-xs text-slate-400 hover:text-slate-900 px-2 gap-1.5"
                >
                  <Pencil className="h-3 w-3" /> Edit
                </Button>
              )}
            </div>

            {isEditingDesc ? (
              <div className="animate-in fade-in duration-200">
                <Textarea
                  autoFocus
                  className="min-h-37.5 w-full text-slate-600 text-[15px] leading-7 bg-white border-slate-300 focus-visible:ring-1 focus-visible:ring-slate-400 resize-none rounded-md"
                  value={descDraft}
                  onChange={(e) => setDescDraft(e.target.value)}
                  placeholder="Add a detailed description..."
                />
                <div className="flex items-center gap-2 mt-3">
                  <Button
                    size="sm"
                    onClick={saveDescription}
                    className="bg-slate-900 text-white hover:bg-slate-800 h-8 text-xs"
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditingDesc(false)}
                    className="h-8 text-xs text-slate-500"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className="min-h-15 text-slate-600 text-[15px] leading-7 whitespace-pre-line cursor-pointer hover:text-slate-900 transition-colors"
                onClick={startEditingDesc}
              >
                {task.description || (
                  <span className="text-slate-400 italic">
                    No description. Click to add.
                  </span>
                )}
              </div>
            )}
          </div>
        </Card>

        <Card className="p-8 shadow-sm border border-slate-200 rounded-xl">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">Subtasks</h3>
            <p className="text-sm text-slate-500 mt-1">
              {completedSubtasks} of {totalSubtasks} completed
            </p>
          </div>

          <div className="space-y-3">
            {task.subtasks?.map((sub) => (
              <div key={sub.id} className="group flex items-start gap-3 py-1">
                <Checkbox
                  checked={sub.completed}
                  className="w-5 h-5 mt-0.5 rounded border-slate-300 data-[state=checked]:bg-black data-[state=checked]:border-black"
                  onCheckedChange={() => {
                    const updated = task.subtasks.map((s) =>
                      s.id === sub.id ? { ...s, completed: !s.completed } : s
                    )
                    handleFieldChange("subtasks", updated)
                  }}
                />
                <input
                  className={cn(
                    "flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-[15px] p-0 leading-tight transition-all",
                    sub.completed
                      ? "text-slate-400 line-through decoration-slate-300"
                      : "text-slate-700"
                  )}
                  defaultValue={sub.title}
                  onBlur={(e) => {
                    const updated = task.subtasks.map((s) =>
                      s.id === sub.id ? { ...s, title: e.target.value } : s
                    )
                    handleFieldChange("subtasks", updated)
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const updated = task.subtasks.filter((s) => s.id !== sub.id)
                    handleFieldChange("subtasks", updated)
                  }}
                  className="h-6 w-6 text-slate-300 opacity-0 group-hover:opacity-100 hover:text-red-600 hover:bg-red-50 transition-all -mt-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}

            {isAddingSubtask ? (
              <div className="flex items-center gap-3 pt-4 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="w-5" />
                <div className="flex-1 flex gap-2">
                  <Input
                    autoFocus
                    placeholder="Enter subtask name..."
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    className="h-9 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveNewSubtask()
                      if (e.key === "Escape") setIsAddingSubtask(false)
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={saveNewSubtask}
                    className="h-9 bg-slate-900 text-white hover:bg-slate-800"
                  >
                    Ok
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsAddingSubtask(false)}
                    className="h-9"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="pt-6 flex justify-center">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsAddingSubtask(true)
                    setNewSubtaskTitle("")
                  }}
                  className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 gap-2 font-normal"
                >
                  <Plus className="h-4 w-4" /> Add subtask
                </Button>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-8 shadow-sm border border-slate-200 rounded-xl">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              Comments ({task.comments?.length || 0})
            </h3>
          </div>
          <div className="space-y-8 mb-8">
            {task.comments?.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <Avatar className="h-9 w-9 mt-1">
                  <AvatarFallback className="bg-purple-600 text-white font-medium text-xs">
                    {comment.author.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {comment.author}
                    </span>
                    <span className="text-xs text-slate-400">2 hours ago</span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <Textarea
              placeholder="Write a comment..."
              className="min-h-25 border-slate-200 rounded-lg bg-white focus:ring-1 focus:ring-slate-300 resize-none"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  const newComm: Comment = {
                    id: crypto.randomUUID(),
                    author: "You",
                    content: commentText,
                    createdAt: new Date().toISOString(),
                  }
                  handleFieldChange("comments", [
                    ...(task.comments || []),
                    newComm,
                  ])
                }}
                disabled={!commentText.trim()}
                className="bg-slate-900 text-white px-6 py-2 h-10 text-sm hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2"
              >
                <Send className="h-4 w-4" /> Post Comment
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-8 shadow-sm border border-slate-200 rounded-xl">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Status
              </label>
              <Select
                defaultValue={task.status}
                onValueChange={(val: unknown) => handleFieldChange("status", val)}
              >
                <SelectTrigger className="w-full h-12 bg-white border-slate-200 shadow-sm focus:ring-1 focus:ring-slate-300 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Priority
              </label>
              <Select
                defaultValue={task.priority}
                onValueChange={(val: unknown) =>
                  handleFieldChange("priority", val)
                }
              >
                <SelectTrigger
                  className={cn(
                    "w-full h-12 border-slate-200 shadow-sm text-sm",
                    task.priority === "high" && "bg-red-50 border-red-100 text-red-700"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {task.priority === "high" && (
                      <Flag className="h-4 w-4 fill-current" />
                    )}
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Due Date
              </label>
              <div className="relative">
                <Input
                  type="date"
                  className="w-full h-12 pl-10 cursor-pointer shadow-sm border-slate-200 text-sm"
                  defaultValue={task.dueDate?.split("T")[0]}
                  onChange={(e) => handleFieldChange("dueDate", e.target.value)}
                />
                <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Project
              </label>
              <div
                onClick={() => {
                  if (task.projectId) router.push(`/projects/${task.projectId}`)
                }}
                className="w-full h-12 bg-white border border-slate-200 rounded-md shadow-sm flex items-center px-3 gap-3 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all group"
              >
                <div className="h-2 w-2 rounded-full bg-blue-600 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-slate-700">
                  {projects.find((p) => p.id === task.projectId)?.name ||
                    "No Project Assigned"}
                </span>
                <ChevronRight className="h-4 w-4 text-slate-300 ml-auto group-hover:text-blue-500" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Attachments
              </label>
              <div className="space-y-2">
                {task.attachments?.map((file) => (
                  <div
                    key={file.id}
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm flex items-center gap-3 text-slate-700 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <Paperclip className="h-4 w-4 text-slate-400" />
                    <span className="font-medium">{file.name}</span>
                  </div>
                ))}
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-slate-700 hover:text-slate-900 border border-transparent hover:border-slate-200 rounded-lg transition-all mt-2">
                <Plus className="h-4 w-4" /> Add attachment
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}