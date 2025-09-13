"use client";
import React from "react";

import CountdownTimer from "./component/TimeDisplay";

export function HeaderBody2Comp2() {
  const saleEndDate = new Date("2025-07-05T23:59:59");
  return (
    <div className="flex items-center gap-[30px] ">
      {/*   <p className="text-[20px] font-bold ">SOLDES</p> */}
      <CountdownTimer targetDate={saleEndDate} />
    </div>
  );
}
