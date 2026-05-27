import { z } from "zod";

export const validate = (schema) => (req, _res, next) => {
  req.body = schema.parse(req.body);
  next();
};

export const taskSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  project: z.string(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["todo", "in-progress", "completed"]).optional(),
  labels: z.array(z.string()).optional()
});
