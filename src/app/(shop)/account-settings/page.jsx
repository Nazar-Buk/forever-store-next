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

const AccountSettings = () => {
  const { backendUrl } = useContext(ShopContext);

  const [isShowPassword, setIsShowPassword] = useState({
    isShownOldPassword: false,
    isShownNewPassword: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const nameSchema = yup.object({
    name: yup
      .string()
      // не можна тут писати інші валідації бо почне кусатися із .test()
      .test("name", "Мінімум 3 символи!", (value) => {
        // завжди має повертаи true або false !!!!!!

        if (!value || value.trim() === "" || value.length < 3) {
          return false;
        }

        return true;
      }),
  });

  const nameForm = useForm({
    defaultValues: {
      name: "",
    },
    resolver: yupResolver(nameSchema),
    mode: "onChange",
  });

  const {
    register: nameRegister,
    handleSubmit: nameHandleSubmit,
    formState: nameFormState,
    reset: nameReset,
  } = nameForm;

  const { errors: nameErrors } = nameFormState;

  const changeAccountData = async (name, oldPassword, newPassword) => {
    try {
      setIsLoading(true);

      const response = await axios.put(
        backendUrl + "/api/user/update",
        {
          name,
          oldPassword,
          newPassword,
        },
        {
          withCredentials: true, // важливо для роботи з cookie
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

  const onSubmitName = (data) => {
    const { name } = data;

    changeAccountData(name, undefined, undefined);
  };

  const passwordSchema = yup.object({
    oldPassword: yup
      .string()
      //   .required("Це поле обовʼязкове!")
      .min(8, "Мінімум 8 символів!")
      .test(
        "password-strength",
        "Пароль повинен складатися із Великих літер, малих літер, чисел та спеціальних символів, наприклад '#'",
        (value) => {
          // Перевіряє, чи є хоча б одна велика літера (A–Z)
          const hasUpperCase = /[A-Z]/.test(value);

          // Перевіряє, чи є хоча б одна мала літера (a–z)
          const hasLowerCase = /[a-z]/.test(value);

          // Перевіряє, чи є хоча б одна цифра (0–9)
          const hasNumber = /[0-9]/.test(value);

          // Перевіряє, чи є хоча б один спеціальний символ із вказаного набору
          // додай решітку
          const hasSpecialChar = /[@$!%*?&#№]/.test(value);

          // Повертає true тільки якщо всі умови вище виконані
          return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
        }
      ),
    newPassword: yup
      .string()
      .required("Це поле обовʼязкове!")
      .min(8, "Мінімум 8 символів!")
      .test(
        "password-strength",
        "Пароль повинен складатися із Великих літер, малих літер, чисел та спеціальних символів, наприклад '#'",
        (value) => {
          // Перевіряє, чи є хоча б одна велика літера (A–Z)
          const hasUpperCase = /[A-Z]/.test(value);

          // Перевіряє, чи є хоча б одна мала літера (a–z)
          const hasLowerCase = /[a-z]/.test(value);

          // Перевіряє, чи є хоча б одна цифра (0–9)
          const hasNumber = /[0-9]/.test(value);

          // Перевіряє, чи є хоча б один спеціальний символ із вказаного набору
          // додай решітку
          const hasSpecialChar = /[@$!%*?&#№]/.test(value);

          // Повертає true тільки якщо всі умови вище виконані
          return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
        }
      ),
  });

  const passwordForm = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
    resolver: yupResolver(passwordSchema),
    mode: "onChange",
  });

  const {
    register: passwordRegister,
    handleSubmit: passwordHandleSubmit,
    formState: passwordFormState,
  } = passwordForm;

  const { errors: passwordErrors } = passwordFormState;

  const onSubmitPassword = (data) => {
    const { oldPassword, newPassword } = data;

    changeAccountData(undefined, oldPassword, newPassword);
  };

  return (
    <section className="account-settings-page">
      <div className="account-settings__container">
        {isLoading && <Loader />}
        <div className="account-settings__body">
          <Title text1="Змінити " text2="Дані" />
          <div className="form-box">
            <form
              onSubmit={nameHandleSubmit(onSubmitName)}
              className="change-name__form"
              noValidate
            >
              <div className="wrap-input">
                <input
                  className="account-settings__input"
                  type="text"
                  placeholder="Імʼя"
                  id="name"
                  {...nameRegister("name")}
                />
                <p className="error">{nameErrors.name?.message}</p>
              </div>

              <button type="submit">Змінити</button>
            </form>
          </div>
          <div className="form-box">
            <form
              onSubmit={passwordHandleSubmit(onSubmitPassword)}
              className="change-password__form"
              noValidate
            >
              <div className="wrap-input-password-fields">
                <div className="wrap-input">
                  <input
                    className="account-settings__input"
                    type={
                      isShowPassword.isShownOldPassword ? "text" : "password"
                    }
                    placeholder="Старий Пароль"
                    id="oldPassword"
                    {...passwordRegister("oldPassword")}
                  />
                  <div
                    onClick={() =>
                      setIsShowPassword((prev) => ({
                        ...prev,
                        isShownOldPassword: !prev.isShownOldPassword,
                      }))
                    }
                    className="eye-password"
                  >
                    {isShowPassword.isShownOldPassword ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1 12C1 12 5 20 12 20C19 20 23 12 23 12"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 2L22 22"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <p className="error">{passwordErrors.oldPassword?.message}</p>
                </div>
                <div className="wrap-input">
                  <input
                    className="account-settings__input"
                    type={
                      isShowPassword.isShownNewPassword ? "text" : "password"
                    }
                    placeholder="Новий Пароль"
                    id="newPassword"
                    {...passwordRegister("newPassword")}
                  />
                  <div
                    onClick={() =>
                      setIsShowPassword((prev) => ({
                        ...prev,
                        isShownNewPassword: !prev.isShownNewPassword,
                      }))
                    }
                    className="eye-password"
                  >
                    {isShowPassword.isShownNewPassword ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1 12C1 12 5 20 12 20C19 20 23 12 23 12"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 2L22 22"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <p className="error">{passwordErrors.newPassword?.message}</p>
                </div>
              </div>

              <button type="submit">Змінити</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccountSettings;
