import { NextResponse } from "next/server"
import db from "@/lib/db.json"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { subtaskId, completed } = await req.json()

  const task = db.tasks.find(
    t => t.id === params.id
  )

  if (!task) {
    return NextResponse.json(
      { message: "Task not found" },
      { status: 404 }
    )
  }

  const subtask = task.subtasks.find(
    s => s.id === subtaskId
  )

  if (!subtask) {
    return NextResponse.json(
      { message: "Subtask not found" },
      { status: 404 }
    )
  }

  subtask.completed = completed

  return NextResponse.json(task)
}
