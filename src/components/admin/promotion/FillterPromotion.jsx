import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { Search, Filter, ChevronDown,ArrowUpDown } from "lucide-react";

const FillterPromotion = ({
  setShowAddModal,
  setCurrentPage,
  filteredCount,
  filters,
  setFilters,
  isAsc,
  setIsAsc, 
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
      stt: "",
      promotionType: "",
      startDate: "",
      endDate: "",
      value: "",
      status: "",
      pageNum:1,
      pageSize:5
    });
    setCurrentPage(1);
  };

  return (
    <div className="flex-col  p-8 ">
      <div className="hidden lg:flex justify-end mb-8">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#ad7555] text-white border-2 border-[#ad7555] 
                   hover:bg-white hover:text-[#ad7555] hover:border-[#ad7555] 
                   px-4 py-2  flex items-center gap-2 
                   text-sm font-medium transition-all duration-200"
        >
          <Plus size={18} />
          <span>Thêm khuyến mãi</span>
        </button>
      </div>
      <div className=" lg:hidden  mb-8">
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full bg-[#ad7555] text-white border-2 border-[#ad7555] 
                   hover:bg-white hover:text-[#ad7555] hover:border-[#ad7555] 
                   px-4 py-2  flex items-center justify-center gap-2 
                   text-sm font-medium transition-all duration-200"
        >
          <Plus size={18} />
          <span>Thêm khuyến mãi</span>
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white hidden lg:block rounded-lg shadow-sm border border-gray-200 mb-6">
        {/* Header */}
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
                  Lọc danh sách khuyến mãi theo tiêu chí
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Promotion Type Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-black-700">
                Kiểu khuyến mãi
              </label>
              <select
                name="promotionType"
                value={filters.promotionType}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     bg-white transition-all duration-200"
              >
                <option value="">Tất cả</option>
                <option value="Theo đơn hàng">Theo đơn hàng</option>
                <option value="Theo danh mục">Theo danh mục</option>
              </select>
            </div>

            {/* Start Date Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-black-700">
                Ngày bắt đầu
              </label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     transition-all duration-200"
              />
            </div>

            {/* End Date Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-black-700">
                Ngày kết thúc
              </label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     transition-all duration-200"
              />
            </div>

            {/* Value Filter */}
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-black-700">
                Giá trị
              </label>
             <button
        type="button"
        onClick={() => setIsAsc((prev) => !prev)}
        className="
          flex items-center justify-center
          px-3 py-2 text-sm
          border border-gray-300 rounded-lg
          hover:bg-gray-100
          transition
          w-full
        "
      >
        <ArrowUpDown
          className={`h-4 w-4 mr-1 transition-transform duration-200 ${
            isAsc ? "rotate-0" : "rotate-180"
          }`}
        />
        <span className="text-gray-700">
          {isAsc ? "Tăng dần" : "Giảm dần"}
        </span>
      </button>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-black-700">
                Trạng thái
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     bg-white transition-all duration-200"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="Hoạt động">Hoạt động</option>
                <option value="Không hoạt động">Không hoạt động</option>
                <option value="Hết hạn">Hết hạn</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 
                     hover:bg-gray-200 rounded-lg transition-all duration-200 flex items-center gap-2"
              >
                <X size={16} />
                Xóa bộ lọc
              </button>
            </div>

            <div className="text-sm text-gray-600">
              Tìm thấy{" "}
              <span className="font-semibold text-gray-900">
                {filteredCount}
              </span>{" "}
              khuyến mãi
            </div>
          </div>
        </div>
      </div>

      {/* Compact Mobile Filter */}
      <div className="block lg:hidden bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-gray-900">Lọc khuyến mãi</span>
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
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Promotion Type Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-black-700">
                    Kiểu khuyến mãi
                  </label>
                  <select
                    name="promotionType"
                    value={filters.promotionType}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     bg-white transition-all duration-200"
                  >
                    <option value="">Tất cả loại</option>
                    <option value="Theo đơn hàng">Theo đơn hàng</option>
                    <option value="Theo danh mục">Theo danh mục</option>
                  </select>
                </div>

                {/* Start Date Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-black-700">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     transition-all duration-200"
                  />
                </div>

                {/* End Date Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-black-700">
                    Ngày kết thúc
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     transition-all duration-200"
                  />
                </div>

                {/* Value Filter */}
                <div className="space-y-2">
              <label className="block text-sm font-semibold text-black-700">
                Giá trị
              </label>
             <button
        type="button"
        onClick={() => setIsAsc((prev) => !prev)}
        className="
          flex items-center justify-center
          px-3 py-2 text-sm
          border border-gray-300 rounded-lg
          hover:bg-gray-100
          transition
          w-full
        "
      >
        <ArrowUpDown
          className={`h-4 w-4 mr-1 transition-transform duration-200 ${
            isAsc ? "rotate-0" : "rotate-180"
          }`}
        />
        <span className="text-gray-700">
          {isAsc ? "Tăng dần" : "Giảm dần"}
        </span>
      </button>
            </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-black-700">
                    Trạng thái
                  </label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     bg-white transition-all duration-200"
                  >
                    <option value="">Tất cả trạng thái</option>
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Không hoạt động">Không hoạt động</option>
                    <option value="Hết hạn">Hết hạn</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleClearFilters}
                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 
                     hover:bg-gray-200 rounded-lg transition-all duration-200 flex items-center gap-2"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  Tìm thấy{" "}
                  <span className="font-semibold text-gray-900">
                    {filteredCount}
                  </span>{" "}
                  khuyến mãi
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FillterPromotion;
