import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import ToggleSwitch from "../ui/ToggleSwitch";
import DropdownActions from "../ui/DropdownActions";
import {
  fetchProducts,
  updateProductField,
  updateProductField2,
} from "@/app/actions/dashboard/productAPI/route";
import { Product } from "../types/product";
import ProductSalesHistory from "./ProductSalesHistory";
import { FiFilter, FiArrowUp, FiArrowDown, FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";
import { useOptimisticToggle } from "../hook/useProducts";
import Link from "next/link";
import ProductTrue from "@/models/ProductTrue";

export interface dataProductTable {
  productsTrue: ProductTrue[];
  total: number;
}

const ProductTable = ({
  onEdit,
  onDelete,
}: {
  onEdit: (product: ProductTrue) => void;
  onDelete: (id: string) => Promise<void>;
}) => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const toggleMutation = useOptimisticToggle();

  const [nameFilter, setNameFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortField, setSortField] = useState<keyof ProductTrue | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const { data, isLoading, isError } = useQuery<dataProductTable, Error>({
    queryKey: [
      "products",
      page,
      nameFilter,
      categoryFilter,
      sortField,
      sortDirection,
    ],
    queryFn: () =>
      fetchProducts(page, pageSize, {
        name: nameFilter,
        category: categoryFilter,
        sortField: sortField as keyof ProductTrue,
        sortDirection,
      }),
  });

  const categories = useMemo(() => {
    if (!data?.productsTrue) return [];
    return Array.from(new Set(data.productsTrue.map((p) => p.category)));
  }, [data?.productsTrue]);

  // Fonction pour trier les produits
  const sortedProducts = useMemo(() => {
    if (!sortField || !data?.productsTrue) return data?.productsTrue || [];

    return [...data.productsTrue].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });
  }, [data?.productsTrue, sortField, sortDirection]);

  // Fonction pour filtrer les produits
  const filteredProducts = useMemo(() => {
    if (!sortedProducts) return [];

    return sortedProducts.filter((product) => {
      const matchesName = nameFilter
        ? product.name.toLowerCase().includes(nameFilter.toLowerCase())
        : true;

      const matchesCategory = categoryFilter
        ? product.category === categoryFilter
        : true;

      return matchesName && matchesCategory;
    });
  }, [sortedProducts, nameFilter, categoryFilter]);

  // Gestion du tri
  const handleSort = (field: keyof ProductTrue) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const renderSortableHeader = (label: string, field: keyof ProductTrue) => (
    <th
      className="py-2 px-4 border-b cursor-pointer hover:bg-gray-50"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center justify-between">
        {label}
        {sortField === field &&
          (sortDirection === "asc" ? (
            <FiArrowUp className="ml-1" />
          ) : (
            <FiArrowDown className="ml-1" />
          ))}
      </div>
    </th>
  );

  const handleToggleChange = async (
    id: string,
    field: "displayHome" | "displaySolde" | "newProduct" | "exploreProduct",
    value: boolean
  ) => {
    try {
      /*  await updateProductField(id, field, value);  */
      await toggleMutation.mutateAsync({ id, field, value });
      toast.success("Mise à jour réussie");
    } catch (error) {
      toast.error("Échec de la mise à jour");
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  if (isError)
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Erreur lors du chargement des produits. Veuillez réessayer.
            </p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="mt-6">
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <div className="flex items-center mb-4">
          <FiFilter className="mr-2" />
          <h3 className="font-medium">Filtres</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nom du produit
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                placeholder="Nom du produit..."
                className="w-full pl-10 pr-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Catégorie</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tri par</label>
            <select
              value={sortField || ""}
              onChange={(e) =>
                setSortField((e.target.value as keyof ProductTrue) || null)
              }
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Aucun tri</option>
              <option value="price">Prix</option>
              <option value="sold">Quantité vendue</option>
              <option value="stock">Stock</option>
              <option value="name">Nom</option>
            </select>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              {renderSortableHeader("Nom", "name")}
              <th className="py-2 px-4 border-b">Description</th>
              {renderSortableHeader("Catégorie", "category")}
              {renderSortableHeader("Prix", "price")}
              {renderSortableHeader("Vendu", "sold")}
              {renderSortableHeader("Stock", "stock")}
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Accueil
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Solde
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nouveau
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Explorer
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Remise
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data &&
              data?.productsTrue.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50 ">
                  <td className="py-2 px-4">
                    {" "}
                    <Link
                      href={`/card-detail/${product._id}`}
                      className="underline"
                    >
                      {" "}
                      {product._id}
                    </Link>{" "}
                  </td>
                  <td className="py-2 px-4 ">
                    {!product.imageUrl ? (
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
                    ) : (
                      <div className="flex-shrink-0 h-12 w-12">
                        <img
                          className="h-12 w-12 rounded object-cover"
                          src={
                            product.imageUrl[0] ||
                            "https://via.placeholder.com/150"
                          }
                          alt={product.name}
                        />
                      </div>
                    )}
                  </td>
                  <td
                    className="py-2 px-4 cursor-pointer  hover:underline whitespace-nowrap text-sm text-gray-500"
                    onClick={() => setSelectedProduct(product._id)}
                  >
                    {product.name}
                  </td>
                  <td className="py-2 px-4 max-w-xs truncate whitespace-nowrap text-sm text-gray-500">
                    {product.description}
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category}
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap text-sm text-gray-500">
                    {product.price} €
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap text-sm text-gray-500">
                    {product.sold}
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap text-sm text-gray-500">
                    {product.stock}
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap ">
                    <ToggleSwitch
                      checked={product.displayHome}
                      onChange={(checked) =>
                        handleToggleChange(product._id, "displayHome", checked)
                      }
                    />
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap">
                    <ToggleSwitch
                      checked={product.displaySolde}
                      onChange={(checked) =>
                        handleToggleChange(product._id, "displaySolde", checked)
                      }
                    />
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap">
                    <ToggleSwitch
                      checked={product.newProduct}
                      onChange={(checked) =>
                        handleToggleChange(product._id, "newProduct", checked)
                      }
                    />
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap">
                    <ToggleSwitch
                      checked={product.exploreProduct}
                      onChange={(checked) =>
                        handleToggleChange(
                          product._id,
                          "exploreProduct",
                          checked
                        )
                      }
                    />
                  </td>
                  <td className="py-2 px-4 whitespace-nowrap text-sm text-gray-500">
                    {product.discount}%
                  </td>
                  <td className="py-2 px-4  ">
                    <DropdownActions
                      onEdit={() => onEdit(product)}
                      onDelete={() => onDelete(product._id)}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {/* Pagination */}
      {data && data.total > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4 rounded-b-lg">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Précédent
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= Math.ceil(data.total / pageSize)}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Affichage de{" "}
                <span className="font-medium">{(page - 1) * pageSize + 1}</span>{" "}
                à{" "}
                <span className="font-medium">
                  {Math.min(page * pageSize, data.total)}
                </span>{" "}
                sur <span className="font-medium">{data.total}</span> résultats
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <span className="sr-only">Précédent</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {[...Array(Math.ceil(data.total / pageSize))].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      page === i + 1
                        ? "z-10 bg-blue-600 text-white focus:z-20  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.ceil(data.total / pageSize)}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <span className="sr-only">Suivant</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {selectedProduct && (
        <ProductSalesHistory
          productId={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default ProductTable;
