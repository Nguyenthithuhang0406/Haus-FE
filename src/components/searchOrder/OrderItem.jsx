import React, { useState } from "react";
import CancelOrderModal from "./CancelOrderModal";
import OrderDetailModal from "./OrderDetailModal";

const OrderItem = ({ order, onCancelOrder }) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const getStatusColor = (status) => {
    const colors = {
      "Đang chờ": "bg-yellow-100 text-yellow-800",
      "Đang giao": "bg-blue-100 text-blue-800",
      "Đã giao": "bg-green-100 text-green-800",
      "Bị hoàn": "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = (orderId, cancelData) => {
    console.log("OrderItem - handleConfirmCancel called", { orderId, cancelData });
    onCancelOrder(orderId, cancelData);
  };

  const getStatusAction = (status) => {
    return (
      <div className="flex flex-col sm:flex-row gap-2">
        <button 
          onClick={() => setShowDetailModal(true)}
          className="text-blue-500 hover:text-blue-700 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap"
        >
          Xem chi tiết
        </button>
        {(status === "Đang chờ" || status === "Đang giao") && (
          <button 
            onClick={handleCancelClick}
            className="text-red-500 hover:text-red-700 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap"
          >
            Huỷ đơn
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="bg-pink-50 rounded-lg p-3 sm:p-4 mb-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Image */}
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
            {order.image ? (
              <img 
                src={order.image} 
                alt={order.name} 
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <span className="text-gray-400 text-xs sm:text-sm">ảnh</span>
            )}
          </div>

          {/* Content - Full width on mobile, flex-1 on desktop */}
          <div className="flex-1 flex flex-col justify-between space-y-2 sm:space-y-0">
            <div>
              <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-center sm:text-left">{order.name}</h3>
              <p className="text-gray-700 text-xs sm:text-sm mb-0.5 sm:mb-1 text-center sm:text-left">
                Loại: {order.type}
              </p>
              <p className="text-gray-700 text-xs sm:text-sm text-center sm:text-left">
                Số lượng: {order.quantity}
              </p>
            </div>
          </div>

          {/* Price and Status - Stack on mobile, column on desktop */}
          <div className="flex flex-col sm:items-end justify-between sm:min-w-[180px] space-y-2 sm:space-y-0">
            <span className={`px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(order.status)} text-center self-center sm:self-auto`}>
              {order.status}
            </span>
            
            <div className="text-center sm:text-right">
              <p className="text-base sm:text-lg font-semibold mb-0.5 sm:mb-1">
                {order.price.toLocaleString()}đ
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                Thành tiền: {order.total.toLocaleString()}đ
              </p>
            </div>
            
            <div className="self-center sm:self-auto">
              {getStatusAction(order.status)}
            </div>
          </div>
        </div>
      </div>

      <CancelOrderModal
        visible={showCancelModal}
        order={order}
        onCancel={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
      />

      <OrderDetailModal
        visible={showDetailModal}
        order={order}
        onClose={() => setShowDetailModal(false)}
      />
    </>
  );
};

export default OrderItem;