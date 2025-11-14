import React from "react";
import { Modal, Timeline, Tag, Divider } from "antd";
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  CloseCircleOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  CreditCardOutlined,
  ShoppingOutlined,
  CarOutlined,
  FileTextOutlined
} from "@ant-design/icons";

const OrderDetailModal = ({ visible, order, onClose }) => {
  if (!order) return null;

  // Lấy màu status thanh toán
  const getPaymentStatusColor = (status) => {
    const colors = {
      "Đã thanh toán": "success",
      "Chưa thanh toán": "warning",
      "Thanh toán khi nhận hàng": "processing"
    };
    return colors[status] || "default";
  };

  // Lấy icon cho timeline
  const getTimelineIcon = (status) => {
    if (status.includes("Giao thành công") || status.includes("Đã giao")) {
      return <CheckCircleOutlined className="text-green-500" />;
    }
    if (status.includes("Bị hoàn") || status.includes("Đã hủy")) {
      return <CloseCircleOutlined className="text-red-500" />;
    }
    return <ClockCircleOutlined className="text-blue-500" />;
  };

  const getOrderTimeline = () => {
    const timeline = [];
    
    if (order.history && order.history.length > 0) {
      return order.history;
    }

    const baseTimeline = [
      { 
        status: "Đơn hàng đã đặt", 
        time: order.createdAt || "2024-01-15 10:30",
        description: "Đơn hàng của bạn đã được tiếp nhận"
      }
    ];

    if (order.status !== "Đang chờ") {
      baseTimeline.push({
        status: "Đang xử lý",
        time: "2024-01-15 11:00",
        description: "Shop đang xử lý đơn hàng"
      });
    }

    if (order.status === "Đang giao" || order.status === "Đã giao") {
      baseTimeline.push({
        status: "Đang đóng gói",
        time: "2024-01-15 14:00",
        description: "Đơn hàng đang được đóng gói"
      });
      baseTimeline.push({
        status: "Đang vận chuyển",
        time: "2024-01-16 08:00",
        description: "Đơn hàng đang trên đường giao đến bạn"
      });
    }

    if (order.status === "Đã giao") {
      baseTimeline.push({
        status: "Giao thành công",
        time: "2024-01-17 15:30",
        description: "Đơn hàng đã được giao thành công"
      });
    }

    if (order.status === "Bị hoàn") {
      baseTimeline.push({
        status: "Bị hoàn",
        time: order.canceledAt || "2024-01-16 10:00",
        description: order.cancelReason || "Đơn hàng đã bị hủy"
      });
    }

    return baseTimeline;
  };

  const timeline = getOrderTimeline();

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <FileTextOutlined className="text-xl" />
          <span className="text-lg font-semibold">Chi tiết đơn hàng #{order.id}</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      className="order-detail-modal"
    >
      <div className="space-y-6 mt-4 max-h-[70vh] overflow-y-auto pr-2">
        {/* Thông tin cơ bản */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-sm text-gray-600">Mã đơn hàng</p>
              <p className="font-semibold">#{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Trạng thái đơn hàng</p>
              <Tag color={
                order.status === "Đã giao" ? "success" :
                order.status === "Đang giao" ? "processing" :
                order.status === "Đang chờ" ? "warning" : "error"
              }>
                {order.status}
              </Tag>
            </div>
            <div>
              <p className="text-sm text-gray-600">Mã vận đơn</p>
              <p className="font-semibold">{order.trackingCode || "VN1234567890"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Ngày đặt hàng</p>
              <p className="font-semibold">{order.createdAt || "15/01/2024 10:30"}</p>
            </div>
          </div>
        </div>

        {/* Lý do hủy nếu đơn bị hủy */}
        {order.status === "Bị hoàn" && order.cancelReason && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <p className="font-semibold text-red-800 mb-1">Lý do hủy đơn:</p>
            <p className="text-red-700 text-sm">{order.cancelReason}</p>
          </div>
        )}

        {/* Danh sách sản phẩm */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ShoppingOutlined className="text-lg" />
            <h3 className="font-semibold text-base">Danh sách sản phẩm</h3>
          </div>
          <div className="border rounded-lg overflow-hidden">
            {order.products ? (
              order.products.map((product, index) => (
                <div key={index} className="flex gap-4 p-4 border-b last:border-b-0 hover:bg-gray-50">
                  <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                        Ảnh
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">{product.name}</h4>
                    <p className="text-xs text-gray-600 mb-1">Loại: {product.type}</p>
                    <p className="text-xs text-gray-600">x{product.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{product.price.toLocaleString()}đ</p>
                    <p className="text-xs text-gray-600">Tổng: {(product.price * product.quantity).toLocaleString()}đ</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex gap-4 p-4">
                <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                  {order.image ? (
                    <img src={order.image} alt={order.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                      Ảnh
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">{order.name}</h4>
                  <p className="text-xs text-gray-600 mb-1">Loại: {order.type}</p>
                  <p className="text-xs text-gray-600">x{order.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{order.price.toLocaleString()}đ</p>
                  <p className="text-xs text-gray-600">Tổng: {order.total.toLocaleString()}đ</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Thông tin giao hàng */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <EnvironmentOutlined className="text-lg" />
            <h3 className="font-semibold text-base">Thông tin giao hàng</h3>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg space-y-2">
            <div className="flex items-start gap-2">
              <EnvironmentOutlined className="text-blue-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Địa chỉ giao hàng</p>
                <p className="font-medium">{order.shippingAddress || "123 Nguyễn Huệ, Quận 1, TP.HCM"}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <PhoneOutlined className="text-blue-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Số điện thoại</p>
                <p className="font-medium">{order.phone || "0123 456 789"}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CarOutlined className="text-blue-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Phí vận chuyển</p>
                <p className="font-medium text-orange-600">{order.shippingFee?.toLocaleString() || "30.000"}đ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Phương thức thanh toán */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CreditCardOutlined className="text-lg" />
            <h3 className="font-semibold text-base">Thông tin thanh toán</h3>
          </div>
          <div className="bg-green-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Phương thức thanh toán</span>
              <span className="font-medium">{order.paymentMethod || "Thanh toán khi nhận hàng"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Trạng thái thanh toán</span>
              <Tag color={getPaymentStatusColor(order.paymentStatus || "Thanh toán khi nhận hàng")}>
                {order.paymentStatus || "Thanh toán khi nhận hàng"}
              </Tag>
            </div>
          </div>
        </div>

        {/* Tổng thanh toán */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Tạm tính</span>
            <span className="font-medium">{order.total.toLocaleString()}đ</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Phí vận chuyển</span>
            <span className="font-medium text-orange-600">{order.shippingFee?.toLocaleString() || "30.000"}đ</span>
          </div>
          {order.discount && (
            <div className="flex justify-between text-green-600">
              <span>Giảm giá</span>
              <span className="font-medium">-{order.discount.toLocaleString()}đ</span>
            </div>
          )}
          <Divider className="my-2" />
          <div className="flex justify-between text-lg">
            <span className="font-semibold">Tổng cộng</span>
            <span className="font-bold text-red-600">
              {((order.total + (order.shippingFee || 30000)) - (order.discount || 0)).toLocaleString()}đ
            </span>
          </div>
        </div>

        {/* Lịch sử trạng thái */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ClockCircleOutlined className="text-lg" />
            <h3 className="font-semibold text-base">Lịch sử trạng thái đơn hàng</h3>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <Timeline
              items={timeline.map((item) => ({
                dot: getTimelineIcon(item.status),
                children: (
                  <div>
                    <p className="font-semibold text-sm">{item.status}</p>
                    <p className="text-xs text-gray-500">{item.time}</p>
                    {item.description && (
                      <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                    )}
                  </div>
                )
              }))}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailModal;