import * as yup from "yup";

export const productSchema = yup.object({
  name: yup.string().required("Le nom est obligatoire"),
  description: yup.string().required("La description est obligatoire"),
  category: yup.string().required("La catégorie est obligatoire"),
  price: yup
    .number()
    .positive("Le prix doit être positif")
    .required("Le prix est obligatoire"),
  stock: yup
    .number()
    .integer("Doit être un entier")
    .min(0, "Le stock ne peut pas être négatif")
    .required(),
  displayHome: yup.boolean().required(),
  displaySolde: yup.boolean().required(),
  discount: yup
    .number()
    .min(0, "La remise ne peut pas être négative")
    .max(100, "La remise ne peut pas dépasser 100%")
    .required(),
  newProduct: yup.boolean().required(),
  exploreProduct: yup.boolean().required(),
});

export type ProductFormValues = yup.InferType<typeof productSchema>;
