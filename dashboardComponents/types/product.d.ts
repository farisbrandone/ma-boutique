export interface Product {
  _id: string;
  imageUrl: string;
  name: string;
  description: string;
  category: string;
  price: number;
  sold: number;
  stock: number;
  displayHome: boolean;
  displaySolde: boolean;
  newProduct: boolean; // Nouveau champ
  exploreProduct: boolean; // Nouveau champ
  discount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SalesHistoryItem {
  date: string;
  quantity: number;
  amount: number;
}

export interface SalesSummary {
  totalSold: number;
  revenue: number;
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export enum categorieProduct {
  vf = "vêtements Femmes",
  vh = "vêtements Hommes",
  elect = "Electronics",
  maico = "Maison et confort",
  sport = "Sport",
  jouet = "Jouets pour enfant",
  sac = "Sacs",
  sousvet = "Sous vetement",
}
