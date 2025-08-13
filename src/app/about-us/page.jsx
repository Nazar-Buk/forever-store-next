import Title from "@/components/Title";
import Newsletter from "@/components/Newsletter";
import { assets } from "../../../public/assets/assets";

export default function About() {
  return (
    <section className="about-page">
      <div className="about__container">
        <div className="about__body">
          <Title text1="About " text2="Us" />
          <div className="about__info-box">
            <div className="info__image">
              <img src={assets.about_img} alt="about page image" />
            </div>
            <div className="info__text">
              <p>
                Forever was born out of a passion for innovation and a desire to
                revolutionize the way people shop online. Our journey began with
                a simple idea: to provide a platform where customers can easily
                discover, explore, and purchase a wide range of products from
                the comfort of their homes.
              </p>
              <p>
                Since our inception, we've worked tirelessly to curate a diverse
                selection of high-quality products that cater to every taste and
                preference. From fashion and beauty to electronics and home
                essentials, we offer an extensive collection sourced from
                trusted brands and suppliers.
              </p>
              <b>Our Mission</b>
              <p>
                Our mission at Forever is to empower customers with choice,
                convenience, and confidence. We're dedicated to providing a
                seamless shopping experience that exceeds expectations, from
                browsing and ordering to delivery and beyond.
              </p>
            </div>
          </div>
          <section className="choose-us">
            <Title text1="Why " text2="Choose Us" />
            <div className="choose-us__table">
              <div className="choose-us__table-cell">
                <div className="cell__content">
                  <b>Quality Assurance:</b>
                  <p>
                    We meticulously select and vet each product to ensure it
                    meets our stringent quality standards.
                  </p>
                </div>
              </div>
              <div className="choose-us__table-cell">
                <div className="cell__content">
                  <b>Convenience: </b>
                  <p>
                    With our user-friendly interface and hassle-free ordering
                    process, shopping has never been easier.
                  </p>
                </div>
              </div>
              <div className="choose-us__table-cell">
                <div className="cell__content">
                  <b>Exceptional Customer Service:</b>
                  <p>
                    Our team of dedicated professionals is here to assist you
                    the way, ensuring your satisfaction is our top priority.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Newsletter />
    </section>
  );
}
