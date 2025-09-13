import React from "react";
import { useQuery } from "@tanstack/react-query";

import { FiX } from "react-icons/fi";
import { fetchProductSalesHistory } from "@/app/actions/dashboard/productAPI/service";

interface ProductSalesHistoryProps {
  productId: string;
  onClose: () => void;
}

const ProductSalesHistory: React.FC<ProductSalesHistoryProps> = ({
  productId,
  onClose,
}) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["productSales", productId],
    queryFn: () => fetchProductSalesHistory(productId),
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            Historique des ventes - Produit #{productId}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>

        {isLoading && <p className="p-4">Chargement...</p>}
        {isError && (
          <p className="p-4 text-red-500">
            Erreur lors du chargement de l'historique
          </p>
        )}

        {data && (
          <div className="p-4">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4 text-left">Quantité vendue</th>
                  <th className="py-2 px-4 text-left">Montant (€)</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4">{item.date}</td>
                    <td className="py-2 px-4">{item.quantity}</td>
                    <td className="py-2 px-4">{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSalesHistory;
