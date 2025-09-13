import Header from "@/component-home/HeaderHome";
import HomeBody1 from "@/component-home/home-body1/HomeBody1";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import React from "react";
import ProductPage from "./ProductPage";
import { CarouselSlide } from "@/app/actions/dashboard/carouselAPI/service";
import HomeBodyPage from "./HomeBodyPage";

interface HomeComponentProps {
  slides1: CarouselSlide[];
}

export default function ProductMainPage({ slides1 }: HomeComponentProps) {
  return (
    <div className="w-full flex flex-col  gap-2 mx-auto  items-center ">
      <Header />
      <div className="flex flex-col w-full items-center ">
        <ScrollToTopButton />
        <HomeBodyPage slides={slides1} />
        <ProductPage />
      </div>
    </div>
  );
}
