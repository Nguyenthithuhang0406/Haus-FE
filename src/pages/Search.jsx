import Layout from "@/components/commons/Layout";
import ProductItem from "@/components/product/ProductItem";
import { Pagination } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const key = useSelector((state) => state.search.keySearch);
  const listProduct = useSelector((state) => state.search.listSearch);
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="w-full mt-[150px] px-[20px]  md:px-[50px] lg:px-[130px]">
        <p
          data-aos="fade-down"
          className="flex items-center mb-[20px] gap-[10px]"
        >
          <span
            className="font-semibold hover:underline cursor-pointer"
            onClick={() => navigate("/")}
          >
            Trang chủ
          </span>
          <span> &gt; </span>
          <span className="text-[#ad7555] font-semibold hover:underline cursor-pointer">
            {key}
          </span>
        </p>

        <p data-aos="fade-down" className="flex items-center gap-2">
          Có {listProduct.length} sản phẩm phù hợp
        </p>

        <div
          data-aos="fade-up"
          className="mt-[50px] grid grid-cols-1 xm:grid-cols-2 sm:grid-cols-3 2xl:grid-cols-4 gap-[30px] w-full justify-items-center"
        >
          {listProduct.map((item) => (
            <ProductItem key={item.id} product={item} />
          ))}
        </div>

        <Pagination
          data-aos="fade-up"
          className="mt-[20px] flex justify-end mb-[50px]"
          total={listProduct.length}
          pageSize={10}
          // onChange={(page, pageSize) => {
          //   // Handle page change
          // }}
        />
      </div>
    </Layout>
  );
};

export default Search;
