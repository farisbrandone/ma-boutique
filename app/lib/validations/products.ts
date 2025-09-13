import { z } from "zod";

/* export type productType = {
  name: string;
  slug: string;
  category: string;
  image: string;
  price: number;
  brand: number;
  countInStock: number;
  description: string;
}; */

export const ProductSchema = z.object({
  name: z.string().min(1, "au moins une lettre"),
  slug: z.string(),
  category: z.string(),
  image: z.string(),
  price: z.number(),
  brand: z.number(),
  countInStock: z.number(),
  description: z.string(),
});

export type ProductFormData = z.infer<typeof ProductSchema>;
