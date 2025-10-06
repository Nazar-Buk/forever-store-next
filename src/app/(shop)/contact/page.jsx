import Title from "@/components/Title";
import Newsletter from "@/components/Newsletter";
import { assets } from "../../../../public/assets/assets";

export const metadata = {
  title: "Contact",
};

export default async function Contact() {
  return (
    <section className="contact-page">
      <div className="contact__container">
        <div className="contact__body">
          <Title text1="Наші " text2="Контакти" />
          <div className="contact-content">
            <div className="image-box">
              <img src={assets.contact_img} alt="contact image" />
            </div>
            <div className="contact__description">
              <div className="description__title">Наш Магазин</div>
              <p>
                54709 Willms Station <br />
                Suite 350, Washington, USA
              </p>
              <a href="tel:4155550132">Tel: (415) 555‑0132</a>
              <a href="mailto:greatstackdev@gmail.com">
                Email: greatstackdev@gmail.com
              </a>
              <div className="description__title">
                Розпочни кар’єру з Buk Sklad
              </div>
              <p>Приєднуйтесь до нашої команди.</p>
              <button className="secondary-btn">Переглянути вакансії</button>
            </div>
          </div>
        </div>
      </div>
      <Newsletter />
    </section>
  );
}
