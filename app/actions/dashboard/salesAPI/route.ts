import { SalesSummary } from "@/dashboardComponents/types/product";
import { API_URL } from "../productAPI/route";

export const fetchSalesSummary = async (
  startDate: string,
  endDate: string
): Promise<SalesSummary> => {
  const params = new URLSearchParams({ startDate, endDate });
  const response = await fetch(`${API_URL}/admin/sales/summaryTrue?${params}`);

  console.log("zongzong");

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message || "Erreur de chargement du résumé des ventes"
    );
  }

  const data = await response.json();

  console.log(data);

  return data.summary;
};
