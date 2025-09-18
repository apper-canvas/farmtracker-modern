import React, { useState } from "react";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";

const Layout = ({ children, title, subSidebar }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

return (
    <div className="min-h-screen bg-gray-50">
      <div className={subSidebar ? "lg:pl-64" : "lg:pl-0"}>
        {subSidebar}
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />
        
<main className="px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;