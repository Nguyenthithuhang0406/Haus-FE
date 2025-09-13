import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ChevronDown } from "lucide-react";
import * as Yup from "yup";

const CategorySchema = Yup.object().shape({
    name: Yup.string().required("Tên danh mục không được để trống"),
    room: Yup.string().required("Phòng bắt buộc chọn"),
    description: Yup.string()
        .min(5, "Mô tả ít nhất 5 ký tự")
        .required("Mô tả không được để trống"),
});

export default function CategoryForm({ editId, categories, setCategories, rooms, onClose }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-[500px] animate-[fadeIn_0.25s_ease]">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
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
                            // Luôn tạo object mới kể cả khi không thay đổi gì
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
                                            <option key={r} value={r}>
                                                {r}
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
