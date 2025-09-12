"use client";

// import { useNavigate } from "react-router-dom";
import { useRouter } from "next/navigation";
// import { DevTool } from "@hookform/devtools";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Title from "@/components/Title";
import CartTotal from "@/components/CartTotal";
import { assets } from "../../../../public/assets/assets";

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

const PlaceOrder = () => {
  // const navigate = useNavigate();
  const router = useRouter();

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

  const { register, control, handleSubmit, formState } = form;
  const { errors, isDirty, isValid, isSubmitting } = formState;
  console.log(errors, "errors");

  const onSubmit = (data) => {
    console.log(data, "Form Submitted!");

    if (isDirty && isValid && !isSubmitting) {
      router.push("/orders");
    }
  };

  return (
    <section className="payment-page">
      <div className="payment__container">
        <div className="wrap__title_and_payment__body">
          <Title text1="Delivery " text2="Information" />
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="payment__body"
          >
            <div className="payment__delivery-info">
              <div className="delivery-info__form-fields">
                <div className="wrap-short-fields">
                  <div className="wrap-input">
                    <input
                      type="text"
                      id="first-name"
                      className="delivery-info__field"
                      placeholder="First name"
                      {...register("firstName")}
                    />
                    <p className="error">{errors.firstName?.message}</p>
                  </div>

                  <div className="wrap-input">
                    <input
                      type="text"
                      id="last-name"
                      className="delivery-info__field"
                      placeholder="Last name"
                      {...register("lastName")}
                    />
                    <p className="error">{errors.lastName?.message}</p>
                  </div>
                </div>
                <div className="wrap-input">
                  <input
                    type="email"
                    id="email"
                    className="delivery-info__field long-field"
                    placeholder="Email address"
                    {...register("email")}
                  />
                  <p className="error">{errors.email?.message}</p>
                </div>

                <div className="wrap-input">
                  <input
                    type="text"
                    id="street"
                    className="delivery-info__field long-field"
                    placeholder="Street"
                    {...register("street")}
                  />
                  <p className="error">{errors.street?.message}</p>
                </div>

                <div className="wrap-short-fields">
                  <div className="wrap-input">
                    <input
                      type="text"
                      id="city"
                      className="delivery-info__field"
                      placeholder="City"
                      {...register("city")}
                    />
                    <p className="error">{errors.city?.message}</p>
                  </div>

                  <div className="wrap-input">
                    <input
                      type="text"
                      id="state"
                      className="delivery-info__field"
                      placeholder="State"
                      {...register("state")}
                    />
                    <p className="error">{errors.state?.message}</p>
                  </div>
                </div>
                <div className="wrap-short-fields">
                  <div className="wrap-input">
                    <input
                      type="number"
                      id="zip-code"
                      className="delivery-info__field"
                      placeholder="Zip code"
                      {...register("zip_code")}
                    />
                    <p className="error">{errors.zip_code?.message}</p>
                  </div>

                  <div className="wrap-input">
                    <input
                      type="text"
                      id="country"
                      className="delivery-info__field"
                      placeholder="Country"
                      {...register("country")}
                    />
                    <p className="error">{errors.country?.message}</p>
                  </div>
                </div>
                <div className="wrap-input">
                  <input
                    type="text"
                    id="phone"
                    className="delivery-info__field long-field"
                    placeholder="Phone"
                    {...register("phone")}
                  />
                  <p className="error">{errors.phone?.message}</p>
                </div>
              </div>
            </div>
          </form>
          {/* <DevTool control={control} /> */}
        </div>

        <div className="payment__methods-and-cart-totals">
          <CartTotal />
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
          <button
            // onClick={() => {
            //   if (isDirty && isValid && !isSubmitting) {
            //     router.push("/orders");
            //   }
            // }}
            disabled={isSubmitting}
            type="submit"
          >
            Place payment
          </button>
        </div>
      </div>
    </section>
  );
};

export default PlaceOrder;
