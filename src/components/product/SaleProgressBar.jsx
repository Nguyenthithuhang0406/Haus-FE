import React from "react";

const SaleProgressBar = ({ sold, total }) => {
  const safeTotal = total > 0 ? total : 1;
  const safeSold = Math.min(sold, safeTotal);

  return (
    <div className="w-full relative">
      {/* Thanh progress với hiệu ứng kẻ chéo chạy */}
      <progress
        className="sale-progress w-full h-4"
        value={safeSold}
        max={safeTotal}
      />

      {/* Text nằm trên progress bar */}
      <span className="absolute inset-0 flex items-center gap-[3px] justify-center text-[12px] text-black">
        <span className="font-semibold">{sold}</span> sản phẩm đã bán
      </span>
    </div>
  );
};

export default SaleProgressBar;
