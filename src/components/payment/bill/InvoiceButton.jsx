import React from "react";
import { FileText } from "lucide-react";
import { getInvoicePdf } from "@/api/order";
import { message } from "antd";

const InvoiceButton = ({ orderId }) => {

    const handleDownloadInvoice = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await getInvoicePdf(orderId, token);


            const fileURL = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = fileURL;
            link.setAttribute("download", `invoice_order_${orderId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            if (error?.response?.status === 404) {
                message.error("Đơn hàng không tồn tại hoặc không thể xuất hoá đơn!");
            } else {
                message.error("Lỗi khi tải hoá đơn!");
            }
        }
    };

    return (
        <button
            onClick={handleDownloadInvoice}
            className="fixed bottom-6 right-8 bg-[#ad7555] text-white p-4 
            rounded-full shadow-lg hover:bg-[#945f46] transition cursor-pointer"
        >
            <FileText size={24} />
        </button>
    );
};

export default InvoiceButton;
