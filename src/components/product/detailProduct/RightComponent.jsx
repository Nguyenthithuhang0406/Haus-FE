/* eslint-disable*/
import React, { useRef, useState } from "react";
import { FaStar, FaRegStar, FaRegStarHalfStroke } from "react-icons/fa6";
import { CiHeart } from "react-icons/ci";
import { IoIosFlash } from "react-icons/io";
import { flyToCart, formatNumber } from "@/utils/function";
import { ImHeadphones } from "react-icons/im";
import { FiPackage } from "react-icons/fi";
import { FaTruck } from "react-icons/fa";
import { isLoggedIn } from "@/utils/checkLogin";
import { useDispatch, useSelector } from "react-redux";
import { setLocalCart, loadCartQuantity } from "@/store/orderSlice";
import { toast } from "react-toastify";
import { addToCart } from "@/api/cart";
import { useNavigate } from "react-router-dom";
import {
  addFavorite,
  removeFavorite,
  selectIsFavorite,
} from "@/store/favoriteSlice";

const RightComponent = ({
  product,
  setSelectedVariantIndex,
  selectedVariantIndex,
}) => {
  const [count, setCount] = useState(1);
  const [countInCart, setCountInCart] = useState(0);
  const dispatch = useDispatch();
  const addCartBtnRef = useRef(null);
  const navigate = useNavigate();

  const benefits = [
    {
      icon: <ImHeadphones />,
      title: "Giao hàng toàn quốc",
      desc: "Thanh toán (COD) khi nhận hàng",
    },
    {
      icon: <FiPackage />,
      title: "Miễn phí giao hàng",
      desc: "Theo chính sách",
    },
    {
      icon: <FaTruck />,
      title: "Đổi trả trong 7 ngày",
      desc: "Kể từ ngày giao hàng",
    },
  ];

  const quantityOfCart = useSelector((state) => state.order.quantityOfCart);

  // Check favorite từ Redux
  const isFavorite = useSelector((state) =>
    selectIsFavorite(state, product?.id)
  );

  const handleToggleFavorite = async () => {
    if (!product?.id) return;

    try {
      if (isFavorite) {
        await dispatch(removeFavorite(product.id)).unwrap();
        toast.success("Đã xóa khỏi yêu thích");
      } else {
        await dispatch(
          addFavorite({ productId: product.id, product })
        ).unwrap();
        toast.success("Đã thêm vào yêu thích");
      }
    } catch (err) {
      console.error("Favorite Error:", err);
      toast.error("Có lỗi xảy ra khi cập nhật yêu thích");
    }
  };

  const handleAddToCart = async () => {
    if (
      product?.productVariations[selectedVariantIndex]?.inventoryQuantity == 0
    ) {
      toast.error("Sản phẩm đã hết hàng");
      return;
    }
    const imageUrl = product.productVariations[selectedVariantIndex].media?.url;

    if (isLoggedIn()) {
      const data = {
        variantId: product.productVariations[selectedVariantIndex].id,
        quantity: count,
      };
      const response = await addToCart(data);
      if (response.status === 200) {
        flyToCart(imageUrl, addCartBtnRef.current);
        // Cập nhật số lượng giỏ hàng (chỉ đếm số variant, không đếm số lượng)
        dispatch(loadCartQuantity());
        setCountInCart(countInCart + count);
        setTimeout(() => {
          toast.success("Đã thêm vào giỏ hàng");
        }, 1300);
      }
    } else {
      dispatch(
        setLocalCart({
          ...product,
          productVariations: product.productVariations.map(
            (variation, index) => ({
              ...variation,
              isSelected: index === selectedVariantIndex,
              cartQuantity: index === selectedVariantIndex ? count : 0,
            })
          ),
        })
      );
      setCountInCart(countInCart + 1);
      flyToCart(imageUrl, addCartBtnRef.current);
      // Cập nhật số lượng giỏ hàng (chỉ đếm số variant, không đếm số lượng)
      dispatch(loadCartQuantity());
      setTimeout(() => {
        toast.success("Đã thêm vào giỏ hàng");
      }, 1300);
    }
  };

  const handleClickBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };
  return (
    <div data-aos="fade-left" className="w-full flex flex-col gap-[20px]">
      <p className="text-[32px] font-semibold leading-[140%]">
        {product?.productName}
      </p>
      <p className="flex items-center gap-1">
        <span className="flex items-center gap-1 text-[#ffbe00]">
          {Array.from({ length: Math.floor(product?.rating || 0) }, (_, i) => (
            <FaStar key={i} />
          ))}
          {product?.rating % 1 !== 0 && <FaRegStarHalfStroke />}
          {Array.from(
            { length: 5 - Math.ceil(product?.rating || 0) },
            (_, i) => (
              <FaRegStar key={i} />
            )
          )}
        </span>
      </p>
      <p>
        <span className="font-semibold">Tình trạng: </span>
        <span
          className={`${(product?.productVariations[selectedVariantIndex]
              ?.inventoryQuantity || 0) > 0
              ? "text-[#28a745]"
              : "text-red-500"
            }`}
        >
          {(product?.productVariations[selectedVariantIndex]
            ?.inventoryQuantity || 0) > 0
            ? "Còn hàng"
            : "Hết hàng"}
        </span>
      </p>

      <div className="flex gap-8">
        <p className="text-[24px] font-semibold text-[#ff0000]">
          {formatNumber(
            product?.price * (1 - (product?.discountPercent || 0) / 100)
          )}
          đ
        </p>
        {product?.discountPercent > 0 && (
          <p className="text-[18px] text-[#929292] font-medium line-through">
            {formatNumber(product?.price)} đ
          </p>
        )}
      </div>

      <div className="border-t-[1px] border-[#e4e4e4] py-[20px] flex flex-col gap-[20px] lg:flex-row lg:justify-between lg:items-start">
        <div className="w-full lg:w-2/3 flex flex-col gap-[20px]">
          <p className="word-break w-full leading-[140%]">
            {product?.description}
          </p>
          <p className="font-semibold">
            Màu sắc: {product?.productVariations[selectedVariantIndex]?.color}
          </p>
          <p className="font-semibold">
            Chất liệu: {product?.material || "Chưa có thông tin"}
          </p>

          <div className="w-full flex items-center gap-[10px]">
            {product?.productVariations?.map((type, index) => (
              <div
                key={type?.id}
                aria-label={type?.color}
                onClick={() => setSelectedVariantIndex(index)}
                className={`w-[40px] h-[40px] rounded-lg border-[1px] p-[2px] cursor-pointer flex items-center justify-center ${index === selectedVariantIndex
                    ? "border-[#9a542c]"
                    : "border-[#e4e4e4]"
                  }`}
              >
                <img
                  ref={addCartBtnRef}
                  src={type?.media?.url}
                  alt={type?.color}
                  className={`w-full h-full object-cover`}
                // onClick={() => setTypeIndex(index)}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-[20px]">
            <p className="font-semibold">Số lượng:</p>
            <div className="w-[105px] flex border-[1px] border-[#e4e4e4] rounded-lg h-[35px]">
              <button
                className="w-[35px] h-[35px] border-none flex items-center justify-center font-medium"
                onClick={() => setCount((prev) => Math.max(prev - 1, 1))}
              >
                -
              </button>
              <button className="font-medium w-[35px] h-[35px] flex items-center justify-center">
                {count}
              </button>
              <button
                className="w-[35px] h-[35px] border-none flex items-center justify-center font-medium"
                onClick={() => setCount((prev) => prev + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="w-full flex items-center justify-between gap-[10px]">
            <button
              onClick={() => handleAddToCart()}
              className="w-full px-[8px] py-[14px] font-medium text-[#ad7555] border-[1px] border-[#ad7555] rounded-lg bg-transparent hover:text-white hover:bg-[#ad7555]"
            >
              THÊM VÀO GIỎ
            </button>
            <button
              onClick={handleToggleFavorite}
              className={`w-[53px] h-[53px] border-[1px] border-[#ad7555] rounded-lg text-[24px] flex items-center justify-center transition-colors ${isFavorite
                  ? "bg-[#ad7555] text-white"
                  : "text-[#ad7555] bg-transparent hover:text-white hover:bg-[#ad7555]"
                }`}
            >
              <CiHeart className="text-[30px]" />
            </button>
          </div>

          <button
            onClick={handleClickBuyNow}
            className="w-full px-[8px] py-[14px] bg-[#ad7555] text-white font-medium border-[1px] border-[#ad7555] hover:text-[#ad7555] hover:bg-transparent rounded-lg"
          >
            MUA NGAY
          </button>

          <div className="w-full flex items-center break-words">
            <IoIosFlash className="text-[24px] text-[#ad7555] mr-[10px]" />
            <p className="font-medium">
              Đã bán{" "}
              <span className="text-[#ad7555]">
                {product?.productVariations[selectedVariantIndex]
                  ?.soldQuantity || 0}
              </span>{" "}
              sản phẩm.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/3 border-[1px] border-[#e4e4e4] rounded-lg flex flex-col md:flex-row justify-between lg:flex-col px-[20px]">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`py-[20px] flex flex-col gap-[10px] items-center justify-center ${index === 1 ? "lg:border-y lg:border-[#e4e4e4]" : ""
                }`}
            >
              <div className="w-[50px] h-[50px] bg-[#ad7555] rounded-xl text-[24px] text-[#e4e4e4] flex items-center justify-center">
                {benefit.icon}
              </div>
              <div className="font-semibold text-center">{benefit.title}</div>
              <div className="text-[12px] text-[#76809B] text-center">
                {benefit.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightComponent;
