import React, { useState } from "react";
import { Plus } from "lucide-react";
import AddAddressModal from "./AddAddressForm";

const DeliveryAddress = () => {
    const [user, setUser] = useState({
        id: 1,
        name: "Nguyễn Văn A",
        phoneNumber: "0363933921",
        addresses: [
            "ngõ 112/7, Nguyên Xá, Minh Khai, Bắc Từ Liêm, Hà Nội",
            // "123 Trần Duy Hưng, Cầu Giấy, Hà Nội",
        ],
    });

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleAddAddress = (addr) => {
        setUser((prev) => ({
            ...prev,
            addresses: [...prev.addresses, addr],
        }));
    };

    return (
        <div className="max-w-[600px] w-full">
            <h2 className="mb-3 text-[#ad7555] text-[22px] font-semibold">
                Địa chỉ nhận hàng
            </h2>
            <div className="p-5 rounded-lg border border-gray-200 shadow-lg">
                <div className="max-h-25 overflow-y-auto pr-2">
                    <ul className="space-y-3">
                        {user.addresses.map((addr, idx) => {
                            const addressId = `${user.id}-${idx}`;
                            return (
                                <li
                                    key={addressId}
                                    className={`p-3 rounded-lg border cursor-pointer ${selectedAddress === addressId
                                        ? "border-[#ad7555] bg-[#f9f5f3]"
                                        : "border-gray-300"
                                        }`}
                                    onClick={() => setSelectedAddress(addressId)}
                                >
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="address"
                                            checked={selectedAddress === addressId}
                                            onChange={() => setSelectedAddress(addressId)}
                                            className="mt-1 accent-[#ad7555]"
                                        />
                                        <div>
                                            <h3 className="font-bold">{user.name}</h3>
                                            <p>{user.phoneNumber}</p>
                                            <p>{addr}</p>
                                        </div>
                                    </label>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div
                    className="flex gap-3 items-center mt-5 cursor-pointer"
                    onClick={() => setShowModal(true)}
                >
                    <Plus
                        size={30}
                        className="border border-[#ad7555] rounded-[50%] text-[#ad7555]"
                    />
                    <p className="text-[#ad7555] font-semibold">Thêm địa chỉ mới</p>
                </div>
            </div>



            {showModal && (
                <AddAddressModal
                    user={user}
                    onAdd={handleAddAddress}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default DeliveryAddress;
