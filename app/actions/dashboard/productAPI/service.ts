import { Product, SalesHistoryItem } from "@/dashboardComponents/types/product";

export const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3000/api";

const categories = ["Électronique", "Mode", "Maison", "Sport", "Beauté"];
const adjectives = ["Premium", "Pro", "Léger", "Durable", "Intelligent"];
const nouns = ["T-Shirt", "Ordinateur", "Canapé", "Sac", "Montre", "Casque"];
const brands = [
  "TechPro",
  "FashionHouse",
  "HomeStyle",
  "SportMaster",
  "BeautyElite",
];

function generateRandomDateAfterCreatedAt(createdAtDate: Date) {
  // Convert created_at date to timestamp
  const createdAtTimestamp = createdAtDate.getTime();

  // Define the upper bound (e.g., current date)
  const now = new Date();
  const nowTimestamp = now.getTime();

  // Generate a random timestamp between createdAtTimestamp and nowTimestamp
  const randomTimestamp =
    createdAtTimestamp + Math.random() * (nowTimestamp - createdAtTimestamp);

  // Convert the random timestamp back to a Date object
  const randomDate = new Date(randomTimestamp);

  return randomDate;
}

const generateMockProducts = (count: number): Product[] => {
  const products: Product[] = [];
  const createdDate = new Date("2023-01-01T10:00:00Z"); // Replace with your actual created_at date
  for (let i = 1; i <= count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];

    products.push({
      _id: i.toString(),
      imageUrl: "https://via.placeholder.com/150",
      name: `${brand} ${adjective} ${noun}`,
      description: `Produit ${category} de haute qualité avec caractéristiques exceptionnelles - modèle ${i}`,
      category: category,
      price: parseFloat((Math.random() * 500 + 20).toFixed(2)),
      sold: Math.floor(Math.random() * 200),
      stock: Math.floor(Math.random() * 100),
      displayHome: Math.random() > 0.5,
      displaySolde: Math.random() > 0.7,
      newProduct: Math.random() > 0.6, // 40% de nouveaux produits
      exploreProduct: Math.random() > 0.4, // 60% de produits à explorer
      discount: Math.random() > 0.8 ? Math.floor(Math.random() * 50) : 0,
      createdAt: generateRandomDateAfterCreatedAt(createdDate).toUTCString(),
      updatedAt: generateRandomDateAfterCreatedAt(createdDate).toUTCString(),
    });
  }

  return products;
};

let mockProducts: Product[] = generateMockProducts(20);

export const fetchProducts2 = async (
  page: number,
  pageSize: number
): Promise<{ products: Product[]; total: number }> => {
  /*  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * pageSize;
      const paginatedProducts = mockProducts.slice(start, start + pageSize);
      resolve({ products: paginatedProducts, total: mockProducts.length });
    }, 500);
  }); */

  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simuler une erreur aléatoire (pour le test)
  if (Math.random() > 0.8) {
    throw new Error("Erreur de chargement des produits");
  }

  const start = (page - 1) * pageSize;
  const paginatedProducts = mockProducts.slice(start, start + pageSize);
  return { products: paginatedProducts, total: mockProducts.length };
};

export const updateProductField2 = async (
  id: string,
  field: string,
  value: any
): Promise<Product> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const product = mockProducts.find((p) => p._id === id);
  if (product) {
    (product as any)[field] = value;
    return { ...product };
  }
  throw new Error("Produit non trouvé");
};

export const fetchProductSalesHistory2 = async (
  productId: number
): Promise<SalesHistoryItem[]> => {
  console.log(productId);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { date: "2023-05-15", quantity: 5, amount: 250 },
        { date: "2023-05-10", quantity: 3, amount: 150 },
      ]);
    }, 500);
  });
};

export const addProduct2 = async (
  product: Omit<Product, "id">
): Promise<Product> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const newProduct = {
    ...product,
    id: Math.max(...mockProducts.map((p) => Number(p._id)), 0) + 1,
    sold: 0,
  };
  mockProducts.unshift(newProduct);
  return newProduct;
};

export const updateProduct2 = async (product: Product): Promise<Product> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const index = mockProducts.findIndex((p) => p._id === product._id);
  if (index !== -1) {
    mockProducts[index] = product;
    return product;
  }
  throw new Error("Produit non trouvé");
};

export const deleteProduct2 = async (id: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  mockProducts = mockProducts.filter((p) => p._id !== id);
};

export const fetchProducts = async (
  page: number,
  pageSize: number,
  filters: {
    name?: string;
    category?: string;
    sortField?: keyof Product;
    sortDirection?: "asc" | "desc";
  } = {},
  screen?: boolean
) => {
  const params = new URLSearchParams({
    screen: screen ? "true" : "false",
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...(filters.name && { name: filters.name }),
    ...(filters.category && { category: filters.category }),
    ...(filters.sortField && { sortField: filters.sortField }),
    ...(filters.sortDirection && { sortDirection: filters.sortDirection }),
  });

  console.log(params);

  console.log({ url: `${API_URL}/admin/productsTrue?${params}` });

  const response = await fetch(`${API_URL}/admin/productsTrue?${params}`);
  if (!response.ok) {
    throw new Error("Erreur de chargement des produits");
  }
  return response.json();
};

export const updateProductField = async (
  id: string,
  field: string,
  value: any
): Promise<Product> => {
  const response = await fetch(`${API_URL}/admin/productsTrue/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ [field]: value }),
  });

  if (!response.ok) {
    throw new Error("Échec de la mise à jour");
  }

  return response.json();
};

export const fetchProductSalesHistory = async (
  productId: string
): Promise<SalesHistoryItem[]> => {
  const response = await fetch(
    `${API_URL}/admin/productsTrue/${productId}/sales`
  );
  if (!response.ok) {
    throw new Error("Erreur de chargement de l'historique des ventes");
  }
  return response.json();
};

export const addProduct = async (formData: FormData): Promise<Product> => {
  const response = await fetch(`${API_URL}/admin/productsTrue`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erreur lors de l'ajout du produit");
  }

  return response.json();
};

export const updateProduct = async (
  id: string,
  formData: FormData
): Promise<Product> => {
  const response = await fetch(`${API_URL}/admin/productsTrue/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Erreur lors de la mise à jour du produit"
    );
  }

  return response.json();
};

export const deleteProduct = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/admin/productsTrue/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la suppression du produit");
  }
};

export const fetchProductsDisplay = async (
  displayHome = false,
  displaySolde = false,
  newProduct = false,
  exploreProduct = false
) => {
  const params = new URLSearchParams({
    displayHome: `${displayHome}`,
    newProduct: `${newProduct}`,
    exploreProduct: `${exploreProduct}`,
    displaySolde: `${displaySolde}`,
  });

  console.log({ url: `${API_URL}/admin/productsDisplay?${params}` });

  const response = await fetch(`${API_URL}/admin/productsDisplay?${params}`);
  if (!response.ok) {
    throw new Error("Erreur de chargement des produits");
  }
  console.log("zozototo");
  return response.json();
};

export const fetchBestSellers = async (): Promise<any> => {
  const response = await fetch(`${API_URL}/admin/bestSellerProduct`);

  if (!response.ok) {
    throw new Error("Erreur de chargement des best-sellers");
  }

  return response.json();
};
