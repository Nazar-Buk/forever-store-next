// Самі сторінки треба робити переважно ssr,
// а от компоненти вже можуть піддаватися гідрації та використовувати реакт через "use client"

import axios from "axios";
import { redirect, notFound } from "next/navigation"; // 🔹 додано import notFound / redirect

import ClientProduct from "./ClientProduct"; // компонент, який буде гідратуватися на клієнті

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const fetchProductData = async (productId) => {
  try {
    const response = await axios.post(backendUrl + "/api/product/single", {
      productId,
      // productId: "67f50cbae3550da216e4c393",
    });

    if (response.data.success) {
      return { data: response.data.product, error: null };
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.log(error, "error");
    return {
      data: {},
      error: error?.response?.data?.message || error?.message,
    };
  }
};

const getRelatedProducts = async (productData) => {
  try {
    const response = await axios.post(backendUrl + "/api/product/related", {
      category: productData?.category,
      subCategory: productData?.subCategory,
      productId: productData?._id,
    });

    if (response.data.success) {
      return {
        data: response.data.relatedProductsForSection,
        error: null,
      };
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.log(error, "error");

    return {
      data: [],
      error: error.response?.data?.message || "Something went wrong!",
    };
  }
};

export async function generateMetadata({ params }) {
  const { productId } = await params;

  const response = await fetchProductData(productId);
  // console.log("=========response generateMetaData start==========");
  // console.dir(response, { depth: null, colors: true });
  // console.log("==========response generateMetaData end=========");

  const productData = response.data;
  return {
    title: productData?.name,
    description: productData?.description,
    openGraph: {
      // для соцмереж
      images: [
        {
          url: productData?.images[0]?.url,
        },
      ],
    },
  };
}

export default async function Product({ params }) {
  const { productId } = await params;

  const { data: productData, error: productError } = await fetchProductData(
    productId
  );

  if (!productData || productError) {
    // варіант 1 — 404 сторінка:
    notFound();
  }

  const { data: relatedProducts, error: relatedProductsError } =
    await getRelatedProducts(productData);

  // console.log("=========error start==========");
  // console.dir(relatedProductsError, { depth: null, colors: true });
  // console.log("==========error end=========");

  return (
    <>
      <ClientProduct
        initialProductData={productData}
        productError={productError}
        productId={productId}
        relatedProducts={relatedProducts}
        relatedProductsError={relatedProductsError}
      />
    </>
  );
}
