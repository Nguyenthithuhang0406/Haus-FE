// File: pages/admin/OrderManagement.jsx
import React, { useState, useEffect } from "react";
import FilterOrder from "@/components/admin/order/FilterOrder";
import ListOrder from "@/components/admin/order/ListOrder";
import OrderDetail from "@/components/admin/order/OrderDetail";
import OrderEdit from "@/components/admin/order/OrderEdit";
import { Pagination } from "antd";
import { toast } from "react-toastify";
import { getAllOrder, updateOrderStatus } from "@/api/order";

const mapOrderData = (apiOrder) => {
  // Lấy thông tin khách hàng từ recipientInfo
  const recipientInfo = apiOrder.recipientInfo || {};
  const customerName = recipientInfo.recipientName || "";
  const phone = recipientInfo.phoneNumber || "";

  // Tạo địa chỉ giao hàng từ recipientInfo
  const addressParts = [
    recipientInfo.detailAddress,
    recipientInfo.commune,
    recipientInfo.district,
    recipientInfo.city,
    recipientInfo.country,
  ].filter(Boolean);
  const shippingAddress = addressParts.join(", ") || "";

  // Calculate subtotal and discount
  const totalAmount = apiOrder.totalAmount || 0;
  const shippingFee = apiOrder.shippingFee || 0;
  const discountPercent = apiOrder.promotion?.discountPercent || 0;

  // Calculate from products total (similar to OrderDetail)
  const productsTotal =
    apiOrder.products?.reduce(
      (sum, product) => sum + (product.total || 0),
      0
    ) || 0;
  const discountAmount =
    discountPercent > 0
      ? Math.round((productsTotal * discountPercent) / 100)
      : 0;
  const subtotal = productsTotal - discountAmount;

  return {
    id: apiOrder.id,
    orderNumber: apiOrder.orderNumber || "",
    orderCode: apiOrder.orderNumber || "", // Keep for backward compatibility
    customerName: customerName,
    phone: phone,
    email: "", // Không có email trong recipientInfo
    orderDate: apiOrder.orderDate || "",
    deliveryDate: apiOrder.deliveryDate || null,
    status: apiOrder.status || "pending",
    totalAmount: totalAmount,
    shippingFee: shippingFee,
    subtotal: subtotal,
    discount: discountAmount,
    paymentMethod: apiOrder.payment?.type || "COD",
    payment: apiOrder.payment || null,
    promotion: apiOrder.promotion || null,
    shippingAddress: shippingAddress,
    items: apiOrder.products || [], // Lấy từ products thay vì items
    recipientInfo: recipientInfo, // Giữ nguyên recipientInfo cho detail view
  };
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [filters, setFilters] = useState({
    orderCode: "",
    customerName: "",
    status: "",
    startDate: "",
    endDate: "",
    pageNum: 1,
    pageSize: 5,
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getAllOrder({
        status: filters.status || undefined,
        pageNum: filters.pageNum,
        pageSize: filters.pageSize,
      });

      if (response.status === 200 && response.data) {
        const mappedOrders = (response.data.items || []).map(mapOrderData);
        setOrders(mappedOrders);

        if (response.data.pageCustom) {
          setTotalElements(response.data.pageCustom.totalElement || 0);
          setCurrentPage(response.data.pageCustom.pageNum || 1);
        }
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filters.pageNum !== 1) {
      setFilters((prev) => ({ ...prev, pageNum: 1 }));
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status]);

  useEffect(() => {
    if (
      filters.pageNum !== 1 &&
      (filters.orderCode ||
        filters.customerName ||
        filters.startDate ||
        filters.endDate)
    ) {
      setFilters((prev) => ({ ...prev, pageNum: 1 }));
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.orderCode,
    filters.customerName,
    filters.startDate,
    filters.endDate,
  ]);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.pageNum, filters.pageSize]);

  const filteredOrders = orders.filter((order) => {
    if (
      filters.orderCode &&
      !order.orderCode.toLowerCase().includes(filters.orderCode.toLowerCase())
    ) {
      return false;
    }
    if (
      filters.customerName &&
      !order.customerName
        .toLowerCase()
        .includes(filters.customerName.toLowerCase())
    ) {
      return false;
    }
    if (
      filters.startDate &&
      new Date(order.orderDate) < new Date(filters.startDate)
    ) {
      return false;
    }
    if (
      filters.endDate &&
      new Date(order.orderDate) > new Date(filters.endDate)
    ) {
      return false;
    }
    return true;
  });

  const hasClientFilters =
    filters.orderCode ||
    filters.customerName ||
    filters.startDate ||
    filters.endDate;
  const paginationTotal = hasClientFilters
    ? filteredOrders.length
    : totalElements;

  const getPaginatedOrders = () => {
    if (hasClientFilters) {
      const startIndex = (currentPage - 1) * filters.pageSize;
      const endIndex = startIndex + filters.pageSize;
      return filteredOrders.slice(startIndex, endIndex);
    }
    return filteredOrders;
  };

  const displayOrders = getPaginatedOrders();

  const openDetailModal = (order) => {
    setSelectedOrderId(order.id);
    setShowDetailModal(true);
  };

  const openEditModal = (order) => {
    setCurrentOrder(order);
    setShowEditModal(true);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      toast.success("Đã cập nhật trạng thái đơn hàng thành công");

      // Refresh orders list
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Không thể cập nhật trạng thái đơn hàng");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setFilters((prev) => ({ ...prev, pageNum: page }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Filter Section */}
      <FilterOrder
        filteredCount={hasClientFilters ? filteredOrders.length : totalElements}
        filters={filters}
        setFilters={setFilters}
        setCurrentPage={setCurrentPage}
      />

      {/* Orders List */}
      <div className="max-w-full mx-auto px-8 pb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-400">Đang tải dữ liệu...</div>
            </div>
          ) : (
            <>
              <ListOrder
                orders={displayOrders}
                openDetailModal={openDetailModal}
                openEditModal={openEditModal}
                pageNum={currentPage}
                pageSize={filters.pageSize}
              />

              {/* Pagination */}
              {paginationTotal > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                  <Pagination
                    current={currentPage}
                    total={paginationTotal}
                    pageSize={filters.pageSize}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {showDetailModal && selectedOrderId && (
        <OrderDetail
          orderId={selectedOrderId}
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
