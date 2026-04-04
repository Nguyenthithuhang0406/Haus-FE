import React, { useState, useEffect } from "react";
import { X, Edit, Trash, PlusCircle } from "lucide-react";
import VariantModal from "./VariantModal";
import ConfirmDeleteVariantModal from "./ConfirmDeleteVariantModal";
import { formatDateTime } from "@/utils/function";
import { getProductById } from "@/api/product";
import axios from "axios";
import { toast } from "react-toastify";
import { deleteVariantById } from "@/api/variant";

export default function ProductViewModal({
  itemId,
  setViewItem,
  setEditId,
  setShowForm,
  setDeleteItem,
  setLoading,
}) {
  const [item, setItem] = useState(null);
  const [variants, setVariants] = useState([]);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [editVariant, setEditVariant] = useState(null);
  const [deleteVariant, setDeleteVariant] = useState(null);

  const fetchProductDetails = async (id) => {
    try {
      const response = await getProductById(id);
      if (response.status === 200) {
        setItem(response.data);
        setVariants(response.data.productVariations || []);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        switch (error.response.status) {
          case 500:
            toast.error("Lỗi hệ thống");
            break;
          case 404:
            toast.error("Không tìm thấy sản phẩm");
            break;
          case 429:
            toast.error("Bạn gửi yêu cầu quá nhiều lần. Vui lòng đợi một chút rồi thử lại.");
            break;

          default:
            toast.error("Đã xảy ra lỗi, vui lòng kiểm tra lại kết nối!");
        }
      }
      console.log(error);
    }
  };
  useEffect(() => {
    fetchProductDetails(itemId);
  }, [itemId, showVariantModal, editVariant, deleteVariant]);

  const handleEditProduct = () => {
    setEditId(item.id);
    setShowForm(true);
    setViewItem(null);
  };

  const handleDeleteVariant = async () => {
    try {
      const response = await deleteVariantById(deleteVariant.id);
      if (response.status === 200) {
        toast.success("Xóa biến thể thành công");
        setDeleteVariant(null);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        switch (error.response.status) {
          case 500:
            toast.error("Lỗi hệ thống");
            break;
          case 404:
            toast.error("Không tìm thấy biến thể");
            break;
          case 429:
            toast.error("Bạn gửi yêu cầu quá nhiều lần. Vui lòng đợi một chút rồi thử lại.");
            break;

          default:
            toast.error("Đã xảy ra lỗi, vui lòng kiểm tra lại kết nối!");
        }
      }
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div
        className="bg-white rounded-2xl shadow-lg 
                  w-full h-full 
                  sm:h-[90vh] 
                  max-w-[95%] sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl 
                  flex flex-col animate-[fadeIn_0.25s_ease] 
                  relative mx-2 sm:mx-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-start p-4 sm:p-6">
          <h2 className="text-lg sm:text-2xl font-semibold text-gray-900">
            Chi tiết sản phẩm "{item?.productName}"
          </h2>
          <button
            onClick={() => setViewItem(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable Content */}
        {item && (
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 space-y-6 sm:space-y-8 pb-4">
            {/* Main product info */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <img
                src={item?.medias[0]?.url}
                alt={item?.productName}
                className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-lg border border-gray-300 mx-auto sm:mx-0"
              />
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <p>
                  <b>Mã sản phẩm:</b> {item?.productCode}
                </p>
                <p>
                  <b>Danh mục:</b> {item?.categoriesName || "Chưa có"}
                </p>
                <p>
                  <b>Cập nhật lần cuối:</b>{" "}
                  {formatDateTime(item?.updatedAt || "") || "—"}
                </p>
                <p>
                  <b>Giá:</b> {item?.price?.toLocaleString()}đ
                </p>
                <p>
                  <b>Chất liệu:</b> {item?.material || "Chưa có"}
                </p>
                <p className="col-span-1 sm:col-span-2 flex items-center gap-2">
                  <b>Trạng thái:</b>
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      item.isDeleted === false
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {item?.isDeleted === false ? "Hiển thị" : "Ẩn"}
                  </span>
                </p>
                <p className="col-span-1 sm:col-span-2">
                  <b>Mô tả ngắn:</b> {item?.description}
                </p>
                <div className="col-span-1 sm:col-span-2">
                  <b>Mô tả chi tiết:</b>
                  <div
                    className="prose max-w-none mt-1 text-sm text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html: item?.detailDescription,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Stock info */}
            <div className="sm:w-1/2">
              <h3 className="text-gray-500 font-medium mb-2">
                Thông tin tồn kho
              </h3>
              <div className="bg-gray-50 border border-gray-300 rounded-xl p-4">
                <div className="flex justify-between text-sm">
                  <span>Sản phẩm tồn kho:</span>
                  <b>{item?.inventoryQuantity} sản phẩm</b>
                </div>
              </div>
            </div>

            {/* Main product row */}
            <div className="overflow-x-auto">
              <h3 className="text-gray-700 font-medium mb-2">
                Thuộc tính sản phẩm
              </h3>
              <table className="w-full border border-gray-300 text-sm min-w-[500px]">
                <thead className="bg-gray-100">
                  <tr className="border border-gray-300">
                    <th className="p-2 border border-gray-300">Ảnh</th>
                    <th className="p-2 border border-gray-300">Tên sản phẩm</th>
                    <th className="p-2 border border-gray-300">Giá</th>
                    <th className="p-2 border border-gray-300">Tồn kho</th>
                    <th className="p-2 border border-gray-300">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    key={item.id}
                    className="text-center border border-gray-300"
                  >
                    <td className="p-2 border border-gray-300">
                      <img
                        src={item?.medias[0]?.url}
                        alt="variant"
                        className="w-12 h-12 object-cover rounded border border-gray-300 mx-auto"
                      />
                    </td>
                    <td className="p-2 border border-gray-300">
                      {item?.productName}
                    </td>
                    <td className="p-2 border border-gray-300">
                      {item?.price?.toLocaleString()}đ
                    </td>
                    <td className="p-2 border border-gray-300">
                      {item?.inventoryQuantity}
                    </td>
                    <td className="p-2 border border-gray-300">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={handleEditProduct}
                          className="text-[#ad7555] hover:text-[#945f46] transition cursor-pointer"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteItem(item)}
                          className="text-red-500 hover:text-red-700 transition cursor-pointer"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Variants */}
            <div className="overflow-x-auto">
              <h3 className="text-gray-700 font-medium">Biến thể sản phẩm</h3>
              <div className="flex justify-end my-2">
                <button
                  onClick={() => setShowVariantModal(true)}
                  className="text-green-800 hover:text-green-950 transition cursor-pointer"
                >
                  <PlusCircle size={22} />
                </button>
              </div>
              <table className="w-full border border-gray-300 text-sm min-w-[500px]">
                <thead className="bg-gray-100">
                  <tr className="border border-gray-300">
                    <th className="p-2 border border-gray-300">Ảnh</th>
                    <th className="p-2 border border-gray-300">Màu sắc</th>
                    <th className="p-2 border border-gray-300">Kích thước</th>
                    <th className="p-2 border border-gray-300">Giá</th>
                    <th className="p-2 border border-gray-300">Tồn kho</th>
                    <th className="p-2 border border-gray-300">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {variants?.length > 0 ? (
                    variants?.map((variant) => (
                      <tr
                        key={variant.id}
                        className="text-center border border-gray-300 hover:bg-gray-50"
                      >
                        <td className="p-2 border border-gray-300">
                          <img
                            src={variant.media?.url}
                            alt="variant"
                            className="w-12 h-12 object-cover rounded border border-gray-300 mx-auto"
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          {variant.color}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {variant.size}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {variant.price?.toLocaleString()}đ
                        </td>
                        <td className="p-2 border border-gray-300">
                          {variant.inventoryQuantity}
                        </td>
                        <td className="p-2 border border-gray-300">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => setEditVariant(variant)}
                              className="text-[#ad7555] hover:text-[#945f46] transition cursor-pointer"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => setDeleteVariant(variant)}
                              className="text-red-500 hover:text-red-700 transition cursor-pointer"
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center p-4 text-gray-500 italic"
                      >
                        Chưa có biến thể nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 p-4 sm:p-6">
          <button
            onClick={() => setViewItem(null)}
            className="px-5 py-2 border border-gray-300 rounded-xl hover:bg-gray-100"
          >
            Đóng
          </button>
          <button
            onClick={handleEditProduct}
            className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-white bg-[#ad7555] hover:bg-[#945f46] transition"
          >
            Sửa sản phẩm
          </button>
        </div>

        {/* Thêm */}
        {showVariantModal && (
          <VariantModal
            setLoading={setLoading}
            onClose={() => setShowVariantModal(false)}
            item={item}
          />
        )}

        {/* Sửa */}
        {editVariant && (
          <VariantModal
            setLoading={setLoading}
            editingVariant={editVariant}
            onClose={() => setEditVariant(null)}
            item={item}
          />
        )}
        {deleteVariant && (
          <ConfirmDeleteVariantModal
            item={deleteVariant}
            onCancel={() => setDeleteVariant(null)}
            onConfirm={handleDeleteVariant}
          />
        )}
      </div>
    </div>
  );
}
