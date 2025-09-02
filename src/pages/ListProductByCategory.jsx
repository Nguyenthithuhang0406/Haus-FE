import Layout from "@/components/commons/Layout";
import Content from "@/components/listProductByCategory/Content";
import SideBar from "@/components/listProductByCategory/SideBar";
import React from "react";

const ListProductByCategory = () => {
  return (
    <Layout>
      <div className="w-full px-[20px]  md:px-[50px] lg:px-[130px] py-[50px] flex items-start justify-between gap-[50px] mt-[120px]">
        <div className="hidden lg:flex lg:w-[30%] xl:w-[20%]">
          <SideBar />
        </div>
        <div className="w-full lg:w-[70%] xl:w-[80%]">
          <Content />
        </div>
      </div>
    </Layout>
  );
};

export default ListProductByCategory;
