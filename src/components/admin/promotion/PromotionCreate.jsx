import React, { useState } from "react";
import PromotionForm from "./PromotionForm";
import { X } from "lucide-react";
import { createPromotion } from "@/api/promotion";
import { toast } from "react-toastify";
import axios from "axios";

const PromotionCreate = ({ setShowAddModal }) => {
  const [selectedType, setSelectedType] = useState("");
  const [formData, setFormData] = useState({
    type: "",
    discountPercent: "",
    status: "Hoạt động",
    minPriceOrder: "",
    maxPriceOrder: "",
    categoryId: "",
    startDate: "",
    endDate: "",
  });
  const [errors, setErrors] = useState({}); // lưu lỗi từng field

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // xóa lỗi khi người dùng sửa
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.type) newErrors.type = "Vui lòng chọn kiểu khuyến mãi";
    if (!formData.startDate) newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
    if (!formData.endDate) newErrors.endDate = "Vui lòng chọn ngày kết thúc";

    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.endDate) < new Date(formData.startDate)
    ) {
      newErrors.endDate = "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu";
    }

    if (!formData.discountPercent) {
      newErrors.discountPercent = "Vui lòng nhập % giảm giá";
    } else if (
      Number(formData.discountPercent) <= 0 ||
      Number(formData.discountPercent) > 100
    ) {
      newErrors.discountPercent = "% giảm giá phải từ 1–100";
    }

    if (formData.type === "order") {
      if (!formData.minPriceOrder || Number(formData.minPriceOrder) < 0)
        newErrors.minPriceOrder = "Nhập giá tối thiểu có giá trị dương";
      if (!formData.maxPriceOrder || Number(formData.maxPriceOrder) < 0) {
        newErrors.maxPriceOrder = "Nhập giá tối đa có giá trị dương";
      } else if (
        Number(formData.maxPriceOrder) < Number(formData.minPriceOrder)
      ) {
        newErrors.maxPriceOrder = "Giá tối đa phải ≥ giá tối thiểu";
      }
    }

    if (formData.type === "category" && !formData.categoryId) {
      newErrors.categoryId = "Vui lòng chọn danh mục";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddPromotion = async () => {
    // chỉ thêm dòng validate, không đổi logic còn lại
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại các trường bị lỗi");
      return;
    }

    let data;
    if (formData.type === "order") {
      data = {
        promotionCode: `ORDER${Math.floor(100000 + Math.random() * 900000)}`,
        description: "Khuyến mãi theo đơn hàng",
        type: "order",
        status: "active",
        startDate: formData.startDate,
        endDate: formData.endDate,
        minPriceOrder: formData.minPriceOrder,
        maxPriceOrder: formData.maxPriceOrder,
        discountPercent: formData.discountPercent,
      };
    } else {
      data = {
        promotionCode: `CAT${Math.floor(100000 + Math.random() * 900000)}`,
        description: "Khuyến mãi theo danh mục",
        type: "category",
        status: "active",
        startDate: formData.startDate,
        endDate: formData.endDate,
        categoryId: formData.categoryId,
        discountPercent: formData.discountPercent,
      };
    }

    try {
      const response = await createPromotion(data);
      if (response.status === 200) {
        toast.success("Thêm khuyến mãi thành công");
        setShowAddModal(false);
        setFormData({
          type: "",
          discountPercent: "",
          status: "Hoạt động",
          minPriceOrder: "",
          maxPriceOrder: "",
          categoryId: "",
          startDate: "",
          endDate: "",
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        switch (error.response.status) {
          case 500:
            toast.error("Lỗi hệ thống");
            break;
          case 400:
            toast.error("Dữ liệu không hợp lệ");
            break;
          case 429:
            toast.error(
              "Bạn gửi yêu cầu quá nhiều lần. Vui lòng đợi một chút rồi thử lại.",
            );
            break;

          default:
            toast.error("Đã xảy ra lỗi, vui lòng kiểm tra lại kết nối!");
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-lg">
      <div className="bg-white rounded-lg  p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
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
          {/* Kiểu khuyến mãi */}
          <div>
            <label className="block text-base font-semibold mb-2">
              Kiểu khuyến mãi
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={(e) => {
                handleInputChange(e);
                setSelectedType(e.target.value);
              }}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
            >
              <option value="">-- Chọn loại khuyến mãi --</option>
              <option value="order">Theo đơn hàng</option>
              <option value="category">Theo danh mục</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-sm mt-1">{errors.type}</p>
            )}
          </div>

          {/* Ngày bắt đầu - kết thúc */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-semibold mb-2">
                Ngày bắt đầu
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
              )}
            </div>
            <div>
              <label className="block text-base font-semibold mb-2">
                Ngày kết thúc
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
              />
              {errors.endDate && (
                <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block text-base font-semibold mb-2">
              Trạng thái
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
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
            errors={errors} // nếu PromotionForm cần hiển thị lỗi
          />

          <div className="flex justify-end space-x-4 pt-4">
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              onClick={handleAddPromotion}
              className="px-4 py-2 bg-[#ad7555] text-white border-2 border-[#ad7555] hover:bg-white hover:text-[#ad7555]"
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
