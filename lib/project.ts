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

export const getProject = async (id: string): Promise<Project> => {
    const { data } = await api.get<Project>(`/projects/${id}`);
    return data;
};



// export const createProject = async (project: Project): Promise<Project> => {
//     const { data } = await api.post<Project>("/projects", project);
//     return data;
// };
