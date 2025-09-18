import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const SubSidebar = ({ type }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const cropsMenuItems = [
    { name: 'Crop Overview', path: '/crops', icon: 'Wheat' },
    { name: 'Add New Crop', path: '/crops/new', icon: 'Plus' },
    { name: 'Crop Calendar', path: '/crops/calendar', icon: 'Calendar' },
    { name: 'Harvest Reports', path: '/crops/harvest', icon: 'BarChart3' },
    { name: 'Crop Analytics', path: '/crops/analytics', icon: 'TrendingUp' },
  ];

  const tasksMenuItems = [
    { name: 'All Tasks', path: '/tasks', icon: 'CheckSquare' },
    { name: 'Create Task', path: '/tasks/new', icon: 'Plus' },
    { name: 'Task Calendar', path: '/tasks/calendar', icon: 'Calendar' },
    { name: 'Completed Tasks', path: '/tasks/completed', icon: 'CheckCircle' },
    { name: 'Task Reports', path: '/tasks/reports', icon: 'FileText' },
  ];

  const menuItems = type === 'crops' ? cropsMenuItems : tasksMenuItems;

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:left-64 bg-white border-r border-gray-200 z-40">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 capitalize">
            {type} Menu
          </h2>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`
                  group flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors
                  ${isActive 
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <ApperIcon 
                  name={item.icon} 
                  size={18} 
                  className={`mr-3 ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'}`} 
                />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default SubSidebar;