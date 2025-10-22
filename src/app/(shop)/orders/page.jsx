"use client";

import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";

import { ShopContext } from "@/context/ShopContext";
import Loader from "@/components/Loader";

import Title from "@/components/Title";

const statuses = {
  pending: {
    title: "В обробці",
    color: "orange",
  },
  shipped: { title: "В дорозі", color: "blue" },
  delivered: {
    title: "Доставлено",
    color: "#00a625",
  },
  canceled: {
    title: "Скасовано",
    color: "red",
  },
};

const Orders = () => {
  const { backendUrl, currency } = useContext(ShopContext);

  const [orders, setOrders] = useState([]);
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [loadingState, setLoadingState] = useState({
    getOrdersLoading: true,
  });

  const getOrders = async () => {
    try {
      setLoadingState((prev) => ({ ...prev, getOrdersLoading: true }));

      const response = await axios.get(
        backendUrl + "/api/order/get-user-orders",
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setLoadingState((prev) => ({ ...prev, getOrdersLoading: false }));
        setOrders(response.data.orders);
      }
    } catch (error) {
      setLoadingState((prev) => ({ ...prev, getOrdersLoading: false }));
      console.log(error, "error");
      toast.error(error?.response?.data?.message);
    }
  };

  const toggleAccordion = (id) => {
    setIsOpenDetails((prev) => (prev === id ? false : id));
  };

  useEffect(() => {
    getOrders();
  }, []);

  const loading = loadingState.getOrdersLoading;

  if (loading) return <Loader />;

  return (
    <section className="orders-page">
      <div className="orders__container">
        <div className="orders__body">
          <Title text1="МОЇ " text2="ЗАМОВЛЕННЯ" />
          <div className="orders__table">
            {orders.map((order) => {
              const date = new Date(order.createdAt);

              return (
                <div key={order._id}>
                  <div className="orders__order">
                    <div className="order__description">
                      <div className="warp-img-description">
                        <img
                          src={order?.items[0]?.product?.images[0].url}
                          alt="order image"
                        />
                      </div>
                      <div className="description-box">
                        <div className="description__title">№ {order._id}</div>
                        <div className="description__info">
                          <div className="info__price">
                            {order.totalPrice}
                            {currency}
                          </div>
                        </div>
                        <div className="wrap-description__date">
                          <div className="description__date">Створено: </div>
                          <p> {date.toLocaleDateString("uk-UA")}</p>
                        </div>
                      </div>
                    </div>
                    <div className="wrap-status-order-btn-box">
                      <div className="order__status">
                        <div
                          className="status__circle"
                          style={{
                            backgroundColor: statuses[order.status].color,
                          }}
                        ></div>
                        <div className="status__text">
                          {statuses[order.status].title}
                        </div>
                      </div>
                      <div className="order__btn">
                        <button
                          onClick={() => {
                            toggleAccordion(order._id);
                          }}
                          className="secondary-btn"
                        >
                          {`${
                            isOpenDetails === order._id
                              ? "Приховати"
                              : "Показати"
                          } `}{" "}
                          Деталі
                        </button>
                      </div>
                    </div>
                  </div>
                  {isOpenDetails === order._id && (
                    <div className="order__derails">
                      {order.items.map((item, ind) => (
                        <div key={ind} className="details__products">
                          <div className="wrap-img">
                            <img
                              src={item?.product?.images[0]?.url}
                              alt={item?.product?.name}
                            />
                          </div>
                          <div className="product-name">
                            {item?.product?.name.length > 30
                              ? `${item?.product?.name.slice(0, 30)}...`
                              : item?.product?.name}
                          </div>
                          {item?.size !== "nosize" && (
                            <div className="product-size">{item?.size}</div>
                          )}

                          <div className="product-price">
                            {item?.priceAtAdd}
                            {currency}/1шт.
                          </div>
                        </div>
                      ))}

                      <div className="details__address">
                        <b className="address-item">Адреса доставки:</b>
                        <div className="address-item">
                          Пошта:{" "}
                          <b>{order?.shippingAddress?.postName.optionLabel}</b>,
                        </div>
                        <div className="address-item">
                          Область: <b>{order?.shippingAddress?.region}</b>,
                        </div>
                        <div className="address-item">
                          Населений пункт: <b>{order?.shippingAddress?.city}</b>
                          ,
                        </div>
                        <div className="address-item">
                          Відділення №:{" "}
                          <b>{order?.shippingAddress?.postBranchName}</b>,
                        </div>
                        <div className="address-item">
                          Телефон: <b>{order?.shippingAddress?.phone}</b>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Orders;
