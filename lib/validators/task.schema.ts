import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  projectId: z.string().min(1, "Project is required"),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["todo", "in_progress", "done"]),
  dueDate: z.string().min(1, "Due date is required"),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
