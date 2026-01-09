import { NextResponse } from "next/server"
import db from "@/lib/db.json"

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const tasks = db.tasks.filter(
    task => task.projectId === params.id
  )

  return NextResponse.json(tasks)
}
