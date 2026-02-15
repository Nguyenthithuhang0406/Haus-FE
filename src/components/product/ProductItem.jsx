/* eslint-disable */
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";
import { flyToCart, formatNumber } from "@/utils/function";
import SaleProgressBar from "./SaleProgressBar";
import { isLoggedIn } from "@/utils/checkLogin";
import { useDispatch, useSelector } from "react-redux";
import { setLocalCart, setQuantityOfCart } from "@/store/orderSlice";
import { toast } from "react-toastify";
import { addToCart } from "@/api/cart";
import {
  addFavorite,
  removeFavorite,
  selectIsFavorite,
} from "@/store/favoriteSlice";

const ProductItem = ({ product, onRemoveFavorite }) => {
  const [indexImage, setIndexImage] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const imageRef = useRef(null);

  // Combine medias from both sources (medias array and productVariations)
  const allMedias = useMemo(() => {
    const base = product?.medias || [];
    const variantMedias =
      product?.productVariations?.map((v) => v.media)?.filter(Boolean) || [];
    const all = [...base, ...variantMedias];

    // Remove duplicates based on URL
    const unique = all.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.url === item.url),
    );
    return unique;
  }, [product]);

  // Check favorite từ Redux
  const isFavorite = useSelector((state) =>
    selectIsFavorite(state, product?.id),
  );

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!product?.id) return;

    try {
      if (isFavorite) {
        await dispatch(removeFavorite(product.id)).unwrap();
        onRemoveFavorite?.();
      } else {
        await dispatch(
          addFavorite({ productId: product.id, product }),
        ).unwrap();
      }
    } catch (err) {
      console.error("Favorite Error:", err);
      toast.error("Có lỗi xảy ra khi cập nhật yêu thích");
    }
  };

  const quantityOfCart = useSelector((state) => state.order.quantityOfCart);
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
        dispatch(setQuantityOfCart(quantityOfCart + 1));
        setTimeout(() => {
          toast.success("Đã thêm vào giỏ hàng");
        }, 1300);
      }
    } else {
      dispatch(
        setLocalCart({
          ...product,
          productVariations: [
            {
              ...product.productVariations[0],
              isSelected: true,
              cartQuantity: 1,
            },
          ],
        }),
      );
      flyToCart(imageUrl, imageRef.current);
      dispatch(setQuantityOfCart(quantityOfCart + 1));
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
        onClick={handleLike}
        className={`absolute shadow-lg top-2 right-2 z-10 w-[30px] h-[30px] flex items-center justify-center rounded-lg bg-[#faf5f5] cursor-pointer
          opacity-0 translate-x-6 invisible group-hover:opacity-100 group-hover:translate-x-0 group-hover:visible transition-all duration-300
          ${isFavorite ? "bg-[#ff6347] text-white" : ""}`}
      >
        <FaRegHeart />
      </div>

      {/* Ảnh sản phẩm */}
      <div className="absolute top-0 left-0 w-full h-[184px] lg:h-[185px] xl:h-[245px] overflow-hidden">
        <img
          src={allMedias.length > 0 ? allMedias[indexImage]?.url : ""}
          alt={product?.productName}
          className="w-full h-full object-cover rounded-t-xl transform scale-110 group-hover:scale-100 transition-transform duration-300"
        />
      </div>

      {/* Button thêm giỏ hàng */}
      <div className="w-full flex items-center justify-center absolute top-[140px] lg:top-[140px] xl:top-[200px] left-0">
        <button
          onClick={(e) => {
            (product?.inventoryQuantity || 0) > 0 &&
              (!product?.productVariations ||
                product?.productVariations.length === 1) &&
              handleClickAddToCart(e);
          }}
          className={` w-[70%] z-10 bg-white text-[15px] font-medium px-3 py-2 rounded-xl
          opacity-0 translate-y-6 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300
          hover:bg-[#ad7555] hover:text-white ${
            (product?.inventoryQuantity || 0) === 0
              ? "cursor-not-allowed"
              : "cursor-pointer"
          }`}
        >
          {(product?.inventoryQuantity || 0) === 0
            ? "Hết hàng"
            : product?.productVariations &&
                product?.productVariations.length > 1
              ? "Tùy chọn"
              : "Thêm vào giỏ hàng"}
        </button>
      </div>

      {/* List thumbnail */}
      <div className="absolute top-[190px] lg:top-[190px] xl:top-[250px] w-full px-5 overflow-x-auto overflow-y-hidden z-10 scrollbar-hide">
        <div className="flex gap-2 items-center min-w-min">
          {allMedias.length > 0 &&
            allMedias.map((image, index) => (
              <div
                onMouseEnter={() => setIndexImage(index)}
                key={index}
                className={`w-[30px] h-[30px] rounded-lg overflow-hidden p-[2px] border flex-shrink-0
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
          sold={product?.soldQuantity || 0}
          total={
            (product?.inventoryQuantity || 0) + (product?.soldQuantity || 0)
          }
        />
      </div>

      {/* Giá */}
      <div className="absolute bottom-[20px] w-full px-5 flex flex-col lg:flex-row justify-between lg:items-center text-[15px] font-medium">
        <p className="text-[#ff6347] font-medium">
          {formatNumber(
            product?.price * (1 - (product?.discountPercent ?? 0) / 100),
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
