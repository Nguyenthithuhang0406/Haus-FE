import React, { useState, useEffect, useMemo, useRef } from "react";
import { Input, Pagination, Select, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import SidebarProfile from "@/components/auth/SidebarProfile";
import OrderItem from "@/components/searchOrder/OrderItem";
import InvoiceButton from "@/components/payment/bill/InvoiceButton";
import { getAllOrder, searchOrderByNumber } from "@/api/order";

const { Option } = Select;

const OrderInfor = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const searchTimeoutRef = useRef(null);

  const pageSize = 2;

  const mapOrderStatusToUI = (status) => {
    // Xử lý cả uppercase và lowercase
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case "PENDING":
      case "CONFIRMED":
      case "PROCESSING":
        return "Đang chờ";
      case "DELIVERED":
        return "Đang giao";
      case "COMPLETED":
        return "Đã giao";
      case "CANCELLED":
      case "CANCELED":
      case "RETURNED":
      case "REFUNDED":
      case "FAIL":
        return "Bị hoàn";
      default:
        return status;
    }
  };

  const mapPaymentStatusToUI = (status) => {
    if (!status) return "Chưa thanh toán";
    // Xử lý cả uppercase và lowercase
    const statusUpper = status.toUpperCase();
    switch (statusUpper) {
      case "COMPLETED":
        return "Đã thanh toán";
      case "PENDING":
      case "EXPIRED":
      case "CANCELLED":
      case "CANCELED":
      case "REFUNDED":
        return "Chưa thanh toán";
      default:
        return status;
    }
  };

  const formatOrder = (order) => {
    // Xử lý địa chỉ từ recipientInfo (có thể null)
    const recipientInfo = order.recipientInfo || {};
    const addressParts = [
      recipientInfo.detailAddress,
      recipientInfo.commune,
      recipientInfo.district,
      recipientInfo.city,
      recipientInfo.country,
    ].filter(Boolean);
    const shippingAddress = addressParts.join(", ") || "";

    // Kiểm tra status để xác định có bị hoàn không
    const statusUI = mapOrderStatusToUI(order.status);
    const isCancelled = [
      "CANCELLED",
      "CANCELED",
      "RETURNED",
      "REFUNDED",
      "FAIL",
    ].includes(order.status?.toUpperCase());

    return {
      orderNumber: order.orderNumber,
      id: order.id,
      products:
        order.products?.map((p) => ({
          id: p.productId,
          name: p.productName,
          type: `${p.color || ""} ${p.size || ""}`.trim(),
          quantity: p.quantity,
          price: p.priceAtSale || 0,
          image: p.image,
          total: p.total || 0,
        })) || [],
      total: order.totalAmount || 0,
      status: statusUI,
      shippingAddress: shippingAddress,
      phone: recipientInfo.phoneNumber || "",
      shippingFee: order.shippingFee || 0,
      trackingCode: order.orderNumber,
      paymentMethod:
        order.payment?.type === "CASH_ON_DELIVERY"
          ? "Thanh toán khi nhận hàng"
          : order.payment?.type || "",
      paymentStatus: mapPaymentStatusToUI(order.payment?.status),
      createdAt: order.orderDate || order.createdAt,
      cancelReason: isCancelled ? "Đơn hàng đã bị hủy/hoàn" : null,
      canceledAt: isCancelled ? order.updatedAt : null,
    };
  };

  const fetchOrders = async (
    pageNum = 1,
    status = "all",
    customPageSize = null
  ) => {
    try {
      setLoading(true);
      // Map status filter từ UI sang API
      let apiStatus = undefined;
      if (status !== "all") {
        // Map từ UI status sang API status
        const statusMap = {
          "Đang chờ": ["pending", "confirmed", "processing"],
          "Đang giao": "delivered",
          "Đã giao": "completed",
          "Bị hoàn": ["cancelled", "returned", "refunded", "fail"],
        };

        if (statusMap[status]) {
          if (typeof statusMap[status] === "string") {
            apiStatus = statusMap[status];
          }
        }
      }

      const response = await getAllOrder({
        pageNum,
        pageSize: customPageSize || pageSize,
        status: apiStatus,
      });

      const list = response.data?.items || [];
      const formatted = list.map(formatOrder);

      setOrders(formatted);

      if (response.data?.pageCustom) {
        setTotalElements(response.data.pageCustom.totalElement || 0);
      }
    } catch (error) {
      console.log(error);
      message.error("Lấy danh sách đơn hàng thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchOrder = async (orderNumber) => {
    try {
      setLoading(true);
      const response = await searchOrderByNumber(orderNumber);

      // API trả về response.data chứa thông tin đơn hàng
      if (response.data) {
        const formatted = formatOrder(response.data);
        setOrders([formatted]);
        setTotalElements(1);
      } else {
        setOrders([]);
        setTotalElements(0);
        message.info("Không tìm thấy đơn hàng với mã này");
      }
    } catch (error) {
      console.log(error);
      setOrders([]);
      setTotalElements(0);
      // Kiểm tra nếu là lỗi 404 hoặc không tìm thấy
      if (error.response?.status === 404 || error.response?.status === 400) {
        message.warning("Không tìm thấy đơn hàng với mã này");
      } else {
        message.error("Lỗi khi tra cứu đơn hàng!");
      }
    } finally {
      setLoading(false);
    }
  };

  // Xử lý search theo mã đơn hàng với debounce
  useEffect(() => {
    const text = searchText.trim();

    // Clear timeout cũ nếu có
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }

    // Nếu không có search, reset về trang 1 và gọi API ngay lập tức
    if (text === "") {
      setCurrentPage(1);
      fetchOrders(1, statusFilter);
      return;
    }

    // Debounce: chỉ gọi API sau 800ms khi người dùng dừng nhập
    // Tăng thời gian debounce để tránh gọi API quá nhiều
    searchTimeoutRef.current = setTimeout(() => {
      handleSearchOrder(text);
      searchTimeoutRef.current = null;
    }, 800);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  // Xử lý filter status và pagination
  useEffect(() => {
    const text = searchText.trim();

    // Chỉ gọi API khi không có search
    if (text === "") {
      fetchOrders(currentPage, statusFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter]);

  // Load dữ liệu ban đầu
  useEffect(() => {
    fetchOrders(1, "all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancelOrder = (orderId, cancelData) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "Bị hoàn",
              cancelReason: cancelData.reason,
              canceledAt: cancelData.timestamp,
            }
          : o
      )
    );
  };

  // Hiển thị orders (khi search thì đã gọi API và set orders rồi)
  const displayOrders = useMemo(() => {
    return orders;
  }, [orders]);

  // Cập nhật totalElements khi search
  const displayTotal = useMemo(() => {
    const text = searchText.trim();
    if (text !== "") {
      // Khi search, total là số orders từ API
      return totalElements;
    }
    return totalElements;
  }, [totalElements, searchText]);

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-[80px] sm:pt-[100px]">
        <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 py-4 sm:py-8">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
            <SidebarProfile />

            <div className="w-full lg:w-4/5 lg:pt-[2%]">
              <div className="border-2 rounded-lg shadow-md bg-white">
                <div className="bg-[#ad7555] text-white px-4 sm:px-6 py-3 sm:py-4 rounded-t-lg">
                  <h2 className="text-lg sm:text-xl font-semibold">
                    ĐƠN HÀNG CỦA BẠN
                  </h2>
                </div>

                {/* Search */}
                <div className="p-6 border-b">
                  <div className="flex flex-col md:flex-row gap-4">
                    <Input
                      placeholder="Tìm kiếm theo mã đơn hàng"
                      prefix={<SearchOutlined />}
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="flex-1"
                      size="large"
                      onPressEnter={(e) => {
                        const text = e.target.value.trim();
                        // Clear timeout để tránh duplicate calls và gọi API ngay lập tức
                        if (searchTimeoutRef.current) {
                          clearTimeout(searchTimeoutRef.current);
                          searchTimeoutRef.current = null;
                        }
                        if (text !== "") {
                          handleSearchOrder(text);
                        } else {
                          setCurrentPage(1);
                          fetchOrders(1, statusFilter);
                        }
                      }}
                    />

                    <Select
                      value={statusFilter}
                      onChange={setStatusFilter}
                      size="large"
                      className="w-full md:w-48"
                    >
                      <Option value="all">Tất cả trạng thái</Option>
                      <Option value="Đang chờ">Đang chờ</Option>
                      <Option value="Đang giao">Đang giao</Option>
                      <Option value="Đã giao">Đã giao</Option>
                      <Option value="Bị hoàn">Bị hoàn</Option>
                    </Select>
                  </div>
                </div>

                {/* Orders */}
                <div className="p-4 sm:p-6 min-h-[400px] relative">
                  {displayOrders.length > 0 ? (
                    <div
                      className={`transition-opacity duration-300 ${
                        loading
                          ? "opacity-50 pointer-events-none"
                          : "opacity-100"
                      }`}
                    >
                      {displayOrders.map((order) => (
                        <OrderItem
                          key={order.id}
                          order={order}
                          onCancelOrder={handleCancelOrder}
                        />
                      ))}
                    </div>
                  ) : !loading ? (
                    <div className="text-center py-12 text-gray-500">
                      <p className="text-sm sm:text-base">
                        Không tìm thấy đơn hàng nào
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <p className="text-sm sm:text-base">
                        Đang tải dữ liệu...
                      </p>
                    </div>
                  )}
                  {loading && displayOrders.length > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                      <div className="flex flex-col items-center gap-3 bg-white bg-opacity-90 px-4 py-2 rounded-lg">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#ad7555]"></div>
                        <p className="text-xs text-gray-500">Đang tải...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pagination - chỉ hiển thị khi không search */}
                {displayTotal > 0 && searchText.trim() === "" && (
                  <div className="p-4 sm:p-6 border-t flex justify-center">
                    <Pagination
                      current={currentPage}
                      total={displayTotal}
                      pageSize={pageSize}
                      onChange={(page) => setCurrentPage(page)}
                      showSizeChanger={false}
                      responsive
                      size="small"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {displayOrders[0] && <InvoiceButton orderId={displayOrders[0].id} />}
    </>
  );
};

export default OrderInfor;
