import React, { useState } from "react";
import PromotionForm from "./PromotionForm";
import { X } from "lucide-react";

const PromotionCreate = ({ setShowAddModal }) => {
  const [selectedType, setSelectedType] = useState("");
  const [formData, setFormData] = useState({
    promotionType: "",
    value: "",
    status: "Hoạt động",
    priceStart: "",
    priceEnd: "",
    category: "",
    startdate: "",
    enddate: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddPromotion = () => {
    //api
    setShowAddModal(false);
    setFormData({
      promotionType: "",

      value: "",
      status: "Hoạt động",
      priceStart: "",
      priceEnd: "",
      category: "",
      startdate: "",
      enddate: "",
    });
  };
  return (
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
            <label className="block text-base font-semibold text-black-700 mb-2">
              Kiểu khuyến mãi
            </label>
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
              <label className="block text-base font-semibold text-black-700 mb-2">
                Ngày bắt đầu
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-none  focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-black-700 mb-2">
                Ngày kết thúc
              </label>
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
            <label className="block text-base font-semibold text-black-700 mb-2">
              Trạng thái
            </label>
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

          <PromotionForm
            selectedType={selectedType}
            formData={formData}
            handleInputChange={handleInputChange}
          />

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
  );
};

export default PromotionCreate;
