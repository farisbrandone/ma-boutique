"use client";
import React from "react";
import CarouselInfinite from "./CarousselInfinite";
import Sidebar from "./Sidebar";
import { CarouselSlide } from "@/app/actions/dashboard/carouselAPI/service";

const HomeBody1 = ({ slides }: { slides: CarouselSlide[] }) => {
  return (
    <div className="page-container max-w-[100vw] xl:max-w-7xl">
      <Sidebar />
      <div className="main-content">
        <CarouselInfinite slides={slides} />
        {/* Autres contenus de la page peuvent être ajoutés ici */}
      </div>
    </div>
  );
};

export default HomeBody1;
