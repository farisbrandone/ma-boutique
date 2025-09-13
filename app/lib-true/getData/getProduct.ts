"use server";

import dbConnect, { convertDocToObj } from "@/app/lib/mongodb";
import Product, { productType } from "@/models/Product";
import { unstable_cache as cache } from "next/cache";
export async function getProductAndFeature() {
  await dbConnect();
  const products = await Product.find().lean();
  const featuredProducts = products.filter(
    (product) => product.isFeatured === true
  );
  return {
    featuredProducts: featuredProducts.map(convertDocToObj<productType>),
    products: products.map(convertDocToObj<productType>),
  };
}

export const getCachedData = cache(
  async () => {
    return getProductAndFeature();
  },
  ["my-data-cache-key"], // cache key parts
  { revalidate: 3600 } // cache for 1 hour
);
