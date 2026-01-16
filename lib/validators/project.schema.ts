import * as z from "zod"

export const projectSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(5, "Description is too short"),
  color: z.string().min(1, "Color is required"),
  dueDate: z.string().min(1, "Due date is required"),
  status: z.enum(["active", "completed", "archived"]),
})


export type ProjectFormValues = z.infer<typeof projectSchema>