"use client";

import Header from "@/component-home/HeaderHome";
import Quantity from "@/component-panier/Quantity";
import Image from "next/image";
import React, { useState } from "react";

const productData = [
  {
    image: "",
    name: "LCD Monitor",
    price: 0,
    quantity: 1,
    total: 0,
  },
  {
    image: "",
    name: "HD Gamepad",
    price: 30,
    quantity: 10,
    total: 3000,
  },
  {
    image: "",
    name: "Freeze",
    price: 50,
    quantity: 8,
    total: 500,
  },
];

export interface productState {
  image: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export default function page() {
  const [productDataState, setProductDataState] = useState<productState[]>([
    ...productData,
  ]);

  return (
    <div className="mx-auto flex flex-col  w-screen xl:max-w-7xl min-h-screen p-0">
      <Header />

      <div className="flex flex-col items-center self-center">
        <div className="grid grid-cols-4 gap-4 content-center  mt-[100px] p-10 ">
          <div className="flex flex-col gap-2">
            <p className="text-[16px] font-bold ">Product</p>
            {productData.map((val, index) => (
              <div className="flex items-center gap-2" key={index}>
                <Image
                  src={val.image}
                  width={50}
                  height={50}
                  alt=""
                  className="w-[50px] h-[50px] object-cover "
                />
                <p className="text-[16px] max-md:hidden"> {val.name} </p>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[16px] font-bold text-center ">Price</p>
            {productData.map((val, index) => (
              <p
                key={index}
                className="text-[16px] text-center h-[50px] flex justify-center items-center"
              >
                {" "}
                ${val.price}{" "}
              </p>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[16px] font-bold ">Quantity</p>
            {productData.map((_, index) => (
              <div className="h-[50px] flex items-center justify-center  ">
                <Quantity
                  index={index}
                  productDataState={productDataState}
                  setProductDataState={setProductDataState}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[16px] font-bold ">Subtotal</p>
            {productData.map((_, index) => (
              <p className="text-[16px] h-[50px] flex items-center justify-center ">
                {" "}
                {productDataState[index].price *
                  productDataState[index].quantity}{" "}
              </p>
            ))}
          </div>
        </div>

        <button className="bg-white ml-2.5 text-black text-[16px] py-2  border-[2px] border-solid border-[#777777c7] w-[200px] self-start ">
          Retour à la boutique
        </button>

        <div className="mt-[50px] self-end border-[2px] border-solid border-[#777777c7] flex flex-col gap-1.5 p-2 mr-2   ">
          <p className="font-bold text-[18px] ">Card Total</p>
          <div className="text-[16px] flex justify-between items-center  ">
            <p> Total</p>
            <p>
              ${" "}
              {productDataState
                .map((val) => val.price * val.quantity)
                .reduce((val1, val2) => val1 + val2, 0)}{" "}
            </p>
          </div>
          <p className="text-[16px] ">.......................</p>

          <button className="bg-[#bd4444] text-white text-[16px] px-3 py-2  ">
            Passer commande
          </button>
        </div>
      </div>
    </div>
  );
}
