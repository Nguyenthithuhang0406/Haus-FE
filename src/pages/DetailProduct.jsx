import { getProductById } from "@/api/product";
import Loading from "@/components/admin/Loading";
import Layout from "@/components/commons/Layout";
import InformationComponent from "@/components/product/detailProduct/InformationComponent";
import LeftComponent from "@/components/product/detailProduct/LeftComponent";
import RightComponent from "@/components/product/detailProduct/RightComponent";
import SuggestProducts from "@/components/product/detailProduct/SuggestProducts";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DetailProduct = () => {
  const navigate = useNavigate();
  const productId = useParams().id;
  const [productDetail, setProductDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProductById = async () => {
      if (productId) {
        setLoading(true);
        const response = await getProductById(productId);
        if (response.status === 200) {
          setProductDetail(response.data);
          setLoading(false);
          console.log("response:", response);
        }
      }
    };

    fetchProductById();
  }, [productId]);

  return (
    <>
      {loading && <Loading />}
      <Layout>
        <div className="w-full mt-[150px] px-[20px]  md:px-[50px] lg:px-[130px] pb-[50px]">
          <p className="w-full flex items-center py-[20px] gap-[10px] font-medium text-[18px] md:text-[20px]">
            <span
              className="cursor-pointer  hover:underline"
              onClick={() => navigate("/")}
            >
              Trang chủ
            </span>{" "}
            <span>&gt;</span>{" "}
            <span className="text-[#9a542c] cursor-pointer hover:underline">
              {productDetail?.productName}
            </span>
          </p>
          <div className="w-full flex flex-col lg:flex-row gap-10 mb-10">
            <LeftComponent product={productDetail} />
            <RightComponent product={productDetail} />
          </div>
          <div className="w-full">
            <InformationComponent product={productDetail} />
          </div>
          <div className="w-full">
            <SuggestProducts />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default DetailProduct;
