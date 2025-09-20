import React from "react";
import ProductRow from "./ProductRow";

export default function ProductTable({
    products,
    currentPage,
    totalPages,
    setCurrentPage,
    setViewItem,
    setEditId,
    setShowForm,
    setDeleteItem
}) {
    const renderPagination = () => {
        let pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push("...");
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (currentPage < totalPages - 2) pages.push("...");
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <>
            <div className="overflow-x-auto border border-gray-200 rounded-2xl shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 text-sm font-semibold text-gray-700">
                        <tr>
                            <th className="p-4">TÊN SẢN PHẨM</th>
                            <th className="p-4 hidden sm:table-cell">MÔ TẢ NGẮN</th>
                            <th className="p-4 hidden md:table-cell">MÔ TẢ CHI TIẾT</th>
                            <th className="p-4">GIÁ</th>
                            <th className="p-4 text-center">SỐ LƯỢNG CÒN</th>
                            <th className="p-4 text-center">THAO TÁC</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map(p => (
                            <ProductRow
                                key={p.id}
                                product={p}
                                setViewItem={setViewItem}
                                setEditId={setEditId}
                                setShowForm={setShowForm}
                                setDeleteItem={setDeleteItem}
                            />
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-6 text-gray-500">
                                    Không tìm thấy sản phẩm
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
                <p>
                    Trang <b>{currentPage}</b> / <b>{totalPages || 1}</b>
                </p>
                <div className="flex gap-2 items-center">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className={`px-3 py-1.5 rounded-xl border shadow-sm transition ${currentPage === 1 ? "text-gray-400 bg-gray-100 cursor-not-allowed" : "hover:bg-gray-100"}`}
                    >
                        &lt;
                    </button>
                    {renderPagination().map((page, idx) =>
                        page === "..." ? (
                            <span key={idx} className="px-3 py-1 text-gray-400">...</span>
                        ) : (
                            <button
                                key={idx}
                                onClick={() => setCurrentPage(page)}
                                className={`px-4 py-1.5 rounded-xl border shadow-sm transition ${currentPage === page ? "bg-[#ad7555] text-white border-[#ad7555] shadow-md" : "hover:bg-gray-100"}`}
                            >
                                {page}
                            </button>
                        )
                    )}
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1.5 rounded-xl border shadow-sm transition ${currentPage === totalPages ? "text-gray-400 bg-gray-100 cursor-not-allowed" : "hover:bg-gray-100"}`}
                    >
                        &gt;
                    </button>
                </div>
            </div>
        </>
    );
}
