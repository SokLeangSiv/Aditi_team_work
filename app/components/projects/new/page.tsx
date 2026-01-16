"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ChevronLeft, FolderOpenDot, Save, Loader2 } from "lucide-react"

import { createProject, type CreateProjectInput } from "@/lib/project"
import { Card } from "@/components/ui/card" // You already have this

// Tailwind classes for the color picker
const COLOR_OPTIONS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-indigo-500",
  "bg-purple-500",
  "bg-rose-500",
  "bg-amber-500",
]

export default function NewProjectPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState<CreateProjectInput>({
    name: "",
    description: "",
    color: "bg-blue-500",
  })

  const { mutate, isPending } = useMutation({
    mutationFn: createProject,
    onSuccess: (newProject) => {
      // 1. Refresh the project list in the background
      queryClient.invalidateQueries({ queryKey: ["projects"] })

      // 2. Redirect to the new project
      // Ensure your API returns the object with an 'id'
      router.push(`/project/${newProject.id}`)
    },
    onError: (error) => {
      console.error(error)
      alert("Failed to create project. Please check the console for details.")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) return
    mutate(formData)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Navigation */}
      <div className="text-sm text-muted-foreground">
        <Link href="/projects" className="hover:underline flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" />
          Back to Projects
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-semibold">Create New Project</h1>
        <p className="text-muted-foreground mt-1">Start a new workspace.</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Name Input */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Project Name
            </label>
            <input
              id="name"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="e.g. Website Redesign"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium leading-none">
              Description
            </label>
            <textarea
              id="description"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="What is this project about?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Color Picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Icon Color</label>
            <div className="flex flex-wrap gap-3 pt-2">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`
                    h-8 w-8 rounded-full transition-all flex items-center justify-center
                    ${color}
                    ${formData.color === color
                      ? "ring-2 ring-offset-2 ring-black dark:ring-white scale-110"
                      : "opacity-70 hover:opacity-100"
                    }
                  `}
                >
                  {formData.color === color && <FolderOpenDot className="h-4 w-4 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
             <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !formData.name}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Project
                </>
              )}
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
}