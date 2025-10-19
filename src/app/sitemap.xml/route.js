import axios from "axios";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

// 🔹 GET-роут для Next 15
export async function GET() {
  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(
        backendUrl + "/api/product/all-products"
      );
      if (response.data.success) {
        return response.data.products;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.log(error, "error fetching products");
      return [];
    }
  };

  const allProducts = await fetchAllProducts();

  const productsData = allProducts.map((product) => ({
    url: `${siteUrl}/product/${product._id}`,
    lastModified: new Date(),
    changeFrequency: "daily",
  }));

  const urls = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "yearly" },
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

  // 🔹 Генеруємо чистий XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (item) => `<url>
  <loc>${item.url}</loc>
  <lastmod>${item.lastModified.toISOString()}</lastmod>
  <changefreq>${item.changeFrequency}</changefreq>
</url>`
  )
  .join("")}
</urlset>`;

  // ✅ Віддаємо Response з Content-Type: application/xml
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
