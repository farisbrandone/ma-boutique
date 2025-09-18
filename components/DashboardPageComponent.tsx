"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/dashboardComponents/context/AuthContext";
import ProtectedRoute from "@/dashboardComponents/auth/ProtectedRoute";
import Dashboard from "@/dashboardComponents/dashboard/Dashboard";
import { ToastContainer } from "react-toastify";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const DashboardPageComponent: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          {/*  <Header onAddProduct={() => setShowAddModal(true)} />

          <main className="container mx-auto p-4">
            <SalesSummary />
            <ProductTable />
          </main> */}

          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>

          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">
                  Ajouter un produit
                </h2>
                {/* Formulaire d'ajout ici */}
                <button
                  onClick={() => setShowAddModal(false)}
                  className="mt-4 px-4 py-2 bg-gray-300 rounded"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
        <ToastContainer position="bottom-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default DashboardPageComponent;
