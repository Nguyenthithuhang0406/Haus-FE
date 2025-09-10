/* eslint-disable*/
import React, { useState } from "react";
import { FaStar, FaRegStar, FaRegStarHalfStroke } from "react-icons/fa6";
import { CiHeart } from "react-icons/ci";
import { IoIosFlash } from "react-icons/io";
import { formatNumber } from "@/utils/function";
import { ImHeadphones } from "react-icons/im";
import { FiPackage } from "react-icons/fi";
import { FaTruck } from "react-icons/fa";

const RightComponent = ({ product }) => {
  const [typeIndex, setTypeIndex] = useState(0);
  const [count, setCount] = useState(1);
  const [countInCart, setCountInCart] = useState(0);

  const benefits = [
    {
      icon: <ImHeadphones />,
      title: "Giao hàng toàn quốc",
      desc: "Thanh toán (COD) khi nhận hàng",
    },
    {
      icon: <FiPackage />,
      title: "Miễn phí giao hàng",
      desc: "Theo chính sách",
    },
    {
      icon: <FaTruck />,
      title: "Đổi trả trong 7 ngày",
      desc: "Kể từ ngày giao hàng",
    },
  ];
  return (
    <div data-aos="fade-left" className="w-full flex flex-col gap-[20px]">
      <p className="text-[32px] font-semibold leading-[140%]">{product.name}</p>
      <p className="flex items-center gap-1">
        <span className="flex items-center gap-1 text-[#ffbe00]">
          {Array.from({ length: Math.floor(product.rating) }, (_, i) => (
            <FaStar key={i} />
          ))}
          {product.rating % 1 !== 0 && <FaRegStarHalfStroke />}
          {Array.from({ length: 5 - Math.ceil(product.rating) }, (_, i) => (
            <FaRegStar key={i} />
          ))}
        </span>
      </p>
      <p>
        <span className="font-semibold">Tình trạng: </span>
        <span
          className={`${
            product?.sell !== product?.total ? "text-[#28a745]" : "text-red-500"
          }`}
        >
          {product?.sell !== product?.total ? "Còn hàng" : "Hết hàng"}
        </span>
      </p>

      <div className="flex gap-2">
        <p className="text-[24px] font-semibold text-[#ff0000]">
          {formatNumber(product?.price * (1 - product?.discount / 100))}đ
        </p>
        {product?.discount > 0 && (
          <p className="text-[18px] text-[#929292] font-medium line-through">
            {formatNumber(product?.price)} đ
          </p>
        )}
      </div>

      <div className="border-t-[1px] border-[#e4e4e4] py-[20px] flex flex-col gap-[20px] lg:flex-row lg:justify-between lg:items-start">
        <div className="w-full lg:w-2/3 flex flex-col gap-[20px]">
          <p className="word-break w-full leading-[140%]">
            {product.sortDescription}
          </p>
          <p className="font-semibold">
            Màu sắc: {product.types[typeIndex].color}
          </p>

          <div className="w-full flex items-center gap-[10px]">
            {product.types.map((type, index) => (
              <div
                key={type.id}
                aria-label={type.color}
                className={`w-[40px] h-[40px] rounded-lg border-[1px] p-[2px] cursor-pointer flex items-center justify-center ${
                  index === typeIndex ? "border-[#9a542c]" : "border-[#e4e4e4]"
                }`}
              >
                <img
                  src={type.image}
                  alt={type.color}
                  className={`w-full h-full object-cover`}
                  onClick={() => setTypeIndex(index)}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-[20px]">
            <p className="font-semibold">Số lượng:</p>
            <div className="w-[105px] flex border-[1px] border-[#e4e4e4] rounded-lg h-[35px]">
              <button
                className="w-[35px] h-[35px] border-none flex items-center justify-center font-medium"
                onClick={() => setCount((prev) => Math.max(prev - 1, 1))}
              >
                -
              </button>
              <button className="font-medium w-[35px] h-[35px] flex items-center justify-center">
                {count}
              </button>
              <button
                className="w-[35px] h-[35px] border-none flex items-center justify-center font-medium"
                onClick={() => setCount((prev) => prev + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="w-full flex items-center justify-between gap-[10px]">
            <button className="w-full px-[8px] py-[14px] font-medium text-[#ad7555] border-[1px] border-[#ad7555] rounded-lg bg-transparent hover:text-white hover:bg-[#ad7555]">
              THÊM VÀO GIỎ
            </button>
            <button className="w-[53px] h-[53px] border-[1px] border-[#ad7555] rounded-lg text-[#ad7555] bg-transparent text-[24px] flex items-center justify-center hover:text-white hover:bg-[#ad7555]">
              <CiHeart className="text-[30px]" />
            </button>
          </div>

          <button className="w-full px-[8px] py-[14px] bg-[#ad7555] text-white font-medium border-[1px] border-[#ad7555] hover:text-[#ad7555] hover:bg-transparent rounded-lg">
            MUA NGAY
          </button>

          <div className="w-full flex items-center break-words">
            <IoIosFlash className="text-[24px] text-[#ad7555] mr-[10px]" />
            <p className="font-medium">
              Sản phẩm hiện có{" "}
              <span className="text-[#ad7555]">{countInCart}</span> người thêm
              vào giỏ hàng.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/3 border-[1px] border-[#e4e4e4] rounded-lg flex flex-col md:flex-row justify-between lg:flex-col px-[20px]">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`py-[20px] flex flex-col gap-[10px] items-center justify-center ${
                index === 1 ? "lg:border-y lg:border-[#e4e4e4]" : ""
              }`}
            >
              <div className="w-[50px] h-[50px] bg-[#ad7555] rounded-xl text-[24px] text-[#e4e4e4] flex items-center justify-center">
                {benefit.icon}
              </div>
              <div className="font-semibold text-center">{benefit.title}</div>
              <div className="text-[12px] text-[#76809B] text-center">
                {benefit.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightComponent;
