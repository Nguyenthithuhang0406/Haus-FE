import React, { useState } from "react";
import { FileText } from "lucide-react";
import InvoiceModal from "./InvoiceModal";

const InvoiceButton = () => {
    const [showInvoice, setShowInvoice] = useState(false);

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
                />
            )}
        </>
    );
};

export default InvoiceButton;
