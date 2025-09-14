"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
// import { DevTool } from "@hookform/devtools";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

import { ShopContext } from "@/context/ShopContext";
import Title from "@/components/Title";
import CartTotal from "@/components/CartTotal";
import CODForm from "@/components/forms/CODForm";
import { assets } from "../../../../public/assets/assets";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

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
  razorpay: { text1: "Razorpay ", text2: "Information" },
  cod: { text1: "Delivery ", text2: "Information" },
};

const PlaceOrder = () => {
  // const navigate = useNavigate();
  const router = useRouter();

  const { backendUrl, stripeProductData } = useContext(ShopContext);

  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    // Приклад що має бути в корзині для старйпу (можна ще щось додавати)
    // const cart = [
    //   { name: "T-shirt", price: 2000, quantity: 1, image: "https://example.com/hat.png" },
    //   { name: "Hat", price: 1500, quantity: 2, image: "https://example.com/hat.png" },
    // ];

    const cart = stripeProductData.map((item) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.images?.[0].url,
    }));

    try {
      fetch(`${backendUrl}/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    } catch (error) {
      console.log(error, "error");
    }
  }, [stripeProductData]);

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
  console.log(errors, "errors");

  const checkPaymentMethodType = watch("payment_method");

  const onSubmit = (data) => {
    console.log(data, "Form Submitted!");

    if (isDirty && isValid && !isSubmitting) {
      router.push("/orders");
    }
  };

  const handlePay = () => {
    if (checkPaymentMethodType === "cod") {
      handleSubmit(onSubmit)(); //() треба викликати функцію
    } else {
      clearErrors();
      console.log("hahahahhahah");
    }
  };

  return (
    <section className="payment-page">
      <div
        className={`payment__container ${
          checkPaymentMethodType === "stripe" ? "custom-stripe-container" : ""
        }`}
      >
        <div
          className={`wrap__title_and_payment__body ${
            checkPaymentMethodType === "stripe" ? "custom-stripe-box" : ""
          }`}
        >
          <Title
            text1={paymentMethodTitles[checkPaymentMethodType].text1}
            text2={paymentMethodTitles[checkPaymentMethodType].text2}
          />
          {checkPaymentMethodType === "stripe" && (
            <div>
              <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={{ clientSecret }}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
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
                  className="razorpay"
                  type="radio"
                  {...register("payment_method")}
                  value="razorpay"
                  id="razorpay"
                />
              </div>
              <label className="razorpay" htmlFor="razorpay">
                <img src={assets.razorpay_logo} alt="razorpay" />
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
              onClick={handlePay}
            >
              Place payment
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default PlaceOrder;
