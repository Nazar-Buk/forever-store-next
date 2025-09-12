// сторінка "/" у групі (shop) - це головна сторінка магазину
// (shop) -- це група, вона пишеться в дужках, це для того щоб вона не потрапляла в браузерну строку

// import Image from "next/image";
// import styles from "./page.module.css";
import axios from "axios";
export const dynamic = "force-dynamic"; // ❗ каже Next: не кешуй, рендери завжди свіжо

import Hero from "@/components/Hero";
import OurPolicy from "@/components/OurPolicy";
import Newsletter from "@/components/Newsletter";
import BestSeller from "@/components/BestSeller";
import LatestCollections from "@/components/LatestCollections";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
// console.log(backendUrl, "backendUrl from home");

const getBestsellers = async () => {
  try {
    const response = await axios.get(backendUrl + "/api/product/bestsellers", {
      headers: { "Cache-Control": "no-cache" }, // щоб точно не брало з кеша
    });
    // console.dir(response.data, { depth: null, colors: true }); // щоб побачити все що треба в консолі

    if (response.data.success) {
      return {
        data: response.data.bestsellersForSection || [],
        error: null,
      };
    } else {
      throw new Error(response.data.message || "Something went wrong!");
    }
  } catch (error) {
    console.log(error.message || "Something went wrong!");
    return {
      data: [],
      error: error.message || "Something went wrong!",
    };
  }
};

const getLatestProducts = async () => {
  try {
    const response = await axios.get(
      backendUrl + "/api/product/latest-products",
      {
        headers: { Cache_Control: "no-cache" }, // щоб точно не брало з кеша
      }
    );

    if (response.data.success) {
      return {
        data: response.data.latestProductsForSection || [],
        error: null,
      };
    } else {
      throw new Error(response?.data?.message || "Something went wrong!");
    }
  } catch (error) {
    console.log(error.message || "Something went wrong!");
    return {
      data: [],
      error: error.message || "Something went wrong!",
    };
  }
};

export default async function Home() {
  const { data: bestsellers, error: bestsellersError } = await getBestsellers(); // тут я поклав data у константу bestsellers, error поклав у константу bestsellersError

  const { data: latestProducts, error: latestProductsError } =
    await getLatestProducts();

  return (
    <div className="home-page">
      <Hero />
      <LatestCollections
        latestProducts={latestProducts}
        latestProductsError={latestProductsError}
      />
      <BestSeller
        bestsellers={bestsellers}
        bestsellersError={bestsellersError}
      />
      <OurPolicy />
      <Newsletter />
    </div>
  );
}
