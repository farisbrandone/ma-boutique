"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiMinus,
  FiHeart,
  FiShare2,
  FiEye,
  FiZoomIn,
} from "react-icons/fi";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { productType } from "@/models/Product";
import ProductTrue from "@/models/ProductTrue";
import { OrderTrue } from "@/models/OrderTrue";
import { createOrder } from "@/app/actions/dashboard/orderAPI/route";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  rating: number;
  reviewCount: number;
  variants?: {
    color?: string[];
    size?: string[];
  };
  details?: string[];
}

interface ProductDisplayProps {
  product: ProductTrue;
  locale?: string;
  currency?: string;
}

const ProductDetails = ({
  product,
  locale = "en-US",
  currency = "USD",
}: ProductDisplayProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
          },
        },
      })
  );
  return (
    <QueryClientProvider client={queryClient}>
      <ProductDisplay product={product} />
    </QueryClientProvider>
  );
};

export default ProductDetails;

const ProductDisplay: React.FC<ProductDisplayProps> = ({
  product,
  locale = "en-US",
  currency = "USD",
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<
    Record<string, string>
  >({});
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const imagesContainerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const router = useRouter;
  // Format price
  const formattedPrice = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(product.price);

  const handleVariantChange = (type: string, value: string) => {
    setSelectedVariant((prev) => ({ ...prev, [type]: value }));
  };
  // Create a client instance that is preserved between component renders

  // Image navigation
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.imageUrl.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + product.imageUrl.length) % product.imageUrl.length
    );
  };

  // Touch handling for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextImage();
    }

    if (touchStart - touchEnd < -50) {
      prevImage();
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  // Rating display
  const renderRating = () => {
    const stars = [];
    const fullStars = 4; /* Math.floor(product.rating) */
    const hasHalfStar = true; /* product.rating % 1 >= 0.5 */

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }

    return (
      <div className="flex items-center mt-1">
        <div className="flex mr-1">{stars}</div>
        {/*  <span className="text-sm text-gray-500">({product.reviewCount})</span> */}
      </div>
    );
  };

  // Share functionality
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      toast.success("Commande ajouté avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de l'ajout de la commande");
    },
  });

  const createMyOrder = async () => {
    const totalAmount = product.price * quantity;

    const whatsappMessage = `Bonjour je souhaiterai passer la commande suivante : \n - Code produit chosit: ${
      product && product._id
    } \n - Nom produit: ${product.name} \n - Categorie: ${
      product.category
    } \n - Quantité: ${quantity} \n -Prix unitaire: ${
      product.price
    } \n - Montant total: ${totalAmount} `;
    const whatsappNumber = "+237655968956";
    // Formatte le numéro et encode le message pour l'URL
    const formattedWhatsappNumber = whatsappNumber.replace(/[\s\-\(\)]/g, "");
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${formattedWhatsappNumber}?text=${encodedMessage}`;

    const order: Omit<OrderTrue, "_id" | "createdAt" | "updatedAt"> = {
      product: product._id,
      quantity: quantity,
      customerInfo: {
        name: "",
        email: "",
        address: "",
      },
      status: "pending",
      totalAmount,
    };

    createOrderMutation.mutate(order);
    window.open(whatsappUrl);
    /*  window.location.href=whatsappUrl */
  };

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 animate-pulse">
          <div className="md:w-1/2 h-96 bg-gray-200 rounded-lg"></div>
          <div className="md:w-1/2 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-12 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Main Product Display - Row Layout for Medium+ Screens */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column - Product Images */}
        <div className="md:w-1/2">
          <div className="relative bg-white rounded-xl shadow-md overflow-hidden">
            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              aria-label={
                isWishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition shadow-md"
              onKeyDown={(e) =>
                handleKeyDown(e, () => setIsWishlisted(!isWishlisted))
              }
              tabIndex={0}
            >
              <FiHeart
                className={
                  isWishlisted ? "text-red-500 fill-current" : "text-gray-700"
                }
              />
            </button>

            {/* Main Image with Touch Support */}
            <div
              ref={imagesContainerRef}
              className="relative h-96 w-full overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              role="img"
              aria-label={`Product image ${currentImageIndex + 1} of ${
                product.imageUrl.length
              }`}
            >
              <Image
                src={product.imageUrl[currentImageIndex]}
                alt={product.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={currentImageIndex === 0}
              />

              {/* Navigation Arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                onKeyDown={(e) => handleKeyDown(e, prevImage)}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                aria-label="Previous image"
                tabIndex={0}
              >
                <FiChevronLeft className="text-gray-800 text-xl" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                onKeyDown={(e) => handleKeyDown(e, nextImage)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                aria-label="Next image"
                tabIndex={0}
              >
                <FiChevronRight className="text-gray-800 text-xl" />
              </button>

              {/* Zoom Indicator */}
              <button
                onClick={() => setShowQuickView(true)}
                onKeyDown={(e) =>
                  handleKeyDown(e, () => setShowQuickView(true))
                }
                className="absolute bottom-4 right-4 p-2 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                aria-label="Zoom image"
                tabIndex={0}
              >
                <FiZoomIn className="text-gray-800" />
              </button>
            </div>

            {/* Thumbnail Gallery */}
            <div
              className="flex p-4 space-x-2 overflow-x-auto"
              role="list"
              aria-label="Product thumbnails"
            >
              {product.imageUrl.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  onKeyDown={(e) =>
                    handleKeyDown(e, () => setCurrentImageIndex(index))
                  }
                  className={`flex-shrink-0 w-16 h-16 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    currentImageIndex === index
                      ? "border-blue-500 scale-105"
                      : "border-transparent hover:border-gray-300"
                  }`}
                  aria-label={`View image ${index + 1}`}
                  aria-current={currentImageIndex === index}
                  tabIndex={0}
                  role="listitem"
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover rounded"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div className="md:w-1/2">
          <div className="bg-white rounded-xl shadow-md p-6 h-full">
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>

            {/* Price and Rating */}
            <div className="flex justify-between items-center mt-2">
              <span className="text-xl font-semibold text-blue-600">
                {formattedPrice}
              </span>
              {renderRating()}
            </div>

            {/* Description */}
            <p className="mt-4 text-gray-600">{product.description}</p>

            {/* Variants */}
            {/*   {product.variants && (
              <div className="mt-6 space-y-4">
                {product.variants.color && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Color
                    </h3>
                    <div
                      className="flex flex-wrap gap-2"
                      role="radiogroup"
                      aria-label="Color options"
                    >
                      {product.variants.color.map((color) => (
                        <button
                          key={color}
                          onClick={() => handleVariantChange("color", color)}
                          onKeyDown={(e) =>
                            handleKeyDown(e, () =>
                              handleVariantChange("color", color)
                            )
                          }
                          className={`w-10 h-10 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform ${
                            selectedVariant.color === color
                              ? "border-blue-500 scale-110"
                              : "border-gray-200 hover:border-gray-400"
                          }`}
                          style={{ backgroundColor: color }}
                          aria-label={`Color ${color}`}
                          aria-checked={selectedVariant.color === color}
                          role="radio"
                          tabIndex={0}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {product.variants.size && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Size
                    </h3>
                    <div
                      className="flex flex-wrap gap-2"
                      role="radiogroup"
                      aria-label="Size options"
                    >
                      {product.variants.size.map((size) => (
                        <button
                          key={size}
                          onClick={() => handleVariantChange("size", size)}
                          onKeyDown={(e) =>
                            handleKeyDown(e, () =>
                              handleVariantChange("size", size)
                            )
                          }
                          className={`px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                            selectedVariant.size === size
                              ? "bg-blue-500 text-white border-blue-500"
                              : "bg-white border-gray-200 hover:border-gray-400"
                          }`}
                          aria-label={`Size ${size}`}
                          aria-checked={selectedVariant.size === size}
                          role="radio"
                          tabIndex={0}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )} */}

            {/* Quantity Selector */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Quantity
              </h3>
              <div className="flex items-center w-32">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  onKeyDown={(e) =>
                    handleKeyDown(e, () =>
                      setQuantity((prev) => Math.max(1, prev - 1))
                    )
                  }
                  className="p-2 border border-gray-300 rounded-l-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  tabIndex={0}
                >
                  <FiMinus />
                </button>
                <span
                  className="flex-grow py-2 text-center border-t border-b border-gray-300"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  onKeyDown={(e) =>
                    handleKeyDown(e, () => setQuantity((prev) => prev + 1))
                  }
                  className="p-2 border border-gray-300 rounded-r-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Increase quantity"
                  tabIndex={0}
                >
                  <FiPlus />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-3">
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
                aria-label="Add to cart"
                tabIndex={0}
                onClick={() => createMyOrder()}
              >
                Add to Cart
              </button>

              <div className="flex space-x-3">
                <button
                  onClick={handleShare}
                  onKeyDown={(e) => handleKeyDown(e, handleShare)}
                  className="flex-1 flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Share product"
                  tabIndex={0}
                >
                  <FiShare2 className="mr-2" />
                  Share
                </button>
                <button
                  onClick={() => setShowQuickView(true)}
                  onKeyDown={(e) =>
                    handleKeyDown(e, () => setShowQuickView(true))
                  }
                  className="flex-1 flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Quick view"
                  tabIndex={0}
                >
                  <FiEye className="mr-2" />
                  Quick View
                </button>
              </div>
            </div>

            {/* Product Details */}
            {/*   {product.details && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Product Details
                </h3>
                <ul className="space-y-2">
                  {product.details.map((detail, index) => (
                    <li key={index} className="flex">
                      <span className="text-gray-600">• {detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )} */}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowQuickView(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Product quick view"
        >
          <div
            className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid md:grid-cols-2 gap-8 p-8">
              <div className="relative h-[500px]">
                <Image
                  src={product.imageUrl[currentImageIndex]}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{product.name}</h2>
                <div className="mt-2 text-2xl font-semibold text-blue-600">
                  {formattedPrice}
                </div>
                {renderRating()}
                <p className="mt-4 text-gray-600">{product.description}</p>

                {/*   {product.details && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Details
                    </h3>
                    <ul className="space-y-1">
                      {product.details.map((detail, index) => (
                        <li key={index} className="text-gray-600">
                          • {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                )} */}

                <button
                  className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
                  aria-label="Add to cart from quick view"
                  onClick={() => createMyOrder()}
                >
                  Add to Cart
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowQuickView(false)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
              aria-label="Close quick view"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export { ProductDisplay };
