"use client";

import { useContext } from "react";
import { ShopContext } from "@/context/ShopContext";

import Title from "@/components/Title";

const Orders = () => {
  const { products, currency } = useContext(ShopContext);
  console.log(products, "products");

  return (
    <section className="orders-page">
      <div className="orders__container">
        <div className="orders__body">
          <Title text1="MY " text2="ORDERS" />
          <div className="orders__table">
            {products.slice(1, 4).map((item) => (
              <div key={item._id} className="orders__order">
                <div className="order__description">
                  <div className="warp-img-description">
                    <img src={item.images[0]} alt="order image" />
                  </div>
                  <div className="description-box">
                    <div className="description__title">{item.name}</div>
                    <div className="description__info">
                      <div className="info__price">
                        {currency}
                        {item.price}
                      </div>
                      <div className="info__quantity">Quantity: 1</div>
                      <div className="info__size">Size: L</div>
                    </div>
                    <div className="wrap-description__date">
                      <div className="description__date">Date: </div>
                      <p> 25, May, 2024</p>
                    </div>
                  </div>
                </div>
                <div className="wrap-status-order-btn-box">
                  <div className="order__status">
                    <div className="status__circle"></div>
                    <div className="status__text">Ready to ship</div>
                  </div>
                  <div className="order__btn">
                    <button className="secondary-btn">Track Order</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Orders;
