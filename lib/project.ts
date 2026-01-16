import { api } from "./api";
import { ProjectFormValues } from "./validators/project.schema"
export type Project = {
    id: string;
    slug: string;
    name: string;
    description: string;
    color: string;
    status: string;
    tasksTotal: number;
    tasksCompleted: number;
    dueDate?: string;
};

export type CreateProjectInput = {
    name: string;
    description: string;
    color: string;
    dueDate?: string;
}

export const getProjects = async (): Promise<Project[]> => {
    const { data } = await api.get<Project[]>("/projects");
    return data;
};

export const getProject = async (id: string): Promise<Project> => {
    const { data } = await api.get<Project>(`/projects/${id}`);
    return data;
};


export async function createProject(values: ProjectFormValues) {
  const newProject = {
    ...values,
    id: Math.random().toString(36).substr(2, 9),
    slug: values.name.toLowerCase().replace(/ /g, "-"),
    tasksTotal: 0,
    tasksCompleted: 0,
  }

  const response = await fetch("http://localhost:3001/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newProject),
  })

  if (!response.ok) throw new Error("Failed to create project")

  return response.json()
}