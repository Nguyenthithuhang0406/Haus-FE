import React from "react";
import { Pagination as AntPagination } from "antd";

const PaginationComponent = ({
  currentPage = 1,
  totalItems = 0,
  pageSize = 8,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center items-center mt-12 mb-8">
      <AntPagination
        current={currentPage}
        total={totalItems}
        pageSize={pageSize}
        onChange={onPageChange}
        showSizeChanger={false}
        showQuickJumper={false}
        locale={{
          items_per_page: "/ trang",
          jump_to: "Đến",
          jump_to_confirm: "xác nhận",
          page: "Trang",
          prev_page: "Trang trước",
          next_page: "Trang sau",
          prev_5: "Về 5 trang trước",
          next_5: "Đến 5 trang sau",
          prev_3: "Về 3 trang trước",
          next_3: "Đến 3 trang sau",
        }}
        className="custom-pagination"
      />
    </div>
  );
};

export default PaginationComponent;
