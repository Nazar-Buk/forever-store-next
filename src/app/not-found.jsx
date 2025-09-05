import Link from "next/link";
import { assets } from "../../public/assets/assets";

const NotFound = () => {
  return (
    <section className="error-page">
      <div className="error__container">
        <div className="error__body">
          <h1 className="error__title">ОЙ ЛИШЕНЬКО! СТОРІНКУ НЕ ЗНАЙДЕНО :/</h1>

          <Link href="/">
            <h2>головна сторінка 🥰</h2>
          </Link>
          <div className="wrap-err-img">
            <img src={assets.error_404} alt="page not found image" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
