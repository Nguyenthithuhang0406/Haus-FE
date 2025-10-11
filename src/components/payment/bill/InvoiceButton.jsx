import React, { useState } from "react";
import { FileText } from "lucide-react";
import InvoiceModal from "./InvoiceModal";

const InvoiceButton = () => {
    const [showInvoice, setShowInvoice] = useState(false);

    const invoiceData = {
        storeInfo: {
            name: "HAÜS",
            address: "Nguyên Xá, Bắc Từ Liêm, Hà Nội",
            phone: "+84 123 456 789",
            email: "haus@example.com",
        },
        invoiceNumber: "0000001",
        date: "10/10/2025",
        customer: {
            name: "Nguyễn Văn A",
            address: "123 Trần Phú, Hà Nội",
            phone: "0912345678",
        },
        items: [
            {
                id: 1,
                name: "Ghế có tay vịn BONHOLMEN",
                quantity: 1,
                price: 3500000,
            },
            {
                id: 2,
                name: "Ghế màu đen BONHOLMEN",
                quantity: 2,
                price: 3600000,
            },
        ],
    };

    return (
        <>
            <button
                onClick={() => setShowInvoice(true)}
                className="fixed bottom-6 right-6 bg-[#ad7555] text-white p-4 
                rounded-full shadow-lg hover:bg-[#945f46] transition cursor-pointer"
            >
                <FileText size={24} />
            </button>

            {showInvoice && (
                <InvoiceModal
                    onClose={() => setShowInvoice(false)}
                    invoiceData={invoiceData}
                />
            )}
        </>
    );
};

export default InvoiceButton;
