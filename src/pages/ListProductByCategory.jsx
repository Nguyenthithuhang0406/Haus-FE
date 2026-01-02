/* eslint-disable*/
import { getProductByCategoryId } from "@/api/product";
import Content from "@/components/listProductByCategory/Content";
import SideBar from "@/components/listProductByCategory/SideBar";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ListProductByCategory = () => {
  const categoryId = useParams().categoryId;
  const [total, setTotal] = useState();
  const [filter, setFilter] = useState({
    pageNum: 1,
    pageSize: 6,
    categoryId: categoryId,
    priceRange: "",
    color: "",
    keyword: "",
    sortBy: "",
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      categoryId: categoryId,
      pageNum: 1,
    }));
  }, [categoryId]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await getProductByCategoryId(filter);
      if (response.status === 200) {
        setProducts(response.data.items);
        setTotal(response.data.pageCustom.totalElement);
      }
    };
    fetchProducts();
  }, [categoryId, filter]);

  return (
    <div className="w-full px-[20px]  md:px-[50px] lg:px-[130px] py-[50px] flex items-start justify-between gap-[50px] mt-[120px]">
      <div className="hidden lg:flex lg:w-[30%] xl:w-[20%]">
        <SideBar filter={filter} setFilter={setFilter} />
      </div>
      <div className="w-full lg:w-[70%] xl:w-[80%]">
        {!products || products.length === 0 ? (
          <p className="text-center bg-[#fbddca] py-[12px]">Không có sản phẩm nào</p>
        ) : (
          <Content
            products={products}
            total={total}
            filter={filter}
            setFilter={setFilter}
          />
        )}
      </div>
    </div>
  );
};

export default ListProductByCategory;
