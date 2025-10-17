import React from "react";
import { Eye, Edit } from "lucide-react";

const ListOrder = ({
  orders,
  openDetailModal,
  openEditModal,
  pageNum,
  pageSize,
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-200",
        label: "Đang chờ",
      },
      shipping: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        border: "border-blue-200",
        label: "Đang giao",
      },
      delivered: {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-200",
        label: "Đã giao",
      },
      returned: {
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-200",
        label: "Bị hoàn",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span
        className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text} border ${config.border}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">
                  STT
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">
                  Mã đơn hàng
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">
                  Khách hàng
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">
                  Ngày đặt
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">
                  Tổng tiền
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-300">
              {orders.map((order, index) => (
                <tr
                  key={order.id}
                  className={`hover:bg-gray-200 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-25"
                  }`}
                >
                  <td className="px-4 py-4 text-sm text-center font-medium text-gray-900">
                    {((Number(pageNum) || 1) - 1) * (Number(pageSize) || 5) +
                      index +
                      1}
                  </td>
                  <td className="px-4 py-4 text-sm text-center text-gray-700 font-medium">
                    {order.orderCode}
                  </td>
                  <td className="px-4 py-4 text-sm text-center text-gray-700">
                    {order.customerName}
                  </td>
                  <td className="px-4 py-4 text-sm text-center text-gray-700">
                    {order.orderDate}
                  </td>
                  <td className="px-4 py-4 text-sm text-center font-medium text-gray-900">
                    {formatPrice(order.totalAmount)}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center items-center space-x-2">
                      <button
                        onClick={() => openDetailModal(order)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-all duration-200"
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => openEditModal(order)}
                        className="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-50 transition-all duration-200"
                        title="Cập nhật trạng thái"
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        <div className="divide-y divide-gray-200">
          {orders.map((order, index) => (
            <div
              key={order.id}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                      #{(pageNum - 1) * pageSize + index + 1}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">
                    {order.orderCode}
                  </h4>
                  <p className="text-sm text-gray-600 mb-1">
                    KH: {order.customerName}
                  </p>
                  <p className="text-sm font-medium text-[#ad7555] mb-1">
                    {formatPrice(order.totalAmount)}
                  </p>
                  <p className="text-xs text-gray-500">{order.orderDate}</p>
                </div>

                <div className="flex items-center space-x-1 ml-4">
                  <button
                    onClick={() => openDetailModal(order)}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => openEditModal(order)}
                    className="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-50"
                  >
                    <Edit size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">
            Không có dữ liệu
          </h3>
          <p className="text-sm text-gray-500">
            Không tìm thấy đơn hàng nào phù hợp với bộ lọc.
          </p>
        </div>
      )}
    </>
  );
};

export default ListOrder;