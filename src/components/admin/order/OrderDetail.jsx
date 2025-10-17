import React from "react";
import { X, Package, User, MapPin, CreditCard } from "lucide-react";

const OrderDetail = ({ currentOrder, setShowDetailModal }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      pending: "Đang chờ",
      shipping: "Đang giao",
      delivered: "Đã giao",
      returned: "Bị hoàn",
    };
    return statusMap[status] || status;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <h2 className="text-xl font-bold">Chi tiết đơn hàng</h2>
          <button
            onClick={() => setShowDetailModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Order Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Package className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold">Thông tin đơn hàng</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Mã đơn hàng:</span>
                <p className="font-medium">{currentOrder.orderCode}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Ngày đặt:</span>
                <p className="font-medium">{currentOrder.orderDate}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Trạng thái:</span>
                <p className="font-medium">{getStatusLabel(currentOrder.status)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Phương thức thanh toán:</span>
                <p className="font-medium">{currentOrder.paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold">Thông tin khách hàng</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Tên:</span>
                <p className="font-medium">{currentOrder.customerName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Số điện thoại:</span>
                <p className="font-medium">{currentOrder.phone}</p>
              </div>
              <div className="md:col-span-2">
                <span className="text-sm text-gray-600">Email:</span>
                <p className="font-medium">{currentOrder.email}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold">Địa chỉ giao hàng</h3>
            </div>
            <p className="text-gray-700">{currentOrder.shippingAddress}</p>
          </div>

          {/* Order Items */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Sản phẩm đã đặt</h3>
            <div className="space-y-3">
              {currentOrder.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-white p-3 rounded"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-500">
                      SL: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[#ad7555]">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold">Tổng thanh toán</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tạm tính:</span>
                <span>{formatPrice(currentOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <span>{formatPrice(currentOrder.shippingFee)}</span>
              </div>
              {currentOrder.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Giảm giá:</span>
                  <span>-{formatPrice(currentOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Tổng cộng:</span>
                <span className="text-[#ad7555]">
                  {formatPrice(currentOrder.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setShowDetailModal(false)}
              className="px-6 py-2 text-gray-600 border border-gray-300 hover:bg-gray-50"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;