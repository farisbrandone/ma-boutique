import dbConnect from "@/app/lib/mongodb";
import ProductTrue from "@/models/ProductTrue";

// Connexion à MongoDB (à adapter selon votre configuration)

// Interface pour les paramètres de recherche
interface SearchParams {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  page?: number;
}

// Service de recherche
export const searchProducts = async (params: SearchParams) => {
  await dbConnect();

  const { query, category, minPrice, maxPrice, limit = 10, page = 1 } = params;

  // Construction du filtre
  const filter: any = {};

  // Recherche textuelle sur name, category et description
  if (query) {
    filter.$or = [
      { name: { $regex: query, $options: "i" } },
      { category: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }

  // Filtre par catégorie exacte
  if (category) {
    filter.category = category;
  }

  // Filtre par prix
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = minPrice;
    if (maxPrice !== undefined) filter.price.$lte = maxPrice;
  }

  // Calcul de la pagination
  const skip = (page - 1) * limit;

  try {
    const products = await ProductTrue.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await ProductTrue.countDocuments(filter);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error searching products:", error);
    throw new Error("Failed to search products");
  }
};

// Récupérer toutes les catégories distinctes
export const getCategories = async () => {
  await dbConnect();

  try {
    const categories = await ProductTrue.distinct("category");
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
};
