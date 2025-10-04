"use client";

import { useContext, useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

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
    cartItems,
    updateQuantity,
    removeAllCartProducts,
    setCheckedSize,
    setStripeProductData,
    allCartProducts,
    setAllCartProducts,
    setCodProductData,
  } = useContext(ShopContext);

  const [isLoadingState, setIsLoadingState] = useState({
    isProductsLoading: true,
  });

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];

    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({
            _id: items, // aaaab -- id-шка
            size: item, // S or M... розмір буквою
            quantity: cartItems[items][item], // кількість продуктів у даному розмірі
          });
        }
      }
    }

    setCartData(tempData);
  }, [cartItems]);

  const fetchProductData = async (productId) => {
    try {
      const response = await axios.post(backendUrl + "/api/product/single", {
        productId,
        // productId: "67f50cbae3550da216e4c393",
      });

      if (response.data.success) {
        return { data: response.data.product, error: null };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.log(error, "error");
      return {
        data: {},
        error: error?.response?.data?.message || error?.message,
      };
    }
  };

  const getAllCartProducts = async () => {
    const promises = cartData.map((item) => fetchProductData(item._id));
    const results = await Promise.allSettled(promises);

    // відфільтровуємо успішні запити
    const successfulProducts = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value.data);

    // відфільтровуємо НЕ успішні запити
    const failedProducts = results
      .filter((result) => result.status === "rejected")
      .map((result) => result.reason);

    return successfulProducts;
  };

  // ⚡️ завантажуємо всі продукти, коли змінюється cartData
  useEffect(() => {
    setIsLoadingState((prev) => ({ ...prev, isProductsLoading: true }));

    if (!cartData.length) {
      setIsLoadingState((prev) => ({ ...prev, isProductsLoading: false }));
      return;
    }

    const fetchAllCartProducts = async () => {
      try {
        const cartProducts = await getAllCartProducts();
        setAllCartProducts(cartProducts);
        setIsLoadingState((prev) => ({ ...prev, isProductsLoading: false }));
      } catch (error) {
        console.log(error, "error");
        setIsLoadingState((prev) => ({ ...prev, isProductsLoading: false }));
      }
    };

    fetchAllCartProducts();
  }, [cartData.length]);

  useEffect(() => {
    const paymentProducts = cartData.map((itemCartData) => {
      const itemAllCartProducts = allCartProducts.find(
        (item) => item._id === itemCartData._id
      );

      return {
        ...itemAllCartProducts,
        quantity: itemCartData.quantity,
      };
    });

    setStripeProductData(paymentProducts);
    setCodProductData(paymentProducts);
  }, [cartData, allCartProducts]);

  const isLoading = isLoadingState.isProductsLoading;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <section className="cart-page">
          {cartData.length ? (
            <div className="cart__container">
              <div className="cart__body">
                <div className="wrap-title-remove-all">
                  <Title text1="Your " text2="CART" />
                  <button onClick={() => removeAllCartProducts()}>
                    Remove all
                  </button>
                </div>

                {cartData.map((item, index) => {
                  const productData = allCartProducts?.find(
                    (product) => product._id === item._id
                  );

                  // const checkedSize = item.size;
                  return (
                    <div key={index} className="cart__product">
                      <Link
                        href={`/product/${item._id}`}
                        onClick={() => setCheckedSize(item?.size)}
                        className="wrap-image-details"
                      >
                        <div className="wrap-cart__product-img">
                          <img
                            src={productData?.images[0].url}
                            alt="product image"
                          />
                        </div>
                        <div className="cart__product-details">
                          <p className="details__name">{productData?.name}</p>
                          <div className="wrap-details__price-size">
                            <p className="details__price">
                              {currency} {productData?.price * item?.quantity}
                            </p>
                            {item?.size !== "nosize" && (
                              <div className="details__size">{item?.size}</div>
                            )}
                          </div>
                        </div>
                      </Link>
                      <div className="wrap-qty-trash">
                        <div className="wrap-qty-input">
                          <label htmlFor={`qty-${index}`}>Quantity:</label>
                          <div className="wrap-btns-input">
                            <div
                              onClick={() => {
                                const quantity =
                                  item.quantity - 1 > 1 ? item.quantity - 1 : 1;

                                updateQuantity(item._id, item.size, quantity);
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

                                updateQuantity(item._id, item.size, quantity);
                              }}
                              className="increase"
                            >
                              +
                            </div>
                          </div>
                        </div>
                        <div className="wrap-trash-icon">
                          <img
                            onClick={() =>
                              updateQuantity(item._id, item.size, 0)
                            }
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
                <CartTotal allCartProducts={allCartProducts} />
                <button onClick={() => router.push("/place-order")}>
                  Proceed to checkout
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-cart-box">
              <h1>Your Cart Is Empty !</h1>
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
                <button>Go To Product Page</button>
              </Link>
            </div>
          )}
        </section>
      )}
    </>
  );
};

export default Cart;
