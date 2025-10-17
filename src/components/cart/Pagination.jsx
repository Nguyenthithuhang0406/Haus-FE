import React from "react";

const PaginationComponent = ({ currentPage, totalItems, pageSize, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Trước
      </button>
      
      {[...Array(totalPages)].map((_, idx) => (
        <button
          key={idx + 1}
          onClick={() => onPageChange(idx + 1)}
          className={`px-4 py-2 rounded border ${
            currentPage === idx + 1
              ? 'bg-[#ad7555] text-white'
              : 'hover:bg-gray-50'
          }`}
        >
          {idx + 1}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Sau
      </button>
    </div>
  );
};

export default PaginationComponent;