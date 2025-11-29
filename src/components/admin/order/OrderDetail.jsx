import React, { useState, useEffect } from "react";
import { X, Package, User, MapPin, CreditCard, Tag } from "lucide-react";
import { getOrderById } from "@/api/order";
import { toast } from "react-toastify";

const mapOrderData = (apiOrder) => {
  const recipientInfo = apiOrder.recipientInfo || {};
  const customerName = recipientInfo.recipientName || "";

  // Build full address from recipientInfo
  const addressParts = [
    recipientInfo.detailAddress,
    recipientInfo.commune,
    recipientInfo.district,
    recipientInfo.city,
    recipientInfo.country,
  ].filter(Boolean);
  const fullAddress = addressParts.join(", ") || "";

  // Calculate subtotal and discount
  const totalAmount = apiOrder.totalAmount || 0;
  const shippingFee = apiOrder.shippingFee || 0;
  const discountPercent = apiOrder.promotion?.discountPercent || 0;
  
  // Calculate subtotal: totalAmount already includes discount, so we need to reverse calculate
  // If discountPercent is applied, subtotal = totalAmount / (1 - discountPercent/100) - shippingFee
  // But since totalAmount is final, we calculate discount from products total
  const productsTotal = apiOrder.products?.reduce(
    (sum, product) => sum + (product.total || 0),
    0
  ) || 0;
  const discountAmount =
    discountPercent > 0
      ? Math.round((productsTotal * discountPercent) / 100)
      : 0;
  const subtotal = productsTotal - discountAmount;

  // Map products to items format
  const items = (apiOrder.products || []).map((product) => ({
    productId: product.productId,
    productCode: product.productCode,
    name: product.productName,
    productName: product.productName,
    variationId: product.variationId,
    color: product.color,
    size: product.size,
    quantity: product.quantity,
    price: product.priceAtSale,
    priceAtSale: product.priceAtSale,
    total: product.total,
    image: product.image,
  }));

  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return {
    id: apiOrder.id,
    orderNumber: apiOrder.orderNumber || "",
    orderCode: apiOrder.orderNumber || "",
    customerName: customerName,
    phone: recipientInfo.phoneNumber || "",
    email: "", // Not in new API structure
    orderDate: formatDate(apiOrder.orderDate || apiOrder.createdAt),
    deliveryDate: formatDate(apiOrder.deliveryDate),
    status: apiOrder.status || "pending",
    totalAmount: totalAmount,
    shippingFee: shippingFee,
    subtotal: subtotal,
    discount: discountAmount,
    paymentMethod: apiOrder.payment?.type || "CASH_ON_DELIVERY",
    payment: apiOrder.payment || null,
    promotion: apiOrder.promotion || null,
    shippingAddress: fullAddress,
    items: items,
    recipientInfo: recipientInfo,
  };
};

const OrderDetail = ({ orderId, setShowDetailModal }) => {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!orderId) return;

      try {
        setLoading(true);
        const response = await getOrderById(orderId);
        if (response.status === 200 && response.data) {
          setCurrentOrder(mapOrderData(response.data));
        } else {
          toast.error("Không thể tải thông tin đơn hàng");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast.error("Không thể tải thông tin đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      pending: "Đang chờ",
      confirmed: "Đã xác nhận",
      processing: "Đang xử lý",
      delivered: "Đã giao",
      completed: "Hoàn thành",
      returned: "Đã trả hàng",
      cancelled: "Đã hủy",
      refunded: "Đã hoàn tiền",
    };
    return statusMap[status] || status;
  };

  const getPaymentTypeLabel = (type) => {
    const typeMap = {
      ONLINE_PAYMENT: "Thanh toán online",
      COD: "Thanh toán khi nhận hàng",
      CASH_ON_DELIVERY: "Thanh toán khi nhận hàng",
      BANK_TRANSFER: "Chuyển khoản",
    };
    return typeMap[type] || type;
  };

  const getPaymentStatusLabel = (status) => {
    const statusMap = {
      pending: "Chờ thanh toán",
      completed: "Đã thanh toán",
      failed: "Thanh toán thất bại",
      refunded: "Đã hoàn tiền",
    };
    return statusMap[status] || status;
  };

  if (!currentOrder) {
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
          <div className="text-center py-12">
            {loading ? (
              <div className="text-gray-400">Đang tải dữ liệu...</div>
            ) : (
              <div className="text-gray-400">
                Không tìm thấy thông tin đơn hàng
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

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

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400">Đang tải dữ liệu...</div>
          </div>
        ) : (
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
                  <p className="font-medium">
                    {currentOrder.orderNumber || currentOrder.orderCode}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Ngày đặt:</span>
                  <p className="font-medium">{currentOrder.orderDate}</p>
                </div>
                {currentOrder.deliveryDate && (
                  <div>
                    <span className="text-sm text-gray-600">
                      Ngày giao hàng:
                    </span>
                    <p className="font-medium">{currentOrder.deliveryDate}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm text-gray-600">Trạng thái:</span>
                  <p className="font-medium">
                    {getStatusLabel(currentOrder.status)}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold">Thông tin người nhận</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Tên:</span>
                  <p className="font-medium">
                    {currentOrder.customerName || "Chưa cập nhật"}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Số điện thoại:</span>
                  <p className="font-medium">
                    {currentOrder.phone || "Chưa cập nhật"}
                  </p>
                </div>
                {currentOrder.email && (
                  <div className="md:col-span-2">
                    <span className="text-sm text-gray-600">Email:</span>
                    <p className="font-medium">{currentOrder.email}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            {currentOrder.shippingAddress && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-5 w-5 text-gray-600" />
                  <h3 className="font-semibold">Địa chỉ giao hàng</h3>
                </div>
                <div className="space-y-1">
                  {currentOrder.recipientInfo?.detailAddress && (
                    <p className="text-gray-700 font-medium">
                      {currentOrder.recipientInfo.detailAddress}
                    </p>
                  )}
                  <p className="text-gray-700">
                    {[
                      currentOrder.recipientInfo?.commune,
                      currentOrder.recipientInfo?.district,
                      currentOrder.recipientInfo?.city,
                      currentOrder.recipientInfo?.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  {!currentOrder.recipientInfo && (
                    <p className="text-gray-700">{currentOrder.shippingAddress}</p>
                  )}
                </div>
              </div>
            )}

            {/* Payment Info */}
            {currentOrder.payment && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="h-5 w-5 text-gray-600" />
                  <h3 className="font-semibold">Thông tin thanh toán</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">
                      Phương thức thanh toán:
                    </span>
                    <p className="font-medium">
                      {getPaymentTypeLabel(currentOrder.payment.type)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">
                      Trạng thái thanh toán:
                    </span>
                    <p className="font-medium">
                      {getPaymentStatusLabel(currentOrder.payment.status)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">
                      Số tiền thanh toán:
                    </span>
                    <p className="font-medium text-[#ad7555]">
                      {formatPrice(currentOrder.payment.amount)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Promotion Info */}
            {currentOrder.promotion && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="h-5 w-5 text-gray-600" />
                  <h3 className="font-semibold">Khuyến mãi</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentOrder.promotion.code && (
                    <div>
                      <span className="text-sm text-gray-600">
                        Mã khuyến mãi:
                      </span>
                      <p className="font-medium">
                        {currentOrder.promotion.code}
                      </p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm text-gray-600">Giảm giá:</span>
                    <p className="font-medium text-green-600">
                      {currentOrder.promotion.discountPercent}%
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Order Items */}
            {currentOrder.items && currentOrder.items.length > 0 ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Sản phẩm đã đặt</h3>
                <div className="space-y-3">
                  {currentOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 bg-white p-3 rounded"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name || item.productName}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">
                          {item.name || item.productName || "Sản phẩm"}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Mã SP: {item.productCode || "N/A"}
                        </p>
                        {(item.color || item.size) && (
                          <p className="text-xs text-gray-500">
                            {[item.color, item.size].filter(Boolean).join(" - ")}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          SL: {item.quantity} x {formatPrice(item.price || item.priceAtSale || 0)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-[#ad7555]">
                          {formatPrice(item.total || (item.price || item.priceAtSale || 0) * (item.quantity || 1))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Sản phẩm đã đặt</h3>
                <p className="text-gray-500 text-sm">
                  Chưa có thông tin sản phẩm
                </p>
              </div>
            )}

            {/* Total */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold">Tổng thanh toán</h3>
              </div>
              <div className="space-y-2">
                {currentOrder.subtotal !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span>{formatPrice(currentOrder.subtotal)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span>{formatPrice(currentOrder.shippingFee || 0)}</span>
                </div>
                {currentOrder.promotion?.discountPercent &&
                  currentOrder.promotion.discountPercent > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>
                        Giảm giá ({currentOrder.promotion.discountPercent}%):
                      </span>
                      <span>
                        -
                        {formatPrice(
                          Math.round(
                            ((currentOrder.totalAmount || 0) *
                              currentOrder.promotion.discountPercent) /
                              100
                          )
                        )}
                      </span>
                    </div>
                  )}
                {currentOrder.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Giảm giá:</span>
                    <span>-{formatPrice(currentOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Tổng cộng:</span>
                  <span className="text-[#ad7555]">
                    {formatPrice(currentOrder.totalAmount || 0)}
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
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
