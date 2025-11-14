import React, { useState, useEffect } from "react";
import { Input, Pagination, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Layout from "@/components/commons/Layout";
import SidebarProfile from "@/components/auth/SidebarProfile";
import OrderItem from "@/components/searchOrder/OrderItem";

const { Option } = Select;

const OrderInfor = () => {
  const mockOrders = [
    {
      id: 1,
      name: "Gương phòng tắm có đèn",
      type: "Bạc 60x20 cm",
      quantity: 1,
      price: 1000000,
      total: 1000000,
      status: "Đang chờ",
      image: null,
      shippingAddress: "123 Nguyễn Văn A, Quận 1, TP.HCM",
      phone: "0123456789",
      shippingFee: 30000,
      trackingCode: "VN1234567890",
      paymentMethod: "Thanh toán khi nhận hàng",
      paymentStatus: "Chưa thanh toán",
      createdAt: "15/01/2024 10:30"
    },
    {
      id: 2,
      name: "Sofa cao cấp",
      type: "đỏ",
      quantity: 1,
      price: 1000000,
      total: 2000000,
      status: "Đang giao",
      image: null,
      shippingAddress: "456 Lê Văn B, Quận 3, TP.HCM",
      phone: "0987654321",
      shippingFee: 50000,
      trackingCode: "VN0987654321",
      paymentMethod: "Chuyển khoản",
      paymentStatus: "Đã thanh toán",
      createdAt: "14/01/2024 09:15"
    },
    {
      id: 3,
      name: "Bàn làm việc gỗ",
      type: "Gỗ sồi",
      quantity: 2,
      price: 1500000,
      total: 3000000,
      status: "Đã giao",
      image: null,
      shippingAddress: "789 Trần Văn C, Quận 5, TP.HCM",
      phone: "0369852147",
      shippingFee: 40000,
      trackingCode: "VN5647382910",
      paymentMethod: "Ví MoMo",
      paymentStatus: "Đã thanh toán",
      createdAt: "10/01/2024 14:20"
    },
    {
      id: 4,
      name: "Ghế văn phòng",
      type: "Da PU cao cấp",
      quantity: 1,
      price: 2500000,
      total: 2500000,
      status: "Bị hoàn",
      image: null,
      shippingAddress: "321 Phạm Văn D, Quận 7, TP.HCM",
      phone: "0147258369",
      shippingFee: 35000,
      trackingCode: "VN9876543210",
      paymentMethod: "Thanh toán khi nhận hàng",
      paymentStatus: "Chưa thanh toán",
      createdAt: "12/01/2024 16:45",
      cancelReason: "Khách hàng thay đổi ý định mua hàng",
      canceledAt: "13/01/2024 10:00"
    }
  ];

  const [orders, setOrders] = useState(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState(mockOrders);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const pageSize = 2;

  // Handle cancel order
  const handleCancelOrder = (orderId, cancelData) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { 
              ...order, 
              status: "Bị hoàn",
              cancelReason: cancelData.reason,
              canceledAt: cancelData.timestamp
            }
          : order
      )
    );
    
    console.log("Cancel order data:", cancelData);
  };

  // Filter orders based on search and status
  useEffect(() => {
    let filtered = orders;

    // Filter by search text
    if (searchText) {
      filtered = filtered.filter(order =>
        order.name.toLowerCase().includes(searchText.toLowerCase()) ||
        order.id.toString().includes(searchText)
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchText, statusFilter, orders]);

  // Get current page orders
  const getCurrentPageOrders = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredOrders.slice(startIndex, endIndex);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
                  <h2 className="text-lg sm:text-xl font-semibold">ĐƠN HÀNG CỦA BẠN</h2>
                </div>

                {/* Search and Filter Section */}
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

                {/* Orders List */}
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
                      <p className="text-sm sm:text-base">Không tìm thấy đơn hàng nào</p>
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
                      onChange={handlePageChange}
                      showSizeChanger={false}
                      
                      responsive
                      size="small"
                      className="sm:size-default"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderInfor;