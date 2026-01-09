import { NextResponse } from "next/server"
import db from "@/lib/db.json"

export async function GET() {
  return NextResponse.json(db.tasks)
}
