import React, { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { CiEdit } from "react-icons/ci";
import AddAddressModal from "./AddAddressForm";
import EditAddressForm from "./EditAddressForm";
import { deleteAddress, getAllAddress } from "@/api/address";
import { toast } from "react-toastify";

const DeliveryAddress = ({ onAddressSelect }) => {
  const [user, setUser] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isRefresh, setIsRefresh] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await getAllAddress();
        if (response.status === 200) {
          setUser(response.data);
          if (response.data.length > 0) {
            setSelectedAddress(response.data[0].id);
            onAddressSelect && onAddressSelect(response.data[0]);
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách địa chỉ:", error);
      }
    };
    fetchAddresses();
  }, [showModal, showEditForm, isRefresh]);

  const handleAddressSelect = (addressId) => {
    setSelectedAddress(addressId);
    if (onAddressSelect && user.addresses) {
      const selectedAddress = user.addresses.find(
        (addr) => addr.id === addressId
      );
      onAddressSelect(selectedAddress);
    }
  };

  const handleEditClick = (e, id) => {
    e.stopPropagation();
    setEditingId(id);
    setShowEditForm(true);
  };

  const handleDeleteClick = async (e, id) => {
    e.stopPropagation();

    if (window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      try {
        const response = await deleteAddress(id);
        if (response.status === 204) {
          toast.success("Xóa địa chỉ thành công");
          setEditingId(null);
          setIsRefresh(!isRefresh);
        }
      } catch (error) {
        console.error("Lỗi khi xóa địa chỉ:", error);
      }
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
            {user &&
              user.length > 0 &&
              user.map((addrInfo) => {
                return (
                  <li
                    key={addrInfo.id}
                    className={`p-3 rounded-lg border cursor-pointer relative ${
                      selectedAddress === addrInfo.id
                        ? "border-[#ad7555] bg-[#f9f5f3]"
                        : "border-gray-300"
                    }`}
                    onClick={() => handleAddressSelect(addrInfo.id)}
                  >
                    <div className="absolute top-3 right-3 flex gap-2">
                      <CiEdit
                        size={24}
                        className="text-[#ad7555] hover:text-[#8d5d45] cursor-pointer transition"
                        onClick={(e) => handleEditClick(e, addrInfo.id)}
                      />
                      <Trash2
                        size={20}
                        className="text-[#8d5d45] hover:text-red-700 cursor-pointer transition"
                        onClick={(e) => handleDeleteClick(e, addrInfo.id)}
                      />
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer pr-16">
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress === addrInfo.id}
                        onChange={() => handleAddressSelect(addrInfo.id)}
                        className="mt-1 accent-[#ad7555]"
                      />
                      <div>
                        <h3 className="font-bold">{addrInfo.recipientName}</h3>
                        <p>{addrInfo.phoneNumber}</p>
                        <p>
                          {addrInfo.detailAddress}, {addrInfo.commune},{" "}
                          {addrInfo.district}, {addrInfo.city},{" "}
                          {addrInfo.country}
                        </p>
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

      {showModal && <AddAddressModal onClose={() => setShowModal(false)} />}
      {showEditForm && (
        <EditAddressForm
          addressId={editingId}
          onClose={() => {
            setShowEditForm(false);
            setEditingId(null);
          }}
        />
      )}
    </div>
  );
};

export default DeliveryAddress;
