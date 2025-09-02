"use client";

import { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSearchParams, useRouter } from "next/navigation";

import { ShopContext } from "@/context/ShopContext";
import Title from "@/components/Title";
import ProductItem from "@/components/ProductItem";
import Loader from "@/components/Loader";
import Pagination from "@/components/Pagination";
import CollectionsFilters from "@/components/CollectionsFilters";
import { assets } from "../../../public/assets/assets";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const ClientCollection = ({
  initialProducts,
  initialTotalCount,
  productsDataError,
  initialCategoryData,
  categoriesError,
}) => {
  const router = useRouter();
  const { search, showSearch } = useContext(ShopContext);
  const productsSectionRef = useRef(null);
  const isFirstRender = useRef(true); // щоб при першому рендері не спрацьовував useEffect

  const [isLoadingState, setIsLoadingState] = useState({
    isProductsLoading: false,
    isCategoryLoading: false,
  });

  //   const [searchParams, setSearchParams] = useSearchParams() // з реакту
  const searchParams = useSearchParams(); // ця шляпа вміє працювати із адресною строкою
  // отримую дані із лінки, ті що після ? і тих &...
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [limit, setLimit] = useState(parseInt(searchParams.get("limit")) || 10);
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [subCategory, setSubCategory] = useState(
    searchParams.get("subCategory") || ""
  );
  const [priceFrom, setPriceFrom] = useState(
    searchParams.get("priceFrom") || ""
  );
  const [priceTo, setPriceTo] = useState(searchParams.get("priceTo") || "");

  const [sort, setSort] = useState(searchParams.get("sort") || "date_new");

  const [totalCount, setTotalCount] = useState(initialTotalCount || 0);

  const [products, setProducts] = useState(initialProducts || []);
  const [showFilter, setShowFilter] = useState(false);

  // ✅ функція щоб зібрати і оновити URL параметри
  const updateSearchParams = (newParams) => {
    const params = new URLSearchParams(searchParams);

    //робимо з обʼєкта -- масив із масивами, та за допомогою деструктиризації ми отримуємо key, value
    Object.entries(newParams).forEach(([key, value]) => {
      params.set(key, value);
    });

    router.push(`?${params.toString()}`); // Метод .toString() у URLSearchParams перетворює об’єкт назад у звичайний query-рядок., типу page=2&category=books, без знака ?

    // console.log("=========params start==========");
    // console.dir(params, { depth: null, colors: true });
    // console.log("==========params end=========");
  };

  const getProductsData = async (
    currentPage,
    currentLimit,
    categoryData,
    subCategoryData,
    priceFromData,
    priceToData,
    sortData,
    searchData
  ) => {
    try {
      setIsLoadingState((prev) => ({ ...prev, isProductsLoading: true }));

      let encodedCategoryData;
      let encodedSubCategory;

      if (categoryData.toLowerCase().includes("all")) {
        encodedCategoryData = "";
      } else {
        encodedCategoryData = encodeURIComponent(categoryData); // закодовує кирилицю, бо так просто її на бек  не треба відправляти, а от на беку розкодовується автоматично
      }

      if (subCategoryData.toLowerCase().includes("all")) {
        encodedSubCategory = "";
      } else {
        encodedSubCategory = encodeURIComponent(subCategoryData);
      }

      const response = await axios.get(
        backendUrl +
          `/api/product/list?page=${currentPage}&limit=${currentLimit}&category=${encodedCategoryData}&subCategory=${encodedSubCategory}&priceFrom=${priceFromData}&priceTo=${priceToData}&sort=${sortData}&search=${searchData}`
      ); // на беку це треба отримувати так { page: '1', limit: '10' } req.query

      if (response.data.success) {
        setIsLoadingState((prev) => ({ ...prev, isProductsLoading: false }));

        setProducts(response.data.products);
        setTotalCount(response.data.totalCount);

        toast.success(response.data.message);
      } else {
        setIsLoadingState((prev) => ({ ...prev, isProductsLoading: false }));

        toast.error(response.data.message);
      }
    } catch (error) {
      setIsLoadingState((prev) => ({ ...prev, isProductsLoading: false }));

      console.log(error, "error");
      toast.error(error.message);
    }
  };

  useEffect(() => {
    // При першому рендері відключаємо useEffect
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    getProductsData(
      page,
      limit,
      category,
      subCategory,
      priceFrom,
      priceTo,
      sort,
      search
    );
    // // Встановлюємо параметри в URL при зміні сторінки або ліміту
    // setSearchParams({
    //   page,
    //   limit,
    //   category,
    //   subCategory,
    //   priceFrom,
    //   priceTo,
    //   sort,
    //   search,
    // });

    // Встановлюємо параметри в URL при зміні сторінки або ліміту
    updateSearchParams({
      page,
      limit,
      category,
      subCategory,
      priceFrom,
      priceTo,
      sort,
      search,
    });
  }, [
    page,
    limit,
    category,
    subCategory,
    priceFrom,
    priceTo,
    sort,
    search,
    // setSearchParams,
  ]);

  const isLoading =
    isLoadingState.isCategoryLoading || isLoadingState.isProductsLoading;

  return (
    <section className="collection-page">
      <div className="collection-page__container collection-page__body">
        <div className="filter-options__box">
          <div className="filter-options">
            <div
              className="wrap-filter-heading"
              onClick={() => setShowFilter(!showFilter)}
            >
              <h5>FILTERS</h5>
              <svg
                style={
                  showFilter
                    ? { transform: "rotate(180deg)" }
                    : { transform: "rotate(0)" }
                }
                className="drop-down-arrow"
                fill="#ccc"
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 330 330"
                xmlSpace="preserve"
                stroke="#000000"
                strokeWidth="0.0033"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0" />

                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    id="XMLID_222_"
                    d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001 c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213 C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606 C255,161.018,253.42,157.202,250.606,154.389z"
                  />{" "}
                </g>
              </svg>
            </div>

            <CollectionsFilters
              showFilter={showFilter}
              backendUrl={backendUrl}
              category={category}
              setCategory={setCategory}
              subCategory={subCategory}
              setSubCategory={setSubCategory}
              priceFrom={priceFrom}
              setPriceFrom={setPriceFrom}
              priceTo={priceTo}
              setPriceTo={setPriceTo}
              //   setIsLoadingState={setIsLoadingState}
              productsSectionRef={productsSectionRef}
              initialCategoryData={initialCategoryData}
              categoriesError={categoriesError}
            />
          </div>
        </div>
        <div className="collection__content">
          <div
            ref={productsSectionRef}
            className="collection-content__settings"
          >
            <Title text1="All " text2="Collections" />
            <div className="wrap-sorting-select">
              <select
                onChange={(e) => setSort(e.target.value)}
                className="sorting-box"
                name="sorting"
                defaultValue={sort}
              >
                <option value="date_new">Sort by: Newest</option>
                <option value="date_old">Sort by: Oldest</option>
                <option value="price_asc">Sort by: Low to High</option>
                <option value="price_desc">Sort by: High to Low</option>
              </select>
            </div>
          </div>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {products.length ? (
                <div className="product__cards">
                  {products?.map((item) => (
                    <ProductItem
                      key={item._id}
                      id={item._id}
                      images={item.images}
                      price={item.price}
                      name={item.name}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-page">
                  <h2>No Products</h2>
                  <img src={assets.empty_products} alt="no product" />
                </div>
              )}
            </>
          )}

          {/* <>
            {products.length ? (
              <div className="product__cards">
                {products?.map((item) => (
                  <ProductItem
                    key={item._id}
                    id={item._id}
                    images={item.images}
                    price={item.price}
                    name={item.name}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-page">
                <h2>No Products</h2>
                <img src={assets.empty_products} alt="no product" />
              </div>
            )}
          </> */}
        </div>
      </div>
      <div className="wrap-pagination">
        <Pagination
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          totalCount={totalCount}
        />
      </div>
    </section>
  );
};

export default ClientCollection;
