import React, { useState } from "react";
import { X } from "lucide-react";

const OrderEdit = ({ currentOrder, setShowEditModal, onUpdateStatus }) => {
  const [status, setStatus] = useState(currentOrder.status);
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    onUpdateStatus(currentOrder.id, status, note);
    setShowEditModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Cập nhật trạng thái</h2>
          <button
            onClick={() => setShowEditModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Mã đơn hàng
            </label>
            <input
              type="text"
              value={currentOrder.orderCode}
              disabled
              className="w-full px-3 py-2 border border-gray-300 bg-gray-100 text-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Trạng thái <span className="text-red-500">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Đang chờ</option>
              <option value="shipping">Đang giao</option>
              <option value="delivered">Đã giao</option>
              <option value="returned">Bị hoàn</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Ghi chú</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Nhập ghi chú về việc cập nhật (không bắt buộc)"
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-[#ad7555] text-white border-2 border-[#ad7555] hover:bg-white hover:text-[#ad7555]"
            >
              Cập nhật
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderEdit;