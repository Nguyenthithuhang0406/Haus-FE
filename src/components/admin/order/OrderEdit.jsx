import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";

const OrderEdit = ({ currentOrder, setShowEditModal, onUpdateStatus }) => {
  const [status, setStatus] = useState(currentOrder.status);
  const [note, setNote] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const getStatusLabel = (statusValue) => {
    const labels = {
      pending: "Đang chờ",
      shipping: "Đang giao",
      delivered: "Đã giao",
      returned: "Bị hoàn"
    };
    return labels[statusValue] || statusValue;
  };

  const handleSubmitClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmUpdate = () => {
    onUpdateStatus(currentOrder.id, status, note);
    setShowConfirm(false);
    setShowEditModal(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Cập nhật trạng thái</h2>
            <button
              onClick={() => setShowEditModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Mã đơn hàng
              </label>
              <input
                type="text"
                value={currentOrder.orderCode}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Trạng thái <span className="text-red-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pending">Đang chờ</option>
                <option value="shipping">Đang giao</option>
                <option value="delivered">Đã giao</option>
                <option value="returned">Bị hoàn</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Ghi chú</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Nhập ghi chú về việc cập nhật (không bắt buộc)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-5 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitClick}
                className="px-5 py-2 bg-[#ad7555] text-white border-2 border-[#ad7555] rounded-lg hover:bg-white hover:text-[#ad7555] transition-colors font-medium"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Popup */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md animate-fadeIn">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                <AlertCircle size={24} className="text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Xác nhận cập nhật
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng này?
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-medium">Mã đơn hàng:</span>
                <span className="text-gray-900 font-semibold">{currentOrder.orderCode}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-medium">Trạng thái mới:</span>
                <span className="text-blue-600 font-semibold">{getStatusLabel(status)}</span>
              </div>
              {note && (
                <div className="pt-2 border-t border-gray-200">
                  <span className="text-gray-600 font-medium text-sm">Ghi chú:</span>
                  <p className="text-gray-900 text-sm mt-1">{note}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-5 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmUpdate}
                className="px-5 py-2 bg-[#ad7555] text-white rounded-lg hover:bg-[#8d5f45] transition-colors font-medium shadow-md"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderEdit;