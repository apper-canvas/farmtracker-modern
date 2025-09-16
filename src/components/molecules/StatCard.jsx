import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = "primary",
  subtitle 
}) => {
  const colorClasses = {
    primary: {
      bg: "from-primary-50 to-primary-100",
      border: "border-primary-200",
      icon: "text-primary-600",
      iconBg: "from-primary-500 to-primary-700"
    },
    secondary: {
      bg: "from-secondary-50 to-secondary-100",
      border: "border-secondary-200",
      icon: "text-secondary-600",
      iconBg: "from-secondary-500 to-secondary-700"
    },
    accent: {
      bg: "from-accent-50 to-accent-100",
      border: "border-accent-200",
      icon: "text-accent-600",
      iconBg: "from-accent-500 to-accent-700"
    },
    success: {
      bg: "from-green-50 to-green-100",
      border: "border-green-200",
      icon: "text-green-600",
      iconBg: "from-green-500 to-green-700"
    }
  };

  const classes = colorClasses[color] || colorClasses.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`bg-gradient-to-br ${classes.bg} ${classes.border} hover:shadow-xl transition-all duration-300`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">
            {title}
          </CardTitle>
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${classes.iconBg} flex items-center justify-center shadow-md`}>
            <ApperIcon name={icon} className="w-5 h-5 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {value}
            </div>
            
            {subtitle && (
              <p className="text-xs text-gray-600">{subtitle}</p>
            )}
            
            {trend && trendValue && (
              <div className="flex items-center gap-1">
                <ApperIcon 
                  name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                  className={`w-4 h-4 ${trend === "up" ? "text-green-600" : "text-red-600"}`} 
                />
                <span className={`text-xs font-medium ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {trendValue}
                </span>
                <span className="text-xs text-gray-500">from last month</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;