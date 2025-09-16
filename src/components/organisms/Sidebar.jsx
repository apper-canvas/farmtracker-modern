import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Navigation from "@/components/molecules/Navigation";

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
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className={`lg:hidden ${isOpen ? "fixed inset-0 z-40" : "hidden"}`}>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        
        {/* Sidebar */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: isOpen ? "0%" : "-100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          className="relative flex flex-col w-64 bg-white shadow-xl h-full"
        >
          <div className="flex items-center justify-between flex-shrink-0 px-4 py-4 border-b border-gray-200">
            <div className="flex items-center">
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
            <button
              onClick={onClose}
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="X" className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          
          <div className="flex-1 flex flex-col overflow-y-auto">
            <div className="px-3 py-4">
              <Navigation isMobile={true} onItemClick={onClose} />
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Sidebar;