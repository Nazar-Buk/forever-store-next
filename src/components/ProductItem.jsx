"use client";

import { useContext } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { ShopContext } from "@/context/ShopContext";

const ProductItem = ({ id, images, price, name, setSize }) => {
  const params = useParams();
  console.log(params, "params from prodict item");
  const { productId } = useParams(); // потім треба буде коли буде бек і база даних
  const { currency } = useContext(ShopContext);

  return (
    <Link
      onClick={() => productId && setSize("")}
      className="product-card"
      href={`/product/${id}`}
    >
      <div className="wrap-product-card__img">
        <img src={images[0]?.url} alt="Product picture" />
      </div>
      <p className="product-card__name">{name}</p>
      <p className="product-card__price">
        {currency}
        {price}
      </p>
    </Link>
  );
};

export default ProductItem;
