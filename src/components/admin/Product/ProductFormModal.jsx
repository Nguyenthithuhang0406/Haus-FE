import React, { useState, useRef, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { X } from "lucide-react";
import { dummyData } from "../Category/dataCategory";

// Thêm CKEditor
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// Schema có điều kiện: nếu là thêm mới thì bắt buộc ảnh
const ProductSchema = (isEdit) =>
    Yup.object().shape({
        name: Yup.string().required("Tên sản phẩm bắt buộc"),
        category: Yup.string().required("Danh mục bắt buộc"),
        shortDesc: Yup.string()
            .required("Mô tả ngắn bắt buộc")
            .max(1000, "Mô tả ngắn tối đa 1000 ký tự"),
        detailDesc: Yup.string()
            .required("Mô tả chi tiết bắt buộc")
            .max(2000, "Mô tả chi tiết tối đa 2000 ký tự"),
        price: Yup.number().min(1000, "Giá tối thiểu 1000đ").required("Giá bắt buộc"),
        stock: Yup.number().min(0, "Số lượng không âm").required("Số lượng bắt buộc"),
        images: isEdit
            ? Yup.array() // Khi sửa -> không bắt buộc upload lại
            : Yup.array().min(2, "Cần ít nhất 2 ảnh cho sản phẩm").required("Ảnh bắt buộc"),
    });

export default function ProductFormModal({
    products,
    setProducts,
    editId,
    setEditId,
    setShowForm,
}) {
    const [previews, setPreviews] = useState([]);
    const fileInputRef = useRef(null);

    // Load ảnh sẵn khi sửa
    useEffect(() => {
        if (editId) {
            const product = products.find((p) => p.id === editId);
            if (product?.images) {
                setPreviews(product.images);
            }
        } else {
            setPreviews([]);
        }
    }, [editId, products]);

    // Hàm xóa ảnh
    const removeImage = (idx, setFieldValue) => {
        const newPreviews = previews.filter((_, i) => i !== idx);
        setPreviews(newPreviews);
        setFieldValue("images", newPreviews);
    };

    const defaultValues = {
        code: `SP${String(products.length + 1).padStart(3, "0")}`,
        name: "",
        category: "",
        images: [],
        shortDesc: "",
        detailDesc: "",
        price: "",
        stock: "",
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 p-4">
            <div className="bg-white pl-4 py-4 rounded-3xl shadow-2xl w-full max-w-[650px] max-h-[95vh] overflow-hidden animate-[fadeIn_0.25s_ease]">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
                    {editId ? "Sửa sản phẩm" : "Thêm sản phẩm"}
                </h2>

                {/* Nội dung form */}
                <div className="h-[calc(95vh-80px)] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                    <Formik
                        initialValues={
                            editId
                                ? { ...defaultValues, ...products.find((p) => p.id === editId) }
                                : defaultValues
                        }
                        validationSchema={ProductSchema(!!editId)}
                        onSubmit={(values) => {
                            const finalValues = {
                                ...values,
                                images: previews.length > 0 ? previews : values.images,
                                thumbnail: previews.length > 0 ? previews[0] : values.images[0],
                            };

                            if (editId) {
                                setProducts(
                                    products.map((p) =>
                                        p.id === editId ? { ...p, ...finalValues } : p
                                    )
                                );
                            } else {
                                const newItem = { id: Date.now(), ...finalValues };
                                setProducts([...products, newItem]);
                            }

                            setShowForm(false);
                            setEditId(null);
                            setPreviews([]);
                        }}
                    >
                        {({ setFieldValue, values }) => (
                            <Form className="grid gap-4 pb-3">
                                {/* Tên sản phẩm */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tên sản phẩm
                                    </label>
                                    <Field
                                        name="name"
                                        className="border border-gray-300 p-3 rounded-xl w-full"
                                    />
                                    <ErrorMessage
                                        name="name"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </div>

                                {/* Danh mục */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Danh mục
                                    </label>
                                    <Field
                                        as="select"
                                        name="category"
                                        className="border border-gray-300 p-3 rounded-xl w-full bg-white"
                                    >
                                        <option value="">-- Chọn danh mục --</option>
                                        {dummyData.map((c) => (
                                            <option key={c.id} value={c.name}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage
                                        name="category"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </div>

                                {/* Mô tả ngắn */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Mô tả ngắn
                                    </label>
                                    <Field
                                        as="textarea"
                                        rows={2}
                                        name="shortDesc"
                                        className="border border-gray-300 p-3 rounded-xl w-full"
                                    />
                                    <ErrorMessage
                                        name="shortDesc"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </div>

                                {/* Mô tả chi tiết với CKEditor */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Mô tả chi tiết
                                    </label>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={values.detailDesc}
                                        config={{
                                            toolbar: [
                                                "bold",
                                                "italic",
                                                "underline",
                                                "strikethrough",
                                                "|",
                                                "numberedList",
                                                "bulletedList",
                                                "|",
                                                "alignment",
                                                "link",
                                                "undo",
                                                "redo",
                                            ],
                                        }}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            setFieldValue("detailDesc", data);
                                        }}
                                    />
                                    <ErrorMessage
                                        name="detailDesc"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </div>

                                {/* Giá + số lượng */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Giá
                                        </label>
                                        <Field
                                            name="price"
                                            type="number"
                                            className="border border-gray-300 p-3 rounded-xl w-full"
                                        />
                                        <ErrorMessage
                                            name="price"
                                            component="div"
                                            className="text-red-500 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Số lượng còn
                                        </label>
                                        <Field
                                            name="stock"
                                            type="number"
                                            className="border border-gray-300 p-3 rounded-xl w-full"
                                        />
                                        <ErrorMessage
                                            name="stock"
                                            component="div"
                                            className="text-red-500 text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Upload ảnh */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hình ảnh minh họa sản phẩm{" "}
                                        {!editId && <span className="text-red-500">(Tối thiểu 2)</span>}
                                    </label>

                                    <div
                                        className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-[#ad7555] transition"
                                        onClick={() => fileInputRef.current.click()}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            id="fileUpload"
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files);
                                                const tempPreviews = [];
                                                files.forEach((file) => {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        tempPreviews.push(reader.result);
                                                        if (tempPreviews.length === files.length) {
                                                            const merged = [...previews, ...tempPreviews];
                                                            setPreviews(merged);
                                                            setFieldValue("images", merged);
                                                        }
                                                    };
                                                    reader.readAsDataURL(file);
                                                });
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
                                            className="bg-[#f97316] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#ea580c]"
                                        >
                                            Tải hình ảnh lên
                                        </button>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Hỗ trợ các định dạng: JPG, PNG, WEBP
                                        </p>
                                    </div>

                                    <ErrorMessage
                                        name="images"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />

                                    <div className="flex gap-2 mt-3 flex-wrap">
                                        {previews.map((src, idx) => (
                                            <div key={idx} className="relative group">
                                                <img
                                                    src={src}
                                                    alt={`preview-${idx}`}
                                                    className="w-28 h-28 object-cover rounded-lg border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(idx, setFieldValue)}
                                                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Nút hủy / lưu */}
                                <div className="flex justify-end gap-3 mt-4 sticky bottom-0 bg-white py-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditId(null);
                                            setPreviews([]);
                                        }}
                                        className="px-5 py-2.5 border rounded-xl hover:bg-gray-100"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 bg-[#ad7555] text-white rounded-xl shadow-md hover:bg-[#945f46]"
                                    >
                                        {editId ? "Cập nhật" : "Lưu"}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}
