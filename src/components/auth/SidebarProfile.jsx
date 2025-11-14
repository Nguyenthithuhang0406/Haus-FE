import React from 'react'
import { Link, useLocation } from 'react-router-dom';

const SidebarProfile = () => {
  const location = useLocation();
  return (
    <div className="pl-[2%] pt-[2%] lg:w-1/5 ">
      <div className="p-1 border-b-2 lg:border-b-0 lg:border-r-2">
        <nav className="space-y-2">
          <Link
            to="/view-infor"
            className={`block w-full text-left py-3 px-4 rounded ${
              location.pathname === "/view-infor"
                ? "text-[#ad7555] bg-[#ad7555]/10 border-[#ad7555]"
                : "text-gray-700 hover:bg-gray-100"
            } font-medium border-l-4`}
          >
            Thông tin tài khoản
          </Link>
          <Link
            to="/order-infor"
            className={`block w-full text-left py-3 px-4 rounded ${
              location.pathname === "/order-infor"
                ? "text-[#ad7555] bg-[#ad7555]/10 border-[#ad7555]"
                : "text-gray-700 hover:bg-gray-100"
            } font-medium border-l-4`}
          >
            Đơn hàng của bạn
          </Link>
          <Link
            to="/change-password"
            className={`block w-full text-left py-3 px-4 rounded ${
              location.pathname === "/change-password"
                ? "text-[#ad7555] bg-[#ad7555]/10 border-[#ad7555]"
                : "text-gray-700 hover:bg-gray-100"
            } font-medium border-l-4`}
          >
            Đổi mật khẩu
          </Link>
          <Link
            to="#"
            className={`block w-full text-left py-3 px-4 rounded ${
              location.pathname === ""
                ? "text-[#ad7555] bg-[#ad7555]/10 border-[#ad7555]"
                : "text-gray-700 hover:bg-gray-100"
            } font-medium border-l-4`}
          >
            Sổ địa chỉ (0)
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default SidebarProfile
