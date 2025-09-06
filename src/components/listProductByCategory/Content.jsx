import { listProduct } from "@/utils/contants/product";
import React from "react";
import ProductItem from "../product/ProductItem";
import { Pagination, Select } from "antd";

const { Option } = Select;

const Content = () => {
  const products = listProduct;
  return (
    <div className="w-full flex flex-col gap-[30px]">
      <div className="w-full flex items-center justify-between">
        <p className="text-[20px] md:text-[30px] font-semibold">Tất cả sản phẩm</p>
        <div className="flex items-center gap-[10px] font-medium">
          <p>Sắp xếp theo</p>
          <Select
            allowClear
            placeholder="Mặc định"
            className="w-[200px] rounded-[8px]"
            popupClassName="rounded-[8px]"
          >
            <Option value="az">A -&gt; Z</Option>
            <Option value="za">Z -&gt; A</Option>
            <Option value="desc">Giá giảm dần</Option>
            <Option value="asc">Giá tăng dần</Option>
            <Option value="new">Hàng mới nhất</Option>
            <Option value="old">Hàng cũ nhất</Option>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 xm:grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 2xl:grid-cols-3 gap-[30px] w-full justify-items-center">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>

      <Pagination defaultCurrent={1} total={50} pageSize={8} />
    </div>
  );
};

export default Content;
