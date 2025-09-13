import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, setCurrentPage, totalItems, currentItems }) {
    const getPaginationRange = () => {
        if (totalPages <= 4) return Array.from({ length: totalPages }, (_, i) => i + 1);

        if (currentPage <= 2) return [1, 2, 3, "...", totalPages];
        if (currentPage >= totalPages - 1) return [1, "...", totalPages - 2, totalPages - 1, totalPages];

        return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
    };

    return (
        <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
            <p>
                Hiển thị <b>{currentItems}</b> / <b>{totalItems}</b> danh mục
            </p>
            <div className="flex gap-2 items-center">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-xl border shadow-sm transition ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                >
                    <ChevronLeft size={18} />
                </button>

                {getPaginationRange().map((page, idx) =>
                    page === "..." ? (
                        <span key={`dots-${idx}`} className="px-2 text-gray-500">
                            ...
                        </span>
                    ) : (
                        <button
                            key={`page-${page}`}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-1.5 rounded-xl border shadow-sm transition ${currentPage === page
                                ? "bg-[#ad7555] text-white border-[#ad7555] shadow-md"
                                : "hover:bg-gray-100"
                                }`}
                        >
                            {page}
                        </button>
                    )
                )}

                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-xl border shadow-sm transition ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
}
