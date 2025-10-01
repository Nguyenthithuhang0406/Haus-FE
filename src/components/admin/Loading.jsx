import React from "react";

const Loading = () => {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/50 z-50">
            <div className="w-16 h-16 border-4 border-[#ad7555] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-white text-lg font-semibold animate-pulse">
                Đang xử lý...
            </p>
        </div>
    );
};

export default Loading;
