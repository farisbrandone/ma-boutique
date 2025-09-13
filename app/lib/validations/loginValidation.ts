import { z } from "zod";

export const LoginValidationSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(100, "Email must be 100 characters or less"),
  password: z.string().min(6, "au moins six lettres"),
});

export type LoginValidationFormData = z.infer<typeof LoginValidationSchema>;
