"use client";

import { LoadingComponent } from "@/dashboardComponents/dashboard/LoadingComponent";
import { useInfiniteProducts } from "@/hook/useInfiniteProducts";
import ProductTrue from "@/models/ProductTrue";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef, useCallback } from "react";

export interface Product {
  id: number;
  name: string;
  imageUrl: string;
  discountPercentage: number;
  originalPrice: number;
  discountedPrice: number;
  rating: number;
  loading?: boolean;
}

const ProductCard: React.FC<{
  product: ProductTrue & { loading?: boolean };
  ref: any;
}> = ({ product, ref }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const router = useRouter();
  /* const [loading1, setLoading1] = useState(false); */

  useEffect(() => {
    if (product.loading) return;

    const img = new Image();
    img.src = product.imageUrl[0];
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
    <div
      className="relative flex-shrink-0 w-64 h-82 bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 mx-2"
      ref={ref}
      onClick={() => router.push(`/productPage/${product._id}`)}
    >
      {/* Badge de rendement */}
      <div className="absolute top-0 left-0  bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-br-lg rounded-tl-lg">
        {product.discount}%
      </div>

      {/* Image du produit */}
      <div className="h-48 w-full overflow-hidden">
        <img
          src={product.imageUrl[0]}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Détails du produit */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2 ">
          <h3 className=" text-lg font-semibold text-gray-800  truncate">
            {product.name}
          </h3>
          <div className="flex items-center w-[100px]">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${
                  star <= 4.5 ? "text-yellow-400" : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>

        <div className="flex items-center mb-2 ">
          <span className="text-lg font-bold text-gray-900 mr-2">
            $
            {(product.price - (product.price * product.discount) / 100).toFixed(
              2
            )}
          </span>
          <span className="text-sm text-gray-500 line-through">
            ${product.price.toFixed(2)}
          </span>
        </div>

        {/* Rating */}
        <div className="flex flex-col items-center w-full px-3 ">
          <button className="border-1 border-black border-solid text-black w-full py-1.5 rounded-[50px] cursor-pointer">
            Commander
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductPage: React.FC = () => {
  /*  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true); */
  /*  const [productsExplores, setProductsExplores] = useState<ProductTrue[]>([]); */

  const [lolo, setLolo] = useState(true);

  const observer = useRef<IntersectionObserver>(null);

  const { products, loading, hasMore, fetchMore } = useInfiniteProducts();

  const lastCarElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    if (loading) {
      setLolo(false);
    }
  }, [loading]);

  useEffect(() => {
    /*   const getProductsExplore = async () => {
      const product: ProductTrue[] = await fetchProductsDisplay(
        false,
        false,
        false,
        true
      );
      setProductsExplores(product);
    }; */
    // Simuler un chargement asynchrone
    /* setTimeout(() => {
      setProducts([
        {
          id: 1,
          name: "Casque Audio Sans Fil Premium",
          imageUrl: "/image/explorer1.png",
          discountPercentage: 20,
          originalPrice: 199.99,
          discountedPrice: 159.99,
          rating: 4,
        },
        {
          id: 2,
          name: "Smartphone Haut de Gamme 128GB",
          imageUrl: "/image/explorer2.png",
          discountPercentage: 15,
          originalPrice: 899.99,
          discountedPrice: 764.99,
          rating: 5,
        },
        {
          id: 3,
          name: "Montre Connectée Étanche",
          imageUrl: "/image/explorer3.png",
          discountPercentage: 30,
          originalPrice: 249.99,
          discountedPrice: 174.99,
          rating: 3,
        },
        {
          id: 4,
          name: "Enceinte Bluetooth Portable",
          imageUrl: "/image/explore4.png",
          discountPercentage: 25,
          originalPrice: 129.99,
          discountedPrice: 97.49,
          rating: 4,
        },
        {
          id: 5,
          name: "Clavier Mécanique RGB",
          imageUrl: "/image/explore6.png",
          discountPercentage: 10,
          originalPrice: 89.99,
          discountedPrice: 80.99,
          rating: 5,
        },
        {
          id: 6,
          name: "Souris Gaming Haute Précision",
          imageUrl: "/image/explore7.png",
          discountPercentage: 40,
          originalPrice: 59.99,
          discountedPrice: 35.99,
          rating: 4,
        },
        {
          id: 7,
          name: "Casque Audio Sans Fil Premium",
          imageUrl: "/image/explorer1.png",
          discountPercentage: 20,
          originalPrice: 199.99,
          discountedPrice: 159.99,
          rating: 4,
        },
        {
          id: 8,
          name: "Smartphone Haut de Gamme 128GB",
          imageUrl: "/image/explorer2.png",
          discountPercentage: 15,
          originalPrice: 899.99,
          discountedPrice: 764.99,
          rating: 5,
        },
        {
          id: 9,
          name: "Montre Connectée Étanche",
          imageUrl: "/image/explorer3.png",
          discountPercentage: 30,
          originalPrice: 249.99,
          discountedPrice: 174.99,
          rating: 3,
        },
        {
          id: 10,
          name: "Enceinte Bluetooth Portable",
          imageUrl: "/image/explore4.png",
          discountPercentage: 25,
          originalPrice: 129.99,
          discountedPrice: 97.49,
          rating: 4,
        },
        {
          id: 11,
          name: "Clavier Mécanique RGB",
          imageUrl: "/image/explore6.png",
          discountPercentage: 10,
          originalPrice: 89.99,
          discountedPrice: 80.99,
          rating: 5,
        },
        {
          id: 12,
          name: "Souris Gaming Haute Précision",
          imageUrl: "/image/explore7.png",
          discountPercentage: 40,
          originalPrice: 59.99,
          discountedPrice: 35.99,
          rating: 4,
        },
        {
          id: 13,
          name: "Casque Audio Sans Fil Premium",
          imageUrl: "/image/explorer1.png",
          discountPercentage: 20,
          originalPrice: 199.99,
          discountedPrice: 159.99,
          rating: 4,
        },
        {
          id: 14,
          name: "Smartphone Haut de Gamme 128GB",
          imageUrl: "/image/explorer2.png",
          discountPercentage: 15,
          originalPrice: 899.99,
          discountedPrice: 764.99,
          rating: 5,
        },
        {
          id: 15,
          name: "Montre Connectée Étanche",
          imageUrl: "/image/explorer3.png",
          discountPercentage: 30,
          originalPrice: 249.99,
          discountedPrice: 174.99,
          rating: 3,
        },
        {
          id: 16,
          name: "Enceinte Bluetooth Portable",
          imageUrl: "/image/explore4.png",
          discountPercentage: 25,
          originalPrice: 129.99,
          discountedPrice: 97.49,
          rating: 4,
        },
        {
          id: 17,
          name: "Clavier Mécanique RGB",
          imageUrl: "/image/explore6.png",
          discountPercentage: 10,
          originalPrice: 89.99,
          discountedPrice: 80.99,
          rating: 5,
        },
        {
          id: 18,
          name: "Souris Gaming Haute Précision",
          imageUrl: "/image/explore7.png",
          discountPercentage: 40,
          originalPrice: 59.99,
          discountedPrice: 35.99,
          rating: 4,
        },
        {
          id: 19,
          name: "Casque Audio Sans Fil Premium",
          imageUrl: "/image/explorer1.png",
          discountPercentage: 20,
          originalPrice: 199.99,
          discountedPrice: 159.99,
          rating: 4,
        },
        {
          id: 20,
          name: "Smartphone Haut de Gamme 128GB",
          imageUrl: "/image/explorer2.png",
          discountPercentage: 15,
          originalPrice: 899.99,
          discountedPrice: 764.99,
          rating: 5,
        },
        {
          id: 21,
          name: "Montre Connectée Étanche",
          imageUrl: "/image/explorer3.png",
          discountPercentage: 30,
          originalPrice: 249.99,
          discountedPrice: 174.99,
          rating: 3,
        },
        {
          id: 22,
          name: "Enceinte Bluetooth Portable",
          imageUrl: "/image/explore4.png",
          discountPercentage: 25,
          originalPrice: 129.99,
          discountedPrice: 97.49,
          rating: 4,
        },
        {
          id: 23,
          name: "Clavier Mécanique RGB",
          imageUrl: "/image/explore6.png",
          discountPercentage: 10,
          originalPrice: 89.99,
          discountedPrice: 80.99,
          rating: 5,
        },
        {
          id: 24,
          name: "Souris Gaming Haute Précision",
          imageUrl: "/image/explore7.png",
          discountPercentage: 40,
          originalPrice: 59.99,
          discountedPrice: 35.99,
          rating: 4,
        },
      ]);
      setLoading(false);
    }, 2000);*/
    //getProductsExplore();
  }, []);

  // Add event listeners to document for better dragging experience

  const skeletonProducts = Array(6).fill({ loading: true });

  return (
    <div className="relative px-4 py-8 w-[100vw] xl:w-7xl">
      <h2 className="text-2xl font-bold mb-6">Explore tous nos produits</h2>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col items-center min-[300px]:grid min-[380px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-5">
          {(loading ? skeletonProducts : products).map((product, index) => (
            <ProductCard
              ref={index === product.length - 1 ? lastCarElementRef : null}
              key={loading ? index : product._id}
              product={loading ? { ...product, id: index } : product}
            />
          ))}
          {(loading || lolo) && (
            <>
              <div className="flex justify-center items-center py-8 col-span-2 xl:col-span-3 2xl:col-span-4 ">
                <LoadingComponent />
              </div>
            </>
          )}
          {/* {!hasMore && <div className="no-more">No more cars to load</div>} */}
        </div>
        {((!loading && products.length === 0) || !hasMore) && !lolo && (
          <div className=" w-full no-results mt-6 text-center text-gray-500 col-span-2">
            Aucun autre produit trouvé
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;

// Dans votre application principale, vous devrez peut-être ajouter:
// <style>{scrollbarHideStyles}</style>
