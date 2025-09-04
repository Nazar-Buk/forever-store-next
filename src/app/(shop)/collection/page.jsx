import axios from "axios";

import ClientCollection from "@/app/(shop)/collection/ClientCollection";

export const dynamic = "force-dynamic";

export default async function Collection({ searchParams }) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  // можливо search треба тягнути із контексту а не відси)))
  const {
    page,
    limit,
    category,
    subCategory,
    priceFrom,
    priceTo,
    sort,
    search,
  } = await searchParams;

  const getProductsData = async () => {
    try {
      const response = await axios.get(
        backendUrl +
          `/api/product/list?page=${page}&limit=${limit}&category=${category}&subCategory=${subCategory}&priceFrom=${priceFrom}&priceTo=${priceTo}&sort=${sort}&search=${search}`
      ); // на беку це треба отримувати так { page: '1', limit: '10' } req.query

      if (response.data.success) {
        return {
          products: response.data.products,
          totalCount: response.data.totalCount,
          error: null,
          // success: response.data.message,
        };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.log(error, "error");

      return {
        products: [],
        totalCount: 0,
        error: error.message,
        success: null,
      };
    }
  };

  const {
    products,
    totalCount,
    error: productsDataError,
  } = await getProductsData();

  const fetchCategories = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/category/list");
      if (response.data.success) {
        return {
          categoryData: response.data.allCategories,
          error: null,
        };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.log(error, "error");
      return {
        categoryData: [],
        error: error.message,
        success: null,
      };
    }
  };

  const { categoryData, error: categoriesError } = await fetchCategories();

  // console.log("=========categoriesError start==========");
  // console.dir(categoriesError, { depth: null, colors: true });
  // console.log("==========categoriesError end=========");

  return (
    <ClientCollection
      initialProducts={products}
      initialTotalCount={totalCount}
      productsDataError={productsDataError}
      initialCategoryData={categoryData}
      categoriesError={categoriesError}
    />
  );
}
