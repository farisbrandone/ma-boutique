"use client";
import React from "react";

import { CarouselSlide } from "@/app/actions/dashboard/carouselAPI/route";
import Sidebar from "@/component-home/home-body1/Sidebar";
import CarouselInfinite from "@/component-home/home-body1/CarousselInfinite";

const HomeBodyPage = ({ slides }: { slides: CarouselSlide[] }) => {
  return (
    <div className="page-container w-[100vw] xl:w-7xl">
      <Sidebar />
      <div className="main-content">
        <CarouselInfinite slides={slides} />
        {/* Autres contenus de la page peuvent être ajoutés ici */}
      </div>
    </div>
  );
};

export default HomeBodyPage;
