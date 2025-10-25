import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import ProductItem from "../ProductItem";
import { getAllCategory } from "@/api/category";
import { getProductByCategoryId } from "@/api/product";

const SuggestProducts = ({ product }) => {
  const [categoryId, setCategoryId] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchCategoryId = async () => {
      if (
        product &&
        product?.categoriesName &&
        product?.categoriesName.length > 0
      ) {
        const categoryName = product?.categoriesName[0];
        const categories = await getAllCategory({ pageNum: 1, pageSize: 1000 });
        const flatMap = (categories) => {
          let result = [];
          categories.forEach((category) => {
            result.push(category);
            if (category.subCategories && category.subCategories.length > 0) {
              result = result.concat(flatMap(category.subCategories));
            }
          });
          return result;
        };
        const allCategories = flatMap(categories.data.items);
        const matchedCategory = allCategories.find(
          (cat) => cat.categoryName === categoryName
        );

        setCategoryId(matchedCategory ? matchedCategory.id : null);
      }
    };
    fetchCategoryId();
  }, [product]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (categoryId) {
        const response = await getProductByCategoryId({
          categoryId,
          pageNum: 1,
          pageSize: 100,
        });
        if (response.status === 200) {
          setProducts(response.data.items);
        }
      }
    };
    fetchProducts();
  }, [categoryId]);

  // Chia nhóm sản phẩm theo 4 sp/slide
  const chunkSize = 4;
  const chunkedProducts = [];
  for (let i = 0; i < products.length; i += chunkSize) {
    chunkedProducts.push(products.slice(i, i + chunkSize));
  }

  return (
    <div>
      <p className="text-[25px] md:text-[30px] lg:text-[32px] font-semibold text-center">
        Sản phẩm liên quan
      </p>

      <div
        data-aos="fade-up"
        className="w-full flex items-center justify-between gap-4 relative mt-[20px]"
      >
        <Swiper
          slidesPerView={1} // Mỗi slide là 1 grid
          loop={chunkedProducts.length > 1}
          navigation={{
            nextEl: ".next-btn",
            prevEl: ".prev-btn",
          }}
          modules={[Navigation]}
          className="w-full"
        >
          {chunkedProducts.map((group, idx) => (
            <SwiperSlide key={idx}>
              <div
                className="
                justify-items-center
                  grid grid-flow-col gap-6 
                  auto-cols-[100%] sm:auto-cols-[50%] md:auto-cols-[33.333%] xl:auto-cols-[25%]
                "
              >
                {group.map((product, i) => (
                  <ProductItem key={i} product={product} />
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Nút điều hướng */}
        <button className="prev-btn absolute top-1/2 left-0 -translate-y-1/2 z-10 p-2 bg-white shadow rounded">
          <GrFormPrevious className="text-[#ad7555] w-5 h-5" />
        </button>
        <button className="next-btn absolute top-1/2 right-0 -translate-y-1/2 z-10 p-2 bg-white shadow rounded">
          <GrFormNext className="text-[#ad7555] w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SuggestProducts;
