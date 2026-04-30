import React from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiSearch, FiPlayCircle, FiFolder, FiUsers } from "react-icons/fi";

import { motion } from "framer-motion";

const navItems = () => [
  { to: "/", icon: FiHome, text: "Home" },
  { to: "/search-video", icon: FiSearch, text: "Discover" },
  { to: "/video-lists", icon: FiPlayCircle, text: "Videos" },
  { to: "/my-library", icon: FiFolder, text: "Library" },
  { to: "/creators", icon: FiUsers, text: "Channels" },
  
];

function SideNavbar({ isSidebarOpen }) {
  return (
    <>
      {/* Sidebar for Desktop */}
      <div
        className={`hidden h-[calc(100vh-4rem)] lg:block fixed top-16 left-0 bg-black/95 backdrop-blur-xl text-gray-100 border-r border-zinc-800 transition-all duration-300 ease-in-out z-40 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="p-4 flex flex-col h-full">
          <nav className="mt-4 flex-1 flex flex-col space-y-2">
            {navItems().map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-2xl hover:bg-zinc-900 hover:text-white transition-all duration-300 group relative focus:ring-2 focus:ring-zinc-600 focus:outline-none ${
                    isActive
                      ? "bg-zinc-900 text-white border border-zinc-700"
                      : "text-gray-300"
                  } ${isSidebarOpen ? "justify-start" : "justify-center"}`
                }
              >
                {/* Icon */}
                <item.icon className="text-xl" />

                {/* Label when sidebar is expanded */}
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm"
                  >
                    {item.text}
                  </motion.span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom Navbar for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl text-gray-100 z-50 shadow-lg border-t border-zinc-800">
        <nav className="flex justify-around items-center p-2">
          {navItems().map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center p-2 rounded-2xl hover:bg-zinc-900 hover:text-white transition-all duration-300 focus:ring-2 focus:ring-zinc-600 focus:outline-none ${
                  isActive ? "text-white bg-zinc-900 border border-zinc-700" : "text-gray-300"
                }`
              }
            >
              <item.icon className="text-xl" />
              <span className="text-xs">{item.text}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
}

export default SideNavbar;
