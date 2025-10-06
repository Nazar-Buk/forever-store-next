import Link from "next/link";

import { assets } from "../../public/assets/assets";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container footer__body">
        <div className="footer__columns">
          <div className="footer__left-column first-column">
            <Link href="/" className="wrap-footer-logo">
              <img src={assets.logo2} alt="footer logo" />
            </Link>
            <p className="first-column__text">
              Наш магазин пропонує стильні та якісні товари для щоденного
              використання. Ми ретельно підбираємо колекції, щоб кожен клієнт
              міг знайти щось для себе. Від класичних хітів продажів до новинок
              сезону – усе для вашого комфорту та задоволення від покупок.
            </p>
          </div>
          <div className="footer__right-column">
            <div className="second-column">
              <h4>КОМПАНІЯ</h4>
              <nav className="second-column__navigation">
                <ul className="second-column__menu">
                  <li>
                    <Link href="/" className="second-column__menu-item">
                      Головна
                    </Link>
                  </li>
                  <li>
                    <Link href="/about-us" className="second-column__menu-item">
                      Про нас
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="second-column__menu-item">
                      Доставка
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="second-column__menu-item">
                      Політика конфіденційності
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="third-column">
              <h4>ЗВ’ЯЖІТЬСЯ З НАМИ</h4>
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
