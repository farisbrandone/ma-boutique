import { productState } from "@/app/panier/page";
import React, { ChangeEvent, useState } from "react";

interface QuantityProps {
  setProductDataState: React.Dispatch<React.SetStateAction<productState[]>>;
  productDataState: productState[];
  index: number;
}

export default function Quantity({
  setProductDataState,
  productDataState,
  index,
}: QuantityProps) {
  const [qte, setQte] = useState(productDataState[index].quantity);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setQte(val);
    setProductDataState((prev) => {
      prev[index].quantity = val;
      return [...prev];
    });
  };

  return (
    <input
      value={qte}
      type="number"
      onChange={handleChange}
      minLength={2}
      className="w-[40px] px-1 py-0 "
    />
  );
}
