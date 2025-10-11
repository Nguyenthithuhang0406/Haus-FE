import React from "react";
import { Heart } from "lucide-react";

const EmptyWishList = ({ onNavigate }) => {

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <div className="w-32 h-32 mb-6 bg-[#f9f5f3] rounded-full flex items-center justify-center">
                <Heart size={64} className="text-[#ad7555]" strokeWidth={1.5} />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 text-center">
                Danh sách yêu thích trống
            </h2>
            
            <p className="text-gray-600 text-center mb-8 max-w-md">
                Bạn chưa có sản phẩm yêu thích nào. Hãy khám phá và thêm những sản phẩm bạn thích vào danh sách!
            </p>
            
            <button
                onClick={() => onNavigate && onNavigate("/")}
                className="bg-[#ad7555] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#945f46] transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
            >
                Khám phá sản phẩm
            </button>
        </div>
    );
};

export default EmptyWishList;