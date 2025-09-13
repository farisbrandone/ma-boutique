import React from "react";
import { HeaderBody2 } from "./header-body2/HeaderBody2";
import HorizontalProductScroll from "./body2/Body2ProductCardRemise";
import ProductTrue from "@/models/ProductTrue";

export function HomeBody2({ products }: { products: ProductTrue[] }) {
  return (
    <div className="px-2 max-w-[100vw] xl:max-w-7xl  ">
      <HeaderBody2 />

      <HorizontalProductScroll products={products} />
    </div>
  );
}
