"use client";

import { useState } from "react";

import Skeleton from "./Skeleton";
import { assets } from "../../public/assets/assets";

const Hero = () => {
  const [isLoading, setIsLoading] = useState(true);

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
            {isLoading && <Skeleton />}
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onCanPlayThrough={() => setIsLoading(false)}
              style={{ display: isLoading ? "none" : "block" }}
            >
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
