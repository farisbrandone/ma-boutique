import { productType } from "@/models/Product";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Rating } from "react-simple-star-rating";

export default function ProductItem({
  product,
  addToCartHandler,
}: {
  product: productType;
  addToCartHandler: (product: productType) => void;
}) {
  const ratingChanged = () => {};

  return (
    <div className="card">
      <Link href={`/product/${product.slug}`}>
        <span>
          <Image
            src={product.image}
            alt={product.name}
            className="rounded shadow object-cover w-full h-64 object-top"
            height="400"
            width="400"
          />
        </span>
      </Link>
      <div className="flex flex-col items-center justify-center p-5">
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-lg">{product.name}</h2>
        </Link>
        <p className="mb-2">{product.brand}</p>

        <Rating
          iconsCount={5}
          onClick={ratingChanged}
          size={24}
          fillColor="#ffd700"
          initialValue={product.rating}
          readonly={false}
          /* Available Props */
        />

        <p>{product.price}₹</p>
        <button
          className="primary-button"
          type="button"
          onClick={() => addToCartHandler(product)}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
