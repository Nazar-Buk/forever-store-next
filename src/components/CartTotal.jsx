"use client";

import { useContext } from "react";
import { ShopContext } from "@/context/ShopContext";
import Title from "@/components/Title";

const CartTotal = ({ allCartProducts }) => {
  const { currency, delivery_fee, cartItems } = useContext(ShopContext);

  const getCartAmount = () => {
    let totalAmount = 0;

    for (const items in cartItems) {
      let itemInfo = allCartProducts?.find((product) => product._id === items);

      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (e) {}
      }
    }
    return totalAmount;
  };

  return (
    <section className="cart-total">
      <div className="cart-total__body">
        <Title text1="CART " text2="TOTALS" />
        <div className="cart-totals__info">
          <div className="info__item">
            <div className="info__name">Subtotal</div>
            <div className="info__price">
              {currency}
              {getCartAmount()}.00
            </div>
          </div>
          <div className="info__item">
            <div className="info__name">Shipping Fee</div>
            <div className="info__price">
              {currency} {delivery_fee}.00
            </div>
          </div>
          <div className="info__item">
            <div className="info__name">
              <b>Total</b>
            </div>
            <div className="info__price">
              {currency}{" "}
              {getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}.00
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartTotal;
