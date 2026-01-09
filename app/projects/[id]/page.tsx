"use client"

import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

import { getProject, getTasksByProject } from "@/lib/api"

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.id as string

  const { data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProject(projectId),
  })

  const { data: tasks } = useQuery({
    queryKey: ["project-tasks", projectId],
    queryFn: () => getTasksByProject(projectId),
  })

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">{project?.name}</h1>

      <ul className="mt-4 space-y-2">
        {tasks?.map((task: any) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  )
}
