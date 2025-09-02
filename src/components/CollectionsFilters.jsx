"use client";

import { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { scrollToSection } from "@/utils/helpers";
import CustomSelect from "@/components/CustomSelect";
import ToastSSRMessage from "@/utils/ToastSSRMessage";

const filtersSchema = yup.object({
  category: yup.object({
    optionLabel: yup.string(),
    optionValue: yup.string(),
  }),
  subCategory: yup.object({
    optionLabel: yup.string(),
    optionValue: yup.string(),
  }),
  priceFrom: yup
    .string()
    .test(
      "is-valid-priceFrom",
      "The price must be a positive number!",
      (value) => {
        if (!value) return true; // дозволяє пусте поле

        const num = Number(value);
        return !isNaN(num) && num > 0;
      }
    )
    .test(
      "price-range",
      "Price To must be greater than Price From",
      function (value) {
        const { priceTo } = this.parent; // доступ до інших полів, тому я тут пишу саме function а не стрілкову

        if (!value || !priceTo) return true; // якщо пусте поле то пропускаємо валідацію

        const from = Number(value);
        const to = Number(priceTo);

        return from < to;
      }
    ),
  priceTo: yup
    .string()
    .test(
      "is-valid-priceTo",
      "The price must be a positive number!",
      (value) => {
        if (!value) return true; // дозволяє пусте поле

        const num = Number(value);
        return !isNaN(num) && num > 0;
      }
    ),
});

const CollectionsFilters = (props) => {
  const {
    showFilter,
    backendUrl,
    category,
    setCategory,
    subCategory,
    setSubCategory,
    priceFrom,
    setPriceFrom,
    priceTo,
    setPriceTo,
    // setIsLoadingState,
    productsSectionRef,
    initialCategoryData: categoryData,
    categoriesError,
  } = props;

  const [isCategorySelectOpen, setIsCategorySelectOpen] = useState(false);
  const [isSubCategorySelectOpen, setIsSubCategorySelectOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      category: {
        optionLabel: "",
        optionValue: "",
      },
      subCategory: {
        optionLabel: "",
        optionValue: "",
      },
      priceFrom: "",
      priceTo: "",
    },
    resolver: yupResolver(filtersSchema),
  });

  const { register, handleSubmit, formState, watch, setValue, reset, control } =
    form;

  const { errors } = formState;
  console.log(errors, "errors");

  const selectedCategory = watch("category") || {};
  const selectedSubCategory = watch("subCategory") || {};

  const subCategoryData =
    categoryData.find(
      (item) => item.categoryLabel === selectedCategory.optionLabel
    )?.subCategory || [];

  const onSubmit = (data) => {
    // console.log(data, "data");

    if (!Object.keys(errors).length) {
      // Виконуємо якщо нема помилок

      scrollToSection(productsSectionRef);
    }

    setCategory(data.category.optionLabel);
    setSubCategory(data.subCategory.optionLabel);
    setPriceFrom(data.priceFrom);
    setPriceTo(data.priceTo);
  };

  useEffect(() => {
    if (selectedCategory.optionLabel !== category) {
      setValue(
        // щоб підкатегрія була пустою при зміні категорії
        "subCategory",
        {
          optionLabel: "All Sub-Category",
          optionValue: "",
        },
        {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        }
      );
    }
  }, [selectedCategory]);

  useEffect(() => {
    const currentCategoryValue = categoryData?.find(
      (item) => item.categoryLabel === category
    )?.categoryValue;

    const currentSubCategoryValue = subCategoryData?.find(
      (item) => item.subCategoryLabel === subCategory
    )?.subCategoryValue;

    // тут reset, щоб useForm тримався в синхроні з URL, який оновлюється в батьківському компоненті. Інакше дані у формі будуть "застарілими".
    reset({
      category: {
        optionLabel: category || "",
        optionValue: currentCategoryValue || "",
      },
      subCategory: {
        optionLabel: subCategory || "",
        optionValue: currentSubCategoryValue || "",
      },
      priceFrom: priceFrom || "",
      priceTo: priceTo || "",
    });
    // }
  }, [categoryData, category, subCategory, priceFrom, priceTo]);

  useEffect(() => {
    if (selectedCategory.optionLabel.toLowerCase().includes("all")) {
      setCategory("");
    }
  }, [category]);

  useEffect(() => {
    if (selectedSubCategory.optionLabel.toLowerCase().includes("all")) {
      setSubCategory("");
    }
  }, [subCategory]);

  return (
    <>
      {categoriesError && (
        <ToastSSRMessage message={categoriesError} type="error" />
      )}
      <form
        className={`filters-body ${showFilter ? "" : "sm-ds-none"}`}
        onSubmit={handleSubmit(onSubmit)}
        noValidate // тепер не браузер валідує форму а useForm
      >
        <div className="filter-item-box">
          <h6>Category</h6>
          <Controller
            name="category"
            control={control}
            render={({ field }) => {
              // field -- містить value, onChange, onBlur, name, ref
              const { value, onChange, onBlur } = field;

              return (
                <CustomSelect
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  isSelectOpen={isCategorySelectOpen}
                  setIsCustomSelectOpen={setIsCategorySelectOpen}
                  emptyLabel="All Category"
                  selectData={categoryData.map((item) => ({
                    optionLabel: item.categoryLabel,
                    optionValue: item.categoryValue,
                  }))}
                />
              );
            }}
          />
          <p className="error">{errors.category?.message}</p>
        </div>
        <div className="filter-item-box">
          <h6>Sub-Category</h6>
          <Controller
            name="subCategory"
            control={control}
            render={(
              { field } // field -- містить value, onChange, onBlur, name, ref
            ) => {
              const { value, onChange, onBlur } = field;

              return (
                <CustomSelect
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  isSelectOpen={isSubCategorySelectOpen}
                  setIsCustomSelectOpen={setIsSubCategorySelectOpen}
                  emptyLabel="All Sub-Category"
                  selectData={subCategoryData.map((item) => ({
                    optionLabel: item.subCategoryLabel,
                    optionValue: item.subCategoryValue,
                  }))}
                  isDisabled={!selectedCategory.optionValue}
                />
              );
            }}
          />
          <p className="error">{errors.subCategory?.message}</p>
        </div>

        <div className="filter-item-box">
          <h6>Set Price</h6>
          <div className="price__fields">
            <div className="price__field">
              <input
                className="price__input"
                type="number"
                placeholder="From: "
                {...register("priceFrom")}
              />
            </div>
            <div className="price__field">
              <input
                className="price__input"
                type="number"
                placeholder="To: "
                {...register("priceTo")}
              />
            </div>
          </div>
          <p className="error">
            {errors.priceTo?.message || errors.priceFrom?.message}
          </p>
        </div>
        <div className="wrap-buttons">
          <button type="submit">Apply Filters</button>
          <button
            type="button"
            onClick={() => {
              setCategory("");
              setSubCategory("");
              setPriceFrom("");
              setPriceTo("");
              reset(); // скидає всі поля до початкових значень (defaultValues)
            }}
          >
            Clear
          </button>
        </div>
      </form>
    </>
  );
};

export default CollectionsFilters;
