import React, { useState, useRef, useEffect, useCallback } from "react";
import Heada from "./Heada";
import Menua from "./Menua";

const Layouta = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("Thống kê");
  const menuRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const toggleRef = useRef(false);

  // Check if screen is mobile size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto close menu on mobile when screen loads
      if (window.innerWidth < 768) {
        setIsMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle click outside to close menu
  useEffect(() => {
    function handleClickOutside(event) {
      // Skip if this was triggered by toggle button
      if (toggleRef.current) {
        toggleRef.current = false;
        return;
      }

      if (menuRef.current && !menuRef.current.contains(event.target) && isMenuOpen) {
        setIsMenuOpen(false);
      }
    }

    // Only add listener if menu is open
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isMenuOpen]);

  const toggleMenu = useCallback(() => {
    toggleRef.current = true; // Mark that toggle was clicked
    
    if (isMenuOpen) {
      // Nếu menu đang mở, click X sẽ đóng menu
      setIsMenuOpen(false);
    } else {
      // Nếu menu đang đóng, click burger sẽ mở menu
      setIsMenuOpen(true);
    }
  }, [isMenuOpen]);
  
  const handleMenuItemClick = (item) => {
    setActiveItem(item);
    // Auto close menu on mobile after selecting item
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Heada toggleMenu={toggleMenu} activeItem={activeItem} isMenuOpen={isMenuOpen} />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Overlay for mobile */}
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
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layouta;