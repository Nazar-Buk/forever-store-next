"use client";

import { useContext, useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShopContext } from "@/context/ShopContext";

import { assets } from "../../../../public/assets/assets";
import Title from "@/components/Title";
import CartTotal from "@/components/CartTotal";

const Cart = () => {
  // const navigate = useNavigate();
  const router = useRouter();

  const {
    products,
    currency,
    cartItems,
    updateQuantity,
    removeAllCartProducts,
    setCheckedSize,
  } = useContext(ShopContext);

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

    console.log(tempData, "tempData");
    setCartData(tempData);
  }, [cartItems]);

  return (
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
              const productData = products.find(
                (product) => product._id === item._id
              );

              // const checkedSize = item.size;
              return (
                <div key={index} className="cart__product">
                  <Link
                    href={`/product/${item._id}`}
                    // state={checkedSize} // Так передавати стейт через Link !!!

                    onClick={() => setCheckedSize(item.size)}
                    className="wrap-image-details"
                  >
                    <div className="wrap-cart__product-img">
                      <img
                        src={productData?.images[0].url}
                        alt="product image"
                      />
                    </div>
                    <div className="cart__product-details">
                      <p className="details__name">{productData.name}</p>
                      <div className="wrap-details__price-size">
                        <p className="details__price">
                          {currency} {productData.price * item.quantity}
                        </p>
                        <div className="details__size">{item.size}</div>
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
                        onClick={() => updateQuantity(item._id, item.size, 0)}
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
            <CartTotal />
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
          <Link href="/collection">
            <button>Go To Product Page</button>
          </Link>
        </div>
      )}
    </section>
  );
};

export default Cart;
