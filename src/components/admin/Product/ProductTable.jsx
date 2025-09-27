import React from "react";
import ProductRow from "./ProductRow";
import ReactPaginate from "react-paginate";

export default function ProductTable({
    products,
    pageCount,
    changePage,
    setViewItem,
    setEditId,
    setShowForm,
    setDeleteItem,
}) {
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
                        {products.map((p) => (
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
            {pageCount > 1 && (
                <div className="flex justify-end">
                    <ReactPaginate
                        previousLabel={"<"}
                        nextLabel={">"}
                        pageCount={pageCount}
                        onPageChange={changePage}
                        containerClassName="flex justify-center items-center gap-2 mt-6"
                        pageClassName="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                        activeClassName="bg-[#a35a37] text-white border-[#a35a37]"
                        previousClassName="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                        nextClassName="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                        disabledClassName="opacity-40 cursor-not-allowed"
                    />
                </div>
            )}
        </>
    );
}
