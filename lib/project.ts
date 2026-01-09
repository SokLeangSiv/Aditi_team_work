import { api } from "./api";

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

export const getProjects = async (): Promise<Project[]> => {
    const { data } = await api.get<Project[]>("/projects");
    return data;
};

export const getProjectBySlug = async (slug: string): Promise<Project | null> => {
    const { data } = await api.get<Project[]>("/projects", { params: { slug } });
    return data[0] ?? null;
};

export const createProject = async (project: Project): Promise<Project> => {
    const { data } = await api.post<Project>("/projects", project);
    return data;
};
