<<<<<<< HEAD
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001",
});
=======
const API_URL = "http://localhost:3001"

/* ================= PROJECTS ================= */

export const getProjects = async () => {
  const res = await fetch(`${API_URL}/projects`)
  if (!res.ok) throw new Error("Failed to fetch projects")
  return res.json()
}

export const getProject = async (id: string) => {
  const res = await fetch(`${API_URL}/projects/${id}`)
  if (!res.ok) throw new Error("Failed to fetch project")
  return res.json()
}

/* ================= TASKS ================= */

export const getTasks = async () => {
  const res = await fetch(`${API_URL}/tasks`)
  if (!res.ok) throw new Error("Failed to fetch tasks")
  return res.json()
}

export const getTask = async (id: string) => {
  const res = await fetch(`${API_URL}/tasks/${id}`)
  if (!res.ok) throw new Error("Failed to fetch task")
  return res.json()
}

export const getTasksByProject = async (projectId: string) => {
  const res = await fetch(
    `${API_URL}/tasks?projectId=${projectId}`
  )
  if (!res.ok) throw new Error("Failed to fetch project tasks")
  return res.json()
}
>>>>>>> 1546449ac4c5546be57595636044a52ec3955889
