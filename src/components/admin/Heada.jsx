import { useState, useRef, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { ChevronDown,LogOut } from "lucide-react";
import Logo from "@/assets/icons/Logo";

const Heada = ({ toggleMenu, activeItem, isMenuOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    console.log("Đăng xuất...");
    setIsDropdownOpen(false);
  };




  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-b from-[#ad7555] to-[#A0522D]">
      <div className="flex items-center space-x-4">
        <button
          data-menu-toggle
          onClick={toggleMenu}
          className="text-white hover:text-[#FFE4B5] transition-colors duration-200"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <FaTimes className="w-6 h-6" />
          ) : (
            <FaBars className="w-6 h-6" />
          )}
        </button>
        <h1 className="text-white text-xl font-bold">{activeItem}</h1>
      </div>

      <div className="flex items-center space-x-4 text-white">
        <Logo className="h-16 w-10" />
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 text-white hover:text-[#FFE4B5] transition-colors duration-200 focus:outline-none"
          >
            <span>Admin</span>
            <ChevronDown 
              className={`w-4 h-4 transform transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`} 
            />
          </button>

          {/* Dropdown Menu Items */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="py-2">
              
           
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Heada;