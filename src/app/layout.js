// Спільний layout (шапка, футер, meta, стилі)
// children -- це всі сторінки, вони сюди тягнуться

import { Suspense } from "react";
import { Geist, Geist_Mono, Outfit, Poppins, Prata } from "next/font/google";
import "../styles/main.scss"; // підключив стилі до всього застосунку

import ClientProviders from "@/components/ClientProviders";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-primary",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-secondary",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const prata = Prata({
  subsets: ["latin"],
  variable: "--font-tertiary",
  display: "swap",
  weight: ["400"],
});

export const metadata = {
  title: {
    default: "Buk SKLAD",
    template: "%s - Buk SKLAD", // %s - це динамічна частина, сюди прийде title з іншої сторінки
  },
  description: "Buy goods online",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${poppins.variable} ${prata.variable}`}
      >
        <div id="loader">
          <div className="spinner"></div>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <ClientProviders>{children}</ClientProviders>
        </Suspense>
      </body>
    </html>
  );
}
