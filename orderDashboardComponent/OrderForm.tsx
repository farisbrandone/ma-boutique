// src/components/orders/OrderForm.tsx
import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

interface OrderFormProps {
  order?: any;
  products: any[];
  onSubmit: (data: any) => void;
  onClose: () => void;
  isLoading: boolean;
}

const OrderForm: React.FC<OrderFormProps> = ({
  order,
  products,
  onSubmit,
  onClose,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    product: "",
    quantity: 1,
    customerInfo: {
      name: "",
      email: "",
      address: "",
    },
    status: "pending",
  });

  useEffect(() => {
    if (order) {
      setFormData({
        product: order.product,
        quantity: order.quantity,
        customerInfo: {
          name: order.customerInfo?.name || "",
          email: order.customerInfo?.email || "",
          address: order.customerInfo?.address || "",
        },
        status: order.status,
      });
    }
  }, [order]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("customerInfo.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        customerInfo: {
          ...formData.customerInfo,
          [field]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculer le montant total
    const selectedProduct = products.find((p) => p._id === formData.product);
    const totalAmount = selectedProduct
      ? selectedProduct.price * formData.quantity
      : 0;

    onSubmit({
      ...formData,
      totalAmount,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">
            {order ? "Modifier la commande" : "Nouvelle commande"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Produit</label>
              <select
                name="product"
                value={formData.product}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="">Sélectionner un produit</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name} - {product.price} €
                  </option>
                ))}
              </select>

              {formData.product && (
                <div className="mt-4">
                  <label className="block text-gray-700 mb-2">
                    Stock disponible
                  </label>
                  <div className="text-lg font-medium">
                    {products.find((p) => p._id === formData.product)?.stock ||
                      0}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Quantité</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border rounded-lg"
                required
              />

              <div className="mt-4">
                <label className="block text-gray-700 mb-2">Statut</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="pending">En attente</option>
                  <option value="validated">Validée</option>
                  <option value="cancelled">Annulée</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">
                Informations client
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    name="customerInfo.name"
                    value={formData.customerInfo.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="customerInfo.email"
                    value={formData.customerInfo.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2">Adresse</label>
                  <textarea
                    name="customerInfo.address"
                    value={formData.customerInfo.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg text-white ${
                isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              } flex items-center`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Enregistrement...
                </>
              ) : order ? (
                "Mettre à jour"
              ) : (
                "Créer la commande"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
