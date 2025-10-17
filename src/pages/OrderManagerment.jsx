// File: pages/admin/OrderManagement.jsx
import React, { useState, useEffect } from "react";
import FilterOrder from "@/components/admin/order/FilterOrder";
import ListOrder from "@/components/admin/order/ListOrder";
import OrderDetail from "@/components/admin/order/OrderDetail";
import OrderEdit from "@/components/admin/order/OrderEdit";
import { Pagination } from "antd";
import { toast } from "react-toastify";

// Dummy data
const dummyOrders = [
  {
    id: 1,
    orderCode: "ORD001",
    customerName: "Nguyễn Văn A",
    phone: "0123456789",
    email: "nguyenvana@email.com",
    orderDate: "2025-10-15",
    status: "pending",
    totalAmount: 15000000,
    subtotal: 14000000,
    shippingFee: 30000,
    discount: 0,
    paymentMethod: "COD",
    shippingAddress: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
    items: [
      {
        name: "Áo sơ mi nam công sở",
        quantity: 2,
        price: 500000,
        image: "https://via.placeholder.com/100"
      },
      {
        name: "Quần tây nam",
        quantity: 1,
        price: 800000,
        image: "https://via.placeholder.com/100"
      }
    ]
  },
  {
    id: 2,
    orderCode: "ORD002",
    customerName: "Trần Thị B",
    phone: "0987654321",
    email: "tranthib@email.com",
    orderDate: "2025-10-14",
    status: "shipping",
    totalAmount: 2500000,
    subtotal: 2470000,
    shippingFee: 30000,
    discount: 0,
    paymentMethod: "Chuyển khoản",
    shippingAddress: "456 Đường DEF, Phường ABC, Quận 2, TP.HCM",
    items: [
      {
        name: "Váy đầm công sở",
        quantity: 1,
        price: 1200000,
        image: "https://via.placeholder.com/100"
      },
      {
        name: "Giày cao gót",
        quantity: 1,
        price: 1270000,
        image: "https://via.placeholder.com/100"
      }
    ]
  },
  {
    id: 3,
    orderCode: "ORD003",
    customerName: "Lê Văn C",
    phone: "0912345678",
    email: "levanc@email.com",
    orderDate: "2025-10-13",
    status: "delivered",
    totalAmount: 3200000,
    subtotal: 3170000,
    shippingFee: 30000,
    discount: 0,
    paymentMethod: "COD",
    shippingAddress: "789 Đường GHI, Phường DEF, Quận 3, TP.HCM",
    items: [
      {
        name: "Áo khoác nam",
        quantity: 1,
        price: 1500000,
        image: "https://via.placeholder.com/100"
      },
      {
        name: "Quần jean nam",
        quantity: 2,
        price: 835000,
        image: "https://via.placeholder.com/100"
      }
    ]
  },
  {
    id: 4,
    orderCode: "ORD004",
    customerName: "Phạm Thị D",
    phone: "0898765432",
    email: "phamthid@email.com",
    orderDate: "2025-10-12",
    status: "returned",
    totalAmount: 1800000,
    subtotal: 1770000,
    shippingFee: 30000,
    discount: 0,
    paymentMethod: "Chuyển khoản",
    shippingAddress: "321 Đường JKL, Phường GHI, Quận 4, TP.HCM",
    items: [
      {
        name: "Túi xách nữ",
        quantity: 1,
        price: 1770000,
        image: "https://via.placeholder.com/100"
      }
    ]
  },
  {
    id: 5,
    orderCode: "ORD005",
    customerName: "Hoàng Văn E",
    phone: "0923456789",
    email: "hoangvane@email.com",
    orderDate: "2025-10-11",
    status: "pending",
    totalAmount: 4500000,
    subtotal: 4470000,
    shippingFee: 30000,
    discount: 0,
    paymentMethod: "COD",
    shippingAddress: "654 Đường MNO, Phường JKL, Quận 5, TP.HCM",
    items: [
      {
        name: "Bộ vest nam",
        quantity: 1,
        price: 3500000,
        image: "https://via.placeholder.com/100"
      },
      {
        name: "Cà vạt lụa",
        quantity: 2,
        price: 485000,
        image: "https://via.placeholder.com/100"
      }
    ]
  },
  {
    id: 6,
    orderCode: "ORD006",
    customerName: "Đỗ Thị F",
    phone: "0934567890",
    email: "dothif@email.com",
    orderDate: "2025-10-10",
    status: "shipping",
    totalAmount: 2100000,
    subtotal: 2070000,
    shippingFee: 30000,
    discount: 0,
    paymentMethod: "Chuyển khoản",
    shippingAddress: "987 Đường PQR, Phường MNO, Quận 6, TP.HCM",
    items: [
      {
        name: "Áo thun nữ",
        quantity: 3,
        price: 350000,
        image: "https://via.placeholder.com/100"
      },
      {
        name: "Quần jean nữ",
        quantity: 1,
        price: 1020000,
        image: "https://via.placeholder.com/100"
      }
    ]
  },
  {
    id: 7,
    orderCode: "ORD007",
    customerName: "Vũ Văn G",
    phone: "0945678901",
    email: "vuvang@email.com",
    orderDate: "2025-10-09",
    status: "delivered",
    totalAmount: 5200000,
    subtotal: 5170000,
    shippingFee: 30000,
    discount: 0,
    paymentMethod: "COD",
    shippingAddress: "147 Đường STU, Phường PQR, Quận 7, TP.HCM",
    items: [
      {
        name: "Giày da nam",
        quantity: 1,
        price: 2500000,
        image: "https://via.placeholder.com/100"
      },
      {
        name: "Thắt lưng da",
        quantity: 1,
        price: 800000,
        image: "https://via.placeholder.com/100"
      },
      {
        name: "Ví da nam",
        quantity: 1,
        price: 1870000,
        image: "https://via.placeholder.com/100"
      }
    ]
  }
];

const OrderManagement = () => {
  const [orders, setOrders] = useState(dummyOrders);
  const [filteredOrders, setFilteredOrders] = useState(dummyOrders);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [filters, setFilters] = useState({
    orderCode: "",
    customerName: "",
    status: "",
    startDate: "",
    endDate: "",
    pageNum: 1,
    pageSize: 5,
  });

  // Filter orders based on filter criteria
  useEffect(() => {
    let result = [...orders];

    if (filters.orderCode) {
      result = result.filter((order) =>
        order.orderCode.toLowerCase().includes(filters.orderCode.toLowerCase())
      );
    }

    if (filters.customerName) {
      result = result.filter((order) =>
        order.customerName
          .toLowerCase()
          .includes(filters.customerName.toLowerCase())
      );
    }

    if (filters.status) {
      result = result.filter((order) => order.status === filters.status);
    }

    if (filters.startDate) {
      result = result.filter(
        (order) => new Date(order.orderDate) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      result = result.filter(
        (order) => new Date(order.orderDate) <= new Date(filters.endDate)
      );
    }

    setFilteredOrders(result);
  }, [filters, orders]);

  // Get current page orders
  const indexOfLastOrder = currentPage * filters.pageSize;
  const indexOfFirstOrder = indexOfLastOrder - filters.pageSize;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const openDetailModal = (order) => {
    setCurrentOrder(order);
    setShowDetailModal(true);
  };

  const openEditModal = (order) => {
    setCurrentOrder(order);
    setShowEditModal(true);
  };

  const handleUpdateStatus = (orderId, newStatus, note) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    toast.success(
      `Đã cập nhật trạng thái đơn hàng thành công${note ? `: ${note}` : ""}`
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setFilters((prev) => ({ ...prev, pageNum: page }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
     

      {/* Filter Section */}
      <FilterOrder
        filteredCount={filteredOrders.length}
        filters={filters}
        setFilters={setFilters}
        setCurrentPage={setCurrentPage}
      />

      {/* Orders List */}
      <div className="max-w-full mx-auto px-8 pb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <ListOrder
            orders={currentOrders}
            openDetailModal={openDetailModal}
            openEditModal={openEditModal}
            pageNum={currentPage}
            pageSize={filters.pageSize}
          />

          {/* Pagination */}
          {filteredOrders.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <Pagination
                current={currentPage}
                total={filteredOrders.length}
                pageSize={filters.pageSize}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showDetailModal && currentOrder && (
        <OrderDetail
          currentOrder={currentOrder}
          setShowDetailModal={setShowDetailModal}
        />
      )}

      {showEditModal && currentOrder && (
        <OrderEdit
          currentOrder={currentOrder}
          setShowEditModal={setShowEditModal}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default OrderManagement;