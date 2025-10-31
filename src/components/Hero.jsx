"use client";

import { useState, useRef, useEffect } from "react";

import Skeleton from "./Skeleton";
import { assets } from "../../public/assets/assets";

const Hero = () => {
  // const [isLoading, setIsLoading] = useState(true);
  // const videoRef = useRef(null);

  // console.log(isLoading, "isLoading");

  // const logEvent = (e) => {
  //   console.log(e.type);
  // };

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
            {/* {isLoading && <Skeleton />} */}
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              // onLoadStart={logEvent}
              // onLoadedMetadata={logEvent}
              // onLoadedData={logEvent}
              // onCanPlay={logEvent}
              // onCanPlayThrough={logEvent}
              // onProgress={logEvent}
              // onPlay={logEvent}
              // onPlaying={logEvent}
              // onPause={logEvent}
              // onEnded={logEvent}
              // onTimeUpdate={logEvent}
              // onWaiting={logEvent}
              // // /// це допомогло
              // webkit-playsinline="true"
              // x5-playsinline="true"
              // x-webkit-airplay="allow"
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
