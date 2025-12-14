import React, { useEffect, useState, useCallback } from "react";
import { FaStar, FaRegStar, FaRegStarHalfStroke } from "react-icons/fa6";
import { Pagination } from "antd";
import CommentModal from "./CommentModal";
import { getProductReviews, getProductReviewsByRating } from "@/api/review";
import { detailProduct } from "@/utils/contants/product";

const ReviewComponent = ({ product }) => {
  const [isShowAddComment, setIsShowAddComment] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [filterStar, setFilterStar] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 10;

  const fakeProduct = detailProduct;

  // Hàm load review: nếu có rating thì gọi API lọc theo rating
  const loadReviews = useCallback(
    async (rating = "all", page = 1) => {
      try {
        setIsLoading(true);
        let res;

        if (rating === "all") {
          res = await getProductReviews(product.id, page, pageSize);
        } else {
          res = await getProductReviewsByRating(
            product.id,
            rating,
            page,
            pageSize
          );
        }

        setReviews(res.data.items || []);
        setTotalPages(res.data.pageCustom.totalPages || 1);
        setTotalItems(res.data.pageCustom.totalElement || 0);
        setCurrentPage(page);
      } catch (e) {
        console.log("Lỗi:", e);
      } finally {
        setIsLoading(false);
      }
    },
    [product?.id, pageSize]
  );

  useEffect(() => {
    if (product?.id) {
      loadReviews("all", 1);
    }
  }, [product?.id, loadReviews]);

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
              setCurrentPage(1);
              loadReviews(s.key, 1); // Gọi API ngay khi click ⭐, reset về trang 1
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
        {isLoading ? (
          <p className="text-gray-500 italic text-center py-4">Đang tải...</p>
        ) : filteredReviews.length === 0 ? (
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
                  src="https://e7.pngegg.com/pngimages/731/264/png-clipart-computer-icons-user-profile-accounting-rectangle-black-thumbnail.png"
                  alt={review.user.username}
                />
                <div>
                  <p className="font-semibold">{review.user.username}</p>
                  <div>{renderStars(review.rating)}</div>
                </div>
              </div>

              <p className="text-gray-700 break-words pl-[5px]">
                {review.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="w-full flex flex-col items-center gap-2 py-4">
          <Pagination
            current={currentPage}
            total={totalItems}
            pageSize={pageSize}
            onChange={(page) => loadReviews(filterStar, page)}
            disabled={isLoading}
            showSizeChanger={false}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} của ${total} đánh giá`
            }
          />
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

export default ReviewComponent;
