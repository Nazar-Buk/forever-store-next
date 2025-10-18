"use client";

import { useContext, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { ShopContext } from "@/context/ShopContext";

import Skeleton from "./Skeleton";

const ProductItem = ({ id, images, price, name, setSize }) => {
  const { productId } = useParams(); // потім треба буде коли буде бек і база даних
  const { currency } = useContext(ShopContext);

  const [isImgLoad, setIsImgLoad] = useState(true);

  return (
    <Link
      onClick={() => productId && setSize("")}
      className="product-card"
      href={`/product/${id}`}
    >
      <div className="wrap-product-card__img">
        {/* <img src={images[0]?.url} alt="Product picture" /> */}

        {isImgLoad && <Skeleton />}
        <Image
          src={images[0]?.url}
          alt={name || "Product picture"}
          // width={400}
          // height={400}
          fill // будь з тим акуратгий, fill робить <Image> абсолютно позиціонованим (position: absolute;)
          // Тому його батьківський контейнер повинен мати:
          // position: relative;
          // і фіксовані пропорції (aspect-ratio або фіксовану висоту).
          className="product-card__img"
          quality={70}
          loading="lazy"
          onLoad={() => setIsImgLoad(false)}
          sizes="(max-width: 600px) 50vw, (max-width: 1250px) 33vw, 25vw"
        />
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
