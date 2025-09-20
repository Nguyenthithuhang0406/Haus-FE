/* eslint-disable*/
import { getAllPromotions } from "@/api/promotion";
import FillterPromotion from "@/components/admin/promotion/FillterPromotion";
import ListPromotion from "@/components/admin/promotion/ListPromotion";
import Pagination from "@/components/admin/promotion/Pagination";
import PromotionCreate from "@/components/admin/promotion/PromotionCreate";
import PromotionDetail from "@/components/admin/promotion/PromotionDetail";
import PromotionEdit from "@/components/admin/promotion/PromotionEdit";
import { ListPromotions } from "@/utils/contants/promotion";
import React, { useEffect, useState } from "react";

const Promotion = () => {
  const [promotions, setPromotions] = useState(ListPromotions || []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(promotions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPromotions = promotions.slice(startIndex, endIndex);

  const [filters, setFilters] = useState({
    stt: "",
    promotionType: "",
    startDate: "",
    endDate: "",
    value: "",
    status: "",
  });

  useEffect(() => {
    const fetchPromotions = async () => {
      const response = await getAllPromotions();
      if (response.status === 200) {
        setPromotions(response.data);
      }
    };
    fetchPromotions();
  }, [filters]);
  
  const openEditModal = (promotion) => {
    setCurrentPromotion(promotion);
    setShowEditModal(true);
  };

  const openDetailModal = (promotion) => {
    setCurrentPromotion(promotion);
    setShowDetailModal(true);
  };

  const handleDeletePromotion = (stt) => {
    setPromotions(promotions.filter((promo) => promo.stt !== stt));
    // Reset to first page if current page becomes empty
    const newFilteredPromotions = promotions.filter(
      (promo) => promo.stt !== stt
    );
    const newTotalPages = Math.ceil(
      newFilteredPromotions.length / itemsPerPage
    );
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };
  return (
    <div>
      <FillterPromotion
        setShowAddModal={setShowAddModal}
        setCurrentPage={setCurrentPage}
        filteredCount={promotions.length}
        filters={filters}
        setFilters={setFilters}
      />

      <ListPromotion
        promotions={promotions}
        openDetailModal={openDetailModal}
        openEditModal={openEditModal}
        handleDeletePromotion={handleDeletePromotion}
      />

      <Pagination
        promotions={promotions}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        // onPageChange={setCurrentPage}
      />

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
    </div>
  );
};

export default Promotion;
