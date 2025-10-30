"use client";

import { useState, useRef, useEffect } from "react";

import Skeleton from "./Skeleton";
import { assets } from "../../public/assets/assets";

const Hero = () => {
  const [isLoading, setIsLoading] = useState(true);
  const vRef = useRef(null);

  useEffect(() => {
    const v = vRef.current;
    if (!v) return;

    const tryPlay = () => {
      v.play().catch(() => {
        // autoplay заблоковано — ігноруємо
      });
    };

    // якщо відео вже готове
    if (v.readyState >= 2) {
      setIsLoading(false);
      tryPlay();
      return;
    }

    const onReady = () => {
      setIsLoading(false);
      tryPlay();
    };

    v.addEventListener("loadeddata", onReady);
    v.addEventListener("canplay", onReady);

    return () => {
      v.removeEventListener("loadeddata", onReady);
      v.removeEventListener("canplay", onReady);
    };
  }, []);

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
              ref={vRef}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onLoadedData={() => setIsLoading(false)}
              onCanPlay={() => setIsLoading(false)}
              onCanPlayThrough={() => setIsLoading(false)}
              style={{ opacity: isLoading ? 0 : 1, transition: "opacity .35s" }}
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
