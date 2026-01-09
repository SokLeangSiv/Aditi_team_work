import { NextResponse } from "next/server"
import db from "@/lib/db.json"

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const project = db.projects.find(
    p => p.id === params.id
  )

  if (!project) {
    return NextResponse.json(
      { message: "Project not found" },
      { status: 404 }
    )
  }

  return NextResponse.json(project)
}
