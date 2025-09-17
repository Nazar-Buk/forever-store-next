// place-order це те саме що і checkout
"use client";

import { useState, useContext } from "react";
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

const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

const schema = yup.object({
  firstName: yup.string().required("This field is required!"),
  lastName: yup.string().required("This field is required!"),
  email: yup
    .string()
    // .email("Email format is incorrect!") до сраки така валідація
    .required("This field is required!")
    .matches(
      /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/,
      "Email format is incorrect!"
    ),
  street: yup.string().required("This field is required!"),
  city: yup.string().required("This field is required!"),
  state: yup.string(),
  zip_code: yup
    .number()
    .typeError("Zip code must be a valid number")
    .required("This field is required!"),
  country: yup.string().required("This field is required!"),
  phone: yup
    .string()
    .matches(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      "Invalid phone number format. Use this format '0965151515'"
    )
    // .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .required("This field is required!"),
});

const paymentMethodTitles = {
  stripe: { text1: "Stripe ", text2: "Information" },
  liqpay: { text1: "LiqPay ", text2: "Information" },
  cod: { text1: "Delivery ", text2: "Information" },
};

const PlaceOrder = () => {
  const router = useRouter();
  const { backendUrl, codProductData, getCartAmount } = useContext(ShopContext);

  const [loadingState, setLoadingState] = useState({
    loadingStripe: false,
    loadingLiqPay: false,
  });

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      street: "",
      city: "",
      state: "",
      zip_code: "",
      country: "",
      phone: "",
      payment_method: "cod",
    },
    resolver: yupResolver(schema),
  });

  const { register, control, handleSubmit, formState, watch, clearErrors } =
    form;
  const { errors, isDirty, isValid, isSubmitting } = formState;

  const checkPaymentMethodType = watch("payment_method");

  const onSubmit = async (data) => {
    try {
      console.log(data, "Form Submitted!");
      const orderId = "23213129834238";
      const totalAmount = getCartAmount();

      const telegramProductsData = codProductData.map((product) => ({
        quantity: product.quantity,
        link: `${frontendUrl}/product/${product._id}`,
        name: product.name,
      }));

      if (isDirty && isValid && !isSubmitting) {
        const response = await axios.post(
          `${backendUrl}/api/tg-bot/send-tg-form`,
          {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            street: data.street,
            city: data.city,
            state: data.state,
            zipCode: data.zip_code,
            country: data.country,
            phone: data.phone,
            orderId,
            productsData: telegramProductsData,
            price: totalAmount,
          }
        );

        if (response.data.success) {
          toast.success(response.data.message);
          router.push("/orders");
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error, "error");
      toast.error(error?.response?.data?.message);
    }
  };

  const loading = loadingState.loadingStripe || loadingState.loadingLiqPay;

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
              />
            )}

            {/* <DevTool control={control} /> */}
          </div>

          <div className="payment__methods-and-cart-totals">
            {checkPaymentMethodType === "cod" && <CartTotal />}

            <Title text1="Payment " text2="Method" />
            <div className="payments-group">
              <div className="payment-box">
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
              <div className="payment-box">
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
              <div className="payment-box">
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
                  CASH ON DELIVERY
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
                Place payment
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default PlaceOrder;
