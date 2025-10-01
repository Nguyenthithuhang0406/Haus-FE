import React from "react";
import { Edit, Trash, Eye } from "lucide-react";


export default function ProductRow({ product, setViewItem, setEditId, setShowForm, setDeleteItem }) {
  return (
    <tr className="hover:bg-[#fdf8f5] transition">
      {/* Tên + mã sản phẩm */}
      <td className="p-4 font-medium text-gray-800 min-w-[140px]">
        <div className="flex items-center gap-2 sm:gap-3">
          <img
            src={product.image?.[0] || product.thumbnail || "/no-image.png"}
            alt={product.name || "no-image"}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-cover rounded-lg border border-gray-300"
          />
          <div className="truncate">
            <div className="text-gray-800 font-medium text-sm sm:text-base md:text-base truncate">
              {product.name}
            </div>
            <div className="text-gray-500 text-xs sm:text-sm truncate">
              {product.code}
            </div>
          </div>
        </div>
      </td>

      {/* Mô tả ngắn - hiện từ sm trở lên */}
      <td className="p-4 text-gray-600 hidden sm:table-cell">
        {product.description}
      </td>

      {/* Mô tả chi tiết - hiện từ md trở lên */}
      <td className="p-4 text-gray-600 max-w-xs hidden md:table-cell">
        <div
          className="prose prose-sm max-w-none line-clamp-3 overflow-hidden"
          dangerouslySetInnerHTML={{ __html: product.detailDescription }}
        />
      </td>

      {/* Giá */}
      <td className="p-4 text-gray-600">{product.price?.toLocaleString()}đ</td>

      {/* Số lượng */}
      <td className="p-4 text-gray-600 text-center">{product.stock}</td>

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
            onClick={() => {
              setEditId(product.id);
              setShowForm(true);
            }}
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
