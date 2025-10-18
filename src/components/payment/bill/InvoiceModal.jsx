import React from "react";

const InvoiceModal = ({ onClose }) => {
    return (

        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">

            <div className="bg-white rounded-2xl shadow-2xl w-[60%] h-[75vh] relative p-6 flex flex-col animate-fadeIn">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-6 text-gray-500 hover:text-black text-2xl font-bold cursor-pointer"
                >
                    ✖
                </button>


                <h2 className="text-2xl font-semibold mb-4 text-center text-[#ad7555]">
                    Hóa đơn mua hàng
                </h2>

                // phan de hien thi file pdf
                <div className="flex-1 border border-gray-300 rounded-lg overflow-hidden shadow-inner">
                    <iframe
                        src="/sample-invoice.pdf"
                        title="Invoice PDF"
                        width="100%"
                        height="100%"
                        className="rounded"
                    />
                </div>


                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 transition cursor-pointer"
                    >
                        Đóng
                    </button>
                    <button
                        className="px-4 py-2 bg-[#ad7555] hover:bg-[#945f46] text-white rounded-md transition cursor-pointer"
                    >
                        Tải PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvoiceModal;
