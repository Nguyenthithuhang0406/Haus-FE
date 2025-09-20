import React, { useState, useRef, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { X } from "lucide-react";

// Schema validate
const VariantSchema = Yup.object().shape({
    color: Yup.string().required("Vui lòng chọn màu"),
    price: Yup.number()
        .typeError("Giá phải là số")
        .positive("Giá phải lớn hơn 0")
        .required("Vui lòng nhập giá"),
    stock: Yup.number()
        .typeError("Số lượng phải là số")
        .min(0, "Tồn kho không được âm")
        .required("Vui lòng nhập số lượng"),
    images: Yup.array().min(1, "Cần ít nhất 1 ảnh").required("Ảnh bắt buộc"),
});

const colors = [
    "",
    "Đỏ",
    "Cam",
    "Vàng",
    "Tím",
    "Xanh dương",
    "Xanh da trời",
    "Be",
    "Nâu",
    "Nâu đỏ",
];

export default function VariantModal({ onClose, onAddVariant, editVariant }) {
    const normalizedImages =
        editVariant?.images?.map((img) =>
            typeof img === "string" ? img : img.preview
        ) || [];

    const [previews, setPreviews] = useState(normalizedImages);
    const fileInputRef = useRef(null);

    const removeImage = (idx) => {
        setPreviews((prev) => prev.filter((_, i) => i !== idx));
    };

    useEffect(() => {
        return () => {
            previews.forEach((url) => {
                if (url.startsWith("blob:")) URL.revokeObjectURL(url);
            });
        };
    }, [previews]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-xl shadow-lg w-[400px] p-6">
                <h2 className="text-lg font-semibold mb-4 text-center">
                    {editVariant ? "Sửa biến thể sản phẩm" : "Thêm biến thể sản phẩm"}
                </h2>

                <Formik
                    initialValues={{
                        color: editVariant?.color || "",
                        price: editVariant?.price?.toString() || "",
                        stock: editVariant?.stock?.toString() || "",
                        images: normalizedImages,
                    }}
                    validationSchema={VariantSchema}
                    enableReinitialize
                    onSubmit={(values) => {
                        const finalValues = { ...values, images: previews };
                        if (editVariant) {
                            onAddVariant({ ...editVariant, ...finalValues }); // update
                        } else {
                            onAddVariant({ ...finalValues, id: Date.now() }); // add
                        }
                        onClose();
                    }}
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
                                    name="stock"
                                    placeholder="Nhập số lượng"
                                    className="w-full border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-400 outline-none rounded-lg px-3 py-2"
                                />
                                <ErrorMessage
                                    name="stock"
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
                                        multiple
                                        className="hidden"
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files);
                                            const newPreviews = files.map((file) =>
                                                URL.createObjectURL(file)
                                            );
                                            const merged = [...previews, ...newPreviews];
                                            setPreviews(merged);
                                            setFieldValue("images", merged);
                                        }}
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
                                    {previews.map((url, idx) => (
                                        <div key={idx} className="relative group">
                                            <img
                                                src={url}
                                                alt={`preview-${idx}`}
                                                className="w-28 h-28 object-cover rounded-lg border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
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
                                    {editVariant ? "Cập nhật" : "Thêm mới"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
