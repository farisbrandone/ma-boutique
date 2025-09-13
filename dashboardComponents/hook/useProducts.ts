import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Product } from "../types/product";
import { updateProductField } from "@/app/actions/dashboard/productAPI/route";

export const useOptimisticToggle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: string; field: keyof Product; value: any }) =>
      updateProductField(params.id, params.field, params.value),

    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });

      const previousProducts = queryClient.getQueryData(["products"]);

      // Mise à jour optimiste
      queryClient.setQueryData(["products"], (old: any) => {
        if (!old) return { products: [], total: 0 };
        return {
          ...old,
          products: old.products.map((product: Product) =>
            product._id === params.id
              ? { ...product, [params.field]: params.value }
              : product
          ),
        };
      });

      return { previousProducts };
    },

    onError: (err, params, context) => {
      queryClient.setQueryData(["products"], context?.previousProducts);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
