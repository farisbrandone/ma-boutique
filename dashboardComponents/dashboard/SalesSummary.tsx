import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { format } from "date-fns";
import { fetchSalesSummary } from "@/app/actions/dashboard/salesAPI/route";

const SalesSummary: React.FC = () => {
  const [startDate, setStartDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["salesSummary", startDate, endDate],
    queryFn: () => fetchSalesSummary(startDate, endDate),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  // Formater le chiffre d'affaires
  const formatRevenue = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-6">
      <h2 className="text-lg font-semibold mb-4">Résumé des ventes</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1">
            Date de début
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date de fin</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Appliquer
          </button>
        </div>
      </form>

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      {isError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <p className="text-red-700">
            Erreur lors du chargement des données. Veuillez réessayer.
          </p>
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium">Produits vendus</h3>
            <p className="text-2xl font-bold">{data.totalSold}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium">Chiffre d'affaires</h3>
            <p className="text-2xl font-bold">
              {data && data.revenue.toLocaleString()} €
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesSummary;
