import { policy } from "@/utils/contants/product";
import React, { useState } from "react";
import ReviewComponent from "./ReviewComponent";

const InformationComponent = ({ product }) => {
  const [activeTab, setActiveTab] = useState("info");

  const poly = policy;

  return (
    <div
      data-aos="fade-up"
      className="w-full flex flex-col gap-[30px] pb-[30px]"
    >
      {/* Tabs */}
      <div className="w-full flex items-center justify-center gap-[30px]">
        {[
          { key: "info", label: "Thông tin sản phẩm" },
          { key: "policy", label: "Chính sách đổi trả" },
          { key: "review", label: "Đánh giá sản phẩm" },
        ].map((tab) => (
          <p
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`text-[18px] md:text-[24px] py-[4px] font-semibold cursor-pointer border-b-[2px]
              ${
                activeTab === tab.key
                  ? "text-[#ad7555] border-[#ad7555]"
                  : "text-[#a0a0a0] border-transparent"
              }
              hover:text-[#ad7555] hover:border-[#ad7555]`}
          >
            {tab.label}
          </p>
        ))}
      </div>

      {/* Thông tin sản phẩm */}
      {activeTab === "info" && (
        <div
          data-aos="fade-up"
          className="prose max-w-none leading-[150%]"
          dangerouslySetInnerHTML={{ __html: product?.detailDescription }}
        />
      )}

      {/* Chính sách */}
      {activeTab === "policy" && (
        <div
          data-aos="fade-up"
          className="prose max-w-none leading-[150%]"
          dangerouslySetInnerHTML={{ __html: poly.detail }}
        />
      )}

      {/* Review */}
      {activeTab === "review" && <ReviewComponent product={product} />}
    </div>
  );
};

export default InformationComponent;
