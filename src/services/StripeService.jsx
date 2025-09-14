"use client";

import { useState, useEffect, useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

import { ShopContext } from "@/context/ShopContext";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const StripeService = () => {
  const { backendUrl, stripeProductData } = useContext(ShopContext);

  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    // Приклад що має бути в корзині для старйпу (можна ще щось додавати)
    // const cart = [
    //   { name: "T-shirt", price: 2000, quantity: 1, image: "https://example.com/hat.png" },
    //   { name: "Hat", price: 1500, quantity: 2, image: "https://example.com/hat.png" },
    // ];

    const cart = stripeProductData.map((item) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.images?.[0].url,
    }));

    try {
      fetch(`${backendUrl}/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    } catch (error) {
      console.log(error, "error");
    }
  }, [stripeProductData]);
  return (
    <div>
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ clientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default StripeService;
