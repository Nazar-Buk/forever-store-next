// сторінка "/"

// import Image from "next/image";
// import styles from "./page.module.css";
import axios from "axios";

import Hero from "@/components/Hero";
import OurPolicy from "@/components/OurPolicy";
import Newsletter from "@/components/Newsletter";
import BestSeller from "@/components/BestSeller";
import LatestCollections from "@/components/LatestCollections";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
// console.log(backendUrl, "backendUrl from home");

const getBestsellers = async () => {
  try {
    const response = await axios.get(backendUrl + "/api/product/bestsellers");
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
      backendUrl + "/api/product/latest-products"
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
  // console.dir(bestsellers, { depth: null, colors: true });
  // console.log("bestsellers ======");
  // console.dir(bestsellersError, { depth: null, colors: true });
  // console.log("bestsellersError ======");

  const { data: latestProducts, error: latestProductsError } =
    await getLatestProducts();

  // console.dir(latestProducts, { depth: null, colors: true });
  // console.log("latestProducts ======");
  // console.dir(latestProductsError, { depth: null, colors: true });
  // console.log("latestProductsError ======");

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
