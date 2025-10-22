import React, { useCallback, useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const LeftComponent = ({
  product,
  selectedVariantIndex,
  setSelectedVariantIndex,
}) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [indexImage, setIndexImage] = useState(0);

  const displayMedias = React.useMemo(() => {
    const base = product?.medias || [];
    const variantMedias =
      product?.productVariations?.map((v) => v.media)?.filter(Boolean) || [];

    const all = [...base, ...variantMedias];
    const unique = all.filter(
      (item, index, self) => index === self.findIndex((t) => t.url === item.url)
    );
    return unique;
  }, [product]);

  const updateNavigation = useCallback(() => {
    if (swiperRef.current) {
      const swiperInstance = swiperRef.current;
      setIndexImage(swiperInstance.activeIndex);
      setIsBeginning(swiperInstance.isBeginning);
      setIsEnd(swiperInstance.isEnd);
    }
  }, []);

  useEffect(() => {
    if (swiperRef.current) {
      const swiperInstance = swiperRef.current;
      swiperInstance.on("slideChange", updateNavigation);
      updateNavigation();
      return () => {
        swiperInstance.off("slideChange", updateNavigation);
      };
    }
  }, [updateNavigation]);

  useEffect(() => {
    console.log(indexImage);
  }, [indexImage]);

  useEffect(() => {
    if (!swiperRef.current || !product?.productVariations) return;

    const variantMedia =
      product?.productVariations[selectedVariantIndex]?.media?.url;
    if (!variantMedia) return;

    const variantIndex = displayMedias.findIndex((m) => m.url === variantMedia);

    if (variantIndex >= 0) {
      swiperRef.current.slideTo(variantIndex);
      setIndexImage(variantIndex);
    }
  }, [selectedVariantIndex, product, displayMedias]);

  const handleClickThumbnail = (image, index) => {
    setIndexImage(index);
    swiperRef.current?.slideTo(index);

    // Kiểm tra ảnh thuộc variant nào
    const foundVariantIndex = product?.productVariations?.findIndex(
      (v) => v.media?.url === image.url
    );

    // Nếu ảnh thuộc variant nào đó → set lại selectedVariantIndex
    if (
      foundVariantIndex !== -1 &&
      typeof setSelectedVariantIndex === "function"
    ) {
      setSelectedVariantIndex(foundVariantIndex);
    }
  };

  return (
    <div
      data-aos="fade-right"
      className="flex flex-col lg:w-2/5 gap-5 justify-between w-full"
    >
      {/* Swiper chính */}
      <div className="relative w-full h-[500px] mt-5 flex items-center justify-between rounded-2xl max-[500px]:w-full">
        {/* Nút prev */}
        <button
          onClick={() => {
            if (swiperRef.current) updateNavigation();
          }}
          ref={prevRef}
          disabled={isBeginning}
          className={`absolute left-2 z-10 flex items-center justify-center rounded-full p-1 border-none transition 
            ${
              isBeginning
                ? "bg-gray-300 opacity-50 cursor-not-allowed"
                : "bg-[#9a542c] hover:bg-[#5c3119]"
            }`}
        >
          <GrFormPrevious className="w-5 h-5 text-white" />
        </button>

        {/* Swiper */}
        <Swiper
          modules={[Navigation]}
          ref={swiperRef}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            updateNavigation();
          }}
          className="w-full h-full rounded-2xl"
        >
          {displayMedias.map((image) => (
            <SwiperSlide key={image.id}>
              <div className="w-full h-full flex items-center justify-center rounded-2xl">
                <img
                  src={image.url}
                  alt="product"
                  className="w-full h-full max-h-[500px] object-cover rounded-2xl"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Nút next */}
        <button
          onClick={() => {
            if (swiperRef.current) updateNavigation();
          }}
          ref={nextRef}
          disabled={isEnd}
          className={`absolute right-2 z-10 flex items-center justify-center rounded-full p-1 border-none transition 
            ${
              isEnd
                ? "bg-gray-300 opacity-50 cursor-not-allowed"
                : "bg-[#9a542c] hover:bg-[#5c3119]"
            }`}
        >
          <GrFormNext className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Danh sách ảnh bên dưới */}
      <div
        key={indexImage}
        className="flex w-full gap-2 px-5 max-h-[500px] overflow-y-auto max-[500px]:hidden"
      >
        {displayMedias.map((image, index) => (
          <div
            key={image.id}
            onClick={() => handleClickThumbnail(image, index)}
            className={`w-full cursor-pointer rounded-2xl border border-gray-200 shadow-md opacity-60 
              ${
                indexImage === index
                  ? "border-[#034c9b] shadow-lg opacity-100"
                  : ""
              }`}
            style={
              indexImage === index
                ? {
                    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                    opacity: 1,
                    borderColor: "#9a542c",
                  }
                : {}
            }
          >
            <img
              src={image.url}
              alt="product"
              className="w-full h-[120px] object-cover rounded-2xl shadow"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftComponent;
