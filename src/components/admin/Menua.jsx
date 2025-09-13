import { Link } from "react-router-dom";
import { MdDashboard, MdManageAccounts, MdInventory, MdShoppingCart } from "react-icons/md";

const Menua = ({ isMenuOpen, activeItem, handleMenuItemClick, isMobile }) => {
  const menuItems = [
    {
      id: "thong-ke",
      name: "Thống kê",
      icon: <MdDashboard className="w-5 h-5" />,

    },
    {
      id: "quan-ly-danh-muc",
      name: "Quản lý danh mục",
      icon: <MdManageAccounts className="w-5 h-5" />,
      path: "/admin/managerCategory"
    },
    {
      id: "quan-ly-san-pham",
      name: "Quản lý sản phẩm",
      icon: <MdInventory className="w-5 h-5" />,
      path: "/admin/managerProduct"
    },
    {
      id: "quan-ly-don-hang",
      name: "Quản lý đơn hàng",
      icon: <MdShoppingCart className="w-5 h-5" />
    },
    {
      id: "quan-ly-khuyen-mai",
      name: "Quản lý khuyến mãi",
      icon: <MdShoppingCart className="w-5 h-5" />,
      path: "/promotion"
    },
  ];

  return (
    <div
      className={`
        bg-gradient-to-b from-[#A0522D] to-[#bb8c74] shadow-lg
        ${isMobile
          ? 'w-64 h-screen' // Full screen height on mobile
          : `transition-all duration-300 ease-in-out 
             ${isMenuOpen ? "w-64 opacity-100" : "w-0 opacity-0"} 
             overflow-hidden h-full`
        }
      `}
    >
      {/* Menu Content */}
      <div className="h-full flex flex-col">
        {/* Menu Header - Only show on mobile */}
        {isMobile && (
          <div className="p-6 border-b border-[#8B4513]/20">
            <div className="flex items-center justify-center">
              <h2 className="text-white text-lg font-semibold">Menu</h2>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="p-4 flex-1">
          <ul className="space-y-3">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.path || "#"}
                  onClick={() => handleMenuItemClick(item.name)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                    text-left transition-all duration-200 font-medium border border-[#ad7555]
                    ${activeItem === item.name
                      ? 'bg-white text-[#ad7555] shadow-md transform scale-105'
                      : 'bg-[#d0875f]/50 text-white hover:bg-white hover:text-[#ad7555]'
                    }
                    hover:shadow-md hover:transform hover:scale-105
                  `}
                >
                  {item.icon}
                  <span className="font-medium whitespace-nowrap">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Menu Footer */}
        <div className="p-4">
          <div className="bg-[#ad7555]/30 rounded-lg p-3 text-center">
            <p className="text-white text-sm opacity-80">
              © Haus
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menua;