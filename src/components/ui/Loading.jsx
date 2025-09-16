import React from "react";
import { motion } from "framer-motion";

const Loading = ({ type = "dashboard" }) => {
  const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="animate-pulse">
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2 mb-4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );

  const SkeletonTable = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/4"></div>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-6 animate-pulse">
            <div className="flex justify-between items-center">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (type === "table") {
    return <SkeletonTable />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonTable />
        <SkeletonCard />
      </div>
    </motion.div>
  );
};

export default Loading;