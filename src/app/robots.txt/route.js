const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

// 🔹 GET-роут для Next 15
export async function GET() {
  const robotsTxt = `
User-agent: *
Allow: /
Disallow: /cart
Disallow: /orders
Disallow: /place-orders
Disallow: /login

Sitemap: ${siteUrl}/sitemap.xml
`.trim();

  // ✅ Віддаємо plain text для Google
  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
