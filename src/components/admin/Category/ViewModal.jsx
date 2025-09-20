import React, { useEffect, useState } from "react";
import CategoryForm from "./CategoryForm";
import { getCategoryById } from "@/api/category";
import axios from "axios";
import { toast } from "react-toastify";

export default function ViewModal({ item, onClose, rooms }) {
  const [isEditing, setIsEditing] = useState(false);
    const [categoryDetails, setCategoryDetails] = useState(null);
    
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategoryById(item.id);
        if (response.status === 200) {
          setCategoryDetails(response.data);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          switch (error.response.status) {
            case 500:
              toast.error("Lỗi hệ thống");
              break;
            case 404:
              toast.error("Danh mục không tồn tại");
              break;
            default:
              toast.error("Đã xảy ra lỗi, vui lòng kiểm tra lại kết nối!");
          }
        }
        console.log(error);
      }
    };
    fetchCategories();
  }, [item]);

  if (isEditing) {
    return (
      <CategoryForm
        editId={item.id}
        rooms={rooms}
        onClose={() => {
          setIsEditing(false);
          onClose(); // đóng modal sau khi lưu
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-[500px] animate-[fadeIn_0.25s_ease]">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          Chi tiết danh mục
        </h2>

        <div className="space-y-4 text-gray-700">
          <p>
            <b>Mã danh mục:</b> {categoryDetails?.id}
          </p>
          <p>
            <b>Tên danh mục:</b> {categoryDetails?.categoryName}
          </p>
          <p>
            <b>Phòng:</b> {rooms.find((r) => r.id === categoryDetails?.parentId)?.categoryName || "N/A"}
          </p>
          <p>
            <b>Mô tả:</b> {categoryDetails?.description}
          </p>
        </div>

        <div className="flex justify-end mt-6 space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border rounded-xl hover:bg-gray-100 transition shadow-sm"
          >
            Đóng
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="px-5 py-2.5 bg-[#ad7555] hover:bg-[#945f46] text-white rounded-xl transition shadow-sm"
          >
            Sửa danh mục
          </button>
        </div>
      </div>
    </div>
  );
}
