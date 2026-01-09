"use client"


import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import SearchInput from "@/app/components/Search_Input"


export default function TaskBodyPage() {
  return (
    <div className="flex-1 p-6 space-y-6">


      {/* Tabs + Search */}
      <div className="flex items-center justify-between">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="todo">To Do</TabsTrigger>
            <TabsTrigger value="progress">In Progress</TabsTrigger>
            <TabsTrigger value="done">Done</TabsTrigger>
          </TabsList>
        </Tabs>

        <SearchInput />
      </div>

      {/* Task List */}
      <div className="border rounded-lg divide-y">
        <TaskItem
          title="Design system updates"
          description="Update color palette and typography"
          status="In Progress"
          project="Product Launch"
          date="Jan 8"
          assignee="JD"
        />

        <TaskItem
          title="API documentation"
          description="Document all REST endpoints"
          status="To Do"
          project="Engineering"
          date="Jan 10"
          assignee="AK"
        />

        <TaskItem
          title="User research analysis"
          description="Compile findings from user interviews"
          status="Done"
          project="Marketing"
          date="Jan 6"
          assignee="SL"
        />

        <TaskItem
          title="Performance optimization"
          description="Improve page load times"
          status="In Progress"
          project="Engineering"
          date="Jan 12"
          assignee="MR"
        />
      </div>
    </div>
  )
}

/* ---------------- Task Item ---------------- */

interface TaskItemProps {
  title: string
  description: string
  status: "To Do" | "In Progress" | "Done"
  project: string
  date: string
  assignee: string
}

function TaskItem({
  title,
  description,
  status,
  project,
  date,
  assignee,
}: TaskItemProps) {
  const statusVariant =
   status === "Done"
    ? "default"
    : status === "In Progress"
    ? "secondary"
    : "outline"


  return (
    <div className="flex items-center justify-between px-4 py-4 hover:bg-muted/40 transition">
      {/* Left */}
      <div className="flex items-start gap-4">
        <Checkbox className="mt-1" />

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{title}</h3>
            <Badge variant={statusVariant}>{status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <Badge variant="outline">{project}</Badge>

        <span className="text-sm text-muted-foreground">
          {date}
        </span>

        <Avatar className="h-8 w-8">
          <AvatarFallback>{assignee}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
