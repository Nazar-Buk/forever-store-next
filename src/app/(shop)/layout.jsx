import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";

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
