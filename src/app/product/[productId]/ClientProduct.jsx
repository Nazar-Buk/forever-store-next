"use client";

import { useState, useContext } from "react";
import { ShopContext } from "../../../context/ShopContext";

export default function ClientProduct() {
  const [count, setCount] = useState(0);
  const { currency, delivery_fee } = useContext(ShopContext);
  console.log(currency, "currency");
  console.log(delivery_fee, "delivery_fee");
  // const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // console.log(backendUrl, "backendUrl"); // https://api.example.com

  return (
    <>
      <h2>client page</h2>
      <button onClick={() => setCount((prev) => prev + 1)}>
        press the button
      </button>
      <p>{count}</p>
    </>
  );
}
