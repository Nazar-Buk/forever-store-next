import { assets } from "../../public/assets/assets";

const OurPolicy = () => {
  return (
    <section className="our-policy">
      <div className="our-policy__container wrap-policy-content">
        <div className="our-policy__item">
          <div className="wrap-our-policy__img">
            <img src={assets.exchange_icon} alt="policy exchange icon" />
          </div>
          <p className="our-policy__title">Легкий обмін товарів</p>
          <p className="our-policy__subtitle">
            Легка та зручна політика обміну
          </p>
        </div>
        <div className="our-policy__item">
          <div className="wrap-our-policy__img">
            <img src={assets.quality_icon} alt="return policy icon" />
          </div>
          <p className="our-policy__title">Повернення протягом 7 днів</p>
          <p className="our-policy__subtitle">
            Повернення без витрат протягом 7 днів
          </p>
        </div>
        <div className="our-policy__item">
          <div className="wrap-our-policy__img">
            <img src={assets.support_img} alt="customer support icon" />
          </div>
          <p className="our-policy__title">Найкраща підтримка клієнтів</p>
          <p className="our-policy__subtitle">Підтримка клієнтів 24/7</p>
        </div>
      </div>
    </section>
  );
};

export default OurPolicy;
