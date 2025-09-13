import Image from "next/image";
import React from "react";

export default function HomeBody5() {
  return (
    <div className="max-w-7xl w-full bg-black  p-3 sm:p-5 flex items-center gap-2 overflow-hidden mt-[30px] ">
      <div className="flex flex-col gap-3">
        <p className="text-[16px] text-[#00ff66]">Categories </p>
        <div className="flex flex-col gap-0">
          <p className="text-white text-wrap max-w-[350px] text-xl md:text-2xl  lg:text-3xl">
            Explore des expériences musicales incroyable
          </p>
        </div>
        {/* ajouter compte à rebour si en solde*/}
        <div className="flex items-center p-2 gap-[15px] ">
          {[
            { j: "05", t: "Days" },
            { j: "23", t: "Hours" },
            { j: 59, t: "Minutes" },
            { j: "35", t: "seconds" },
          ].map((val, index) => (
            <div
              className="flex items-center justify-center bg-white text-black w-[55px] h-[55px] sm:w-[65px] sm:h-[65px] rounded-full "
              key={index}
            >
              <div className="flex flex-col items-center leading-4">
                <p className="text-[16px] sm:text-[18px] font-bold ">
                  {" "}
                  {val.j}{" "}
                </p>
                <p className="text-[16px] sm:text-[18px]"> {val.t} </p>
              </div>
            </div>
          ))}
        </div>
        <button className="text-center text-white bg-[#00ff66] p-2 rounded-md  ">
          Achete Maintenant
        </button>
      </div>
      {/*  <div className=" bg-transparent min-w-[150px] min-h-[200px] blur-[200] overflow-hidden p-2  ml-auto   "> */}
      <Image
        src="/image/incroyable1.png"
        alt="Image"
        width={500}
        height={300}
        className="w-[200] h-full md:w-[350px]  lg:w-[500px]    bg-transparent blurShadow ml-auto"
      />
      {/* </div> */}
    </div>
  );
}
