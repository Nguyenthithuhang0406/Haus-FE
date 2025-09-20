import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ChevronDown } from "lucide-react";
import * as Yup from "yup";

const CategorySchema = Yup.object().shape({
    name: Yup.string().required("Tên danh mục không được để trống"),
    room: Yup.string().required("Phòng bắt buộc chọn"),
    description: Yup.string()
        .min(5, "Mô tả ít nhất 5 ký tự")
        .max(100, "Mô tả tối đa 100 ký tự")
        .required("Mô tả không được để trống"),
});

export default function CategoryForm({ editId, categories, setCategories, rooms, onClose }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 px-4">
            <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-md md:max-w-lg animate-[fadeIn_0.25s_ease]">
                <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-800 text-center">
                    {editId ? "Sửa danh mục" : "Thêm danh mục"}
                </h2>

                <Formik
                    initialValues={
                        editId
                            ? categories.find((c) => c.id === editId)
                            : { name: "", room: rooms[0], description: "" }
                    }
                    validationSchema={CategorySchema}
                    onSubmit={(values) => {
                        if (editId) {
                            setCategories(
                                categories.map((c) =>
                                    c.id === editId
                                        ? { ...c, ...values, updatedAt: Date.now() }
                                        : c
                                )
                            );
                        } else {
                            const newItem = { id: Date.now(), ...values, createdAt: Date.now() };
                            setCategories([...categories, newItem]);
                        }
                        onClose();
                    }}
                    enableReinitialize
                >
                    {({ values }) => (
                        <Form>
                            {/* Tên danh mục */}
                            <div className="mb-5">
                                <label className="block text-gray-700 font-medium mb-1">
                                    Tên danh mục
                                </label>
                                <Field
                                    name="name"
                                    placeholder="Nhập tên danh mục"
                                    className="border border-gray-200 p-3 w-full rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-400 outline-none shadow-sm transition text-sm md:text-base"
                                />
                                <ErrorMessage
                                    name="name"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            {/* Phòng */}
                            <div className="mb-5">
                                <label className="block text-gray-700 font-medium mb-1">
                                    Phòng
                                </label>
                                <div className="relative">
                                    <Field
                                        as="select"
                                        name="room"
                                        className="border border-gray-200 p-3 w-full rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-400 outline-none shadow-sm appearance-none pr-10 transition text-sm md:text-base"
                                    >
                                        {rooms.map((r) => (
                                            <option key={r} value={r}>
                                                {r}
                                            </option>
                                        ))}
                                    </Field>
                                    <ChevronDown
                                        size={18}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                                    />
                                </div>
                                <ErrorMessage
                                    name="room"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            {/* Mô tả */}
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-1">
                                    Mô tả
                                </label>
                                <Field
                                    as="textarea"
                                    rows={4}
                                    name="description"
                                    placeholder="Nhập mô tả"
                                    maxLength={100}
                                    className="border border-gray-200 p-3 w-full rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-400 outline-none shadow-sm resize-none transition text-sm md:text-base"
                                />
                                <div className="flex justify-between items-center mt-1">
                                    <ErrorMessage
                                        name="description"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                    <span
                                        className={`text-sm ml-auto ${values.description.length > 90
                                            ? "text-red-500"
                                            : values.description.length > 70
                                                ? "text-yellow-600"
                                                : "text-gray-500"
                                            }`}
                                    >
                                        {values.description.length} / 100
                                    </span>
                                </div>
                            </div>

                            {/* Nút */}
                            <div className="flex flex-col md:flex-row justify-end gap-3 mt-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2.5 border border-gray-400 rounded-xl hover:bg-gray-100 transition shadow-sm text-sm md:text-base"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2.5 bg-[#ad7555] text-white rounded-xl shadow-md hover:bg-[#945f46] hover:shadow-lg hover:scale-[1.02] transition text-sm md:text-base"
                                >
                                    {editId ? "Cập nhật" : "Thêm mới"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
