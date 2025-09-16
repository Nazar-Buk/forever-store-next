"use client";

import { useEffect, useContext, useState } from "react";
import Link from "next/link";

import { ShopContext } from "@/context/ShopContext";

const LiqPayService = ({ setLoadingState }) => {
  const { backendUrl, getCartAmount } = useContext(ShopContext);

  const [isButtonShown, setIsButtonShown] = useState(false);

  const downloadLiqPayForm = async (signal) => {
    try {
      setLoadingState((prev) => ({ ...prev, loadingLiqPay: true }));

      const response = await fetch(`${backendUrl}/liqpay/embedded-pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: getCartAmount(),
          description: `Замовлення #${Date.now()}`,
          order_id: Date.now(),
        }),
        signal,
      });

      const { data, signature } = await response.json();

      // Підключаємо LiqPay скрипт один раз
      if (!window.LiqPayCheckout) {
        const script = document.createElement("script");
        script.src = "https://static.liqpay.ua/libjs/checkout.js";
        script.async = true;
        script.onload = () => initLiqPay(data, signature);
        document.body.appendChild(script);
      } else {
        initLiqPay(data, signature);
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Запит до LiqPay скасовано !");
      } else {
        console.error("LiqPay payment error:", error);
      }
    } finally {
      setLoadingState((prev) => ({ ...prev, loadingLiqPay: false }));
    }
  };

  const initLiqPay = (data, signature) => {
    window.LiqPayCheckout.init({
      data,
      signature,
      embedTo: "#liqpay-embed-container",
      mode: "embed",
      language: "uk",
    })
      .on("liqpay.callback", (result) => {
        console.log("liqpay.callback:", result);
        if (result.result === "ok") {
          setIsButtonShown(true);
        }
      })
      .on("liqpay.ready", () => {
        console.log("LiqPay ready");
        setLoadingState((prev) => ({ ...prev, loadingLiqPay: false }));
      })
      .on("liqpay.close", () => console.log("Checkout closed"));
  };

  useEffect(() => {
    const abortController = new AbortController(); // Може зупинити запит
    const signal = abortController.signal; // Прилінковує до запитів котрі треба зупинити

    downloadLiqPayForm(signal);

    return () => {
      // Зупиняє запит коли компонент розмонтовується
      abortController.abort();
    };
  }, []);
  return (
    <>
      <div id="liqpay-embed-container"></div>
      {isButtonShown && (
        <div className="liqpay-go-to-product-box">
          <Link
            href={{
              pathname: "/collection",
              query: {
                page: 1,
                limit: 10,
                category: "",
                subCategory: "",
                priceFrom: "",
                priceTo: "",
                sort: "date_new",
                search: "",
              },
            }}
          >
            <button>Go To Product Page</button>
          </Link>
        </div>
      )}
    </>
  );
};

export default LiqPayService;
