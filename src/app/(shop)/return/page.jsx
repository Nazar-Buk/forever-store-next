"use client";

import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import axios from "axios";

import { ShopContext } from "@/context/ShopContext";
import Loader from "@/components/Loader";
import { assets } from "../../../../public/assets/assets";

const Return = () => {
  const { backendUrl, isAuthenticated, setCartData } = useContext(ShopContext);
  const searchParams = useSearchParams();

  const [status, setStatus] = useState("");

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      fetch(`${backendUrl}/session-status?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => setStatus(data.status));
    }
  }, [sessionId]);

  const clearCart = async () => {
    try {
      const response = await axios.delete(backendUrl + "/api/cart/clear", {
        withCredentials: true,
      });

      if (response.data.success) {
        setCartData({});
      }
    } catch (error) {
      console.log(error, "error");
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (status === "paid" || status === "succeeded" || status === "complete") {
      if (isAuthenticated) {
        clearCart();
      } else {
        localStorage.removeItem("cart");
        setCartData({});
      }
    }
  }, [status, isAuthenticated]);

  return (
    <>
      {!status && <Loader />}

      <section className="success-page">
        <div className="success__container ">
          <div className="success-payment-box">
            <h1>✅ Оплата успішна!</h1>
            <img
              className="success-payment"
              src={assets.success_payment}
              alt="success payment"
            />

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
        </div>
      </section>
    </>
  );
};

export default Return;
