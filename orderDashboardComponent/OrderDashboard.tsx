// src/pages/OrderDashboard.tsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiShoppingCart,
  FiDollarSign,
  FiFilter,
  FiSearch,
} from "react-icons/fi";
import { format } from "date-fns";
import {
  createOrder,
  createSale,
  deleteOrder,
  deleteSale,
  fetchOrders,
  fetchSales,
  PaginationParams,
  Sale,
  updateOrder,
  updateSale,
} from "@/app/actions/dashboard/orderAPI/service";
import OrderForm from "./OrderForm";
import SaleForm from "@/SaleDashboard/SaleForm";
import { toast } from "react-toastify";
import { fetchProducts } from "@/app/actions/dashboard/productAPI/service";

import { OrderTrue } from "@/models/OrderTrue";
import { dataProductTable } from "@/dashboardComponents/dashboard/ProductTable";

interface dataOrderTable {
  orders: OrderTrue[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

interface dataOSaleTable {
  sales: Sale[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

interface StatusBadgeProps {
  status: string;
}

const OrderDashboard = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("orders");
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
  });
  const [filters, setFilters] = useState({
    status: "",
    dateFrom: "",
    dateTo: "",
  });

  const [sortField, setSortField] = useState<keyof OrderTrue | undefined>(
    undefined
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [paginationSale, setPaginationSale] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
  });
  const [filtersSale, setFiltersSale] = useState({
    status: "",
    dateFrom: "",
    dateTo: "",
  });

  const [sortFieldSale, setSortFieldSale] = useState<
    keyof OrderTrue | undefined
  >(undefined);
  const [sortDirectionSale, setSortDirectionSale] = useState<"asc" | "desc">(
    "asc"
  );

  // Récupérer les données
  /* const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  const { data: sales, isLoading: salesLoading } = useQuery({
    queryKey: ["sales"],
    queryFn: fetchSales,
  }); */

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field as keyof OrderTrue);
      setSortDirection("desc");
    }
  };

  const handleSortSales = (field: string) => {
    if (sortFieldSale === field) {
      setSortDirectionSale(sortDirectionSale === "asc" ? "desc" : "asc");
    } else {
      setSortFieldSale(field as keyof OrderTrue);
      setSortDirectionSale("desc");
    }
  };

  const params: PaginationParams = {
    ...filters,
    page: pagination.currentPage,
    limit: pagination.itemsPerPage,
    sortBy: sortField,
    sortOrder: sortDirection,
  };

  const paramsSale: PaginationParams = {
    ...filtersSale,
    page: paginationSale.currentPage,
    limit: paginationSale.itemsPerPage,
    sortBy: sortFieldSale,
    sortOrder: sortDirectionSale,
  };

  const {
    data: orders,
    isLoading: ordersLoading,
    isError,
  } = useQuery<dataOrderTable, Error>({
    queryKey: ["orders"],
    queryFn: () => fetchOrders(params),
  });

  const {
    data: sales,
    isLoading: salesLoading,
    isError: isErrorSales,
  } = useQuery<dataOSaleTable, Error>({
    queryKey: ["sales"],
    queryFn: () => fetchOrders(params),
  });
  /* 
  page:1, pageSize:10, {
        name: "",
        category: "",
        sortField: null,
        sortDirection:"asc",
      }
  
  
  */

  const { data: products } = useQuery<dataProductTable, Error>({
    queryKey: ["products"],
    queryFn: () =>
      fetchProducts(1, 10, {
        name: "",
        category: "",
        sortField: undefined,
        sortDirection: "asc",
      }),
  });

  // Mutations pour les commandes
  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setShowOrderForm(false);
      toast.success("Commande ajouté avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de l'ajout de la commande");
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setShowOrderForm(false);
      toast.success("Commande mis à jour avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour de la commande");
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Commande supprimer avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de la commande");
    },
  });

  // Mutations pour les ventes
  const createSaleMutation = useMutation({
    mutationFn: createSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      setShowSaleForm(false);
      toast.success("Vente créer avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la création de la vente");
    },
  });

  const updateSaleMutation = useMutation({
    mutationFn: updateSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      setShowSaleForm(false);
      toast.success("Vente mise à jour avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour de la vente");
    },
  });

  const deleteSaleMutation = useMutation({
    mutationFn: deleteSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      toast.success("Vente supprimer avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de la vente");
    },
  });

  // Filtrer les commandes
  const filteredOrders = orders?.orders?.filter((order) => {
    const matchesSearch = searchTerm
      ? order.customerInfo.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.customerInfo.email
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order._id.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesStatus =
      statusFilter !== "all" ? order.status === statusFilter : true;

    return matchesSearch && matchesStatus;
  });

  // Filtrer les ventes
  const filteredSales = sales?.sales?.filter((sale) => {
    return searchTerm
      ? sale.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sale._id.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
  });

  // Gérer la soumission d'une commande
  const handleOrderSubmit = (data: any) => {
    if (selectedOrder) {
      updateOrderMutation.mutate({ ...data, _id: selectedOrder._id });
    } else {
      createOrderMutation.mutate(data);
    }
  };

  // Gérer la soumission d'une vente
  const handleSaleSubmit = (data: any) => {
    if (selectedSale) {
      updateSaleMutation.mutate({ ...data, _id: selectedSale._id });
    } else {
      createSaleMutation.mutate(data);
    }
  };

  const onStatusChange = async (
    order: OrderTrue,
    newStatus: "pending" | "validated" | "cancelled"
  ) => {
    try {
      order.status = newStatus;
      updateOrderMutation.mutate({ ...order, _id: order._id });
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  // Obtenir le nom du produit
  const getProductName = (productId: string) => {
    const product = products?.productsTrue?.find((p) => p._id === productId);
    return product ? product.name : "Produit inconnu";
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page when filters change
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      dateFrom: "",
      dateTo: "",
    });
    setSearchTerm("");
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleFilterChangeSale = (key: string, value: string) => {
    setFiltersSale((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page when filters change
  };

  const resetFiltersSale = () => {
    setFiltersSale({
      status: "",
      dateFrom: "",
      dateTo: "",
    });
    setSearchTerm("");
    setPaginationSale((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Obtenir le badge de statut
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
            En attente
          </span>
        );
      case "validated":
        return (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
            Validée
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
            Annulée
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
            {status}
          </span>
        );
    }
  };

  const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const getStatusClass = () => {
      switch (status) {
        case "pending":
          return "bg-yellow-100 text-yellow-800";
        case "validated":
          return "bg-green-100 text-green-800";
        case "cancelled":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    return (
      <span
        className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusClass()}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Dashboard Commandes & Ventes</h1>

          <div className="flex space-x-4">
            <button
              onClick={() => {
                setActiveTab("orders");
                setShowOrderForm(true);
                setSelectedOrder(null);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FiPlus className="mr-2" /> Nouvelle commande
            </button>

            <button
              onClick={() => {
                setActiveTab("sales");
                setShowSaleForm(true);
                setSelectedSale(null);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FiPlus className="mr-2" /> Nouvelle vente
            </button>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "orders"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            <div className="flex items-center">
              <FiShoppingCart className="mr-2" /> Commandes
            </div>
          </button>

          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "sales"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("sales")}
          >
            <div className="flex items-center">
              <FiDollarSign className="mr-2" /> Ventes
            </div>
          </button>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Rechercher ${
                  activeTab === "orders" ? "commandes..." : "ventes..."
                }`}
                className="pl-10 pr-4 py-2 w-full border rounded-lg"
              />
            </div>

            {activeTab === "orders" && (
              <div>
                <label className="block text-sm font-medium mb-1">Statut</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="validated">Validée</option>
                  <option value="cancelled">Annulée</option>
                </select>

                <div>
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={pagination.itemsPerPage}
                    onChange={(e) =>
                      setPagination((prev) => ({
                        ...prev,
                        itemsPerPage: Number(e.target.value),
                      }))
                    }
                  >
                    <option value="5">5 per page</option>
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center">
                    <label className="mr-2 text-sm text-gray-700 whitespace-nowrap">
                      Date Range:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        value={filters.dateFrom}
                        onChange={(e) =>
                          handleFilterChange("dateFrom", e.target.value)
                        }
                      />
                      <span className="flex items-center text-gray-500">
                        to
                      </span>
                      <input
                        type="date"
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        value={filters.dateTo}
                        onChange={(e) =>
                          handleFilterChange("dateTo", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <button
                    onClick={resetFilters}
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Reset Filters
                  </button>
                </div>
              </div>
            )}

            {activeTab === "ventes" && (
              <div>
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={pagination.itemsPerPage}
                  onChange={(e) =>
                    setPaginationSale((prev) => ({
                      ...prev,
                      itemsPerPage: Number(e.target.value),
                    }))
                  }
                >
                  <option value="5">5 per page</option>
                  <option value="10">10 per page</option>
                  <option value="25">25 per page</option>
                  <option value="50">50 per page</option>
                </select>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center">
                    <label className="mr-2 text-sm text-gray-700 whitespace-nowrap">
                      Date Range:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        value={filtersSale.dateFrom}
                        onChange={(e) =>
                          handleFilterChangeSale("dateFrom", e.target.value)
                        }
                      />
                      <span className="flex items-center text-gray-500">
                        to
                      </span>
                      <input
                        type="date"
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        value={filtersSale.dateTo}
                        onChange={(e) =>
                          handleFilterChangeSale("dateTo", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <button
                    onClick={resetFiltersSale}
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Reset Filters
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="w-full bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Contenu des onglets */}
        {activeTab === "orders" ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {ordersLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produit
                      {sortField === "product" && (
                        <span>{sortDirection === "asc" ? " ↑" : " ↓"}</span>
                      )}
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      onClick={() => handleSort("customerInfo.name")}
                    >
                      Client
                    </th>
                    <th
                      onClick={() => handleSort("quantity")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Quantité
                    </th>
                    <th
                      onClick={() => handleSort("totalAmount")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Montant
                    </th>
                    <th
                      onClick={() => handleSort("status")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Statut
                    </th>
                    <th
                      onClick={() => handleSort("createdAt")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders?.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order._id.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {products?.productsTrue?.find(
                            (p) => p._id === order.product
                          )?.imageUrl?.[0] && (
                            <img
                              src={
                                products.productsTrue.find(
                                  (p) => p._id === order.product
                                )?.imageUrl[0]
                              }
                              alt={getProductName(order.product)}
                              className="w-10 h-10 rounded-md mr-3 object-cover"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {getProductName(order.product)}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {order.product.substring(0, 6)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {order.customerInfo?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customerInfo?.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {order.totalAmount.toFixed(2)} €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            onStatusChange(order, e.target.value as any)
                          }
                          className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${StatusBadge(
                            { status: order.status }
                          )}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="validated">Validated</option>
                          <option value="cancelled">Cancelled</option>
                        </select>

                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(order.createdAt), "dd/MM/yyyy")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowOrderForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Êtes-vous sûr de vouloir supprimer cette commande ?"
                                )
                              ) {
                                deleteOrderMutation.mutate(order._id);
                              }
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {filteredOrders?.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  Aucune commande trouvée
                </div>
                <button
                  onClick={() => {
                    setShowOrderForm(true);
                    setSelectedOrder(null);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Créer une nouvelle commande
                </button>
              </div>
            )}

            {/* Pagination */}
            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    pagination.currentPage * pagination.itemsPerPage,
                    pagination.totalPages
                  )}
                </span>{" "}
                of <span className="font-medium">{pagination.totalPages}</span>{" "}
                results
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      currentPage: Math.max(1, prev.currentPage - 1),
                    }))
                  }
                  disabled={pagination.currentPage === 1}
                  className={`px-3 py-1 rounded-lg ${
                    pagination.currentPage === 1
                      ? "bg-gray-100 text-gray-400"
                      : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                  }`}
                >
                  Previous
                </button>

                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      currentPage: Math.min(
                        prev.totalPages,
                        prev.currentPage + 1
                      ),
                    }))
                  }
                  disabled={pagination.currentPage === pagination.totalPages}
                  className={`px-3 py-1 rounded-lg ${
                    pagination.currentPage === pagination.totalPages
                      ? "bg-gray-100 text-gray-400"
                      : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {salesLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produit
                      {sortField === "product" && (
                        <span>{sortDirection === "asc" ? " ↑" : " ↓"}</span>
                      )}
                    </th>
                    <th
                      onClick={() => handleSortSales("orderId")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Commande
                    </th>
                    <th
                      onClick={() => handleSortSales("quantity")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Quantité
                    </th>
                    <th
                      onClick={() => handleSortSales("amount")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Montant
                    </th>
                    <th
                      onClick={() => handleSortSales("createdAt")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSales?.map((sale) => (
                    <tr key={sale._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sale._id.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {products?.productsTrue?.find(
                            (p) => p._id === sale.product
                          )?.imageUrl?.[0] && (
                            <img
                              src={
                                products.productsTrue.find(
                                  (p) => p._id === sale.product
                                )?.imageUrl[0]
                              }
                              alt={getProductName(sale.product)}
                              className="w-10 h-10 rounded-md mr-3 object-cover"
                            />
                          )}
                          <div className="text-sm font-medium text-gray-900">
                            {getProductName(sale.product)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sale.orderId.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sale.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {sale.amount.toFixed(2)} €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(sale.date), "dd/MM/yyyy")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedSale(sale);
                              setShowSaleForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Êtes-vous sûr de vouloir supprimer cette vente ?"
                                )
                              ) {
                                deleteSaleMutation.mutate(sale._id);
                              }
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {filteredSales?.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">Aucune vente trouvée</div>
                <button
                  onClick={() => {
                    setShowSaleForm(true);
                    setSelectedSale(null);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  Créer une nouvelle vente
                </button>
              </div>
            )}

            {/* Pagination */}
            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(paginationSale.currentPage - 1) *
                    paginationSale.itemsPerPage +
                    1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    paginationSale.currentPage * paginationSale.itemsPerPage,
                    paginationSale.totalPages
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium">{paginationSale.totalPages}</span>{" "}
                results
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setPaginationSale((prev) => ({
                      ...prev,
                      currentPage: Math.max(1, prev.currentPage - 1),
                    }))
                  }
                  disabled={paginationSale.currentPage === 1}
                  className={`px-3 py-1 rounded-lg ${
                    paginationSale.currentPage === 1
                      ? "bg-gray-100 text-gray-400"
                      : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                  }`}
                >
                  Previous
                </button>

                <button
                  onClick={() =>
                    setPaginationSale((prev) => ({
                      ...prev,
                      currentPage: Math.min(
                        prev.totalPages,
                        prev.currentPage + 1
                      ),
                    }))
                  }
                  disabled={
                    paginationSale.currentPage === paginationSale.totalPages
                  }
                  className={`px-3 py-1 rounded-lg ${
                    paginationSale.currentPage === paginationSale.totalPages
                      ? "bg-gray-100 text-gray-400"
                      : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Formulaire de commande */}
      {showOrderForm && (
        <OrderForm
          order={selectedOrder}
          products={products?.productsTrue || []}
          onSubmit={handleOrderSubmit}
          onClose={() => setShowOrderForm(false)}
          isLoading={
            createOrderMutation.isPending || updateOrderMutation.isPending
          }
        />
      )}

      {/* Formulaire de vente */}
      {showSaleForm && (
        <SaleForm
          sale={selectedSale}
          orders={orders?.orders || []}
          products={products?.productsTrue || []}
          onSubmit={handleSaleSubmit}
          onClose={() => setShowSaleForm(false)}
          isLoading={
            createSaleMutation.isPending || updateSaleMutation.isPending
          }
        />
      )}
    </div>
  );
};

export default OrderDashboard;
