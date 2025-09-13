import { z } from "zod";

export const ProfilValidationSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(100, "Email must be 100 characters or less"),
  password: z.string().min(6, "au moins six lettres"),
  name: z.string().min(2, "au moins six lettres"),
  confirmPassword: z.string().min(6, "au moins six lettres"),
});

export type ProfilValidationFormData = z.infer<typeof ProfilValidationSchema>;
