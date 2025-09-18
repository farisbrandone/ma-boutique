"use client";

import Header from "@/component-home/HeaderHome";
import { Product } from "@/component-home/home-body6/HomeBody6";
import { PanierIcon } from "@/components/PanierIcon";
import { database } from "@/data";
import React, { useEffect, useState } from "react";

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (product.loading) return;

    const img = new Image();
    img.src = product.imageUrl;
    img.onload = () => setImageLoaded(true);
  }, [product.imageUrl, product.loading]);

  if (product.loading) {
    return (
      <div className="flex-shrink-0 w-64 h-80 bg-gray-200 rounded-lg overflow-hidden animate-pulse">
        <div className="h-full w-full"></div>
      </div>
    );
  }

  if (!imageLoaded) {
    return (
      <div className="flex-shrink-0 w-64 h-80 bg-gray-200 rounded-lg overflow-hidden animate-pulse">
        <div className="h-full w-full"></div>
      </div>
    );
  }

  return (
    <div className="relative flex-shrink-0  w-64 h-[350px] max-sm:h-[380px] max-sm:w-[calc(100%-10px)] bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 mx-2">
      {/* Badge de rendement */}
      <div className="absolute top-0 left-0  bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-br-lg rounded-tl-lg">
        {product.discountPercentage}% OFF
      </div>

      {/* Image du produit */}
      <div className="h-48 max-sm:h-[220px] w-full overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex max-sm:text-[14px]  items-center gap-3 self-center px-2  w-full mt-2">
        <button className="cursor-pointer flex items-center gap-1 px-2 py-2 w-[120px] text-center bg-black text-white ">
          <span> Ajoute aux</span> <PanierIcon width={20} height={20} />
        </button>
        <button className=" cursor-pointer  py-2 w-[120px] text-center bg-[#bd4444] text-white ">
          Passe commande
        </button>
      </div>

      {/* Détails du produit */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-2 truncate">
          {product.name}
        </h3>

        <div className="flex items-center mb-2">
          <span className="text-lg font-bold text-gray-900 mr-2">
            ${product.discountedPrice.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500 line-through">
            ${product.originalPrice.toFixed(2)}
          </span>
        </div>

        {/* Rating */}
        <div className="w-full flex items-center justify-between ">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${
                  star <= product.rating ? "text-yellow-400" : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          <button className="text-bold text-black border border-solid border-[#686868bb] text-center px-2 rounded-md self-end mr-1 hover:border-[#bd4444] hover:text-[#bd4444] duration-300 transform-border transition-colors cursor-pointer ">
            Détails
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ListProductComponent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler un chargement asynchrone
    setTimeout(() => {
      setProducts([...database]);
      setLoading(false);
    }, 2000);
  }, []);

  const skeletonProducts = Array(database.length).fill({ loading: true });

  return (
    <div className="mx-auto flex flex-col items-center w-screen xl:max-w-7xl min-h-screen p-0">
      <Header />

      <div className="flex flex-col gap-2 mt-[100px] ">
        <div className="w-[180px] font-bold text-[18px] self-end text-center py-2.5 border border-solid border-[#696969e1] mr-2 mb-[50px] max-sm:mb-[10px] ">
          Tous les produits
        </div>

        <div className="grid max-sm:flex max-sm:flex-col max-sm:w-full md:grid-cols-3 lg:grid-col-4 xl:grid-cols-5 gap-6">
          {(loading ? skeletonProducts : products).map((product, index) => (
            <div
              className="flex mt-[20px]   max-md:mt-[30px]  place-items-center"
              key={index}
            >
              <ProductCard
                key={loading ? index : product.id}
                product={loading ? { ...product, id: index } : product}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
