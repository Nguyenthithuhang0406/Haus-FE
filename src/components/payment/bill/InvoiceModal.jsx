import React from "react";

const InvoiceModal = ({ onClose, invoiceData }) => {
    const { storeInfo, invoiceNumber, date, customer, items } = invoiceData;

    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-[800px] max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-8 relative text-[15px] leading-6">

                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-2xl"
                >
                    ×
                </button>


                <div className="text-start border-b-2 border-dotted border-blue-400 pb-2 mb-2">
                    <h2 className="text-lg font-bold text-[#ad7555] uppercase">
                        {storeInfo.name}
                    </h2>
                    <p>Địa chỉ: {storeInfo.address}</p>
                    <p>Điện thoại: {storeInfo.phone}</p>
                    <p>Điện thoại: {storeInfo.email}</p>
                </div>

                <div className="flex justify-between items-center mb-2">
                    <span></span>
                    <span className="text-red-600 font-bold">Số: {invoiceNumber}</span>
                </div>

                <h1 className="text-center text-xl font-bold text-blue-800 mb-3">
                    HÓA ĐƠN BÁN HÀNG
                </h1>


                <div className="mb-3">
                    <p>
                        <strong>Khách hàng:</strong> {customer.name}
                    </p>
                    <p>
                        <strong>Địa chỉ:</strong> {customer.address}
                    </p>
                    <p>
                        <strong>Điện thoại:</strong> {customer.phone}
                    </p>
                </div>


                <table className="w-full border border-blue-500 border-collapse text-center">
                    <thead>
                        <tr className="bg-blue-100 text-blue-800">
                            <th className="border border-blue-500 p-1 w-[5%]">STT</th>
                            <th className="border border-blue-500 p-1">Tên sản phẩm</th>
                            <th className="border border-blue-500 p-1 w-[15%]">Số lượng</th>
                            <th className="border border-blue-500 p-1 w-[20%]">Đơn giá</th>
                            <th className="border border-blue-500 p-1 w-[20%]">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={item.id}>
                                <td className="border border-blue-500 p-1">{index + 1}</td>
                                <td className="border border-blue-500 p-1 text-left pl-3">
                                    {item.name}
                                </td>
                                <td className="border border-blue-500 p-1">
                                    {item.quantity}
                                </td>
                                <td className="border border-blue-500 p-1">
                                    {item.price.toLocaleString()} đ
                                </td>
                                <td className="border border-blue-500 p-1">
                                    {(item.price * item.quantity).toLocaleString()} đ
                                </td>
                            </tr>
                        ))}

                        {/* Dòng trống để giữ layout như mẫu */}
                        {Array.from({ length: Math.max(0, 13 - items.length) }).map(
                            (_, i) => (
                                <tr key={`empty-${i}`}>
                                    <td className="border border-blue-300 p-1 text-gray-400">
                                        {items.length + i + 1}
                                    </td>
                                    <td className="border border-blue-300 p-1"></td>
                                    <td className="border border-blue-300 p-1"></td>
                                    <td className="border border-blue-300 p-1"></td>
                                    <td className="border border-blue-300 p-1"></td>
                                </tr>
                            )
                        )}


                        <tr className="font-semibold">
                            <td
                                colSpan="4"
                                className="border border-blue-500 p-1 text-right pr-3"
                            >
                                Tổng:
                            </td>
                            <td className="border border-blue-500 p-1 text-red-600">
                                {total.toLocaleString()} đ
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p className="mt-2">
                    <strong>Tổng tiền (bằng chữ):</strong>
                </p>


                <p className="text-right italic mt-2">
                    Ngày {date.split("/")[0]} tháng {date.split("/")[1]} năm{" "}
                    {date.split("/")[2]}
                </p>


                <div className="flex justify-between mt-6 px-6 text-center">
                    <div>
                        <p className="font-semibold">KHÁCH HÀNG</p>
                        <p>(Ký, ghi rõ họ tên)</p>
                    </div>
                    <div>
                        <p className="font-semibold">NV BÁN HÀNG</p>
                        <p>(Ký, ghi rõ họ tên)</p>
                    </div>
                </div>


                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvoiceModal;
