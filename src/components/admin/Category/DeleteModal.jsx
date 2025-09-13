import React from "react";

export default function DeleteModal({ item, onCancel, onConfirm }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-[380px] animate-[fadeIn_0.2s_ease]">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">
                    Xác nhận xóa
                </h2>
                <p className="text-gray-600 mb-6">
                    Bạn có chắc chắn muốn xóa <b>{item.name}</b> này không?
                </p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-md transition"
                    >
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    );
}
