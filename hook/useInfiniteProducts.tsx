"use client";
import {
  API_URL,
  fetchProducts,
} from "@/app/actions/dashboard/productAPI/service";
import ProductTrue from "@/models/ProductTrue";
// hooks/useInfiniteProducts.ts

import { useState, useEffect, useCallback } from "react";

export const useInfiniteProducts = (
  query: string | null,
  category: string | null
) => {
  const [products, setProducts] = useState<ProductTrue[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [firstLoading, setFirstLoading] = useState(true);

  const fetchProductss = useCallback(async () => {
    if (loading || !hasMore) return;
    let responseTrue: any;
    setLoading(true);
    try {
      if (query) {
        responseTrue = await fetchProducts(
          page,
          20,
          {
            name: query,
            category: query,
            sortDirection: "desc",
          },
          true
        );
      } else if (category) {
        responseTrue = await fetchProducts(
          page,
          20,
          {
            category: category,
            sortDirection: "desc",
          },
          true
        );
      } else {
        responseTrue = await fetchProducts(page, 20, {
          sortDirection: "desc",
        });
      }

      /* 
        {
          productsTrue,
          total,
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          totalPages: Math.ceil(total / parseInt(pageSize)),
        },
      */

      /*  const response = await fetch(
        `${API_URL}/admin/productsTrue?page=${page}&size=10&sort=dateOfCreated,desc`
      );
      const data = await response.json();
      const newProducts = data._embedded.autos; */

      const newProducts = responseTrue.productsTrue;
      const totalPages = responseTrue.totalPages;

      setProducts((prev) => [...prev, ...newProducts]);
      setHasMore(totalPages > page + 1);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching Products:", error);
    } finally {
      setLoading(false);
      setFirstLoading(false);
    }
    console.log({ hasMore });
  }, [page, loading, hasMore]);

  useEffect(() => {
    fetchProductss();
  }, []);

  return {
    products,
    loading,
    hasMore,
    fetchMore: fetchProductss,
    firstLoading,
  };
};
