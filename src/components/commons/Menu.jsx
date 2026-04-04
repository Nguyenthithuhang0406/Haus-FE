/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { FaCaretDown, FaBars, FaShoppingCart, FaCaretUp } from "react-icons/fa";
import { IoHeart } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import { menuProjects } from "@/utils/contants/Menu";
import { removeAllCookies } from "@/utils/cookies";
import { clearAccessToken } from "@/utils/tokenMemory";
import { getAllCategory } from "@/api/category";
import axios from "axios";
import { toast } from "react-toastify";
import { isLoggedIn } from "@/utils/checkLogin";
import { useSelector, useDispatch } from "react-redux";
import { loadCartQuantity } from "@/store/orderSlice";

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [projectCategorys, setProjectCategorys] = useState(menuProjects);
  const [categories, setCategories] = useState([]);

  const [isLogin, setIsLogin] = useState(isLoggedIn());
  const [isShow, setIsShow] = useState(false);
  const [isShowMenuMb, setIsShowMenuMb] = useState(false);

  const childRef = useRef(null);
  const menuMbRef = useRef(null);

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

  useEffect(() => {
    function handleClickOutside(event) {
      if (childRef.current && !childRef.current.contains(event.target)) {
        setIsShow(false);
      }
      if (menuMbRef.current && !menuMbRef.current.contains(event.target)) {
        setIsShowMenuMb(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [childRef, menuMbRef]);

  const handleLogout = () => {
    removeAllCookies();
    clearAccessToken();
    setIsLogin(false);
    // Load số lượng giỏ hàng từ local cart sau khi đăng xuất
    dispatch(loadCartQuantity());
    toast.success("Đăng xuất thành công!");
    navigate("/");
  };

  const fetchCategories = async (data) => {
    try {
      const response = await getAllCategory(data);
      if (response.status === 200) {
        setCategories(response.data.items);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        switch (error.response.status) {
          case 500:
            toast.error("Lỗi hệ thống");
            break;
          case 429:
            toast.error(
              "Bạn gửi yêu cầu quá nhiều lần. Vui lòng đợi một chút rồi thử lại.",
            );
            break;

          default:
            toast.error("Đã xảy ra lỗi, vui lòng kiểm tra lại kết nối!");
        }
      }
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories({
      pageNum: 1,
      pageSize: 200,
    });
  }, []);

  const quantityOfProducts = useSelector((state) => state.order.quantityOfCart);

  return (
    <>
      {/* Menu desktop */}
      <div className="hidden lg:flex w-full items-center">
        <ul className="flex gap-5 items-center justify-center list-none">
          <li
            className={`relative text-[15px] ${
              location.pathname === "/" ? "text-[#9a542c]" : "text-[#efefef]"
            } hover:text-[#9a542c] cursor-pointer transition-all`}
          >
            <span onClick={() => navigate("/")} className="flex items-end">
              Trang chủ
            </span>
          </li>

          <li className="relative text-[15px] text-black cursor-pointer transition-all group">
            <span className="flex items-center text-[#efefef]  group-hover:text-[#9a542c]">
              Sản phẩm
              <FaCaretDown className="block text-[15px] group-hover:hidden" />
              <FaCaretUp className="hidden text-[15px] group-hover:block" />
            </span>
            <div className="hidden absolute top-full left-0 bg-white p-5 rounded shadow-lg z-10 group-hover:flex group-hover:flex-wrap gap-[20px] justify-between w-[900px]">
              {categories.map((category) => (
                <ul className="flex flex-col gap-[10px] list-none w-[200px]">
                  <li
                    key={category.id}
                    onClick={() =>
                      navigate(`/listProductByCategory/${category.id}`)
                    }
                    className="font-medium text-[15px] cursor-pointer hover:text-[#fd8f7c]"
                  >
                    {category.categoryName}
                  </li>
                  {category.subCategories &&
                    category.subCategories.length > 0 && (
                      <ul className="flex flex-col gap-[10px] list-none">
                        {category.subCategories.map((child) => (
                          <li
                            key={child.id}
                            onClick={() =>
                              navigate(`/listProductByCategory/${child.id}`)
                            }
                            className="text-[15px] cursor-pointer hover:text-[#fd8f7c]"
                          >
                            {child.categoryName}
                          </li>
                        ))}
                      </ul>
                    )}
                </ul>
              ))}
            </div>
          </li>

          <li className="relative text-[15px] text-black cursor-pointer transition-all group">
            <span className="flex items-center text-[#efefef] group-hover:text-[#9a542c]">
              Dự án
              <FaCaretDown className="block text-[15px] group-hover:hidden" />
              <FaCaretUp className="hidden text-[15px] group-hover:block" />
            </span>
            <div className="hidden absolute top-full left-0 bg-white p-5 rounded shadow-lg z-10 group-hover:flex justify-between w-[200px]">
              <ul className="flex flex-col gap-5 list-none">
                {projectCategorys.map((project) => (
                  <li
                    key={project.id}
                    className="text-[15px] cursor-pointer hover:text-[#fd8f7c]"
                  >
                    {project.name}
                  </li>
                ))}
              </ul>
            </div>
          </li>

          <li className="relative text-[15px] text-black cursor-pointer transition-all group">
            <span
              // onClick={() => navigate("/blog")}
              className="flex items-center text-[#efefef] group-hover:text-[#9a542c] cursor-pointer"
            >
              Tin tức
              <FaCaretDown className="block text-[15px] group-hover:hidden" />
              <FaCaretUp className="hidden text-[15px] group-hover:block" />
            </span>
            <div className="hidden absolute top-full left-0 bg-white p-5 rounded shadow-lg z-10 group-hover:flex justify-between w-[200px]">
              <ul className="flex flex-col gap-5 list-none">
                <li className="text-[15px] cursor-pointer hover:text-[#fd8f7c]">
                  Đội ngũ
                </li>
                <li className="text-[15px] cursor-pointer hover:text-[#fd8f7c]">
                  Chi tiết đội ngũ
                </li>
              </ul>
            </div>
          </li>
          <li>
            <span
              // onClick={() => navigate("/contact")}
              className="flex items-end text-[#efefef] hover:text-[#9a542c] cursor-pointer"
            >
              Ước tính chi phí
            </span>
          </li>
          <li>
            <span
              // onClick={() => navigate("/market-system")}
              className="flex items-end text-[#efefef] hover:text-[#9a542c] cursor-pointer"
            >
              Liên hệ
            </span>
          </li>
        </ul>
      </div>

      {/* Menu mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 z-[999] w-full bg-[#9a542c] shadow flex items-center justify-between px-20 py-2 sm:px-12 xs:px-5">
        <ul className="flex justify-between items-center w-full list-none">
          <li
            className="text-white text-center cursor-pointer"
            onClick={() => setIsShowMenuMb(!isShowMenuMb)}
          >
            <FaBars className="w-5 h-5 mx-auto" />
            <p className="text-[15px]">Menu</p>
          </li>
          {isShowMenuMb && (
            <div
              ref={menuMbRef}
              className="absolute bg-white shadow-lg rounded-lg py-4 flex flex-col gap-2 w-[150px] bottom-[60px]"
            >
              <p className="px-5 rounded-lg py-2 text-[15px] hover:bg-[#fdfbfb] hover:text-[#9a542c] cursor-pointer">
                Sản phẩm
              </p>
              <p className="px-5 rounded-lg py-2 text-[15px] hover:bg-[#fdfbfb] hover:text-[#9a542c] cursor-pointer">
                Dự án
              </p>
              <p className="px-5 rounded-lg py-2 text-[15px] hover:bg-[#fdfbfb] hover:text-[#9a542c] cursor-pointer">
                Tin tức
              </p>
              <p className="px-5 rounded-lg py-2 text-[15px] hover:bg-[#fdfbfb] hover:text-[#9a542c] cursor-pointer">
                Ước tính chi phí
              </p>
              <p className="px-5 rounded-lg py-2 text-[15px] hover:bg-[#fdfbfb] hover:text-[#9a542c] cursor-pointer">
                Liên hệ
              </p>
            </div>
          )}
          <li
            onClick={() => navigate("/wishlist")}
            className="text-white text-center cursor-pointer"
          >
            <IoHeart className="w-5 h-5 mx-auto" />
            <p className="text-[15px]">Yêu thích</p>
          </li>
          <li
            className="text-white text-center cursor-pointer"
            onClick={() => setIsShow(!isShow)}
          >
            <MdAccountCircle className="w-5 h-5 mx-auto" />
            <p className="text-[15px]">Tài khoản</p>
          </li>
          {isShow && !isLogin && (
            <div
              ref={childRef}
              className="absolute bottom-[60px] right-[25%] bg-white shadow-lg rounded-lg flex flex-col gap-2 py-2"
            >
              <p
                className="px-5 rounded-lg py-2 text-[15px] hover:bg-[#fdfbfb] hover:text-[#9a542c] cursor-pointer"
                onClick={() => navigate("/auth")}
              >
                Đăng ký
              </p>
              <p
                className="px-5 rounded-lg py-2 text-[15px] hover:bg-[#fdfbfb] hover:text-[#9a542c] cursor-pointer"
                onClick={() => navigate("/auth")}
              >
                Đăng nhập
              </p>
            </div>
          )}
          {isShow && isLogin && (
            <div
              ref={childRef}
              className="absolute bottom-[60px] right-[25%] bg-white shadow-lg rounded-lgflex flex-col gap-2 py-2"
            >
              <p
                className="px-5 rounded-lg py-2 text-[15px] hover:bg-[#fdfbfb] hover:text-[#9a542c] cursor-pointer"
                onClick={() => navigate("/view-infor")}
              >
                Trang cá nhân
              </p>
              <p
                className="px-5 rounded-lg py-2 text-[15px] hover:bg-[#fdfbfb] hover:text-[#9a542c] cursor-pointer"
                onClick={handleLogout}
              >
                Đăng xuất
              </p>
            </div>
          )}
          <li
            onClick={() => navigate("/cart")}
            className="text-white text-center cursor-pointer relative"
          >
            <FaShoppingCart className="w-5 h-5 mx-auto" />
            {quantityOfProducts > 0 && (
              <span className="text-red-500 bg-lime-50 w-[20px] h-[20px] rounded-full flex items-center justify-center absolute -top-2 right-0 text-[14px]">
                {quantityOfProducts}
              </span>
            )}
            <p className="text-[15px]">Giỏ hàng</p>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Menu;
