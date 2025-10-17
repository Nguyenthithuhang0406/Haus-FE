/* eslint-disable*/
import { deletePromotion, getAllPromotions } from "@/api/promotion";
import DeleteModal from "@/components/admin/Category/DeleteModal";
import FillterPromotion from "@/components/admin/promotion/FillterPromotion";
import ListPromotion from "@/components/admin/promotion/ListPromotion";
import { Pagination } from "antd";
import PromotionCreate from "@/components/admin/promotion/PromotionCreate";
import PromotionDetail from "@/components/admin/promotion/PromotionDetail";
import PromotionEdit from "@/components/admin/promotion/PromotionEdit";
import { ListPromotions } from "@/utils/contants/promotion";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Promotion = () => {
  const [promotions, setPromotions] = useState(ListPromotions || []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState(null);
  const [isAsc, setIsAsc] = useState(true); 
  const [deleteItem, setDeleteItem] = useState({
    isShowConfirm: false,
    id: null,
  });
  const [totalPagi, setTotalPagi] = useState({
    totalPages: 1,
    totalElements: 1,
  });

  const [filters, setFilters] = useState({
    pageNum: 1,
    pageSize: 5,
    stt: "",
    promotionType: "",
    startDate: "",
    endDate: "",
    value: "",
    status: "",
    sortByPrice: "asc",
  });

  useEffect(() => {
    const fetchPromotions = async () => {
      const data = {
        type:
          filters.promotionType === "Theo đơn hàng"
            ? "order"
            : filters.promotionType === "Theo danh mục"
              ? "category"
              : "",
        status:
          filters.status === "Hoạt động"
            ? "active"
            : filters.status === "Hết hạn"
              ? "expired"
              : filters.status === "Không hoạt động"
                ? "inactive"
                : "",
        startDate: filters.startDate || "",
        endDate: filters.endDate || "",
        pageNum: filters.pageNum || 1,
        pageSize: filters.pageSize || 5,
        sortByPrice: filters.sortByPrice || "asc",
      };
      const response = await getAllPromotions(data);
      if (response.status === 200) {
        setPromotions(response.data.items || []);
        setTotalPagi({
          totalPages: response.data.pageCustom.totalPages,
          totalElements: response.data.pageCustom.totalElement,
        });
      }
    };
    fetchPromotions();
  }, [filters, showAddModal, showEditModal, showDetailModal, deleteItem]);

  const openEditModal = (promotion) => {
    setCurrentPromotion(promotion);
    setShowEditModal(true);
  };

  const openDetailModal = (promotion) => {
    setCurrentPromotion(promotion);
    setShowDetailModal(true);
  };

  const handleDeletePromotion = async (id) => {
    try {
      const response = await deletePromotion(id);
      if ((response.status === 200)) {
        toast.success("Xóa khuyến mãi thành công!");
        setDeleteItem({ isShowConfirm: false, id: null });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        switch (error.response.status) {
          case 500:
            toast.error("Lỗi hệ thống");
            break;
          case 400:
            toast.error("Không tìm thấy khuyến mãi");
            break;
          default:
            toast.error("Đã xảy ra lỗi, vui lòng kiểm tra lại kết nối!");
        }
      }
      console.log(error);
    }
  };

  return (
    <div>
      <FillterPromotion
        setShowAddModal={setShowAddModal}
        setCurrentPage={(num) =>
          setFilters((prev) => ({
            ...prev,
            pageNum: num,
          }))
        }
        filteredCount={totalPagi.totalElements}
        filters={filters}
        setFilters={setFilters}
        isAsc={isAsc}
        setIsAsc={setIsAsc}
      />
 <div className="max-w-full mx-auto px-8 pb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
     
      <ListPromotion
        promotions={promotions}
        openDetailModal={openDetailModal}
        openEditModal={openEditModal}
        handleDeletePromotion={(id) =>
          setDeleteItem({ isShowConfirm: true, id })
        }
        pageNum={filters.pageNum}
        pageSize={filters.pageSize}
      />
       {totalPagi.totalElements > 0 && (
        <div className="flex justify-end my-8">
          <Pagination
            current={filters.pageNum}
            pageSize={filters.pageSize}
            total={totalPagi.totalElements}
            showSizeChanger={false}
            showQuickJumper={false}
            
            onChange={(page) =>
              setFilters(prev => ({
                ...prev,
                pageNum: Number(page)
              }))
            }
          />
        </div>
      )}
</div>
</div>
      {showAddModal && <PromotionCreate setShowAddModal={setShowAddModal} />}

      {showEditModal && (
        <PromotionEdit
          setShowEditModal={setShowEditModal}
          currentPromotion={currentPromotion}
        />
      )}
      {showDetailModal && (
        <PromotionDetail
          setShowDetailModal={setShowDetailModal}
          currentPromotion={currentPromotion}
        />
      )}

      {deleteItem.isShowConfirm && (
        <DeleteModal
          item={{ name: `Khuyến mãi ${deleteItem.id}` }}
          onCancel={() => setDeleteItem({ isShowConfirm: false, id: null })}
          onConfirm={() => handleDeletePromotion(deleteItem.id)}

        />
      )}
    </div>


  );
};

export default Promotion;
