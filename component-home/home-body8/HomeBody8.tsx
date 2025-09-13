import { url } from "inspector";
import Image from "next/image";
import React from "react";

const dataservices = [
  {
    name: "LIVRAISON RAPIDE ET GRATUITE",
    description:
      "livraison gratuite pour toutes commandes supérieur à 10 000 FCFA",
    urlImage: "/image/icon-delivery.png",
  },
  {
    name: "24/7 SERVICE CLIENT",
    description: "Assistance clientèle 24/7",
    urlImage: "/image/Icon-customer.png",
  },
  {
    name: "GARANTIE DE REMBOURSEMENT",
    description: "Nous retournons l'argent dans les 30 jours",
    urlImage: "/image/Icon-secure.png",
  },
];

export function HomeBody8() {
  return (
    <div className="mt-[20px] flex items-center justify-evenly flex-wrap gap-y-5 w-full mb-[20px] ">
      {dataservices.map((val, index) => (
        <div
          className="max-w-[200px] flex flex-col items-center gap-2 "
          key={index}
        >
          <div className="flex flex-col items-center">
            <Image
              src={val.urlImage}
              width={40}
              height={40}
              alt={""}
              className="border-[4px] border-[#686666] bg-black rounded-full"
            />
            <div className="flex flex-col gap-2 items-center">
              <p className="text-xl font-bold text-center "> {val.name} </p>
              <p className="text-[16px] text-center "> {val.description} </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
