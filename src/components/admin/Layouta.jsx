// File: components/admin/layout/Layouta.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import Heada from "./Heada";
import Menua from "./Menua";
import { Outlet, useLocation } from "react-router-dom";

const Layouta = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true); // Mặc định MỞ
  const [activeItem, setActiveItem] = useState("Thống kê");
  const menuRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const toggleRef = useRef(false);
  const location = useLocation();

  // Menu items mapping để lấy tên từ path
  const menuItemsMap = {
    "/admin/dashboard": "Thống kê",
    "/admin/managerCategory": "Quản lý danh mục",
    "/admin/managerProduct": "Quản lý sản phẩm",
    "/admin/managerOrder": "Quản lý đơn hàng",
    "/admin/managerPromotion": "Quản lý khuyến mãi",
  };

  // Cập nhật activeItem khi route thay đổi
  useEffect(() => {
    const currentPath = location.pathname;
    const newActiveItem = menuItemsMap[currentPath] || "Thống kê";
    setActiveItem(newActiveItem);
  }, [location.pathname]);

  // Check if screen is mobile size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Đóng menu khi resize về mobile
      if (mobile) {
        setIsMenuOpen(false);
      } else {
        // Mở menu khi resize về desktop
        setIsMenuOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle click outside to close menu - CHỈ trên mobile
  useEffect(() => {
    function handleClickOutside(event) {
      // Chỉ áp dụng cho mobile
      if (!isMobile) return;

      // Skip if this was triggered by toggle button
      if (toggleRef.current) {
        toggleRef.current = false;
        return;
      }

      // Chỉ đóng menu nếu click bên ngoài và không phải click vào menu toggle
      const isToggleButton = event.target.closest('[data-menu-toggle]');
      if (isToggleButton) {
        return;
      }

      if (menuRef.current && !menuRef.current.contains(event.target) && isMenuOpen) {
        setIsMenuOpen(false);
      }
    }

    // Only add listener if menu is open and on mobile
    if (isMenuOpen && isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isMenuOpen, isMobile]);

  const toggleMenu = useCallback(() => {
    toggleRef.current = true;
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleMenuItemClick = (item) => {
    setActiveItem(item);
    // Chỉ đóng menu trên mobile sau khi chọn item
    if (isMobile) {
      setIsMenuOpen(false);
    }
    // Trên desktop - KHÔNG đóng menu
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Heada toggleMenu={toggleMenu} activeItem={activeItem} isMenuOpen={isMenuOpen} />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Overlay for mobile ONLY */}
        {isMenuOpen && isMobile && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          ref={menuRef}
          className={`
            ${isMobile
              ? `fixed top-0 left-0 h-screen z-50 
                 transition-transform duration-300 ease-in-out
                 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`
              : 'relative'
            }
          `}
        >
          <Menua
            isMenuOpen={isMenuOpen}
            activeItem={activeItem}
            handleMenuItemClick={handleMenuItemClick}
            isMobile={isMobile}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default Layouta;