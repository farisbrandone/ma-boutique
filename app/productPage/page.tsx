import Header from "@/component-home/HeaderHome";
import HomeBody1 from "@/component-home/home-body1/HomeBody1";
import ProductPage from "@/components-productPage/ProductPage";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import React from "react";

import { API_URL } from "../actions/dashboard/productAPI/route";
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
