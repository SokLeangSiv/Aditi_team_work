import { api } from "./api";

export type Task = {
	id: string;
	title: string;
	description: string;
	projectId: string;
	status: "todo" | "in_progress" | "in-progress" | "done";
	priority?: string;
	dueDate: string;
	tags?: string[];
	subtasks?: Array<{ id: string; title: string; completed: boolean }>;
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
