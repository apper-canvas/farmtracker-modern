import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Navigation = ({ isMobile = false, onItemClick }) => {
  const navigationItems = [
{
      label: "Dashboard",
      path: "/",
      icon: "LayoutDashboard",
      color: "text-primary-600"
    },
    {
      label: "Farms",
      path: "/farms",
      icon: "Tractor",
      color: "text-primary-600"
    },
    {
      label: "Crops",
      path: "/crops",
      icon: "Sprout",
      color: "text-secondary-600"
    },
    {
      label: "Tasks",
      path: "/tasks",
      icon: "CheckSquare",
      color: "text-accent-600"
    },
    {
      label: "Weather",
      path: "/weather",
      icon: "Cloud",
      color: "text-blue-600"
    },
    {
      label: "Finances",
      path: "/finances",
      icon: "DollarSign",
      color: "text-green-600"
    },
    {
      label: "Settings",
      path: "/settings",
      icon: "Settings",
      color: "text-gray-600"
    }
  ];

  const handleItemClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  return (
    <nav className="space-y-1">
      {navigationItems.map((item, index) => (
        <motion.div
          key={item.path}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <NavLink
            to={item.path}
            onClick={handleItemClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md transform scale-105"
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 hover:text-gray-900"
              } ${isMobile ? "py-3" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <ApperIcon
                  name={item.icon}
                  className={`w-5 h-5 ${isActive ? "text-white" : item.color}`}
                />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        </motion.div>
      ))}
    </nav>
  );
};

export default Navigation;