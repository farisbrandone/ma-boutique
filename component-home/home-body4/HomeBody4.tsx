import { fetchBestSellers } from "@/app/actions/dashboard/productAPI/route";
import ProductTrue from "@/models/ProductTrue";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";

interface Product {
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
}> = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const router = useRouter();
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
      className="relative flex-shrink-0 w-64 h-80 bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 mx-2"
      onClick={() => router.push(`/productPage/${product._id}`)}
    >
      {/* Badge de rendement */}
      <div className="absolute top-0 left-0 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-br-lg rounded-tl-lg">
        {product.discount}% OFF
      </div>

      {/* Image du produit */}
      <div className="h-48 w-full overflow-hidden">
        <img
          src={product.imageUrl[0]}
          alt={product.name}
          className="w-full h-full object-cover"
          draggable="false"
        />
      </div>

      {/* Détails du produit */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-2 truncate">
          {product.name}
        </h3>

        <div className="flex items-center mb-2">
          <span className="text-lg font-bold text-gray-900 mr-2">
            $
            {(product.price - (product.discount / 100) * product.price).toFixed(
              2
            )}
          </span>
          <span className="text-sm text-gray-500 line-through">
            ${product.price.toFixed(2)}
          </span>
        </div>

        {/* Rating */}
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-4 h-4 ${
                star <= 5 ? "text-yellow-400" : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
    </div>
  );
};

const HomeBody4 = ({ products }: { products: ProductTrue[] }) => {
  const [productsBestSellers, setProductsBestSellers] = useState<ProductTrue[]>(
    []
  );
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);
  useEffect(() => {
    /*  const getProductsBestSeller = async () => {
     
      setProductsBestSellers(product);
    }; */
    // Simuler un chargement asynchrone
    /*setTimeout(() => {
      setProducts([
        {
          id: 1,
          name: "Casque Audio Sans Fil Premium",
          imageUrl: "/image/meilleur-vente1.png",
          discountPercentage: 20,
          originalPrice: 199.99,
          discountedPrice: 159.99,
          rating: 4,
        },
        {
          id: 2,
          name: "Smartphone Haut de Gamme 128GB",
          imageUrl: "/image/meilleur-vente2.png",
          discountPercentage: 15,
          originalPrice: 899.99,
          discountedPrice: 764.99,
          rating: 5,
        },
        {
          id: 3,
          name: "Montre Connectée Étanche",
          imageUrl: "/image/meilleur-vente3.png",
          discountPercentage: 30,
          originalPrice: 249.99,
          discountedPrice: 174.99,
          rating: 3,
        },
        {
          id: 4,
          name: "Enceinte Bluetooth Portable",
          imageUrl: "/image/meilleur-vente4.png",
          discountPercentage: 25,
          originalPrice: 129.99,
          discountedPrice: 97.49,
          rating: 4,
        },
        {
          id: 5,
          name: "Clavier Mécanique RGB",
          imageUrl: "/image/nouveaute1.png",
          discountPercentage: 10,
          originalPrice: 89.99,
          discountedPrice: 80.99,
          rating: 5,
        },
        {
          id: 6,
          name: "Souris Gaming Haute Précision",
          imageUrl: "/image/nouveaute2.png",
          discountPercentage: 40,
          originalPrice: 59.99,
          discountedPrice: 35.99,
          rating: 4,
        },
      ]);
      setLoading(false);
    }, 2000);*/
    /*  getProductsBestSeller(); */
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;

    setIsDragging(true);
    setStartX(e.clientX);
    setScrollLeftStart(scrollContainerRef.current.scrollLeft);

    // Change cursor to grabbing
    scrollContainerRef.current.style.cursor = "grabbing";
    scrollContainerRef.current.style.userSelect = "none";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;

    e.preventDefault();
    const x = e.clientX;
    const walk = (x - startX) * 1.5; // Adjust multiplier for scroll speed

    scrollContainerRef.current.scrollLeft = scrollLeftStart - walk;
  };

  const handleMouseUp = () => {
    if (!scrollContainerRef.current) return;

    setIsDragging(false);
    scrollContainerRef.current.style.cursor = "grab";
    scrollContainerRef.current.style.removeProperty("user-select");
  };

  // Add event listeners to document for better dragging experience
  useEffect(() => {
    const handleMouseUpOutside = () => {
      if (isDragging) {
        handleMouseUp();
      }
    };

    document.addEventListener("mouseup", handleMouseUpOutside);
    return () => {
      document.removeEventListener("mouseup", handleMouseUpOutside);
    };
  }, [isDragging]);
  const skeletonProducts = Array(6).fill({ loading: true });

  return (
    <div className="relative px-4 py-8 max-w-[100vw] xl:max-w-7xl">
      <h2 className="text-2xl font-bold mb-6">Meilleurs ventes</h2>

      <div className="relative">
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="overflow-x-auto cursor-grab pb-6 scrollbar-hide"
        >
          <div className="flex space-x-4">
            {(loading ? skeletonProducts : products).map((product, index) => (
              <ProductCard
                key={loading ? index : product._id}
                product={loading ? { ...product, id: index } : product}
              />
            ))}
          </div>
        </div>
      </div>
      <div
        className="text-xl  md:text-2xl bg-[#bd4444] text-white font-bold w-[250px] py-2 mx-auto text-center mt-[15px] "
        onClick={() => router.push("/productPage")}
      >
        Visiter tous les produits
      </div>
    </div>
  );
};

// Ajoutez ceci à votre fichier CSS global ou dans un style tag
const scrollbarHideStyles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

export default HomeBody4;

// Dans votre application principale, vous devrez peut-être ajouter:
// <style>{scrollbarHideStyles}</style>
