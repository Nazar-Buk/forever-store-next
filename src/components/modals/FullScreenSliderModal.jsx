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

import { assets } from "../../../public/assets/assets";

const FullScreenSliderModal = (props) => {
  const {
    productData,
    setIsOpenFullScreen,
    slideInd,
    modalSwiperRef,
    mainSwiperRef,
  } = props;

  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <section className="full-screen-slider__modal">
      <div className="close-btn" onClick={() => setIsOpenFullScreen(false)}>
        <img src={assets.close_white} alt="cross icon" />
      </div>
      <div className="wrap-thumbs-and-large-sliders">
        <div className="thumbs-image-slider-box__modal">
          <Swiper
            onSwiper={setThumbsSwiper}
            //   direction="vertical"
            spaceBetween={10}
            slidesPerView="auto"
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="swiper-thumbs__modal"
            breakpoints={{
              320: {
                // від 0px і вище
                direction: "horizontal",
              },
              992: {
                // від 0px і вище
                direction: "vertical",
              },
            }}
          >
            {productData.images?.map((imageData) => (
              <SwiperSlide>
                {/* <img src={imageData?.url} /> */}
                <Image
                  src={imageData?.url}
                  alt={"Product picture"}
                  fill // будь з тим акуратгий, fill робить <Image> абсолютно позиціонованим (position: absolute;)
                  // Тому його батьківський контейнер повинен мати:
                  // position: relative;
                  // і фіксовані пропорції (aspect-ratio або фіксовану висоту).
                  quality={70}
                  loading="eager"
                  sizes="(max-width: 1920px) 10vw"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="large-image-slider-box___modal">
          <Swiper
            style={{
              "--swiper-navigation-color": "#fff",
              "--swiper-pagination-color": "#fff",
            }}
            spaceBetween={10}
            navigation={true}
            thumbs={{ swiper: thumbsSwiper }}
            modules={[FreeMode, Navigation, Thumbs]}
            className="swiper-large__modal"
            onSwiper={(swiper) => {
              modalSwiperRef.current = swiper;
              swiper.slideTo(slideInd); // одразу стрибаємо після ініціалізації
            }}
            onSlideChange={(swiper) => {
              mainSwiperRef.current?.slideTo(swiper.activeIndex);
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
            {productData.images?.map((imageData) => (
              <SwiperSlide>
                {/* <img src={imageData?.url} /> */}
                <Image
                  src={imageData?.url}
                  alt={"Product picture"}
                  fill // будь з тим акуратгий, fill робить <Image> абсолютно позиціонованим (position: absolute;)
                  // Тому його батьківський контейнер повинен мати:
                  // position: relative;
                  // і фіксовані пропорції (aspect-ratio або фіксовану висоту).
                  quality={80}
                  loading="eager"
                  sizes="(max-width: 768px) 100vw"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default FullScreenSliderModal;
