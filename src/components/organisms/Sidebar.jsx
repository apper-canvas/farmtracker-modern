import React, { useContext } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/ApperIcon";
import Navigation from "@/components/molecules/Navigation";

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);

  return (
    <button 
      onClick={logout}
      className="p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
      title="Logout"
    >
      <ApperIcon name="LogOut" className="w-4 h-4" />
    </button>
  );
};
const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-md">
              <ApperIcon name="Sprout" className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                FarmTracker
              </h1>
              <p className="text-sm text-gray-500">Agriculture Management</p>
            </div>
          </div>
<div className="flex-1 flex flex-col">
            <div className="px-3">
              <Navigation />
            </div>
          </div>
          
          {/* Profile Section */}
          <div className="border-t border-gray-200 px-3 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <ApperIcon name="User" className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  John Smith
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Farm Manager
                </p>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Mobile sidebar */}
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="lg:hidden fixed left-0 top-0 w-64 h-full bg-white border-r border-gray-200 shadow-xl z-50"
      >
<div className="flex flex-col h-full">
          <div className="flex items-center flex-shrink-0 px-4 pt-5 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-md">
              <ApperIcon name="Sprout" className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                FarmTracker
              </h1>
              <p className="text-sm text-gray-500">Agriculture Management</p>
            </div>
          </div>
          
          <div className="flex-1 px-3">
            <Navigation />
          </div>
          
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <ApperIcon name="User" className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  John Smith
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Farm Manager
                </p>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;