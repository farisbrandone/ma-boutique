"use server";

import { API_URL } from "../actions/dashboard/productAPI/service";

export const fetchProductWithId = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/admin/productsTrue/${id}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la suppression du produit");
  }

  return response.json();
};
