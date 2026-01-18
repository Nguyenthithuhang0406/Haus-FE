/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Menu from "./Menu";

import { FiSearch } from "react-icons/fi";
import { MdFlipCameraIos, MdOutlineAccountCircle } from "react-icons/md";
import { AiOutlineHeart } from "react-icons/ai";
import { GrCart } from "react-icons/gr";
import Logo from "@/assets/icons/Logo";
import { removeAllCookies } from "@/utils/cookies";
import { clearAccessToken } from "@/utils/tokenMemory";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setKeySearch } from "@/store/searchSlice";
import { isLoggedIn } from "@/utils/checkLogin";
import { loadCartQuantity, clearLocalCart } from "@/store/orderSlice";

const Header = () => {
  const [inputText, setInputText] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [isLogin, setIsLogin] = useState(isLoggedIn());
  const childRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    function handleClickOutside(event) {
      if (childRef.current && !childRef.current.contains(event.target)) {
        setIsShow(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [childRef]);

  // Cập nhật isLogin khi location thay đổi hoặc khi token được refresh
  useEffect(() => {
    setIsLogin(isLoggedIn());
  }, [location.pathname]);

  // Check lại isLogin định kỳ để detect khi token được refresh
  useEffect(() => {
    const interval = setInterval(() => {
      const currentLoginStatus = isLoggedIn();
      setIsLogin((prev) => {
        // Chỉ update nếu thay đổi để tránh re-render không cần thiết
        if (prev !== currentLoginStatus) {
          return currentLoginStatus;
        }
        return prev;
      });
    }, 2000); // Check mỗi 2 giây

    return () => clearInterval(interval);
  }, []);

  const handleKeyPress = async (e) => {
    if (e.key === "Enter") {
      dispatch(setKeySearch(inputText));
      navigate("/search");
    }
  };

  const handleLogout = () => {
    removeAllCookies();
    clearAccessToken();
    setIsLogin(false);
    // Load số lượng giỏ hàng từ local cart sau khi đăng xuất
    dispatch(loadCartQuantity());
    toast.success("Đăng xuất thành công!");
    navigate("/");
  };

  useEffect(() => {
    // Load số lượng giỏ hàng khi component mount
    dispatch(loadCartQuantity());
  }, [dispatch]);

  const quantityOfProducts = useSelector((state) => state.order.quantityOfCart);
  return (
    <div
      className={`w-full ${
        location.pathname === "/"
          ? "bg-[#0a0400] bg-opacity-30"
          : "bg-[#885e45]"
      } px-[20px]  md:px-[50px] lg:px-[130px] py-[20px] shadow-md absolute z-10`}
    >
      <div className="flex items-center justify-between mb-[11px] flex-wrap gap-4">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="w-[100px] h-[50px] text-[50px] cursor-pointer flex items-center justify-start"
        >
          <Logo />
        </div>

        {/* Search */}
        <div className="relative w-3/5 lg:w-2/5 max-w-lg h-[50px] flex items-center">
          <button className="absolute left-[10px] top-[10px] h-[30px] w-[30px] rounded-full border-none bg-[#ad7555] text-[#efefef] flex items-center justify-center hover:bg-[#9a542c] z-10">
            <FiSearch className="w-[18px] h-[18px]" />
          </button>
          <input
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            value={inputText}
            type="text"
            placeholder="Tìm kiếm sản phẩm"
            className="absolute h-full w-full rounded-[20px] border-none bg-[#f5f3f3] outline-none px-[50px]"
          />
        </div>

        {/* Icons */}
        <div className="hidden lg:flex items-center gap-4 relative">
          <div
            onClick={() => navigate(`/wishlist`)}
            className="flex flex-col items-center cursor-pointer text-[#efefef] hover:text-[#9a542c]"
          >
            <AiOutlineHeart className="w-[30px] h-[30px]" />
            <p className="text-[15px]">Yêu thích</p>
          </div>
          <div
            onClick={() => setIsShow(!isShow)}
            className="flex flex-col items-center cursor-pointer text-[#efefef] hover:text-[#9a542c] relative"
          >
            <MdOutlineAccountCircle className="w-[30px] h-[30px]" />
            <p className="text-[15px]">Tài khoản</p>
            {isShow && !isLogin && (
              <div
                ref={childRef}
                className="absolute top-[60px] text-black left-1/3 bg-[#f3f2f2] rounded-lg w-[150px] shadow z-10"
              >
                <p
                  onClick={() => navigate("/auth")}
                  className="px-5 py-2 rounded-lg text-[15px] hover:bg-[#fdfbfb] hover:text-[#9a542c] cursor-pointer"
                >
                  Đăng ký
                </p>
                <p
                  onClick={() => navigate("/auth")}
                  className="px-5 py-2 rounded-lg text-[15px] hover:bg-[#fdfbfb] hover:text-[#9a542c] cursor-pointer"
                >
                  Đăng nhập
                </p>
              </div>
            )}
            {isShow && isLogin && (
              <div
                ref={childRef}
                className="absolute text-black rounded-lg top-[60px] left-1/3 bg-[#f3f2f2] w-[150px] shadow z-10"
              >
                <p
                  onClick={() => navigate("/view-infor")}
                  className="px-5 rounded-lg py-2 text-[15px] hover:bg-[#fdfbfb] hover:text-[#9a542c] cursor-pointer"
                >
                  Trang cá nhân
                </p>
                <p
                  onClick={handleLogout}
                  className="px-5 rounded-lg py-2 text-[15px] hover:bg-[#fdfbfb] hover:text-[#9a542c] cursor-pointer"
                >
                  Đăng xuất
                </p>
              </div>
            )}
          </div>
          <div
            onClick={() => navigate("/cart")}
            id="cart-icon"
            className="flex flex-col items-center cursor-pointer text-[#efefef] hover:text-[#9a542c] relative"
          >
            <GrCart className="w-[30px] h-[30px]" />
            {quantityOfProducts > 0 && (
              <span className="text-red-500 bg-lime-50 w-[20px] h-[20px] rounded-full flex items-center justify-center absolute -top-2 right-0 text-[14px]">
                {quantityOfProducts}
              </span>
            )}
            <p className="text-[15px]">Giỏ hàng</p>
          </div>
        </div>
      </div>
      <Menu />
    </div>
  );
};

export default Header;
