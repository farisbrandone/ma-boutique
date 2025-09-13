import React from "react";
import { useAuth } from "../context/AuthContext";
import { FiLogOut } from "react-icons/fi";

interface HeaderProps {
  onAddProduct: () => void;
  onLogout: () => void;
  adminName: string;
}

const Header: React.FC<HeaderProps> = ({
  onAddProduct,
  onLogout /* , adminName */,
}) => {
  const { adminName } = useAuth();

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      <div className="flex items-center">
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
        <h1 className="ml-4 text-xl font-bold">MonShop</h1>
      </div>

      <div className="flex items-center">
        <span className="mr-4">Bienvenue, {adminName}</span>
        <button
          onClick={onAddProduct}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Ajouter un produit
        </button>
        <button
          onClick={onLogout}
          className="p-2 text-gray-600 hover:text-red-600"
          title="Déconnexion"
        >
          <FiLogOut size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;
