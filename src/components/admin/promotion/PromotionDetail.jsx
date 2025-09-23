import React from "react";
import { X } from "lucide-react";

const PromotionDetail = ({ currentPromotion, setShowDetailModal }) => {
  // console.log("current:", currentPromotion);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-none  p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Chi tiết khuyến mãi "{currentPromotion.type === "order" ? "Theo đơn hàng" : "Theo danh mục"}"
          </h2>
          <button
            onClick={() => setShowDetailModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Kiểu khuyến mãi:</span>
              <p className="text-gray-600">{currentPromotion.type === "order" ? "Theo đơn hàng" : "Theo danh mục"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Ngày bắt đầu:</span>
              <p className="text-gray-600">{currentPromotion.startDate}</p>
            </div>
            <div>
              <span className="font-medium">Ngày kết thúc:</span>
              <p className="text-gray-600">{currentPromotion.endDate}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Giá trị:</span>
              <p className="text-gray-600">{currentPromotion.discountPercent} %</p>
            </div>
            <div>
              <span className="font-medium">Trạng thái:</span>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  currentPromotion.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {currentPromotion.status}
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setShowDetailModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-none  hover:bg-gray-50"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionDetail;
