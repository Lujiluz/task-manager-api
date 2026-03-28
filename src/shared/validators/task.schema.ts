import z from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

export const updateTaskSchema = createTaskSchema.partial().refine((data) => Object.keys(data).length > 0, { message: "At least one field must be provided" });
