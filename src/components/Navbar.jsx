"use client";

import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

import { assets } from "../../public/assets/assets";
import { ShopContext } from "../context/ShopContext";
import NavItem from "../components/NavItem";
// import Loader from "./Loader";

export default function Header() {
  const pathName = usePathname();
  const router = useRouter();
  const adminPanelUrl = process.env.NEXT_PUBLIC_ADMIN_PANEL_URL;

  const [visible, setVisible] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const {
    setShowSearch,
    getCartCount,
    isLoading,
    setIsLoading,
    backendUrl,
    // isAuthenticated,
  } = useContext(ShopContext);
  const cartTotalCount = getCartCount();

  const isOpenMobileMenu = (isOpen) => {
    isOpen
      ? (document.body.style.overflow = "hidden") // Забороняємо скролінг сайту
      : (document.body.style.overflow = ""); // Відновлюємо скролінг сайту
    setVisible(isOpen);
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/user/check-auth", {
        withCredentials: true, // обов'язково, щоб кука була передана на сервер
      });

      console.log(response, "response from checkAuth");

      if (response.data.success) {
        setIsAuthenticated(true);
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log("Auth check failed:", error);
      setIsAuthenticated(false);
      // toast.error(error.data.message);
    }
  };

  // console.log(isAuthenticated, "isAuthenticated CONTEXT");

  useEffect(() => {
    checkAuth();
  }, []);

  console.log(isAuthenticated, "isAuthenticated");

  const logout = async () => {
    try {
      setIsLoading(true);

      // Надсилаємо POST запит на бекенд для очищення куки
      const response = await axios.post(
        backendUrl + "/api/user/logout",
        {},
        { withCredentials: true } // обов'язково! — щоби кука була передана на сервер
      );

      if (response.data.success) {
        // console.log(response, "response Logout");
        setIsLoading(false);
        router.push("/login");
        toast.success(response.data.message);
      } else {
        setIsLoading(false);
        toast.success(response.data.message);
      }
    } catch (error) {
      setIsLoading(true);
      console.log(error, "error");
      toast.success(error.data.message);
    }
  };

  return (
    <header className="header__container">
      <div className="header__content">
        <Link href="/" className="header__logo">
          <img src={assets.logo} alt="logo" />
        </Link>
        <nav>
          <ul className="header__menu">
            <li>
              <NavItem href="/" customClass={"menu__item"}>
                <p>HOME</p>
              </NavItem>
            </li>
            <li>
              <NavItem href="/collection" customClass={"menu__item"}>
                <p>COLLECTION</p>
              </NavItem>
            </li>
            <li>
              <NavItem href="/about-us" customClass={"menu__item"}>
                <p>ABOUT</p>
              </NavItem>
            </li>
            <li>
              <NavItem href="/contact" customClass={"menu__item"}>
                <p>CONTACT</p>
              </NavItem>
            </li>
          </ul>
        </nav>
        <div className="header__action-bar">
          <div
            onClick={() => {
              if (pathName !== "/collection") {
                router.push("/collection");
              }

              setShowSearch(true);
            }}
            className="wrap-icon"
          >
            <img src={assets.search_icon} alt="search" />
          </div>
          <div className="wrap-icon profile">
            <Link href="/login">
              <img src={assets.profile_icon} alt="profile-icon" />
            </Link>
            <div className="profile__menu">
              <p className="profile__item">My Profile</p>
              <p className="profile__item">Orders</p>
              {isAuthenticated && (
                <p
                  className="profile__item"
                  onclick={() => router.push(adminPanelUrl)}
                >
                  <a href={adminPanelUrl}>Admin Panel</a>
                </p>
              )}
              {isAuthenticated ? (
                <p className="profile__item" onClick={logout}>
                  Logout
                </p>
              ) : (
                <p className="profile__item">
                  <Link href="/login">Login</Link>
                </p>
              )}
            </div>
          </div>
          <Link href="/cart" className="wrap-icon cart-icon">
            <img src={assets.cart_icon} alt="shopping cart" />
            <p className={`${cartTotalCount && "active"}`}>{cartTotalCount}</p>
          </Link>
          <div
            onClick={() => isOpenMobileMenu(true)}
            className="wrap-icon mobile-icon"
          >
            <img src={assets.menu_icon} alt="menu icon" />
          </div>
        </div>
      </div>

      {/* mobile menu */}
      <div
        style={visible ? { display: "block" } : { display: "none" }}
        className="header__mobile-menu"
      >
        <div className="mobile-menu__close">
          <div
            onClick={() => isOpenMobileMenu(false)}
            className="wrap-close-btn"
          >
            <svg
              className="close-btn__arrow"
              aria-label="close mobile menu"
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 330 330"
              xmlSpace="preserve"
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
            <p>Back</p>
          </div>
        </div>
        <div className="wrap-menu-content">
          <div className="header__mobile-logo">
            <img src={assets.logo} alt="logo" />
          </div>
          <nav>
            <ul onClick={() => isOpenMobileMenu(false)} className="mobile-menu">
              <li>
                <NavItem href="/" customClass={"mobile-menu__item"}>
                  <p>HOME</p>
                </NavItem>
              </li>
              <li>
                <NavItem href="/collection" customClass={"mobile-menu__item"}>
                  <p>COLLECTION</p>
                </NavItem>
              </li>
              <li>
                <NavItem href="/about-us" customClass={"mobile-menu__item"}>
                  <p>ABOUT</p>
                </NavItem>
              </li>
              <li>
                <NavItem href="/contact" customClass={"mobile-menu__item"}>
                  <p>CONTACT</p>
                </NavItem>
              </li>
            </ul>
          </nav>
          <div className="mobile__action-bar">
            <div className="profile">
              <div
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="profile__icon-title-block"
              >
                <div className="wrap-icon ">
                  <img src={assets.profile_icon} alt="profile-icon" />
                </div>
                <p>PROFILE</p>

                <svg
                  className="profile__arrow"
                  style={
                    isProfileMenuOpen ? { transform: "rotate(270deg)" } : {}
                  }
                  aria-label="open/close profile menu"
                  version="1.1"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 330 330"
                  xmlSpace="preserve"
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

              {isProfileMenuOpen && (
                <ul
                  onClick={() => isOpenMobileMenu(false)}
                  className="profile__menu"
                >
                  <Link>
                    <li className="profile__item">MY PROFILE</li>
                  </Link>
                  <Link>
                    <li className="profile__item">ORDERS</li>
                  </Link>
                  <Link>
                    <li className="profile__item">LOGOUT</li>
                  </Link>
                </ul>
              )}
            </div>
            <Link
              onClick={() => {
                setShowSearch(true);
                isOpenMobileMenu(false);
              }}
              href="/collection"
              className="search"
            >
              <div className="wrap-icon">
                <img src={assets.search_icon} alt="search" />
              </div>
              <p>SEARCH</p>
            </Link>

            <Link
              href="/cart"
              className="cart"
              onClick={() => isOpenMobileMenu(false)}
            >
              <div className="wrap-icon">
                <img src={assets.cart_icon} alt="shopping cart" />
                <p className={`${cartTotalCount && "active "} counter`}>
                  {cartTotalCount}
                </p>
              </div>
              <p className="cart__title">SHOPPING CART</p>
            </Link>
          </div>
        </div>
      </div>
      {/* end mobile menu */}
    </header>
  );
}
