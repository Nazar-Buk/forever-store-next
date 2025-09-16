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

const StripeService = ({ setLoadingState }) => {
  const { backendUrl, stripeProductData } = useContext(ShopContext);

  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    // console.log("useEffect start");
    const abortController = new AbortController(); // Може зупинити запит
    const signal = abortController.signal; // Прилінковує до запитів котрі треба зупинити

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

    (async () => {
      try {
        setLoadingState((prev) => ({ ...prev, loadingStripe: true }));

        const response = await fetch(`${backendUrl}/create-checkout-session`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cart }),
          signal,
        });
        // Так було, я переробив .then і видалив його
        // .then((res) => res.json())
        // .then((data) => setClientSecret(data.clientSecret));

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Запит до Stripe скасовано !");
        } else {
          console.log(error, "error");
        }
      } finally {
        setLoadingState((prev) => ({ ...prev, loadingStripe: false }));
      }
    })();

    return () => {
      // Зупиняє запит коли компонент розмонтовується
      abortController.abort();
    };
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
