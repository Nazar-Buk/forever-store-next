"use client";

import { useState } from "react";
import { Controller } from "react-hook-form";
import CustomSelect from "../CustomSelect";

const postNames = [
  { optionLabel: "Нова Пошта", optionValue: "nova-poshta" },
  { optionLabel: "УкрПошта", optionValue: "ukr-poshta" },
  { optionLabel: "Delivery", optionValue: "delivery" },
];

const CODForm = (props) => {
  const { handleSubmit, onSubmit, register, errors, control } = props;
  const [isPostNameSelectOpen, setIsPostNameSelectOpen] = useState(false);

  return (
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
                placeholder="Імʼя"
                {...register("firstName")}
              />
              <p className="error">{errors.firstName?.message}</p>
            </div>

            <div className="wrap-input">
              <input
                type="text"
                id="last-name"
                className="delivery-info__field"
                placeholder="Прізвище"
                {...register("lastName")}
              />
              <p className="error">{errors.lastName?.message}</p>
            </div>
          </div>

          <div className="wrap-short-fields">
            <div className="wrap-input">
              <Controller
                name="postName"
                control={control}
                render={({ field }) => {
                  // field -- містить value, onChange, onBlur, name, ref
                  const { value, onChange, onBlur } = field;
                  return (
                    <CustomSelect
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      isSelectOpen={isPostNameSelectOpen}
                      setIsCustomSelectOpen={setIsPostNameSelectOpen}
                      emptyLabel="Виберіть пошту"
                      selectData={postNames.map((item) => ({
                        optionLabel: item.optionLabel,
                        optionValue: item.optionValue,
                      }))}
                    />
                  );
                }}
              />
              <p className="error">{errors.postName?.optionValue.message}</p>
            </div>

            <div className="wrap-input">
              <input
                type="text"
                id="region"
                className="delivery-info__field"
                placeholder="Область"
                {...register("region")}
              />
              <p className="error">{errors.region?.message}</p>
            </div>
          </div>

          <div className="wrap-short-fields">
            <div className="wrap-input">
              <input
                type="text"
                id="state"
                className="delivery-info__field"
                placeholder="Населений пункт"
                {...register("state")}
              />
              <p className="error">{errors.state?.message}</p>
            </div>

            <div className="wrap-input">
              <input
                type="text"
                id="branchNumber"
                className="delivery-info__field"
                placeholder="Відділення № "
                {...register("branchNumber")}
              />
              <p className="error">{errors.branchNumber?.message}</p>
            </div>
          </div>
          <div className="wrap-input">
            <input
              type="text"
              id="phone"
              className="delivery-info__field long-field"
              placeholder="Телефон"
              {...register("phone")}
            />
            <p className="error">{errors.phone?.message}</p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CODForm;
