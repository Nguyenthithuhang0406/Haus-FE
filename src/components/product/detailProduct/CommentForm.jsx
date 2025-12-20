import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { FaStar } from "react-icons/fa6";
import { addProductReview } from "@/api/review";
const CommentForm = ({ setIsShowAddComment, product, onSuccess }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleAddComment = async () => {
    if (rating === 0) {
      alert("Vui lòng chọn số sao đánh giá!");
      return;
    }
    if (comment.trim() === "") {
      alert("Vui lòng nhập nội dung đánh giá!");
      return;
    }
    try {
      await addProductReview(product.id, {
        rating: rating,
        content: comment,
      });

      setIsShowAddComment(false);
      // Gọi callback để reload reviews sau khi add comment thành công
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      } else if (
        error.response &&
        error.response.status === 409 &&
        error.response.data?.message ===
          "exception.review.not.review.before.buy"
      ) {
        alert("Bạn chưa mua hàng này nên không thể đánh giá !");
      } else {
        alert("Lỗi khi gửi đánh giá!");
      }
      console.error("Lỗi thêm đánh giá:", error);
    }
  };

  return (
    <div
      data-aos="fade-down"
      className="w-[500px] md:w-[700px] pb-[50px] h-auto z-20 bg-white rounded-lg shadow-lg"
    >
      {/* Header */}
      <div className="w-full h-[70px] flex items-center justify-between px-4">
        <div></div>
        <p className="text-[20px] font-bold">Đánh giá sản phẩm</p>
        <IoMdClose
          className="w-[20px] h-[20px] cursor-pointer"
          onClick={() => setIsShowAddComment(false)}
        />
      </div>
      <p className="font-semibold text-center mx-[20px] break-words">
        {product.name}
      </p>

      {/* Nội dung */}
      <div className="w-full mt-[20px] flex flex-col items-center gap-4 px-[20px]">
        <img
          src="https://img.freepik.com/premium-vector/account-icon-user-icon-vector-graphics_292645-552.jpg"
          alt="account"
          className="w-[100px] h-[100px] rounded-full"
        />

        {/* Rating sao */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className={`w-6 h-6 cursor-pointer transition-colors ${
                (hoverRating || rating) >= star
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Nhập đánh giá */}
        <div className="w-full flex gap-[10px] items-center">
          <textarea
            placeholder="Nhập nội dung đánh giá"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            className="w-full h-[150px] p-[10px] border border-gray-200 rounded-[5px] shadow-lg outline-none focus:outline-blue-200 focus:ring-1"
          />
        </div>

        <p className="w-full flex justify-end text-[#a0a0a0]">
          {comment.length}/500
        </p>

        <div>
          <button
            className="bg-[#80BB35] py-[7px] px-[14px] text-white rounded-md border-[1px] border-[#80BB35] hover:text-[#80BB35] hover:bg-transparent"
            onClick={handleAddComment}
          >
            Gửi đánh giá
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentForm;
