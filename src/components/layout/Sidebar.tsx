import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { menuConfig } from "../../config/formFields";
import {
  Package,
  ShoppingCart,
  Calendar,
  ChevronDown,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

interface SidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "package":
      return <Package />;
    case "shopping-cart":
      return <ShoppingCart />;
    case "calendar":
      return <Calendar />;
    default:
      return <Package />;
  }
};

export const Sidebar: React.FC<SidebarProps> = ({
  isMobile,
  isOpen,
  toggleSidebar,
}) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(["estoque"]); // Inicialmente expande o menu de estoque

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isMenuActive = (id: string) => {
    return location.pathname.includes(`/${id}`);
  };

  if (!isOpen && isMobile) {
    return null;
  }

  return (
    <div
      className={`bg-gray-800 text-white ${
        isMobile ? "fixed inset-0 z-50" : "min-h-screen"
      } transition-all duration-300`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">Estoque Inteligente</h1>
          <button
            onClick={toggleSidebar}
            className="text-white focus:outline-none"
          >
            {isOpen && <ChevronLeft size={20} />}
          </button>
        </div>

        {isMobile && (
          <button onClick={toggleSidebar} className="text-white">
            <X size={24} />
          </button>
        )}
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuConfig.map((item) => (
            <li key={item.id} className="mb-2">
              <div
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                  isMenuActive(item.id) ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
                onClick={() => toggleExpand(item.id)}
              >
                <div className="flex items-center">
                  <span className="mr-2">{getIcon(item.icon)}</span>
                  <span>{item.title}</span>
                </div>
                {expandedItems.includes(item.id) ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
              </div>

              {expandedItems.includes(item.id) && item.subPages && (
                <ul className="pl-6 mt-2 space-y-1">
                  {item.subPages.map((subPage) => (
                    <li key={subPage.id}>
                      <Link
                        to={subPage.path}
                        className={`block p-2 rounded-md ${
                          isActive(subPage.path)
                            ? "bg-primary text-white"
                            : "hover:bg-gray-700"
                        }`}
                        onClick={isMobile ? toggleSidebar : undefined}
                      >
                        {subPage.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="fixed bottom-1 left-3 w-full  p-2 ">
        <div className="flex">
          <p>Montadora: ? </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
