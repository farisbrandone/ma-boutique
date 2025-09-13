// src/components/sales/SaleForm.tsx
import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

interface SaleFormProps {
  sale?: any;
  orders: any[];
  products: any[];
  onSubmit: (data: any) => void;
  onClose: () => void;
  isLoading: boolean;
}

const SaleForm: React.FC<SaleFormProps> = ({
  sale,
  orders,
  products,
  onSubmit,
  onClose,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    product: "",
    quantity: 1,
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    orderId: "",
  });

  useEffect(() => {
    if (sale) {
      setFormData({
        product: sale.product,
        quantity: sale.quantity,
        amount: sale.amount,
        date: formatDate(sale.date),
        orderId: sale.orderId,
      });
    }
  }, [sale]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const orderId = e.target.value;
    const order = orders.find((o) => o._id === orderId);

    if (order) {
      setFormData({
        ...formData,
        orderId,
        product: order.product,
        quantity: order.quantity,
        amount: order.totalAmount,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">
            {sale ? "Modifier la vente" : "Nouvelle vente"}
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
              <label className="block text-gray-700 mb-2">
                Commande associée
              </label>
              <select
                name="orderId"
                value={formData.orderId}
                onChange={handleOrderChange}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Sélectionner une commande</option>
                {orders.map((order) => (
                  <option key={order._id} value={order._id}>
                    Commande #{order._id.substring(0, 8)} -{" "}
                    {order.customerInfo?.name}
                  </option>
                ))}
              </select>
            </div>

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
                    {product.name}
                  </option>
                ))}
              </select>
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
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Montant (€)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
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
                isLoading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
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
              ) : sale ? (
                "Mettre à jour"
              ) : (
                "Créer la vente"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaleForm;
