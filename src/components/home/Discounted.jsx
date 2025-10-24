import React, { useEffect, useRef, useState } from "react";
import Countdown from "./CountDown";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import ProductItem from "../product/ProductItem";
import { getAllProducts } from "@/api/product";
import { getTargetDate } from "@/utils/function";

const Discounted = () => {
  const [listDiscountedProduct, setListDiscountedProduct] = useState([]);

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [slidesPerView, setSlidesPerView] = useState(4);

  const updateSlidesPerView = () => {
    const width = window.innerWidth;
    if (width > 1135) {
      setSlidesPerView(4);
    } else if (width > 730) {
      setSlidesPerView(3);
    } else if (width > 559) {
      setSlidesPerView(2);
    } else {
      setSlidesPerView(1);
    }
  };

  useEffect(() => {
    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);
    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, []);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const swiperInstance = swiperRef.current.swiper;
      const updateNavigation = () => {
        setIsBeginning(swiperInstance.isBeginning);
        setIsEnd(swiperInstance.isEnd);
      };
      swiperInstance.on("slideChange", updateNavigation);
      updateNavigation();
      return () => {
        swiperInstance.off("slideChange", updateNavigation);
      };
    }
  }, []);

  useEffect(() => {
    if (
      swiperRef.current &&
      swiperRef.current.swiper &&
      prevRef.current &&
      nextRef.current
    ) {
      const swiper = swiperRef.current.swiper;
      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;
      swiper.navigation.init();
      swiper.navigation.update();
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = {
        pageNum: 1,
        pageSize: 10,
        sortBy: "discount_desc",
      };

      const response = await getAllProducts(data);
      if (response.status === 200) {
        setListDiscountedProduct(response.data.items || []);
      }
    };
    fetchData();
  }, []);
  return (
    <div
      style={{
        backgroundImage: `url("https://bizweb.dktcdn.net/100/570/902/themes/1027061/assets/bg-flash-sale.jpg?1750130832000")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="w-full xl:h-[700px] px-[20px]  md:px-[50px] xl:px-[130px] py-[50px]"
    >
      <div data-aos="fade-down" className="w-full flex xl:relative">
        <img
          src="https://bizweb.dktcdn.net/100/570/902/themes/1027061/assets/bg-title-flashsale.png?1750130832000"
          className="hidden xl:flex z-10"
        />
        <div className="w-full flex flex-col sm:flex-row items-center justify-between bg-white py-4 px-8 rounded-xl xl:absolute xl:bottom-0 xl:left-[35px]">
          <div className="hidden xl:flex w-[270px]"></div>
          <Countdown
            targetDate={getTargetDate(
              listDiscountedProduct[0]?.daysRemaining || 0
            )}
          />
          <p className="text-[30px] md:text-[35px] xl:text-[42px] leading-[140%] text-[#ad7555] font-semibold">
            Ưu đãi đặc biệt
          </p>
        </div>
      </div>

      <div
        data-aos="fade-up"
        className="w-full flex items-center justify-between gap-4 relative mt-[50px]"
      >
        <button
          ref={prevRef}
          disabled={isBeginning}
          className={`absolute shadow-xl ring-1 ring-[#f4b896] border-[#ad7555] top-[50%] left-[10px] z-10 p-1 rounded-md flex items-center justify-center ${
            isBeginning
              ? "bg-gray-300 opacity-50 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          <GrFormPrevious className="text-[#ad7555] w-5 h-5" />
        </button>

        <div className="w-full flex items-center justify-center">
          <div className="w-full flex *:justify-center items-center">
            <Swiper
              data-aos="fade-up"
              slidesPerView={slidesPerView}
              loop={slidesPerView < listDiscountedProduct.length}
              modules={[Navigation]}
              ref={swiperRef}
              slidesOffsetBefore={0}
              slidesOffsetAfter={0}
              className="w-full flex justify-center items-center"
            >
              {listDiscountedProduct.map((product, index) => (
                <SwiperSlide
                  key={index}
                  className="!mr-0 last:!mr-0 w-full flex justify-center"
                >
                  <ProductItem product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        <button
          ref={nextRef}
          disabled={isEnd}
          className={`absolute top-[50%] shadow-xl ring-1 ring-[#ad7555] right-0 z-10 p-1 rounded-md flex items-center justify-center ${
            isEnd
              ? "bg-gray-300 opacity-50 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          <GrFormNext className="text-[#ad7555] w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Discounted;
