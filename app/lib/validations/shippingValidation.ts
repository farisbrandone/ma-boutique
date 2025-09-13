import { z } from "zod";

export const ShippingSchema = z.object({
  fullName: z.string().min(1, "au moins une lettre"),
  address: z.string().min(1, "au moins une lettre"),
  city: z.string().min(1, "au moins une lettre"),
  postalCode: z.string().min(1, "au moins une lettre"),
  country: z.string().min(1, "au moins une lettre"),
});

export type ShippingFormData = z.infer<typeof ShippingSchema>;
