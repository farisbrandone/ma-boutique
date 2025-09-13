import { LetterIcon } from "@/component-contact/LetterIcon";
import { PhoneIcon } from "@/component-contact/PhoneIcon";
import Link from "next/link";
import React from "react";

export function FooterHome() {
  return (
    <div className="flex flex-col items-center bg-[#e9e8e8] text-black w-full border-t-2 border-[#0000007e] text-sm sm:text-[16px]  ">
      {/*  <div className="flex flex-col items-center mt-[10px] ">
        <p className="font-bold text-xl">Contact</p>
        <div className="flex max-sm:flex-col items-center gap-[5px]  lg:gap-[30px] flex-wrap text-[16px]">
          <p className="text-center">
            Douala: Rue D'Akwa Amberville / Yaoundé: Rue de la liberté
          </p>
          <p>Email: farisbrandone@yahoo.com</p>
          <p>{"Tel: (+237) 6 50 08 96 83"}</p>
        </div>
      </div>

      <div className="flex flex-col items-center mt-[20px] ">
        <p className="font-bold text-xl">Lien rapide</p>
        <div className="flex items-center justify-between flex-wrap text-[16px]  min-w-[250px] ">
          <Link href="/login" className="">
            Login
          </Link>
          <Link href="/home">Home</Link>
          <Link href="/">Accueil</Link>
        </div>
      </div> */}

      <div className="flex flex-col gap-3 items-center md:flex-row w-full xl:w-7xl justify-between p-1 max-sm:pl-2 ">
        <div className="hidden sm:flex flex-col gap-1 w-[200px] shrink-0 ">
          <p className="text-[25px] sm:text-[30px] ">MonShop</p>
          <p className="">Votre boutique en ligne</p>
        </div>

        <div className="flex  items-center justify-between w-full sm:hidden">
          <div className="flex flex-col gap-1 max-sm:self-start">
            <p className="text-[25px] sm:text-[30px] ">MonShop</p>
            <p className="">Votre boutique en ligne</p>
          </div>
          <div className="flex flex-col gap-0  sm:gap-1">
            <div className="flex  items-center  gap-2">
              <div className="flex items-center justify-center w-[35px] h-[35px] rounded-full bg-[#000]  ">
                <PhoneIcon
                  color="white"
                  className="text-[18px] sm:text-[22px] "
                />
              </div>
              <p className="sm:text-[16px] font-bold ">Appeler nous</p>
            </div>
            <div className="sm:text-[16px] flex-col ">
              <p className=" max-sm:hidden">
                Nous sommes disponible 24/7, 7 jours de la semaines
              </p>
              <p>Telephone: +237 6 50 08 96 83</p>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex flex-col gap-0  sm:gap-1 w-full">
          <div className="flex  items-center  gap-2">
            <div className="flex items-center justify-center w-[35px] h-[35px] rounded-full bg-[#000]  ">
              <PhoneIcon
                color="white"
                className="text-[18px] sm:text-[22px] "
              />
            </div>
            <p className="sm:text-[16px] font-bold ">Appeler nous</p>
          </div>
          <div className="sm:text-[16px] flex-col ">
            <p className=" max-sm:hidden">
              Nous sommes disponible 24/7, 7 jours de la semaines
            </p>
            <p>Telephone: +237 6 50 08 96 83</p>
          </div>
        </div>
        <div className="flex flex-col gap-0  sm:gap-1 w-full">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-[35px] h-[35px] rounded-full bg-[#000]  ">
              <LetterIcon
                color="white"
                className="text-[18px] sm:text-[22px] "
              />
            </div>
            <p className="sm:text-[16px] font-bold ">Ecriver nous</p>
          </div>
          <div className="sm:text-[16px] flex-col ">
            <div className=" flex flex-wrap items-center">
              <span>Remplissez notre </span>{" "}
              <Link href="/contact" className="underline px-1">
                formulaire
              </Link>{" "}
              <span>et nous vous contacterons dans les 24 heures.</span>
            </div>
            <p className="max-sm:hidden">Email: f.pamod@outlook.com</p>
            <p className="text-[16px] max-sm:hidden">
              Email: farisbrandone@yahoo.com
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center py-2  text-[#000] w-full mt-[10px] text-center ">
        Copyright PAMOD TECHNOLOGIE 2025. All right reserved
      </div>
    </div>
  );
}
