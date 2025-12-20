import React, { useState } from "react";
import { DownOutlined, UpOutlined, DownloadOutlined } from "@ant-design/icons";
import { message } from "antd";
import CancelOrderModal from "./CancelOrderModal";
import OrderDetailModal from "./OrderDetailModal";
import ProductRow from "./ProductRow";
import { getInvoicePdf } from "@/api/order";

const OrderItem = ({ order, onCancelOrder }) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const products = order.products || [
    {
      id: order.id,
      name: order.name,
      type: order.type,
      quantity: order.quantity,
      price: order.price,
      image: order.image,
    },
  ];
  const hasMultipleProducts = products.length > 1;
  const displayedProducts = expanded ? products : products.slice(0, 1);
  const hiddenCount = products.length - 1;

  // Map status từ tiếng Anh sang tiếng Việt (đồng bộ với admin)
  const mapStatusToVietnamese = (status) => {
    if (!status) return status;
    const statusLower = status.toLowerCase();
    const statusMap = {
      pending: "Đang chờ",
      confirmed: "Đã xác nhận",
      processing: "Đang xử lý",
      delivered: "Đã giao",
      completed: "Hoàn thành",
      returned: "Đã trả hàng",
      cancelled: "Đã hủy",
      canceled: "Đã hủy",
      refunded: "Đã hoàn tiền",
    };
    return statusMap[statusLower] || status;
  };

  // Lấy config màu status (đồng bộ với admin)
  const getStatusConfig = (status) => {
    if (!status) {
      return {
        bg: "bg-gray-100",
        text: "text-gray-800",
        border: "border-gray-200",
      };
    }
    const statusLower = status.toLowerCase();
    const statusConfig = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-200",
      },
      confirmed: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        border: "border-blue-200",
      },
      processing: {
        bg: "bg-indigo-100",
        text: "text-indigo-800",
        border: "border-indigo-200",
      },
      delivered: {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-200",
      },
      completed: {
        bg: "bg-emerald-100",
        text: "text-emerald-800",
        border: "border-emerald-200",
      },
      returned: {
        bg: "bg-orange-100",
        text: "text-orange-800",
        border: "border-orange-200",
      },
      cancelled: {
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-200",
      },
      canceled: {
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-200",
      },
      refunded: {
        bg: "bg-purple-100",
        text: "text-purple-800",
        border: "border-purple-200",
      },
    };
    return statusConfig[statusLower] || statusConfig.pending;
  };

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = (orderId, cancelData) => {
    onCancelOrder(orderId, cancelData);
  };

  const handleDownloadInvoice = async () => {
    try {
      setDownloading(true);
      const response = await getInvoicePdf(order.id);

      // Tạo blob từ response
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `invoice_${order.orderNumber || order.id}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      message.success("Tải hóa đơn thành công!");
    } catch (error) {
      console.error("Lỗi tải hóa đơn PDF:", error);
      if (error?.response?.status === 404) {
        message.error("Không tìm thấy hóa đơn!");
      } else {
        message.error("Lỗi khi tải hóa đơn PDF!");
      }
    } finally {
      setDownloading(false);
    }
  };

  const getStatusAction = (status) => {
    if (!status) return null;
    const statusLower = status.toLowerCase();
    const canCancel = [
      "pending",
      "confirmed",
      "processing",
      "delivered",
    ].includes(statusLower);

    return (
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => setShowDetailModal(true)}
          className="text-blue-500 hover:text-blue-700 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap"
        >
          Xem chi tiết
        </button>
        {canCancel && (
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
            Mã đơn: <span className="font-semibold">{order.orderNumber}</span>
          </span>
          <div className="flex items-center gap-2">
            {(() => {
              const statusConfig = getStatusConfig(order.status);
              return (
                <span
                  className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}
                >
                  {mapStatusToVietnamese(order.status)}
                </span>
              );
            })()}
            {order.status?.toLowerCase() === "completed" && (
              <button
                onClick={handleDownloadInvoice}
                disabled={downloading}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Tải hóa đơn"
              >
                {downloading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span className="hidden sm:inline">Đang tải...</span>
                  </>
                ) : (
                  <>
                    <DownloadOutlined className="text-xs" />
                    <span className="hidden sm:inline">Hóa đơn</span>
                  </>
                )}
              </button>
            )}
          </div>
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
              {typeof order.total === "number"
                ? order.total.toLocaleString()
                : 0}
              đ
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
