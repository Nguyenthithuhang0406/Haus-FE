import React, { useState } from "react";

const AddAddressModal = ({ user, onAdd, onClose }) => {
    const [newAddress, setNewAddress] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newAddress.trim()) return;

        onAdd(newAddress.trim());
        setNewAddress("");
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 px-4">
            <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-md md:max-w-lg animate-[fadeIn_0.25s_ease]">
                <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-800 text-center">
                    Thêm địa chỉ mới
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Tên người nhận
                        </label>
                        <input
                            type="text"
                            value={user.name}
                            disabled
                            className="border border-gray-200 p-3 w-full rounded-xl bg-gray-100 text-gray-600 shadow-sm text-sm md:text-base"
                        />
                    </div>


                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Số điện thoại
                        </label>
                        <input
                            type="text"
                            value={user.phoneNumber}
                            disabled
                            className="border border-gray-200 p-3 w-full rounded-xl bg-gray-100 text-gray-600 shadow-sm text-sm md:text-base"
                        />
                    </div>


                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Địa chỉ mới
                        </label>
                        <input
                            type="text"
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                            placeholder="Nhập địa chỉ..."
                            className="border border-gray-200 p-3 w-full rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-400 outline-none shadow-sm text-sm md:text-base transition"
                            required
                        />
                    </div>

                    <div className="flex flex-col md:flex-row justify-end gap-3 mt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 border border-gray-400 rounded-xl hover:bg-gray-100 transition shadow-sm text-sm md:text-base"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2.5 bg-[#ad7555] text-white rounded-xl shadow-md hover:bg-[#945f46] hover:shadow-lg hover:scale-[1.02] transition text-sm md:text-base"
                        >
                            Lưu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAddressModal;
