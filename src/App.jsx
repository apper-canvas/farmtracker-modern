import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SubSidebar from "@/components/organisms/SubSidebar";
import { ToastContainer } from "react-toastify";
import FarmerDetails from "@/components/pages/FarmerDetails";
import Farmers from "@/components/pages/Farmers";
import Farms from "@/components/pages/Farms";
import Tasks from "@/components/pages/Tasks";
import Weather from "@/components/pages/Weather";
import Finances from "@/components/pages/Finances";
import Dashboard from "@/components/pages/Dashboard";
import Crops from "@/components/pages/Crops";
import Settings from "@/components/pages/Settings";
import Layout from "@/components/organisms/Layout";

// Pages
// Pages
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
<Route path="/" element={<Layout title="Dashboard"><Dashboard /></Layout>} />
          <Route path="/farmers" element={<Layout title="Farmers"><Farmers /></Layout>} />
<Route path="/farms" element={<Layout title="Farms"><Farms /></Layout>} />
<Route path="/crops" element={<Layout title="Crops" subSidebar={<SubSidebar type="crops" />}><Crops /></Layout>} />
          <Route path="/tasks" element={<Layout title="Tasks" subSidebar={<SubSidebar type="tasks" />}><Tasks /></Layout>} />
          <Route path="/weather" element={<Layout title="Weather"><Weather /></Layout>} />
          <Route path="/finances" element={<Layout title="Finances"><Finances /></Layout>} />
          <Route path="/farmers/:id" element={<Layout title="Farmer Details"><FarmerDetails /></Layout>} />
          <Route path="/settings" element={<Layout title="Settings"><Settings /></Layout>} />
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="toast-container"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;