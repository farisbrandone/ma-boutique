"use client";

import Header from "@/component-home/HeaderHome";
import { HomeBody8 } from "@/component-home/home-body8/HomeBody8";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { useScrollHand } from "@/hook/useScrollHand";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const dataValue = [
  {
    icon: "/image/about-services.png",
    valueText: 10.5,
    description: "Les vendeurs actifs sur notre site",
  },
  {
    icon: "/image/about-services-2.png",
    valueText: 33,
    description: "Les produits vendu en moyenne par mois",
  },
  {
    icon: "/image/about-services-3.png",
    valueText: 45.5,
    description: "Les clients actif sur notre site",
  },
  {
    icon: "/image/about-services-4.png",
    valueText: 25,
    description: "Chiffre d'affaires annuel sur notre site",
  },
];

const dataProfil = [
  {
    image: "/image/about-profil-1.png",
    name: "Tom Cruise",
    work: "Fondateur et PDG",
  },
  {
    image: "/image/about-profil-2.png",
    name: "Emma Watson",
    work: "Directrice géneral",
  },
  {
    image: "/image/about-profil-3.png",
    name: "Will Smith",
    work: "Concepteur produit",
  },
];

export default function page() {
  const {
    scrollContainerRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useScrollHand();

  const {
    scrollContainerRef: scrollContainerRef2,
    handleMouseDown: handleMouseDown2,
    handleMouseMove: handleMouseMove2,
    handleMouseUp: handleMouseUp2,
  } = useScrollHand();

  return (
    <div className="mx-auto flex flex-col items-center w-screen xl:max-w-7xl min-h-screen p-0">
      <Header />

      <div className="flex flex-col gap-5 w-full mt-[90px] ">
        <div className="flex  flex-col-reverse items-center  md:grid md:grid-cols-2 p-4">
          <div className="flex flex-col">
            <p className="text-[25px] font-bold mb-[20px] ">Our Story</p>
            <p>
              <span>
                Launced in 2015, Exclusive is South Asia’s premier online
                shopping makterplace with an active presense in Bangladesh.
                Supported by wide range of tailored marketing, data and service
                solutions, Exclusive has 10,500 sallers and 300 brands and
                serves 3 millioons customers across the region.
              </span>{" "}
              <br />
              <span>
                Exclusive has more than 1 Million products to offer, growing at
                a very fast. Exclusive offers a diverse assotment in categories
                ranging from consumer.
              </span>
            </p>
          </div>
          <Image
            alt=""
            src="/image/about-portrait-two-african-females.png"
            width={500}
            height={500}
            className="object-cover w-full"
          />
        </div>
        <div
          className="flex  justify-center gap-2 sm:flex-row overflow-x-auto mt-4 scrollbar-hide"
          ref={scrollContainerRef2}
          onMouseDown={handleMouseDown2}
          onMouseMove={handleMouseMove2}
          onMouseUp={handleMouseUp2}
          onMouseLeave={handleMouseUp2}
        >
          {dataValue.map((val, index) => (
            <div
              className={`w-[200px] h-[200px] flex flex-col items-center justify-center border border-solid border-[#7e7d7db9]  ${
                index === 1 ? "bg-[#bd4444] text-white " : ""
              } `}
            >
              <div className="flex flex-col items-center p-2">
                <Image src={val.icon} width={50} height={50} alt="" />
              </div>
              <AnimatedNumber start={0} end={val.valueText} />

              <p className="text-center">{val.description}</p>
            </div>
          ))}
        </div>
        <div
          className="flex flex-row items-center overflow-scroll mt-4 scrollbar-hide"
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {dataProfil.map((val) => (
            <CardProfil val={val} />
          ))}
        </div>

        <HomeBody8 />
      </div>
    </div>
  );
}

interface CardProfilProps {
  image: string;
  name: string;
  work: string;
}

function CardProfil({ val }: { val: CardProfilProps }) {
  return (
    <div className="flex flex-col  items-center w-full gap-3 overflow-x-auto scrollbar-hide ">
      <Image
        alt=""
        src={val.image}
        width={300}
        height={300}
        className="w-[300px] h-[500px] object-cover "
      />
      <p className="text-[20px] font-bold ">{val.name}</p>
      <p> {val.work} </p>
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-[35px] h-[35px] text-black ">
          <span className="icon-[prime--twitter] text-[25px] text-black "></span>
        </div>
        <div className="flex items-center justify-center w-[35px] h-[35px] text-black ">
          <span className="icon-[lucide--instagram] text-[25px] text-black "></span>
        </div>
        <div className="flex items-center justify-center w-[35px] h-[35px] text-black ">
          <span className="icon-[uit--linkedin-alt] text-[25px] text-black"></span>
        </div>
      </div>
    </div>
  );
}
