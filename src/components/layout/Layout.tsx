import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu, ChevronRight, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const Layout: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 568);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 568;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${isMobile ? "fixed inset-0 z-40" : "w-64"} ${
          sidebarOpen ? "block" : "max-w-[3%]"
        }`}
      >
        {sidebarOpen ? (
          <Sidebar
            isMobile={isMobile}
            isOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        ) : (
          <button className="h-12 w-9 flex items-center justify-center bg-gray-800 text-white shadow-none border-none focus:outline-none">
            <ChevronRight size={24} onClick={() => setSidebarOpen(true)} />
          </button>
        )}
      </div>

      {/* Overlay para mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Conteúdo principal */}
      <div
        className={`flex-1 flex flex-col overflow-hidden ${
          isMobile ? "w-full" : "ml-1"
        }`}
      >
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="text-gray-600 focus:outline-none"
              >
                <Menu size={24} />
              </button>
            )}
            <h1 className="text-lg font-medium">Estoque</h1>
            <div className="flex items-center">
              <span className="text-sm text-gray-600">
                {user?.name || user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800 focus:outline-none"
                title="Sair"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Conteúdo da página */}
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
