import React, { useState } from "react";
import pc0 from "./img/image.png";
import pc1 from "./img/image2.png";
import pc2 from "./img/image3.png";

const PaymentMethod = ({ selectedAddress }) => {
  const [selected, setSelected] = useState("cod");

  return (
    <div className="w-full max-w-[600px] mt-5">
      <h2 className="mb-4 text-[#ad7555] text-[22px] font-semibold">
        Phương thức thanh toán
      </h2>

      <div className="p-6 rounded-lg border border-gray-200 shadow-lg">
        {/* COD */}
        <label className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 cursor-pointer mb-4 w-full">
          <input
            type="radio"
            name="payment"
            className="mt-1 accent-[#ad7555]"
            checked={selected === "cod"}
            onChange={() => setSelected("cod")}
          />
          <div className="flex flex-1 gap-3 sm:gap-4 items-start sm:items-center w-full">
            <img
              src={pc0}
              alt="thanh-toan"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-gray-200 object-cover flex-shrink-0"
            />
            <div className="flex flex-col flex-1 w-full">
              <h3 className="font-bold text-gray-800 mb-1 text-lg sm:text-[17px]">
                Thanh toán khi nhận hàng
              </h3>
              <span
                className={`flex flex-1 rounded-lg py-3 px-3 sm:py-4 sm:px-4 text-[14px] shadow-lg transition w-full ${
                  selected === "cod"
                    ? "border border-[#ad7555] bg-[#f9f5f3] text-gray-800"
                    : "border border-gray-200 text-gray-700"
                }`}
              >
                {selectedAddress?.detailAddress}, {selectedAddress?.commune},{" "}
                {selectedAddress?.district}, {selectedAddress?.city},{" "}
                {selectedAddress?.country}
              </span>
            </div>
          </div>
        </label>

        {/* VNPay */}
        <label className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 cursor-pointer mb-4 w-full">
          <input
            type="radio"
            name="payment"
            className="mt-1 accent-[#ad7555]"
            checked={selected === "vnpay"}
            onChange={() => setSelected("vnpay")}
          />
          <div className="flex flex-1 gap-3 sm:gap-4 items-start sm:items-center w-full">
            <img
              src={pc1}
              alt="thanh-toan"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-gray-200 object-cover flex-shrink-0"
            />
            <div className="flex flex-col flex-1 w-full">
              <h3 className="font-bold text-gray-800 mb-1 text-lg sm:text-[17px]">
                Ví điện tử
              </h3>
              <span
                className={`flex justify-between items-center rounded-lg py-2 px-3 sm:py-3 sm:px-4 text-[14px] shadow-lg transition w-full ${
                  selected === "vnpay"
                    ? "border border-[#ad7555] bg-[#f9f5f3] text-gray-800"
                    : "border border-gray-200 text-gray-700"
                }`}
              >
                <p>VN Pay</p>
                <img
                  src={pc1}
                  alt="anhminhhoa"
                  className="w-6 h-6 sm:w-8 sm:h-8"
                />
              </span>
            </div>
          </div>
        </label>

        {/* Momo */}
        <label className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 cursor-pointer w-full">
          <input
            type="radio"
            name="payment"
            className="mt-1 accent-[#ad7555]"
            checked={selected === "momo"}
            onChange={() => setSelected("momo")}
          />
          <div className="flex flex-1 gap-3 sm:gap-4 items-start sm:items-center w-full">
            <img
              src={pc2}
              alt="thanh-toan"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-gray-200 object-cover flex-shrink-0"
            />
            <div className="flex flex-col flex-1 w-full">
              <h3 className="font-bold text-gray-800 mb-1 text-lg sm:text-[17px]">
                Ví điện tử
              </h3>
              <span
                className={`flex justify-between items-center rounded-lg py-2 px-3 sm:py-3 sm:px-4 text-[14px] shadow-lg transition w-full ${
                  selected === "momo"
                    ? "border border-[#ad7555] bg-[#f9f5f3] text-gray-800"
                    : "border border-gray-200 text-gray-700"
                }`}
              >
                <p>Momo</p>
                <img
                  src={pc2}
                  alt="anhminhhoa"
                  className="w-6 h-6 sm:w-8 sm:h-8"
                />
              </span>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default PaymentMethod;
