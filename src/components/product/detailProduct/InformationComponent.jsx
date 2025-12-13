import { detailProduct, policy } from "@/utils/contants/product";
import React, { useEffect, useState } from "react";
import { FaStar, FaRegStar, FaRegStarHalfStroke } from "react-icons/fa6";
import CommentModal from "./CommentModal";
import { getProductReviews, getProductReviewsByRating } from "@/api/review";

const InformationComponent = ({ product }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [isShowAddComment, setIsShowAddComment] = useState(false);

  const poly = policy;
  const fakeProduct = detailProduct;

  const [reviews, setReviews] = useState([]);
  const [filterStar, setFilterStar] = useState("all");

  useEffect(() => {
    if (product?.id) {
      loadReviews("all");
    }
  }, [product?.id]);

  // Hàm load review: nếu có rating thì gọi API lọc theo rating
  const loadReviews = async (rating = "all") => {
    try {
      let res;

      if (rating === "all") {
        res = await getProductReviews(product.id, 1, 10);
      } else {
        res = await getProductReviewsByRating(product.id, rating, 1, 10);
      }

      setReviews(res.data.items || []);
    } catch (e) {
      console.log("Lỗi:", e);
    }
  };

  // Reviews backend trả sẵn theo filter → không lọc lại
  const filteredReviews = reviews;

  const renderStars = (rating) => (
    <span className="flex items-center gap-1 text-[#ffbe00]">
      {Array.from({ length: Math.floor(rating) }, (_, i) => (
        <FaStar key={i} />
      ))}
      {rating % 1 !== 0 && <FaRegStarHalfStroke />}
      {Array.from({ length: 5 - Math.ceil(rating) }, (_, i) => (
        <FaRegStar key={i} />
      ))}
    </span>
  );

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
      {activeTab === "review" && (
        <div data-aos="fade-up" className="flex flex-col gap-[20px]">
          {/* Khung tổng quan rating */}
          <div className="w-full p-[20px] bg-[rgba(128,187,53,0.1)] border border-[#e4e4e4] rounded-lg shadow-sm">
            <div className="flex flex-col items-center gap-[15px]">
              <p className="text-[40px] text-[#80BB35] font-bold">
                {product.rating}
              </p>

              <div>{renderStars(product.rating)}</div>

              <p className="text-[14px] text-gray-600">
                ({fakeProduct.comments.length} đánh giá)
              </p>

              <button
                className="bg-[#80BB35] text-white px-[17px] py-[8px] border border-[#80BB35] rounded-md hover:bg-transparent hover:text-[#80BB35] transition"
                onClick={() => setIsShowAddComment(true)}
              >
                Gửi đánh giá của bạn
              </button>
            </div>
          </div>

          {/* Bộ lọc số sao */}
          <div className="flex gap-2 flex-wrap items-center">
            {[
              { key: "all", label: "Tất cả" },
              { key: 5, label: "5 sao" },
              { key: 4, label: "4 sao" },
              { key: 3, label: "3 sao" },
              { key: 2, label: "2 sao" },
              { key: 1, label: "1 sao" },
            ].map((s) => (
              <button
                key={s.key}
                onClick={() => {
                  setFilterStar(s.key);
                  loadReviews(s.key); // Gọi API ngay khi click ⭐
                }}
                className={`px-4 py-2 rounded-md border text-sm ${
                  filterStar === s.key
                    ? "bg-[#80BB35] text-white border-[#80BB35]"
                    : "bg-white border-gray-300 text-gray-700"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Danh sách review */}
          <div className="w-full flex flex-col gap-[20px]">
            {filteredReviews.length === 0 ? (
              <p className="text-gray-500 italic">Chưa có đánh giá nào.</p>
            ) : (
              filteredReviews.map((review, index) => (
                <div
                  key={index}
                  className="w-full bg-white p-[15px] border border-[#e5e5e5] rounded-lg shadow-sm flex flex-col gap-[10px]"
                >
                  <div className="flex items-center gap-[10px]">
                    <img
                      className="w-[45px] h-[45px] rounded-full object-cover"
                      src={review.avatar}
                      alt={review.name}
                    />
                    <div>
                      <p className="font-semibold">{review.name}</p>
                      <div>{renderStars(review.rating)}</div>
                    </div>
                  </div>

                  <p className="text-gray-700 break-words pl-[5px]">
                    {review.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal đánh giá */}
      {isShowAddComment && (
        <CommentModal
          isOpen={isShowAddComment}
          onClose={() => setIsShowAddComment(false)}
          product={product}
        />
      )}
    </div>
  );
};

export default InformationComponent;
