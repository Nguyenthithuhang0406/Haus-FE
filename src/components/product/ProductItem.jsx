/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";
import { flyToCart, formatNumber } from "@/utils/function";
import SaleProgressBar from "./SaleProgressBar";
import { isLoggedIn } from "@/utils/checkLogin";
import { useDispatch } from "react-redux";
import { setLocalCart } from "@/store/orderSlice";
import { toast } from "react-toastify";
import { addToCart } from "@/api/cart";

const ProductItem = ({ product }) => {
  const [indexImage, setIndexImage] = useState(0);
  const navigate = useNavigate();
  const [isFetching, setIsFetching] = useState(false);
  const [likeProducts, setLikeProducts] = useState(
    JSON.parse(localStorage.getItem("likeProducts")) || []
  );

  const dispatch = useDispatch();
  const imageRef = useRef(null);

  useEffect(() => {
    setLikeProducts(JSON.parse(localStorage.getItem("likeProducts")) || []);
  }, [isFetching]);

  const isLiked = (product) => {
    return likeProducts.some((item) => item?.id === product?.id);
  };

  const handleLike = (product) => {
    setIsFetching(!isFetching);
    const isLike = isLiked(product);
    if (isLike) {
      const updatedLikeProducts = likeProducts.filter(
        (item) => item.id !== product.id
      );
      localStorage.setItem("likeProducts", JSON.stringify(updatedLikeProducts));
    } else {
      likeProducts.push(product);
      localStorage.setItem("likeProducts", JSON.stringify(likeProducts));
    }
  };

  const handleClickAddToCart = async (e) => {
    e.stopPropagation();
    const imageUrl = product.productVariations[0].media?.url;

    if (isLoggedIn()) {
      const data = {
        variantId: product.productVariations[0].id,
        quantity: 1,
      };
      const response = await addToCart(data);
      if (response.status === 200) {
        flyToCart(imageUrl, imageRef.current);
        setTimeout(() => {
          toast.success("Đã thêm vào giỏ hàng");
        }, 1300);
      }
    } else {
      dispatch(setLocalCart([{ ...product, quantity: 1 }]));
      flyToCart(imageUrl, imageRef.current);
      setTimeout(() => {
        toast.success("Đã thêm vào giỏ hàng");
      }, 1300);
    }
  };

  return (
    <div
      onClick={() => navigate(`/detailProduct/${product?.id}`)}
      className="relative w-[200px] h-[350px] lg:w-[260px] lg:h-[370px] xl:w-[300px] xl:h-[400px] bg-white rounded-xl shadow cursor-pointer overflow-hidden group transition-all duration-300"
    >
      {/* Giảm giá */}
      {product?.discountPercent ? (
        <button className="absolute top-2 left-2 z-10 bg-[#ad7555] text-white text-[15px] px-2 py-1 rounded-lg">
          - {product?.discountPercent}%
        </button>
      ) : null}

      {/* Nút yêu thích */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute shadow-lg top-2 right-2 z-10 w-[30px] h-[30px] flex items-center justify-center rounded-lg bg-[#faf5f5] cursor-pointer
          opacity-0 translate-x-6 invisible group-hover:opacity-100 group-hover:translate-x-0 group-hover:visible transition-all duration-300
          ${isLiked(product) ? "bg-[#ff6347] text-white" : ""}`}
      >
        <FaRegHeart onClick={() => handleLike(product)} />
      </div>

      {/* Ảnh sản phẩm */}
      <div className="absolute top-0 left-0 w-full h-[184px] lg:h-[185px] xl:h-[245px] overflow-hidden">
        <img
          src={product?.medias ? product?.medias[indexImage]?.url : ""}
          alt={product?.productName}
          className="w-full h-full object-cover rounded-t-xl transform scale-110 group-hover:scale-100 transition-transform duration-300"
        />
      </div>

      {/* Button thêm giỏ hàng */}
      <div className="w-full flex items-center justify-center absolute top-[140px] lg:top-[140px] xl:top-[200px] left-0">
        <button
          onClick={(e) => {
            product?.soldQuantity !== product?.inventoryQuantity &&
              (!product?.productVariations ||
                product?.productVariations.length === 1) &&
              handleClickAddToCart(e);
          }}
          className={` w-[70%] z-10 bg-white text-[15px] font-medium px-3 py-2 rounded-xl
          opacity-0 translate-y-6 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300
          hover:bg-[#ad7555] hover:text-white ${
            product?.soldQuantity === product?.inventoryQuantity
              ? "cursor-not-allowed"
              : "cursor-pointer"
          }`}
        >
          {product?.soldQuantity === product?.inventoryQuantity
            ? "Hết hàng"
            : product?.productVariations &&
              product?.productVariations.length > 1
            ? "Tùy chọn"
            : "Thêm vào giỏ hàng"}
        </button>
      </div>

      {/* List thumbnail */}
      <div className="absolute top-[190px] lg:top-[190px] xl:top-[250px] flex gap-2 px-5 items-center z-10">
        {product?.medias &&
          product?.medias.map((image, index) => (
            <div
              onMouseEnter={() => setIndexImage(index)}
              key={index}
              className={`w-[30px] h-[30px] rounded-lg overflow-hidden p-[2px] border 
              ${
                index === indexImage
                  ? "border-[#ad7555] shadow-md z-10"
                  : "border-gray-300"
              }`}
            >
              <img
                ref={imageRef}
                src={image?.url}
                alt={product?.productName}
                className="w-full h-full rounded-full"
              />
            </div>
          ))}
      </div>

      {/* Tên sản phẩm */}
      <p
        className="absolute top-[220px] lg:top-[220px] xl:top-[280px] px-5 text-[15px] font-medium line-clamp-2"
        title={product?.productName}
      >
        {product?.productName}
      </p>

      {/* Đã bán */}
      <div className="absolute hidden lg:block bottom-[50px] w-full px-5">
        <SaleProgressBar
          sold={product?.sell || 0}
          total={product?.inventoryQuantity}
        />
      </div>

      {/* Giá */}
      <div className="absolute bottom-[20px] w-full px-5 flex flex-col lg:flex-row justify-between lg:items-center text-[15px] font-medium">
        <p className="text-[#ff6347] font-medium">
          {formatNumber(
            product?.price * (1 - (product?.discountPercent ?? 0) / 100)
          )}
          đ
        </p>
        {product?.discountPercent > 0 && (
          <p className="line-through text-gray-400">
            {formatNumber(product?.price)} đ
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductItem;
