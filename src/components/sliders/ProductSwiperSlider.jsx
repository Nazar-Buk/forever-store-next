"use client";

import { useState } from "react";
import Image from "next/image";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

// import required modules
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

import Skeleton from "../Skeleton";

const ProductSwiperSlider = ({
  productData,
  setIsOpenFullScreen,
  mainSwiperRef,
  modalSwiperRef,
  setSlideInd,
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isImgLoad, setIsImgLoad] = useState(true);

  return (
    <>
      <div className="thumbs-image-slider">
        <Swiper
          onSwiper={setThumbsSwiper}
          //   direction="vertical"
          spaceBetween={10}
          slidesPerView="auto"
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="mySwiper"
          breakpoints={{
            320: {
              // від 0px і вище
              direction: "horizontal",
            },
            1200: {
              // від 0px і вище
              direction: "vertical",
            },
          }}
        >
          {productData.images?.map((imageData) => (
            <SwiperSlide>
              {/* <img src={imageData?.url} /> */}
              {isImgLoad && <Skeleton />}
              <Image
                src={imageData?.url}
                alt="slider image"
                fill
                quality={70}
                loading="eager"
                onLoad={() => setIsImgLoad(false)}
                sizes="(max-width: 1920px) 10vw"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="large-image-slider">
        <Swiper
          style={{
            "--swiper-navigation-color": "#fff",
            "--swiper-pagination-color": "#fff",
          }}
          spaceBetween={10}
          navigation={false}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Navigation, Thumbs]}
          className="mySwiper2"
          onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
          onSlideChange={(swiper) => {
            if (modalSwiperRef.current) {
              modalSwiperRef.current.slideTo(swiper.activeIndex);
            }
          }}
          breakpoints={{
            320: {
              // від 0px і вище
              //   direction: "horizontal",
            },
            1200: {
              // від 0px і вище
              //   direction: "vertical",
            },
          }}
        >
          {productData.images?.map((imageData, ind) => (
            <SwiperSlide
              onClick={() => {
                setIsOpenFullScreen(true);
                setSlideInd(ind);
              }}
            >
              {/* <img src={imageData?.url} /> */}
              {isImgLoad && <Skeleton />}
              <Image
                src={imageData?.url}
                alt="slider image"
                fill
                quality={70}
                loading="eager"
                onLoad={() => setIsImgLoad(false)}
                sizes="(max-width: 768px) 100vw"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default ProductSwiperSlider;
