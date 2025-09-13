import React from "react";
import { X } from "lucide-react";

export default function ProductViewModal({ item, setViewItem, setEditId, setShowForm }) {
    const handleEdit = () => {
        setEditId(item.id);      // chọn sản phẩm để sửa
        setShowForm(true);       // mở form sửa
        setViewItem(null);       // đóng modal xem chi tiết
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-2xl shadow-lg w-[650px] h-[90vh] flex flex-col animate-[fadeIn_0.25s_ease] relative">

                {/* Header */}
                <div className="flex justify-between items-start p-6">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Chi tiết sản phẩm "{item.name}"
                    </h2>
                    <button
                        onClick={() => setViewItem(null)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Main content */}
                    <div className="flex gap-6">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-40 h-40 object-cover rounded-lg border"
                        />

                        <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                            <p><b>Mã sản phẩm:</b> {item.code}</p>
                            <p><b>Danh mục:</b> {item.category || "Chưa có"}</p>
                            <p><b>Cập nhật lần cuối:</b> {item.updatedAt || "—"}</p>
                            <p><b>Giá:</b> {item.price?.toLocaleString()}đ</p>

                            {/* Mô tả ngắn */}
                            <p className="col-span-2">
                                <b>Mô tả ngắn:</b> {item.shortDesc}
                            </p>
                            {/* Mô tả chi tiết */}
                            <div className="col-span-2">
                                <b>Mô tả chi tiết:</b>
                                <div
                                    className="prose max-w-none mt-1 text-sm text-gray-700"
                                    dangerouslySetInnerHTML={{ __html: item.detailDesc }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stock Info */}
                    <div>
                        <h3 className="text-gray-700 font-medium mb-2">Thông tin tồn kho</h3>
                        <div className="bg-gray-50 border rounded-xl p-4">
                            <p className="text-sm">
                                <b>Sản phẩm tồn kho:</b> {item.stock} sản phẩm
                            </p>
                        </div>
                    </div>

                    {/* Product Variants */}
                    {item.variants && item.variants.length > 0 && (
                        <div>
                            <h3 className="text-gray-700 font-medium mb-2">Thuộc tính sản phẩm</h3>
                            <table className="w-full border text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2 border">Ảnh</th>
                                        <th className="p-2 border">Thuộc tính</th>
                                        <th className="p-2 border">Giá</th>
                                        <th className="p-2 border">Tồn kho</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {item.variants.map((v, idx) => (
                                        <tr key={idx} className="text-center">
                                            <td className="p-2 border">
                                                <img
                                                    src={v.image}
                                                    alt="variant"
                                                    className="w-12 h-12 object-cover rounded border mx-auto"
                                                />
                                            </td>
                                            <td className="p-2 border">{v.attrs}</td>
                                            <td className="p-2 border">{v.price.toLocaleString()}đ</td>
                                            <td className="p-2 border">{v.stock}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6">
                    <button
                        onClick={() => setViewItem(null)}
                        className="px-5 py-2 border rounded-xl hover:bg-gray-100"
                    >
                        Đóng
                    </button>
                    <button
                        onClick={handleEdit}
                        className="px-5 py-2 rounded-xl bg-[#ad7555] hover:bg-[#945f46] text-white"
                    >
                        Sửa sản phẩm
                    </button>
                </div>
            </div>
        </div>
    );
}
