import React, { useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { X } from "lucide-react";
import { VariantSchema } from "@/utils/validation/variationValidation";
import { createVariant, editVariant } from "@/api/variant";
import { toast } from "react-toastify";
import axios from "axios";

const colors = [
  "Kem",
  "Nâu",
  "Hồng",
  "Đen",
  "Cam",
  "Vàng",
  "Xanh dương",
  "Đỏ",
  "Xanh lá cây",
  "Tím,",
];

const sizes = ["Nhỏ", "Trung bình", "Lớn"];

export default function VariantModal({
  onClose,
  item,
  editingVariant,
  setLoading,
}) {
  const normalizedImages = editingVariant?.media?.url;

  const [previews, setPreviews] = useState(normalizedImages);
  const fileInputRef = useRef(null);

  const removeImage = (setFieldValue) => {
    setPreviews(null);
    setFieldValue("images", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviews(previewUrl);
      setFieldValue("images", file);
    }
  };

  const handleAddVariant = async (data) => {
    setLoading(true);
    try {
      const response = await createVariant(data);
      if (response.status === 201) {
        toast.success("Thêm biến thể thành công");
        onClose();
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        switch (error.response.status) {
          case 500:
            toast.error("Lỗi hệ thống");
            break;
          case 400:
            toast.error("Dữ liệu không hợp lệ!");
            break;
          case 404:
            toast.error("Thêm biến thể thất bại, vui lòng thử lại!");
            break;
          default:
            toast.error("Đã xảy ra lỗi, vui lòng kiểm tra lại kết nối!");
        }
      }
      console.log(error);
    }
    setLoading(false);
  };

  const handleEditVariant = async (data) => {
    setLoading(true);
    try {
      const response = await editVariant(data);
      if (response.status === 200) {
        toast.success("Sửa biến thể thành công");
        onClose();
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        switch (error.response.status) {
          case 500:
            toast.error("Lỗi hệ thống");
            break;
          case 400:
            toast.error("Dữ liệu không hợp lệ!");
            break;
          case 404:
            toast.error("Thêm biến thể thất bại, vui lòng thử lại!");
            break;
          default:
            toast.error("Đã xảy ra lỗi, vui lòng kiểm tra lại kết nối!");
        }
      }
      console.log(error);
    }
    setLoading(false);
  };

  const handleSubmit = async (values) => {
    const data = {
      imageFile: values.images instanceof File ? values.images : null,
      color: values.color,
      size: values.size,
      price: parseFloat(values.price),
      inventoryQuantity: parseInt(values.inventoryQuantity, 10),
      ...(!editingVariant && { productId: item.id }),
      ...(editingVariant && { id: editingVariant.id }),
    };

    if (editingVariant) {
      await handleEditVariant(data);
    } else {
      await handleAddVariant(data);
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-xl shadow-lg w-[400px] p-6">
        <h2 className="text-lg font-semibold mb-4 text-center">
          {editingVariant ? "Sửa biến thể sản phẩm" : "Thêm biến thể sản phẩm"}
        </h2>

        <Formik
          initialValues={{
            color: editingVariant?.color || "",
            size: editingVariant?.size || "",
            price: editingVariant?.price?.toString() || "",
            inventoryQuantity:
              editingVariant?.inventoryQuantity?.toString() || "",
            images: normalizedImages,
          }}
          validationSchema={VariantSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form className="space-y-4">
              {/* Màu sắc */}
              <div>
                <label className="block mb-1 font-medium">Màu sắc</label>
                <Field
                  as="select"
                  name="color"
                  className="w-full border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-400 outline-none rounded-lg px-3 py-2"
                >
                  <option value="">-- Chọn màu --</option>
                  {colors.slice(1).map((c, idx) => (
                    <option key={idx} value={c}>
                      {c}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="color"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Kích thước */}
              <div>
                <label className="block mb-1 font-medium">Kích thước</label>
                <Field
                  as="select"
                  name="size"
                  className="w-full border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-400 outline-none rounded-lg px-3 py-2"
                >
                  <option value="">-- Chọn kích thước --</option>
                  {sizes.map((s, idx) => (
                    <option key={idx} value={s}>
                      {s}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="size"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Giá */}
              <div>
                <label className="block mb-1 font-medium">Giá</label>
                <Field
                  type="number"
                  name="price"
                  placeholder="Nhập giá"
                  className="w-full border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-400 outline-none rounded-lg px-3 py-2"
                />
                <ErrorMessage
                  name="price"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Tồn kho */}
              <div>
                <label className="block mb-1 font-medium">Tồn kho</label>
                <Field
                  type="number"
                  name="inventoryQuantity"
                  placeholder="Nhập số lượng"
                  className="w-full border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-400 outline-none rounded-lg px-3 py-2"
                />
                <ErrorMessage
                  name="inventoryQuantity"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Upload ảnh */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Ảnh biến thể <span className="text-red-500">*</span>
                </label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-[#ad7555]"
                  onClick={() => fileInputRef.current.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, setFieldValue)}
                  />
                  <p className="text-gray-600 mb-2">
                    Kéo thả hoặc nhấn chọn để tải hình ảnh
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current.click();
                    }}
                    className="bg-[#ad7555] hover:bg-[#945f46] text-white px-6 py-2 rounded-lg font-medium"
                  >
                    Tải hình ảnh lên
                  </button>
                </div>

                <ErrorMessage
                  name="images"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />

                <div className="flex gap-2 mt-3 flex-wrap">
                  {previews && (
                    <div key={previews} className="relative group">
                      <img
                        src={previews}
                        alt={`preview`}
                        className="w-28 h-28 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(setFieldValue)}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Nút hành động */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-200 border-gray-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#ad7555] hover:bg-[#945f46] text-white"
                >
                  {editingVariant ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
