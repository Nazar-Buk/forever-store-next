import { assets } from "../../public/assets/assets";

const OurPolicy = () => {
  return (
    <section className="our-policy">
      <div className="our-policy__container wrap-policy-content">
        <div className="our-policy__item">
          <div className="wrap-our-policy__img">
            <img src={assets.exchange_icon} alt="policy exchange icon" />
          </div>
          <p className="our-policy__title">Easy Exchange Policy</p>
          <p className="our-policy__subtitle">
            We offer hassle free exchange policy
          </p>
        </div>
        <div className="our-policy__item">
          <div className="wrap-our-policy__img">
            <img src={assets.quality_icon} alt="return policy icon" />
          </div>
          <p className="our-policy__title">7 Days Return Policy</p>
          <p className="our-policy__subtitle">
            We provide 7 days free return policy
          </p>
        </div>
        <div className="our-policy__item">
          <div className="wrap-our-policy__img">
            <img src={assets.support_img} alt="customer support icon" />
          </div>
          <p className="our-policy__title">Best Customer Support</p>
          <p className="our-policy__subtitle">
            We provide 24/7 customer support
          </p>
        </div>
      </div>
    </section>
  );
};

export default OurPolicy;
