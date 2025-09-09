import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";

// export const metadata = {
//   title: "Buk SKLAD",
//   description: "Buy goods online",
// };

export default function ShopLayout({ children }) {
  return (
    <>
      <Navbar />
      <SearchBar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
