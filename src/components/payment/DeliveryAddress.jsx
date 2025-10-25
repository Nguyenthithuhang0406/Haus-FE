import React, { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { CiEdit } from "react-icons/ci";
import AddAddressModal from "./AddAddressForm";
import EditAddressForm from "./EditAddressForm";

const DeliveryAddress = ({ onAddressSelect }) => {
    const [user, setUser] = useState({
        id: 1,
        addresses: [
            {
                name: "Nguyễn Văn A",
                phoneNumber: "0363933921",
                address: "ngõ 112/7, Nguyên Xá, Minh Khai, Bắc Từ Liêm, Hà Nội"
            }
        ],
    });

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    useEffect(() => {
        if (user.addresses.length > 0 && !selectedAddress) {
            const firstAddressId = `${user.id}-0`;
            setSelectedAddress(firstAddressId);
            onAddressSelect && onAddressSelect(user.addresses[0]);
        }
    }, []);
    const handleAddressSelect = (addressId, idx) => {
        setSelectedAddress(addressId);
        if (onAddressSelect && user.addresses[idx]) {
            onAddressSelect(user.addresses[idx]);
        }
    };
    const handleAddAddress = (addressInfo) => {
        setUser((prev) => ({
            ...prev,
            addresses: [...prev.addresses, addressInfo],
        }));
    };

    const handleEditClick = (e, idx) => {
        e.stopPropagation();
        setEditingIndex(idx);
        setShowEditForm(true);
    };

    const handleUpdateAddress = (updatedAddress) => {
        setUser((prev) => {
            const newAddresses = prev.addresses.map((addr, idx) =>
                idx === editingIndex ? updatedAddress : addr
            );
            if (selectedAddress === `${prev.id}-${editingIndex}`) {
                onAddressSelect && onAddressSelect(updatedAddress);
            }

            return {
                ...prev,
                addresses: newAddresses
            };
        });
    };
    const handleDeleteClick = (e, idx) => {
        e.stopPropagation();

        if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
            const wasSelected = selectedAddress === `${user.id}-${idx}`;

            setUser((prev) => {
                const newAddresses = prev.addresses.filter((_, i) => i !== idx);

                if (wasSelected && newAddresses.length > 0) {
                    const firstAddressId = `${prev.id}-0`;
                    setSelectedAddress(firstAddressId);
                    onAddressSelect && onAddressSelect(newAddresses[0]);
                } else if (newAddresses.length === 0) {
                    setSelectedAddress(null);
                    onAddressSelect && onAddressSelect(null);
                }

                return {
                    ...prev,
                    addresses: newAddresses
                };
            });
        }
    };
    return (
        <div className="max-w-[600px] w-full">
            <h2 className="mb-3 text-[#ad7555] text-[22px] font-semibold">
                Địa chỉ nhận hàng
            </h2>
            <div className="p-5 rounded-lg border border-gray-200 shadow-lg">
                <div className="max-h-25 overflow-y-auto pr-2">
                    <ul className="space-y-3">
                        {user.addresses.map((addrInfo, idx) => {
                            const addressId = `${user.id}-${idx}`;
                            return (
                                <li
                                    key={addressId}
                                    className={`p-3 rounded-lg border cursor-pointer relative ${selectedAddress === addressId
                                            ? "border-[#ad7555] bg-[#f9f5f3]"
                                            : "border-gray-300"
                                        }`}
                                    onClick={() => handleAddressSelect(addressId, idx)}
                                >

                                    <div className="absolute top-3 right-3 flex gap-2">
                                        <CiEdit
                                            size={24}
                                            className="text-[#ad7555] hover:text-[#8d5d45] cursor-pointer transition"
                                            onClick={(e) => handleEditClick(e, idx)}
                                        />
                                        <Trash2
                                            size={20}
                                            className="text-[#8d5d45] hover:text-red-700 cursor-pointer transition"
                                            onClick={(e) => handleDeleteClick(e, idx)}
                                        />
                                    </div>

                                    <label className="flex items-center gap-3 cursor-pointer pr-16">
                                        <input
                                            type="radio"
                                            name="address"
                                            checked={selectedAddress === addressId}
                                            onChange={() => handleAddressSelect(addressId, idx)}
                                            className="mt-1 accent-[#ad7555]"
                                        />
                                        <div>
                                            <h3 className="font-bold">{addrInfo.name}</h3>
                                            <p>{addrInfo.phoneNumber}</p>
                                            <p>{addrInfo.address}</p>
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
            {showEditForm && (
                <EditAddressForm
                    addressData={user.addresses[editingIndex]}
                    onUpdate={handleUpdateAddress}
                    onClose={() => {
                        setShowEditForm(false);
                        setEditingIndex(null);
                    }}
                />
            )}
        </div>
    );
};

export default DeliveryAddress;