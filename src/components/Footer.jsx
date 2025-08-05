import Link from "next/link";

import { assets } from "../../public/assets/assets";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container footer__body">
        <div className="footer__columns">
          <div className="footer__left-column first-column">
            <Link href="/" className="wrap-footer-logo">
              <img src={assets.logo} alt="footer logo" />
            </Link>
            <p className="first-column__text">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
          </div>
          <div className="footer__right-column">
            <div className="second-column">
              <h4>COMPANY</h4>
              <nav className="second-column__navigation">
                <ul className="second-column__menu">
                  <li>
                    <Link href="/" className="second-column__menu-item">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/about-us" className="second-column__menu-item">
                      About us
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="second-column__menu-item">
                      Delivery
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="second-column__menu-item">
                      Privacy policy
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="third-column">
              <h4>GET IN TOUCH</h4>
              <a href="tel:12124567890" className="third-column__phone">
                +1-212-456-7890
              </a>
              <a
                href="mailto:greatstackdev@gmail.com"
                className="third-column__email"
              >
                greatstackdev@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer__copyright">
        <div className="copyright__container">
          <p className="copyright__text">
            Copyright 2024 © GreatStack.dev - All Right Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
