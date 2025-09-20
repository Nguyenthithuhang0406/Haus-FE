import React from "react";
import { Search, Plus } from "lucide-react";

export default function Toolbar({ search, setSearch, setShowForm, setCurrentPage }) {
    return (
        <div className="flex justify-between items-center mb-6 p-4 border border-gray-200 rounded-2xl shadow-sm bg-white">
            <div className="relative w-1/3">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="pl-9 pr-3 py-2 rounded-xl w-full border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-400 outline-none shadow-sm"
                />
            </div>
            <button
                onClick={() => { setShowForm(true); }}
                className="bg-[#ad7555] hover:bg-[#945f46] text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-md transition"
            >
                <Plus size={18} /> Thêm sản phẩm
            </button>
        </div>
    );
}
