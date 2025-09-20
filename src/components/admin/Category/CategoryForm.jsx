import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ChevronDown } from "lucide-react";
import { CategorySchema } from "@/utils/validation/categoryValidation";
import {
  createCategory,
  getCategoryById,
  updateCategory,
} from "@/api/category";
import { toast } from "react-toastify";
import axios from "axios";

export default function CategoryForm({ editId, rooms, onClose }) {
  const [categories, setCategories] = useState({
    name: "",
    room: rooms[0].id,
    description: "",
  });

  useEffect(() => {
    const fetchCategoryById = async () => {
      if (editId) {
        try {
          const cat = await getCategoryById(editId);
          if (cat.status === 200) {
            setCategories({
              name: cat.data.categoryName,
              room: cat.data.parentId,
              description: cat.data.description || "",
            });

            console.log("ParentId:", cat.data.parentId, "Rooms:", rooms);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchCategoryById();
  }, [editId]);

  const handleEdit = async (values) => {
    try {
      const data = {
        categoryId: editId,
        parentId: values.room,
        categoryName: values.name,
        description: values.description,
      };
      const res = await updateCategory(data);
      if (res.status === 200) {
        toast.success("Cập nhật danh mục thành công");
        onClose();
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

  const handleCreate = async (values) => {
    const data = {
      parentId: values.room,
      categoryName: values.name,
      description: values.description,
    };

    try {
      const res = await createCategory(data);
      if (res.status === 200) {
        toast.success("Thêm danh mục thành công");
        onClose();
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
          default:
            toast.error("Đã xảy ra lỗi, vui lòng kiểm tra lại kết nối!");
        }
      }
      console.log(error);
    }
  };

  const handleSubmit = async (values) => {
    if (editId) {
      await handleEdit(values);
    } else {
      await handleCreate(values);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-[500px] animate-[fadeIn_0.25s_ease]">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          {editId ? "Sửa danh mục" : "Thêm danh mục"}
        </h2>

        <Formik
          initialValues={categories}
          validationSchema={CategorySchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {() => (
            <Form>
              <div className="mb-5">
                <label className="block text-gray-700 font-medium mb-1">
                  Tên danh mục
                </label>
                <Field
                  name="name"
                  placeholder="Nhập tên danh mục"
                  className="border border-gray-300 p-3 w-full rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 shadow-sm transition"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="mb-5">
                <label className="block text-gray-700 font-medium mb-1">
                  Phòng
                </label>
                <div className="relative">
                  <Field
                    as="select"
                    name="room"
                    className="border border-gray-300 p-3 w-full rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 shadow-sm appearance-none pr-10 transition"
                  >
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.categoryName}
                      </option>
                    ))}
                  </Field>
                  <ChevronDown
                    size={20}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  />
                </div>
                <ErrorMessage
                  name="room"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-1">
                  Mô tả
                </label>
                <Field
                  as="textarea"
                  rows={4}
                  name="description"
                  placeholder="Nhập mô tả"
                  className="border border-gray-300 p-3 w-full rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 shadow-sm resize-none transition"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 border rounded-xl hover:bg-gray-100 transition shadow-sm"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#ad7555] text-white rounded-xl shadow-md hover:bg-[#945f46] hover:shadow-lg hover:scale-[1.02] transition"
                >
                  {editId ? "Cập nhật" : "Lưu"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
