"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

import { taskSchema, type TaskFormValues } from "@/lib/validators/task.schema"
import { createTask } from "@/lib/tasks"
import { getProjects } from "@/lib/project"

export default function NewTaskPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      projectId: "",
      priority: "medium",
      status: "todo",
      dueDate: new Date().toISOString().split('T')[0], // Default to today
    },
  })

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  })

  const mutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      // Refresh the task list so the new task appears immediately
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      router.push("/tasks")
    },
  })

  function onSubmit(values: TaskFormValues) {
    mutation.mutate(values)
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-sm border mt-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Create New Task</h1>
        <p className="text-muted-foreground">Fill in the details to assign a new task to a project.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Design system update" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Project Selection */}
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Due Date */}
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Priority */}
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Provide context for this task..."
                    className="min-h-25"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

       <div className="flex flex-col sm:flex-row gap-3 pt-8 mt-4">
            {/* Cancel Button - Placed First to appear on the Left */}
            <Button
                type="button"
                variant="outline"
                className="flex-1 h-11 border-2 text-muted-foreground hover:bg-secondary transition-all font-medium"
                onClick={() => router.back()}
            >
                Cancel
            </Button>

            {/* Create Button - Placed Second to appear on the Right */}
            <Button
                type="submit"
                className="flex-1 h-11 bg-primary hover:opacity-90 transition-all font-semibold"
                disabled={mutation.isPending}
            >
                {mutation.isPending ? "Creating Task..." : "Create Task"}
            </Button>
            </div>
        </form>
      </Form>
    </div>
  )
}