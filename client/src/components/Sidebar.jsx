import React from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Home, Video } from "lucide-react";
import logo from "../assets/images/praise sawa  (1).svg";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const [activeLink, setActiveLink] = React.useState("home");
  const navigate = useNavigate();

  const handleActiveLink = (link) => {
    setActiveLink(link);
    navigate(link);

    // Close sidebar automatically on mobile and medium screens
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "support", icon: Video, label: "Tutorials" },
  ];

  return (
    <>
      {/* Overlay for mobile and medium screens */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-20 animate-in fade-in duration-700"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className="relative flex">
        <div
          className={`
            fixed top-0 left-0 h-full z-30
            bg-[#a5a5a5] flex flex-col justify-between
            shadow-lg
            transform transition-all duration-700 ease-in-out
            animate-in slide-in-from-left
            ${
              isSidebarOpen
                ? "translate-x-0 w-64"
                : "-translate-x-full lg:translate-x-0 lg:w-16"
            }
          `}
        >
        {/* Logo */}
        <div className={`${isSidebarOpen ? "p-3" : "p-2"} transition-all duration-500`}>
            <div
              className={`
              bg-white rounded-lg
              ${isSidebarOpen ? "w-full" : "w-12 h-12"}
              transition-all duration-500 cursor-pointer
              hover:scale-105 hover:shadow-md hover:brightness-105
              group
            `}
              onClick={() => navigate("/")}
            >
              <img
                src={logo}
                alt="logo"
                className="transition-all duration-300 group-hover:rotate-2"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-4 flex-1 mt-6">
            {navItems.map(({ id, icon: Icon, label }) => (
              <div
                key={id}
                className={`
                  flex items-center p-3 mx-3 rounded-xl cursor-pointer
                  group transition-all duration-500 hover:scale-105 hover:bg-[#D9D9D9]/70
                  ${
                    activeLink === id
                      ? "bg-[#D9D9D9] text-gray-900 shadow-lg"
                      : "border border-[#D9D9D9]/30"
                  }
                `}
                onClick={() => handleActiveLink(id)}
              >
                <Icon
                  className="w-6 h-6 text-gray-700 transition-transform duration-500 group-hover:rotate-12"
                />
                {isSidebarOpen && (
                  <span className="ml-2 text-sm font-medium group-hover:text-gray-900 animate-in fade-in duration-700">
                    {label}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-3 text-xs text-center">
            <div className="border-t border-[#D9D9D9]/30 pt-3" />
            {isSidebarOpen && (
              <p className="opacity-70 transition-opacity duration-700 hover:opacity-100 animate-in fade-in">
                © 2024 Praise Sawa
              </p>
            )}
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={`
            fixed z-40 p-2 bg-[#a5a5a5] shadow-lg rounded-full
            hover:bg-[#b3b3b3] transition-all duration-500
            ${
              isSidebarOpen
                ? "lg:left-64 left-64 top-4 rotate-180"
                : "lg:left-16 left-4 top-4"
            }
          `}
        >
          {isSidebarOpen ? (
            <X className="w-6 h-6 transition-transform duration-500" />
          ) : (
            <Menu className="w-6 h-6 transition-transform duration-500" />
          )}
        </button>
      </div>
    </>
  );
};

export default Sidebar;