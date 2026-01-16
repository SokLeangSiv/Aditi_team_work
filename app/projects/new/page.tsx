"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"

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

import { projectSchema, type ProjectFormValues } from "@/lib/validators/project.schema"
import { createProject } from "@/lib/project"

export default function NewProjectPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      color: "bg-blue-500",
      status: "active",
      dueDate: new Date().toISOString().split('T')[0],
    },
  })

  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      router.push("/projects")
    },
  })

  function onSubmit(values: ProjectFormValues) {
    mutation.mutate(values)
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-sm border mt-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Create New Project</h1>
        <p className="text-muted-foreground">Define a new workspace for your tasks.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. Website Redesign" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Color</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="bg-pink-500">Pink</SelectItem>
                      <SelectItem value="bg-blue-500">Blue</SelectItem>
                      <SelectItem value="bg-emerald-500">Emerald</SelectItem>
                      <SelectItem value="bg-amber-500">Amber</SelectItem>
                      <SelectItem value="bg-violet-500">Violet</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Deadline</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Goal</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="What is this project about?"
                    className="min-h-32"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col sm:flex-row gap-3 pt-8 mt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-11 border-2"
              onClick={() => router.back()}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="flex-1 h-11 bg-primary"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Launching Project..." : "Create Project"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}