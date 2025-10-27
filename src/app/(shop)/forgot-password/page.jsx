"use client";

import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";

import Title from "@/components/Title";
import Loader from "@/components/Loader";
import { ShopContext } from "@/context/ShopContext";

const ForgotPassword = () => {
  const { backendUrl } = useContext(ShopContext);

  const [isLoading, setIsLoading] = useState(false);

  const schema = yup.object({
    email: yup
      .string()
      // .email("Email format is incorrect!") до сраки така валідація
      .required("Це поле обовʼязкове!")
      .matches(
        /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/,
        "Неправильний формат емейлу!"
      ),
  });

  const form = useForm({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const { register, handleSubmit, control, formState, reset } = form;
  const { errors } = formState;

  const onSubmit = async (data) => {
    console.log(data, "data from ForgotPassword");

    try {
      setIsLoading(true);

      const response = await axios.post(
        backendUrl + "/api/user/forgot-password",
        {
          email: data.email,
        }
      );

      if (response.data.success) {
        console.log(response, "response SUCCESS");
        setIsLoading(false);
        toast.success(response.data.message);
      } else {
        console.log(response, "response FAILED");
        setIsLoading(false);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error, "error");
      setIsLoading(false);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <section className="forgot-password-page">
      <div className="forgot-password__container">
        {isLoading && <Loader />}
        <div className="forgot-password__body">
          <Title text1="НАДІШЛІТЬ " text2="ЕМЕЙЛ" />
          <div className="form-box">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="wrap-input">
                <input
                  className="forgot-password__input"
                  type="email"
                  placeholder="Email"
                  id="email"
                  {...register("email")}
                />
                <p className="error">{errors.email?.message}</p>
              </div>

              <button type="submit">Надіслати</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
