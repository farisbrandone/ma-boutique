import React from "react";

import { API_URL } from "../actions/dashboard/productAPI/service";
import ProductMainPage from "@/components-productPage/ProductMainPage";

export default async function page() {
  const response = await fetch(`${API_URL}/admin/carouselSlideData`);
  const result = await response.json();
  console.log(result);
  const slides1 = result.slides;
  console.log(result);
  return (
    <div className="w-full flex flex-col  gap-2 items-center ">
      <ProductMainPage slides1={slides1} />
    </div>
  );
}
