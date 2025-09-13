// src/api/carouselAPI.ts

import { API_URL } from "../productAPI/route";

export interface CarouselSlide {
  _id: string;
  imageUrl: string;
  altText: string;
  order: number;
  isActive: boolean;
}

export const fetchCarouselSlides = async (): Promise<CarouselSlide[]> => {
  const response = await fetch(`${API_URL}/admin/carouselSlideData`);
  if (!response.ok) return [];
  const reseult = await response.json();
  return reseult.slides;
};

export const createSlide = async (
  formData: FormData
): Promise<CarouselSlide> => {
  const response = await fetch(`${API_URL}/admin/carouselSlideData`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erreur lors de la création de la slide");
  }

  return response.json();
};

export const updateSlide = async (
  id: string,
  formData: FormData
): Promise<CarouselSlide> => {
  const response = await fetch(`${API_URL}/admin/carouselSlideData/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message || "Erreur lors de la mise à jour de la slide"
    );
  }

  return response.json();
};

export const deleteSlide = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/admin/carouselSlideData/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message || "Erreur lors de la suppression de la slide"
    );
  }
};

export const reorderSlides = async ({
  newOrder,
}: {
  newOrder: string[];
}): Promise<void> => {
  const response = await fetch(`${API_URL}/admin/carouselSlideData/reorder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newOrder }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message || "Erreur lors de la réorganisation des slides"
    );
  }
};
