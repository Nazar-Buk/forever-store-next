import Title from "@/components/Title";
import Newsletter from "@/components/Newsletter";
import { assets } from "../../../public/assets/assets";

export default async function Contact() {
  return (
    <section className="contact-page">
      <div className="contact__container">
        <div className="contact__body">
          <Title text1="Contact " text2="Us" />
          <div className="contact-content">
            <div className="image-box">
              <img src={assets.contact_img} alt="contact image" />
            </div>
            <div className="contact__description">
              <div className="description__title">Our Store</div>
              <p>
                54709 Willms Station <br />
                Suite 350, Washington, USA
              </p>
              <a href="tel:4155550132">Tel: (415) 555‑0132</a>
              <a href="mailto:greatstackdev@gmail.com">
                Email: greatstackdev@gmail.com
              </a>
              <div className="description__title">Careers at Forever</div>
              <p>Learn more about our teams and job openings.</p>
              <button className="secondary-btn">Explore Jobs</button>
            </div>
          </div>
        </div>
      </div>
      <Newsletter />
    </section>
  );
}
