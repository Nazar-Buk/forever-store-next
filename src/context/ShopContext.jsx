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
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkedSize, setCheckedSize] = useState("");

  const currency = "$";
  const delivery_fee = 10; // вартість доставки
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const desiredSizesOrder = ["S", "M", "L", "XL", "XXL"];

  const addToCart = async (itemId, size) => {
    if (!size) {
      // тут використовується !size, бо я хочу щоб іф виконався коли прийшла пуста стрічка,
      // як би було просто size, то не показувалося б повідомлення та не зупинялася фн addToCart
      toast.error("Choose size");

      return; // зупиняє фн addToCart
    }

    let cartData = structuredClone(cartItems); // так робиться глибока копія об`єкта, без зміни оригіналу.

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1; // додаємо кількість товарів конкретного розміру
      } else {
        cartData[itemId][size] = 1; // додаємо товар нового розміру
      }

      toast.success("Product was added");
    } else {
      cartData[itemId] = {}; // додаємо новий запис (товар)
      cartData[itemId][size] = 1; // додаємо новий розмір до щойно зробленого товару

      toast.success("Product was added");
    }

    // КОЖНІ КВАДРАТНІ ДУЖКИ ЦЕ ЯК КЛЮЧ ОБ'ЄКТА, ПІСЛЯ НИХ МОЖНА СТАВИТИ : (умовно)

    ////////////////// отримаємо щось таке
    // {
    //   101: { S: 2, M: 1 }, // Товар із id 101 має 2 розміри S та 1 розмір M
    //   102: { L: 3 }        // Товар із id 102 має 3 розміри L
    // }
    //////////////////

    //////////////////
    // ось структура коли є ще кольори
    // cartData[itemId][color][size]
    // addToCart(101, "blue", "L");
    // Результат:
    // cartItems = {
    //   101: {
    //     red: {
    //       M: 2,
    //       S: 1
    //     },
    //     blue: {
    //       L: 1
    //     }
    //   }
    // };
    //////////////////

    setCartItems(cartData);
  };
  //////////////////////////////////////////////////

  const updateCartProduct = (oldSize, newSize, productId) => {
    let cartData = structuredClone(cartItems);

    if (cartData[productId][oldSize]) {
      cartData[productId][newSize] = cartData[productId][oldSize];

      if (oldSize !== newSize) {
        delete cartData[productId][oldSize];
      }

      setCartItems(cartData);
      toast.success("Product was updated");
    } else {
      toast.error("Product wasn't updated");
    }
  };
  //////////////////////////////////////////////////

  const getCartCount = () => {
    let totalCount = 0;

    for (const items in cartItems) {
      // бігаємо по найстаршому по ієрархії об'єкту,  items -- об'єкт який в середині (в даному випадку це id  продукта)
      for (const item in cartItems[items]) {
        // проходжуся по об'єкту що нижче по ієрархії,  cartItems[items] -- пробігаю по об'єкту ключом якого є id  продукта;
        // item -- конкретний об'єкт що є на кожній ітерації

        try {
          if (cartItems[items][item] > 0) {
            // cartItems[items][item] -- кількість товарів даного розміру,
            // саме їх ми і бужемо рахувати, щоб дізнатися скільки одиниць товарів у нас буде
            totalCount = totalCount + cartItems[items][item];
          }
        } catch (error) {}
      }
    }

    return totalCount;
  };

  const updateQuantity = (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    cartData[itemId][size] = quantity;

    setCartItems(cartData);
  };

  const removeAllCartProducts = () => {
    setCartItems({});
  };

  const getProductsData = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(backendUrl + "/api/product/list");

      if (response.data.success) {
        setIsLoading(false);

        setProducts(response.data.products);
        toast.success(response.data.message);
      } else {
        setIsLoading(false);

        toast.error(response.data.message);
      }
    } catch (error) {
      setIsLoading(false);

      console.log(error, "error");
      toast.error(error.message);
    }
  };

  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  // const checkAuth = async () => {
  //   try {
  //     const response = await axios.get(backendUrl + "/api/user/check-auth", {
  //       withCredentials: true, // обов'язково, щоб кука була передана на сервер
  //     });

  //     console.log(response, "response from checkAuth");

  //     if (response.data.success) {
  //       setIsAuthenticated(true);
  //       toast.success(response.data.message);
  //     }
  //   } catch (error) {
  //     console.log("Auth check failed:", error);
  //     setIsAuthenticated(false);
  //     // toast.error(error.data.message);
  //   }
  // };

  // console.log(isAuthenticated, "isAuthenticated CONTEXT");

  // useEffect(() => {
  //   checkAuth();
  // }, []);

  useEffect(() => {
    getProductsData();
  }, []);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    removeAllCartProducts,
    updateCartProduct,
    backendUrl,
    desiredSizesOrder,
    isLoading,
    setIsLoading,
    // isAuthenticated,
    checkedSize,
    setCheckedSize,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
