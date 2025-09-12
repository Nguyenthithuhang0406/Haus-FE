import React, { useState } from 'react';
import { Eye, Edit, Trash2, Plus, X, Upload } from 'lucide-react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import Layouta from '@/components/admin/Layouta';
const Promotion = () => {
  const [promotions, setPromotions] = useState([
    {
      stt: 1,
      promotionType: 'Theo đơn hàng',
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      value: '20%',
      status: 'Hoạt động'
    },
    {
      stt: 2,
      promotionType: 'Theo danh mục',
      startDate: '2025-02-01',
      endDate: '2025-02-28',
      value: '15%',
      status: 'Không hoạt động'
    },
    {
      stt: 3,
      promotionType: 'Theo danh mục',
      startDate: '2025-02-01',
      endDate: '2025-02-28',
      value: '15%',
      status: 'Hết hạn'
    },
    {
      stt: 4,
      promotionType: 'Theo đơn hàng',
      startDate: '2025-09-08',
      endDate: '2025-09-09',
      value: '15%',
      status: 'Hết hạn'
    },
    {
      stt: 5,
      promotionType: 'Theo đơn hàng',
      startDate: '2025-03-01',
      endDate: '2025-03-31',
      value: '25%',
      status: 'Hoạt động'
    },
    {
      stt: 6,
      promotionType: 'Theo danh mục',
      startDate: '2025-04-01',
      endDate: '2025-04-30',
      value: '30%',
      status: 'Hoạt động'
    },
    {
      stt: 7,
      promotionType: 'Theo đơn hàng',
      startDate: '2025-05-01',
      endDate: '2025-05-31',
      value: '10%',
      status: 'Không hoạt động'
    },
    {
      stt: 8,
      promotionType: 'Theo danh mục',
      startDate: '2025-06-01',
      endDate: '2025-06-30',
      value: '35%',
      status: 'Hết hạn'
    },
    {
      stt: 9,
      promotionType: 'Theo đơn hàng',
      startDate: '2025-07-01',
      endDate: '2025-07-31',
      value: '18%',
      status: 'Hoạt động'
    },
    {
      stt: 10,
      promotionType: 'Theo danh mục',
      startDate: '2025-08-01',
      endDate: '2025-08-31',
      value: '22%',
      status: 'Hoạt động'
    }
  ]);
  // số item hiển thị mỗi trang
  const [itemsPerPage] = useState(5);
  // trang hiện tại
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    stt: '',
    promotionType: '',
    startDate: '',
    endDate: '',
    value: '',
    status: ''
  });
  const filteredPromotions = promotions.filter((promo) => {
    return (
      (!filters.stt || promo.stt.toString().includes(filters.stt)) &&
      (!filters.promotionType || promo.promotionType.toLowerCase().includes(filters.promotionType.toLowerCase())) &&
      (!filters.startDate || promo.startDate.includes(filters.startDate)) &&
      (!filters.endDate || promo.endDate.includes(filters.endDate)) &&
      (!filters.value || promo.value.toLowerCase().includes(filters.value.toLowerCase())) &&
      (!filters.status || promo.status.toLowerCase() === filters.status.toLowerCase())
    );
  });
  const [mobileFilterExpanded, setMobileFilterExpanded] = useState(false);
  // Lấy dữ liệu theo trang
  const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPromotions = filteredPromotions.slice(startIndex, endIndex);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState(null);
  const [selectedType, setSelectedType] = useState('');
  const [formData, setFormData] = useState({
    promotionType: '',

    value: '',
    status: 'Hoạt động',
    priceStart: '',
    priceEnd: '',
    category: '',
    startdate: '',
    enddate: ''
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleAddPromotion = () => {
    const newPromotion = {
      stt: Date.now(),
      stt: promotions.length + 1,
      promotionType: formData.promotionType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      value: formData.value,
      status: formData.status
    };
    setPromotions([...promotions, newPromotion]);
    setShowAddModal(false);
    setFormData({
      promotionType: '',

      value: '',
      status: 'Hoạt động',
      priceStart: '',
      priceEnd: '',
      category: '',
      startdate: '',
      enddate: ''
    });
  };
  const handleEditPromotion = () => {
    setPromotions(promotions.map(promo =>
      promo.stt === currentPromotion.stt
        ? { ...promo, ...formData }
        : promo
    ));
    setShowEditModal(false);
    setCurrentPromotion(null);
  };
  const handleDeletePromotion = (stt) => {
    setPromotions(promotions.filter(promo => promo.stt !== stt));
    // Reset to first page if current page becomes empty
    const newFilteredPromotions = filteredPromotions.filter(promo => promo.stt !== stt);
    const newTotalPages = Math.ceil(newFilteredPromotions.length / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };
  const openEditModal = (promotion) => {
    setCurrentPromotion(promotion);
    setFormData(promotion);
    setSelectedType(promotion.promotionType);
    setShowEditModal(true);
  };
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
  };
  const openDetailModal = (promotion) => {
    setCurrentPromotion(promotion);
    setShowDetailModal(true);
  };
  const filteredCount = filteredPromotions.length;
  const handleClearFilters = () => {
    setFilters({
      stt: '',
      promotionType: '',
      startDate: '',
      endDate: '',
      value: '',
      status: ''
    });
    setCurrentPage(1);
  };
  const renderTypeSpecificFields = () => {
    if (selectedType === 'Theo đơn hàng') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">


          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-semibold text-black-700 mb-2">Giá trị đơn hàng tối thiểu <span className="text-red-500 text-base">*</span></label>
              <div className="relative">
                <input
                  type="number"
                  name="priceStart"
                  value={formData.priceStart}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-none  focus:outline-none"
                  required
                />
                <span className="absolute right-3 top-2 text-gray-500">VND</span>
              </div>
            </div>
            <div>
              <label className="block text-base font-semibold text-black-700 mb-2">Giá trị đơn hàng tối đa <span className="text-red-500 text-base">*</span></label>
              <div className="relative">
                <input
                  type="number"
                  name="priceEnd"
                  value={formData.priceEnd}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-none  focus:outline-none"
                  required
                />
                <span className="absolute right-3 top-2 text-gray-500">VND</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-base font-semibold text-black-700 mb-2">Giá trị khuyến mãi <span className="text-red-500 text-base">*</span></label>
            <div className="flex gap-2">
              <input
                type="text"
                name="value"
                value={formData.value}
                onChange={handleInputChange}
                placeholder="Ví dụ: 20% hoặc 50000"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-none  focus:outline-none"
                required
              />
              <div className="text-sm text-gray-500 flex items-center">
                (% hoặc VND)
              </div>
            </div>
          </div>
        </div>
      );
    } else if (selectedType === 'Theo danh mục') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-base font-semibold text-black-700 mb-2">Chọn danh mục <span className='text-red-500'>*</span></label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-none  focus:outline-none"
              required
            >
              <option value="">-- Chọn danh mục --</option>
              <option value="Thời trang nam">Thời trang nam</option>
              <option value="Thời trang nữ">Thời trang nữ</option>
              <option value="Giày dép">Giày dép</option>
              <option value="Phụ kiện">Phụ kiện</option>
              <option value="Túi xách">Túi xách</option>
            </select>
          </div>

          <div>
            <label className="block text-base font-semibold text-black-700 mb-2">Giá trị khuyến mãi <span className="text-red-500 text-base">*</span></label>
            <div className="flex gap-2">
              <input
                type="text"
                name="value"
                value={formData.value}
                onChange={handleInputChange}
                placeholder="Ví dụ: 15% hoặc 30000"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-none  focus:outline-none"
                required
              />
              <div className="text-sm text-gray-500 flex items-center">
                (% hoặc VND)
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };
  return (
    <Layouta>
      <div className="min-h-screen bg-gray-100">
        {/* Main Content */}
        <div className="flex-col  p-8 ">
          <div className='hidden lg:flex justify-end mb-8'>
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
          <div className=' lg:hidden  mb-8'>
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
                    <h3 className="text-lg font-semibold text-gray-900">Tìm kiếm & Lọc</h3>
                    <p className="text-sm text-gray-600">Lọc danh sách khuyến mãi theo tiêu chí</p>
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
                  <div className="relative">
                    <input
                      type="text"
                      name="value"
                      value={filters.value}
                      onChange={handleFilterChange}
                      placeholder="Nhập giá trị..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       transition-all duration-200 pr-8"
                    />
                    <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
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
                  Tìm thấy <span className="font-semibold text-gray-900">{filteredCount}</span> khuyến mãi
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
                    className={`h-4 w-4 transform transition-transform ${mobileFilterExpanded ? 'rotate-180' : ''
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
                  <div className="relative">
                    <input
                      type="text"
                      name="value"
                      value={filters.value}
                      onChange={handleFilterChange}
                      placeholder="Nhập giá trị..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       transition-all duration-200 pr-8"
                    />
                    <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
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
                  Tìm thấy <span className="font-semibold text-gray-900">{filteredCount}</span> khuyến mãi
                </div>
              </div>
            </div>
              )}
            </div>
          </div>

          {/* Modern Responsive Table */}
          <div className="w-full bg-white rounded-xl shadow-lg border border-[#ad4777] overflow-hidden">
            {/* Header Section */}
            <div className="px-6 py-4 bg-gradient-to-r from-gray-100 to-gray-200 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Danh sách khuyến mãi</h3>
            </div>

            {/* Desktop Table View */}
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
                    {currentPromotions.map((promotion, index) => (
                      <tr
                        key={promotion.stt}
                        className={` bg-gray-100 hover:bg-gray-200 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
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
                            className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${promotion.status === 'Hoạt động'
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : promotion.status === 'Hết hạn'
                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                : 'bg-red-100 text-red-800 border border-red-200'
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
                {currentPromotions.map((promotion) => (
                  <div key={promotion.stt} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                            #{promotion.stt}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${promotion.status === 'Hoạt động'
                              ? 'bg-green-100 text-green-800'
                              : promotion.status === 'Hết hạn'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                              }`}
                          >
                            {promotion.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                          {promotion.promotionType}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Giá trị: <span className="font-medium">{promotion.value}</span>
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
            {filteredPromotions.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m0 0V6a2 2 0 012-2h2.5" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Không có dữ liệu</h3>
                <p className="text-sm text-gray-500">Không tìm thấy khuyến mãi nào phù hợp với bộ lọc.</p>
              </div>
            )}
          </div>
          {/* Pagination - Responsive */}
          {filteredPromotions.length > 0 && (
            <div className="px-4 py-4 border-t border-gray-200">
              {/* Desktop Pagination */}
              <div className="hidden sm:flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-[#ad7555] text-white" : "bg-white"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>

              {/* Mobile Pagination */}
              <div className="flex sm:hidden justify-between items-center">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm border rounded disabled:opacity-50"
                >
                  Prev
                </button>

                <span className="text-sm text-gray-700">
                  {currentPage} / {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-none  p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Thêm khuyến mãi</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-base font-semibold text-black-700 mb-2">Kiểu khuyến mãi</label>
                  <select
                    name="promotionType"
                    value={formData.promotionType}
                    onChange={(e) => {
                      handleInputChange(e);
                      setSelectedType(e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-none  focus:outline-none"
                  >
                    <option value="">-- Chọn loại khuyến mãi --</option>
                    <option value="Theo đơn hàng">Theo đơn hàng</option>
                    <option value="Theo danh mục">Theo danh mục</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-semibold text-black-700 mb-2">Ngày bắt đầu</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-none  focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-black-700 mb-2">Ngày kết thúc</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-none  focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-base font-semibold text-black-700 mb-2">Trạng thái</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-none  focus:outline-none"
                  >
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Không hoạt động">Không hoạt động</option>
                    <option value="Hết hạn">Hết hạn</option>
                  </select>
                </div>

                {renderTypeSpecificFields()}

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-none  hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleAddPromotion}
                    className="px-4 py-2 bg-[#ad7555] text-white rounded-none  border-2 border-[#ad7555] hover:border-2 border-[#ad7555] hover:bg-white hover:text-[#ad7555]"
                  >
                    Thêm mới
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-none  p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Sửa khuyến mãi</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-base font-semibold text-black-700 mb-2">Kiểu khuyến mãi</label>
                  <select
                    name="promotionType"
                    value={formData.promotionType}
                    onChange={(e) => {
                      handleInputChange(e);
                      setSelectedType(e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-none  focus:outline-none"
                  >
                    <option value="">-- Chọn loại khuyến mãi --</option>
                    <option value="Theo đơn hàng">Theo đơn hàng</option>
                    <option value="Theo danh mục">Theo danh mục</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-semibold text-black-700 mb-2">Ngày bắt đầu</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-none  focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-black-700 mb-2">Ngày kết thúc</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-none  focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-base font-semibold text-black-700 mb-2">Trạng thái</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-none  focus:outline-none"
                  >
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Không hoạt động">Không hoạt động</option>
                    <option value="Hết hạn">Hết hạn</option>
                  </select>
                </div>

                {renderTypeSpecificFields()}

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-none  hover:bg-gray-50"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={handleEditPromotion}
                    className="px-4 py-2 bg-[#ad7555] text-white rounded-none  border-2 border-[#ad7555] hover:border-2 border-[#ad7555] hover:bg-white hover:text-[#ad7555]"
                  >
                    Lưu
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Detail Modal */}
        {showDetailModal && currentPromotion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-none  p-6 w-full max-w-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Chi tiết khuyến mãi "{currentPromotion.promotionType}"</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <span className="font-medium">Kiểu khuyến mãi:</span>
                    <p className="text-gray-600">{currentPromotion.promotionType}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Ngày bắt đầu:</span>
                    <p className="text-gray-600">{currentPromotion.startDate}</p>
                  </div>
                  <div>
                    <span className="font-medium">Ngày kết thúc:</span>
                    <p className="text-gray-600">{currentPromotion.endDate}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Giá trị:</span>
                    <p className="text-gray-600">{currentPromotion.value}</p>
                  </div>
                  <div>
                    <span className="font-medium">Trạng thái:</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${currentPromotion.status === 'Hoạt động'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {currentPromotion.status}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-none  hover:bg-gray-50"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layouta>
  );
};

export default Promotion;