import React, { useState, useRef, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { X } from "lucide-react";
import { dummyData } from "../Category/dataCategory";

// CKEditor
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";


const getPlainTextLength = (html) =>
    html ? html.replace(/<[^>]*>/g, "").trim().length : 0;


const getPlainText = (editor) =>
    editor.getData().replace(/<[^>]*>/g, "").trim();

// Schema có điều kiện
const ProductSchema = (isEdit) =>
    Yup.object().shape({
        name: Yup.string().required("Tên sản phẩm bắt buộc"),
        category: Yup.string().required("Danh mục bắt buộc"),
        shortDesc: Yup.string()
            .required("Mô tả ngắn bắt buộc")
            .max(100, "Mô tả ngắn tối đa 100 ký tự"),
        detailDesc: Yup.string()
            .required("Mô tả chi tiết bắt buộc")
            .test(
                "max-plain-text",
                "Mô tả chi tiết tối đa 2000 ký tự",
                (value) => {
                    if (!value) return false;
                    return getPlainTextLength(value) <= 2000;
                }
            ),
        price: Yup.number()
            .min(1000, "Giá tối thiểu 1000đ")
            .required("Giá bắt buộc"),
        stock: Yup.number()
            .min(0, "Số lượng không âm")
            .required("Số lượng bắt buộc"),
        images: isEdit
            ? Yup.array()
            : Yup.array()
                .min(2, "Cần ít nhất 2 ảnh cho sản phẩm")
                .required("Ảnh bắt buộc"),
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

    // Load ảnh khi sửa
    useEffect(() => {
        if (editId) {
            const product = products.find((p) => p.id === editId);
            if (product?.images) setPreviews(product.images);
        } else {
            setPreviews([]);
        }
    }, [editId, products]);

    // Xóa ảnh
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
                                thumbnail:
                                    previews.length > 0
                                        ? previews[0]
                                        : values.images.length > 0
                                            ? values.images[0]
                                            : "/no-image.png", // fallback ảnh mặc định trong /public
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
                                        className="border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-400 outline-none p-3 rounded-xl w-full"
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
                                        className="border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-400 outline-none p-3 rounded-xl w-full bg-white"
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
                                <Field name="shortDesc">
                                    {({ field, form }) => (
                                        <div>
                                            <textarea
                                                {...field}
                                                rows={2}
                                                maxLength={100}
                                                className="border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-400 outline-none p-3 rounded-xl w-full"
                                            />
                                            <div className="flex items-center justify-between mt-1">
                                                <ErrorMessage
                                                    name="shortDesc"
                                                    component="div"
                                                    className="text-red-500 text-sm"
                                                />
                                                <span
                                                    className={`text-sm ml-auto ${form.values.shortDesc.length >= 100
                                                        ? "text-red-500"
                                                        : form.values.shortDesc.length >= 80
                                                            ? "text-yellow-600"
                                                            : "text-gray-500"
                                                        }`}
                                                >
                                                    {form.values.shortDesc.length} / 100
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </Field>

                                {/* Mô tả chi tiết */}
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
                                        onReady={(editor) => {
                                            const MAX_LENGTH = 2000;

                                            // Chặn gõ quá giới hạn
                                            editor.editing.view.document.on(
                                                "beforeInput",
                                                (evt, data) => {
                                                    const plainText = getPlainText(editor);
                                                    if (
                                                        plainText.length >= MAX_LENGTH &&
                                                        data.inputType !== "deleteContentBackward"
                                                    ) {
                                                        evt.preventDefault();
                                                    }
                                                }
                                            );

                                            // Chặn paste quá dài, chỉ lấy phần còn thiếu
                                            editor.editing.view.document.on("paste", (evt, data) => {
                                                const clipboardText =
                                                    data.dataTransfer.getData("text/plain");
                                                const plainText = getPlainText(editor);
                                                const available = MAX_LENGTH - plainText.length;

                                                if (available <= 0) {
                                                    evt.preventDefault();
                                                    return;
                                                }

                                                if (clipboardText.length > available) {
                                                    evt.preventDefault();
                                                    const allowedText = clipboardText.slice(
                                                        0,
                                                        available
                                                    );
                                                    editor.model.change((writer) => {
                                                        editor.model.insertContent(
                                                            writer.createText(allowedText)
                                                        );
                                                    });
                                                }
                                            });
                                        }}
                                        onChange={(event, editor) => {
                                            // Sync vào Formik
                                            setFieldValue("detailDesc", editor.getData());
                                        }}
                                    />
                                    <div className="flex items-center justify-between mt-1">
                                        <ErrorMessage
                                            name="detailDesc"
                                            component="div"
                                            className="text-red-500 text-sm"
                                        />
                                        <span
                                            className={`text-sm ml-auto ${getPlainTextLength(values.detailDesc) >= 2000
                                                ? "text-red-500"
                                                : getPlainTextLength(values.detailDesc) >= 1600
                                                    ? "text-yellow-600"
                                                    : "text-gray-500"
                                                }`}
                                        >
                                            {getPlainTextLength(values.detailDesc)} / 2000
                                        </span>
                                    </div>
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
                                            className="border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-400 outline-none p-3 rounded-xl w-full"
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
                                            className="border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-400 outline-none p-3 rounded-xl w-full"
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
                                        {!editId && (
                                            <span className="text-red-500">(Tối thiểu 2)</span>
                                        )}
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
                                            className="bg-[#ad7555] hover:bg-[#945f46] text-white px-6 py-2 rounded-lg font-medium "
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
                                <div className="flex flex-col sm:flex-row justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditId(null);
                                            setPreviews([]);
                                        }}
                                        className="px-5 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-100"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 bg-[#ad7555] hover:bg-[#945f46] text-white rounded-xl shadow-md "
                                    >
                                        {editId ? "Cập nhật" : "Thêm mới"}
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
