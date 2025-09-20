import React from "react";

const PromotionForm = ({ selectedType, formData,handleInputChange }) => {

  return (
    <>
      {selectedType === "Theo đơn hàng" ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-semibold text-black-700 mb-2">
                Giá trị đơn hàng tối thiểu{" "}
                <span className="text-red-500 text-base">*</span>
              </label>
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
                <span className="absolute right-3 top-2 text-gray-500">
                  VND
                </span>
              </div>
            </div>
            <div>
              <label className="block text-base font-semibold text-black-700 mb-2">
                Giá trị đơn hàng tối đa{" "}
                <span className="text-red-500 text-base">*</span>
              </label>
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
                <span className="absolute right-3 top-2 text-gray-500">
                  VND
                </span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-base font-semibold text-black-700 mb-2">
              Giá trị khuyến mãi{" "}
              <span className="text-red-500 text-base">*</span>
            </label>
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
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-base font-semibold text-black-700 mb-2">
              Chọn danh mục <span className="text-red-500">*</span>
            </label>
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
            <label className="block text-base font-semibold text-black-700 mb-2">
              Giá trị khuyến mãi{" "}
              <span className="text-red-500 text-base">*</span>
            </label>
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
      )}
    </>
  );
};

export default PromotionForm;
