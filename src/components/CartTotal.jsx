"use client";

import { useContext } from "react";
import { ShopContext } from "@/context/ShopContext";
import Title from "@/components/Title";

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

  const cartAmount = getCartAmount();

  return (
    <section className="cart-total">
      <div className="cart-total__body">
        <Title text1="РАЗОМ " text2="В КОРЗИНІ" />
        <div className="cart-totals__info">
          <div className="info__item">
            <div className="info__name">Разом</div>
            <div className="info__price">
              {cartAmount}.00
              {currency}
            </div>
          </div>
          <div className="info__item">
            <div className="info__name">Вартість доставки</div>
            <div className="info__price">
              {delivery_fee}.00 {currency}
            </div>
          </div>
          <div className="info__item">
            <div className="info__name">
              <b>Загалом</b>
            </div>
            <div className="info__price">
              {cartAmount === 0 ? 0 : cartAmount + delivery_fee}.00 {currency}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartTotal;
