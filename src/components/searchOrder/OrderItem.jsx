import React, { useState } from "react";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import CancelOrderModal from "./CancelOrderModal";
import OrderDetailModal from "./OrderDetailModal";
import ProductRow from "./ProductRow";

const OrderItem = ({ order, onCancelOrder }) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const products = order.products || [{
    id: order.id,
    name: order.name,
    type: order.type,
    quantity: order.quantity,
    price: order.price,
    image: order.image
  }];
  const hasMultipleProducts = products.length > 1;
  const displayedProducts = expanded ? products : products.slice(0, 1);
  const hiddenCount = products.length - 1;

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
        <div className="flex justify-between items-center mb-3 pb-2 border-b border-pink-200">
          <span className="text-xs sm:text-sm text-gray-600">
            Mã đơn: <span className="font-semibold">#{order.id}</span>
          </span>
          <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>
        <div className="space-y-3">
          {displayedProducts.map((product, index) => (
            <ProductRow
              key={product.id || index}
              product={product}
              isFirst={index === 0}
            />
          ))}
        </div>

        {hasMultipleProducts && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full mt-3 pt-2 border-t border-pink-200 flex items-center justify-center gap-1 text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium transition-colors"
          >
            {expanded ? (
              <>
                <UpOutlined className="text-xs" />
                Thu gọn
              </>
            ) : (
              <>
                <DownOutlined className="text-xs" />
                Xem thêm {hiddenCount} sản phẩm khác
              </>
            )}
          </button>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center mt-3 pt-3 border-t border-pink-200 gap-2">
          <div className="text-center sm:text-left">
            <span className="text-xs sm:text-sm text-gray-600">
              {products.length} sản phẩm • Tổng tiền:{" "}
            </span>
            <span className="text-base sm:text-lg font-bold text-red-600">
              {typeof order.total === "number" ? order.total.toLocaleString() : 0}đ
            </span>
          </div>
          <div className="self-center sm:self-auto">
            {getStatusAction(order.status)}
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