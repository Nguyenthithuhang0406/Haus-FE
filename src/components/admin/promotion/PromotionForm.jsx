import { getAllCategoryChildren } from "@/api/category";
import React, { useEffect, useState } from "react";

const PromotionForm = ({ selectedType, formData, handleInputChange }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategoryChildren();
        if (response.status === 200) {
          setCategories(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

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
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.categoryName}
                </option>
              ))}
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
