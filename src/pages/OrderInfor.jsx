import React, { useState, useEffect } from "react";
import { Input, Pagination, Select, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Layout from "@/components/commons/Layout";
import SidebarProfile from "@/components/auth/SidebarProfile";
import OrderItem from "@/components/searchOrder/OrderItem";
import InvoiceButton from "@/components/payment/bill/InvoiceButton";
import { getAllOrder, getOrderById } from "@/api/order";

const { Option } = Select;

const OrderInfor = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const pageSize = 2;

  const mapOrderStatusToUI = (status) => {
    switch (status) {
      case "PENDING":
      case "CONFIRMED":
      case "PROCESSING":
        return "Đang chờ";
      case "DELIVERED":
        return "Đang giao";
      case "COMPLETED":
        return "Đã giao";
      case "CANCELLED":
      case "RETURNED":
      case "REFUNDED":
      case "FAIL":
        return "Bị hoàn";
      default:
        return status;
    }
  };

  const mapPaymentStatusToUI = (status) => {
    switch (status) {
      case "COMPLETED":
        return "Đã thanh toán";
      case "PENDING":
      case "EXPIRED":
      case "CANCELLED":
      case "REFUNDED":
        return "Chưa thanh toán";
      default:
        return status;
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await getAllOrder({ pageNum: 1, pageSize: 100 });

      console.log("response order:", response);
      // API trả về danh sách => response.data.list
      const list = response.data?.list || [];

      const formatted = list.map((order) => ({
        id: order.id,
        products: order.products?.map((p) => ({
          id: p.productId,
          name: p.productName,
          type: `${p.color || ""} ${p.size || ""}`.trim(),
          quantity: p.quantity,
          price: p.priceAtSale || 0,
          image: p.image,
          total: p.total || 0,
        })),
        total: order.totalAmount || 0,
        status: mapOrderStatusToUI(order.status),
        shippingAddress: order.recipientInfo?.detailAddress || "",
        phone: order.recipientInfo?.phoneNumber || "",
        shippingFee: order.shippingFee || 30000,
        trackingCode: order.orderNumber,
        paymentMethod:
          order.payment?.type === "CASH_ON_DELIVERY"
            ? "Thanh toán khi nhận hàng"
            : order.payment?.type,
        paymentStatus: mapPaymentStatusToUI(order.payment?.status),
        createdAt: order.orderDate,
        cancelReason:
          order.status === "Bị hoàn" ? "Đơn hàng đã bị hủy/hoàn" : null,
        canceledAt: order.status === "Bị hoàn" ? order.updatedAt : null,
      }));

      setOrders(formatted);
      setFilteredOrders(formatted);
    } catch (error) {
      console.log(error);
      message.error("Lấy danh sách đơn hàng thất bại!");
    }
  };

  useEffect(() => {
    fetchOrders();
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

  useEffect(() => {
    const fetchById = async (id) => {
      try {
        const orderData = await getOrderById(id);

        if (!orderData) {
          setFilteredOrders([]);
          return;
        }

        const formattedOrder = {
          id: orderData.id,
          products: orderData.products?.map((p) => ({
            id: p.productId,
            name: p.productName,
            type: `${p.color || ""} ${p.size || ""}`.trim(),
            quantity: p.quantity,
            price: p.priceAtSale || 0,
            image: p.image,
            total: p.total || 0,
          })),
          total: orderData.totalAmount || 0,
          status: mapOrderStatusToUI(orderData.status),
          shippingAddress: orderData.recipientInfo?.detailAddress || "",
          phone: orderData.recipientInfo?.phoneNumber || "",
          shippingFee: orderData.shippingFee || 30000,
          trackingCode: orderData.orderNumber,
          paymentMethod:
            orderData.payment?.type === "CASH_ON_DELIVERY"
              ? "Thanh toán khi nhận hàng"
              : orderData.payment?.type,
          paymentStatus: mapPaymentStatusToUI(orderData.payment?.status),
          createdAt: orderData.orderDate,
          cancelReason:
            orderData.status === "Bị hoàn" ? "Đơn hàng đã bị hủy/hoàn" : null,
          canceledAt:
            orderData.status === "Bị hoàn" ? orderData.updatedAt : null,
        };

        setFilteredOrders([formattedOrder]);
      } catch (error) {
        if (error?.response?.status === 404) {
          message.error("Đơn hàng không tồn tại!");
        } else {
          message.error("Không thể tìm đơn hàng!");
        }
        setFilteredOrders([]);
      }
    };

    let result = [...orders];
    const text = searchText.trim();

    // Search
    if (text !== "") {
      if (!isNaN(Number(text))) {
        fetchById(Number(text));
        return;
      } else {
        result = result.filter((order) =>
          order.products?.some((p) =>
            p.name.toLowerCase().includes(text.toLowerCase())
          )
        );
      }
    }

    // Filter trạng thái
    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(result);
    setCurrentPage(1);
  }, [searchText, statusFilter, orders]);

  const getCurrentPageOrders = () => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  };

  return (
    <Layout>
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
                      placeholder="Tìm kiếm theo tên sản phẩm hoặc mã đơn hàng"
                      prefix={<SearchOutlined />}
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="flex-1"
                      size="large"
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
                <div className="p-4 sm:p-6">
                  {getCurrentPageOrders().length > 0 ? (
                    getCurrentPageOrders().map((order) => (
                      <OrderItem
                        key={order.id}
                        order={order}
                        onCancelOrder={handleCancelOrder}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <p className="text-sm sm:text-base">
                        Không tìm thấy đơn hàng nào
                      </p>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {filteredOrders.length > 0 && (
                  <div className="p-4 sm:p-6 border-t flex justify-center">
                    <Pagination
                      current={currentPage}
                      total={filteredOrders.length}
                      pageSize={pageSize}
                      onChange={setCurrentPage}
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

      {getCurrentPageOrders()[0] && (
        <InvoiceButton orderId={getCurrentPageOrders()[0].id} />
      )}
    </Layout>
  );
};

export default OrderInfor;
