import React from "react";
import { Trash2 } from "lucide-react";

const WishListHeader = ({ totalItems, onClearAll }) => {
    return (
        <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-gray-200">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Danh sách yêu thích
                </h1>
                <p className="text-gray-600">
                    {totalItems > 0 ? `${totalItems} sản phẩm` : 'Chưa có sản phẩm nào'}
                </p>
            </div>
            
            {totalItems > 0 && (
                <button
                    onClick={onClearAll}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
                >
                    <Trash2 size={18} />
                    <span>Xóa tất cả</span>
                </button>
            )}
        </div>
    );
};

export default WishListHeader;