import { listAdvertise } from "@/utils/Contants";
import React from "react";
import { RiExternalLinkFill } from "react-icons/ri";

const Categories = () => {
  const listRoom = listAdvertise;
  return (
    <div className="w-full h-[317px] xl:h-[407px] px-[20px]  md:px-[50px] lg:px-[130px] py-[20px] flex items-center justify-between gap-[20px]">
      <div
        data-aos="zoom-in-left"
        className="w-1/4 h-full hidden md:flex flex-col justify-end gap-[10px] rounded-lg px-[20px] py-[30px] categories-bg-1 bg-cover-center-no-repeat"
      >
        <p className="text-[24px] text-[#64340F] font-semibold leading-[140%]">
          {listRoom[0].title}
        </p>
        <p className="text-[14px] text-[#63574C] leading-[140%]">
          {listRoom[0].description}
        </p>
        <p className="text-[#FF7205] flex items-center gap-[10px] cursor-pointer font-semibold">
          Xem tất cả <RiExternalLinkFill />
        </p>
      </div>

      <div className="w-full md:w-3/4 h-full flex flex-col gap-[20px]">
        <div className="w-full h-1/2 flex items-center justify-between gap-[20px]">
          <div
            data-aos="zoom-in-down"
            className="w-1/3 h-full rounded-lg px-[20px] py-[30px] flex flex-col gap-[10px] items-start categories-bg-2 bg-cover-center-no-repeat"
          >
            <p className="text-[18px] md:text-[20px] lg:text-[24px] text-[#64340F] font-semibold leading-[140%]">
              {listRoom[1].title}
            </p>
            <p className="text-[14px] hidden md:block text-[#63574C] leading-[140%]">
              {listRoom[1].description}
            </p>
            <p className="text-[#FF7205] flex items-center gap-[10px] cursor-pointer font-semibold">
              Xem tất cả <RiExternalLinkFill className="hidden md:block" />
            </p>
          </div>

          <div
            data-aos="zoom-in-down"
            className="w-2/3 h-full rounded-lg px-[20px] py-[30px] flex flex-col gap-[10px] items-end categories-bg-3 bg-cover-center-no-repeat"
          >
            <p className="text-[18px] md:text-[20px] lg:text-[24px] text-[#64340F] font-semibold leading-[140%]">
              {listRoom[2].title}
            </p>
            <p className="text-[14px] hidden md:block text-[#63574C] leading-[140%]">
              {listRoom[2].description}
            </p>
            <p className="text-[#FF7205] flex items-center gap-[10px] cursor-pointer font-semibold">
              Xem tất cả <RiExternalLinkFill className="hidden md:block" />
            </p>
          </div>
        </div>

        <div className="w-full h-1/2 flex items-center justify-between gap-[20px]">
          <div
            data-aos="zoom-in-up"
            className="w-2/3 h-full rounded-lg px-[20px] py-[30px] flex flex-col gap-[10px] items-start categories-bg-4 bg-cover-center-no-repeat"
          >
            <p className="text-[18px] md:text-[20px] lg:text-[24px] text-[#64340F] font-semibold leading-[140%]">
              {listRoom[3].title}
            </p>
            <p className="text-[14px] hidden md:block text-[#63574C] leading-[140%]">
              {listRoom[3].description}
            </p>
            <p className="text-[#FF7205] flex items-center gap-[10px] cursor-pointer font-semibold">
              Xem tất cả <RiExternalLinkFill className="hidden md:block" />
            </p>
          </div>

          <div
            data-aos="zoom-in-up"
            className="w-1/3 h-full rounded-lg px-[20px] py-[30px] flex flex-col gap-[10px] items-end categories-bg-5 bg-cover-center-no-repeat"
          >
            <p className="text-[18px] md:text-[20px] lg:text-[24px] text-[#64340F] font-semibold leading-[140%]">
              {listRoom[4].title}
            </p>
            <p className="text-[14px] hidden md:block text-[#63574C] leading-[140%]">
              {listRoom[4].description}
            </p>
            <p className="text-[#FF7205] flex items-center gap-[10px] cursor-pointer font-semibold">
              Xem tất cả <RiExternalLinkFill className="hidden md:block" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
