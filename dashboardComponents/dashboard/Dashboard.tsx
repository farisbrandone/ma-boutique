"use client";

import React, { useState } from "react";

import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import Header from "./Header";
import SalesSummary from "./SalesSummary";
import ProductTable from "./ProductTable";
import ProductForm from "./ProductForm";
import {
  addProduct,
  deleteProduct,
  updateProduct,
} from "@/app/actions/dashboard/productAPI/service";
import ProductTrue from "@/models/ProductTrue";

const Dashboard: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductTrue | null>(
    null
  );
  const { adminName, logout } = useAuth();
  const queryClient = useQueryClient();

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product: ProductTrue) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        await deleteProduct(id);
        queryClient.invalidateQueries({ queryKey: ["products"] });
        toast.success("Produit supprimé avec succès");
      } catch (error) {
        toast.error("Échec de la suppression du produit");
      }
    }
  };

  const addProductMutation = useMutation({
    mutationFn: (data: FormData) => addProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produit ajouté avec succès");
      setShowForm(false);
    },
    onError: () => {
      toast.error("Erreur lors de l'ajout du produit");
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: (data: { id: string; formData: FormData }) =>
      updateProduct(data.id, data.formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produit mis à jour avec succès");
      setShowForm(false);
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour du produit");
    },
  });

  const handleSubmit = async (data: any, imageUrl?: string[]) => {
    const formData = new FormData();

    try {
      // Ajouter les champs texte
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // Ajouter l'image si elle existe
      if (imageUrl) {
        formData.append("imageUrl", JSON.stringify(imageUrl));
      }

      if (editingProduct) {
        updateProductMutation.mutate({ id: editingProduct._id, formData });
      } else {
        addProductMutation.mutate(formData);
      }
    } catch (error) {
      toast.error("Erreur lors de l'opération");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        onAddProduct={handleAddProduct}
        onLogout={logout}
        adminName={adminName}
      />

      <main className="container mx-auto p-4">
        <SalesSummary />
        <ProductTable onEdit={handleEdit} onDelete={handleDelete} />
      </main>

      {showForm && (
        <ProductForm
          product={editingProduct as ProductTrue}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
          isLoading={
            addProductMutation.isPending || updateProductMutation.isPending
          }
        />
      )}
    </div>
  );
};

export default Dashboard;
