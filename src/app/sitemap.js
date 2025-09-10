import axios from "axios";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const fetchAllProducts = async () => {
  try {
    const response = await axios.get(backendUrl + "/api/product/all-products");

    if (response.data.success) {
      return response.data.products;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.log(error, "error");
  }
};

export default async function sitemap(params) {
  const allProducts = (await fetchAllProducts()) || [];
  //   const allProducts = await fetchAllProducts();

  const productsData = allProducts.map((product) => ({
    url: `${siteUrl}/product/${product._id}`,
    lastModified: product.date,
    changeFrequency: "weekly",
  }));
  //   console.log("=========allProducts  start==========");
  //   console.dir(allProducts, { depth: null, colors: true });
  //   console.log("==========allProducts  end=========");
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "yearly",
      //   prioryty: 1 // написав для прикладу
    },
    {
      url: `${siteUrl}/collection`,
      lastModified: new Date(),
      changeFrequency: "yearly",
    },
    {
      url: `${siteUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: "yearly",
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
    },

    ...productsData,
  ];
}
