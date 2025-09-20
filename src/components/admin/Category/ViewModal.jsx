import React, { useState } from "react";
import CategoryForm from "./CategoryForm";

export default function ViewModal({ item, onClose, categories, setCategories, rooms }) {
    const [isEditing, setIsEditing] = useState(false);

    if (isEditing) {
        return (
            <CategoryForm
                editId={item.id}
                categories={categories}
                setCategories={setCategories}
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
                        <b>Mã danh mục:</b> {item.code}
                    </p>
                    <p>
                        <b>Tên danh mục:</b> {item.name}
                    </p>
                    <p>
                        <b>Phòng:</b> {item.room}
                    </p>
                    <p>
                        <b>Mô tả:</b> {item.description}
                    </p>
                </div>

                <div className="flex justify-end mt-6 space-x-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-100 transition shadow-sm"
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
