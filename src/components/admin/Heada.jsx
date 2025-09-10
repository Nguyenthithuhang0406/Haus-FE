import { FaBars, FaTimes } from "react-icons/fa";
import Logo from "@/assets/icons/Logo";

const Heada = ({ toggleMenu, activeItem, isMenuOpen }) => {
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
        <button className="flex bg-[#ad7555] text-white">Admin</button>
        <i className="fa-solid fa-caret-down"></i>
      </div>
    </div>
  );
};

export default Heada;