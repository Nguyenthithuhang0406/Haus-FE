import React, { useState } from "react";
import PromotionForm from "./PromotionForm";
import { X } from "lucide-react";
import { updatePromotion } from "@/api/promotion";
import { toast } from "react-toastify";
import axios from "axios";

const PromotionEdit = ({ setShowEditModal, currentPromotion }) => {
  const [selectedType, setSelectedType] = useState(
    currentPromotion.type
  );
  const [formData, setFormData] = useState(currentPromotion);
  const [errors, setErrors] = useState({}); // lưu lỗi từng field

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear lỗi khi sửa
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
      if (!formData.minPriceOrder|| Number(formData.minPriceOrder)<0) newErrors.minPriceOrder = "Nhập giá tối thiểu có giá trị dương";
      if (!formData.maxPriceOrder||Number(formData.maxPriceOrder)<0) {
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

 
  const handleEditPromotion = async () => {
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại các trường bị lỗi");
      return;
    }

    let data;
    if (formData.type === "order") {
      data = {
        promotionId: formData.id,
        promotionCode: formData.promotionCode,
        description: formData.description,
        type: "order",
        status: formData.status,
        startDate: formData.startDate,
        endDate: formData.endDate,
        minPriceOrder: formData.minPriceOrder,
        maxPriceOrder: formData.maxPriceOrder,
        discountPercent: formData.discountPercent,
      };
    } else {
      data = {
        promotionId: formData.id,
        promotionCode: formData.promotionCode,
        description: formData.description,
        type: "category",
        status: formData.status,
        startDate: formData.startDate,
        endDate: formData.endDate,
        categoryId: formData.categoryId,
        discountPercent: formData.discountPercent,
      };
    }

    try {
      const response = await updatePromotion(data);
      if (response.status === 200) {
        toast.success("Cập nhật khuyến mãi thành công");
        setShowEditModal(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        switch (error.response.status) {
          case 500:
            toast.error("Lỗi hệ thống");
            break;
          case 400:
          case 404:
            toast.error("Không tìm thấy khuyến mãi");
            break;
          default:
            toast.error("Đã xảy ra lỗi, vui lòng kiểm tra lại kết nối!");
        }
      }
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
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

          {/* Ngày */}
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
            <label className="block text-base font-semibold mb-2">Trạng thái</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
              <option value="expired">Hết hạn</option>
            </select>
          </div>

          {/* Form con */}
          <PromotionForm
            selectedType={selectedType}
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors} // truyền lỗi xuống nếu PromotionForm cần hiển thị
          />

          <div className="flex justify-end space-x-4 pt-4">
            <button
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 hover:bg-gray-50"
            >
              Đóng
            </button>
            <button
              onClick={handleEditPromotion}
              className="px-4 py-2 bg-[#ad7555] text-white border-2 border-[#ad7555] hover:bg-white hover:text-[#ad7555]"
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionEdit;
