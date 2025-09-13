import React from "react";
import { Eye, Edit, Trash } from "lucide-react";

export default function CategoryTable({ data, onEdit, onDelete, onView }) {
    return (
        <div className="overflow-x-auto border border-gray-200 rounded-2xl shadow-sm">
            <table className="w-full text-left">
                <thead className="bg-gray-100 text-sm font-semibold text-gray-700">
                    <tr>
                        <th className="p-4">TÊN DANH MỤC</th>
                        <th className="p-4">PHÒNG</th>
                        <th className="p-4">MÔ TẢ</th>
                        <th className="p-4 text-center">THAO TÁC</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {data.map((cat) => (
                        <tr key={cat.id} className="hover:bg-[#fdf8f5] transition">
                            <td className="p-4 font-medium text-gray-800">{cat.name}</td>
                            <td className="p-4 text-gray-600">{cat.room}</td>
                            <td className="p-4 text-gray-600">{cat.description}</td>
                            <td className="p-4 text-center">
                                <div className="flex justify-center gap-3">
                                    <button
                                        onClick={() => onView(cat)}
                                        className="text-blue-500 hover:text-sky-700 transition"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button
                                        onClick={() => onEdit(cat)}
                                        className="text-[#ad7555] hover:text-[#945f46] transition"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(cat)}
                                        className="text-red-500 hover:text-red-700 transition"
                                    >
                                        <Trash size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan="4" className="text-center py-6 text-gray-500">
                                Không tìm thấy danh mục
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
