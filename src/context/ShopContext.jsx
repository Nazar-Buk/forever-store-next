"use client";

import { createContext, useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";

// import { products } from "../assets/assets";

export const ShopContext = createContext(); // створюємо контекст

const ShopContextProvider = (props) => {
  // const [searchParams, setSearchParams] = useSearchParams(); // ця шляпа вміє працювати із адресною строкою
  const searchParams = useSearchParams(); // ця шляпа вміє працювати із адресною строкою

  const [search, setSearch] = useState("");

  useEffect(() => {
    const param = searchParams.get("search");
    setSearch(param || "");
  }, [searchParams]);

  const [showSearch, setShowSearch] = useState(false);
  // const [cartItems, setCartItems] = useState({});
  // const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState({
    isLoggedIn: true,
    role: "",
  });
  const [checkedSize, setCheckedSize] = useState("");

  // const currency = "$";
  const currency = "грн";
  const delivery_fee = 10; // вартість доставки
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const desiredSizesOrder = ["S", "M", "L", "XL", "XXL"];

  const [isSizesAvailable, setIsSizesAvailable] = useState(false);

  const [cartData, setCartData] = useState({});

  const getCartData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/cart/list", {
        withCredentials: true,
      });

      if (response.data.success) {
        setCartData(response.data.cart);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error, "error");
      // toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated.isLoggedIn) {
      getCartData();
    } else {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
      setCartData(storedCart);
    }
  }, [isAuthenticated]);

  //////////// Для прикладу ///////////////
  // const addToCart = async (itemId, size, isSizesAvailable) => {
  //   // Якщо товар без розмірів → ставимо ключ "nosize"
  //   const normalizedSize = size || "nosize";

  //   if (isSizesAvailable && !size) {
  //     // тут використовується !size, бо я хочу щоб іф виконався коли прийшла пуста стрічка,
  //     // як би було просто size, то не показувалося б повідомлення та не зупинялася фн addToCart
  //     toast.error("Choose size");

  //     return; // зупиняє фн addToCart
  //   }

  //   let cartData = structuredClone(cartItems); // так робиться глибока копія об`єкта, без зміни оригіналу.

  //   if (cartData[itemId]) {
  //     if (cartData[itemId][normalizedSize]) {
  //       cartData[itemId][normalizedSize] += 1; // додаємо кількість товарів конкретного розміру
  //     } else {
  //       cartData[itemId][normalizedSize] = 1; // додаємо товар нового розміру
  //     }

  //     toast.success("Product was added");
  //   } else {
  //     cartData[itemId] = {}; // додаємо новий запис (товар)
  //     cartData[itemId][normalizedSize] = 1; // додаємо новий розмір до щойно зробленого товару

  //     toast.success("Product was added");
  //   }

  //   // КОЖНІ КВАДРАТНІ ДУЖКИ ЦЕ ЯК КЛЮЧ ОБ'ЄКТА, ПІСЛЯ НИХ МОЖНА СТАВИТИ : (умовно)

  //   ////////////////// отримаємо щось таке
  //   // {
  //   //   101: { S: 2, M: 1 }, // Товар із id 101 має 2 розміри S та 1 розмір M
  //   //   102: { L: 3 }        // Товар із id 102 має 3 розміри L
  //   // }
  //   //////////////////

  //   //////////////////
  //   // ось структура коли є ще кольори
  //   // cartData[itemId][color][size]
  //   // addToCart(101, "blue", "L");
  //   // Результат:
  //   // cartItems = {
  //   //   101: {
  //   //     red: {
  //   //       M: 2,
  //   //       S: 1
  //   //     },
  //   //     blue: {
  //   //       L: 1
  //   //     }
  //   //   }
  //   // };
  //   //////////////////

  //   setCartItems(cartData);
  // };
  //////////////////////////////////////////////////

  const [increaseCartQuantity, setIncreaseCartQuantity] = useState(0);

  const getCartCount = () => {
    let totalCount = 0;
    totalCount = cartData?.items?.reduce(
      (acc, curr) => (acc += curr.quantity),
      0
    );

    if (!totalCount) {
      totalCount = 0;
    }

    totalCount += increaseCartQuantity;

    return totalCount;
  };

  const getCartAmount = () => {
    const allProducts = cartData?.items || [];
    const cartAmount = allProducts.reduce((acc, curr) => {
      return (acc += curr.priceAtAdd * curr.quantity);
    }, 0);

    return cartAmount;
  };

  useEffect(() => {
    getCartCount();
  }, [cartData]);

  const [stripeProductData, setStripeProductData] = useState([]);
  const [codProductData, setCodProductData] = useState([]);

  useEffect(() => {
    const allProducts = cartData?.items || [];

    const paymentProducts = allProducts.map((item) => {
      const { product } = item;

      return {
        ...product,
        quantity: item.quantity,
        price: item.priceAtAdd,
      };
    });

    setStripeProductData(paymentProducts);
    setCodProductData(paymentProducts);
  }, [cartData]);

  const value = {
    // products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    // cartItems,
    getCartCount,
    backendUrl,
    desiredSizesOrder,
    isLoading,
    setIsLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkedSize,
    setCheckedSize,
    isSizesAvailable,
    setIsSizesAvailable,
    stripeProductData,
    setStripeProductData,
    codProductData,
    setCodProductData,
    cartData,
    setCartData,
    setIncreaseCartQuantity,
    getCartAmount,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
