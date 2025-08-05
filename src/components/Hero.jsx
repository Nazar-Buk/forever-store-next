import { assets } from "../../public/assets/assets";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero__container">
        <div className="wrap-hero__content">
          <div className="hero__text">
            <div className="wrap-hero__text-content">
              <p className="hero__top-title">our bestsellers</p>
              <h1>Latest Arrivals</h1>
              <p className="hero__bottom-title">Shop Now</p>
            </div>
          </div>
          <div className="hero__picture">
            {/* <img src={assets.hero_img} alt="banner picture" /> */}
            <video autoPlay muted loop>
              <source src={assets.hero_video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
