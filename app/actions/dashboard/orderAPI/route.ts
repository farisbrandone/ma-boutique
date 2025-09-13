// src/api/orderAPI.ts

import { OrderTrue } from "@/models/OrderTrue";
import { API_URL } from "../productAPI/route";

// Interfaces basées sur les modèles Mongoose
interface CustomerInfo {
  name: string;
  email: string;
  address?: string;
}

export interface Order {
  _id: string;
  product: string;
  quantity: number;
  status: "pending" | "validated" | "cancelled";
  totalAmount: number;
  customerInfo: CustomerInfo;
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  _id: string;
  product: string;
  quantity: number;
  amount: number;
  date: string;
  orderId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  category: string;
  imageUrl: string[];
  price: number;
  description: string;
  sold: number;
  stock: number;
  displayHome: boolean;
  displaySolde: boolean;
  newProduct: boolean;
  exploreProduct: boolean;
  discount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: keyof OrderTrue;
  sortOrder?: "asc" | "desc";
  status?: string;
  productId?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Fonctions pour les commandes

export const fetchOrders = async (params: PaginationParams = {}) => {
  const queryString = new URLSearchParams(params as any).toString();
  const response = await fetch(`${API_URL}/admin/ordersTrue2?${queryString}`);
  if (!response.ok) throw new Error("Erreur de chargement des commandes");
  return response.json();
};

export const createOrder = async (
  data: Omit<OrderTrue, "_id" | "createdAt" | "updatedAt">
): Promise<OrderTrue> => {
  const response = await fetch(`${API_URL}/admin/ordersTrue2`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message || "Erreur lors de la création de la commande"
    );
  }

  return response.json();
};

export const updateOrder = async (data: OrderTrue): Promise<OrderTrue> => {
  const response = await fetch(`${API_URL}/admin/ordersTrue2/${data._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message || "Erreur lors de la mise à jour de la commande"
    );
  }

  return response.json();
};

export const deleteOrder = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/admin/ordersTrue2/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message || "Erreur lors de la suppression de la commande"
    );
  }
};

// Fonctions pour les ventes

export const fetchSales = async (
  params: PaginationParams & {
    minAmount?: number;
    maxAmount?: number;
  } = {}
): Promise<{ data: Sale[]; pagination: any }> => {
  const queryString = new URLSearchParams(params as any).toString();
  const response = await fetch(`${API_URL}/admin/sales?${queryString}`);
  if (!response.ok) throw new Error("Erreur de chargement des ventes");
  return response.json();
};

export const createSale = async (
  data: Omit<Sale, "_id" | "createdAt" | "updatedAt">
): Promise<Sale> => {
  const response = await fetch(`${API_URL}/admin/sales`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erreur lors de la création de la vente");
  }

  return response.json();
};

export const updateSale = async (data: Sale): Promise<Sale> => {
  const response = await fetch(`${API_URL}/admin/sales/${data._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message || "Erreur lors de la mise à jour de la vente"
    );
  }

  return response.json();
};

export const deleteSale = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/admin/sales/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message || "Erreur lors de la suppression de la vente"
    );
  }
};

// Fonction pour les produits
/* export const fetchProducts = async (): Promise<Product[]> => {

  const response = await fetch(`${API_URL}/admin/productsTrue`);
  if (!response.ok) throw new Error("Erreur de chargement des produits");
  return response.json();
}; */
