"use client";

import { useContext, useEffect, useState, useRef } from "react";
import debounce from "lodash/debounce";
// import { Link, useNavigate } from "react-router-dom";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

import { ShopContext } from "@/context/ShopContext";
import { assets } from "../../../../public/assets/assets";
import Title from "@/components/Title";
import CartTotal from "@/components/CartTotal";
import Loader from "@/components/Loader";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const Cart = () => {
  // const navigate = useNavigate();
  const router = useRouter();

  const {
    currency,
    setCheckedSize,
    setCartData,
    cartData,
    setIncreaseCartQuantity,
    isAuthenticated,
  } = useContext(ShopContext);

  //  створюємо функцію один раз
  const debouncedSendQuantityRef = useRef();

  const [loadingState, setLoadingState] = useState({
    getCartDataLoading: true,
    clearCartLoading: false,
  });

  const getCartData = async () => {
    try {
      setLoadingState((prev) => ({ ...prev, getCartDataLoading: true }));

      const response = await axios.get(backendUrl + "/api/cart/list", {
        withCredentials: true,
      });

      if (response.data.success) {
        setCartData(response.data.cart);
        setLoadingState((prev) => ({ ...prev, getCartDataLoading: false }));
      } else {
        toast.error(response.data.message);
        setLoadingState((prev) => ({ ...prev, getCartDataLoading: false }));
      }
    } catch (error) {
      console.log(error, "error");
      setLoadingState((prev) => ({ ...prev, getCartDataLoading: false }));
      toast.error(error.message);
    } finally {
      setLoadingState((prev) => ({ ...prev, getCartDataLoading: false }));
    }
  };

  const sendQuantity = async (productId, size, quantity) => {
    try {
      const response = await axios.patch(
        backendUrl + "/api/cart/update",
        {
          productId,
          size,
          quantity,
        },
        {
          withCredentials: true,
        }
      );

      if (!response.data.success) {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error, "error");
      toast.error(error.message);
    }
  };

  // ✅ Ініціалізуємо debounce лише один раз
  if (!debouncedSendQuantityRef.current) {
    debouncedSendQuantityRef.current = debounce(
      (itemId, size, quantity) => sendQuantity(itemId, size, quantity),
      500
    );
  }

  const updateQuantity = (
    productId,
    size,
    quantity,
    itemId,
    actionType,
    qtyForCondition = null
  ) => {
    setCartData((prev) => {
      let updatedCartProducts = prev.items.map((item) => {
        if (item._id === itemId && item.size === size) {
          return { ...item, quantity };
        }

        return item;
      });

      if (!quantity) {
        updatedCartProducts = updatedCartProducts.filter(
          (item) => item?.quantity !== 0
        );
      }

      const updatedCart = { ...prev, items: [...updatedCartProducts] };

      if (!isAuthenticated) {
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      }

      return updatedCart;
    });

    if (isAuthenticated) {
      if (actionType === "minus" && qtyForCondition < 1) {
        return;
      } else {
        debouncedSendQuantityRef.current(productId, size, quantity);
      }
    }
  };

  const clearCart = async () => {
    try {
      setLoadingState((prev) => ({ ...prev, clearCartLoading: true }));

      const response = await axios.delete(backendUrl + "/api/cart/clear", {
        withCredentials: true,
      });

      if (response.data.success) {
        setCartData({});
        setLoadingState((prev) => ({ ...prev, clearCartLoading: false }));

        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error, "error");
      toast.error(error.message);
      setLoadingState((prev) => ({ ...prev, clearCartLoading: false }));
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      getCartData();
      setIncreaseCartQuantity(0);
    } else {
      setCartData(JSON.parse(localStorage.getItem("cart")) || { items: [] });
      setLoadingState((prev) => ({ ...prev, getCartDataLoading: false }));
    }
  }, [isAuthenticated]);

  const isLoading =
    loadingState.getCartDataLoading || loadingState.clearCartLoading;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <section className="cart-page">
          {cartData?.items?.length ? (
            <div className="cart__container">
              <div className="cart__body">
                <div className="wrap-title-remove-all">
                  <Title text1="ВАША " text2="КОРЗИНА" />
                  <button
                    onClick={() => {
                      if (isAuthenticated) {
                        clearCart();
                      } else {
                        localStorage.removeItem("cart");
                        setCartData({});
                      }
                    }}
                  >
                    Видалити всі
                  </button>
                </div>

                {cartData?.items.map((item, index) => {
                  const { product } = item;

                  return (
                    <div key={item._id} className="cart__product">
                      <Link
                        href={`/product/${product._id}`}
                        onClick={() => setCheckedSize(item?.size)}
                        className="wrap-image-details"
                      >
                        <div className="wrap-cart__product-img">
                          {/* <img
                            src={product?.images[0].url}
                            alt="product image"
                          /> */}
                          <Image
                            src={product?.images[0].url}
                            alt="product image"
                            fill
                            quality={80}
                            loading="eager"
                            sizes="(max-width: 768px) 30vw, (max-width: 1920px) 20vw"
                            priority
                          />
                        </div>
                        <div className="cart__product-details">
                          <p className="details__name">{product?.name}</p>
                          <div className="wrap-details__price-size">
                            <p className="details__price">
                              {currency} {item?.priceAtAdd * item?.quantity}
                            </p>
                            {item?.size !== "nosize" && (
                              <div className="details__size">{item?.size}</div>
                            )}
                          </div>
                        </div>
                      </Link>
                      <div className="wrap-qty-trash">
                        <div className="wrap-qty-input">
                          <label htmlFor={`qty-${index}`}>Кількість:</label>
                          <div className="wrap-btns-input">
                            <div
                              onClick={() => {
                                const quantity =
                                  item.quantity - 1 > 1 ? item.quantity - 1 : 1;

                                const qtyForCondition = item.quantity - 1;

                                updateQuantity(
                                  product._id,
                                  item?.size,
                                  quantity,
                                  item._id,
                                  "minus",
                                  qtyForCondition
                                );
                              }}
                              className="decrease"
                            >
                              <span>-</span>
                            </div>
                            <input
                              id={`qty-${index}`}
                              className="qty-input"
                              type="number"
                              min={1}
                              readOnly={true}
                              // defaultValue={item.quantity}
                              value={item.quantity}
                              // onChange={(e) => {
                              //   const { value } = e.target;
                              //   value === "" || value === 0
                              //     ? null
                              //     : updateQuantity(
                              //         item._id,
                              //         item.size,
                              //         Number(value)
                              //       );
                              // }}
                            />
                            <div
                              onClick={() => {
                                const quantity = item.quantity + 1;

                                updateQuantity(
                                  product._id,
                                  item?.size,
                                  quantity,
                                  item._id,
                                  "plus"
                                );
                              }}
                              className="increase"
                            >
                              +
                            </div>
                          </div>
                        </div>
                        <div className="wrap-trash-icon">
                          <img
                            onClick={() => {
                              updateQuantity(
                                product._id,
                                item.size,
                                0,
                                item._id,
                                "single-remove"
                              );
                            }}
                            src={assets.bin_icon}
                            alt="delete icon"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="cart-total-box">
                <CartTotal allCartProducts={cartData?.items} />
                <button onClick={() => router.push("/place-order")}>
                  Оформити замовлення
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-cart-box">
              <h1>Ваша корзина пуста!</h1>
              <div className="wrap-empty-img">
                <img src={assets.empty_cart} alt="empty card icon" />
              </div>
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
                <button>Сторінка з товарами</button>
              </Link>
            </div>
          )}
        </section>
      )}
    </>
  );
};

export default Cart;
