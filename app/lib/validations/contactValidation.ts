import { z } from "zod";

export const ContactValidationSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(100, "Email must be 100 characters or less"),
  name: z
    .string()
    .min(1, "au moins 1 lettre")
    .max(100, "Email must be 100 characters or less"),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(15, { message: "Phone number cannot exceed 15 digits" })
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, {
      message: "Invalid phone number format",
    }),
  message: z
    .string()
    .min(0, "au moins 1 lettre")
    .max(1000, "Email must be 100 characters or less")
    .optional(),
});

export type ContactValidationFormData = z.infer<typeof ContactValidationSchema>;
