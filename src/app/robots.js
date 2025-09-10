export default function robots() {
  return {
    rules: [
      {
        userAgent: "*", // для всіх роботів
        allow: "/", // дозволяє всім роботам сканувати всі сторінки,
        disallow: ["/cart", "/orders", "/place-orders", "/login"], // забороняє сканувати ці сторінки
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`, // посилання на файл sitemap
  };
}
