import React from "react";
import { Eye, Edit, Trash2 } from "lucide-react";

const ListPromotion = ({promotions, openDetailModal, openEditModal, handleDeletePromotion}) => {
  return (
    <>
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  STT
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Kiểu khuyến mãi
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Ngày bắt đầu
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Ngày kết thúc
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Giá trị
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Hành động
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-300">
              {promotions.map((promotion, index) => (
                <tr
                  key={promotion.stt}
                  className={` bg-gray-100 hover:bg-gray-200 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-25"
                  }`}
                >
                  <td className="px-4 py-4 text-sm  text-center   font-medium text-gray-900">
                    {promotion.stt}
                  </td>
                  <td className="px-4 py-4 text-sm  text-center  text-gray-700">
                    {promotion.promotionType}
                  </td>
                  <td className="px-4 py-4 text-sm  text-center  text-gray-700">
                    {promotion.startDate}
                  </td>
                  <td className="px-4 py-4 text-sm  text-center  text-gray-700">
                    {promotion.endDate}
                  </td>
                  <td className="px-4 py-4 text-sm  text-center  font-medium text-gray-900">
                    {promotion.value}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                        promotion.status === "Hoạt động"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : promotion.status === "Hết hạn"
                          ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                      }`}
                    >
                      {promotion.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 ">
                    <div className="flex justify-center items-center space-x-2">
                      <button
                        onClick={() => openDetailModal(promotion)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-none  transition-all duration-200"
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => openEditModal(promotion)}
                        className="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-none  transition-all duration-200"
                        title="Chỉnh sửa"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeletePromotion(promotion.stt)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-none  transition-all duration-200"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
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
        {/* Mobile Cards */}
        <div className="divide-y divide-gray-200">
          {promotions.map((promotion) => (
            <div
              key={promotion.stt}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                      #{promotion.stt}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        promotion.status === "Hoạt động"
                          ? "bg-green-100 text-green-800"
                          : promotion.status === "Hết hạn"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {promotion.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">
                    {promotion.promotionType}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Giá trị:{" "}
                    <span className="font-medium">{promotion.value}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {promotion.startDate} - {promotion.endDate}
                  </p>
                </div>

                <div className="flex items-center space-x-1 ml-4">
                  <button
                    onClick={() => openDetailModal(promotion)}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-none "
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => openEditModal(promotion)}
                    className="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-none "
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeletePromotion(promotion.stt)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-none "
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {promotions.length === 0 && (
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
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m0 0V6a2 2 0 012-2h2.5"
              />
            </svg>
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">
            Không có dữ liệu
          </h3>
          <p className="text-sm text-gray-500">
            Không tìm thấy khuyến mãi nào phù hợp với bộ lọc.
          </p>
        </div>
      )}
    </>
  );
};

export default ListPromotion;
