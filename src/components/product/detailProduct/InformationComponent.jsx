import { detailProduct, policy } from "@/utils/contants/product";
import React, { useState } from "react";
import { FaStar, FaRegStar, FaRegStarHalfStroke } from "react-icons/fa6";
import CommentModal from "./CommentModal";

const InformationComponent = ({ product }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [isShowAddComment, setIsShowAddComment] = useState(false);
  const poly = policy;
  const fakeProduct = detailProduct;
  return (
    <div
      data-aos="fade-up"
      className="w-full flex flex-col gap-[30px] pb-[30px]"
    >
      <div className="w-full flex items-center justify-center gap-[30px]">
        <p
          onClick={() => setActiveTab("info")}
          className={`text-[18px] py-[4px] md:text-[24px] ${
            activeTab === "info"
              ? "text-[#ad7555] border-[#ad7555]"
              : "text-[#a0a0a0] border-transparent"
          } font-semibold border-b-[2px] hover:text-[#ad7555] hover:border-[#ad7555] cursor-pointer`}
        >
          Thông tin sản phẩm
        </p>
        <p
          onClick={() => setActiveTab("policy")}
          className={`text-[18px] py-[4px] md:text-[24px] ${
            activeTab === "policy"
              ? "text-[#ad7555] border-[#ad7555]"
              : "text-[#a0a0a0] border-transparent"
          } font-semibold border-b-[2px] hover:text-[#ad7555] hover:border-[#ad7555] cursor-pointer`}
        >
          Chính sách đổi trả
        </p>
        <p
          onClick={() => setActiveTab("review")}
          className={`text-[18px] py-[4px] md:text-[24px] ${
            activeTab === "review"
              ? "text-[#ad7555] border-[#ad7555]"
              : "text-[#a0a0a0] border-transparent"
          } font-semibold border-b-[2px] hover:text-[#ad7555] hover:border-[#ad7555] cursor-pointer`}
        >
          Đánh giá sản phẩm
        </p>
      </div>

      {activeTab === "info" && (
        <div
          data-aos="fade-up"
          className="prose max-w-none leading-[150%]"
          dangerouslySetInnerHTML={{ __html: product?.detailDescription }}
        />
      )}

      {activeTab === "policy" && (
        <div
          data-aos="fade-up"
          className="prose max-w-none leading-[150%]"
          dangerouslySetInnerHTML={{ __html: poly.detail }}
        />
      )}

      {activeTab === "review" && (
        <div data-aos="fade-up" className="flex flex-col gap-[20px]">
          <div className="w-full p-[20px] bg-[rgba(128,187,53,0.1)] border-[1px] border-[#e4e4e4]">
            <div className="w-1/3 lg:w-1/4 xl:w-1/5 flex flex-col gap-[20px] items-center justify-center">
              <p className="text-[30px] text-[#80BB35] font-semibold">
                {product.rating}
              </p>

              <p className="flex items-center gap-1">
                <span className="flex items-center gap-1 text-[#ffbe00]">
                  {Array.from(
                    { length: Math.floor(product.rating) },
                    (_, i) => (
                      <FaStar key={i} />
                    )
                  )}
                  {product.rating % 1 !== 0 && <FaRegStarHalfStroke />}
                  {Array.from(
                    { length: 5 - Math.ceil(product.rating) },
                    (_, i) => (
                      <FaRegStar key={i} />
                    )
                  )}
                </span>
              </p>

              <p>({fakeProduct.comments.length} đánh giá)</p>

              <button
                className="bg-[#80BB35] text-white px-[17px] py-[7px] flex items-center justify-center border-[1px] border-[#80BB35] hover:text-[#80BB35] hover:bg-transparent rounded-md"
                onClick={() => setIsShowAddComment(true)}
              >
                Gửi đánh giá của bạn
              </button>
            </div>
          </div>

          <div className="w-full flex flex-col gap-[20px]">
            {fakeProduct.comments.map((review, index) => (
              <div
                key={index}
                className="w-full flex flex-col items-start gap-[10px]"
              >
                <div className="flex items-center gap-[5px]">
                  <img
                    className="w-[40px] h-[40px] rounded-full object-cover"
                    src={review.avatar}
                    alt={review.name}
                  />
                  <p className="font-semibold">{review.name}</p>
                </div>

                <div className="w-full pl-[40px] flex flex-col gap-[10px]">
                  <p className="flex items-center gap-1">
                    <span className="flex items-center gap-1 text-[#ffbe00]">
                      {Array.from(
                        { length: Math.floor(review.rating) },
                        (_, i) => (
                          <FaStar key={i} />
                        )
                      )}
                      {review.rating % 1 !== 0 && <FaRegStarHalfStroke />}
                      {Array.from(
                        { length: 5 - Math.ceil(review.rating) },
                        (_, i) => (
                          <FaRegStar key={i} />
                        )
                      )}
                    </span>
                  </p>

                  <p className="w-full break-words">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isShowAddComment && (
        <CommentModal
          isOpen={isShowAddComment}
          onClose={() => setIsShowAddComment(false)}
          product={fakeProduct}
        />
      )}
    </div>
  );
};

export default InformationComponent;
