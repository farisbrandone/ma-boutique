"use client";
import { CarouselSlide } from "@/app/actions/dashboard/carouselAPI/service";
import Header from "./HeaderHome";
import HomeBody1 from "./home-body1/HomeBody1";
import { HomeBody2 } from "./home-body2/HomeBody2";
import HomeBody3 from "./home-body3/HomeBody3";
import HomeBody4 from "./home-body4/HomeBody4";
import HomeBody5 from "./home-body5/HomeBody5";
import HomeBody6 from "./home-body6/HomeBody6";
import HomeBody7 from "./home-body7/HomeBody7";
import { HomeBody8 } from "./home-body8/HomeBody8";
import ProductTrue from "@/models/ProductTrue";

interface HomeComponentProps {
  slides1: CarouselSlide[];
  product2: ProductTrue[];
  productsBestSellers4: ProductTrue[];
  productExplore6: ProductTrue[];
  productNew7: ProductTrue[];
}

function HomeComponent({
  slides1,
  product2,
  productsBestSellers4,
  productExplore6,
  productNew7,
}: HomeComponentProps) {
  return (
    <div className="flex flex-col  gap-2 ">
      <Header />
      <div className="flex flex-col ">
        <HomeBody1 slides={slides1} />
        <HomeBody2 products={product2} />
        <HomeBody3 />
        <HomeBody4 products={productsBestSellers4} />
        <HomeBody5 />
        <HomeBody6 products={productExplore6} />
        <HomeBody7 products={productNew7} />
        <HomeBody8 />
      </div>
    </div>
  );
}

export default HomeComponent;
