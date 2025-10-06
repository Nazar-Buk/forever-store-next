"use client";

import { useContext } from "react";
import { ShopContext } from "@/context/ShopContext";
import Title from "@/components/Title";

const CartTotal = ({ allCartProducts }) => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

  return (
    <section className="cart-total">
      <div className="cart-total__body">
        <Title text1="РАЗОМ " text2="В КОРЗИНІ" />
        Разом у корзині
        <div className="cart-totals__info">
          <div className="info__item">
            <div className="info__name">Разом</div>
            <div className="info__price">
              {currency}
              {getCartAmount()}.00
            </div>
          </div>
          <div className="info__item">
            <div className="info__name">Вартість доставки</div>
            <div className="info__price">
              {currency} {delivery_fee}.00
            </div>
          </div>
          <div className="info__item">
            <div className="info__name">
              <b>Загалом</b>
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
