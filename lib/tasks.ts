import { api } from "./api";
import type { TaskFormValues } from "./validators/task.schema";

export type Task = {
  id: string;
  title: string;
  description: string;
  projectId: string;
  status: "todo" | "in_progress" | "in-progress" | "done";
  priority?: string;
  dueDate: string;
  tags?: string[];
  subtasks?: Array<{ id: string; title: string; completed: boolean; }>;
  comments?: Array<{ id: string; author: string; content: string; createdAt: string }>;
};

export const getTasks = async (): Promise<Task[]> => {
  const { data } = await api.get<Task[]>("/tasks");
  return data;
};

export const getTask = async (id: string): Promise<Task> => {
  const { data } = await api.get<Task>(`/tasks/${id}`);
  return data;
};

export const getTasksByProject = async (projectId: string): Promise<Task[]> => {
  const { data } = await api.get<Task[]>("/tasks", { params: { projectId } });
  return data;
};

export const createTask = async (task: TaskFormValues): Promise<Task> => {
  const { data } = await api.post<Task>("/tasks", task);
  return data;
};
export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
  const { data } = await api.patch<Task>(`/tasks/${id}`, updates);
  return data;
};
export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};

