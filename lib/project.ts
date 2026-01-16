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

// 1. Define what the FORM sends (we don't expect ID or Stats from the user)
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

// 2. Update this function to handle the logic
export const createProject = async (input: CreateProjectInput): Promise<Project> => {

    // Generate the missing data here
    const newProject: Project = {
        ...input,
        id: crypto.randomUUID(), // Native browser method to generate ID
        slug: input.name.toLowerCase().replace(/\s+/g, '-'), // "My Project" -> "my-project"
        status: "active",
        tasksTotal: 0,
        tasksCompleted: 0
    };

    const { data } = await api.post<Project>("/projects", newProject);
    return data;
};

