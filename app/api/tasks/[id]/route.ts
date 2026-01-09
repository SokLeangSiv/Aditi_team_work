import { NextResponse } from "next/server"
import db from "@/lib/db.json"

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const task = db.tasks.find(
    t => t.id === params.id
  )

  if (!task) {
    return NextResponse.json(
      { message: "Task not found" },
      { status: 404 }
    )
  }

  return NextResponse.json(task)
}


export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const updates = await req.json()

  const index = db.tasks.findIndex(
    t => t.id === params.id
  )

  if (index === -1) {
    return NextResponse.json(
      { message: "Task not found" },
      { status: 404 }
    )
  }

  db.tasks[index] = {
    ...db.tasks[index],
    ...updates,
  }

  return NextResponse.json(db.tasks[index])
}
