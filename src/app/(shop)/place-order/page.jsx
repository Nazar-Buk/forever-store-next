// place-order це те саме що і checkout
"use client";

import { useState, useContext, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
// import { DevTool } from "@hookform/devtools";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";

import Title from "@/components/Title";
import CartTotal from "@/components/CartTotal";
import Loader from "@/components/Loader";
import CODForm from "@/components/forms/CODForm";
import StripeService from "@/services/StripeService";
import LiqPayService from "@/services/LiqPayService";
import { ShopContext } from "@/context/ShopContext";

import { assets } from "../../../../public/assets/assets";

const schema = yup.object({
  firstName: yup.string().required("Це поле обовʼязкове!"),
  lastName: yup.string().required("Це поле обовʼязкове!"),
  // email: yup
  //   .string()
  //   // .email("Email format is incorrect!") до сраки така валідація
  //   .required("Це поле обовʼязкове!")
  //   .matches(
  //     /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/,
  //     "Email format is incorrect!"
  //   ),
  // street: yup.string().required("Це поле обовʼязкове!"),
  postName: yup.object({
    optionLabel: yup.string(),
    optionValue: yup.string().required("Виберіть Пошту!"),
  }),
  region: yup.string().required("Це поле обовʼязкове!"),
  state: yup.string().required("Це поле обовʼязкове!"),
  // zip_code: yup
  //   .number()
  //   .typeError("Поштовий індекс має бути додатнім числом!")
  //   .required("Це поле обовʼязкове!"),
  branchNumber: yup.string().required("Це поле обовʼязкове!"),
  phone: yup
    .string()
    .matches(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      "Неправильний формат номеру. Використовуйте такий формат '0965151515'"
    )
    // .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .required("This field is required!"),
});

const paymentMethodTitles = {
  stripe: { text1: "Stripe ", text2: "ДАНІ" },
  liqpay: { text1: "LiqPay ", text2: "ДАНІ" },
  cod: { text1: "Дані ", text2: "Для Доставки" },
};

const PlaceOrder = () => {
  // const paymentRef = useRef(null);

  const scrollToPayment = () => {
    // paymentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    // window.scrollTo({ top: 0, behavior: "smooth" });

    const el = document.querySelector(".payment-page"); // або свій клас/ід
    if (!el) return;

    const top = window.pageYOffset + el.getBoundingClientRect().top; // точна позиція елемента на сторінці
    window.scrollTo({
      top,
      behavior: "smooth",
    });
  };

  const router = useRouter();
  const {
    backendUrl,
    // codProductData,
    // getCartAmount,
    setCartData,
    isAuthenticated,
  } = useContext(ShopContext);

  const [loadingState, setLoadingState] = useState({
    loadingStripe: false,
    loadingLiqPay: false,
    getCartDataLoading: true,
    createOrderLoading: false,
  });

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      // email: "",
      // street: "",
      postName: {
        optionLabel: "",
        optionValue: "",
      },
      region: "",
      state: "",
      // zip_code: "",
      branchNumber: "",
      phone: "",
      payment_method: "cod",
    },
    resolver: yupResolver(schema),
  });

  const { register, control, handleSubmit, formState, watch } = form;
  const { errors, isDirty, isValid, isSubmitting } = formState;

  const checkPaymentMethodType = watch("payment_method");

  const clearCart = async () => {
    try {
      const response = await axios.delete(backendUrl + "/api/cart/clear", {
        withCredentials: true,
      });

      if (response.data.success) {
        setCartData({});
      }
    } catch (error) {
      console.log(error, "error");
      toast.error(error.message);
    }
  };

  const onSubmit = async (data) => {
    console.log(data, "Form Submitted!");

    const createOrder = async () => {
      try {
        setLoadingState((prev) => ({ ...prev, createOrderLoading: true }));

        const response = await axios.post(
          backendUrl + "/api/order/add",
          {
            shippingAddress: {
              postBranchName: data.branchNumber,
              firstName: data.firstName,
              lastName: data.lastName,
              payment_method: data.payment_method,
              phone: data.phone,
              postName: data.postName,
              region: data.region,
              city: data.state,
            },
          },
          { withCredentials: true } // кукіси, тут є токен
        );

        if (response.data.success) {
          setLoadingState((prev) => ({ ...prev, createOrderLoading: false }));

          return response.data.order;
        } else {
          setLoadingState((prev) => ({ ...prev, createOrderLoading: false }));
          toast.error(response.data.message);
          return false;
        }
      } catch (error) {
        console.log(error, "error");
        setLoadingState((prev) => ({ ...prev, createOrderLoading: false }));
      }
    };

    const createGuestOrder = async () => {
      try {
        setLoadingState((prev) => ({ ...prev, createOrderLoading: true }));
        const productsDataInCart =
          JSON.parse(localStorage.getItem("cart")) || {};
        const items = productsDataInCart.items.map((value) => {
          return {
            productId: value.product._id,
            quantity: value.quantity,
            size: value.size,
            priceAtAdd: value.priceAtAdd,
          };
        });

        const response = await axios.post(backendUrl + "/api/order/guest-add", {
          shippingAddress: {
            postBranchName: data.branchNumber,
            firstName: data.firstName,
            lastName: data.lastName,
            payment_method: data.payment_method,
            phone: data.phone,
            postName: data.postName,
            region: data.region,
            city: data.state,
          },
          items,
        });

        if (response.data.success) {
          setLoadingState((prev) => ({ ...prev, createOrderLoading: false }));
          return response.data.order;
        } else {
          setLoadingState((prev) => ({ ...prev, createOrderLoading: false }));

          return false;
        }
      } catch (error) {
        console.log(error, "error");
        setLoadingState((prev) => ({ ...prev, createOrderLoading: false }));
        toast.error(error.message);
      }
    };

    const orderResponse = isAuthenticated.isLoggedIn
      ? await createOrder()
      : await createGuestOrder();

    if (orderResponse) {
      const sendOrderToTgBot = async (orderId) => {
        try {
          if (isDirty && isValid && !isSubmitting) {
            const response = await axios.post(
              `${backendUrl}/api/tg-bot/send-tg-form`,
              {
                orderId,
              }
            );

            if (response.data.success) {
              toast.success(response.data.message);
              if (isAuthenticated.isLoggedIn) {
                clearCart();
                router.push("/orders");
              } else {
                localStorage.removeItem("cart");
                setCartData({});
                router.push("/");
              }
            } else {
              toast.error(response.data.message);
            }
          }
        } catch (error) {
          console.log(error, "error");
          toast.error(error?.response?.data?.message);
        }
      };

      await sendOrderToTgBot(orderResponse._id);
    } else {
      toast.error("Не вдалося відправити в телеграм замовлення!");
    }
  };

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

  useEffect(() => {
    if (isAuthenticated.isLoggedIn) {
      getCartData();
    } else {
      setCartData(JSON.parse(localStorage.getItem("cart")) || { items: [] });
      setLoadingState((prev) => ({ ...prev, getCartDataLoading: false }));
    }
  }, [isAuthenticated]);

  const loading =
    loadingState.loadingStripe ||
    loadingState.loadingLiqPay ||
    loadingState.createOrderLoading ||
    isSubmitting;

  return (
    <>
      {loading && <Loader />}

      <section className="payment-page">
        <div
          className={`payment__container ${
            checkPaymentMethodType !== "cod" ? "custom-payment-container" : ""
          }`}
        >
          <div
            className={`wrap__title_and_payment__body ${
              checkPaymentMethodType !== "cod" ? "custom-payment-box" : ""
            }`}
          >
            <Title
              text1={paymentMethodTitles[checkPaymentMethodType].text1}
              text2={paymentMethodTitles[checkPaymentMethodType].text2}
            />

            {checkPaymentMethodType === "liqpay" && (
              <LiqPayService setLoadingState={setLoadingState} />
            )}

            {checkPaymentMethodType === "stripe" && (
              <StripeService setLoadingState={setLoadingState} />
            )}

            {checkPaymentMethodType === "cod" && (
              <CODForm
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                register={register}
                errors={errors}
                control={control}
              />
            )}

            {/* <DevTool control={control} /> */}
          </div>

          <div className="payment__methods-and-cart-totals">
            {checkPaymentMethodType === "cod" && <CartTotal />}

            <Title text1="Метод " text2="Оплати" />
            <div className="payments-group">
              <div onClick={scrollToPayment} className="payment-box">
                <div className="wrap-radio-input">
                  <input
                    className="stripe"
                    type="radio"
                    {...register("payment_method")}
                    value="stripe"
                    id="stripe"
                  />
                </div>
                <label className="stripe" htmlFor="stripe">
                  <img src={assets.stripe_logo} alt="stripe" />
                </label>
              </div>
              <div onClick={scrollToPayment} className="payment-box">
                <div className="wrap-radio-input">
                  <input
                    className="liqpay"
                    type="radio"
                    {...register("payment_method")}
                    value="liqpay"
                    id="liqpay"
                  />
                </div>
                <label className="liqpay" htmlFor="liqpay">
                  <img src={assets.liqpay_logo} alt="liqpay" />
                </label>
              </div>
              <div onClick={scrollToPayment} className="payment-box">
                <div className="wrap-radio-input">
                  <input
                    className="cod"
                    type="radio"
                    {...register("payment_method")}
                    value="cod"
                    id="cod"
                  />
                </div>
                <label className="cod" htmlFor="cod">
                  ОПЛАТА НА ПОШТІ
                </label>
              </div>
            </div>
            {checkPaymentMethodType === "cod" && (
              <button
                // onClick={() => {
                //   if (isDirty && isValid && !isSubmitting) {
                //     router.push("/orders");
                //   }
                // }}
                disabled={isSubmitting}
                type="button" // навмисно написав button, бо кнопка не у формі, submit буде шукати її і не буде працювати
                // onClick={() => handleSubmit(onSubmit)()} //() треба викликати функцію
                onClick={handleSubmit(onSubmit)}
              >
                Здійснити оплату
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default PlaceOrder;
