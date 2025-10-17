import React, { useState } from "react";
import { Search, ChevronDown, X } from "lucide-react";

const FilterOrder = ({
  filteredCount,
  filters,
  setFilters,
  setCurrentPage,
}) => {
  const [mobileFilterExpanded, setMobileFilterExpanded] = useState(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      orderCode: "",
      customerName: "",
      status: "",
      startDate: "",
      endDate: "",
      pageNum: 1,
      pageSize: 5,
    });
    setCurrentPage(1);
  };

  return (
    <div className="flex-col p-8">
      {/* Desktop Filter */}
      <div className="bg-white hidden lg:block rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Search className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Tìm kiếm & Lọc
                </h3>
                <p className="text-sm text-gray-600">
                  Lọc danh sách đơn hàng theo tiêu chí
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-black-700">
                Mã đơn hàng
              </label>
              <input
                type="text"
                name="orderCode"
                value={filters.orderCode}
                onChange={handleFilterChange}
                placeholder="Nhập mã đơn hàng"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-black-700">
                Tên khách hàng
              </label>
              <input
                type="text"
                name="customerName"
                value={filters.customerName}
                onChange={handleFilterChange}
                placeholder="Nhập tên khách hàng"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-black-700">
                Trạng thái
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="pending">Đang chờ</option>
                <option value="shipping">Đang giao</option>
                <option value="delivered">Đã giao</option>
                <option value="returned">Bị hoàn</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-black-700">
                Ngày đặt hàng
              </label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              <X size={16} />
              Xóa bộ lọc
            </button>

            <div className="text-sm text-gray-600">
              Tìm thấy{" "}
              <span className="font-semibold text-gray-900">
                {filteredCount}
              </span>{" "}
              đơn hàng
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter */}
      <div className="block lg:hidden bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-gray-900">Lọc đơn hàng</span>
            </div>
            <button
              onClick={() => setMobileFilterExpanded(!mobileFilterExpanded)}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <ChevronDown
                className={`h-4 w-4 transform transition-transform ${
                  mobileFilterExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {mobileFilterExpanded && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-black-700">
                  Mã đơn hàng
                </label>
                <input
                  type="text"
                  name="orderCode"
                  value={filters.orderCode}
                  onChange={handleFilterChange}
                  placeholder="Nhập mã đơn hàng"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-black-700">
                  Tên khách hàng
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={filters.customerName}
                  onChange={handleFilterChange}
                  placeholder="Nhập tên khách hàng"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-black-700">
                  Trạng thái
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none bg-white"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="pending">Đang chờ</option>
                  <option value="shipping">Đang giao</option>
                  <option value="delivered">Đã giao</option>
                  <option value="returned">Bị hoàn</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Xóa bộ lọc
                </button>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">{filteredCount}</span> đơn hàng
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterOrder;