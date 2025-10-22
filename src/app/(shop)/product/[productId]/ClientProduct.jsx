"use client";

import { useEffect, useState, useContext, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { nanoid } from "nanoid";

import { ShopContext } from "../../../../context/ShopContext";
import { assets } from "../../../../../public/assets/assets";
import ToastSSRMessage from "@/utils/ToastSSRMessage";
import RelatedProducts from "@/components/RelatedProducts";
import ProductSwiperSlider from "@/components/sliders/ProductSwiperSlider";
import FullScreenSliderModal from "@/components/modals/FullScreenSliderModal";
import Loader from "@/components/Loader";

export default function ClientProduct({
  initialProductData,
  productError,
  productId,
  relatedProducts,
  relatedProductsError,
}) {
  const router = useRouter();

  const {
    desiredSizesOrder,
    currency,
    checkedSize,
    setCheckedSize,
    isSizesAvailable,
    setIsSizesAvailable,
    backendUrl,
    setIncreaseCartQuantity,
    isAuthenticated,
    setCartData,
  } = useContext(ShopContext);

  const mainSwiperRef = useRef(null);
  const modalSwiperRef = useRef(null);

  const [productData, setProductData] = useState(initialProductData); // було false
  const [size, setSize] = useState("");
  const [isOpenFullScreen, setIsOpenFullScreen] = useState(false);
  const [slideInd, setSlideInd] = useState(0);

  const [loadingState, setLoadingState] = useState({
    addCartLoading: false,
  });

  const addToCart = async (size = "nosize") => {
    try {
      setLoadingState((prev) => ({ ...prev, addCartLoading: true }));

      const response = await axios.post(
        backendUrl + "/api/cart/add",
        {
          productId: productData._id,
          size,
        },
        {
          withCredentials: true, // Ось тут передаємо кукі
        }
      );

      if (response.data.success) {
        setLoadingState((prev) => ({ ...prev, addCartLoading: false }));

        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error, "error");
      toast.error(error.message);
      setLoadingState((prev) => ({ ...prev, addCartLoading: false }));
    }
  };

  const addToCartGuest = (product) => {
    const cart = JSON.parse(
      localStorage.getItem("cart") ||
        JSON.stringify({ items: [], totalPrice: 0 })
    );

    const { _id: productId, price, size = "nosize" } = product;

    // Шукаємо чи є такий товар у корзині
    const existingItemIndex = cart?.items?.findIndex(
      (item) => item.product._id === productId && item.size === size
    );

    if (existingItemIndex > -1) {
      // Якщо є, додаємо до кількості
      cart.items[existingItemIndex].quantity += 1;
    } else {
      // Якщо немає, додаємо новий товар
      cart.items.push({
        product,
        _id: nanoid(),
        size,
        quantity: 1,
        priceAtAdd: price,
      });
    }

    // Оновлюємо totalPrice
    cart.totalPrice = cart.items.reduce((acc, curr) => {
      return acc + curr.priceAtAdd * curr.quantity;
    }, 0);

    // Зберігаємо назад у localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    setCartData(cart);
    toast.success("Продукт додано!");
  };

  const editProduct = async (productId, oldSize, newSize) => {
    try {
      const response = await axios.patch(
        backendUrl + "/api/cart/edit",
        { productId, oldSize, newSize },
        {
          withCredentials: true, // Ось тут передаємо кукі
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error, "error");
      toast.error(error.message);
    }
  };

  const editGuestProduct = (productId, oldSize, newSize) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || {};

    // Знаходимо індекс старого товару
    const oldItemIndex = cart.items.findIndex(
      (item) => item.product._id === productId && item.size === oldSize
    );

    if (oldItemIndex !== -1) {
      // Оновлюємо розмір
      cart.items[oldItemIndex].size = newSize;
    }

    //  Перевіряємо, чи тепер не з’явився дублікат (інший такий самий товар)
    const allSameItems = cart.items.filter(
      (item) => item.product._id === productId && item.size === newSize
    );

    if (allSameItems.length > 1) {
      // Якщо є дублікати — об'єднуємо їх у перший елемент
      const totalQty = allSameItems.reduce((acc, curr) => {
        return acc + curr.quantity;
      }, 0);

      // Беремо дані з першого товару, кількість оновлюємо
      const mergedItem = { ...allSameItems[0], quantity: totalQty };

      // Прибираємо дублікати і додаємо об'єднаний елемент
      cart.items = [
        ...cart.items.filter(
          (item) =>
            // ! (знак заперечення), тобто беремо усі елементи, які не відповідають цій умові.
            !(item.product._id === productId && item.size === newSize)
        ),
        mergedItem,
      ];
    }

    setCartData(cart);
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  {
    /* START OLD SLIDER */
  }
  // const smallPicturesBoxRef = useRef(null);

  // const [image, setImage] = useState(productData?.images?.[0].url || null);
  // const [isScrollable, setIsScrollable] = useState(false);

  // const checkIfScrollableBox = () => {
  //   const box = smallPicturesBoxRef.current;

  //   if (box) {
  //     setIsScrollable(box.scrollWidth > box.clientWidth);
  //   }

  //   if (productData.image?.length <= 1) {
  //     setIsScrollable(false);
  //   }
  // };

  // useEffect(() => {
  //   setImage(image);
  // }, [image]);

  // useEffect(() => {
  //   checkIfScrollableBox();
  //   window.addEventListener("resize", checkIfScrollableBox);

  //   if (productData.images) {
  //     setImage(productData.images[0].url);
  //   }

  //   return () => window.removeEventListener("resize", checkIfScrollableBox);
  // }, [productData, productId]);
  {
    /* END OLD SLIDER */
  }

  const sortedProductSizes = productData.sizes?.sort(
    (a, b) => desiredSizesOrder.indexOf(a) - desiredSizesOrder.indexOf(b)
    // indexOf — це метод, який шукає індекс (позицію) елемента в масиві або підрядка в рядку.
  );

  useEffect(() => {
    if (checkedSize) {
      setSize(checkedSize);
    }

    // Cleanup: виконається при розмонтуванні цього компонента
    return () => {
      // щоб працювало коректно треба вимкнути strict mode, це не важко =)))
      setCheckedSize("");
    };
  }, []);

  useEffect(() => {
    setIsSizesAvailable(!!productData.sizes.length);
  }, []);

  const loading = loadingState.addCartLoading;

  if (loading) return <Loader />;

  return (
    <>
      {productError && <ToastSSRMessage message={productError} type="error" />}
      {isOpenFullScreen && (
        <FullScreenSliderModal
          productData={productData}
          setIsOpenFullScreen={setIsOpenFullScreen}
          slideInd={slideInd}
          mainSwiperRef={mainSwiperRef}
          modalSwiperRef={modalSwiperRef}
        />
      )}
      {Object.keys(productData).length ? (
        <section className="product-page">
          <section className="product__container">
            <div className="product__box">
              {/* START OLD SLIDER */}
              {/* <div className="product__images-box">
                {productData.images?.length > 1 && (
                  <div ref={smallPicturesBoxRef} className="small-images">
                    {productData.images.map((item, index) => {
                      return (
                        <div
                          onClick={() => setImage(item.url)}
                          key={index}
                          className="wrap-small-img"
                        >
                          <img src={item.url} alt="small product item" />
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="large-image">
                  <div className="wrap-large-img">
                    <img src={image} alt="large image" />
                  </div>
                </div>
                {isScrollable && (
                  <div className="scroll-tip">
                    <svg
                      className="scroll__arrow-left"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      x="0px"
                      y="0px"
                      viewBox="0 0 256 256"
                      enableBackground="new 0 0 256 256"
                      xmlSpace="preserve"
                    >
                      <metadata>
                        {" "}
                        Svg Vector Icons : http://www.onlinewebfonts.com/icon{" "}
                      </metadata>
                      <g>
                        <g>
                          <path d="M10,123.8h219.1v8.4H10V123.8z" />
                          <path d="M203.9,115.4L246,128l-42.1,12.6V115.4z" />
                        </g>
                      </g>
                    </svg>

                    <p className="tip-text">Прокрутіть</p>

                    <svg
                      className="scroll__arrow-right"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      x="0px"
                      y="0px"
                      viewBox="0 0 256 256"
                      enableBackground="new 0 0 256 256"
                      xmlSpace="preserve"
                    >
                      <metadata>
                        {" "}
                        Svg Vector Icons : http://www.onlinewebfonts.com/icon{" "}
                      </metadata>
                      <g>
                        <g>
                          <path d="M10,123.8h219.1v8.4H10V123.8z" />
                          <path d="M203.9,115.4L246,128l-42.1,12.6V115.4z" />
                        </g>
                      </g>
                    </svg>
                  </div>
                )}
              </div> */}
              {/* END OLD SLIDER */}

              <div className="swiper-slider-box">
                <ProductSwiperSlider
                  productData={productData}
                  setIsOpenFullScreen={setIsOpenFullScreen}
                  modalSwiperRef={modalSwiperRef}
                  mainSwiperRef={mainSwiperRef}
                  setSlideInd={setSlideInd}
                />
              </div>
              <div className="product__details-box">
                <div className="details__title">{productData.name}</div>
                <div className="details__rating">
                  <div className="rating__stars">
                    <div className="wrap-star">
                      <img src={assets.star_icon} alt="rating icon" />
                    </div>
                    <div className="wrap-star">
                      <img src={assets.star_icon} alt="rating icon" />
                    </div>
                    <div className="wrap-star">
                      <img src={assets.star_icon} alt="rating icon" />
                    </div>
                    <div className="wrap-star">
                      <img src={assets.star_icon} alt="rating icon" />
                    </div>
                    <div className="wrap-star">
                      <img src={assets.star_dull_icon} alt="rating icon" />
                    </div>
                  </div>
                  <div className="rating__counts">(122)</div>
                </div>
                <div className="details__price">
                  {productData.price}
                  {currency}
                </div>
                <p className="details__small-desc">{productData.description}</p>
                {isSizesAvailable && (
                  <div className="details__choose-size">
                    <p className="choose-size__title">Select Size</p>
                    <div className="choose-size__items">
                      {sortedProductSizes?.map((item, index) => (
                        <div
                          onClick={() => setSize(item)}
                          key={index}
                          className={`choose-size__item ${
                            item === size ? "active" : ""
                          }`}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <button
                  onClick={async () => {
                    if (isSizesAvailable) {
                      if (checkedSize) {
                        if (isAuthenticated.isLoggedIn) {
                          await editProduct(productId, checkedSize, size);
                        } else {
                          await editGuestProduct(productId, checkedSize, size);
                        }

                        router.push("/cart");
                      } else {
                        if (isAuthenticated.isLoggedIn) {
                          addToCart(size);
                          setIncreaseCartQuantity((prev) => prev + 1);
                        } else {
                          addToCartGuest({ ...productData, size });
                        }
                      }
                    } else {
                      if (isAuthenticated.isLoggedIn) {
                        addToCart();
                        setIncreaseCartQuantity((prev) => prev + 1);
                      } else {
                        addToCartGuest({ ...productData, size: "nosize" });
                      }
                    }
                  }}
                  className="add-to-cart-btn"
                >
                  {checkedSize ? "РЕДАГУВАТИ ТОВАР" : "ДОДАТИ ДО КОРЗИНИ"}
                </button>
                <hr />
                <div className="details__policy">
                  <p className="policy">100% Оригінальний продукт.</p>
                  <p className="policy">Цей товар можна оплатити на пошті.</p>
                  <p className="policy">
                    Можна повернути або обміняти товар протягом 7 днів.
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section className="product__description">
            <div className="description__container">
              <div className="description__body">
                <b className="description__title-tab">Опис</b>
                <div className="description-text-box">
                  <p className="description__text">
                    E-commerce вебсайт — це онлайн-платформа, яка забезпечує
                    купівлю та продаж товарів або послуг через інтернет. Він
                    слугує віртуальним ринком, де бізнеси та приватні особи
                    можуть демонструвати свої продукти, взаємодіяти з клієнтами
                    та проводити транзакції без необхідності фізичної
                    присутності. E-commerce сайти здобули величезну популярність
                    завдяки зручності, доступності та глобальному охопленню, яке
                    вони надають.
                  </p>
                  <p className="description__text">
                    E-commerce websites typically display products or services
                    along with detailed descriptions, images, prices, and any
                    available variations (e.g., sizes, colors). Each product
                    usually has its own dedicated page with relevant
                    information.
                  </p>
                </div>
              </div>
            </div>
          </section>
          {/* {relatedProductsError && (
            <ToastSSRMessage message={relatedProductsError} type="error" />
          )} */}
          {relatedProducts.length > 0 && (
            <RelatedProducts
              relatedProducts={relatedProducts}
              setSize={setSize}
            />
          )}
        </section>
      ) : (
        <div>No Products!</div>
      )}
    </>
  );
}
