import Title from "@/components/Title";
import Newsletter from "@/components/Newsletter";
import { assets } from "../../../../public/assets/assets";

export const metadata = {
  title: "About",
};

export default function About() {
  return (
    <section className="about-page">
      <div className="about__container">
        <div className="about__body">
          <Title text1="Про " text2="Нас" />
          <div className="about__info-box">
            <div className="info__image">
              <img src={assets.about_img} alt="about page image" />
            </div>
            <div className="info__text">
              <p>
                Buk Sklad народився з пристрасті до інновацій та прагнення
                змінити спосіб, у який люди роблять покупки онлайн. Наша історія
                розпочалася з простої ідеї: створити платформу, де клієнти
                можуть легко знаходити, досліджувати та купувати широкий
                асортимент товарів, не виходячи з дому.
              </p>
              <p>
                Від самого початку ми невпинно працюємо над тим, щоб пропонувати
                різноманітний вибір високоякісних товарів, які задовольнять
                будь-який смак та вподобання. Від моди та косметики до
                електроніки та предметів для дому — ми пропонуємо широкий
                асортимент, що постачається від надійних брендів та
                постачальників.
              </p>
              <b>Наша Місія</b>
              <p>
                Наша місія у Buk Sklad — надавати клієнтам свободу вибору,
                зручність та впевненість. Ми прагнемо забезпечити безперебійну
                покупку, яка перевищує очікування, від перегляду товарів і
                оформлення замовлення до доставки та подальшого обслуговування.
              </p>
            </div>
          </div>
          <section className="choose-us">
            <Title text1="Чому " text2="Вибирають Нас" />
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
