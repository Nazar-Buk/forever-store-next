"use client";

import { useEffect, useRef, useContext } from "react";

import { ShopContext } from "@/context/ShopContext";

const LiqPayService = () => {
  const { backendUrl, getCartAmount } = useContext(ShopContext);
  const scriptLoaded = useRef(false); // гарантує, що скрипт підключиться лише один раз

  const downloadLiqPayForm = async () => {
    try {
      const response = await fetch(`${backendUrl}/liqpay/embedded-pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: getCartAmount(),
          description: `Замовлення #${Date.now()}`,
          order_id: Date.now(),
        }),
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
      console.error("LiqPay payment error:", error);
    } finally {
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
      .on("liqpay.callback", (result) =>
        console.log("liqpay.callback:", result)
      )
      .on("liqpay.ready", () => console.log("LiqPay ready"))
      .on("liqpay.close", () => console.log("Checkout closed"));
  };

  useEffect(() => {
    if (scriptLoaded.current) return; // якщо скрипт вже підключений, виходимо
    scriptLoaded.current = true;

    downloadLiqPayForm();
  }, []);
  return <div id="liqpay-embed-container"></div>;
};

export default LiqPayService;
