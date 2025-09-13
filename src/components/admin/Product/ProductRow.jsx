import React from "react";
import { Edit, Trash, Eye } from "lucide-react";

export default function ProductRow({ product, setViewItem, setEditId, setShowForm, setDeleteItem }) {
    return (
        <tr className="hover:bg-[#fdf8f5] transition">
            {/* Tên + mã sản phẩm */}
            <td className="p-4 font-medium text-gray-800">
                <div className="flex items-center gap-3">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg border"
                    />
                    <div>
                        <div className="text-gray-800 font-medium">{product.name}</div>
                        <div className="text-gray-500 text-xs">{product.code}</div>
                    </div>
                </div>
            </td>

            {/* Mô tả ngắn */}
            <td className="p-4 text-gray-600">{product.shortDesc}</td>

            {/* Mô tả chi tiết */}
            <td className="p-4 text-gray-600 max-w-xs">
                <div
                    className="prose prose-sm max-w-none line-clamp-3 overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: product.detailDesc }}
                />
            </td>

            {/* Giá */}
            <td className="p-4 text-gray-600">{product.price.toLocaleString()}đ</td>

            {/* Số lượng */}
            <td className="p-4 text-gray-600">{product.stock}</td>

            {/* Nút thao tác */}
            <td className="p-4 text-center">
                <div className="flex justify-center gap-3">
                    <button
                        onClick={() => setViewItem(product)}
                        className="text-blue-500 hover:text-green-700 transition"
                    >
                        <Eye size={18} />
                    </button>
                    <button
                        onClick={() => { setEditId(product.id); setShowForm(true); }}
                        className="text-[#ad7555] hover:text-[#945f46] transition"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={() => setDeleteItem(product)}
                        className="text-red-500 hover:text-red-700 transition"
                    >
                        <Trash size={18} />
                    </button>
                </div>
            </td>
        </tr>
    );
}
